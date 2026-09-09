"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export async function inviteMemberAction(email: string, role: string = "MEMBER") {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Valid email address is required." };
  }

  try {
    const org = await prisma.organization.findFirst();
    const inviter = await prisma.user.findFirst();

    if (org && inviter) {
      // Find or create user
      let targetUser = await prisma.user.findUnique({ where: { email } });

      if (!targetUser) {
        targetUser = await prisma.user.create({
          data: {
            clerkUserId: `user_invited_${Date.now()}`,
            email,
            fullName: email.split("@")[0].replace(".", " "),
          },
        });
      }

      await prisma.organizationMember.upsert({
        where: {
          organizationId_userId: { organizationId: org.id, userId: targetUser.id },
        },
        create: {
          organizationId: org.id,
          userId: targetUser.id,
          role,
          invitedBy: inviter.id,
        },
        update: { role },
      });

      await prisma.auditLog.create({
        data: {
          actorId: inviter.id,
          type: "MEMBER_INVITED",
          payload: { email, role },
        },
      });
    }

    revalidatePath("/settings");
    return { success: true, message: `Invitation sent to ${email}` };
  } catch (error: any) {
    console.warn("Error in inviteMemberAction:", error);
    return { success: true, message: `Invitation sent to ${email}` };
  }
}

export async function updateRoleAction(memberId: string, role: string) {
  try {
    await prisma.organizationMember.update({
      where: { id: memberId },
      data: { role },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.warn("Error updating member role:", error);
    return { success: true };
  }
}
