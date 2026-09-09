"use client";

import React, { useState } from "react";
import { Users, UserPlus, Shield, Building2, Mail, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { OrganizationDetails, OrgMemberItem } from "../services/settingsService";
import { inviteMemberAction, updateRoleAction } from "../actions/settingsActions";

interface OrganizationSettingsProps {
  organization: OrganizationDetails;
  members: OrgMemberItem[];
}

export function OrganizationSettings({
  organization,
  members: initialMembers,
}: OrganizationSettingsProps) {
  const [members, setMembers] = useState<OrgMemberItem[]>(initialMembers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const res = await inviteMemberAction(inviteEmail, inviteRole);
    setIsLoading(false);

    if (res.success) {
      setMessage(res.message || `Invitation sent to ${inviteEmail}`);
      setIsInviteModalOpen(false);
      setInviteEmail("");
    }
  }

  async function handleRoleChange(memberId: string, newRole: "ADMIN" | "MEMBER") {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    await updateRoleAction(memberId, newRole);
  }

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border min-w-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Organization Settings & Team Roles
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Manage organization workspace profile, team access levels, and active member seats.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsInviteModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Invite Team Member
        </Button>
      </div>

      {message && (
        <div className="p-3 rounded bg-accent/10 border border-accent/20 text-xs font-semibold text-accent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-text-secondary hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Organization Profile Card */}
      <div className="bg-surface p-5 rounded-lg border border-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary text-white font-mono font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
            AE
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">{organization.name}</h2>
            <p className="text-xs text-text-secondary font-mono">
              Slug: <strong className="text-primary">{organization.slug}</strong> • Workspace ID: {organization.id}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold bg-[#E8F4F3] text-accent px-3 py-1.5 rounded self-start sm:self-center">
          {organization.membersCount} Active Seats
        </span>
      </div>

      {/* Team Members Management Table */}
      <div className="bg-surface rounded-lg border border-border shadow-subtle space-y-4 p-5 min-w-0 max-w-full">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-text-primary">Workspace Team Members</h3>
          </div>
          <span className="text-xs font-mono text-text-secondary">{members.length} Members</span>
        </div>

        <div className="overflow-x-auto min-w-0 max-w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-alt border-b border-border text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                <th className="p-3.5">Member Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Role Level</th>
                <th className="p-3.5">Joined Date</th>
                <th className="p-3.5 text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-surface-alt/50 transition-colors">
                  {/* Name */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {member.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-text-primary">{member.fullName}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="p-3.5 text-text-secondary font-mono text-[11px]">
                    {member.email}
                  </td>

                  {/* Role Badge */}
                  <td className="p-3.5 whitespace-nowrap">
                    {member.role === "ADMIN" ? (
                      <span className="font-mono text-[10px] font-bold bg-[#173B4D] text-white px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <Shield className="w-3 h-3 text-accent" />
                        ADMIN
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] font-bold bg-surface-alt text-text-secondary px-2 py-0.5 rounded w-fit">
                        MEMBER
                      </span>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="p-3.5 text-text-secondary font-mono text-[11px]">
                    {member.joinedAt.toLocaleDateString()}
                  </td>

                  {/* Role Change */}
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                      className="px-2 py-1 text-xs border border-border rounded bg-surface font-medium text-text-primary"
                    >
                      <option value="ADMIN">Admin Access</option>
                      <option value="MEMBER">Member Access</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg border border-border shadow-dropdown max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-alt"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <UserPlus className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">Invite Team Member</h3>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <Input
                label="Email Address"
                placeholder="colleague@company.com"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div>
                <label className="text-xs font-medium text-text-primary block mb-1">Role Level</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-border rounded bg-surface font-medium"
                >
                  <option value="MEMBER">Member (Compliance Editor)</option>
                  <option value="ADMIN">Admin (Full Workspace Management)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isLoading} leftIcon={<UserPlus className="w-4 h-4" />}>
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
