export interface RequirementItem {
  id: string;
  isMandatory: boolean;
  status: string; // 'NOT_STARTED' | 'IN_REVIEW' | 'VERIFIED' | 'MISSING'
}

export interface ReadinessScore {
  percentage: number;
  totalMandatory: number;
  verifiedMandatory: number;
  inReviewMandatory: number;
  missingMandatory: number;
  notStartedMandatory: number;
  totalOptional: number;
  verifiedOptional: number;
  isSubmissionReady: boolean;
}

export function calculateReadiness(requirements: RequirementItem[]): ReadinessScore {
  const mandatory = requirements.filter((r) => r.isMandatory);
  const optional = requirements.filter((r) => !r.isMandatory);

  const totalMandatory = mandatory.length;
  const verifiedMandatory = mandatory.filter((r) => r.status === "VERIFIED").length;
  const inReviewMandatory = mandatory.filter((r) => r.status === "IN_REVIEW").length;
  const missingMandatory = mandatory.filter((r) => r.status === "MISSING").length;
  const notStartedMandatory = mandatory.filter((r) => r.status === "NOT_STARTED").length;

  const totalOptional = optional.length;
  const verifiedOptional = optional.filter((r) => r.status === "VERIFIED").length;

  const percentage = totalMandatory > 0 ? Math.round((verifiedMandatory / totalMandatory) * 100) : 0;
  const isSubmissionReady = totalMandatory > 0 && verifiedMandatory === totalMandatory;

  return {
    percentage,
    totalMandatory,
    verifiedMandatory,
    inReviewMandatory,
    missingMandatory,
    notStartedMandatory,
    totalOptional,
    verifiedOptional,
    isSubmissionReady,
  };
}
