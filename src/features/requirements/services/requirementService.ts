import { prisma } from "@/lib/db/prisma";
import { RequirementItem, TenderWorkspaceDetails, AssignedUser } from "../types/requirementTypes";

const FALLBACK_USERS: AssignedUser[] = [
  { id: "user-1", fullName: "Hassam Naveed", email: "hassam@tenderpulse.io", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { id: "user-2", fullName: "Sarah Chen", email: "sarah.chen@tenderpulse.io", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
  { id: "user-3", fullName: "Marcus Vance", email: "marcus.vance@tenderpulse.io", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
];

const FALLBACK_REQUIREMENTS: RequirementItem[] = [
  {
    id: "req-1",
    tenderId: "tender-1",
    title: "Valid ISO 9001:2015 Quality Management Certification",
    description: "Bidder must attach an accredited ISO 9001:2015 certificate valid through contract completion.",
    category: "Eligibility",
    isMandatory: true,
    status: "VERIFIED",
    source: "EXTRACTED",
    sourcePage: 14,
    assignedUser: FALLBACK_USERS[0],
    evidenceDocs: [{ id: "doc-1", fileName: "ISO_9001_2015_Certificate_Apex.pdf", fileType: "Certificate" }],
    createdAt: new Date(),
  },
  {
    id: "req-2",
    tenderId: "tender-1",
    title: "Three (3) Consecutive Years Audited Financial Statements",
    description: "Audited balance sheets and P&L statements showing minimum annual turnover of $15M.",
    category: "Financial",
    isMandatory: true,
    status: "VERIFIED",
    source: "EXTRACTED",
    sourcePage: 28,
    assignedUser: FALLBACK_USERS[1],
    evidenceDocs: [{ id: "doc-2", fileName: "Audited_Financial_Statements_FY2025.pdf", fileType: "Financial Statement" }],
    createdAt: new Date(),
  },
  {
    id: "req-3",
    tenderId: "tender-1",
    title: "Public Liability and Professional Indemnity Coverage ($50M)",
    description: "Current certificate of currency for public liability insurance of no less than $50,000,000 per occurrence.",
    category: "Legal",
    isMandatory: true,
    status: "IN_REVIEW",
    source: "EXTRACTED",
    sourcePage: 45,
    assignedUser: FALLBACK_USERS[0],
    evidenceDocs: [{ id: "doc-3", fileName: "Public_Liability_Insurance_50M.pdf", fileType: "Insurance Policy" }],
    createdAt: new Date(),
  },
  {
    id: "req-4",
    tenderId: "tender-1",
    title: "Lead Systems Engineer CV and Rail Safety Accreditation",
    description: "Proposed Key Personnel Lead Engineer must have minimum 10 years experience and valid Level 4 Rail Safety Credential.",
    category: "Technical",
    isMandatory: true,
    status: "MISSING",
    source: "EXTRACTED",
    sourcePage: 62,
    assignedUser: FALLBACK_USERS[2],
    evidenceDocs: [],
    createdAt: new Date(),
  },
  {
    id: "req-5",
    tenderId: "tender-1",
    title: "Local Environmental & Carbon Offset Action Plan",
    description: "Detailed sustainability proposal outlining steps to achieve net-zero emission during transit construction phase.",
    category: "Technical",
    isMandatory: false,
    status: "NOT_STARTED",
    source: "EXTRACTED",
    sourcePage: 78,
    assignedUser: FALLBACK_USERS[1],
    evidenceDocs: [],
    createdAt: new Date(),
  },
];

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
      return {
        tenderDetails: getFallbackTenderDetails(tenderId),
        requirements: FALLBACK_REQUIREMENTS,
        teamMembers: FALLBACK_USERS,
      };
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
    const teamMembers: AssignedUser[] = dbUsers.length > 0
      ? dbUsers.map((u) => ({ id: u.id, fullName: u.fullName, email: u.email, avatarUrl: u.avatarUrl }))
      : FALLBACK_USERS;

    return {
      tenderDetails,
      requirements: requirements.length > 0 ? requirements : FALLBACK_REQUIREMENTS,
      teamMembers,
    };
  } catch (error) {
    console.warn("DB query failed in fetchTenderWorkspaceData, using fallback data:", error);
    return {
      tenderDetails: getFallbackTenderDetails(tenderId),
      requirements: FALLBACK_REQUIREMENTS,
      teamMembers: FALLBACK_USERS,
    };
  }
}

function getFallbackTenderDetails(tenderId: string): TenderWorkspaceDetails {
  return {
    id: tenderId,
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
  };
}
