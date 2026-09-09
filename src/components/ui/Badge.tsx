import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/format";

const badgeVariants = cva(
  "inline-flex items-center font-medium border transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-border bg-surface-alt text-text-primary",
        neutral:
          "border-[#DCE1E3] bg-[#F7F8F6] text-text-secondary",
        primary:
          "border-transparent bg-primary text-white",
        accent:
          "border-transparent bg-accent-light text-accent font-semibold",
        category:
          "border-[#E2E8F0] bg-[#F1F5F9] text-[#334155] font-medium",
        verified:
          "border-[#C2E4DF] bg-[#E8F4F3] text-[#2F7F7A]",
        inreview:
          "border-[#F7E1B8] bg-[#FDF4E7] text-[#A56A20]",
        missing:
          "border-[#F8C8C8] bg-[#FCEEEE] text-[#B44848]",
        notstarted:
          "border-[#DCE1E3] bg-[#F0F2F4] text-[#66727D]",
        urgent:
          "border-[#F8C8C8] bg-[#FCEEEE] text-[#B44848] animate-pulse-subtle",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded-xs gap-1",
        md: "px-2.5 py-1 text-xs rounded-sm gap-1.5",
        lg: "px-3 py-1.5 text-sm rounded-sm gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
