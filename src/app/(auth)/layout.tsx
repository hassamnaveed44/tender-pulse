import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 antialiased">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left">
            <span className="font-bold tracking-tight text-base text-text-primary block">
              TenderPulse
            </span>
            <span className="text-[11px] text-text-secondary font-mono -mt-1 block">
              Tender Compliance Management
            </span>
          </div>
        </Link>
      </div>

      {/* Centered Auth Card */}
      <div className="w-full max-w-md flex justify-center">
        {children}
      </div>

      {/* Footer hint */}
      <p className="mt-8 text-xs text-text-secondary text-center">
        Protected by TenderPulse RBAC & Session Security
      </p>
    </div>
  );
}
