import React from "react";
import { notFound } from "next/navigation";
import { fetchTenderWorkspaceData } from "@/features/requirements/services/requirementService";
import { ComplianceMatrix } from "@/features/requirements/components/ComplianceMatrix";

export const dynamic = "force-dynamic";

interface WorkspacePageProps {
  params: {
    tenderId: string;
  };
}

export default async function TenderWorkspacePage({ params }: WorkspacePageProps) {
  const { tenderId } = params;
  const data = await fetchTenderWorkspaceData(tenderId);

  if (!data) {
    notFound();
  }

  const { requirements, teamMembers } = data;

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      <ComplianceMatrix
        tenderId={tenderId}
        initialRequirements={requirements}
        teamMembers={teamMembers}
      />
    </div>
  );
}
