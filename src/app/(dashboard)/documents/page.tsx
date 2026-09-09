import React from "react";
import { fetchDocumentsList } from "@/features/documents/services/documentService";
import { DocumentLibraryTable } from "@/features/documents/components/DocumentLibraryTable";

export const dynamic = "force-dynamic";

interface DocumentsPageProps {
  searchParams: {
    q?: string;
    type?: string;
  };
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const documents = await fetchDocumentsList(searchParams.q, searchParams.type);

  return (
    <div className="space-y-6">
      <DocumentLibraryTable documents={documents} />
    </div>
  );
}
