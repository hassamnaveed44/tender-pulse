export type ExpiryStatus = "VALID" | "EXPIRING_SOON" | "EXPIRED" | "NO_EXPIRY";

export interface DocumentItem {
  id: string;
  fileName: string;
  fileType: string | null;
  storageKey: string;
  expiryDate: Date | null;
  daysToExpiry: number | null;
  expiryStatus: ExpiryStatus;
  uploadedBy: {
    id: string;
    fullName: string;
    email: string;
  };
  linkedRequirementsCount: number;
  createdAt: Date;
}
