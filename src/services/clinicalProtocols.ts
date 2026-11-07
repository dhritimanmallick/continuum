import { 
  VaccineScheduleItem, 
  VaccineScheduleMilestone, 
  MaternalTestProtocol, 
  MaternalClinicalStage 
} from '../types';

// ============================================================================
// 1. NEWBORN & INFANT VACCINATION PROTOCOLS (National Immunization Schedule / WHO / IAP)
// ============================================================================

export interface VaccineDefinition {
  vaccineCode: string;
  vaccineName: string;
  targetDisease: string;
  milestone: VaccineScheduleMilestone;
  recommendedAgeLabel: string;
  dosage: string;
  route: string;
  site: string;
  clinicalNotes: string;
  defaultBatch?: string;
}

export const NEWBORN_VACCINE_DEFINITIONS: VaccineDefinition[] = [
  // --- AT BIRTH (Within 24-48 hours) ---
  {
    vaccineCode: 'VAC-BCG',
    vaccineName: 'BCG (Bacillus Calmette-Guérin)',
    targetDisease: 'Tuberculosis (TB Meningitis & Miliary TB)',
    milestone: 'AT_BIRTH',
    recommendedAgeLabel: 'At birth (within 24-48 hours, or up to 1 year)',
    dosage: '0.05 ml (until 1 month age), 0.1 ml after',
    route: 'Intradermal',
    site: 'Left upper arm',
    clinicalNotes: 'Produces characteristic wheal; forms papule and small permanent scar. Protects against severe childhood forms of tuberculosis.',
    defaultBatch: 'BCG-2026-B81'
  },
  {
    vaccineCode: 'VAC-OPV0',
    vaccineName: 'OPV-0 (Oral Polio Vaccine Birth Dose)',
    targetDisease: 'Poliomyelitis (Infantile Paralysis)',
    milestone: 'AT_BIRTH',
    recommendedAgeLabel: 'At birth (within first 15 days)',
    dosage: '2 drops',
    route: 'Oral',
    site: 'Mouth',
    clinicalNotes: 'Induces mucosal immunity. Does not count toward primary 3-dose series.',
    defaultBatch: 'OPV-2026-P04'
  },
  {
    vaccineCode: 'VAC-HEPB0',
    vaccineName: 'Hepatitis B Birth Dose (Hep-B 0)',
    targetDisease: 'Hepatitis B (Perinatal/Vertical Transmission)',
    milestone: 'AT_BIRTH',
    recommendedAgeLabel: 'Within 24 hours of birth (CRITICAL)',
    dosage: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of left mid-thigh',
    clinicalNotes: 'Must be administered within 24 hours to prevent vertical mother-to-child transmission and chronic carrier state.',
    defaultBatch: 'HEPB-2026-H19'
  },

  // --- 6 WEEKS ---
  {
    vaccineCode: 'VAC-PENTA1',
    vaccineName: 'Pentavalent-1 (DPT + Hep B + Hib)',
    targetDisease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib Meningitis',
    milestone: '6_WEEKS',
    recommendedAgeLabel: 'At 6 weeks',
    dosage: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of left mid-thigh',
    clinicalNotes: 'Five-in-one primary combination vaccine.',
    defaultBatch: 'PEN-2026-A12'
  },
  {
    vaccineCode: 'VAC-OPV1',
    vaccineName: 'OPV-1 (Oral Polio Vaccine 1st Dose)',
    targetDisease: 'Poliomyelitis',
    milestone: '6_WEEKS',
    recommendedAgeLabel: 'At 6 weeks',
    dosage: '2 drops',
    route: 'Oral',
    site: 'Mouth',
    clinicalNotes: 'First primary dose of bivalent OPV.',
    defaultBatch: 'OPV-2026-P14'
  },
  {
    vaccineCode: 'VAC-ROTA1',
    vaccineName: 'Rotavirus Vaccine-1 (RVV-1)',
    targetDisease: 'Rotavirus Diarrhea & Severe Dehydration',
    milestone: '6_WEEKS',
    recommendedAgeLabel: 'At 6 weeks',
    dosage: '5 drops / 2.5 ml',
    route: 'Oral',
    site: 'Mouth',
    clinicalNotes: 'Live attenuated oral vaccine. Do not inject.',
    defaultBatch: 'ROTA-2026-R07'
  },
  {
    vaccineCode: 'VAC-PCV1',
    vaccineName: 'Pneumococcal Conjugate Vaccine-1 (PCV-1)',
    targetDisease: 'Pneumococcal Pneumonia, Sepsis & Meningitis',
    milestone: '6_WEEKS',
    recommendedAgeLabel: 'At 6 weeks',
    dosage: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of right mid-thigh',
    clinicalNotes: 'Administer in right thigh (opposite pentavalent).',
    defaultBatch: 'PCV-2026-C03'
  },
  {
    vaccineCode: 'VAC-FIPV1',
    vaccineName: 'Fractional Inactivated Polio Vaccine-1 (fIPV-1)',
    targetDisease: 'Poliomyelitis Types 1, 2, 3',
    milestone: '6_WEEKS',
    recommendedAgeLabel: 'At 6 weeks',
    dosage: '0.1 ml',
    route: 'Intradermal',
    site: 'Right upper arm',
    clinicalNotes: 'Provides systemic humoral immunity against polioviruses.',
    defaultBatch: 'IPV-2026-V11'
  },

  // --- 10 WEEKS ---
  {
    vaccineCode: 'VAC-PENTA2',
    vaccineName: 'Pentavalent-2 (DPT + Hep B + Hib)',
    targetDisease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib',
    milestone: '10_WEEKS',
    recommendedAgeLabel: 'At 10 weeks (min 4 weeks after dose 1)',
    dosage: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of left mid-thigh',
    clinicalNotes: 'Second dose of primary series.',
    defaultBatch: 'PEN-2026-A22'
  },
  {
    vaccineCode: 'VAC-OPV2',
    vaccineName: 'OPV-2 (Oral Polio Vaccine 2nd Dose)',
    targetDisease: 'Poliomyelitis',
    milestone: '10_WEEKS',
    recommendedAgeLabel: 'At 10 weeks',
    dosage: '2 drops',
    route: 'Oral',
    site: 'Mouth',
    clinicalNotes: 'Second primary dose.',
    defaultBatch: 'OPV-2026-P22'
  },
  {
    vaccineCode: 'VAC-ROTA2',
    vaccineName: 'Rotavirus Vaccine-2 (RVV-2)',
    targetDisease: 'Rotavirus Diarrhea',
    milestone: '10_WEEKS',
    recommendedAgeLabel: 'At 10 weeks',
    dosage: '5 drops',
    route: 'Oral',
    site: 'Mouth',
    clinicalNotes: 'Second dose of oral rotavirus.',
    defaultBatch: 'ROTA-2026-R12'
  },

  // --- 14 WEEKS ---
  {
    vaccineCode: 'VAC-PENTA3',
    vaccineName: 'Pentavalent-3 (DPT + Hep B + Hib)',
    targetDisease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib',
    milestone: '14_WEEKS',
    recommendedAgeLabel: 'At 14 weeks (completes primary series)',
    dosage: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of left mid-thigh',
    clinicalNotes: 'Completes primary infant pentavalent immunization.',
    defaultBatch: 'PEN-2026-A33'
  },
  {
    vaccineCode: 'VAC-OPV3',
    vaccineName: 'OPV-3 (Oral Polio Vaccine 3rd Dose)',
    targetDisease: 'Poliomyelitis',
    milestone: '14_WEEKS',
    recommendedAgeLabel: 'At 14 weeks',
    dosage: '2 drops',
    route: 'Oral',
    site: 'Mouth',
    clinicalNotes: 'Completes primary OPV schedule.',
    defaultBatch: 'OPV-2026-P33'
  },
  {
    vaccineCode: 'VAC-ROTA3',
    vaccineName: 'Rotavirus Vaccine-3 (RVV-3)',
    targetDisease: 'Rotavirus Diarrhea',
    milestone: '14_WEEKS',
    recommendedAgeLabel: 'At 14 weeks',
    dosage: '5 drops',
    route: 'Oral',
    site: 'Mouth',
    clinicalNotes: 'Completes 3-dose rotavirus course.',
    defaultBatch: 'ROTA-2026-R33'
  },
  {
    vaccineCode: 'VAC-PCV2',
    vaccineName: 'Pneumococcal Conjugate Vaccine-2 (PCV-2)',
    targetDisease: 'Pneumococcal Disease',
    milestone: '14_WEEKS',
    recommendedAgeLabel: 'At 14 weeks',
    dosage: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of right mid-thigh',
    clinicalNotes: 'Second primary PCV dose.',
    defaultBatch: 'PCV-2026-C14'
  },
  {
    vaccineCode: 'VAC-FIPV2',
    vaccineName: 'Fractional Inactivated Polio Vaccine-2 (fIPV-2)',
    targetDisease: 'Poliomyelitis',
    milestone: '14_WEEKS',
    recommendedAgeLabel: 'At 14 weeks',
    dosage: '0.1 ml',
    route: 'Intradermal',
    site: 'Right upper arm',
    clinicalNotes: 'Second dose of fractional IPV.',
    defaultBatch: 'IPV-2026-V22'
  },

  // --- 9 - 12 MONTHS ---
  {
    vaccineCode: 'VAC-MR1',
    vaccineName: 'MR-1 (Measles & Rubella 1st Dose)',
    targetDisease: 'Measles & Congenital Rubella Syndrome',
    milestone: '9_12_MONTHS',
    recommendedAgeLabel: '9-12 completed months',
    dosage: '0.5 ml',
    route: 'Subcutaneous',
    site: 'Right upper arm',
    clinicalNotes: 'First dose of Measles-Rubella vaccine.',
    defaultBatch: 'MR-2026-M09'
  },
  {
    vaccineCode: 'VAC-JE1',
    vaccineName: 'Japanese Encephalitis-1 (JE-1)',
    targetDisease: 'Japanese Encephalitis (Brain fever)',
    milestone: '9_12_MONTHS',
    recommendedAgeLabel: '9-12 completed months (Endemic districts)',
    dosage: '0.5 ml',
    route: 'Subcutaneous',
    site: 'Left upper arm',
    clinicalNotes: 'Live attenuated SA 14-14-2 vaccine in endemic districts.',
    defaultBatch: 'JE-2026-J01'
  },
  {
    vaccineCode: 'VAC-PCV-B',
    vaccineName: 'PCV Booster (Pneumococcal Booster)',
    targetDisease: 'Pneumococcal Pneumonia & Invasive Disease',
    milestone: '9_12_MONTHS',
    recommendedAgeLabel: 'At 9 completed months',
    dosage: '0.5 ml',
    route: 'Intramuscular',
    site: 'Right mid-thigh',
    clinicalNotes: 'Booster dose providing long-term immunity.',
    defaultBatch: 'PCV-2026-B09'
  },
  {
    vaccineCode: 'VAC-VITA1',
    vaccineName: 'Vitamin A (1st Dose — 100,000 IU)',
    targetDisease: 'Vitamin A Deficiency & Xerophthalmia / Night Blindness',
    milestone: '9_12_MONTHS',
    recommendedAgeLabel: 'At 9 months with MR-1',
    dosage: '1 ml (100,000 IU)',
    route: 'Oral',
    site: 'Mouth',
    clinicalNotes: 'Bi-annual Vitamin A supplementation to prevent childhood blindness.',
    defaultBatch: 'VITA-2026-V01'
  },

  // --- 16 - 24 MONTHS ---
  {
    vaccineCode: 'VAC-MR2',
    vaccineName: 'MR-2 (Measles & Rubella 2nd Dose)',
    targetDisease: 'Measles & Rubella Elimination',
    milestone: '16_24_MONTHS',
    recommendedAgeLabel: '16-24 months',
    dosage: '0.5 ml',
    route: 'Subcutaneous',
    site: 'Right upper arm',
    clinicalNotes: 'Second dose ensuring >95% herd immunity.',
    defaultBatch: 'MR-2026-M16'
  },
  {
    vaccineCode: 'VAC-DPTB1',
    vaccineName: 'DPT Booster-1',
    targetDisease: 'Diphtheria, Pertussis, Tetanus',
    milestone: '16_24_MONTHS',
    recommendedAgeLabel: '16-24 months',
    dosage: '0.5 ml',
    route: 'Intramuscular',
    site: 'Anterolateral aspect of mid-thigh',
    clinicalNotes: 'First childhood booster.',
    defaultBatch: 'DPT-2026-D01'
  },
  {
    vaccineCode: 'VAC-OPVB',
    vaccineName: 'OPV Booster',
    targetDisease: 'Poliomyelitis',
    milestone: '16_24_MONTHS',
    recommendedAgeLabel: '16-24 months',
    dosage: '2 drops',
    route: 'Oral',
    site: 'Mouth',
    clinicalNotes: 'Booster dose for continued gut mucosal immunity.',
    defaultBatch: 'OPV-2026-PB1'
  },
  {
    vaccineCode: 'VAC-VITA2',
    vaccineName: 'Vitamin A (2nd Dose — 200,000 IU)',
    targetDisease: 'Vitamin A Deficiency',
    milestone: '16_24_MONTHS',
    recommendedAgeLabel: '16-24 months',
    dosage: '2 ml (200,000 IU)',
    route: 'Oral',
    site: 'Mouth',
    clinicalNotes: 'Administer with spoon provided.',
    defaultBatch: 'VITA-2026-V02'
  },

  // --- 5 - 6 YEARS ---
  {
    vaccineCode: 'VAC-DPTB2',
    vaccineName: 'DPT Booster-2 (Pre-School Booster)',
    targetDisease: 'Diphtheria, Pertussis, Tetanus',
    milestone: '5_6_YEARS',
    recommendedAgeLabel: '5-6 years of age',
    dosage: '0.5 ml',
    route: 'Intramuscular',
    site: 'Upper arm (Deltoid)',
    clinicalNotes: 'School-entry booster dose.',
    defaultBatch: 'DPT-2026-D02'
  }
];

/**
 * Generates a default immunization schedule for a newborn/child based on date of birth
 */
export const generateNewbornVaccineSchedule = (
  patientId: string, 
  dob: string = '2026-10-10',
  currentAgeWeeks: number = 3
): VaccineScheduleItem[] => {
  return NEWBORN_VACCINE_DEFINITIONS.map((def, idx) => {
    let status: VaccineScheduleItem['status'] = 'UPCOMING';
    let administeredDate: string | undefined;
    let administeredBy: string | undefined;
    let batchNumber: string | undefined;

    if (def.milestone === 'AT_BIRTH') {
      if (currentAgeWeeks >= 0) {
        status = 'GIVEN';
        administeredDate = dob;
        administeredBy = 'Staff Nurse Radhika (Labour Room / Neonatal Ward)';
        batchNumber = def.defaultBatch;
      }
    } else if (def.milestone === '6_WEEKS') {
      if (currentAgeWeeks >= 7) {
        status = 'GIVEN';
        administeredDate = '22 Nov 2026';
        administeredBy = 'Dr. Sneha Patil (Pediatric OPD)';
        batchNumber = def.defaultBatch;
      } else if (currentAgeWeeks >= 6) {
        status = 'DUE';
      } else {
        status = 'UPCOMING';
      }
    } else if (def.milestone === '10_WEEKS') {
      if (currentAgeWeeks >= 11) {
        status = 'GIVEN';
      } else if (currentAgeWeeks >= 10) {
        status = 'DUE';
      } else {
        status = 'UPCOMING';
      }
    } else if (def.milestone === '14_WEEKS') {
      if (currentAgeWeeks >= 15) {
        status = 'GIVEN';
      } else if (currentAgeWeeks >= 14) {
        status = 'DUE';
      } else {
        status = 'UPCOMING';
      }
    } else if (def.milestone === '9_12_MONTHS') {
      status = currentAgeWeeks >= 40 ? 'DUE' : 'UPCOMING';
    } else {
      status = 'UPCOMING';
    }

    return {
      id: `VAC-${patientId}-${idx + 1}`,
      vaccineCode: def.vaccineCode,
      vaccineName: def.vaccineName,
      targetDisease: def.targetDisease,
      recommendedAgeLabel: def.recommendedAgeLabel,
      milestone: def.milestone,
      dosage: def.dosage,
      route: def.route,
      site: def.site,
      status,
      dueDate: def.milestone === 'AT_BIRTH' ? dob : '24 Nov 2026',
      administeredDate,
      administeredBy,
      batchNumber,
      mcpCardEntry: status === 'GIVEN'
    };
  });
};

// ============================================================================
// 2. MATERNAL TESTS DURING PREGNANCY (ANC 1st, 2nd, 3rd Trimesters)
// ============================================================================

export const MATERNAL_ANC_TESTS: MaternalTestProtocol[] = [
  // --- 1st Trimester (< 12 Weeks) ---
  {
    id: 'ANC-T1-01',
    testCode: 'TEST-ABO-RH',
    testName: 'Blood Grouping & Rh Typing (ABO/RhD)',
    stage: 'PREGNANCY_1ST_TRIMESTER',
    stageLabel: '1st Trimester (<12w)',
    timingDescription: 'At first booking antenatal visit',
    clinicalRationale: 'Essential baseline to identify Rh-negative mothers requiring anti-D immunoprophylaxis and emergency crossmatch preparedness.',
    category: 'SEROLOGY',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Rh Isoimmunisation & Blood Compatibility',
    sampleType: 'Whole Blood (EDTA)',
    turnaroundHours: '2 hours'
  },
  {
    id: 'ANC-T1-02',
    testCode: 'TEST-CBC-HB',
    testName: 'Complete Blood Count (CBC) & Peripheral Smear',
    stage: 'PREGNANCY_1ST_TRIMESTER',
    stageLabel: '1st Trimester (<12w)',
    timingDescription: 'Initial registration and baseline',
    clinicalRationale: 'Detects baseline microcytic hypochromic nutritional iron deficiency anemia, baseline platelet count, and hemoglobinopathies.',
    category: 'HEMATOLOGY',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Maternal Anemia & Thrombocytopenia',
    sampleType: 'Whole Blood (EDTA)',
    turnaroundHours: '3 hours'
  },
  {
    id: 'ANC-T1-03',
    testCode: 'TEST-FBS-HBA1C',
    testName: 'Fasting Blood Sugar & HbA1c',
    stage: 'PREGNANCY_1ST_TRIMESTER',
    stageLabel: '1st Trimester (<12w)',
    timingDescription: 'Early pregnancy booking',
    clinicalRationale: 'Screens for undiagnosed pre-gestational Type 2 diabetes mellitus (FBS >= 126 mg/dL or HbA1c >= 6.5%).',
    category: 'BIOCHEMISTRY',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Overt Pre-existing Diabetes Mellitus',
    sampleType: 'Fluoride Plasma & EDTA Blood',
    turnaroundHours: '4 hours'
  },
  {
    id: 'ANC-T1-04',
    testCode: 'TEST-TSH',
    testName: 'Serum TSH (Thyroid Stimulating Hormone)',
    stage: 'PREGNANCY_1ST_TRIMESTER',
    stageLabel: '1st Trimester (<12w)',
    timingDescription: 'First trimester baseline',
    clinicalRationale: 'Identifies overt or subclinical maternal hypothyroidism (TSH > 2.5 mIU/L), which impairs early fetal neurocognitive development.',
    category: 'BIOCHEMISTRY',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Gestational Hypothyroidism',
    sampleType: 'Serum',
    turnaroundHours: '4 hours'
  },
  {
    id: 'ANC-T1-05',
    testCode: 'TEST-INF-SCREEN',
    testName: 'Infectious Disease Serology (HIV 1&2, HBsAg, VDRL/RPR, HCV)',
    stage: 'PREGNANCY_1ST_TRIMESTER',
    stageLabel: '1st Trimester (<12w)',
    timingDescription: 'Mandatory standard of care in early pregnancy',
    clinicalRationale: 'Prevents mother-to-child vertical transmission of HIV (ART initiation), Hepatitis B (newborn Ig/vaccine), and Syphilis (penicillin treatment).',
    category: 'SEROLOGY',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Vertical Transmission of Syphilis, HIV, Hepatitis',
    sampleType: 'Serum',
    turnaroundHours: '4 hours'
  },
  {
    id: 'ANC-T1-06',
    testCode: 'TEST-URINE-RM',
    testName: 'Urine Routine & Microscopic (Protein, Sugar, Pus Cells)',
    stage: 'PREGNANCY_1ST_TRIMESTER',
    stageLabel: '1st Trimester (<12w)',
    timingDescription: 'Every trimester visit',
    clinicalRationale: 'Detects asymptomatic bacteriuria (preventing pyelonephritis and preterm labor) and establishes baseline proteinuria.',
    category: 'URINE',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Asymptomatic Bacteriuria & Renal Baseline',
    sampleType: 'Clean catch Midstream Urine',
    turnaroundHours: '1 hour'
  },
  {
    id: 'ANC-T1-07',
    testCode: 'TEST-USG-DATING',
    testName: 'Obstetric Ultrasound Dating & Viability Scan',
    stage: 'PREGNANCY_1ST_TRIMESTER',
    stageLabel: '1st Trimester (7-11w)',
    timingDescription: '7-11 weeks of gestation',
    clinicalRationale: 'Confirms intrauterine pregnancy, fetal cardiac activity, gestational sac count (chorionicity), and accurate crown-rump length (CRL) dating.',
    category: 'ULTRASOUND',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Pregnancy Viability & Accurate Gestational Age',
    sampleType: 'Transabdominal / Transvaginal Imaging',
    turnaroundHours: 'Same Day'
  },
  {
    id: 'ANC-T1-08',
    testCode: 'TEST-NT-DUAL',
    testName: 'NT Scan & First Trimester Dual Marker (PAPP-A + Free β-hCG)',
    stage: 'PREGNANCY_1ST_TRIMESTER',
    stageLabel: '1st Trimester (11-13w+6d)',
    timingDescription: 'Strict window between 11w0d and 13w6d (CRL 45-84mm)',
    clinicalRationale: 'Combined early risk assessment for Trisomy 21 (Down Syndrome), Trisomy 18, and major cardiac/congenital structural defects.',
    category: 'SCREENING',
    priority: 'Routine',
    isMandatory: false,
    targetCondition: 'Fetal Chromosomal Aneuploidies',
    sampleType: 'Serum + Ultrasound Biometry',
    turnaroundHours: '24 hours'
  },

  // --- 2nd Trimester (13 - 28 Weeks) ---
  {
    id: 'ANC-T2-01',
    testCode: 'TEST-OGTT-75G',
    testName: 'Oral Glucose Tolerance Test 75g (OGTT / DIPSI 2-hr)',
    stage: 'PREGNANCY_2ND_TRIMESTER',
    stageLabel: '2nd Trimester (24-28w)',
    timingDescription: '24-28 weeks of gestation (universal screening)',
    clinicalRationale: 'Gold standard for Gestational Diabetes Mellitus (GDM) diagnosis (2-hr plasma glucose >= 140 mg/dL). Prevents fetal macrosomia and preeclampsia.',
    category: 'BIOCHEMISTRY',
    priority: 'Urgent',
    isMandatory: true,
    targetCondition: 'Gestational Diabetes Mellitus (GDM)',
    sampleType: 'Fluoride Plasma (Fasting, 1-hr, 2-hr post 75g glucose)',
    turnaroundHours: '3 hours'
  },
  {
    id: 'ANC-T2-02',
    testCode: 'TEST-USG-TIFFA',
    testName: 'Level-II Ultrasound TIFFA (Targeted Imaging for Fetal Anomalies)',
    stage: 'PREGNANCY_2ND_TRIMESTER',
    stageLabel: '2nd Trimester (18-20w)',
    timingDescription: '18-20 weeks of gestation',
    clinicalRationale: 'Detailed anatomical survey examining fetal brain/ventricles, spine, 4-chamber heart, facial clefts, kidneys, abdominal wall, and limbs.',
    category: 'ULTRASOUND',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Major Congenital & Structural Anomalies',
    sampleType: 'High-Resolution Obstetric Sonography',
    turnaroundHours: 'Same Day'
  },
  {
    id: 'ANC-T2-03',
    testCode: 'TEST-QUAD-MARKER',
    testName: 'Quadruple Marker Screen (AFP, β-hCG, uE3, Inhibin-A)',
    stage: 'PREGNANCY_2ND_TRIMESTER',
    stageLabel: '2nd Trimester (15-20w)',
    timingDescription: '15-20 weeks (optimal at 16-18 weeks)',
    clinicalRationale: 'Second trimester maternal serum screen for Neural Tube Defects (elevated AFP) and fetal aneuploidies if 1st trimester screen missed.',
    category: 'SCREENING',
    priority: 'Routine',
    isMandatory: false,
    targetCondition: 'Neural Tube Defects (Spina Bifida) & Aneuploidies',
    sampleType: 'Serum',
    turnaroundHours: '24-48 hours'
  },
  {
    id: 'ANC-T2-04',
    testCode: 'TEST-CBC-REPEAT-28W',
    testName: 'Repeat Complete Blood Count (CBC) & Ferritin (28 Weeks)',
    stage: 'PREGNANCY_2ND_TRIMESTER',
    stageLabel: '2nd Trimester (28w)',
    timingDescription: '28 weeks of gestation',
    clinicalRationale: 'Peak plasma volume expansion occurs at 28w. Re-evaluates physiological vs pathological iron deficiency anemia before delivery.',
    category: 'HEMATOLOGY',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Late-Gestational Maternal Anemia',
    sampleType: 'Whole Blood (EDTA) & Serum',
    turnaroundHours: '3 hours'
  },
  {
    id: 'ANC-T2-05',
    testCode: 'TEST-ICT-RH',
    testName: 'Indirect Coombs Test (ICT / Rh Antibody Titer)',
    stage: 'PREGNANCY_2ND_TRIMESTER',
    stageLabel: '2nd Trimester (28w)',
    timingDescription: '28 weeks (for all Rh-negative non-sensitised mothers)',
    clinicalRationale: 'Detects maternal anti-D antibodies prior to prophylactic Anti-D Immunoglobulin administration at 28 weeks.',
    category: 'SEROLOGY',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Rh(D) Maternal Isoimmunisation',
    sampleType: 'Serum / Clotted Blood',
    turnaroundHours: '4 hours'
  },

  // --- 3rd Trimester (29 - 40 Weeks) ---
  {
    id: 'ANC-T3-01',
    testCode: 'TEST-USG-GROWTH',
    testName: 'Ultrasound Fetal Growth Scan & Umbilical Doppler',
    stage: 'PREGNANCY_3RD_TRIMESTER',
    stageLabel: '3rd Trimester (32-34w)',
    timingDescription: '32-34 weeks of gestation',
    clinicalRationale: 'Assesses fetal growth velocity (EFW centiles), amniotic fluid index (AFI), placental maturity, and umbilical artery Doppler S/D ratio.',
    category: 'ULTRASOUND',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Intrauterine Growth Restriction (IUGR) & Oligohydramnios',
    sampleType: 'Doppler Ultrasound',
    turnaroundHours: 'Same Day'
  },
  {
    id: 'ANC-T3-02',
    testCode: 'TEST-PREECLAMPSIA-SCREEN',
    testName: 'Preeclampsia Surveillance: Spot Urine Protein:Creatinine Ratio (UPCR)',
    stage: 'PREGNANCY_3RD_TRIMESTER',
    stageLabel: '3rd Trimester (29-40w)',
    timingDescription: 'Every visit in 3rd trimester or immediately if BP elevated',
    clinicalRationale: 'Accurate quantification of proteinuria (significant if UPCR >= 0.3 mg/mg) to diagnose pre-eclampsia and prevent eclampsia.',
    category: 'URINE',
    priority: 'Urgent',
    isMandatory: true,
    targetCondition: 'Preeclampsia & Gestational Hypertension',
    sampleType: 'Spot Urine',
    turnaroundHours: '2 hours'
  },
  {
    id: 'ANC-T3-03',
    testCode: 'TEST-COAG-LABOR',
    testName: 'Platelet Count & Coagulation Profile (PT/INR, APTT)',
    stage: 'PREGNANCY_3RD_TRIMESTER',
    stageLabel: '3rd Trimester (36-37w)',
    timingDescription: 'Pre-delivery / Near term workup',
    clinicalRationale: 'Rules out gestational thrombocytopenia, HELLP syndrome, and coagulopathy ahead of regional anesthesia and delivery.',
    category: 'HEMATOLOGY',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Peripartum Hemorrhage Risk & Coagulopathy',
    sampleType: 'Citrated Plasma & EDTA Blood',
    turnaroundHours: '2 hours'
  },
  {
    id: 'ANC-T3-04',
    testCode: 'TEST-GBS-SWAB',
    testName: 'Group B Streptococcus (GBS) Screening Swab',
    stage: 'PREGNANCY_3RD_TRIMESTER',
    stageLabel: '3rd Trimester (35-37w)',
    timingDescription: '35 to 37 weeks of gestation',
    clinicalRationale: 'Identifies maternal colonisation to provide intrapartum antibiotic prophylaxis, preventing early-onset neonatal GBS sepsis and meningitis.',
    category: 'SCREENING',
    priority: 'Routine',
    isMandatory: false,
    targetCondition: 'Early-Onset Neonatal Sepsis',
    sampleType: 'Vaginal-Rectal Swab Culture / PCR',
    turnaroundHours: '48 hours'
  },
  {
    id: 'ANC-T3-05',
    testCode: 'TEST-NST-BPP',
    testName: 'Non-Stress Test (NST / Cardiotocography) & Biophysical Profile',
    stage: 'PREGNANCY_3RD_TRIMESTER',
    stageLabel: '3rd Trimester (36-40w)',
    timingDescription: 'Term surveillance, post-dated or reduced fetal movements',
    clinicalRationale: 'Evaluates fetal autonomic reactivity (FHR accelerations) and acute uteroplacental wellbeing.',
    category: 'SCREENING',
    priority: 'Stat',
    isMandatory: false,
    targetCondition: 'Fetal Hypoxia & Acute Fetal Distress',
    sampleType: 'Electronic Fetal Heart Tracing & Ultrasound',
    turnaroundHours: 'Immediate'
  }
];

// ============================================================================
// 3. MATERNAL TESTS AFTER PREGNANCY (PNC Day 1-3 & 6-Week Checkup)
// ============================================================================

export const MATERNAL_PNC_TESTS: MaternalTestProtocol[] = [
  // --- Immediate Postnatal (Day 1 - Day 3) ---
  {
    id: 'PNC-D1-01',
    testCode: 'TEST-POSTPARTUM-HB',
    testName: 'Postpartum Hemoglobin & Hematocrit',
    stage: 'POSTNATAL_IMMEDIATE',
    stageLabel: 'Immediate Postpartum (Day 1-3)',
    timingDescription: '24-48 hours post-delivery',
    clinicalRationale: 'Detects acute blood loss from primary postpartum hemorrhage (PPH) and guides oral iron vs IV iron sucrose/blood transfusion.',
    category: 'HEMATOLOGY',
    priority: 'Urgent',
    isMandatory: true,
    targetCondition: 'Postpartum Anemia & Hemorrhage Evaluation',
    sampleType: 'Whole Blood (EDTA)',
    turnaroundHours: '2 hours'
  },
  {
    id: 'PNC-D1-02',
    testCode: 'TEST-CORD-RH-DCT',
    testName: 'Neonatal Cord Blood ABO/Rh & Direct Coombs Test (DCT)',
    stage: 'POSTNATAL_IMMEDIATE',
    stageLabel: 'Immediate Postpartum (At Delivery)',
    timingDescription: 'Collected from umbilical cord immediately after clamping',
    clinicalRationale: 'Determines newborn blood group in Rh-negative mothers and verifies whether fetal RBCs have maternal antibody coating (Hemolytic Disease of Newborn).',
    category: 'SEROLOGY',
    priority: 'Stat',
    isMandatory: true,
    targetCondition: 'Hemolytic Disease of the Fetus & Newborn (HDFN)',
    sampleType: 'Cord Blood (EDTA)',
    turnaroundHours: '1-2 hours'
  },
  {
    id: 'PNC-D1-03',
    testCode: 'TEST-ANTI-D-SCREEN',
    testName: 'Anti-D Immunoglobulin (Rhogam) Eligibility & Kleihauer-Betke Test',
    stage: 'POSTNATAL_IMMEDIATE',
    stageLabel: 'Immediate Postpartum (Within 72 Hours)',
    timingDescription: 'Within 72 hours of delivery',
    clinicalRationale: 'Administer 300 mcg Anti-D within 72 hours of delivery to Rh-negative mothers who deliver an Rh-positive baby to prevent Rh isoimmunisation in future pregnancies.',
    category: 'SEROLOGY',
    priority: 'Urgent',
    isMandatory: true,
    targetCondition: 'Future Pregnancy Rh Isoimmunisation Prevention',
    sampleType: 'Maternal Blood & Clinical Record',
    turnaroundHours: '2 hours'
  },
  {
    id: 'PNC-D1-04',
    testCode: 'TEST-POSTPARTUM-BP-URINE',
    testName: 'Postpartum BP Monitoring & Urine Albumin Audit',
    stage: 'POSTNATAL_IMMEDIATE',
    stageLabel: 'Immediate Postpartum (Days 1-3)',
    timingDescription: 'Daily monitoring prior to discharge',
    clinicalRationale: 'Screens for late-onset postpartum pre-eclampsia and eclampsia, which can develop up to 48-72 hours post-delivery.',
    category: 'URINE',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Late Postpartum Pre-eclampsia & Eclampsia',
    sampleType: 'Spot Urine & Blood Pressure Log',
    turnaroundHours: '1 hour'
  },

  // --- 6-Week Postnatal Follow-up (Day 42 Checkup) ---
  {
    id: 'PNC-W6-01',
    testCode: 'TEST-PNC-OGTT-75G',
    testName: 'Postnatal 75g 2-hour Oral Glucose Tolerance Test (OGTT)',
    stage: 'POSTNATAL_6WEEKS',
    stageLabel: '6-Week Postnatal Checkup (Day 42)',
    timingDescription: '6 to 12 weeks postpartum (for all mothers diagnosed with GDM)',
    clinicalRationale: 'Critical follow-up for mothers with Gestational Diabetes to reclassify maternal glycemic status: normal vs impaired glucose tolerance (IGT) vs overt Type 2 Diabetes.',
    category: 'BIOCHEMISTRY',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Persistent Type 2 Diabetes Mellitus following GDM',
    sampleType: 'Fluoride Plasma (Fasting and 2-hour post 75g oral glucose)',
    turnaroundHours: '3 hours'
  },
  {
    id: 'PNC-W6-02',
    testCode: 'TEST-PNC-HB-FERRITIN',
    testName: 'Postnatal Hemoglobin & Serum Ferritin Evaluation',
    stage: 'POSTNATAL_6WEEKS',
    stageLabel: '6-Week Postnatal Checkup (Day 42)',
    timingDescription: '6-week postpartum maternal wellness exam',
    clinicalRationale: 'Ensures full recovery of maternal iron stores depleted during pregnancy and delivery, supporting lactation energy and maternal recovery.',
    category: 'HEMATOLOGY',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Chronic Postpartum Anemia & Iron Store Depletion',
    sampleType: 'Whole Blood (EDTA) & Serum',
    turnaroundHours: '3 hours'
  },
  {
    id: 'PNC-W6-03',
    testCode: 'TEST-PNC-TSH',
    testName: 'Postpartum Thyroid Profile (TSH & Free T4)',
    stage: 'POSTNATAL_6WEEKS',
    stageLabel: '6-Week Postnatal Checkup (Day 42)',
    timingDescription: '6 weeks postpartum (mothers with gestational thyroid disorders)',
    clinicalRationale: 'Identifies Postpartum Thyroiditis (affecting 5-10% of women), presenting with initial transient hyperthyroidism followed by hypothyroidism and fatigue.',
    category: 'BIOCHEMISTRY',
    priority: 'Routine',
    isMandatory: false,
    targetCondition: 'Postpartum Thyroiditis & Thyroid Dysfunction',
    sampleType: 'Serum',
    turnaroundHours: '4 hours'
  },
  {
    id: 'PNC-W6-04',
    testCode: 'TEST-PNC-PAP-SMEAR',
    testName: 'Postnatal Cervical Cytology (Pap Smear / LBC)',
    stage: 'POSTNATAL_6WEEKS',
    stageLabel: '6-Week Postnatal Checkup (Day 42)',
    timingDescription: '6 weeks postpartum if routine cervical screening is overdue',
    clinicalRationale: 'Cervical cancer prevention screening once lochia has ceased and cervical epithelial involution is completed.',
    category: 'SCREENING',
    priority: 'Routine',
    isMandatory: false,
    targetCondition: 'Cervical Dysplasia & Neoplasia',
    sampleType: 'Cervical Endocervical/Ectocervical Brush',
    turnaroundHours: '48 hours'
  },
  {
    id: 'PNC-W6-05',
    testCode: 'TEST-PNC-EPDS',
    testName: 'Edinburgh Postnatal Depression Scale (EPDS Screening)',
    stage: 'POSTNATAL_6WEEKS',
    stageLabel: '6-Week Postnatal Checkup (Day 42)',
    timingDescription: 'Standard 10-item clinical questionnaire at 6 weeks',
    clinicalRationale: 'Validated international screening tool (Score >= 10 indicates possible depression) to identify postpartum depression early and provide psychological support.',
    category: 'SCREENING',
    priority: 'Routine',
    isMandatory: true,
    targetCondition: 'Postpartum Depression (PPD) & Perinatal Mental Health',
    sampleType: 'Standardized Clinical Assessment Scale (0-30 points)',
    turnaroundHours: 'Immediate'
  }
];

// Combine all maternal tests for easy filtering
export const ALL_MATERNAL_TESTS: MaternalTestProtocol[] = [
  ...MATERNAL_ANC_TESTS,
  ...MATERNAL_PNC_TESTS
];

/**
 * Helper to determine maternal stage from pregnancy details and patient state
 */
export const detectMaternalStage = (patient: {
  isPregnant?: boolean;
  pregnancyDetails?: { gestationalAgeWeeks?: number };
  postnatalDetails?: { deliveryDate?: string; postpartumDay?: number };
  visitType?: string;
}): MaternalClinicalStage => {
  if (patient.postnatalDetails || patient.visitType === 'PNC') {
    const day = patient.postnatalDetails?.postpartumDay || 42;
    if (day <= 3) return 'POSTNATAL_IMMEDIATE';
    return 'POSTNATAL_6WEEKS';
  }

  if (patient.isPregnant && patient.pregnancyDetails?.gestationalAgeWeeks) {
    const weeks = patient.pregnancyDetails.gestationalAgeWeeks;
    if (weeks <= 12) return 'PREGNANCY_1ST_TRIMESTER';
    if (weeks <= 28) return 'PREGNANCY_2ND_TRIMESTER';
    return 'PREGNANCY_3RD_TRIMESTER';
  }

  return 'GENERAL_NON_PREGNANT';
};

/**
 * Filter tests recommended for a specific clinical stage
 */
export const getTestsForMaternalStage = (stage: MaternalClinicalStage): MaternalTestProtocol[] => {
  return ALL_MATERNAL_TESTS.filter(t => t.stage === stage);
};
