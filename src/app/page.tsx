import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { WorkflowVisualizer } from "@/components/marketing/WorkflowVisualizer";
import { LiveExtractionDemo } from "@/components/marketing/LiveExtractionDemo";
import { ValuePillars } from "@/components/marketing/ValuePillars";
import { Footer } from "@/components/marketing/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export default function MarketingLandingPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary selection:bg-accent selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Screen 1: Hero Section with GSAP Stagger */}
      <HeroSection />

      {/* 8-Stage Compliance Lifecycle Workflow */}
      <WorkflowVisualizer />

      {/* Live Interactive Extraction Review Gate Demo */}
      <LiveExtractionDemo />

      {/* Value Pillars & Target Industries */}
      <ValuePillars />

      {/* Bottom Conversion CTA Banner */}
      <section className="py-20 bg-[#173B4D] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#173B4D] via-[#1F495D] to-[#173B4D] opacity-90 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A566E] border border-[#3A6B88] text-xs text-[#E1EDF2] mb-6 font-mono">
            <Lock className="w-3.5 h-3.5 text-accent" />
            <span>ENTERPRISE GRADE DATA INTEGRITY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Stop losing qualified bids to missed compliance details.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#C5D7DF] max-w-2xl mx-auto">
            Get instant visibility on mandatory requirements, assign responsibilities, and ensure 100% submission readiness.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="accent"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-semibold text-white px-8 shadow-lg shadow-accent/20"
              >
                Launch TenderPulse Workspace
              </Button>
            </Link>
            <Link href="/components-preview">
              <Button
                variant="outline"
                size="lg"
                className="border-[#3A647B] bg-[#1E475C]/60 text-white hover:bg-[#25546D] hover:text-white"
              >
                Explore Component Library
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
