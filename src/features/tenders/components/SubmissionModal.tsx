"use client";

import React, { useState, useEffect } from "react";
import { X, Send, AlertTriangle, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenderTitle: string;
  referenceNumber: string;
  readinessPercentage: number;
  unverifiedMandatory: { id: string; title: string }[];
  onSubmitSuccess?: () => void;
}

export function SubmissionModal({
  isOpen,
  onClose,
  tenderTitle,
  referenceNumber,
  readinessPercentage,
  unverifiedMandatory,
  onSubmitSuccess,
}: SubmissionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const is100Percent = readinessPercentage === 100;

  useEffect(() => {
    if (isOpen && is100Percent && !isSubmitted) {
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Fallback gracefully if canvas context not ready
      }
    }
  }, [isOpen, is100Percent, isSubmitted]);

  if (!isOpen) return null;

  function handleConfirmSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess();
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface rounded-lg border border-border shadow-dropdown max-w-lg w-full p-6 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-alt transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!is100Percent ? (
          /* Submission Blocker (Readiness < 100%) */
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="p-2.5 rounded bg-danger/10 text-danger shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold bg-danger/10 text-danger px-2 py-0.5 rounded">
                  HTTP 409 READINESS INCOMPLETE
                </span>
                <h2 className="text-base font-bold text-text-primary mt-1">
                  Submission Locked ({readinessPercentage}% Readiness)
                </h2>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              TenderPulse enforces a 100% compliance verification barrier before final proposal submission. You currently have{" "}
              <strong className="text-danger">{unverifiedMandatory.length} mandatory requirement(s)</strong> unverified or lacking evidence.
            </p>

            <div className="space-y-2 bg-danger/5 border border-danger/20 rounded-md p-3 max-h-48 overflow-y-auto">
              <h4 className="text-xs font-bold text-danger uppercase tracking-wider">
                Unverified Mandatory Requirements:
              </h4>
              <ul className="space-y-1.5 text-xs text-text-primary">
                {unverifiedMandatory.map((req) => (
                  <li key={req.id} className="flex items-start gap-1.5 font-medium">
                    <span className="text-danger font-bold">•</span>
                    <span>{req.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-text-muted font-mono">
                Resolve blockers to reach 100%
              </span>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Back to Matrix
              </Button>
            </div>
          </div>
        ) : isSubmitted ? (
          /* Submission Confirmed Success */
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-[#E8F4F3] text-accent mx-auto flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="font-mono text-xs font-bold bg-[#173B4D] text-white px-2.5 py-1 rounded">
                {referenceNumber}
              </span>
              <h2 className="text-lg font-bold text-text-primary mt-2">
                Proposal Submitted Successfully!
              </h2>
              <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
                100% verified compliance matrix and evidence package logged in audit trail.
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={onClose} className="mx-auto">
              Close & View Workspace
            </Button>
          </div>
        ) : (
          /* Ready to Submit (100% Readiness) */
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="p-2.5 rounded bg-accent/10 text-accent shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold bg-[#E8F4F3] text-accent px-2 py-0.5 rounded">
                  100% COMPLIANCE VERIFIED
                </span>
                <h2 className="text-base font-bold text-text-primary mt-1">
                  Ready for Final Submission
                </h2>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              All mandatory eligibility, technical, financial, and legal requirements are 100% verified with linked evidence documents.
            </p>

            <div className="p-3 bg-[#E8F4F3]/50 border border-accent/30 rounded-md font-mono text-xs text-accent font-bold">
              ✓ All {readinessPercentage}% requirements verified & evidence attached.
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                onClick={handleConfirmSubmit}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Confirm & Submit Proposal
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
