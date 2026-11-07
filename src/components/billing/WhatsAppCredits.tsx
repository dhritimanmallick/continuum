/**
 * WhatsApp credit UI for OPDs. Continuum is free; only WhatsApp messages are charged,
 * from a prepaid credit (₹1,000 starter credit for 3 months, then top-ups).
 */
import React, { useEffect, useState } from 'react';
import { MessageCircle, Wallet, CalendarClock, Plus, ShieldCheck, Info, CheckCircle2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { whatsappAccount } from '../../services/whatsappGateway';
import { isNativeApp } from '../../services/apiBase';
import { WhatsAppAccount, TOP_UP_OPTIONS_INR, STARTER_CREDIT_INR, STARTER_CREDIT_DAYS, inr } from '../../services/whatsappPricing';

export function useWhatsAppAccount(): WhatsAppAccount | null {
  const [a, setA] = useState<WhatsAppAccount | null>(whatsappAccount.get());
  useEffect(() => {
    const off = whatsappAccount.subscribe(setA);
    whatsappAccount.refresh();
    return off;
  }, []);
  return a;
}

const daysLeft = (iso: string) => Math.max(0, Math.ceil((Date.parse(iso) - Date.now()) / 864e5));

/** One-line balance strip shown above the care-gap list. */
export const WhatsAppCreditBadge: React.FC<{ account: WhatsAppAccount | null; onManage?: () => void }> = ({ account, onManage }) => {
  if (!account) return null;
  const low = account.balance < account.pricePerMessage * 50;
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${low ? 'bg-amber-50 border-amber-300' : 'bg-white border-emerald-200'}`}>
      <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0"><MessageCircle className="w-5 h-5" /></span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-extrabold text-slate-900">
          WhatsApp credit {inr(account.balance)}
          <span className="font-semibold text-slate-500"> · about {Math.floor(account.balance / account.pricePerMessage).toLocaleString('en-IN')} messages</span>
        </span>
        <span className="block text-xs text-slate-500">
          {inr(account.pricePerMessage)} per message{account.starterCredit > 0 ? ` · starter credit ends in ${daysLeft(account.starterExpiresAt)} days` : ''}
          {account.mode === 'simulated' ? ' · demo mode' : ''}
        </span>
      </span>
      {onManage && (
        <button type="button" onClick={onManage} className="shrink-0 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer">
          {low ? 'Top up' : 'Manage'}
        </button>
      )}
    </div>
  );
};

/** Full page: balance, how pricing works, top-up and recent usage. */
export const WhatsAppCreditsPanel: React.FC = () => {
  const account = useWhatsAppAccount();
  const [busy, setBusy] = useState<number | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const topUp = async (amt: number) => {
    if (!window.confirm(`Add ${inr(amt)} of WhatsApp credit? In this demo the UPI payment is simulated.`)) return;
    setBusy(amt);
    const r = await whatsappAccount.topUp(amt);
    setBusy(null);
    setDone(r.ok ? `${inr(amt)} added to your WhatsApp credit.` : `Top-up failed: ${r.error}`);
  };

  if (!account) {
    return <div className="bg-white rounded-2xl border border-slate-200 p-6 text-sm text-slate-500">Loading WhatsApp credit…</div>;
  }
  const starterDays = daysLeft(account.starterExpiresAt);

  return (
    <div className="space-y-4">
      {/* Balance */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold uppercase tracking-wider">
          <Wallet className="w-4 h-4" /> WhatsApp credit · {account.facilityName}
        </div>
        <div className="mt-2 text-4xl font-black">{inr(account.balance)}</div>
        <div className="text-sm text-emerald-100 mt-1">
          About {Math.floor(account.balance / account.pricePerMessage).toLocaleString('en-IN')} messages at {inr(account.pricePerMessage)} each
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div className="rounded-xl bg-white/10 px-3 py-2">
            <div className="text-[11px] text-emerald-100 font-bold uppercase">Starter credit</div>
            <div className="font-extrabold">{inr(account.starterCredit)}</div>
            <div className="text-[11px] text-emerald-100">{account.starterCredit > 0 ? `${starterDays} days left` : 'Used or expired'}</div>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-2">
            <div className="text-[11px] text-emerald-100 font-bold uppercase">Paid balance</div>
            <div className="font-extrabold">{inr(account.paidBalance)}</div>
            <div className="text-[11px] text-emerald-100">Does not expire</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-emerald-100">
          This month: {account.messagesThisMonth.toLocaleString('en-IN')} messages · {inr(account.spentThisMonth)}
        </div>
      </section>

      {done && (
        <div role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {done}
        </div>
      )}

      {/* Top up. In the Android app credit is added from the web dashboard (Play payments policy). */}
      {isNativeApp() ? (
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-700" /> Add credit</h2>
          <p className="text-sm text-slate-600 mt-2">Credit is added by your hospital administrator from the Continuum web dashboard on a computer. Your balance updates here straight away.</p>
        </section>
      ) : (
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-700" /> Add credit</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          {TOP_UP_OPTIONS_INR.map(a => (
            <button key={a} type="button" disabled={busy !== null} onClick={() => topUp(a)}
              className="py-3.5 rounded-xl border-2 border-emerald-600 text-emerald-800 font-black text-base hover:bg-emerald-50 active:bg-emerald-100 disabled:opacity-50 cursor-pointer">
              {busy === a ? 'Adding…' : inr(a)}
              <span className="block text-[11px] font-semibold text-slate-500">≈ {Math.floor(a / account.pricePerMessage).toLocaleString('en-IN')} msgs</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">Pay by UPI or card. In this demo the payment step is simulated.</p>
      </section>
      )}

      {/* How it works */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2"><Info className="w-4 h-4 text-sky-700" /> How WhatsApp charges work</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Continuum is free for OPDs. Only WhatsApp messages are charged.</li>
          <li className="flex gap-2"><CalendarClock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Every OPD starts with {inr(STARTER_CREDIT_INR)} of credit, usable for {STARTER_CREDIT_DAYS / 30} months.</li>
          <li className="flex gap-2"><MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Each reminder, prescription or update sent on WhatsApp costs {inr(account.pricePerMessage)}. Messages that fail are not charged.</li>
          <li className="flex gap-2"><Wallet className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Starter credit is used first. Credit you add never expires. If credit runs out, messages wait until you top up.</li>
        </ul>
        <p className="text-xs text-slate-500 mt-3">
          Sent through {account.provider}{account.mode === 'simulated' ? ', running in demo mode (no real messages are sent)' : ''}. Patients receive messages only after giving consent at registration.
        </p>
      </section>

      {/* Ledger */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
        <h2 className="text-base font-extrabold text-slate-900">Recent activity</h2>
        <ul className="mt-2 divide-y divide-slate-100">
          {account.ledger.slice(0, 20).map(l => (
            <li key={l.id} className="py-2.5 flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${l.amount >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {l.amount >= 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-slate-800 truncate">
                  {l.kind === 'message' ? `WhatsApp to ${l.to ? `+${l.to}` : 'patient'}` : l.note}
                </span>
                <span className="block text-[11px] text-slate-500 truncate">
                  {new Date(l.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  {l.kind === 'message' ? ` · ${l.status || ''} · ${l.note}` : ''}
                </span>
              </span>
              <span className={`text-sm font-extrabold ${l.amount >= 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                {l.amount >= 0 ? '+' : '−'}{inr(Math.abs(l.amount))}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
