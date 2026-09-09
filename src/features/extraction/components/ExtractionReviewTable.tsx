"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Edit2,
  Sparkles,
  AlertTriangle,
  FileText,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ExtractedCandidateItem } from "../types/extractionTypes";
import { acceptCandidateAction, rejectCandidateAction, bulkAcceptCandidatesAction } from "../actions/extractionActions";

interface ExtractionReviewTableProps {
  candidates: ExtractedCandidateItem[];
  tenderId: string;
}

export function ExtractionReviewTable({
  candidates: initialCandidates,
  tenderId,
}: ExtractionReviewTableProps) {
  const router = useRouter();
  const [candidates, setCandidates] = useState<ExtractedCandidateItem[]>(initialCandidates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<ExtractedCandidateItem["category"]>("Technical");
  const [editMandatory, setEditMandatory] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const pendingCandidates = candidates.filter((c) => c.status === "PENDING");
  const acceptedCandidates = candidates.filter((c) => c.status === "ACCEPTED");

  async function handleAccept(candidate: ExtractedCandidateItem) {
    setLoadingId(candidate.id);

    const updatedData =
      editingId === candidate.id
        ? { title: editTitle, category: editCategory, isMandatory: editMandatory }
        : undefined;

    const res = await acceptCandidateAction(candidate.id, updatedData);
    setLoadingId(null);
    setEditingId(null);

    if (res.success) {
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidate.id ? { ...c, status: "ACCEPTED" } : c))
      );
    }
  }

  async function handleReject(candidateId: string) {
    setLoadingId(candidateId);
    const res = await rejectCandidateAction(candidateId);
    setLoadingId(null);

    if (res.success) {
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, status: "REJECTED" } : c))
      );
    }
  }

  async function handleBulkAccept() {
    setIsBulkLoading(true);
    const res = await bulkAcceptCandidatesAction(tenderId);
    setIsBulkLoading(false);

    if (res.success) {
      setCandidates((prev) => prev.map((c) => ({ ...c, status: "ACCEPTED" })));
      setTimeout(() => {
        router.push(`/tenders/${tenderId}`);
      }, 500);
    }
  }

  function startEditing(candidate: ExtractedCandidateItem) {
    setEditingId(candidate.id);
    setEditTitle(candidate.title);
    setEditCategory(candidate.category);
    setEditMandatory(candidate.isMandatory);
  }

  return (
    <div className="space-y-4 min-w-0 max-w-full">
      {/* Action Toolbar */}
      <div className="bg-surface p-4 rounded-lg border border-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0 max-w-full">
        <div>
          <h3 className="text-sm font-bold text-text-primary tracking-tight">
            Staging Review ({pendingCandidates.length} Pending Review)
          </h3>
          <p className="text-[11px] text-text-secondary">
            Audit extracted clauses, verify confidence ratings, and commit requirements into compliance matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCandidates.length > 0 ? (
            <Button
              variant="primary"
              size="sm"
              isLoading={isBulkLoading}
              onClick={handleBulkAccept}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Accept All & Open Workspace
            </Button>
          ) : (
            <Link href={`/tenders/${tenderId}`}>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to Compliance Matrix
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Candidates Staging Table */}
      <div className="bg-surface rounded-lg border border-border shadow-subtle overflow-x-auto min-w-0 max-w-full">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-surface-alt border-b border-border text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              <th className="p-3.5">Confidence</th>
              <th className="p-3.5">Extracted Clause Title & Description</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Source Location</th>
              <th className="p-3.5 text-right">Human Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {candidates.map((item) => {
              const isEditing = editingId === item.id;
              const isAccepted = item.status === "ACCEPTED";
              const isRejected = item.status === "REJECTED";

              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    isAccepted
                      ? "bg-[#E8F4F3]/40 opacity-80"
                      : isRejected
                      ? "bg-danger/5 opacity-50 line-through"
                      : item.confidence === "LOW"
                      ? "bg-[#FFFDF9] hover:bg-[#FDF4E7]/60"
                      : "hover:bg-surface-alt/50"
                  }`}
                >
                  {/* Confidence Badge */}
                  <td className="p-3.5 whitespace-nowrap">
                    {item.confidence === "HIGH" ? (
                      <span className="font-mono text-[11px] font-bold bg-accent/10 text-accent border border-accent/20 px-2 py-1 rounded inline-flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        HIGH {item.confidenceScore}%
                      </span>
                    ) : item.confidence === "MEDIUM" ? (
                      <span className="font-mono text-[11px] font-bold bg-[#FDF4E7] text-[#A56A20] border border-[#F7E1B8] px-2 py-1 rounded inline-flex items-center gap-1">
                        MED {item.confidenceScore}%
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] font-bold bg-danger/10 text-danger border border-danger/20 px-2 py-1 rounded inline-flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        LOW {item.confidenceScore}%
                      </span>
                    )}
                  </td>

                  {/* Title & Description */}
                  <td className="p-3.5">
                    {isEditing ? (
                      <div className="space-y-2 max-w-lg">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-primary rounded bg-surface font-bold text-text-primary focus:outline-none"
                        />
                        <div className="flex items-center gap-3 text-[11px]">
                          <label className="flex items-center gap-1 font-medium text-text-secondary cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editMandatory}
                              onChange={(e) => setEditMandatory(e.target.checked)}
                              className="rounded text-primary focus:ring-primary"
                            />
                            <span>Mandatory Requirement</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-text-primary text-xs leading-snug">
                            {item.title}
                          </h4>
                          {item.isMandatory ? (
                            <span className="text-[10px] uppercase font-bold text-danger bg-danger/10 px-1.5 py-0.2 rounded shrink-0">
                              Mandatory
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-text-secondary bg-surface-alt px-1.5 py-0.2 rounded shrink-0">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="p-3.5 whitespace-nowrap">
                    {isEditing ? (
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as any)}
                        className="px-2 py-1 text-xs border border-border rounded bg-surface font-medium"
                      >
                        <option value="Eligibility">Eligibility</option>
                        <option value="Technical">Technical</option>
                        <option value="Financial">Financial</option>
                        <option value="Legal">Legal</option>
                      </select>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        {item.category}
                      </Badge>
                    )}
                  </td>

                  {/* Source Location */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary font-mono bg-surface-alt px-2 py-1 rounded">
                      <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Page {item.sourcePage || 1}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right whitespace-nowrap">
                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-accent font-mono bg-[#E8F4F3] px-2.5 py-1 rounded">
                        <CheckCircle2 className="w-4 h-4" />
                        Accepted into Matrix
                      </span>
                    ) : isRejected ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-danger font-mono bg-danger/10 px-2.5 py-1 rounded">
                        <XCircle className="w-4 h-4" />
                        Rejected
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => (isEditing ? setEditingId(null) : startEditing(item))}
                          className="p-1.5 rounded text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors"
                          title={isEditing ? "Cancel edit" : "Edit clause inline"}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(item.id)}
                          className="text-danger hover:bg-danger/10 px-2"
                        >
                          Reject
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={loadingId === item.id}
                          onClick={() => handleAccept(item)}
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          {isEditing ? "Save & Accept" : "Accept"}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
