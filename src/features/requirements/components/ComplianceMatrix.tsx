"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Paperclip,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ComplianceStatusIndicator } from "@/components/shared/ComplianceStatusIndicator";
import { RequirementItem, AssignedUser } from "../types/requirementTypes";
import { RequirementDetailDrawer } from "./RequirementDetailDrawer";
import { assignUserAction, verifyRequirementAction } from "../actions/requirementActions";

import { useRouter } from "next/navigation";

interface ComplianceMatrixProps {
  tenderId: string;
  initialRequirements: RequirementItem[];
  teamMembers: AssignedUser[];
}

export function ComplianceMatrix({
  tenderId,
  initialRequirements,
  teamMembers,
}: ComplianceMatrixProps) {
  const router = useRouter();
  const [requirements, setRequirements] = useState<RequirementItem[]>(initialRequirements);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedReq, setSelectedReq] = useState<RequirementItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredRequirements = requirements.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === "ALL" || r.category === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  function handleEvidenceAttached(reqId: string, newDoc: any) {
    setRequirements((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: "VERIFIED",
              evidenceDocs: [...r.evidenceDocs, newDoc],
            }
          : r
      )
    );
    router.refresh();
  }

  async function handleToggleVerify(req: RequirementItem, e: React.MouseEvent) {
    e.stopPropagation();

    const newStatus = req.status === "VERIFIED" ? "IN_REVIEW" : "VERIFIED";
    setRequirements((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: newStatus as any } : r))
    );

    await verifyRequirementAction(req.id);
  }

  async function handleAssignUser(reqId: string, userId: string, e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation();

    const assigned = teamMembers.find((m) => m.id === userId) || null;
    setRequirements((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, assignedUser: assigned } : r))
    );

    await assignUserAction(reqId, userId);
  }

  function handleRowClick(req: RequirementItem) {
    setSelectedReq(req);
    setIsDrawerOpen(true);
  }

  return (
    <div className="space-y-4 min-w-0 max-w-full">
      {/* Control Toolbar */}
      <div className="bg-surface p-4 rounded-lg border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0 max-w-full">
        {/* Search Input */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Search requirement matrix..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Category & Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 min-w-0 max-w-full">
          <div className="flex items-center gap-1 bg-surface-alt p-1 rounded-md">
            {["ALL", "Eligibility", "Technical", "Financial", "Legal"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  categoryFilter === cat ? "bg-surface text-primary shadow-subtle" : "text-text-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-surface-alt p-1 rounded-md">
            {["ALL", "VERIFIED", "IN_REVIEW", "MISSING"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === st ? "bg-surface text-primary shadow-subtle" : "text-text-secondary"
                }`}
              >
                {st === "ALL" ? "All Status" : st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Density Compliance Matrix Table */}
      <div className="bg-surface rounded-lg border border-border shadow-subtle overflow-x-auto min-w-0 max-w-full">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-surface-alt border-b border-border text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Requirement Title & Description</th>
              <th className="p-3.5">Assigned Owner</th>
              <th className="p-3.5">Linked Evidence</th>
              <th className="p-3.5">Compliance Status</th>
              <th className="p-3.5 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {filteredRequirements.map((req) => (
              <tr
                key={req.id}
                onClick={() => handleRowClick(req)}
                className="hover:bg-surface-alt/60 cursor-pointer transition-colors group"
              >
                {/* Category & Mandatory Tag */}
                <td className="p-3.5 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <Badge variant="neutral" size="sm">
                      {req.category}
                    </Badge>
                    {req.isMandatory ? (
                      <span className="text-[9px] uppercase font-bold text-danger bg-danger/10 px-1.5 py-0.2 rounded w-fit">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-bold text-text-secondary bg-surface-alt px-1.5 py-0.2 rounded w-fit">
                        Optional
                      </span>
                    )}
                  </div>
                </td>

                {/* Title & Description */}
                <td className="p-3.5">
                  <div className="space-y-0.5 max-w-md">
                    <h4 className="font-bold text-text-primary text-xs group-hover:text-primary transition-colors leading-snug">
                      {req.title}
                    </h4>
                    {req.description && (
                      <p className="text-[11px] text-text-secondary line-clamp-1">
                        {req.description}
                      </p>
                    )}
                    {req.sourcePage && (
                      <span className="text-[10px] text-text-muted font-mono block">
                        RFP Page {req.sourcePage}
                      </span>
                    )}
                  </div>
                </td>

                {/* Assigned Owner */}
                <td className="p-3.5 whitespace-nowrap">
                  <select
                    value={req.assignedUser?.id || ""}
                    onChange={(e) => handleAssignUser(req.id, e.target.value, e)}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 text-xs border border-border rounded bg-surface font-medium text-text-primary focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Linked Evidence Documents */}
                <td className="p-3.5 whitespace-nowrap">
                  {req.evidenceDocs.length > 0 ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-accent bg-[#E8F4F3] px-2 py-1 rounded">
                      <Paperclip className="w-3.5 h-3.5" />
                      {req.evidenceDocs.length} Document Linked
                    </span>
                  ) : (
                    <span className="text-[11px] text-danger font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      No Evidence
                    </span>
                  )}
                </td>

                {/* Compliance Status Pill & Quick Toggle */}
                <td className="p-3.5 whitespace-nowrap">
                  <button
                    onClick={(e) => handleToggleVerify(req, e)}
                    className="group-hover:scale-105 transition-transform"
                    title="Click to toggle verification status"
                  >
                    <ComplianceStatusIndicator status={req.status} size="sm" />
                  </button>
                </td>

                {/* Inspect Arrow */}
                <td className="p-3.5 text-right whitespace-nowrap">
                  <div className="p-1.5 rounded text-text-secondary group-hover:text-primary group-hover:bg-primary/10 inline-block transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 200ms GSAP Right Slide-In Detail Drawer */}
      <RequirementDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        requirement={selectedReq}
        teamMembers={teamMembers}
        onEvidenceAttached={handleEvidenceAttached}
      />
    </div>
  );
}
