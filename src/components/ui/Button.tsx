import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/format";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-subtle",
        secondary:
          "bg-surface-alt text-text-primary hover:bg-[#E2E6E8] border border-border text-text-primary",
        accent:
          "bg-accent text-accent-foreground hover:bg-[#276B66] shadow-subtle",
        ghost:
          "text-text-primary hover:bg-surface-alt hover:text-text-primary",
        outline:
          "border border-border bg-surface text-text-primary hover:bg-surface-alt hover:border-text-secondary",
        danger:
          "bg-danger text-white hover:bg-[#9B3C3C] shadow-subtle",
        dangerGhost:
          "text-danger hover:bg-[#FCEEEE]",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-sm gap-1.5",
        md: "h-9 px-4 text-sm rounded-md gap-2",
        lg: "h-11 px-5 text-base rounded-md gap-2.5",
        icon: "h-9 w-9 p-0 rounded-md",
        iconSm: "h-7 w-7 p-0 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
