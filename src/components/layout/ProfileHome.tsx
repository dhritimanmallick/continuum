/**
 * Landing screen: pick one of the six profiles. Each tile opens that profile's own
 * interface; every interface has an "All profiles" button that returns here.
 */
import React from 'react';
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import { PROFILE_META, PROFILE_ORDER, ProfileKey } from './profiles';

interface ProfileHomeProps {
  onOpen: (profile: ProfileKey) => void;
  onStaffSignIn?: () => void;
}

export const ProfileHome: React.FC<ProfileHomeProps> = ({ onOpen, onStaffSignIn }) => (
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
      </footer>
    </div>
  </div>
);
