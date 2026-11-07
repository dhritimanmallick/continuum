import { 
  LabourDeliveryTracker, 
  LabourStageCode, 
  LabourStageUpdate, 
  ConsentedFamilyContact 
} from '../types';

export const LABOUR_STAGES_INFO: {
  code: LabourStageCode;
  stageNumber: number;
  title: string;
  defaultDescription: string;
  percent: number;
}[] = [
  {
    code: 'STAGE_1_ADMISSION',
    stageNumber: 1,
    title: 'Admitted to Hospital & Maternity Ward',
    defaultDescription: 'Patient admitted to maternity ward. Baseline maternal vitals, fetal heart rate check, and initial obstetric assessment completed.',
    percent: 15
  },
  {
    code: 'STAGE_2_LABOUR_INITIATED',
    stageNumber: 2,
    title: 'Labour Monitoring Initiated',
    defaultDescription: 'Uterine contractions are being actively monitored. Cardiotocography (CTG) continuous fetal monitoring established. Mother is comfortable.',
    percent: 30
  },
  {
    code: 'STAGE_3_LABOUR_ROOM',
    stageNumber: 3,
    title: 'Shifted to Labour Room / OT',
    defaultDescription: 'Cervical dilation is progressing well. Mother safely shifted into the sterile Labour & Delivery Room under direct consultant supervision.',
    percent: 50
  },
  {
    code: 'STAGE_4_DELIVERY_UNDERWAY',
    stageNumber: 4,
    title: 'Delivery Process Underway',
    defaultDescription: 'Active second stage of labour. Obstetrician, duty paediatrician, and senior nursing team scrubbed in for birth.',
    percent: 75
  },
  {
    code: 'STAGE_5_BABY_DELIVERED',
    stageNumber: 5,
    title: 'Baby Delivered!',
    defaultDescription: 'Congratulations! Baby has safely arrived. Both mother and baby are stable and resting under clinical observation.',
    percent: 90
  },
  {
    code: 'STAGE_6_RECOVERY_WARD',
    stageNumber: 6,
    title: 'Shifted to Postnatal Recovery Ward',
    defaultDescription: 'Mother and newborn transferred to the comfortable postpartum recovery ward. Early skin-to-skin contact and breastfeeding initiated.',
    percent: 95
  },
  {
    code: 'STAGE_7_DISCHARGE_READY',
    stageNumber: 7,
    title: 'Discharge Ready & Homebound',
    defaultDescription: 'Paediatric discharge check passed, newborn vaccination administered, discharge summary issued, and post-delivery homecare instructions given.',
    percent: 100
  }
];

class LabourDeliveryService {
  private trackers: Record<string, LabourDeliveryTracker> = {
    'PAT-104': {
      id: 'ld-pat-104',
      patientId: 'PAT-104',
      patientName: 'Sunita Das',
      admissionDate: '2026-10-21 06:30 AM',
      wardBed: 'Maternity Ward - Bed 14',
      attendingDoctor: 'Dr. Anita Rao, MD (OB-GYN)',
      currentStage: 'STAGE_3_LABOUR_ROOM',
      currentStageProgressPercent: 50,
      isDischarged: false,
      consentedContacts: [
        {
          id: 'con-1',
          name: 'Rajesh Das (Husband)',
          relationship: 'Spouse',
          mobile: '+91 98451 12340',
          canReceiveWhatsApp: true,
          canReceiveSms: true,
          allowedMilestones: [
            'STAGE_1_ADMISSION',
            'STAGE_2_LABOUR_INITIATED',
            'STAGE_3_LABOUR_ROOM',
            'STAGE_4_DELIVERY_UNDERWAY',
            'STAGE_5_BABY_DELIVERED',
            'STAGE_6_RECOVERY_WARD',
            'STAGE_7_DISCHARGE_READY'
          ],
          isActive: true
        },
        {
          id: 'con-2',
          name: 'Meena Sharma (Mother)',
          relationship: 'Mother',
          mobile: '+91 97410 44521',
          canReceiveWhatsApp: true,
          canReceiveSms: false,
          allowedMilestones: [
            'STAGE_1_ADMISSION',
            'STAGE_3_LABOUR_ROOM',
            'STAGE_5_BABY_DELIVERED',
            'STAGE_6_RECOVERY_WARD'
          ],
          isActive: true
        },
        {
          id: 'con-3',
          name: 'Kamala Das (Mother-in-Law)',
          relationship: 'Mother-in-Law',
          mobile: '+91 94482 99812',
          canReceiveWhatsApp: true,
          canReceiveSms: true,
          allowedMilestones: [
            'STAGE_1_ADMISSION',
            'STAGE_5_BABY_DELIVERED',
            'STAGE_6_RECOVERY_WARD'
          ],
          isActive: true
        }
      ],
      history: [
        {
          id: 'upd-1',
          stage: 'STAGE_1_ADMISSION',
          stageTitle: 'Patient Admitted to Maternity Ward',
          timestamp: '2026-10-21 06:45 AM',
          doctorOrStaffName: 'Sister Rekha (Maternity Incharge)',
          publicMessage: 'Sunita Das has been safely admitted to District Hospital Maternity Ward - Bed 14. Baseline maternal vitals: BP 118/76, pulse 78 bpm. CTG is reactive.',
          privateClinicalNote: 'Cervical dilation 2 cm, 50% effaced, vertex presentation. Clear amniotic fluid on sterile speculum.',
          recipientsNotified: [
            { name: 'Rajesh Das', channel: 'WHATSAPP', status: 'READ', deliveredAt: '06:46 AM' },
            { name: 'Meena Sharma', channel: 'WHATSAPP', status: 'READ', deliveredAt: '06:47 AM' },
            { name: 'Kamala Das', channel: 'SMS', status: 'DELIVERED', deliveredAt: '06:46 AM' }
          ]
        },
        {
          id: 'upd-2',
          stage: 'STAGE_2_LABOUR_INITIATED',
          stageTitle: 'Labour Monitoring Initiated',
          timestamp: '2026-10-21 08:30 AM',
          doctorOrStaffName: 'Dr. Anita Rao',
          publicMessage: 'Regular uterine contractions established (3 per 10 mins). Mother is resting comfortably with warm hydrotherapy and breathing support.',
          privateClinicalNote: 'Fetal heart sound: 142 bpm regular, no late decelerations. Contractions 35s duration.',
          recipientsNotified: [
            { name: 'Rajesh Das', channel: 'WHATSAPP', status: 'READ', deliveredAt: '08:31 AM' }
          ]
        },
        {
          id: 'upd-3',
          stage: 'STAGE_3_LABOUR_ROOM',
          stageTitle: 'Patient Shifted to Labour Room',
          timestamp: '2026-10-21 10:15 AM',
          doctorOrStaffName: 'Dr. Anita Rao & Sister Rekha',
          publicMessage: 'Sunita has been shifted into the sterile Labour & Delivery Room. Progress is smooth. Family waiting lounge is outside Room 4.',
          privateClinicalNote: 'Cervix 6 cm dilated, well effaced. Station 0. Membranes ruptured spontaneously, clear liquor.',
          recipientsNotified: [
            { name: 'Rajesh Das', channel: 'WHATSAPP', status: 'DELIVERED', deliveredAt: '10:16 AM' },
            { name: 'Meena Sharma', channel: 'WHATSAPP', status: 'DELIVERED', deliveredAt: '10:16 AM' }
          ]
        }
      ]
    }
  };

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  getTracker(patientId: string): LabourDeliveryTracker | null {
    if (!this.trackers[patientId]) {
      // Create empty default tracker for patient
      this.trackers[patientId] = {
        id: `ld-${patientId}`,
        patientId,
        patientName: 'Patient Record',
        admissionDate: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        wardBed: 'Maternity Ward - Room 4',
        attendingDoctor: 'Dr. Anita Rao, MD (OB-GYN)',
        currentStage: 'STAGE_1_ADMISSION',
        currentStageProgressPercent: 15,
        isDischarged: false,
        consentedContacts: [
          {
            id: `con-${Date.now()}-1`,
            name: 'Primary Family Contact',
            relationship: 'Spouse / Family',
            mobile: '+91 98451 12340',
            canReceiveWhatsApp: true,
            canReceiveSms: true,
            allowedMilestones: [
              'STAGE_1_ADMISSION',
              'STAGE_2_LABOUR_INITIATED',
              'STAGE_3_LABOUR_ROOM',
              'STAGE_4_DELIVERY_UNDERWAY',
              'STAGE_5_BABY_DELIVERED',
              'STAGE_6_RECOVERY_WARD',
              'STAGE_7_DISCHARGE_READY'
            ],
            isActive: true
          }
        ],
        history: [
          {
            id: `upd-${Date.now()}-init`,
            stage: 'STAGE_1_ADMISSION',
            stageTitle: 'Patient Admitted to Hospital',
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            doctorOrStaffName: 'Admissions Desk',
            publicMessage: 'Patient admitted for maternity care. Vitals and preliminary checks underway.',
            recipientsNotified: [
              { name: 'Family Contact', channel: 'WHATSAPP', status: 'DELIVERED', deliveredAt: 'Just now' }
            ]
          }
        ]
      };
    }
    return this.trackers[patientId];
  }

  updateStage(params: {
    patientId: string;
    stage: LabourStageCode;
    doctorOrStaffName: string;
    customMessage?: string;
    privateClinicalNote?: string;
    babyDetails?: {
      gender: 'Boy' | 'Girl' | 'Twins' | string;
      birthWeightKg: number;
      deliveryType: 'Normal Vaginal' | 'Lower Segment C-Section (LSCS)' | 'Assisted Vacuum';
      timeOfBirth: string;
      apgar1Min?: number;
      apgar5Min?: number;
      motherStatus: string;
    };
  }): LabourStageUpdate {
    const tracker = this.getTracker(params.patientId)!;
    const stageInfo = LABOUR_STAGES_INFO.find(s => s.code === params.stage) || LABOUR_STAGES_INFO[0];

    tracker.currentStage = params.stage;
    tracker.currentStageProgressPercent = stageInfo.percent;
    if (params.stage === 'STAGE_7_DISCHARGE_READY') {
      tracker.isDischarged = true;
    }

    const publicMsg = params.customMessage || stageInfo.defaultDescription;
    const eligibleContacts = tracker.consentedContacts.filter(c => 
      c.isActive && c.allowedMilestones.includes(params.stage)
    );

    const notifiedRecipients = eligibleContacts.map(c => ({
      name: c.name,
      channel: (c.canReceiveWhatsApp ? 'WHATSAPP' : 'SMS') as 'WHATSAPP' | 'SMS',
      status: 'DELIVERED' as const,
      deliveredAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }));

    const newUpdate: LabourStageUpdate = {
      id: `upd-${Date.now()}`,
      stage: params.stage,
      stageTitle: stageInfo.title,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      doctorOrStaffName: params.doctorOrStaffName,
      publicMessage: publicMsg,
      privateClinicalNote: params.privateClinicalNote,
      babyDetails: params.babyDetails,
      recipientsNotified: notifiedRecipients
    };

    tracker.history.unshift(newUpdate);
    this.notify();
    return newUpdate;
  }

  addConsentedContact(patientId: string, contact: Omit<ConsentedFamilyContact, 'id'>): ConsentedFamilyContact {
    const tracker = this.getTracker(patientId)!;
    const newContact: ConsentedFamilyContact = {
      ...contact,
      id: `con-${Date.now()}`
    };
    tracker.consentedContacts.push(newContact);
    this.notify();
    return newContact;
  }

  updateConsentedContact(patientId: string, contactId: string, updates: Partial<ConsentedFamilyContact>): boolean {
    const tracker = this.getTracker(patientId)!;
    const idx = tracker.consentedContacts.findIndex(c => c.id === contactId);
    if (idx === -1) return false;
    tracker.consentedContacts[idx] = { ...tracker.consentedContacts[idx], ...updates };
    this.notify();
    return true;
  }

  removeConsentedContact(patientId: string, contactId: string): boolean {
    const tracker = this.getTracker(patientId)!;
    tracker.consentedContacts = tracker.consentedContacts.filter(c => c.id !== contactId);
    this.notify();
    return true;
  }
}

export const labourDeliveryService = new LabourDeliveryService();
