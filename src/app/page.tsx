"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ComplianceStatusIndicator, ComplianceStatus } from "@/components/shared/ComplianceStatusIndicator";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Plus, Search, FileText, CheckCircle2, ShieldAlert, ArrowRight, UploadCloud } from "lucide-react";

export default function Phase1ShowcasePage() {
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
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-[#173B4D] text-white rounded-sm">
            PHASE 1
          </span>
          <span className="text-xs text-text-secondary font-mono">TenderPulse Component System</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">
          Design System & Shared Core Components
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-2xl">
          Visual verification testbed for all brand tokens, signature compliance status indicators, readiness gauges, buttons, inputs, and modals.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section 1: Signature Compliance Status Indicators */}
        <section className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
          <div className="border-b border-border pb-4 mb-6">
            <h2 className="text-lg font-semibold text-text-primary">
              1. Signature Compliance Status Indicators
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Strict icon + label + color language (Section 4.4 of Product Design).
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
                Standard Badge Variant (Used in Compliance Matrix & Headers)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <ComplianceStatusIndicator status="VERIFIED" />
                <ComplianceStatusIndicator status="IN_REVIEW" />
                <ComplianceStatusIndicator status="MISSING" />
                <ComplianceStatusIndicator status="NOT_STARTED" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
                Sizes (sm, md, lg)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <ComplianceStatusIndicator status="VERIFIED" size="sm" />
                <ComplianceStatusIndicator status="VERIFIED" size="md" />
                <ComplianceStatusIndicator status="VERIFIED" size="lg" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
                Dot Variant & Subtle Identifier Variant
              </h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ComplianceStatusIndicator status="VERIFIED" variant="dot" size="md" />
                  <ComplianceStatusIndicator status="IN_REVIEW" variant="dot" size="md" />
                  <ComplianceStatusIndicator status="MISSING" variant="dot" size="md" />
                  <ComplianceStatusIndicator status="NOT_STARTED" variant="dot" size="md" />
                </div>
                <div className="h-4 w-px bg-border" />
                <ComplianceStatusIndicator status="VERIFIED" variant="subtle" />
                <ComplianceStatusIndicator status="IN_REVIEW" variant="subtle" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Readiness Gauges */}
        <section className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
          <div className="border-b border-border pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                2. Interactive Readiness Gauge
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Dynamic SVG arc score (Amber when &lt;100%, Teal when 100% Submission Ready).
              </p>
            </div>
            {/* Slider to interactively test the gauge */}
            <div className="flex items-center gap-3 bg-surface-alt px-3 py-1.5 rounded-md border border-border">
              <span className="text-xs font-medium text-text-secondary">Test Score:</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={readinessScore}
                onChange={(e) => setReadinessScore(Number(e.target.value))}
                className="w-28 accent-primary cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-text-primary w-8">{readinessScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="p-4 rounded-md border border-border bg-background flex flex-col items-center justify-center">
              <span className="text-xs text-text-secondary mb-3">XL Overview Format</span>
              <ReadinessGauge
                percentage={readinessScore}
                size="xl"
                showLabel={false}
              />
            </div>

            <div className="p-4 rounded-md border border-border bg-background flex flex-col justify-center">
              <span className="text-xs text-text-secondary mb-3">Standard Card Format (md)</span>
              <ReadinessGauge
                percentage={readinessScore}
                size="md"
                totalMandatory={12}
                verifiedMandatory={Math.round((readinessScore / 100) * 12)}
              />
            </div>

            <div className="p-4 rounded-md border border-border bg-background flex flex-col justify-center">
              <span className="text-xs text-text-secondary mb-3">Compact Header Format (sm)</span>
              <ReadinessGauge
                percentage={readinessScore}
                size="sm"
                totalMandatory={12}
                verifiedMandatory={Math.round((readinessScore / 100) * 12)}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Buttons & Actions */}
        <section className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
          <div className="border-b border-border pb-4 mb-6">
            <h2 className="text-lg font-semibold text-text-primary">
              3. Button Variants & States
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Primary, Secondary, Accent, Ghost, and Danger with loading spinner feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              isLoading={loadingBtn}
              onClick={handleSimulateLoading}
            >
              Primary Action
            </Button>
            <Button variant="secondary" onClick={handleSimulateLoading}>
              Secondary Button
            </Button>
            <Button variant="accent" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Accent Action
            </Button>
            <Button variant="outline">
              Outline
            </Button>
            <Button variant="ghost">
              Ghost
            </Button>
            <Button variant="danger" leftIcon={<ShieldAlert className="w-4 h-4" />}>
              Danger Action
            </Button>
            <Button variant="primary" size="sm">
              Small (sm)
            </Button>
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Large (lg)
            </Button>
          </div>
        </section>

        {/* Section 4: Inputs & Selection Controls */}
        <section className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
          <div className="border-b border-border pb-4 mb-6">
            <h2 className="text-lg font-semibold text-text-primary">
              4. Form Controls & Badges
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              1px border styling, icons, and categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Search Requirements"
              placeholder="e.g. ISO 9001, Insurance..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              helperText="Filter across all RFP clauses"
            />

            <Input
              label="Tender Reference Number"
              placeholder="TP-2026-00142"
              className="font-mono"
              required
              helperText="Must match official tender notice"
            />

            <Select
              label="Requirement Category"
              options={[
                { value: "ALL", label: "All Categories" },
                { value: "ELIGIBILITY", label: "Eligibility Criteria" },
                { value: "TECHNICAL", label: "Technical Specifications" },
                { value: "FINANCIAL", label: "Financial & Turnover" },
                { value: "LEGAL", label: "Legal & Regulatory" },
              ]}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-text-secondary mr-2">Category Badges:</span>
            <Badge variant="category">Eligibility</Badge>
            <Badge variant="category">Technical</Badge>
            <Badge variant="category">Financial</Badge>
            <Badge variant="category">Legal</Badge>
            <Badge variant="accent">AI Extracted (98%)</Badge>
            <Badge variant="urgent">Expiring Soon (14d)</Badge>
          </div>
        </section>

        {/* Section 5: Empty States & Confirmation Modals */}
        <section className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
          <div className="border-b border-border pb-4 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                5. Empty State & Modal Dialog
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Restrained calm empty states and accessible confirmation overlays.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              Open Confirmation Modal
            </Button>
          </div>

          <EmptyState
            icon={UploadCloud}
            title="No Evidence Attached Yet"
            description="Upload supporting certificates, audits, or insurance policies to verify this compliance requirement."
            actionLabel="Upload Supporting Evidence"
            onAction={() => alert("Upload evidence triggered")}
            secondaryActionLabel="Browse Document Library"
            onSecondaryAction={() => alert("Browse library triggered")}
          />

          <ConfirmDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={() => {
              alert("Action confirmed!");
              setDialogOpen(false);
            }}
            title="Reject Extracted Requirement?"
            description="Are you sure you want to reject this requirement candidate? It will be permanently discarded and won't enter the compliance matrix."
            confirmLabel="Reject Candidate"
            variant="danger"
          />
        </section>
      </div>
    </div>
  );
}
