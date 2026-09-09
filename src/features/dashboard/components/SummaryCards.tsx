import React from "react";
import { FileSpreadsheet, Clock, AlertTriangle, ShieldAlert } from "lucide-react";
import { DashboardMetricsData } from "../services/dashboardService";

interface SummaryCardsProps {
  metrics: DashboardMetricsData;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active Tenders */}
      <div className="p-4 rounded-lg bg-surface border border-border shadow-subtle hover:-translate-y-0.5 hover:shadow-card hover:border-primary/40 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Active Tenders
          </span>
          <span className="p-2 rounded bg-primary/10 text-primary">
            <FileSpreadsheet className="w-4 h-4" />
          </span>
        </div>
        <p className="text-2xl font-bold text-text-primary mt-2">
          {metrics.activeTendersCount}
        </p>
        <span className="text-[11px] text-accent font-medium mt-1 inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Live in compliance workspace
        </span>
      </div>

      {/* 2. Pending Review */}
      <div className="p-4 rounded-lg bg-surface border border-border shadow-subtle hover:-translate-y-0.5 hover:shadow-card hover:border-[#A56A20]/40 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Pending Review
          </span>
          <span className="p-2 rounded bg-[#FDF4E7] text-[#A56A20]">
            <Clock className="w-4 h-4" />
          </span>
        </div>
        <p className="text-2xl font-bold text-text-primary mt-2">
          {metrics.pendingReviewCount} Clauses
        </p>
        <span className="text-[11px] text-[#A56A20] font-medium mt-1 inline-block">
          Extracted RFP candidates pending audit
        </span>
      </div>

      {/* 3. Missing Evidence */}
      <div className="p-4 rounded-lg bg-surface border border-border shadow-subtle hover:-translate-y-0.5 hover:shadow-card hover:border-danger/40 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Missing Evidence
          </span>
          <span className="p-2 rounded bg-[#FCEEEE] text-danger">
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>
        <p className="text-2xl font-bold text-text-primary mt-2">
          {metrics.missingEvidenceCount} Items
        </p>
        <span className="text-[11px] text-danger font-medium mt-1 inline-block">
          Mandatory requirements unlinked
        </span>
      </div>

      {/* 4. Expiring Documents */}
      <div className="p-4 rounded-lg bg-surface border border-border shadow-subtle hover:-translate-y-0.5 hover:shadow-card hover:border-[#426A8A]/40 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Expiring Documents
          </span>
          <span className="p-2 rounded bg-[#EBF3F8] text-[#426A8A]">
            <ShieldAlert className="w-4 h-4" />
          </span>
        </div>
        <p className="text-2xl font-bold text-text-primary mt-2">
          {metrics.expiringDocsCount} Files
        </p>
        <span className="text-[11px] text-[#426A8A] font-medium mt-1 inline-block">
          Certificates / policies expiring soon
        </span>
      </div>
    </div>
  );
}
