import { prisma } from "@/lib/db/prisma";

export interface NotificationItem {
  id: string;
  userId: string;
  tenderId: string | null;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorEmail: string;
  type: string;
  payload: any;
  createdAt: Date;
}

export async function fetchNotificationsAndLogs() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });

    const auditLogs = await prisma.auditLog.findMany({
      include: { actor: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const formattedNotifs: NotificationItem[] = notifications.map((n) => ({
      id: n.id,
      userId: n.userId,
      tenderId: n.tenderId,
      type: n.type,
      message: n.message,
      isRead: n.isRead,
      createdAt: new Date(n.createdAt),
    }));

    const formattedLogs: AuditLogItem[] = auditLogs.map((l) => ({
      id: l.id,
      actorName: l.actor?.fullName || "System Admin",
      actorEmail: l.actor?.email || "admin@tenderpulse.io",
      type: l.type,
      payload: l.payload,
      createdAt: new Date(l.createdAt),
    }));

    return {
      notifications: formattedNotifs,
      auditLogs: formattedLogs,
    };
  } catch (error) {
    console.error("DB query failed in fetchNotificationsAndLogs:", error);
    return {
      notifications: [],
      auditLogs: [],
    };
  }
}
