import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Lock, 
  ExternalLink, 
  Info,
  AlertCircle
} from 'lucide-react';
import { 
  multiHospitalConsentService, 
  AbhaHospitalConsent 
} from '../../services/multiHospitalConsentService';
import { OpdPatient } from '../../types';

interface AbhaMultiHospitalConsentModalProps {
  patient: OpdPatient;
  isOpen: boolean;
  onClose: () => void;
}

export const AbhaMultiHospitalConsentModal: React.FC<AbhaMultiHospitalConsentModalProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  const [consents, setConsents] = useState<AbhaHospitalConsent[]>(
    multiHospitalConsentService.getConsents()
  );
  const [activeTab, setActiveTab] = useState<'CONSENTS' | 'CONSTANT_DATA_STORAGE' | 'AUDIT_TRAIL'>('CONSENTS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGrantConsent = (hospitalId: string, hospitalName: string) => {
    multiHospitalConsentService.grantConsent(hospitalId);
    setConsents(multiHospitalConsentService.getConsents());
    setToastMessage(`ABHA Consent granted to ${hospitalName}. Doctors can now access your constant health record.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRevokeConsent = (hospitalId: string, hospitalName: string) => {
    multiHospitalConsentService.revokeConsent(hospitalId);
    setConsents(multiHospitalConsentService.getConsents());
    setToastMessage(`ABHA Consent revoked for ${hospitalName}. Access to your medical history has been stopped.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  ABHA Multi-Hospital Consent Manager
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 font-mono">
                  ABDM National Health Gateway
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Centralized Health Storage • ABHA: <strong className="text-emerald-300 font-mono">{patient.abhaAddress || '91-8842-1049-2311@abdm'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs font-semibold text-emerald-900 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-700 font-bold">✕</button>
          </div>
        )}

        {/* Key Architectural Guarantee Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-3 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Constant Longitudinal Storage:</strong> Your medical history, scan reports, and prescriptions remain in your secure, constant ABHA repository. No matter which hospital or clinic you visit in your vicinity, all doctors access the same unified records—strictly based on your explicit consent.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-5 pt-3 gap-2 bg-slate-50/70 text-xs font-bold">
          <button
            onClick={() => setActiveTab('CONSENTS')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'CONSENTS'
                ? 'border-emerald-600 text-emerald-900 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital Consent Access ({consents.filter(c => c.status === 'GRANTED').length} Active)</span>
          </button>

          <button
            onClick={() => setActiveTab('CONSTANT_DATA_STORAGE')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'CONSTANT_DATA_STORAGE'
                ? 'border-emerald-600 text-emerald-900 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Constant Repository (FHIR Records)</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIT_TRAIL')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'AUDIT_TRAIL'
                ? 'border-emerald-600 text-emerald-900 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>ABDM Access Audit Log</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: HOSPITALS CONSENT LIST */}
          {activeTab === 'CONSENTS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Manage which hospitals and medical centers can view your constant records:</span>
                <span className="font-bold text-emerald-800">5 Accredited Vicinity Hospitals</span>
              </div>

              {consents.map((consent) => {
                const isGranted = consent.status === 'GRANTED';
                const isRequested = consent.status === 'REQUESTED';
                
                return (
                  <div 
                    key={consent.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isGranted 
                        ? 'bg-white border-emerald-200/80 shadow-xs' 
                        : isRequested 
                        ? 'bg-amber-50/50 border-amber-200' 
                        : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            {consent.hospitalName}
                          </h4>
                          {isGranted ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Consent Granted</span>
                            </span>
                          ) : isRequested ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Consent Requested</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3 text-slate-500" />
                              <span>Revoked / Inactive</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600">
                          <strong>Purpose:</strong> {consent.purpose}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Artifact: {consent.consentArtifactId}
                          </span>
                          <span>•</span>
                          <span>Valid till: <strong>{consent.validTill}</strong></span>
                          <span>•</span>
                          <span>Access: <strong className="text-slate-700">{consent.accessLevel.replace('_', ' ')}</strong></span>
                        </div>

                        {/* Shared HI-Types Pills */}
                        <div className="flex flex-wrap items-center gap-1 pt-1.5">
                          <span className="text-[10px] text-slate-500 mr-1">Shared:</span>
                          {consent.hiTypes.map(type => (
                            <span key={type} className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md border border-slate-200">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 flex sm:flex-col items-center gap-2">
                        {isGranted ? (
                          <button
                            type="button"
                            onClick={() => handleRevokeConsent(consent.hospitalId, consent.hospitalName)}
                            className="w-full px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                          >
                            Revoke Consent
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleGrantConsent(consent.hospitalId, consent.hospitalName)}
                            className="w-full px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Authorize Consent</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: CONSTANT LONGITUDINAL REPOSITORY */}
          {activeTab === 'CONSTANT_DATA_STORAGE' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Centralized National Health Data Repository (NRCES / FHIR Compliant)</span>
                </div>
                <p>
                  Your complete clinical history remains constant under your ABHA address. It does not belong to any single hospital. When you transition care from St. Anne to Apollo Cradle, Fortis, or Cloudnine, your medical journey continues without repeated tests.
                </p>
              </div>

              {/* Records Stored */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Constant Records in Your ABHA Locker
                </h4>

                {[
                  {
                    title: '28-Week Antenatal Consultation & Digital Prescription',
                    facility: 'St. Anne Mother & Child Hospital',
                    date: 'Today 09:30 AM',
                    type: 'e-Prescription & Vitals (BP 118/76, FHR 142 bpm)',
                    status: 'VERIFIED NRCES'
                  },
                  {
                    title: 'Level-II Targeted Imaging for Fetal Anomalies (TIFFA)',
                    facility: 'Suraksha Ultrasound Centre (Accredited ONDC Hub)',
                    date: '28 Jul 2026',
                    type: '4D Sonography (Fetus Normal, AFI 13.8cm)',
                    status: 'VERIFIED NRCES'
                  },
                  {
                    title: 'Comprehensive Antenatal Blood Panel & Blood Grouping',
                    facility: 'Apex Diagnostic Centre (ONDC Node)',
                    date: '15 Jun 2026',
                    type: 'Blood Group O-Negative • Hb 10.2 g/dL (Mild Anemia Alert)',
                    status: 'NABL VERIFIED'
                  },
                  {
                    title: 'Tdap Maternal Immunization Booster Certificate',
                    facility: 'St. Anne Hospital Room 4',
                    date: '25 Aug 2026',
                    type: 'CoWIN / ABDM Linked Immunization',
                    status: 'VERIFIED NRCES'
                  }
                ].map((rec, idx) => (
                  <div key={idx} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="font-extrabold text-slate-900">{rec.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Originating Facility: {rec.facility} • {rec.date}
                      </p>
                      <span className="text-[11px] text-slate-700 font-medium block">
                        {rec.type}
                      </span>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                        {rec.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'AUDIT_TRAIL' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                Audit trail of every time a medical center requested and accessed your constant ABHA records:
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {[
                  {
                    timestamp: 'Today 09:32 AM',
                    actor: 'Dr. Anita Rao',
                    facility: 'St. Anne Mother & Child Hospital',
                    action: 'PULLED_PRIOR_RECORDS',
                    note: '10-Second Pre-Session Gist & Historical Ultrasounds via ABDM Gateway'
                  },
                  {
                    timestamp: '02 Nov 2026, 04:15 PM',
                    actor: 'Dr. Priya Kulkarni',
                    facility: "Apollo Cradle & Children's Hospital",
                    action: 'CONSENT_GRANTED',
                    note: 'Patient authorized 6-month cross-consultation access for Fetal Echo'
                  },
                  {
                    timestamp: '28 Jul 2026, 11:20 AM',
                    actor: 'Dr. Veena Hegde',
                    facility: 'Suraksha Ultrasound Centre',
                    action: 'UPLOADED_RECORD',
                    note: 'Pushed TIFFA 4D scan report into Sunita Das central ABHA Locker'
                  }
                ].map((log, idx) => (
                  <div key={idx} className="py-2.5 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{log.actor} ({log.facility})</span>
                        <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{log.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>National Health Authority (NHA) • ABDM Consent Architecture v3.0</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition cursor-pointer"
          >
            Close Manager
          </button>
        </div>

      </div>
    </div>
  );
};
