"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
  UserCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NotificationItem, AuditLogItem } from "../services/notificationService";
import { markAsReadAction, clearNotificationsAction } from "../actions/notificationActions";

interface NotificationFeedProps {
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
}

export function NotificationFeed({
  notifications: initialNotifs,
  auditLogs,
}: NotificationFeedProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifs);
  const [activeTab, setActiveTab] = useState<"notifications" | "audit">("notifications");

  async function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markAsReadAction(id);
  }

  async function handleClearAll() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await clearNotificationsAction();
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border min-w-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Activity & Notifications Center
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time compliance notifications, assignment alerts, and workspace audit logs.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClearAll}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="bg-surface p-1 rounded-lg border border-border shadow-subtle flex items-center gap-1 w-fit">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === "notifications"
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-[#A56A20] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {unreadCount} NEW
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === "audit"
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Workspace Audit Stream</span>
        </button>
      </div>

      {/* Viewport Content */}
      {activeTab === "notifications" ? (
        <div className="bg-surface rounded-lg border border-border shadow-subtle divide-y divide-border overflow-hidden">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-xs font-bold text-text-primary">All caught up!</p>
              <p className="text-[11px] text-text-secondary mt-0.5">No unread notifications.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkRead(item.id)}
                className={`p-4 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                  !item.isRead ? "bg-[#FFFDF9] hover:bg-[#FDF4E7]/40" : "hover:bg-surface-alt/40 opacity-80"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={`p-2 rounded shrink-0 mt-0.5 ${
                      item.type === "DOCUMENT_EXPIRING"
                        ? "bg-[#FDF4E7] text-[#A56A20]"
                        : item.type === "EXTRACTION_COMPLETE"
                        ? "bg-[#E8F4F3] text-accent"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {item.type === "DOCUMENT_EXPIRING" ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : item.type === "EXTRACTION_COMPLETE" ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-text-primary leading-snug">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-text-secondary font-mono block">
                      {item.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
                      {item.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {!item.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A56A20] shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Audit Log Stream */
        <div className="bg-surface rounded-lg border border-border shadow-subtle p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Chronological Audit Trail
            </h3>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {auditLogs.map((log) => (
              <div key={log.id} className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface" />
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-xs font-bold text-text-primary">
                      {log.actorName}
                    </strong>
                    <span className="text-[10px] font-mono bg-surface-alt px-1.5 py-0.2 rounded font-bold text-primary">
                      {log.type}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary font-mono leading-relaxed">
                    {JSON.stringify(log.payload)}
                  </p>

                  <span className="text-[10px] text-text-muted font-mono block">
                    {log.createdAt.toLocaleTimeString()} • {log.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
