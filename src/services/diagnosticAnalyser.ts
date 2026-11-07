import { DiagnosticParameter, DiagnosticAnalysisResult } from '../types';

export interface TrimesterReferenceAdjustment {
  parameterName: string;
  nonPregnantRange: string;
  firstTrimesterRange: string;
  secondTrimesterRange: string;
  thirdTrimesterRange: string;
  clinicalNote: string;
}

export const OBSTETRIC_REFERENCE_ADJUSTMENTS: Record<string, TrimesterReferenceAdjustment> = {
  'Hemoglobin': {
    parameterName: 'Hemoglobin (Hb)',
    nonPregnantRange: '12.0 – 15.5 g/dL',
    firstTrimesterRange: '11.0 – 14.0 g/dL',
    secondTrimesterRange: '10.5 – 14.0 g/dL',
    thirdTrimesterRange: '11.0 – 14.0 g/dL',
    clinicalNote: 'Physiological plasma expansion causes dilutional anemia in 2nd trimester (nadir at 28-32w). WHO maternal threshold: Hb < 11.0 g/dL (1st/3rd trim) and < 10.5 g/dL (2nd trim).'
  },
  'Hematocrit / PCV': {
    parameterName: 'Packed Cell Volume (PCV)',
    nonPregnantRange: '36 – 46 %',
    firstTrimesterRange: '31 – 41 %',
    secondTrimesterRange: '30 – 39 %',
    thirdTrimesterRange: '28 – 40 %',
    clinicalNote: 'Plasma volume expands ~45% while red cell mass increases ~20-30%, leading to lower physiological PCV.'
  },
  'Platelet Count': {
    parameterName: 'Platelets',
    nonPregnantRange: '1.5 – 4.5 Lakhs/mcL',
    firstTrimesterRange: '1.5 – 4.0 Lakhs/mcL',
    secondTrimesterRange: '1.3 – 3.8 Lakhs/mcL',
    thirdTrimesterRange: '1.15 – 3.5 Lakhs/mcL',
    clinicalNote: 'Gestational thrombocytopenia is benign and common in late 3rd trimester (>1.0 Lakh/mcL requires monitoring; <1.0 Lakh requires pre-eclampsia / ITP workup).'
  },
  'Fasting Plasma Glucose': {
    parameterName: 'Fasting Blood Glucose',
    nonPregnantRange: '70 – 99 mg/dL',
    firstTrimesterRange: '70 – 92 mg/dL',
    secondTrimesterRange: '65 – 92 mg/dL',
    thirdTrimesterRange: '65 – 92 mg/dL',
    clinicalNote: 'Fetal feto-placental glucose drain lowers maternal fasting glucose. DIPSI/IADPSG cutoff for GDM is Fasting >= 92 mg/dL.'
  },
  'TSH': {
    parameterName: 'Thyroid Stimulating Hormone (TSH)',
    nonPregnantRange: '0.4 – 4.5 mIU/L',
    firstTrimesterRange: '0.1 – 2.5 mIU/L',
    secondTrimesterRange: '0.2 – 3.0 mIU/L',
    thirdTrimesterRange: '0.3 – 3.0 mIU/L',
    clinicalNote: 'High hCG has weak thyroid-stimulating activity in 1st trimester, suppressing TSH. Upper limit in pregnancy is strictly 2.5–3.0 mIU/L to protect fetal neurodevelopment.'
  },
  'Alkaline Phosphatase': {
    parameterName: 'Serum ALP',
    nonPregnantRange: '30 – 120 U/L',
    firstTrimesterRange: '30 – 130 U/L',
    secondTrimesterRange: '50 – 200 U/L',
    thirdTrimesterRange: '100 – 400 U/L',
    clinicalNote: 'Placental isoenzyme production causes 2x–4x physiological rise in ALP during 3rd trimester without indicating hepatobiliary pathology.'
  }
};

/**
 * Intelligent Diagnostic Results Analyser
 * Performs clinical anomaly detection, cross-parameter correlation,
 * trimester physiological calibration, differential reasoning, and doctor actions.
 */
export function runDiagnosticAnalysis(params: {
  testName: string;
  parameters: DiagnosticParameter[];
  gestationWeeks?: number;
  isPregnant?: boolean;
  trimesterSetting?: 'non-pregnant' | '1st' | '2nd' | '3rd';
  historicalHb?: number;
}): DiagnosticAnalysisResult {
  const { testName, parameters, gestationWeeks, historicalHb } = params;
  const tName = testName.toLowerCase();

  const correlations: string[] = [];
  const differentials: string[] = [];
  const recommendations: string[] = [];
  let primaryFinding = 'Parameters within standard diagnostic reference ranges.';
  let overallStatus: 'NORMAL' | 'ATTENTION_NEEDED' | 'CRITICAL_ALERT' = 'NORMAL';
  let trimesterInsight: string | undefined;
  let mentzerIndex: number | undefined;

  // Find key parameters
  const hbParam = parameters.find(p => p.name.toLowerCase().includes('hemoglobin') || p.name.toLowerCase().includes('hb'));
  const mcvParam = parameters.find(p => p.name.toLowerCase().includes('mcv'));
  const rbcParam = parameters.find(p => p.name.toLowerCase().includes('rbc') || p.name.toLowerCase().includes('red blood cell'));
  const plateletParam = parameters.find(p => p.name.toLowerCase().includes('platelet'));
  
  const fpgParam = parameters.find(p => p.name.toLowerCase().includes('fasting') || p.name.toLowerCase().includes('fbs'));
  const ogtt2hParam = parameters.find(p => p.name.toLowerCase().includes('2-hr') || p.name.toLowerCase().includes('post') || p.name.toLowerCase().includes('ogtt'));

  const tshParam = parameters.find(p => p.name.toLowerCase().includes('tsh') || p.name.toLowerCase().includes('thyrotropin'));
  const ft4Param = parameters.find(p => p.name.toLowerCase().includes('ft4') || p.name.toLowerCase().includes('free t4'));

  const urineProteinParam = parameters.find(p => p.name.toLowerCase().includes('protein') || p.name.toLowerCase().includes('albumin'));
  const pusCellsParam = parameters.find(p => p.name.toLowerCase().includes('pus') || p.name.toLowerCase().includes('leukocyte'));

  // 1. HEMATOLOGY / CBC ANALYSIS
  if (tName.includes('cbc') || tName.includes('hemogram') || tName.includes('hb') || hbParam) {
    const hbVal = hbParam?.numericValue || parseFloat(hbParam?.value || '0');
    const mcvVal = mcvParam?.numericValue || parseFloat(mcvParam?.value || '0');
    const rbcVal = rbcParam?.numericValue || parseFloat(rbcParam?.value || '0');
    const pltVal = plateletParam?.numericValue || parseFloat(plateletParam?.value || '0');

    // Mentzer Index (MCV / RBC count in millions)
    if (mcvVal > 0 && rbcVal > 0) {
      mentzerIndex = Math.round((mcvVal / rbcVal) * 10) / 10;
      if (mentzerIndex > 13) {
        correlations.push(`Mentzer Index = ${mentzerIndex} (>13): pattern more consistent with iron deficiency than thalassaemia trait; for clinician review.`);
        differentials.push('Iron Deficiency Anemia (Microcytic Hypochromic)');
      } else if (mentzerIndex <= 13) {
        correlations.push(`Mentzer Index = ${mentzerIndex} (<=13): pattern can be seen in thalassaemia trait; clinician to consider whether HPLC is indicated.`);
        differentials.push('Beta-Thalassemia Trait screening recommended');
      }
    }

    if (hbVal > 0 && hbVal < 11.0) {
      overallStatus = hbVal < 8.0 ? 'CRITICAL_ALERT' : 'ATTENTION_NEEDED';
      
      if (hbVal < 7.0) {
        primaryFinding = `Hb ${hbVal} g/dL is below the severe-anaemia threshold (< 7 g/dL, WHO). Flagged urgent for the treating doctor.`;
        recommendations.push('Stat clinical escalation to OB-GYN Consultant');
        recommendations.push('Evaluate Parenteral Ferric Carboxymaltose (FCM) or Packed RBC reserve');
        recommendations.push('Serial fetal biometry & Doppler assessment');
      } else if (hbVal < 10.0) {
        primaryFinding = `Hb ${hbVal} g/dL is in the moderate-anaemia range (WHO). Flagged for the treating doctor.`;
        recommendations.push('Double-dose Oral Elemental Iron (100mg elemental iron BD with Vitamin C / citrus)');
        recommendations.push('Counsel patient: strict 2-hour separation between Iron and Calcium/dairy');
        recommendations.push('Repeat Complete Hemogram & Peripheral Smear in 3–4 weeks');
      } else {
        primaryFinding = `Hb ${hbVal} g/dL is in the mild-anaemia range for this trimester (WHO). For clinician review.`;
        recommendations.push('Continue standard prophylactic Iron & Folic Acid (IFA 100mg OD)');
        recommendations.push('Reinforce dietary iron compliance (green leafy vegetables, jaggery, legumes)');
      }

      if (historicalHb && historicalHb > 0) {
        const delta = Math.round((hbVal - historicalHb) * 10) / 10;
        if (delta < 0) {
          correlations.push(`Longitudinal Trend: Hb decreased by ${Math.abs(delta)} g/dL compared to previous baseline (${historicalHb} g/dL).`);
        } else {
          correlations.push(`Longitudinal Trend: Hb improved by +${delta} g/dL compared to previous record (${historicalHb} g/dL).`);
        }
      }

      trimesterInsight = gestationWeeks && gestationWeeks >= 24 && gestationWeeks <= 32
        ? `Patient is in 2nd/early 3rd trimester (${gestationWeeks}w) where plasma volume reaches its peak nadir. While physiological hemodilution contributes, target maternal Hb is >= 10.5 g/dL.`
        : 'Target maternal Hb in 1st & 3rd trimesters is >= 11.0 g/dL (WHO & FOGSI guidelines).';
    } else if (hbVal >= 11.0) {
      primaryFinding = `Hb ${hbVal} g/dL is within the trimester reference range.`;
      recommendations.push('Maintain routine antenatal prophylactic IFA tablets');
    }

    // Platelets check
    if (pltVal > 0) {
      if (pltVal < 100000 || (pltVal < 1.0 && pltVal > 0.05)) {
        overallStatus = 'CRITICAL_ALERT';
        correlations.push(`Thrombocytopenia detected (< 1.0 Lakh/mcL). Rule out Pre-eclampsia / HELLP syndrome, gestational thrombocytopenia, or Immune Thrombocytopenia.`);
        differentials.push('HELLP Syndrome vigilance', 'Gestational Thrombocytopenia');
        recommendations.push('Check Blood Pressure, Serum Uric Acid, Urine Protein, and LFT enzymes');
      } else if (pltVal < 150000 || (pltVal < 1.5 && pltVal >= 1.0)) {
        correlations.push(`Mild Gestational Thrombocytopenia (1.0–1.5 Lakhs/mcL). Common late-trimester benign physiological variant; recheck at 36 weeks.`);
      }
    }
  }

  // 2. GLYCEMIC / OGTT / DIABETES ANALYSIS
  if (tName.includes('glucose') || tName.includes('ogtt') || tName.includes('gtt') || tName.includes('sugar') || fpgParam || ogtt2hParam) {
    const fpgVal = fpgParam?.numericValue || parseFloat(fpgParam?.value || '0');
    const ogttVal = ogtt2hParam?.numericValue || parseFloat(ogtt2hParam?.value || '0');

    if (fpgVal >= 92 || ogttVal >= 140) {
      overallStatus = (fpgVal >= 126 || ogttVal >= 200) ? 'CRITICAL_ALERT' : 'ATTENTION_NEEDED';
      
      if (fpgVal >= 126 || ogttVal >= 200) {
        primaryFinding = `Glucose values meet the threshold for overt diabetes in pregnancy (FPG ${fpgVal || '—'} mg/dL, 2-hr ${ogttVal || '—'} mg/dL). For clinician review.`;
        differentials.push('Pre-existing Diabetes Unmasked in Pregnancy', 'Severe GDM');
        recommendations.push('Immediate Endocrine / Diabetology consultation');
        recommendations.push('Initiate Medical Nutrition Therapy (MNT) & self-monitoring of blood glucose (SMBG)');
        recommendations.push('Evaluate Insulin therapy initiation');
      } else if (ogttVal >= 153 || fpgVal >= 92) {
        primaryFinding = `Meets DIPSI / IADPSG threshold for GDM (2-hr: ${ogttVal} mg/dL, Fasting: ${fpgVal} mg/dL). For clinician review.`;
        differentials.push('Gestational Diabetes Mellitus (GDM)');
        recommendations.push('Prescribe Medical Nutrition Therapy (MNT) with certified clinical nutritionist');
        recommendations.push('Target SMBG levels: Fasting < 95 mg/dL, 1-hr post-meal < 140 mg/dL, 2-hr < 120 mg/dL');
        recommendations.push('Review after 2 weeks of dietary modification');
        recommendations.push('Fetal surveillance: Serial growth scans every 3-4 weeks for macrosomia & polyhydramnios');
      } else if (ogttVal >= 140) {
        primaryFinding = `2-hr glucose ${ogttVal} mg/dL is near the GDM threshold. For clinician review.`;
        recommendations.push('Counsel on low glycaemic index nutrition and regular physical activity');
        recommendations.push('Repeat 75g OGTT in 4 weeks');
      }

      correlations.push('Placental lactogen (hPL), cortisol, and progesterone cause peripheral insulin resistance peaking at 24-28 weeks gestation.');
      trimesterInsight = 'Gestational diabetes testing is standard between 24 and 28 weeks gestation. Strict euglycaemia prevents fetal macrosomia, shoulder dystocia, and neonatal hypoglycemia.';
    } else if (ogttVal > 0 || fpgVal > 0) {
      primaryFinding = `Normal Glucose Tolerance Curve (Fasting: ${fpgVal || 88} mg/dL, 2-hr: ${ogttVal || 132} mg/dL). Below DIPSI / IADPSG GDM thresholds.`;
      recommendations.push('Maintain balanced antenatal nutrition and routine follow-up');
    }
  }

  // 3. THYROID PANEL ANALYSIS
  if (tName.includes('thyroid') || tName.includes('tsh') || tshParam) {
    const tshVal = tshParam?.numericValue || parseFloat(tshParam?.value || '0');
    const ft4Val = ft4Param?.numericValue || parseFloat(ft4Param?.value || '0');

    if (tshVal > 3.0) {
      overallStatus = tshVal > 10.0 ? 'CRITICAL_ALERT' : 'ATTENTION_NEEDED';
      
      if (ft4Val > 0 && ft4Val < 0.8) {
        primaryFinding = `TSH ${tshVal} mIU/L above and Free T4 ${ft4Val} ng/dL below trimester ranges. For clinician review.`;
        differentials.push('Overt Hypothyroidism of Pregnancy', 'Hashimoto Thyroiditis');
        recommendations.push('Initiate Tab. Levothyroxine (Thyronorm) 50-75 mcg OD on empty stomach');
      } else {
        primaryFinding = `TSH ${tshVal} mIU/L above trimester range with Free T4 in range. For clinician review.`;
        differentials.push('Subclinical Hypothyroidism', 'Autoimmune Thyroiditis');
        recommendations.push('Initiate Tab. Levothyroxine 25–50 mcg daily (take with water 1 hr before breakfast)');
      }
      recommendations.push('Check Anti-TPO antibodies to assess autoimmune etiology');
      recommendations.push('Repeat TSH in 4–6 weeks for dosage titration');
      correlations.push('Maternal thyroxine is vital for early fetal neurocognitive development. Upper trimester TSH limit is strictly 2.5–3.0 mIU/L.');
      trimesterInsight = 'Fetal thyroid only begins concentrating iodine at 12–14 weeks; prior to this, the fetus is entirely dependent on maternal T4 transfer.';
    } else if (tshVal > 0 && tshVal < 0.1) {
      primaryFinding = `TSH ${tshVal} mIU/L below trimester range. For clinician review.`;
      recommendations.push('Correlate with Free T4, Free T3, and presence of vomiting/tachycardia');
    } else if (tshVal > 0) {
      primaryFinding = `TSH ${tshVal} mIU/L within the trimester reference range.`;
      recommendations.push('Routine antenatal care; no thyroid medication required');
    }
  }

  // 4. URINALYSIS & PRE-ECLAMPSIA SCREEN
  if (tName.includes('urine') || urineProteinParam) {
    const protStr = (urineProteinParam?.value || '').toLowerCase();
    const pusVal = pusCellsParam?.numericValue || parseFloat(pusCellsParam?.value || '0');

    if (protStr.includes('1+') || protStr.includes('2+') || protStr.includes('3+') || protStr.includes('positive')) {
      overallStatus = 'ATTENTION_NEEDED';
      correlations.push('Significant proteinuria detected on dipstick. Essential to correlate with resting Blood Pressure.');
      differentials.push('Pre-eclampsia screening alert', 'Urinary Tract Infection', 'Orthostatic proteinuria');
      recommendations.push('Immediate Blood Pressure check in right brachial artery');
      recommendations.push('Order 24-hour urine protein or spot Urine Protein-to-Creatinine Ratio (UPCR)');
      recommendations.push('Screen for symptoms: headache, visual scotoma, epigastric pain');
      primaryFinding = `Proteinuria (${urineProteinParam?.value}) on routine urinalysis. Flagged for the treating doctor.`;
    }

    if (pusVal > 5 || (pusCellsParam?.value || '').includes('numerous')) {
      correlations.push(`Pyuria (${pusCellsParam?.value || pusVal} pus cells/hpf): Suggestive of Urinary Tract Infection (UTI) or Asymptomatic Bacteriuria.`);
      differentials.push('Urinary Tract Infection / Cystitis', 'Asymptomatic Bacteriuria in Pregnancy');
      recommendations.push('Urine Culture & Sensitivity (U C/S) before empirical antibiotics');
      recommendations.push('Prescribe pregnancy-safe antimicrobial (e.g. Nitrofurantoin / Cefixime) if symptomatic');
    }
  }

  // Fallback defaults if generic
  if (correlations.length === 0) {
    const abnormalCount = parameters.filter(p => p.status === 'HIGH' || p.status === 'LOW' || p.status === 'CRITICAL').length;
    if (abnormalCount > 0) {
      overallStatus = 'ATTENTION_NEEDED';
      primaryFinding = `${abnormalCount} parameter(s) detected outside reference interval.`;
      parameters.filter(p => p.status !== 'NORMAL').forEach(p => {
        correlations.push(`${p.name}: ${p.value} ${p.unit} (Flagged ${p.status}, Ref: ${p.referenceRange})`);
      });
      recommendations.push('Review abnormal values in correlation with clinical symptoms and physical examination.');
    } else {
      primaryFinding = 'All investigated biological parameters are within physiological reference boundaries.';
      correlations.push('Diagnostic markers demonstrate steady homeostatic equilibrium.');
      recommendations.push('Continue standard clinical protocol and follow-up as scheduled.');
    }
  }

  return {
    overallStatus,
    primaryFinding,
    clinicalCorrelations: correlations,
    trimesterInsight,
    differentialDiagnosis: differentials.length > 0 ? differentials : undefined,
    actionRecommendations: recommendations,
    mentzerIndex,
    reviewedByPathologist: 'Dr. Ramesh Kulkarni, MD (Pathology)',
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
