import React from "react";
import { notFound } from "next/navigation";
import { fetchTenderWorkspaceData } from "@/features/requirements/services/requirementService";
import { TenderWorkspaceHeader } from "@/features/tenders/components/TenderWorkspaceHeader";

export const dynamic = "force-dynamic";

interface TenderLayoutProps {
  children: React.ReactNode;
  params: {
    tenderId: string;
  };
}

export default async function TenderWorkspaceLayout({ children, params }: TenderLayoutProps) {
  const { tenderId } = params;
  const data = await fetchTenderWorkspaceData(tenderId);

  if (!data) {
    notFound();
  }

  const { tenderDetails } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto min-w-0 max-w-full">
      {/* Persistent Tender Context Header with Submission Modal */}
      <TenderWorkspaceHeader tenderDetails={tenderDetails} />

      {/* Main Viewport */}
      <div>{children}</div>
    </div>
  );
}
