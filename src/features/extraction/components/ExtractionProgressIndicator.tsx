"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Cpu, Layers, UserCheck } from "lucide-react";
import { ExtractedCandidateItem } from "../types/extractionTypes";

interface ExtractionProgressIndicatorProps {
  candidates: ExtractedCandidateItem[];
  documentName: string;
}

export function ExtractionProgressIndicator({
  candidates,
  documentName,
}: ExtractionProgressIndicatorProps) {
  const pendingCount = candidates.filter((c) => c.status === "PENDING").length;
  const acceptedCount = candidates.filter((c) => c.status === "ACCEPTED").length;
  const highConfidenceCount = candidates.filter((c) => c.confidence === "HIGH").length;
  const lowConfidenceCount = candidates.filter((c) => c.confidence === "LOW").length;

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-subtle space-y-4 min-w-0 max-w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-primary/10 text-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary tracking-tight">
              AI Requirement Extraction Pipeline
            </h2>
            <p className="text-[11px] text-text-secondary font-mono">
              Source File: <strong className="text-text-primary">{documentName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold bg-[#E8F4F3] text-accent px-2.5 py-1 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {candidates.length} Clauses Extracted
          </span>
          {lowConfidenceCount > 0 && (
            <span className="text-xs font-mono font-bold bg-[#FDF4E7] text-[#A56A20] px-2 py-1 rounded flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {lowConfidenceCount} Low Confidence Alert
            </span>
          )}
        </div>
      </div>

      {/* 5-Step Pipeline Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        <div className="p-2.5 rounded bg-surface-alt border border-border text-center space-y-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Step 1
          </span>
          <p className="text-xs font-semibold text-text-primary">RFP Uploaded</p>
        </div>

        <div className="p-2.5 rounded bg-surface-alt border border-border text-center space-y-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Step 2
          </span>
          <p className="text-xs font-semibold text-text-primary">OCR Cleaned</p>
        </div>

        <div className="p-2.5 rounded bg-surface-alt border border-border text-center space-y-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Step 3
          </span>
          <p className="text-xs font-semibold text-text-primary">Clause Splitter</p>
        </div>

        <div className="p-2.5 rounded bg-surface-alt border border-border text-center space-y-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Step 4
          </span>
          <p className="text-xs font-semibold text-text-primary">NLP Detection</p>
        </div>

        <div className="p-2.5 rounded bg-primary/10 border border-primary/30 text-center space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center justify-center gap-1 animate-pulse">
            <UserCheck className="w-3 h-3" /> Step 5
          </span>
          <p className="text-xs font-bold text-primary">Human Review Gate</p>
        </div>
      </div>
    </div>
  );
}
