"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  History,
  LayoutTemplate,
  SlidersHorizontal,
  AlertTriangle,
  Building2,
  HardHat,
  Truck,
  Briefcase,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/format";

const VALUE_PILLARS = [
  {
    id: "precision",
    icon: ShieldCheck,
    title: "Precision",
    desc: "Every requirement states category, owner, evidence, and status plainly — zero ambiguity about what's missing.",
    highlight: "100% Deterministic Checklist",
  },
  {
    id: "low-friction",
    icon: Zap,
    title: "Low Friction",
    desc: "Reviewing an extracted requirement, assigning an owner, or attaching evidence takes seconds, not hours of spreadsheet wrangling.",
    highlight: "1-Click Document Linking",
  },
  {
    id: "auditability",
    icon: History,
    title: "Trust & Auditability",
    desc: "Every action is permanently recorded in immutable audit logs — who assigned what, who verified what, and exactly when.",
    highlight: "Full Event Provenance",
  },
  {
    id: "calm",
    icon: LayoutTemplate,
    title: "Document-Centric Calm",
    desc: "Clean editorial spacing and restrained color — a dedicated compliance workspace built for clarity, not cluttered enterprise bloat.",
    highlight: "Distraction-Free UI",
  },
  {
    id: "human-in-control",
    icon: SlidersHorizontal,
    title: "Human-in-Control Automation",
    desc: "Extraction suggests; a person always confirms before a clause counts toward your official submission readiness score.",
    highlight: "Zero Hallucination Gate",
  },
  {
    id: "confidence",
    icon: AlertTriangle,
    title: "Edge-Case Confidence",
    desc: "Expired certificates, missing attachments, and addenda amendments are proactively flagged with real-time countdown alerts.",
    highlight: "Automated Expiry Safeguards",
  },
];

const TARGET_USERS = [
  {
    id: "construction",
    icon: HardHat,
    role: "Engineering & Construction",
    benefit: "Track complex technical ISO standards, site safety credentials, and subcontractor certifications.",
    metric: "40+ Requirements / Tender",
  },
  {
    id: "contractors",
    icon: Building2,
    role: "Prime Contractors",
    benefit: "Centralize multi-million dollar government RFP compliance without spreadsheet fragmentation.",
    metric: "Multi-Team Coordination",
  },
  {
    id: "suppliers",
    icon: Truck,
    role: "Suppliers & Manufacturers",
    benefit: "Ensure technical datasheets, warranties, and supply chain audit evidence are fully verified.",
    metric: "Product Spec Audits",
  },
  {
    id: "services",
    icon: Briefcase,
    role: "Service Providers & Consultancies",
    benefit: "Speed up response cycles for recurring municipal, defense, and enterprise tenders.",
    metric: "3x Faster Turnaround",
  },
  {
    id: "bid-teams",
    icon: Users,
    role: "Dedicated Bid Teams",
    benefit: "Delegate ownership across domain experts with live status rollups and submission gating.",
    metric: "Zero Missing Clauses",
  },
];

export function ValuePillars() {
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  return (
    <div className="space-y-24 py-20">
      {/* Design Objectives / Value Pillars */}
      <section id="problem-solution" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="neutral" size="sm" className="mb-3">
            Built for Reliability
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Engineered for Compliance Certainty
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary">
            TenderPulse replaces fragile spreadsheets, loose email threads, and shared folders with a rigorous compliance engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activePillar === pillar.id;

            return (
              <div
                key={pillar.id}
                onClick={() => setActivePillar(isSelected ? null : pillar.id)}
                className={cn(
                  "group p-6 rounded-lg bg-surface border transition-all duration-200 cursor-pointer select-none",
                  "hover:-translate-y-1 hover:shadow-md hover:border-accent/60 active:scale-[0.99]",
                  isSelected
                    ? "border-accent ring-1 ring-accent bg-accent-light/20 shadow-md"
                    : "border-border shadow-subtle hover:bg-[#FCFDFC]"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-md border flex items-center justify-center transition-colors duration-200",
                      isSelected
                        ? "bg-accent text-white border-accent"
                        : "bg-surface-alt border-border text-primary group-hover:bg-primary group-hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  </div>
                  <span className="text-[10px] font-mono text-text-secondary group-hover:text-accent font-medium px-2 py-0.5 rounded bg-surface-alt border border-border/80">
                    {pillar.highlight}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {pillar.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1.5 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-medium">Click to inspect pillar safeguard</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Target Users */}
      <section id="target-users" className="bg-surface-alt border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="accent" size="sm" className="mb-3">
              Target Industries
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Built for High-Stakes Procurement
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-secondary">
              Trusted by bid managers, compliance officers, and commercial directors across regulated industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TARGET_USERS.map((user) => {
              const Icon = user.icon;
              const isSelected = activeIndustry === user.id;

              return (
                <div
                  key={user.id}
                  onClick={() => setActiveIndustry(isSelected ? null : user.id)}
                  className={cn(
                    "group p-5 rounded-lg bg-surface border transition-all duration-200 cursor-pointer select-none",
                    "hover:-translate-y-1 hover:shadow-md hover:border-accent/60 active:scale-[0.99]",
                    isSelected
                      ? "border-accent ring-1 ring-accent bg-accent-light/20 shadow-md"
                      : "border-border shadow-subtle hover:bg-white"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded transition-colors duration-200",
                          isSelected
                            ? "bg-accent text-white"
                            : "bg-surface-alt text-accent group-hover:bg-accent group-hover:text-white"
                        )}
                      >
                        <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                        {user.role}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed mb-3">
                    {user.benefit}
                  </p>

                  <div className="pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-text-muted">
                    <span className="text-accent font-semibold">{user.metric}</span>
                    <span className="text-[10px] text-text-secondary group-hover:text-text-primary transition-colors">
                      {isSelected ? "Active Focus" : "Select Profile"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
