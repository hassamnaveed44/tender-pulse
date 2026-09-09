"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Search,
  Plus,
  ArrowRight,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ComplianceStatusIndicator } from "@/components/shared/ComplianceStatusIndicator";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { DeadlineItem } from "../services/dashboardService";

interface ActiveTendersOverviewProps {
  tenders: DeadlineItem[];
}

export function ActiveTendersOverview({ tenders }: ActiveTendersOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filteredTenders = tenders.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.clientName && item.clientName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-subtle space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-primary" />
            Active Tenders & Proposals
          </h2>
          <p className="text-[11px] text-text-secondary">
            Manage your bidding portfolio and jump directly into RFP compliance matrixes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/tenders/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Tender
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & View Switcher Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search tender title or ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {["ALL", "ACTIVE", "IN_REVIEW", "DRAFT"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === status
                  ? "bg-primary text-white"
                  : "bg-surface-alt text-text-secondary hover:text-text-primary"
              }`}
            >
              {status === "ALL" ? "All Tenders" : status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-border rounded-md p-0.5 bg-surface-alt self-end md:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1 rounded text-xs transition-colors ${
              viewMode === "grid" ? "bg-surface text-primary shadow-subtle font-bold" : "text-text-secondary"
            }`}
            title="Grid Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1 rounded text-xs transition-colors ${
              viewMode === "table" ? "bg-surface text-primary shadow-subtle font-bold" : "text-text-secondary"
            }`}
            title="Table List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tender Display Container */}
      {filteredTenders.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-border rounded-lg bg-surface-alt/30">
          <Filter className="w-8 h-8 text-text-secondary/40 mx-auto mb-2" />
          <p className="text-xs font-semibold text-text-primary">No matching tenders found</p>
          <p className="text-[11px] text-text-secondary mt-0.5">
            Try adjusting your search query or status filter.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredTenders.map((item) => (
            <div
              key={item.id}
              className="bg-surface rounded-lg border border-border p-4 shadow-subtle hover:shadow-card hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold bg-[#173B4D] text-white px-2 py-0.5 rounded">
                    {item.referenceNumber}
                  </span>
                  <ComplianceStatusIndicator status={item.status} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] text-text-secondary font-mono mt-1">
                  Client: {item.clientName || "N/A"}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <ReadinessGauge
                  percentage={item.readinessPercentage}
                  size="sm"
                  totalMandatory={item.totalRequirements}
                  verifiedMandatory={item.verifiedRequirements}
                />

                <Link
                  href={`/tenders/${item.id}`}
                  className="font-semibold text-xs text-primary hover:text-primary-hover flex items-center gap-1"
                >
                  <span>Open Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt border-b border-border text-[11px] font-semibold text-text-secondary uppercase">
                <th className="p-3">Reference ID</th>
                <th className="p-3">Tender Title</th>
                <th className="p-3">Client</th>
                <th className="p-3">Deadline</th>
                <th className="p-3">Status</th>
                <th className="p-3">Readiness</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredTenders.map((item) => (
                <tr key={item.id} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{item.referenceNumber}</td>
                  <td className="p-3 font-semibold text-text-primary max-w-xs truncate">{item.title}</td>
                  <td className="p-3 text-text-secondary">{item.clientName || "—"}</td>
                  <td className="p-3 font-mono text-[11px]">{item.daysRemaining} days remaining</td>
                  <td className="p-3">
                    <ComplianceStatusIndicator status={item.status} size="sm" />
                  </td>
                  <td className="p-3 font-bold text-accent">{item.readinessPercentage}%</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/tenders/${item.id}`}
                      className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
                    >
                      <span>Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
