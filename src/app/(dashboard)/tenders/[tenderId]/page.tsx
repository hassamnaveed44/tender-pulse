import React from "react";
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
  const { requirements, teamMembers } = await fetchTenderWorkspaceData(tenderId);

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
