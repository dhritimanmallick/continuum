/**
 * One top bar for every profile: which profile you are in, who you are, and a way back
 * to the profile home screen. Nothing else, so the screen below is the focus.
 */
import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { PROFILE_META, ProfileKey } from './profiles';

interface ProfileTopBarProps {
  profile: ProfileKey;
  userName: string;
  userDetail?: string;
  onHome: () => void;
  /** Optional small items shown before the home button (e.g. the mother's 108 SOS). */
  extra?: React.ReactNode;
}

export const ProfileTopBar: React.FC<ProfileTopBarProps> = ({ profile, userName, userDetail, onHome, extra }) => {
  const m = PROFILE_META[profile];
  const Icon = m.icon;
  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        <button type="button" onClick={onHome} className="flex items-center gap-3 shrink-0 cursor-pointer" title="Back to all profiles">
          <img src="/vyuhaa-logo.png" alt="Vyuhaa" className="h-7 sm:h-8 w-auto object-contain" />
          <span className="hidden md:block h-6 w-px bg-slate-200" />
          <span className="hidden md:block text-[11px] font-extrabold tracking-[0.18em] text-slate-500">CONTINUUM</span>
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-2.5 sm:justify-center">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold border shrink-0 ${m.chip}`}>
            <Icon className="w-4 h-4" />
            <span className="whitespace-nowrap">{m.label}</span>
          </span>
          <span className="min-w-0 hidden sm:block">
            <span className="block text-xs font-bold text-slate-900 truncate">{userName}</span>
            {userDetail && <span className="block text-[11px] text-slate-500 truncate">{userDetail}</span>}
          </span>
        </div>

        {extra}
        <button
          type="button"
          onClick={onHome}
          aria-label="All profiles"
          title="Back to all profiles"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden sm:inline">All profiles</span>
        </button>
      </div>
    </header>
  );
};
