/**
 * Multi-Hospital Network & Federated ABHA Consent Service
 * Supports booking across all vicinity health centers & multi-specialty hospitals.
 * Guarantees unified, constant longitudinal health record storage tied to the patient's ABHA ID.
 */

export interface VicinityHealthCenter {
  id: string;
  name: string;
  shortName: string;
  type: 'TERTIARY_HOSPITAL' | 'MATERNITY_SPECIALTY' | 'MULTI_SPECIALTY' | 'COMMUNITY_HEALTH';
  categoryLabel: string;
  address: string;
  distanceKm: number;
  drivingEtaMinutes: number;
  rating: number;
  reviewCount: number;
  phone: string;
  emergencyHelpline: string;
  accreditation: string;
  badgeColor: string;
  consultationFeeInr: number;
  normalDeliveryEstInr: number;
  cSectionEstInr: number;
  pmjayEmpanelled: boolean;
  jsskCovered: boolean;
  doctorsCount: number;
  specialists: Array<{
    id: string;
    name: string;
    qualification: string;
    specialty: string;
    timing: string;
    fee: number;
  }>;
  availableSlotsToday: string[];
}

export interface AbhaHospitalConsent {
  id: string;
  hospitalId: string;
  hospitalName: string;
  consentArtifactId: string;
  requesterName: string;
  purpose: string;
  accessLevel: 'FULL_LONGITUDINAL' | 'DIAGNOSTIC_ONLY' | 'EMERGENCY_ONLY';
  hiTypes: string[]; // ['OPConsultation', 'DiagnosticReport', 'DischargeSummary', 'Prescription', 'ImmunizationRecord']
  status: 'GRANTED' | 'REQUESTED' | 'REVOKED' | 'EXPIRED';
  grantedDate: string;
  validTill: string;
  autoSyncActive: boolean;
}

export const VICINITY_HEALTH_CENTERS: VicinityHealthCenter[] = [
  {
    id: 'hosp-st-anne',
    name: 'St. Anne Mother & Child Hospital',
    shortName: 'St. Anne Hospital',
    type: 'TERTIARY_HOSPITAL',
    categoryLabel: 'Tertiary Maternity Centre & NICU Level III',
    address: 'Station Road, Hubballi Central',
    distanceKm: 0.5,
    drivingEtaMinutes: 2,
    rating: 4.8,
    reviewCount: 340,
    phone: '+91 836 2211999',
    emergencyHelpline: '080-2211-9999 (24x7 Labour Suite)',
    accreditation: 'NABH Accredited & PM-JAY Empanelled',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    consultationFeeInr: 300,
    normalDeliveryEstInr: 22000,
    cSectionEstInr: 45000,
    pmjayEmpanelled: true,
    jsskCovered: true,
    doctorsCount: 14,
    specialists: [
      {
        id: 'doc-anita',
        name: 'Dr. Anita Rao',
        qualification: 'MBBS, MS (OB/GYN)',
        specialty: 'High-Risk Obstetrics & Maternal-Fetal Medicine',
        timing: '09:00 AM - 01:30 PM (Room 4)',
        fee: 300
      },
      {
        id: 'doc-suniti-pnc',
        name: 'Dr. Suniti Deshmukh',
        qualification: 'MBBS, DGO',
        specialty: 'Postnatal & Lactation Medicine',
        timing: '02:00 PM - 05:30 PM (Room 2)',
        fee: 250
      }
    ],
    availableSlotsToday: ['10:30 AM', '11:15 AM', '02:30 PM', '04:00 PM']
  },
  {
    id: 'hosp-apollo-cradle',
    name: "Apollo Cradle & Children's Hospital",
    shortName: 'Apollo Cradle',
    type: 'MATERNITY_SPECIALTY',
    categoryLabel: 'Boutique Maternity Suites & Foetal Health',
    address: 'Vidyanagar High Street, Hubballi',
    distanceKm: 1.8,
    drivingEtaMinutes: 5,
    rating: 4.9,
    reviewCount: 480,
    phone: '+91 836 2378900',
    emergencyHelpline: '+91 836 2378999',
    accreditation: 'JCI & NABH International Standards',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    consultationFeeInr: 600,
    normalDeliveryEstInr: 48000,
    cSectionEstInr: 85000,
    pmjayEmpanelled: false,
    jsskCovered: false,
    doctorsCount: 18,
    specialists: [
      {
        id: 'doc-priya-kulkarni',
        name: 'Dr. Priya Kulkarni',
        qualification: 'MBBS, DNB, MRCOG (London)',
        specialty: 'Maternal Fetal Medicine & Genetic Counseling',
        timing: '10:00 AM - 02:00 PM',
        fee: 600
      },
      {
        id: 'doc-arun-sharma',
        name: 'Dr. Arun Sharma',
        qualification: 'MD (Pediatrics), DM (Neonatology)',
        specialty: 'Chief Neonatologist & Preterm Infant Care',
        timing: '11:30 AM - 04:00 PM',
        fee: 550
      }
    ],
    availableSlotsToday: ['11:00 AM', '12:30 PM', '03:15 PM', '05:00 PM']
  },
  {
    id: 'hosp-fortis-femme',
    name: 'Fortis La Femme Maternal & Gynaecology Hospital',
    shortName: 'Fortis La Femme',
    type: 'MULTI_SPECIALTY',
    categoryLabel: 'Comprehensive Women’s Hospital & High-Risk Wings',
    address: 'Gokul Road Industrial Corridor, Hubballi',
    distanceKm: 2.5,
    drivingEtaMinutes: 7,
    rating: 4.7,
    reviewCount: 310,
    phone: '+91 836 2445600',
    emergencyHelpline: '+91 836 2445699',
    accreditation: 'NABH Level 3 Healthcare Provider',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    consultationFeeInr: 500,
    normalDeliveryEstInr: 38000,
    cSectionEstInr: 72000,
    pmjayEmpanelled: true,
    jsskCovered: false,
    doctorsCount: 22,
    specialists: [
      {
        id: 'doc-rajeshwari-hegde',
        name: 'Dr. Rajeshwari Hegde',
        qualification: 'MS, FICOG, Endoscopy Fellow',
        specialty: 'Laparoscopic Gynaecology & Infertility',
        timing: '09:30 AM - 01:00 PM',
        fee: 500
      },
      {
        id: 'doc-vijay-patil',
        name: 'Dr. Vijay Patil',
        qualification: 'MD, FNB (Critical Care)',
        specialty: 'Obstetric Intensive Care Specialist',
        timing: '02:00 PM - 06:00 PM',
        fee: 450
      }
    ],
    availableSlotsToday: ['09:45 AM', '11:45 AM', '02:00 PM', '04:30 PM']
  },
  {
    id: 'hosp-cloudnine',
    name: 'Cloudnine Maternity & Neonatal Hospital',
    shortName: 'Cloudnine Hospital',
    type: 'MATERNITY_SPECIALTY',
    categoryLabel: 'Comfort Delivery Suites & Antenatal Wellness',
    address: 'Unkal Lake Ring Road, Hubballi-Dharwad Bypass',
    distanceKm: 3.2,
    drivingEtaMinutes: 8,
    rating: 4.9,
    reviewCount: 520,
    phone: '+91 836 2889100',
    emergencyHelpline: '+91 836 2889199',
    accreditation: 'NABH Specialized Maternity Certified',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    consultationFeeInr: 650,
    normalDeliveryEstInr: 52000,
    cSectionEstInr: 89000,
    pmjayEmpanelled: false,
    jsskCovered: false,
    doctorsCount: 16,
    specialists: [
      {
        id: 'doc-meenakshi-sundaram',
        name: 'Dr. Meenakshi Sundaram',
        qualification: 'MBBS, MD, Fellowship in Fetal Echo',
        specialty: 'Fetal Ultrasound & Fetal Echocardiography',
        timing: '10:00 AM - 03:00 PM',
        fee: 650
      }
    ],
    availableSlotsToday: ['10:15 AM', '01:00 PM', '03:30 PM']
  },
  {
    id: 'hosp-motherhood',
    name: "Motherhood Women's & Children's Hospital",
    shortName: 'Motherhood Hospital',
    type: 'MATERNITY_SPECIALTY',
    categoryLabel: 'Advanced Birthing & Paediatric Super-Specialty',
    address: 'Court Circle, Hubballi',
    distanceKm: 2.1,
    drivingEtaMinutes: 6,
    rating: 4.8,
    reviewCount: 390,
    phone: '+91 836 2554100',
    emergencyHelpline: '+91 836 2554199',
    accreditation: 'NABH Accredited Maternal Hub',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    consultationFeeInr: 450,
    normalDeliveryEstInr: 34000,
    cSectionEstInr: 64000,
    pmjayEmpanelled: true,
    jsskCovered: false,
    doctorsCount: 15,
    specialists: [
      {
        id: 'doc-vandana-desai',
        name: 'Dr. Vandana Desai',
        qualification: 'MS (OBG), Dip in Reproductive Med',
        specialty: 'High-Risk Pregnancy & Recurrent Loss Management',
        timing: '09:00 AM - 02:00 PM',
        fee: 450
      }
    ],
    availableSlotsToday: ['11:30 AM', '02:15 PM', '04:45 PM']
  },
  {
    id: 'hosp-manipal',
    name: 'Manipal Hospital Maternal & Fetal Medicine Wing',
    shortName: 'Manipal Hospital',
    type: 'MULTI_SPECIALTY',
    categoryLabel: 'Quaternary Healthcare & Fetal Surgery Hub',
    address: 'P.B. Road, Navalur, Hubballi-Dharwad',
    distanceKm: 4.0,
    drivingEtaMinutes: 10,
    rating: 4.8,
    reviewCount: 780,
    phone: '+91 836 2776000',
    emergencyHelpline: '+91 836 2776999',
    accreditation: 'NABH & NABL Dual Accredited',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    consultationFeeInr: 550,
    normalDeliveryEstInr: 42000,
    cSectionEstInr: 78000,
    pmjayEmpanelled: true,
    jsskCovered: false,
    doctorsCount: 35,
    specialists: [
      {
        id: 'doc-kavita-bhat',
        name: 'Dr. Kavita Bhat',
        qualification: 'MBBS, MD, Fellow in Perinatology',
        specialty: 'Rh-Negative Alloimmunization & Fetal Therapy',
        timing: '10:00 AM - 04:00 PM',
        fee: 550
      }
    ],
    availableSlotsToday: ['10:00 AM', '12:00 PM', '03:00 PM']
  }
];

// Initial Federated ABHA Hospital Consents for Sunita Das (PAT-104)
export const INITIAL_ABHA_CONSENTS: AbhaHospitalConsent[] = [
  {
    id: 'consent-st-anne',
    hospitalId: 'hosp-st-anne',
    hospitalName: 'St. Anne Mother & Child Hospital',
    consentArtifactId: 'ABDM-CONSENT-9942-01',
    requesterName: 'Dr. Anita Rao, Senior Consultant OB/GYN',
    purpose: 'Primary Longitudinal Antenatal Management & Delivery Planning',
    accessLevel: 'FULL_LONGITUDINAL',
    hiTypes: ['OPConsultation', 'DiagnosticReport', 'DischargeSummary', 'Prescription', 'ImmunizationRecord'],
    status: 'GRANTED',
    grantedDate: '12 Sep 2026',
    validTill: '15 Jan 2027',
    autoSyncActive: true
  },
  {
    id: 'consent-apollo-cradle',
    hospitalId: 'hosp-apollo-cradle',
    hospitalName: "Apollo Cradle & Children's Hospital",
    consentArtifactId: 'ABDM-CONSENT-9942-02',
    requesterName: 'Dr. Priya Kulkarni, Maternal Fetal Specialist',
    purpose: 'Cross-Consultation & Advanced 3D Foetal Ultrasound Biometry',
    accessLevel: 'FULL_LONGITUDINAL',
    hiTypes: ['OPConsultation', 'DiagnosticReport', 'Prescription'],
    status: 'GRANTED',
    grantedDate: '02 Nov 2026',
    validTill: '02 May 2027',
    autoSyncActive: true
  },
  {
    id: 'consent-fortis-femme',
    hospitalId: 'hosp-fortis-femme',
    hospitalName: 'Fortis La Femme Maternal Hospital',
    consentArtifactId: 'ABDM-CONSENT-9942-03',
    requesterName: 'Dr. Rajeshwari Hegde, Laparoscopic Specialist',
    purpose: 'Secondary Specialist Opinion & Obstetric Critical Care Readiness',
    accessLevel: 'FULL_LONGITUDINAL',
    hiTypes: ['DiagnosticReport', 'DischargeSummary'],
    status: 'REQUESTED',
    grantedDate: 'Pending Approval',
    validTill: '30 Days from Approval',
    autoSyncActive: false
  },
  {
    id: 'consent-cloudnine',
    hospitalId: 'hosp-cloudnine',
    hospitalName: 'Cloudnine Hospital',
    consentArtifactId: 'ABDM-CONSENT-9942-04',
    requesterName: 'Clinical Emergency Team',
    purpose: 'Emergency Labour Room Admittance & Blood Group O-ve Crossmatching',
    accessLevel: 'EMERGENCY_ONLY',
    hiTypes: ['DiagnosticReport', 'Prescription', 'ImmunizationRecord'],
    status: 'GRANTED',
    grantedDate: '20 Oct 2026',
    validTill: '20 Oct 2027',
    autoSyncActive: true
  },
  {
    id: 'consent-manipal',
    hospitalId: 'hosp-manipal',
    hospitalName: 'Manipal Hospital Maternal & Fetal Wing',
    consentArtifactId: 'ABDM-CONSENT-9942-05',
    requesterName: 'Dr. Kavita Bhat, Perinatology Unit',
    purpose: 'Rh-Negative Blood Group Fetal Well-being Surveillance',
    accessLevel: 'FULL_LONGITUDINAL',
    hiTypes: ['DiagnosticReport', 'OPConsultation'],
    status: 'GRANTED',
    grantedDate: '25 Oct 2026',
    validTill: '25 Apr 2027',
    autoSyncActive: true
  }
];

class MultiHospitalConsentService {
  private activeHospitalId: string = 'hosp-st-anne';
  private consents: AbhaHospitalConsent[] = [...INITIAL_ABHA_CONSENTS];
  private bookedAppointments: Array<{
    id: string;
    hospitalId: string;
    hospitalName: string;
    doctorName: string;
    serviceType: string;
    date: string;
    slot: string;
    status: 'CONFIRMED' | 'COMPLETED';
    abhaConsentVerified: boolean;
  }> = [
    {
      id: 'APT-104-01',
      hospitalId: 'hosp-st-anne',
      hospitalName: 'St. Anne Mother & Child Hospital',
      doctorName: 'Dr. Anita Rao (OB/GYN)',
      serviceType: 'Week 28 Antenatal Clinical Review',
      date: '2026-11-12',
      slot: '10:30 AM',
      status: 'CONFIRMED',
      abhaConsentVerified: true
    }
  ];

  getActiveHospital(): VicinityHealthCenter {
    return VICINITY_HEALTH_CENTERS.find(h => h.id === this.activeHospitalId) || VICINITY_HEALTH_CENTERS[0];
  }

  setActiveHospital(hospitalId: string): void {
    this.activeHospitalId = hospitalId;
  }

  getAllHealthCenters(): VicinityHealthCenter[] {
    return VICINITY_HEALTH_CENTERS;
  }

  getHealthCenterById(id: string): VicinityHealthCenter | undefined {
    return VICINITY_HEALTH_CENTERS.find(h => h.id === id);
  }

  getConsents(): AbhaHospitalConsent[] {
    return [...this.consents];
  }

  grantConsent(hospitalId: string): void {
    this.consents = this.consents.map(c => {
      if (c.hospitalId === hospitalId) {
        return {
          ...c,
          status: 'GRANTED',
          grantedDate: 'Today',
          validTill: '6 Months from Today',
          autoSyncActive: true
        };
      }
      return c;
    });
  }

  revokeConsent(hospitalId: string): void {
    this.consents = this.consents.map(c => {
      if (c.hospitalId === hospitalId) {
        return {
          ...c,
          status: 'REVOKED',
          autoSyncActive: false
        };
      }
      return c;
    });
  }

  isConsentGrantedForHospital(hospitalId: string): boolean {
    const c = this.consents.find(item => item.hospitalId === hospitalId);
    return c ? c.status === 'GRANTED' : false;
  }

  bookAppointment(params: {
    hospitalId: string;
    hospitalName?: string;
    doctorName: string;
    serviceType: string;
    date: string;
    slot: string;
  }) {
    const hospital = this.getHealthCenterById(params.hospitalId);
    const newApt = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      hospitalId: params.hospitalId,
      hospitalName: params.hospitalName || hospital?.name || 'Vicinity Medical Centre',
      doctorName: params.doctorName,
      serviceType: params.serviceType,
      date: params.date,
      slot: params.slot,
      status: 'CONFIRMED' as const,
      abhaConsentVerified: this.isConsentGrantedForHospital(params.hospitalId)
    };
    this.bookedAppointments.unshift(newApt);
    return newApt;
  }

  getBookedAppointments() {
    return [...this.bookedAppointments];
  }
}

export const multiHospitalConsentService = new MultiHospitalConsentService();
