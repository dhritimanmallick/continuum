import { CareGapRule, RuleCategory } from '../types';

export const INITIAL_RULES: CareGapRule[] = [
  // --- Antenatal (10 rules) ---
  {
    rule_id: 'A1',
    name: 'Early Antenatal Booking & MCP Registration',
    category: 'antenatal',
    population: 'pregnancy',
    trigger: { type: 'gestational_age', start_weeks: 6, end_weeks: 10 },
    overdue_after: { weeks: 2 },
    required_action: 'record_visit',
    display_reason: 'Antenatal booking and MCP card registration not completed',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Confirms intrauterine pregnancy, establishes baseline health parameters, initiates early folic acid supplementation.'
  },
  {
    rule_id: 'A2',
    name: 'First Trimester Booking Bloods (CBC, Blood Group, VDRL, HIV, HBsAg)',
    category: 'antenatal',
    population: 'pregnancy',
    trigger: { type: 'gestational_age', start_weeks: 8, end_weeks: 12 },
    overdue_after: { weeks: 2 },
    required_action: 'record_test',
    display_reason: 'First trimester booking blood panel not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Detects anaemia, Rh-isoimmunisation risk, and vertical transmission infections early.'
  },
  {
    rule_id: 'A3',
    name: 'Antenatal Td Dose 1 (Tetanus-diphtheria)',
    category: 'antenatal',
    population: 'pregnancy',
    trigger: { type: 'gestational_age', start_weeks: 14, end_weeks: 16 },
    overdue_after: { weeks: 2 },
    required_action: 'record_immunisation',
    display_reason: 'Td dose 1 administration not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Prevents maternal and neonatal tetanus under National Immunisation Schedule.'
  },
  {
    rule_id: 'A4',
    name: 'Antenatal Td Dose 2 (Tetanus-diphtheria)',
    category: 'antenatal',
    population: 'pregnancy',
    trigger: { type: 'gestational_age', start_weeks: 18, end_weeks: 20 },
    overdue_after: { weeks: 2 },
    required_action: 'record_immunisation',
    display_reason: 'Td dose 2 administration not recorded (minimum 4 weeks after Td1)',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Completes maternal tetanus immunisation series.'
  },
  {
    rule_id: 'A5',
    name: 'Second Trimester IFA & Calcium Dispensing',
    category: 'antenatal',
    population: 'pregnancy',
    trigger: { type: 'gestational_age', start_weeks: 14, end_weeks: 20 },
    overdue_after: { weeks: 2 },
    required_action: 'record_visit',
    display_reason: 'IFA tablets and Calcium supply dispensing not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Prophylaxis against maternal nutritional anaemia and pre-eclampsia.'
  },
  {
    rule_id: 'A6',
    name: 'Mid-Pregnancy Blood Pressure & Urine Albumin Surveillance',
    category: 'antenatal',
    population: 'pregnancy',
    trigger: { type: 'gestational_age', start_weeks: 20, end_weeks: 24 },
    overdue_after: { weeks: 1 },
    required_action: 'record_visit',
    display_reason: 'Mid-pregnancy BP and urine protein assessment not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Routine screening window for gestational hypertension and pre-eclampsia onset.'
  },
  {
    rule_id: 'A7',
    name: 'Glucose testing (Oral Glucose Tolerance Test 75g)',
    category: 'antenatal',
    population: 'pregnancy',
    trigger: { type: 'gestational_age', start_weeks: 24, end_weeks: 28 },
    overdue_after: { weeks: 2 },
    required_action: 'record_test',
    display_reason: 'Glucose test not done',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Standard 24-28 week screening for Gestational Diabetes Mellitus (GDM) to prevent macrosomia and birth trauma.'
  },
  {
    rule_id: 'A8',
    name: 'Third Trimester Haemoglobin Re-check',
    category: 'antenatal',
    population: 'pregnancy',
    trigger: { type: 'gestational_age', start_weeks: 28, end_weeks: 32 },
    overdue_after: { weeks: 2 },
    required_action: 'record_test',
    display_reason: 'Third trimester Hb evaluation not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Identifies worsening physiological or nutritional anaemia prior to delivery.'
  },
  {
    rule_id: 'A9',
    name: 'Rh Antibody Screen (for Rh-negative mothers)',
    category: 'antenatal',
    population: 'pregnancy',
    trigger: { type: 'gestational_age', start_weeks: 28, end_weeks: 28, condition: 'rh_negative' },
    overdue_after: { weeks: 2 },
    required_action: 'record_test',
    display_reason: 'No antibody screen recorded for Rh-negative mother',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Screening for anti-D antibodies prior to administering prophylactic Anti-D immunoglobulin.'
  },
  {
    rule_id: 'A10',
    name: 'Term Presentation & Birth Preparedness Check',
    category: 'antenatal',
    population: 'pregnancy',
    trigger: { type: 'gestational_age', start_weeks: 36, end_weeks: 38 },
    overdue_after: { weeks: 1 },
    required_action: 'record_visit',
    display_reason: 'Term foetal presentation and delivery preparedness check not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Assesses foetal lie/presentation and reviews birth preparedness plan with mother.'
  },

  // --- Foetal (5 rules) ---
  {
    rule_id: 'F1',
    name: 'Dating Ultrasound Scan',
    category: 'foetal',
    population: 'foetus',
    trigger: { type: 'gestational_age', start_weeks: 6, end_weeks: 10 },
    overdue_after: { weeks: 2 },
    required_action: 'record_scan',
    display_reason: 'Early dating scan not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Accurate gestational age dating by crown-rump length (CRL) and viability verification.'
  },
  {
    rule_id: 'F2',
    name: '11–14 Week Nuchal Translucency / Early Scan',
    category: 'foetal',
    population: 'foetus',
    trigger: { type: 'gestational_age', start_weeks: 11, end_weeks: 14 },
    overdue_after: { weeks: 1 },
    required_action: 'record_scan',
    display_reason: '11-14 week early scan window not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Structural review and nuchal translucency assessment.'
  },
  {
    rule_id: 'F3',
    name: 'Anomaly Scan (TIFFA 18–22 weeks)',
    category: 'foetal',
    population: 'foetus',
    trigger: { type: 'gestational_age', start_weeks: 18, end_weeks: 22 },
    overdue_after: { weeks: 2 },
    required_action: 'record_scan',
    display_reason: 'Anomaly scan not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Comprehensive ultrasound evaluation of foetal structural anatomy.'
  },
  {
    rule_id: 'F4',
    name: 'Growth Surveillance Scan (Flagged Pregnancy)',
    category: 'foetal',
    population: 'foetus',
    trigger: { type: 'gestational_age', start_weeks: 32, end_weeks: 34, condition: 'flagged_small_or_high_risk' },
    overdue_after: { weeks: 1 },
    required_action: 'record_scan',
    display_reason: 'Growth scan due for flagged pregnancy (interval passed)',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Surveillance interval for pregnancies flagged clinically for restricted or accelerated growth.'
  },
  {
    rule_id: 'F5',
    name: 'Third Trimester Foetal Biometry & Doppler Scan',
    category: 'foetal',
    population: 'foetus',
    trigger: { type: 'gestational_age', start_weeks: 34, end_weeks: 36 },
    overdue_after: { weeks: 2 },
    required_action: 'record_scan',
    display_reason: 'Late third trimester foetal growth scan not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Evaluates foetal growth trajectory, amniotic fluid volume, and placental position.'
  },

  // --- Postnatal (4 rules) ---
  {
    rule_id: 'P1',
    name: 'Postpartum 48-Hour Maternal Health Check',
    category: 'postnatal',
    population: 'mother',
    trigger: { type: 'postpartum_age', days: 2 },
    overdue_after: { days: 1 },
    required_action: 'record_visit',
    display_reason: 'Immediate 48-hour postpartum check before discharge not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Monitors postpartum bleeding, uterine involution, BP, and breastfeed initiation.'
  },
  {
    rule_id: 'P2',
    name: 'Day 7 Postnatal Health Check',
    category: 'postnatal',
    population: 'mother',
    trigger: { type: 'postpartum_age', days: 7 },
    overdue_after: { days: 3 },
    required_action: 'record_visit',
    display_reason: 'Day 7 maternal postnatal visit not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Detects secondary postpartum haemorrhage, perineal or wound infection, and lactation difficulties.'
  },
  {
    rule_id: 'P3',
    name: '6-Week Comprehensive Postnatal Visit',
    category: 'postnatal',
    population: 'mother',
    trigger: { type: 'postpartum_age', days: 42 },
    overdue_after: { weeks: 2 },
    required_action: 'record_visit',
    display_reason: '6-week maternal postnatal review and family planning visit not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Final puerperium evaluation, pelvic examination, contraception counseling, mental health review.'
  },
  {
    rule_id: 'P4',
    name: 'Glucose Test After GDM (6–12 Weeks Postpartum)',
    category: 'postnatal',
    population: 'mother',
    trigger: { type: 'postpartum_age', days: 56, condition: 'gdm_history' },
    overdue_after: { weeks: 4 },
    required_action: 'record_test',
    display_reason: 'Postpartum 75g OGTT not completed for mother with gestational diabetes',
    active: true,
    version: 1,
    createdBy: 'Dr. Anita Rao (Lead Obstetrician)',
    approvedBy: 'Dr. Anita Rao',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Re-evaluates glycemic status post-delivery to detect persistent or overt type 2 diabetes mellitus.'
  },

  // --- Newborn (5 rules) ---
  {
    rule_id: 'N1',
    name: 'Immediate Birth Immunisation (BCG, OPV-0, Hepatitis B-0)',
    category: 'newborn',
    population: 'newborn',
    trigger: { type: 'child_age', days: 1 },
    overdue_after: { days: 2 },
    required_action: 'record_immunisation',
    display_reason: 'Birth doses (BCG, OPV zero, Hep B zero) not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Suresh Kumar (Pediatric Lead)',
    approvedBy: 'Dr. Suresh Kumar',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Immediate protection against tuberculosis, poliomyelitis, and perinatal hepatitis B infection.'
  },
  {
    rule_id: 'N2',
    name: 'Newborn Clinical Examination before Discharge',
    category: 'newborn',
    population: 'newborn',
    trigger: { type: 'child_age', days: 2 },
    overdue_after: { days: 1 },
    required_action: 'record_screening',
    display_reason: 'Mandatory 48-hour neonatal head-to-toe examination not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Suresh Kumar (Pediatric Lead)',
    approvedBy: 'Dr. Suresh Kumar',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Identifies congenital anomalies, neonatal jaundice, respiratory distress, and femoral pulse check.'
  },
  {
    rule_id: 'N3',
    name: 'Congenital Hypothyroidism / Dried Blood Spot Screening',
    category: 'newborn',
    population: 'newborn',
    trigger: { type: 'child_age', days: 3 },
    overdue_after: { days: 2 },
    required_action: 'record_test',
    display_reason: 'Newborn metabolic screening sample (TSH/DBS) not sent',
    active: true,
    version: 1,
    createdBy: 'Dr. Suresh Kumar (Pediatric Lead)',
    approvedBy: 'Dr. Suresh Kumar',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Prevents irreversible cognitive impairment through early detection and thyroxine therapy.'
  },
  {
    rule_id: 'N4',
    name: 'Newborn Screening Sample Tracking (Per Unit Protocol)',
    category: 'newborn',
    population: 'newborn',
    trigger: { type: 'unit_protocol', days: 7 },
    overdue_after: { weeks: 1 },
    required_action: 'record_test',
    display_reason: 'Newborn screening sample per unit protocol: overdue +1 week, no report recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Suresh Kumar (Pediatric Lead)',
    approvedBy: 'Dr. Suresh Kumar',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Ensures lab loop closure for sent newborn screening filter paper samples.'
  },
  {
    rule_id: 'N5',
    name: 'Newborn Hearing Screening (OAE / BERA)',
    category: 'newborn',
    population: 'newborn',
    trigger: { type: 'child_age', days: 28 },
    overdue_after: { weeks: 2 },
    required_action: 'record_screening',
    display_reason: 'Universal newborn hearing screening (OAE) not recorded within 4 weeks',
    active: true,
    version: 1,
    createdBy: 'Dr. Suresh Kumar (Pediatric Lead)',
    approvedBy: 'Dr. Suresh Kumar',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Early diagnosis of congenital sensorineural hearing loss before language acquisition.'
  },

  // --- Child (4 rules) ---
  {
    rule_id: 'C1',
    name: '6-Week Immunisation Series & Growth Check',
    category: 'child',
    population: 'child',
    trigger: { type: 'child_age', start_weeks: 6, end_weeks: 6 },
    overdue_after: { weeks: 2 },
    required_action: 'record_immunisation',
    display_reason: '6-week immunisation series (Pentavalent-1, OPV-1, RVV-1, PCV-1) and weight check not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Suresh Kumar (Pediatric Lead)',
    approvedBy: 'Dr. Suresh Kumar',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'National immunisation primary series first dose.'
  },
  {
    rule_id: 'C2',
    name: '10-Week Immunisation Series & Growth Check',
    category: 'child',
    population: 'child',
    trigger: { type: 'child_age', start_weeks: 10, end_weeks: 10 },
    overdue_after: { weeks: 2 },
    required_action: 'record_immunisation',
    display_reason: 'Immunisation dose overdue (Pentavalent-2, OPV-2, RVV-2)',
    active: true,
    version: 1,
    createdBy: 'Dr. Suresh Kumar (Pediatric Lead)',
    approvedBy: 'Dr. Suresh Kumar',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'National immunisation primary series second dose.'
  },
  {
    rule_id: 'C3',
    name: '14-Week Immunisation Series & Growth Check',
    category: 'child',
    population: 'child',
    trigger: { type: 'child_age', start_weeks: 14, end_weeks: 14 },
    overdue_after: { weeks: 2 },
    required_action: 'record_immunisation',
    display_reason: '14-week immunisation series (Pentavalent-3, OPV-3, fIPV-2, RVV-3, PCV-2) not recorded',
    active: true,
    version: 1,
    createdBy: 'Dr. Suresh Kumar (Pediatric Lead)',
    approvedBy: 'Dr. Suresh Kumar',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Completes primary infant immunisation booster series.'
  },
  {
    rule_id: 'C4',
    name: '9-Month Measles-Rubella (MR-1), Vit A & Growth Surveillance',
    category: 'child',
    population: 'child',
    trigger: { type: 'child_age', start_weeks: 39, end_weeks: 43 }, // 9 months ~ 39 wks
    overdue_after: { weeks: 3 },
    required_action: 'record_immunisation',
    display_reason: '9-month MR-1, Vitamin A dose 1, and infant growth check overdue',
    active: true,
    version: 1,
    createdBy: 'Dr. Suresh Kumar (Pediatric Lead)',
    approvedBy: 'Dr. Suresh Kumar',
    effectiveDate: '2026-01-01',
    clinicalRationale: 'Protects against measles and rubella outbreak, prevents Vitamin A deficiency blindness.'
  }
];

export interface SimulationInput {
  patientType: 'pregnancy' | 'mother' | 'newborn' | 'child';
  gestationalAgeWeeks?: number;
  lmpDate?: string;
  edd?: string;
  flags?: string[];
  postpartumDays?: number;
  childAgeWeeks?: number;
  childDob?: string;
  recordedMilestones?: string[];
}

export interface SimulationResultItem {
  ruleId: string;
  ruleName: string;
  category: string;
  expectedWindow: string;
  status: 'NOT_DUE' | 'DUE' | 'OVERDUE' | 'COMPLETED';
  overdueDuration: string;
  plainReason: string;
  requiredAction?: string;
  clinicalRationale?: string;
}

export function runRuleSimulation(input: SimulationInput, rules: CareGapRule[] = INITIAL_RULES): SimulationResultItem[] {
  const results: SimulationResultItem[] = [];

  for (const rule of rules.filter(r => r.active)) {
    if (input.patientType === 'pregnancy' && (rule.category === 'antenatal' || rule.category === 'foetal')) {
      const currentWeeks = input.gestationalAgeWeeks || 0;
      const start = rule.trigger.start_weeks ?? 0;
      const end = rule.trigger.end_weeks ?? 0;
      const overdueGrace = rule.overdue_after.weeks ?? 2;

      // Condition filter
      if (rule.trigger.condition === 'rh_negative' && !input.flags?.includes('Rh negative')) {
        continue;
      }
      if (rule.trigger.condition === 'flagged_small_or_high_risk' && !input.flags?.some(f => f.toLowerCase().includes('small') || f.toLowerCase().includes('growth'))) {
        continue;
      }

      const isCompleted = input.recordedMilestones?.includes(rule.rule_id || '');
      if (isCompleted) {
        results.push({
          ruleId: rule.rule_id,
          ruleName: rule.name,
          category: rule.category,
          expectedWindow: `${start}–${end} weeks`,
          status: 'COMPLETED',
          overdueDuration: 'Closed',
          plainReason: `${rule.name} recorded. Care gap closed on recorded action.`,
          requiredAction: rule.required_action,
          clinicalRationale: rule.clinicalRationale
        });
        continue;
      }

      if (currentWeeks < start) {
        results.push({
          ruleId: rule.rule_id,
          ruleName: rule.name,
          category: rule.category,
          expectedWindow: `${start}–${end} weeks`,
          status: 'NOT_DUE',
          overdueDuration: 'Not due',
          plainReason: `Expected between ${start}–${end} weeks. Current gestation is ${currentWeeks} weeks.`,
          requiredAction: rule.required_action,
          clinicalRationale: rule.clinicalRationale
        });
      } else if (currentWeeks >= start && currentWeeks <= end) {
        results.push({
          ruleId: rule.rule_id,
          ruleName: rule.name,
          category: rule.category,
          expectedWindow: `${start}–${end} weeks`,
          status: 'DUE',
          overdueDuration: 'Due now',
          plainReason: `${rule.name} is due within current window (${start}–${end} weeks). Gestation: ${currentWeeks} weeks.`,
          requiredAction: rule.required_action,
          clinicalRationale: rule.clinicalRationale
        });
      } else {
        const overdueWeeks = currentWeeks - end;
        results.push({
          ruleId: rule.rule_id,
          ruleName: rule.name,
          category: rule.category,
          expectedWindow: `${start}–${end} weeks`,
          status: 'OVERDUE',
          overdueDuration: `+${overdueWeeks} wks`,
          plainReason: `${rule.display_reason}. Expected between ${start}–${end} weeks. Patient is currently ${currentWeeks} weeks. Overdue by ${overdueWeeks} week${overdueWeeks > 1 ? 's' : ''}.`,
          requiredAction: rule.required_action,
          clinicalRationale: rule.clinicalRationale
        });
      }
    }

    if (input.patientType === 'child' && (rule.category === 'child' || rule.category === 'newborn')) {
      const childWeeks = input.childAgeWeeks || 0;
      const start = rule.trigger.start_weeks ?? 0;
      const end = rule.trigger.end_weeks ?? start;
      const isCompleted = input.recordedMilestones?.includes(rule.rule_id || '');

      if (isCompleted) {
        results.push({
          ruleId: rule.rule_id,
          ruleName: rule.name,
          category: rule.category,
          expectedWindow: `${start} weeks`,
          status: 'COMPLETED',
          overdueDuration: 'Closed',
          plainReason: `${rule.name} recorded.`,
          requiredAction: rule.required_action,
          clinicalRationale: rule.clinicalRationale
        });
        continue;
      }

      if (childWeeks < start) {
        results.push({
          ruleId: rule.rule_id,
          ruleName: rule.name,
          category: rule.category,
          expectedWindow: `${start} weeks`,
          status: 'NOT_DUE',
          overdueDuration: 'Not due',
          plainReason: `Expected at ${start} weeks. Child is currently ${childWeeks} weeks.`,
          requiredAction: rule.required_action,
          clinicalRationale: rule.clinicalRationale
        });
      } else if (childWeeks === start) {
        results.push({
          ruleId: rule.rule_id,
          ruleName: rule.name,
          category: rule.category,
          expectedWindow: `${start} weeks`,
          status: 'DUE',
          overdueDuration: 'Due now',
          plainReason: `${rule.name} is due at ${start} weeks. Child is ${childWeeks} weeks.`,
          requiredAction: rule.required_action,
          clinicalRationale: rule.clinicalRationale
        });
      } else {
        const diff = childWeeks - start;
        results.push({
          ruleId: rule.rule_id,
          ruleName: rule.name,
          category: rule.category,
          expectedWindow: `${start} weeks`,
          status: 'OVERDUE',
          overdueDuration: `+${diff} wks`,
          plainReason: `${rule.display_reason}. Expected at ${start} weeks. Child is currently ${childWeeks} weeks. Overdue by ${diff} week${diff > 1 ? 's' : ''}.`,
          requiredAction: rule.required_action,
          clinicalRationale: rule.clinicalRationale
        });
      }
    }
  }

  return results;
}
