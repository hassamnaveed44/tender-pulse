import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export interface SyncedUser {
  dbUserId: string;
  clerkUserId: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  orgId: string;
  role: "ADMIN" | "MEMBER";
}

export async function getOrCreateCurrentUser(): Promise<SyncedUser | null> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      // Fallback: try finding first user in database if dev/local without active Clerk session
      const firstDbUser = await prisma.user.findFirst({
        include: {
          memberships: { include: { organization: true } },
        },
      });

      if (firstDbUser && firstDbUser.memberships[0]) {
        const membership = firstDbUser.memberships[0];
        return {
          dbUserId: firstDbUser.id,
          clerkUserId: firstDbUser.clerkUserId,
          email: firstDbUser.email,
          fullName: firstDbUser.fullName,
          avatarUrl: firstDbUser.avatarUrl,
          orgId: membership.organizationId,
          role: membership.role as "ADMIN" | "MEMBER",
        };
      }

      return null;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || "user@tenderpulse.io";
    const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email.split("@")[0];
    const avatarUrl = clerkUser.imageUrl || null;

    // 1. Sync User table
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      include: { memberships: true },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email,
          fullName,
          avatarUrl,
        },
        include: { memberships: true },
      });
    }

    // 2. Ensure Organization exists
    let membership = dbUser.memberships[0];

    if (!membership) {
      let firstOrg = await prisma.organization.findFirst();

      if (!firstOrg) {
        firstOrg = await prisma.organization.create({
          data: {
            name: "Apex Engineering & Infrastructure",
            slug: "apex-engineering",
            createdBy: dbUser.id,
          },
        });
      }

      membership = await prisma.organizationMember.create({
        data: {
          organizationId: firstOrg.id,
          userId: dbUser.id,
          role: "ADMIN",
          isActive: true,
        },
      });
    }

    return {
      dbUserId: dbUser.id,
      clerkUserId: dbUser.clerkUserId,
      email: dbUser.email,
      fullName: dbUser.fullName,
      avatarUrl: dbUser.avatarUrl,
      orgId: membership.organizationId,
      role: membership.role as "ADMIN" | "MEMBER",
    };
  } catch (error) {
    console.warn("User sync error:", error);
    return null;
  }
}

export async function requireAdminRole(orgId: string, userId: string) {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId: userId,
      },
    },
  });

  if (!membership || membership.role !== "ADMIN") {
    throw new Error("403 FORBIDDEN: Only Organization ADMIN members can perform this action.");
  }

  return membership;
}
