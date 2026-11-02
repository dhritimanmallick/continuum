import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  User, 
  Baby, 
  Plus, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { PregnancyEpisode } from '../types';
import { store } from '../services/store';

interface PregnancyModuleProps {
  onViewPatientProfile: (patientId: string) => void;
  onEnrolPregnancy: () => void;
}

export const PregnancyModule: React.FC<PregnancyModuleProps> = ({
  onViewPatientProfile,
  onEnrolPregnancy
}) => {
  const [selectedPregnancy, setSelectedPregnancy] = useState<PregnancyEpisode>(store.pregnancies[0]);

  // Standard milestones timeline
  const milestones = [
    { title: 'Antenatal Booking & MCP', window: '6–10 wks', ruleId: 'A1', status: 'Completed', date: '2026-03-10' },
    { title: 'Dating Ultrasound Scan', window: '6–10 wks', ruleId: 'F1', status: 'Completed', date: '2026-04-10' },
    { title: '11–14 Wk Early Scan / NT', window: '11–14 wks', ruleId: 'F2', status: 'Completed', date: '2026-05-18' },
    { title: '18–22 Wk Anomaly Scan (TIFFA)', window: '18–22 wks', ruleId: 'F3', status: 'Completed', date: '2026-07-02' },
    { title: '24–28 Wk Glucose Testing (OGTT)', window: '24–28 wks', ruleId: 'A7', status: selectedPregnancy.id === 'PREG-001' ? 'Overdue (+3 wks)' : 'Scheduled', date: selectedPregnancy.id === 'PREG-001' ? 'Pending Action' : undefined },
    { title: 'Growth Surveillance Scan', window: '32–34 wks', ruleId: 'F4', status: 'Upcoming' },
    { title: 'Delivery & Birth Enrolment', window: '37–40 wks', ruleId: 'A10', status: 'Upcoming' },
    { title: 'Postpartum Maternal Check', window: '6 wks PNC', ruleId: 'P3', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Pregnancy Episodes</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {store.pregnancies.length} active episodes tracked against clinician-defined antenatal & foetal milestones.
          </p>
        </div>

        <button
          onClick={onEnrolPregnancy}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Pregnancy Enrolment</span>
        </button>
      </div>

      {/* Safety Deck Rule Note (Section 8) */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Assistive Registry Guardrail:</strong> Continuum does not infer or diagnose clinical risk. Clinician-recorded flags (such as &ldquo;pregnancy flagged small&rdquo; or &ldquo;Rh-negative&rdquo;) are recorded as existing clinical inputs from the treating obstetrician to calculate surveillance interval milestones.
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Pregnancies List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {store.pregnancies.map(pr => {
            const isSelected = selectedPregnancy?.id === pr.id;
            return (
              <div
                key={pr.id}
                onClick={() => setSelectedPregnancy(pr)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/40 shadow-xs ring-1 ring-teal-600/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{pr.motherName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{pr.id}</span>
                  </div>
                  <span className="text-xs font-extrabold text-teal-900 bg-teal-100/70 px-2 py-0.5 rounded">
                    {pr.currentGestationalAgeWeeks} Weeks
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                  <span>LMP: {pr.lmpDate}</span>
                  <span>•</span>
                  <span>EDD: {pr.edd}</span>
                  <span>•</span>
                  <span>G{pr.gravida} P{pr.para}</span>
                </div>

                {pr.flags && pr.flags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pr.flags.map((f: string) => (
                      <span key={f} className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.2 rounded font-semibold border border-amber-200">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Pregnancy Timeline & Foetal Track */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                Selected Pregnancy Timeline
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedPregnancy.motherName} ({selectedPregnancy.currentGestationalAgeWeeks} Weeks)
              </h3>
            </div>
            <button
              onClick={() => {
                const mid = selectedPregnancy.motherId || selectedPregnancy.motherPatientId;
                if (mid) onViewPatientProfile(mid);
              }}
              className="px-3 py-1.5 text-xs text-teal-800 bg-teal-50 border border-teal-200 rounded-md font-semibold hover:bg-teal-100 cursor-pointer"
            >
              Full Longitudinal Profile →
            </button>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-3 pt-1 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">
              Chronological Foetal & Antenatal Pathway
            </h4>

            <div className="space-y-2.5">
              {milestones.map((m, idx) => (
                <div 
                  key={m.title}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    m.status.includes('Overdue')
                      ? 'bg-rose-50 border-rose-300'
                      : m.status === 'Completed'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      m.status === 'Completed'
                        ? 'bg-emerald-600 text-white'
                        : m.status.includes('Overdue')
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{m.title}</p>
                      <p className="text-[10px] text-slate-500">Expected: {m.window} • Rule: {m.ruleId}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      m.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.status.includes('Overdue')
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {m.status}
                    </span>
                    {m.date && <p className="text-[10px] text-slate-400 mt-0.5">{m.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
