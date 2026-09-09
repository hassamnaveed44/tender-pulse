import React from "react";
import { fetchOrganizationSettingsData } from "@/features/settings/services/settingsService";
import { OrganizationSettings } from "@/features/settings/components/OrganizationSettings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { organization, members } = await fetchOrganizationSettingsData();

  return (
    <div className="space-y-6">
      <OrganizationSettings organization={organization} members={members} />
    </div>
  );
}
