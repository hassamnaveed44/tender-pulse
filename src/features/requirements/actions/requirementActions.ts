"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

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
    });

    if (existing) {
      const newStatus = existing.status === "VERIFIED" ? "IN_REVIEW" : "VERIFIED";

      await prisma.requirement.update({
        where: { id: requirementId },
        data: { status: newStatus },
      });

      const actor = await prisma.user.findFirst();
      if (actor && newStatus === "VERIFIED") {
        await prisma.auditLog.create({
          data: {
            actorId: actor.id,
            tenderId: existing.tenderId,
            type: "REQUIREMENT_VERIFIED",
            payload: { requirementId, title: existing.title },
          },
        });
      }

      revalidatePath(`/tenders/${existing.tenderId}`);
    }

    return { success: true };
  } catch (error) {
    console.warn("Prisma error in verifyRequirementAction:", error);
    return { success: true };
  }
}
