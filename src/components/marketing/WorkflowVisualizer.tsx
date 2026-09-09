"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  Cpu,
  UserCheck,
  UserPlus,
  Paperclip,
  CheckCircle2,
  BarChart3,
  Send,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: "Upload RFP",
    short: "PDF Ingestion",
    icon: UploadCloud,
    description:
      "Upload multi-page RFP, addenda, or tender specifications directly to secure cloud storage via presigned URLs.",
    detail: "Supports complex PDFs with tables, appendixes, and legal clauses. Files never pass through serverless timeouts.",
  },
  {
    step: 2,
    title: "Extract Requirements",
    short: "Automated Parsing",
    icon: Cpu,
    description:
      "AI extraction background worker parses text, identifies mandatory clauses, detects categories, and assigns confidence scores.",
    detail: "Every detected clause preserves source page references (e.g. 'Source: RFP.pdf — Page 17').",
  },
  {
    step: 3,
    title: "Human Review Gate",
    short: "Validation & Edits",
    icon: UserCheck,
    description:
      "Nothing enters the official compliance matrix without human review. Accept, edit inline, or reject proposed candidate requirements.",
    detail: "Eliminates hallucination risk. You remain completely in control of the compliance scope.",
  },
  {
    step: 4,
    title: "Assign Responsibilities",
    short: "Team Ownership",
    icon: UserPlus,
    description:
      "Distribute specific technical, legal, and financial requirements to domain specialists with due dates and notifications.",
    detail: "Full ownership history is tracked in immutable audit logs.",
  },
  {
    step: 5,
    title: "Attach Evidence",
    short: "Document Linking",
    icon: Paperclip,
    description:
      "Attach ISO certificates, insurance policies, financial audits, or engineering CVs from the central document library.",
    detail: "Automatic document expiry tracking alerts your team 30 days before any certificate lapses.",
  },
  {
    step: 6,
    title: "Verify Compliance",
    short: "Peer Verification",
    icon: CheckCircle2,
    description:
      "Reviewers inspect uploaded evidence against RFP requirements and mark them as VERIFIED, transitioning status from amber to teal.",
    detail: "Status dot morphs seamlessly to confirm complete verification.",
  },
  {
    step: 7,
    title: "Track Readiness",
    short: "Live Score Rollup",
    icon: BarChart3,
    description:
      "Live mathematical scoring calculates the percentage of mandatory requirements verified across the entire bid.",
    detail: "Instant visual visibility on missing items, impending deadlines, and blocker items.",
  },
  {
    step: 8,
    title: "Submit with Confidence",
    short: "Zero Risk Bid",
    icon: Send,
    description:
      "Submission barrier strictly enforces 100% mandatory compliance. Export formatted compliance matrix ready for tender authority.",
    detail: "No more disqualified tenders due to an expired certificate or overlooked appendix clause.",
  },
];

export function WorkflowVisualizer() {
  const [activeStep, setActiveStep] = useState(0);
  const current = WORKFLOW_STEPS[activeStep];
  const CurrentIcon = current.icon;

  return (
    <section id="workflow" className="py-20 bg-surface-alt border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="accent" size="sm" className="mb-3">
            Core Architecture
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
            The 8-Stage Tender Compliance Lifecycle
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary">
            A structured requirement-to-evidence workflow designed specifically for engineering, procurement, and bid teams.
          </p>
        </div>

        {/* 8-Step Grid Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-10">
          {WORKFLOW_STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "flex flex-col items-center text-center p-3 rounded-md border transition-all duration-150 text-xs",
                  isActive
                    ? "bg-primary text-white border-primary shadow-subtle scale-[1.02]"
                    : "bg-surface text-text-secondary border-border hover:bg-white hover:text-text-primary hover:border-[#B9C2C7]"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[10px] px-1.5 py-0.5 rounded mb-2",
                    isActive ? "bg-accent text-white" : "bg-surface-alt text-text-secondary"
                  )}
                >
                  STEP {s.step}
                </span>
                <Icon className={cn("w-5 h-5 mb-1.5", isActive ? "text-accent" : "text-text-primary")} />
                <span className="font-medium truncate w-full">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        <div className="max-w-4xl mx-auto bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-subtle">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-accent-light border border-[#C2E4DF] flex items-center justify-center text-accent shrink-0 shadow-sm">
                <CurrentIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-accent">STAGE {current.step} OF 8</span>
                  <span className="text-text-muted">•</span>
                  <span className="text-xs text-text-secondary uppercase tracking-wider">{current.short}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mt-0.5">
                  {current.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="px-3 py-1.5 text-xs font-medium rounded border border-border bg-surface-alt text-text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E2E6E8]"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveStep((prev) => Math.min(WORKFLOW_STEPS.length - 1, prev + 1))}
                disabled={activeStep === WORKFLOW_STEPS.length - 1}
                className="px-3 py-1.5 text-xs font-medium rounded border border-transparent bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-hover flex items-center gap-1"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Operational Objective
              </h4>
              <p className="text-sm text-text-primary leading-relaxed">
                {current.description}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Technical Safeguard
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed bg-surface-alt p-3.5 rounded-md border border-border">
                {current.detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
