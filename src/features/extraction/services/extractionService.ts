import { prisma } from "@/lib/db/prisma";
import { ExtractedCandidateItem, ExtractionPipelineStatus } from "../types/extractionTypes";

export async function fetchExtractedCandidates(
  tenderId: string
): Promise<ExtractedCandidateItem[]> {
  try {
    const candidates = await prisma.extractedRequirement.findMany({
      where: { tenderId },
      include: { sourceDocument: true },
      orderBy: { createdAt: "asc" },
    });

    return candidates.map((c) => {
      const payload = (c.rawPayload as any) || {};
      return {
        id: c.id,
        tenderId: c.tenderId,
        sourceDocumentId: c.sourceDocumentId,
        sourceDocumentName: c.sourceDocument?.fileName || "RFP_Specification.pdf",
        sourcePage: c.sourcePage || payload.sourcePage || 1,
        title: payload.title || "Extracted Clause Requirement",
        description: payload.description || "",
        category: payload.category || "Technical",
        isMandatory: payload.mandatory ?? true,
        confidence: payload.confidence || "HIGH",
        confidenceScore: payload.confidence === "HIGH" ? 94 : payload.confidence === "MEDIUM" ? 76 : 52,
        status: c.status as ExtractedCandidateItem["status"],
        createdAt: c.createdAt,
      };
    });
  } catch (error) {
    console.error("DB query failed in fetchExtractedCandidates:", error);
    return [];
  }
}

export async function fetchTenderDetailsForReview(tenderId: string) {
  try {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: { tenderDocuments: true },
    });

    if (!tender) {
      return null;
    }

    return {
      id: tender.id,
      title: tender.title,
      referenceNumber: tender.referenceNumber,
      clientName: tender.clientName,
      status: tender.status,
      documentName: tender.tenderDocuments[0]?.fileName || "RFP_Master_Doc.pdf",
    };
  } catch (error) {
    console.error("DB query failed in fetchTenderDetailsForReview:", error);
    return null;
  }
}
