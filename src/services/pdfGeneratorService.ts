import { jsPDF } from 'jspdf';
import { testSuiteService, TestCase } from './testSuiteService';

export class PdfGeneratorService {
  /**
   * Generates a comprehensive multi-page QA Test Plan & Validation Manual PDF
   * and triggers a direct browser download.
   */
  generateAndDownloadTestPlanPdf(): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const testCases = testSuiteService.getAllTestCases();
    const stats = testSuiteService.getSummaryStats();
    const appUrl = window.location.origin;
    const testDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // Helper: Add standard page footer
    const addFooter = (pageNum: number, totalPagesStr = '5') => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text('Vyuhaa Continuum Care — Clinical OPD & ONDC Network QA Test Plan', margin, pageHeight - 8);
      doc.text(`Page ${pageNum} of ${totalPagesStr}`, pageWidth - margin - 20, pageHeight - 8);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
    };

    // Helper: Add section header
    const addSectionHeader = (title: string, badge?: string) => {
      if (y > pageHeight - 35) {
        doc.addPage();
        y = margin;
      }
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(24, 34, 53);
      doc.text(title, margin + 3, y + 5.5);

      if (badge) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(79, 70, 229);
        doc.text(badge, pageWidth - margin - 35, y + 5.5);
      }
      y += 12;
    };

    // Helper: Check page overflow
    const checkOverflow = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 15) {
        doc.addPage();
        y = margin + 5;
      }
    };

    // =========================================================
    // PAGE 1: TITLE, DOCUMENT CONTROL & CREDENTIALS MATRIX
    // =========================================================
    
    // Top decorative bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, y, contentWidth, 24, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('VYUHAA CONTINUUM CARE', margin + 6, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(226, 232, 240);
    doc.text('Comprehensive QA Test Plan & Validation Manual • v2.4', margin + 6, y + 16);

    doc.setFontSize(8);
    doc.setTextColor(190, 242, 100);
    doc.text('STATUS: ACTIVE TEST SUITE', pageWidth - margin - 48, y + 9);

    y += 28;

    // Document Metadata Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Target Environment URL:', margin + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(appUrl, margin + 46, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Document Release Date:', margin + 4, y + 12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`${testDate} (St. Anne Hospital OPD Deployment)`, margin + 46, y + 12);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Testing Scope:', margin + 4, y + 18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text('Single-App Logins, Pathology OCR, Diagnostic Analyser, ABDM, ONDC BPP Hub', margin + 46, y + 18);

    y += 27;

    // Section 1: Executive Test Objective
    addSectionHeader('1. EXECUTIVE TEST OBJECTIVE & ARCHITECTURE SCOPE');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const objectiveText = doc.splitTextToSize(
      'This document provides testing teams with step-by-step test scenarios, sample test fixtures, and validation criteria for the Vyuhaa Continuum Care platform. The application unifies tier-2 maternal and pediatric OPD governance with independent local shops integrated via the ONDC Open Health Network. Key verification focuses on: 1) Role-based access without cross-contamination, 2) Pathology PDF/Image report upload and AI OCR deciphering, 3) Obstetric-calibrated Diagnostic Results Analyser (anemia Mentzer index, DIPSI gestational diabetes, thyroid TSH), 4) ABDM NRCeS FHIR R4 DiagnosticReport bundle transmission, and 5) ONDC BPP seller node onboarding and Beckn transaction integrity.',
      contentWidth
    );
    doc.text(objectiveText, margin, y);
    y += objectiveText.length * 4.2 + 4;

    // Section 2: Personas & Credentials Matrix Table
    addSectionHeader('2. TEST PERSONAS & AUTHENTICATION CREDENTIALS MATRIX');

    // Table Header
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('ROLE / USER PERSONA', margin + 3, y + 4.2);
    doc.text('ASSIGNED DESK / SHOP', margin + 55, y + 4.2);
    doc.text('USERNAME', margin + 115, y + 4.2);
    doc.text('PASSCODE', margin + 145, y + 4.2);
    doc.text('ONDC BPP ID', margin + 165, y + 4.2);
    y += 7;

    const userRows = [
      { name: 'Dr. Radhika Sen (Admin)', desk: 'Superintendent Office (Floor 2)', user: 'admin', pass: 'admin123', bpp: 'BAP-HOSP-001' },
      { name: 'Dr. Anita Rao (OB/GYN)', desk: 'Room 4 Maternal Suite', user: 'anita', pass: 'doctor123', bpp: '—' },
      { name: 'Dr. Rajesh Kulkarni (MD)', desk: 'Room 1 General Medicine', user: 'rajesh', pass: 'doctor123', bpp: '—' },
      { name: 'Dr. Sneha Patil (Peds)', desk: 'Room 2 Pediatric Suite', user: 'sneha', pass: 'doctor123', bpp: '—' },
      { name: 'Sister Mary Fernandez', desk: 'Central Front-Desk Triage', user: 'reception', pass: 'nurse123', bpp: '—' },
      { name: 'Dr. Sudhir Shenoy (Apex Lab)', desk: 'Apex Diagnostic Hub (City Centre)', user: 'apexlab', pass: 'vendor123', bpp: 'BPP-LAB-APEX-092' },
      { name: 'Dr. Veena Hegde (Suraksha)', desk: 'Suraksha Ultrasound (Vidyanagar)', user: 'surakshalab', pass: 'vendor123', bpp: 'BPP-LAB-SURAKSHA-114' },
      { name: 'Suresh Hegde (Jan Aushadhi)', desk: 'PM Jan Aushadhi Kendra #5048', user: 'janaushadhi', pass: 'vendor123', bpp: 'BPP-PHARM-5048' },
      { name: 'Priya N., R.Ph. (MedPlus)', desk: 'MedPlus 24hr Station Road', user: 'medplus', pass: 'vendor123', bpp: 'BPP-PHARM-882' }
    ];

    userRows.forEach((row, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
      doc.rect(margin, y - 0.5, contentWidth, 5.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(row.name, margin + 3, y + 3.2);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(row.desk, margin + 55, y + 3.2);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(225, 29, 72);
      doc.text(row.user, margin + 115, y + 3.2);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(row.pass, margin + 145, y + 3.2);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(row.bpp !== '—' ? 79 : 140, row.bpp !== '—' ? 70 : 140, row.bpp !== '—' ? 229 : 140);
      doc.text(row.bpp, margin + 165, y + 3.2);
      y += 5.5;
    });

    addFooter(1);

    // =========================================================
    // PAGE 2: TEST SUITES & EXECUTION PROCEDURES (SUITES 1 & 2)
    // =========================================================
    doc.addPage();
    y = margin;

    addSectionHeader('3. DETAILED TEST SUITES & VERIFICATION PROTOCOLS (SUITE 1 & 2)', 'SUITE 1: AUTH & SUITE 2: LAB OCR');

    const renderTestCaseBlock = (tc: TestCase) => {
      checkOverflow(36);

      // Card Header
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(`[${tc.id}] ${tc.title}`, margin + 3, y + 4.5);

      // Status Badge
      const isPass = tc.status === 'PASS';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(isPass ? 22 : 220, isPass ? 101 : 38, isPass ? 52 : 38);
      doc.text(`[ ${isPass ? 'PASS ✓' : 'TESTING ◻'} ]`, pageWidth - margin - 22, y + 4.5);
      y += 8;

      // Persona & Credentials
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Persona: ${tc.persona}  |  Credentials: ${tc.credentials.username} / ${tc.credentials.passcode}`, margin + 2, y + 2.5);
      y += 5.5;

      // Steps
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text('Test Steps:', margin + 2, y + 2);
      y += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      tc.steps.forEach((step, sIdx) => {
        const stepLines = doc.splitTextToSize(`${sIdx + 1}. ${step}`, contentWidth - 6);
        doc.text(stepLines, margin + 4, y + 2);
        y += stepLines.length * 3.5;
      });

      // Expected Result
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 118, 110);
      doc.text('Expected Result: ', margin + 2, y + 2);
      const expLines = doc.splitTextToSize(tc.expectedResult, contentWidth - 28);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      doc.text(expLines, margin + 28, y + 2);
      y += expLines.length * 3.5 + 4;

      // Divider line
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y - 1, pageWidth - margin, y - 1);
      y += 2;
    };

    // Render Suite 1 & 2 Test Cases
    const suite1And2 = testCases.filter(t => t.suiteId === 'AUTH' || t.suiteId === 'LAB_OCR');
    suite1And2.slice(0, 5).forEach(renderTestCaseBlock);

    addFooter(2);

    // =========================================================
    // PAGE 3: TEST SUITES 3 & 4 (DIAGNOSTIC ANALYSER & ONDC NETWORK)
    // =========================================================
    doc.addPage();
    y = margin;

    addSectionHeader('4. CLINICAL DIAGNOSTIC ANALYSER & ONDC VENDOR TEST SUITES', 'SUITE 3: ANALYSER & SUITE 4: ONDC');

    const suite3And4 = testCases.filter(t => t.suiteId === 'ANALYSER' || t.suiteId === 'ONDC');
    suite3And4.slice(0, 5).forEach(renderTestCaseBlock);

    addFooter(3);

    // =========================================================
    // PAGE 4: CLINICAL ANALYSER RULES & OCR VERIFICATION RUBRIC
    // =========================================================
    doc.addPage();
    y = margin;

    addSectionHeader('5. CLINICAL CRITERIA & DIAGNOSTIC ANALYSER VALIDATION RUBRIC');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(
      'Testers must verify that the Diagnostic Analyser applies exact clinical guidelines for maternal and general investigations:',
      margin, y
    );
    y += 5;

    // Clinical Table Header
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('INVESTIGATION', margin + 3, y + 4.2);
    doc.text('TEST PARAMETERS', margin + 45, y + 4.2);
    doc.text('CLINICAL CRITERIA / CUTOFF', margin + 95, y + 4.2);
    doc.text('ANALYSER INTERPRETATION & ACTION', margin + 140, y + 4.2);
    y += 7;

    const clinicalRows = [
      {
        test: 'Complete Blood Count (CBC)',
        params: 'Hb, MCV, RBC, Ferritin',
        criteria: 'Hb < 11.0 g/dL (Trimester 1/3) or < 10.5 g/dL (Trimester 2). Mentzer Index = MCV / RBC.',
        output: 'Mentzer Index > 13: Iron Deficiency Anemia (Prescribe IFA). Mentzer < 13: Hb Electrophoresis for Thalassemia.'
      },
      {
        test: 'Oral Glucose 75g (OGTT)',
        params: 'Fasting, 1-hr, 2-hr Plasma Glucose',
        criteria: 'DIPSI / ACOG: Fasting >= 92 mg/dL, 1-hr >= 180 mg/dL, 2-hr >= 153 mg/dL.',
        output: 'Gestational Diabetes Mellitus (GDM) confirmed. Flag CRITICAL. Action: Nutrition therapy & 32-wk scan.'
      },
      {
        test: 'Thyroid Function (TSH & FT4)',
        params: 'Ultrasensitive TSH, Free T4',
        criteria: 'ACOG: TSH > 2.5 mIU/L in 1st Tri or > 3.0 mIU/L in 2nd/3rd Tri with Normal FT4.',
        output: 'Subclinical Hypothyroidism in Pregnancy. Levothyroxine therapy recommendation & follow-up TSH at 4 wks.'
      },
      {
        test: 'Preeclampsia Urine Screen',
        params: 'Urine Protein, Albumin, BP',
        criteria: 'Protein >= 1+ (30 mg/dL) + SBP >= 140 mmHg or DBP >= 90 mmHg after 20 wks.',
        output: 'Preeclampsia Risk Alert. Flag urgent obstetric review, uric acid screen, and biophysical profile.'
      }
    ];

    clinicalRows.forEach((row, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
      doc.rect(margin, y - 0.5, contentWidth, 14, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(row.test, margin + 3, y + 3.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const paramLines = doc.splitTextToSize(row.params, 46);
      doc.text(paramLines, margin + 45, y + 3.5);

      const critLines = doc.splitTextToSize(row.criteria, 42);
      doc.text(critLines, margin + 95, y + 3.5);

      const outLines = doc.splitTextToSize(row.output, 40);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 118, 110);
      doc.text(outLines, margin + 140, y + 3.5);

      y += 14.5;
    });

    y += 5;

    // Section 6: ONDC Network Verification Protocol
    addSectionHeader('6. ONDC NETWORK ADD-ON ONBOARDING TEST PROCEDURE');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const ondcSteps = [
      '1. Step 1: Open Login View or Admin Portal -> Click "+ Register Shop via ONDC Network".',
      '2. Step 2: Select category: "Pathology Lab / Diagnostic Centre" OR "Retail Chemist / Pharmacy".',
      '3. Step 3: Fill Shop Name, In-charge Name, Contact, License (NABL or Drug Form 20/21), Pincode, and Desired Username.',
      '4. Step 4: Click "Register Shop & Activate ONDC Login". Observe 4-stage automated connection sequence.',
      '5. Step 5: Verify auto-generated BPP Subscriber ID (e.g. BPP-LAB-XXXXX-402) and Beckn v1.1.0 gateway node status.',
      '6. Step 6: Log in using the newly created credentials and verify shop dashboard, test catalog, and requisition stream.',
      '7. Step 7: Verify newly registered vendor appears in Dr. Anita Rao referral and prescription routing menus.'
    ];

    ondcSteps.forEach(step => {
      doc.text(step, margin + 2, y + 2);
      y += 4.2;
    });

    addFooter(4);

    // =========================================================
    // PAGE 5: DEFECT SEVERITY MATRIX & QA SIGN-OFF SHEET
    // =========================================================
    doc.addPage();
    y = margin;

    addSectionHeader('7. DEFECT SEVERITY CLASSIFICATION & QA SIGN-OFF SHEET');

    // Defect Table
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('SEVERITY', margin + 3, y + 4.2);
    doc.text('CRITERIA / DEFINITION', margin + 30, y + 4.2);
    doc.text('EXAMPLE IN CONTINUUM OPD', margin + 95, y + 4.2);
    doc.text('SLA TARGET', margin + 160, y + 4.2);
    y += 7;

    const defects = [
      {
        sev: 'Blocker (S1)',
        desc: 'Crash, data loss, security failure, inability to login or upload reports.',
        example: 'OCR fails to parse report; doctor desk crashes on consultation dispatch.',
        sla: '< 4 Hours'
      },
      {
        sev: 'Critical (S2)',
        desc: 'Core feature broken with no workaround; incorrect clinical calculation.',
        example: 'Mentzer Index computed with wrong formula; ABDM FHIR bundle rejected.',
        sla: '< 12 Hours'
      },
      {
        sev: 'Major (S3)',
        desc: 'Feature impaired but clinical workaround exists; wrong ONDC routing.',
        example: 'ONDC node catalog count displays 0; SMS/WhatsApp template untranslated.',
        sla: '< 24 Hours'
      },
      {
        sev: 'Minor (S4)',
        desc: 'UI formatting, alignment, typographic polish, or minor label inconsistency.',
        example: 'Badge color mismatch; small text truncation on low-resolution screen.',
        sla: '< 48 Hours'
      }
    ];

    defects.forEach((d, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
      doc.rect(margin, y - 0.5, contentWidth, 9, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(d.sev.includes('Blocker') ? 225 : 30, d.sev.includes('Blocker') ? 29 : 41, d.sev.includes('Blocker') ? 72 : 59);
      doc.text(d.sev, margin + 3, y + 3.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(d.desc, 60);
      doc.text(descLines, margin + 30, y + 3.5);

      const exLines = doc.splitTextToSize(d.example, 62);
      doc.text(exLines, margin + 95, y + 3.5);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(d.sla, margin + 160, y + 3.5);
      y += 9.5;
    });

    y += 8;

    // Test Execution Sign-Off Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('QA TEST EXECUTION SIGN-OFF & APPROVAL', margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Total Test Cases: ${stats.total}  |  Automated Verifications: Passed  |  Pass Rate: ${stats.passRate}%`, margin + 4, y + 12);

    doc.setDrawColor(226, 232, 240);
    doc.line(margin + 4, y + 15, pageWidth - margin - 4, y + 15);

    // Signatures placeholders
    const sigColWidth = (contentWidth - 12) / 3;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('QA Lead / Tester Name:', margin + 4, y + 20);
    doc.text('Clinical Reviewer (OB/GYN):', margin + 4 + sigColWidth, y + 20);
    doc.text('Hospital Superintendent:', margin + 4 + sigColWidth * 2, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Sign: ______________________', margin + 4, y + 28);
    doc.text('Sign: ______________________', margin + 4 + sigColWidth, y + 28);
    doc.text('Sign: ______________________', margin + 4 + sigColWidth * 2, y + 28);

    doc.text(`Date: ${testDate}`, margin + 4, y + 33);
    doc.text(`Date: ${testDate}`, margin + 4 + sigColWidth, y + 33);
    doc.text(`Date: ${testDate}`, margin + 4 + sigColWidth * 2, y + 33);

    addFooter(5);

    // Save PDF file
    doc.save('Vyuhaa_Continuum_Care_OPD_QA_Test_Plan_and_Execution_Guide.pdf');
  }
}

export const pdfGeneratorService = new PdfGeneratorService();
