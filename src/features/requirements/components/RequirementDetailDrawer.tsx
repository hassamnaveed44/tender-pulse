"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, ShieldCheck, Paperclip, User, FileText, AlertTriangle, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ComplianceStatusIndicator } from "@/components/shared/ComplianceStatusIndicator";
import { RequirementItem, AssignedUser } from "../types/requirementTypes";
import { verifyRequirementAction, assignUserAction } from "../actions/requirementActions";

interface RequirementDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: RequirementItem | null;
  teamMembers: AssignedUser[];
  onEvidenceAttached?: (requirementId: string, newDoc: any) => void;
}

import { useRouter } from "next/navigation";
import { uploadDocumentAction, attachEvidenceAction } from "@/features/documents/actions/documentActions";

export function RequirementDetailDrawer({
  isOpen,
  onClose,
  requirement,
  teamMembers,
  onEvidenceAttached,
}: RequirementDetailDrawerProps) {
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [linkedDocs, setLinkedDocs] = useState<any[]>(requirement?.evidenceDocs || []);
  const [isAttaching, setIsAttaching] = useState(false);

  useEffect(() => {
    if (requirement) {
      setLinkedDocs(requirement.evidenceDocs || []);
    }
  }, [requirement]);

  useEffect(() => {
    if (isOpen) {
      if (backdropRef.current) {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      }
      if (drawerRef.current) {
        gsap.fromTo(
          drawerRef.current,
          { x: "100%" },
          { x: "0%", duration: 0.25, ease: "power2.out" }
        );
      }
    }
  }, [isOpen]);

  if (!isOpen || !requirement) return null;

  async function handleFileUploadAndAttach(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsAttaching(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", requirement?.category || "Certificate");

      const uploadRes = await uploadDocumentAction(formData);
      if (uploadRes.success) {
        const newDocItem = {
          id: `doc-${Date.now()}`,
          fileName: file.name,
          fileType: requirement?.category || "Certificate",
        };

        setLinkedDocs((prev) => [...prev, newDocItem]);

        if (requirement) {
          await verifyRequirementAction(requirement.id, "VERIFIED");
          if (onEvidenceAttached) {
            onEvidenceAttached(requirement.id, newDocItem);
          }
        }
      }
    } catch (err) {
      console.error("Failed to attach evidence file:", err);
    } finally {
      setIsAttaching(false);
    }
  }

  async function handleVerify() {
    if (requirement) {
      const newStatus = requirement.status === "VERIFIED" ? "IN_REVIEW" : "VERIFIED";
      await verifyRequirementAction(requirement.id, newStatus);
      router.refresh();
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-lg bg-surface border-l border-border shadow-2xl p-6 flex flex-col justify-between space-y-6 overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="space-y-4 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold bg-[#173B4D] text-white px-2.5 py-1 rounded">
                REQ-{requirement.id.slice(-6).toUpperCase()}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="neutral" size="sm">
                  {requirement.category}
                </Badge>
                <ComplianceStatusIndicator status={requirement.status} size="sm" />
              </div>
              <h2 className="text-base font-bold text-text-primary leading-tight">
                {requirement.title}
              </h2>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-5 flex-1">
            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Obligation Specification
              </h4>
              <p className="text-xs text-text-primary leading-relaxed p-3 bg-surface-alt rounded-md border border-border">
                {requirement.description || "No additional description text provided for this clause."}
              </p>
            </div>

            {/* Source Context */}
            <div className="p-3 rounded-md bg-[#FBFBFA] border border-border flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-text-secondary">
                <FileText className="w-4 h-4 text-primary" />
                <span>RFP Specification Document</span>
              </div>
              <span className="font-bold text-primary">
                Page {requirement.sourcePage || 1}
              </span>
            </div>

            {/* Assigned Owner */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Assigned Team Member
              </h4>
              <div className="flex items-center gap-3 p-3 rounded-md bg-surface border border-border">
                <User className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs font-bold text-text-primary flex-1">
                  {requirement.assignedUser?.fullName || "Unassigned"}
                </span>
              </div>
            </div>

            {/* Linked Evidence Files */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Linked Evidence Library Files
                </h4>
                <span className="text-[11px] font-mono font-bold text-accent">
                  {linkedDocs.length} Linked
                </span>
              </div>

              {/* Upload & Attach File Button */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-dashed border-primary/60 bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{isAttaching ? "Attaching Evidence..." : "+ Upload & Link Evidence File"}</span>
                  <input
                    type="file"
                    onChange={handleFileUploadAndAttach}
                    disabled={isAttaching}
                    className="hidden"
                    accept=".pdf,.docx,.jpg,.png"
                  />
                </label>
              </div>

              {linkedDocs.length === 0 ? (
                <div className="p-4 rounded-md border border-dashed border-danger/40 bg-danger/5 text-center">
                  <AlertTriangle className="w-5 h-5 text-danger mx-auto mb-1" />
                  <p className="text-xs font-bold text-danger">Missing Mandatory Evidence</p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Click the button above to upload a certificate, policy, or audit report file.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {linkedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-md bg-surface border border-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="w-4 h-4 text-accent shrink-0" />
                        <span className="font-bold text-text-primary truncate">{doc.fileName}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-[#E8F4F3] text-accent px-2 py-0.5 rounded font-bold shrink-0">
                        VERIFIED
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer CTA */}
          <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close Drawer
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleVerify}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              {requirement.status === "VERIFIED" ? "Mark as In Review" : "Verify Compliance"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
