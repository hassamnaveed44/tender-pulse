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

// Fallback data if DB query returns empty / during initial preview
const FALLBACK_METRICS: DashboardMetricsData = {
  activeTendersCount: 2,
  pendingReviewCount: 4,
  missingEvidenceCount: 1,
  expiringDocsCount: 2,
  avgReadinessScore: 80,
};

const FALLBACK_TASKS: TaskItem[] = [
  {
    id: "req-4",
    requirementTitle: "Lead Systems Engineer CV and Rail Safety Accreditation",
    tenderId: "tender-1",
    tenderTitle: "Metropolitan Transit Rail Electrification & Signaling System",
    tenderRef: "TP-2026-00142",
    category: "Technical",
    isMandatory: true,
    status: "MISSING",
    sourcePage: 62,
    assignedAt: new Date(),
  },
  {
    id: "req-3",
    requirementTitle: "Public Liability and Professional Indemnity Coverage ($50M)",
    tenderId: "tender-1",
    tenderTitle: "Metropolitan Transit Rail Electrification & Signaling System",
    tenderRef: "TP-2026-00142",
    category: "Legal",
    isMandatory: true,
    status: "IN_REVIEW",
    sourcePage: 45,
    assignedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "req-1",
    requirementTitle: "Valid ISO 9001:2015 Quality Management Certification",
    tenderId: "tender-1",
    tenderTitle: "Metropolitan Transit Rail Electrification & Signaling System",
    tenderRef: "TP-2026-00142",
    category: "Eligibility",
    isMandatory: true,
    status: "VERIFIED",
    sourcePage: 14,
    assignedAt: new Date(Date.now() - 172800000),
  },
];

const FALLBACK_DEADLINES: DeadlineItem[] = [
  {
    id: "tender-1",
    title: "Metropolitan Transit Rail Electrification & Signaling System",
    referenceNumber: "TP-2026-00142",
    clientName: "State Department of Transportation",
    status: "ACTIVE",
    submissionDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    daysRemaining: 12,
    totalRequirements: 5,
    verifiedRequirements: 4,
    readinessPercentage: 80,
  },
  {
    id: "tender-2",
    title: "Smart Grid Power Substation SCADA Modernization",
    referenceNumber: "TP-2026-00089",
    clientName: "National Energy Authority",
    status: "IN_REVIEW",
    submissionDeadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
    daysRemaining: 24,
    totalRequirements: 4,
    verifiedRequirements: 1,
    readinessPercentage: 25,
  },
];

const FALLBACK_EXPIRING_DOCS: ExpiringDocAlert[] = [
  {
    id: "doc-3",
    fileName: "Public_Liability_Insurance_50M.pdf",
    fileType: "Insurance Policy",
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    daysToExpiry: 14,
    isExpired: false,
  },
  {
    id: "doc-4",
    fileName: "SOC2_Type_II_Compliance_Report.pdf",
    fileType: "Audit Report",
    expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    daysToExpiry: -5,
    isExpired: true,
  },
];

export async function getDashboardData(): Promise<DashboardOverviewData> {
  try {
    const activeTenders = await prisma.tender.findMany({
      where: { status: { in: ["ACTIVE", "IN_REVIEW", "DRAFT"] } },
      include: {
        requirements: true,
        extractedRequirements: { where: { status: "PENDING" } },
      },
    });

    if (activeTenders.length === 0) {
      return {
        metrics: FALLBACK_METRICS,
        tasks: FALLBACK_TASKS,
        deadlines: FALLBACK_DEADLINES,
        expiringDocs: FALLBACK_EXPIRING_DOCS,
      };
    }

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
      tasks: tasks.length > 0 ? tasks : FALLBACK_TASKS,
      deadlines: deadlines.length > 0 ? deadlines : FALLBACK_DEADLINES,
      expiringDocs: formattedExpiringDocs.length > 0 ? formattedExpiringDocs : FALLBACK_EXPIRING_DOCS,
    };
  } catch (error) {
    console.warn("Failed to fetch dashboard data from DB, using fallback dataset:", error);
    return {
      metrics: FALLBACK_METRICS,
      tasks: FALLBACK_TASKS,
      deadlines: FALLBACK_DEADLINES,
      expiringDocs: FALLBACK_EXPIRING_DOCS,
    };
  }
}
