import {
  Patient,
  PregnancyEpisode,
  FoetalMilestone,
  NewbornRecord,
  ChildEpisode,
  CareGap,
  LaboratorySample,
  AuditLogItem,
  User,
  Facility
} from '../types';

export const DEMO_FACILITY: Facility = {
  id: 'FAC-DH-01',
  name: 'District Hospital Hubballi (Tier-2 MCH Unit)',
  code: 'DH-HBL-01',
  type: 'Tier-2 District Hospital',
  district: 'Dharwad',
  state: 'Karnataka',
  defaultLanguage: 'Kannada',
  active: true
};

export const DEMO_USERS: User[] = [
  {
    id: 'USR-01',
    name: 'Pooja Naik',
    role: 'OPD_STAFF',
    department: 'Maternal & Child OPD Desk',
    email: 'pooja.naik@district-hospital.org',
    facilityId: 'FAC-DH-01'
  },
  {
    id: 'USR-02',
    name: 'Sister Savitha K.',
    role: 'NURSING_STAFF',
    department: 'Antenatal Nursing Station',
    email: 'savitha.k@district-hospital.org',
    facilityId: 'FAC-DH-01'
  },
  {
    id: 'USR-03',
    name: 'Dr. Anita Rao',
    role: 'CLINICIAN_LEAD',
    department: 'Obstetrics & Gynaecology Lead',
    email: 'dr.anita.rao@district-hospital.org',
    facilityId: 'FAC-DH-01'
  },
  {
    id: 'USR-04',
    name: 'Ramesh Patil',
    role: 'LAB_USER',
    department: 'Pathology & Serology Unit',
    email: 'ramesh.lab@district-hospital.org',
    facilityId: 'FAC-DH-01'
  },
  {
    id: 'USR-05',
    name: 'Dr. Mallikarjun S.',
    role: 'HOSPITAL_ADMIN',
    department: 'Hospital Administration',
    email: 'admin.dh@karnataka.gov.in',
    facilityId: 'FAC-DH-01'
  },
  {
    id: 'USR-06',
    name: 'Vyuhaa System Admin',
    role: 'SUPER_ADMIN',
    department: 'Registry Core Operations',
    email: 'superadmin@vyuhaameddata.org',
    facilityId: 'FAC-DH-01'
  }
];

// Helper to generate realistic dates relative to today
const today = new Date('2026-10-01');

// Generate 50 Patients
export const SEED_PATIENTS: Patient[] = [
  // 1. Sunita D. (Deck seed example)
  {
    id: 'PAT-001',
    patientIdNumber: 'DH-ANC-2026-0041',
    abhaNumber: '91-8842-1049-2311',
    abhaAddress: 'sunita.devi@abdm',
    name: 'Sunita D.',
    dob: '1998-04-12',
    age: 28,
    gender: 'female',
    mobile: '+91 98452 11029',
    preferredLanguage: 'Kannada',
    facilityId: 'FAC-DH-01',
    registeredAt: '2026-03-10',
    address: { villageOrTown: 'Unkal, Hubballi', talukOrDistrict: 'Dharwad', pincode: '580031' },
    bloodGroup: 'B',
    rhFactor: 'Positive',
    guardianName: 'Ravi D. (Husband)',
    currentEpisodeType: 'pregnancy',
    currentEpisodeId: 'PREG-001',
    activeCareGapsCount: 1,
    lastContactDate: '2026-09-20',
    lastVisitDate: '2026-08-15',
    status: 'ACTIVE'
  },
  // 2. Meena R. (Deck seed example)
  {
    id: 'PAT-002',
    patientIdNumber: 'DH-ANC-2026-0082',
    abhaNumber: '91-7721-3948-1102',
    abhaAddress: 'meena.r@abdm',
    name: 'Meena R.',
    dob: '2001-09-24',
    age: 25,
    gender: 'female',
    mobile: '+91 98860 44219',
    preferredLanguage: 'Kannada',
    facilityId: 'FAC-DH-01',
    registeredAt: '2026-04-18',
    address: { villageOrTown: 'Gokul Road', talukOrDistrict: 'Dharwad', pincode: '580030' },
    bloodGroup: 'A',
    rhFactor: 'Positive',
    guardianName: 'Prakash R. (Husband)',
    currentEpisodeType: 'pregnancy',
    currentEpisodeId: 'PREG-002',
    activeCareGapsCount: 1,
    lastContactDate: '2026-09-25',
    lastVisitDate: '2026-08-10',
    status: 'ACTIVE'
  },
  // 3. Anjali P. (Deck seed example - Rh negative)
  {
    id: 'PAT-003',
    patientIdNumber: 'DH-ANC-2026-0019',
    abhaNumber: '91-6651-8890-4412',
    abhaAddress: 'anjali.patil@abdm',
    name: 'Anjali P.',
    dob: '1996-11-05',
    age: 30,
    gender: 'female',
    mobile: '+91 94481 99014',
    preferredLanguage: 'Marathi',
    facilityId: 'FAC-DH-01',
    registeredAt: '2026-02-14',
    address: { villageOrTown: 'Vidyanagar', talukOrDistrict: 'Dharwad', pincode: '580021' },
    bloodGroup: 'O',
    rhFactor: 'Negative',
    guardianName: 'Sanjay P.',
    currentEpisodeType: 'pregnancy',
    currentEpisodeId: 'PREG-003',
    activeCareGapsCount: 1,
    lastContactDate: '2026-09-15',
    lastVisitDate: '2026-07-28',
    status: 'ACTIVE'
  },
  // 4. Farida B. (Deck seed example - Flagged growth scan due)
  {
    id: 'PAT-004',
    patientIdNumber: 'DH-ANC-2026-0105',
    abhaNumber: '91-9923-4112-7801',
    abhaAddress: 'farida.b@abdm',
    name: 'Farida B.',
    dob: '1999-07-19',
    age: 27,
    gender: 'female',
    mobile: '+91 97412 88201',
    preferredLanguage: 'Hindi',
    facilityId: 'FAC-DH-01',
    registeredAt: '2026-01-20',
    address: { villageOrTown: 'Old Hubballi', talukOrDistrict: 'Dharwad', pincode: '580024' },
    bloodGroup: 'AB',
    rhFactor: 'Positive',
    guardianName: 'Irfan B.',
    currentEpisodeType: 'pregnancy',
    currentEpisodeId: 'PREG-004',
    activeCareGapsCount: 1,
    lastContactDate: '2026-09-28',
    lastVisitDate: '2026-09-12',
    status: 'ACTIVE'
  },
  // 5. Rekha M. (Mother of Baby of Rekha M. - Deck seed example)
  {
    id: 'PAT-005',
    patientIdNumber: 'DH-PNC-2026-0091',
    abhaNumber: '91-5510-7744-1290',
    abhaAddress: 'rekha.manjunath@abdm',
    name: 'Rekha M.',
    dob: '1997-03-30',
    age: 29,
    gender: 'female',
    mobile: '+91 99001 77209',
    preferredLanguage: 'Kannada',
    facilityId: 'FAC-DH-01',
    registeredAt: '2025-11-10',
    address: { villageOrTown: 'Navanagar', talukOrDistrict: 'Dharwad', pincode: '580025' },
    bloodGroup: 'B',
    rhFactor: 'Positive',
    guardianName: 'Manjunath K.',
    currentEpisodeType: 'child',
    currentEpisodeId: 'CH-001',
    activeCareGapsCount: 1,
    lastContactDate: '2026-09-22',
    lastVisitDate: '2026-07-20',
    status: 'ACTIVE'
  }
];

// Seed additional realistic patients to reach 50 mothers
const femaleNames = [
  'Deepa K.', 'Kavita S.', 'Laxmi G.', 'Nirmala H.', 'Preeti V.', 'Radha N.', 'Shilpa T.', 'Vidya M.', 'Asha B.', 'Bhavana P.',
  'Chaitra L.', 'Divya S.', 'Geeta C.', 'Hemavathi R.', 'Indira K.', 'Jayashree D.', 'Kiran B.', 'Lata N.', 'Madhu S.', 'Netravati P.',
  'Pallavi H.', 'Renuka V.', 'Savitri G.', 'Tejaswini M.', 'Usha K.', 'Vani D.', 'Yashoda B.', 'Archana S.', 'Bhagya R.', 'Chandrika K.',
  'Dhanalakshmi T.', 'Gouri P.', 'Jyothi V.', 'Kalpana M.', 'Mallamma H.', 'Nandini B.', 'Padma S.', 'Roopa N.', 'Sharada K.', 'Tulasi D.',
  'Vasantha R.', 'Zainab M.', 'Fatima S.', 'Noorjahan K.', 'Shabana P.'
];

femaleNames.forEach((name, idx) => {
  const num = idx + 6;
  const idStr = String(num).padStart(3, '0');
  SEED_PATIENTS.push({
    id: `PAT-${idStr}`,
    patientIdNumber: `DH-ANC-2026-${String(100 + num)}`,
    abhaNumber: `91-${Math.floor(2000 + Math.random() * 7000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    abhaAddress: `${name.toLowerCase().replace(/[^a-z]/g, '')}${num}@abdm`,
    name,
    dob: `199${Math.floor(2 + Math.random() * 7)}-0${Math.floor(1 + Math.random() * 8)}-15`,
    age: 22 + (num % 12),
    gender: 'female',
    mobile: `+91 9${Math.floor(400000000 + Math.random() * 500000000)}`,
    preferredLanguage: num % 4 === 0 ? 'Hindi' : num % 5 === 0 ? 'Marathi' : 'Kannada',
    facilityId: 'FAC-DH-01',
    registeredAt: '2026-02-15',
    address: { villageOrTown: 'Dharwad Taluk', talukOrDistrict: 'Dharwad', pincode: '580001' },
    bloodGroup: num % 3 === 0 ? 'O' : num % 2 === 0 ? 'B' : 'A',
    rhFactor: num === 14 || num === 28 ? 'Negative' : 'Positive',
    guardianName: 'Husband / Family',
    currentEpisodeType: num > 35 ? 'child' : 'pregnancy',
    currentEpisodeId: num > 35 ? `CH-${idStr}` : `PREG-${idStr}`,
    activeCareGapsCount: num % 3 === 0 ? 2 : 1,
    status: 'ACTIVE'
  });
});

// Seed 35 Active Pregnancies
export const SEED_PREGNANCIES: PregnancyEpisode[] = [
  // 1. Sunita D.
  {
    id: 'PREG-001',
    motherId: 'PAT-001',
    motherName: 'Sunita D.',
    motherAbha: '91-8842-1049-2311',
    lmpDate: '2026-02-24',
    datingScanDate: '2026-04-10',
    edd: '2026-12-01',
    currentGestationalAgeWeeks: 31, // Expected glucose was 24-28, currently 31 -> Overdue 3 wks!
    status: 'ACTIVE',
    gravida: 2,
    para: 1,
    flags: ['Previous LSCS'],
    facilityId: 'FAC-DH-01',
    registrationDate: '2026-03-10',
    notes: 'Enrolled at 6 weeks. Blood group B Rh-positive.'
  },
  // 2. Meena R.
  {
    id: 'PREG-002',
    motherId: 'PAT-002',
    motherName: 'Meena R.',
    motherAbha: '91-7721-3948-1102',
    lmpDate: '2026-04-23',
    datingScanDate: '2026-06-15',
    edd: '2027-01-28',
    currentGestationalAgeWeeks: 23, // Expected anomaly scan 18-22, currently 23 -> Overdue 1 wk!
    status: 'ACTIVE',
    gravida: 1,
    para: 0,
    flags: ['Primi gravida'],
    facilityId: 'FAC-DH-01',
    registrationDate: '2026-05-10',
    notes: 'Primi pregnancy. Needs TIFFA scan confirmation.'
  },
  // 3. Anjali P.
  {
    id: 'PREG-003',
    motherId: 'PAT-003',
    motherName: 'Anjali P.',
    motherAbha: '91-6651-8890-4412',
    lmpDate: '2026-02-10',
    datingScanDate: '2026-03-28',
    edd: '2026-11-17',
    currentGestationalAgeWeeks: 33, // Expected Rh antibody screen at 28 wks, currently 33 -> Overdue 5 wks!
    status: 'ACTIVE',
    gravida: 2,
    para: 1,
    flags: ['Rh negative', 'Previous abortion'],
    facilityId: 'FAC-DH-01',
    registrationDate: '2026-03-02',
    notes: 'Rh-negative mother. Crucial window for indirect Coombs test / Anti-D prophylaxis.'
  },
  // 4. Farida B.
  {
    id: 'PREG-004',
    motherId: 'PAT-004',
    motherName: 'Farida B.',
    motherAbha: '91-9923-4112-7801',
    lmpDate: '2026-02-05',
    datingScanDate: '2026-03-20',
    edd: '2026-11-12',
    currentGestationalAgeWeeks: 34, // Exactly 34 weeks, Growth scan due today!
    status: 'ACTIVE',
    gravida: 3,
    para: 2,
    flags: ['pregnancy flagged small', 'Mild FGR suspect'], // Clinician recorded input
    facilityId: 'FAC-DH-01',
    registrationDate: '2026-02-28',
    notes: 'Flagged small for gestational age at 28 week check. Serial growth ultrasound requested.'
  }
];

// Add 31 more active pregnancies
for (let i = 5; i <= 35; i++) {
  const p = SEED_PATIENTS[i - 1];
  const gWeeks = 12 + (i % 26);
  SEED_PREGNANCIES.push({
    id: `PREG-${String(i).padStart(3, '0')}`,
    motherId: p.id,
    motherName: p.name,
    motherAbha: p.abhaNumber,
    lmpDate: '2026-03-15',
    datingScanDate: '2026-05-02',
    edd: '2026-12-20',
    currentGestationalAgeWeeks: gWeeks,
    status: 'ACTIVE',
    gravida: 1 + (i % 3),
    para: i % 2,
    flags: i % 5 === 0 ? ['GDM suspect'] : i % 7 === 0 ? ['Anaemia moderate'] : [],
    facilityId: 'FAC-DH-01',
    registrationDate: '2026-04-01'
  });
}

// Seed 15 Newborns linked to Mother ABHA
export const SEED_NEWBORNS: NewbornRecord[] = [
  {
    id: 'NB-001',
    babyName: 'Baby of Rekha M.',
    motherId: 'PAT-005',
    motherName: 'Rekha M.',
    pregnancyId: 'PREG-005-COMPLETED',
    dob: '2026-07-08',
    timeOfBirth: '06:45 AM',
    sex: 'male',
    abhaNumber: '91-5510-7744-1290-C1', // Inherits mother linked ABHA
    motherAbha: '91-5510-7744-1290',
    birthWeightKg: 2.95,
    apgarScore: '8/10 at 1 min, 9/10 at 5 mins',
    deliveryType: 'Normal Vaginal',
    facilityId: 'FAC-DH-01',
    status: 'ACTIVE'
  },
  {
    id: 'NB-002',
    babyName: 'Baby of Kavita S.',
    motherId: 'PAT-007',
    motherName: 'Kavita S.',
    pregnancyId: 'PREG-007-COMPLETED',
    dob: '2026-09-24',
    timeOfBirth: '11:15 AM',
    sex: 'female',
    abhaNumber: '91-4412-8899-0112-C1',
    motherAbha: '91-4412-8899-0112',
    birthWeightKg: 3.1,
    apgarScore: '9/10',
    deliveryType: 'Caesarean Section',
    facilityId: 'FAC-DH-01',
    status: 'ACTIVE'
  }
];

// Add more newborns up to 15
for (let i = 3; i <= 15; i++) {
  const motherIdx = 34 + i;
  const m = SEED_PATIENTS[motherIdx] || SEED_PATIENTS[i];
  SEED_NEWBORNS.push({
    id: `NB-${String(i).padStart(3, '0')}`,
    babyName: `Baby of ${m.name}`,
    motherId: m.id,
    motherName: m.name,
    pregnancyId: `PREG-${String(i + 20).padStart(3, '0')}`,
    dob: '2026-09-15',
    timeOfBirth: '08:30 AM',
    sex: i % 2 === 0 ? 'female' : 'male',
    abhaNumber: `${m.abhaNumber}-C1`,
    motherAbha: m.abhaNumber,
    birthWeightKg: 2.7 + (i * 0.05),
    apgarScore: '8/10',
    deliveryType: i % 3 === 0 ? 'Caesarean Section' : 'Normal Vaginal',
    facilityId: 'FAC-DH-01',
    status: 'ACTIVE'
  });
}

// Seed 30 Children
export const SEED_CHILDREN: ChildEpisode[] = [
  // Baby of Rekha M. - Deck seed example: 10 wks immunisation dose overdue +2 wks!
  {
    id: 'CH-001',
    patientId: 'PAT-005',
    childName: 'Baby of Rekha M.',
    motherId: 'PAT-005',
    motherName: 'Rekha M.',
    dob: '2026-07-08',
    currentAgeWeeks: 12, // Born 12 weeks ago, 10 week dose expected -> Overdue by 2 weeks!
    sex: 'male',
    facilityId: 'FAC-DH-01',
    recordedImmunisations: [
      { vaccineName: 'BCG', doseNumber: 0, administeredDate: '2026-07-08', recordedBy: 'Sister Savitha' },
      { vaccineName: 'OPV', doseNumber: 0, administeredDate: '2026-07-08', recordedBy: 'Sister Savitha' },
      { vaccineName: 'Hepatitis B', doseNumber: 0, administeredDate: '2026-07-08', recordedBy: 'Sister Savitha' },
      { vaccineName: 'Pentavalent', doseNumber: 1, administeredDate: '2026-08-20', recordedBy: 'Sister Savitha' },
      { vaccineName: 'OPV', doseNumber: 1, administeredDate: '2026-08-20', recordedBy: 'Sister Savitha' }
    ],
    growthChecks: [
      { date: '2026-07-08', ageWeeks: 0, weightKg: 2.95, recordedBy: 'Staff Nurse' },
      { date: '2026-08-20', ageWeeks: 6, weightKg: 4.1, recordedBy: 'Sister Savitha', notes: 'Adequate weight gain recorded.' }
    ]
  }
];

// Add 29 more children
for (let i = 2; i <= 30; i++) {
  const ageW = 6 + (i * 2);
  const m = SEED_PATIENTS[i + 5] || SEED_PATIENTS[0];
  SEED_CHILDREN.push({
    id: `CH-${String(i).padStart(3, '0')}`,
    patientId: m.id,
    childName: `Child of ${m.name}`,
    motherId: m.id,
    motherName: m.name,
    dob: '2026-06-01',
    currentAgeWeeks: ageW,
    sex: i % 2 === 0 ? 'female' : 'male',
    facilityId: 'FAC-DH-01',
    recordedImmunisations: [
      { vaccineName: 'BCG', doseNumber: 0, administeredDate: '2026-06-01', recordedBy: 'Sister Savitha' }
    ],
    growthChecks: [
      { date: '2026-06-01', ageWeeks: 0, weightKg: 3.0, recordedBy: 'Staff Nurse' }
    ]
  });
}

// Seed 100+ Care Gaps with the 24 OVERDUE, 11 DUE TODAY matching prompt metrics
export const SEED_CARE_GAPS: CareGap[] = [
  // 1. Sunita D. - Deck verbatim
  {
    id: 'GAP-001',
    patientId: 'PAT-001',
    patientName: 'Sunita D.',
    patientMobile: '+91 98452 11029',
    patientAbha: '91-8842-1049-2311',
    population: 'pregnancy',
    episodeId: 'PREG-001',
    episodeLabel: 'Pregnancy 28 wks',
    gestationOrAgeDisplay: '28 wks',
    ruleId: 'A7',
    gapTitle: 'Glucose test not done',
    category: 'antenatal',
    expectedWindowDisplay: '24–28 weeks',
    currentGestationalAgeWeeks: 31,
    overdueDurationDisplay: '+3 wks',
    overdueDurationWeeks: 3,
    status: 'OVERDUE',
    plainReason: 'Glucose test not done. Expected between 24–28 weeks. Patient is currently 31 weeks. Overdue by 3 weeks.',
    requiredAction: 'record_test',
    assignedTo: 'Sister Savitha K.',
    contactAttemptsCount: 0,
    facilityId: 'FAC-DH-01',
    createdAt: '2026-09-08',
    updatedAt: '2026-10-01'
  },
  // 2. Meena R. - Deck verbatim
  {
    id: 'GAP-002',
    patientId: 'PAT-002',
    patientName: 'Meena R.',
    patientMobile: '+91 98860 44219',
    patientAbha: '91-7721-3948-1102',
    population: 'pregnancy',
    episodeId: 'PREG-002',
    episodeLabel: 'Pregnancy 23 wks',
    gestationOrAgeDisplay: '23 wks',
    ruleId: 'F3',
    gapTitle: 'Anomaly scan not recorded',
    category: 'foetal',
    expectedWindowDisplay: '18–22 weeks',
    currentGestationalAgeWeeks: 23,
    overdueDurationDisplay: '+1 wk',
    overdueDurationWeeks: 1,
    status: 'OVERDUE',
    plainReason: 'Anomaly scan not recorded. Expected window 18–22 weeks. Patient is currently 23 weeks. Overdue by 1 week.',
    requiredAction: 'record_scan',
    assignedTo: 'Pooja Naik',
    contactAttemptsCount: 0,
    facilityId: 'FAC-DH-01',
    createdAt: '2026-09-22',
    updatedAt: '2026-10-01'
  },
  // 3. Anjali P. - Deck verbatim
  {
    id: 'GAP-003',
    patientId: 'PAT-003',
    patientName: 'Anjali P.',
    patientMobile: '+91 94481 99014',
    patientAbha: '91-6651-8890-4412',
    population: 'pregnancy',
    episodeId: 'PREG-003',
    episodeLabel: 'Pregnancy Rh-negative',
    gestationOrAgeDisplay: 'Rh-negative',
    ruleId: 'A9',
    gapTitle: 'No antibody screen',
    category: 'antenatal',
    expectedWindowDisplay: '28 weeks',
    currentGestationalAgeWeeks: 33,
    overdueDurationDisplay: '+5 wks',
    overdueDurationWeeks: 5,
    status: 'OVERDUE',
    plainReason: 'Rh Antibody screen not recorded for Rh-negative mother. Expected at 28 weeks. Patient is currently 33 weeks. Overdue by 5 weeks.',
    requiredAction: 'record_test',
    assignedTo: 'Sister Savitha K.',
    contactAttemptsCount: 1,
    lastContactedAt: '2026-09-15',
    lastContactChannel: 'whatsapp',
    facilityId: 'FAC-DH-01',
    createdAt: '2026-08-25',
    updatedAt: '2026-10-01'
  },
  // 4. Farida B. - Deck verbatim
  {
    id: 'GAP-004',
    patientId: 'PAT-004',
    patientName: 'Farida B.',
    patientMobile: '+91 97412 88201',
    patientAbha: '91-9923-4112-7801',
    population: 'pregnancy',
    episodeId: 'PREG-004',
    episodeLabel: 'Pregnancy 34 wks',
    gestationOrAgeDisplay: '34 wks',
    ruleId: 'F4',
    gapTitle: 'Growth scan due',
    category: 'foetal',
    expectedWindowDisplay: '32–34 weeks',
    currentGestationalAgeWeeks: 34,
    overdueDurationDisplay: 'Today',
    overdueDurationWeeks: 0,
    status: 'DUE',
    plainReason: 'Growth surveillance scan due for flagged pregnancy interval at 34 weeks. Due today.',
    requiredAction: 'record_scan',
    assignedTo: 'Sister Savitha K.',
    contactAttemptsCount: 0,
    facilityId: 'FAC-DH-01',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01'
  },
  // 5. Baby of Rekha M. - Deck verbatim
  {
    id: 'GAP-005',
    patientId: 'PAT-005',
    patientName: 'Baby of Rekha M.',
    patientMobile: '+91 99001 77209',
    patientAbha: '91-5510-7744-1290-C1',
    population: 'child',
    episodeId: 'CH-001',
    episodeLabel: 'Child 10 wks',
    gestationOrAgeDisplay: '10 wks',
    ruleId: 'C2',
    gapTitle: 'Immunisation dose overdue',
    category: 'child',
    expectedWindowDisplay: '10 weeks',
    currentAgeWeeks: 12,
    overdueDurationDisplay: '+2 wks',
    overdueDurationWeeks: 2,
    status: 'OVERDUE',
    plainReason: '10-week immunisation series (Pentavalent-2, OPV-2) not recorded. Expected at 10 weeks. Child is 12 weeks. Overdue by 2 weeks.',
    requiredAction: 'record_immunisation',
    assignedTo: 'Pooja Naik',
    contactAttemptsCount: 0,
    facilityId: 'FAC-DH-01',
    createdAt: '2026-09-17',
    updatedAt: '2026-10-01'
  }
];

// Seed 21 more OVERDUE gaps so total overdue = 24 (matching prompt dashboard seed)
const overdueTemplates = [
  { ruleId: 'A2', gapTitle: 'Booking blood panel not recorded', category: 'antenatal' as const, window: '8–12 weeks', reason: 'Booking bloods (CBC, Blood Group, VDRL, HIV, HBsAg) not recorded. Expected between 8–12 weeks.', action: 'record_test' },
  { ruleId: 'A3', gapTitle: 'Antenatal Td Dose 1 not administered', category: 'antenatal' as const, window: '14–16 weeks', reason: 'Antenatal Td1 overdue by 2 weeks. Expected at 14–16 weeks.', action: 'record_immunisation' },
  { ruleId: 'F2', gapTitle: '11–14 Week early scan missed', category: 'foetal' as const, window: '11–14 weeks', reason: 'Nuchal translucency scan window passed without recorded scan report.', action: 'record_scan' },
  { ruleId: 'P4', gapTitle: 'Glucose test after GDM not done', category: 'postnatal' as const, window: '6–12 weeks postpartum', reason: 'Postpartum OGTT 75g not recorded for mother with GDM. Overdue by 4 weeks.', action: 'record_test' },
  { ruleId: 'N4', gapTitle: 'Newborn screening sample: no report', category: 'newborn' as const, window: 'Day 3–7', reason: 'Newborn screening sample sent per unit protocol: overdue +1 week, no report recorded.', action: 'record_test' },
  { ruleId: 'C1', gapTitle: '6-week Immunisation series overdue', category: 'child' as const, window: '6 weeks', reason: 'Pentavalent-1 and OPV-1 not recorded. Overdue by 3 weeks.', action: 'record_immunisation' },
  { ruleId: 'A8', gapTitle: 'Third trimester Hb re-test not done', category: 'antenatal' as const, window: '28–32 weeks', reason: 'Third trimester anaemia screening overdue by 2 weeks.', action: 'record_test' }
];

for (let i = 6; i <= 24; i++) {
  const pat = SEED_PATIENTS[i] || SEED_PATIENTS[i % SEED_PATIENTS.length];
  const tmpl = overdueTemplates[i % overdueTemplates.length];
  const odWks = 1 + (i % 4);
  SEED_CARE_GAPS.push({
    id: `GAP-${String(i).padStart(3, '0')}`,
    patientId: pat.id,
    patientName: pat.name,
    patientMobile: pat.mobile,
    patientAbha: pat.abhaNumber,
    population: tmpl.category === 'child' ? 'child' : tmpl.category === 'newborn' ? 'newborn' : 'pregnancy',
    episodeId: pat.currentEpisodeId || `PREG-${i}`,
    episodeLabel: `${pat.currentEpisodeType || 'Pregnancy'} ${20 + i} wks`,
    gestationOrAgeDisplay: `${20 + (i % 15)} wks`,
    ruleId: tmpl.ruleId,
    gapTitle: tmpl.gapTitle,
    category: tmpl.category,
    expectedWindowDisplay: tmpl.window,
    overdueDurationDisplay: `+${odWks} wks`,
    overdueDurationWeeks: odWks,
    status: 'OVERDUE',
    plainReason: `${tmpl.reason} Overdue by ${odWks} weeks.`,
    requiredAction: tmpl.action,
    assignedTo: i % 2 === 0 ? 'Sister Savitha K.' : 'Pooja Naik',
    contactAttemptsCount: i % 3 === 0 ? 1 : 0,
    facilityId: 'FAC-DH-01',
    createdAt: '2026-09-15',
    updatedAt: '2026-10-01'
  });
}

// Seed 10 more DUE TODAY gaps so total due today = 11 (GAP-004 is 1st)
for (let i = 25; i <= 34; i++) {
  const pat = SEED_PATIENTS[i] || SEED_PATIENTS[0];
  SEED_CARE_GAPS.push({
    id: `GAP-${String(i).padStart(3, '0')}`,
    patientId: pat.id,
    patientName: pat.name,
    patientMobile: pat.mobile,
    patientAbha: pat.abhaNumber,
    population: 'pregnancy',
    episodeId: pat.currentEpisodeId || `PREG-${i}`,
    episodeLabel: 'Pregnancy 24 wks',
    gestationOrAgeDisplay: '24 wks',
    ruleId: 'A6',
    gapTitle: 'Mid-pregnancy BP and urine check due',
    category: 'antenatal',
    expectedWindowDisplay: '20–24 weeks',
    overdueDurationDisplay: 'Today',
    overdueDurationWeeks: 0,
    status: 'DUE',
    plainReason: 'Mid-pregnancy antenatal visit for BP check and urine albumin due today.',
    requiredAction: 'record_visit',
    assignedTo: 'Sister Savitha K.',
    contactAttemptsCount: 0,
    facilityId: 'FAC-DH-01',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01'
  });
}

// Seed 38 CLOSED gaps (Closed this week: 38)
for (let i = 35; i <= 72; i++) {
  const pat = SEED_PATIENTS[i % SEED_PATIENTS.length];
  SEED_CARE_GAPS.push({
    id: `GAP-${String(i).padStart(3, '0')}`,
    patientId: pat.id,
    patientName: pat.name,
    patientMobile: pat.mobile,
    patientAbha: pat.abhaNumber,
    population: 'pregnancy',
    episodeId: pat.currentEpisodeId || `PREG-${i}`,
    episodeLabel: 'Pregnancy 20 wks',
    gestationOrAgeDisplay: '20 wks',
    ruleId: 'F3',
    gapTitle: 'Anomaly scan completed',
    category: 'foetal',
    expectedWindowDisplay: '18–22 weeks',
    overdueDurationDisplay: 'Closed',
    overdueDurationWeeks: 0,
    status: 'CLOSED',
    plainReason: 'Anomaly scan recorded by Dr. Anita Rao. No structural anomalies detected.',
    requiredAction: 'record_scan',
    assignedTo: 'Sister Savitha K.',
    contactAttemptsCount: 1,
    closedAt: '2026-09-29',
    closedBy: 'Dr. Anita Rao',
    closureReason: 'Scan report uploaded and verified.',
    facilityId: 'FAC-DH-01',
    createdAt: '2026-09-10',
    updatedAt: '2026-09-29'
  });
}

// Seed 30 more gaps (Due soon or Not due) to reach 102 total gaps
for (let i = 73; i <= 102; i++) {
  const pat = SEED_PATIENTS[i % SEED_PATIENTS.length];
  SEED_CARE_GAPS.push({
    id: `GAP-${String(i).padStart(3, '0')}`,
    patientId: pat.id,
    patientName: pat.name,
    patientMobile: pat.mobile,
    patientAbha: pat.abhaNumber,
    population: 'pregnancy',
    episodeId: pat.currentEpisodeId || `PREG-${i}`,
    episodeLabel: 'Pregnancy 16 wks',
    gestationOrAgeDisplay: '16 wks',
    ruleId: 'A4',
    gapTitle: 'Td Dose 2 upcoming',
    category: 'antenatal',
    expectedWindowDisplay: '18–20 weeks',
    overdueDurationDisplay: 'Due in 2 wks',
    overdueDurationWeeks: 0,
    status: 'NOT_DUE',
    plainReason: 'Td Dose 2 scheduled at 18–20 weeks. Currently 16 weeks gestation.',
    requiredAction: 'record_immunisation',
    assignedTo: 'Pooja Naik',
    contactAttemptsCount: 0,
    facilityId: 'FAC-DH-01',
    createdAt: '2026-09-20',
    updatedAt: '2026-10-01'
  });
}

// Seed 50 Laboratory Samples, 30 Reports with Unresolved Abnormal Reports
export const SEED_LAB_SAMPLES: LaboratorySample[] = [
  // 1. High priority positive result awaiting action: HBsAg positive
  {
    id: 'LAB-001',
    sampleId: 'SMP-2026-0891',
    patientId: 'PAT-006',
    patientName: 'Deepa K.',
    patientAbha: '91-3829-1029-4411',
    episodeType: 'pregnancy',
    episodeId: 'PREG-006',
    testName: 'HBsAg Hepatitis B Surface Antigen (Serology)',
    testCategory: 'Serology',
    collectionDate: '2026-09-27',
    sendingDepartment: 'Antenatal OPD Clinic',
    status: 'REVIEWED',
    expectedReportDate: '2026-09-28',
    reportDate: '2026-09-28',
    readerName: 'Ramesh Patil (Senior Lab Tech)',
    isAbnormal: true,
    resultSummary: 'REACTIVE / POSITIVE for HBsAg',
    actionRequired: true,
    actionRequiredDetails: 'Urgent maternal viral load, newborn Hepatitis B Immunoglobulin (HBIG) + HepB birth vaccine coordination required at delivery.',
    actionRecorded: false,
    closureStatus: 'PENDING_ACTION',
    facilityId: 'FAC-DH-01'
  },
  // 2. High priority positive: Rh Negative with positive Indirect Coombs Test
  {
    id: 'LAB-002',
    sampleId: 'SMP-2026-0892',
    patientId: 'PAT-003',
    patientName: 'Anjali P.',
    patientAbha: '91-6651-8890-4412',
    episodeType: 'pregnancy',
    episodeId: 'PREG-003',
    testName: 'Indirect Coombs Test (Rh Antibody Titer)',
    testCategory: 'Serology',
    collectionDate: '2026-09-26',
    sendingDepartment: 'High Risk Antenatal OPD',
    status: 'REVIEWED',
    expectedReportDate: '2026-09-27',
    reportDate: '2026-09-27',
    readerName: 'Ramesh Patil',
    isAbnormal: true,
    resultSummary: 'Anti-D Antibodies DETECTED (Titer 1:16)',
    actionRequired: true,
    actionRequiredDetails: 'Isoimmunisation alert. Clinical lead review for foetal MCA Doppler monitoring.',
    actionRecorded: false,
    closureStatus: 'PENDING_ACTION',
    facilityId: 'FAC-DH-01'
  },
  // 3. Elevated OGTT Glucose awaiting action
  {
    id: 'LAB-003',
    sampleId: 'SMP-2026-0895',
    patientId: 'PAT-008',
    patientName: 'Laxmi G.',
    patientAbha: '91-4412-8899-0112',
    episodeType: 'pregnancy',
    episodeId: 'PREG-008',
    testName: 'Oral Glucose Tolerance Test 75g (OGTT)',
    testCategory: 'Biochemistry',
    collectionDate: '2026-09-28',
    sendingDepartment: 'Antenatal OPD',
    status: 'REVIEWED',
    expectedReportDate: '2026-09-29',
    reportDate: '2026-09-29',
    readerName: 'Ramesh Patil',
    isAbnormal: true,
    resultSummary: 'Fasting: 104 mg/dL (Elevated), 2-hr: 168 mg/dL (Elevated)',
    actionRequired: true,
    actionRequiredDetails: 'Gestational Diabetes Mellitus confirmed. Diet counselling & endocrinology/MCH referral needed.',
    actionRecorded: false,
    closureStatus: 'PENDING_ACTION',
    facilityId: 'FAC-DH-01'
  },
  // 4. Severe Anaemia Hb < 7.5 g/dL awaiting action
  {
    id: 'LAB-004',
    sampleId: 'SMP-2026-0898',
    patientId: 'PAT-009',
    patientName: 'Nirmala H.',
    patientAbha: '91-9988-1234-5678',
    episodeType: 'pregnancy',
    episodeId: 'PREG-009',
    testName: 'Complete Blood Count (Haemoglobin)',
    testCategory: 'Haematology',
    collectionDate: '2026-09-29',
    sendingDepartment: 'Antenatal OPD',
    status: 'REVIEWED',
    expectedReportDate: '2026-09-29',
    reportDate: '2026-09-29',
    readerName: 'Ramesh Patil',
    isAbnormal: true,
    resultSummary: 'Hb: 7.2 g/dL (Severe microcytic hypochromic anaemia)',
    actionRequired: true,
    actionRequiredDetails: 'IV Iron sucrose infusion protocol to be scheduled at Day Care.',
    actionRecorded: false,
    closureStatus: 'PENDING_ACTION',
    facilityId: 'FAC-DH-01'
  },
  // 5. Newborn Screening DBS Sample - In Transit
  {
    id: 'LAB-005',
    sampleId: 'SMP-2026-0901',
    patientId: 'PAT-005',
    patientName: 'Baby of Rekha M.',
    patientAbha: '91-5510-7744-1290-C1',
    episodeType: 'newborn',
    episodeId: 'NB-001',
    testName: 'Newborn Screening Filter Paper (TSH / DBS)',
    testCategory: 'Newborn Screening',
    collectionDate: '2026-09-25',
    sendingDepartment: 'Postnatal Ward',
    status: 'SENT',
    expectedReportDate: '2026-10-02',
    closureStatus: 'PENDING_REPORT',
    facilityId: 'FAC-DH-01'
  },
  // 6. Syphilis VDRL Reactive - Awaiting action
  {
    id: 'LAB-006',
    sampleId: 'SMP-2026-0904',
    patientId: 'PAT-010',
    patientName: 'Preeti V.',
    patientAbha: '91-7711-2233-4455',
    episodeType: 'pregnancy',
    episodeId: 'PREG-010',
    testName: 'VDRL / RPR Syphilis Screen',
    testCategory: 'Serology',
    collectionDate: '2026-09-28',
    sendingDepartment: 'Antenatal OPD',
    status: 'REVIEWED',
    expectedReportDate: '2026-09-29',
    reportDate: '2026-09-29',
    readerName: 'Ramesh Patil',
    isAbnormal: true,
    resultSummary: 'Reactive (Titer 1:8)',
    actionRequired: true,
    actionRequiredDetails: 'TPHA confirmation and Benzathine Penicillin protocol for mother and partner contact tracing.',
    actionRecorded: false,
    closureStatus: 'PENDING_ACTION',
    facilityId: 'FAC-DH-01'
  },
  // 7. Urine Culture - Significant Growth awaiting action
  {
    id: 'LAB-007',
    sampleId: 'SMP-2026-0909',
    patientId: 'PAT-011',
    patientName: 'Radha N.',
    patientAbha: '91-8822-3344-5566',
    episodeType: 'pregnancy',
    episodeId: 'PREG-011',
    testName: 'Urine Routine & Microscopic Culture',
    testCategory: 'Microbiology',
    collectionDate: '2026-09-27',
    sendingDepartment: 'Antenatal OPD',
    status: 'REVIEWED',
    expectedReportDate: '2026-09-30',
    reportDate: '2026-09-30',
    readerName: 'Ramesh Patil',
    isAbnormal: true,
    resultSummary: 'E. coli > 10^5 CFU/mL (Asymptomatic Bacteriuria)',
    actionRequired: true,
    actionRequiredDetails: 'Antibiotic prescription per sensitivity panel (Nitrofurantoin/Cephalosporin safe in pregnancy).',
    actionRecorded: false,
    closureStatus: 'PENDING_ACTION',
    facilityId: 'FAC-DH-01'
  }
];

// Add 43 more lab samples (normal reports, sent samples, closed result loops) to reach 50
for (let i = 8; i <= 50; i++) {
  const pat = SEED_PATIENTS[i % SEED_PATIENTS.length];
  const isLoopClosed = i > 25;
  const isReceived = i > 15 && !isLoopClosed;

  SEED_LAB_SAMPLES.push({
    id: `LAB-${String(i).padStart(3, '0')}`,
    sampleId: `SMP-2026-${String(910 + i)}`,
    patientId: pat.id,
    patientName: pat.name,
    patientAbha: pat.abhaNumber,
    episodeType: 'pregnancy',
    episodeId: pat.currentEpisodeId || `PREG-${i}`,
    testName: i % 3 === 0 ? 'Complete Haemogram (CBC)' : i % 2 === 0 ? 'Blood Group & Rh Typing' : 'Thyroid Stimulating Hormone (TSH)',
    testCategory: i % 3 === 0 ? 'Haematology' : i % 2 === 0 ? 'Serology' : 'Biochemistry',
    collectionDate: '2026-09-20',
    sendingDepartment: 'Antenatal OPD Desk',
    status: isLoopClosed ? 'CLOSED' : isReceived ? 'RECEIVED' : 'SENT',
    expectedReportDate: '2026-09-22',
    reportDate: isReceived || isLoopClosed ? '2026-09-22' : undefined,
    readerName: isReceived || isLoopClosed ? 'Ramesh Patil' : undefined,
    isAbnormal: false,
    resultSummary: isLoopClosed || isReceived ? 'Normal physiological reference range' : undefined,
    actionRequired: false,
    actionRecorded: isLoopClosed,
    actionRecordedDetails: isLoopClosed ? 'Report reviewed by OPD MO; filed in MCP record.' : undefined,
    actionRecordedBy: isLoopClosed ? 'Dr. Anita Rao' : undefined,
    actionRecordedAt: isLoopClosed ? '2026-09-23' : undefined,
    closureStatus: isLoopClosed ? 'LOOP_CLOSED' : isReceived ? 'PENDING_ACTION' : 'PENDING_REPORT',
    closedAt: isLoopClosed ? '2026-09-23' : undefined,
    facilityId: 'FAC-DH-01'
  });
}

// Initial Audit Logs (Section 28 examples)
export const SEED_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-01 10:42:15',
    userId: 'USR-03',
    userName: 'Dr. Anita Rao',
    userRole: 'CLINICIAN_LEAD',
    action: 'RULE_UPDATED',
    entityType: 'CareGapRule',
    entityId: 'A7',
    oldValue: 'Version 1 (Effective 01-Jan-2026)',
    newValue: 'Version 2 (Effective 01-Oct-2026)',
    reason: 'Updated clinical threshold wording for 75g OGTT screening interval.',
    source: 'Rule Management Portal',
    ipAddress: '10.24.110.42'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-01 11:18:04',
    userId: 'USR-02',
    userName: 'Sister Savitha K.',
    userRole: 'NURSING_STAFF',
    patientId: 'PAT-003',
    patientName: 'Anjali P.',
    action: 'PATIENT_CONTACTED',
    entityType: 'CareGap',
    entityId: 'GAP-003',
    oldValue: 'status: OVERDUE',
    newValue: 'status: CONTACTED',
    reason: 'Dispatched Marathi WhatsApp notification for Rh antibody screening.',
    source: 'Worklist Contact Trigger',
    ipAddress: '10.24.110.18'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-01 12:03:51',
    userId: 'USR-03',
    userName: 'Dr. Anita Rao',
    userRole: 'CLINICIAN_LEAD',
    patientId: 'PAT-006',
    patientName: 'Deepa K.',
    action: 'LAB_RESULT_REVIEWED',
    entityType: 'LaboratorySample',
    entityId: 'LAB-001',
    oldValue: 'closureStatus: PENDING_REPORT',
    newValue: 'closureStatus: PENDING_ACTION',
    reason: 'Marked HBsAg reactive result as high priority action required.',
    source: 'Laboratory Result Loop Module',
    ipAddress: '10.24.110.42'
  }
];
