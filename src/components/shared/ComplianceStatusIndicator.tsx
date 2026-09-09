import React from "react";
import { CheckCircle2, Clock, AlertCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils/format";

export type ComplianceStatus = "VERIFIED" | "IN_REVIEW" | "MISSING" | "NOT_STARTED";

export interface StatusConfig {
  label: string;
  dotSymbol: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
}

export const STATUS_MAP: Record<ComplianceStatus, StatusConfig> = {
  VERIFIED: {
    label: "VERIFIED",
    dotSymbol: "●",
    icon: CheckCircle2,
    color: "#2F7F7A",
    bgColor: "bg-[#E8F4F3]",
    borderColor: "border-[#C2E4DF]",
    textColor: "text-[#2F7F7A]",
    description: "Compliant & verified with valid evidence",
  },
  IN_REVIEW: {
    label: "IN REVIEW",
    dotSymbol: "◐",
    icon: Clock,
    color: "#A56A20",
    bgColor: "bg-[#FDF4E7]",
    borderColor: "border-[#F7E1B8]",
    textColor: "text-[#A56A20]",
    description: "Evidence attached and pending reviewer verification",
  },
  MISSING: {
    label: "MISSING",
    dotSymbol: "!",
    icon: AlertCircle,
    color: "#B44848",
    bgColor: "bg-[#FCEEEE]",
    borderColor: "border-[#F8C8C8]",
    textColor: "text-[#B44848]",
    description: "Missing required evidence or expired document",
  },
  NOT_STARTED: {
    label: "NOT STARTED",
    dotSymbol: "○",
    icon: Circle,
    color: "#66727D",
    bgColor: "bg-[#F0F2F4]",
    borderColor: "border-[#DCE1E3]",
    textColor: "text-[#66727D]",
    description: "No owner assigned or evidence attached yet",
  },
};

export interface ComplianceStatusIndicatorProps {
  status: ComplianceStatus | string;
  size?: "sm" | "md" | "lg";
  variant?: "badge" | "dot" | "subtle" | "pill";
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ComplianceStatusIndicator({
  status,
  size = "md",
  variant = "badge",
  showLabel = true,
  className,
  onClick,
}: ComplianceStatusIndicatorProps) {
  // Safe fallback for any unexpected status string
  const normalizedStatus: ComplianceStatus =
    status in STATUS_MAP ? (status as ComplianceStatus) : "NOT_STARTED";
  const config = STATUS_MAP[normalizedStatus];
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  if (variant === "dot") {
    return (
      <span
        title={`${config.label}: ${config.description}`}
        className={cn("inline-flex items-center justify-center cursor-help", className)}
      >
        <IconComponent
          className={cn(iconSizes[size], config.textColor, "transition-transform hover:scale-110")}
        />
      </span>
    );
  }

  if (variant === "subtle") {
    return (
      <span
        className={cn(
          "inline-flex items-center font-medium font-mono text-xs tracking-wider",
          config.textColor,
          className
        )}
      >
        <IconComponent className={cn(iconSizes[size], "mr-1.5 shrink-0")} />
        {showLabel && <span>{config.label}</span>}
      </span>
    );
  }

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center font-medium rounded-sm border transition-all select-none",
        sizeClasses[size],
        config.bgColor,
        config.borderColor,
        config.textColor,
        onClick && "cursor-pointer hover:opacity-80 active:scale-95",
        className
      )}
      title={config.description}
    >
      <IconComponent className={cn(iconSizes[size], "shrink-0")} />
      {showLabel && (
        <span className="font-semibold tracking-wide uppercase text-[11px]">
          {config.label}
        </span>
      )}
    </span>
  );
}
