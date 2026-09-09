const fs = require("fs");
const path = require("path");

function createSampleRfpPdf() {
  const dir = path.join(__dirname, "../public/test-rfps");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, "Sample_Transit_Signaling_RFP.pdf");

  // Minimal valid PDF structure with real RFP requirement text
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 1200 >>
stream
BT
/F1 14 Tf
50 730 Td
(METROPOLITAN TRANSIT AUTHORITY - RFP SPECIFICATION) Tj
/F1 10 Tf
0 -25 Td
(Reference: TP-2026-00142 | Title: Rail Electrification & Signaling System) Tj
0 -30 Td
(SECTION 1: ELIGIBILITY OBLIGATIONS) Tj
0 -15 Td
(Clause 1.1: Quality Accreditation - Bidder shall possess valid ISO 9001:2015 accreditation.) Tj
0 -15 Td
(Clause 1.2: Rail License - Bidder must hold valid Tier-1 Railway Safety Accreditation Credential.) Tj
0 -30 Td
(SECTION 2: TECHNICAL REQUIREMENTS) Tj
0 -15 Td
(Clause 2.1: SCADA Protocol - All IEDs and gateways must natively comply with IEC 61850 protocol.) Tj
0 -15 Td
(Clause 2.2: Lead Systems Engineer - Key Personnel Lead Systems Engineer shall have 10+ years experience.) Tj
0 -15 Td
(Clause 2.3: Hardware Warranty - Vendor must guarantee 10-Year Hardware Warranty with 4-hour on-site SLA.) Tj
0 -30 Td
(SECTION 3: FINANCIAL OBLIGATIONS) Tj
0 -15 Td
(Clause 3.1: Audited Financials - Bidder must submit 3 consecutive years audited statements ($15M turnover).) Tj
0 -15 Td
(Clause 3.2: Bid Guarantee - Submit unconditional bank guarantee of 2% total contract value valid 180 days.) Tj
0 -30 Td
(SECTION 4: LEGAL & INSURANCE OBLIGATIONS) Tj
0 -15 Td
(Clause 4.1: Public Liability - Vendor shall maintain Public Liability Insurance of no less than $50,000,000.) Tj
0 -15 Td
(Clause 4.2: Cybersecurity Audit - Vendor must provide certified NERC CIP compliance audit report.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000001495 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1566
%%EOF`;

  fs.writeFileSync(filePath, Buffer.from(pdfContent, "utf-8"));
  console.log("Created sample RFP test PDF file at:", filePath);
}

createSampleRfpPdf();
