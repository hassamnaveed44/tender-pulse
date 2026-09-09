"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, FilePlus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RfpUploadDropzone } from "@/features/tenders/components/RfpUploadDropzone";
import { createTenderAction } from "@/features/tenders/actions/tenderActions";

export default function NewTenderPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [createdTenderId, setCreatedTenderId] = useState<string | null>(null);
  const [createdRef, setCreatedRef] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateTender(e: React.FormEvent) {
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

    setCreatedTenderId(res.tenderId || "tender-demo");
    setCreatedRef(res.referenceNumber || "TP-2026-00142");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/tenders"
            className="p-2 rounded-md border border-border hover:bg-surface-alt text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              Create Tender & Upload RFP
            </h1>
            <p className="text-xs text-text-secondary">
              Initialize proposal metadata and run automated AI requirement extractions.
            </p>
          </div>
        </div>
      </div>

      {!createdTenderId ? (
        /* Step 1: Initialize Metadata Form */
        <div className="bg-surface rounded-lg border border-border p-6 shadow-subtle space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <FilePlus className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold text-text-primary">
              Step 1: Tender Identification & Schedule
            </h2>
          </div>

          {error && (
            <div className="p-3 rounded bg-danger/10 border border-danger/20 text-xs text-danger font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateTender} className="space-y-4">
            <Input
              label="Tender / RFP Title"
              placeholder="e.g. Metropolitan Transit Rail Electrification & Signaling System"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Client / Bidding Authority"
                placeholder="e.g. State Department of Transportation"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />

              <Input
                label="Reference Number (Mono Tag)"
                placeholder="e.g. TP-2026-00142 (Auto if blank)"
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

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-text-secondary font-mono">
                Step 1 of 2 • Create workspace record
              </span>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isLoading}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Create Tender & Continue to Upload
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* Step 2: RFP Dropzone Upload */
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-surface border border-border flex items-center justify-between shadow-subtle">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-accent/10 text-accent flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold bg-[#173B4D] text-white px-2 py-0.5 rounded">
                  {createdRef}
                </span>
                <h3 className="text-sm font-bold text-text-primary mt-1">{title}</h3>
              </div>
            </div>

            <span className="text-xs font-semibold text-accent bg-[#E8F4F3] px-2.5 py-1 rounded">
              Tender Created
            </span>
          </div>

          <RfpUploadDropzone tenderId={createdTenderId} />
        </div>
      )}
    </div>
  );
}
