import { TreatmentPackageConfig, CostQuotationRequest, ItemizedCostItem, PackageType } from '../types';

export const DEFAULT_TREATMENT_PACKAGES: TreatmentPackageConfig[] = [
  {
    id: 'pkg-normal-delivery',
    packageType: 'NORMAL_DELIVERY',
    name: 'Normal Vaginal Delivery Care Package',
    description: 'Comprehensive 3-day inpatient normal delivery care including labour room monitoring, obstetrician fees, neonatal baseline checks, and standard consumables.',
    durationStay: '3 Days / 2 Nights',
    basePriceInr: 22000,
    estimatedTotalInr: 22000,
    roomType: 'General Ward',
    pmjayCoverageNote: 'Fully covered under Ayushman Bharat (AB-PMJAY) & Janani Shishu Suraksha Karyakram (JSSK) for eligible ration cards.',
    hospitalName: 'District Hospital Hubballi Maternity Block',
    items: [
      {
        id: 'item-nd-1',
        category: 'BED_AND_ROOM',
        name: 'General Maternity Ward Bed Charges (3 days)',
        description: 'Includes clean linen, attached maternal washroom, and nursing observation.',
        amountInr: 4500,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-nd-2',
        category: 'OT_CHARGES',
        name: 'Labour Room & Delivery Suite Facility Charges',
        description: 'Sterile delivery table, cardiotocography (CTG) continuous fetal monitoring, and oxygen support.',
        amountInr: 6500,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-nd-3',
        category: 'DOCTOR_FEES',
        name: 'Consultant Obstetrician Delivery & Management Fee',
        description: 'Attending consultant gynaecologist for labour progression, delivery, and perineal repair.',
        amountInr: 5000,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-nd-4',
        category: 'PEDIATRICIAN',
        name: 'Pediatrician / Neonatologist Resuscitation & Initial Exam',
        description: 'At-birth examination, Apgar scoring, initial vitals, and neonatal wellness check.',
        amountInr: 2000,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-nd-5',
        category: 'NURSING',
        name: '24/7 Midwifery & Postpartum Nursing Care',
        description: 'Lactation assistance, vitals logging every 4 hours, and infant temperature checks.',
        amountInr: 2500,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-nd-6',
        category: 'MEDICINES_CONSUMABLES',
        name: 'Standard Labour Consumables & Oxytocin Kit',
        description: 'Sterile surgical gloves, cord clamp, oxytocin ampoules, suture materials, and sanitary pads.',
        amountInr: 1500,
        isCoveredByAyushmanBharatPMJAY: true
      }
    ]
  },
  {
    id: 'pkg-c-section',
    packageType: 'C_SECTION',
    name: 'Cesarean Delivery Package (LSCS)',
    description: 'Elective or emergency Lower Segment Cesarean Section package including major operation theatre, anaesthetist, surgeon team, 4-day recovery, and neonatal stabilization.',
    durationStay: '4 Days / 3 Nights',
    basePriceInr: 45000,
    estimatedTotalInr: 45000,
    roomType: 'Semi-Private Sharing',
    pmjayCoverageNote: 'Covered under PM-JAY Secondary Specialty Surgical Package (Code: SOG001).',
    hospitalName: 'District Hospital Hubballi Maternity Block',
    items: [
      {
        id: 'item-cs-1',
        category: 'OT_CHARGES',
        name: 'Major Operation Theatre (OT) & High-Tech Monitoring',
        description: 'Equipped sterile laminar flow OT, multi-para monitors, electrocautery, and suction.',
        amountInr: 12000,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-cs-2',
        category: 'DOCTOR_FEES',
        name: 'Senior Consultant Obstetric Surgeon & Assistant Fee',
        description: 'Surgeon and assistant surgical specialist for LSCS procedure.',
        amountInr: 11000,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-cs-3',
        category: 'DOCTOR_FEES',
        name: 'Consultant Anaesthesiologist Fee & Spinal Block',
        description: 'Pre-anesthetic evaluation, spinal anesthesia administration, and post-op recovery monitoring.',
        amountInr: 6000,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-cs-4',
        category: 'BED_AND_ROOM',
        name: 'Semi-Private Sharing Inpatient Room (4 days)',
        description: 'Two-patient room with attender couch, air-cooling, and attached bathroom.',
        amountInr: 8000,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-cs-5',
        category: 'PEDIATRICIAN',
        name: 'Pediatrician OT Standby & Newborn Resuscitation',
        description: 'In-theatre newborn warm bed, mucus suctioning, and APGAR evaluation.',
        amountInr: 3000,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-cs-6',
        category: 'MEDICINES_CONSUMABLES',
        name: 'Surgical Consumables, Spinal Kit & Antibiotic Drip',
        description: 'Spinal needle, sterile drapes, vicryl sutures, IV fluids, and 3 doses IV Ceftriaxone.',
        amountInr: 5000,
        isCoveredByAyushmanBharatPMJAY: true
      }
    ]
  },
  {
    id: 'pkg-anc-complete',
    packageType: 'ANTENATAL_CARE',
    name: 'Complete Antenatal Care (ANC) Booking Package',
    description: 'Comprehensive gestational care package covering 8 regular OPD consultations, 3 essential ultrasound scans (Dating, Level-II TIFFA, Growth Doppler), and routine trimester lab test panels.',
    durationStay: 'Full Gestational Period (Up to 40 weeks)',
    basePriceInr: 9500,
    estimatedTotalInr: 9500,
    roomType: 'General Ward',
    pmjayCoverageNote: 'Eligible for Pradhan Mantri Matru Vandana Yojana (PMMVY) incentive subsidy of ₹5,000.',
    hospitalName: 'District Hospital Hubballi Maternity Block',
    items: [
      {
        id: 'item-anc-1',
        category: 'DOCTOR_FEES',
        name: '8 Scheduled Antenatal OPD Consultations',
        description: 'Comprehensive clinical checkups with Dr. Anita Rao across all trimesters.',
        amountInr: 3200,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-anc-2',
        category: 'LAB_AND_SCANS',
        name: '3 Ultrasound Scans (Dating, TIFFA Level-II & Growth Doppler)',
        description: 'High-resolution fetal anomaly and biometric growth velocity scans.',
        amountInr: 3800,
        isCoveredByAyushmanBharatPMJAY: true
      },
      {
        id: 'item-anc-3',
        category: 'LAB_AND_SCANS',
        name: 'Complete Laboratory Testing Panels (1st & 2nd Trimester)',
        description: 'Blood Group Rh, Hb/CBC, 75g OGTT (DIPSI), Urine micro, TSH, and VDRL/HBsAg/HIV.',
        amountInr: 2500,
        isCoveredByAyushmanBharatPMJAY: true
      }
    ]
  },
  {
    id: 'pkg-high-risk-gdm',
    packageType: 'HIGH_RISK_MATERNITY',
    name: 'High-Risk Maternity & GDM Monitoring Package',
    description: 'Specialised care package for Gestational Diabetes or mild preeclampsia including bi-weekly bio-physical profiles, 24-hour urine protein check, and endocrinologist review.',
    durationStay: '2-Day Daycare & OPD',
    basePriceInr: 14500,
    estimatedTotalInr: 14500,
    roomType: 'Semi-Private Sharing',
    hospitalName: 'District Hospital Hubballi Maternity Block',
    items: [
      {
        id: 'item-hr-1',
        category: 'DOCTOR_FEES',
        name: 'High-Risk Obstetrician & Physician Co-Consultation',
        description: 'Joint management of maternal glycemia and blood pressure control.',
        amountInr: 4500
      },
      {
        id: 'item-hr-2',
        category: 'LAB_AND_SCANS',
        name: 'Biophysical Profile (BPP) & Umbilical Artery Doppler Scan',
        description: 'Assessment of fetal breathing, tone, amniotic fluid volume, and placental resistance.',
        amountInr: 4000
      },
      {
        id: 'item-hr-3',
        category: 'LAB_AND_SCANS',
        name: 'HbA1c, Daily Glucose Profiling & Renal Panel',
        description: 'Comprehensive glycemic surveillance and kidney function evaluation.',
        amountInr: 3500
      },
      {
        id: 'item-hr-4',
        category: 'NURSING',
        name: 'Continuous Non-Stress Testing (NST) Monitoring',
        description: 'Fetal heart trace recording for 45 minutes.',
        amountInr: 2500
      }
    ]
  }
];

class CostEstimatorService {
  private packages: TreatmentPackageConfig[] = DEFAULT_TREATMENT_PACKAGES;
  private quotations: CostQuotationRequest[] = [
    {
      id: 'quote-101',
      patientId: 'PAT-104',
      patientName: 'Sunita Das',
      mobile: '+91 98451 12340',
      packageId: 'pkg-normal-delivery',
      packageName: 'Normal Vaginal Delivery Care Package',
      roomTypeSelected: 'General Ward',
      estimatedTotalInr: 22000,
      breakdown: DEFAULT_TREATMENT_PACKAGES[0].items,
      generatedAt: '2026-10-21 11:30 AM',
      validUntil: '2026-11-20',
      quotationReference: 'EST-DH-2026-8812',
      status: 'SENT_WHATSAPP',
      whatsAppDeliveryStatus: 'DELIVERED'
    }
  ];

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

  getAllPackages(): TreatmentPackageConfig[] {
    return this.packages;
  }

  getPackageById(id: string): TreatmentPackageConfig | undefined {
    return this.packages.find(p => p.id === id);
  }

  updatePackagePricing(packageId: string, updatedItems: ItemizedCostItem[], roomType: any): TreatmentPackageConfig | null {
    const pkg = this.packages.find(p => p.id === packageId);
    if (!pkg) return null;
    pkg.items = updatedItems;
    pkg.estimatedTotalInr = updatedItems.reduce((acc, item) => acc + item.amountInr, 0);
    pkg.roomType = roomType;
    this.notify();
    return pkg;
  }

  createQuotation(req: {
    patientId: string;
    patientName: string;
    mobile: string;
    packageId: string;
    roomTypeSelected: string;
  }): CostQuotationRequest {
    const pkg = this.getPackageById(req.packageId) || this.packages[0];
    const newQuote: CostQuotationRequest = {
      id: `quote-${Date.now()}`,
      patientId: req.patientId,
      patientName: req.patientName,
      mobile: req.mobile,
      packageId: pkg.id,
      packageName: pkg.name,
      roomTypeSelected: req.roomTypeSelected || pkg.roomType,
      estimatedTotalInr: pkg.estimatedTotalInr,
      breakdown: pkg.items,
      generatedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
      quotationReference: `EST-DH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'GENERATED'
    };
    this.quotations.unshift(newQuote);
    this.notify();
    return newQuote;
  }

  sendQuotationViaWhatsApp(quotationId: string): boolean {
    const quote = this.quotations.find(q => q.id === quotationId);
    if (!quote) return false;
    quote.status = 'SENT_WHATSAPP';
    quote.whatsAppDeliveryStatus = 'DELIVERED';
    this.notify();
    return true;
  }

  recordPatientQuery(quotationId: string, queryText: string): boolean {
    const quote = this.quotations.find(q => q.id === quotationId);
    if (!quote) return false;
    quote.status = 'QUERY_RAISED';
    quote.patientQuery = queryText;
    this.notify();
    return true;
  }

  getQuotationsForPatient(patientId: string): CostQuotationRequest[] {
    return this.quotations.filter(q => q.patientId === patientId);
  }

  getAllQuotations(): CostQuotationRequest[] {
    return this.quotations;
  }
}

export const costEstimatorService = new CostEstimatorService();
