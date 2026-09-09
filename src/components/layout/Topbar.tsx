"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/format";

import { CommandPalette } from "./CommandPalette";

export function Topbar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Generate dynamic breadcrumb segments
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-16 border-b border-border bg-surface px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Command Palette Search Modal */}
      <CommandPalette isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />

      {/* Left: Dynamic Breadcrumbs */}
      <div className="flex-1 min-w-0 flex items-center gap-2 text-xs text-text-secondary overflow-x-auto py-1 mr-2">
        <Link href="/dashboard" className="hover:text-text-primary font-medium shrink-0">
          Workspace
        </Link>
        {segments.map((seg, idx) => {
          const href = `/${segments.slice(0, idx + 1).join("/")}`;
          const isLast = idx === segments.length - 1;
          const label =
            seg === "dashboard"
              ? "Dashboard"
              : seg === "tenders"
              ? "Tenders"
              : seg === "new"
              ? "New Tender"
              : seg === "documents"
              ? "Document Library"
              : seg === "notifications"
              ? "Notifications & Activity"
              : seg === "settings"
              ? "Settings"
              : seg.startsWith("TP-") || seg.length > 20
              ? seg.toUpperCase()
              : seg.charAt(0).toUpperCase() + seg.slice(1);

          return (
            <React.Fragment key={href}>
              <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
              {isLast ? (
                <span className="font-semibold text-text-primary truncate max-w-[200px] sm:max-w-none">
                  {label}
                </span>
              ) : (
                <Link href={href} className="hover:text-text-primary font-medium shrink-0">
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Search Bar Trigger */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface-alt text-text-secondary text-xs hover:border-[#B9C2C7] hover:text-text-primary transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-primary" />
          <span>Quick search...</span>
          <kbd className="font-mono text-[10px] bg-white border border-border px-1.5 py-0.5 rounded text-text-muted">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md border border-border hover:bg-surface-alt text-text-secondary hover:text-text-primary transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A56A20]" />
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] sm:w-96 rounded-lg bg-surface border border-border shadow-dropdown p-4 z-50 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="font-semibold text-text-primary">Recent Notifications</span>
                <span className="text-[10px] font-mono text-accent">3 NEW</span>
              </div>
              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto py-1">
                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="p-1 rounded bg-[#FDF4E7] text-[#A56A20] shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">
                      Public Liability Insurance expires in 14 days
                    </p>
                    <span className="text-[10px] text-text-secondary font-mono">
                      Policy #50M • Metro Rail Tender
                    </span>
                  </div>
                </div>

                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="p-1 rounded bg-[#E8F4F3] text-accent shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">
                      AI Extraction completed for NEA Smart Grid RFP
                    </p>
                    <span className="text-[10px] text-text-secondary font-mono">
                      4 candidate requirements pending review
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <Link
                  href="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center justify-center gap-1"
                >
                  <span>View All Activity & Logs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-border hidden sm:block" />

        {/* User Profile */}
        <Link href="/settings" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold font-mono shadow-sm group-hover:ring-2 group-hover:ring-primary/20">
            HN
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-text-primary leading-none">
              Hassam Naveed
            </span>
            <span className="text-[10px] text-text-secondary leading-none mt-1">
              Lead Bid Manager
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
