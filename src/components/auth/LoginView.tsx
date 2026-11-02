import React, { useState } from 'react';
import { 
  ArrowRight, 
  Lock,
  ChevronRight,
  CheckCircle2,
  Globe,
  Plus,
  Microscope,
  Pill,
  ShieldCheck,
  Building2,
  Users,
  Store,
  Smartphone
} from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthUser } from '../../types';
import { OndcVendorOnboardingModal } from '../ondc/OndcVendorOnboardingModal';
import { TestCenterModal } from '../testing/TestCenterModal';
import { AndroidApkModal } from '../android/AndroidApkModal';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const users = authService.getUsers();
  const [selectedUsername, setSelectedUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [userCategoryFilter, setUserCategoryFilter] = useState<'all' | 'hospital' | 'vendor'>('all');
  const [showOndcOnboardingModal, setShowOndcOnboardingModal] = useState(false);
  const [showTestCenter, setShowTestCenter] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [onboardedToast, setOnboardedToast] = useState<string | null>(null);

  const filteredUsers = users.filter(u => {
    const isVendor = u.role === 'LAB' || u.role === 'PHARMA' || u.isAddonVendor;
    if (userCategoryFilter === 'hospital') return !isVendor;
    if (userCategoryFilter === 'vendor') return isVendor;
    return true;
  });

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = authService.login(selectedUsername, password);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = (user: AuthUser) => {
    authService.quickLogin(user.id);
    onLoginSuccess(user);
  };

  const getDefaultPasswordForUser = (user: AuthUser) => {
    if (user.role === 'ADMIN') return 'admin123';
    if (user.role === 'DOCTOR') return 'doctor123';
    if (user.role === 'RECEPTION') return 'nurse123';
    if (user.isAddonVendor) return 'vendor123';
    if (user.role === 'LAB') return 'lab123';
    return 'pharma123';
  };

  return (
    <div className="min-h-screen bg-[#faf8f7] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Window Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img 
            src="/vyuhaa-logo.png" 
            alt="Vyuhaa Logo" 
            className="h-9 w-auto object-contain" 
          />
          <div className="hidden sm:block h-5 w-px bg-slate-300" />
          <span className="hidden sm:inline text-xs font-semibold text-slate-500 uppercase tracking-wider">
            St. Anne Hospital & Nursing Home • Unified Continuum Portal
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Android APK & Install Trigger */}
          <button
            type="button"
            onClick={() => setShowApkModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-900 to-pink-900 hover:from-rose-800 hover:to-pink-800 text-rose-200 hover:text-white text-xs font-bold shadow-xs transition cursor-pointer border border-rose-600/70"
            title="Where is the APK? Android Installation & Download Guide"
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-300" />
            <span>📱 Android App &amp; APK</span>
          </button>

          {/* QA Test Suite & PDF Download Trigger */}
          <button
            type="button"
            onClick={() => setShowTestCenter(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-amber-300 hover:text-white text-xs font-bold shadow-xs transition cursor-pointer border border-purple-700/60"
            title="Open Interactive QA Testing Suite & Download PDF Test Plan"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>🧪 QA Testing Suite &amp; PDF</span>
          </button>

          {/* ONDC Network Gateway Status Indicator */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '10s' }} />
            <span>ONDC Health Gateway Connected</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>System Online</span>
          </span>
        </div>
      </header>

      {/* Toast notification if new vendor onboarded */}
      {onboardedToast && (
        <div className="max-w-6xl mx-auto w-full mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{onboardedToast}</span>
          </div>
          <button 
            onClick={() => setOnboardedToast(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Login Workspace */}
      <main className="max-w-6xl mx-auto w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Staff & Vendor Logins Select */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Single Platform Sign-In
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access hospital clinical desks or add-on vendor portals (Pathology / Pharmacy) via ONDC network.
                </p>
              </div>

              {/* Action Button: Register Shop via ONDC */}
              <button
                type="button"
                onClick={() => setShowOndcOnboardingModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Join Shop via ONDC</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUserCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  userCategoryFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Accounts ({users.length})
              </button>

              <button
                type="button"
                onClick={() => setUserCategoryFilter('hospital')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  userCategoryFilter === 'hospital'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3 h-3 text-slate-500" />
                <span>Hospital Core Staff</span>
              </button>

              <button
                type="button"
                onClick={() => setUserCategoryFilter('vendor')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  userCategoryFilter === 'vendor'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3 h-3 text-indigo-600" />
                <span>ONDC Vendor Shops</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                  Add-on
                </span>
              </button>
            </div>

            {/* Quick User Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-h-[500px] overflow-y-auto pr-1">
              {filteredUsers.map(u => {
                const isSelected = selectedUsername === u.username;
                const isVendor = u.role === 'LAB' || u.role === 'PHARMA' || u.isAddonVendor;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUsername(u.username);
                      setPassword(getDefaultPasswordForUser(u));
                    }}
                    onDoubleClick={() => handleQuickLogin(u)}
                    className={`text-left p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                      isSelected 
                        ? 'bg-white border-rose-500 ring-2 ring-rose-200 shadow-sm' 
                        : isVendor
                        ? 'bg-white hover:bg-indigo-50/40 border-slate-200 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 border ${u.avatarBg}`}>
                      {u.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 text-xs truncate block">
                          {u.name}
                        </span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          u.role === 'ADMIN' ? 'bg-slate-900 text-white' :
                          u.role === 'DOCTOR' ? 'bg-rose-100 text-rose-800' :
                          u.role === 'RECEPTION' ? 'bg-pink-100 text-pink-800' :
                          u.role === 'LAB' ? 'bg-purple-100 text-purple-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        {u.title}
                      </p>

                      {/* ONDC Badge if vendor */}
                      {u.ondcParticipantId ? (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-indigo-700 font-mono font-bold bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-100 w-fit">
                          <Globe className="w-2.5 h-2.5 text-indigo-600 shrink-0" />
                          <span className="truncate">{u.ondcParticipantId}</span>
                        </div>
                      ) : null}

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-400 truncate">{u.allocatedRoom || u.department}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickLogin(u);
                          }}
                          className={`font-bold flex items-center gap-0.5 shrink-0 ${
                            isVendor ? 'text-indigo-700 hover:text-indigo-900' : 'text-rose-700 hover:text-rose-900'
                          }`}
                        >
                          <span>Enter</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick info prompt */}
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80 text-indigo-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>
                  <strong>Independent Shop Owner?</strong> Pathology labs & retail chemists can join as ONDC network add-ons anytime.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowOndcOnboardingModal(true)}
                className="font-bold underline text-indigo-800 hover:text-indigo-950 text-xs shrink-0 ml-2"
              >
                Register Shop →
              </button>
            </div>
          </div>

          {/* Right Column: Credentials Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Account Sign-In
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in with your assigned username and passcode.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleFormLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username / Vendor Handle
                  </label>
                  <input
                    type="text"
                    value={selectedUsername}
                    onChange={(e) => setSelectedUsername(e.target.value)}
                    required
                    placeholder="Enter username"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Active User preview */}
              {(() => {
                const active = users.find(u => u.username === selectedUsername);
                if (!active) return null;
                const isVendor = active.role === 'LAB' || active.role === 'PHARMA' || active.isAddonVendor;
                return (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${active.avatarBg}`}>
                        {active.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          {active.name}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {active.title}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-bold text-[10px]">
                        {active.role}
                      </span>
                    </div>

                    {isVendor && active.ondcParticipantId && (
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">ONDC Node:</span>
                        <span className="font-mono font-bold text-indigo-700">{active.ondcParticipantId}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
        <p>Vyuhaa Continuum Care • St. Anne Mother & Child Hospital • ONDC Health Network Integrated</p>
      </footer>

      {/* ONDC Vendor Onboarding Modal */}
      {showOndcOnboardingModal && (
        <OndcVendorOnboardingModal
          onClose={() => setShowOndcOnboardingModal(false)}
          onSuccess={(newUser, shopName) => {
            setShowOndcOnboardingModal(false);
            setOnboardedToast(`${shopName} joined successfully via ONDC Network! Logged in as ${newUser.name}.`);
            onLoginSuccess(newUser);
          }}
        />
      )}

      {/* QA Testing Suite & PDF Export Modal */}
      {showTestCenter && (
        <TestCenterModal
          onClose={() => setShowTestCenter(false)}
          onNavigateToPortal={(_portal, _role) => {
            const current = authService.getCurrentUser();
            if (current) onLoginSuccess(current);
          }}
        />
      )}

      {/* Android Application & APK Information Modal */}
      {showApkModal && (
        <AndroidApkModal
          onClose={() => setShowApkModal(false)}
        />
      )}
    </div>
  );
};
