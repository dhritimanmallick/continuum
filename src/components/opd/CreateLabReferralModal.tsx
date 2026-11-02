import React, { useState } from 'react';
import { 
  X, 
  TestTubes, 
  Search, 
  Building2, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Check, 
  ArrowRight,
  User,
  Activity
} from 'lucide-react';
import { OpdPatient, LabReferral } from '../../types';
import { opdStore } from '../../services/opdStore';

export interface PredefinedInvestigation {
  id: string;
  name: string;
  category: 'Haematology' | 'Biochemistry' | 'Antenatal & Serology' | 'Urinalysis & Cytology' | 'Ultrasound';
  code: string;
  common: boolean;
  sampleType: string;
  clinicalNote: string;
}

export const PREDEFINED_INVESTIGATIONS: PredefinedInvestigation[] = [
  // Haematology
  { id: 'inv-1', name: 'Complete Blood Count (CBC / Hb)', category: 'Haematology', code: 'HAEM-CBC', common: true, sampleType: 'Whole Blood (EDTA)', clinicalNote: 'Evaluate anaemia, platelets, and infection baseline' },
  { id: 'inv-2', name: 'Blood Grouping & Rh Typing', category: 'Haematology', code: 'HAEM-BGRH', common: true, sampleType: 'Whole Blood (EDTA)', clinicalNote: 'Mandatory antenatal booking test, identifies Rh incompatibility risk' },
  { id: 'inv-3', name: 'Serum Ferritin & Iron Studies', category: 'Haematology', code: 'HAEM-FERR', common: false, sampleType: 'Serum (Clot Activator)', clinicalNote: 'Investigate refractory iron-deficiency anaemia' },
  { id: 'inv-4', name: 'Peripheral Blood Smear', category: 'Haematology', code: 'HAEM-PBS', common: false, sampleType: 'Whole Blood Smear', clinicalNote: 'Morphology evaluation for microcytic or dimorphic anaemia' },

  // Biochemistry & Glucose
  { id: 'inv-5', name: 'Oral Glucose Tolerance Test (OGTT 75g - 2 Hr)', category: 'Biochemistry', code: 'BIO-OGTT', common: true, sampleType: 'Fluoride Plasma', clinicalNote: 'Standard DIPSI/FOGSI gestational diabetes screening (24–28 weeks)' },
  { id: 'inv-6', name: 'Blood Glucose (Fasting & Post-Prandial)', category: 'Biochemistry', code: 'BIO-FBS-PPBS', common: true, sampleType: 'Fluoride Plasma', clinicalNote: 'Routine glycemic monitoring' },
  { id: 'inv-7', name: 'Glycated Haemoglobin (HbA1c)', category: 'Biochemistry', code: 'BIO-HBA1C', common: false, sampleType: 'Whole Blood (EDTA)', clinicalNote: 'Three-month glycemic control assessment' },
  { id: 'inv-8', name: 'Thyroid Stimulating Hormone (TSH)', category: 'Biochemistry', code: 'BIO-TSH', common: true, sampleType: 'Serum', clinicalNote: 'Detect maternal subclinical hypothyroidism' },
  { id: 'inv-9', name: 'Liver Function Test (LFT)', category: 'Biochemistry', code: 'BIO-LFT', common: false, sampleType: 'Serum', clinicalNote: 'Screening for obstetric cholestasis or pre-eclampsia' },
  { id: 'inv-10', name: 'Kidney Function Test (KFT / Serum Creatinine)', category: 'Biochemistry', code: 'BIO-KFT', common: false, sampleType: 'Serum', clinicalNote: 'Renal clearance baseline' },

  // Antenatal & Serology
  { id: 'inv-11', name: 'Indirect Coombs Test (ICT / Rh Antibody Titre)', category: 'Antenatal & Serology', code: 'SERO-ICT', common: true, sampleType: 'Serum', clinicalNote: 'Mandatory surveillance for Rh Negative mothers at 28 weeks' },
  { id: 'inv-12', name: 'Dual Marker First Trimester Screening', category: 'Antenatal & Serology', code: 'SERO-DUAL', common: false, sampleType: 'Serum', clinicalNote: 'Aneuploidy screening with NT scan (11–13+6 weeks)' },
  { id: 'inv-13', name: 'Quadruple Marker Second Trimester Screen', category: 'Antenatal & Serology', code: 'SERO-QUAD', common: false, sampleType: 'Serum', clinicalNote: 'Down syndrome and neural tube defect screening (15–20 weeks)' },
  { id: 'inv-14', name: 'HBsAg (Hepatitis B Surface Antigen)', category: 'Antenatal & Serology', code: 'SERO-HBSAG', common: true, sampleType: 'Serum', clinicalNote: 'Prevents vertical transmission of Hepatitis B at birth' },
  { id: 'inv-15', name: 'HIV 1 & 2 Rapid Antibody Screen', category: 'Antenatal & Serology', code: 'SERO-HIV', common: true, sampleType: 'Serum / Whole Blood', clinicalNote: 'Prevention of mother-to-child transmission protocol' },
  { id: 'inv-16', name: 'VDRL / Syphilis Rapid Treponemal Screen', category: 'Antenatal & Serology', code: 'SERO-VDRL', common: true, sampleType: 'Serum', clinicalNote: 'Early detection and treatment of congenital syphilis' },

  // Urinalysis & Cytology
  { id: 'inv-17', name: 'Urine Routine & Microscopy (Urine R/M)', category: 'Urinalysis & Cytology', code: 'URI-RM', common: true, sampleType: 'Midstream Urine', clinicalNote: 'Screen for asymptomatic bacteriuria and urinary tract infection' },
  { id: 'inv-18', name: 'Urine Albumin & Sugar Dipstick', category: 'Urinalysis & Cytology', code: 'URI-ALB', common: true, sampleType: 'Spot Urine', clinicalNote: 'Rapid screening for pre-eclampsia proteinuria and glucosuria' },
  { id: 'inv-19', name: 'Pap Smear Cytology (Liquid Based / Conventional)', category: 'Urinalysis & Cytology', code: 'CYTO-PAP', common: false, sampleType: 'Cervical Cytology', clinicalNote: 'Cervical cancer screening during booking or gynaecological OPD' },

  // Ultrasound & Imaging
  { id: 'inv-20', name: 'Obstetric Ultrasound — Dating & Viability Scan', category: 'Ultrasound', code: 'USG-DATING', common: true, sampleType: 'Ultrasound Scan', clinicalNote: 'Confirms intrauterine pregnancy and accurate gestational age (6–10w)' },
  { id: 'inv-21', name: 'Obstetric Ultrasound — TIFFA / Anomaly Scan', category: 'Ultrasound', code: 'USG-TIFFA', common: true, sampleType: 'Ultrasound Scan', clinicalNote: 'Targeted Imaging for Fetal Anomalies (18–20 weeks)' },
  { id: 'inv-22', name: 'Obstetric Ultrasound — Growth & Doppler Scan', category: 'Ultrasound', code: 'USG-GROWTH', common: true, sampleType: 'Ultrasound Scan', clinicalNote: 'Evaluates foetal biometry, amniotic fluid (AFI), and placental blood flow' }
];

export interface ReferralLabOption {
  id: string;
  name: string;
  type: 'In-house' | 'Integrated Partner' | 'External Reference';
  location: string;
  turnaroundTime: string;
  badgeColor: string;
  recommendedFor: string;
}

export const REFERRAL_LAB_OPTIONS: ReferralLabOption[] = [
  {
    id: 'lab-inhouse',
    name: 'In-house Central Pathology & Biochemistry Lab',
    type: 'In-house',
    location: 'Hospital OPD Building — Room 8 (Ground Floor)',
    turnaroundTime: '30–45 mins',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-200',
    recommendedFor: 'Routine CBC, Blood Glucose/OGTT, Urine R/M, Rapid Serology'
  },
  {
    id: 'lab-vyuhaa-ref',
    name: 'Vyuhaa Med Diagnostics & Reference Lab',
    type: 'Integrated Partner',
    location: 'Vyuhaa Hub — Diagnostic Block B, Hubballi',
    turnaroundTime: '2 hours',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
    recommendedFor: 'Complete Antenatal Profiles, HbA1c, Hormone Panels & Ferritin'
  },
  {
    id: 'lab-apex-imaging',
    name: 'Apex Advanced Imaging & Ultrasound Hub',
    type: 'Integrated Partner',
    location: 'Radiology Suite — 2nd Floor (Opposite Antenatal Ward)',
    turnaroundTime: 'Same day (With Doctor Review)',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
    recommendedFor: 'Dating Scan, TIFFA Anomaly Scan, Foetal Doppler & Growth'
  },
  {
    id: 'lab-district-ref',
    name: 'District Hospital Reference Laboratory',
    type: 'External Reference',
    location: 'Civil Hospital Campus, Dharwad Reference Centre',
    turnaroundTime: '4–6 hours',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    recommendedFor: 'Public Health Registry & Subsidized Welfare Screenings'
  },
  {
    id: 'lab-metropolis',
    name: 'Metropolis Healthcare Partner Lab',
    type: 'External Reference',
    location: 'Metropolis Hubballi Central Processing Unit',
    turnaroundTime: '24 hours',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    recommendedFor: 'Dual Marker, Quadruple Marker & Specialized Genetics'
  }
];

interface CreateLabReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPatient?: OpdPatient | null;
  requestedByDefault?: string;
  sourceContext: 'DOCTOR' | 'RECEPTION';
  onReferralCreated?: (referral: LabReferral) => void;
}

export const CreateLabReferralModal: React.FC<CreateLabReferralModalProps> = ({
  isOpen,
  onClose,
  initialPatient,
  requestedByDefault = 'Dr. Anita Rao',
  sourceContext,
  onReferralCreated
}) => {
  const allPatients = opdStore.patients;
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatient?.id || allPatients[0]?.id || ''
  );

  const selectedPatient = allPatients.find(p => p.id === selectedPatientId) || initialPatient || allPatients[0];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestName, setSelectedTestName] = useState('Oral Glucose Tolerance Test (OGTT 75g - 2 Hr)');
  const [customTestInput, setCustomTestInput] = useState('');
  const [selectedLabId, setSelectedLabId] = useState('lab-inhouse');
  const [customLabName, setCustomLabName] = useState('');
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'Stat'>('Routine');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReferral, setSuccessReferral] = useState<LabReferral | null>(null);

  if (!isOpen) return null;

  // Filter predefined investigations
  const filteredInvestigations = PREDEFINED_INVESTIGATIONS.filter(inv => {
    if (selectedCategory !== 'All' && inv.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inv.name.toLowerCase().includes(q) ||
        inv.code.toLowerCase().includes(q) ||
        inv.clinicalNote.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedLab = REFERRAL_LAB_OPTIONS.find(l => l.id === selectedLabId);
  const effectiveLabName = selectedLabId === 'custom' ? (customLabName || 'Custom Partner Laboratory') : (selectedLab?.name || 'In-house Central Pathology Lab (Room 8)');
  const effectiveTestName = customTestInput.trim() ? customTestInput.trim() : selectedTestName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !effectiveTestName) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const referral = opdStore.createLabReferral({
        patientId: selectedPatient.id,
        testName: effectiveTestName,
        labName: effectiveLabName,
        priority,
        notes: clinicalNotes || (selectedPatient.isPregnant ? `Gestational Age: ${selectedPatient.pregnancyDetails?.gestationalAgeWeeks}wks. Indication: Routine follow-up` : selectedPatient.visitReason),
        requestedBy: requestedByDefault
      });

      setIsSubmitting(false);
      setSuccessReferral(referral);

      if (onReferralCreated) {
        onReferralCreated(referral);
      }
    }, 450);
  };

  const handleCloseAndReset = () => {
    setSuccessReferral(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <TestTubes className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">Create Laboratory Referral</h2>
                <span className="text-[10px] uppercase font-bold bg-purple-400/20 text-purple-200 border border-purple-300/30 px-2 py-0.2 rounded-full">
                  {sourceContext === 'DOCTOR' ? 'Doctor Prescription' : 'Reception Routing'}
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Link investigation to current OPD visit, select designated laboratory, and dispatch WhatsApp instructions.
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseAndReset}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {successReferral ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-4 border-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Lab Referral Successfully Created!</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Investigation <strong>{successReferral.testName}</strong> has been routed to <strong>{effectiveLabName}</strong> for OPD Visit <strong>{selectedPatient?.opdId}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-semibold text-slate-700">
                <span>Referral Token / ID:</span>
                <span className="font-mono text-purple-900 font-bold">{successReferral.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-semibold text-slate-700">
                <span>Patient:</span>
                <span className="text-slate-900 font-bold">{selectedPatient?.name} (Token #{selectedPatient?.tokenNumber})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-semibold text-slate-700">
                <span>OPD Visit ID:</span>
                <span className="font-mono font-bold text-teal-800">{selectedPatient?.opdId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-semibold text-slate-700">
                <span>Designated Lab:</span>
                <span className="text-slate-900 font-bold">{effectiveLabName}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold pt-0.5">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Alert:</span>
                </span>
                <span>Dispatched to {selectedPatient?.mobile}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCloseAndReset}
                className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Return to OPD Workspace
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
            {/* SECTION 1: Linked Active OPD Visit */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-700" />
                  <span>Linked Active OPD Visit</span>
                </span>

                {/* Patient Selector if multiple patients in queue */}
                {allPatients.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-semibold">Change Patient:</span>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="p-1 border border-slate-200 rounded bg-white font-bold text-[11px] text-slate-800"
                    >
                      {allPatients.map(p => (
                        <option key={p.id} value={p.id}>
                          Token #{p.tokenNumber} — {p.name} ({p.opdId})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-slate-700 bg-white p-3 rounded-lg border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">PATIENT</span>
                    <strong className="text-slate-900 text-xs block truncate">{selectedPatient.name}</strong>
                    <span className="text-[10px] text-slate-500">{selectedPatient.age} yrs • {selectedPatient.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">OPD VISIT ID</span>
                    <strong className="text-teal-900 font-mono text-xs block">{selectedPatient.opdId}</strong>
                    <span className="text-[10px] font-bold text-amber-800">Token #{selectedPatient.tokenNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">GESTATION / VISIT</span>
                    <strong className="text-slate-900 text-xs block">
                      {selectedPatient.isPregnant ? `${selectedPatient.pregnancyDetails?.gestationalAgeWeeks}wks pregnant` : selectedPatient.visitType}
                    </strong>
                    <span className="text-[10px] text-slate-500 truncate block">{selectedPatient.visitReason}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">ASSIGNED DOCTOR</span>
                    <strong className="text-slate-900 text-xs block">{selectedPatient.assignedDoctor || 'Dr. Anita Rao'}</strong>
                    <span className="text-[10px] text-purple-700 font-semibold">Room 4 OPD</span>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: Predefined Investigation Selector */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                  <span>1. Select Predefined Investigation</span>
                </label>
                <span className="text-[11px] text-slate-500">Pick from common clinical tests or type below</span>
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-semibold border-b border-slate-200">
                {['All', 'Haematology', 'Biochemistry', 'Antenatal & Serology', 'Urinalysis & Cytology', 'Ultrasound'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-purple-700 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search investigations (e.g., CBC, Glucose, OGTT, TSH, Anomaly scan)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              {/* Quick-Pick Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredInvestigations.map(inv => {
                  const isSelected = selectedTestName === inv.name && !customTestInput;
                  return (
                    <button
                      key={inv.id}
                      type="button"
                      onClick={() => {
                        setSelectedTestName(inv.name);
                        setCustomTestInput('');
                      }}
                      className={`text-left p-2.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500'
                          : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-slate-900 font-bold text-xs truncate block">{inv.name}</strong>
                          {inv.common && (
                            <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1 rounded shrink-0">Common</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{inv.clinicalNote}</p>
                        <span className="text-[9px] font-mono text-purple-700 block mt-1">Sample: {inv.sampleType}</span>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-purple-700 border-purple-700 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Or type custom investigation */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 block mb-1 font-semibold">Or enter custom / specialized test name:</span>
                <input
                  type="text"
                  placeholder="e.g. TORCH IgG Avidity, Serum Electrophoresis, Fibronectin"
                  value={customTestInput}
                  onChange={(e) => setCustomTestInput(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* SECTION 3: Select Specific Lab for Referral Business */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-700" />
                  <span>2. Select Referral Business Laboratory</span>
                </label>
                <span className="text-[11px] text-slate-500 font-semibold">Designated processing unit</span>
              </div>

              <div className="space-y-2">
                {REFERRAL_LAB_OPTIONS.map(lab => {
                  const isSelected = selectedLabId === lab.id;
                  return (
                    <div
                      key={lab.id}
                      onClick={() => setSelectedLabId(lab.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-purple-50/80 border-purple-500 ring-1 ring-purple-500'
                          : 'bg-white border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-bold text-xs">{lab.name}</strong>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${lab.badgeColor}`}>
                            {lab.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{lab.location}</p>
                        <p className="text-[10px] text-slate-400">Best for: {lab.recommendedFor}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 pt-1 sm:pt-0">
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>TAT: {lab.turnaroundTime}</span>
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-purple-700 border-purple-700 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Custom Laboratory Option */}
                <div
                  onClick={() => setSelectedLabId('custom')}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    selectedLabId === 'custom'
                      ? 'bg-purple-50/80 border-purple-500 ring-1 ring-purple-500'
                      : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Other / External Partner Diagnostic Center</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedLabId === 'custom' ? 'bg-purple-700 border-purple-700 text-white' : 'border-slate-300'
                    }`}>
                      {selectedLabId === 'custom' && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                  {selectedLabId === 'custom' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Enter partner laboratory name and location..."
                        value={customLabName}
                        onChange={(e) => setCustomLabName(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 4: Priority & Clinical Indication */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Referral Priority</label>
                <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                  {(['Routine', 'Urgent', 'Stat'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 text-center rounded-md font-bold text-xs transition cursor-pointer ${
                        priority === p
                          ? p === 'Stat'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : p === 'Urgent'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-teal-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Clinical Indication / Reason for Investigation</label>
                <input
                  type="text"
                  placeholder="e.g. 28 weeks routine screening for gestational diabetes, mild anaemia surveillance"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* SECTION 5: WhatsApp Notification Live Preview */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-emerald-950 font-bold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Automated WhatsApp Message to Patient</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.2 rounded border border-emerald-200 font-mono">
                  {selectedPatient?.mobile}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 italic bg-white p-2.5 rounded-lg border border-emerald-100 leading-relaxed font-sans whitespace-pre-line">
                &ldquo;Hello {selectedPatient?.name}, a laboratory investigation has been ordered for your OPD Visit ({selectedPatient?.opdId}, Token #{selectedPatient?.tokenNumber}):
                {'\n'}• Test: <strong>{effectiveTestName}</strong>
                {'\n'}• Referral Lab: <strong>{effectiveLabName}</strong>
                {'\n'}• Priority: <strong>{priority}</strong>
                {'\n'}Please present your Token #{selectedPatient?.tokenNumber} at the laboratory desk.&rdquo;
              </p>
            </div>

            {/* Actions footer */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !effectiveTestName}
                className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Routing Referral...</span>
                  </>
                ) : (
                  <>
                    <TestTubes className="w-4 h-4" />
                    <span>Create & Link Lab Referral</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
