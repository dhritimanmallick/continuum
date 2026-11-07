import { 
  OpdPatient, 
  LabReferral, 
  LabOrder,
  WhatsAppMessage, 
  OpdStats, 
  OpdUserRole, 
  PortalType,
  OpdRole,
  OpdClinic,
  LabReferralStatus, 
  Vitals,
  PreviousOpdVisit, 
  PatientTimelineEvent,
  PharmacyOrder,
  PharmacyPartner,
  LabPartner,
  PrescriptionMedicineItem,
  ScannedPrescriptionRecord,
  WeeklyMonthlyStats,
  DoctorProfile,
  HospitalRoom,
  DiagnosticLabConfig,
  HospitalFacilityInfo,
  DiagnosticParameter,
  DiagnosticAnalysisResult,
  CareJourney,
  CareJourneyType,
  CareMilestone,
  PatientAchievement,
  DoctorAchievement,
  PathologistAchievement,
  VaccineScheduleItem,
  MaternalClinicalStage,
  MaternalTestProtocol
} from '../types';
import { integrationBackbone } from './integrationBackbone';
import { authService } from './authService';
import { deliverWhatsApp } from './whatsappGateway';
import { gamificationEngine } from './gamificationEngine';
import { 
  generateNewbornVaccineSchedule, 
  detectMaternalStage, 
  MATERNAL_ANC_TESTS, 
  MATERNAL_PNC_TESTS,
  ALL_MATERNAL_TESTS 
} from './clinicalProtocols';

export const DOCTOR_PROFILES: DoctorProfile[] = [
  {
    id: 'doc-anita',
    name: 'Dr. Anita Rao',
    shortName: 'Dr. Anita Rao (OB/GYN)',
    specialty: 'Obstetrics & Gynaecology (Maternal & Foetal Health)',
    qualification: 'MBBS, MS (Obstetrics & Gynaecology)',
    department: 'Maternal & Child Health (MCH)',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    roomNumber: 'Room 4',
    avatarInitials: 'AR',
    colorTheme: 'teal',
    consultationFee: 300,
    phone: '+91 98450 22334',
    email: 'anita.rao@stannehospital.in',
    regNo: 'KMC-48291',
    allocatedLabId: 'lab-apex',
    allocatedLabName: 'Apex Diagnostic Hub & Pathology',
    activeStatus: 'ACTIVE',
    shiftTiming: '08:30 - 15:30 (Morning ANC)'
  },
  {
    id: 'doc-rajesh',
    name: 'Dr. Rajesh Kulkarni',
    shortName: 'Dr. Rajesh Kulkarni (Gen Med)',
    specialty: 'Internal Medicine & Chronic Disease Care',
    qualification: 'MBBS, MD (General Medicine)',
    department: 'Internal Medicine',
    clinicId: 'opd-gen',
    clinicName: 'General Medicine OPD (Room 1)',
    roomNumber: 'Room 1',
    avatarInitials: 'RK',
    colorTheme: 'blue',
    consultationFee: 350,
    phone: '+91 98450 33445',
    email: 'rajesh.kulkarni@stannehospital.in',
    regNo: 'KMC-39102',
    allocatedLabId: 'lab-apex',
    allocatedLabName: 'Apex Diagnostic Hub & Pathology',
    activeStatus: 'ACTIVE',
    shiftTiming: '09:00 - 16:00'
  },
  {
    id: 'doc-sneha',
    name: 'Dr. Sneha Patil',
    shortName: 'Dr. Sneha Patil (Pediatrics)',
    specialty: 'Pediatrics & Neonatal Care',
    qualification: 'MBBS, DCH (Pediatrics)',
    department: 'Pediatrics & Neonatology',
    clinicId: 'opd-ped',
    clinicName: 'Pediatric & Child Health OPD (Room 2)',
    roomNumber: 'Room 2',
    avatarInitials: 'SP',
    colorTheme: 'purple',
    consultationFee: 300,
    phone: '+91 98450 44556',
    email: 'sneha.patil@stannehospital.in',
    regNo: 'KMC-51092',
    allocatedLabId: 'lab-metropolis',
    allocatedLabName: 'Metropolis Reference Diagnostics Partner',
    activeStatus: 'ACTIVE',
    shiftTiming: '09:30 - 16:30'
  }
];

export const INITIAL_HOSPITAL_ROOMS: HospitalRoom[] = [
  {
    id: 'room-1',
    roomNumber: 'Room 1',
    name: 'General Medicine & Chronic Care',
    department: 'Internal Medicine',
    floor: 'Ground Floor, Wing A',
    currentDoctorId: 'doc-rajesh',
    currentDoctorName: 'Dr. Rajesh Kulkarni',
    status: 'OCCUPIED',
    equipmentNotes: 'ECG Monitor, Sphygmomanometer, Glucometer Station',
    activePatientCount: 3
  },
  {
    id: 'room-2',
    roomNumber: 'Room 2',
    name: 'Pediatrics & Neonatal Care Suite',
    department: 'Pediatrics & Neonatology',
    floor: 'Ground Floor, Wing A',
    currentDoctorId: 'doc-sneha',
    currentDoctorName: 'Dr. Sneha Patil',
    status: 'OCCUPIED',
    equipmentNotes: 'Infant Warmer, Infantometer, Pediatric Nebulizer, Toy Station',
    activePatientCount: 2
  },
  {
    id: 'room-3',
    roomNumber: 'Room 3',
    name: 'Antenatal Day-Care & Triage Room',
    department: 'Maternal & Child Health',
    floor: 'Ground Floor, Wing B',
    currentDoctorId: undefined,
    currentDoctorName: undefined,
    status: 'VACANT',
    equipmentNotes: 'Cardiotocography (NST), Recliner Beds, O2 Supply',
    activePatientCount: 0
  },
  {
    id: 'room-4',
    roomNumber: 'Room 4',
    name: 'Maternal & Antenatal Suite (OB/GYN)',
    department: 'Obstetrics & Gynaecology',
    floor: 'Ground Floor, Wing B (MCH Suite)',
    currentDoctorId: 'doc-anita',
    currentDoctorName: 'Dr. Anita Rao',
    status: 'OCCUPIED',
    equipmentNotes: 'Portable Ultrasound Doppler, Examination Couch, Pelvimeter, Specimen Bay',
    activePatientCount: 4
  },
  {
    id: 'room-5',
    roomNumber: 'Room 5',
    name: 'Fetal Medicine & Advanced Sonography Suite',
    department: 'Radiology & Fetal Diagnostics',
    floor: 'First Floor, Diagnostic Wing',
    currentDoctorId: undefined,
    currentDoctorName: undefined,
    status: 'VACANT',
    equipmentNotes: 'Voluson E10 4D Ultrasound, Amniocentesis Kit, Fetal Biometry Terminal',
    activePatientCount: 0
  },
  {
    id: 'room-6',
    roomNumber: 'Room 6',
    name: 'High-Risk Obstetrics & Gynae Oncology',
    department: 'Obstetrics & Gynaecology',
    floor: 'First Floor, Wing B',
    currentDoctorId: undefined,
    currentDoctorName: undefined,
    status: 'VACANT',
    equipmentNotes: 'Colposcope, Cryotherapy Console, High-Risk Maternal Vitals Monitor',
    activePatientCount: 0
  },
  {
    id: 'room-7',
    roomNumber: 'Room 7',
    name: 'Postnatal & Lactation Counseling Bay',
    department: 'Postnatal Medicine',
    floor: 'Ground Floor, Wing B',
    currentDoctorId: undefined,
    currentDoctorName: undefined,
    status: 'VACANT',
    equipmentNotes: 'Breastfeeding Support Station, Neonatal Jaundice Bilimeter, Educational Displays',
    activePatientCount: 0
  },
  {
    id: 'room-8',
    roomNumber: 'Room 8',
    name: 'Family Welfare & Preventive Health',
    department: 'Community Medicine',
    floor: 'Ground Floor, Wing C',
    currentDoctorId: undefined,
    currentDoctorName: undefined,
    status: 'VACANT',
    equipmentNotes: 'IUCD Insertion Station, Vaccination Cold Chain Box, Counselling Desk',
    activePatientCount: 0
  }
];

export const INITIAL_DIAGNOSTIC_LABS: DiagnosticLabConfig[] = [
  {
    id: 'lab-apex',
    name: 'Apex Diagnostic Hub & Pathology',
    type: 'In-House Hospital Laboratory',
    inCharge: 'Dr. Suniti Patel (MBBS, MD Pathology)',
    contact: '+91 98450 66778',
    location: 'Hospital Ground Floor, Lab Wing L-01',
    isDefault: true,
    activeRequisitionsCount: 6,
    avgTurnaroundHours: 1.5,
    slaPercent: 98.4,
    assignedDoctorIds: ['doc-anita', 'doc-rajesh']
  },
  {
    id: 'lab-sonography',
    name: 'St. Anne Ultrasound & Fetal Imaging Wing',
    type: 'In-House Imaging & Ultrasound Suite',
    inCharge: 'Dr. Meera Iyer (Consultant Radiologist)',
    contact: '+91 98450 66779',
    location: 'Floor 1, Room 5 Sonography Wing',
    isDefault: false,
    activeRequisitionsCount: 4,
    avgTurnaroundHours: 0.8,
    slaPercent: 99.1,
    assignedDoctorIds: ['doc-anita']
  },
  {
    id: 'lab-metropolis',
    name: 'Metropolis Reference Diagnostics Partner',
    type: 'External Accredited Specialty Lab',
    inCharge: 'Dr. Rajeshwari Joshi (Pathology Head)',
    contact: '+91 836 221 4455',
    location: 'Station Road, Hubballi (Couriers pick up every 60 min)',
    isDefault: false,
    activeRequisitionsCount: 2,
    avgTurnaroundHours: 6.0,
    slaPercent: 96.2,
    assignedDoctorIds: ['doc-sneha']
  },
  {
    id: 'lab-janaushadhi',
    name: 'Jan Aushadhi Affordable Clinical Diagnostics',
    type: 'Government Affiliated Low-Cost Diagnostic Wing',
    inCharge: 'Suresh Kamat, Lab Supervisor',
    contact: '+91 94812 33441',
    location: 'Hospital Annex Gate 2',
    isDefault: false,
    activeRequisitionsCount: 3,
    avgTurnaroundHours: 2.0,
    slaPercent: 97.5,
    assignedDoctorIds: []
  }
];

export const HOSPITAL_FACILITY: HospitalFacilityInfo = {
  id: 'fac-stanne',
  name: 'St. Anne Mother & Child Hospital & Nursing Home',
  tagline: 'Comprehensive Obstetrics, Gynaecology, Pathology & Child Healthcare',
  type: 'Maternal & Multi-Specialty Hospital & Nursing Home',
  licenseNumber: 'KA-MED-REG-44910/2018',
  address: 'Beside KIMS Road, Dharwad Highway, Hubballi, Karnataka - 580020',
  phone: '+91 836 221 8800',
  emergencyNumber: '108 / +91 836 221 8899',
  totalBeds: 65,
  totalConsultationRooms: 8,
  activeDoctorsCount: 3,
  medicalDirector: 'Dr. Radhika Sen, MS (Obstetrics), MHA',
  establishedYear: 2012
};

export const OPD_CLINICS: OpdClinic[] = [
  {
    id: 'opd-anc',
    name: 'Maternal & Antenatal OPD (Room 4)',
    shortName: 'MCH Antenatal (Room 4)',
    code: 'ANC-OPD',
    roomNumber: 'Room 4',
    leadDoctor: 'Dr. Anita Rao',
    doctorSpecialty: 'MBBS, MS (Obstetrics & Gynaecology)',
    receptionistName: 'Sister Mary Fernandez',
    department: 'Maternal & Child Health (MCH)',
    description: 'Routine & high-risk antenatal care, gestational screening, ultrasound biometry review.',
    colorTheme: 'teal',
    city: 'Hubballi-Dharwad',
    state: 'Karnataka',
    pincode: '580020',
    geoLocation: {
      latitude: 15.3647,
      longitude: 75.1240,
      addressLine: 'Room 4, MCH Wing, Ground Floor, District Hospital',
      locality: 'Dharwad Road Campus',
      city: 'Hubballi-Dharwad',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580020',
      landmark: 'Beside Ultrasound Sonography Room',
      plusCode: '9H7F+VQ Hubballi'
    }
  },
  {
    id: 'opd-gen',
    name: 'General Medicine OPD (Room 1)',
    shortName: 'General Medicine (Room 1)',
    code: 'GEN-OPD',
    roomNumber: 'Room 1',
    leadDoctor: 'Dr. Rajesh Kulkarni',
    doctorSpecialty: 'MBBS, MD (General Medicine)',
    receptionistName: 'Vikas Patil',
    department: 'Internal Medicine',
    description: 'Chronic disease management, hypertension, Type 2 diabetes mellitus, metabolic health.',
    colorTheme: 'blue',
    city: 'Hubballi-Dharwad',
    state: 'Karnataka',
    pincode: '580020',
    geoLocation: {
      latitude: 15.3649,
      longitude: 75.1243,
      addressLine: 'Room 1, Main Clinical Block, District Hospital',
      locality: 'Dharwad Road Campus',
      city: 'Hubballi-Dharwad',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580020',
      landmark: 'Near Central Triage Desk',
      plusCode: '9H7F+WQ Hubballi'
    }
  },
  {
    id: 'opd-ped',
    name: 'Pediatric & Child Health OPD (Room 2)',
    shortName: 'Pediatrics (Room 2)',
    code: 'PED-OPD',
    roomNumber: 'Room 2',
    leadDoctor: 'Dr. Sneha Patil',
    doctorSpecialty: 'MBBS, DCH (Pediatrics)',
    receptionistName: 'Meghana R.',
    department: 'Pediatrics & Neonatology',
    description: 'Under-5 developmental growth, infant immunization, pediatric fever, and respiratory illness.',
    colorTheme: 'purple',
    city: 'Hubballi-Dharwad',
    state: 'Karnataka',
    pincode: '580020',
    geoLocation: {
      latitude: 15.3645,
      longitude: 75.1238,
      addressLine: 'Room 2, Paediatric Block, District Hospital',
      locality: 'Dharwad Road Campus',
      city: 'Hubballi-Dharwad',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580020',
      landmark: 'Beside Immunization Clinic & Play Area',
      plusCode: '9H7F+UQ Hubballi'
    }
  }
];

// --- Localized Multilingual Notification Helpers (Hindi, Bengali, English) ---
export function getLocalizedTokenMessage(
  patientName: string,
  token: number,
  doctor: string,
  clinic: string,
  language: 'Hindi' | 'Bengali' | 'English' = 'English'
): string {
  if (language === 'Hindi') {
    return `नमस्ते ${patientName} जी, आपका ओपीडी पंजीकरण सफल हुआ।\n📋 टोकन संख्या: #${token}\n🩺 परामर्श डॉक्टर: ${doctor} (${clinic})\n⏱️ अनुमानित प्रतीक्षा समय: 10-15 मिनट। आपकी बारी आने पर संदेश भेजा जाएगा।`;
  }
  if (language === 'Bengali') {
    return `নমস্কার ${patientName}, আপনার ওপিডি রেজিস্ট্রেশন সম্পন্ন হয়েছে।\n📋 টোকেন নং: #${token}\n🩺 পরামর্শক চিকিৎসক: ${doctor} (${clinic})\n⏱️ আনুমানিক অপেক্ষা: 10-15 মিনিট। আপনার ডাক এলে মেসেজ পাবেন।`;
  }
  return `Your OPD registration is complete. Welcome ${patientName}, Token #${token} for ${doctor} (${clinic}). Estimated wait: 10-15 mins.`;
}

export function getLocalizedCallingMessage(
  doctor: string,
  room: string,
  language: 'Hindi' | 'Bengali' | 'English' = 'English'
): string {
  if (language === 'Hindi') {
    return `🔔 बुलावा: डॉ. ${doctor} आपको परामर्श कक्ष (${room}) में बुला रहे हैं। कृपया तुरंत अंदर पधारें।`;
  }
  if (language === 'Bengali') {
    return `🔔 ওপিডি কল: ডঃ ${doctor} আপনাকে পরামর্শ রুম (${room})-এ ডাকছেন। অনুগ্রহ করে ভেতরে আসুন।`;
  }
  return `Dr. ${doctor} is calling you now. Please proceed inside Consultation Room ${room}.`;
}

export function getLocalizedRxMessage(
  patientName: string,
  pharmacyName: string,
  distance: string,
  token: string,
  medicinesText: string,
  discountOffer: string,
  language: 'Hindi' | 'Bengali' | 'English' = 'English'
): string {
  if (language === 'Hindi') {
    return `💊 ई-प्रिस्क्रिप्शन सूचना:\nनमस्ते ${patientName} जी, डॉक्टर द्वारा लिखी गई दवाइयों की पर्ची डिजिटल रूप से भेज दी गई है।\n🏬 मेडिकल स्टोर: ${pharmacyName} (${distance})\n🎟️ पिकअप टोकन: #${token}\n\nदवाइयां:\n${medicinesText}\n\n💡 ${discountOffer}। काउंटर पर टोकन #${token} दिखाकर दवाइयां प्राप्त करें।`;
  }
  if (language === 'Bengali') {
    return `💊 ডিজিটাল প্রেসক্রিপশন:\nনমস্কার ${patientName}, ডাক্তারের নির্দেশিত ওষুধের প্রেসক্রিপশন পাঠানো হয়েছে।\n🏬 ফার্মেসি: ${pharmacyName} (${distance})\n🎟️ পিকআপ টোকেন: #${token}\n\nওষুধের তালিকা:\n${medicinesText}\n\n💡 ${discountOffer}। কাউন্টারে টোকেন #${token} প্রদর্শন করে ওষুধ সংগ্রহ করুন।`;
  }
  return `Hello ${patientName}, your doctor prescription has been scanned and referred to the pharmacy.\n\n🏥 Pharmacy: ${pharmacyName} (${distance})\n🎟️ Pickup Token: #${token}\n\nPrescribed Medicines:\n${medicinesText}\n\n${discountOffer}. Please present Token #${token} at the counter for pickup.`;
}

export function getLocalizedLabMessage(
  patientName: string,
  labName: string,
  distance: string,
  testName: string,
  priority: string,
  token: number,
  language: 'Hindi' | 'Bengali' | 'English' = 'English'
): string {
  if (language === 'Hindi') {
    return `🧪 जांच (Lab) आदेश:\nनमस्ते ${patientName} जी, आपके लिए जांच आदेशित की गई है:\n🔬 जांच: ${testName}\n🏥 डायग्नोस्टिक केंद्र: ${labName} (${distance})\n⚡ प्राथमिकता: ${priority}\n📦 ओपीडी से नमूना कूरियर द्वारा सुरक्षित भेजा जाएगा। रिपोर्ट आते ही आपको सूचित किया जाएगा।`;
  }
  if (language === 'Bengali') {
    return `🧪 ল্যাব পরীক্ষার নির্দেশিকা:\nনমস্কার ${patientName}, আপনার জন্য ল্যাব টেস্টের নির্দেশ দেওয়া হয়েছে:\n🔬 পরীক্ষা: ${testName}\n🏥 ডায়াগনস্টিক সেন্টার: ${labName} (${distance})\n⚡ অগ্রাধিকার: ${priority}\n📦 ওপিডি থেকে নমুনা ল্যাবে পাঠানো হচ্ছে। রিপোর্ট তৈরি হলে সরাসরি হোয়াটসঅ্যাপে পাবেন।`;
  }
  return `Hello ${patientName}, a laboratory investigation has been ordered for your OPD Visit (Token #${token}):\n• Test: ${testName}\n• Referral Lab: ${labName} (${distance})\n• Priority: ${priority}\nPlease present your Token #${token} at the laboratory desk.`;
}

export function getLocalizedAiFollowUp(patient: OpdPatient): string {
  const lang = patient.preferredLanguage || 'English';
  const followUpDate = patient.followUpDate || 'আগামী ৭ দিনে';
  const doctor = patient.assignedDoctor || 'Dr. Anita Rao';

  if (lang === 'Hindi') {
    let careAdvice = patient.isPregnant 
      ? 'कृपया प्रतिदिन आयरन (IFA) और कैल्शियम की गोलियां 2 घंटे के अंतर पर लें। पौष्टिक आहार और पर्याप्त पानी लें।'
      : patient.clinicId === 'opd-gen'
      ? 'कृपया अपनी बीपी और शुगर की दवाइयां नियमित समय पर लें और नमक व मीठे का परहेज रखें।'
      : 'कृपया बच्चे को समय पर दवाइयां दें और पर्याप्त तरल पदार्थ पिलाएं।';

    return `🤖 अस्पताल एआई अनुवर्ती सेवा (AI Follow-up Care) — ${doctor}\n\nनमस्ते ${patient.name} जी,\nओपीडी परामर्श के बाद यह आपकी स्वास्थ्य जांच का नियमित अनुवर्ती संदेश है।\n\n📌 आपकी अगली ओपीडी तारीख: ${followUpDate}\n💊 देखभाल निर्देश: ${careAdvice}\n${patient.followUpInstruction ? `📝 डॉक्टर की विशेष सलाह: ${patient.followUpInstruction}\n` : ''}\nयदि कोई असामान्य लक्षण या तकलीफ हो तो तुरंत ओपीडी में संपर्क करें। स्वस्थ रहें!`;
  }

  if (lang === 'Bengali') {
    let careAdvice = patient.isPregnant 
      ? 'নিয়মিত আয়রন ও ক্যালসিয়াম ট্যাবলেট গ্রহণ করবেন। পুষ্টিকর খাদ্য ও পর্যাপ্ত জল পান করুন।'
      : patient.clinicId === 'opd-gen'
      ? 'রক্তচাপ ও সুগারের ওষুধ নিয়ম মেনে সেবন করবেন এবং খাদ্য নিয়ন্ত্রণ বজায় রাখুন।'
      : 'শিশুকে সময়মতো ওষুধ খাওয়ান ও বিশ্রাম দিন।';

    return `🤖 এআই স্বাস্থ্য ফলো-আপ পরিষেবা — ${doctor}\n\nনমস্কার ${patient.name},\nওপিডি পরামর্শের পর আপনার সুস্থতা নিশ্চিত করতে এই স্বয়ংক্রিয় ফলো-আপ বার্তা।\n\n📌 পরবর্তী সাক্ষাতের তারিখ: ${followUpDate}\n💊 স্বাস্থ্য নির্দেশিকা: ${careAdvice}\n${patient.followUpInstruction ? `📝 ডাক্তারের পরামর্শ: ${patient.followUpInstruction}\n` : ''}\nকোনো শারীরিক সমস্যা দেখা দিলে অবিলম্বে হাসপাতালে যোগাযোগ করুন। ভালো থাকুন!`;
  }

  return `🤖 AI Follow-up Care Assistant — ${doctor}\n\nHello ${patient.name},\nThis is an automated follow-up check regarding your recent consultation.\n\n📌 Scheduled Next Visit: ${followUpDate}\n${patient.followUpInstruction ? `📝 Doctor's Instruction: ${patient.followUpInstruction}\n` : ''}Please continue taking your prescribed medications. Contact the hospital if you experience any acute symptoms.`;
}

export const INITIAL_PATIENTS: OpdPatient[] = [
  // 1. Sunita Das (Deck primary MVP patient)
  {
    id: 'PAT-104',
    opdId: 'OPD-2026-104',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 1,
    name: 'Sunita Das',
    age: 28,
    dob: '1998-04-12',
    gender: 'female',
    mobile: '+91 98452 11029',
    abhaId: '91-8842-1049-2311',
    address: 'Unkal, Hubballi, Karnataka - 580031',
    isPregnant: true,
    pregnancyDetails: {
      gravida: 2,
      para: 1,
      gestationalAgeWeeks: 28,
      edd: '15 Dec 2026',
      lmp: '02 Mar 2026',
      previousChildren: 1,
      previousOutcome: 'Normal delivery',
      currentPregnancyType: 'Singleton',
      clinicalFlags: ['Rh Negative (O-)', 'Mild Anaemia']
    },
    previousOpdRecords: [
      {
        date: '15 Sep 2026',
        type: 'ANC follow-up',
        outcome: 'Routine follow-up, vitals stable, advised OGTT scheduling',
        doctor: 'Dr. Anita Rao'
      },
      {
        date: '18 Aug 2026',
        type: 'ANC',
        outcome: 'Ultrasound reviewed (TIFFA scan: no gross structural anomalies)',
        doctor: 'Dr. Anita Rao'
      },
      {
        date: '20 Jul 2026',
        type: 'ANC',
        outcome: 'Routine booking follow-up, baseline bloods initiated',
        doctor: 'Dr. Anita Rao'
      }
    ],
    clinicalGist: {
      headline: 'Sunita Das — 28 years · G2P1 · 28 weeks pregnant',
      summaryText: 'Previous one child. Current pregnancy at 28 weeks. Previous records show O-negative blood group and Hb 10.2 g/dL. Last ultrasound recorded on 18 August. Glucose test has not yet been recorded.',
      importantRecords: {
        bloodGroup: 'O Negative',
        hb: '10.2 g/dL',
        previousChildren: 1,
        lastScan: '18 Aug 2026',
        lastOpd: '15 Sep 2026',
        currentGestation: '28 weeks',
        glucose: 'Pending / Not recorded'
      },
      relevantRecords: {
        bloodGroup: 'O Negative',
        hb: '10.2 g/dL',
        previousChildren: 1,
        lastScan: '18 Aug 2026',
        lastOpd: '15 Sep 2026',
        currentGestation: '28 weeks',
        glucose: 'Pending / Not recorded'
      },
      isAiGenerated: true
    },
    visitReason: 'ANC Follow-up (Routine antenatal follow-up)',
    visitType: 'ANC',
    queueStatus: 'Waiting',
    waitingSince: '09:15 AM',
    assignedDoctor: 'Dr. Anita Rao',
    hasAbhaConsent: true,
    preferredLanguage: 'Bengali',
    consultationFee: 0,
    billingScheme: 'JSSK / NHM (Free Antenatal)',
    visitDate: '10 Oct 2026',
    followUpDate: '15 Oct 2026',
    followUpStatus: 'Scheduled',
    followUpInstruction: 'Return after completing Glucose test and taking prescribed IFA',
    vitals: {
      bp: '118/76 mmHg',
      weightKg: 58.5,
      pulse: 78,
      fundalHeightCm: 28,
      foetalHeartRate: '142 bpm'
    },
    whatsappMessages: [
      {
        id: 'WA-001',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'নমস্কার Sunita Das, আপনার ওপিডি রেজিস্ট্রেশন সম্পন্ন হয়েছে। টোকেন #1 (ডঃ অনিতা রাও, রুম 4, ম্যাটারনাল ওপিডি)। আনুমানিক অপেক্ষা: 10 মিনিট।',
        timestamp: '09:15 AM',
        delivered: true
      }
    ],
    labReferrals: [
      {
        id: 'REF-001',
        opdId: 'OPD-2026-104',
        patientId: 'PAT-104',
        patientName: 'Sunita Das',
        patientAge: 28,
        patientGestation: '28 wks',
        testName: 'Complete Blood Count (CBC) with Peripheral Smear',
        category: 'Haematology',
        priority: 'Routine',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: '09:20 AM',
        status: 'SAMPLE RECEIVED',
        relevantClinicalHistory: 'G2P1 at 28w, evaluate nutritional anemia and microcytosis'
      }
    ],
    labOrders: [
      {
        id: 'REF-001',
        opdId: 'OPD-2026-104',
        patientId: 'PAT-104',
        patientName: 'Sunita Das',
        patientAge: 28,
        patientGestation: '28 wks',
        testName: 'Complete Blood Count (CBC) with Peripheral Smear',
        category: 'Haematology',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: '09:20 AM',
        sampleStatus: 'Sample Received',
        reportStatus: 'Pending'
      }
    ],
    timeline: [
      {
        id: 'TL-01',
        date: '10 Oct 2026',
        time: '09:15 AM',
        title: 'OPD registration complete',
        actor: 'Receptionist Pooja',
        details: 'ABHA verified: 91-8842-1049-2311. Token #1 assigned.'
      },
      {
        id: 'TL-02',
        date: '10 Oct 2026',
        time: '09:16 AM',
        title: 'WhatsApp token confirmation sent',
        actor: 'Continuum Automated System',
        details: 'Delivered to +91 98452 11029'
      }
    ]
  },

  // 2. Meena Roy (PCOS & Menstrual Health Consultation)
  {
    id: 'PAT-103',
    opdId: 'OPD-2026-103',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 2,
    name: 'Meena Roy',
    age: 31,
    dob: '1995-09-24',
    gender: 'female',
    mobile: '+91 98860 44219',
    abhaId: '91-6543-9821-4455',
    address: 'Gokul Road, Hubballi',
    isPregnant: false,
    previousOpdRecords: [
      {
        date: '28 Aug 2026',
        type: 'Gynaecology',
        outcome: 'Baseline pelvic examination, endocrine screen recommended for cycle irregularity',
        doctor: 'Dr. Anita Rao'
      }
    ],
    clinicalGist: {
      headline: 'Meena Roy — 31 years · Menstrual Health & PCOS Evaluation',
      summaryText: 'Consultation for irregular cycles and hormonal evaluation. Baseline vitals stable. Pelvic ultrasound and endocrine screen requested for review.',
      importantRecords: {
        bloodGroup: 'B Positive',
        hb: '12.4 g/dL',
        glucose: '92 mg/dL (Normal)',
        conditionSummary: 'Oligomenorrhoea x 6 months, suspected PCOS',
        screeningStatus: 'Endocrine panel sample received in lab'
      },
      relevantRecords: {
        bloodGroup: 'B Positive',
        hb: '12.4 g/dL',
        glucose: '92 mg/dL (Normal)',
        conditionSummary: 'Oligomenorrhoea x 6 months, suspected PCOS',
        screeningStatus: 'Endocrine panel sample received in lab'
      },
      isAiGenerated: false
    },
    visitReason: 'PCOS & Menstrual Irregularities Consultation',
    visitType: 'Gynaecology',
    queueStatus: 'With Doctor',
    waitingSince: '09:05 AM',
    assignedDoctor: 'Dr. Anita Rao',
    hasAbhaConsent: true,
    preferredLanguage: 'Hindi',
    consultationFee: 300,
    billingScheme: 'General (Paid)',
    visitDate: '10 Oct 2026',
    followUpDate: '24 Oct 2026',
    followUpStatus: 'Scheduled',
    followUpInstruction: 'Return with pelvic ultrasound & fasting endocrine blood reports for clinical review',
    vitals: {
      bp: '122/80 mmHg',
      weightKg: 62.0,
      pulse: 82
    },
    whatsappMessages: [
      {
        id: 'WA-002',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'नमस्ते Meena Roy जी, आपका ओपीडी पंजीकरण पूरा हुआ। टोकन #2 (डॉ. अनीता राव, कमरा 4)।',
        timestamp: '09:05 AM',
        delivered: true
      },
      {
        id: 'WA-003',
        direction: 'outgoing',
        type: 'doctor_calling',
        text: '🔔 बुलावा: डॉ. अनीता राव आपको परामर्श कक्ष (कमरा 4) में बुला रही हैं। कृपया तुरंत अंदर पधारें।',
        timestamp: '09:30 AM',
        delivered: true
      }
    ],
    labReferrals: [
      {
        id: 'REF-002',
        opdId: 'OPD-2026-103',
        patientId: 'PAT-103',
        patientName: 'Meena Roy',
        patientAge: 31,
        testName: 'Endocrine Panel (FSH, LH, Prolactin, TSH)',
        priority: 'Routine',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: '09:35 AM',
        status: 'SAMPLE RECEIVED',
        relevantClinicalHistory: 'Gynaecology consultation, irregular menses workup'
      }
    ],
    labOrders: [
      {
        id: 'REF-002',
        opdId: 'OPD-2026-103',
        patientId: 'PAT-103',
        patientName: 'Meena Roy',
        patientAge: 31,
        testName: 'Endocrine Panel (FSH, LH, Prolactin, TSH)',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: '09:35 AM',
        sampleStatus: 'Sample Received',
        reportStatus: 'Pending'
      }
    ],
    timeline: [
      {
        id: 'TL-03',
        date: '10 Oct 2026',
        time: '09:05 AM',
        title: 'OPD registration',
        actor: 'Receptionist Pooja'
      },
      {
        id: 'TL-04',
        date: '10 Oct 2026',
        time: '09:30 AM',
        title: 'Consultation commenced — Dr. Anita Rao',
        actor: 'Dr. Anita Rao'
      },
      {
        id: 'TL-05',
        date: '10 Oct 2026',
        time: '09:35 AM',
        title: 'Endocrine blood sample received by Pathologist',
        actor: 'Pathologist Dr. Ramesh'
      }
    ]
  },

  // 3. Anjali Sen (Gynaecology Investigation & Report Review)
  {
    id: 'PAT-102',
    opdId: 'OPD-2026-102',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 3,
    name: 'Anjali Sen',
    age: 29,
    dob: '1997-11-05',
    gender: 'female',
    mobile: '+91 94481 99014',
    abhaId: 'Skipped (Consent Declined)',
    address: 'Vidyanagar, Hubballi',
    isPregnant: false,
    hasAbhaConsent: false,
    preferredLanguage: 'Bengali',
    consultationFee: 300,
    billingScheme: 'General (Paid)',
    visitDate: '10 Oct 2026',
    previousOpdRecords: [
      {
        date: '12 Sep 2026',
        type: 'Gynaecology',
        outcome: 'Hb evaluated at 9.8 g/dL due to menorrhagia, oral iron prescribed, repeat CBC ordered',
        doctor: 'Dr. Anita Rao'
      }
    ],
    clinicalGist: {
      headline: 'Anjali Sen — 29 years · Menorrhagia & CBC Report Review',
      summaryText: 'Follow-up for abnormal heavy menstrual bleeding and iron deficiency. Pathologist Dr. Ramesh has released verified CBC report showing Hb 10.8 g/dL.',
      importantRecords: {
        bloodGroup: 'A Positive',
        hb: '10.8 g/dL (Improved from 9.8 g/dL)',
        conditionSummary: 'Menorrhagia on oral iron therapy',
        screeningStatus: 'CBC verified and released by Dr. Ramesh'
      },
      relevantRecords: {
        bloodGroup: 'A Positive',
        hb: '10.8 g/dL (Improved from 9.8 g/dL)',
        conditionSummary: 'Menorrhagia on oral iron therapy',
        screeningStatus: 'CBC verified and released by Dr. Ramesh'
      },
      isAiGenerated: false
    },
    visitReason: 'Investigation & Report Review (Gynaecology & CBC Report)',
    visitType: 'Follow-up',
    queueStatus: 'Completed',
    waitingSince: '09:20 AM',
    assignedDoctor: 'Dr. Anita Rao',
    followUpDate: '10 Dec 2026',
    followUpStatus: 'Scheduled',
    followUpInstruction: 'Continue prescribed oral iron; return for routine 2-month review',
    doctorNotes: 'Reviewed CBC: Haemoglobin improved to 10.8 g/dL with normocytic picture. Heavy menstrual bleeding controlled. Continue maintenance iron therapy for 60 days.',
    assessmentOutcome: 'Investigation review consultation completed by Dr. Anita Rao. CBC report verified and discussed.',
    vitals: {
      bp: '120/78 mmHg',
      weightKg: 64.0,
      pulse: 80
    },
    whatsappMessages: [
      {
        id: 'WA-004',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'Your OPD registration is complete. Welcome Anjali Sen, Token #3.',
        timestamp: '09:20 AM',
        delivered: true
      },
      {
        id: 'WA-005',
        direction: 'outgoing',
        type: 'lab_ready',
        text: 'Your laboratory report is now available. CBC result: Hb 10.8 g/dL. Transmitted to Dr. Anita Rao.',
        timestamp: '09:45 AM',
        delivered: true
      }
    ],
    labReferrals: [
      {
        id: 'REF-003',
        opdId: 'OPD-2026-102',
        patientId: 'PAT-102',
        patientName: 'Anjali Sen',
        patientAge: 29,
        patientGestation: '32 wks',
        testName: 'Complete Blood Count (CBC / Hb)',
        priority: 'Routine',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: '09:25 AM',
        status: 'REPORT READY',
        reportSummary: 'Hb: 10.8 g/dL, Platelets: 2.2 Lakhs, RBC: Normocytic Normochromic',
        reportFileName: 'Anjali_Sen_CBC_Report.pdf',
        findings: 'Mild anaemia improved following oral iron therapy. Target Hb > 11 g/dL approaching term.',
        releasedAt: '09:45 AM',
        releasedBy: 'Pathologist Dr. Ramesh'
      }
    ],
    labOrders: [
      {
        id: 'REF-003',
        opdId: 'OPD-2026-102',
        patientId: 'PAT-102',
        patientName: 'Anjali Sen',
        patientAge: 29,
        patientGestation: '32 wks',
        testName: 'Complete Blood Count (CBC / Hb)',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: '09:25 AM',
        sampleStatus: 'Test Completed',
        reportStatus: 'Report Uploaded',
        reportSummary: 'Hb: 10.8 g/dL, Platelets: 2.2 Lakhs, RBC: Normocytic Normochromic',
        reportFileName: 'Anjali_Sen_CBC_Report.pdf',
        findings: 'Mild anaemia improved following oral iron therapy. Target Hb > 11 g/dL approaching term.',
        parameters: [
          { id: 'p1', name: 'Hemoglobin (Hb)', value: '10.8', numericValue: 10.8, unit: 'g/dL', referenceRange: '11.0 – 14.0', status: 'LOW', loincCode: '718-7' },
          { id: 'p2', name: 'Packed Cell Volume (PCV)', value: '33.2', numericValue: 33.2, unit: '%', referenceRange: '33.0 – 42.0', status: 'NORMAL', loincCode: '4544-3' },
          { id: 'p3', name: 'Total RBC Count', value: '3.92', numericValue: 3.92, unit: 'millions/mcL', referenceRange: '3.80 – 5.20', status: 'NORMAL', loincCode: '789-8' },
          { id: 'p4', name: 'Mean Corpuscular Volume (MCV)', value: '82.4', numericValue: 82.4, unit: 'fL', referenceRange: '80.0 – 96.0', status: 'NORMAL', loincCode: '777-3' },
          { id: 'p5', name: 'Platelet Count', value: '2.20', numericValue: 2.20, unit: 'Lakhs/mcL', referenceRange: '1.50 – 4.50', status: 'NORMAL', loincCode: '777-3' }
        ],
        abdmSyncStatus: 'SYNCED',
        abdmTxnId: 'ABDM-TXN-LAB-88129',
        abdmCareContextId: 'CC-LAB-REF-003',
        ocrConfidence: 99.4
      }
    ],
    timeline: [
      {
        id: 'TL-06',
        date: '10 Oct 2026',
        time: '09:20 AM',
        title: 'OPD registration',
        actor: 'Receptionist Pooja'
      },
      {
        id: 'TL-07',
        date: '10 Oct 2026',
        time: '09:25 AM',
        title: 'CBC requested',
        actor: 'Dr. Anita Rao'
      },
      {
        id: 'TL-08',
        date: '10 Oct 2026',
        time: '09:30 AM',
        title: 'Sample received in laboratory',
        actor: 'Pathologist Dr. Ramesh'
      },
      {
        id: 'TL-09',
        date: '10 Oct 2026',
        time: '09:45 AM',
        title: 'CBC report released — Pathologist',
        actor: 'Pathologist Dr. Ramesh',
        details: 'Hb: 10.8 g/dL. Automatic release to Dr. Anita Rao.'
      }
    ]
  },

  // 4. Farida Begum (One-Time Consultation / Preventive Screening)
  {
    id: 'PAT-101',
    opdId: 'OPD-2026-101',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 4,
    name: 'Farida Begum',
    age: 26,
    dob: '2000-07-19',
    gender: 'female',
    mobile: '+91 97412 88201',
    abhaId: '91-9923-4112-7801',
    address: 'Old Hubballi',
    isPregnant: false,
    previousOpdRecords: [],
    clinicalGist: {
      headline: 'Farida Begum — 26 years · Annual Preventive Screening & Wellness',
      summaryText: 'Annual well-woman examination completed. Pelvic exam and vitals within normal limits. Doctor documented routine wellness advice and recorded that no follow-up is required.',
      importantRecords: {
        bloodGroup: 'A Positive',
        hb: '12.8 g/dL',
        glucose: '88 mg/dL (Normal)',
        conditionSummary: 'Annual wellness exam completed',
        screeningStatus: 'Pap smear normal (NILM)'
      },
      relevantRecords: {
        bloodGroup: 'A Positive',
        hb: '12.8 g/dL',
        glucose: '88 mg/dL (Normal)',
        conditionSummary: 'Annual wellness exam completed',
        screeningStatus: 'Pap smear normal (NILM)'
      },
      isAiGenerated: false
    },
    visitReason: 'Preventive Health Check & Cervical Screening (Pap Smear)',
    visitType: 'Preventive',
    queueStatus: 'Completed',
    waitingSince: '08:45 AM',
    assignedDoctor: 'Dr. Anita Rao',
    followUpStatus: 'Not Required',
    followUpInstruction: 'Annual preventive screening normal. No immediate follow-up required. Return in 12 months for routine annual well-woman check.',
    doctorNotes: 'Annual well-woman screening exam normal. Cervical cytology verified normal. Counseled on preventive nutrition, pelvic wellness, and routine screening intervals. No subsequent visits required at present.',
    assessmentOutcome: 'One-time preventive consultation completed. Doctor recorded no follow-up required.',
    prescriptions: ['Tab. Multivitamin & Zinc 1 daily x 30 days'],
    vitals: {
      bp: '116/74 mmHg',
      weightKg: 54.0,
      pulse: 74
    },
    pharmacyOrders: [],
    whatsappMessages: [
      {
        id: 'WA-006',
        direction: 'outgoing',
        type: 'follow_up',
        text: 'Dr. Anita Rao has recorded your preventive screening checkup as complete. Your reports are normal. Routine next check in 1 year.',
        timestamp: '09:50 AM',
        delivered: true
      }
    ],
    labReferrals: [],
    labOrders: [],
    timeline: [
      {
        id: 'TL-10',
        date: '10 Oct 2026',
        time: '08:45 AM',
        title: 'OPD registration',
        actor: 'Receptionist Pooja'
      },
      {
        id: 'TL-11',
        date: '10 Oct 2026',
        time: '09:10 AM',
        title: 'Preventive consultation completed — Dr. Anita Rao',
        actor: 'Dr. Anita Rao',
        details: 'Examination normal. No follow-up required.'
      }
    ]
  },

  // 5. Rameshwar Patil (General Medicine OPD Room 1 - Chronic Care)
  {
    id: 'PAT-201',
    opdId: 'OPD-2026-201',
    clinicId: 'opd-gen',
    clinicName: 'General Medicine OPD (Room 1)',
    tokenNumber: 1,
    name: 'Rameshwar Patil',
    age: 54,
    dob: '1972-03-14',
    gender: 'male',
    mobile: '+91 94482 77011',
    abhaId: '91-5512-8801-9923',
    address: 'Keshwapur, Hubballi',
    isPregnant: false,
    clinicalGist: {
      headline: 'Rameshwar Patil — 54 years · Male · Type 2 DM & HTN',
      summaryText: 'Known case of Type 2 Diabetes Mellitus & Hypertension on dual pharmacotherapy. Fasting blood sugar & HbA1c surveillance ordered to Central Lab.',
      importantRecords: {
        bloodGroup: 'B Positive',
        hb: '13.8 g/dL',
        previousChildren: 'N/A',
        lastScan: 'ECG Normal',
        lastOpd: '12 Aug 2026',
        currentGestation: 'N/A',
        glucose: '168 mg/dL (Elevated)'
      },
      relevantRecords: {
        bloodGroup: 'B Positive',
        hb: '13.8 g/dL',
        previousChildren: 'N/A',
        lastScan: 'ECG Normal',
        lastOpd: '12 Aug 2026',
        currentGestation: 'N/A',
        glucose: '168 mg/dL (Elevated)'
      },
      isAiGenerated: true
    },
    visitReason: 'Diabetes & Hypertension routine monthly review',
    visitType: 'General',
    queueStatus: 'Completed',
    waitingSince: '09:00 AM',
    assignedDoctor: 'Dr. Rajesh Kulkarni',
    followUpDate: '10 Nov 2026',
    vitals: {
      bp: '138/88 mmHg',
      weightKg: 72.0,
      pulse: 76
    },
    doctorNotes: 'BP 138/88 mmHg. Advised Fasting Blood Sugar and HbA1c to Central Lab. Metformin 500mg bd & Telmisartan 40mg od continued.',
    prescriptions: ['Tab. Metformin 500mg bd', 'Tab. Telmisartan 40mg od'],
    pharmacyOrders: [
      {
        id: 'PHARM-201',
        tokenNumber: 'RX-201',
        opdId: 'OPD-2026-201',
        clinicId: 'opd-gen',
        clinicName: 'General Medicine OPD (Room 1)',
        patientId: 'PAT-201',
        patientName: 'Rameshwar Patil',
        patientMobile: '+91 94482 77011',
        doctorName: 'Dr. Rajesh Kulkarni',
        prescribedAt: '09:20 AM',
        scannedAt: '09:25 AM',
        scannedBy: 'Receptionist Vikas',
        pharmacyId: 'pharm-inhouse',
        pharmacyName: 'Hospital Central Pharmacy — Counter 3',
        pharmacyLocation: 'OPD Ground Floor (Beside Room 4 & Lab)',
        status: 'READY_FOR_PICKUP',
        medicines: [
          {
            id: 'med-201-1',
            medicineName: 'Tab. Metformin Hydrochloride 500mg',
            dosage: '500mg',
            frequency: 'Twice daily (BD)',
            timing: 'After breakfast and after dinner',
            duration: '30 days',
            quantity: 60,
            instructions: 'Take with food to minimize GI upset',
            isJanAushadhiAvailable: true,
            genericEquivalent: 'Metformin Tab 500mg (PMBJP Price: ₹18 for 60 tabs)'
          },
          {
            id: 'med-201-2',
            medicineName: 'Tab. Telmisartan 40mg',
            dosage: '40mg',
            frequency: 'Once daily (OD)',
            timing: 'Morning after food',
            duration: '30 days',
            quantity: 30,
            instructions: 'Maintain consistent morning intake',
            isJanAushadhiAvailable: true,
            genericEquivalent: 'Telmisartan Tab 40mg (PMBJP Price: ₹24 for 30 tabs)'
          }
        ],
        pickupInstructions: 'Show Token #RX-201 at Counter 3. Subsidized OPD concession.'
      }
    ],
    labReferrals: [
      {
        id: 'REF-201',
        opdId: 'OPD-2026-201',
        clinicId: 'opd-gen',
        clinicName: 'General Medicine OPD (Room 1)',
        patientId: 'PAT-201',
        patientName: 'Rameshwar Patil',
        patientAge: 54,
        testName: 'Blood Glucose (Fasting & Post-Prandial)',
        priority: 'Routine',
        requestedBy: 'Dr. Rajesh Kulkarni',
        requestedAt: '09:20 AM',
        status: 'SAMPLE RECEIVED',
        relevantClinicalHistory: 'Type 2 Diabetes mellitus monitoring'
      },
      {
        id: 'REF-202',
        opdId: 'OPD-2026-201',
        clinicId: 'opd-gen',
        clinicName: 'General Medicine OPD (Room 1)',
        patientId: 'PAT-201',
        patientName: 'Rameshwar Patil',
        patientAge: 54,
        testName: 'Glycated Haemoglobin (HbA1c)',
        priority: 'Routine',
        requestedBy: 'Dr. Rajesh Kulkarni',
        requestedAt: '09:20 AM',
        status: 'PROCESSING',
        relevantClinicalHistory: '3-month glycemic control evaluation'
      }
    ],
    labOrders: [],
    whatsappMessages: [
      {
        id: 'WA-201',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'Your registration at General Medicine OPD (Room 1) is complete. Token #1 for Dr. Rajesh Kulkarni.',
        timestamp: '09:00 AM',
        delivered: true
      }
    ],
    timeline: [
      {
        id: 'TL-201',
        date: '10 Oct 2026',
        time: '09:20 AM',
        title: 'Prescribed Metformin & Telmisartan',
        actor: 'Dr. Rajesh Kulkarni',
        details: 'Routed to Central Pharmacy (Token #RX-201) and Central Lab (HbA1c, FBS).'
      }
    ]
  },

  // 6. Baby Aarav Hegde (Pediatric & Child Health OPD Room 2 - Acute Fever)
  {
    id: 'PAT-301',
    opdId: 'OPD-2026-301',
    clinicId: 'opd-ped',
    clinicName: 'Pediatric & Child Health OPD (Room 2)',
    tokenNumber: 1,
    name: 'Baby Aarav Hegde',
    age: 1,
    dob: '2025-08-10',
    gender: 'male',
    mobile: '+91 98860 11982',
    abhaId: '91-3341-9920-5541',
    address: 'Bhairidevarakoppa, Hubballi',
    isPregnant: false,
    clinicalGist: {
      headline: 'Baby Aarav Hegde — 14 months · Male · Acute Respiratory Check',
      summaryText: 'Toddler presented with high fever (38.8 C) and productive cough for 3 days. Complete Blood Count ordered to rule out bacterial bronchopneumonia.',
      importantRecords: {
        bloodGroup: 'O Positive',
        hb: '11.2 g/dL',
        previousChildren: 'N/A',
        lastScan: 'None',
        lastOpd: 'First Visit',
        currentGestation: 'N/A',
        glucose: 'Normal'
      },
      relevantRecords: {
        bloodGroup: 'O Positive',
        hb: '11.2 g/dL',
        previousChildren: 'N/A',
        lastScan: 'None',
        lastOpd: 'First Visit',
        currentGestation: 'N/A',
        glucose: 'Normal'
      },
      isAiGenerated: true
    },
    visitReason: 'High fever (38.8 C) & persistent cough for 3 days',
    visitType: 'Pediatric',
    queueStatus: 'With Doctor',
    waitingSince: '09:25 AM',
    assignedDoctor: 'Dr. Sneha Patil',
    vitals: {
      bp: 'Normal',
      weightKg: 10.4,
      pulse: 118
    },
    doctorNotes: 'Bilateral rhonchi present. Prescribed oral Amoxicillin pediatric suspension & Paracetamol. CBC ordered to check infection.',
    prescriptions: ['Syp. Amoxicillin 125mg/5ml - 5ml tds', 'Syp. Paracetamol 120mg/5ml - 5ml sos'],
    pharmacyOrders: [
      {
        id: 'PHARM-301',
        tokenNumber: 'RX-301',
        opdId: 'OPD-2026-301',
        clinicId: 'opd-ped',
        clinicName: 'Pediatric & Child Health OPD (Room 2)',
        patientId: 'PAT-301',
        patientName: 'Baby Aarav Hegde',
        patientMobile: '+91 98860 11982',
        doctorName: 'Dr. Sneha Patil',
        prescribedAt: '09:35 AM',
        scannedAt: '09:38 AM',
        scannedBy: 'Receptionist Meghana',
        pharmacyId: 'pharm-inhouse',
        pharmacyName: 'Hospital Central Pharmacy — Counter 3',
        pharmacyLocation: 'OPD Ground Floor (Beside Room 4 & Lab)',
        status: 'REFERRED',
        medicines: [
          {
            id: 'med-301-1',
            medicineName: 'Syp. Amoxicillin Trihydrate 125mg/5ml',
            dosage: '5ml',
            frequency: 'Thrice daily (TDS)',
            timing: 'Every 8 hours after feeding',
            duration: '5 days',
            quantity: 1,
            instructions: 'Complete full 5-day course. Reconstitute with boiled and cooled water.',
            isJanAushadhiAvailable: true,
            genericEquivalent: 'Amoxicillin Oral Suspension 125mg'
          },
          {
            id: 'med-301-2',
            medicineName: 'Syp. Paracetamol Pediatric 120mg/5ml',
            dosage: '5ml',
            frequency: 'SOS (When temp > 38.5 C)',
            timing: 'With gap of min 4-6 hours between doses',
            duration: '3 days',
            quantity: 1,
            instructions: 'Use calibrated dropper/cup provided.',
            isJanAushadhiAvailable: true,
            genericEquivalent: 'Paracetamol Paediatric Suspension'
          }
        ],
        pickupInstructions: 'Show Token #RX-301 at Counter 3. Free pediatric supply under NHM.'
      }
    ],
    labReferrals: [
      {
        id: 'REF-301',
        opdId: 'OPD-2026-301',
        clinicId: 'opd-ped',
        clinicName: 'Pediatric & Child Health OPD (Room 2)',
        patientId: 'PAT-301',
        patientName: 'Baby Aarav Hegde',
        patientAge: 1,
        testName: 'Complete Blood Count (CBC / Hb)',
        priority: 'Urgent',
        requestedBy: 'Dr. Sneha Patil',
        requestedAt: '09:35 AM',
        status: 'REQUESTED',
        relevantClinicalHistory: 'High fever 3 days, evaluate leukocytosis and shift to left'
      }
    ],
    labOrders: [],
    whatsappMessages: [
      {
        id: 'WA-301',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'Welcome to Pediatric OPD (Room 2). Token #1 for Dr. Sneha Patil.',
        timestamp: '09:25 AM',
        delivered: true
      }
    ],
    timeline: [
      {
        id: 'TL-301',
        date: '10 Oct 2026',
        time: '09:25 AM',
        title: 'Pediatric OPD token generated',
        actor: 'Receptionist Meghana'
      }
    ],
    vaccinationSchedule: generateNewbornVaccineSchedule('PAT-301', '2025-08-10', 60)
  },

  // 6b. Baby Reyansh (Newborn — 3 Weeks Old — Room 2 Pediatrics)
  {
    id: 'PAT-302',
    opdId: 'OPD-2026-302',
    clinicId: 'opd-ped',
    clinicName: 'Pediatric & Child Health OPD (Room 2)',
    tokenNumber: 2,
    name: 'Baby Reyansh (Newborn of Sunita Das)',
    age: 0,
    dob: '2026-09-20',
    gender: 'male',
    mobile: '+91 98452 33411',
    abhaId: '91-8842-1049-2311-C1',
    address: 'Unkal, Hubballi, Karnataka',
    isPregnant: false,
    isNewborn: true,
    birthDetails: {
      dateOfBirth: '2026-09-20',
      birthTime: '04:15 AM',
      birthWeightKg: 3.15,
      gestationWeeksAtBirth: 39,
      deliveryType: 'Normal Vaginal',
      apgarScore1Min: 8,
      apgarScore5Min: 9,
      motherPatientId: 'PAT-104',
      motherName: 'Sunita Das',
      bloodGroup: 'O Positive',
      mcpCardNumber: 'MCP-2026-8812'
    },
    clinicalGist: {
      headline: 'Baby Reyansh — 3 weeks old · Male · Newborn Health & Immunization Check',
      summaryText: 'Healthy term neonate (birth weight 3.15kg). Birth dose vaccines (BCG, OPV-0, Hep-B) given. Due for 6-week primary immunization (Pentavalent-1, OPV-1, Rotavirus-1, PCV-1, fIPV-1). Exclusive breastfeeding established.',
      importantRecords: {
        bloodGroup: 'O Positive',
        hb: '17.4 g/dL (Normal neonatal)',
        previousChildren: 'N/A',
        lastScan: 'Neonatal cranial USG Normal',
        lastOpd: 'First OPD Visit',
        currentGestation: '3 weeks postnatal',
        glucose: 'Normal (82 mg/dL)'
      },
      relevantRecords: {
        bloodGroup: 'O Positive',
        hb: '17.4 g/dL',
        previousChildren: 'N/A',
        lastScan: 'Normal',
        lastOpd: 'First OPD Visit',
        currentGestation: '3 weeks postnatal',
        glucose: '82 mg/dL'
      },
      isAiGenerated: true
    },
    visitReason: 'Newborn 3-week wellness evaluation & 6-week immunization booking',
    visitType: 'Newborn',
    queueStatus: 'Waiting',
    waitingSince: '09:40 AM',
    assignedDoctor: 'Dr. Sneha Patil',
    vitals: {
      bp: 'Normal neonatal',
      weightKg: 3.45,
      pulse: 136
    },
    doctorNotes: 'Vigorous baby, pink, good suckling reflex. Umbilical cord stump dry and healed. BCG scar developing on left arm. Hep-B 0 and OPV-0 documented in MCP card. Counseled mother on exclusive breastfeeding and scheduled 6-week pentavalent dose.',
    prescriptions: ['Drops Vitamin D3 400 IU (0.5ml once daily)', 'Oral rehydration & warmth counseling'],
    pharmacyOrders: [],
    labReferrals: [],
    labOrders: [],
    whatsappMessages: [
      {
        id: 'WA-302',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'নমস্কার Sunita Das, আপনার নবজাতক Baby Reyansh-এর পেডিয়াট্রিক ওপিডি রেজিস্ট্রেশন সম্পন্ন হয়েছে। টোকেন #2 (ডঃ স্নেহা পাটিল, রুম 2)।',
        timestamp: '09:40 AM',
        delivered: true
      }
    ],
    timeline: [
      {
        id: 'TL-302-1',
        date: '20 Sep 2026',
        time: '04:30 AM',
        title: 'Birth Dose Vaccines Administered',
        actor: 'Staff Nurse Radhika (Labour Room)',
        details: 'BCG (0.05ml ID left arm), OPV-0 (2 drops oral), Hepatitis B-0 (0.5ml IM left thigh) successfully administered within 2 hours of delivery.'
      },
      {
        id: 'TL-302-2',
        date: '10 Oct 2026',
        time: '09:40 AM',
        title: 'OPD registration token generated',
        actor: 'Receptionist Meghana'
      }
    ],
    vaccinationSchedule: generateNewbornVaccineSchedule('PAT-302', '2026-09-20', 3)
  },

  // 6c. Pooja Deshmukh (Postnatal Mother — PNC 6-Week Checkup — Room 4 Maternal OPD)
  {
    id: 'PAT-105',
    opdId: 'OPD-2026-105',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 5,
    name: 'Pooja Deshmukh',
    age: 26,
    gender: 'female',
    mobile: '+91 97412 88201',
    abhaId: '91-3312-7740-9912',
    address: 'Gokul Road, Hubballi, Karnataka',
    isPregnant: false,
    maternalStage: 'POSTNATAL_6WEEKS',
    visitType: 'PNC',
    postnatalDetails: {
      deliveryDate: '2026-08-30',
      deliveryHospital: 'District Hospital Hubballi',
      deliveryType: 'Cesarean (LSCS)',
      babyGender: 'Female',
      babyName: 'Baby Anvi',
      hadGdm: true,
      hadPreeclampsia: false,
      postpartumDay: 42,
      epdsScore: 4,
      antiDAdministered: false
    },
    clinicalGist: {
      headline: 'Pooja Deshmukh — 26 years · PNC Day 42 (6-Week Checkup) · History of GDM',
      summaryText: 'Postnatal mother delivered by LSCS 6 weeks ago. History of Gestational Diabetes Mellitus managed on diet. Requires 6-week postnatal 75g OGTT to evaluate for persistent glucose intolerance, postpartum Hb, and thyroid check.',
      importantRecords: {
        bloodGroup: 'B Positive',
        hb: '10.8 g/dL',
        previousChildren: 1,
        lastScan: 'Postnatal USG Pelvis Normal',
        lastOpd: '30 Aug 2026 (Delivery)',
        currentGestation: 'PNC 6 Weeks',
        glucose: '138 mg/dL (Antepartum GDM)'
      },
      relevantRecords: {
        bloodGroup: 'B Positive',
        hb: '10.8 g/dL',
        previousChildren: 1,
        lastScan: 'Normal',
        lastOpd: '30 Aug 2026',
        currentGestation: 'PNC 6 Weeks',
        glucose: 'Pending 6-week OGTT'
      },
      isAiGenerated: true
    },
    visitReason: 'PNC 6-Week Follow-up, Post-GDM 75g OGTT & Anemia evaluation',
    queueStatus: 'Waiting',
    waitingSince: '09:45 AM',
    assignedDoctor: 'Dr. Anita Rao',
    hasAbhaConsent: true,
    preferredLanguage: 'Hindi',
    consultationFee: 0,
    billingScheme: 'JSSK / NHM (Free Antenatal)',
    visitDate: '10 Oct 2026',
    vitals: {
      bp: '116/74 mmHg',
      weightKg: 62.0,
      pulse: 76
    },
    doctorNotes: 'PNC 6-week evaluation. Abdominal LSCS scar healthy and healed. No uterine tenderness or lochia. Ordered 75g 2-hour OGTT to reclassify diabetes status following GDM. Prescribed continuing IFA & Calcium.',
    prescriptions: ['Tab. Calcium 500mg + Vit D3 bd', 'Tab. Iron & Folic Acid od for 3 months'],
    pharmacyOrders: [],
    labReferrals: [
      {
        id: 'REF-105-1',
        opdId: 'OPD-2026-105',
        clinicId: 'opd-anc',
        clinicName: 'Maternal & Antenatal OPD (Room 4)',
        patientId: 'PAT-105',
        patientName: 'Pooja Deshmukh',
        patientAge: 26,
        testName: 'Postnatal 75g 2-hour Oral Glucose Tolerance Test (OGTT)',
        priority: 'Routine',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: '09:50 AM',
        status: 'REQUESTED',
        relevantClinicalHistory: 'PNC Day 42, reclassify GDM to rule out persistent Type 2 Diabetes'
      }
    ],
    labOrders: [],
    whatsappMessages: [
      {
        id: 'WA-105',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'नमस्ते Pooja Deshmukh जी, आपका प्रसवोत्तर (PNC) ओपीडी पंजीकरण सफल हुआ। टोकन #5 (डॉ. अनिता राव, कमरा 4)।',
        timestamp: '09:45 AM',
        delivered: true
      }
    ],
    timeline: [
      {
        id: 'TL-105-1',
        date: '10 Oct 2026',
        time: '09:45 AM',
        title: 'Postnatal OPD token generated',
        actor: 'Receptionist Pooja'
      }
    ]
  },

  // 6d. Kavita Patil (Antenatal Mother — 1st Trimester 10 Weeks — Room 4 Maternal OPD)
  {
    id: 'PAT-106',
    opdId: 'OPD-2026-106',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 6,
    name: 'Kavita Patil',
    age: 24,
    gender: 'female',
    mobile: '+91 94481 99201',
    abhaId: '91-4421-8890-1123',
    address: 'Keshwapur, Hubballi, Karnataka',
    isPregnant: true,
    maternalStage: 'PREGNANCY_1ST_TRIMESTER',
    visitType: 'ANC',
    pregnancyDetails: {
      gestationalAgeWeeks: 10,
      gravida: 1,
      para: 0,
      edd: '10 May 2027',
      lmp: '2026-08-03',
      previousChildren: 0,
      currentPregnancyType: 'Singleton',
      clinicalFlags: ['Primigravida', 'Early pregnancy booking']
    },
    clinicalGist: {
      headline: 'Kavita Patil — 24 years · Primigravida (G1P0) · 10 weeks gestation',
      summaryText: 'First trimester antenatal booking visit. Requires baseline investigations: Blood Grouping & Rh, CBC, TSH, Fasting Blood Sugar, Infectious disease screen (HIV, HBsAg, VDRL), Urine Routine, and Obstetric Dating Scan.',
      importantRecords: {
        bloodGroup: 'Pending booking',
        hb: '11.8 g/dL',
        previousChildren: 0,
        lastScan: 'Dating scan booked',
        lastOpd: 'First ANC visit',
        currentGestation: '10 weeks',
        glucose: 'Pending FBS'
      },
      relevantRecords: {
        bloodGroup: 'Pending',
        hb: '11.8 g/dL',
        previousChildren: 0,
        lastScan: 'Dating scan booked',
        lastOpd: 'First ANC visit',
        currentGestation: '10 weeks',
        glucose: 'Pending'
      },
      isAiGenerated: true
    },
    visitReason: '1st Trimester Antenatal Booking, Dating Scan & Early Screening Tests',
    queueStatus: 'Waiting',
    waitingSince: '09:50 AM',
    assignedDoctor: 'Dr. Anita Rao',
    hasAbhaConsent: true,
    preferredLanguage: 'English',
    consultationFee: 0,
    billingScheme: 'JSSK / NHM (Free Antenatal)',
    visitDate: '10 Oct 2026',
    vitals: {
      bp: '112/70 mmHg',
      weightKg: 52.0,
      pulse: 74
    },
    doctorNotes: 'G1P0 at 10 weeks. Mild morning nausea. Initiated Tab. Folic Acid 5mg od. Ordered mandatory 1st trimester antenatal testing panel: ABO/Rh, CBC, TSH, FBS, HIV/HBsAg/VDRL, Urine R/M and scheduled Dating Ultrasound with NT scan window.',
    prescriptions: ['Tab. Folic Acid 5mg od for 1st trimester', 'Tab. Doxylamine + Pyridoxine hs for morning sickness'],
    pharmacyOrders: [],
    labReferrals: [
      {
        id: 'REF-106-1',
        opdId: 'OPD-2026-106',
        clinicId: 'opd-anc',
        clinicName: 'Maternal & Antenatal OPD (Room 4)',
        patientId: 'PAT-106',
        patientName: 'Kavita Patil',
        patientAge: 24,
        testName: 'Blood Grouping & Rh Typing (ABO/RhD)',
        priority: 'Routine',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: '09:55 AM',
        status: 'REQUESTED',
        relevantClinicalHistory: 'Primigravida 1st trimester baseline'
      },
      {
        id: 'REF-106-2',
        opdId: 'OPD-2026-106',
        clinicId: 'opd-anc',
        clinicName: 'Maternal & Antenatal OPD (Room 4)',
        patientId: 'PAT-106',
        patientName: 'Kavita Patil',
        patientAge: 24,
        testName: 'Serum TSH (Thyroid Stimulating Hormone)',
        priority: 'Routine',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: '09:55 AM',
        status: 'REQUESTED',
        relevantClinicalHistory: 'Early pregnancy hypothyroidism screening'
      }
    ],
    labOrders: [],
    whatsappMessages: [
      {
        id: 'WA-106',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'Dear Kavita Patil, your 1st Trimester Antenatal registration is complete. Token #6 (Dr. Anita Rao, Room 4). Welcome to District Hospital Maternal OPD.',
        timestamp: '09:50 AM',
        delivered: true
      }
    ],
    timeline: [
      {
        id: 'TL-106-1',
        date: '10 Oct 2026',
        time: '09:50 AM',
        title: '1st Trimester ANC Token Generated',
        actor: 'Receptionist Pooja'
      }
    ]
  },

  // 7. Purnima Devi (Antenatal - Visited 09 Oct 2026 - Overdue Follow-up)
  {
    id: 'PAT-091',
    opdId: 'OPD-2026-091',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 4,
    name: 'Purnima Devi',
    age: 27,
    gender: 'female',
    mobile: '+91 97410 44921',
    abhaId: '91-4412-9901-3312',
    hasAbhaConsent: true,
    preferredLanguage: 'Hindi',
    consultationFee: 0,
    billingScheme: 'JSSK / NHM (Free Antenatal)',
    visitDate: '09 Oct 2026',
    isPregnant: true,
    pregnancyDetails: {
      gestationalAgeWeeks: 30,
      gravida: 2,
      para: 1,
      edd: '20 Dec 2026',
      clinicalFlags: ['Mild Anaemia']
    },
    clinicalGist: {
      headline: 'Purnima Devi — 27 years · G2P1 · 30 weeks',
      summaryText: 'Follow-up for oral iron response and foetal well-being.',
      importantRecords: { bloodGroup: 'B Positive', hb: '9.9 g/dL', previousChildren: 1, lastScan: 'Normal', lastOpd: '09 Oct 2026', currentGestation: '30 weeks', glucose: 'Normal' },
      relevantRecords: { bloodGroup: 'B Positive', hb: '9.9 g/dL', previousChildren: 1, lastScan: 'Normal', lastOpd: '09 Oct 2026', currentGestation: '30 weeks', glucose: 'Normal' },
      isAiGenerated: true
    },
    visitReason: 'Anaemia re-check & 30-week growth evaluation',
    queueStatus: 'Completed',
    assignedDoctor: 'Dr. Anita Rao',
    followUpDate: '22 Oct 2026',
    followUpStatus: 'Rescheduled',
    followUpInstruction: 'Patient-requested rescheduling due to family travel. Approved by Dr. Anita Rao. Rescheduled to 22 Oct 2026 (Adherence score protected).',
    aiFollowUpSent: false,
    whatsappMessages: [
      {
        id: 'WA-091',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'नमस्ते Purnima Devi जी, आपका ओपीडी पंजीकरण सफल हुआ। टोकन #4।',
        timestamp: '09:00 AM',
        delivered: true
      }
    ],
    labReferrals: [],
    labOrders: [],
    timeline: []
  },

  // 8. Amitava Mukherjee (General Medicine - Visited 09 Oct 2026)
  {
    id: 'PAT-092',
    opdId: 'OPD-2026-092',
    clinicId: 'opd-gen',
    clinicName: 'General Medicine OPD (Room 1)',
    tokenNumber: 5,
    name: 'Amitava Mukherjee',
    age: 62,
    gender: 'male',
    mobile: '+91 98450 33812',
    abhaId: '91-6621-3390-1122',
    hasAbhaConsent: true,
    preferredLanguage: 'Bengali',
    consultationFee: 500,
    billingScheme: 'Specialty OPD (Paid - ₹500)',
    visitDate: '09 Oct 2026',
    isPregnant: false,
    clinicalGist: {
      headline: 'Amitava Mukherjee — 62 years · Male · Post-angioplasty review',
      summaryText: 'Routine monthly cardiology-physician review. BP 130/82 mmHg.',
      importantRecords: { bloodGroup: 'O Positive', hb: '13.2 g/dL', previousChildren: 'N/A', lastScan: 'Echo normal', lastOpd: '09 Oct 2026', currentGestation: 'N/A', glucose: '112 mg/dL' },
      relevantRecords: { bloodGroup: 'O Positive', hb: '13.2 g/dL', previousChildren: 'N/A', lastScan: 'Echo normal', lastOpd: '09 Oct 2026', currentGestation: 'N/A', glucose: '112 mg/dL' },
      isAiGenerated: true
    },
    visitReason: 'Hypertension and cardiac medication renewal',
    queueStatus: 'Completed',
    assignedDoctor: 'Dr. Rajesh Kulkarni',
    followUpDate: '12 Oct 2026',
    followUpStatus: 'Scheduled',
    followUpInstruction: 'Repeat serum creatinine and lipid profile in 1 month',
    aiFollowUpSent: true,
    aiFollowUpNote: '🤖 এআই স্বাস্থ্য ফলো-আপ পরিষেবা — ডঃ রাজেশ কুলকার্নি\n\nনমস্কার Amitava Mukherjee,\nওপিডি পরামর্শের পর আপনার সুস্থতা কামনা করছি। আপনার পরবর্তী ফলো-আপ ১২ অক্টোবর তারিখে নির্ধারিত। কার্ডিয়াক ওষুধ নিয়মিত খাবেন।',
    whatsappMessages: [
      {
        id: 'WA-092',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'নমস্কার Amitava Mukherjee, আপনার ওপিডি রেজিস্ট্রেশন সম্পন্ন হয়েছে। টোকেন #5।',
        timestamp: '10:00 AM',
        delivered: true
      }
    ],
    labReferrals: [],
    labOrders: [],
    timeline: []
  },

  // 9. Rekha Sharma (Antenatal - Visited 08 Oct 2026 - ABHA Skipped)
  {
    id: 'PAT-081',
    opdId: 'OPD-2026-081',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 3,
    name: 'Rekha Sharma',
    age: 30,
    gender: 'female',
    mobile: '+91 94490 12890',
    abhaId: 'Skipped (Consent Declined)',
    hasAbhaConsent: false,
    preferredLanguage: 'Hindi',
    consultationFee: 0,
    billingScheme: 'JSSK / NHM (Free Antenatal)',
    visitDate: '08 Oct 2026',
    isPregnant: true,
    pregnancyDetails: {
      gestationalAgeWeeks: 24,
      gravida: 1,
      para: 0,
      edd: '28 Jan 2027'
    },
    clinicalGist: {
      headline: 'Rekha Sharma — 30 years · G1P0 · 24 weeks',
      summaryText: 'Routine second trimester checkup. ABHA voluntary consent declined.',
      importantRecords: { bloodGroup: 'A Positive', hb: '11.6 g/dL', previousChildren: 0, lastScan: 'Anomaly Scan normal', lastOpd: '08 Oct 2026', currentGestation: '24 weeks', glucose: 'Normal' },
      relevantRecords: { bloodGroup: 'A Positive', hb: '11.6 g/dL', previousChildren: 0, lastScan: 'Anomaly Scan normal', lastOpd: '08 Oct 2026', currentGestation: '24 weeks', glucose: 'Normal' },
      isAiGenerated: true
    },
    visitReason: 'Second trimester ultrasound and nutritional check',
    queueStatus: 'Completed',
    assignedDoctor: 'Dr. Anita Rao',
    followUpDate: '15 Oct 2026',
    followUpStatus: 'Scheduled',
    followUpInstruction: 'Glucose challenge test at 24 weeks',
    aiFollowUpSent: false,
    whatsappMessages: [
      {
        id: 'WA-081',
        direction: 'outgoing',
        type: 'token_generated',
        text: 'नमस्ते Rekha Sharma जी, आपका ओपीडी पंजीकरण टोकन #3 है।',
        timestamp: '09:15 AM',
        delivered: true
      }
    ],
    labReferrals: [],
    labOrders: [],
    timeline: []
  },

  // 10. Debabrata Roy (General Medicine - Visited 08 Oct 2026 - Overdue)
  {
    id: 'PAT-082',
    opdId: 'OPD-2026-082',
    clinicId: 'opd-gen',
    clinicName: 'General Medicine OPD (Room 1)',
    tokenNumber: 6,
    name: 'Debabrata Roy',
    age: 58,
    gender: 'male',
    mobile: '+91 98862 55190',
    abhaId: '91-7712-4401-8890',
    hasAbhaConsent: true,
    preferredLanguage: 'Bengali',
    consultationFee: 300,
    billingScheme: 'General OPD (Paid - ₹300)',
    visitDate: '08 Oct 2026',
    isPregnant: false,
    clinicalGist: {
      headline: 'Debabrata Roy — 58 years · Chronic bronchitis',
      summaryText: 'Seasonal cough and mild wheezing. Inhaler technique verified.',
      importantRecords: { bloodGroup: 'B Positive', hb: '14.0 g/dL', previousChildren: 'N/A', lastScan: 'Chest X-ray clear', lastOpd: '08 Oct 2026', currentGestation: 'N/A', glucose: '98 mg/dL' },
      relevantRecords: { bloodGroup: 'B Positive', hb: '14.0 g/dL', previousChildren: 'N/A', lastScan: 'Chest X-ray clear', lastOpd: '08 Oct 2026', currentGestation: 'N/A', glucose: '98 mg/dL' },
      isAiGenerated: true
    },
    visitReason: 'Persistent dry cough and wheezing',
    queueStatus: 'Completed',
    assignedDoctor: 'Dr. Rajesh Kulkarni',
    followUpDate: '10 Oct 2026',
    followUpStatus: 'Overdue',
    followUpInstruction: 'Peak flow review if cough persists',
    aiFollowUpSent: false,
    whatsappMessages: [],
    labReferrals: [],
    labOrders: [],
    timeline: []
  },

  // 11. Priya Naik (Pediatrics - Visited 07 Oct 2026)
  {
    id: 'PAT-071',
    opdId: 'OPD-2026-071',
    clinicId: 'opd-ped',
    clinicName: 'Pediatric & Child Health OPD (Room 2)',
    tokenNumber: 2,
    name: 'Priya Naik',
    age: 1,
    gender: 'female',
    mobile: '+91 94481 00293',
    abhaId: '91-2290-7711-4401',
    hasAbhaConsent: true,
    preferredLanguage: 'Hindi',
    consultationFee: 500,
    billingScheme: 'Specialty OPD (Paid - ₹500)',
    visitDate: '07 Oct 2026',
    isPregnant: false,
    clinicalGist: {
      headline: 'Priya Naik — 12 months · MMR vaccination',
      summaryText: 'Well baby milestone assessment and scheduled MMR vaccine.',
      importantRecords: { bloodGroup: 'O Positive', hb: '11.5 g/dL', previousChildren: 'N/A', lastScan: 'Normal', lastOpd: '07 Oct 2026', currentGestation: 'N/A', glucose: 'Normal' },
      relevantRecords: { bloodGroup: 'O Positive', hb: '11.5 g/dL', previousChildren: 'N/A', lastScan: 'Normal', lastOpd: '07 Oct 2026', currentGestation: 'N/A', glucose: 'Normal' },
      isAiGenerated: true
    },
    visitReason: '12-month vaccination & developmental milestones',
    queueStatus: 'Completed',
    assignedDoctor: 'Dr. Sneha Patil',
    followUpDate: '14 Oct 2026',
    followUpStatus: 'Scheduled',
    followUpInstruction: 'Review post-vaccination fever; next vaccine at 15 months',
    aiFollowUpSent: true,
    aiFollowUpNote: '🤖 अस्पताल एआई अनुवर्ती सेवा — डॉ. स्नेहा पाटिल\n\nनमस्ते Priya Naik के अभिभावक, बच्चे के टीकाकरण के बाद बुखार की दवा निर्देशानुसार दें। अगली तारीख 14 अक्टूबर है।',
    whatsappMessages: [],
    labReferrals: [],
    labOrders: [],
    timeline: []
  },

  // 12. Bipasha Sen (Antenatal - Visited 06 Oct 2026)
  {
    id: 'PAT-061',
    opdId: 'OPD-2026-061',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 5,
    name: 'Bipasha Sen',
    age: 33,
    gender: 'female',
    mobile: '+91 98860 77192',
    abhaId: '91-8819-2231-5509',
    hasAbhaConsent: true,
    preferredLanguage: 'Bengali',
    consultationFee: 0,
    billingScheme: 'JSSK / NHM (Free Antenatal)',
    visitDate: '06 Oct 2026',
    isPregnant: true,
    pregnancyDetails: {
      gestationalAgeWeeks: 18,
      gravida: 1,
      para: 0,
      edd: '10 Mar 2027'
    },
    clinicalGist: {
      headline: 'Bipasha Sen — 33 years · G1P0 · 18 weeks',
      summaryText: 'Second trimester anomaly scan advised at Suraksha Ultrasound.',
      importantRecords: { bloodGroup: 'AB Positive', hb: '11.8 g/dL', previousChildren: 0, lastScan: 'Dating scan normal', lastOpd: '06 Oct 2026', currentGestation: '18 weeks', glucose: 'Normal' },
      relevantRecords: { bloodGroup: 'AB Positive', hb: '11.8 g/dL', previousChildren: 0, lastScan: 'Dating scan normal', lastOpd: '06 Oct 2026', currentGestation: '18 weeks', glucose: 'Normal' },
      isAiGenerated: true
    },
    visitReason: 'TIFFA Anomaly scan booking & calcium supplementation',
    queueStatus: 'Completed',
    assignedDoctor: 'Dr. Anita Rao',
    followUpDate: '13 Oct 2026',
    followUpStatus: 'Scheduled',
    followUpInstruction: 'Bring level-II ultrasound scan report from Suraksha',
    aiFollowUpSent: false,
    whatsappMessages: [],
    labReferrals: [],
    labOrders: [],
    timeline: []
  },

  // 13. Manoj Tiwari (General Medicine - Visited 05 Oct 2026)
  {
    id: 'PAT-051',
    opdId: 'OPD-2026-051',
    clinicId: 'opd-gen',
    clinicName: 'General Medicine OPD (Room 1)',
    tokenNumber: 7,
    name: 'Manoj Tiwari',
    age: 45,
    gender: 'male',
    mobile: '+91 94480 99182',
    abhaId: '91-1120-6644-8833',
    hasAbhaConsent: true,
    preferredLanguage: 'Hindi',
    consultationFee: 300,
    billingScheme: 'General OPD (Paid - ₹300)',
    visitDate: '05 Oct 2026',
    isPregnant: false,
    clinicalGist: {
      headline: 'Manoj Tiwari — 45 years · Male · Fatty liver screening',
      summaryText: 'Ultrasonography showed Grade 1 fatty liver. Prescribed lifestyle changes.',
      importantRecords: { bloodGroup: 'A Positive', hb: '14.2 g/dL', previousChildren: 'N/A', lastScan: 'USG Fatty liver', lastOpd: '05 Oct 2026', currentGestation: 'N/A', glucose: '104 mg/dL' },
      relevantRecords: { bloodGroup: 'A Positive', hb: '14.2 g/dL', previousChildren: 'N/A', lastScan: 'USG Fatty liver', lastOpd: '05 Oct 2026', currentGestation: 'N/A', glucose: '104 mg/dL' },
      isAiGenerated: true
    },
    visitReason: 'Dyspepsia and liver function test review',
    queueStatus: 'Completed',
    assignedDoctor: 'Dr. Rajesh Kulkarni',
    followUpDate: '12 Oct 2026',
    followUpStatus: 'Scheduled',
    followUpInstruction: 'Lipid profile review and diet check',
    aiFollowUpSent: false,
    whatsappMessages: [],
    labReferrals: [],
    labOrders: [],
    timeline: []
  },

  // 14. Tanvi Kulkarni (Antenatal - Visited 04 Oct 2026 - ABHA Skipped)
  {
    id: 'PAT-041',
    opdId: 'OPD-2026-041',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 6,
    name: 'Tanvi Kulkarni',
    age: 25,
    gender: 'female',
    mobile: '+91 97412 33019',
    abhaId: 'Skipped (Consent Declined)',
    hasAbhaConsent: false,
    preferredLanguage: 'Hindi',
    consultationFee: 0,
    billingScheme: 'JSSK / NHM (Free Antenatal)',
    visitDate: '04 Oct 2026',
    isPregnant: true,
    pregnancyDetails: {
      gestationalAgeWeeks: 14,
      gravida: 1,
      para: 0,
      edd: '05 Apr 2027'
    },
    clinicalGist: {
      headline: 'Tanvi Kulkarni — 25 years · G1P0 · 14 weeks',
      summaryText: 'First trimester screening normal. Transition to second trimester supplements.',
      importantRecords: { bloodGroup: 'B Positive', hb: '12.0 g/dL', previousChildren: 0, lastScan: 'NT Scan normal', lastOpd: '04 Oct 2026', currentGestation: '14 weeks', glucose: 'Normal' },
      relevantRecords: { bloodGroup: 'B Positive', hb: '12.0 g/dL', previousChildren: 0, lastScan: 'NT Scan normal', lastOpd: '04 Oct 2026', currentGestation: '14 weeks', glucose: 'Normal' },
      isAiGenerated: true
    },
    visitReason: 'First trimester NT scan review and early antenatal booking',
    queueStatus: 'Completed',
    assignedDoctor: 'Dr. Anita Rao',
    followUpDate: '11 Oct 2026',
    followUpStatus: 'Overdue',
    followUpInstruction: 'Start oral Calcium tablets after breakfast',
    aiFollowUpSent: false,
    whatsappMessages: [],
    labReferrals: [],
    labOrders: [],
    timeline: []
  },

  // 15. Sourav Ganguly (General Medicine - Visited 02 Oct 2026 - Attended Follow-up)
  {
    id: 'PAT-021',
    opdId: 'OPD-2026-021',
    clinicId: 'opd-gen',
    clinicName: 'General Medicine OPD (Room 1)',
    tokenNumber: 8,
    name: 'Sourav Ganguly',
    age: 51,
    gender: 'male',
    mobile: '+91 98455 12093',
    abhaId: '91-3319-5501-7722',
    hasAbhaConsent: true,
    preferredLanguage: 'Bengali',
    consultationFee: 500,
    billingScheme: 'Specialty OPD (Paid - ₹500)',
    visitDate: '02 Oct 2026',
    isPregnant: false,
    clinicalGist: {
      headline: 'Sourav Ganguly — 51 years · Dyslipidemia',
      summaryText: 'Statin therapy initiated. Follow-up attended on 09 Oct with normal LFT.',
      importantRecords: { bloodGroup: 'O Positive', hb: '14.5 g/dL', previousChildren: 'N/A', lastScan: 'Normal', lastOpd: '02 Oct 2026', currentGestation: 'N/A', glucose: '94 mg/dL' },
      relevantRecords: { bloodGroup: 'O Positive', hb: '14.5 g/dL', previousChildren: 'N/A', lastScan: 'Normal', lastOpd: '02 Oct 2026', currentGestation: 'N/A', glucose: '94 mg/dL' },
      isAiGenerated: true
    },
    visitReason: 'High cholesterol check & cardiovascular risk reduction',
    queueStatus: 'Completed',
    assignedDoctor: 'Dr. Rajesh Kulkarni',
    followUpDate: '09 Oct 2026',
    followUpStatus: 'Attended',
    followUpInstruction: 'Lipid panel normalized; annual check advised',
    aiFollowUpSent: true,
    whatsappMessages: [],
    labReferrals: [],
    labOrders: [],
    timeline: []
  },

  // 16. Lakshmi Bai (Antenatal - Visited 01 Oct 2026 - Attended Follow-up)
  {
    id: 'PAT-011',
    opdId: 'OPD-2026-011',
    clinicId: 'opd-anc',
    clinicName: 'Maternal & Antenatal OPD (Room 4)',
    tokenNumber: 9,
    name: 'Lakshmi Bai',
    age: 24,
    gender: 'female',
    mobile: '+91 94480 66201',
    abhaId: '91-7701-1189-3344',
    hasAbhaConsent: true,
    preferredLanguage: 'Hindi',
    consultationFee: 0,
    billingScheme: 'JSSK / NHM (Free Antenatal)',
    visitDate: '01 Oct 2026',
    isPregnant: true,
    pregnancyDetails: {
      gestationalAgeWeeks: 36,
      gravida: 2,
      para: 1,
      edd: '29 Oct 2026'
    },
    clinicalGist: {
      headline: 'Lakshmi Bai — 24 years · G2P1 · 36 weeks',
      summaryText: 'Term surveillance. Foetal heart sound regular.',
      importantRecords: { bloodGroup: 'A Positive', hb: '11.2 g/dL', previousChildren: 1, lastScan: 'Term biometry normal', lastOpd: '01 Oct 2026', currentGestation: '36 weeks', glucose: 'Normal' },
      relevantRecords: { bloodGroup: 'A Positive', hb: '11.2 g/dL', previousChildren: 1, lastScan: 'Term biometry normal', lastOpd: '01 Oct 2026', currentGestation: '36 weeks', glucose: 'Normal' },
      isAiGenerated: true
    },
    visitReason: '36-week term antenatal surveillance',
    queueStatus: 'Completed',
    assignedDoctor: 'Dr. Anita Rao',
    followUpDate: '08 Oct 2026',
    followUpStatus: 'Attended',
    followUpInstruction: 'Hospital admission if labor pains or leakage begins',
    aiFollowUpSent: true,
    whatsappMessages: [],
    labReferrals: [],
    labOrders: [],
    timeline: []
  }
];

export const LAB_PARTNERS: LabPartner[] = [
  {
    id: 'lab-apex',
    name: 'Apex Diagnostic Centre & Advanced Path Lab',
    type: 'Distant Standalone Diagnostic Hub',
    distance: '2.5 km away (City Centre)',
    location: 'Opp. City Bus Stand, PB Road, Hubballi',
    city: 'Hubballi-Dharwad',
    state: 'Karnataka',
    pincode: '580029',
    sampleCourierRadiusKm: 12,
    geoLocation: {
      latitude: 15.3520,
      longitude: 75.1380,
      addressLine: 'Opp. City Bus Stand, PB Road',
      locality: 'City Centre PB Road',
      city: 'Hubballi-Dharwad',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580029',
      landmark: 'Opposite KSRTC Central Terminal',
      plusCode: '9H2Q+RG Hubballi'
    },
    inCharge: 'Dr. Sudhir Shenoy (Chief Pathologist)',
    accreditation: 'NABL Certified #MC-2940',
    operatingHours: '07:00 AM – 09:30 PM',
    contact: '+91 836 2251900',
    sampleCollectionMode: 'Sample Courier Pickup from OPD',
    turnaroundHours: '2 to 4 Hours',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
  },
  {
    id: 'lab-suraksha',
    name: 'Suraksha Ultrasound & Diagnostic Imaging',
    type: 'Specialized Ultrasound & Imaging',
    distance: '1.8 km away (Vidyanagar)',
    location: '2nd Floor, Medicity Arcade, Vidyanagar Circle',
    city: 'Hubballi-Dharwad',
    state: 'Karnataka',
    pincode: '580021',
    sampleCourierRadiusKm: 8,
    geoLocation: {
      latitude: 15.3615,
      longitude: 75.1325,
      addressLine: '2nd Floor, Medicity Arcade, Vidyanagar Circle',
      locality: 'Vidyanagar',
      city: 'Hubballi-Dharwad',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580021',
      landmark: 'Near BVB Engineering College Junction',
      plusCode: '9H6M+HX Hubballi'
    },
    inCharge: 'Dr. Veena Hegde (Consultant Radiologist)',
    accreditation: 'AERB / FMF Certified',
    operatingHours: '08:00 AM – 08:00 PM',
    contact: '+91 836 2374100',
    sampleCollectionMode: 'Patient Walk-in to Centre',
    turnaroundHours: 'Same-day Report with High-Res Scans',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
  },
  {
    id: 'lab-district',
    name: 'Civil Hospital Reference Pathology Laboratory',
    type: 'Hospital Reference Lab',
    distance: 'Distant Block B (600m campus / 1.5 km transit)',
    location: 'Block B, Old Civil Hospital Campus, Dharwad Road',
    city: 'Hubballi-Dharwad',
    state: 'Karnataka',
    pincode: '580020',
    sampleCourierRadiusKm: 15,
    geoLocation: {
      latitude: 15.3655,
      longitude: 75.1232,
      addressLine: 'Block B, Old Civil Hospital Campus, Dharwad Road',
      locality: 'Dharwad Road Campus',
      city: 'Hubballi-Dharwad',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580020',
      landmark: 'Adjacent to Blood Bank & Cold Storage',
      plusCode: '9H8F+68 Hubballi'
    },
    inCharge: 'Dr. P. K. Joshi (Chief Biochemist)',
    accreditation: 'Government Reference Centre',
    operatingHours: '24 Hours Emergency & Routine',
    contact: 'Ext: 112 / +91 836 220011',
    sampleCollectionMode: 'Both Available',
    turnaroundHours: '4 to 6 Hours',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-200'
  }
];

export const PHARMACY_PARTNERS: PharmacyPartner[] = [
  {
    id: 'pharm-inhouse',
    name: 'Connected OPD Chemist & Dispensary',
    type: 'Connected OPD Chemist',
    distance: 'Connected (Adjacent Ground Floor)',
    counterLocation: 'OPD Ground Floor Corridor, Beside Room 4',
    city: 'Hubballi-Dharwad',
    state: 'Karnataka',
    pincode: '580020',
    deliveryRadiusKm: 0,
    isEmergencyNightStore: false,
    geoLocation: {
      latitude: 15.3648,
      longitude: 75.1242,
      addressLine: 'OPD Ground Floor Corridor, Beside Room 4',
      locality: 'District Hospital Campus',
      city: 'Hubballi-Dharwad',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580020',
      landmark: 'Ground Floor Pharmacy Window #1 & #2',
      plusCode: '9H7F+XP Hubballi'
    },
    operatingHours: '08:00 AM – 04:00 PM (OPD Hours)',
    contact: 'Ext: 204 / +91 836 221004',
    discountOffer: '100% Free / Subsidized for Antenatal Scheme (JSSK / NHM)',
    pharmacistInCharge: 'Pharmacist Manjunath K.',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-200'
  },
  {
    id: 'pharm-janaushadhi',
    name: 'Pradhan Mantri Jan Aushadhi Kendra (#5048)',
    type: 'Jan Aushadhi',
    distance: '350m away (Dharwad Road Branch)',
    counterLocation: 'Shop 4, Dharwad Road, Near City Hospital Gate 1',
    city: 'Hubballi-Dharwad',
    state: 'Karnataka',
    pincode: '580020',
    deliveryRadiusKm: 3.5,
    isEmergencyNightStore: false,
    geoLocation: {
      latitude: 15.3658,
      longitude: 75.1265,
      addressLine: 'Shop 4, Dharwad Road, Near City Hospital Gate 1',
      locality: 'Dharwad Road',
      city: 'Hubballi-Dharwad',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580020',
      landmark: 'Near KMC Main Arch',
      plusCode: '9H8G+8G Hubballi'
    },
    operatingHours: '08:00 AM – 10:00 PM',
    contact: '+91 94480 32188',
    discountOffer: '50% to 90% Savings on Quality Generic Formulations',
    pharmacistInCharge: 'Suresh Hegde, R.Ph.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
  },
  {
    id: 'pharm-medplus',
    name: 'MedPlus Pharmacy & Chemist',
    type: 'Retail Partner',
    distance: '1.2 km away (Station Road Junction)',
    counterLocation: 'Station Road Circle, Hubballi',
    city: 'Hubballi-Dharwad',
    state: 'Karnataka',
    pincode: '580020',
    deliveryRadiusKm: 6.0,
    isEmergencyNightStore: true,
    geoLocation: {
      latitude: 15.3480,
      longitude: 75.1395,
      addressLine: 'Station Road Circle, Opp. Railway Division HQ',
      locality: 'Station Road',
      city: 'Hubballi-Dharwad',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580020',
      landmark: 'Opp. SWR Railway DRM Office',
      plusCode: '8HXQ+5Q Hubballi'
    },
    operatingHours: '24 Hours (Round the Clock Emergency)',
    contact: '+91 836 235678',
    discountOffer: 'Flat 15% OPD Patient Concession on all branded medicines',
    pharmacistInCharge: 'Pharmacist Priya N.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
  },
  {
    id: 'pharm-apollo',
    name: 'Apollo Pharmacy & Home Delivery Store',
    type: 'Retail Partner',
    distance: '2.8 km away (Gokul Road Hub)',
    counterLocation: 'Gokul Road Commercial Complex, Hubballi',
    city: 'Hubballi-Dharwad',
    state: 'Karnataka',
    pincode: '580030',
    deliveryRadiusKm: 10.0,
    isEmergencyNightStore: true,
    geoLocation: {
      latitude: 15.3465,
      longitude: 75.1105,
      addressLine: 'Gokul Road Commercial Complex, Hubballi',
      locality: 'Gokul Road',
      city: 'Hubballi-Dharwad',
      district: 'Dharwad',
      state: 'Karnataka',
      pincode: '580030',
      landmark: 'Near Airport Circle & KSSIDC Enclave',
      plusCode: '8HW6+J5 Hubballi'
    },
    operatingHours: '24 Hours (Home Delivery within 2 Hours)',
    contact: '+91 836 290123',
    discountOffer: '10% Discount + Free Home Delivery for Postpartum Mothers',
    pharmacistInCharge: 'Pharmacist Rajesh S.',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
  }
];

class OpdStore {
  patients: OpdPatient[] = [...INITIAL_PATIENTS];
  doctors: DoctorProfile[] = [...DOCTOR_PROFILES];
  hospitalRooms: HospitalRoom[] = [...INITIAL_HOSPITAL_ROOMS];
  diagnosticLabs: DiagnosticLabConfig[] = [...INITIAL_DIAGNOSTIC_LABS];
  hospitalFacility: HospitalFacilityInfo = { ...HOSPITAL_FACILITY };

  currentPortal: PortalType = 'OPD';
  currentOpdRole: OpdRole = 'RECEPTION';
  selectedClinicId: string = 'opd-anc';
  currentRole: OpdUserRole = 'RECEPTION';
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.refreshAllPatientJourneys();
  }

  refreshPatientJourney(patientId: string): void {
    const patient = this.patients.find(p => p.id === patientId);
    if (!patient) return;
    patient.careJourney = gamificationEngine.synchronizeCareJourney(patient);
    patient.achievements = gamificationEngine.evaluateAchievements(patient, patient.careJourney);
    this.notify();
  }

  refreshAllPatientJourneys(): void {
    for (const patient of this.patients) {
      patient.careJourney = gamificationEngine.synchronizeCareJourney(patient);
      patient.achievements = gamificationEngine.evaluateAchievements(patient, patient.careJourney);
    }
  }

  getDoctorAchievements(doctorName = 'Dr. Anita Rao'): DoctorAchievement[] {
    return gamificationEngine.calculateDoctorAchievements(this.patients, doctorName);
  }

  getPathologistAchievements(): PathologistAchievement[] {
    return gamificationEngine.calculatePathologistAchievements(this.patients);
  }

  updateCareJourney(patientId: string, journeyType: CareJourneyType, notes?: string): CareJourney | undefined {
    const patient = this.patients.find(p => p.id === patientId);
    if (!patient) return undefined;
    if (notes) patient.doctorNotes = notes;
    patient.careJourney = gamificationEngine.synchronizeCareJourney(patient, journeyType);
    patient.achievements = gamificationEngine.evaluateAchievements(patient, patient.careJourney);
    this.notify();
    return patient.careJourney;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Show an outgoing WhatsApp message on the patient's thread and send it through the gateway (billed per message). */
  sendWa(patient: OpdPatient, msg: any) {
    patient.whatsappMessages.push(msg);
    if (msg.direction === 'incoming') return;
    void deliverWhatsApp(patient, msg, () => this.notify());
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  setPortal(portal: PortalType) {
    this.currentPortal = portal;
    if (portal === 'OPD') {
      this.currentRole = this.currentOpdRole;
    } else if (portal === 'LAB') {
      this.currentRole = 'LAB';
    } else if (portal === 'PHARMA') {
      this.currentRole = 'PHARMA';
    } else if (portal === 'ADMIN') {
      this.currentRole = 'ADMIN';
    }
    this.notify();
  }

  setOpdRole(role: OpdRole) {
    this.currentOpdRole = role;
    this.currentRole = role;
    this.currentPortal = 'OPD';
    this.notify();
  }

  setRole(role: OpdUserRole) {
    this.currentRole = role;
    if (role === 'LAB') {
      this.currentPortal = 'LAB';
    } else if (role === 'PHARMA') {
      this.currentPortal = 'PHARMA';
    } else if (role === 'ADMIN') {
      this.currentPortal = 'ADMIN';
    } else if (role === 'PATIENT') {
      // Patient has dedicated individual portal
    } else {
      this.currentPortal = 'OPD';
      this.currentOpdRole = role;
    }
    this.notify();
  }

  setSelectedClinic(clinicId: string) {
    this.selectedClinicId = clinicId;
    this.notify();
  }

  getClinics(): OpdClinic[] {
    return OPD_CLINICS;
  }

  getSelectedClinic(): OpdClinic {
    return OPD_CLINICS.find(c => c.id === this.selectedClinicId) || OPD_CLINICS[0];
  }

  currentDoctorId: string = 'doc-anita';

  getCurrentDoctor(): DoctorProfile {
    return this.doctors.find(d => d.id === this.currentDoctorId) || this.doctors[0];
  }

  getDoctorProfiles(): DoctorProfile[] {
    return this.doctors;
  }

  getHospitalRooms(): HospitalRoom[] {
    // dynamically recalculate active patient count per room
    return this.hospitalRooms.map(r => {
      const doc = this.doctors.find(d => d.id === r.currentDoctorId);
      const count = doc ? this.patients.filter(p => (p.clinicId || 'opd-anc') === doc.clinicId).length : 0;
      return { ...r, activePatientCount: count };
    });
  }

  getDiagnosticLabs(): DiagnosticLabConfig[] {
    return this.diagnosticLabs;
  }

  getHospitalFacility(): HospitalFacilityInfo {
    return this.hospitalFacility;
  }

  setDoctorProfile(doctorId: string) {
    const doc = this.doctors.find(d => d.id === doctorId);
    if (doc) {
      this.currentDoctorId = doc.id;
      this.selectedClinicId = doc.clinicId;
      this.currentRole = 'DOCTOR';
      this.currentOpdRole = 'DOCTOR';
      this.currentPortal = 'OPD';
      this.notify();
    }
  }

  /**
   * Hospital / Nursing Home Admin: Add Doctor to System
   */
  addDoctor(newDocData: {
    name: string;
    specialty: string;
    qualification: string;
    department?: string;
    roomNumber: string;
    consultationFee?: number;
    phone?: string;
    email?: string;
    regNo?: string;
    allocatedLabId?: string;
    shiftTiming?: string;
    colorTheme?: string;
  }): DoctorProfile {
    const docId = `doc-${Date.now().toString().slice(-6)}`;
    const clinicId = `opd-${docId}`;
    const initials = newDocData.name.replace(/Dr\.\s*/i, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'DR';
    
    // Find allocated lab name
    const lab = this.diagnosticLabs.find(l => l.id === newDocData.allocatedLabId) || this.diagnosticLabs[0];

    const doctor: DoctorProfile = {
      id: docId,
      name: newDocData.name,
      shortName: `${newDocData.name} (${newDocData.specialty.split(' ')[0]})`,
      specialty: newDocData.specialty,
      qualification: newDocData.qualification,
      department: newDocData.department || 'Clinical OPD Suite',
      clinicId,
      clinicName: `${newDocData.specialty} (${newDocData.roomNumber})`,
      roomNumber: newDocData.roomNumber,
      avatarInitials: initials,
      colorTheme: newDocData.colorTheme || 'teal',
      consultationFee: newDocData.consultationFee || 300,
      phone: newDocData.phone,
      email: newDocData.email,
      regNo: newDocData.regNo,
      allocatedLabId: lab.id,
      allocatedLabName: lab.name,
      activeStatus: 'ACTIVE',
      shiftTiming: newDocData.shiftTiming || '09:00 - 16:00'
    };

    this.doctors.push(doctor);
    this.hospitalFacility.activeDoctorsCount = this.doctors.length;

    // Register corresponding OPD Clinic
    const newClinic: OpdClinic = {
      id: clinicId,
      name: `${newDocData.specialty} (${newDocData.roomNumber})`,
      shortName: `${newDocData.specialty.slice(0, 15)} (${newDocData.roomNumber})`,
      code: `OPD-${newDocData.roomNumber.replace(/\s+/g, '')}`,
      roomNumber: newDocData.roomNumber,
      leadDoctor: doctor.name,
      doctorSpecialty: doctor.qualification,
      receptionistName: 'Hospital Triage Desk',
      department: doctor.department,
      description: `Outpatient consultation and specialized clinical care by ${doctor.name}.`,
      colorTheme: doctor.colorTheme
    };
    OPD_CLINICS.push(newClinic);

    // Update Room Allocation
    const matchedRoom = this.hospitalRooms.find(r => r.roomNumber.toLowerCase() === newDocData.roomNumber.toLowerCase());
    if (matchedRoom) {
      matchedRoom.currentDoctorId = doctor.id;
      matchedRoom.currentDoctorName = doctor.name;
      matchedRoom.status = 'OCCUPIED';
    }

    // Update Lab doctor assignment
    if (!lab.assignedDoctorIds.includes(doctor.id)) {
      lab.assignedDoctorIds.push(doctor.id);
    }

    // Automatically provision separate Login credentials for this doctor
    authService.addUserForDoctor(doctor);

    // Emit live Integration Backbone event
    integrationBackbone.logEvent({
      sourceModule: 'ADMIN_PORTAL',
      targetModule: 'DOCTOR_STATION',
      eventType: 'DOCTOR_ONBOARDED',
      title: `New Doctor Onboarded: ${doctor.name}`,
      details: `${doctor.name} (${doctor.specialty}) added to hospital roster. Allocated: ${doctor.roomNumber}, Primary Lab: ${lab.name}.`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      payloadSummary: JSON.stringify({ doctorId: doctor.id, room: doctor.roomNumber, lab: lab.name }),
      status: 'SUCCESS'
    });

    this.notify();
    return doctor;
  }

  /**
   * Hospital / Nursing Home Admin: Allocate Room to Doctor
   */
  allocateRoom(doctorId: string, roomNumber: string): boolean {
    const doctor = this.doctors.find(d => d.id === doctorId);
    if (!doctor) return false;

    const previousRoom = doctor.roomNumber;
    doctor.roomNumber = roomNumber;
    doctor.clinicName = `${doctor.specialty} (${roomNumber})`;

    // Free previously occupied room by this doctor
    this.hospitalRooms.forEach(r => {
      if (r.currentDoctorId === doctor.id) {
        r.currentDoctorId = undefined;
        r.currentDoctorName = undefined;
        r.status = 'VACANT';
      }
    });

    // Allocate new room
    const targetRoom = this.hospitalRooms.find(r => r.roomNumber.toLowerCase() === roomNumber.toLowerCase());
    if (targetRoom) {
      targetRoom.currentDoctorId = doctor.id;
      targetRoom.currentDoctorName = doctor.name;
      targetRoom.status = 'OCCUPIED';
    }

    // Update auth user
    authService.updateUserRoomAllocation(doctor.id, roomNumber, doctor.clinicName);

    // Update clinic entry
    const clinic = OPD_CLINICS.find(c => c.id === doctor.clinicId);
    if (clinic) {
      clinic.roomNumber = roomNumber;
      clinic.name = doctor.clinicName;
    }

    // Emit integration event
    integrationBackbone.logEvent({
      sourceModule: 'ADMIN_PORTAL',
      targetModule: 'DOCTOR_STATION',
      eventType: 'ROOM_ALLOCATED',
      title: `Room Reallocated: ${doctor.name} → ${roomNumber}`,
      details: `Hospital Admin transferred ${doctor.name} from ${previousRoom} to ${roomNumber}. Triage tokens and room display synchronized.`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      payloadSummary: JSON.stringify({ doctorId, from: previousRoom, to: roomNumber }),
      status: 'SUCCESS'
    });

    this.notify();
    return true;
  }

  /**
   * Hospital / Nursing Home Admin: Allocate Patient to Doctor
   */
  allocatePatient(patientId: string, doctorId: string): boolean {
    const patient = this.patients.find(p => p.id === patientId);
    const doctor = this.doctors.find(d => d.id === doctorId);
    if (!patient || !doctor) return false;

    const previousDoctor = patient.assignedDoctor || 'Unassigned';
    patient.assignedDoctor = doctor.name;
    patient.clinicId = doctor.clinicId;
    patient.clinicName = doctor.clinicName;

    integrationBackbone.logEvent({
      sourceModule: 'ADMIN_PORTAL',
      targetModule: 'DOCTOR_STATION',
      eventType: 'PATIENT_ALLOCATED_TO_DOCTOR',
      title: `Patient Allocated: ${patient.name} → ${doctor.name}`,
      details: `Admin assigned ${patient.name} (Token #${patient.tokenNumber}) to ${doctor.name} in ${doctor.roomNumber}. Doctor EHR queue updated.`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      payloadSummary: JSON.stringify({ patientId, transferredFrom: previousDoctor, transferredTo: doctor.name, room: doctor.roomNumber }),
      status: 'SUCCESS'
    });

    this.notify();
    return true;
  }

  /**
   * Hospital / Nursing Home Admin: Allocate Diagnostic Lab to Doctor
   */
  allocateLab(doctorId: string, labId: string): boolean {
    const doctor = this.doctors.find(d => d.id === doctorId);
    const lab = this.diagnosticLabs.find(l => l.id === labId);
    if (!doctor || !lab) return false;

    const prevLab = doctor.allocatedLabName || 'None';
    doctor.allocatedLabId = lab.id;
    doctor.allocatedLabName = lab.name;

    // Update lab's assigned doctors list
    this.diagnosticLabs.forEach(l => {
      l.assignedDoctorIds = l.assignedDoctorIds.filter(id => id !== doctor.id);
    });
    if (!lab.assignedDoctorIds.includes(doctor.id)) {
      lab.assignedDoctorIds.push(doctor.id);
    }

    integrationBackbone.logEvent({
      sourceModule: 'ADMIN_PORTAL',
      targetModule: 'PATHOLOGY_LAB',
      eventType: 'LAB_ROUTING_CONFIGURED',
      title: `Diagnostic Lab Routing Assigned: ${doctor.name} → ${lab.name}`,
      details: `All outpatient lab orders generated by ${doctor.name} will auto-route to ${lab.name} (${lab.type}).`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      payloadSummary: JSON.stringify({ doctorId, labId: lab.id, previousLab: prevLab, newLab: lab.name }),
      status: 'SUCCESS'
    });

    this.notify();
    return true;
  }

  getPatientsForDoctor(doctorId?: string): OpdPatient[] {
    const doc = doctorId ? this.doctors.find(d => d.id === doctorId) : this.getCurrentDoctor();
    const targetClinic = doc?.clinicId || this.selectedClinicId;
    return this.patients.filter(p => (p.clinicId || 'opd-anc') === targetClinic || p.assignedDoctor === doc?.name);
  }

  getPatientsForClinic(clinicId?: string): OpdPatient[] {
    const target = clinicId || this.selectedClinicId;
    return this.patients.filter(p => (p.clinicId || 'opd-anc') === target);
  }

  getStats(clinicId?: string): OpdStats {
    const targetClinic = clinicId || (this.currentPortal === 'OPD' ? this.selectedClinicId : undefined);
    const filteredPatients = targetClinic 
      ? this.patients.filter(p => (p.clinicId || 'opd-anc') === targetClinic)
      : this.patients;

    const waiting = filteredPatients.filter(p => p.queueStatus === 'Waiting').length;
    const withDoc = filteredPatients.filter(p => p.queueStatus === 'With Doctor').length;
    const labPending = filteredPatients.filter(p => p.queueStatus === 'Lab Pending' || (p.queueStatus as string) === 'In Lab').length;
    const completed = filteredPatients.filter(p => p.queueStatus === 'Completed').length;
    const allPharmOrders = this.getAllPharmacyOrders(targetClinic);
    const pharmPending = allPharmOrders.filter(o => o.status !== 'DISPENSED' && o.status !== 'CANCELLED').length;
    const pharmDispensed = allPharmOrders.filter(o => o.status === 'DISPENSED').length;

    return {
      totalWaiting: waiting,
      withDoctor: withDoc,
      labPending,
      inLab: labPending,
      completedToday: completed,
      totalToday: filteredPatients.length,
      pharmacyOrdersCount: allPharmOrders.length,
      pharmacyPendingCount: pharmPending,
      pharmacyDispensedCount: pharmDispensed
    };
  }

  labPartners: LabPartner[] = [...LAB_PARTNERS];
  pharmacyPartners: PharmacyPartner[] = [...PHARMACY_PARTNERS];

  getPharmacyPartners(): PharmacyPartner[] {
    return this.pharmacyPartners;
  }

  selectedLabId: string = 'lab-apex';
  selectedPharmacyId: string = 'pharm-janaushadhi';

  getLabPartners(): LabPartner[] {
    return this.labPartners;
  }

  getSelectedLab(): LabPartner {
    return this.labPartners.find(l => l.id === this.selectedLabId) || this.labPartners[0];
  }

  setSelectedLab(labId: string) {
    this.selectedLabId = labId;
    this.notify();
  }

  getSelectedPharmacy(): PharmacyPartner {
    return this.pharmacyPartners.find(p => p.id === this.selectedPharmacyId) || this.pharmacyPartners[1] || this.pharmacyPartners[0];
  }

  setSelectedPharmacy(pharmacyId: string) {
    this.selectedPharmacyId = pharmacyId;
    this.notify();
  }

  addLabPartner(partner: LabPartner) {
    if (!this.labPartners.some(p => p.id === partner.id)) {
      this.labPartners.push(partner);
      this.notify();
    }
  }

  addPharmacyPartner(partner: PharmacyPartner) {
    if (!this.pharmacyPartners.some(p => p.id === partner.id)) {
      this.pharmacyPartners.push(partner);
      this.notify();
    }
  }

  getAllPharmacyOrders(filterClinicId?: string): PharmacyOrder[] {
    const orders: PharmacyOrder[] = [];
    this.patients.forEach(p => {
      if (filterClinicId && (p.clinicId || 'opd-anc') !== filterClinicId) return;
      if (p.pharmacyOrders && p.pharmacyOrders.length > 0) {
        p.pharmacyOrders.forEach(o => orders.push(o));
      }
    });
    return orders;
  }

  createPharmacyReferral(params: {
    patientId: string;
    pharmacyId?: string;
    medicines: PrescriptionMedicineItem[];
    scannedBy?: string;
    notes?: string;
    linkedLabReferralIds?: string[];
  }): PharmacyOrder {
    const patient = this.patients.find(p => p.id === params.patientId);
    if (!patient) throw new Error('Patient not found');

    const partners = this.getPharmacyPartners();
    const partner = partners.find(pr => pr.id === params.pharmacyId) || partners[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const orderId = `PHARM-${Date.now()}`;
    const tokenNumber = `RX-${Math.floor(200 + Math.random() * 700)}`;

    const order: PharmacyOrder = {
      id: orderId,
      tokenNumber,
      opdId: patient.opdId,
      clinicId: patient.clinicId || this.selectedClinicId,
      clinicName: patient.clinicName || this.getSelectedClinic().name,
      patientId: patient.id,
      patientName: patient.name,
      patientMobile: patient.mobile,
      doctorName: patient.assignedDoctor || 'Dr. Anita Rao',
      prescribedAt: patient.waitingSince || nowTime,
      scannedAt: nowTime,
      scannedBy: params.scannedBy || 'Receptionist Pooja',
      pharmacyId: partner.id,
      pharmacyName: partner.name,
      pharmacyLocation: partner.counterLocation,
      medicines: params.medicines,
      status: 'REFERRED',
      pickupInstructions: `Show Token #${tokenNumber} at ${partner.counterLocation}. ${partner.discountOffer}`,
      linkedLabReferralIds: params.linkedLabReferralIds || []
    };

    if (!patient.pharmacyOrders) patient.pharmacyOrders = [];
    patient.pharmacyOrders.unshift(order);

    // Update patient prescribed strings if needed
    if (!patient.prescriptions || patient.prescriptions.length === 0) {
      patient.prescriptions = params.medicines.map(m => `${m.medicineName} (${m.dosage}) - ${m.frequency}`);
    }

    patient.timeline.unshift({
      id: `TL-${Date.now()}`,
      date: '10 Oct 2026',
      time: nowTime,
      title: `Rx referred to ${partner.name}`,
      actor: params.scannedBy || 'Reception Desk',
      details: `Prescription Token #${tokenNumber} generated. ${params.medicines.length} medicine(s) routed to pharmacy queue.`
    });

    const medicineListText = params.medicines.map(m => `• ${m.medicineName} (${m.dosage}): ${m.frequency}, ${m.timing} (${m.duration})`).join('\n');
    const rxText = getLocalizedRxMessage(
      patient.name,
      partner.name,
      partner.distance,
      tokenNumber,
      medicineListText,
      partner.discountOffer,
      patient.preferredLanguage || 'English'
    );

    this.sendWa(patient, {
      id: `WA-${Date.now()}`,
      direction: 'outgoing',
      type: 'pharmacy_referral',
      text: rxText,
      timestamp: nowTime,
      delivered: true
    });

    this.notify();
    return order;
  }

  updatePharmacyOrderStatus(orderId: string, status: PharmacyOrder['status']): void {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    for (const patient of this.patients) {
      const order = patient.pharmacyOrders?.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        if (status === 'DISPENSED') {
          order.dispensedAt = nowTime;
          order.dispensedBy = 'Hospital Pharmacist Suresh';
          order.medicines.forEach(m => { m.dispensed = true; });

          patient.timeline.unshift({
            id: `TL-${Date.now()}`,
            date: '10 Oct 2026',
            time: nowTime,
            title: `Medicines dispensed — Loop completed`,
            actor: 'Hospital Pharmacist',
            details: `Token #${order.tokenNumber} fulfilled at ${order.pharmacyName}. All prescribed medicines provided to patient.`
          });

          this.sendWa(patient, {
            id: `WA-${Date.now()}`,
            direction: 'outgoing',
            type: 'pharmacy_dispensed',
            text: `Dear ${patient.name}, your medicines under Token #${order.tokenNumber} have been dispensed at ${order.pharmacyName}. Please take your medicines as directed. Wish you healthy wellbeing!`,
            timestamp: nowTime,
            delivered: true
          });
        } else {
          patient.timeline.unshift({
            id: `TL-${Date.now()}`,
            date: '10 Oct 2026',
            time: nowTime,
            title: `Pharmacy order status updated: ${status}`,
            actor: 'Pharmacy Counter',
            details: `Token #${order.tokenNumber} is now ${status.replace('_', ' ')}.`
          });
        }

        this.notify();
        return;
      }
    }
  }

  scanDoctorPrescription(params: {
    patientId: string;
    medicines: PrescriptionMedicineItem[];
    referToPharmacy: boolean;
    pharmacyId?: string;
    labTestsToRefer: { testName: string; labName?: string; priority?: 'Routine' | 'Urgent' | 'Stat'; clinicalNote?: string }[];
    referToLab: boolean;
    scannedBy?: string;
    rawDoctorText?: string;
  }): {
    pharmacyOrder?: PharmacyOrder;
    labReferrals: LabReferral[];
    record: ScannedPrescriptionRecord;
  } {
    const patient = this.patients.find(p => p.id === params.patientId);
    if (!patient) throw new Error('Patient not found');

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const scannedBy = params.scannedBy || 'Receptionist Pooja';
    const createdLabReferrals: LabReferral[] = [];

    // 1. If Lab referral is requested, dispatch each test
    if (params.referToLab && params.labTestsToRefer && params.labTestsToRefer.length > 0) {
      params.labTestsToRefer.forEach(t => {
        const ref = this.createLabReferral({
          patientId: patient.id,
          testName: t.testName,
          labName: t.labName,
          priority: t.priority || 'Routine',
          notes: t.clinicalNote || 'Referred from Doctor Prescription scan at Reception Desk',
          requestedBy: `Dr. Anita Rao (Prescription Scanned by ${scannedBy})`
        });
        createdLabReferrals.push(ref);
      });
    }

    // 2. If Pharmacy referral is requested, dispatch to Pharmacy
    let pharmacyOrder: PharmacyOrder | undefined;
    if (params.referToPharmacy && params.medicines && params.medicines.length > 0) {
      pharmacyOrder = this.createPharmacyReferral({
        patientId: patient.id,
        pharmacyId: params.pharmacyId,
        medicines: params.medicines,
        scannedBy,
        linkedLabReferralIds: createdLabReferrals.map(r => r.id)
      });
    }

    // 3. Record the Scanned Prescription event
    const scanRecord: ScannedPrescriptionRecord = {
      id: `SCAN-${Date.now()}`,
      patientId: patient.id,
      opdId: patient.opdId,
      scanTimestamp: nowTime,
      scannedBy,
      rawDoctorText: params.rawDoctorText,
      extractedMedicines: params.medicines,
      extractedLabTests: params.labTestsToRefer.map(t => t.testName),
      referredToPharmacy: params.referToPharmacy,
      pharmacyOrderId: pharmacyOrder?.id,
      referredToLab: params.referToLab,
      labReferralIds: createdLabReferrals.map(r => r.id)
    };

    if (!patient.scannedPrescriptions) patient.scannedPrescriptions = [];
    patient.scannedPrescriptions.unshift(scanRecord);

    patient.timeline.unshift({
      id: `TL-${Date.now()}`,
      date: '10 Oct 2026',
      time: nowTime,
      title: 'Doctor prescription scanned at Reception',
      actor: scannedBy,
      details: `Prescription digitised. ${params.medicines.length} medicine(s) detected. Loop status: ${params.referToPharmacy ? 'Referred to Pharmacy' : 'Prescription saved'}${params.referToLab && createdLabReferrals.length > 0 ? ` & ${createdLabReferrals.length} test(s) linked to Lab` : ''}.`
    });

    this.notify();
    return {
      pharmacyOrder,
      labReferrals: createdLabReferrals,
      record: scanRecord
    };
  }

  getAllLabReferrals(): LabReferral[] {
    const refs: LabReferral[] = [];
    this.patients.forEach(p => {
      p.labReferrals.forEach(r => refs.push(r));
    });
    return refs;
  }

  getAllLabOrders(filterClinicId?: string): LabOrder[] {
    const orders: LabOrder[] = [];
    this.patients.forEach(p => {
      if (filterClinicId && (p.clinicId || 'opd-anc') !== filterClinicId) return;
      const facilityName = p.clinicId === 'opd-gen' 
        ? 'District Hospital Hubballi — General OPD' 
        : p.clinicId === 'opd-ped' 
        ? 'District Hospital Hubballi — Pediatric OPD' 
        : 'District Hospital Hubballi — Antenatal OPD';

      if (p.labOrders && p.labOrders.length > 0) {
        p.labOrders.forEach(o => {
          orders.push({
            ...o,
            clinicId: o.clinicId || p.clinicId || 'opd-anc',
            clinicName: o.clinicName || facilityName
          });
        });
      }
      p.labReferrals.forEach(r => {
        if (!orders.some(o => o.id === r.id)) {
          orders.push({
            id: r.id,
            patientId: p.id,
            opdId: p.opdId,
            clinicId: r.clinicId || p.clinicId || 'opd-anc',
            clinicName: r.clinicName || facilityName,
            patientName: p.name,
            patientAge: p.age,
            patientGestation: p.pregnancyDetails ? `${p.pregnancyDetails.gestationalAgeWeeks} wks` : undefined,
            requestedBy: r.requestedBy,
            requestedAt: r.requestedAt,
            testName: r.testName,
            sampleStatus: r.status === 'REQUESTED' ? 'Pending' : r.status === 'SAMPLE RECEIVED' ? 'Sample Received' : 'Test Completed',
            reportStatus: r.status === 'REPORT READY' || r.status === 'REVIEWED' ? 'Report Uploaded' : 'Pending',
            reportSummary: r.reportSummary,
            reportFileName: r.reportFileName,
            findings: r.findings
          });
        }
      });
    });
    return orders;
  }

  // --- Reception Workflow ---
  createOpdVisit(params: {
    name: string;
    mobile: string;
    dob?: string;
    age: number;
    gender: 'female' | 'male' | 'other';
    address?: string;
    abhaId?: string;
    hasAbhaConsent?: boolean;
    preferredLanguage?: 'Hindi' | 'Bengali' | 'English';
    consultationFee?: number;
    billingScheme?: string;
    visitReason: string;
    visitType?: 'ANC' | 'PNC' | 'Follow-up' | 'Gynaecology' | 'Immunisation' | 'General';
    isPregnant: boolean;
    pregnancy?: {
      lmp: string;
      gestationalAgeWeeks: number;
      edd: string;
      previousChildren: number;
      previousOutcome: string;
      gravida: number;
      para: number;
      clinicalFlags?: string[];
    };
    isNewborn?: boolean;
    birthDetails?: {
      birthWeightKg?: number;
      deliveryType?: 'Normal Vaginal' | 'Caesarean (LSCS)' | 'Assisted Vacuum/Forceps';
      birthTime?: string;
      placeOfBirth?: string;
      gestationalAgeAtBirthWeeks?: number;
      apgarScore1Min?: number;
      apgarScore5Min?: number;
      maternalBloodGroup?: string;
    };
    maternalStage?: MaternalClinicalStage;
    postnatalDetails?: {
      deliveryDate?: string;
      deliveryType?: 'Normal Vaginal' | 'Caesarean (LSCS)' | 'Assisted Vacuum/Forceps';
      babyGender?: 'male' | 'female';
      complications?: string[];
      infantFeeding?: 'Exclusive Breastfeeding' | 'Formula' | 'Mixed';
      maternalBloodGroup?: string;
      neonatalBloodGroup?: string;
      antiDAdministered?: boolean;
      epdsScore?: number;
    };
  }): OpdPatient {
    const tokenNumber = this.patients.length + 1;
    const opdId = `OPD-2026-${String(100 + tokenNumber)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = '10 Oct 2026';
    const selectedClinic = this.getSelectedClinic();
    const lang = params.preferredLanguage || 'Hindi';
    const finalAddress = params.address || 'Vidyanagar, Hubballi';

    const headline = params.isNewborn
      ? `${params.name} — ${params.age > 0 ? `${params.age}y` : 'Newborn/Infant'} · ${params.gender.toUpperCase()} · MCP Immunization Registered`
      : params.isPregnant && params.pregnancy
      ? `${params.name} — ${params.age} years · G${params.pregnancy.gravida}P${params.pregnancy.para} · ${params.pregnancy.gestationalAgeWeeks} weeks pregnant`
      : params.postnatalDetails
      ? `${params.name} — ${params.age} years · Postnatal (Delivered ${params.postnatalDetails.deliveryDate || 'Recently'})`
      : `${params.name} — ${params.age} years · ${params.gender.toUpperCase()} · OPD Visit`;

    const summaryText = params.isNewborn
      ? `Infant/Newborn registered for routine pediatric checkup and immunization. Birth weight: ${params.birthDetails?.birthWeightKg || 3.1} kg. Reason for visit: ${params.visitReason}.`
      : params.isPregnant && params.pregnancy
      ? `Previous ${params.pregnancy.previousChildren} child. Current pregnancy at ${params.pregnancy.gestationalAgeWeeks} weeks. Reason for visit: ${params.visitReason}.`
      : params.postnatalDetails
      ? `Postnatal mother visiting for postpartum recovery and maternal evaluation. Reason for visit: ${params.visitReason}.`
      : `Patient registered for ${params.visitReason}. Baseline health records initiated.`;

    const gistRecords = {
      bloodGroup: params.isNewborn ? (params.birthDetails?.maternalBloodGroup ? `Maternal: ${params.birthDetails.maternalBloodGroup}` : 'Pending check') : 'Pending check',
      hb: 'Pending CBC',
      previousChildren: params.pregnancy?.previousChildren || 0,
      lastScan: 'None on record',
      lastOpd: 'Today (New Enrolment)',
      currentGestation: params.pregnancy ? `${params.pregnancy.gestationalAgeWeeks} weeks` : (params.isNewborn ? 'Newborn' : 'N/A'),
      glucose: 'Pending screen'
    };

    const hasAbhaConsent = params.hasAbhaConsent !== undefined ? params.hasAbhaConsent : true;
    const abhaId = hasAbhaConsent 
      ? (params.abhaId || `91-${Math.floor(2000 + Math.random() * 7000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`)
      : 'Skipped (Consent Declined)';

    const consultationFee = params.consultationFee !== undefined 
      ? params.consultationFee 
      : (params.isPregnant || params.isNewborn ? 0 : 300);

    const billingScheme = params.billingScheme || (params.isPregnant || params.isNewborn ? 'JSSK / NHM (Free Antenatal/Neonatal)' : 'General OPD (Paid - ₹300)');

    const welcomeText = getLocalizedTokenMessage(
      params.name,
      tokenNumber,
      selectedClinic.leadDoctor,
      `${selectedClinic.name} (${selectedClinic.roomNumber})`,
      lang
    );

    const newPatient: OpdPatient = {
      id: `PAT-${Date.now()}`,
      opdId,
      tokenNumber,
      name: params.name,
      age: params.age,
      dob: params.dob || (params.isNewborn ? '2026-09-19' : '1998-01-01'),
      gender: params.gender,
      mobile: params.mobile,
      abhaId,
      hasAbhaConsent,
      address: finalAddress,
      preferredLanguage: lang,
      consultationFee,
      billingScheme,
      visitDate: todayDate,
      followUpStatus: 'Scheduled',
      isPregnant: params.isPregnant,
      isNewborn: params.isNewborn,
      birthDetails: params.birthDetails ? {
        dateOfBirth: params.dob || '2026-09-19',
        ...params.birthDetails
      } : undefined,
      maternalStage: params.maternalStage || (params.isPregnant ? detectMaternalStage({ isPregnant: true, pregnancyDetails: params.pregnancy }) : (params.postnatalDetails ? 'POSTNATAL_6WEEKS' : undefined)),
      postnatalDetails: params.postnatalDetails ? {
        deliveryDate: params.postnatalDetails.deliveryDate || '2026-08-28',
        ...params.postnatalDetails
      } : undefined,
      vaccinationSchedule: params.isNewborn ? generateNewbornVaccineSchedule(params.dob || '2026-09-19') : undefined,
      pregnancyDetails: params.pregnancy ? {
        gravida: params.pregnancy.gravida,
        para: params.pregnancy.para,
        gestationalAgeWeeks: params.pregnancy.gestationalAgeWeeks,
        edd: params.pregnancy.edd,
        lmp: params.pregnancy.lmp,
        previousChildren: params.pregnancy.previousChildren,
        previousOutcome: params.pregnancy.previousOutcome,
        currentPregnancyType: 'Singleton',
        clinicalFlags: params.pregnancy.clinicalFlags || []
      } : undefined,
      previousOpdRecords: [],
      clinicalGist: {
        headline,
        summaryText,
        importantRecords: gistRecords,
        relevantRecords: gistRecords,
        isAiGenerated: true
      },
      visitReason: params.visitReason,
      visitType: params.visitType || (params.isNewborn ? 'Immunisation' : (params.isPregnant ? 'ANC' : (params.postnatalDetails ? 'PNC' : 'Gynaecology'))),
      queueStatus: 'Waiting',
      waitingSince: nowTime,
      assignedDoctor: selectedClinic.leadDoctor,
      whatsappMessages: [
        {
          id: `WA-${Date.now()}`,
          direction: 'outgoing',
          type: 'token_generated',
          text: welcomeText,
          timestamp: nowTime,
          delivered: true
        }
      ],
      labReferrals: [],
      labOrders: [],
      timeline: [
        {
          id: `TL-${Date.now()}`,
          date: todayDate,
          time: nowTime,
          title: 'OPD registration',
          actor: selectedClinic.receptionistName,
          details: `Token #${tokenNumber} (${opdId}) created. ABHA: ${hasAbhaConsent ? 'Linked' : 'Skipped (Voluntary Consent Declined)'}. Alerts Language: ${lang}. Fee: ₹${consultationFee}.`
        }
      ]
    };

    this.patients.unshift(newPatient);
    this.refreshPatientJourney(newPatient.id);
    this.notify();
    return newPatient;
  }

  startOpdVisit(params: Parameters<OpdStore['createOpdVisit']>[0]): OpdPatient {
    return this.createOpdVisit(params);
  }

  /**
   * Administer a vaccine dose for newborn/infant
   */
  recordVaccineAdministration(params: {
    patientId: string;
    vaccineCode: string;
    batchNumber?: string;
    site?: string;
    administeredBy?: string;
    notes?: string;
  }): boolean {
    const patient = this.patients.find(p => p.id === params.patientId);
    if (!patient) return false;

    if (!patient.vaccinationSchedule || patient.vaccinationSchedule.length === 0) {
      patient.vaccinationSchedule = generateNewbornVaccineSchedule(patient.dob || '2026-09-19');
    }

    const vaccine = patient.vaccinationSchedule.find(v => v.vaccineCode === params.vaccineCode);
    if (!vaccine) return false;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = '10 Oct 2026';
    const administeredBy = params.administeredBy || patient.assignedDoctor || 'Dr. Sneha Patil (Pediatrics)';

    vaccine.status = 'GIVEN';
    vaccine.administeredDate = todayDate;
    vaccine.administeredBy = administeredBy;
    if (params.batchNumber) vaccine.batchNumber = params.batchNumber;
    if (params.site) vaccine.site = params.site;
    if (params.notes) vaccine.notes = params.notes;

    // Timeline event
    patient.timeline.unshift({
      id: `TL-VAC-${Date.now()}`,
      date: todayDate,
      time: nowTime,
      title: `Vaccine Administered: ${vaccine.vaccineName} (${vaccine.vaccineCode})`,
      actor: administeredBy,
      details: `Administered dose ${vaccine.dosage || vaccine.dose || '0.5ml'} via ${vaccine.route} at ${vaccine.site}. Batch #${vaccine.batchNumber || 'MCH-V-2026'}. Recorded in digital MCP immunization schedule.`
    });

    // WhatsApp Notification to Parents
    this.sendWa(patient, {
      id: `WA-VAC-${Date.now()}`,
      direction: 'outgoing',
      type: 'follow_up',
      text: `Continuum Immunization Update for ${patient.name}: ${vaccine.vaccineName} was administered successfully on ${todayDate}. Batch: ${vaccine.batchNumber || 'Verified'}. Digital MCP card record updated.`,
      timestamp: nowTime,
      delivered: true
    });

    // Integration Backbone event
    integrationBackbone.logEvent({
      sourceModule: 'DOCTOR_STATION',
      targetModule: 'EHR_CORE',
      eventType: 'VACCINE_ADMINISTERED',
      title: `Vaccination Recorded: ${patient.name} - ${vaccine.vaccineName}`,
      details: `${vaccine.vaccineName} (${vaccine.vaccineCode}) administered to ${patient.name} by ${administeredBy}. Batch: ${vaccine.batchNumber || 'N/A'}.`,
      patientId: patient.id,
      patientName: patient.name,
      doctorName: administeredBy,
      payloadSummary: JSON.stringify({ vaccineCode: vaccine.vaccineCode, batch: vaccine.batchNumber, site: vaccine.site }),
      status: 'SUCCESS'
    });

    this.refreshPatientJourney(patient.id);
    this.notify();
    return true;
  }

  /**
   * Order a stage-specific maternal test protocol panel
   */
  orderMaternalTestProtocol(params: {
    patientId: string;
    testNames: string[];
    stage?: MaternalClinicalStage;
    priority?: 'Routine' | 'Urgent' | 'Stat';
    requestedBy?: string;
  }): LabReferral[] {
    const patient = this.patients.find(p => p.id === params.patientId);
    if (!patient) throw new Error('Patient not found');

    const createdReferrals: LabReferral[] = [];
    const stageLabel = params.stage ? ` [${params.stage}]` : '';

    params.testNames.forEach(testName => {
      const ref = this.createLabReferral({
        patientId: patient.id,
        testName,
        priority: params.priority || 'Routine',
        requestedBy: params.requestedBy || patient.assignedDoctor || 'Dr. Anita Rao',
        notes: `Maternal Clinical Protocol Test${stageLabel}. Indication: ${patient.isPregnant ? 'Antenatal Screen' : 'Postnatal Care'}`
      });
      createdReferrals.push(ref);
    });

    integrationBackbone.logEvent({
      sourceModule: 'DOCTOR_STATION',
      targetModule: 'PATHOLOGY_LAB',
      eventType: 'MATERNAL_TEST_ORDERED',
      title: `Maternal Protocol Ordered: ${patient.name} (${params.testNames.length} tests)`,
      details: `Doctor ordered ${params.testNames.length} protocol tests for ${params.stage || 'Maternal Care'}: ${params.testNames.join(', ')}.`,
      patientId: patient.id,
      patientName: patient.name,
      doctorName: params.requestedBy || patient.assignedDoctor,
      payloadSummary: JSON.stringify({ stage: params.stage, tests: params.testNames }),
      status: 'SUCCESS'
    });

    this.refreshPatientJourney(patient.id);
    this.notify();
    return createdReferrals;
  }

  // --- Doctor Workflow ---
  callPatient(patientId: string): void {
    const patient = this.patients.find(p => p.id === patientId);
    if (!patient) return;

    patient.queueStatus = 'With Doctor';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const selectedClinic = this.getSelectedClinic();
    const lang = patient.preferredLanguage || 'English';

    patient.timeline.unshift({
      id: `TL-${Date.now()}`,
      date: '10 Oct 2026',
      time: nowTime,
      title: `Consultation called — ${patient.assignedDoctor || selectedClinic.leadDoctor}`,
      actor: patient.assignedDoctor || selectedClinic.leadDoctor
    });

    const callingText = getLocalizedCallingMessage(
      patient.assignedDoctor || selectedClinic.leadDoctor,
      selectedClinic.roomNumber,
      lang
    );

    this.sendWa(patient, {
      id: `WA-${Date.now()}`,
      direction: 'outgoing',
      type: 'doctor_calling',
      text: callingText,
      timestamp: nowTime,
      delivered: true
    });

    this.notify();
  }

  orderLabTest(patientId: string, testName: string, notes?: string, labName?: string, priority?: 'Routine' | 'Urgent' | 'Stat'): LabReferral {
    return this.createLabReferral({
      patientId,
      testName,
      labName,
      priority,
      notes
    });
  }

  createLabReferral(params: {
    patientId: string;
    testName: string;
    labName?: string;
    priority?: 'Routine' | 'Urgent' | 'Stat';
    notes?: string;
    requestedBy?: string;
  }): LabReferral {
    const patient = this.patients.find(p => p.id === params.patientId);
    if (!patient) throw new Error('Patient not found');

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const referralId = `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const designatedLab = params.labName || 'In-house Central Pathology Lab (Room 8)';
    const priority = params.priority || 'Routine';
    const requestedBy = params.requestedBy || 'Dr. Anita Rao';

    const referral: LabReferral = {
      id: referralId,
      opdId: patient.opdId,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGestation: patient.pregnancyDetails ? `${patient.pregnancyDetails.gestationalAgeWeeks} wks` : undefined,
      testName: params.testName,
      labName: designatedLab,
      priority,
      requestedBy,
      requestedAt: nowTime,
      status: 'REQUESTED',
      relevantClinicalHistory: params.notes || (patient.isPregnant ? `Gestation: ${patient.pregnancyDetails?.gestationalAgeWeeks}wks. Reason: ${patient.visitReason}` : patient.visitReason)
    };

    const labOrder: LabOrder = {
      id: referralId,
      patientId: patient.id,
      opdId: patient.opdId,
      patientName: patient.name,
      patientAge: patient.age,
      patientGestation: patient.pregnancyDetails ? `${patient.pregnancyDetails.gestationalAgeWeeks} wks` : undefined,
      requestedBy,
      requestedAt: nowTime,
      testName: params.testName,
      labName: designatedLab,
      priority,
      sampleStatus: 'Pending',
      reportStatus: 'Pending'
    };

    if (!patient.labOrders) patient.labOrders = [];
    patient.labOrders.push(labOrder);
    patient.labReferrals.push(referral);
    patient.queueStatus = 'Lab Pending';

    patient.timeline.unshift({
      id: `TL-${Date.now()}`,
      date: '10 Oct 2026',
      time: nowTime,
      title: `${params.testName} referred to ${designatedLab}`,
      actor: requestedBy,
      details: `Linked to OPD Visit ${patient.opdId} (Token #${patient.tokenNumber}). Priority: ${priority}. Notes: ${params.notes || 'Routine antenatal investigation'}.`
    });

    const labText = getLocalizedLabMessage(
      patient.name,
      designatedLab,
      designatedLab.includes('km') ? '' : 'Distant Lab (2.5 km away)',
      params.testName,
      priority,
      patient.tokenNumber,
      patient.preferredLanguage || 'English'
    );

    this.sendWa(patient, {
      id: `WA-${Date.now()}`,
      direction: 'outgoing',
      type: 'lab_referral',
      text: labText,
      timestamp: nowTime,
      delivered: true
    });

    this.notify();
    return referral;
  }

  saveConsultation(params: {
    patientId: string;
    vitals?: Vitals;
    doctorNotes?: string;
    prescriptions?: string[];
    assessmentOutcome?: string;
    followUpDate?: string;
    followUpInstruction?: string;
    followUpStatus?: string;
    careJourneyType?: CareJourneyType;
    nextQueueStatus?: string;
  }): void {
    const patient = this.patients.find(p => p.id === params.patientId);
    if (!patient) return;

    if (params.vitals) {
      patient.vitals = { ...patient.vitals, ...params.vitals };
    }
    if (params.doctorNotes !== undefined) patient.doctorNotes = params.doctorNotes;
    if (params.prescriptions) patient.prescriptions = params.prescriptions;
    if (params.assessmentOutcome !== undefined) patient.assessmentOutcome = params.assessmentOutcome;
    if (params.followUpDate !== undefined) patient.followUpDate = params.followUpDate;
    if (params.followUpInstruction !== undefined) patient.followUpInstruction = params.followUpInstruction;
    if (params.followUpStatus !== undefined) patient.followUpStatus = params.followUpStatus;
    if (params.nextQueueStatus) patient.queueStatus = params.nextQueueStatus;

    if (params.careJourneyType) {
      patient.careJourney = gamificationEngine.synchronizeCareJourney(patient, params.careJourneyType);
    } else {
      patient.careJourney = gamificationEngine.synchronizeCareJourney(patient);
    }
    patient.achievements = gamificationEngine.evaluateAchievements(patient, patient.careJourney);

    this.notify();
  }

  completeConsultation(patientId: string, notes?: string): void {
    const patient = this.patients.find(p => p.id === patientId);
    if (!patient) return;

    patient.queueStatus = 'Completed';
    if (notes) patient.doctorNotes = notes;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    patient.timeline.unshift({
      id: `TL-${Date.now()}`,
      date: '10 Oct 2026',
      time: nowTime,
      title: 'Consultation completed — Dr. Anita Rao',
      actor: 'Dr. Anita Rao',
      details: `Outcome: ${patient.assessmentOutcome || 'Consultation complete'}. Follow-up set: ${patient.followUpDate || patient.followUpStatus || 'As advised'}.`
    });

    const isFollowUpRequired = patient.followUpStatus !== 'Not Required' && !!patient.followUpDate;

    this.sendWa(patient, {
      id: `WA-${Date.now()}`,
      direction: 'outgoing',
      type: 'follow_up',
      text: isFollowUpRequired
        ? `Your doctor has completed your consultation. Next follow-up scheduled for: ${patient.followUpDate}. Take your prescribed medicines on time.`
        : `Your doctor has completed your consultation. No immediate follow-up required. Wishing you continuous good health.`,
      timestamp: nowTime,
      delivered: true
    });

    patient.careJourney = gamificationEngine.synchronizeCareJourney(patient);
    patient.achievements = gamificationEngine.evaluateAchievements(patient, patient.careJourney);

    this.notify();
  }

  saveConsultationAndFollowUp(params: {
    patientId: string;
    notes: string;
    assessmentOutcome: string;
    prescriptions: string[];
    followUpDate?: string;
    followUpInstruction?: string;
    followUpStatus?: string;
    careJourneyType?: CareJourneyType;
  }): void {
    this.saveConsultation({
      patientId: params.patientId,
      doctorNotes: params.notes,
      assessmentOutcome: params.assessmentOutcome,
      prescriptions: params.prescriptions,
      followUpDate: params.followUpDate,
      followUpInstruction: params.followUpInstruction,
      followUpStatus: params.followUpStatus,
      careJourneyType: params.careJourneyType
    });
    this.completeConsultation(params.patientId, params.notes);
  }

  // --- Pathologist / Lab Workflow ---
  updateLabSampleStatus(orderId: string, status: 'Sample Received' | 'Test Completed'): void {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    for (const patient of this.patients) {
      const order = patient.labOrders?.find(o => o.id === orderId);
      if (order) {
        order.sampleStatus = status;
      }
      const ref = patient.labReferrals?.find(r => r.id === orderId);
      if (ref) {
        ref.status = status === 'Sample Received' ? 'SAMPLE RECEIVED' : 'PROCESSING';
      }

      if (order || ref) {
        patient.timeline.unshift({
          id: `TL-${Date.now()}`,
          date: '10 Oct 2026',
          time: nowTime,
          title: `Sample status: ${status}`,
          actor: 'Pathologist Dr. Ramesh',
          details: `Investigation: ${order?.testName || ref?.testName}`
        });
        patient.careJourney = gamificationEngine.synchronizeCareJourney(patient);
        patient.achievements = gamificationEngine.evaluateAchievements(patient, patient.careJourney);
        this.notify();
        return;
      }
    }
  }

  updateLabReferralStatus(referralId: string, status: LabReferralStatus): void {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    for (const patient of this.patients) {
      const ref = patient.labReferrals.find(r => r.id === referralId);
      if (ref) {
        ref.status = status;
        patient.timeline.unshift({
          id: `TL-${Date.now()}`,
          date: '10 Oct 2026',
          time: nowTime,
          title: `Sample ${status.toLowerCase()} in laboratory`,
          actor: 'Pathologist Dr. Ramesh',
          details: `Test: ${ref.testName}`
        });
        this.notify();
        return;
      }
    }
  }

  uploadLabReport(params: {
    orderId?: string;
    patientId?: string;
    testName?: string;
    category?: string;
    fileName: string;
    summaryText: string;
    findings?: string;
    parameters?: DiagnosticParameter[];
    analysisResult?: DiagnosticAnalysisResult;
    abdmSyncStatus?: 'PENDING' | 'SYNCED' | 'FAILED';
    abdmTxnId?: string;
    abdmCareContextId?: string;
    abdmFhirBundle?: Record<string, any>;
    ocrConfidence?: number;
    ocrMethod?: 'GEMINI_AI_VISION' | 'PATHOLOGY_OCR_ENGINE' | 'MANUAL';
  }): LabOrder | null {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const orderIdToFind = params.orderId;

    // 1. Try to find existing order across patients
    for (const patient of this.patients) {
      const order = orderIdToFind ? patient.labOrders?.find(o => o.id === orderIdToFind) : undefined;
      const ref = orderIdToFind ? patient.labReferrals?.find(r => r.id === orderIdToFind) : undefined;

      if (order || ref) {
        if (order) {
          order.reportStatus = 'Report Uploaded';
          order.sampleStatus = 'Test Completed';
          order.reportSummary = params.summaryText;
          order.reportFileName = params.fileName;
          order.findings = params.findings;
          if (params.parameters) order.parameters = params.parameters;
          if (params.analysisResult) order.analysisResult = params.analysisResult;
          if (params.abdmSyncStatus) order.abdmSyncStatus = params.abdmSyncStatus;
          if (params.abdmTxnId) order.abdmTxnId = params.abdmTxnId;
          if (params.abdmCareContextId) order.abdmCareContextId = params.abdmCareContextId;
          if (params.abdmFhirBundle) order.abdmFhirBundle = params.abdmFhirBundle;
          if (params.ocrConfidence) order.ocrConfidence = params.ocrConfidence;
          if (params.ocrMethod) order.ocrMethod = params.ocrMethod;
          order.uploadedAt = nowTime;
        }
        if (ref) {
          ref.status = 'REPORT READY';
          ref.reportSummary = params.summaryText;
          ref.findings = params.findings;
          ref.reportFileName = params.fileName;
          ref.releasedAt = nowTime;
          ref.releasedBy = 'Dr. Ramesh Kulkarni, MD';
          if (params.parameters) ref.parameters = params.parameters;
          if (params.analysisResult) ref.analysisResult = params.analysisResult;
          if (params.abdmSyncStatus) ref.abdmSyncStatus = params.abdmSyncStatus;
          if (params.abdmTxnId) ref.abdmTxnId = params.abdmTxnId;
          if (params.abdmCareContextId) ref.abdmCareContextId = params.abdmCareContextId;
          if (params.abdmFhirBundle) ref.abdmFhirBundle = params.abdmFhirBundle;
          if (params.ocrConfidence) ref.ocrConfidence = params.ocrConfidence;
        }

        const testName = order?.testName || ref?.testName || params.testName || 'Diagnostic Test';

        // Update patient gist
        if (testName.toLowerCase().includes('glucose') || testName.toLowerCase().includes('ogtt')) {
          patient.clinicalGist.importantRecords.glucose = params.summaryText;
          patient.clinicalGist.relevantRecords.glucose = params.summaryText;
        } else if (testName.toLowerCase().includes('cbc') || testName.toLowerCase().includes('hb') || testName.toLowerCase().includes('hemogram')) {
          patient.clinicalGist.importantRecords.hb = params.summaryText;
          patient.clinicalGist.relevantRecords.hb = params.summaryText;
        }

        patient.timeline.unshift({
          id: `TL-${Date.now()}`,
          date: '10 Oct 2026',
          time: nowTime,
          title: `${testName} report verified & uploaded — Pathology Lab`,
          actor: 'Dr. Ramesh Kulkarni, MD (Pathologist)',
          details: `Result: ${params.summaryText}. ${params.abdmSyncStatus === 'SYNCED' ? 'ABDM FHIR Bundle synced.' : ''}`
        });

        this.sendWa(patient, {
          id: `WA-${Date.now()}`,
          direction: 'outgoing',
          type: 'lab_ready',
          text: `Your ${testName} lab report is now ready. Result: ${params.summaryText}. Verified and transmitted to your doctor.`,
          timestamp: nowTime,
          delivered: true
        });

        // Integration Backbone log
        integrationBackbone.logEvent({
          sourceModule: 'PATHOLOGY_LAB',
          targetModule: 'DOCTOR_STATION',
          eventType: 'LAB_REPORT_SYNCED',
          title: `${testName} Report Synced to Doctor Suite`,
          details: `${testName} results for ${patient.name} uploaded via OCR and transmitted to referring doctor.`,
          patientId: patient.id,
          patientName: patient.name,
          payloadSummary: JSON.stringify({ testName, summary: params.summaryText, abdm: params.abdmSyncStatus }),
          status: 'SUCCESS'
        });

        if (params.abdmSyncStatus === 'SYNCED') {
          integrationBackbone.logEvent({
            sourceModule: 'PATHOLOGY_LAB',
            targetModule: 'ABDM_GATEWAY',
            eventType: 'LAB_REPORT_SYNCED',
            title: `ABDM FHIR DiagnosticReport Bundle Synced`,
            details: `Linked to ABHA #${patient.abhaNumber || '91-8842-1049-2311'}. Care Context: ${params.abdmCareContextId || 'CC-LAB'}.`,
            patientId: patient.id,
            patientName: patient.name,
            payloadSummary: JSON.stringify({ txnId: params.abdmTxnId, careContext: params.abdmCareContextId }),
            status: 'SUCCESS'
          });
        }

        this.refreshPatientJourney(patient.id);
        this.notify();
        return order || null;
      }
    }

    // 2. If no existing order found, attach or create on designated patient
    const targetPatient = (params.patientId 
      ? this.patients.find(p => p.id === params.patientId) 
      : this.patients[0]) || this.patients[0];

    if (targetPatient) {
      const newOrderId = params.orderId || `LAB-${Math.floor(1000 + Math.random() * 9000)}`;
      const resolvedTest = params.testName || 'Diagnostic Investigation';
      const newOrder: LabOrder = {
        id: newOrderId,
        patientId: targetPatient.id,
        opdId: targetPatient.opdId,
        clinicId: targetPatient.clinicId || 'opd-anc',
        clinicName: targetPatient.clinicName || 'Maternal & Antenatal OPD (Room 4)',
        patientName: targetPatient.name,
        patientAge: targetPatient.age,
        patientGestation: targetPatient.pregnancyDetails?.gestationalAgeWeeks ? `${targetPatient.pregnancyDetails.gestationalAgeWeeks}w` : 'Antenatal',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: nowTime,
        testName: resolvedTest,
        category: params.category || 'Pathology & Haematology',
        sampleStatus: 'Test Completed',
        reportStatus: 'Report Uploaded',
        reportSummary: params.summaryText,
        reportFileName: params.fileName,
        findings: params.findings,
        parameters: params.parameters,
        analysisResult: params.analysisResult,
        abdmSyncStatus: params.abdmSyncStatus || 'PENDING',
        abdmTxnId: params.abdmTxnId,
        abdmCareContextId: params.abdmCareContextId,
        abdmFhirBundle: params.abdmFhirBundle,
        ocrConfidence: params.ocrConfidence || 99.2,
        ocrMethod: params.ocrMethod || 'GEMINI_AI_VISION',
        uploadedAt: nowTime
      };

      if (!targetPatient.labOrders) targetPatient.labOrders = [];
      targetPatient.labOrders.unshift(newOrder);

      // Also create a referral entry
      if (!targetPatient.labReferrals) targetPatient.labReferrals = [];
      targetPatient.labReferrals.unshift({
        id: newOrderId,
        opdId: targetPatient.opdId,
        clinicId: targetPatient.clinicId || 'opd-anc',
        clinicName: targetPatient.clinicName || 'Maternal & Antenatal OPD (Room 4)',
        patientId: targetPatient.id,
        patientName: targetPatient.name,
        patientAge: targetPatient.age,
        patientGestation: targetPatient.pregnancyDetails?.gestationalAgeWeeks ? `${targetPatient.pregnancyDetails.gestationalAgeWeeks}w` : 'Antenatal',
        testName: resolvedTest,
        category: params.category || 'Pathology',
        priority: 'Routine',
        requestedBy: 'Dr. Anita Rao',
        requestedAt: nowTime,
        status: 'REPORT READY',
        reportSummary: params.summaryText,
        reportFileName: params.fileName,
        findings: params.findings,
        releasedAt: nowTime,
        releasedBy: 'Dr. Ramesh Kulkarni, MD',
        parameters: params.parameters,
        analysisResult: params.analysisResult,
        abdmSyncStatus: params.abdmSyncStatus,
        abdmTxnId: params.abdmTxnId,
        abdmCareContextId: params.abdmCareContextId,
        abdmFhirBundle: params.abdmFhirBundle,
        ocrConfidence: params.ocrConfidence || 99.2
      });

      // Update patient clinical gist
      if (resolvedTest.toLowerCase().includes('glucose') || resolvedTest.toLowerCase().includes('ogtt')) {
        targetPatient.clinicalGist.importantRecords.glucose = params.summaryText;
        targetPatient.clinicalGist.relevantRecords.glucose = params.summaryText;
      } else if (resolvedTest.toLowerCase().includes('cbc') || resolvedTest.toLowerCase().includes('hb') || resolvedTest.toLowerCase().includes('hemogram')) {
        targetPatient.clinicalGist.importantRecords.hb = params.summaryText;
        targetPatient.clinicalGist.relevantRecords.hb = params.summaryText;
      }

      targetPatient.timeline.unshift({
        id: `TL-${Date.now()}`,
        date: '10 Oct 2026',
        time: nowTime,
        title: `${resolvedTest} report OCR deciphered & ingested`,
        actor: 'Apex Pathology Lab (Dr. Ramesh)',
        details: `Report parsed via OCR: ${params.summaryText}. Integrated into patient record.`
      });

      integrationBackbone.logEvent({
        sourceModule: 'PATHOLOGY_LAB',
        targetModule: 'DOCTOR_STATION',
        eventType: 'LAB_REPORT_SYNCED',
        title: `${resolvedTest} Document Deciphered & Synced`,
        details: `OCR extracted parameters for ${targetPatient.name} and synced to hospital EHR record.`,
        patientId: targetPatient.id,
        patientName: targetPatient.name,
        payloadSummary: JSON.stringify({ testName: resolvedTest, summary: params.summaryText, abdm: params.abdmSyncStatus }),
        status: 'SUCCESS'
      });

      if (params.abdmSyncStatus === 'SYNCED') {
        integrationBackbone.logEvent({
          sourceModule: 'PATHOLOGY_LAB',
          targetModule: 'ABDM_GATEWAY',
          eventType: 'LAB_REPORT_SYNCED',
          title: `ABDM FHIR DiagnosticReport Exported`,
          details: `Patient ${targetPatient.name} (ABHA: ${targetPatient.abhaAddress || 'pat@abdm'}) linked. Txn: ${params.abdmTxnId}.`,
          patientId: targetPatient.id,
          patientName: targetPatient.name,
          payloadSummary: JSON.stringify({ txnId: params.abdmTxnId, careContext: params.abdmCareContextId }),
          status: 'SUCCESS'
        });
      }

      this.refreshPatientJourney(targetPatient.id);
      this.notify();
      return newOrder;
    }

    return null;
  }

  releaseLabReport(params: {
    referralId: string;
    reportSummary: string;
    findings?: string;
    fileName?: string;
  }): void {
    this.uploadLabReport({
      orderId: params.referralId,
      fileName: params.fileName || 'Diagnostic_Report.pdf',
      summaryText: params.reportSummary,
      findings: params.findings
    });
  }

  markReportReviewedByDoctor(referralId: string): void {
    for (const patient of this.patients) {
      const ref = patient.labReferrals.find(r => r.id === referralId);
      if (ref) {
        ref.status = 'REVIEWED';
        ref.reviewedByDoctor = true;
        patient.timeline.unshift({
          id: `TL-${Date.now()}`,
          date: '10 Oct 2026',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Doctor reviewed report — ${ref.testName}`,
          actor: 'Dr. Anita Rao'
        });
        this.notify();
        return;
      }
    }
  }

  sendWhatsApp(patientId: string, text: string): void {
    const patient = this.patients.find(p => p.id === patientId);
    if (!patient) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.sendWa(patient, {
      id: `WA-${Date.now()}`,
      direction: 'outgoing',
      type: 'custom',
      text,
      timestamp: nowTime,
      delivered: true
    });
    this.notify();
  }

  // --- Central Visited Patient Database & Analytics ---
  getAllVisitedPatients(): OpdPatient[] {
    return [...this.patients];
  }

  getWeeklyStats(targetClinicId?: string): WeeklyMonthlyStats {
    // Current Week: 04 Oct to 10 Oct 2026
    const weeklyPatients = this.patients.filter(p => {
      if (targetClinicId && (p.clinicId || 'opd-anc') !== targetClinicId) return false;
      const date = p.visitDate || '10 Oct 2026';
      return (
        date.includes('04 Oct') ||
        date.includes('05 Oct') ||
        date.includes('06 Oct') ||
        date.includes('07 Oct') ||
        date.includes('08 Oct') ||
        date.includes('09 Oct') ||
        date.includes('10 Oct')
      );
    });

    const totalRevenue = weeklyPatients.reduce((sum, p) => sum + (p.consultationFee || 0), 0);
    const paidPatients = weeklyPatients.filter(p => (p.consultationFee || 0) > 0);
    const freeGovtPatients = weeklyPatients.filter(p => !p.consultationFee || p.consultationFee === 0);

    const needingFollowUp = this.getPatientsNeedingFollowUp(targetClinicId);
    const aiFollowUpsSent = weeklyPatients.filter(p => p.aiFollowUpSent).length;

    // By Clinic
    const relevantClinics = targetClinicId 
      ? OPD_CLINICS.filter(c => c.id === targetClinicId) 
      : OPD_CLINICS;

    const revenueByClinic = relevantClinics.map(clinic => {
      const clinicPatients = weeklyPatients.filter(p => (p.clinicId || 'opd-anc') === clinic.id);
      const amount = clinicPatients.reduce((sum, p) => sum + (p.consultationFee || 0), 0);
      return {
        clinicId: clinic.id,
        clinicName: clinic.name,
        amount,
        count: clinicPatients.length
      };
    });

    // By Scheme
    const schemesMap = new Map<string, { amount: number; count: number }>();
    weeklyPatients.forEach(p => {
      const scheme = p.billingScheme || (p.isPregnant ? 'JSSK / NHM (Free Antenatal)' : 'General OPD (Paid - ₹300)');
      const current = schemesMap.get(scheme) || { amount: 0, count: 0 };
      current.amount += (p.consultationFee || 0);
      current.count += 1;
      schemesMap.set(scheme, current);
    });

    const revenueByScheme = Array.from(schemesMap.entries()).map(([scheme, val]) => ({
      scheme,
      amount: val.amount,
      count: val.count
    }));

    return {
      period: 'WEEKLY',
      periodLabel: 'Weekly View (04 Oct – 10 Oct 2026)',
      totalConsultations: weeklyPatients.length,
      totalRevenue,
      paidCount: paidPatients.length,
      freeGovtCount: freeGovtPatients.length,
      patientsWhoCame: weeklyPatients,
      patientsNeedingFollowUp: needingFollowUp,
      revenueByClinic,
      revenueByScheme,
      averageFee: paidPatients.length > 0 ? Math.round(totalRevenue / paidPatients.length) : 0,
      aiFollowUpsSentCount: aiFollowUpsSent
    };
  }

  getMonthlyStats(targetClinicId?: string): WeeklyMonthlyStats {
    // Current Month: October 2026 MTD
    const monthlyPatients = this.patients.filter(p => {
      if (targetClinicId && (p.clinicId || 'opd-anc') !== targetClinicId) return false;
      const date = p.visitDate || '10 Oct 2026';
      return date.includes('Oct 2026');
    });

    const totalRevenue = monthlyPatients.reduce((sum, p) => sum + (p.consultationFee || 0), 0);
    const paidPatients = monthlyPatients.filter(p => (p.consultationFee || 0) > 0);
    const freeGovtPatients = monthlyPatients.filter(p => !p.consultationFee || p.consultationFee === 0);

    const needingFollowUp = this.getPatientsNeedingFollowUp(targetClinicId);
    const aiFollowUpsSent = monthlyPatients.filter(p => p.aiFollowUpSent).length;

    const relevantClinics = targetClinicId 
      ? OPD_CLINICS.filter(c => c.id === targetClinicId) 
      : OPD_CLINICS;

    const revenueByClinic = relevantClinics.map(clinic => {
      const clinicPatients = monthlyPatients.filter(p => (p.clinicId || 'opd-anc') === clinic.id);
      const amount = clinicPatients.reduce((sum, p) => sum + (p.consultationFee || 0), 0);
      return {
        clinicId: clinic.id,
        clinicName: clinic.name,
        amount,
        count: clinicPatients.length
      };
    });

    const schemesMap = new Map<string, { amount: number; count: number }>();
    monthlyPatients.forEach(p => {
      const scheme = p.billingScheme || (p.isPregnant ? 'JSSK / NHM (Free Antenatal)' : 'General OPD (Paid - ₹300)');
      const current = schemesMap.get(scheme) || { amount: 0, count: 0 };
      current.amount += (p.consultationFee || 0);
      current.count += 1;
      schemesMap.set(scheme, current);
    });

    const revenueByScheme = Array.from(schemesMap.entries()).map(([scheme, val]) => ({
      scheme,
      amount: val.amount,
      count: val.count
    }));

    return {
      period: 'MONTHLY',
      periodLabel: 'Monthly View (October 2026 Month-to-Date)',
      totalConsultations: monthlyPatients.length,
      totalRevenue,
      paidCount: paidPatients.length,
      freeGovtCount: freeGovtPatients.length,
      patientsWhoCame: monthlyPatients,
      patientsNeedingFollowUp: needingFollowUp,
      revenueByClinic,
      revenueByScheme,
      averageFee: paidPatients.length > 0 ? Math.round(totalRevenue / paidPatients.length) : 0,
      aiFollowUpsSentCount: aiFollowUpsSent
    };
  }

  getPatientsNeedingFollowUp(targetClinicId?: string): OpdPatient[] {
    return this.patients.filter(p => {
      if (targetClinicId && (p.clinicId || 'opd-anc') !== targetClinicId) return false;
      if (!p.followUpDate) return false;
      return (
        p.followUpStatus === 'Overdue' ||
        p.followUpStatus === 'Due Today' ||
        p.followUpStatus === 'Scheduled' ||
        p.queueStatus === 'Lab Pending' ||
        (p.isPregnant && (p.pregnancyDetails?.clinicalFlags || []).length > 0)
      );
    });
  }

  generateAiFollowUpMessage(patientId: string): string {
    const patient = this.patients.find(p => p.id === patientId);
    if (!patient) return '';
    return getLocalizedAiFollowUp(patient);
  }

  sendAiFollowUp(patientId: string, customMessage?: string): void {
    const patient = this.patients.find(p => p.id === patientId);
    if (!patient) return;

    const message = customMessage || getLocalizedAiFollowUp(patient);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    patient.aiFollowUpSent = true;
    patient.aiFollowUpNote = message;

    this.sendWa(patient, {
      id: `WA-AI-${Date.now()}`,
      direction: 'outgoing',
      type: 'ai_follow_up',
      text: message,
      timestamp: nowTime,
      delivered: true
    });

    patient.timeline.unshift({
      id: `TL-AI-${Date.now()}`,
      date: '10 Oct 2026',
      time: nowTime,
      title: `Intelligent AI Follow-up note sent via WhatsApp (${patient.preferredLanguage || 'English'})`,
      actor: 'Continuum AI Clinical Assistant',
      details: `Automated follow-up care note delivered to ${patient.mobile}.`
    });

    this.notify();
  }

  autoSendAllDueAiFollowUps(): number {
    const duePatients = this.patients.filter(p => 
      p.followUpDate && 
      (p.followUpStatus === 'Due Today' || p.followUpStatus === 'Overdue' || p.followUpStatus === 'Scheduled') &&
      !p.aiFollowUpSent
    );

    duePatients.forEach(p => {
      this.sendAiFollowUp(p.id);
    });

    return duePatients.length;
  }
}

export const opdStore = new OpdStore();
