import React from "react";
import { cn } from "@/lib/utils/format";
import { CheckCircle, AlertTriangle } from "lucide-react";

export interface ReadinessGaugeProps {
  percentage: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  showBreakdown?: boolean;
  totalMandatory?: number;
  verifiedMandatory?: number;
  className?: string;
}

export function ReadinessGauge({
  percentage,
  size = "md",
  showLabel = true,
  showBreakdown = false,
  totalMandatory,
  verifiedMandatory,
  className,
}: ReadinessGaugeProps) {
  const isComplete = percentage === 100;
  const isZero = percentage === 0;

  // Sizing configurations
  const dimensions = {
    sm: { diameter: 44, strokeWidth: 4, textSize: "text-xs", labelSize: "text-[9px]" },
    md: { diameter: 64, strokeWidth: 5, textSize: "text-sm font-semibold", labelSize: "text-[10px]" },
    lg: { diameter: 96, strokeWidth: 7, textSize: "text-xl font-bold", labelSize: "text-xs" },
    xl: { diameter: 140, strokeWidth: 10, textSize: "text-3xl font-bold", labelSize: "text-sm" },
  };

  const { diameter, strokeWidth, textSize, labelSize } = dimensions[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Colors based on readiness
  const strokeColor = isComplete ? "#2F7F7A" : isZero ? "#DCE1E3" : "#A56A20";
  const textColor = isComplete ? "text-[#2F7F7A]" : isZero ? "text-text-secondary" : "text-[#A56A20]";

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: diameter, height: diameter }}>
        <svg
          width={diameter}
          height={diameter}
          className="transform -rotate-90"
        >
          {/* Background Track */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke="#E8ECEE"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn(textSize, textColor, "leading-none tracking-tight")}>
            {percentage}%
          </span>
          {size === "xl" && (
            <span className={cn(labelSize, "text-text-secondary mt-1 uppercase font-medium tracking-wider")}>
              {isComplete ? "Ready" : "Readiness"}
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            {isComplete ? (
              <CheckCircle className="w-4 h-4 text-accent shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
            )}
            <span className="text-xs font-semibold text-text-primary">
              {isComplete ? "Submission Ready" : "Compliance Incomplete"}
            </span>
          </div>
          {totalMandatory !== undefined && verifiedMandatory !== undefined && (
            <p className="text-[11px] text-text-secondary mt-0.5">
              {verifiedMandatory} of {totalMandatory} mandatory requirements verified
            </p>
          )}
        </div>
      )}
    </div>
  );
}
