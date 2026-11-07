import React, { useState } from 'react';
import { 
  ArrowRight, 
  Lock,
  ChevronRight,
  CheckCircle2,
  Globe,
  Plus,
  ShieldCheck,
  Building2,
  Users,
  Store,
  Smartphone,
  Phone,
  Heart,
  Baby,
  Sparkles,
  Video,
  Play
} from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthUser } from '../../types';
import { OndcVendorOnboardingModal } from '../ondc/OndcVendorOnboardingModal';
import { AndroidApkModal } from '../android/AndroidApkModal';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
  onOpenVideoTour?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onOpenVideoTour }) => {
  const users = authService.getUsers();
  const [loginDomain, setLoginDomain] = useState<'PATIENT' | 'STAFF'>('PATIENT');
  
  // Staff login state
  const [selectedUsername, setSelectedUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [staffError, setStaffError] = useState<string | null>(null);
  const [userCategoryFilter, setUserCategoryFilter] = useState<'all' | 'hospital' | 'vendor'>('all');
  
  // Patient login state (Mobile / ABHA / OTP)
  const [patientMobileOrAbha, setPatientMobileOrAbha] = useState('9845112340');
  const [otpCode, setOtpCode] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [patientError, setPatientError] = useState<string | null>(null);

  // Modals
  const [showOndcOnboardingModal, setShowOndcOnboardingModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [onboardedToast, setOnboardedToast] = useState<string | null>(null);

  // Filter staff vs vendor
  const staffUsers = users.filter(u => u.role !== 'PATIENT');
  const patientUsers = users.filter(u => u.role === 'PATIENT');

  const filteredStaffUsers = staffUsers.filter(u => {
    const isVendor = u.role === 'LAB' || u.role === 'PHARMA' || u.isAddonVendor;
    if (userCategoryFilter === 'hospital') return !isVendor;
    if (userCategoryFilter === 'vendor') return isVendor;
    return true;
  });

  const handleStaffFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);
    const result = authService.login(selectedUsername, password);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setStaffError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handlePatientMobileLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientError(null);

    // Look for matching patient account by phone or abha
    const cleanInput = patientMobileOrAbha.replace(/\D/g, '');
    const foundPatient = patientUsers.find(u => {
      const uPhone = u.phone.replace(/\D/g, '');
      return uPhone.includes(cleanInput) || (u.patientId && u.patientId.toLowerCase() === patientMobileOrAbha.toLowerCase());
    }) || patientUsers[0]; // fallback to Sunita Das

    authService.quickLogin(foundPatient.id);
    onLoginSuccess(foundPatient);
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
            St. Anne Hospital &amp; Nursing Home • Continuum Healthcare
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Video Tour & User Showcase Button */}
          {onOpenVideoTour && (
            <button
              type="button"
              onClick={onOpenVideoTour}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-purple-200 hover:text-white text-xs font-bold shadow-xs transition cursor-pointer border border-purple-500/70"
              title="Watch Complete System Video Tour covering all 8 users and core functionalities"
            >
              <Video className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span>🎬 Watch System Video Tour</span>
            </button>
          )}

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

          {/* ONDC Network Gateway Status Indicator */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '10s' }} />
            <span className="hidden sm:inline">ONDC Health Gateway Connected</span>
            <span className="sm:hidden">ONDC</span>
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
      <main className="max-w-6xl mx-auto w-full my-auto py-6 space-y-6">

        {/* FULL SYSTEM VIDEO SHOWCASE BANNER */}
        {onOpenVideoTour && (
          <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white border border-rose-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-300 shrink-0 shadow-inner">
                <Video className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-rose-300 tracking-wider uppercase">Interactive Video Tour</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-200 border border-rose-500/40 px-2 py-0.5 rounded-full font-semibold">
                    10 Chapters • Audio Narration • Subtitles
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold">
                    Download .webm
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  Video Demonstration: All 8 Users &amp; Key Hospital Functionalities
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                  Watch step-by-step walkthroughs of Sunita’s patient portal, family consent &amp; delivery WhatsApp updates, Dr. Anita’s clinical OPD station, Sister Mary’s ABHA triage, newborn vaccines, Google Maps vicinity cost chooser, and ONDC Jan Aushadhi generic dispensary.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenVideoTour}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Video Tour</span>
            </button>
          </div>
        )}

        {/* 4 CORE PORTALS QUICK LAUNCHER FOR EVALUATION PANEL */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span>🏥</span>
              <span>Direct 1-Click Access: 4 Primary Healthcare Portals</span>
            </span>
            <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
              Health-a-thon 2026 Phase 2
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
            {/* 1. Patient Portal */}
            <button
              type="button"
              onClick={() => {
                const pUser = patientUsers[0];
                authService.quickLogin(pUser.id);
                onLoginSuccess(pUser);
              }}
              className="p-3 rounded-2xl bg-rose-50/70 border border-rose-300 hover:bg-rose-100 transition text-left cursor-pointer group"
            >
              <div className="text-xl mb-1">🤰</div>
              <h4 className="font-extrabold text-slate-900 group-hover:text-rose-700">1. Patient Portal</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Doctor chooser, package quotes, schedules, WhatsApp, ABHA.
              </p>
            </button>

            {/* 2. OPD Doctor Station */}
            <button
              type="button"
              onClick={() => {
                const docUser = staffUsers.find(u => u.id === 'user-doc-anita') || staffUsers[1];
                authService.quickLogin(docUser.id);
                onLoginSuccess(docUser);
              }}
              className="p-3 rounded-2xl bg-blue-50/70 border border-blue-300 hover:bg-blue-100 transition text-left cursor-pointer group"
            >
              <div className="text-xl mb-1">👩‍⚕️</div>
              <h4 className="font-extrabold text-slate-900 group-hover:text-blue-700">2. OPD Doctor Station</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Dr. Anita Rao: Pre-session gist, ABHA records, e-prescribing.
              </p>
            </button>

            {/* 3. Pharmacy Hub */}
            <button
              type="button"
              onClick={() => {
                const pharmUser = staffUsers.find(u => u.id === 'user-pharma-janaushadhi') || staffUsers.find(u => u.role === 'PHARMA') || staffUsers[0];
                authService.quickLogin(pharmUser.id);
                onLoginSuccess(pharmUser);
              }}
              className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-300 hover:bg-emerald-100 transition text-left cursor-pointer group"
            >
              <div className="text-xl mb-1">🌿</div>
              <h4 className="font-extrabold text-slate-900 group-hover:text-emerald-700">3. Pharmacy Hub</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                PM Jan Aushadhi: 72% generic substitution, WhatsApp dispatch.
              </p>
            </button>

            {/* 4. Pathology Lab */}
            <button
              type="button"
              onClick={() => {
                const labUser = staffUsers.find(u => u.id === 'user-lab') || staffUsers.find(u => u.role === 'LAB') || staffUsers[0];
                authService.quickLogin(labUser.id);
                onLoginSuccess(labUser);
              }}
              className="p-3 rounded-2xl bg-purple-50/70 border border-purple-300 hover:bg-purple-100 transition text-left cursor-pointer group"
            >
              <div className="text-xl mb-1">🔬</div>
              <h4 className="font-extrabold text-slate-900 group-hover:text-purple-700">4. Pathology Lab</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Apex Diagnostics: Requisition queue, courier tracking, OCR reports.
              </p>
            </button>
          </div>
        </div>

        {/* TOP LEVEL DOMAIN SWITCHER: PATIENT & FAMILY vs HOSPITAL STAFF */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
            <button
              type="button"
              onClick={() => setLoginDomain('PATIENT')}
              className={`py-3 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                loginDomain === 'PATIENT'
                  ? 'bg-gradient-to-r from-rose-700 to-pink-700 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${loginDomain === 'PATIENT' ? 'text-rose-200' : 'text-rose-500'}`} />
              <div className="text-left">
                <div className="text-xs font-extrabold">Patient &amp; Family Login</div>
                <div className={`text-[10px] font-normal ${loginDomain === 'PATIENT' ? 'text-rose-200' : 'text-slate-500'}`}>
                  Individual Health Account
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setLoginDomain('STAFF')}
              className={`py-3 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                loginDomain === 'STAFF'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Building2 className={`w-4 h-4 ${loginDomain === 'STAFF' ? 'text-emerald-400' : 'text-slate-500'}`} />
              <div className="text-left">
                <div className="text-xs font-extrabold">Hospital &amp; Clinical Staff</div>
                <div className={`text-[10px] font-normal ${loginDomain === 'STAFF' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Doctors, Admin, Reception &amp; Vendors
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* DOMAIN 1: PATIENT & FAMILY INDIVIDUAL LOGIN */}
        {loginDomain === 'PATIENT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Left: 1-Click Patient & Family Profiles */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold mb-1">
                  <Sparkles className="w-3 h-3 text-rose-600" />
                  <span>Individual Login Level</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome to Your Health Journey
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Dedicated portal for expectant mothers, gynaecology patients, and authorized family members. Access personal health records, digital medical library, grounded AI counselling, labour live updates, and treatment cost estimates.
                </p>
              </div>

              {/* 1-Click Demo Patient Quick Logins */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Patient or Family Account (1-Click Instant Sign In):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {patientUsers.map((u) => {
                    const isFamily = u.isFamilyMember;
                    return (
                      <div
                        key={u.id}
                        onClick={() => handleQuickLogin(u)}
                        className={`p-4 rounded-2xl border transition cursor-pointer hover:shadow-md ${
                          isFamily 
                            ? 'bg-blue-50/60 border-blue-200 hover:border-blue-400' 
                            : 'bg-white border-slate-200 hover:border-rose-400'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${u.avatarBg}`}>
                            {u.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-slate-900 text-xs truncate">
                                {u.name}
                              </h3>
                              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                isFamily ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {isFamily ? 'Family Member' : 'Patient'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 truncate mt-0.5">
                              {u.title}
                            </p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                              <span>{u.phone}</span>
                              <span className="font-bold text-rose-700 flex items-center gap-0.5">
                                Login <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Patient Privacy Note */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                <span>
                  <strong>ABDM &amp; Privacy Compliant:</strong> Family members can only view records explicitly authorized by the patient with granular consent.
                </span>
              </div>
            </div>

            {/* Right: Mobile Number / ABHA ID Sign-In Form */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-rose-600" />
                    <span>Mobile OTP / ABHA Sign In</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your registered mobile or 14-digit ABHA ID to log in.
                  </p>
                </div>

                {patientError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                    {patientError}
                  </div>
                )}

                <form onSubmit={handlePatientMobileLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number or ABHA Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={patientMobileOrAbha}
                        onChange={(e) => setPatientMobileOrAbha(e.target.value)}
                        required
                        placeholder="e.g. 98451 12340 or 91-4452-9871-3320"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Pre-filled for Sunita Das (PAT-104)
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        6-Digit OTP Verification
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(true);
                          setOtpCode('123456');
                        }}
                        className="text-[10px] text-rose-700 font-bold hover:underline"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                      placeholder="123456"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white font-mono tracking-widest text-center text-sm font-bold"
                    />
                    <p className="text-[10px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Demo OTP auto-verified: 123456</span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-700 to-pink-700 hover:from-rose-800 hover:to-pink-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
                  >
                    <span>Enter My Patient Care Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Info Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-600">
                  <div className="font-bold text-slate-800 text-[11px]">Included in Patient Portal:</div>
                  <ul className="text-[10px] space-y-1 text-slate-600 list-disc pl-4">
                    <li>👨‍👩‍👧 Family Member Management &amp; Consent</li>
                    <li>📚 Digital Medical Library &amp; Grounded AI Counsellor</li>
                    <li>💰 Treatment Cost Estimator &amp; WhatsApp Quotes</li>
                    <li>🩺 5-10 Min Rapid Doctor Tele-Consultations</li>
                    <li>👶 Real-time Labour &amp; Delivery Updates for Family</li>
                    <li>💉 Newborn Vaccinations &amp; Maternal Testing Schedules</li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* DOMAIN 2: HOSPITAL & CLINICAL STAFF PORTAL */}
        {loginDomain === 'STAFF' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Left Column: Staff & Vendor Logins Select */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Hospital Staff &amp; Clinical Desks
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Access hospital clinical desks or add-on vendor portals (Pathology / Pharmacy) via ONDC network.
                  </p>
                </div>

                {/* Action Button: Register Shop via ONDC */}
                <button
                  type="button"
                  onClick={() => setShowOndcOnboardingModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-xs transition cursor-pointer"
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
                  All Staff &amp; Vendors ({staffUsers.length})
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
                {filteredStaffUsers.map(u => {
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
                    <strong>Independent Shop Owner?</strong> Pathology labs &amp; retail chemists can join as ONDC network add-ons anytime.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOndcOnboardingModal(true)}
                  className="font-bold underline text-indigo-800 hover:text-indigo-950 text-xs shrink-0 ml-2 cursor-pointer"
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
                    Hospital Staff Sign-In
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sign in with your assigned staff username and passcode.
                  </p>
                </div>

                {staffError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                    {staffError}
                  </div>
                )}

                <form onSubmit={handleStaffFormLogin} className="space-y-4">
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
                  const active = staffUsers.find(u => u.username === selectedUsername);
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
        )}

      </main>

      {/* Clean Minimal Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
        <p>Vyuhaa Continuum Care • St. Anne Mother &amp; Child Hospital • ONDC Health Network Integrated</p>
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

      {/* Android Application & APK Information Modal */}
      {showApkModal && (
        <AndroidApkModal
          onClose={() => setShowApkModal(false)}
        />
      )}
    </div>
  );
};
