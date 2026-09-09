"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileSpreadsheet, FolderLock, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils/format";

const MOBILE_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tenders", href: "/tenders", icon: FileSpreadsheet },
  { label: "Evidence", href: "/documents", icon: FolderLock },
  { label: "Activity", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border flex items-center justify-around h-16 px-2 shadow-lg safe-area-bottom">
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors",
              isActive ? "text-primary font-bold" : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Icon className={cn("w-5 h-5 mb-1", isActive ? "text-primary" : "text-text-secondary")} />
            <span className="leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
