import React from "react";
import { fetchNotificationsAndLogs } from "@/features/notifications/services/notificationService";
import { NotificationFeed } from "@/features/notifications/components/NotificationFeed";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const { notifications, auditLogs } = await fetchNotificationsAndLogs();

  return (
    <div className="space-y-6">
      <NotificationFeed notifications={notifications} auditLogs={auditLogs} />
    </div>
  );
}
