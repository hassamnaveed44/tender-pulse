import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { parsePdfRfpDocument } from "@/features/extraction/services/pdfParserService";
import { notifyExtractionComplete } from "@/features/notifications/services/eventNotificationService";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tenderId = formData.get("tenderId") as string;
    const file = formData.get("file") as File | null;

    if (!tenderId) {
      return NextResponse.json({ error: "tenderId is required" }, { status: 400 });
    }

    let parsedClauses = [];

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      parsedClauses = await parsePdfRfpDocument(buffer);

      // Record document in DB
      const admin = await prisma.user.findFirst();
      if (admin) {
        const doc = await prisma.tenderDocument.create({
          data: {
            tenderId,
            fileType: "RFP",
            fileName: file.name,
            storageKey: `rfps/${Date.now()}_${file.name}`,
            uploadedBy: admin.id,
          },
        });

        // Delete previous staging candidates if re-running
        await prisma.extractedRequirement.deleteMany({
          where: { tenderId },
        });

        // Insert extracted clauses into ExtractedRequirement
        await prisma.extractedRequirement.createMany({
          data: parsedClauses.map((c) => ({
            tenderId,
            sourceDocumentId: doc.id,
            sourcePage: c.sourcePage,
            rawPayload: {
              title: c.title,
              description: c.description,
              category: c.category,
              mandatory: c.isMandatory,
              confidence: c.confidence,
              sourcePage: c.sourcePage,
            },
            status: "PENDING",
          })),
        });

        // Notify Admin
        await notifyExtractionComplete(admin.id, file.name, parsedClauses.length, tenderId);
      }
    } else {
      // Create sample clauses if no file provided
      const sampleClauses = await parsePdfRfpDocument(Buffer.from(""));
      const admin = await prisma.user.findFirst();
      if (admin) {
        await prisma.extractedRequirement.createMany({
          data: sampleClauses.map((c) => ({
            tenderId,
            sourcePage: c.sourcePage,
            rawPayload: {
              title: c.title,
              description: c.description,
              category: c.category,
              mandatory: c.isMandatory,
              confidence: c.confidence,
              sourcePage: c.sourcePage,
            },
            status: "PENDING",
          })),
        });
      }
    }

    // Set Tender status to IN_REVIEW
    await prisma.tender.update({
      where: { id: tenderId },
      data: { status: "IN_REVIEW" },
    });

    return NextResponse.json({
      success: true,
      message: `Extracted ${parsedClauses.length} clauses from PDF.`,
      candidateCount: parsedClauses.length,
      tenderId,
      reviewUrl: `/tenders/${tenderId}/review`,
    });
  } catch (error: any) {
    console.error("Real PDF Extraction API Error:", error);
    return NextResponse.json({ error: error.message || "Extraction failed" }, { status: 500 });
  }
}
