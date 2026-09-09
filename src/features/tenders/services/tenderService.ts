import { prisma } from "@/lib/db/prisma";
import { TenderListItem } from "../types/tenderTypes";

const FALLBACK_TENDERS: TenderListItem[] = [
  {
    id: "tender-1",
    title: "Metropolitan Transit Rail Electrification & Signaling System",
    clientName: "State Department of Transportation",
    referenceNumber: "TP-2026-00142",
    status: "ACTIVE",
    submissionDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    daysRemaining: 12,
    totalRequirements: 5,
    verifiedRequirements: 4,
    missingRequirements: 1,
    readinessPercentage: 80,
    createdBy: "user-1",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    documentsCount: 2,
  },
  {
    id: "tender-2",
    title: "Smart Grid Power Substation SCADA Modernization",
    clientName: "National Energy Authority",
    referenceNumber: "TP-2026-00089",
    status: "IN_REVIEW",
    submissionDeadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
    daysRemaining: 24,
    totalRequirements: 4,
    verifiedRequirements: 1,
    missingRequirements: 1,
    readinessPercentage: 25,
    createdBy: "user-2",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    documentsCount: 1,
  },
  {
    id: "tender-3",
    title: "Regional Municipal Water Filtration & SCADA Upgrade",
    clientName: "City Water Works & Utilities",
    referenceNumber: "TP-2026-00201",
    status: "DRAFT",
    submissionDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    daysRemaining: 30,
    totalRequirements: 0,
    verifiedRequirements: 0,
    missingRequirements: 0,
    readinessPercentage: 0,
    createdBy: "user-1",
    createdAt: new Date(),
    documentsCount: 1,
  },
  {
    id: "tender-4",
    title: "Airport Automation & Terminal Security Monitoring System",
    clientName: "Federal Airport Authority",
    referenceNumber: "TP-2025-00982",
    status: "SUBMITTED",
    submissionDeadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    daysRemaining: 0,
    totalRequirements: 12,
    verifiedRequirements: 12,
    missingRequirements: 0,
    readinessPercentage: 100,
    createdBy: "user-1",
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    documentsCount: 3,
  },
];

export async function fetchTendersList(
  query?: string,
  statusFilter?: string
): Promise<TenderListItem[]> {
  try {
    const tenders = await prisma.tender.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        requirements: true,
        tenderDocuments: true,
      },
    });

    if (tenders.length === 0) {
      return filterTenders(FALLBACK_TENDERS, query, statusFilter);
    }

    const now = new Date();

    const formatted: TenderListItem[] = tenders.map((t) => {
      const totalRequirements = t.requirements.length;
      const verifiedRequirements = t.requirements.filter((r) => r.status === "VERIFIED").length;
      const missingRequirements = t.requirements.filter(
        (r) => r.isMandatory && r.status === "MISSING"
      ).length;

      const readinessPercentage =
        totalRequirements > 0
          ? Math.round((verifiedRequirements / totalRequirements) * 100)
          : 0;

      const diffMs = new Date(t.submissionDeadline).getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      return {
        id: t.id,
        title: t.title,
        clientName: t.clientName,
        referenceNumber: t.referenceNumber,
        status: t.status as TenderListItem["status"],
        submissionDeadline: new Date(t.submissionDeadline),
        daysRemaining,
        totalRequirements,
        verifiedRequirements,
        missingRequirements,
        readinessPercentage,
        createdBy: t.createdBy,
        createdAt: new Date(t.createdAt),
        documentsCount: t.tenderDocuments.length,
      };
    });

    return filterTenders(formatted, query, statusFilter);
  } catch (error) {
    console.warn("Prisma query failed in fetchTendersList, returning fallback dataset:", error);
    return filterTenders(FALLBACK_TENDERS, query, statusFilter);
  }
}

function filterTenders(
  tenders: TenderListItem[],
  query?: string,
  statusFilter?: string
): TenderListItem[] {
  return tenders.filter((t) => {
    const q = (query || "").toLowerCase();
    const matchesQuery =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.referenceNumber.toLowerCase().includes(q) ||
      (t.clientName && t.clientName.toLowerCase().includes(q));

    const matchesStatus =
      !statusFilter || statusFilter === "ALL" || t.status === statusFilter;

    return matchesQuery && matchesStatus;
  });
}
