"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Menu, X, Layers, FileCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#173B4D]/90 backdrop-blur-md border-b border-[#2A5266] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-base text-white flex items-center gap-1.5">
              TenderPulse
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#2F7F7A] text-white rounded font-medium">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-[#A2B8C2] -mt-1 font-mono tracking-wide">
              Compliance Workspace
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#D1DFE5]">
          <a href="#problem-solution" className="hover:text-white transition-colors">
            Why TenderPulse
          </a>
          <a href="#workflow" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span>8-Stage Workflow</span>
          </a>
          <a href="#interactive-demo" className="hover:text-white transition-colors">
            Interactive Demo
          </a>
          <a href="#target-users" className="hover:text-white transition-colors">
            Industries
          </a>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard">
            <Button
              variant="accent"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="font-medium shadow-sm"
            >
              Launch Workspace
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#D1DFE5] hover:text-white hover:bg-[#2A5266] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#173B4D] border-b border-[#2A5266] px-4 pt-2 pb-6 space-y-3">
          <a
            href="#problem-solution"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#D1DFE5] hover:text-white"
          >
            Why TenderPulse
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#D1DFE5] hover:text-white"
          >
            8-Stage Workflow
          </a>
          <a
            href="#interactive-demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#D1DFE5] hover:text-white"
          >
            Interactive Demo
          </a>
          <a
            href="#target-users"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#D1DFE5] hover:text-white"
          >
            Industries
          </a>
          <div className="pt-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full block">
              <Button variant="accent" className="w-full justify-center">
                Launch Workspace
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
