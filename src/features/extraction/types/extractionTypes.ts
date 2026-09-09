export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ExtractedCandidateItem {
  id: string;
  tenderId: string;
  sourceDocumentId?: string | null;
  sourceDocumentName?: string;
  sourcePage?: number | null;
  title: string;
  description: string;
  category: "Eligibility" | "Technical" | "Financial" | "Legal" | "General";
  isMandatory: boolean;
  confidence: ConfidenceLevel;
  confidenceScore?: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
}

export interface ExtractionPipelineStatus {
  tenderId: string;
  stage: "UPLOADED" | "CLEANING" | "SPLITTING" | "EXTRACTING" | "COMPLETED";
  progressPercentage: number;
  totalCandidates: number;
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
}
