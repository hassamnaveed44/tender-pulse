import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { PageTransition } from "@/components/shared/PageTransition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row antialiased selection:bg-accent selection:text-white max-w-full overflow-x-hidden">
      {/* Persistent Left Sidebar (Desktop & Tablet) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden pb-16 md:pb-0">
        {/* Topbar Shell */}
        <Topbar />

        {/* Page Viewport with Smooth Page Transition */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>

      {/* Sticky Bottom Navigation (Mobile Viewport) */}
      <MobileNav />
    </div>
  );
}
