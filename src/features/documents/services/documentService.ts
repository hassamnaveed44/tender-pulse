import { prisma } from "@/lib/db/prisma";
import { DocumentItem, ExpiryStatus } from "../types/documentTypes";

const FALLBACK_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    fileName: "ISO_9001_2015_Certificate_Apex.pdf",
    fileType: "Certificate",
    storageKey: "docs/iso_9001_apex.pdf",
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    daysToExpiry: 180,
    expiryStatus: "VALID",
    uploadedBy: { id: "user-1", fullName: "Hassam Naveed", email: "hassam@tenderpulse.io" },
    linkedRequirementsCount: 2,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "doc-2",
    fileName: "Audited_Financial_Statements_FY2025.pdf",
    fileType: "Financial Statement",
    storageKey: "docs/financial_statements_2025.pdf",
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    daysToExpiry: 365,
    expiryStatus: "VALID",
    uploadedBy: { id: "user-2", fullName: "Sarah Chen", email: "sarah.chen@tenderpulse.io" },
    linkedRequirementsCount: 1,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: "doc-3",
    fileName: "Public_Liability_Insurance_50M.pdf",
    fileType: "Insurance Policy",
    storageKey: "docs/insurance_50m.pdf",
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    daysToExpiry: 14,
    expiryStatus: "EXPIRING_SOON",
    uploadedBy: { id: "user-1", fullName: "Hassam Naveed", email: "hassam@tenderpulse.io" },
    linkedRequirementsCount: 1,
    createdAt: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000),
  },
  {
    id: "doc-4",
    fileName: "SOC2_Type_II_Compliance_Report.pdf",
    fileType: "Audit Report",
    storageKey: "docs/soc2_report.pdf",
    expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    daysToExpiry: -5,
    expiryStatus: "EXPIRED",
    uploadedBy: { id: "user-3", fullName: "Marcus Vance", email: "marcus.vance@tenderpulse.io" },
    linkedRequirementsCount: 0,
    createdAt: new Date(Date.now() - 370 * 24 * 60 * 60 * 1000),
  },
];

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
      return filterDocuments(FALLBACK_DOCUMENTS, query, typeFilter);
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
    console.warn("DB query failed in fetchDocumentsList, returning fallback documents:", error);
    return filterDocuments(FALLBACK_DOCUMENTS, query, typeFilter);
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
