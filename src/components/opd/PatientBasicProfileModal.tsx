import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare,
  Sparkles,
  Phone,
  User,
  Heart,
  Microscope,
  TestTube,
  Activity,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { OpdPatient, LabOrder } from '../../types';
import { DiagnosticAnalyserModal } from './DiagnosticAnalyserModal';
import { MyCareJourneyPanel } from './MyCareJourneyPanel';
import { NewbornVaccinationCard } from './NewbornVaccinationCard';
import { MaternalTestingPanel } from './MaternalTestingPanel';
import { FamilyMemberManagementPanel } from '../patient/FamilyMemberManagementPanel';
import { Award, FileText, Baby, TestTubes, Users } from 'lucide-react';


interface PatientBasicProfileModalProps {
  patient: OpdPatient;
  onClose: () => void;
  onOpenWhatsApp: () => void;
}

interface GestationalStageInfo {
  trimester: string;
  stageName: string;
  efw: string;
  protocol: string;
}

const getGestationalStage = (weeks?: number): GestationalStageInfo => {
  if (!weeks) return { trimester: '1st Trimester', stageName: 'Early Gestation (<6w)', efw: 'Embryonic pole', protocol: 'Viability & dating scan' };
  if (weeks < 13) return { trimester: '1st Trimester', stageName: 'First Trimester (11-13w)', efw: '~15–20g', protocol: 'NT & Dual Marker window' };
  if (weeks < 18) return { trimester: '2nd Trimester', stageName: 'Early Mid-Trimester (14-17w)', efw: '~140–160g', protocol: 'Quadruple screen & early anatomy' };
  if (weeks < 24) return { trimester: '2nd Trimester', stageName: 'Mid-Trimester Anatomy (18-23w)', efw: '~450–520g', protocol: 'Level-II TIFFA scan' };
  if (weeks < 29) return { trimester: '3rd Trimester', stageName: 'Early 3rd Trimester (24-28w)', efw: '~1.0–1.2 kg', protocol: 'OGTT & growth velocity' };
  if (weeks < 34) return { trimester: '3rd Trimester', stageName: 'Late Gestational Growth (29-33w)', efw: '~1.7–2.0 kg', protocol: 'Biometry & Doppler surveillance' };
  if (weeks < 37) return { trimester: '3rd Trimester', stageName: 'Near-Term Maturation (34-36w)', efw: '~2.4–2.8 kg', protocol: 'Fetal presentation & AFI audit' };
  return { trimester: 'Full Term', stageName: 'Full Term Gestation (37-40w)', efw: '~3.0–3.4 kg', protocol: 'Labor readiness & biophysical profile' };
};

export const PatientBasicProfileModal: React.FC<PatientBasicProfileModalProps> = ({
  patient,
  onClose,
  onOpenWhatsApp
}) => {
  const isNewborn = !!(patient.isNewborn || patient.vaccinationSchedule || patient.age <= 2);
  const isMaternal = !!(patient.isPregnant || patient.maternalStage || patient.visitType === 'ANC' || patient.visitType === 'PNC' || patient.postnatalDetails);

  const [activeTab, setActiveTab] = useState<'CARE_JOURNEY' | 'CLINICAL_PROFILE' | 'IMMUNIZATION' | 'MATERNAL_PROTOCOL' | 'FAMILY'>('CARE_JOURNEY');
  const [selectedOrderForAnalyser, setSelectedOrderForAnalyser] = useState<LabOrder | null>(null);
  const clinicalStage = getGestationalStage(patient.pregnancyDetails?.gestationalAgeWeeks);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#faf8f6] rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Header with clean hospital theme */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm shadow-xs">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <span>{patient.name}</span>
                </h3>
                <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">
                  {patient.opdId} • Token #{patient.tokenNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                ABHA: {patient.abhaId} • Mobile: {patient.mobile}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: MY CARE JOURNEY vs Clinical Profile vs Immunization / Maternal Tests */}
        <div className="bg-white px-5 pt-3 border-b border-slate-200 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('CARE_JOURNEY')}
            className={`pb-2.5 font-extrabold text-xs transition border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'CARE_JOURNEY'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>MY CARE JOURNEY</span>
            {patient.achievements && (
              <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full font-bold">
                {patient.achievements.filter(a => a.earned).length} Badges
              </span>
            )}
          </button>

          {isNewborn && (
            <button
              onClick={() => setActiveTab('IMMUNIZATION')}
              className={`pb-2.5 font-extrabold text-xs transition border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'IMMUNIZATION'
                  ? 'border-sky-600 text-sky-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Baby className="w-4 h-4 text-sky-600" />
              <span>MCP Immunization Card</span>
            </button>
          )}

          {isMaternal && (
            <button
              onClick={() => setActiveTab('MATERNAL_PROTOCOL')}
              className={`pb-2.5 font-extrabold text-xs transition border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'MATERNAL_PROTOCOL'
                  ? 'border-purple-600 text-purple-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <TestTubes className="w-4 h-4 text-purple-600" />
              <span>Maternal Tests Protocol</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('CLINICAL_PROFILE')}
            className={`pb-2.5 font-extrabold text-xs transition border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'CLINICAL_PROFILE'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Clinical Records &amp; Gist</span>
          </button>

          <button
            onClick={() => setActiveTab('FAMILY')}
            className={`pb-2.5 font-extrabold text-xs transition border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'FAMILY'
                ? 'border-rose-700 text-rose-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-rose-600" />
            <span>Family &amp; Dependants</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'CARE_JOURNEY' ? (
            <MyCareJourneyPanel patient={patient} />
          ) : activeTab === 'IMMUNIZATION' ? (
            <NewbornVaccinationCard patient={patient} />
          ) : activeTab === 'MATERNAL_PROTOCOL' ? (
            <MaternalTestingPanel patient={patient} />
          ) : activeTab === 'FAMILY' ? (
            <FamilyMemberManagementPanel patient={patient} />
          ) : (

            <>
              {/* Status banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Current Queue Status</span>
                  <span className="text-sm font-bold text-slate-900">{patient.queueStatus}</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWhatsApp();
                  }}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp Care Thread ({patient.whatsappMessages.length})</span>
                </button>
              </div>

              {/* Clinical Gestational Stage if pregnant */}
              {patient.isPregnant && patient.pregnancyDetails && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-900 font-bold text-[10px] rounded-md border border-rose-200">
                        GA: {patient.pregnancyDetails.gestationalAgeWeeks} Weeks
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        {clinicalStage.stageName} ({clinicalStage.trimester})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Est. Fetal Weight: {clinicalStage.efw} · {clinicalStage.protocol}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 block">
                      G{patient.pregnancyDetails.gravida}P{patient.pregnancyDetails.para} · EDD: {patient.pregnancyDetails.edd}
                    </span>
                  </div>
                </div>
              )}

              {/* Patient Details & Address */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-700" />
                  <span>Demographic & Address Details</span>
                </span>

                <div className="grid grid-cols-2 gap-2 text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                  <p>• Age: <strong>{patient.age} years</strong> ({patient.gender})</p>
                  <p>• Assigned OPD: <strong>{patient.clinicName || 'Maternal & Women OPD'}</strong></p>
                  <div className="col-span-2">
                    <p className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                      <span>Address: <strong>{patient.address || 'Vidyanagar, Hubballi'}</strong></span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Clinical Gist */}
              <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-950 uppercase text-[10px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                    <span>Doctor&apos;s 10-Second Patient Gist</span>
                  </span>
                  <span className="font-bold text-rose-800 text-[11px]">{patient.clinicalGist.headline}</span>
                </div>
                <p className="text-slate-800 leading-relaxed italic bg-white p-2.5 rounded-xl border border-rose-100">
                  &ldquo;{patient.clinicalGist.summaryText}&rdquo;
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                  <p>• Blood Group: <strong>{patient.clinicalGist.importantRecords.bloodGroup || '—'}</strong></p>
                  <p>• Hb Level: <strong>{patient.clinicalGist.importantRecords.hb || '—'}</strong></p>
                  <p>• Glucose Screen: <strong>{patient.clinicalGist.importantRecords.glucose || '—'}</strong></p>
                  {patient.isPregnant ? (
                    <p>• Last Ultrasound: <strong>{patient.clinicalGist.importantRecords.lastScan || '—'}</strong></p>
                  ) : (
                    <p>• Status: <strong>{patient.clinicalGist.importantRecords.conditionSummary || patient.visitReason}</strong></p>
                  )}
                </div>
              </div>

              {/* Vitals if recorded */}
              {patient.vitals && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block">
                    Recorded Vitals
                  </span>
                  <div className="grid grid-cols-4 gap-2 font-mono text-[11px] text-slate-800">
                    <p>BP: <strong>{patient.vitals.bp || '—'}</strong></p>
                    <p>Wt: <strong>{patient.vitals.weightKg ? `${patient.vitals.weightKg} kg` : '—'}</strong></p>
                    <p>Pulse: <strong>{patient.vitals.pulse ? `${patient.vitals.pulse} bpm` : '—'}</strong></p>
                    {patient.isPregnant && patient.vitals.foetalHeartRate ? (
                      <p className="flex items-center gap-1 text-rose-700 font-bold">
                        <Heart className="w-2.5 h-2.5 fill-rose-500 animate-heart-beat" />
                        <span>{patient.vitals.foetalHeartRate}</span>
                      </p>
                    ) : (
                      <p>FH: <strong>{patient.vitals.fundalHeightCm ? `${patient.vitals.fundalHeightCm} cm` : '—'}</strong></p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Diagnostic Laboratory Investigations & ABDM Health Records */}
          <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-purple-950 uppercase text-[10px] flex items-center gap-1.5">
                <Microscope className="w-3.5 h-3.5 text-purple-700" />
                <span>Diagnostic Pathology Reports & ABDM Records</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 font-bold border border-teal-300">
                ABDM Linked ({patient.abhaAddress || `${patient.name.toLowerCase().replace(/\s+/g, '.')}@abdm`})
              </span>
            </div>

            {(!patient.labOrders || patient.labOrders.length === 0) ? (
              <p className="text-slate-500 italic text-[11px] bg-white p-2.5 rounded-xl border border-purple-100">
                No diagnostic laboratory investigations uploaded yet for this visit.
              </p>
            ) : (
              <div className="space-y-2">
                {patient.labOrders.map(ord => (
                  <div key={ord.id} className="bg-white p-3 rounded-xl border border-purple-100 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <TestTube className="w-3.5 h-3.5 text-purple-700" />
                          <span className="font-extrabold text-slate-900 text-xs">{ord.testName}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                            #{ord.id}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Requested by {ord.requestedBy || 'Dr. Anita Rao'} • Ref: {ord.clinicName || 'Room 4'}
                        </span>
                      </div>

                      {/* Analyser launcher button */}
                      <button
                        onClick={() => setSelectedOrderForAnalyser(ord)}
                        className="px-2.5 py-1 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white font-extrabold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer shadow-xs transition"
                      >
                        <Activity className="w-3 h-3 text-purple-300" />
                        <span>Run Analyser</span>
                      </button>
                    </div>

                    {ord.reportSummary && (
                      <p className="text-[11px] font-semibold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        {ord.reportSummary}
                      </p>
                    )}

                    {ord.parameters && ord.parameters.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {ord.parameters.slice(0, 4).map((p, i) => (
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
    </div>

    {/* Embedded Diagnostic Analyser Modal if triggered */}
    {selectedOrderForAnalyser && (
      <DiagnosticAnalyserModal
        order={selectedOrderForAnalyser}
        patientGestationWeeks={patient.pregnancyDetails?.gestationalAgeWeeks || 28}
        onClose={() => setSelectedOrderForAnalyser(null)}
      />
    )}
  </>
  );
};
