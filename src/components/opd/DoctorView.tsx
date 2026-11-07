import React, { useState } from 'react';
import { 
  Stethoscope, 
  Clock, 
  CheckCircle2, 
  Send, 
  AlertCircle, 
  Sparkles, 
  Search, 
  Pill, 
  TestTubes, 
  Printer, 
  Plus, 
  Trash2, 
  Check, 
  FileText,
  Activity,
  Heart,
  MapPin,
  Baby,
  Smile,
  Flower2,
  Coffee,
  CheckCheck
} from 'lucide-react';
import { 
  OpdPatient, 
  PrescriptionMedicineItem, 
  OpdClinic, 
  LabPartner, 
  PharmacyPartner, 
  LabOrder,
  CareJourneyType
} from '../../types';
import { opdStore, OPD_CLINICS } from '../../services/opdStore';
import { vicinityRevenueService } from '../../services/vicinityRevenueService';
import { DoctorDashboard } from './DoctorDashboard';
import { PatientDatabaseView } from './PatientDatabaseView';
import { DiagnosticAnalyserModal } from './DiagnosticAnalyserModal';
import { DoctorRevenueDashboard } from '../vicinity/DoctorRevenueDashboard';
import { MyCareJourneyPanel } from './MyCareJourneyPanel';
import { NewbornVaccinationCard } from './NewbornVaccinationCard';
import { MaternalTestingPanel } from './MaternalTestingPanel';
import { HospitalLabourDeliveryPanel } from '../hospital/HospitalLabourDeliveryPanel';
import { EmergencyCounsellingQueuePanel } from '../hospital/EmergencyCounsellingQueuePanel';
import { LabourDeliveryLiveTrackerModal } from '../patient/LabourDeliveryLiveTrackerModal';
import { TreatmentCostEstimatorModal } from '../patient/TreatmentCostEstimatorModal';
import { KnowledgeLibraryModal } from '../patient/KnowledgeLibraryModal';
import { AbhaPriorRecordsModal } from './AbhaPriorRecordsModal';
import { Award, Compass, Syringe, PhoneCall, Calculator, BookOpen, ShieldCheck } from 'lucide-react';


interface DoctorViewProps {
  onOpenWhatsAppView?: (patientId?: string) => void;
  onNavigateToVicinity?: () => void;
  onNavigateToRevenues?: () => void;
}

// Clinical obstetric stage assessment helper based on gestational age
interface GestationalClinicalStage {
  trimester: string;
  stageName: string;
  efw: string; // Estimated Fetal Weight (Hadlock standard)
  clinicalProtocol: string;
}

const getGestationalClinicalStage = (weeks?: number): GestationalClinicalStage => {
  if (!weeks) {
    return {
      trimester: '1st Trimester',
      stageName: 'Early Gestation (<6w)',
      efw: 'Embryonic pole',
      clinicalProtocol: 'Dating scan & viability confirmation'
    };
  }
  if (weeks < 13) {
    return {
      trimester: '1st Trimester',
      stageName: 'First Trimester (11-13w)',
      efw: '~15–20g',
      clinicalProtocol: 'Nuchal Translucency (NT) & Dual Marker screening'
    };
  }
  if (weeks < 18) {
    return {
      trimester: '2nd Trimester',
      stageName: 'Early Mid-Trimester (14-17w)',
      efw: '~140–160g',
      clinicalProtocol: 'Quadruple marker screen & uterine artery Doppler'
    };
  }
  if (weeks < 24) {
    return {
      trimester: '2nd Trimester',
      stageName: 'Mid-Trimester Anatomy (18-23w)',
      efw: '~450–520g',
      clinicalProtocol: 'Level-II Targeted Imaging for Fetal Anomalies (TIFFA)'
    };
  }
  if (weeks < 29) {
    return {
      trimester: '3rd Trimester',
      stageName: 'Early 3rd Trimester (24-28w)',
      efw: '~1.0–1.2 kg',
      clinicalProtocol: '75g Oral Glucose Tolerance Test (OGTT) & Rh antibody titer'
    };
  }
  if (weeks < 34) {
    return {
      trimester: '3rd Trimester',
      stageName: 'Late Gestational Growth (29-33w)',
      efw: '~1.7–2.0 kg',
      clinicalProtocol: 'Fetal growth biometric velocity & umbilical Doppler'
    };
  }
  if (weeks < 37) {
    return {
      trimester: '3rd Trimester',
      stageName: 'Near-Term Maturation (34-36w)',
      efw: '~2.4–2.8 kg',
      clinicalProtocol: 'Group B Strep (GBS) screen, fetal presentation & AFI assessment'
    };
  }
  return {
    trimester: 'Full Term',
    stageName: 'Full Term Gestation (37–40w)',
    efw: '~3.0–3.4 kg',
    clinicalProtocol: 'Bishop score readiness, active labor triage & biophysical profile'
  };
};

// Evidence-based antenatal clinical practice guidelines
const MATERNAL_CLINICAL_GUIDELINES = [
  { label: 'Hydration Protocol', tip: 'Target 2.5–3.0 L/day maternal hydration to support adequate amniotic fluid index (AFI) and prevent preterm uterine irritability.' },
  { label: 'Fetal Movement Audit', tip: 'Instruct DFMC (Daily Fetal Movement Count): verify >= 10 fetal movements within 2 hours postprandial in left lateral recumbency.' },
  { label: 'Iron-Vitamin C Synergy', tip: 'Administer elemental iron with ascorbic acid (plain water / citrus) on empty stomach; strictly separate 2 hours from calcium, milk, or antacids.' },
  { label: 'Uteroplacental Perfusion', tip: 'Advise left lateral sleeping position with knee elevation to relieve inferior vena cava compression and optimize renal/placental perfusion.' },
  { label: 'Pelvic Conditioning', tip: 'Supervised antenatal pelvic muscle conditioning and 30-min moderate aerobic walking daily if uncomplicated pregnancy.' }
];

export const DoctorView: React.FC<DoctorViewProps> = ({ onOpenWhatsAppView }) => {
  const currentDoctor = opdStore.getCurrentDoctor();
  const allDoctors = opdStore.getDoctorProfiles();
  const facility = opdStore.getHospitalFacility();

  const doctorName = currentDoctor.name;
  const specialty = currentDoctor.qualification || currentDoctor.specialty;
  const departmentName = currentDoctor.clinicName;
  const hospitalName = facility.name;

  // Patients allocated to this doctor or this doctor's clinic room
  const patients = opdStore.getPatientsForDoctor(currentDoctor.id);

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientForPrintRx, setSelectedPatientForPrintRx] = useState<OpdPatient | null>(null);
  const [selectedOrderForAnalyser, setSelectedOrderForAnalyser] = useState<LabOrder | null>(null);
  const [doctorWorkspaceMode, setDoctorWorkspaceMode] = useState<
    'CONSULTATION' | 'DASHBOARD' | 'DATABASE' | 'CARE_JOURNEY' | 'REVENUES' | 'LABOUR_MONITOR' | 'TELE_COUNSELLING'
  >('CONSULTATION');
  const [showLabourTrackerModalId, setShowLabourTrackerModalId] = useState<string | null>(null);
  const [showCostEstimatorModal, setShowCostEstimatorModal] = useState<boolean>(false);
  const [showKnowledgeLibraryModal, setShowKnowledgeLibraryModal] = useState<boolean>(false);
  const [showAbhaPriorRecordsModal, setShowAbhaPriorRecordsModal] = useState<boolean>(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;


  // Active Consultation Form State
  const [bp, setBp] = useState('118/76 mmHg');
  const [weightKg, setWeightKg] = useState<number>(58.5);
  const [fundalHeightCm, setFundalHeightCm] = useState<number>(28);
  const [foetalHeartRate, setFoetalHeartRate] = useState('142 bpm regular');
  const [pulse, setPulse] = useState<number>(78);
  const [headCircumferenceCm, setHeadCircumferenceCm] = useState<number>(36.5);
  const [lengthCm, setLengthCm] = useState<number>(52);
  const [temperatureF, setTemperatureF] = useState<string>('98.4 °F');
  const [doctorNotes, setDoctorNotes] = useState('');
  
  // Clinician-Defined Care Pathway & Follow-Up State
  const [selectedCareJourneyType, setSelectedCareJourneyType] = useState<CareJourneyType>('GENERAL_OPD');
  const [isFollowUpRequired, setIsFollowUpRequired] = useState<boolean>(true);
  const [followUpDate, setFollowUpDate] = useState<string>('24 Oct 2026');
  const [followUpInstruction, setFollowUpInstruction] = useState<string>('');

  // Prescribed Medicines list for active patient
  const [medicines, setMedicines] = useState<PrescriptionMedicineItem[]>([
    {
      id: 'med-1',
      medicineName: 'Tab. Iron & Folic Acid (IFA 100mg elemental iron + 500mcg FA)',
      dosage: '1 tablet',
      frequency: 'Once daily (OD)',
      timing: 'At night with water, minimum 2 hrs after calcium/milk',
      duration: '30 days',
      quantity: 30,
      instructions: 'Do not take with tea or dairy. Keep out of reach of children.',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'Ferrous Sulphate + Folic Acid Tablets IP'
    },
    {
      id: 'med-2',
      medicineName: 'Tab. Calcium Carbonate 500mg + Vitamin D3',
      dosage: '500mg',
      frequency: 'Twice daily (BD)',
      timing: 'After breakfast and after lunch',
      duration: '30 days',
      quantity: 60,
      instructions: 'Maintain 2 hour gap from iron tablet.',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'Calcium Carbonate with Vitamin D3 Tablets'
    }
  ]);

  // Selected Lab Investigations
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([
    'Oral Glucose Tolerance Test 75g (OGTT)'
  ]);
  const [labPriority, setLabPriority] = useState<'Routine' | 'Urgent' | 'Stat'>('Routine');
  const [customTestInput, setCustomTestInput] = useState('');

  // Destination Partner Store Choices
  const [selectedPharmacyPartnerId, setSelectedPharmacyPartnerId] = useState<string>('pharm-janaushadhi');
  const [selectedLabPartnerId, setSelectedLabPartnerId] = useState<string>('lab-apex');

  // Celebratory Toast confirmation
  const [completionToast, setCompletionToast] = useState<{ message: string; patientName: string } | null>(null);

  // When patient is opened
  const handleSelectPatient = (patient: OpdPatient) => {
    setSelectedPatientId(patient.id);
    const isPediatric = !!(patient.isNewborn || patient.age <= 5 || patient.clinicId === 'opd-ped' || patient.visitType === 'Immunisation');
    const isMaternal = !!(patient.isPregnant || patient.maternalStage || patient.visitType === 'ANC' || patient.visitType === 'PNC' || patient.postnatalDetails);

    const defaultNote = patient.doctorNotes || (
      patient.isNewborn 
        ? `Pediatric well-baby examination for ${patient.name}. Age: ${patient.age > 0 ? `${patient.age}y` : 'Newborn (3 weeks)'}. Weight: ${patient.birthDetails?.birthWeightKg || 3.2} kg. Immunization milestone review & maternal feeding check.`
        : patient.isPregnant 
        ? `Antenatal consultation for ${patient.name}. Gestation: ${patient.pregnancyDetails?.gestationalAgeWeeks || 28} weeks. Healthy fetal rhythm.`
        : patient.postnatalDetails
        ? `Postnatal examination for ${patient.name}. Delivered on ${patient.postnatalDetails.deliveryDate || 'recently'}. Postpartum recovery & maternal screening.`
        : `OPD clinical consultation for ${patient.name}. Reason: ${patient.visitReason}.`
    );
    setDoctorNotes(defaultNote);

    // Default prescriptions adapted to patient type
    if (isPediatric) {
      setMedicines([
        {
          id: 'med-ped-1',
          medicineName: 'Syp. Vitamin D3 Drops (400 IU/ml)',
          dosage: '1 ml (400 IU)',
          frequency: 'Once daily (OD)',
          timing: 'Morning after feeding',
          duration: '30 days',
          quantity: 1,
          instructions: 'Administer directly via dropper for bone and immune development.',
          isJanAushadhiAvailable: true,
          genericEquivalent: 'Cholecalciferol Drops IP 400 IU'
        },
        {
          id: 'med-ped-2',
          medicineName: 'Pediatric Paracetamol Oral Suspension (100mg/ml)',
          dosage: '0.6 ml SOS',
          frequency: 'As needed (SOS for fever > 100°F)',
          timing: 'Post-immunization if fever occurs',
          duration: '3 days',
          quantity: 1,
          instructions: 'Maximum 4 doses in 24 hours. Minimum 6 hours gap.',
          isJanAushadhiAvailable: true,
          genericEquivalent: 'Paracetamol Paediatric Drops IP'
        }
      ]);
    }
    
    // Set Care Pathway & Follow-up state
    setSelectedCareJourneyType(patient.careJourney?.type || (patient.isPregnant ? 'PREGNANCY' : patient.isNewborn ? 'GENERAL_OPD' : patient.postnatalDetails ? 'POSTNATAL' : 'GYNECOLOGY'));
    setIsFollowUpRequired(patient.followUpStatus !== 'Not Required');
    setFollowUpDate(patient.followUpDate || '24 Oct 2026');
    setFollowUpInstruction(patient.followUpInstruction || (isPediatric ? '6-Week Vaccination & growth monitoring' : ''));

    if (patient.vitals) {
      setBp(patient.vitals.bp || '118/76 mmHg');
      setWeightKg(patient.vitals.weightKg || (isPediatric ? 3.4 : 59));
      setFundalHeightCm(patient.vitals.fundalHeightCm || 28);
      setFoetalHeartRate(patient.vitals.foetalHeartRate || '142 bpm regular');
      setPulse(patient.vitals.pulse || (isPediatric ? 132 : 78));
    } else if (isPediatric) {
      setWeightKg(3.4);
      setPulse(132);
    }
  };

  const handleAddMedicineRow = () => {
    const newMed: PrescriptionMedicineItem = {
      id: `med-${Date.now()}`,
      medicineName: 'New Prescribed Medicine',
      dosage: '1 tab',
      frequency: 'Once daily (OD)',
      timing: 'After food',
      duration: '15 days',
      quantity: 15,
      isJanAushadhiAvailable: true
    };
    setMedicines([...medicines, newMed]);
  };

  const handleRemoveMedicineRow = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const handleUpdateMedicine = (id: string, field: keyof PrescriptionMedicineItem, val: any) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const handleToggleLabTest = (test: string) => {
    if (selectedLabTests.includes(test)) {
      setSelectedLabTests(selectedLabTests.filter(t => t !== test));
    } else {
      setSelectedLabTests([...selectedLabTests, test]);
    }
  };

  const handleAddCustomTest = () => {
    if (customTestInput.trim() && !selectedLabTests.includes(customTestInput.trim())) {
      setSelectedLabTests([...selectedLabTests, customTestInput.trim()]);
      setCustomTestInput('');
    }
  };

  const handleAppendMaternalPearl = (pearl: { label: string; tip: string }) => {
    setDoctorNotes(prev => {
      const addition = `\n• ${pearl.label}: ${pearl.tip}`;
      return prev ? `${prev}${addition}` : addition;
    });
  };

  // Complete Consultation & Dispatch both Rx and Lab loops in a single unified action
  const handleCompleteConsultationAndDispatch = () => {
    if (!selectedPatient) return;

    const allLabs = opdStore.getLabPartners();
    const allPharms = opdStore.getPharmacyPartners();
    const chosenLab = allLabs.find(l => l.id === selectedLabPartnerId) || allLabs[0];
    const chosenPharmacy = allPharms.find(p => p.id === selectedPharmacyPartnerId) || allPharms[0];

    // 1. Dispatch Lab Tests if selected
    const createdLabReferrals = selectedLabTests.map(testName => {
      return opdStore.createLabReferral({
        patientId: selectedPatient.id,
        testName,
        labName: `${chosenLab.name} (${chosenLab.distance})`,
        priority: labPriority,
        notes: `Clinical note from ${doctorName}: ${doctorNotes || 'Routine investigation ordered'} [Transit: ${chosenLab.sampleCollectionMode}]`,
        requestedBy: doctorName
      });
    });

    // 2. Dispatch Prescription to Chosen Pharmacy Store
    let pharmacyOrder;
    if (medicines.length > 0) {
      pharmacyOrder = opdStore.createPharmacyReferral({
        patientId: selectedPatient.id,
        pharmacyId: chosenPharmacy.id,
        medicines,
        scannedBy: doctorName,
        notes: doctorNotes,
        linkedLabReferralIds: createdLabReferrals.map(r => r.id)
      });
    }

    // 3. Save Vitals & Update Queue Status
    opdStore.saveConsultation({
      patientId: selectedPatient.id,
      vitals: {
        bp,
        weightKg,
        fundalHeightCm: selectedPatient.isPregnant ? fundalHeightCm : undefined,
        foetalHeartRate: selectedPatient.isPregnant ? foetalHeartRate : undefined,
        pulse
      },
      doctorNotes,
      careJourneyType: selectedCareJourneyType,
      followUpStatus: isFollowUpRequired ? 'Scheduled' : 'Not Required',
      followUpDate: isFollowUpRequired ? followUpDate : undefined,
      followUpInstruction: isFollowUpRequired 
        ? (followUpInstruction || 'Routine OPD follow-up') 
        : 'No further follow-up required. Care episode completed.',
      assessmentOutcome: `Consultation completed by ${doctorName}. ${medicines.length} medications referred to ${chosenPharmacy.name}.${createdLabReferrals.length > 0 ? ` ${createdLabReferrals.length} lab tests routed to ${chosenLab.name}.` : ''}`,
      prescriptions: medicines.map(m => `${m.medicineName} (${m.dosage}) - ${m.frequency}`),
      nextQueueStatus: createdLabReferrals.length > 0 ? 'Lab Pending' : 'Completed'
    });

    setCompletionToast({
      message: `Consultation recorded successfully. Electronic prescription sent to ${chosenPharmacy.name.split('—')[0]} and ${createdLabReferrals.length} diagnostic investigations routed.`,
      patientName: selectedPatient.name
    });
    setTimeout(() => setCompletionToast(null), 6000);

    const updatedPatient = opdStore.patients.find(p => p.id === selectedPatient.id);
    setSelectedPatientForPrintRx(updatedPatient || selectedPatient);
    setSelectedPatientId(null);
  };

  const activeWaiting = patients.filter(p => p.queueStatus !== 'Completed');
  const completedToday = patients.filter(p => p.queueStatus === 'Completed');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Consultation Confirmation Notification */}
      {completionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3.5 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-sm shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Consultation Completed: {completionToast.patientName}</span>
            </span>
            <p className="text-xs text-slate-300 mt-0.5">{completionToast.message}</p>
          </div>
          <button 
            onClick={() => setCompletionToast(null)}
            className="text-slate-400 hover:text-white ml-2 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dr. Anita Rao's Warm & Lively Header Banner */}
      <div className="bg-gradient-to-br from-rose-50/90 via-pink-50/60 to-purple-50/50 rounded-3xl p-6 sm:p-7 border border-rose-200/80 shadow-xs space-y-4 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                {currentDoctor.roomNumber}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {specialty}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {doctorName}
            </h1>
          </div>

          {/* Quick Clinic Pulse */}
          <div className="flex items-center gap-3 shrink-0 text-xs">
            <div className="px-3 py-2 bg-white rounded-xl border border-rose-200 flex items-center gap-2">
              <span className="font-bold text-slate-900">{patients.length} Registered</span>
              <span className="text-slate-400">•</span>
              <span className="text-rose-700 font-semibold">{activeWaiting.length} Waiting</span>
            </div>

            <div className="px-3 py-2 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="font-bold text-slate-900">{completedToday.length} Completed</span>
            </div>
          </div>
        </div>

        {/* Doctor Workspace View Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-rose-200/60 text-xs font-semibold">
          <button
            onClick={() => setDoctorWorkspaceMode('CONSULTATION')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              doctorWorkspaceMode === 'CONSULTATION'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Consultations ({activeWaiting.length})</span>
          </button>

          <button
            onClick={() => {
              setDoctorWorkspaceMode('DASHBOARD');
              setSelectedPatientId(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              doctorWorkspaceMode === 'DASHBOARD'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => {
              setDoctorWorkspaceMode('DATABASE');
              setSelectedPatientId(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              doctorWorkspaceMode === 'DATABASE'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Patients Directory ({patients.length})</span>
          </button>

          <button
            onClick={() => {
              setDoctorWorkspaceMode('CARE_JOURNEY');
            }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              doctorWorkspaceMode === 'CARE_JOURNEY'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>My Care Journey ({patients.length})</span>
          </button>

          <button
            onClick={() => setDoctorWorkspaceMode('LABOUR_MONITOR')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              doctorWorkspaceMode === 'LABOUR_MONITOR'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Baby className="w-3.5 h-3.5 text-rose-500" />
            <span>Labour &amp; Delivery Ward Monitor</span>
          </button>

          <button
            onClick={() => setDoctorWorkspaceMode('TELE_COUNSELLING')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              doctorWorkspaceMode === 'TELE_COUNSELLING'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-500" />
            <span>Emergency Tele-Counselling Queue</span>
          </button>

          <div className="ml-auto hidden xl:flex items-center gap-2">
            <button
              onClick={() => setShowCostEstimatorModal(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cost Estimator</span>
            </button>

            <button
              onClick={() => setShowKnowledgeLibraryModal(true)}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Medical Library</span>
            </button>
          </div>
        </div>
      </div>


      {/* 1. Doctor Weekly & Monthly Dashboard View */}
      {doctorWorkspaceMode === 'DASHBOARD' && (
        <DoctorDashboard 
          restrictClinicId="opd-anc"
          doctorName={doctorName}
          onOpenWhatsAppView={onOpenWhatsAppView}
          onSelectPatient={(p) => {
            setDoctorWorkspaceMode('CONSULTATION');
            handleSelectPatient(p);
          }}
        />
      )}

      {/* 2. Central Visited Patient Repository & AI Follow-Up View */}
      {doctorWorkspaceMode === 'DATABASE' && (
        <PatientDatabaseView 
          restrictClinicId="opd-anc"
          doctorName={doctorName}
          onOpenWhatsAppView={onOpenWhatsAppView}
          onSelectPatient={(p) => {
            setDoctorWorkspaceMode('CONSULTATION');
            handleSelectPatient(p);
          }}
        />
      )}

      {/* 2.5 My Care Journey All OPD Pathways Panel */}
      {doctorWorkspaceMode === 'CARE_JOURNEY' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-700" />
              <span className="font-extrabold text-slate-900">Patient Care Journey & Continuity Inspector:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Select Patient:</span>
              <select
                value={selectedPatientId || patients[0]?.id || ''}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 cursor-pointer"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.careJourney?.title || p.visitReason.slice(0, 20)})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <MyCareJourneyPanel patient={selectedPatient || patients[0]} />
        </div>
      )}

      {/* 2.6 Hospital Labour & Delivery Ward Monitor */}
      {doctorWorkspaceMode === 'LABOUR_MONITOR' && (
        <HospitalLabourDeliveryPanel 
          patient={selectedPatient || patients.find(p => p.isPregnant) || patients[0]}
          doctorName={doctorName}
          onOpenLiveTracker={(pId) => setShowLabourTrackerModalId(pId)}
        />
      )}

      {/* 2.7 Emergency Tele-Counselling Queue */}
      {doctorWorkspaceMode === 'TELE_COUNSELLING' && (
        <EmergencyCounsellingQueuePanel 
          doctorId={currentDoctor.id}
          doctorName={doctorName}
        />
      )}

      {/* 3. Main Consultation Workspace (Active Queue or In-Consultation Workspace) */}

      {doctorWorkspaceMode === 'CONSULTATION' && (!selectedPatient ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-700" />
              <span>Today&apos;s Patient Appointments for {doctorName}</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Click &ldquo;Start Consultation&rdquo; on any patient to examine, prescribe, and counsel.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map(p => {
              const isCompleted = p.queueStatus === 'Completed';
              const isLabPending = p.queueStatus === 'Lab Pending' || p.queueStatus === 'In Lab';
              const clinicalStage = getGestationalClinicalStage(p.pregnancyDetails?.gestationalAgeWeeks);

              return (
                <div 
                  key={p.id}
                  className={`bg-white rounded-2xl border p-5 transition shadow-2xs flex flex-col justify-between space-y-4 relative overflow-hidden ${
                    p.queueStatus === 'With Doctor'
                      ? 'border-rose-400 ring-2 ring-rose-400/20'
                      : isCompleted
                      ? 'border-slate-200 bg-slate-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                          #{p.tokenNumber}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <span>{p.name}</span>
                            <span className="text-xs text-slate-500 font-normal">
                              ({p.age}y {p.isPregnant && p.pregnancyDetails ? `• G${p.pregnancyDetails.gravida || 1}P${p.pregnancyDetails.para || 0}` : `• ${p.careJourney?.title || p.visitReason}`})
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-500 font-mono">
                            OPD: {p.opdId} • {p.mobile}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isLabPending
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : p.queueStatus === 'With Doctor'
                          ? 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {p.queueStatus}
                      </span>
                    </div>

                    {/* Clinical Gestational Assessment */}
                    {p.isPregnant && p.pregnancyDetails && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-900 font-bold text-[10px] rounded-md border border-rose-200">
                              GA: {p.pregnancyDetails.gestationalAgeWeeks} Weeks
                            </span>
                            <span className="font-bold text-slate-800 text-[11px]">
                              {clinicalStage.stageName} ({clinicalStage.trimester})
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-600">
                            Est. Fetal Weight: <strong className="text-slate-800">{clinicalStage.efw}</strong> · {clinicalStage.clinicalProtocol}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200 block">
                            EDD: {p.pregnancyDetails.edd || 'Dec 2026'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 10-Second Gist */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                        Clinical Gist
                      </span>
                      <p className="text-[11px] text-slate-800 font-medium italic line-clamp-2">
                        &ldquo;{p.clinicalGist?.summaryText || p.visitReason}&rdquo;
                      </p>
                    </div>

                    {/* Vitals summary with animated heart */}
                    {p.vitals && (
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 bg-rose-50/40 p-2 rounded-xl border border-rose-100">
                        <span>BP: <strong>{p.vitals.bp || '118/76'}</strong></span>
                        <span>•</span>
                        <span>Wt: <strong>{p.vitals.weightKg || '58'} kg</strong></span>
                        {p.vitals.foetalHeartRate && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-rose-800 font-bold">
                              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-heart-beat" />
                              <span>FHR: {p.vitals.foetalHeartRate}</span>
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Single Clean Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Reason: <strong className="text-slate-800">{p.visitReason}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <button
                          onClick={() => setSelectedPatientForPrintRx(p)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View Rx</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleSelectPatient(p)}
                        className="px-4 py-2 bg-gradient-to-r from-rose-700 to-pink-700 hover:from-rose-800 hover:to-pink-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer transition active:scale-95"
                      >
                        <Stethoscope className="w-4 h-4 text-rose-200" />
                        <span>{isCompleted ? 'Review Consultation' : 'Start Consultation'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* In-Consultation Encounter Workspace */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-rose-200">
            <button
              onClick={() => setSelectedPatientId(null)}
              className="text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1.5 cursor-pointer bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full border border-rose-200 transition"
            >
              <span>← Back to Queue</span>
            </button>

            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Active Consultation: <strong className="text-rose-950">{selectedPatient.name}</strong> ({selectedPatient.opdId})</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Patient Gist, Obstetric Assessment & Lab History */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                {/* Header card with patient details */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      {selectedPatient.isPregnant ? (
                        <>
                          <Baby className="w-3.5 h-3.5 text-rose-700" />
                          <span>Obstetric Profile</span>
                        </>
                      ) : (
                        <>
                          <Stethoscope className="w-3.5 h-3.5 text-rose-700" />
                          <span>Patient Profile &amp; Pathway</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      Token #{selectedPatient.tokenNumber}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{selectedPatient.name}</h3>
                  <p className="text-[11px] text-slate-700 font-medium">{selectedPatient.clinicalGist?.headline}</p>
                  
                  {/* Gestational clinical card */}
                  {selectedPatient.isPregnant && selectedPatient.pregnancyDetails && (() => {
                    const m = getGestationalClinicalStage(selectedPatient.pregnancyDetails.gestationalAgeWeeks);
                    return (
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">
                            GA: {selectedPatient.pregnancyDetails.gestationalAgeWeeks} Weeks ({m.trimester})
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            EDD: {selectedPatient.pregnancyDetails.edd}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-800">
                          Clinical Stage: {m.stageName}
                        </p>
                        <p className="text-[10px] text-slate-600">
                          Est. Fetal Weight: {m.efw} · {m.clinicalProtocol}
                        </p>
                      </div>
                    );
                  })()}

                  <div className="pt-1 text-[11px] text-slate-600 space-y-0.5">
                    <p>📞 {selectedPatient.mobile}</p>
                    <p>🏠 {selectedPatient.address}</p>
                  </div>
                </div>

                {/* 10-Second Clinical Gist */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                    10-Second Clinical Gist
                  </span>
                  <p className="text-[11px] text-slate-800 italic leading-relaxed">
                    &ldquo;{selectedPatient.clinicalGist?.summaryText}&rdquo;
                  </p>
                </div>

                {/* Received Reports from Central Lab */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider block flex items-center gap-1.5">
                    <span>🔬</span>
                    <span>Apex Pathology Lab Requisitions</span>
                  </span>

                  {selectedPatient.labOrders.length === 0 ? (
                    <p className="text-slate-400 italic text-[11px]">No investigations ordered previously today.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPatient.labOrders.map(ord => (
                        <div key={ord.id} className="p-3 bg-purple-50/50 rounded-2xl border border-purple-200 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-purple-950">{ord.testName}</span>
                            <div className="flex items-center gap-1.5">
                              {ord.reportStatus === 'Report Uploaded' && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderForAnalyser(ord)}
                                  className="px-2 py-0.5 rounded-lg bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-2xs cursor-pointer transition"
                                  title="Open Diagnostic Result Analyser"
                                >
                                  <Activity className="w-3 h-3 text-purple-300" />
                                  <span>Analyser</span>
                                </button>
                              )}
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                ord.reportStatus === 'Report Uploaded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {ord.reportStatus}
                              </span>
                            </div>
                          </div>
                          {ord.reportSummary && (
                            <p className="text-slate-900 font-semibold bg-white p-2 rounded-xl border border-purple-200 mt-1">
                              Result: {ord.reportSummary}
                            </p>
                          )}
                          {ord.parameters && ord.parameters.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {ord.parameters.slice(0, 3).map((p, i) => (
                                <span key={i} className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                                  p.status === 'LOW' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                                  p.status === 'HIGH' || p.status === 'CRITICAL' ? 'bg-rose-50 text-rose-900 border-rose-300' :
                                  'bg-slate-100 text-slate-700 border-slate-200'
                                }`}>
                                  {p.name.split(' ')[0]}: {p.value} {p.unit}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Unified Consultation, Prescribing & Lab Requisition */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-rose-200 shadow-2xs space-y-5 text-xs">
              
              {/* PRE-SESSION CLINICAL GIST & ABHA PRIOR RECORDS BAR */}
              <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 p-4 sm:p-5 rounded-2xl text-white border border-rose-500/40 shadow-md space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>Pre-Session Clinical Gist</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full font-semibold">
                          ABDM M1/M2/M3 Synced
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {selectedPatient.clinicalGist?.headline || `${selectedPatient.name} • Longitudinal review before starting session`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAbhaPriorRecordsModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
                    title="Pull and view prior health records from ABDM / ABHA"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    <span>📂 View Prior Records (ABHA)</span>
                  </button>
                </div>

                {/* 3 Clinical Summary Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] pt-2 border-t border-white/10">
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Clinical Gist</span>
                    <span className="text-white font-medium line-clamp-2 italic mt-0.5 block">
                      &ldquo;{selectedPatient.clinicalGist?.summaryText || selectedPatient.visitReason}&rdquo;
                    </span>
                  </div>

                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Clinical Red Flags</span>
                    <span className="text-rose-300 font-bold block mt-0.5">
                      {selectedPatient.pregnancyDetails?.clinicalFlags?.join(', ') || 'Mild Anaemia (Hb 10.2), Rh- (O-)'}
                    </span>
                    <span className="text-slate-300 text-[10px]">OGTT 75g screening indicated at 28w</span>
                  </div>

                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Medical Adherence</span>
                    <span className="text-emerald-300 font-bold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>94% On-Track</span>
                    </span>
                    <span className="text-slate-300 text-[10px]">Iron + Calcium taken regularly via Jan Aushadhi</span>
                  </div>
                </div>
              </div>

              {/* 1. Vitals Entry (Adapted for Neonatal/Infant vs Antenatal vs Adult) */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-rose-900 uppercase tracking-wider block flex items-center gap-1.5">
                  <span>💗</span>
                  <span>1. Clinical Vitals &amp; Physical Parameters</span>
                </span>
                
                {selectedPatient.isNewborn || selectedPatient.age <= 2 ? (
                  /* Pediatric / Neonatal Vitals */
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-sky-50/50 p-3 rounded-2xl border border-sky-100">
                    <div>
                      <label className="text-[10px] font-bold text-sky-900 block mb-0.5">Infant Weight (kg)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-sky-200 rounded-xl font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sky-900 block mb-0.5">Length (cm)</label>
                      <input
                        type="number"
                        value={lengthCm}
                        onChange={(e) => setLengthCm(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-sky-200 rounded-xl font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sky-900 block mb-0.5">Head Circ. (cm)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={headCircumferenceCm}
                        onChange={(e) => setHeadCircumferenceCm(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-sky-200 rounded-xl font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sky-900 block mb-0.5">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={pulse}
                        onChange={(e) => setPulse(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-sky-200 rounded-xl font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sky-900 block mb-0.5">Temperature</label>
                      <input
                        type="text"
                        value={temperatureF}
                        onChange={(e) => setTemperatureF(e.target.value)}
                        className="w-full p-2 bg-white border border-sky-200 rounded-xl font-bold text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  /* Standard / Antenatal Vitals */
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Blood Pressure</label>
                      <input
                        type="text"
                        value={bp}
                        onChange={(e) => setBp(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        {selectedPatient.isPregnant ? 'Maternal Weight (kg)' : 'Patient Weight (kg)'}
                      </label>
                      <input
                        type="number"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                      />
                    </div>
                    {selectedPatient.isPregnant ? (
                      <>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Fundal Ht (cm)</label>
                          <input
                            type="number"
                            value={fundalHeightCm}
                            onChange={(e) => setFundalHeightCm(Number(e.target.value))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-rose-700 block mb-0.5 flex items-center gap-1">
                            <Heart className="w-2.5 h-2.5 fill-rose-500 animate-heart-beat" />
                            <span>Foetal Heart Rate</span>
                          </label>
                          <input
                            type="text"
                            value={foetalHeartRate}
                            onChange={(e) => setFoetalHeartRate(e.target.value)}
                            className="w-full p-2 bg-rose-50/50 border border-rose-200 text-rose-950 font-bold rounded-xl text-xs"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Pulse (bpm)</label>
                        <input
                          type="number"
                          value={pulse}
                          onChange={(e) => setPulse(Number(e.target.value))}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Examination Findings & Clinical Notes with Standard Advice Protocols */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    2. Examination Findings &amp; Counseling Notes
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">Clinical Protocols:</span>
                </div>

                {/* Evidence-based clinical advice protocols */}
                <div className="flex flex-wrap gap-1.5">
                  {MATERNAL_CLINICAL_GUIDELINES.map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleAppendMaternalPearl(item)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                      title={item.tip}
                    >
                      <span>+ {item.label}</span>
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Record diagnosis, dietary advice, and counseling notes..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed focus:bg-white focus:border-rose-400 focus:outline-none"
                />
              </div>

              {/* NEWBORN & INFANT VACCINATION SCHEDULE CARD (For babies / pediatric consultations) */}
              {(selectedPatient.isNewborn || selectedPatient.age <= 5 || selectedPatient.clinicId === 'opd-ped' || selectedPatient.visitType === 'Immunisation') && (
                <NewbornVaccinationCard 
                  patient={selectedPatient} 
                  onVaccineAdministered={() => {
                    // Force refresh patient state
                    const p = opdStore.patients.find(x => x.id === selectedPatient.id);
                    if (p) setSelectedPatientId(p.id);
                  }}
                />
              )}

              {/* 3. Prescribe Medications (Referred to Partner Chemist / Pharmacy Store) */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💊</span>
                    <span className="font-extrabold text-emerald-950 uppercase text-[10px] tracking-wide">
                      3. Prescribe Medications (Jan Aushadhi Dispensary Loop)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="px-3 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs self-end sm:self-auto"
                  >
                    <Plus className="w-3 h-3 text-emerald-700" />
                    <span>+ Add Medication</span>
                  </button>
                </div>

                {/* Partner Chemist / Pharmacy Store Selection */}
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-extrabold text-slate-800 text-[11px]">Route to Pharmacy:</span>
                  </div>
                  <select
                    value={selectedPharmacyPartnerId}
                    onChange={(e) => setSelectedPharmacyPartnerId(e.target.value)}
                    className="bg-emerald-50 border border-emerald-300 rounded-lg px-2.5 py-1 text-xs font-bold text-emerald-950 focus:outline-none cursor-pointer"
                  >
                    {opdStore.getPharmacyPartners().map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.distance}) • {p.discountOffer}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  {medicines.map((m) => (
                    <div key={m.id} className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={m.medicineName}
                          onChange={(e) => handleUpdateMedicine(m.id, 'medicineName', e.target.value)}
                          className="font-bold text-xs text-slate-900 flex-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(m.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Dosage</label>
                          <input
                            type="text"
                            value={m.dosage}
                            onChange={(e) => handleUpdateMedicine(m.id, 'dosage', e.target.value)}
                            className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Frequency</label>
                          <input
                            type="text"
                            value={m.frequency}
                            onChange={(e) => handleUpdateMedicine(m.id, 'frequency', e.target.value)}
                            className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Duration</label>
                          <input
                            type="text"
                            value={m.duration}
                            onChange={(e) => handleUpdateMedicine(m.id, 'duration', e.target.value)}
                            className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Quantity</label>
                          <input
                            type="number"
                            value={m.quantity || 30}
                            onChange={(e) => handleUpdateMedicine(m.id, 'quantity', Number(e.target.value))}
                            className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Request Lab Investigations — Stage-based Maternal Protocol or Standard Lab Hub */}
              {selectedPatient.isPregnant || selectedPatient.maternalStage || selectedPatient.visitType === 'ANC' || selectedPatient.visitType === 'PNC' || selectedPatient.postnatalDetails || selectedCareJourneyType === 'PREGNANCY' || selectedCareJourneyType === 'POSTNATAL' ? (
                /* MATERNAL CLINICAL PROTOCOL SUITE (DURING & AFTER PREGNANCY) */
                <MaternalTestingPanel 
                  patient={selectedPatient}
                  selectedLabPartnerId={selectedLabPartnerId}
                  onSelectLabPartnerId={setSelectedLabPartnerId}
                  onTestsOrdered={() => {
                    const p = opdStore.patients.find(x => x.id === selectedPatient.id);
                    if (p) setSelectedPatientId(p.id);
                  }}
                />
              ) : (
                /* Standard Outpatient Lab Investigations */
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔬</span>
                      <span className="font-extrabold text-purple-950 uppercase text-[10px] tracking-wide">
                        4. Order Laboratory Investigations (Diagnostic Hub)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-bold self-end sm:self-auto">
                      <span className="text-purple-800 text-[10px]">Priority:</span>
                      <select
                        value={labPriority}
                        onChange={(e) => setLabPriority(e.target.value as any)}
                        className="bg-white border border-purple-300 rounded-lg px-2 py-0.5 text-[11px] text-purple-950 font-bold cursor-pointer"
                      >
                        <option value="Routine">Routine</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Stat">STAT (Emergency)</option>
                      </select>
                    </div>
                  </div>

                  {/* Distant Lab Facility Selection */}
                  <div className="p-2.5 bg-white rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span className="font-extrabold text-slate-800 text-[11px]">Diagnostic Lab Facility:</span>
                    </div>
                    <select
                      value={selectedLabPartnerId}
                      onChange={(e) => setSelectedLabPartnerId(e.target.value)}
                      className="bg-purple-50 border border-purple-300 rounded-lg px-2.5 py-1 text-xs font-bold text-purple-950 focus:outline-none cursor-pointer"
                    >
                      {opdStore.getLabPartners().map(l => (
                        <option key={l.id} value={l.id}>
                          {l.name} ({l.distance}) • Mode: {l.sampleCollectionMode}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Common test badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Complete Blood Count (CBC / Hb)',
                      'Urine Routine & Albumin',
                      'Fasting Blood Sugar & HbA1c',
                      'Serum Creatinine & Electrolytes',
                      'Liver Function Test (LFT)',
                      'Thyroid Profile (Total T3, T4, TSH)',
                      'Ultrasound Abdomen & Pelvis'
                    ].map(test => {
                      const isSelected = selectedLabTests.includes(test);
                      return (
                        <button
                          key={test}
                          type="button"
                          onClick={() => handleToggleLabTest(test)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-purple-800 text-white shadow-xs'
                              : 'bg-white hover:bg-purple-100 text-purple-950 border border-purple-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-purple-200" />}
                          <span>{test}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Test input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Enter custom lab investigation..."
                      value={customTestInput}
                      onChange={(e) => setCustomTestInput(e.target.value)}
                      className="flex-1 p-2 bg-white border border-purple-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTest}
                      className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs"
                    >
                      + Add Test
                    </button>
                  </div>
                </div>
              )}

              {/* Clinician-Defined Care Pathway & Follow-Up Plan */}
              <div className="p-4 bg-gradient-to-br from-teal-50/70 to-emerald-50/50 rounded-2xl border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-teal-800" />
                    <span className="font-extrabold text-teal-950 text-xs uppercase tracking-wide">
                      4. Clinician Care Pathway &amp; Follow-Up Schedule
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full border border-teal-300">
                    Clinician Determined
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Journey Category */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Journey Pathway:</label>
                    <select
                      value={selectedCareJourneyType}
                      onChange={(e) => setSelectedCareJourneyType(e.target.value as CareJourneyType)}
                      className="w-full bg-white border border-teal-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="PREGNANCY">Pregnancy Care (Antenatal)</option>
                      <option value="POSTNATAL">Postnatal Care</option>
                      <option value="GYNECOLOGY">Gynaecology Consultation</option>
                      <option value="ONGOING_CONDITION">Ongoing Condition Follow-up (e.g. PCOS)</option>
                      <option value="PREVENTIVE_SCREENING">Preventive Screening (e.g. Pap Smear / Wellness)</option>
                      <option value="INVESTIGATION_REVIEW">Investigation &amp; Report Review</option>
                      <option value="GENERAL_OPD">General OPD Follow-up</option>
                    </select>
                  </div>

                  {/* Follow-up Required Toggle */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Follow-Up Requirement:</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsFollowUpRequired(true)}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          isFollowUpRequired
                            ? 'bg-teal-800 text-white border-teal-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Follow-Up Needed
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFollowUpRequired(false)}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          !isFollowUpRequired
                            ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Single Visit / None
                      </button>
                    </div>
                  </div>
                </div>

                {isFollowUpRequired ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Follow-Up Date:</label>
                      <input
                        type="text"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        placeholder="e.g. 24 Oct 2026"
                        className="w-full bg-white border border-teal-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Follow-Up Instruction:</label>
                      <input
                        type="text"
                        value={followUpInstruction}
                        onChange={(e) => setFollowUpInstruction(e.target.value)}
                        placeholder="e.g. Review bloods &amp; assess symptom relief"
                        className="w-full bg-white border border-teal-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-white/90 rounded-xl border border-teal-200 text-[11px] text-teal-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Single-visit consultation: Clinician records that no immediate follow-up is required. Care episode completes 100% with no non-adherence penalty.</span>
                  </div>
                )}
              </div>

              {/* ONE Single Primary Action Button with cheerful warmth */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPatientId(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel & Exit
                </button>

                <button
                  type="button"
                  onClick={handleCompleteConsultationAndDispatch}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 shadow-sm cursor-pointer transition active:scale-95"
                >
                  <Send className="w-4 h-4 text-slate-300" />
                  <span>Complete Consultation & Dispatch (Rx + Labs)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Printable Prescription Modal Slip */}
      {selectedPatientForPrintRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-700" />
                <span>Verified Electronic Prescription (Rx)</span>
              </span>
              <button 
                onClick={() => setSelectedPatientForPrintRx(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Official Slip */}
            <div className="border border-slate-300 p-6 rounded-xl bg-white space-y-4 font-sans text-xs">
              <div className="text-center pb-3 border-b-2 border-slate-900">
                <span className="font-black text-base text-slate-900 block tracking-tight">
                  DISTRICT HOSPITAL HUBBALLI
                </span>
                <span className="text-[10px] text-slate-700 font-semibold">
                  {departmentName} • {doctorName} ({specialty})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-slate-200">
                <div>
                  <p><span className="text-slate-500">Patient:</span> <strong>{selectedPatientForPrintRx.name}</strong></p>
                  <p><span className="text-slate-500">OPD ID:</span> {selectedPatientForPrintRx.opdId}</p>
                  <p><span className="text-slate-500">ABHA:</span> {selectedPatientForPrintRx.abhaId}</p>
                </div>
                <div className="text-right">
                  <p><span className="text-slate-500">Age / Gender:</span> {selectedPatientForPrintRx.age}y / {selectedPatientForPrintRx.gender}</p>
                  <p><span className="text-slate-500">Token:</span> #{selectedPatientForPrintRx.tokenNumber}</p>
                  <p><span className="text-slate-500">Date:</span> 10 Oct 2026</p>
                </div>
              </div>

              {/* Rx section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-extrabold text-sm text-slate-900 block">
                    ℞ Prescribed Medications
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Jan Aushadhi Partner Store
                  </span>
                </div>
                <div className="space-y-1.5">
                  {(selectedPatientForPrintRx.prescriptions || []).map((pStr, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800">
                      • {pStr}
                    </div>
                  ))}
                </div>
              </div>

              {/* Guidance Note */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Patient Guidance:</p>
                <p>• <strong>Medicines:</strong> Collect from PM Jan Aushadhi or nearby partner chemist. Generics save up to 80%.</p>
                <p>• <strong>Diagnostic Lab:</strong> Requisitions are routed digitally to Apex Diagnostic Hub.</p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200 text-[10px] text-slate-500">
                <span>Digitally signed: {doctorName}</span>
                <span className="font-bold text-slate-800">VERIFIED ELECTRONIC Rx</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPatientForPrintRx(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Prescription</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Diagnostic Results Analyser */}
      {selectedOrderForAnalyser && (
        <DiagnosticAnalyserModal
          order={selectedOrderForAnalyser}
          patientGestationWeeks={selectedPatient?.pregnancyDetails?.gestationalAgeWeeks || 28}
          onClose={() => setSelectedOrderForAnalyser(null)}
        />
      )}

      {/* Labour & Delivery Live Tracker Modal for Doctor */}
      {showLabourTrackerModalId && (
        <LabourDeliveryLiveTrackerModal
          initialPatientId={showLabourTrackerModalId}
          isHospitalStaffView={true}
          onClose={() => setShowLabourTrackerModalId(null)}
        />
      )}

      {/* Cost Estimator Modal for Doctor */}
      {showCostEstimatorModal && (
        <TreatmentCostEstimatorModal
          initialPatientId={selectedPatientId || undefined}
          onClose={() => setShowCostEstimatorModal(false)}
        />
      )}

      {/* Knowledge Library Modal for Doctor */}
      {showKnowledgeLibraryModal && (
        <KnowledgeLibraryModal
          onClose={() => setShowKnowledgeLibraryModal(false)}
        />
      )}

      {/* ABHA Prior Records Modal */}
      {showAbhaPriorRecordsModal && selectedPatient && (
        <AbhaPriorRecordsModal
          patient={selectedPatient}
          onClose={() => setShowAbhaPriorRecordsModal(false)}
          onImportToNotes={(importedText) => {
            setDoctorNotes(prev => prev ? `${prev}\n\n${importedText}` : importedText);
          }}
        />
      )}
    </div>
  );
};

