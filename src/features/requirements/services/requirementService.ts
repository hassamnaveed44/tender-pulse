import { prisma } from "@/lib/db/prisma";
import { RequirementItem, TenderWorkspaceDetails, AssignedUser } from "../types/requirementTypes";

export async function fetchTenderWorkspaceData(tenderId: string) {
  try {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: {
        requirements: {
          include: {
            assignments: { include: { user: true } },
            evidenceLinks: { include: { document: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!tender) {
      return null;
    }

    const total = tender.requirements.length;
    const verified = tender.requirements.filter((r) => r.status === "VERIFIED").length;
    const missing = tender.requirements.filter((r) => r.isMandatory && r.status === "MISSING").length;
    const readinessPercentage = total > 0 ? Math.round((verified / total) * 100) : 0;
    const diffMs = new Date(tender.submissionDeadline).getTime() - new Date().getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    const tenderDetails: TenderWorkspaceDetails = {
      id: tender.id,
      title: tender.title,
      clientName: tender.clientName,
      referenceNumber: tender.referenceNumber,
      status: tender.status,
      submissionDeadline: new Date(tender.submissionDeadline),
      daysRemaining,
      totalRequirements: total,
      verifiedRequirements: verified,
      missingRequirements: missing,
      readinessPercentage,
    };

    const requirements: RequirementItem[] = tender.requirements.map((r) => {
      const assigned = r.assignments[0]?.user;
      return {
        id: r.id,
        tenderId: r.tenderId,
        title: r.title,
        description: r.description,
        category: r.category || "General",
        isMandatory: r.isMandatory,
        status: r.status as RequirementItem["status"],
        source: r.source,
        sourcePage: r.sourcePage,
        assignedUser: assigned
          ? { id: assigned.id, fullName: assigned.fullName, email: assigned.email, avatarUrl: assigned.avatarUrl }
          : null,
        evidenceDocs: r.evidenceLinks.map((e) => ({
          id: e.document.id,
          fileName: e.document.fileName,
          fileType: e.document.fileType,
          expiryDate: e.document.expiryDate ? new Date(e.document.expiryDate) : null,
        })),
        createdAt: r.createdAt,
      };
    });

    const dbUsers = await prisma.user.findMany();
    const teamMembers: AssignedUser[] = dbUsers.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      avatarUrl: u.avatarUrl,
    }));

    return {
      tenderDetails,
      requirements,
      teamMembers,
    };
  } catch (error) {
    console.error("DB query failed in fetchTenderWorkspaceData:", error);
    return null;
  }
}
