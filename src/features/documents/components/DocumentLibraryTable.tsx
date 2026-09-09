"use client";

import React, { useState } from "react";
import {
  FolderLock,
  Search,
  Plus,
  FileText,
  Paperclip,
  Download,
  AlertTriangle,
  User,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DocumentItem } from "../types/documentTypes";
import { DocumentExpiryBadge } from "./DocumentExpiryBadge";
import { EvidenceUploadModal } from "./EvidenceUploadModal";

interface DocumentLibraryTableProps {
  documents: DocumentItem[];
}

export function DocumentLibraryTable({ documents }: DocumentLibraryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredDocs = documents.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      d.fileName.toLowerCase().includes(q) ||
      (d.fileType && d.fileType.toLowerCase().includes(q));

    const matchesType = typeFilter === "ALL" || d.fileType === typeFilter;

    return matchesSearch && matchesType;
  });

  const expiringSoonCount = documents.filter((d) => d.expiryStatus === "EXPIRING_SOON").length;
  const expiredCount = documents.filter((d) => d.expiryStatus === "EXPIRED").length;

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border min-w-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Central Evidence Library & Expiry Tracker
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Organization compliance certificates, insurance policies, and financial statements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Upload Evidence File
          </Button>
        </div>
      </div>

      {/* Expiry Warning Summary Banner */}
      {(expiringSoonCount > 0 || expiredCount > 0) && (
        <div className="p-4 rounded-lg bg-[#FFFDF9] border border-[#F7E1B8] shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#FDF4E7] text-[#A56A20] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#7A4B10]">
                Evidence Expiry Attention Required
              </h4>
              <p className="text-[11px] text-[#A56A20] mt-0.5">
                {expiredCount > 0 && `${expiredCount} document(s) have EXPIRED. `}
                {expiringSoonCount > 0 && `${expiringSoonCount} document(s) expire within 30 days.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="bg-surface p-4 rounded-lg border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0 max-w-full">
        {/* Search */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Search evidence file name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 min-w-0 max-w-full">
          {["ALL", "Certificate", "Financial Statement", "Insurance Policy", "Audit Report"].map(
            (type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                  typeFilter === type
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-alt text-text-secondary hover:text-text-primary"
                }`}
              >
                {type === "ALL" ? "All Documents" : type}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-surface rounded-lg border border-border shadow-subtle overflow-x-auto min-w-0 max-w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-surface-alt border-b border-border text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              <th className="p-3.5">Document File</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Expiry Status</th>
              <th className="p-3.5">Linked Requirements</th>
              <th className="p-3.5">Uploaded By</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-surface-alt/50 transition-colors group">
                {/* File Name */}
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5 max-w-md">
                    <div className="p-2 rounded bg-primary/10 text-primary shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-text-primary hover:text-primary transition-colors block truncate">
                        {doc.fileName}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono block">
                        Added {doc.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="p-3.5 whitespace-nowrap">
                  <Badge variant="neutral" size="sm">
                    {doc.fileType || "Document"}
                  </Badge>
                </td>

                {/* Expiry Badge */}
                <td className="p-3.5 whitespace-nowrap">
                  <DocumentExpiryBadge
                    status={doc.expiryStatus}
                    daysToExpiry={doc.daysToExpiry}
                  />
                </td>

                {/* Linked Requirements Count */}
                <td className="p-3.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-text-secondary bg-surface-alt px-2 py-1 rounded">
                    <Paperclip className="w-3.5 h-3.5 text-primary" />
                    {doc.linkedRequirementsCount} Requirements Linked
                  </span>
                </td>

                {/* Uploaded By */}
                <td className="p-3.5 whitespace-nowrap text-text-secondary font-mono text-[11px]">
                  {doc.uploadedBy.fullName}
                </td>

                {/* Action */}
                <td className="p-3.5 text-right whitespace-nowrap">
                  <a
                    href={`/api/documents/${doc.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded hover:bg-surface-alt text-text-secondary hover:text-primary inline-flex items-center gap-1 font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      <EvidenceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
