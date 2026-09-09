import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log("Seeding database with realistic TenderPulse data...");

  // Clear existing
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.requirementEvidence.deleteMany();
  await prisma.document.deleteMany();
  await prisma.requirementAssignment.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.extractedRequirement.deleteMany();
  await prisma.tenderDocument.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      clerkUserId: "user_demo_1",
      email: "hassam@tenderpulse.io",
      fullName: "Hassam Naveed",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      clerkUserId: "user_demo_2",
      email: "sarah.chen@tenderpulse.io",
      fullName: "Sarah Chen",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      clerkUserId: "user_demo_3",
      email: "marcus.vance@tenderpulse.io",
      fullName: "Marcus Vance",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "Apex Engineering & Infrastructure",
      slug: "apex-engineering",
      createdBy: user1.id,
    },
  });

  // Add Organization Members
  await prisma.organizationMember.createMany({
    data: [
      { organizationId: org.id, userId: user1.id, role: "ADMIN", isActive: true },
      { organizationId: org.id, userId: user2.id, role: "MEMBER", isActive: true, invitedBy: user1.id },
      { organizationId: org.id, userId: user3.id, role: "MEMBER", isActive: true, invitedBy: user1.id },
    ],
  });

  // Create Documents in the Document Library
  const docIso = await prisma.document.create({
    data: {
      organizationId: org.id,
      fileName: "ISO_9001_2015_Certificate_Apex.pdf",
      storageKey: "docs/iso_9001_apex.pdf",
      fileType: "Certificate",
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months in future
      uploadedBy: user1.id,
    },
  });

  const docFinancial = await prisma.document.create({
    data: {
      organizationId: org.id,
      fileName: "Audited_Financial_Statements_FY2025.pdf",
      storageKey: "docs/financial_statements_2025.pdf",
      fileType: "Financial Statement",
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 yr
      uploadedBy: user2.id,
    },
  });

  const docInsurance = await prisma.document.create({
    data: {
      organizationId: org.id,
      fileName: "Public_Liability_Insurance_50M.pdf",
      storageKey: "docs/insurance_50m.pdf",
      fileType: "Insurance Policy",
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days - Expiring Soon!
      uploadedBy: user1.id,
    },
  });

  const docCyber = await prisma.document.create({
    data: {
      organizationId: org.id,
      fileName: "SOC2_Type_II_Compliance_Report.pdf",
      storageKey: "docs/soc2_report.pdf",
      fileType: "Audit Report",
      expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Expired 5 days ago!
      uploadedBy: user3.id,
    },
  });

  // Create Active Tender 1 (Metro Rail Project)
  const tender1 = await prisma.tender.create({
    data: {
      organizationId: org.id,
      title: "Metropolitan Transit Rail Electrification & Signaling System",
      clientName: "State Department of Transportation",
      referenceNumber: "TP-2026-00142",
      status: "ACTIVE",
      submissionDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days
      createdBy: user1.id,
    },
  });

  // Source RFP Document
  const rfpDoc1 = await prisma.tenderDocument.create({
    data: {
      tenderId: tender1.id,
      fileType: "RFP",
      fileName: "DOT_RFP_2026_Rail_Signaling_Master.pdf",
      storageKey: "rfps/dot_rfp_2026.pdf",
      uploadedBy: user1.id,
    },
  });

  // Requirements for Tender 1
  const req1 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      title: "Valid ISO 9001:2015 Quality Management Certification",
      description: "Bidder must attach an accredited ISO 9001:2015 certificate valid through contract completion.",
      category: "Eligibility",
      isMandatory: true,
      status: "VERIFIED",
      source: "EXTRACTED",
      sourcePage: 14,
    },
  });

  const req2 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      title: "Three (3) Consecutive Years Audited Financial Statements",
      description: "Audited balance sheets and P&L statements showing minimum annual turnover of $15M.",
      category: "Financial",
      isMandatory: true,
      status: "VERIFIED",
      source: "EXTRACTED",
      sourcePage: 28,
    },
  });

  const req3 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      title: "Public Liability and Professional Indemnity Coverage ($50M)",
      description: "Current certificate of currency for public liability insurance of no less than $50,000,000 per occurrence.",
      category: "Legal",
      isMandatory: true,
      status: "IN_REVIEW",
      source: "EXTRACTED",
      sourcePage: 45,
    },
  });

  const req4 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      title: "Lead Systems Engineer CV and Rail Safety Accreditation",
      description: "Proposed Key Personnel Lead Engineer must have minimum 10 years experience and valid Level 4 Rail Safety Credential.",
      category: "Technical",
      isMandatory: true,
      status: "MISSING",
      source: "EXTRACTED",
      sourcePage: 62,
    },
  });

  const req5 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      title: "Local Environmental & Carbon Offset Action Plan",
      description: "Detailed sustainability proposal outlining steps to achieve net-zero emission during transit construction phase.",
      category: "Technical",
      isMandatory: false,
      status: "NOT_STARTED",
      source: "EXTRACTED",
      sourcePage: 78,
    },
  });

  // Link Evidence
  await prisma.requirementEvidence.createMany({
    data: [
      { requirementId: req1.id, documentId: docIso.id, attachedBy: user1.id },
      { requirementId: req2.id, documentId: docFinancial.id, attachedBy: user2.id },
      { requirementId: req3.id, documentId: docInsurance.id, attachedBy: user1.id },
    ],
  });

  // Requirement Assignments
  await prisma.requirementAssignment.createMany({
    data: [
      { requirementId: req1.id, userId: user1.id, assignedBy: user1.id },
      { requirementId: req2.id, userId: user2.id, assignedBy: user1.id },
      { requirementId: req3.id, userId: user1.id, assignedBy: user1.id },
      { requirementId: req4.id, userId: user3.id, assignedBy: user1.id },
      { requirementId: req5.id, userId: user2.id, assignedBy: user1.id },
    ],
  });

  // Create Tender 2 (In Review / Extraction Stage)
  const tender2 = await prisma.tender.create({
    data: {
      organizationId: org.id,
      title: "Smart Grid Power Substation SCADA Modernization",
      clientName: "National Energy Authority",
      referenceNumber: "TP-2026-00089",
      status: "IN_REVIEW",
      submissionDeadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000), // 24 days
      createdBy: user2.id,
    },
  });

  const rfpDoc2 = await prisma.tenderDocument.create({
    data: {
      tenderId: tender2.id,
      fileType: "RFP",
      fileName: "NEA_SmartGrid_RFP_Vol1.pdf",
      storageKey: "rfps/nea_smartgrid_vol1.pdf",
      uploadedBy: user2.id,
    },
  });

  // Staged Extracted Candidates for Tender 2 (Screen 6 Extraction Review)
  await prisma.extractedRequirement.createMany({
    data: [
      {
        tenderId: tender2.id,
        sourceDocumentId: rfpDoc2.id,
        sourcePage: 12,
        rawPayload: JSON.stringify({
          title: "IEC 61850 Substation Automation Standard Compliance",
          description: "All supplied IEDs and gateways must comply natively with the IEC 61850 Edition 2 protocol.",
          category: "Technical",
          mandatory: true,
          confidence: "HIGH",
          sourcePage: 12,
        }),
        status: "PENDING",
      },
      {
        tenderId: tender2.id,
        sourceDocumentId: rfpDoc2.id,
        sourcePage: 19,
        rawPayload: JSON.stringify({
          title: "Certified NERC CIP Cybersecurity Compliance Audit",
          description: "Vendors must provide proof of adherence to NERC CIP-002 through CIP-014 critical infrastructure standards.",
          category: "Legal",
          mandatory: true,
          confidence: "HIGH",
          sourcePage: 19,
        }),
        status: "PENDING",
      },
      {
        tenderId: tender2.id,
        sourceDocumentId: rfpDoc2.id,
        sourcePage: 34,
        rawPayload: JSON.stringify({
          title: "Manufacturer 10-Year Hardware Warranty & Rapid SLA",
          description: "Vendor must guarantee on-site 4-hour hardware replacement for mission-critical SCADA controllers.",
          category: "Technical",
          mandatory: false,
          confidence: "MEDIUM",
          sourcePage: 34,
        }),
        status: "PENDING",
      },
      {
        tenderId: tender2.id,
        sourceDocumentId: rfpDoc2.id,
        sourcePage: 51,
        rawPayload: JSON.stringify({
          title: "Bid Bond / Bank Guarantee of 2% Contract Value",
          description: "Submit an unconditional bank guarantee issued by a Tier 1 financial institution valid for 180 days.",
          category: "Financial",
          mandatory: true,
          confidence: "LOW",
          sourcePage: 51,
        }),
        status: "PENDING",
      },
    ],
  });

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        tenderId: tender1.id,
        type: "DOCUMENT_EXPIRING",
        message: "Public Liability Insurance policy (#50M) expires in 14 days.",
        isRead: false,
      },
      {
        userId: user1.id,
        tenderId: tender2.id,
        type: "EXTRACTION_COMPLETE",
        message: "Automated extraction completed for NEA Smart Grid RFP (4 candidates pending review).",
        isRead: false,
      },
      {
        userId: user3.id,
        tenderId: tender1.id,
        type: "ASSIGNMENT",
        message: "You were assigned to 'Lead Systems Engineer CV and Rail Safety Accreditation'.",
        isRead: false,
      },
    ],
  });

  // Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: user1.id,
        tenderId: tender1.id,
        type: "TENDER_CREATED",
        payload: JSON.stringify({ title: tender1.title, ref: tender1.referenceNumber }),
      },
      {
        actorId: user1.id,
        tenderId: tender1.id,
        type: "EVIDENCE_ATTACHED",
        payload: JSON.stringify({ requirement: req1.title, document: docIso.fileName }),
      },
      {
        actorId: user1.id,
        tenderId: tender1.id,
        type: "REQUIREMENT_VERIFIED",
        payload: JSON.stringify({ requirement: req1.title, verifiedBy: user1.fullName }),
      },
    ],
  });

  console.log("Database seeded successfully!");
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
