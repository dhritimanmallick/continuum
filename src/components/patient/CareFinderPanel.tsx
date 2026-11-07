/**
 * Consultative care finder. The patient starts from what she needs (a check-up, a test,
 * a scan, delivery), sees the typical cost range, and double-clicks a need to see who in
 * the network offers it: doctors across hospitals, hospitals, labs, with price, distance,
 * scheme cover and open slots. Booking adds the visit to her home-screen check-ups.
 */
import React, { useMemo, useState } from 'react';
import { Stethoscope, FlaskConical, ScanLine, Baby, Search, MapPin, Star, ShieldCheck, CalendarPlus, X, Info, MessageCircle } from 'lucide-react';
import { CARE_NEEDS, CareNeed, CareProvider, NeedCategory, priceRange } from '../../services/careCatalogService';
import { multiHospitalConsentService } from '../../services/multiHospitalConsentService';

interface Props {
  mode: 'consult' | 'costs';
  onBooked?: (summary: string) => void;
  onAskDoctor?: () => void;
}

const CAT_ICON: Record<NeedCategory, React.ElementType> = {
  Consultation: Stethoscope, Test: FlaskConical, Scan: ScanLine, Delivery: Baby,
};
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const CareFinderPanel: React.FC<Props> = ({ mode, onBooked, onAskDoctor }) => {
  const cats: ('All' | NeedCategory)[] = mode === 'consult' ? ['Consultation'] : ['All', 'Consultation', 'Test', 'Scan', 'Delivery'];
  const [cat, setCat] = useState<'All' | NeedCategory>(mode === 'consult' ? 'Consultation' : 'All');
  const [query, setQuery] = useState('');
  const [openNeed, setOpenNeed] = useState<CareNeed | null>(mode === 'consult' ? CARE_NEEDS[0] : null);
  const [selectedId, setSelectedId] = useState<string | null>(mode === 'consult' ? CARE_NEEDS[0].id : null);
  const [sortBy, setSortBy] = useState<'price' | 'distance'>('distance');
  const [schemeOnly, setSchemeOnly] = useState(false);
  const [booked, setBooked] = useState<string | null>(null);

  const needs = CARE_NEEDS.filter(n =>
    (cat === 'All' || n.category === cat) &&
    (!query.trim() || `${n.name} ${n.whenNeeded}`.toLowerCase().includes(query.toLowerCase()))
  );

  const providers = useMemo(() => {
    if (!openNeed) return [];
    return openNeed.providers
      .filter(p => !schemeOnly || p.schemes.length > 0)
      .sort((a, b) => sortBy === 'price' ? a.price - b.price : a.distanceKm - b.distanceKm);
  }, [openNeed, sortBy, schemeOnly]);

  const book = (need: CareNeed, p: CareProvider, slot?: string) => {
    const d = new Date(); d.setDate(d.getDate() + (p.kind === 'Lab' ? 1 : 2));
    const apt = multiHospitalConsentService.bookAppointment({
      hospitalId: p.hospitalId || p.id,
      hospitalName: p.kind === 'Lab' ? p.name : undefined,
      doctorName: p.kind === 'Doctor' ? p.name : p.kind === 'Lab' ? 'Lab visit' : 'Admissions desk',
      serviceType: need.name,
      date: d.toISOString().slice(0, 10),
      slot: slot || (p.kind === 'Lab' ? '08:00 AM (fasting)' : p.slots?.[0] || '10:30 AM'),
    });
    const msg = `${need.name} booked with ${p.name} on ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${apt.slot}. It's now on your home screen.`;
    setBooked(msg);
    onBooked?.(msg);
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            {mode === 'consult' ? 'Consult a doctor' : 'What do you need?'}
          </h2>
          <p className="text-slate-500 mt-0.5">
            {mode === 'consult'
              ? 'Doctors across hospitals in your area. Pick a reason for your visit; your ABHA records go with you to any of them.'
              : 'Start from what you need. Double-click any item to see who offers it, what it costs and what is covered.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {mode === 'costs' && (
            <div className="relative sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search a test, scan or visit…"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-rose-400 focus:outline-none"
              />
            </div>
          )}
          {cats.length > 1 && (
            <div className="flex flex-wrap gap-1.5 font-bold">
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${cat === c ? 'bg-rose-700 text-white' : 'bg-white text-slate-600 border border-rose-200 hover:bg-rose-50'}`}>
                  {c === 'All' ? 'Everything' : c === 'Test' ? 'Tests' : c === 'Scan' ? 'Scans' : c === 'Consultation' ? 'Consultations' : c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {booked && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center justify-between gap-2">
          <span>✓ {booked}</span>
          <button onClick={() => setBooked(null)} className="cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Needs */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${mode === 'consult' ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-3`}>
        {needs.map(n => {
          const Icon = CAT_ICON[n.category];
          const r = priceRange(n);
          const covered = n.providers.some(p => p.schemes.length);
          const isOpen = openNeed?.id === n.id;
          const isSel = selectedId === n.id;
          return (
            <div
              key={n.id}
              role="button"
              tabIndex={0}
              onClick={() => { setSelectedId(n.id); if (mode === 'consult') setOpenNeed(n); }}
              onDoubleClick={() => { setSelectedId(n.id); setOpenNeed(n); }}
              onKeyDown={e => { if (e.key === 'Enter') { setSelectedId(n.id); setOpenNeed(n); } }}
              className={`text-left bg-white p-4 rounded-2xl border shadow-2xs transition cursor-pointer select-none space-y-2 ${
                isOpen ? 'border-rose-500 ring-2 ring-rose-100' : isSel ? 'border-rose-300' : 'border-slate-200 hover:border-rose-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                {covered && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">Scheme options</span>}
              </div>
              <div className="font-extrabold text-slate-900 text-sm leading-snug">{n.name}</div>
              <div className="text-slate-500 leading-snug">{n.whenNeeded}</div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-black text-slate-900">{r.count ? (r.min === r.max ? inr(r.min) : `${inr(r.min)} – ${inr(r.max)}`) : '—'}</span>
                <span className="text-[11px] text-slate-500">{r.count} option{r.count === 1 ? '' : 's'}</span>
              </div>
              {mode === 'costs' && (
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setSelectedId(n.id); setOpenNeed(n); }}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-700 font-bold transition cursor-pointer sm:hidden"
                >See who offers this</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Providers for the opened need */}
      {openNeed && (
        <div className="bg-white rounded-3xl border border-rose-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-rose-100 flex flex-col lg:flex-row lg:items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">{openNeed.category}</div>
              <h3 className="text-base font-black text-slate-900">{openNeed.name}</h3>
              <p className="text-slate-600 mt-1 flex items-start gap-1.5 max-w-2xl"><Info className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />{openNeed.consider}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 font-bold">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                {(['distance', 'price'] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${sortBy === s ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}>
                    {s === 'distance' ? 'Nearest' : 'Lowest cost'}
                  </button>
                ))}
              </div>
              {openNeed.providers.some(p => p.schemes.length) && (
                <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 cursor-pointer">
                  <input type="checkbox" checked={schemeOnly} onChange={e => setSchemeOnly(e.target.checked)} className="accent-emerald-700" />
                  PM-JAY / JSSK only
                </label>
              )}
              {mode === 'costs' && (
                <button onClick={() => setOpenNeed(null)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer" title="Close"><X className="w-4 h-4" /></button>
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {providers.length === 0 && <div className="p-6 text-center text-slate-500 font-semibold">No options match. Try removing the scheme filter.</div>}
            {providers.map(p => (
              <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3 hover:bg-rose-50/30 transition">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-sm">{p.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{p.kind}</span>
                    {p.schemes.map(s => (
                      <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />{s}
                      </span>
                    ))}
                  </div>
                  <div className="text-slate-500 mt-0.5 truncate">{p.detail}</div>
                  <div className="text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" />{p.place} · {p.distanceKm} km</span>
                    {p.rating && <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-400" />{p.rating}</span>}
                  </div>
                  {p.slots && p.slots.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.slots.slice(0, 4).map(s => (
                        <button key={s} onClick={() => book(openNeed, p, s)}
                          className="px-2 py-0.5 rounded-lg border border-rose-200 text-rose-800 font-bold hover:bg-rose-600 hover:text-white transition cursor-pointer">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                  <div className="md:text-right">
                    <div className="text-base font-black text-slate-900">{inr(p.price)}</div>
                    <div className="text-[11px] text-slate-500">{p.priceNote}{p.kind === 'Lab' ? ' · indicative' : ''}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {onAskDoctor && p.kind !== 'Lab' && (
                      <button onClick={onAskDoctor} className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer inline-flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />Ask
                      </button>
                    )}
                    <button onClick={() => book(openNeed, p)} className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold transition cursor-pointer inline-flex items-center gap-1">
                      <CalendarPlus className="w-3.5 h-3.5" />Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-100">
            Prices are estimates shared by each provider; the final bill depends on your care. Ask before you book if anything is unclear.
          </div>
        </div>
      )}
    </div>
  );
};
