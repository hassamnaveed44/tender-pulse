import React from "react";
import Link from "next/link";
import { Calendar, ArrowUpRight, AlertCircle } from "lucide-react";
import { DeadlineItem } from "../services/dashboardService";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";

interface UpcomingDeadlinesProps {
  deadlines: DeadlineItem[];
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-subtle flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#A56A20]/10 text-[#A56A20]">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary tracking-tight">
              Upcoming Deadlines & Readiness
            </h2>
            <p className="text-[11px] text-text-secondary">
              Submission timeline countdowns and readiness scores
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border flex-1">
        {deadlines.map((item) => {
          const isUrgent = item.daysRemaining <= 14;
          const isCritical = item.daysRemaining <= 5;

          return (
            <div
              key={item.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold bg-[#173B4D] text-white px-2 py-0.5 rounded">
                    {item.referenceNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      isCritical
                        ? "bg-danger/10 text-danger border border-danger/20 animate-pulse"
                        : isUrgent
                        ? "bg-[#FDF4E7] text-[#A56A20] border border-[#F7E1B8]"
                        : "bg-surface-alt text-text-secondary"
                    }`}
                  >
                    {isCritical && <AlertCircle className="w-3 h-3" />}
                    {item.daysRemaining} days left
                  </span>
                </div>

                <h3 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-[11px] text-text-secondary font-mono truncate">
                  Client: {item.clientName || "Direct Proposal"} • Target 100% Readiness
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <ReadinessGauge
                  percentage={item.readinessPercentage}
                  size="sm"
                  totalMandatory={item.totalRequirements}
                  verifiedMandatory={item.verifiedRequirements}
                />

                <Link
                  href={`/tenders/${item.id}`}
                  className="p-2 rounded-md bg-surface-alt hover:bg-primary hover:text-white text-text-secondary transition-all"
                  title="Open Tender Workspace"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
