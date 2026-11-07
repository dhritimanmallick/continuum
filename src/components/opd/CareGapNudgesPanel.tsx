import React, { useState } from 'react';
import { WhatsAppCreditBadge, useWhatsAppAccount } from '../billing/WhatsAppCredits';
import { inr } from '../../services/whatsappPricing';
import { Search, MessageSquare, Eye, FlaskConical, Pill, CalendarClock, Send, CheckCircle2, AlertCircle, Phone } from 'lucide-react';
import { OpdPatient } from '../../types';
import { getCareGapNudges, lastNudge, sendNudge, NudgeCategory, CareGapNudge } from '../../services/careGapNudges';

interface CareGapNudgesPanelProps {
  patients: OpdPatient[];
  scopeLabel: string;
  sentBy: string;
  onOpenWhatsAppView: (patientId?: string) => void;
  onSelectPatient?: (patient: OpdPatient) => void;
  onOpenCredits?: () => void;
}

const CAT: Record<NudgeCategory, { label: string; icon: React.ElementType; chip: string }> = {
  TESTING: { label: 'Testing', icon: FlaskConical, chip: 'bg-purple-100 text-purple-900 border-purple-300' },
  PHARMACY: { label: 'Pharmacy', icon: Pill, chip: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  ADHERENCE: { label: 'Adherence', icon: CalendarClock, chip: 'bg-amber-100 text-amber-900 border-amber-300' },
};

export const CareGapNudgesPanel: React.FC<CareGapNudgesPanelProps> = ({
  patients, scopeLabel, sentBy, onOpenWhatsAppView, onSelectPatient, onOpenCredits
}) => {
  const account = useWhatsAppAccount();
  const [notice, setNotice] = useState<{ tone: 'ok' | 'warn'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<'ALL' | NudgeCategory>('ALL');
  const [hideNudged, setHideNudged] = useState(false);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<'ALL' | 'SCHEDULE' | 'ORDERS'>('ALL');

  const all = getCareGapNudges(patients);
  const count = (c: NudgeCategory) => all.filter(n => n.category === c).length;
  const pending = all.filter(n => !lastNudge(n));

  const rows = all.filter(n => {
    if (filter !== 'ALL' && n.category !== filter) return false;
    if (hideNudged && lastNudge(n)) return false;
    if (source === 'SCHEDULE' && !n.ruleId) return false;
    if (source === 'ORDERS' && n.ruleId) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return n.patient.name.toLowerCase().includes(q) || n.patient.mobile.includes(q) || n.title.toLowerCase().includes(q);
    }
    return true;
  });

  const one = async (n: CareGapNudge) => {
    const r = await sendNudge(n, sentBy);
    setNotice(r.ok
      ? { tone: 'ok', text: `Reminder sent to ${n.patient.name.split(' ')[0]} on WhatsApp${account ? ` · ${inr(account.pricePerMessage)} used` : ''}.` }
      : { tone: 'warn', text: r.message || 'Not sent.' });
  };

  const nudgeAll = async () => {
    if (!pending.length || busy) return;
    const cost = account ? ` This uses about ${inr(pending.length * account.pricePerMessage)} of WhatsApp credit (balance ${inr(account.balance)}).` : '';
    if (!window.confirm(`Send ${pending.length} WhatsApp reminder${pending.length > 1 ? 's' : ''} to patients not yet contacted?${cost}`)) return;
    setBusy(true);
    let sent = 0;
    for (const n of pending) {
      const r = await sendNudge(n, sentBy);
      if (r.ok) sent++;
      else if (r.reason === 'insufficient_credit') {
        setBusy(false);
        setNotice({ tone: 'warn', text: `${sent} sent, then WhatsApp credit ran out. Top up to send the remaining ${pending.length - sent}.` });
        return;
      }
    }
    setBusy(false);
    setNotice({ tone: 'ok', text: `${sent} of ${pending.length} reminders sent on WhatsApp.` });
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
            className={`text-left bg-white p-3 sm:p-4 rounded-2xl border shadow-2xs transition cursor-pointer ${
              filter === t.id && (t.label === 'Not yet nudged') === hideNudged ? 'border-rose-400 ring-2 ring-rose-100' : 'border-rose-100 hover:border-rose-300'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t.label}</span>
            <span className={`text-xl sm:text-2xl font-black mt-1 block ${t.color}`}>{t.value}</span>
          </button>
        ))}
      </div>

      <WhatsAppCreditBadge account={account} onManage={onOpenCredits} />
      {notice && (
        <div role="status" className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-start justify-between gap-3 ${
          notice.tone === 'ok' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-300'
        }`}>
          <span>{notice.text}</span>
          {notice.tone === 'warn' && onOpenCredits && (
            <button type="button" onClick={onOpenCredits} className="shrink-0 underline font-bold cursor-pointer">Top up</button>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-3 sm:p-4 border-b border-rose-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 font-bold overflow-x-auto -mx-1 px-1 pb-1 sm:pb-0">
            {(['ALL', 'TESTING', 'PHARMACY', 'ADHERENCE'] as const).map(c => (
              <button
                key={c}
                onClick={() => { setFilter(c); setHideNudged(false); }}
                className={`shrink-0 px-3 py-2 sm:py-1.5 rounded-xl text-xs transition cursor-pointer ${
                  filter === c && !hideNudged ? 'bg-rose-700 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-rose-100/60 border border-rose-200'
                }`}
              >
                {c === 'ALL' ? `All (${all.length})` : `${CAT[c].label} (${count(c)})`}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:flex sm:items-center gap-2">
            <select
              value={source}
              onChange={e => setSource(e.target.value as typeof source)}
              title="Where the gap comes from"
              className="py-3 sm:py-2 px-2.5 bg-white border border-rose-200 rounded-xl text-sm sm:text-xs font-bold text-slate-700 focus:outline-none focus:border-rose-400"
            >
              <option value="ALL">All sources</option>
              <option value="SCHEDULE">Due by care schedule ({all.filter(n => n.ruleId).length})</option>
              <option value="ORDERS">Orders &amp; visits ({all.filter(n => !n.ruleId).length})</option>
            </select>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-rose-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, mobile, test..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-3 sm:py-2 bg-rose-50/40 border border-rose-200 rounded-xl text-base sm:text-xs font-medium focus:bg-white focus:border-rose-400 focus:outline-none"
              />
            </div>
            <button
              onClick={nudgeAll}
              disabled={!pending.length}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{busy ? 'Sending…' : `Nudge all pending (${pending.length})`}</span>
            </button>
          </div>
        </div>

        <div className="hidden sm:block px-4 py-2 bg-rose-50/40 text-[11px] text-rose-900 font-semibold border-b border-rose-100">
          {scopeLabel}: patients with an ordered test, prescription or scheduled visit that has not happened yet, plus tests, scans and visits the care-schedule rules say are due for her pregnancy week or days after delivery. Messages go in the patient's preferred language.
        </div>

        {/* Phone: one card per care gap */}
        <ul className="md:hidden divide-y divide-rose-50">
          {rows.map((n: CareGapNudge) => {
            const meta = CAT[n.category];
            const Icon = meta.icon;
            const sent = lastNudge(n);
            return (
              <li key={n.key} className="p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <button type="button" onClick={() => onSelectPatient?.(n.patient)} className="text-left min-w-0 cursor-pointer">
                    <span className="block text-base font-extrabold text-slate-900 truncate">{n.patient.name}</span>
                    <span className="block text-xs text-slate-500">
                      {n.patient.isNewborn ? 'Newborn' : `${n.patient.age} yrs`} · {n.patient.preferredLanguage || 'English'}
                    </span>
                  </button>
                  {sent ? (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border bg-emerald-100 text-emerald-900 border-emerald-300 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sent {sent}
                    </span>
                  ) : (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border bg-amber-100 text-amber-900 border-amber-300">Not nudged</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border inline-flex items-center gap-1 ${meta.chip}`}>
                    <Icon className="w-3 h-3" />{meta.label}
                  </span>
                  {n.ruleId && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-sky-50 text-sky-800 border-sky-200 inline-flex items-center gap-1">
                      <CalendarClock className="w-3 h-3" />Schedule · {n.ruleId}
                    </span>
                  )}
                  {n.urgent && (
                    <span className="text-[10px] text-rose-700 font-bold inline-flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Priority</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{n.title}</p>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-3">{n.reason}</p>
                  {n.since && <p className="text-[11px] text-slate-400 mt-0.5">{n.since}</p>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <a href={`tel:${n.patient.mobile.replace(/\s/g, '')}`} className="flex items-center justify-center gap-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-800 active:bg-slate-50">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <button type="button" onClick={() => onOpenWhatsAppView(n.patient.id)} className="flex items-center justify-center gap-1 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-[13px] font-bold cursor-pointer">
                    <MessageSquare className="w-4 h-4" /> Chat
                  </button>
                  <button type="button" onClick={() => one(n)} className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white text-[13px] font-bold cursor-pointer">
                    <Send className="w-4 h-4" /> {sent ? 'Again' : 'Nudge'}
                  </button>
                </div>
              </li>
            );
          })}
          {!rows.length && <li className="py-10 text-center text-slate-500 font-semibold">No care gaps to nudge in this view.</li>}
        </ul>

        {/* Table */}
        <div className="hidden md:block overflow-x-auto">
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
                      {n.ruleId && (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-sky-50 text-sky-800 border-sky-200 inline-flex items-center gap-1" title="Comes from the clinic's care-schedule rules for this patient's pregnancy week or days after delivery">
                          <CalendarClock className="w-3 h-3" />Schedule · {n.ruleId}
                        </span>
                      )}
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
                          onClick={() => one(n)}
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
