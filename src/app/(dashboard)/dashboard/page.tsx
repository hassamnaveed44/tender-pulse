import React from "react";
import Link from "next/link";
import { Plus, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getDashboardData } from "@/features/dashboard/services/dashboardService";
import { SummaryCards } from "@/features/dashboard/components/SummaryCards";
import { MyTasks } from "@/features/dashboard/components/MyTasks";
import { UpcomingDeadlines } from "@/features/dashboard/components/UpcomingDeadlines";
import { AttentionFeed } from "@/features/dashboard/components/AttentionFeed";
import { ActiveTendersOverview } from "@/features/dashboard/components/ActiveTendersOverview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { metrics, tasks, deadlines, expiringDocs } = await getDashboardData();

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Global Compliance Dashboard
            </h1>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3" />
              Phase 3 Live
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Real-time attention center for RFP compliance matrixes, evidence blockers, and submission readiness.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-border text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="text-text-secondary">Avg Readiness:</span>
            <strong className="text-accent font-bold">{metrics.avgReadinessScore}%</strong>
          </div>

          <Link href="/tenders/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Tender
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Summary Stat Tiles */}
      <SummaryCards metrics={metrics} />

      {/* 2. Urgent Attention Banner */}
      <AttentionFeed expiringDocs={expiringDocs} />

      {/* 3. Main Operational Grid: My Tasks & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MyTasks tasks={tasks} />
        <UpcomingDeadlines deadlines={deadlines} />
      </div>

      {/* 4. Active Tenders Portfolio Grid & Filtering */}
      <ActiveTendersOverview tenders={deadlines} />
    </div>
  );
}
