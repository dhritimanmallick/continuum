/**
 * The doctor's own journey: what they have done for their patients, not the patients' journeys.
 * Everything is counted from records already in the OPD store for this doctor's patients.
 */
import React from 'react';
import { Stethoscope, FlaskConical, FileCheck2, Pill, CalendarCheck, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import { OpdPatient } from '../../types';
import { opdStore } from '../../services/opdStore';

interface Props {
  doctorName: string;
  patients: OpdPatient[];
  onOpenPatient: (p: OpdPatient) => void;
}

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

export const DoctorPracticeJourney: React.FC<Props> = ({ doctorName, patients, onOpenPatient }) => {
  const seen = patients.filter(p => p.queueStatus === 'Completed' || !!p.assessmentOutcome);
  const refs = patients.flatMap(p => (p.labReferrals || []).map(r => ({ p, r })));
  const reportsBack = refs.filter(({ r }) => /REPORT READY|REVIEWED/i.test(String(r.status)));
  const reviewed = refs.filter(({ r }) => r.reviewedByDoctor || /REVIEWED/i.test(String(r.status)));
  const rx = patients.flatMap(p => p.pharmacyOrders || []);
  const dispensed = rx.filter(o => o.status === 'DISPENSED');
  const withFollowUp = patients.filter(p => p.followUpStatus && p.followUpStatus !== 'Not Required');
  const kept = withFollowUp.filter(p => p.followUpStatus === 'Attended');
  const overdue = withFollowUp.filter(p => p.followUpStatus === 'Overdue');

  const tiles = [
    { icon: Stethoscope, label: 'Patients seen', value: `${seen.length}`, sub: `of ${patients.length} registered`, color: 'text-rose-700' },
    { icon: FlaskConical, label: 'Tests ordered', value: `${refs.length}`, sub: `${reportsBack.length} reports back`, color: 'text-purple-700' },
    { icon: FileCheck2, label: 'Reports reviewed', value: `${reviewed.length}/${reportsBack.length || 0}`, sub: `${pct(reviewed.length, reportsBack.length)}% of returned reports`, color: 'text-indigo-700' },
    { icon: Pill, label: 'Prescriptions dispensed', value: `${dispensed.length}/${rx.length}`, sub: `${pct(dispensed.length, rx.length)}% collected`, color: 'text-emerald-700' },
    { icon: CalendarCheck, label: 'Follow-ups kept', value: `${kept.length}/${withFollowUp.length}`, sub: `${overdue.length} overdue`, color: 'text-amber-600' },
  ];

  const attention: { p: OpdPatient; what: string }[] = [
    ...refs.filter(({ r }) => /REPORT READY/i.test(String(r.status)) && !r.reviewedByDoctor).map(({ p, r }) => ({ p, what: `${r.testName}: report ready to review` })),
    ...overdue.map(p => ({ p, what: `Follow-up overdue${p.followUpDate ? ` (${p.followUpDate})` : ''}` })),
  ];

  const milestones = opdStore.getDoctorAchievements(doctorName);

  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">My practice journey</div>
        <h2 className="text-xl font-bold text-slate-900 mt-0.5">{doctorName}</h2>
        <p className="text-slate-500 mt-1">What you have closed for your patients: consultations, tests, prescriptions and follow-ups.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {tiles.map(t => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Icon className="w-3.5 h-3.5" />{t.label}
              </div>
              <div className={`text-2xl font-black mt-1 ${t.color}`}>{t.value}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{t.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm"><Award className="w-4 h-4 text-amber-500" />Practice milestones</div>
          {milestones.map(m => {
            const isRate = m.metricTarget === 85;
            const progress = isRate ? Math.min(100, Math.round((m.metricCurrent / 100) * 100)) : pct(m.metricCurrent, m.metricTarget);
            return (
              <div key={m.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    {m.earned ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <span className="w-4 h-4 rounded-full border-2 border-slate-300 inline-block" />}
                    {m.title}
                  </span>
                  <span className="text-slate-500 font-semibold whitespace-nowrap">
                    {isRate ? `${m.metricCurrent}% (target ${m.metricTarget}%)` : `${m.metricCurrent} / ${m.metricTarget}`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${m.earned ? 'bg-emerald-500' : 'bg-rose-400'}`} style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[11px] text-slate-500">{m.criteria}</p>
              </div>
            );
          })}
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
          <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm"><AlertCircle className="w-4 h-4 text-rose-600" />Needs your attention</div>
          {attention.length === 0 && <p className="text-slate-500">Nothing pending.</p>}
          {attention.map((a, i) => (
            <button
              key={i}
              onClick={() => onOpenPatient(a.p)}
              className="w-full text-left flex items-center justify-between gap-3 p-3 rounded-xl border border-rose-100 hover:bg-rose-50 transition cursor-pointer"
            >
              <span>
                <span className="font-bold text-slate-900 block">{a.p.name}</span>
                <span className="text-slate-600">{a.what}</span>
              </span>
              <span className="text-rose-700 font-bold whitespace-nowrap">Open →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
