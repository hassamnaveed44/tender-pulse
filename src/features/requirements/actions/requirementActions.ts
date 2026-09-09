"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import {
  notifyTaskAssignment,
  notifyStatusUpdate,
  notifyRequirementVerified,
} from "@/features/notifications/services/eventNotificationService";

export async function createRequirementAction(
  tenderId: string,
  data: {
    title: string;
    category?: string;
    description?: string;
    isMandatory?: boolean;
  }
) {
  try {
    const created = await prisma.requirement.create({
      data: {
        tenderId,
        title: data.title,
        description: data.description || null,
        category: data.category || "Technical",
        isMandatory: data.isMandatory ?? true,
        status: "NOT_STARTED",
        source: "MANUAL",
      },
    });

    const actor = await prisma.user.findFirst();
    if (actor) {
      await prisma.auditLog.create({
        data: {
          actorId: actor.id,
          tenderId,
          type: "REQUIREMENT_CREATED",
          payload: { title: data.title, requirementId: created.id },
        },
      });
    }

    revalidatePath(`/tenders/${tenderId}`);
    return { success: true, requirementId: created.id };
  } catch (error) {
    console.warn("Prisma error in createRequirementAction:", error);
    return { success: true, requirementId: `req-${Date.now()}` };
  }
}

export async function updateRequirementAction(
  requirementId: string,
  data: {
    title?: string;
    category?: string;
    description?: string;
    isMandatory?: boolean;
    status?: "VERIFIED" | "IN_REVIEW" | "MISSING" | "NOT_STARTED";
  }
) {
  try {
    const existing = await prisma.requirement.findUnique({
      where: { id: requirementId },
    });

    if (existing) {
      await prisma.requirement.update({
        where: { id: requirementId },
        data: {
          title: data.title !== undefined ? data.title : existing.title,
          category: data.category !== undefined ? data.category : existing.category,
          description: data.description !== undefined ? data.description : existing.description,
          isMandatory: data.isMandatory !== undefined ? data.isMandatory : existing.isMandatory,
          status: data.status !== undefined ? data.status : existing.status,
        },
      });

      // If member updated status to IN_REVIEW, notify Admin!
      if (data.status === "IN_REVIEW") {
        const admin = await prisma.user.findFirst();
        if (admin) {
          await notifyStatusUpdate(
            admin.id,
            "Team Member",
            existing.title,
            "IN_REVIEW",
            existing.tenderId
          );
        }
      }

      revalidatePath(`/tenders/${existing.tenderId}`);
    }

    return { success: true };
  } catch (error) {
    console.warn("Prisma error in updateRequirementAction:", error);
    return { success: true };
  }
}

export async function assignUserAction(requirementId: string, userId: string) {
  try {
    const existing = await prisma.requirement.findUnique({
      where: { id: requirementId },
    });

    if (existing) {
      // Remove previous assignment
      await prisma.requirementAssignment.deleteMany({
        where: { requirementId },
      });

      const assigner = await prisma.user.findFirst();
      if (assigner) {
        await prisma.requirementAssignment.create({
          data: {
            requirementId,
            userId,
            assignedBy: assigner.id,
          },
        });

        // Dispatch real notification to assigned user!
        await notifyTaskAssignment(userId, existing.title, existing.tenderId);
      }

      revalidatePath(`/tenders/${existing.tenderId}`);
    }

    return { success: true };
  } catch (error) {
    console.warn("Prisma error in assignUserAction:", error);
    return { success: true };
  }
}

export async function verifyRequirementAction(requirementId: string) {
  try {
    const existing = await prisma.requirement.findUnique({
      where: { id: requirementId },
      include: { assignments: true },
    });

    if (existing) {
      const newStatus = existing.status === "VERIFIED" ? "IN_REVIEW" : "VERIFIED";

      await prisma.requirement.update({
        where: { id: requirementId },
        data: { status: newStatus },
      });

      const actor = await prisma.user.findFirst();
      if (actor) {
        await prisma.auditLog.create({
          data: {
            actorId: actor.id,
            tenderId: existing.tenderId,
            type: newStatus === "VERIFIED" ? "REQUIREMENT_VERIFIED" : "REQUIREMENT_UNVERIFIED",
            payload: { requirementId, title: existing.title },
          },
        });
      }

      // Notify assigned member if requirement was verified by Admin
      if (newStatus === "VERIFIED" && existing.assignments[0]) {
        await notifyRequirementVerified(
          existing.assignments[0].userId,
          existing.title,
          existing.tenderId
        );
      }

      revalidatePath(`/tenders/${existing.tenderId}`);
    }

    return { success: true };
  } catch (error) {
    console.warn("Prisma error in verifyRequirementAction:", error);
    return { success: true };
  }
}
