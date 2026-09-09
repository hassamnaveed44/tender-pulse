import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { type, data } = payload;

    if (type === "user.created" || type === "user.updated") {
      const clerkUserId = data.id;
      const email = data.email_addresses?.[0]?.email_address || "";
      const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || email.split("@")[0];
      const avatarUrl = data.image_url || null;

      await prisma.user.upsert({
        where: { clerkUserId },
        create: {
          clerkUserId,
          email,
          fullName,
          avatarUrl,
        },
        update: {
          email,
          fullName,
          avatarUrl,
        },
      });

      return NextResponse.json({ success: true, message: "User synced from Clerk webhook" });
    }

    return NextResponse.json({ success: true, message: "Webhook event ignored" });
  } catch (error: any) {
    console.error("Clerk Webhook Error:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
