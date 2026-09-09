"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowRight,
  LayoutGrid,
  List,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ComplianceStatusIndicator } from "@/components/shared/ComplianceStatusIndicator";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { TenderListItem } from "../types/tenderTypes";

interface TenderListTableProps {
  tenders: TenderListItem[];
}

export function TenderListTable({ tenders }: TenderListTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filteredTenders = tenders.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.referenceNumber.toLowerCase().includes(q) ||
      (t.clientName && t.clientName.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 min-w-0 max-w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border min-w-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Tenders & RFP Proposals
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Active compliance matrices, RFP extractions, and tender submission readiness.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/tenders/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Tender / Upload RFP
            </Button>
          </Link>
        </div>
      </div>

      {/* Controls Bar: Search, Status Tabs, View Switcher */}
      <div className="bg-surface p-4 rounded-lg border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0 max-w-full">
        {/* Search */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Search tender title, client, or ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 min-w-0 max-w-full">
          {["ALL", "ACTIVE", "IN_REVIEW", "DRAFT", "SUBMITTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === status
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-alt text-text-secondary hover:text-text-primary"
              }`}
            >
              {status === "ALL" ? "All Proposals" : status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 border border-border rounded-md p-0.5 bg-surface-alt self-end md:self-auto shrink-0">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewMode === "table" ? "bg-surface text-primary shadow-subtle font-bold" : "text-text-secondary"
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded text-xs transition-colors ${
              viewMode === "grid" ? "bg-surface text-primary shadow-subtle font-bold" : "text-text-secondary"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredTenders.length === 0 ? (
        <div className="py-16 text-center bg-surface rounded-lg border border-dashed border-border p-6">
          <FileSpreadsheet className="w-10 h-10 text-text-secondary/40 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-text-primary">No matching tenders found</h3>
          <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
            Try adjusting your search criteria or create a new tender proposal to begin extracting RFP compliance requirements.
          </p>
          <div className="mt-4">
            <Link href="/tenders/new">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Create Tender
              </Button>
            </Link>
          </div>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-surface rounded-lg border border-border shadow-subtle overflow-x-auto min-w-0 max-w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-alt border-b border-border text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                <th className="p-3.5">Reference ID</th>
                <th className="p-3.5">Tender Title & Client</th>
                <th className="p-3.5">Deadline</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Readiness</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredTenders.map((item) => {
                const isCritical = item.daysRemaining <= 5 && item.status !== "SUBMITTED";

                return (
                  <tr key={item.id} className="hover:bg-surface-alt/50 transition-colors group">
                    {/* Mono Reference */}
                    <td className="p-3.5 font-mono font-bold text-primary whitespace-nowrap">
                      <span className="bg-primary/10 px-2 py-1 rounded">
                        {item.referenceNumber}
                      </span>
                    </td>

                    {/* Title & Client */}
                    <td className="p-3.5">
                      <div className="space-y-0.5 max-w-md">
                        <Link
                          href={`/tenders/${item.id}`}
                          className="font-bold text-text-primary hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[11px] text-text-secondary font-mono block">
                          Client: {item.clientName || "N/A"} • {item.documentsCount} Documents
                        </span>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[11px] font-semibold text-text-primary">
                          {item.submissionDeadline.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block w-fit ${
                            item.status === "SUBMITTED"
                              ? "bg-accent/10 text-accent"
                              : isCritical
                              ? "bg-danger/10 text-danger animate-pulse"
                              : "bg-surface-alt text-text-secondary"
                          }`}
                        >
                          {item.status === "SUBMITTED"
                            ? "Submitted"
                            : `${item.daysRemaining} days remaining`}
                        </span>
                      </div>
                    </td>

                    {/* Compliance Status Indicator */}
                    <td className="p-3.5 whitespace-nowrap">
                      <ComplianceStatusIndicator status={item.status} size="sm" />
                    </td>

                    {/* Readiness Gauge */}
                    <td className="p-3.5 whitespace-nowrap">
                      <ReadinessGauge
                        percentage={item.readinessPercentage}
                        size="sm"
                        totalMandatory={item.totalRequirements}
                        verifiedMandatory={item.verifiedRequirements}
                      />
                    </td>

                    {/* Action */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      {item.status === "IN_REVIEW" ? (
                        <Link href={`/tenders/${item.id}/review`}>
                          <Button variant="secondary" size="sm" leftIcon={<FileUp className="w-3.5 h-3.5" />}>
                            Review Extractions
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/tenders/${item.id}`}>
                          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                            Workspace
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTenders.map((item) => (
            <div
              key={item.id}
              className="bg-surface rounded-lg border border-border p-5 shadow-subtle hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold bg-[#173B4D] text-white px-2 py-0.5 rounded">
                    {item.referenceNumber}
                  </span>
                  <ComplianceStatusIndicator status={item.status} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] text-text-secondary font-mono">
                  Client: {item.clientName || "Direct Proposal"}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <ReadinessGauge
                  percentage={item.readinessPercentage}
                  size="sm"
                  totalMandatory={item.totalRequirements}
                  verifiedMandatory={item.verifiedRequirements}
                />

                <Link href={`/tenders/${item.id}`}>
                  <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Open
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
