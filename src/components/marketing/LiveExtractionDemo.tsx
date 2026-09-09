"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Check,
  X,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ComplianceStatusIndicator } from "@/components/shared/ComplianceStatusIndicator";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { cn } from "@/lib/utils/format";

interface DemoCandidate {
  id: string;
  title: string;
  clause: string;
  category: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  sourcePage: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

const INITIAL_CANDIDATES: DemoCandidate[] = [
  {
    id: "ext-1",
    title: "ISO 9001:2015 Quality Accreditation",
    clause: "The contractor must furnish an accredited ISO 9001:2015 certificate valid through contract completion.",
    category: "Eligibility",
    confidence: "HIGH",
    sourcePage: 14,
    status: "PENDING",
  },
  {
    id: "ext-2",
    title: "Public Liability Insurance Policy ($50M)",
    clause: "Submit Certificate of Currency for public and products liability of not less than $50,000,000.",
    category: "Legal",
    confidence: "HIGH",
    sourcePage: 29,
    status: "PENDING",
  },
  {
    id: "ext-3",
    title: "Key Personnel Safety Certification",
    clause: "The Lead Signaling Engineer must possess a valid Level 4 Rail Safety Credential with 10+ years experience.",
    category: "Technical",
    confidence: "MEDIUM",
    sourcePage: 47,
    status: "PENDING",
  },
];

export function LiveExtractionDemo() {
  const [candidates, setCandidates] = useState<DemoCandidate[]>(INITIAL_CANDIDATES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number | null>(null);

  const acceptedCount = candidates.filter((c) => c.status === "ACCEPTED").length;
  const pendingCount = candidates.filter((c) => c.status === "PENDING").length;

  const handleSimulateExtraction = () => {
    setIsProcessing(true);
    setPipelineStep(1);

    setTimeout(() => setPipelineStep(2), 500);
    setTimeout(() => setPipelineStep(3), 1000);
    setTimeout(() => {
      setIsProcessing(false);
      setPipelineStep(null);
      setCandidates(INITIAL_CANDIDATES);
    }, 1500);
  };

  const handleDecision = (id: string, decision: "ACCEPTED" | "REJECTED") => {
    setCandidates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: decision } : item))
    );
  };

  const handleReset = () => {
    setCandidates(INITIAL_CANDIDATES);
  };

  return (
    <section id="interactive-demo" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="verified" size="sm" className="mb-3">
            Interactive Testbed
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Experience the Human-in-the-Loop Review Gate
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary">
            See how TenderPulse extracts candidate clauses from RFP documents and lets you accept or discard before anything enters your official compliance checklist.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-surface rounded-xl border border-border shadow-subtle overflow-hidden">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 bg-surface-alt border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-md border border-border text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">
                  State_DOT_Rail_Signaling_RFP.pdf
                </h4>
                <p className="text-xs text-text-secondary font-mono">
                  128 Pages • Extracted 3 Candidate Requirements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleReset}
              >
                Reset Demo
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                isLoading={isProcessing}
                onClick={handleSimulateExtraction}
              >
                Re-Run AI Parser
              </Button>
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-6 bg-accent-light/50 border-b border-[#C2E4DF] flex items-center justify-center gap-4 text-xs font-mono text-accent">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>
                {pipelineStep === 1 && "Ingesting PDF text stream..."}
                {pipelineStep === 2 && "Detecting mandatory compliance clauses..."}
                {pipelineStep === 3 && "Scoring confidence & source page mappings..."}
              </span>
            </div>
          )}

          {/* Staged Candidates List */}
          <div className="p-4 sm:p-6 divide-y divide-border">
            {candidates.map((c) => {
              const isAccepted = c.status === "ACCEPTED";
              const isRejected = c.status === "REJECTED";
              const isPending = c.status === "PENDING";

              return (
                <div
                  key={c.id}
                  className={cn(
                    "py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300",
                    isAccepted && "bg-[#E8F4F3]/40 px-3 rounded-md border border-[#C2E4DF] my-1",
                    isRejected && "opacity-40 line-through bg-surface-alt px-3 rounded-md my-1"
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-text-primary">
                        {c.title}
                      </span>
                      <Badge variant="category" size="sm">
                        {c.category}
                      </Badge>
                      <Badge
                        variant={c.confidence === "HIGH" ? "verified" : "inreview"}
                        size="sm"
                        className="font-mono text-[10px]"
                      >
                        {c.confidence} CONFIDENCE
                      </Badge>
                      <span className="text-[11px] font-mono text-text-secondary">
                        Source: RFP.pdf — Page {c.sourcePage}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      &ldquo;{c.clause}&rdquo;
                    </p>
                  </div>

                  {/* Decision Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isPending ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<X className="w-3.5 h-3.5 text-danger" />}
                          onClick={() => handleDecision(c.id, "REJECTED")}
                          className="hover:border-danger hover:text-danger"
                        >
                          Reject
                        </Button>
                        <Button
                          variant="accent"
                          size="sm"
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                          onClick={() => handleDecision(c.id, "ACCEPTED")}
                        >
                          Accept to Matrix
                        </Button>
                      </>
                    ) : isAccepted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent font-mono">
                        <CheckCircle2 className="w-4 h-4" />
                        ADDED TO MATRIX (NOT STARTED)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary font-mono">
                        <X className="w-4 h-4" />
                        DISCARDED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Outcome Summary */}
          <div className="p-4 sm:p-5 bg-surface-alt border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="font-medium text-text-primary">
                Review Status: {acceptedCount} Accepted, {candidates.filter((c) => c.status === "REJECTED").length} Rejected, {pendingCount} Pending
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Zero hallucinations reach your matrix</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
