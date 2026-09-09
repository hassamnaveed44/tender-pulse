"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  FileSpreadsheet,
  FolderLock,
  LayoutDashboard,
  Bell,
  Settings,
  ShieldCheck,
  ArrowRight,
  FileText,
} from "lucide-react";

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Tender" | "Requirement" | "Document" | "Page";
  url: string;
  icon: React.ElementType;
}

const SEARCH_ITEMS: SearchResultItem[] = [
  // Pages
  { id: "p-1", title: "Global Compliance Dashboard", subtitle: "Main command center", category: "Page", url: "/dashboard", icon: LayoutDashboard },
  { id: "p-2", title: "Tenders & RFP Proposals", subtitle: "Portfolio list", category: "Page", url: "/tenders", icon: FileSpreadsheet },
  { id: "p-3", title: "Create New Tender", subtitle: "Upload RFP specification", category: "Page", url: "/tenders/new", icon: FileSpreadsheet },
  { id: "p-4", title: "Central Evidence Library", subtitle: "Expiry tracking & certificates", category: "Page", url: "/documents", icon: FolderLock },
  { id: "p-5", title: "Notifications & Activity Stream", subtitle: "Alerts & audit log", category: "Page", url: "/notifications", icon: Bell },
  { id: "p-6", title: "Organization & Team Settings", subtitle: "Permissions & seats", category: "Page", url: "/settings", icon: Settings },

  // Tenders
  { id: "t-1", title: "Metropolitan Transit Rail Electrification & Signaling System", subtitle: "Ref: TP-2026-00142 • Client: State Dept of Transportation", category: "Tender", url: "/tenders/tender-1", icon: FileSpreadsheet },
  { id: "t-2", title: "Smart Grid Power Substation SCADA Modernization", subtitle: "Ref: TP-2026-00089 • Client: National Energy Authority", category: "Tender", url: "/tenders/tender-2", icon: FileSpreadsheet },

  // Requirements
  { id: "r-1", title: "Valid ISO 9001:2015 Quality Management Certification", subtitle: "Category: Eligibility • Status: VERIFIED", category: "Requirement", url: "/tenders/tender-1", icon: ShieldCheck },
  { id: "r-2", title: "Three (3) Consecutive Years Audited Financial Statements", subtitle: "Category: Financial • Status: VERIFIED", category: "Requirement", url: "/tenders/tender-1", icon: ShieldCheck },
  { id: "r-3", title: "Public Liability and Professional Indemnity Coverage ($50M)", subtitle: "Category: Legal • Status: IN REVIEW", category: "Requirement", url: "/tenders/tender-1", icon: ShieldCheck },
  { id: "r-4", title: "Lead Systems Engineer CV and Rail Safety Accreditation", subtitle: "Category: Technical • Status: MISSING EVIDENCE", category: "Requirement", url: "/tenders/tender-1", icon: ShieldCheck },

  // Documents
  { id: "d-1", title: "ISO_9001_2015_Certificate_Apex.pdf", subtitle: "Category: Certificate • Valid", category: "Document", url: "/documents", icon: FileText },
  { id: "d-2", title: "Public_Liability_Insurance_50M.pdf", subtitle: "Category: Insurance Policy • Expires in 14 days", category: "Document", url: "/documents", icon: FileText },
  { id: "d-3", title: "SOC2_Type_II_Compliance_Report.pdf", subtitle: "Category: Audit Report • EXPIRED", category: "Document", url: "/documents", icon: FileText },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredResults = SEARCH_ITEMS.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  function handleSelect(url: string) {
    onClose();
    router.push(url);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150">
      <div className="bg-surface rounded-xl border border-border shadow-dropdown max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border flex items-center gap-3 bg-surface">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search tenders, requirements, documents, or pages... (Type to filter)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full text-sm bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-secondary hover:bg-surface-alt hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="divide-y divide-border overflow-y-auto flex-1 p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-text-secondary text-xs">
              No matching results found for &ldquo;<strong className="text-text-primary">{query}</strong>&rdquo;
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.url)}
                  className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    idx === selectedIndex ? "bg-surface-alt border border-primary/20" : "hover:bg-surface-alt/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded bg-primary/10 text-primary shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-text-primary truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-text-secondary font-mono truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-surface border border-border px-2 py-0.5 rounded text-text-secondary">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-surface-alt border-t border-border flex items-center justify-between text-[11px] font-mono text-text-secondary">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border rounded">ESC</kbd> to exit</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border rounded">⌘K</kbd> to toggle search</span>
          </div>
          <span className="text-primary font-bold">{filteredResults.length} Items</span>
        </div>
      </div>
    </div>
  );
}
