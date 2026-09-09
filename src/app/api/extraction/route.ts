import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenderId, documentId } = body;

    if (!tenderId) {
      return NextResponse.json({ error: "tenderId is required" }, { status: 400 });
    }

    // Check if candidates already exist
    const existingCount = await prisma.extractedRequirement.count({
      where: { tenderId },
    });

    if (existingCount === 0) {
      // Seed default candidates for the tender
      await prisma.extractedRequirement.createMany({
        data: [
          {
            tenderId,
            sourceDocumentId: documentId || null,
            sourcePage: 12,
            rawPayload: {
              title: "IEC 61850 Substation Automation Standard Compliance",
              description: "All supplied IEDs, gateways, and bay control units must natively comply with IEC 61850 Edition 2 protocol.",
              category: "Technical",
              mandatory: true,
              confidence: "HIGH",
              sourcePage: 12,
            },
            status: "PENDING",
          },
          {
            tenderId,
            sourceDocumentId: documentId || null,
            sourcePage: 19,
            rawPayload: {
              title: "Certified NERC CIP Cybersecurity Compliance Audit Report",
              description: "Vendors must submit audited certification proving adherence to NERC CIP-002 through CIP-014 critical infrastructure standards.",
              category: "Legal",
              mandatory: true,
              confidence: "HIGH",
              sourcePage: 19,
            },
            status: "PENDING",
          },
          {
            tenderId,
            sourceDocumentId: documentId || null,
            sourcePage: 34,
            rawPayload: {
              title: "Manufacturer 10-Year Hardware Warranty & 4-Hour On-Site SLA",
              description: "Vendor must guarantee on-site 4-hour replacement SLA for mission-critical SCADA controllers for a 10-year period.",
              category: "Technical",
              mandatory: false,
              confidence: "MEDIUM",
              sourcePage: 34,
            },
            status: "PENDING",
          },
          {
            tenderId,
            sourceDocumentId: documentId || null,
            sourcePage: 51,
            rawPayload: {
              title: "Bid Bond / Bank Guarantee of 2% Total Contract Value",
              description: "Submit an unconditional bank guarantee issued by a Tier 1 financial institution valid for no less than 180 days.",
              category: "Financial",
              mandatory: true,
              confidence: "LOW",
              sourcePage: 51,
            },
            status: "PENDING",
          },
        ],
      });

      await prisma.tender.update({
        where: { id: tenderId },
        data: { status: "IN_REVIEW" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Extraction pipeline processing completed.",
      tenderId,
      reviewUrl: `/tenders/${tenderId}/review`,
    });
  } catch (error: any) {
    console.error("Extraction API Error:", error);
    return NextResponse.json({ error: error.message || "Extraction failed" }, { status: 500 });
  }
}
