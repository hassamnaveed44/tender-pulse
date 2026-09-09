import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { notifyExtractionComplete } from "@/features/notifications/services/eventNotificationService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenderId, documentId, extractedCandidates } = body;

    if (!tenderId || !Array.isArray(extractedCandidates)) {
      return NextResponse.json({ error: "tenderId and extractedCandidates array are required" }, { status: 400 });
    }

    // 1. Write candidates to extracted_requirements staging table
    await prisma.extractedRequirement.deleteMany({
      where: { tenderId },
    });

    await prisma.extractedRequirement.createMany({
      data: extractedCandidates.map((c: any) => ({
        tenderId,
        sourceDocumentId: documentId || null,
        sourcePage: c.sourcePage || 1,
        rawPayload: {
          title: c.title,
          description: c.description || "",
          category: c.category || "Technical",
          mandatory: c.isMandatory ?? true,
          confidence: c.confidence || "HIGH",
          sourcePage: c.sourcePage || 1,
        },
        status: "PENDING",
      })),
    });

    // 2. Set tender status to IN_REVIEW
    const tender = await prisma.tender.update({
      where: { id: tenderId },
      data: { status: "IN_REVIEW" },
    });

    // 3. Append Audit Log
    const actor = await prisma.user.findFirst();
    if (actor) {
      await prisma.auditLog.create({
        data: {
          actorId: actor.id,
          tenderId,
          type: "EXTRACTION_COMPLETED",
          payload: { candidateCount: extractedCandidates.length, tenderTitle: tender.title },
        },
      });

      // 4. Send Notification
      await notifyExtractionComplete(actor.id, tender.title, extractedCandidates.length, tenderId);
    }

    return NextResponse.json({
      success: true,
      data: { tenderId, candidateCount: extractedCandidates.length },
      message: "Extraction staging completed via webhook",
    });
  } catch (error: any) {
    console.error("Extraction Webhook Error:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
