import React, { useState, useEffect } from 'react';
import { 
  X, 
  Scan, 
  Camera, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Pill, 
  TestTubes, 
  Building2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  Plus, 
  Trash2, 
  Eye, 
  Send, 
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { 
  OpdPatient, 
  PrescriptionMedicineItem, 
  PharmacyOrder, 
  LabReferral 
} from '../../types';
import { 
  opdStore, 
  PHARMACY_PARTNERS 
} from '../../services/opdStore';
import { 
  PREDEFINED_INVESTIGATIONS, 
  REFERRAL_LAB_OPTIONS 
} from './CreateLabReferralModal';

interface ScanPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPatient?: OpdPatient | null;
  onLoopCompleted?: (result: { pharmacyOrder?: PharmacyOrder; labReferrals: LabReferral[] }) => void;
}

interface ScannedPrescriptionPreset {
  id: string;
  name: string;
  patientName: string;
  doctorName: string;
  medicines: PrescriptionMedicineItem[];
  labTests: { testName: string; labId: string; priority: 'Routine' | 'Urgent'; clinicalNote: string }[];
  clinicalNotes: string;
  vitals: string;
}

const PRESET_PRESCRIPTIONS: ScannedPrescriptionPreset[] = [
  {
    id: 'preset-sunita',
    name: 'Sunita Das — ANC 28w (Routine IFA, Calcium + OGTT Glucose & CBC)',
    patientName: 'Sunita Das',
    doctorName: 'Dr. Anita Rao, MBBS, MS (OBG)',
    clinicalNotes: '28 weeks gestation, fundal height 28 cm, cephalic presentation, FHR 142 bpm. O-negative blood group, screening for gestational diabetes and repeat haemoglobin.',
    vitals: 'BP: 118/76 mmHg | Wt: 58.5 kg | FHR: 142 bpm',
    medicines: [
      {
        id: 'med-p1',
        medicineName: 'Tab. Iron & Folic Acid 100mg',
        dosage: '100mg',
        frequency: 'Once daily (OD)',
        timing: 'After lunch with water',
        duration: '30 days',
        quantity: 30,
        instructions: 'Do not take together with tea, coffee, or calcium tablet.',
        isJanAushadhiAvailable: true,
        genericEquivalent: 'Ferrous Ascorbate 100mg + Folic Acid 1.5mg'
      },
      {
        id: 'med-p2',
        medicineName: 'Tab. Calcium Carbonate 500mg + Vit D3',
        dosage: '500mg',
        frequency: 'Twice daily (BD)',
        timing: 'After breakfast and after dinner',
        duration: '30 days',
        quantity: 60,
        instructions: 'Take 2 hours apart from Iron tablet to prevent absorption interference.',
        isJanAushadhiAvailable: true,
        genericEquivalent: 'Calcium 500mg + Cholecalciferol 250 IU'
      }
    ],
    labTests: [
      {
        testName: 'Oral Glucose Tolerance Test (OGTT 75g - 2 Hr)',
        labId: 'lab-inhouse',
        priority: 'Routine',
        clinicalNote: 'DIPSI / FOGSI protocol for GDM screening at 28 weeks'
      },
      {
        testName: 'Complete Blood Count (CBC / Hb)',
        labId: 'lab-inhouse',
        priority: 'Routine',
        clinicalNote: 'Evaluate anaemia progression; baseline Hb was 10.2 g/dL'
      }
    ]
  },
  {
    id: 'preset-farida',
    name: 'Farida Begum — ANC 34w (IFA + Calcium + USG Growth Doppler)',
    patientName: 'Farida Begum',
    doctorName: 'Dr. Anita Rao, MBBS, MS (OBG)',
    clinicalNotes: '34 weeks gestation, G3P2, fundal height 33 cm. Foetal movements regular. Prescriptions continued till term. Ultrasound growth scan advised.',
    vitals: 'BP: 120/78 mmHg | Wt: 64.0 kg | FHR: 140 bpm',
    medicines: [
      {
        id: 'med-p3',
        medicineName: 'Tab. Iron & Folic Acid (IFA)',
        dosage: '100mg',
        frequency: 'Once daily (OD)',
        timing: 'After meals',
        duration: '30 days',
        quantity: 30,
        instructions: 'Continue regular adherence till term.',
        isJanAushadhiAvailable: true,
        genericEquivalent: 'Ferrous Sulphate + Folic Acid'
      },
      {
        id: 'med-p4',
        medicineName: 'Tab. Calcium 500mg',
        dosage: '500mg',
        frequency: 'Twice daily (BD)',
        timing: 'After food',
        duration: '30 days',
        quantity: 60,
        instructions: 'Ensure adequate hydration.',
        isJanAushadhiAvailable: true,
        genericEquivalent: 'Calcium Carbonate 500mg'
      },
      {
        id: 'med-p5',
        medicineName: 'Cap. Vitamin D3 60,000 IU',
        dosage: '60,000 IU',
        frequency: 'Once weekly (QW)',
        timing: 'With warm milk on Sundays',
        duration: '4 weeks',
        quantity: 4,
        instructions: 'Take with full-fat milk for optimal absorption.',
        isJanAushadhiAvailable: true,
        genericEquivalent: 'Cholecalciferol Softgel 60k'
      }
    ],
    labTests: [
      {
        testName: 'Obstetric Ultrasound — Growth & Doppler Scan',
        labId: 'lab-apex-imaging',
        priority: 'Routine',
        clinicalNote: '34-week foetal biometry, amniotic fluid volume (AFI) and placental location'
      }
    ]
  },
  {
    id: 'preset-meena',
    name: 'Meena Roy — ANC 23w (Folic Acid, Progesterone + Pap Smear)',
    patientName: 'Meena Roy',
    doctorName: 'Dr. Anita Rao, MBBS, MS (OBG)',
    clinicalNotes: '23 weeks primi gravida. Routine antenatal review. Pap smear collection recommended. Luteal/placental support continued.',
    vitals: 'BP: 122/80 mmHg | Wt: 62.0 kg | FHR: 148 bpm',
    medicines: [
      {
        id: 'med-p6',
        medicineName: 'Tab. Folic Acid 5mg',
        dosage: '5mg',
        frequency: 'Once daily (OD)',
        timing: 'Morning after breakfast',
        duration: '30 days',
        quantity: 30,
        instructions: 'Essential neurodevelopment support.',
        isJanAushadhiAvailable: true,
        genericEquivalent: 'Folic Acid Tab 5mg'
      },
      {
        id: 'med-p7',
        medicineName: 'Cap. Micronized Natural Progesterone 200mg',
        dosage: '200mg',
        frequency: 'Once at bedtime (HS)',
        timing: 'At bedtime with milk',
        duration: '15 days',
        quantity: 15,
        instructions: 'Uterine quiescence support.',
        isJanAushadhiAvailable: false,
        genericEquivalent: 'Progesterone Softgel 200mg'
      }
    ],
    labTests: [
      {
        testName: 'Pap Smear Cytology (Liquid Based / Conventional)',
        labId: 'lab-inhouse',
        priority: 'Routine',
        clinicalNote: 'Primi gravida cervical screening cytology'
      }
    ]
  }
];

export const ScanPrescriptionModal: React.FC<ScanPrescriptionModalProps> = ({
  isOpen,
  onClose,
  initialPatient,
  onLoopCompleted
}) => {
  const allPatients = opdStore.patients;
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatient?.id || allPatients[0]?.id || ''
  );

  const selectedPatient = allPatients.find(p => p.id === selectedPatientId) || initialPatient || allPatients[0];

  // Scan state
  const [activeTab, setActiveTab] = useState<'scan' | 'review' | 'success'>('scan');
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | 'preset'>('camera');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-sunita');
  const [isScanningAnimation, setIsScanningAnimation] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);

  // Extracted data state
  const [extractedMedicines, setExtractedMedicines] = useState<PrescriptionMedicineItem[]>(
    PRESET_PRESCRIPTIONS[0].medicines
  );
  const [extractedLabTests, setExtractedLabTests] = useState<{
    testName: string;
    labId: string;
    priority: 'Routine' | 'Urgent';
    clinicalNote: string;
    selected: boolean;
  }[]>(
    PRESET_PRESCRIPTIONS[0].labTests.map(t => ({ ...t, selected: true }))
  );

  // Referrals loop state
  const [referToPharmacy, setReferToPharmacy] = useState<boolean>(true);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>('pharm-inhouse');
  const [referToLab, setReferToLab] = useState<boolean>(true);
  const [receptionistName, setReceptionistName] = useState<string>('Pooja K (Reception Desk)');
  const [customDoctorNotes, setCustomDoctorNotes] = useState<string>(
    PRESET_PRESCRIPTIONS[0].clinicalNotes
  );

  // Completed result state
  const [completedOrder, setCompletedOrder] = useState<PharmacyOrder | null>(null);
  const [completedLabRefs, setCompletedLabRefs] = useState<LabReferral[]>([]);

  // Update extracted preset when patient or preset changes
  useEffect(() => {
    if (initialPatient) {
      setSelectedPatientId(initialPatient.id);
      // match matching preset if any
      const matchingPreset = PRESET_PRESCRIPTIONS.find(pr => 
        pr.patientName.toLowerCase() === initialPatient.name.toLowerCase()
      );
      if (matchingPreset) {
        setSelectedPresetId(matchingPreset.id);
        setExtractedMedicines(matchingPreset.medicines);
        setExtractedLabTests(matchingPreset.labTests.map(t => ({ ...t, selected: true })));
        setCustomDoctorNotes(matchingPreset.clinicalNotes);
      }
    }
  }, [initialPatient]);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = PRESET_PRESCRIPTIONS.find(p => p.id === presetId);
    if (!preset) return;

    setExtractedMedicines([...preset.medicines]);
    setExtractedLabTests(preset.labTests.map(t => ({ ...t, selected: true })));
    setCustomDoctorNotes(preset.clinicalNotes);

    // If patient matches by name, select that patient
    const match = allPatients.find(p => p.name.toLowerCase().includes(preset.patientName.toLowerCase()));
    if (match) {
      setSelectedPatientId(match.id);
    }
  };

  // Perform Simulated Scanning
  const handleStartScan = () => {
    setIsScanningAnimation(true);
    setScanProgress(10);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanningAnimation(false);
            setActiveTab('review');
          }, 400);
          return 100;
        }
        return prev + 18;
      });
    }, 180);
  };

  // Medicine item manipulation
  const handleUpdateMedicine = (index: number, field: keyof PrescriptionMedicineItem, value: any) => {
    const updated = [...extractedMedicines];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedMedicines(updated);
  };

  const handleRemoveMedicine = (index: number) => {
    setExtractedMedicines(extractedMedicines.filter((_, i) => i !== index));
  };

  const handleAddMedicine = () => {
    const newMed: PrescriptionMedicineItem = {
      id: `med-${Date.now()}`,
      medicineName: 'Tab. Paracetamol 650mg',
      dosage: '650mg',
      frequency: 'SOS (As needed)',
      timing: 'After food',
      duration: '5 days',
      quantity: 10,
      instructions: 'Take only in case of mild fever or body ache',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'Paracetamol Tab 650mg'
    };
    setExtractedMedicines([...extractedMedicines, newMed]);
  };

  // Lab test manipulation
  const handleToggleLabTest = (index: number) => {
    const updated = [...extractedLabTests];
    updated[index].selected = !updated[index].selected;
    setExtractedLabTests(updated);
  };

  const handleAddLabInvestigation = (testName: string) => {
    if (extractedLabTests.some(t => t.testName === testName)) return;
    setExtractedLabTests([
      ...extractedLabTests,
      {
        testName,
        labId: 'lab-inhouse',
        priority: 'Routine',
        clinicalNote: 'Added from doctor prescription investigation recommendations',
        selected: true
      }
    ]);
  };

  // Final Action: Complete the Loop!
  const handleExecuteLoop = () => {
    if (!selectedPatient) return;

    const selectedTestsToRefer = referToLab 
      ? extractedLabTests.filter(t => t.selected).map(t => ({
          testName: t.testName,
          labName: REFERRAL_LAB_OPTIONS.find(l => l.id === t.labId)?.name || 'In-house Central Pathology Lab',
          priority: t.priority,
          clinicalNote: t.clinicalNote
        }))
      : [];

    const result = opdStore.scanDoctorPrescription({
      patientId: selectedPatient.id,
      medicines: extractedMedicines,
      referToPharmacy,
      pharmacyId: selectedPharmacyId,
      labTestsToRefer: selectedTestsToRefer,
      referToLab,
      scannedBy: receptionistName,
      rawDoctorText: customDoctorNotes
    });

    setCompletedOrder(result.pharmacyOrder || null);
    setCompletedLabRefs(result.labReferrals);
    setActiveTab('success');

    if (onLoopCompleted) {
      onLoopCompleted(result);
    }
  };

  if (!isOpen) return null;

  const currentPreset = PRESET_PRESCRIPTIONS.find(p => p.id === selectedPresetId) || PRESET_PRESCRIPTIONS[0];
  const selectedPharmacy = PHARMACY_PARTNERS.find(p => p.id === selectedPharmacyId) || PHARMACY_PARTNERS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm sm:text-base tracking-tight">
                  SCAN DOCTOR PRESCRIPTION (Rx)
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-200 border border-teal-400/30 px-2 py-0.2 rounded-full">
                  Loop Completion Studio
                </span>
              </div>
              <p className="text-[11px] text-teal-100/80">
                Receptionist Scanner • Digitize Medicines & Refer to Pharmacy • Auto-Link Tests to Lab
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center gap-1.5 font-bold transition cursor-pointer ${
                activeTab === 'scan' ? 'text-teal-800' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                activeTab === 'scan' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>1</span>
              <span>Scan & Capture Rx</span>
            </button>

            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-1.5 font-bold transition cursor-pointer ${
                activeTab === 'review' ? 'text-teal-800' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                activeTab === 'review' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>2</span>
              <span>Review Medicines & Lab Loop</span>
            </button>

            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

            <div className={`flex items-center gap-1.5 font-bold ${
              activeTab === 'success' ? 'text-emerald-700' : 'text-slate-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                activeTab === 'success' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>3</span>
              <span>Loop Completed & WhatsApp Sent</span>
            </div>
          </div>

          {/* Quick Active Patient pill */}
          {selectedPatient && (
            <div className="hidden md:flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
              <span className="font-bold text-slate-900">{selectedPatient.name}</span>
              <span className="text-slate-400 font-mono text-[10px]">#{selectedPatient.tokenNumber}</span>
              <span className="text-[10px] bg-teal-50 text-teal-800 px-1.5 py-0.2 rounded font-semibold border border-teal-200">
                {selectedPatient.isPregnant ? `${selectedPatient.pregnancyDetails?.gestationalAgeWeeks}w` : selectedPatient.visitType}
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700">
          {/* STEP 1: SCAN & CAPTURE RX */}
          {activeTab === 'scan' && (
            <div className="space-y-4">
              {/* Patient Selection & Quick Setup */}
              <div className="bg-teal-50/50 p-3.5 rounded-xl border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-teal-950 uppercase tracking-wide text-[10px]">
                    Select Patient Presenting Prescription
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedPatientId}
                      onChange={(e) => {
                        const pid = e.target.value;
                        setSelectedPatientId(pid);
                        const pat = allPatients.find(p => p.id === pid);
                        if (pat) {
                          const matchPreset = PRESET_PRESCRIPTIONS.find(pr => 
                            pr.patientName.toLowerCase() === pat.name.toLowerCase()
                          );
                          if (matchPreset) handleSelectPreset(matchPreset.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-white border border-teal-300 font-bold text-slate-900 rounded-lg text-xs focus:ring-1 focus:ring-teal-600"
                    >
                      {allPatients.map(p => (
                        <option key={p.id} value={p.id}>
                          Token #{p.tokenNumber} — {p.name} ({p.age}y, {p.isPregnant ? `${p.pregnancyDetails?.gestationalAgeWeeks}w Gestation` : p.visitType}) • Status: {p.queueStatus}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-[11px] text-teal-900 bg-white/80 p-2 rounded-lg border border-teal-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Verified OPD Record: <strong>{selectedPatient?.opdId}</strong> (ABHA: {selectedPatient?.abhaId})</span>
                </div>
              </div>

              {/* Mode Selectors */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setScanMode('camera')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    scanMode === 'camera'
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Live Document Scanner</span>
                </button>

                <button
                  onClick={() => setScanMode('preset')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    scanMode === 'preset'
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Clinical Prescription Presets</span>
                </button>

                <button
                  onClick={() => setScanMode('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    scanMode === 'upload'
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Rx Image / Slip</span>
                </button>
              </div>

              {/* Preset Selector buttons when in preset mode */}
              {scanMode === 'preset' && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 text-[11px] block">
                    Choose Hospital OPD Clinical Prescription Scenario:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PRESET_PRESCRIPTIONS.map(pr => (
                      <button
                        key={pr.id}
                        type="button"
                        onClick={() => handleSelectPreset(pr.id)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          selectedPresetId === pr.id
                            ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500/30'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-extrabold text-slate-900 block text-[11px]">{pr.patientName}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{pr.name}</span>
                        <div className="mt-1 flex items-center gap-1.5 text-[9px] font-bold">
                          <span className="text-teal-700 bg-teal-100/70 px-1 py-0.2 rounded">{pr.medicines.length} Medicines</span>
                          <span className="text-purple-700 bg-purple-100/70 px-1 py-0.2 rounded">{pr.labTests.length} Lab Tests</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Scanner Viewport with Realistic Doctor's Rx Slip */}
              <div className="relative bg-slate-900 rounded-2xl p-4 sm:p-6 overflow-hidden border border-slate-800 shadow-inner flex flex-col items-center justify-center min-h-[380px]">
                {/* Holographic scanning guide lines */}
                <div className="absolute inset-4 sm:inset-8 border-2 border-teal-500/40 rounded-xl pointer-events-none">
                  {/* Corner notches */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-teal-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-teal-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-teal-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-teal-400" />
                </div>

                {/* Animated Scanner Laser Sweep */}
                {isScanningAnimation && (
                  <div 
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] z-20 transition-all duration-300 pointer-events-none"
                    style={{ top: `${scanProgress}%` }}
                  />
                )}

                {/* Realistic Doctor's Physical Prescription Slip Under Viewfinder */}
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 p-5 text-slate-800 font-sans relative z-10 transition-transform">
                  {/* Hospital & Doctor Letterhead */}
                  <div className="border-b-2 border-slate-800 pb-2 mb-3 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-teal-800 text-white font-bold text-[9px] flex items-center justify-center">DH</span>
                        <h4 className="font-extrabold text-xs text-slate-900 tracking-tight">DISTRICT HOSPITAL HUBBALLI</h4>
                      </div>
                      <p className="text-[10px] text-teal-800 font-bold">Maternal & Child Health OPD Desk • Room 4</p>
                      <p className="text-[9px] text-slate-500 font-serif">Dr. Anita Rao, MBBS, MS (Obstetrics & Gynaecology) • Reg: KMC-58210</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 block">
                        OPD: {selectedPatient?.opdId}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">10-OCT-2026 • 09:30 AM</span>
                    </div>
                  </div>

                  {/* Patient Info row on Rx */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg text-[10px] border border-slate-200 mb-3">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Patient Name:</span>
                      <strong className="text-slate-900">{selectedPatient?.name} (#{selectedPatient?.tokenNumber})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Age / Gestation:</span>
                      <strong className="text-slate-800">
                        {selectedPatient?.age}y • {selectedPatient?.isPregnant ? `${selectedPatient.pregnancyDetails?.gestationalAgeWeeks}wks` : 'Non-pregnant'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Vitals:</span>
                      <span className="text-slate-700 font-medium">{currentPreset.vitals}</span>
                    </div>
                  </div>

                  {/* The Rx Symbol and Handwritten-style Prescription */}
                  <div className="space-y-3 font-serif">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-900 font-serif italic">℞</span>
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                        Doctor Prescribed Medication & Diagnostics
                      </span>
                    </div>

                    {/* Prescribed Medicines preview */}
                    <div className="pl-4 border-l-2 border-teal-700/50 space-y-1.5 font-sans">
                      <span className="text-[10px] font-bold text-teal-950 uppercase tracking-wide block">
                        Medicines for Pharmacy Fulfillment:
                      </span>
                      {extractedMedicines.map((m, idx) => (
                        <div key={m.id || idx} className="text-[11px] leading-tight flex items-baseline justify-between">
                          <div>
                            <strong className="text-slate-900">{idx + 1}. {m.medicineName}</strong>
                            <span className="text-slate-600 ml-1.5 text-[10px]">({m.dosage}) — {m.frequency}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 font-bold">{m.duration}</span>
                        </div>
                      ))}
                    </div>

                    {/* Prescribed Lab Investigations */}
                    {extractedLabTests.length > 0 && (
                      <div className="pl-4 border-l-2 border-purple-700/50 space-y-1.5 font-sans pt-1">
                        <span className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block">
                          Advised Laboratory Investigations:
                        </span>
                        {extractedLabTests.map((t, idx) => (
                          <div key={idx} className="text-[11px] leading-tight flex items-center justify-between text-purple-900">
                            <div>
                              <span>• {t.testName}</span>
                              <span className="text-[9px] text-slate-500 block italic">{t.clinicalNote}</span>
                            </div>
                            <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded">
                              {t.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Doctor Signature */}
                    <div className="pt-2 flex items-end justify-between border-t border-slate-200 font-sans text-[10px] text-slate-500">
                      <div>
                        <span>Advised next review in 4 weeks. Report if any warning signs.</span>
                      </div>
                      <div className="text-right">
                        <div className="font-serif italic text-sm text-slate-800 font-bold">Dr. Anita Rao</div>
                        <span className="text-[9px] text-slate-400">Consulting Obstetrician</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scan Trigger Bar */}
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 z-10 w-full max-w-lg justify-between bg-slate-800/80 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-300 text-xs">
                    <QrCode className="w-4 h-4 text-teal-400" />
                    <span>Prescription Barcode: <strong>RX-{selectedPatient?.opdId.slice(-4)}</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartScan}
                    disabled={isScanningAnimation}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    {isScanningAnimation ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>OCR Scanning ({scanProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>SCAN & DIGITIZE RX (AUTO-OCR)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: REVIEW EXTRACTED RX & CONFIGURE PHARMACY + LAB LOOPS */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              {/* Extraction Alert Banner */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between text-emerald-900">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs">Prescription Digitized Successfully</h4>
                    <p className="text-[11px] text-emerald-800">
                      Extracted <strong>{extractedMedicines.length} Medicines</strong> and <strong>{extractedLabTests.length} Diagnostic Tests</strong> for {selectedPatient?.name}.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('scan')}
                  className="px-2.5 py-1 text-[11px] text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                >
                  Rescan Rx
                </button>
              </div>

              {/* LOOP 1: PHARMACY REFERRAL FOR MEDICINES */}
              <div className="bg-white rounded-xl border border-teal-200 shadow-xs overflow-hidden">
                <div className="bg-teal-50/80 px-4 py-3 border-b border-teal-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-teal-700 text-white flex items-center justify-center">
                      <Pill className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-teal-950">
                        LOOP PART 1: REFER TO PHARMACY FOR MEDICINES (Rx)
                      </h3>
                      <p className="text-[11px] text-teal-700">
                        Dispatches prescription to pharmacy queue & generates patient pickup token.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 font-bold text-teal-900 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={referToPharmacy}
                      onChange={(e) => setReferToPharmacy(e.target.checked)}
                      className="w-4 h-4 text-teal-700 rounded border-teal-300 focus:ring-teal-600"
                    />
                    <span>Refer to Pharmacy</span>
                  </label>
                </div>

                {referToPharmacy && (
                  <div className="p-4 space-y-4">
                    {/* Medicines List Table */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                          Prescribed Medicines ({extractedMedicines.length})
                        </span>
                        <button
                          type="button"
                          onClick={handleAddMedicine}
                          className="inline-flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-900 font-bold cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Medicine</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {extractedMedicines.map((med, idx) => (
                          <div 
                            key={med.id || idx}
                            className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
                          >
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={med.medicineName}
                                  onChange={(e) => handleUpdateMedicine(idx, 'medicineName', e.target.value)}
                                  className="font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded text-xs w-full max-w-sm"
                                  placeholder="Medicine name"
                                />
                                {med.isJanAushadhiAvailable && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                                    Jan Aushadhi Generic
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                                <div>
                                  <label className="text-[9px] text-slate-400 block font-semibold">Dosage</label>
                                  <input
                                    type="text"
                                    value={med.dosage}
                                    onChange={(e) => handleUpdateMedicine(idx, 'dosage', e.target.value)}
                                    className="w-full bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] text-slate-400 block font-semibold">Frequency</label>
                                  <input
                                    type="text"
                                    value={med.frequency}
                                    onChange={(e) => handleUpdateMedicine(idx, 'frequency', e.target.value)}
                                    className="w-full bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] text-slate-400 block font-semibold">Timing</label>
                                  <input
                                    type="text"
                                    value={med.timing}
                                    onChange={(e) => handleUpdateMedicine(idx, 'timing', e.target.value)}
                                    className="w-full bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] text-slate-400 block font-semibold">Duration</label>
                                  <input
                                    type="text"
                                    value={med.duration}
                                    onChange={(e) => handleUpdateMedicine(idx, 'duration', e.target.value)}
                                    className="w-full bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px]"
                                  />
                                </div>
                              </div>

                              {med.instructions && (
                                <p className="text-[10px] text-slate-500 italic">
                                  Note: {med.instructions}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveMedicine(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded transition self-end md:self-center cursor-pointer"
                              title="Delete medicine"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pharmacy Referral Partner Selection */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                        Select Target Pharmacy Partner
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {PHARMACY_PARTNERS.map(pharm => (
                          <div
                            key={pharm.id}
                            onClick={() => setSelectedPharmacyId(pharm.id)}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                              selectedPharmacyId === pharm.id
                                ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Building2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                              selectedPharmacyId === pharm.id ? 'text-teal-700' : 'text-slate-400'
                            }`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-xs text-slate-900">{pharm.name}</h4>
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${pharm.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                                  {pharm.type}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5">{pharm.counterLocation}</p>
                              <p className="text-[10px] text-teal-800 font-semibold mt-1">{pharm.discountOffer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* LOOP 2: LABORATORY REFERRAL FOR TESTS AS NEEDED */}
              <div className="bg-white rounded-xl border border-purple-200 shadow-xs overflow-hidden">
                <div className="bg-purple-50/80 px-4 py-3 border-b border-purple-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-purple-700 text-white flex items-center justify-center">
                      <TestTubes className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-purple-950">
                        LOOP PART 2: REFER TO LAB FOR TESTS AS NEEDED
                      </h3>
                      <p className="text-[11px] text-purple-700">
                        Automatically links investigations to OPD visit, updates queue, and instructs patient.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 font-bold text-purple-900 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={referToLab}
                      onChange={(e) => setReferToLab(e.target.checked)}
                      className="w-4 h-4 text-purple-700 rounded border-purple-300 focus:ring-purple-600"
                    />
                    <span>Refer to Lab</span>
                  </label>
                </div>

                {referToLab && (
                  <div className="p-4 space-y-3">
                    {extractedLabTests.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        No laboratory tests detected in prescription. You can add one below.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {extractedLabTests.map((t, idx) => (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition ${
                              t.selected 
                                ? 'bg-purple-50/50 border-purple-300' 
                                : 'bg-slate-50 border-slate-200 opacity-60'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <input
                                type="checkbox"
                                checked={t.selected}
                                onChange={() => handleToggleLabTest(idx)}
                                className="w-4 h-4 mt-0.5 text-purple-700 rounded border-purple-300 focus:ring-purple-600 cursor-pointer"
                              />
                              <div>
                                <h4 className="font-extrabold text-xs text-slate-900">{t.testName}</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">{t.clinicalNote}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={t.priority}
                                onChange={(e) => {
                                  const updated = [...extractedLabTests];
                                  updated[idx].priority = e.target.value as any;
                                  setExtractedLabTests(updated);
                                }}
                                className="px-2 py-1 bg-white border border-purple-200 text-purple-900 font-bold rounded text-[10px]"
                              >
                                <option value="Routine">Routine</option>
                                <option value="Urgent">Urgent</option>
                              </select>

                              <select
                                value={t.labId}
                                onChange={(e) => {
                                  const updated = [...extractedLabTests];
                                  updated[idx].labId = e.target.value;
                                  setExtractedLabTests(updated);
                                }}
                                className="px-2 py-1 bg-white border border-purple-200 text-slate-800 font-medium rounded text-[10px]"
                              >
                                {REFERRAL_LAB_OPTIONS.map(l => (
                                  <option key={l.id} value={l.id}>{l.name} ({l.turnaroundTime})</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Predefined quick add investigation */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Quick Add Test:</span>
                      {PREDEFINED_INVESTIGATIONS.slice(0, 5).map(inv => (
                        <button
                          key={inv.id}
                          type="button"
                          onClick={() => handleAddLabInvestigation(inv.name)}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-purple-100 text-purple-900 border border-slate-200 rounded font-semibold text-[10px] cursor-pointer"
                        >
                          + {inv.name.split('(')[0].trim()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* WHATSAPP LOOP PREVIEW */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                    <span>WhatsApp Patient Loop Notification Preview</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono">To: {selectedPatient?.mobile}</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200 text-slate-800 leading-relaxed text-[11px] whitespace-pre-line shadow-2xs font-sans">
                  {`Hello ${selectedPatient?.name},\nYour doctor prescription from Dr. Anita Rao has been processed at the Reception Desk:\n\n${referToPharmacy ? `💊 PHARMACY REFERRAL:\n• Counter: ${selectedPharmacy.name} (${selectedPharmacy.counterLocation})\n• Pickup Token: #RX-${selectedPatient?.tokenNumber + 100}\n• Medicines: ${extractedMedicines.map(m => m.medicineName).join(', ')}\n• Scheme: ${selectedPharmacy.discountOffer}` : ''}\n\n${referToLab && extractedLabTests.filter(t => t.selected).length > 0 ? `🔬 LABORATORY INVESTIGATIONS:\n${extractedLabTests.filter(t => t.selected).map(t => `• ${t.testName} (Room 8 Central Lab)`).join('\n')}\nPlease proceed to the Lab desk with your Token #${selectedPatient?.tokenNumber}.` : ''}\n\nPlease take medicines regularly as advised.`}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & LOOP COMPLETION CONFIRMATION */}
          {activeTab === 'success' && (
            <div className="py-6 px-4 text-center space-y-5 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Care Loop Successfully Completed!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Doctor prescription scanned and processed for <strong>{selectedPatient?.name}</strong>.
                </p>
              </div>

              {/* Loop summary tokens card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-3 text-xs">
                {completedOrder && (
                  <div className="p-3 bg-white rounded-lg border border-teal-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-teal-800 font-bold block uppercase">Pharmacy Referral Active</span>
                      <strong className="text-sm font-extrabold text-slate-900">Token #{completedOrder.tokenNumber}</strong>
                      <p className="text-[11px] text-slate-500">{completedOrder.pharmacyName}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-teal-100 text-teal-900 rounded-md">
                      {completedOrder.status}
                    </span>
                  </div>
                )}

                {completedLabRefs.length > 0 && (
                  <div className="p-3 bg-white rounded-lg border border-purple-200 space-y-1.5">
                    <span className="text-[10px] text-purple-800 font-bold block uppercase">
                      Lab Referral(s) Linked ({completedLabRefs.length})
                    </span>
                    {completedLabRefs.map(ref => (
                      <div key={ref.id} className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">• {ref.testName}</span>
                        <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                          {ref.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px] pt-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>WhatsApp message dispatched to {selectedPatient?.mobile}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-xs transition cursor-pointer text-xs"
                >
                  Close & Return to Reception
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer text-xs"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {activeTab === 'scan' && (
              <button
                type="button"
                onClick={handleStartScan}
                disabled={isScanningAnimation}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 text-xs transition"
              >
                <span>PROCEED TO REVIEW & DIGITIZE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {activeTab === 'review' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('scan')}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer text-xs"
                >
                  Back to Scanner
                </button>

                <button
                  type="button"
                  onClick={handleExecuteLoop}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-2 text-xs transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>COMPLETE LOOP: REFER TO PHARMACY & LAB</span>
                </button>
              </>
            )}

            {activeTab === 'success' && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-emerald-700 text-white font-extrabold rounded-xl text-xs cursor-pointer"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
