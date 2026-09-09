"use client";

import React, { useState } from "react";
import { X, UploadCloud, FolderLock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { uploadDocumentAction } from "../actions/documentActions";

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceUploadModal({ isOpen, onClose }: EvidenceUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("Certificate");
  const [expiryDate, setExpiryDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please select a document file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);
    if (expiryDate) formData.append("expiryDate", expiryDate);

    const res = await uploadDocumentAction(formData);
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to upload document.");
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface rounded-lg border border-border shadow-dropdown max-w-md w-full p-6 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-alt transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <div className="p-2 rounded bg-primary/10 text-primary">
            <FolderLock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Upload Evidence Document
            </h2>
            <p className="text-xs text-text-secondary">
              Add corporate certificates, insurance policies, or audited financial statements.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded bg-danger/10 border border-danger/20 text-xs text-danger font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-primary block mb-1.5">
              Select Document File <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              accept=".pdf,.docx,.png,.jpg"
              className="w-full text-xs text-text-secondary file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-primary block mb-1.5">
              Document Category / Type
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-md bg-surface text-text-primary font-medium focus:border-primary focus:outline-none"
            >
              <option value="Certificate">Certificate (e.g. ISO 9001, ISO 27001)</option>
              <option value="Financial Statement">Financial Statement / Balance Sheet</option>
              <option value="Insurance Policy">Insurance Policy (Public Liability, Indemnity)</option>
              <option value="Audit Report">Audit Report / SOC2 / Security Audit</option>
              <option value="Policy Document">Corporate Policy / ESG Plan</option>
            </select>
          </div>

          <Input
            label="Document Expiry Date (Optional)"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            helperText="Automated warning alerts will trigger 30 days before expiration."
          />

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading} leftIcon={<UploadCloud className="w-4 h-4" />}>
              Upload to Library
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
