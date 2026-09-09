"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { CreateTenderSchema, CreateTenderInput } from "../types/tenderTypes";
import { parsePdfRfpDocument } from "@/features/extraction/services/pdfParserService";

export async function createTenderAction(input: CreateTenderInput) {
  const parseResult = CreateTenderSchema.safeParse(input);

  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.errors[0].message,
    };
  }

  const { title, clientName, referenceNumber, submissionDeadline } = parseResult.data;

  // Auto-generate reference number if missing
  const ref =
    referenceNumber && referenceNumber.trim().length > 0
      ? referenceNumber.trim()
      : `TP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    // Ensure initial User and Organization exist in DB
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

    let firstOrg = await prisma.organization.findFirst();
    if (!firstOrg) {
      firstOrg = await prisma.organization.create({
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
      });
    }

    const newTender = await prisma.tender.create({
      data: {
        organizationId: firstOrg.id,
        title,
        clientName,
        referenceNumber: ref,
        status: "DRAFT",
        submissionDeadline: new Date(submissionDeadline),
        createdBy: firstUser.id,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: firstUser.id,
        tenderId: newTender.id,
        type: "TENDER_CREATED",
        payload: { title, ref, clientName },
      },
    });

    revalidatePath("/tenders");
    revalidatePath("/dashboard");

    return {
      success: true,
      tenderId: newTender.id,
      referenceNumber: newTender.referenceNumber,
    };
  } catch (error: any) {
    console.error("Error creating tender in database:", error);
    return {
      success: false,
      error: error.message || "Failed to create tender in database.",
    };
  }
}

export async function uploadRfpDocumentAction(formData: FormData) {
  const tenderId = formData.get("tenderId") as string;
  const file = formData.get("file") as File;

  if (!tenderId || !file) {
    return { success: false, error: "Tender ID and file are required." };
  }

  try {
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const extractedClauses = await parsePdfRfpDocument(buffer);

    const tenderDoc = await prisma.tenderDocument.create({
      data: {
        tenderId,
        fileType: "RFP",
        fileName: file.name,
        storageKey: `rfps/${Date.now()}_${file.name}`,
        uploadedBy: firstUser.id,
      },
    });

    // Insert extracted candidates into ExtractedRequirement staging table
    for (const clause of extractedClauses) {
      await prisma.extractedRequirement.create({
        data: {
          tenderId,
          sourceDocumentId: tenderDoc.id,
          sourcePage: clause.sourcePage,
          rawPayload: {
            title: clause.title,
            description: clause.description,
            category: clause.category,
            mandatory: clause.isMandatory,
            confidence: clause.confidence,
          },
          status: "PENDING",
        },
      });
    }

    await prisma.tender.update({
      where: { id: tenderId },
      data: { status: "IN_REVIEW" },
    });

    revalidatePath(`/tenders`);
    revalidatePath(`/tenders/${tenderId}`);
    revalidatePath(`/tenders/${tenderId}/review`);

    return {
      success: true,
      message: `Document '${file.name}' uploaded successfully. ${extractedClauses.length} extracted requirement clauses ready for review.`,
    };
  } catch (error: any) {
    console.error("DB update failed during RFP upload action:", error);
    return {
      success: false,
      error: error.message || "Failed to process RFP document upload.",
    };
  }
}

export async function submitTenderAction(tenderId: string) {
  try {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: { requirements: true },
    });

    if (!tender) {
      return { success: false, error: "Tender record not found." };
    }

    const unverifiedMandatory = tender.requirements.filter(
      (r) => r.isMandatory && r.status !== "VERIFIED"
    );

    if (unverifiedMandatory.length > 0) {
      return {
        success: false,
        code: "READINESS_INCOMPLETE",
        error: `Cannot submit tender. ${unverifiedMandatory.length} mandatory requirement(s) remain unverified.`,
      };
    }

    const updated = await prisma.tender.update({
      where: { id: tenderId },
      data: { status: "SUBMITTED" },
    });

    const firstUser = await prisma.user.findFirst();
    if (firstUser) {
      await prisma.auditLog.create({
        data: {
          actorId: firstUser.id,
          tenderId: tender.id,
          type: "TENDER_SUBMITTED",
          payload: { title: tender.title, referenceNumber: tender.referenceNumber },
        },
      });
    }

    revalidatePath("/tenders");
    revalidatePath(`/tenders/${tenderId}`);

    return {
      success: true,
      message: "Tender successfully submitted!",
      tender: updated,
    };
  } catch (error: any) {
    console.error("Error submitting tender:", error);
    return { success: false, error: error.message || "Failed to submit tender." };
  }
}
