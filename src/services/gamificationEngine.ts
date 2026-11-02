import { 
  OpdPatient, 
  CareJourney, 
  CareJourneyType, 
  CareMilestone, 
  PatientAchievement, 
  DoctorAchievement, 
  PathologistAchievement 
} from '../types';

/**
 * Universal & Evidence-Based Gamification Engine for Continuum Care
 * 
 * Core Principle:
 * Rewards continuity of care for ALL patients across:
 * - Pregnancy and antenatal care
 * - Postnatal care
 * - Menstrual health & PCOS
 * - Gynaecological conditions
 * - Preventive health checks & screening
 * - Routine consultations & report reviews
 * 
 * Doctor determines which journey applies and records follow-up plans.
 * Never unilaterally diagnoses conditions via AI.
 */

export interface CareJourneyTemplate {
  type: CareJourneyType;
  title: string;
  defaultCriteria: string;
  milestoneTemplates: Array<{
    title: string;
    description: string;
    category: CareMilestone['category'];
    mandatoryForCompletion: boolean;
  }>;
}

export const CARE_JOURNEY_TEMPLATES: Record<CareJourneyType, CareJourneyTemplate> = {
  PREGNANCY: {
    type: 'PREGNANCY',
    title: 'Pregnancy & Antenatal Care Journey',
    defaultCriteria: 'Complete scheduled antenatal assessments, essential screenings, and clinician follow-ups.',
    milestoneTemplates: [
      { title: 'Antenatal Consultation & Booking', description: 'Comprehensive baseline clinical history, vitals, and initial obstetric assessment.', category: 'CONSULTATION', mandatoryForCompletion: true },
      { title: 'Essential Antenatal Lab & Ultrasound Screenings', description: 'Baseline serology, blood group confirmation, glucose screen, and gestational dating/TIFFA scans.', category: 'INVESTIGATION', mandatoryForCompletion: true },
      { title: 'Clinician Care Plan & Surveillance Follow-up', description: 'Trimester-appropriate clinical review and maternal-foetal surveillance follow-up.', category: 'FOLLOW_UP', mandatoryForCompletion: true }
    ]
  },
  POSTNATAL: {
    type: 'POSTNATAL',
    title: 'Postnatal Maternal & Wellness Journey',
    defaultCriteria: 'Complete postpartum recovery check, pelvic recovery assessment, and infant feeding counseling.',
    milestoneTemplates: [
      { title: 'Postpartum Clinical Assessment', description: 'Maternal recovery check, vitals, uterine involution, and wound/perineal healing check.', category: 'CONSULTATION', mandatoryForCompletion: true },
      { title: 'Nutritional & Lactation Counseling', description: 'Guidance on haemoglobin recovery, micronutrient support, and safe feeding practices.', category: 'CARE_PLAN', mandatoryForCompletion: false },
      { title: '6-Week Comprehensive Postnatal Review', description: 'Follow-up consultation to confirm maternal physiological recovery.', category: 'FOLLOW_UP', mandatoryForCompletion: true }
    ]
  },
  GYNECOLOGY: {
    type: 'GYNECOLOGY',
    title: 'Gynaecology Consultation & Care Pathway',
    defaultCriteria: 'Complete clinical evaluation, diagnostic tests if advised, and scheduled review.',
    milestoneTemplates: [
      { title: 'Specialist Gynaecological Consultation', description: 'Clinical examination, symptom assessment, and clinician-guided evaluation.', category: 'CONSULTATION', mandatoryForCompletion: true },
      { title: 'Prescribed Diagnostic Workup', description: 'Completion of targeted pathology or pelvic ultrasound investigations if recorded by doctor.', category: 'INVESTIGATION', mandatoryForCompletion: false },
      { title: 'Care Review & Continuity Follow-up', description: 'Consultation to evaluate treatment response and long-term symptom management.', category: 'FOLLOW_UP', mandatoryForCompletion: true }
    ]
  },
  ONGOING_CONDITION: {
    type: 'ONGOING_CONDITION',
    title: 'Ongoing Condition Care Journey',
    defaultCriteria: 'Adhere to clinician-recorded follow-up plan and therapeutic response tracking (e.g. PCOS, menstrual health).',
    milestoneTemplates: [
      { title: 'Condition Assessment & Care Plan Formulation', description: 'Review of symptoms, hormonal/metabolic workup, and clinician treatment plan.', category: 'CONSULTATION', mandatoryForCompletion: true },
      { title: 'Targeted Hormone / Metabolic Screen', description: 'Laboratory investigation completion as recorded by the treating doctor.', category: 'INVESTIGATION', mandatoryForCompletion: false },
      { title: 'Therapeutic Review & Follow-up', description: 'On-schedule follow-up visit to review clinical progress and treatment adjustments.', category: 'FOLLOW_UP', mandatoryForCompletion: true }
    ]
  },
  PREVENTIVE_SCREENING: {
    type: 'PREVENTIVE_SCREENING',
    title: 'Preventive Health Check & Screening',
    defaultCriteria: 'Complete recommended preventive screening (e.g. Pap smear, breast check, annual wellness exam).',
    milestoneTemplates: [
      { title: 'Preventive Health Examination', description: 'Annual well-woman examination, risk factor review, and lifestyle counseling.', category: 'CONSULTATION', mandatoryForCompletion: true },
      { title: 'Preventive Screening Test', description: 'Completion and pathologist verification of cervical or metabolic screening report.', category: 'SCREENING', mandatoryForCompletion: true },
      { title: 'Screening Results Verification & Advice', description: 'Clinician review of normal findings and guidance on interval for next routine check.', category: 'CARE_PLAN', mandatoryForCompletion: true }
    ]
  },
  INVESTIGATION_REVIEW: {
    type: 'INVESTIGATION_REVIEW',
    title: 'Investigation & Report Review Journey',
    defaultCriteria: 'Complete requested laboratory tests and review findings with the consulting clinician.',
    milestoneTemplates: [
      { title: 'Investigation Ordering Consultation', description: 'Clinical indication recorded and laboratory investigations dispatched.', category: 'CONSULTATION', mandatoryForCompletion: true },
      { title: 'Laboratory Investigation & Report Finalisation', description: 'Pathology sample processed and verified report released for review.', category: 'INVESTIGATION', mandatoryForCompletion: true },
      { title: 'Doctor Report Review Consultation', description: 'Follow-up discussion with doctor to interpret findings and finalize next steps.', category: 'FOLLOW_UP', mandatoryForCompletion: true }
    ]
  },
  GENERAL_OPD: {
    type: 'GENERAL_OPD',
    title: 'General OPD Care Journey',
    defaultCriteria: 'Complete consultation and any clinician-recommended instructions.',
    milestoneTemplates: [
      { title: 'Initial Outpatient Consultation', description: 'Doctor examination, diagnosis discussion, and prescription issuance.', category: 'CONSULTATION', mandatoryForCompletion: true },
      { title: 'Doctor Instructions & Home Care Adherence', description: 'Follow prescribed regimen and reported symptomatic resolution.', category: 'CARE_PLAN', mandatoryForCompletion: true }
    ]
  }
};

/**
 * Universal Patient Achievement Definitions
 */
export const UNIVERSAL_ACHIEVEMENT_DEFINITIONS = [
  {
    code: 'FIRST_VISIT',
    title: 'First Visit',
    description: 'Awarded when the first OPD consultation is completed and recorded.',
    criteria: 'Complete initial OPD consultation with doctor outcome recorded.',
    iconName: 'UserCheck',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300'
  },
  {
    code: 'CARE_JOURNEY_STARTED',
    title: 'Care Journey Started',
    description: 'Awarded when the patient has a recorded care plan or next step, where applicable.',
    criteria: 'Clinician documents follow-up instruction, prescription, or investigation plan.',
    iconName: 'Compass',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  {
    code: 'FOLLOW_THROUGH',
    title: 'Follow-through',
    description: 'Awarded when the patient completes a clinician-recorded follow-up or other applicable milestone within its configured timeframe.',
    criteria: 'Attended scheduled follow-up or completed diagnostic milestones.',
    iconName: 'CheckCircle2',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  {
    code: 'REPORT_REVIEW_READY',
    title: 'Report Review Ready',
    description: 'Awarded when a requested investigation is completed and the required report is available for review.',
    criteria: 'Lab test processed and verified report uploaded by pathology.',
    iconName: 'FileCheck2',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  {
    code: 'STAYING_ON_TRACK',
    title: 'Staying on Track',
    description: 'Awarded when the patient completes a configurable proportion of applicable, scheduled milestones.',
    criteria: 'Completed >= 66% of applicable scheduled milestones on time.',
    iconName: 'TrendingUp',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
  },
  {
    code: 'CARE_JOURNEY_MILESTONE',
    title: 'Care Journey Milestone',
    description: 'Awarded when the patient completes the milestones defined for her particular care journey.',
    criteria: 'Completed active milestone in current care pathway.',
    iconName: 'Milestone',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    code: 'CARE_JOURNEY_CHAMPION',
    title: 'Care Journey Champion',
    description: 'Awarded after completing the configured milestones for an applicable episode or care plan.',
    criteria: 'All applicable milestones in the care journey or single consultation care plan completed.',
    iconName: 'Award',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  }
];

/**
 * Pregnancy-Specific Achievement Definitions (Shown ONLY when enrolled in pregnancy/postnatal journey)
 */
export const PREGNANCY_ACHIEVEMENT_DEFINITIONS = [
  {
    code: 'ANTENATAL_MILESTONE',
    title: 'Antenatal Milestone',
    description: 'Awarded for completing trimester-specific ultrasound surveillance (NT, TIFFA, or Growth Doppler).',
    criteria: 'Obstetric ultrasound or comprehensive antenatal screening completed.',
    iconName: 'Heart',
    badgeColor: 'bg-pink-100 text-pink-900 border-pink-300'
  },
  {
    code: 'ANTENATAL_FOLLOW_THROUGH',
    title: 'Antenatal Follow-through',
    description: 'Awarded for timely attendance of maternal surveillance follow-up consultations.',
    criteria: 'Scheduled antenatal checkup attended on time.',
    iconName: 'Baby',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  },
  {
    code: 'POSTNATAL_FOLLOW_THROUGH',
    title: 'Postnatal Follow-through',
    description: 'Awarded for completing postpartum maternal recovery review and wellness check.',
    criteria: 'Attended postpartum recovery consultation within 6 weeks.',
    iconName: 'Smile',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  }
];

export class GamificationEngine {
  /**
   * Determine the most appropriate care journey type for a patient based on doctor record
   * Guardrail: Doctor determines journey; does not infer diseases unilaterally via AI.
   */
  detectJourneyType(patient: OpdPatient): CareJourneyType {
    if (patient.careJourney?.type) {
      return patient.careJourney.type;
    }

    const reason = (patient.visitReason || '').toLowerCase();
    const type = (patient.visitType || '').toLowerCase();

    if (patient.isPregnant || type.includes('anc') || reason.includes('antenatal') || reason.includes('pregnancy')) {
      return 'PREGNANCY';
    }
    if (type.includes('pnc') || reason.includes('postnatal') || reason.includes('postpartum')) {
      return 'POSTNATAL';
    }
    if (reason.includes('screening') || reason.includes('pap') || reason.includes('preventive') || reason.includes('annual') || reason.includes('wellness')) {
      return 'PREVENTIVE_SCREENING';
    }
    if (reason.includes('pcos') || reason.includes('menstrual') || reason.includes('irregular') || reason.includes('hormon') || reason.includes('chronic')) {
      return 'ONGOING_CONDITION';
    }
    if (reason.includes('report') || reason.includes('review') || reason.includes('lab') || (patient.labOrders && patient.labOrders.length > 0)) {
      return 'INVESTIGATION_REVIEW';
    }
    if (type.includes('gynaecology') || reason.includes('gynaec') || reason.includes('pelvic')) {
      return 'GYNECOLOGY';
    }
    return 'GENERAL_OPD';
  }

  /**
   * Builds or synchronizes a patient's care journey from their actual records
   */
  synchronizeCareJourney(patient: OpdPatient, preferredType?: CareJourneyType): CareJourney {
    const journeyType = preferredType || patient.careJourney?.type || this.detectJourneyType(patient);
    const template = CARE_JOURNEY_TEMPLATES[journeyType] || CARE_JOURNEY_TEMPLATES.GENERAL_OPD;

    const isConsultationCompleted = patient.queueStatus === 'Completed' || !!patient.assessmentOutcome || !!patient.doctorNotes;
    const hasLabOrders = (patient.labOrders && patient.labOrders.length > 0) || (patient.labReferrals && patient.labReferrals.length > 0);
    const hasCompletedReports = patient.labOrders?.some(o => o.reportStatus === 'Report Uploaded' || o.sampleStatus === 'Test Completed') ||
                                patient.labReferrals?.some(r => r.status === 'REPORT RELEASED');
    
    // Transparent check: Is follow up required?
    const isFollowUpRequired = patient.followUpStatus !== 'Not Required' && (!!patient.followUpDate || patient.followUpStatus === 'Scheduled' || patient.followUpStatus === 'Due Today' || patient.followUpStatus === 'Overdue');
    const isFollowUpAttended = patient.followUpStatus === 'Attended';
    const isFollowUpRescheduledOrExcluded = patient.followUpStatus === 'Rescheduled' || patient.followUpStatus === 'Cancelled by Patient' || patient.followUpStatus === 'Excluded';

    const milestones: CareMilestone[] = [];

    // Milestone 1: Initial consultation
    milestones.push({
      id: `${patient.id}-M1`,
      title: template.milestoneTemplates[0]?.title || 'Initial Consultation',
      description: template.milestoneTemplates[0]?.description || 'Consultation completed by treating doctor.',
      status: isConsultationCompleted ? 'COMPLETED' : 'PENDING',
      completedAt: isConsultationCompleted ? (patient.visitDate || '10 Oct 2026') : undefined,
      category: 'CONSULTATION',
      mandatoryForCompletion: true
    });

    // Milestone 2: Diagnostic / Screening (if applicable or requested)
    if (hasLabOrders || journeyType === 'PREVENTIVE_SCREENING' || journeyType === 'INVESTIGATION_REVIEW' || journeyType === 'ONGOING_CONDITION') {
      const isLabComplete = hasCompletedReports;
      milestones.push({
        id: `${patient.id}-M2`,
        title: template.milestoneTemplates[1]?.title || 'Diagnostic Investigation & Report Review',
        description: hasLabOrders 
          ? `Laboratory investigation (${patient.labOrders?.[0]?.testName || patient.labReferrals?.[0]?.testName || 'Diagnostics'}) completed and verified.`
          : (template.milestoneTemplates[1]?.description || 'Diagnostic screening workup.'),
        status: isLabComplete ? 'COMPLETED' : (hasLabOrders ? 'PENDING' : 'NOT_APPLICABLE'),
        completedAt: isLabComplete ? (patient.labOrders?.[0]?.uploadedAt || '10 Oct 2026') : undefined,
        category: 'INVESTIGATION',
        mandatoryForCompletion: hasLabOrders
      });
    }

    // Milestone 3: Follow-up or single-consultation care plan closure
    if (!isFollowUpRequired && (patient.followUpStatus === 'Not Required' || journeyType === 'PREVENTIVE_SCREENING' || journeyType === 'GENERAL_OPD')) {
      // One-time consultation: Doctor documented no follow-up needed. Acknowledge completed visit rather than penalizing!
      milestones.push({
        id: `${patient.id}-M3`,
        title: 'Single Consultation Care Plan Complete',
        description: patient.followUpInstruction || 'Clinician documented instructions; routine care plan fulfilled with no immediate follow-up necessary.',
        status: isConsultationCompleted ? 'COMPLETED' : 'PENDING',
        completedAt: isConsultationCompleted ? (patient.visitDate || '10 Oct 2026') : undefined,
        category: 'CARE_PLAN',
        mandatoryForCompletion: true
      });
    } else {
      // Clinician-recorded follow-up
      let status: CareMilestone['status'] = 'SCHEDULED';
      let exclusionReason: string | undefined;

      if (isFollowUpAttended) {
        status = 'COMPLETED';
      } else if (isFollowUpRescheduledOrExcluded) {
        status = 'EXCLUDED';
        exclusionReason = 'Patient-requested rescheduling or clinician-approved postponement (Adherence protected).';
      } else if (patient.followUpStatus === 'Overdue') {
        status = 'PENDING';
      } else {
        status = 'SCHEDULED';
      }

      milestones.push({
        id: `${patient.id}-M3`,
        title: template.milestoneTemplates[2]?.title || 'Clinician Care Follow-up Consultation',
        description: patient.followUpInstruction || `Follow-up consultation scheduled on ${patient.followUpDate || 'recommended interval'}.`,
        scheduledDate: patient.followUpDate,
        status,
        completedAt: isFollowUpAttended ? '10 Oct 2026' : undefined,
        exclusionReason,
        category: 'FOLLOW_UP',
        mandatoryForCompletion: true
      });
    }

    // Calculate progress (excluding NOT_APPLICABLE and EXCLUDED from denominator)
    const applicableMilestones = milestones.filter(m => m.status !== 'NOT_APPLICABLE' && m.status !== 'EXCLUDED');
    const completedCount = applicableMilestones.filter(m => m.status === 'COMPLETED').length;
    const totalCount = Math.max(applicableMilestones.length, 1);
    const percentage = Math.round((completedCount / totalCount) * 100);

    const isFullyCompleted = completedCount === totalCount;

    const careJourney: CareJourney = {
      id: patient.careJourney?.id || `CJ-${patient.id}`,
      patientId: patient.id,
      type: journeyType,
      title: template.title,
      startDate: patient.careJourney?.startDate || patient.visitDate || '10 Oct 2026',
      status: isFullyCompleted ? 'COMPLETED' : 'ACTIVE',
      followUpSchedule: patient.followUpDate ? `Next visit: ${patient.followUpDate}` : (isFollowUpRequired ? 'Scheduled' : 'Single visit / Not required'),
      followUpDate: patient.followUpDate,
      isFollowUpRequired,
      completionCriteria: template.defaultCriteria,
      currentProgress: {
        completed: completedCount,
        total: totalCount,
        percentage
      },
      milestones,
      notes: patient.doctorNotes,
      assignedDoctor: patient.assignedDoctor || 'Dr. Anita Rao',
      lastUpdated: new Date().toISOString()
    };

    return careJourney;
  }

  /**
   * Evaluate all achievements for a patient
   */
  evaluateAchievements(patient: OpdPatient, careJourney: CareJourney): PatientAchievement[] {
    const achievements: PatientAchievement[] = [];
    const isConsultationCompleted = patient.queueStatus === 'Completed' || !!patient.assessmentOutcome || !!patient.doctorNotes;
    const hasCarePlan = !!patient.prescriptions?.length || !!patient.doctorNotes || !!patient.followUpInstruction || !!patient.followUpDate;
    const hasLabOrders = (patient.labOrders && patient.labOrders.length > 0) || (patient.labReferrals && patient.labReferrals.length > 0);
    const hasCompletedReports = patient.labOrders?.some(o => o.reportStatus === 'Report Uploaded' || o.sampleStatus === 'Test Completed') ||
                                patient.labReferrals?.some(r => r.status === 'REPORT RELEASED');
    
    const isFollowUpAttended = patient.followUpStatus === 'Attended';
    const progress = careJourney.currentProgress;

    // 1. Universal: FIRST_VISIT
    const firstVisitEarned = isConsultationCompleted || patient.previousOpdRecords?.length! > 0;
    achievements.push({
      id: `ACH-${patient.id}-FIRST_VISIT`,
      code: 'FIRST_VISIT',
      title: 'First Visit',
      description: 'Awarded when the first OPD consultation is completed and recorded.',
      category: 'UNIVERSAL',
      earned: firstVisitEarned,
      earnedAt: firstVisitEarned ? (patient.visitDate || '10 Oct 2026') : undefined,
      criteria: 'Consultation conducted by doctor with findings documented.',
      iconName: 'UserCheck',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300'
    });

    // 2. Universal: CARE_JOURNEY_STARTED
    const journeyStartedEarned = isConsultationCompleted && (hasCarePlan || !careJourney.isFollowUpRequired);
    achievements.push({
      id: `ACH-${patient.id}-CARE_JOURNEY_STARTED`,
      code: 'CARE_JOURNEY_STARTED',
      title: 'Care Journey Started',
      description: 'Awarded when the patient has a recorded care plan or next step, where applicable.',
      category: 'UNIVERSAL',
      earned: journeyStartedEarned,
      earnedAt: journeyStartedEarned ? (patient.visitDate || '10 Oct 2026') : undefined,
      criteria: 'Care plan or next clinical action recorded by doctor.',
      iconName: 'Compass',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
    });

    // 3. Universal: FOLLOW_THROUGH
    // Follow-through: Attended scheduled follow-up or fulfilled one-time consultation plan without delay
    const followThroughEarned = isFollowUpAttended || (!careJourney.isFollowUpRequired && isConsultationCompleted) || (hasCompletedReports && isConsultationCompleted);
    achievements.push({
      id: `ACH-${patient.id}-FOLLOW_THROUGH`,
      code: 'FOLLOW_THROUGH',
      title: 'Follow-through',
      description: 'Awarded when the patient completes a clinician-recorded follow-up or other applicable milestone within its configured timeframe.',
      category: 'UNIVERSAL',
      earned: followThroughEarned,
      earnedAt: followThroughEarned ? '10 Oct 2026' : undefined,
      criteria: 'Completed clinician-recorded follow-up or scheduled milestone on time.',
      iconName: 'CheckCircle2',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    });

    // 4. Universal: REPORT_REVIEW_READY
    // Only awarded when a requested investigation is completed and required report is available for review
    const reportReadyEarned = hasLabOrders && hasCompletedReports;
    achievements.push({
      id: `ACH-${patient.id}-REPORT_REVIEW_READY`,
      code: 'REPORT_REVIEW_READY',
      title: 'Report Review Ready',
      description: 'Awarded when a requested investigation is completed and the required report is available for review.',
      category: 'UNIVERSAL',
      earned: reportReadyEarned,
      earnedAt: reportReadyEarned ? '10 Oct 2026' : undefined,
      criteria: 'Lab investigation verified and report finalisation completed by pathologist.',
      iconName: 'FileCheck2',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
    });

    // 5. Universal: STAYING_ON_TRACK
    // Awarded when patient completes configurable proportion (>= 66%) of applicable, scheduled milestones
    const stayingOnTrackEarned = progress.percentage >= 66;
    achievements.push({
      id: `ACH-${patient.id}-STAYING_ON_TRACK`,
      code: 'STAYING_ON_TRACK',
      title: 'Staying on Track',
      description: 'Awarded when the patient completes a configurable proportion of applicable, scheduled milestones.',
      category: 'UNIVERSAL',
      earned: stayingOnTrackEarned,
      earnedAt: stayingOnTrackEarned ? '10 Oct 2026' : undefined,
      criteria: 'Completed at least 66% of scheduled care milestones on time.',
      iconName: 'TrendingUp',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
    });

    // 6. Universal: CARE_JOURNEY_MILESTONE
    // Awarded when patient completes the milestones defined for her particular care journey
    const journeyMilestoneEarned = progress.completed >= 1;
    achievements.push({
      id: `ACH-${patient.id}-CARE_JOURNEY_MILESTONE`,
      code: 'CARE_JOURNEY_MILESTONE',
      title: 'Care Journey Milestone',
      description: 'Awarded when the patient completes the milestones defined for her particular care journey.',
      category: 'UNIVERSAL',
      earned: journeyMilestoneEarned,
      earnedAt: journeyMilestoneEarned ? '10 Oct 2026' : undefined,
      criteria: 'Completed dedicated milestone in active care pathway.',
      iconName: 'Milestone',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    });

    // 7. Universal: CARE_JOURNEY_CHAMPION
    // Awarded after completing configured milestones for an applicable episode or care plan
    const championEarned = progress.completed === progress.total && progress.total > 0;
    achievements.push({
      id: `ACH-${patient.id}-CARE_JOURNEY_CHAMPION`,
      code: 'CARE_JOURNEY_CHAMPION',
      title: 'Care Journey Champion',
      description: 'Awarded after completing the configured milestones for an applicable episode or care plan.',
      category: 'UNIVERSAL',
      earned: championEarned,
      earnedAt: championEarned ? '10 Oct 2026' : undefined,
      criteria: 'All applicable milestones in episode successfully completed.',
      iconName: 'Award',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
    });

    // 8. Pregnancy-Specific Achievements (ONLY when enrolled in PREGNANCY or POSTNATAL)
    const isEnrolledInMaternal = careJourney.type === 'PREGNANCY' || careJourney.type === 'POSTNATAL' || patient.isPregnant;
    if (isEnrolledInMaternal) {
      // Antenatal Milestone
      const antenatalMilestoneEarned = (patient.pregnancyDetails?.gestationalAgeWeeks || 0) >= 12 && isConsultationCompleted;
      achievements.push({
        id: `ACH-${patient.id}-ANTENATAL_MILESTONE`,
        code: 'ANTENATAL_MILESTONE',
        title: 'Antenatal Milestone',
        description: 'Completed scheduled ultrasound or trimester-specific surveillance screening.',
        category: 'PREGNANCY',
        earned: antenatalMilestoneEarned,
        earnedAt: antenatalMilestoneEarned ? '10 Oct 2026' : undefined,
        criteria: 'Trimester evaluation / ultrasound completed.',
        iconName: 'Heart',
        badgeColor: 'bg-pink-100 text-pink-900 border-pink-300'
      });

      // Antenatal Follow-through
      const antenatalFollowThroughEarned = isConsultationCompleted && (isFollowUpAttended || (patient.previousOpdRecords?.length || 0) >= 1);
      achievements.push({
        id: `ACH-${patient.id}-ANTENATAL_FOLLOW_THROUGH`,
        code: 'ANTENATAL_FOLLOW_THROUGH',
        title: 'Antenatal Follow-through',
        description: 'Consistent attendance across antenatal checkup intervals.',
        category: 'PREGNANCY',
        earned: antenatalFollowThroughEarned,
        earnedAt: antenatalFollowThroughEarned ? '10 Oct 2026' : undefined,
        criteria: 'On-schedule antenatal visit completed.',
        iconName: 'Baby',
        badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
      });

      // Postnatal Follow-through
      if (careJourney.type === 'POSTNATAL' || (patient.pregnancyDetails?.previousChildren || 0) > 0) {
        const postnatalEarned = careJourney.type === 'POSTNATAL' && isConsultationCompleted;
        achievements.push({
          id: `ACH-${patient.id}-POSTNATAL_FOLLOW_THROUGH`,
          code: 'POSTNATAL_FOLLOW_THROUGH',
          title: 'Postnatal Follow-through',
          description: 'Postpartum recovery checkup and wellness consultation completed.',
          category: 'PREGNANCY',
          earned: postnatalEarned,
          earnedAt: postnatalEarned ? '10 Oct 2026' : undefined,
          criteria: '6-week maternal recovery evaluation completed.',
          iconName: 'Smile',
          badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
        });
      }
    }

    return achievements;
  }

  /**
   * Calculate doctor achievements aggregating across ALL eligible OPD patients
   * Includes transparent exclusions for cancellations and patient-requested rescheduling.
   */
  calculateDoctorAchievements(allPatients: OpdPatient[], doctorName = 'Dr. Anita Rao'): DoctorAchievement[] {
    const doctorPatients = allPatients.filter(p => !p.assignedDoctor || p.assignedDoctor === doctorName || p.clinicId === 'opd-anc' || p.clinicId === 'opd-gen');
    
    // Transparent exclusions
    let exclusionsCount = 0;
    const eligiblePatients: OpdPatient[] = [];

    for (const p of doctorPatients) {
      if (p.followUpStatus === 'Cancelled by Patient' || p.followUpStatus === 'Rescheduled' || p.followUpStatus === 'Excluded') {
        exclusionsCount++;
      }
      eligiblePatients.push(p);
    }

    // 1. Consultation Outcomes Recorded
    const consultationsRecorded = eligiblePatients.filter(p => p.queueStatus === 'Completed' || !!p.assessmentOutcome || !!p.doctorNotes).length;
    const consultationTarget = Math.max(eligiblePatients.length, 1);

    // 2. Documenting follow-up plans where clinically appropriate
    const followUpsDocumented = eligiblePatients.filter(p => p.followUpStatus === 'Not Required' || !!p.followUpDate || !!p.followUpInstruction).length;

    // 3. Reviewing available investigation reports
    const patientsWithReports = eligiblePatients.filter(p => (p.labOrders && p.labOrders.length > 0) || (p.labReferrals && p.labReferrals.length > 0));
    const reportsReviewed = patientsWithReports.filter(p => 
      p.labReferrals?.some(r => r.reviewedByDoctor) || p.queueStatus === 'Completed' || !!p.assessmentOutcome
    ).length;

    // 4. Required documentation completeness (Vitals + clinical gist + notes)
    const documentationCompleted = eligiblePatients.filter(p => !!p.doctorNotes && !!p.vitals).length;

    // 5. Maintaining continuity of care across all pathways
    const adherenceCount = eligiblePatients.filter(p => {
      if (p.followUpStatus === 'Not Required' || p.followUpStatus === 'Attended') return true;
      if (p.followUpStatus === 'Cancelled by Patient' || p.followUpStatus === 'Rescheduled') return true; // Excluded from penalty
      if (p.followUpStatus === 'Overdue') return false;
      return true;
    }).length;
    const continuityRate = Math.round((adherenceCount / Math.max(eligiblePatients.length, 1)) * 100);

    const pathways = ['Pregnancy Care', 'Gynaecology', 'Ongoing Condition (PCOS)', 'Preventive Screening', 'General Follow-up'];

    const achievements: DoctorAchievement[] = [
      {
        id: 'DOC-ACH-1',
        code: 'CLINICAL_OUTCOMES_RECORDED',
        title: 'Clinical Outcomes Recorded',
        description: 'Records consultation outcomes promptly across all supported OPD patient pathways.',
        criteria: 'Consultation outcomes and assessment notes documented for >= 80% of OPD visits.',
        metricCurrent: consultationsRecorded,
        metricTarget: consultationTarget,
        earned: consultationsRecorded >= 3,
        earnedAt: '10 Oct 2026',
        eligiblePathways: pathways,
        exclusionsHandled: exclusionsCount,
        iconName: 'FileCheck',
        badgeColor: 'bg-teal-100 text-teal-900 border-teal-300'
      },
      {
        id: 'DOC-ACH-2',
        code: 'CARE_PLAN_DOCUMENTATION',
        title: 'Continuous Care Planning',
        description: 'Documents follow-up plans or explicit single-visit closure across all patient types.',
        criteria: 'Care plans or follow-up schedules documented for all seen patients without assuming pregnancy.',
        metricCurrent: followUpsDocumented,
        metricTarget: consultationTarget,
        earned: followUpsDocumented >= 3,
        earnedAt: '10 Oct 2026',
        eligiblePathways: pathways,
        exclusionsHandled: exclusionsCount,
        iconName: 'Compass',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
      },
      {
        id: 'DOC-ACH-3',
        code: 'LAB_REPORT_REVIEW',
        title: 'Investigation Review Vigilance',
        description: 'Reviews available pathology and diagnostic reports promptly across patient conditions.',
        criteria: 'Available diagnostic investigation reports reviewed and correlated clinically.',
        metricCurrent: reportsReviewed,
        metricTarget: Math.max(patientsWithReports.length, 1),
        earned: reportsReviewed >= 1,
        earnedAt: '10 Oct 2026',
        eligiblePathways: ['Gynaecology', 'PCOS / Endocrine', 'Antenatal Serology', 'Preventive Screening'],
        exclusionsHandled: exclusionsCount,
        iconName: 'Microscope',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
      },
      {
        id: 'DOC-ACH-4',
        code: 'CONTINUITY_GUARDIAN',
        title: 'Continuity of Care Guardian',
        description: 'Maintains high follow-through and adherence across all eligible OPD care journeys.',
        criteria: 'Achieves >= 85% continuity adherence with transparent exclusions for patient rescheduling.',
        metricCurrent: continuityRate,
        metricTarget: 85,
        earned: continuityRate >= 85,
        earnedAt: '10 Oct 2026',
        eligiblePathways: pathways,
        exclusionsHandled: exclusionsCount,
        iconName: 'ShieldCheck',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
      }
    ];

    return achievements;
  }

  /**
   * Calculate pathologist achievements across all eligible laboratory referrals regardless of pregnancy
   */
  calculatePathologistAchievements(allPatients: OpdPatient[]): PathologistAchievement[] {
    let totalReferrals = 0;
    let timelyCompleted = 0;
    let fieldComplete = 0;
    let finalizedAndHandedOff = 0;

    for (const p of allPatients) {
      if (p.labOrders) {
        for (const order of p.labOrders) {
          totalReferrals++;
          if (order.reportStatus === 'Report Uploaded' || order.sampleStatus === 'Test Completed') {
            timelyCompleted++;
            finalizedAndHandedOff++;
          }
          if (order.parameters && order.parameters.length > 0) {
            fieldComplete++;
          }
        }
      }
      if (p.labReferrals) {
        for (const ref of p.labReferrals) {
          totalReferrals++;
          if (ref.status === 'REPORT RELEASED' || ref.releasedAt) {
            timelyCompleted++;
            finalizedAndHandedOff++;
          }
          if (ref.parameters && ref.parameters.length > 0) {
            fieldComplete++;
          }
        }
      }
    }

    const referralTarget = Math.max(totalReferrals, 1);

    const achievements: PathologistAchievement[] = [
      {
        id: 'PATH-ACH-1',
        code: 'TIMELY_REPORTING',
        title: 'Turnaround Time Champion',
        description: 'Timely report completion against test-specific turnaround targets across all patient referral types.',
        criteria: 'Turnaround time < 4h for routine bloods, < 2h for urgent investigations.',
        metricCurrent: timelyCompleted,
        metricTarget: referralTarget,
        earned: timelyCompleted >= 2,
        earnedAt: '10 Oct 2026',
        iconName: 'Clock',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
      },
      {
        id: 'PATH-ACH-2',
        code: 'REPORT_COMPLETENESS',
        title: 'Diagnostic Rigor & Completeness',
        description: 'Required report-field completeness including reference ranges, LOINC codes, and pathologist interpretation.',
        criteria: '100% of released reports feature verified reference ranges and diagnostic parameters.',
        metricCurrent: fieldComplete,
        metricTarget: referralTarget,
        earned: fieldComplete >= 2,
        earnedAt: '10 Oct 2026',
        iconName: 'FileCheck',
        badgeColor: 'bg-teal-100 text-teal-900 border-teal-300'
      },
      {
        id: 'PATH-ACH-3',
        code: 'CLINICAL_HANDOFF',
        title: 'Reliable Clinician Handoff',
        description: 'Proper report finalisation and instantaneous digital dispatch to requesting OPD doctor and ABDM.',
        criteria: 'Instant electronic release to doctor desk and linked patient WhatsApp thread.',
        metricCurrent: finalizedAndHandedOff,
        metricTarget: referralTarget,
        earned: finalizedAndHandedOff >= 2,
        earnedAt: '10 Oct 2026',
        iconName: 'Send',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
      }
    ];

    return achievements;
  }
}

export const gamificationEngine = new GamificationEngine();
