import { prisma } from "@/lib/db/prisma";

export interface DashboardMetricsData {
  activeTendersCount: number;
  pendingReviewCount: number;
  missingEvidenceCount: number;
  expiringDocsCount: number;
  avgReadinessScore: number;
}

export interface TaskItem {
  id: string;
  requirementTitle: string;
  tenderId: string;
  tenderTitle: string;
  tenderRef: string;
  category: string;
  isMandatory: boolean;
  status: "VERIFIED" | "IN_REVIEW" | "MISSING" | "NOT_STARTED";
  sourcePage?: number | null;
  assignedAt: Date;
}

export interface DeadlineItem {
  id: string;
  title: string;
  referenceNumber: string;
  clientName: string | null;
  status: string;
  submissionDeadline: Date;
  daysRemaining: number;
  totalRequirements: number;
  verifiedRequirements: number;
  readinessPercentage: number;
}

export interface ExpiringDocAlert {
  id: string;
  fileName: string;
  fileType: string | null;
  expiryDate: Date;
  daysToExpiry: number;
  isExpired: boolean;
}

export interface DashboardOverviewData {
  metrics: DashboardMetricsData;
  tasks: TaskItem[];
  deadlines: DeadlineItem[];
  expiringDocs: ExpiringDocAlert[];
}

export async function getDashboardData(): Promise<DashboardOverviewData> {
  try {
    const activeTenders = await prisma.tender.findMany({
      where: { status: { in: ["ACTIVE", "IN_REVIEW", "DRAFT"] } },
      include: {
        requirements: true,
        extractedRequirements: { where: { status: "PENDING" } },
      },
    });

    const pendingReviewCount = await prisma.extractedRequirement.count({
      where: { status: "PENDING" },
    });

    const missingEvidenceCount = await prisma.requirement.count({
      where: { isMandatory: true, status: "MISSING" },
    });

    const thirtyDaysAhead = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiringDocs = await prisma.document.findMany({
      where: {
        expiryDate: { lte: thirtyDaysAhead },
      },
      orderBy: { expiryDate: "asc" },
    });

    const now = new Date();
    const formattedExpiringDocs: ExpiringDocAlert[] = expiringDocs.map((doc) => {
      const exp = doc.expiryDate ? new Date(doc.expiryDate) : now;
      const diffMs = exp.getTime() - now.getTime();
      const daysToExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        id: doc.id,
        fileName: doc.fileName,
        fileType: doc.fileType,
        expiryDate: exp,
        daysToExpiry,
        isExpired: daysToExpiry < 0,
      };
    });

    const deadlines: DeadlineItem[] = activeTenders.map((t) => {
      const total = t.requirements.length;
      const verified = t.requirements.filter((r) => r.status === "VERIFIED").length;
      const readinessPercentage = total > 0 ? Math.round((verified / total) * 100) : 0;
      const diffMs = new Date(t.submissionDeadline).getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      return {
        id: t.id,
        title: t.title,
        referenceNumber: t.referenceNumber,
        clientName: t.clientName,
        status: t.status,
        submissionDeadline: t.submissionDeadline,
        daysRemaining,
        totalRequirements: total,
        verifiedRequirements: verified,
        readinessPercentage,
      };
    });

    const reqAssignments = await prisma.requirementAssignment.findMany({
      include: {
        requirement: {
          include: {
            tender: true,
          },
        },
      },
      take: 5,
      orderBy: { assignedAt: "desc" },
    });

    const tasks: TaskItem[] = reqAssignments.map((a) => ({
      id: a.requirement.id,
      requirementTitle: a.requirement.title,
      tenderId: a.requirement.tender.id,
      tenderTitle: a.requirement.tender.title,
      tenderRef: a.requirement.tender.referenceNumber,
      category: a.requirement.category || "General",
      isMandatory: a.requirement.isMandatory,
      status: a.requirement.status as TaskItem["status"],
      sourcePage: a.requirement.sourcePage,
      assignedAt: a.assignedAt,
    }));

    const totalReadinessSum = deadlines.reduce((acc, d) => acc + d.readinessPercentage, 0);
    const avgReadinessScore = deadlines.length > 0 ? Math.round(totalReadinessSum / deadlines.length) : 0;

    const metrics: DashboardMetricsData = {
      activeTendersCount: activeTenders.length,
      pendingReviewCount,
      missingEvidenceCount,
      expiringDocsCount: formattedExpiringDocs.length,
      avgReadinessScore,
    };

    return {
      metrics,
      tasks,
      deadlines,
      expiringDocs: formattedExpiringDocs,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data from DB:", error);
    return {
      metrics: {
        activeTendersCount: 0,
        pendingReviewCount: 0,
        missingEvidenceCount: 0,
        expiringDocsCount: 0,
        avgReadinessScore: 0,
      },
      tasks: [],
      deadlines: [],
      expiringDocs: [],
    };
  }
}
