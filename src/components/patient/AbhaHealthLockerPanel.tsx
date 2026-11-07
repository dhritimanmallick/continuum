import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  FileText, 
  Download, 
  CheckCircle2, 
  Lock, 
  ExternalLink, 
  Building2, 
  Activity, 
  Calendar, 
  Eye, 
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { OpdPatient } from '../../types';

interface AbhaHealthLockerPanelProps {
  patient: OpdPatient;
}

export const AbhaHealthLockerPanel: React.FC<AbhaHealthLockerPanelProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<'RECORDS' | 'CARD' | 'CONSENTS'>('RECORDS');
  const [isSyncing, setIsSyncing] = useState(false);

  const abhaRecords = [
    {
      id: 'REC-ABHA-101',
      title: 'Antenatal Registration & 1st Trimester Baseline Clinical Note',
      issuer: 'Primary Health Centre (PHC) Unkal • Health Facility ID: 29-10842',
      date: '14 May 2026',
      type: 'OPD Clinical Note',
      doctor: 'Dr. Ramesh Kulkarni, MBBS, DGO',
      status: 'VERIFIED_NRCES',
      highlights: 'G2P1, Gestation 12w, Baseline BP 118/76 mmHg, Blood Group O-ve, Folic acid advised.'
    },
    {
      id: 'REC-ABHA-102',
      title: 'Complete Blood Count & Baseline Maternal Serology',
      issuer: 'District Diagnostic Centre, Hubballi (NABL Accredited)',
      date: '16 May 2026',
      type: 'Diagnostic Laboratory Report',
      doctor: 'Dr. Suniti Patel, MD Path',
      status: 'VERIFIED_NRCES',
      highlights: 'Hemoglobin: 10.2 g/dL, O Rh-Negative, TSH: 2.1 mIU/L, HIV/HBsAg/VDRL: Non-Reactive.'
    },
    {
      id: 'REC-ABHA-103',
      title: 'Level-II Targeted Imaging for Fetal Anomalies (TIFFA)',
      issuer: 'Suraksha Ultrasound & Imaging Centre (ONDC Node)',
      date: '28 Jul 2026',
      type: 'Ultrasonography Report',
      doctor: 'Dr. Veena Hegde, DMRD',
      status: 'VERIFIED_NRCES',
      highlights: 'Single live fetus at 20w, normal anatomical survey, FHR 146 bpm, AFI 13.8 cm.'
    },
    {
      id: 'REC-ABHA-104',
      title: 'Tdap Maternal Immunization Certificate',
      issuer: 'St. Anne Mother & Child Hospital • Room 4 Maternal Suite',
      date: '25 Aug 2026',
      type: 'Vaccination Certificate',
      doctor: 'Sister Mary Fernandez, CNO',
      status: 'VERIFIED_NRCES',
      highlights: 'Tdap booster 0.5mL IM administered left deltoid. CoWIN/ABDM sync completed.'
    },
    {
      id: 'REC-ABHA-105',
      title: '28-Week Antenatal Consultation & Digital Prescription',
      issuer: 'St. Anne Mother & Child Hospital (OPD-2026-104)',
      date: 'Today 09:30 AM',
      type: 'Consultation & e-Prescription',
      doctor: 'Dr. Anita Rao, Senior Consultant OB/GYN',
      status: 'VERIFIED_NRCES',
      highlights: 'Fundal height 28cm, Tab IFA + Tab Calcium prescribed with Jan Aushadhi generic substitution.'
    }
  ];

  const consents = [
    {
      id: 'CONSENT-01',
      requester: 'Dr. Anita Rao, Senior Consultant OB/GYN',
      facility: 'St. Anne Mother & Child Hospital',
      purpose: 'Care Provision & Longitudinal Antenatal Management',
      accessType: 'Full Medical Records (Read)',
      validTill: '15 Jan 2027',
      status: 'ACTIVE'
    },
    {
      id: 'CONSENT-02',
      requester: 'Apex Diagnostic Centre (ONDC Node)',
      facility: 'Apex Advanced Pathology Lab',
      purpose: 'Diagnostic Test Requisition & Report Upload',
      accessType: 'Diagnostic Reports Only',
      validTill: '15 Dec 2026',
      status: 'ACTIVE'
    }
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-3xl text-white border border-emerald-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  Ayushman Bharat Health Account (ABHA) Digital Locker
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  ABDM M1/M2/M3 Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                National Health Authority (NHA) • Secure longitudinal records accessible across hospitals and diagnostic clinics.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing ABDM...' : 'Sync Gateway'}</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'RECORDS', label: '📂 Linked Health Records (5)' },
          { id: 'CARD', label: '🪪 Digital ABHA ID Card' },
          { id: 'CONSENTS', label: '🔒 Consent Permissions (2 Active)' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === t.id 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: LINKED HEALTH RECORDS */}
      {activeTab === 'RECORDS' && (
        <div className="space-y-3">
          {abhaRecords.map(rec => (
            <div 
              key={rec.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded">
                      {rec.type}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{rec.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <span className="font-bold text-slate-800 block">{rec.date}</span>
                  <span className="text-[11px] text-slate-500">{rec.issuer}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                <strong>Clinical Summary:</strong> {rec.highlights}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                <span>Doctor / Attending: <strong>{rec.doctor}</strong></span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NRCeS India FHIR R4 Bundle Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: DIGITAL ABHA CARD */}
      {activeTab === 'CARD' && (
        <div className="max-w-md mx-auto bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-900 text-white rounded-3xl p-6 shadow-xl border-2 border-emerald-500/50 space-y-5">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇮🇳</span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  National Health Authority
                </h3>
                <p className="text-[10px] text-slate-300">Ayushman Bharat Digital Mission</p>
              </div>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold">
              ABHA CARD
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-bold text-2xl shrink-0 border-2 border-emerald-400">
              🤰
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-white">{patient.name}</h4>
              <p className="text-xs text-slate-300">Age: 28 Yrs • Gender: Female</p>
              <p className="text-xs text-emerald-300 font-mono font-bold">
                {patient.abhaId || '91-8842-1049-2311'}
              </p>
            </div>
          </div>

          {/* QR code and details */}
          <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between border border-white/15">
            <div className="space-y-1 text-xs">
              <div className="text-[10px] text-slate-400 uppercase font-bold">ABHA Address</div>
              <div className="font-mono text-emerald-200 font-bold">sunita.das@abdm</div>
              <div className="text-[10px] text-slate-400 mt-2">Mobile: +91 98452 11029</div>
            </div>

            <div className="w-16 h-16 bg-white rounded-xl p-1 flex items-center justify-center shrink-0">
              <QrCode className="w-14 h-14 text-slate-900" />
            </div>
          </div>

          <div className="text-[10px] text-center text-slate-400">
            Valid nationwide across all ABDM-compliant hospitals, clinics, and diagnostic centres.
          </div>
        </div>
      )}

      {/* TAB 3: CONSENT PERMISSIONS */}
      {activeTab === 'CONSENTS' && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-amber-900 text-xs">
            <strong>Consent Management Notice:</strong> You retain complete ownership of your health records. You may grant or revoke access to doctors and diagnostic labs at any time under ABDM Privacy Guidelines.
          </div>

          {consents.map(c => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{c.requester}</h4>
                  <p className="text-xs text-slate-500">{c.facility}</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                <div>Purpose: <strong>{c.purpose}</strong></div>
                <div>Access Granted: <strong>{c.accessType}</strong></div>
                <div>Valid Until: <strong>{c.validTill}</strong></div>
                <div>Consent Manager: <strong>NHA Gateway</strong></div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Consent for ${c.requester} revoked.`)}
                  className="px-3 py-1 rounded-lg border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50 cursor-pointer"
                >
                  Revoke Consent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
