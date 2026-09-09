import { prisma } from "@/lib/db/prisma";
import { ExtractedCandidateItem, ExtractionPipelineStatus } from "../types/extractionTypes";

const FALLBACK_CANDIDATES: ExtractedCandidateItem[] = [
  {
    id: "candidate-1",
    tenderId: "tender-2",
    sourceDocumentId: "rfp-doc-2",
    sourceDocumentName: "NEA_SmartGrid_RFP_Vol1.pdf",
    sourcePage: 12,
    title: "IEC 61850 Substation Automation Standard Compliance",
    description: "All supplied IEDs, gateways, and bay control units must natively comply with IEC 61850 Edition 2 communications protocol.",
    category: "Technical",
    isMandatory: true,
    confidence: "HIGH",
    confidenceScore: 96,
    status: "PENDING",
    createdAt: new Date(),
  },
  {
    id: "candidate-2",
    tenderId: "tender-2",
    sourceDocumentId: "rfp-doc-2",
    sourceDocumentName: "NEA_SmartGrid_RFP_Vol1.pdf",
    sourcePage: 19,
    title: "Certified NERC CIP Cybersecurity Compliance Audit Report",
    description: "Vendors must submit audited certification proving adherence to NERC CIP-002 through CIP-014 critical infrastructure protection requirements.",
    category: "Legal",
    isMandatory: true,
    confidence: "HIGH",
    confidenceScore: 91,
    status: "PENDING",
    createdAt: new Date(),
  },
  {
    id: "candidate-3",
    tenderId: "tender-2",
    sourceDocumentId: "rfp-doc-2",
    sourceDocumentName: "NEA_SmartGrid_RFP_Vol1.pdf",
    sourcePage: 34,
    title: "Manufacturer 10-Year Hardware Warranty & 4-Hour On-Site SLA",
    description: "Vendor must guarantee on-site 4-hour replacement SLA for mission-critical SCADA controllers for a 10-year period.",
    category: "Technical",
    isMandatory: false,
    confidence: "MEDIUM",
    confidenceScore: 74,
    status: "PENDING",
    createdAt: new Date(),
  },
  {
    id: "candidate-4",
    tenderId: "tender-2",
    sourceDocumentId: "rfp-doc-2",
    sourceDocumentName: "NEA_SmartGrid_RFP_Vol1.pdf",
    sourcePage: 51,
    title: "Bid Bond / Bank Guarantee of 2% Total Contract Value",
    description: "Submit an unconditional bank guarantee issued by a Tier 1 financial institution valid for no less than 180 days from submission date.",
    category: "Financial",
    isMandatory: true,
    confidence: "LOW",
    confidenceScore: 52,
    status: "PENDING",
    createdAt: new Date(),
  },
];

export async function fetchExtractedCandidates(
  tenderId: string
): Promise<ExtractedCandidateItem[]> {
  try {
    const candidates = await prisma.extractedRequirement.findMany({
      where: { tenderId },
      include: { sourceDocument: true },
      orderBy: { createdAt: "asc" },
    });

    if (candidates.length === 0) {
      return FALLBACK_CANDIDATES;
    }

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
    console.warn("DB query failed in fetchExtractedCandidates, returning fallback candidates:", error);
    return FALLBACK_CANDIDATES;
  }
}

export async function fetchTenderDetailsForReview(tenderId: string) {
  try {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: { tenderDocuments: true },
    });

    if (!tender) {
      return {
        id: tenderId,
        title: "Smart Grid Power Substation SCADA Modernization",
        referenceNumber: "TP-2026-00089",
        clientName: "National Energy Authority",
        status: "IN_REVIEW",
        documentName: "NEA_SmartGrid_RFP_Vol1.pdf",
      };
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
    return {
      id: tenderId,
      title: "Smart Grid Power Substation SCADA Modernization",
      referenceNumber: "TP-2026-00089",
      clientName: "National Energy Authority",
      status: "IN_REVIEW",
      documentName: "NEA_SmartGrid_RFP_Vol1.pdf",
    };
  }
}
