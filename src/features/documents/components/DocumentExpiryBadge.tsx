import React from "react";
import { CheckCircle2, AlertTriangle, ShieldAlert, Calendar } from "lucide-react";
import { ExpiryStatus } from "../types/documentTypes";

interface DocumentExpiryBadgeProps {
  status: ExpiryStatus;
  daysToExpiry: number | null;
}

export function DocumentExpiryBadge({ status, daysToExpiry }: DocumentExpiryBadgeProps) {
  if (status === "EXPIRED") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 rounded animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5" />
        EXPIRED ({Math.abs(daysToExpiry || 0)}d ago)
      </span>
    );
  }

  if (status === "EXPIRING_SOON") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold bg-[#FDF4E7] text-[#A56A20] border border-[#F7E1B8] px-2 py-0.5 rounded">
        <ShieldAlert className="w-3.5 h-3.5" />
        Expires in {daysToExpiry}d
      </span>
    );
  }

  if (status === "VALID") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold bg-[#E8F4F3] text-accent border border-accent/20 px-2 py-0.5 rounded">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Valid ({daysToExpiry}d)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-text-muted bg-surface-alt px-2 py-0.5 rounded">
      <Calendar className="w-3.5 h-3.5" />
      No Expiry
    </span>
  );
}
