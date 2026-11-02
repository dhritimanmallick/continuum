import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  UserCircle2, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert, 
  Fingerprint, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { User, Facility } from '../types';
import { store } from '../services/store';

interface NavbarProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  onSearch: (query: string) => void;
  onOpenABDM: () => void;
  onOpenSimulator: () => void;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUserChange,
  onSearch,
  onOpenABDM,
  onOpenSimulator,
  onNavigate
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Demo Banner */}
      <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-semibold tracking-wide flex items-center justify-between border-b border-amber-600">
        <div className="flex items-center gap-2">
          <span className="bg-black/20 text-slate-950 px-2 py-0.5 rounded text-[11px] font-bold">
            PROTOTYPE ACTIVE
          </span>
          <span>DEMO DATA — NOT REAL PATIENT INFORMATION</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline font-mono">Vyuhaa Med Data • Assistive Care-Gap Registry</span>
          <button 
            onClick={onOpenSimulator}
            className="underline hover:text-black font-medium flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" /> Rule Simulator
          </button>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Facility Selector */}
        <div className="flex items-center gap-4 min-w-0">
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold text-lg tracking-wider shadow-sm">
              C
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">Continuum</span>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">CARE-GAP REGISTRY</p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          {/* Facility Selector */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-semibold text-slate-800 leading-tight">District Hospital Hubballi</span>
              <span className="text-[10px] text-slate-500">Tier-2 District Hospital • Dharwad</span>
            </div>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md mx-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                onSearch(e.target.value);
              }}
              placeholder="Search by Patient, ABHA ID (e.g. 91-8842...), Mobile, Rule..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 transition"
            />
          </form>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* ABDM Sandbox Trigger */}
          <button
            onClick={onOpenABDM}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition cursor-pointer"
            title="Ayushman Bharat Digital Mission (ABHA) Sandbox"
          >
            <Fingerprint className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden md:inline">ABDM Sandbox</span>
          </button>

          {/* Date Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium">01-Oct-2026</span>
          </div>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition cursor-pointer"
              aria-label="Alerts"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {showNotificationPopup && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-800">
                  <span>Urgent Operational Alerts</span>
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">3 Unresolved</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-2 bg-rose-50 rounded border border-rose-200">
                    <p className="font-semibold text-rose-900">Lab Result Action Required</p>
                    <p className="text-[11px] text-rose-700 mt-0.5">Deepa K. — HBsAg Reactive (Sample SMP-2026-0891). Post-delivery neonatal HBIG protocol required.</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded border border-amber-200">
                    <p className="font-semibold text-amber-900">Care Gap Overdue +5 wks</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">Anjali P. — Rh negative mother, no antibody screen recorded.</p>
                  </div>
                  <div className="p-2 bg-sky-50 rounded border border-sky-200">
                    <p className="font-semibold text-sky-900">Growth Scan Due Today</p>
                    <p className="text-[11px] text-sky-700 mt-0.5">Farida B. (34 wks) — Flagged pregnancy surveillance interval.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.department}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] rounded font-semibold">
                    {currentUser.role}
                  </span>
                </div>

                <div className="py-1">
                  <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Role for Demo:
                  </p>
                  {store.users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onUserChange(u);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md flex items-center justify-between hover:bg-slate-100 transition cursor-pointer ${
                        u.id === currentUser.id ? 'bg-slate-100 font-semibold text-teal-800' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="text-xs leading-snug">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.role.replace('_', ' ')}</p>
                      </div>
                      {u.id === currentUser.id && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
