import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, ArrowRight, ShieldCheck, AlertTriangle, FileSpreadsheet, Clock } from "lucide-react";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { ComplianceStatusIndicator } from "@/components/shared/ComplianceStatusIndicator";

export default function DashboardPreviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Compliance Dashboard
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Overview of active tenders, compliance blockers, and urgent submission deadlines.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/tenders/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Tender
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-surface border border-border shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase">Active Tenders</span>
            <span className="p-1.5 rounded bg-surface-alt text-primary">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">2</p>
          <span className="text-[11px] text-accent font-medium mt-1 inline-block">1 under extraction review</span>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase">Pending Review</span>
            <span className="p-1.5 rounded bg-[#FDF4E7] text-[#A56A20]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">4 Clauses</p>
          <span className="text-[11px] text-[#A56A20] font-medium mt-1 inline-block">Smart Grid RFP</span>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase">Missing Evidence</span>
            <span className="p-1.5 rounded bg-[#FCEEEE] text-danger">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">1 Item</p>
          <span className="text-[11px] text-danger font-medium mt-1 inline-block">Lead Systems CV</span>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase">Avg Readiness</span>
            <span className="p-1.5 rounded bg-[#E8F4F3] text-accent">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">80%</p>
          <span className="text-[11px] text-accent font-medium mt-1 inline-block">Target 100% for submit</span>
        </div>
      </div>

      {/* Featured Active Tender Card */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold bg-[#173B4D] text-white px-2 py-0.5 rounded">
                TP-2026-00142
              </span>
              <ComplianceStatusIndicator status="IN_REVIEW" size="sm" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              Metropolitan Transit Rail Electrification & Signaling System
            </h3>
            <p className="text-xs text-text-secondary mt-0.5 font-mono">
              Client: State Department of Transportation • Deadline: 12 days remaining
            </p>
          </div>

          <ReadinessGauge percentage={80} size="md" totalMandatory={5} verifiedMandatory={4} />
        </div>

        <div className="pt-4 flex items-center justify-between text-xs">
          <span className="text-text-secondary">
            Phase 3 will complete the full live queries & metric widgets!
          </span>
          <Link href="/" className="font-semibold text-primary hover:text-primary-hover flex items-center gap-1">
            <span>Back to Landing Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
