"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RfpUploadDropzoneProps {
  tenderId?: string;
  onUploadSuccess?: (fileName: string) => void;
}

export function RfpUploadDropzone({ tenderId, onUploadSuccess }: RfpUploadDropzoneProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  function simulateUpload() {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsSuccess(true);
          if (onUploadSuccess) onUploadSuccess(file.name);

          // Route to extraction review stage (Screen 6)
          setTimeout(() => {
            router.push(`/tenders/${tenderId || "tender-1"}/review`);
          }, 800);

          return 100;
        }
        return prev + 25;
      });
    }, 250);
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-subtle space-y-5 min-w-0 max-w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-primary" />
            RFP Document Upload & AI Pipeline
          </h3>
          <p className="text-[11px] text-text-secondary">
            Upload main RFP specification documents, Addendums, or Clarification PDFs.
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold bg-[#E8F4F3] text-accent px-2 py-0.5 rounded">
          OCR & NLP Enabled
        </span>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : file
            ? "border-accent bg-[#E8F4F3]/30"
            : "border-border hover:border-primary/50 bg-surface-alt/30"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.docx,.xlsx"
          className="hidden"
        />

        {!file ? (
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">
                Drag & Drop RFP file here or <span className="text-primary underline">browse</span>
              </p>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Supports PDF, DOCX, and XLSX up to 50MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 p-3 rounded-md bg-surface border border-border max-w-md mx-auto">
              <FileText className="w-6 h-6 text-primary shrink-0" />
              <div className="text-left min-w-0 flex-1">
                <p className="text-xs font-bold text-text-primary truncate">{file.name}</p>
                <p className="text-[10px] text-text-secondary font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI extraction
                </p>
              </div>
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setIsSuccess(false);
                    setUploadProgress(0);
                  }}
                  className="text-[11px] text-danger font-medium hover:underline shrink-0"
                >
                  Change
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="max-w-md mx-auto space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-text-secondary">
                  <span>Running AI Clause Extraction...</span>
                  <span className="font-bold text-primary">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Extraction Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded bg-surface-alt/60 border border-border text-left space-y-0.5">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            1. Clean & Split
          </span>
          <p className="text-[11px] text-text-secondary">
            Splits master spec PDF into numbered clauses and addendum amendments.
          </p>
        </div>

        <div className="p-3 rounded bg-surface-alt/60 border border-border text-left space-y-0.5">
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
            2. Detect Requirements
          </span>
          <p className="text-[11px] text-text-secondary">
            AI identifies mandatory eligibility, technical, and legal obligations.
          </p>
        </div>

        <div className="p-3 rounded bg-surface-alt/60 border border-border text-left space-y-0.5">
          <span className="text-[10px] font-bold text-[#A56A20] uppercase tracking-wider block">
            3. Human Review Gate
          </span>
          <p className="text-[11px] text-text-secondary">
            Audit extracted clauses in the review stage before committing to compliance matrix.
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-text-secondary font-mono">
          Powered by TenderPulse NLP Parser v2.4
        </span>

        <Button
          variant="primary"
          size="sm"
          disabled={!file || isUploading}
          isLoading={isUploading}
          onClick={simulateUpload}
          leftIcon={isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        >
          {isSuccess ? "Uploaded! Redirecting to Review..." : "Upload & Run AI Extraction"}
        </Button>
      </div>
    </div>
  );
}
