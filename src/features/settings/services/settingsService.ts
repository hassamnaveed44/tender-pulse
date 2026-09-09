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

export async function fetchOrganizationSettingsData() {
  try {
    let org = await prisma.organization.findFirst({
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    if (!org) {
      let firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        firstUser = await prisma.user.create({
          data: {
            clerkUserId: "user_system_admin",
            email: "admin@tenderpulse.io",
            fullName: "System Admin",
          },
        });
      }

      org = await prisma.organization.create({
        data: {
          name: "Apex Engineering & Infrastructure",
          slug: "apex-engineering",
          createdBy: firstUser.id,
          members: {
            create: {
              userId: firstUser.id,
              role: "ADMIN",
            },
          },
        },
        include: {
          members: {
            include: { user: true },
          },
        },
      });
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
      members,
    };
  } catch (error) {
    console.error("DB query failed in fetchOrganizationSettingsData:", error);
    return {
      organization: {
        id: "default-org",
        name: "TenderPulse Workspace",
        slug: "tenderpulse-workspace",
        createdAt: new Date(),
        membersCount: 0,
      },
      members: [],
    };
  }
}
