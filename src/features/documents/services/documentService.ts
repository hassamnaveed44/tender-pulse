import { prisma } from "@/lib/db/prisma";
import { DocumentItem, ExpiryStatus } from "../types/documentTypes";

export async function fetchDocumentsList(
  query?: string,
  typeFilter?: string
): Promise<DocumentItem[]> {
  try {
    const docs = await prisma.document.findMany({
      include: {
        uploader: true,
        evidenceLinks: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (docs.length === 0) {
      return [];
    }

    const now = new Date();

    const formatted: DocumentItem[] = docs.map((d) => {
      let daysToExpiry: number | null = null;
      let expiryStatus: ExpiryStatus = "NO_EXPIRY";

      if (d.expiryDate) {
        const exp = new Date(d.expiryDate);
        const diffMs = exp.getTime() - now.getTime();
        daysToExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (daysToExpiry < 0) {
          expiryStatus = "EXPIRED";
        } else if (daysToExpiry <= 30) {
          expiryStatus = "EXPIRING_SOON";
        } else {
          expiryStatus = "VALID";
        }
      }

      return {
        id: d.id,
        fileName: d.fileName,
        fileType: d.fileType,
        storageKey: d.storageKey,
        expiryDate: d.expiryDate ? new Date(d.expiryDate) : null,
        daysToExpiry,
        expiryStatus,
        uploadedBy: {
          id: d.uploader.id,
          fullName: d.uploader.fullName,
          email: d.uploader.email,
        },
        linkedRequirementsCount: d.evidenceLinks.length,
        createdAt: new Date(d.createdAt),
      };
    });

    return filterDocuments(formatted, query, typeFilter);
  } catch (error) {
    console.error("DB query failed in fetchDocumentsList:", error);
    return [];
  }
}

function filterDocuments(
  docs: DocumentItem[],
  query?: string,
  typeFilter?: string
): DocumentItem[] {
  return docs.filter((d) => {
    const q = (query || "").toLowerCase();
    const matchesQuery =
      !q ||
      d.fileName.toLowerCase().includes(q) ||
      (d.fileType && d.fileType.toLowerCase().includes(q));

    const matchesType =
      !typeFilter || typeFilter === "ALL" || d.fileType === typeFilter;

    return matchesQuery && matchesType;
  });
}
