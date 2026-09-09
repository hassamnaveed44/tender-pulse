export interface AssignedUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
}

export interface LinkedEvidenceDoc {
  id: string;
  fileName: string;
  fileType: string | null;
  expiryDate?: Date | null;
}

export interface RequirementItem {
  id: string;
  tenderId: string;
  title: string;
  description: string | null;
  category: string;
  isMandatory: boolean;
  status: "VERIFIED" | "IN_REVIEW" | "MISSING" | "NOT_STARTED";
  source: string;
  sourcePage: number | null;
  assignedUser: AssignedUser | null;
  evidenceDocs: LinkedEvidenceDoc[];
  createdAt: Date;
}

export interface TenderWorkspaceDetails {
  id: string;
  title: string;
  clientName: string | null;
  referenceNumber: string;
  status: string;
  submissionDeadline: Date;
  daysRemaining: number;
  totalRequirements: number;
  verifiedRequirements: number;
  missingRequirements: number;
  readinessPercentage: number;
}
