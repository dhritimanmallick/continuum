/**
 * Landing screen: pick one of the six profiles. Each tile opens that profile's own
 * interface; every interface has an "All profiles" button that returns here.
 */
import React, { useState } from 'react';
import { isNativeApp } from '../../services/apiBase';
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import { PROFILE_META, PROFILE_ORDER, ProfileKey } from './profiles';

interface ProfileHomeProps {
  onOpen: (profile: ProfileKey) => void;
  onStaffSignIn?: () => void;
}

/** The Android app opens on two big choices; the web demo shows all six profiles. */
const APP_MODE = ((import.meta as any).env?.VITE_APP_MODE as string) || '';

export const ProfileHome: React.FC<ProfileHomeProps> = (props) =>
  APP_MODE === 'android' || isNativeApp() ? <AppEntry {...props} /> : <AllProfiles {...props} />;

const AppEntry: React.FC<ProfileHomeProps> = ({ onOpen }) => {
  const [more, setMore] = useState(false);
  const Big = ({ k, title, sub }: { k: ProfileKey; title: string; sub: string }) => {
    const m = PROFILE_META[k];
    const Icon = m.icon;
    return (
      <button type="button" data-profile={k} onClick={() => onOpen(k)}
        className="w-full text-left rounded-3xl bg-white border border-slate-200 shadow-sm active:scale-[0.99] transition p-5 flex items-center gap-4 cursor-pointer">
        <span className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.tile} text-white flex items-center justify-center shrink-0 shadow-sm`}>
          <Icon className="w-8 h-8" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-xl font-black text-slate-900">{title}</span>
          <span className="block text-sm text-slate-500 mt-0.5">{sub}</span>
        </span>
        <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
      </button>
    );
  };
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-[#eef3f9] text-slate-900 font-sans flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex-1 max-w-md w-full mx-auto px-5 py-8 flex flex-col">
        <img src="/vyuhaa-logo.png" alt="Vyuhaa" className="h-10 w-auto object-contain self-start" />
        <h1 className="mt-10 text-3xl font-black tracking-tight text-[#1e3a5f] leading-tight">Care for mother and baby, all in one place</h1>
        <p className="mt-3 text-base text-slate-600">Who is using Continuum?</p>
        <div className="mt-6 space-y-4">
          <Big k="MOTHER" title="I'm a mother or family member" sub="Check-ups, doctors, costs and records" />
          <Big k="FRONT_DESK" title="I work at an OPD" sub="Queue, registration and WhatsApp reminders" />
        </div>
        <button type="button" onClick={() => setMore(v => !v)} className="mt-6 self-center text-sm font-bold text-[#2f5f93] py-2 cursor-pointer">
          {more ? 'Hide other staff profiles' : 'Doctor, lab, pharmacy or admin?'}
        </button>
        {more && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {(['DOCTOR', 'LAB', 'PHARMACY', 'ADMIN'] as ProfileKey[]).map(k => {
              const m = PROFILE_META[k];
              const Icon = m.icon;
              return (
                <button key={k} type="button" data-profile={k} onClick={() => onOpen(k)}
                  className="rounded-2xl bg-white border border-slate-200 p-4 text-left cursor-pointer active:bg-slate-50">
                  <Icon className="w-6 h-6 text-slate-700" />
                  <span className="block mt-2 text-sm font-extrabold text-slate-900">{m.label}</span>
                </button>
              );
            })}
          </div>
        )}
        <p className="mt-auto pt-8 text-xs text-slate-500 text-center leading-relaxed">
          Continuum is not a medical device and does not diagnose or treat any condition. Always consult your doctor. In an emergency call 108.
          <br /><a href="/privacy.html" className="font-bold text-[#2f5f93] underline">Privacy policy</a>
        </p>
      </div>
    </div>
  );
};

const AllProfiles: React.FC<ProfileHomeProps> = ({ onOpen, onStaffSignIn }) => (
  <div className="min-h-screen bg-gradient-to-b from-white via-[#f7f9fc] to-[#eef3f9] text-slate-900 font-sans">
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <header className="flex items-center justify-between gap-4">
        <img src="/vyuhaa-logo.png" alt="Vyuhaa" className="h-9 sm:h-11 w-auto object-contain" />
        {onStaffSignIn && (
          <button type="button" onClick={onStaffSignIn}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
            <KeyRound className="w-4 h-4" /> Staff sign-in
          </button>
        )}
      </header>

      <section className="mt-10 sm:mt-14 max-w-3xl">
        <p className="text-xs font-extrabold tracking-[0.2em] text-[#3d6fa8] uppercase">Continuum</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight text-[#1e3a5f] leading-tight">
          One record for mother and child, across every care setting
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
          Choose a profile to see Continuum from that person's side. You can come back here at any time with
          <span className="font-bold text-slate-800"> All profiles</span> at the top of each screen.
        </p>
      </section>

      <section className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {PROFILE_ORDER.map(key => {
          const m = PROFILE_META[key];
          const Icon = m.icon;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onOpen(key)}
              data-profile={key}
              className="group text-left bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-lg hover:-translate-y-0.5 hover:border-slate-300 transition cursor-pointer flex flex-col"
            >
              <div className="flex items-center gap-3">
                <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.tile} text-white flex items-center justify-center shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </span>
                <span>
                  <span className="block text-lg font-extrabold text-slate-900">{m.label}</span>
                  <span className="block text-xs text-slate-500">{m.who}</span>
                </span>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                {m.what.map(w => (
                  <li key={w} className="flex gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />{w}</li>
                ))}
              </ul>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#2f5f93] group-hover:gap-2.5 transition-all">
                Open {m.label} <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          );
        })}
      </section>

      <footer className="mt-10 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        Demo data only. ABHA, WhatsApp and ONDC gateways are simulated in this MVP.
        <span className="w-full sm:w-auto sm:ml-auto">Not a medical device; it does not diagnose or treat. <a href="/privacy.html" className="font-bold text-[#2f5f93] underline">Privacy policy</a></span>
      </footer>
    </div>
  </div>
);
