export type PortalType = 'OPD' | 'LAB' | 'PHARMA' | 'ADMIN' | 'VICINITY' | 'REVENUES';
export type OpdRole = 'RECEPTION' | 'DOCTOR';
export type OpdUserRole = 'ADMIN' | 'RECEPTION' | 'DOCTOR' | 'LAB' | 'PHARMA';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  title: string;
  role: OpdUserRole;
  department: string;
  avatar: string;
  avatarBg: string;
  email: string;
  phone: string;
  doctorId?: string;
  allocatedRoom?: string;
  facilityName: string;
  isOnline: boolean;
  lastLogin?: string;
  vendorType?: 'PATHOLOGY_LAB' | 'PHARMACY';
  vendorPartnerId?: string;
  ondcParticipantId?: string;
  isAddonVendor?: boolean;
}

export interface HospitalRoom {
  id: string;
  roomNumber: string;
  name: string;
  department: string;
  floor: string;
  currentDoctorId?: string;
  currentDoctorName?: string;
  status: 'OCCUPIED' | 'VACANT' | 'MAINTENANCE';
  equipmentNotes?: string;
  activePatientCount?: number;
}

export interface DiagnosticLabConfig {
  id: string;
  name: string;
  type: string;
  inCharge: string;
  contact: string;
  location: string;
  isDefault: boolean;
  activeRequisitionsCount: number;
  avgTurnaroundHours: number;
  slaPercent: number;
  assignedDoctorIds: string[];
}

export interface IntegrationBackboneEvent {
  id: string;
  timestamp: string;
  sourceModule: 'ADMIN_PORTAL' | 'RECEPTION_DESK' | 'DOCTOR_STATION' | 'PATHOLOGY_LAB' | 'PHARMACY_HUB' | 'ABDM_GATEWAY';
  targetModule: 'ADMIN_PORTAL' | 'RECEPTION_DESK' | 'DOCTOR_STATION' | 'PATHOLOGY_LAB' | 'PHARMACY_HUB' | 'ABDM_GATEWAY' | 'PATIENT_APP';
  eventType: 
    | 'DOCTOR_ONBOARDED'
    | 'ROOM_ALLOCATED'
    | 'PATIENT_ALLOCATED_TO_DOCTOR'
    | 'LAB_ROUTING_CONFIGURED'
    | 'TOKEN_GENERATED'
    | 'CONSULTATION_STARTED'
    | 'PRESCRIPTION_DISPATCHED'
    | 'LAB_REQUISITION_RECEIVED'
    | 'LAB_REPORT_SYNCED'
    | 'MEDICINE_DISPENSED'
    | 'FHIR_BUNDLE_EXPORTED'
    | 'VICINITY_INTAKE_TOGGLED'
    | 'VICINITY_ORDER_ACCEPTED';
  title: string;
  details: string;
  patientId?: string;
  patientName?: string;
  doctorId?: string;
  doctorName?: string;
  payloadSummary?: string;
  status: 'SUCCESS' | 'IN_TRANSIT' | 'QUEUED';
}

export interface HospitalFacilityInfo {
  id: string;
  name: string;
  tagline: string;
  type: string;
  licenseNumber: string;
  address: string;
  phone: string;
  emergencyNumber: string;
  totalBeds: number;
  totalConsultationRooms: number;
  activeDoctorsCount: number;
  medicalDirector: string;
  establishedYear: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  accuracyMeters?: number;
  landmark?: string;
  addressLine: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  googlePlaceId?: string;
  plusCode?: string;
}

export interface RegionConfig {
  state: string;
  city: string;
  district: string;
  centerCoordinates: { latitude: number; longitude: number };
  zoomLevel: number;
  regionalHealthSociety: string;
  emergencyHelpline: string;
  ambulanceDispatchCenter: string;
  availableCities: string[];
}

export interface AadhaarDemographics {
  aadhaarNumber: string;
  careOf?: string;
  house?: string;
  street?: string;
  locality?: string;
  subDistrict?: string;
  district?: string;
  city?: string;
  state?: string;
  pincode?: string;
  formattedAddress: string;
  geoLocation: GeoLocation;
}

export interface DoctorProfile {
  id: string;
  name: string;
  shortName: string;
  specialty: string;
  qualification: string;
  department: string;
  clinicId: string;
  clinicName: string;
  roomNumber: string;
  avatarInitials: string;
  colorTheme: string;
  consultationFee: number;
  phone?: string;
  email?: string;
  regNo?: string;
  allocatedLabId?: string;
  allocatedLabName?: string;
  activeStatus?: 'ACTIVE' | 'ON_LEAVE' | 'IN_SURGERY';
  shiftTiming?: string;
}

export interface OpdClinic {
  id: string;
  name: string;
  shortName: string;
  code: string;
  roomNumber: string;
  leadDoctor: string;
  doctorSpecialty: string;
  receptionistName: string;
  department: string;
  description: string;
  colorTheme: string;
  city?: string;
  state?: string;
  pincode?: string;
  geoLocation?: GeoLocation;
}

export type LabReferralStatus = 
  | 'REQUESTED' 
  | 'SAMPLE RECEIVED' 
  | 'PROCESSING' 
  | 'REPORT READY' 
  | 'REVIEWED'
  | string;

export interface Vitals {
  bp?: string;
  weightKg?: number;
  pulse?: number;
  fundalHeightCm?: number;
  foetalHeartRate?: string;
  [key: string]: any;
}

export interface PreviousOpdVisit {
  date?: string;
  type?: string;
  outcome?: string;
  doctor?: string;
  [key: string]: any;
}

export interface DiagnosticParameter {
  id: string;
  name: string;
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  lowThreshold?: number;
  highThreshold?: number;
  status: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL';
  loincCode?: string;
  interpretation?: string;
}

export interface DiagnosticAnalysisResult {
  overallStatus: 'NORMAL' | 'ATTENTION_NEEDED' | 'CRITICAL_ALERT';
  primaryFinding: string;
  clinicalCorrelations: string[];
  trimesterInsight?: string;
  differentialDiagnosis?: string[];
  actionRecommendations: string[];
  mentzerIndex?: number;
  reviewedByPathologist?: string;
  analyzedAt: string;
}

export interface LabOrder {
  id: string;
  patientId?: string;
  opdId?: string;
  clinicId?: string;
  clinicName?: string;
  patientName?: string;
  patientAge?: number;
  patientGestation?: string;
  requestedBy?: string;
  requestedAt?: string;
  testName: string;
  category?: string;
  sampleStatus?: 'Pending' | 'Sample Received' | 'Test Completed' | string;
  reportStatus?: 'Pending' | 'Report Uploaded' | string;
  reportSummary?: string;
  reportFileName?: string;
  findings?: string;
  parameters?: DiagnosticParameter[];
  analysisResult?: DiagnosticAnalysisResult;
  abdmSyncStatus?: 'PENDING' | 'SYNCED' | 'FAILED';
  abdmTxnId?: string;
  abdmCareContextId?: string;
  abdmFhirBundle?: Record<string, any>;
  ocrConfidence?: number;
  ocrMethod?: 'GEMINI_AI_VISION' | 'PATHOLOGY_OCR_ENGINE' | 'MANUAL';
  documentUrl?: string;
  uploadedAt?: string;
  [key: string]: any;
}

export interface LabReferral {
  id: string;
  opdId?: string;
  clinicId?: string;
  clinicName?: string;
  patientId?: string;
  patientName?: string;
  patientAge?: number;
  patientGestation?: string;
  testName: string;
  category?: string;
  priority?: 'Routine' | 'Urgent' | 'Stat' | string;
  requestedBy?: string;
  requestedAt?: string;
  status: LabReferralStatus;
  relevantClinicalHistory?: string;
  reportSummary?: string;
  reportFileName?: string;
  findings?: string;
  releasedAt?: string;
  releasedBy?: string;
  reviewedByDoctor?: boolean;
  parameters?: DiagnosticParameter[];
  analysisResult?: DiagnosticAnalysisResult;
  abdmSyncStatus?: 'PENDING' | 'SYNCED' | 'FAILED';
  abdmTxnId?: string;
  abdmCareContextId?: string;
  abdmFhirBundle?: Record<string, any>;
  ocrConfidence?: number;
  [key: string]: any;
}

export interface WhatsAppMessage {
  id: string;
  direction?: 'outgoing' | 'incoming' | string;
  type: string;
  text: string;
  timestamp?: string;
  delivered?: boolean;
  [key: string]: any;
}

export interface ClinicalGistRecords {
  bloodGroup?: string;
  hb?: string;
  previousChildren?: number | string;
  lastScan?: string;
  lastOpd?: string;
  currentGestation?: string;
  glucose?: string;
  conditionSummary?: string;
  screeningStatus?: string;
  [key: string]: any;
}

export type CareJourneyType = 
  | 'PREGNANCY'            // Pregnancy care
  | 'POSTNATAL'            // Postnatal care
  | 'GYNECOLOGY'           // Gynaecology consultation
  | 'ONGOING_CONDITION'    // Ongoing condition follow-up
  | 'PREVENTIVE_SCREENING' // Preventive screening
  | 'INVESTIGATION_REVIEW' // Investigation and report review
  | 'GENERAL_OPD';         // General OPD follow-up

export type CareMilestoneStatus = 
  | 'COMPLETED'
  | 'PENDING'
  | 'SCHEDULED'
  | 'NOT_APPLICABLE'
  | 'EXCLUDED';

export interface CareMilestone {
  id: string;
  title: string;
  description: string;
  scheduledDate?: string;
  completedAt?: string;
  status: CareMilestoneStatus;
  category: 'CONSULTATION' | 'INVESTIGATION' | 'FOLLOW_UP' | 'CARE_PLAN' | 'SCREENING';
  exclusionReason?: string; // Transparent exclusions for cancellations, patient-requested rescheduling
  mandatoryForCompletion?: boolean;
}

export interface CareJourney {
  id: string;
  patientId: string;
  type: CareJourneyType;
  title: string;
  startDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  followUpSchedule?: string;
  followUpDate?: string;
  isFollowUpRequired: boolean;
  completionCriteria: string;
  currentProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  milestones: CareMilestone[];
  notes?: string;
  assignedDoctor?: string;
  lastUpdated?: string;
}

export type PatientAchievementCategory = 'UNIVERSAL' | 'PREGNANCY';

export interface PatientAchievement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: PatientAchievementCategory;
  earned: boolean;
  earnedAt?: string;
  criteria: string;
  iconName: string;
  badgeColor: string;
}

export interface DoctorAchievement {
  id: string;
  code: string;
  title: string;
  description: string;
  criteria: string;
  metricCurrent: number;
  metricTarget: number;
  earned: boolean;
  earnedAt?: string;
  eligiblePathways: string[];
  exclusionsHandled: number;
  iconName: string;
  badgeColor: string;
}

export interface PathologistAchievement {
  id: string;
  code: string;
  title: string;
  description: string;
  criteria: string;
  metricCurrent: number;
  metricTarget: number;
  earned: boolean;
  earnedAt?: string;
  iconName: string;
  badgeColor: string;
}

export interface ClinicalGist {
  headline?: string;
  summaryText?: string;
  importantRecords: ClinicalGistRecords;
  relevantRecords: ClinicalGistRecords;
  isAiGenerated?: boolean;
  [key: string]: any;
}

export interface PatientTimelineEvent {
  id?: string;
  patientId?: string;
  date?: string;
  time?: string;
  timestamp?: string;
  displayDate?: string;
  title?: string;
  actor?: string;
  details?: string;
  description?: string;
  source?: string;
  user?: string;
  eventType?: string;
  relatedRuleId?: string;
  [key: string]: any;
}

export interface OpdPatient {
  id: string;
  opdId: string;
  tokenNumber: number;
  clinicId?: string;
  clinicName?: string;
  name: string;
  age: number;
  dob?: string;
  gender: string;
  mobile: string;
  abhaId: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  aadhaarNumber?: string;
  isAadhaarAddressDerived?: boolean;
  aadhaarDemographics?: AadhaarDemographics;
  emergencyLocationConsent?: boolean;
  emergencyConsentTimestamp?: string;
  emergencyContactPhone?: string;
  geoLocation?: GeoLocation;
  isPregnant: boolean;
  pregnancyDetails?: {
    gravida?: number;
    para?: number;
    gestationalAgeWeeks?: number;
    edd?: string;
    lmp?: string;
    previousChildren?: number;
    previousOutcome?: string;
    currentPregnancyType?: string;
    clinicalFlags?: string[];
    [key: string]: any;
  };
  previousOpdRecords?: PreviousOpdVisit[];
  clinicalGist: ClinicalGist;
  visitReason: string;
  visitType?: 'ANC' | 'PNC' | 'Follow-up' | 'Gynaecology' | 'Immunisation' | 'General' | string;
  queueStatus: 'Waiting' | 'With Doctor' | 'Lab Pending' | 'In Lab' | 'Completed' | string;
  waitingSince?: string;
  assignedDoctor?: string;
  vitals?: Vitals;
  doctorNotes?: string;
  assessmentOutcome?: string;
  prescriptions?: string[];
  pharmacyOrders?: PharmacyOrder[];
  scannedPrescriptions?: ScannedPrescriptionRecord[];
  hasAbhaConsent?: boolean;
  preferredLanguage?: 'Hindi' | 'Bengali' | 'English';
  consultationFee?: number;
  billingScheme?: 'General (Paid)' | 'JSSK / NHM (Free Antenatal)' | 'Ayushman Bharat (PM-JAY)' | string;
  visitDate?: string;
  followUpDate?: string;
  followUpInstruction?: string;
  followUpStatus?: 'Scheduled' | 'Overdue' | 'Attended' | 'Not Required' | string;
  aiFollowUpSent?: boolean;
  aiFollowUpNote?: string;
  whatsappMessages: WhatsAppMessage[];
  labReferrals: LabReferral[];
  labOrders: LabOrder[];
  timeline: PatientTimelineEvent[];
  careJourney?: CareJourney;
  achievements?: PatientAchievement[];
  [key: string]: any;
}

export interface PrescriptionMedicineItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  quantity?: number;
  instructions?: string;
  isJanAushadhiAvailable?: boolean;
  genericEquivalent?: string;
  dispensed?: boolean;
}

export interface WeeklyMonthlyStats {
  period: 'WEEKLY' | 'MONTHLY';
  periodLabel: string;
  totalConsultations: number;
  totalRevenue: number;
  freeGovtCount: number;
  paidCount: number;
  patientsWhoCame: OpdPatient[];
  patientsNeedingFollowUp: OpdPatient[];
  revenueByClinic: { clinicId: string; clinicName: string; amount: number; count: number }[];
  revenueByScheme: { scheme: string; amount: number; count: number }[];
  averageFee: number;
  aiFollowUpsSentCount: number;
}

export interface AiFollowUpRecommendation {
  patientId: string;
  patientName: string;
  preferredLanguage: 'Hindi' | 'Bengali' | 'English';
  suggestedMessage: string;
  urgency: 'High' | 'Routine' | 'Scheduled';
  reason: string;
  followUpDate: string;
}

export interface LabPartner {
  id: string;
  name: string;
  type: 'Distant Standalone Diagnostic Hub' | 'Specialized Ultrasound & Imaging' | 'Hospital Reference Lab' | 'Collection Centre';
  distance: string;
  location: string;
  city?: string;
  state?: string;
  pincode?: string;
  geoLocation?: GeoLocation;
  sampleCourierRadiusKm?: number;
  inCharge: string;
  accreditation: string;
  operatingHours: string;
  contact: string;
  sampleCollectionMode: 'Sample Courier Pickup from OPD' | 'Patient Walk-in to Centre' | 'Both Available';
  turnaroundHours: string;
  badgeColor?: string;
  ondcParticipantId?: string;
  ondcStatus?: 'REGISTERED' | 'ACTIVE_SELLER_NODE' | 'OFFLINE';
  ondcCatalogCount?: number;
  isOnboardedVendor?: boolean;
  // Vicinity Order Connection
  vicinityDistanceKm?: number;
  isTakingOrdersInVicinity?: boolean;
  homeCollectionAvailable?: boolean;
  orderAcceptanceEtaMinutes?: number;
  discountPercentage?: number;
  activeOrdersCount?: number;
  cumulativeRevenueGenerated?: number;
}

export interface PharmacyPartner {
  id: string;
  name: string;
  type: 'Connected OPD Chemist' | 'Jan Aushadhi' | 'Retail Partner';
  distance: string;
  counterLocation: string;
  city?: string;
  state?: string;
  pincode?: string;
  geoLocation?: GeoLocation;
  deliveryRadiusKm?: number;
  isEmergencyNightStore?: boolean;
  operatingHours: string;
  contact: string;
  discountOffer: string;
  pharmacistInCharge?: string;
  badgeColor?: string;
  ondcParticipantId?: string;
  ondcStatus?: 'REGISTERED' | 'ACTIVE_SELLER_NODE' | 'OFFLINE';
  ondcCatalogCount?: number;
  isOnboardedVendor?: boolean;
  // Vicinity Order Connection
  vicinityDistanceKm?: number;
  isTakingOrdersInVicinity?: boolean;
  expressDeliveryMinutes?: number;
  janAushadhiGenericSubsAvailable?: boolean;
  discountPercentage?: number;
  activeOrdersCount?: number;
  cumulativeRevenueGenerated?: number;
}

export interface DoctorRevenueRecord {
  id: string;
  orderId: string;
  timestamp: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorRoom: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  tokenNumber: number;
  category: 'LAB' | 'PHARMACY' | 'COMBINED';
  labPartnerId?: string;
  labPartnerName?: string;
  labItems?: string[];
  labRevenue: number;
  pharmacyPartnerId?: string;
  pharmacyPartnerName?: string;
  pharmacyItems?: string[];
  pharmacyRevenue: number;
  patientSavingsFromGeneric: number;
  totalRevenueGenerated: number;
  status: 'DISPATCHED' | 'ACCEPTED_BY_VENDOR' | 'PROCESSING' | 'COMPLETED';
  vicinityDistanceKm: number;
  acceptedAt?: string;
  vendorNotes?: string;
}

export interface VicinityOrderBroadcast {
  id: string;
  broadcastAt: string;
  doctorId: string;
  doctorName: string;
  clinicRoom: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  category: 'LAB' | 'PHARMACY';
  items: Array<{ name: string; price: number; genericName?: string }>;
  totalValue: number;
  targetPartnerId?: string; // If undefined, broadcast to all connected in vicinity
  acceptedByPartnerId?: string;
  acceptedByPartnerName?: string;
  status: 'BROADCASTING' | 'ACCEPTED' | 'FULFILLED' | 'CANCELLED';
  radiusKm: number;
}

export interface OndcNetworkNode {
  subscriberId: string;
  type: 'BPP' | 'BAP';
  category: 'DIAGNOSTICS' | 'PHARMACY' | 'HOSPITAL';
  domain: string;
  entityName: string;
  inCharge: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
  city: string;
  pincode: string;
  catalogItemsCount: number;
  rating: number;
  connectedAt: string;
  becknVersion: string;
  endpointUrl: string;
  encryptionPublicKey?: string;
}

export interface OndcTransaction {
  id: string;
  timestamp: string;
  transactionId: string;
  action: 'search' | 'on_search' | 'select' | 'on_select' | 'init' | 'on_init' | 'confirm' | 'on_confirm' | 'status';
  bapId: string;
  bppId: string;
  vendorName: string;
  category: 'DIAGNOSTICS' | 'PHARMACY';
  patientName: string;
  summary: string;
  status: 'SUCCESS' | 'ACK' | 'PROCESSING';
}

export interface OndcOnboardingPayload {
  vendorType: 'PATHOLOGY_LAB' | 'PHARMACY';
  shopName: string;
  inChargeName: string;
  contactPhone: string;
  contactEmail: string;
  licenseNumber: string;
  address: string;
  locality: string;
  city: string;
  pincode: string;
  serviceRadiusKm: number;
  username: string;
  password?: string;
  turnaroundOrDelivery: string;
  accreditationOrOffer?: string;
}

export interface PharmacyOrder {
  id: string;
  tokenNumber: string;
  opdId: string;
  clinicId?: string;
  clinicName?: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  doctorName: string;
  prescribedAt: string;
  scannedAt: string;
  scannedBy: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyLocation: string;
  medicines: PrescriptionMedicineItem[];
  status: 'REFERRED' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'DISPENSED' | 'CANCELLED';
  pickupInstructions?: string;
  linkedLabReferralIds?: string[];
  dispensedAt?: string;
  dispensedBy?: string;
  [key: string]: any;
}

export interface ScannedPrescriptionRecord {
  id: string;
  patientId: string;
  opdId: string;
  scanTimestamp: string;
  scannedBy: string;
  rawDoctorText?: string;
  extractedMedicines: PrescriptionMedicineItem[];
  extractedLabTests: string[];
  referredToPharmacy: boolean;
  pharmacyOrderId?: string;
  referredToLab: boolean;
  labReferralIds?: string[];
  [key: string]: any;
}

export interface OpdStats {
  totalWaiting: number;
  withDoctor: number;
  labPending: number;
  inLab: number;
  completedToday: number;
  totalToday: number;
  pharmacyOrdersCount?: number;
  pharmacyDispensedCount?: number;
  [key: string]: any;
}

// -------------------------------------------------------------
// Care-Gap Registry & Longitudinal Domain Types
// -------------------------------------------------------------
export type UserRole = 
  | 'HOSPITAL_ADMIN'
  | 'OPD_STAFF'
  | 'NURSING_STAFF'
  | 'CLINICIAN_LEAD'
  | 'LAB_USER'
  | 'SUPER_ADMIN'
  | string;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  email?: string;
  mobile?: string;
  status?: 'active' | 'inactive' | string;
  [key: string]: any;
}

export interface Facility {
  id: string;
  name: string;
  type?: string;
  district?: string;
  state?: string;
  pincode?: string;
  defaultLanguage?: string;
  primaryContact?: string;
  messagingSenderId?: string;
  whatsappEnabled?: boolean;
  [key: string]: any;
}

export type RuleCategory = 'antenatal' | 'foetal' | 'postnatal' | 'newborn' | 'child' | 'laboratory' | string;

export interface CareGapRule {
  rule_id: string;
  name: string;
  category: any;
  population?: string;
  trigger_condition?: string;
  milestone_window?: string;
  target_action?: string;
  overdue_threshold?: string;
  status?: 'draft' | 'under_review' | 'active' | 'retired' | string;
  requires_clinical_validation?: boolean;
  explanation_template?: string;
  version: number;
  lastUpdated?: string;
  active?: boolean;
  trigger?: any;
  required_action: string;
  display_reason: string;
  clinicalRationale?: string;
  [key: string]: any;
}

export interface CareGapRuleVersion {
  id?: string;
  rule_id: string;
  version: number;
  changeDescription?: string;
  modifiedBy?: string;
  timestamp?: string;
  ruleDefinition?: CareGapRule;
  [key: string]: any;
}

export type CareGapStatus = 'overdue' | 'due_today' | 'due_soon' | 'closed' | 'DUE' | 'OVERDUE' | 'NOT_DUE' | 'CLOSED' | string;

export interface CareGap {
  id: string;
  patientId?: string;
  patientName: string;
  patientAbha: string;
  patientMobile?: string;
  category?: any;
  ruleId: string;
  ruleName?: string;
  stage?: string;
  gestationOrAge?: string;
  gestationOrAgeDisplay?: string;
  careGapItem?: string;
  whyOverdue?: string;
  triggerCondition?: string;
  milestoneDue?: string;
  status: CareGapStatus;
  daysOverdue?: number;
  priority?: 'High' | 'Medium' | 'Low' | string;
  actionTaken?: string;
  closedAt?: string;
  closedBy?: string;
  closureEvidence?: string;
  isHighPriorityResult?: boolean;
  gapTitle: string;
  plainReason: string;
  createdAt?: string;
  updatedAt?: string;
  lastContactedAt?: string;
  lastContactChannel?: string;
  closureReason?: string;
  overdueDurationDisplay?: string;
  overdueDurationWeeks?: number;
  currentGestationalAgeWeeks?: number;
  expectedWindowDisplay?: string;
  requiredAction?: string;
  assignedTo?: string;
  contactAttemptsCount: number;
  facilityId?: string;
  population?: string;
  episodeId?: string;
  episodeLabel?: string;
  [key: string]: any;
}

export interface Patient {
  id: string;
  abhaId?: string;
  abhaNumber: string;
  name: string;
  dob?: string;
  age?: number;
  gender: string;
  mobile: string;
  preferredLanguage?: string;
  address?: any;
  district?: string;
  state?: string;
  registrationDate?: string;
  registeredAt: string;
  facilityId?: string;
  motherId?: string;
  rhFactor?: string;
  activeEpisodes?: {
    pregnancyId?: string;
    newbornId?: string;
    childId?: string;
    [key: string]: any;
  };
  careGapCount?: number;
  overdueCount?: number;
  activeCareGapsCount: number;
  status?: string;
  [key: string]: any;
}

export interface PregnancyEpisode {
  id: string;
  motherPatientId?: string;
  motherId?: string;
  motherName?: string;
  motherAbha?: string;
  mcpCardNumber?: string;
  lmp?: string;
  lmpDate?: string;
  edd: string;
  gestationalAgeWeeks?: number;
  currentGestationalAgeWeeks: number;
  gravida: number;
  para: number;
  status?: 'active' | 'completed' | 'terminated' | string;
  riskFlags?: string[];
  flags: string[];
  rhNegative?: boolean;
  bloodGroup?: string;
  registeredDate?: string;
  datingScanDate?: string;
  notes?: string;
  [key: string]: any;
}

export interface FoetalMilestone {
  id: string;
  pregnancyId?: string;
  milestoneType?: 'dating_scan' | 'nt_scan' | 'tcode_anomaly' | 'growth_scan' | 'biophysical_profile' | string;
  recommendedWeeks?: number;
  status?: 'pending' | 'due' | 'completed' | 'missed' | string;
  scheduledDate?: string;
  completedDate?: string;
  findings?: string;
  [key: string]: any;
}

export interface NewbornRecord {
  id: string;
  patientId?: string;
  motherPatientId?: string;
  motherName?: string;
  pregnancyEpisodeId?: string;
  birthDate?: string;
  dob?: string;
  birthTime?: string;
  birthWeightKg: number;
  sex?: 'male' | 'female' | 'other' | string;
  deliveryType?: 'vaginal' | 'cesarean' | 'assisted' | string;
  gestationalAgeAtBirthWeeks?: number;
  bcgGiven?: boolean;
  opv0Given?: boolean;
  hepB0Given?: boolean;
  dischargeStatus?: 'healthy' | 'sncu_admitted' | 'referred' | string;
  [key: string]: any;
}

export interface ChildEpisode {
  id: string;
  childPatientId?: string;
  patientId?: string;
  childName?: string;
  motherPatientId?: string;
  motherId?: string;
  motherName?: string;
  dob?: string;
  currentAgeMonths?: number;
  currentAgeWeeks?: number;
  sex?: 'male' | 'female' | 'other' | string;
  latestWeightKg?: number;
  latestHeightCm?: number;
  growthStatus?: 'normal' | 'moderate_malnutrition' | 'severe_malnutrition' | string;
  immunisationStatus?: 'up_to_date' | 'delayed' | 'overdue' | string;
  facilityId?: string;
  recordedImmunisations?: any[];
  growthChecks?: any[];
  [key: string]: any;
}

export interface LaboratorySample {
  id: string;
  sampleBarcode?: string;
  sampleId?: string;
  patientId?: string;
  patientName?: string;
  episodeId?: string;
  testName?: string;
  testCategory?: 'haematology' | 'biochemistry' | 'serology' | 'urinalysis' | 'microbiology' | string;
  collectedDate?: string;
  collectionDate?: string;
  collectedBy?: string;
  sendingDepartment?: string;
  status?: 'collected' | 'received' | 'processing' | 'verified' | 'action_required' | 'closed' | 'RECEIVED' | 'REVIEWED' | 'CLOSED' | string;
  resultValue?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  isCritical?: boolean;
  actionRequiredNote?: string;
  actionRequired?: boolean;
  actionRequiredDetails?: string;
  actionRecordedBy?: string;
  actionRecordedAt?: string;
  actionRecorded?: boolean;
  reportUrl?: string;
  reportDate?: string;
  resultSummary?: string;
  readerName?: string;
  closureStatus?: string;
  facilityId?: string;
  [key: string]: any;
}

export interface AuditLogItem {
  id?: string;
  timestamp?: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  patientId?: string;
  patientName?: string;
  action?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  ipAddress?: string;
  source?: 'web' | 'api' | 'automation' | string;
  [key: string]: any;
}

export interface CommunicationTemplate {
  id: string;
  title?: string;
  careGapType?: string;
  language?: string;
  channel?: 'whatsapp' | 'sms' | string;
  content?: string;
  variables?: string[];
  [key: string]: any;
}

export interface PatientCommunication {
  id: string;
  careGapId?: string;
  patientId?: string;
  patientName?: string;
  mobile?: string;
  channel?: 'whatsapp' | 'sms' | string;
  templateId?: string;
  language?: string;
  messageText?: string;
  messageBody?: string;
  sentAt?: string;
  sentBy?: string;
  staffUserId?: string;
  staffUserName?: string;
  deliveryStatus?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed' | string;
  responseReceived?: string;
  patientResponse?: any;
  responseNotes?: string;
  [key: string]: any;
}

export interface DocumentRecord {
  id: string;
  patientId?: string;
  documentType?: 'mcp_card' | 'lab_report' | 'scan_report' | 'discharge_summary' | 'prescription' | string;
  fileName?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  extractedFields?: Record<string, any>;
  isVerifiedByClinician?: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  rawTextPreview?: string;
  [key: string]: any;
}

export interface DashboardMetrics {
  activePatients?: number;
  totalActivePatients?: number;
  overdueGaps?: number;
  overdueCareGaps?: number;
  dueToday?: number;
  dueSoon?: number;
  highPriorityResultFollowups?: number;
  unclosedLabLoops?: number;
  closedThisWeek?: number;
  closedToday?: number;
  closedCareGapsToday?: number;
  closedWithinTwoWeeks?: number;
  closurePercentage?: number;
  careGapClosureRate?: number;
  timeToCompileWorklistMinutes?: {
    currentManualMinutes: number;
    continuumAutomatedMinutes: number;
  };
  resultLoopCompletionRate?: number;
  recordCompletenessRate?: number;
  samplesSent?: number;
  reportsReceived?: number;
  reportsAwaitingAction?: number;
  reportsWithActionRecorded?: number;
  unresolvedAbnormalReports?: number;
  patientsEnrolledThisMonth?: number;
  [key: string]: any;
}
