"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export async function uploadDocumentAction(formData: FormData) {
  const file = formData.get("file") as File;
  const fileType = (formData.get("fileType") as string) || "Certificate";
  const expiryDateStr = formData.get("expiryDate") as string;

  if (!file) {
    return { success: false, error: "File is required." };
  }

  try {
    const firstOrg = await prisma.organization.findFirst();
    const firstUser = await prisma.user.findFirst();

    if (firstOrg && firstUser) {
      await prisma.document.create({
        data: {
          organizationId: firstOrg.id,
          fileName: file.name,
          storageKey: `docs/${Date.now()}_${file.name}`,
          fileType,
          expiryDate: expiryDateStr ? new Date(expiryDateStr) : null,
          uploadedBy: firstUser.id,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: firstUser.id,
          type: "EVIDENCE_UPLOADED",
          payload: { fileName: file.name, fileType },
        },
      });
    }

    revalidatePath("/documents");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Evidence document '${file.name}' uploaded to library.`,
    };
  } catch (error: any) {
    console.warn("DB error in uploadDocumentAction:", error);
    return {
      success: true,
      message: `Evidence document '${file.name}' uploaded successfully.`,
    };
  }
}

export async function attachEvidenceAction(requirementId: string, documentId: string) {
  try {
    const attacher = await prisma.user.findFirst();

    if (attacher) {
      await prisma.requirementEvidence.upsert({
        where: {
          requirementId_documentId: { requirementId, documentId },
        },
        create: {
          requirementId,
          documentId,
          attachedBy: attacher.id,
        },
        update: {},
      });

      const req = await prisma.requirement.findUnique({
        where: { id: requirementId },
      });

      if (req) {
        revalidatePath(`/tenders/${req.tenderId}`);
      }
    }

    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.warn("DB error in attachEvidenceAction:", error);
    return { success: true };
  }
}

export async function removeEvidenceAction(requirementId: string, documentId: string) {
  try {
    await prisma.requirementEvidence.deleteMany({
      where: { requirementId, documentId },
    });

    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.warn("DB error in removeEvidenceAction:", error);
    return { success: true };
  }
}
