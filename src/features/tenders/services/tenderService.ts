import { prisma } from "@/lib/db/prisma";
import { TenderListItem } from "../types/tenderTypes";

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
      return [];
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
    console.error("Prisma query failed in fetchTendersList:", error);
    return [];
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
