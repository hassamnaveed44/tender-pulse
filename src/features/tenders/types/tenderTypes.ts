import { z } from "zod";

export const CreateTenderSchema = z.object({
  title: z.string().min(5, "Tender title must be at least 5 characters long"),
  clientName: z.string().min(2, "Client name is required"),
  referenceNumber: z.string().optional(),
  submissionDeadline: z.string().min(1, "Submission deadline is required"),
});

export type CreateTenderInput = z.infer<typeof CreateTenderSchema>;

export interface TenderListItem {
  id: string;
  title: string;
  clientName: string | null;
  referenceNumber: string;
  status: "DRAFT" | "EXTRACTING" | "IN_REVIEW" | "ACTIVE" | "SUBMITTED" | "CLOSED";
  submissionDeadline: Date;
  daysRemaining: number;
  totalRequirements: number;
  verifiedRequirements: number;
  missingRequirements: number;
  readinessPercentage: number;
  createdBy: string;
  createdAt: Date;
  documentsCount: number;
}
