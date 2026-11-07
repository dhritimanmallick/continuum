import React, { useState } from 'react';
import { Search, MessageSquare, Eye, FlaskConical, Pill, CalendarClock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { OpdPatient } from '../../types';
import { getCareGapNudges, lastNudge, sendNudge, NudgeCategory, CareGapNudge } from '../../services/careGapNudges';

interface CareGapNudgesPanelProps {
  patients: OpdPatient[];
  scopeLabel: string;
  sentBy: string;
  onOpenWhatsAppView: (patientId?: string) => void;
  onSelectPatient?: (patient: OpdPatient) => void;
}

const CAT: Record<NudgeCategory, { label: string; icon: React.ElementType; chip: string }> = {
  TESTING: { label: 'Testing', icon: FlaskConical, chip: 'bg-purple-100 text-purple-900 border-purple-300' },
  PHARMACY: { label: 'Pharmacy', icon: Pill, chip: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  ADHERENCE: { label: 'Adherence', icon: CalendarClock, chip: 'bg-amber-100 text-amber-900 border-amber-300' },
};

export const CareGapNudgesPanel: React.FC<CareGapNudgesPanelProps> = ({
  patients, scopeLabel, sentBy, onOpenWhatsAppView, onSelectPatient
}) => {
  const [filter, setFilter] = useState<'ALL' | NudgeCategory>('ALL');
  const [hideNudged, setHideNudged] = useState(false);
  const [query, setQuery] = useState('');

  const all = getCareGapNudges(patients);
  const count = (c: NudgeCategory) => all.filter(n => n.category === c).length;
  const pending = all.filter(n => !lastNudge(n));

  const rows = all.filter(n => {
    if (filter !== 'ALL' && n.category !== filter) return false;
    if (hideNudged && lastNudge(n)) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return n.patient.name.toLowerCase().includes(q) || n.patient.mobile.includes(q) || n.title.toLowerCase().includes(q);
    }
    return true;
  });

  const nudgeAll = () => {
    if (!pending.length) return;
    if (window.confirm(`Send ${pending.length} WhatsApp nudge${pending.length > 1 ? 's' : ''} to patients not yet contacted?`)) {
      pending.forEach(n => sendNudge(n, sentBy));
    }
  };

  const tiles: { id: 'ALL' | NudgeCategory; label: string; value: number; color: string }[] = [
    { id: 'TESTING', label: 'Tests to give / reports to review', value: count('TESTING'), color: 'text-purple-700' },
    { id: 'PHARMACY', label: 'Medicines not collected', value: count('PHARMACY'), color: 'text-emerald-700' },
    { id: 'ADHERENCE', label: 'Follow-ups & vaccinations', value: count('ADHERENCE'), color: 'text-amber-600' },
    { id: 'ALL', label: 'Not yet nudged', value: pending.length, color: 'text-rose-700' },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* KPI tiles (click to filter) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tiles.map(t => (
          <button
            key={t.label}
            onClick={() => { setFilter(t.id); setHideNudged(t.label === 'Not yet nudged'); }}
            className={`text-left bg-white p-4 rounded-2xl border shadow-2xs transition cursor-pointer ${
              filter === t.id && (t.label === 'Not yet nudged') === hideNudged ? 'border-rose-400 ring-2 ring-rose-100' : 'border-rose-100 hover:border-rose-300'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t.label}</span>
            <span className={`text-2xl font-black mt-1 block ${t.color}`}>{t.value}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-rose-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 font-bold">
            {(['ALL', 'TESTING', 'PHARMACY', 'ADHERENCE'] as const).map(c => (
              <button
                key={c}
                onClick={() => { setFilter(c); setHideNudged(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                  filter === c && !hideNudged ? 'bg-rose-700 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-rose-100/60 border border-rose-200'
                }`}
              >
                {c === 'ALL' ? `All (${all.length})` : `${CAT[c].label} (${count(c)})`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-rose-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, mobile, test..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-rose-50/40 border border-rose-200 rounded-xl text-xs font-medium focus:bg-white focus:border-rose-400 focus:outline-none"
              />
            </div>
            <button
              onClick={nudgeAll}
              disabled={!pending.length}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nudge all pending ({pending.length})</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-2 bg-rose-50/40 text-[11px] text-rose-900 font-semibold border-b border-rose-100">
          {scopeLabel}: patients with an ordered test, prescription or scheduled visit that has not happened yet. Messages go in the patient's preferred language.
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-rose-50/50 text-rose-900 font-bold border-b border-rose-100 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-3">Care Gap</th>
                <th className="py-3 px-4">Why it is flagged</th>
                <th className="py-3 px-3">Since</th>
                <th className="py-3 px-3">Nudge</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {rows.map((n: CareGapNudge) => {
                const meta = CAT[n.category];
                const Icon = meta.icon;
                const sent = lastNudge(n);
                return (
                  <tr key={n.key} className="hover:bg-rose-50/40 transition align-top">
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 block">{n.patient.name}</span>
                      <span className="text-[11px] text-slate-500 block">{n.patient.isNewborn ? 'Newborn' : `${n.patient.age} yrs`} • {n.patient.opdId}</span>
                      <span className="text-[11px] text-slate-500">📞 {n.patient.mobile} • {n.patient.preferredLanguage || 'English'}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border inline-flex items-center gap-1 ${meta.chip}`}>
                        <Icon className="w-3 h-3" />{meta.label}
                      </span>
                      <span className="font-bold text-slate-800 block mt-1">{n.title}</span>
                      {n.urgent && (
                        <span className="text-[10px] text-rose-700 font-bold inline-flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3" /> Priority
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-600">{n.reason}</td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">{n.since || '—'}</td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {sent ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-emerald-100 text-emerald-900 border-emerald-300 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Sent {sent}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-amber-100 text-amber-900 border-amber-300">
                          Not nudged
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onSelectPatient && (
                          <button
                            onClick={() => onSelectPatient(n.patient)}
                            className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-900 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition shadow-2xs whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5 text-rose-600" /><span>Profile</span>
                          </button>
                        )}
                        <button
                          onClick={() => sendNudge(n, sentBy)}
                          title={n.message}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition shadow-2xs whitespace-nowrap"
                        >
                          <Send className="w-3.5 h-3.5" /><span>{sent ? 'Nudge again' : 'Send nudge'}</span>
                        </button>
                        <button
                          onClick={() => onOpenWhatsAppView(n.patient.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition shadow-2xs whitespace-nowrap"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" /><span>Chat</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr><td colSpan={6} className="py-10 text-center text-slate-500 font-semibold">No care gaps to nudge in this view.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
