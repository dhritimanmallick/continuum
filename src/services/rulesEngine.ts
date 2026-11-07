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

/** Convert a rule trigger/grace to a window in days. Rules may be written in weeks or days. */
function ruleWindowDays(rule: CareGapRule): { start: number; end: number; grace: number } {
  const t: any = rule.trigger;
  const o: any = rule.overdue_after || {};
  const start = t.start_weeks !== undefined ? t.start_weeks * 7 : (t.days ?? 0);
  const end = t.end_weeks !== undefined ? t.end_weeks * 7 : start;
  const grace = (o.weeks ?? 0) * 7 + (o.days ?? 0);
  return { start, end, grace };
}

const fmtDays = (d: number, unit: 'weeks' | 'days') =>
  unit === 'weeks' ? `${+(d / 7).toFixed(1)} weeks` : `${Math.round(d)} days`;

function conditionMet(rule: CareGapRule, flags: string[] = []): boolean {
  const c = (rule.trigger as any).condition;
  const f = flags.map(x => x.toLowerCase());
  if (!c) return true;
  if (c === 'rh_negative') return f.some(x => x.includes('rh negative'));
  if (c === 'flagged_small_or_high_risk') return f.some(x => x.includes('small') || x.includes('growth') || x.includes('high risk'));
  if (c === 'gdm_history') return f.some(x => x.includes('gdm'));
  return f.some(x => x.includes(String(c).replace(/_/g, ' ')));
}

/**
 * Evaluate the active rules for one simulated patient.
 * Status: NOT_DUE before the window opens; DUE from window start through window end + grace
 * (rule.overdue_after); OVERDUE after that; COMPLETED when the action is recorded.
 */
export function runRuleSimulation(input: SimulationInput, rules: CareGapRule[] = INITIAL_RULES): SimulationResultItem[] {
  const results: SimulationResultItem[] = [];

  const pathway: Record<SimulationInput['patientType'], string[]> = {
    pregnancy: ['antenatal', 'foetal'],
    mother: ['postnatal'],
    newborn: ['newborn', 'child'],
    child: ['newborn', 'child'],
  };

  // Current age on the pathway, in days
  let nowDays = 0;
  let unit: 'weeks' | 'days' = 'weeks';
  let ageLabel = '';
  if (input.patientType === 'pregnancy') {
    nowDays = (input.gestationalAgeWeeks ?? 0) * 7;
    ageLabel = `gestation ${input.gestationalAgeWeeks ?? 0} weeks`;
  } else if (input.patientType === 'mother') {
    nowDays = input.postpartumDays ?? 0;
    unit = 'days';
    ageLabel = `${nowDays} days postpartum`;
  } else {
    nowDays = input.childAgeWeeks !== undefined ? input.childAgeWeeks * 7 : 0;
    ageLabel = `child age ${+(nowDays / 7).toFixed(1)} weeks`;
  }

  for (const rule of rules.filter(r => r.active)) {
    if (!pathway[input.patientType].includes(rule.category)) continue;
    if (!conditionMet(rule, input.flags)) continue;

    const { start, end, grace } = ruleWindowDays(rule);
    const ruleUnit: 'weeks' | 'days' = (rule.trigger as any).start_weeks !== undefined ? 'weeks' : 'days';
    const windowLabel = start === end ? `at ${fmtDays(start, ruleUnit)}` : `${fmtDays(start, ruleUnit)}–${fmtDays(end, ruleUnit)}`;
    const base = {
      ruleId: rule.rule_id,
      ruleName: rule.name,
      category: rule.category,
      expectedWindow: windowLabel,
      requiredAction: rule.required_action,
      clinicalRationale: rule.clinicalRationale,
    };

    if (input.recordedMilestones?.includes(rule.rule_id || '')) {
      results.push({ ...base, status: 'COMPLETED', overdueDuration: 'Closed',
        plainReason: `${rule.name} recorded. Care gap closed on recorded action.` });
    } else if (nowDays < start) {
      results.push({ ...base, status: 'NOT_DUE', overdueDuration: 'Not due',
        plainReason: `Expected ${windowLabel}. Currently ${ageLabel}.` });
    } else if (nowDays <= end + grace) {
      const inGrace = nowDays > end;
      results.push({ ...base, status: 'DUE', overdueDuration: inGrace ? 'Due (grace period)' : 'Due now',
        plainReason: `${rule.name} is due (${windowLabel}${grace ? `, grace ${fmtDays(grace, ruleUnit === 'weeks' && grace % 7 === 0 ? 'weeks' : 'days')}` : ''}). Currently ${ageLabel}.` });
    } else {
      const late = nowDays - end;
      results.push({ ...base, status: 'OVERDUE', overdueDuration: `+${fmtDays(late, unit === 'days' || ruleUnit === 'days' ? 'days' : 'weeks')}`,
        plainReason: `${rule.display_reason}. Expected ${windowLabel}; currently ${ageLabel}. Window closed ${fmtDays(late, unit === 'days' || ruleUnit === 'days' ? 'days' : 'weeks')} ago, past the grace period.` });
    }
  }

  return results;
}
