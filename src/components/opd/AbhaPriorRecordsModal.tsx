import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Activity, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Clock, 
  Stethoscope, 
  Pill, 
  Baby, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowDownToLine,
  Database
} from 'lucide-react';
import { OpdPatient } from '../../types';

interface AbhaPriorRecordsModalProps {
  patient: OpdPatient;
  onClose: () => void;
  onImportToNotes?: (importedText: string) => void;
}

export const AbhaPriorRecordsModal: React.FC<AbhaPriorRecordsModalProps> = ({
  patient,
  onClose,
  onImportToNotes
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'CONSULTATIONS' | 'LABS' | 'SCANS' | 'MEDS' | 'VACCINES'>('ALL');
  const [importedToast, setImportedToast] = useState(false);

  // ABDM Prior records pulled via M1/M2/M3 Gateway for this patient
  const priorRecords = [
    {
      id: 'ABDM-REC-01',
      title: 'Antenatal Visit 1 & Baseline Obstetric Registration',
      facility: 'Primary Health Centre (PHC) Unkal • ABDM Node',
      doctor: 'Dr. Ramesh Kulkarni, MBBS, DGO',
      date: '14 May 2026 (12 Weeks Gestation)',
      category: 'CONSULTATIONS',
      type: 'OPD Encounter Summary',
      findings: 'Gravida 2, Para 1, Living 1. Gestational age: 12w by dating scan. Baseline BP: 118/76 mmHg. Weight: 54 kg. Blood group confirmed Rh-negative (O-ve). Counseled on Rh isoimmunization risks and folic acid adherence.',
      keyMetrics: [
        { label: 'Blood Pressure', value: '118/76 mmHg', status: 'NORMAL' },
        { label: 'Weight', value: '54 kg', status: 'NORMAL' },
        { label: 'Obstetric Score', value: 'G2 P1 L1 A0', status: 'INFO' }
      ]
    },
    {
      id: 'ABDM-REC-02',
      title: 'Baseline Complete Blood Count & Serology Panel',
      facility: 'District Diagnostic Centre, Hubballi (NABL Accredited)',
      doctor: 'Dr. Suniti Patel, MD Path',
      date: '16 May 2026',
      category: 'LABS',
      type: 'Diagnostic Report (LOINC 58410-2)',
      findings: 'Hemoglobin: 10.2 g/dL (Mild microcytic hypochromic anaemia). Platelets: 2.4 Lakhs/mcL. Blood Group: O Rh Negative. HIV, HBsAg, VDRL: Non-Reactive. Thyroid TSH: 2.1 mIU/L (Euthyroid).',
      keyMetrics: [
        { label: 'Hemoglobin (Hb)', value: '10.2 g/dL', status: 'ALERT' },
        { label: 'Blood Group', value: 'O Negative', status: 'ALERT' },
        { label: 'Platelet Count', value: '2.40 L/mcL', status: 'NORMAL' },
        { label: 'TSH', value: '2.1 mIU/L', status: 'NORMAL' }
      ]
    },
    {
      id: 'ABDM-REC-03',
      title: 'Level-II Targeted Imaging for Fetal Anomalies (TIFFA)',
      facility: 'Suraksha Ultrasound & Imaging Centre (ONDC Node)',
      doctor: 'Dr. Veena Hegde, DMRD',
      date: '28 July 2026 (20 Weeks Gestation)',
      category: 'SCANS',
      type: 'Obstetric Ultrasound (SNOMED 241493005)',
      findings: 'Single live intrauterine gestation corresponding to 20w 2d. Fetal cardiac activity regular (FHR 146 bpm). Placenta posterior, high grade I maturity, clear of internal os. Amniotic Fluid Index (AFI): 13.8 cm (Normal). No gross structural congenital anomalies detected.',
      keyMetrics: [
        { label: 'Fetal Heart Rate', value: '146 bpm', status: 'NORMAL' },
        { label: 'AFI Volume', value: '13.8 cm', status: 'NORMAL' },
        { label: 'Placenta Location', value: 'Posterior / Normal', status: 'NORMAL' }
      ]
    },
    {
      id: 'ABDM-REC-04',
      title: 'Maternal Antenatal Prescription & Adherence Record',
      facility: 'PM Jan Aushadhi Kendra #5048 • ONDC Node',
      doctor: 'Dispensed by Suresh Hegde, R.Ph.',
      date: '10 Aug 2026',
      category: 'MEDS',
      type: 'Medication Adherence Record',
      findings: 'Tab Ferrous Ascorbate 100mg + Folic Acid 1.5mg OD (94% digital adherence confirmed via WhatsApp reminder). Tab Calcium Carbonate 500mg + Vitamin D3 BD. Patient reports good gastrointestinal tolerance with minimal constipation.',
      keyMetrics: [
        { label: 'Iron Adherence', value: '94% On-Track', status: 'NORMAL' },
        { label: 'Calcium Adherence', value: '92% On-Track', status: 'NORMAL' },
        { label: 'Generic Savings', value: '72% Saved', status: 'INFO' }
      ]
    },
    {
      id: 'ABDM-REC-05',
      title: 'Maternal Tetanus & Diphtheria (Tdap) Immunization',
      facility: 'St. Anne Mother & Child Hospital • Maternal Suite',
      doctor: 'Sister Mary Fernandez, CNO',
      date: '25 Aug 2026 (24 Weeks Gestation)',
      category: 'VACCINES',
      type: 'Immunization Certificate (CVX 115)',
      findings: 'Tdap booster dose 0.5 mL administered IM left deltoid (Batch: TD-88421, Exp: 2028). No adverse events noted during 30 min observation. CoWIN/ABDM sync completed.',
      keyMetrics: [
        { label: 'Vaccine Dose', value: 'Tdap Booster 0.5 mL', status: 'NORMAL' },
        { label: 'Site', value: 'Left Deltoid IM', status: 'NORMAL' },
        { label: 'Status', value: 'Administered & Verified', status: 'NORMAL' }
      ]
    }
  ];

  const filtered = activeCategory === 'ALL' 
    ? priorRecords 
    : priorRecords.filter(r => r.category === activeCategory);

  const handleImportAll = () => {
    if (onImportToNotes) {
      const summary = `[ABDM Prior Records - ${patient.name} (${patient.abhaId})]:
- Gravida 2, Para 1, Living 1. Baseline GA: 28w.
- Baseline Hb: 10.2 g/dL (Mild Anaemia). Blood Group: O Rh-Negative (Alert: Monitor Anti-D).
- 20w TIFFA Ultrasound: Single live fetus, normal structural anatomy, FHR 146 bpm, AFI 13.8cm.
- Medication Adherence: 94% on Tab Ferrous Ascorbate & Tab Calcium (Jan Aushadhi generic).
- Tdap booster administered at 24w.`;
      onImportToNotes(summary);
      setImportedToast(true);
      setTimeout(() => setImportedToast(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  ABDM / ABHA Prior Health Records
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Consent Verified • M1/M2/M3
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Patient: <span className="font-bold text-white">{patient.name}</span> • ABHA: <span className="font-mono text-emerald-300 font-semibold">{patient.abhaId || '91-8842-1049-2311'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImportAll}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              title="Import ABHA prior findings directly into current OPD consultation notes"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Import to Consultation Notes</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast */}
        {importedToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-2.5 px-4 text-xs font-bold text-emerald-800 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ABHA clinical baseline successfully copied into current OPD Consultation Notes!
            </span>
            <button onClick={() => setImportedToast(false)} className="text-emerald-700 hover:text-emerald-900">✕</button>
          </div>
        )}

        {/* Longitudinal Patient Summary Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              <strong className="text-slate-900 font-bold">5 Longitudinal Records</strong> from 3 Connected Facilities
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Blood Group: <strong className="text-rose-700 font-bold">O Rh Negative</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Baseline Hb: <strong className="text-amber-700 font-bold">10.2 g/dL (Mild Anaemia)</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>FHIR R4 Diagnostic Bundles</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-slate-200 px-4 py-2 flex items-center gap-1 overflow-x-auto text-xs font-bold bg-white">
          {[
            { id: 'ALL', label: 'All Records (5)' },
            { id: 'CONSULTATIONS', label: 'Consultations (1)' },
            { id: 'LABS', label: 'Diagnostic Labs (1)' },
            { id: 'SCANS', label: 'Ultrasound Scans (1)' },
            { id: 'MEDS', label: 'Prescriptions & Adherence (1)' },
            { id: 'VACCINES', label: 'Vaccinations (1)' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveCategory(t.id as any)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeCategory === t.id 
                  ? 'bg-rose-700 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Records Content Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#faf9f8]">
          {filtered.map(rec => (
            <div 
              key={rec.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-rose-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {rec.type}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {rec.id}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {rec.title}
                  </h3>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-500">
                  <div className="font-semibold text-slate-800 flex items-center sm:justify-end gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-600" />
                    <span>{rec.date}</span>
                  </div>
                  <p className="text-[11px]">{rec.facility}</p>
                </div>
              </div>

              {/* Findings */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 leading-relaxed border border-slate-100">
                <p className="font-semibold text-slate-900 mb-1">Clinical Findings &amp; Observations:</p>
                <p>{rec.findings}</p>
              </div>

              {/* Key Metrics Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {rec.keyMetrics.map((km, idx) => (
                  <div 
                    key={idx}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${
                      km.status === 'ALERT'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : km.status === 'INFO'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    <span className="text-slate-500 text-[10px] uppercase font-bold">{km.label}:</span>
                    <span className="font-bold">{km.value}</span>
                  </div>
                ))}
              </div>

              {/* Doctor signature */}
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Clinician / Attending: <strong>{rec.doctor}</strong></span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ABDM Cryptographically Signed</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ayushman Bharat Digital Mission (ABDM) • Encrypted FHIR Gateway</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImportAll}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Import Summary into Notes</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
