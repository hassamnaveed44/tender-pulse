import React from "react";
import Link from "next/link";
import { AlertOctagon, FileWarning, ArrowRight } from "lucide-react";
import { ExpiringDocAlert } from "../services/dashboardService";

interface AttentionFeedProps {
  expiringDocs: ExpiringDocAlert[];
}

export function AttentionFeed({ expiringDocs }: AttentionFeedProps) {
  if (expiringDocs.length === 0) return null;

  return (
    <div className="bg-[#FFFDF9] rounded-lg border border-[#F7E1B8] p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded bg-[#FDF4E7] text-[#A56A20] shrink-0 mt-0.5">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-[#7A4B10] flex items-center gap-1.5">
            <span>Compliance Attention Required</span>
            <span className="bg-[#A56A20] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {expiringDocs.length} Alerts
            </span>
          </h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#A56A20]">
            {expiringDocs.map((doc) => (
              <span key={doc.id} className="inline-flex items-center gap-1">
                <FileWarning className="w-3.5 h-3.5 shrink-0" />
                <strong className="font-semibold">{doc.fileName}</strong>
                {doc.isExpired ? (
                  <span className="text-danger font-bold uppercase text-[10px]">(Expired)</span>
                ) : (
                  <span>(Expires in {doc.daysToExpiry} days)</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/documents"
        className="text-xs font-semibold text-[#A56A20] hover:text-[#7A4B10] flex items-center gap-1 shrink-0 self-end sm:self-center"
      >
        <span>Manage Evidence Library</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
