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

const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "user-1",
    tenderId: "tender-1",
    type: "DOCUMENT_EXPIRING",
    message: "Public Liability Insurance policy (#50M) expires in 14 days.",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "notif-2",
    userId: "user-1",
    tenderId: "tender-2",
    type: "EXTRACTION_COMPLETE",
    message: "Automated extraction completed for NEA Smart Grid RFP (4 candidates pending review).",
    isRead: false,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "notif-3",
    userId: "user-1",
    tenderId: "tender-1",
    type: "ASSIGNMENT",
    message: "You were assigned to 'Lead Systems Engineer CV and Rail Safety Accreditation'.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000),
  },
];

const FALLBACK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "audit-1",
    actorName: "Hassam Naveed",
    actorEmail: "hassam@tenderpulse.io",
    type: "TENDER_CREATED",
    payload: { title: "Metropolitan Transit Rail Electrification & Signaling System", ref: "TP-2026-00142" },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "audit-2",
    actorName: "Hassam Naveed",
    actorEmail: "hassam@tenderpulse.io",
    type: "EVIDENCE_ATTACHED",
    payload: { requirement: "Valid ISO 9001:2015 Quality Management Certification", document: "ISO_9001_2015_Certificate_Apex.pdf" },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "audit-3",
    actorName: "Sarah Chen",
    actorEmail: "sarah.chen@tenderpulse.io",
    type: "REQUIREMENT_VERIFIED",
    payload: { requirement: "Three (3) Consecutive Years Audited Financial Statements", verifiedBy: "Sarah Chen" },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

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

    const formattedNotifs: NotificationItem[] =
      notifications.length > 0
        ? notifications.map((n) => ({
            id: n.id,
            userId: n.userId,
            tenderId: n.tenderId,
            type: n.type,
            message: n.message,
            isRead: n.isRead,
            createdAt: new Date(n.createdAt),
          }))
        : FALLBACK_NOTIFICATIONS;

    const formattedLogs: AuditLogItem[] =
      auditLogs.length > 0
        ? auditLogs.map((l) => ({
            id: l.id,
            actorName: l.actor?.fullName || "System Admin",
            actorEmail: l.actor?.email || "admin@tenderpulse.io",
            type: l.type,
            payload: l.payload,
            createdAt: new Date(l.createdAt),
          }))
        : FALLBACK_AUDIT_LOGS;

    return {
      notifications: formattedNotifs,
      auditLogs: formattedLogs,
    };
  } catch (error) {
    console.warn("DB query failed in fetchNotificationsAndLogs, using fallback:", error);
    return {
      notifications: FALLBACK_NOTIFICATIONS,
      auditLogs: FALLBACK_AUDIT_LOGS,
    };
  }
}
