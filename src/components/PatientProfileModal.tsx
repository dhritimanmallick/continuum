import React, { useState } from 'react';
import { 
  X, 
  User, 
  HeartHandshake, 
  Baby, 
  Calendar, 
  Phone, 
  MapPin, 
  Fingerprint, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { Patient, PregnancyEpisode, CareGap, LaboratorySample, PatientTimelineEvent } from '../types';
import { store } from '../services/store';

interface PatientProfileModalProps {
  patientId: string;
  onClose: () => void;
  onContactPatient: (gap: CareGap) => void;
  onRecordAction: (gap: CareGap) => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  patientId,
  onClose,
  onContactPatient,
  onRecordAction
}) => {
  const patient = store.patients.find(p => p.id === patientId);
  const pregnancy = store.pregnancies.find(pr => pr.motherId === patientId);
  const newborn = store.newborns.find(nb => nb.motherId === patientId);
  const child = store.children.find(ch => ch.motherId === patientId);
  const careGaps = store.careGaps.filter(g => g.patientId === patientId);
  const labSamples = store.labSamples.filter(l => l.patientId === patientId);
  const timeline = store.getPatientTimeline(patientId);

  const [activeTab, setActiveTab] = useState<'timeline' | 'gaps' | 'lab' | 'relationship'>('timeline');

  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-start justify-between shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-inner">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold">{patient.name}</h2>
                <span className="text-[10px] font-mono bg-teal-900 text-teal-200 px-2 py-0.5 rounded border border-teal-700">
                  {patient.patientIdNumber}
                </span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-emerald-400" />
                  ABHA: {patient.abhaNumber}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1.5 font-medium">
                <span>{patient.age} yrs • {patient.gender.toUpperCase()}</span>
                <span>•</span>
                <span>Blood: <strong>{patient.bloodGroup} {patient.rhFactor}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {patient.mobile}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Languages className="w-3 h-3" /> {patient.preferredLanguage}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Longitudinal Relationship Graph Banner (Section 7) */}
        <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 shrink-0">
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
            Longitudinal Relationship Thread (Conception Onward)
          </p>
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold py-1">
            {/* Mother */}
            <div className="px-3 py-1.5 rounded-lg bg-teal-800 text-white flex items-center gap-1.5 shadow-2xs">
              <User className="w-3.5 h-3.5" />
              <span>Mother ({patient.name})</span>
            </div>

            <span className="text-slate-400 font-bold">→</span>

            {/* Pregnancy */}
            <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${pregnancy ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-200 text-slate-500'}`}>
              <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
              <span>{pregnancy ? `Pregnancy (${pregnancy.currentGestationalAgeWeeks} wks)` : 'No active pregnancy'}</span>
            </div>

            <span className="text-slate-400 font-bold">→</span>

            {/* Foetus */}
            <div className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1.5">
              <span>Foetus (Milestone Track)</span>
            </div>

            <span className="text-slate-400 font-bold">→</span>

            {/* Newborn */}
            <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${newborn ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-200 text-slate-500'}`}>
              <Baby className="w-3.5 h-3.5 text-emerald-700" />
              <span>{newborn ? newborn.babyName : 'Newborn (Pending)'}</span>
            </div>

            <span className="text-slate-400 font-bold">→</span>

            {/* Child */}
            <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${child ? 'bg-sky-100 text-sky-900 border border-sky-300' : 'bg-slate-200 text-slate-500'}`}>
              <span>Child Immunisation</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-200 bg-white flex items-center gap-6 text-xs font-semibold text-slate-600 shrink-0">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'timeline' ? 'border-teal-700 text-teal-900 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Chronological Timeline ({timeline.length})
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'gaps' ? 'border-teal-700 text-teal-900 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Open & Closed Care Gaps ({careGaps.length})
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'lab' ? 'border-teal-700 text-teal-900 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Laboratory Results ({labSamples.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs bg-slate-50">
          {/* Timeline View (Section 22) */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="border-l-2 border-teal-300 pl-4 space-y-6 relative ml-2">
                {timeline.map((evt, idx) => (
                  <div key={evt.id} className="relative group">
                    {/* Circle icon */}
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white ring-2 ring-teal-200" />
                    
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-mono text-[10px] text-teal-900 font-bold bg-teal-50 px-2 py-0.5 rounded">
                          {evt.displayDate}
                        </span>
                        <span className="text-[10px] text-slate-400">{evt.source} • {evt.user}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{evt.title}</h4>
                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Care Gaps Tab */}
          {activeTab === 'gaps' && (
            <div className="space-y-3">
              {careGaps.map(g => (
                <div key={g.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{g.gapTitle}</span>
                      <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">{g.ruleId}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      g.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' : g.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {g.status} ({g.overdueDurationDisplay})
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs bg-slate-50 p-2.5 rounded border border-slate-100 font-medium">
                    {g.plainReason}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                    <span>Expected window: <strong>{g.expectedWindowDisplay}</strong></span>
                    {g.status !== 'CLOSED' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onClose();
                            onContactPatient(g);
                          }}
                          className="px-2.5 py-1 bg-emerald-700 text-white rounded font-semibold cursor-pointer"
                        >
                          Contact Patient
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onRecordAction(g);
                          }}
                          className="px-2.5 py-1 bg-teal-50 border border-teal-300 text-teal-900 rounded font-semibold cursor-pointer"
                        >
                          Record Action
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Laboratory Results Tab */}
          {activeTab === 'lab' && (
            <div className="space-y-3">
              {labSamples.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No laboratory samples currently on file.</p>
              ) : (
                labSamples.map(sample => (
                  <div key={sample.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{sample.testName}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        sample.isAbnormal ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {sample.closureStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Sample ID: <strong>{sample.sampleId}</strong> • Collected: {sample.collectionDate}
                    </p>
                    {sample.resultSummary && (
                      <div className="mt-2 p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px]">
                        {sample.resultSummary}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
