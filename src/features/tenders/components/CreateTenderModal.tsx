"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createTenderAction } from "../actions/tenderActions";

interface CreateTenderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTenderModal({ isOpen, onClose }: CreateTenderModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await createTenderAction({
      title,
      clientName,
      referenceNumber: referenceNumber || undefined,
      submissionDeadline,
    });

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to create tender.");
      return;
    }

    onClose();
    router.push(`/tenders/new?tenderId=${res.tenderId}`);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface rounded-lg border border-border shadow-dropdown max-w-lg w-full p-6 space-y-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-alt transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <div className="p-2 rounded bg-primary/10 text-primary">
            <FilePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Create New Tender Proposal
            </h2>
            <p className="text-xs text-text-secondary">
              Initialize a compliance project and prepare for RFP requirement extraction.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded bg-danger/10 border border-danger/20 text-xs text-danger font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tender / RFP Title"
            placeholder="e.g. Metropolitan Transit Rail Electrification & Signaling System"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Client / Authority Name"
              placeholder="e.g. State Dept of Transportation"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />

            <Input
              label="Reference Number (Mono ID)"
              placeholder="e.g. TP-2026-00142 (Auto if empty)"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>

          <Input
            label="Submission Deadline Date"
            type="date"
            value={submissionDeadline}
            onChange={(e) => setSubmissionDeadline(e.target.value)}
            required
          />

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading} leftIcon={<Sparkles className="w-4 h-4" />}>
              Create & Proceed to RFP Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
