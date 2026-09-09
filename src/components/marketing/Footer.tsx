import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#17212B] text-[#D1DFE5] border-t border-[#243544] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#243544]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-base text-white">
                TenderPulse
              </span>
              <p className="text-xs text-[#8E9AA5] font-mono">
                Tender & RFP Compliance Management Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#8E9AA5]">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/tenders" className="hover:text-white transition-colors">
              Tenders
            </Link>
            <Link href="/documents" className="hover:text-white transition-colors">
              Documents Library
            </Link>
            <Link href="/settings" className="hover:text-white transition-colors">
              Organization Settings
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#66727D]">
          <p>© {new Date().getFullYear()} TenderPulse Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Inter + JetBrains Mono Design System</span>
            <span>•</span>
            <span>Document-Centric Calm</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
