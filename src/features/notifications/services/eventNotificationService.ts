import { prisma } from "@/lib/db/prisma";

export async function createRealNotification(data: {
  userId: string;
  tenderId?: string | null;
  type: "ASSIGNMENT" | "STATUS_UPDATE" | "EXTRACTION_COMPLETE" | "VERIFIED" | "DOCUMENT_EXPIRING";
  message: string;
}) {
  try {
    const notif = await prisma.notification.create({
      data: {
        userId: data.userId,
        tenderId: data.tenderId || null,
        type: data.type,
        message: data.message,
        isRead: false,
      },
    });

    return { success: true, notifId: notif.id };
  } catch (error) {
    console.warn("Could not persist notification in DB:", error);
    return { success: false };
  }
}

export async function notifyTaskAssignment(
  assignedUserId: string,
  requirementTitle: string,
  tenderId: string
) {
  return createRealNotification({
    userId: assignedUserId,
    tenderId,
    type: "ASSIGNMENT",
    message: `You were assigned to requirement: "${requirementTitle}".`,
  });
}

export async function notifyStatusUpdate(
  adminUserId: string,
  memberName: string,
  requirementTitle: string,
  newStatus: string,
  tenderId: string
) {
  return createRealNotification({
    userId: adminUserId,
    tenderId,
    type: "STATUS_UPDATE",
    message: `${memberName} updated requirement "${requirementTitle}" to status ${newStatus} for your review.`,
  });
}

export async function notifyExtractionComplete(
  adminUserId: string,
  tenderTitle: string,
  candidateCount: number,
  tenderId: string
) {
  return createRealNotification({
    userId: adminUserId,
    tenderId,
    type: "EXTRACTION_COMPLETE",
    message: `Automated AI extraction completed for "${tenderTitle}" (${candidateCount} candidates pending review).`,
  });
}

export async function notifyRequirementVerified(
  memberUserId: string,
  requirementTitle: string,
  tenderId: string
) {
  return createRealNotification({
    userId: memberUserId,
    tenderId,
    type: "VERIFIED",
    message: `Requirement "${requirementTitle}" has been verified and approved by Admin.`,
  });
}
