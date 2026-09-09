import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Send, Sparkles, AlertCircle, FileSpreadsheet, FolderLock, Users, FileUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { fetchTenderWorkspaceData } from "@/features/requirements/services/requirementService";

export const dynamic = "force-dynamic";

interface TenderLayoutProps {
  children: React.ReactNode;
  params: {
    tenderId: string;
  };
}

export default async function TenderWorkspaceLayout({ children, params }: TenderLayoutProps) {
  const { tenderId } = params;
  const data = await fetchTenderWorkspaceData(tenderId);

  if (!data) {
    notFound();
  }

  const { tenderDetails } = data;

  const isUrgent = tenderDetails.daysRemaining <= 14;
  const isCritical = tenderDetails.daysRemaining <= 5;
  const isReadyToSubmit = tenderDetails.readinessPercentage === 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto min-w-0 max-w-full">
      {/* Persistent Tender Context Header */}
      <div className="bg-surface rounded-lg border border-border p-5 shadow-subtle space-y-4 min-w-0 max-w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border min-w-0">
          <div className="flex items-start gap-3 min-w-0">
            <Link
              href="/tenders"
              className="p-2 rounded-md border border-border hover:bg-surface-alt text-text-secondary hover:text-text-primary transition-colors mt-0.5 shrink-0"
              title="Back to Tenders List"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold bg-[#173B4D] text-white px-2 py-0.5 rounded">
                  {tenderDetails.referenceNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                    isCritical
                      ? "bg-danger/10 text-danger border border-danger/20 animate-pulse"
                      : isUrgent
                      ? "bg-[#FDF4E7] text-[#A56A20] border border-[#F7E1B8]"
                      : "bg-surface-alt text-text-secondary"
                  }`}
                >
                  {isCritical && <AlertCircle className="w-3 h-3" />}
                  {tenderDetails.daysRemaining} days left
                </span>
              </div>

              <h1 className="text-xl font-bold tracking-tight text-text-primary truncate">
                {tenderDetails.title}
              </h1>

              <p className="text-xs text-text-secondary font-mono truncate">
                Client: {tenderDetails.clientName || "Direct Proposal"} • Target 100% Readiness to Submit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0 self-end md:self-center">
            <ReadinessGauge
              percentage={tenderDetails.readinessPercentage}
              size="md"
              totalMandatory={tenderDetails.totalRequirements}
              verifiedMandatory={tenderDetails.verifiedRequirements}
            />

            <Button
              variant={isReadyToSubmit ? "primary" : "secondary"}
              size="sm"
              leftIcon={<Send className="w-4 h-4" />}
            >
              {isReadyToSubmit ? "Submit Proposal" : "Submission Locked"}
            </Button>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 min-w-0 max-w-full text-xs font-medium">
          <Link
            href={`/tenders/${tenderId}`}
            className="px-3 py-1.5 rounded-md bg-primary text-white font-semibold flex items-center gap-1.5 shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Compliance Matrix</span>
          </Link>

          <Link
            href={`/tenders/${tenderId}/review`}
            className="px-3 py-1.5 rounded-md bg-surface-alt hover:bg-surface-alt/80 text-text-secondary hover:text-text-primary flex items-center gap-1.5 shrink-0"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Extraction Review</span>
          </Link>

          <Link
            href={`/documents`}
            className="px-3 py-1.5 rounded-md bg-surface-alt hover:bg-surface-alt/80 text-text-secondary hover:text-text-primary flex items-center gap-1.5 shrink-0"
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>Evidence Documents</span>
          </Link>

          <Link
            href={`/settings`}
            className="px-3 py-1.5 rounded-md bg-surface-alt hover:bg-surface-alt/80 text-text-secondary hover:text-text-primary flex items-center gap-1.5 shrink-0"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team & Permissions</span>
          </Link>
        </div>
      </div>

      {/* Main Viewport */}
      <div>{children}</div>
    </div>
  );
}
