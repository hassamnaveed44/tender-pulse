"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ComplianceStatusIndicator } from "@/components/shared/ComplianceStatusIndicator";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Plus, Search, FileText, CheckCircle2, ShieldAlert, ArrowRight, UploadCloud, ArrowLeft } from "lucide-react";

export default function ComponentShowcasePage() {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [readinessScore, setReadinessScore] = useState(75);
  const [searchVal, setSearchVal] = useState("");

  const handleSimulateLoading = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 md:p-12">
      <div className="max-w-5xl mx-auto mb-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-[#173B4D] text-white rounded-sm">
            DESIGN SYSTEM
          </span>
          <span className="text-xs text-text-secondary font-mono">TenderPulse Primitives & Signature UI</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">
          Core UI Components Testbed
        </h1>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Status Indicators */}
        <section className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
          <h2 className="text-lg font-semibold text-text-primary mb-4">1. Signature Status Indicators</h2>
          <div className="flex flex-wrap items-center gap-3">
            <ComplianceStatusIndicator status="VERIFIED" />
            <ComplianceStatusIndicator status="IN_REVIEW" />
            <ComplianceStatusIndicator status="MISSING" />
            <ComplianceStatusIndicator status="NOT_STARTED" />
          </div>
        </section>

        {/* Readiness Gauge */}
        <section className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">2. Interactive Readiness Gauge</h2>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={readinessScore}
                onChange={(e) => setReadinessScore(Number(e.target.value))}
                className="accent-primary"
              />
              <span className="font-mono text-xs font-bold">{readinessScore}%</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ReadinessGauge percentage={readinessScore} size="lg" />
            <ReadinessGauge percentage={readinessScore} size="md" />
          </div>
        </section>
      </div>
    </div>
  );
}
