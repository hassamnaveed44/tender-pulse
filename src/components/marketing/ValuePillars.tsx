import React from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const VALUE_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Precision",
    desc: "Every requirement states category, owner, evidence, and status plainly — zero ambiguity about what's missing.",
  },
  {
    icon: Zap,
    title: "Low Friction",
    desc: "Reviewing an extracted requirement, assigning an owner, or attaching evidence takes seconds, not hours of spreadsheet wrangling.",
  },
  {
    icon: History,
    title: "Trust & Auditability",
    desc: "Every action is permanently recorded in immutable audit logs — who assigned what, who verified what, and exactly when.",
  },
  {
    icon: LayoutTemplate,
    title: "Document-Centric Calm",
    desc: "Clean editorial spacing and restrained color — a dedicated compliance workspace built for clarity, not cluttered enterprise bloat.",
  },
  {
    icon: SlidersHorizontal,
    title: "Human-in-Control Automation",
    desc: "Extraction suggests; a person always confirms before a clause counts toward your official submission readiness score.",
  },
  {
    icon: AlertTriangle,
    title: "Edge-Case Confidence",
    desc: "Expired certificates, missing attachments, and addenda amendments are proactively flagged with real-time countdown alerts.",
  },
];

const TARGET_USERS = [
  {
    icon: HardHat,
    role: "Engineering & Construction",
    benefit: "Track complex technical ISO standards, site safety credentials, and subcontractor certifications.",
  },
  {
    icon: Building2,
    role: "Prime Contractors",
    benefit: "Centralize multi-million dollar government RFP compliance without spreadsheet fragmentation.",
  },
  {
    icon: Truck,
    role: "Suppliers & Manufacturers",
    benefit: "Ensure technical datasheets, warranties, and supply chain audit evidence are fully verified.",
  },
  {
    icon: Briefcase,
    role: "Service Providers & Consultancies",
    benefit: "Speed up response cycles for recurring municipal, defense, and enterprise tenders.",
  },
  {
    icon: Users,
    role: "Dedicated Bid Teams",
    benefit: "Delegate ownership across domain experts with live status rollups and submission gating.",
  },
];

export function ValuePillars() {
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
            return (
              <div
                key={pillar.title}
                className="p-6 rounded-lg bg-surface border border-border hover:border-accent/40 transition-all duration-200 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-md bg-surface-alt border border-border flex items-center justify-center text-primary mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pillar.desc}
                  </p>
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
              return (
                <div
                  key={user.role}
                  className="p-5 rounded-lg bg-surface border border-border shadow-subtle flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded bg-surface-alt text-accent">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-text-primary">
                        {user.role}
                      </h4>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {user.benefit}
                    </p>
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
