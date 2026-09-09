"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, FileText, Upload, AlertCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ComplianceStatusIndicator } from "@/components/shared/ComplianceStatusIndicator";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { Badge } from "@/components/ui/Badge";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!prefersReducedMotion) {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.5 }
        )
          .fromTo(
            headlineRef.current,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.7 },
            "-=0.3"
          )
          .fromTo(
            descRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4"
          )
          .fromTo(
            ctaRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            "-=0.3"
          )
          .fromTo(
            mockupRef.current,
            { opacity: 0, y: 40, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8 },
            "-=0.4"
          );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#173B4D] text-white"
    >
      {/* Background Architectural Mesh Image with Deep Oceanic Teal Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-luminosity">
        <Image
          src="/images/hero-bg.jpg"
          alt="TenderPulse Architecture"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Radiant Gradient Grids */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#173B4D]/60 via-[#173B4D]/90 to-[#173B4D] z-0 pointer-events-none" />
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] bg-[#39735A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Release Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#244C60] border border-[#35637C] text-xs text-[#E1EDF2] mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Human-in-the-Loop Tender Compliance Platform</span>
            <span className="text-[10px] bg-[#2F7F7A] text-white px-1.5 py-0.5 rounded font-mono">v1.0</span>
          </div>

          {/* Stagger Headline */}
          <h1
            ref={headlineRef}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]"
          >
            Missed requirements shouldn&apos;t cost you a bid.
          </h1>

          {/* Subtitle */}
          <p
            ref={descRef}
            className="mt-6 text-base sm:text-lg text-[#C5D7DF] leading-relaxed max-w-2xl font-normal"
          >
            TenderPulse centralizes tender compliance management. Automatically extract RFP requirements into a verified matrix, attach auditable evidence, and track submission readiness before critical deadlines.
          </p>

          {/* Action CTAs */}
          <div
            ref={ctaRef}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="accent"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto justify-center font-semibold text-white px-6 shadow-lg shadow-accent/20"
              >
                Launch Live Workspace
              </Button>
            </Link>
            <a href="#interactive-demo" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto justify-center border-[#3A647B] bg-[#1E475C]/60 text-white hover:bg-[#25546D] hover:text-white"
              >
                Try Extraction Demo
              </Button>
            </a>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#A8C4D0]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>Human verification gate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>Document expiry alerts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>100% Mandatory audit trail</span>
            </div>
          </div>
        </div>

        {/* Live Mockup Workspace Component */}
        <div ref={mockupRef} className="mt-12 sm:mt-16 max-w-5xl mx-auto">
          <div className="rounded-xl border border-[#35637C] bg-[#17212B]/90 shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Header bar */}
            <div className="px-4 py-3 bg-[#111A22] border-b border-[#243544] flex items-center justify-between text-xs text-[#8E9AA5]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#B44848]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#A56A20]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#2F7F7A]/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-[#A8C4D0]">
                  TP-2026-00142 / Metropolitan Transit Rail Electrification & Signaling
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-accent">
                <span>● READINESS ENGINE ACTIVE</span>
              </div>
            </div>

            {/* Simulated Workspace Interior */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#131C24]">
              {/* Left 8 cols: Compliance Matrix Preview */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#8E9AA5] px-2 pb-1 border-b border-[#243544]">
                  <span>REQUIREMENT & CLAUSE</span>
                  <div className="flex items-center gap-8">
                    <span>EVIDENCE</span>
                    <span>STATUS</span>
                  </div>
                </div>

                {/* Row 1: Verified */}
                <div className="p-3 rounded-md bg-[#1B2732] border border-[#2B3E4F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-accent/40 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#7A92A2] mt-0.5">REQ-01</span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Valid ISO 9001:2015 Quality Management Certification
                      </p>
                      <span className="text-[11px] text-[#7A92A2] font-mono">
                        Source: RFP.pdf — Page 14 • Eligibility
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 pl-7 sm:pl-0">
                    <span className="text-xs text-[#A8C4D0] font-mono bg-[#111A22] px-2 py-0.5 rounded border border-[#243544]">
                      ISO_9001_Apex.pdf
                    </span>
                    <ComplianceStatusIndicator status="VERIFIED" size="sm" />
                  </div>
                </div>

                {/* Row 2: In Review */}
                <div className="p-3 rounded-md bg-[#1B2732] border border-[#2B3E4F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-accent/40 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#7A92A2] mt-0.5">REQ-02</span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Public Liability & Professional Indemnity Coverage ($50M)
                      </p>
                      <span className="text-[11px] text-[#7A92A2] font-mono">
                        Source: RFP.pdf — Page 45 • Legal
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 pl-7 sm:pl-0">
                    <span className="text-xs text-[#A8C4D0] font-mono bg-[#111A22] px-2 py-0.5 rounded border border-[#243544]">
                      Insurance_50M.pdf
                    </span>
                    <ComplianceStatusIndicator status="IN_REVIEW" size="sm" />
                  </div>
                </div>

                {/* Row 3: Missing */}
                <div className="p-3 rounded-md bg-[#1B2732] border border-[#2B3E4F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-danger/40 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#7A92A2] mt-0.5">REQ-03</span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Lead Systems Engineer CV & Rail Safety Accreditation
                      </p>
                      <span className="text-[11px] text-[#7A92A2] font-mono">
                        Source: RFP.pdf — Page 62 • Technical
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 pl-7 sm:pl-0">
                    <span className="text-xs text-[#B44848] font-mono bg-[#2A1717] px-2 py-0.5 rounded border border-[#522525]">
                      Evidence Required
                    </span>
                    <ComplianceStatusIndicator status="MISSING" size="sm" />
                  </div>
                </div>
              </div>

              {/* Right 4 cols: Live Readiness & Action Card */}
              <div className="lg:col-span-4 rounded-lg bg-[#18232D] border border-[#2B3E4F] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#8E9AA5]">
                      Tender Readiness
                    </span>
                    <span className="text-[11px] font-mono text-[#A56A20] bg-[#2E2011] px-2 py-0.5 rounded border border-[#5A3C16]">
                      80% (Incomplete)
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center my-4 py-2">
                    <ReadinessGauge percentage={80} size="lg" showLabel={false} />
                    <span className="text-xs text-[#8E9AA5] mt-3">4 of 5 Mandatory Verified</span>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#243544] text-xs">
                    <div className="flex items-center justify-between text-[#8E9AA5]">
                      <span>Submission Deadline:</span>
                      <span className="font-mono text-white">12 days left</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8E9AA5]">
                      <span>Blocking Action:</span>
                      <span className="text-[#B44848] font-medium">Attach Lead CV</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <Link href="/dashboard" className="w-full block">
                    <Button variant="primary" size="sm" className="w-full bg-accent hover:bg-[#276B66] text-white">
                      Enter Tender Workspace
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
