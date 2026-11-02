import React, { useState } from 'react';
import { 
  X, 
  Pill, 
  Printer, 
  Share2, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  Send, 
  Building2, 
  Clock, 
  CheckCircle2, 
  QrCode, 
  FileText, 
  AlertCircle, 
  TestTubes, 
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { 
  OpdPatient, 
  PrescriptionMedicineItem, 
  PharmacyOrder, 
  PharmacyPartner,
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

interface DoctorPrescriptionModuleProps {
  isOpen: boolean;
  onClose: () => void;
  initialPatient?: OpdPatient | null;
  onPrescriptionSaved?: (medicines: PrescriptionMedicineItem[], order?: PharmacyOrder) => void;
}

// Curated Hospital Formulary Presets for quick clinical entry
interface FormularyPreset {
  name: string;
  category: string;
  item: Omit<PrescriptionMedicineItem, 'id'>;
}

const COMMON_FORMULARY_ITEMS: FormularyPreset[] = [
  {
    name: 'Tab. Iron & Folic Acid 100mg (IFA)',
    category: 'Haematinics',
    item: {
      medicineName: 'Tab. Iron & Folic Acid 100mg (IFA)',
      dosage: '100mg',
      frequency: 'Once daily (OD)',
      timing: 'After lunch with water',
      duration: '30 days',
      quantity: 30,
      instructions: 'Do not take with tea, coffee, or milk. Avoid taking with calcium.',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'Ferrous Ascorbate 100mg + Folic Acid 1.5mg'
    }
  },
  {
    name: 'Tab. Calcium Carbonate 500mg + Vit D3',
    category: 'Supplements',
    item: {
      medicineName: 'Tab. Calcium Carbonate 500mg + Vit D3',
      dosage: '500mg',
      frequency: 'Twice daily (BD)',
      timing: 'After breakfast and after dinner',
      duration: '30 days',
      quantity: 60,
      instructions: 'Keep 2 hours gap from Iron tablet for optimal absorption.',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'Calcium 500mg + Cholecalciferol 250 IU'
    }
  },
  {
    name: 'Cap. Vitamin D3 60,000 IU',
    category: 'Supplements',
    item: {
      medicineName: 'Cap. Vitamin D3 60,000 IU',
      dosage: '60,000 IU',
      frequency: 'Once weekly (QW)',
      timing: 'Every Sunday with milk',
      duration: '4 weeks',
      quantity: 4,
      instructions: 'Take with warm milk for fat-soluble absorption.',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'Cholecalciferol 60k Capsule'
    }
  },
  {
    name: 'Tab. Folic Acid 5mg',
    category: 'Haematinics',
    item: {
      medicineName: 'Tab. Folic Acid 5mg',
      dosage: '5mg',
      frequency: 'Once daily (OD)',
      timing: 'Morning after food',
      duration: '30 days',
      quantity: 30,
      instructions: 'Neural tube defect prevention prophylaxis.',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'Folic Acid Tab 5mg'
    }
  },
  {
    name: 'Cap. Natural Micronized Progesterone 200mg',
    category: 'Hormonal Support',
    item: {
      medicineName: 'Cap. Natural Micronized Progesterone 200mg',
      dosage: '200mg',
      frequency: 'Once daily at bedtime (HS)',
      timing: 'At bedtime with water',
      duration: '15 days',
      quantity: 15,
      instructions: 'Luteal phase support for pregnancy maintenance.',
      isJanAushadhiAvailable: false,
      genericEquivalent: 'Progesterone 200mg Softgel'
    }
  },
  {
    name: 'Tab. Paracetamol 650mg',
    category: 'Analgesics',
    item: {
      medicineName: 'Tab. Paracetamol 650mg',
      dosage: '650mg',
      frequency: 'SOS (As needed)',
      timing: 'After meals with water',
      duration: '5 days',
      quantity: 10,
      instructions: 'Take only in case of mild fever, headache, or body ache (Max 3 tabs/day).',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'Paracetamol Tab 650mg'
    }
  },
  {
    name: 'Syp. Antacid Gel (Aluminium + Magnesium + Simethicone)',
    category: 'Gastrointestinal',
    item: {
      medicineName: 'Syp. Antacid Suspension',
      dosage: '10ml',
      frequency: 'Twice daily after food / SOS',
      timing: '1 hour after meals',
      duration: '10 days',
      quantity: 1,
      instructions: 'Relief of pregnancy heartburn, pyrosis, and reflux.',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'Magaldrate + Simethicone Oral Gel'
    }
  },
  {
    name: 'Cap. Amoxicillin 500mg',
    category: 'Antibiotics',
    item: {
      medicineName: 'Cap. Amoxicillin 500mg',
      dosage: '500mg',
      frequency: 'Thrice daily (TDS)',
      timing: 'Every 8 hours after food',
      duration: '5 days',
      quantity: 15,
      instructions: 'Complete full 5-day course for asymptomatic bacteriuria / RTI.',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'Amoxicillin Cap 500mg'
    }
  }
];

export const DoctorPrescriptionModule: React.FC<DoctorPrescriptionModuleProps> = ({
  isOpen,
  onClose,
  initialPatient,
  onPrescriptionSaved
}) => {
  const allPatients = opdStore.patients;
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatient?.id || allPatients[0]?.id || ''
  );

  const selectedPatient = allPatients.find(p => p.id === selectedPatientId) || initialPatient || allPatients[0];

  // Active module view
  const [activeTab, setActiveTab] = useState<'editor' | 'printable_rx' | 'referral_link'>('editor');

  // Medicines list
  const [medicines, setMedicines] = useState<PrescriptionMedicineItem[]>(() => {
    // If patient already has prescribed medicines in store, prepopulate
    if (selectedPatient?.pharmacyOrders && selectedPatient.pharmacyOrders.length > 0) {
      return [...selectedPatient.pharmacyOrders[0].medicines];
    }
    // Default standard antenatal prescription
    return [
      {
        id: 'med-1',
        medicineName: 'Tab. Iron & Folic Acid 100mg (IFA)',
        dosage: '100mg',
        frequency: 'Once daily (OD)',
        timing: 'After lunch with water',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take with lemon water or plain water. Avoid taking with tea, milk, or calcium.',
        isJanAushadhiAvailable: true,
        genericEquivalent: 'Ferrous Ascorbate 100mg + Folic Acid 1.5mg'
      },
      {
        id: 'med-2',
        medicineName: 'Tab. Calcium Carbonate 500mg + Vit D3',
        dosage: '500mg',
        frequency: 'Twice daily (BD)',
        timing: 'After breakfast and after dinner',
        duration: '30 days',
        quantity: 60,
        instructions: 'Take 2 hours apart from Iron tablet for optimal absorption.',
        isJanAushadhiAvailable: true,
        genericEquivalent: 'Calcium 500mg + Cholecalciferol 250 IU'
      }
    ];
  });

  // Doctor Clinical Impression & Advice Notes
  const [doctorNotes, setDoctorNotes] = useState<string>(
    selectedPatient?.doctorNotes || 'Routine antenatal surveillance. Foetal heart sounds regular (142 bpm). Prescriptions renewed for 30 days.'
  );

  // Advised Diagnostic tests to print on Rx
  const [selectedInvestigations, setSelectedInvestigations] = useState<string[]>([
    'Oral Glucose Tolerance Test (OGTT 75g - 2 Hr)',
    'Complete Blood Count (CBC / Hb)'
  ]);

  // Pharmacy Referral settings
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>('pharm-inhouse');
  const [createPharmacyLink, setCreatePharmacyLink] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [whatsAppDispatched, setWhatsAppDispatched] = useState<boolean>(false);

  // Generated order state
  const [activePharmacyOrder, setActivePharmacyOrder] = useState<PharmacyOrder | null>(() => {
    return selectedPatient?.pharmacyOrders?.[0] || null;
  });

  // Medicine manipulation
  const handleUpdateMedicine = (index: number, field: keyof PrescriptionMedicineItem, value: any) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleAddMedicine = () => {
    const newMed: PrescriptionMedicineItem = {
      id: `med-${Date.now()}`,
      medicineName: 'Tab. Vitamin B-Complex with Zinc',
      dosage: '1 tablet',
      frequency: 'Once daily (OD)',
      timing: 'After breakfast',
      duration: '30 days',
      quantity: 30,
      instructions: 'General nutritional supplementation.',
      isJanAushadhiAvailable: true,
      genericEquivalent: 'B-Complex + Zinc Tab'
    };
    setMedicines([...medicines, newMed]);
  };

  const handleAddFormularyPreset = (preset: FormularyPreset) => {
    if (medicines.some(m => m.medicineName.toLowerCase() === preset.item.medicineName.toLowerCase())) {
      return;
    }
    const newMed: PrescriptionMedicineItem = {
      id: `med-${Date.now()}`,
      ...preset.item
    };
    setMedicines([...medicines, newMed]);
  };

  const handleToggleInvestigation = (testName: string) => {
    if (selectedInvestigations.includes(testName)) {
      setSelectedInvestigations(selectedInvestigations.filter(t => t !== testName));
    } else {
      setSelectedInvestigations([...selectedInvestigations, testName]);
    }
  };

  // Generate & Save Prescription
  const handleSaveAndGenerate = () => {
    if (!selectedPatient) return;

    // 1. Update doctor notes and string prescriptions in store
    opdStore.saveConsultation({
      patientId: selectedPatient.id,
      doctorNotes,
      prescriptions: medicines.map(m => `${m.medicineName} (${m.dosage}) - ${m.frequency}`)
    });

    // 2. If pharmacy referral is enabled, create or update pharmacy order
    let order: PharmacyOrder | undefined = activePharmacyOrder || undefined;
    if (createPharmacyLink) {
      order = opdStore.createPharmacyReferral({
        patientId: selectedPatient.id,
        pharmacyId: selectedPharmacyId,
        medicines,
        scannedBy: 'Dr. Anita Rao (Direct Doctor Rx Studio)'
      });
      setActivePharmacyOrder(order);
    }

    if (onPrescriptionSaved) {
      onPrescriptionSaved(medicines, order);
    }

    setActiveTab('printable_rx');
  };

  // Copy Referral Link
  const referralLinkUrl = `https://continuum.health/rx/${activePharmacyOrder?.id || 'PHARM-DEMO'}?token=${activePharmacyOrder?.tokenNumber || 'RX-101'}&patient=${encodeURIComponent(selectedPatient?.name || '')}`;

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLinkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Trigger WhatsApp dispatch
  const handleDispatchWhatsAppLink = () => {
    if (!selectedPatient) return;
    const pharm = PHARMACY_PARTNERS.find(p => p.id === selectedPharmacyId) || PHARMACY_PARTNERS[0];
    
    opdStore.sendWhatsApp(
      selectedPatient.id,
      `Hello ${selectedPatient.name}, Dr. Anita Rao has generated your digital prescription and referred it to ${pharm.name}.\n\n💊 Digital Rx & Pharmacy Token: #${activePharmacyOrder?.tokenNumber || 'RX-101'}\n📍 Counter: ${pharm.counterLocation}\n🔗 Pharmacy Referral Link: ${referralLinkUrl}\n\nPrescribed Medicines:\n${medicines.map(m => `• ${m.medicineName} (${m.dosage}) - ${m.frequency}, ${m.timing} (${m.duration})`).join('\n')}\n\nPlease present Token #${activePharmacyOrder?.tokenNumber || 'RX-101'} at the counter.`
    );

    setWhatsAppDispatched(true);
    setTimeout(() => setWhatsAppDispatched(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const selectedPharmacy = PHARMACY_PARTNERS.find(p => p.id === selectedPharmacyId) || PHARMACY_PARTNERS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        {/* Top Header Bar (Hidden in Print) */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm sm:text-base tracking-tight">
                  DOCTOR PRESCRIPTION MODULE (Rx)
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-200 border border-teal-400/30 px-2 py-0.2 rounded-full">
                  Medication & Fulfillment Loop
                </span>
              </div>
              <p className="text-[11px] text-teal-100/80">
                Dr. Anita Rao, MBBS, MS (OBG) • Record Medicines • Generate Printable Rx • Pharmacy Referral Link
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

        {/* Tab Switcher & Patient Indicator (Hidden in Print) */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs print:hidden">
          <div className="flex items-center gap-2 sm:gap-4 font-bold">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-teal-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>1. Record Medications</span>
            </button>

            <button
              onClick={() => setActiveTab('printable_rx')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'printable_rx'
                  ? 'bg-teal-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Printable Prescription Slip</span>
            </button>

            <button
              onClick={() => setActiveTab('referral_link')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'referral_link'
                  ? 'bg-teal-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>3. Pharmacy Referral Link & Loop</span>
            </button>
          </div>

          {/* Patient Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase hidden sm:inline">Patient:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-300 font-bold text-slate-800 rounded-lg text-xs"
            >
              {allPatients.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.tokenNumber} — {p.name} ({p.age}y)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700 print:p-0 print:overflow-visible">
          {/* TAB 1: RECORD MEDICATIONS & DIAGNOSTICS */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* Patient Banner */}
              <div className="bg-teal-50/70 p-3.5 rounded-xl border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                    #{selectedPatient?.tokenNumber}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{selectedPatient?.name}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      OPD: {selectedPatient?.opdId} • ABHA: {selectedPatient?.abhaId} • Mobile: {selectedPatient?.mobile}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-700 flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 bg-white rounded border border-teal-200 font-bold">
                    Age: {selectedPatient?.age} yrs
                  </span>
                  <span className="px-2 py-0.5 bg-white rounded border border-teal-200 font-bold text-teal-900">
                    {selectedPatient?.isPregnant ? `Gestation: ${selectedPatient.pregnancyDetails?.gestationalAgeWeeks}w` : selectedPatient?.visitType}
                  </span>
                  <span className="px-2 py-0.5 bg-white rounded border border-teal-200 font-bold">
                    BP: {selectedPatient?.vitals?.bp || '118/76'}
                  </span>
                </div>
              </div>

              {/* Quick Formulary Buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    <span>Quick Formulary Presets (Obstetric & General OPD)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Click to add to prescription</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {COMMON_FORMULARY_ITEMS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddFormularyPreset(item)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-teal-700" />
                      <span>{item.name.split('(')[0].trim()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Structured Medicines Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-teal-700" />
                    <span>Prescribed Medications ({medicines.length})</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-teal-700 text-white rounded-lg font-bold text-xs shadow-2xs hover:bg-teal-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Custom Medicine</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {medicines.map((med, idx) => (
                    <div 
                      key={med.id || idx}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5 hover:border-teal-300 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={med.medicineName}
                            onChange={(e) => handleUpdateMedicine(idx, 'medicineName', e.target.value)}
                            className="font-extrabold text-slate-900 text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-teal-600 w-full max-w-md"
                            placeholder="Medicine name & strength (e.g. Tab. Iron & Folic Acid 100mg)"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded cursor-pointer font-bold">
                            <input
                              type="checkbox"
                              checked={med.isJanAushadhiAvailable}
                              onChange={(e) => handleUpdateMedicine(idx, 'isJanAushadhiAvailable', e.target.checked)}
                              className="w-3 h-3 text-emerald-700 rounded"
                            />
                            <span>PM Jan Aushadhi Generic</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                            title="Remove medicine"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Fields grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Dosage</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleUpdateMedicine(idx, 'dosage', e.target.value)}
                            placeholder="e.g. 100mg / 1 tab"
                            className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Frequency</label>
                          <select
                            value={med.frequency}
                            onChange={(e) => handleUpdateMedicine(idx, 'frequency', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-xs font-medium"
                          >
                            <option value="Once daily (OD)">Once daily (OD)</option>
                            <option value="Twice daily (BD)">Twice daily (BD)</option>
                            <option value="Thrice daily (TDS)">Thrice daily (TDS)</option>
                            <option value="Four times daily (QID)">Four times daily (QID)</option>
                            <option value="Once weekly (QW)">Once weekly (QW)</option>
                            <option value="SOS (As needed)">SOS (As needed)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Timing</label>
                          <select
                            value={med.timing}
                            onChange={(e) => handleUpdateMedicine(idx, 'timing', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-xs font-medium"
                          >
                            <option value="After meals with water">After meals with water</option>
                            <option value="Before food (Empty stomach)">Before food (Empty stomach)</option>
                            <option value="At bedtime (HS)">At bedtime (HS)</option>
                            <option value="After breakfast">After breakfast</option>
                            <option value="With milk">With milk</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Duration</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleUpdateMedicine(idx, 'duration', e.target.value)}
                            placeholder="e.g. 30 days"
                            className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Quantity (Units)</label>
                          <input
                            type="number"
                            value={med.quantity || 30}
                            onChange={(e) => handleUpdateMedicine(idx, 'quantity', Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-xs font-medium"
                          />
                        </div>
                      </div>

                      {/* Instructions note */}
                      <div>
                        <input
                          type="text"
                          value={med.instructions || ''}
                          onChange={(e) => handleUpdateMedicine(idx, 'instructions', e.target.value)}
                          placeholder="Special instructions (e.g. Avoid tea/coffee within 1 hour; take with citrus fruit)"
                          className="w-full text-[11px] bg-slate-50/70 border border-slate-200 px-2 py-1 rounded-md text-slate-700 italic"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advised Lab Investigations to link to prescription */}
              <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 uppercase tracking-wide text-xs flex items-center gap-1.5">
                    <TestTubes className="w-3.5 h-3.5 text-purple-700" />
                    <span>Advised Laboratory Diagnostics to Print on Prescription</span>
                  </span>
                  <span className="text-[10px] text-purple-700 font-semibold">Select relevant tests</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Oral Glucose Tolerance Test (OGTT 75g - 2 Hr)',
                    'Complete Blood Count (CBC / Hb)',
                    'Obstetric Ultrasound — Growth & Doppler Scan',
                    'Urine Routine & Albumin',
                    'Indirect Coombs Test (Rh antibody titre)',
                    'Thyroid Stimulating Hormone (TSH)'
                  ].map(test => {
                    const isChecked = selectedInvestigations.includes(test);
                    return (
                      <label 
                        key={test}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                          isChecked 
                            ? 'bg-purple-100/70 border-purple-300 font-bold text-purple-950' 
                            : 'bg-white border-purple-100 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleInvestigation(test)}
                          className="w-3.5 h-3.5 text-purple-700 rounded border-purple-300"
                        />
                        <span>{test}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Examination Notes */}
              <div>
                <label className="font-bold text-slate-800 block mb-1 uppercase tracking-wider text-xs">
                  Clinical Examination & Advice Notes (To appear on Prescription)
                </label>
                <textarea
                  rows={3}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Clinical notes, findings, danger sign counseling, next follow-up advice..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs leading-relaxed focus:bg-white"
                />
              </div>

              {/* Pharmacy Referral Partner Selection for Loop Completion */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-700" />
                    <span className="font-bold text-slate-900 text-xs">
                      PHARMACY REFERRAL & LOOP COMPLETION
                    </span>
                  </div>

                  <label className="flex items-center gap-1.5 text-teal-900 font-bold cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={createPharmacyLink}
                      onChange={(e) => setCreatePharmacyLink(e.target.checked)}
                      className="w-4 h-4 text-teal-700 rounded"
                    />
                    <span>Create Pharmacy Referral & Link</span>
                  </label>
                </div>

                {createPharmacyLink && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {PHARMACY_PARTNERS.map(pharm => (
                      <div
                        key={pharm.id}
                        onClick={() => setSelectedPharmacyId(pharm.id)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                          selectedPharmacyId === pharm.id
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Building2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                          selectedPharmacyId === pharm.id ? 'text-teal-700' : 'text-slate-400'
                        }`} />
                        <div>
                          <strong className="text-xs text-slate-900 block">{pharm.name}</strong>
                          <span className="text-[10px] text-slate-500 block">{pharm.counterLocation}</span>
                          <span className="text-[10px] text-teal-800 font-semibold block mt-0.5">{pharm.discountOffer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRINTABLE PRESCRIPTION SLIP */}
          {activeTab === 'printable_rx' && (
            <div className="space-y-4">
              {/* Top Action bar for Print & Share */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-teal-700" />
                  <span className="font-bold text-slate-800 text-xs">
                    Official Hospital OPD Prescription Ready
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('referral_link')}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-purple-700" />
                    <span>View Pharmacy Referral Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-lg text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>PRINT PRESCRIPTION</span>
                  </button>
                </div>
              </div>

              {/* THE AUTHENTIC PRINTABLE HOSPITAL PRESCRIPTION SHEET */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-slate-800 shadow-md max-w-2xl mx-auto font-sans print:border-none print:shadow-none print:p-0 print:max-w-none">
                {/* Hospital & Department Letterhead */}
                <div className="border-b-2 border-slate-800 pb-3 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-800 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
                      DH
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight">
                        DISTRICT HOSPITAL HUBBALLI
                      </h2>
                      <p className="text-xs font-bold text-teal-900 uppercase">
                        Department of Obstetrics & Gynaecology • Maternal & Child Health
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Civil Hospital Campus, Hubballi, Karnataka - 580020 • OPD Room 4
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded block">
                      OPD: {selectedPatient?.opdId}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                      Token #{selectedPatient?.tokenNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Date: 10-OCT-2026
                    </span>
                  </div>
                </div>

                {/* Doctor Credential Header */}
                <div className="py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-sm font-extrabold text-slate-900">Dr. Anita Rao</strong>
                    <span className="text-slate-600 ml-1.5 text-[11px]">MBBS, MS (OBG), FICOG</span>
                    <p className="text-[10px] text-slate-500">
                      Reg. No: KMC-58210 • Consultant Obstetrician & Gynaecologist
                    </p>
                  </div>

                  <div className="text-right text-[11px] text-slate-600">
                    <span>Session: Morning OPD</span>
                  </div>
                </div>

                {/* Patient Demographics & Vitals Table */}
                <div className="my-3 bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Patient Name:</span>
                    <strong className="text-slate-900">{selectedPatient?.name}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Age / Gender:</span>
                    <strong className="text-slate-800">{selectedPatient?.age} yrs / Female</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Gestation / Visit:</span>
                    <strong className="text-teal-900">
                      {selectedPatient?.isPregnant ? `${selectedPatient.pregnancyDetails?.gestationalAgeWeeks} weeks (ANC)` : selectedPatient?.visitType}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">ABHA ID:</span>
                    <span className="text-slate-700 font-mono text-[11px]">{selectedPatient?.abhaId}</span>
                  </div>

                  <div className="sm:col-span-2 pt-1 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Recorded Vitals:</span>
                    <span className="font-semibold text-slate-800 text-[11px]">
                      BP: {selectedPatient?.vitals?.bp || '118/76'} • Wt: {selectedPatient?.vitals?.weightKg || 58.5}kg • FHR: {selectedPatient?.vitals?.foetalHeartRate || '142 bpm'}
                    </span>
                  </div>

                  <div className="sm:col-span-2 pt-1 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Blood Group & Hb:</span>
                    <span className="font-semibold text-slate-800 text-[11px]">
                      {selectedPatient?.clinicalGist?.importantRecords?.bloodGroup || 'O Negative'} • Hb: {selectedPatient?.clinicalGist?.importantRecords?.hb || '10.2 g/dL'}
                    </span>
                  </div>
                </div>

                {/* Clinical Notes Section */}
                {doctorNotes && (
                  <div className="mb-4 p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
                      Clinical Assessment & Findings:
                    </span>
                    <p className="text-slate-800 leading-relaxed italic text-[11px]">
                      &ldquo;{doctorNotes}&rdquo;
                    </p>
                  </div>
                )}

                {/* ℞ Symbol & Medications Section */}
                <div className="my-4 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-serif italic text-slate-900 leading-none">℞</span>
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Prescribed Medications
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-medium">
                      Total {medicines.length} Item(s)
                    </span>
                  </div>

                  {/* Medicines Table */}
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                        <th className="py-1.5 pr-2">#</th>
                        <th className="py-1.5 px-2">Medicine & Formulation</th>
                        <th className="py-1.5 px-2">Dosage & Frequency</th>
                        <th className="py-1.5 px-2">Timing</th>
                        <th className="py-1.5 px-2 text-right">Duration</th>
                        <th className="py-1.5 pl-2 text-right">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {medicines.map((m, idx) => (
                        <tr key={m.id || idx}>
                          <td className="py-2 pr-2 font-bold text-slate-500 align-top">{idx + 1}.</td>
                          <td className="py-2 px-2 align-top">
                            <strong className="text-slate-900 block text-xs">{m.medicineName}</strong>
                            {m.isJanAushadhiAvailable && (
                              <span className="text-[9px] text-emerald-800 font-bold block">
                                Generic: {m.genericEquivalent || 'Available under PM Jan Aushadhi'}
                              </span>
                            )}
                            {m.instructions && (
                              <span className="text-[10px] text-slate-500 italic block mt-0.5">
                                • {m.instructions}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 align-top text-slate-800 font-medium">
                            <span>{m.dosage}</span>
                            <span className="block text-[10px] text-slate-500">{m.frequency}</span>
                          </td>
                          <td className="py-2 px-2 align-top text-slate-700">
                            {m.timing}
                          </td>
                          <td className="py-2 px-2 align-top text-right font-mono text-slate-800">
                            {m.duration}
                          </td>
                          <td className="py-2 pl-2 align-top text-right font-mono font-bold text-slate-900">
                            {m.quantity || '30'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Advised Diagnostic Investigations */}
                {selectedInvestigations.length > 0 && (
                  <div className="my-4 p-3 bg-purple-50/50 rounded-lg border border-purple-200 text-xs">
                    <span className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1">
                      Advised Laboratory Diagnostics:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-purple-900 font-medium">
                      {selectedInvestigations.map((inv, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                          <span>{inv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pharmacy Referral & Barcode Section */}
                <div className="my-4 pt-3 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                      <QrCode className="w-10 h-10 text-slate-800" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                        Pharmacy Fulfillment Token
                      </span>
                      <strong className="text-sm font-mono font-black text-slate-900">
                        #{activePharmacyOrder?.tokenNumber || 'RX-101'}
                      </strong>
                      <span className="text-[10px] text-teal-800 block font-semibold">
                        Referred to: {selectedPharmacy.name}
                      </span>
                    </div>
                  </div>

                  {/* Doctor Signature & Seal */}
                  <div className="text-right">
                    <div className="h-8 flex items-end justify-end">
                      <span className="font-serif italic text-base font-bold text-slate-900">Dr. Anita Rao</span>
                    </div>
                    <div className="border-t border-slate-400 pt-0.5 text-[10px] text-slate-600">
                      <strong>Dr. Anita Rao, MBBS, MS (OBG)</strong>
                      <p className="text-[9px] text-slate-400">Reg. No: KMC-58210 • Hubballi</p>
                    </div>
                  </div>
                </div>

                {/* Footer advice */}
                <div className="pt-2 border-t border-slate-100 text-[9px] text-slate-400 text-center">
                  Notice: Please report to emergency immediately if you experience severe headache, blurring of vision, bleeding, or reduced foetal movements.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHARMACY REFERRAL LINK & MEDICATION LOOP COMPLETION */}
          {activeTab === 'referral_link' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Header Box */}
              <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white p-5 rounded-2xl shadow-md space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-base">Pharmacy Referral & Loop Fulfillment</h3>
                </div>
                <p className="text-xs text-teal-100/90 leading-relaxed">
                  Doctor prescription has been routed to <strong>{selectedPharmacy.name}</strong>. Share the token and referral link with the patient, or scan at the reception desk to complete the loop.
                </p>
              </div>

              {/* Referral Link & Token Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                      Pharmacy Token Number
                    </span>
                    <strong className="text-2xl font-mono font-black text-slate-900">
                      #{activePharmacyOrder?.tokenNumber || 'RX-101'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg font-bold text-xs flex items-center gap-1.5 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{activePharmacyOrder?.status || 'READY_FOR_PICKUP'}</span>
                    </span>
                  </div>
                </div>

                {/* Shareable Link Box */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block">
                    Shareable Pharmacy Referral Link:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralLinkUrl}
                      className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={handleCopyReferralLink}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                {/* WhatsApp Dispatch Action */}
                <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Send Direct to Patient WhatsApp</span>
                    </h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Sends Token #{activePharmacyOrder?.tokenNumber || 'RX-101'}, Counter Location, and full digital Rx link to {selectedPatient?.mobile}.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDispatchWhatsAppLink}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-xs transition flex items-center gap-1.5 shrink-0"
                  >
                    {whatsAppDispatched ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    <span>{whatsAppDispatched ? 'Sent to WhatsApp!' : 'SEND TO PATIENT'}</span>
                  </button>
                </div>
              </div>

              {/* Loop Progress Tracker */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wide block">
                  Medication Loop Completion Milestones
                </span>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <strong className="text-slate-900 block">1. Doctor Records Prescription</strong>
                      <p className="text-[11px] text-slate-500">Dr. Anita Rao prescribed {medicines.length} medicines and advice notes.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <strong className="text-slate-900 block">2. Prescription Referred to Pharmacy</strong>
                      <p className="text-[11px] text-slate-500">
                        Dispatched to {selectedPharmacy.name} ({selectedPharmacy.counterLocation}). Token #{activePharmacyOrder?.tokenNumber || 'RX-101'}.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      activePharmacyOrder?.status === 'DISPENSED' ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {activePharmacyOrder?.status === 'DISPENSED' ? '✓' : '3'}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 block">3. Medication Dispensed & Loop Closed</strong>
                        <p className="text-[11px] text-slate-500">
                          {activePharmacyOrder?.status === 'DISPENSED'
                            ? `Fulfilled at ${activePharmacyOrder.dispensedAt} by ${activePharmacyOrder.dispensedBy}. Loop closed!`
                            : 'Patient presents token at counter; pharmacist dispenses items.'}
                        </p>
                      </div>

                      {activePharmacyOrder && activePharmacyOrder.status !== 'DISPENSED' && (
                        <button
                          type="button"
                          onClick={() => {
                            opdStore.updatePharmacyOrderStatus(activePharmacyOrder.id, 'DISPENSED');
                            setActivePharmacyOrder({
                              ...activePharmacyOrder,
                              status: 'DISPENSED',
                              dispensedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              dispensedBy: 'Dr. Anita Rao (Direct Dispense)'
                            });
                          }}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          Mark Dispensed Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Hidden in Print) */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {activeTab === 'editor' && (
              <button
                type="button"
                onClick={handleSaveAndGenerate}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-2 transition active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>GENERATE PRINTABLE RX & REFER TO PHARMACY</span>
              </button>
            )}

            {activeTab === 'printable_rx' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Edit Medications
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT PRESCRIPTION</span>
                </button>
              </>
            )}

            {activeTab === 'referral_link' && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white font-extrabold rounded-xl shadow-xs cursor-pointer"
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
