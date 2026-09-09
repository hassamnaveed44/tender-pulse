import React from "react";
import { fetchTendersList } from "@/features/tenders/services/tenderService";
import { TenderListTable } from "@/features/tenders/components/TenderListTable";

export const dynamic = "force-dynamic";

interface TendersPageProps {
  searchParams: {
    q?: string;
    status?: string;
  };
}

export default async function TendersPage({ searchParams }: TendersPageProps) {
  const tenders = await fetchTendersList(searchParams.q, searchParams.status);

  return (
    <div className="space-y-6">
      <TenderListTable tenders={tenders} />
    </div>
  );
}
