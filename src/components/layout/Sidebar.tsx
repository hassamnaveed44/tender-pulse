"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSpreadsheet,
  FolderLock,
  Bell,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Tenders & RFPs",
    href: "/tenders",
    icon: FileSpreadsheet,
    badge: "2",
  },
  {
    label: "Evidence Documents",
    href: "/documents",
    icon: FolderLock,
    badge: "4",
  },
  {
    label: "Activity & Alerts",
    href: "/notifications",
    icon: Bell,
    badge: "3",
    urgent: true,
  },
  {
    label: "Settings & Team",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-surface transition-all duration-200 shrink-0 sticky top-0 h-screen z-30",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 px-4 border-b border-border flex items-center justify-between">
        {!isCollapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm text-text-primary">
                TenderPulse
              </span>
              <span className="text-[10px] text-text-secondary font-mono">
                Compliance System
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="w-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-1.5 rounded-sm text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors",
            isCollapsed && "hidden"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        {!isCollapsed ? (
          <Link href="/tenders/new" className="w-full block">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              className="w-full justify-start text-xs font-semibold"
            >
              New Tender / RFP
            </Button>
          </Link>
        ) : (
          <Link href="/tenders/new" className="w-full flex justify-center">
            <button className="w-9 h-9 rounded-md bg-primary text-white flex items-center justify-center shadow-sm hover:bg-primary-hover">
              <Plus className="w-4 h-4" />
            </button>
          </Link>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors select-none",
                isActive
                  ? "bg-surface-alt text-primary font-semibold border-l-2 border-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-alt",
                isCollapsed && "justify-center px-0 py-2.5"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-text-secondary")} />
              {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    "font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold",
                    item.urgent
                      ? "bg-[#FDF4E7] text-[#A56A20] border border-[#F7E1B8]"
                      : "bg-[#F0F2F4] text-text-secondary"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle when collapsed */}
      {isCollapsed && (
        <div className="p-3 border-t border-border flex justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 rounded-sm text-text-secondary hover:bg-surface-alt hover:text-text-primary"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Organization Badge Footer */}
      {!isCollapsed && (
        <div className="p-3.5 border-t border-border bg-[#FBFBFA]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-primary text-white font-mono text-xs flex items-center justify-center font-bold">
              AE
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-text-primary truncate">
                Apex Engineering
              </span>
              <span className="text-[10px] text-accent font-medium font-mono">
                ADMIN WORKSPACE
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
