import { prisma } from "@/lib/db/prisma";

export interface OrgMemberItem {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role: "ADMIN" | "MEMBER";
  isActive: boolean;
  joinedAt: Date;
}

export interface OrganizationDetails {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  membersCount: number;
}

const FALLBACK_ORG: OrganizationDetails = {
  id: "org-1",
  name: "Apex Engineering & Infrastructure",
  slug: "apex-engineering",
  createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  membersCount: 3,
};

const FALLBACK_MEMBERS: OrgMemberItem[] = [
  {
    id: "mem-1",
    userId: "user-1",
    fullName: "Hassam Naveed",
    email: "hassam@tenderpulse.io",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "ADMIN",
    isActive: true,
    joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: "mem-2",
    userId: "user-2",
    fullName: "Sarah Chen",
    email: "sarah.chen@tenderpulse.io",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    role: "MEMBER",
    isActive: true,
    joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    id: "mem-3",
    userId: "user-3",
    fullName: "Marcus Vance",
    email: "marcus.vance@tenderpulse.io",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "MEMBER",
    isActive: true,
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

export async function fetchOrganizationSettingsData() {
  try {
    const org = await prisma.organization.findFirst({
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    if (!org) {
      return {
        organization: FALLBACK_ORG,
        members: FALLBACK_MEMBERS,
      };
    }

    const organization: OrganizationDetails = {
      id: org.id,
      name: org.name,
      slug: org.slug,
      createdAt: new Date(org.createdAt),
      membersCount: org.members.length,
    };

    const members: OrgMemberItem[] = org.members.map((m) => ({
      id: m.id,
      userId: m.userId,
      fullName: m.user.fullName,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      role: m.role as OrgMemberItem["role"],
      isActive: m.isActive,
      joinedAt: new Date(m.joinedAt),
    }));

    return {
      organization,
      members: members.length > 0 ? members : FALLBACK_MEMBERS,
    };
  } catch (error) {
    console.warn("DB query failed in fetchOrganizationSettingsData, using fallback:", error);
    return {
      organization: FALLBACK_ORG,
      members: FALLBACK_MEMBERS,
    };
  }
}
