import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, FileText, ArrowRight } from "lucide-react";
import { fetchExtractedCandidates, fetchTenderDetailsForReview } from "@/features/extraction/services/extractionService";
import { ExtractionProgressIndicator } from "@/features/extraction/components/ExtractionProgressIndicator";
import { ExtractionReviewTable } from "@/features/extraction/components/ExtractionReviewTable";

export const dynamic = "force-dynamic";

interface ReviewPageProps {
  params: {
    tenderId: string;
  };
}

export default async function ExtractionReviewPage({ params }: ReviewPageProps) {
  const { tenderId } = params;

  const [candidates, tender] = await Promise.all([
    fetchExtractedCandidates(tenderId),
    fetchTenderDetailsForReview(tenderId),
  ]);

  if (!tender) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto min-w-0 max-w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border min-w-0">
        <div className="flex items-start gap-3">
          <Link
            href={`/tenders`}
            className="p-2 rounded-md border border-border hover:bg-surface-alt text-text-secondary hover:text-text-primary transition-colors mt-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold bg-[#173B4D] text-white px-2 py-0.5 rounded">
                {tender.referenceNumber}
              </span>
              <span className="text-xs font-semibold bg-[#FDF4E7] text-[#A56A20] px-2 py-0.5 rounded font-mono">
                AI Extraction Audit Gate
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary truncate">
              {tender.title}
            </h1>
            <p className="text-xs text-text-secondary font-mono">
              Client: {tender.clientName || "Direct Proposal"} • RFP Source File: {tender.documentName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/tenders/${tenderId}`}>
            <span className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1">
              <span>Skip Review to Workspace Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* 1. Extraction Pipeline Stepper & Progress Stats */}
      <ExtractionProgressIndicator
        candidates={candidates}
        documentName={tender.documentName}
      />

      {/* 2. Interactive Staging Table */}
      <ExtractionReviewTable candidates={candidates} tenderId={tenderId} />
    </div>
  );
}
