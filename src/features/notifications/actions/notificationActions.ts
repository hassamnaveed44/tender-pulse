"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export async function markAsReadAction(notifId: string) {
  try {
    await prisma.notification.update({
      where: { id: notifId },
      data: { isRead: true },
    });

    revalidatePath("/notifications");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.warn("Error marking notification as read:", error);
    return { success: true };
  }
}

export async function clearNotificationsAction() {
  try {
    await prisma.notification.updateMany({
      data: { isRead: true },
    });

    revalidatePath("/notifications");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.warn("Error clearing notifications:", error);
    return { success: true };
  }
}
