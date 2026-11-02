import {
  Patient,
  PregnancyEpisode,
  NewbornRecord,
  ChildEpisode,
  CareGap,
  CareGapRule,
  CareGapRuleVersion,
  LaboratorySample,
  PatientCommunication,
  DocumentRecord,
  AuditLogItem,
  User,
  Facility,
  DashboardMetrics,
  CareGapStatus,
  PatientTimelineEvent
} from '../types';

import {
  SEED_PATIENTS,
  SEED_PREGNANCIES,
  SEED_NEWBORNS,
  SEED_CHILDREN,
  SEED_CARE_GAPS,
  SEED_LAB_SAMPLES,
  SEED_AUDIT_LOGS,
  DEMO_USERS,
  DEMO_FACILITY
} from './seedData';

import { INITIAL_RULES } from './rulesEngine';
import { INITIAL_TEMPLATES } from './messagingService';

export class ContinuumStore {
  patients: Patient[] = [...SEED_PATIENTS];
  pregnancies: PregnancyEpisode[] = [...SEED_PREGNANCIES];
  newborns: NewbornRecord[] = [...SEED_NEWBORNS];
  children: ChildEpisode[] = [...SEED_CHILDREN];
  careGaps: CareGap[] = [...SEED_CARE_GAPS];
  rules: CareGapRule[] = [...INITIAL_RULES];
  ruleVersions: CareGapRuleVersion[] = [];
  labSamples: LaboratorySample[] = [...SEED_LAB_SAMPLES];
  communications: PatientCommunication[] = [];
  documents: DocumentRecord[] = [
    {
      id: 'DOC-001',
      patientId: 'PAT-001',
      patientName: 'Sunita D.',
      title: 'First Trimester Ultrasound Dating Slip',
      documentType: 'Scan Report',
      uploadedAt: '2026-04-10 11:30',
      uploadedBy: 'Sister Savitha K.',
      extractedFields: [
        { key: 'ga', label: 'Gestational Age', value: '7 weeks 2 days', verified: true },
        { key: 'crl', label: 'Crown Rump Length (CRL)', value: '11.8 mm', verified: true },
        { key: 'edd', label: 'EDD (by Scan)', value: '01/12/2026', verified: true }
      ]
    },
    {
      id: 'DOC-002',
      patientId: 'PAT-003',
      patientName: 'Anjali P.',
      title: 'MCP Card Antenatal Record Page 2',
      documentType: 'MCP-Card',
      uploadedAt: '2026-03-02 09:45',
      uploadedBy: 'Pooja Naik',
      extractedFields: [
        { key: 'blood_group', label: 'Blood Group', value: 'O Negative', verified: true },
        { key: 'gravida', label: 'Gravida / Para', value: 'G2 P1 L1', verified: true },
        { key: 'rh_alert', label: 'Rh Isoimmunisation Warning', value: 'Flagged', verified: true }
      ]
    }
  ];
  auditLogs: AuditLogItem[] = [...SEED_AUDIT_LOGS];
  users: User[] = [...DEMO_USERS];
  currentUser: User = DEMO_USERS[0]; // Default: Pooja Naik (OPD Staff)
  currentFacility: Facility = DEMO_FACILITY;
  communicationTemplates = [...INITIAL_TEMPLATES];

  // Listeners for reactivity
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    this.notify();
  }

  // --- Care Gap Operations ---
  getCareGaps(filters?: {
    population?: string;
    status?: string;
    assignedToMe?: boolean;
    search?: string;
  }): CareGap[] {
    return this.careGaps.filter(gap => {
      if (filters?.population && filters.population !== 'all') {
        if (filters.population === 'laboratory') {
          if (gap.category !== 'laboratory') return false;
        } else if (gap.population !== filters.population) {
          return false;
        }
      }
      if (filters?.status && filters.status !== 'all') {
        if (filters.status === 'overdue' && gap.status !== 'OVERDUE') return false;
        if (filters.status === 'due_today' && !(gap.status === 'DUE' && gap.overdueDurationDisplay === 'Today')) return false;
        if (filters.status === 'due_soon' && !(gap.status === 'DUE' || gap.status === 'NOT_DUE')) return false;
      }
      if (filters?.assignedToMe) {
        if (gap.assignedTo !== this.currentUser.name) return false;
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const match = 
          gap.patientName.toLowerCase().includes(q) ||
          gap.patientAbha.toLowerCase().includes(q) ||
          gap.gapTitle.toLowerCase().includes(q) ||
          gap.ruleId.toLowerCase().includes(q) ||
          gap.plainReason.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }

  // Step 5-7: Log patient contact (changes status to CONTACTED, does NOT close gap)
  logContact(params: {
    careGapId: string;
    channel: 'whatsapp' | 'sms';
    templateId: string;
    language: string;
    messageBody: string;
    patientResponse?: PatientCommunication['patientResponse'];
    notes?: string;
  }): PatientCommunication {
    const gap = this.careGaps.find(g => g.id === params.careGapId);
    if (!gap) throw new Error('Care gap not found');

    const comm: PatientCommunication = {
      id: `COMM-${Date.now()}`,
      careGapId: gap.id,
      patientId: gap.patientId,
      patientName: gap.patientName,
      mobile: gap.patientMobile,
      channel: params.channel,
      templateId: params.templateId,
      language: params.language,
      messageBody: params.messageBody,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'DELIVERED',
      staffUserId: this.currentUser.id,
      staffUserName: this.currentUser.name,
      patientResponse: params.patientResponse || 'CONTACTED',
      responseNotes: params.notes
    };

    this.communications.unshift(comm);

    // Update gap metadata
    const oldStatus = gap.status;
    gap.lastContactedAt = comm.sentAt;
    gap.lastContactChannel = params.channel;
    gap.contactAttemptsCount += 1;
    if (gap.status === 'OVERDUE' || gap.status === 'DUE') {
      gap.status = 'CONTACTED';
    }
    gap.updatedAt = new Date().toISOString();

    // Audit log
    this.addAuditLog({
      action: 'PATIENT_CONTACTED',
      entityType: 'CareGap',
      entityId: gap.id,
      patientId: gap.patientId,
      patientName: gap.patientName,
      oldValue: `status: ${oldStatus}`,
      newValue: `status: ${gap.status} via ${params.channel.toUpperCase()}`,
      reason: `Dispatched ${params.language} template: "${params.messageBody.slice(0, 60)}..."`,
      source: 'Worklist Contact Workflow'
    });

    this.notify();
    return comm;
  }

  // Step 8-10: Close care gap on recorded action/result/visit!
  closeCareGap(params: {
    careGapId: string;
    closureReason: string;
    actionType: string;
    resultData?: Record<string, string>;
    documentId?: string;
  }): CareGap {
    const gap = this.careGaps.find(g => g.id === params.careGapId);
    if (!gap) throw new Error('Care gap not found');

    const oldStatus = gap.status;
    gap.status = 'CLOSED';
    gap.closedAt = new Date().toISOString();
    gap.closedBy = this.currentUser.name;
    gap.closureReason = params.closureReason;
    gap.closureDocumentId = params.documentId;
    gap.overdueDurationDisplay = 'Closed';
    gap.overdueDurationWeeks = 0;
    gap.updatedAt = new Date().toISOString();

    // Decrement patient's active care gaps count
    const pat = this.patients.find(p => p.id === gap.patientId);
    if (pat && pat.activeCareGapsCount > 0) {
      pat.activeCareGapsCount -= 1;
      pat.lastVisitDate = new Date().toISOString().slice(0, 10);
    }

    // Audit log
    this.addAuditLog({
      action: 'CARE_GAP_CLOSED',
      entityType: 'CareGap',
      entityId: gap.id,
      patientId: gap.patientId,
      patientName: gap.patientName,
      oldValue: `status: ${oldStatus}`,
      newValue: 'status: CLOSED',
      reason: `Clinical loop closed on recorded action: ${params.closureReason}`,
      source: 'Action Closure Engine'
    });

    this.notify();
    return gap;
  }

  // Waive care gap with authorised user justification
  waiveCareGap(careGapId: string, reason: string): CareGap {
    const gap = this.careGaps.find(g => g.id === careGapId);
    if (!gap) throw new Error('Care gap not found');

    const oldStatus = gap.status;
    gap.status = 'WAIVED';
    gap.closedAt = new Date().toISOString();
    gap.closedBy = this.currentUser.name;
    gap.closureReason = `WAIVED: ${reason}`;
    gap.overdueDurationDisplay = 'Waived';
    gap.updatedAt = new Date().toISOString();

    this.addAuditLog({
      action: 'CARE_GAP_WAIVED',
      entityType: 'CareGap',
      entityId: gap.id,
      patientId: gap.patientId,
      patientName: gap.patientName,
      oldValue: `status: ${oldStatus}`,
      newValue: 'status: WAIVED',
      reason,
      source: 'Authorised Waiver'
    });

    this.notify();
    return gap;
  }

  // --- Laboratory Result Loop Operations ---
  recordLabSample(sampleData: Omit<LaboratorySample, 'id' | 'status' | 'closureStatus' | 'facilityId'>): LaboratorySample {
    const newSample: LaboratorySample = {
      ...sampleData,
      id: `LAB-${Date.now()}`,
      status: 'SENT',
      closureStatus: 'PENDING_REPORT',
      facilityId: this.currentFacility.id
    };
    this.labSamples.unshift(newSample);

    this.addAuditLog({
      action: 'LAB_SAMPLE_SENT',
      entityType: 'LaboratorySample',
      entityId: newSample.id,
      patientId: newSample.patientId,
      patientName: newSample.patientName,
      oldValue: 'N/A',
      newValue: `Sample ${newSample.sampleId} dispatched: ${newSample.testName}`,
      reason: 'Routine or targeted investigation sample collection',
      source: 'OPD Specimen Desk'
    });

    this.notify();
    return newSample;
  }

  recordLabReport(params: {
    sampleId: string;
    reportDate: string;
    readerName: string;
    isAbnormal: boolean;
    resultSummary: string;
    actionRequired: boolean;
    actionRequiredDetails?: string;
  }): LaboratorySample {
    const sample = this.labSamples.find(s => s.id === params.sampleId);
    if (!sample) throw new Error('Sample not found');

    sample.status = 'REVIEWED';
    sample.reportDate = params.reportDate;
    sample.readerName = params.readerName;
    sample.isAbnormal = params.isAbnormal;
    sample.resultSummary = params.resultSummary;
    sample.actionRequired = params.actionRequired;
    sample.actionRequiredDetails = params.actionRequiredDetails;
    sample.closureStatus = params.actionRequired ? 'PENDING_ACTION' : 'LOOP_CLOSED';
    if (!params.actionRequired) {
      sample.closedAt = new Date().toISOString();
      sample.status = 'CLOSED';
    }

    this.addAuditLog({
      action: 'LAB_REPORT_RECEIVED',
      entityType: 'LaboratorySample',
      entityId: sample.id,
      patientId: sample.patientId,
      patientName: sample.patientName,
      oldValue: 'status: SENT',
      newValue: `status: REVIEWED (${params.isAbnormal ? 'ABNORMAL/ACTION REQUIRED' : 'NORMAL'})`,
      reason: params.resultSummary,
      source: 'Laboratory Portal'
    });

    this.notify();
    return sample;
  }

  recordLabAction(params: {
    sampleId: string;
    actionDetails: string;
    recordedBy: string;
  }): LaboratorySample {
    const sample = this.labSamples.find(s => s.id === params.sampleId);
    if (!sample) throw new Error('Sample not found');

    sample.actionRecorded = true;
    sample.actionRecordedDetails = params.actionDetails;
    sample.actionRecordedBy = params.recordedBy;
    sample.actionRecordedAt = new Date().toISOString();
    sample.closureStatus = 'LOOP_CLOSED';
    sample.status = 'CLOSED';
    sample.closedAt = new Date().toISOString();

    this.addAuditLog({
      action: 'LAB_RESULT_ACTION_RECORDED',
      entityType: 'LaboratorySample',
      entityId: sample.id,
      patientId: sample.patientId,
      patientName: sample.patientName,
      oldValue: 'closureStatus: PENDING_ACTION',
      newValue: 'closureStatus: LOOP_CLOSED',
      reason: params.actionDetails,
      source: 'Clinical Lead Review Desk'
    });

    this.notify();
    return sample;
  }

  // --- Rule Management (Section 15) ---
  updateRule(ruleId: string, updatedFields: Partial<CareGapRule>, reasonForChange: string): CareGapRule {
    const index = this.rules.findIndex(r => r.rule_id === ruleId);
    if (index === -1) throw new Error('Rule not found');

    const previousRule = { ...this.rules[index] };
    const nextVersion = previousRule.version + 1;

    // Save version history for auditability
    const versionRecord: CareGapRuleVersion = {
      id: `VER-${Date.now()}`,
      rule_id: ruleId,
      version: previousRule.version,
      modifiedAt: new Date().toISOString(),
      modifiedBy: this.currentUser.name || 'System User',
      changesSummary: reasonForChange,
      previousRuleSnapshot: previousRule
    };
    this.ruleVersions.unshift(versionRecord);

    const updatedRule: CareGapRule = {
      ...previousRule,
      ...updatedFields,
      rule_id: ruleId, // immutable id
      version: nextVersion,
      createdBy: previousRule.createdBy,
      approvedBy: this.currentUser.role === 'CLINICIAN_LEAD' ? (this.currentUser.name || 'Lead') : previousRule.approvedBy,
      effectiveDate: new Date().toISOString().slice(0, 10)
    };

    this.rules[index] = updatedRule;

    this.addAuditLog({
      action: 'RULE_UPDATED',
      entityType: 'CareGapRule',
      entityId: ruleId,
      oldValue: `v${previousRule.version}: ${previousRule.name}`,
      newValue: `v${updatedRule.version}: ${updatedRule.name}`,
      reason: reasonForChange,
      source: 'Clinical Rule Management'
    });

    this.notify();
    return updatedRule;
  }

  createRule(newRuleData: any): CareGapRule {
    const rule: CareGapRule = {
      ...newRuleData,
      version: 1,
      effectiveDate: new Date().toISOString().slice(0, 10),
      createdBy: this.currentUser.name || 'System User',
      approvedBy: this.currentUser.role === 'CLINICIAN_LEAD' ? (this.currentUser.name || 'Lead') : undefined
    };
    this.rules.unshift(rule);

    this.addAuditLog({
      action: 'RULE_CREATED',
      entityType: 'CareGapRule',
      entityId: rule.rule_id,
      oldValue: 'N/A',
      newValue: `Rule ${rule.rule_id} (${rule.name}) initialized`,
      reason: 'Clinician-defined operational guideline addition',
      source: 'Rule Studio'
    });

    this.notify();
    return rule;
  }

  // --- Patients, Pregnancies & Newborn Enrolment ---
  enrolPatient(patientData: any): Patient {
    const id = `PAT-${String(this.patients.length + 1).padStart(3, '0')}`;
    const newPat: Patient = {
      ...patientData,
      id,
      registeredAt: new Date().toISOString().slice(0, 10),
      activeCareGapsCount: 0,
      status: 'ACTIVE'
    };
    this.patients.unshift(newPat);

    this.addAuditLog({
      action: 'PATIENT_ENROLLED',
      entityType: 'Patient',
      entityId: newPat.id,
      patientId: newPat.id,
      patientName: newPat.name,
      oldValue: 'N/A',
      newValue: `Enrolled with ABHA ${newPat.abhaNumber}`,
      reason: 'New patient registry admission',
      source: 'OPD Reception Registration'
    });

    this.notify();
    return newPat;
  }

  createPregnancyEpisode(params: {
    motherId: string;
    lmpDate: string;
    datingScanDate?: string;
    edd: string;
    gestationalAgeWeeks: number;
    gravida: number;
    para: number;
    flags: string[];
    notes?: string;
  }): PregnancyEpisode {
    const mother = this.patients.find(p => p.id === params.motherId);
    if (!mother) throw new Error('Mother not found');

    const pregId = `PREG-${String(this.pregnancies.length + 1).padStart(3, '0')}`;
    const episode: PregnancyEpisode = {
      id: pregId,
      motherId: mother.id,
      motherName: mother.name,
      motherAbha: mother.abhaNumber,
      lmpDate: params.lmpDate,
      datingScanDate: params.datingScanDate,
      edd: params.edd,
      currentGestationalAgeWeeks: params.gestationalAgeWeeks,
      status: 'ACTIVE',
      gravida: params.gravida,
      para: params.para,
      flags: params.flags,
      facilityId: this.currentFacility.id,
      registrationDate: new Date().toISOString().slice(0, 10),
      notes: params.notes
    };

    this.pregnancies.unshift(episode);
    mother.currentEpisodeType = 'pregnancy';
    mother.currentEpisodeId = episode.id;

    // Trigger rules engine calculation to seed care gaps for this pregnancy
    this.calculateCareGapsForPregnancy(episode, mother);

    this.addAuditLog({
      action: 'PREGNANCY_ENROLLED',
      entityType: 'PregnancyEpisode',
      entityId: episode.id,
      patientId: mother.id,
      patientName: mother.name,
      oldValue: 'N/A',
      newValue: `Pregnancy episode started at ${params.gestationalAgeWeeks} weeks gestation`,
      reason: 'Enrolment of antenatal episode',
      source: 'MCH Registry Desk'
    });

    this.notify();
    return episode;
  }

  private calculateCareGapsForPregnancy(preg: PregnancyEpisode, mother: Patient) {
    const weeks = preg.currentGestationalAgeWeeks;
    for (const rule of this.rules.filter(r => r.active && (r.category === 'antenatal' || r.category === 'foetal'))) {
      const start = rule.trigger.start_weeks || 0;
      const end = rule.trigger.end_weeks || 0;

      // Filter flags
      if (rule.trigger.condition === 'rh_negative' && mother.rhFactor !== 'Negative') continue;
      if (rule.trigger.condition === 'flagged_small_or_high_risk' && !preg.flags.some((f: string) => f.toLowerCase().includes('small'))) continue;

      if (weeks >= start && weeks <= end) {
        // Due today / due now
        this.careGaps.unshift({
          id: `GAP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          patientId: mother.id,
          patientName: mother.name,
          patientMobile: mother.mobile,
          patientAbha: mother.abhaNumber || mother.abhaId || '',
          population: rule.population,
          episodeId: preg.id,
          episodeLabel: `Pregnancy ${weeks} wks`,
          gestationOrAgeDisplay: `${weeks} wks`,
          ruleId: rule.rule_id,
          gapTitle: `${rule.name} due`,
          category: rule.category,
          expectedWindowDisplay: `${start}–${end} weeks`,
          currentGestationalAgeWeeks: weeks,
          overdueDurationDisplay: 'Due now',
          overdueDurationWeeks: 0,
          status: 'DUE',
          plainReason: `${rule.name} due within current ${start}–${end} week window.`,
          requiredAction: rule.required_action,
          assignedTo: 'Sister Savitha K.',
          contactAttemptsCount: 0,
          facilityId: this.currentFacility.id,
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString()
        });
        mother.activeCareGapsCount += 1;
      } else if (weeks > end) {
        // Overdue!
        const diff = weeks - end;
        this.careGaps.unshift({
          id: `GAP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          patientId: mother.id,
          patientName: mother.name,
          patientMobile: mother.mobile,
          patientAbha: mother.abhaNumber || mother.abhaId || '',
          population: rule.population,
          episodeId: preg.id,
          episodeLabel: `Pregnancy ${weeks} wks`,
          gestationOrAgeDisplay: `${weeks} wks`,
          ruleId: rule.rule_id,
          gapTitle: rule.display_reason || rule.name,
          category: rule.category,
          expectedWindowDisplay: `${start}–${end} weeks`,
          currentGestationalAgeWeeks: weeks,
          overdueDurationDisplay: `+${diff} wks`,
          overdueDurationWeeks: diff,
          status: 'OVERDUE',
          plainReason: `${rule.display_reason}. Expected between ${start}–${end} weeks. Patient is currently ${weeks} weeks. Overdue by ${diff} weeks.`,
          requiredAction: rule.required_action,
          assignedTo: 'Sister Savitha K.',
          contactAttemptsCount: 0,
          facilityId: this.currentFacility.id,
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString()
        });
        mother.activeCareGapsCount += 1;
      }
    }
  }

  // --- Patient Timeline Generator ---
  getPatientTimeline(patientId: string): PatientTimelineEvent[] {
    const events: PatientTimelineEvent[] = [];
    const pat = this.patients.find(p => p.id === patientId);
    if (!pat) return [];

    events.push({
      id: `EV-ENROL-${pat.id}`,
      patientId: pat.id,
      timestamp: `${pat.registeredAt} 09:30`,
      displayDate: pat.registeredAt,
      title: 'Patient & Pregnancy Enrolled',
      description: `Registered at ${this.currentFacility.name}. ABDM ABHA linked: ${pat.abhaNumber}.`,
      source: 'OPD Registration Desk',
      user: 'Pooja Naik (OPD Staff)',
      eventType: 'ENROLMENT'
    });

    // Associated gaps
    const gaps = this.careGaps.filter(g => g.patientId === patientId);
    gaps.forEach(g => {
      events.push({
        id: `EV-GAP-${g.id}`,
        patientId: pat.id,
        timestamp: `${g.createdAt} 10:00`,
        displayDate: g.createdAt,
        title: `Care Gap Identified: ${g.gapTitle}`,
        description: g.plainReason,
        source: 'Rules Engine (Continuum Core)',
        user: 'Automated Evaluation',
        eventType: g.status === 'OVERDUE' ? 'MILESTONE_OVERDUE' : 'MILESTONE_DUE',
        relatedRuleId: g.ruleId
      });

      if (g.lastContactedAt) {
        events.push({
          id: `EV-CNT-${g.id}`,
          patientId: pat.id,
          timestamp: g.lastContactedAt,
          displayDate: g.lastContactedAt.slice(0, 10),
          title: `Patient Contacted via ${(g.lastContactChannel || 'whatsapp').toUpperCase()}`,
          description: `Dispatched language notification to ${pat.mobile}.`,
          source: 'Worklist Messenger',
          user: 'Sister Savitha K.',
          eventType: 'CONTACT'
        });
      }

      if (g.closedAt) {
        events.push({
          id: `EV-CLS-${g.id}`,
          patientId: pat.id,
          timestamp: g.closedAt,
          displayDate: g.closedAt.slice(0, 10),
          title: `Care Gap Closed: ${g.gapTitle}`,
          description: `Closure Reason: ${g.closureReason || 'Action recorded'}.`,
          source: 'OPD Clinical Action',
          user: g.closedBy || 'Dr. Anita Rao',
          eventType: 'GAP_CLOSED'
        });
      }
    });

    // Lab samples
    const labs = this.labSamples.filter(l => l.patientId === patientId);
    labs.forEach(l => {
      events.push({
        id: `EV-LAB-${l.id}`,
        patientId: pat.id,
        timestamp: `${l.collectionDate} 10:30`,
        displayDate: l.collectionDate,
        title: `Laboratory Sample Collected: ${l.testName}`,
        description: `Sample ID ${l.sampleId} dispatched to ${l.sendingDepartment}. Status: ${l.status}.`,
        source: 'Specimen Collection Unit',
        user: 'Ramesh Patil',
        eventType: 'LAB_SAMPLE'
      });
      if (l.reportDate) {
        events.push({
          id: `EV-LAB-REP-${l.id}`,
          patientId: pat.id,
          timestamp: `${l.reportDate} 15:45`,
          displayDate: l.reportDate,
          title: `Report Returned: ${l.resultSummary || l.testName}`,
          description: l.actionRequired ? `ACTION REQUIRED: ${l.actionRequiredDetails}` : 'Normal reference report.',
          source: 'Pathology Diagnostics',
          user: l.readerName || 'Ramesh Patil',
          eventType: 'RESULT_RECORDED'
        });
      }
    });

    // Sort chronologically
    return events.sort((a, b) => new Date(a.timestamp || a.date || '').getTime() - new Date(b.timestamp || b.date || '').getTime());
  }

  // --- Dynamic Dashboard Metrics (Section 4 & 31) ---
  getDashboardMetrics(): DashboardMetrics {
    const overdue = this.careGaps.filter(g => g.status === 'OVERDUE').length;
    const dueToday = this.careGaps.filter(g => g.status === 'DUE' && g.overdueDurationDisplay === 'Today').length;
    const dueSoon = this.careGaps.filter(g => g.status === 'DUE' || g.status === 'NOT_DUE').length;
    
    // Result follow-ups
    const awaitingAction = this.labSamples.filter(s => s.closureStatus === 'PENDING_ACTION').length;
    const unclosedLoops = this.labSamples.filter(s => s.closureStatus !== 'LOOP_CLOSED').length;
    const samplesSent = this.labSamples.length;
    const reportsReceived = this.labSamples.filter(s => s.status === 'RECEIVED' || s.status === 'REVIEWED' || s.status === 'CLOSED').length;
    const reportsWithAction = this.labSamples.filter(s => s.actionRecorded || s.status === 'CLOSED').length;
    const unresolvedAbnormal = this.labSamples.filter(s => s.isAbnormal && !s.actionRecorded).length;

    const closed = this.careGaps.filter(g => g.status === 'CLOSED');
    const closedToday = closed.filter(g => g.closedAt?.slice(0, 10) === '2026-10-01' || g.closedAt?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
    const closedWithinTwoWeeks = closed.length;
    const totalGapsRequiringAction = overdue + closed.length;
    const closurePercentage = totalGapsRequiringAction > 0 ? Math.round((closed.length / totalGapsRequiringAction) * 100) : 74;

    return {
      activePatients: 428,
      overdueGaps: overdue,
      dueToday,
      dueSoon,
      highPriorityResultFollowups: awaitingAction,
      unclosedLabLoops: unclosedLoops,
      closedThisWeek: closed.length,
      closedToday,
      closedWithinTwoWeeks,
      closurePercentage,
      // 4 Core Prototype KPIs
      careGapClosureRate: closurePercentage, // % overdue milestones closed within two weeks
      timeToCompileWorklistMinutes: {
        currentManualMinutes: 180, // 3 hours manually across registers
        continuumAutomatedMinutes: 2 // 2 minutes with Continuum!
      },
      resultLoopCompletionRate: samplesSent > 0 ? Math.round((reportsWithAction / samplesSent) * 100) : 82,
      recordCompletenessRate: 94, // 94% of women with complete ABHA at delivery
      samplesSent,
      reportsReceived,
      reportsAwaitingAction: awaitingAction,
      reportsWithActionRecorded: reportsWithAction,
      unresolvedAbnormalReports: unresolvedAbnormal
    };
  }

  // Audit logging helper
  addAuditLog(entry: Omit<AuditLogItem, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole' | 'ipAddress'>) {
    const log: AuditLogItem = {
      ...entry,
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userRole: this.currentUser.role,
      ipAddress: '10.24.110.42'
    };
    this.auditLogs.unshift(log);
  }
}

export const store = new ContinuumStore();
