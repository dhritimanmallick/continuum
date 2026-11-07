import React, { useState } from 'react';
import { 
  Building2, 
  MessageSquare, 
  ChevronDown, 
  LogOut,
  Zap,
  Check,
  Globe,
  Plus,
  ShieldCheck,
  Smartphone,
  Radio,
  HeartHandshake,
  Award,
  Video
} from 'lucide-react';
import { OpdUserRole, OpdStats, PortalType, OpdRole, AuthUser } from '../../types';
import { opdStore } from '../../services/opdStore';
import { authService } from '../../services/authService';
import { OndcVendorOnboardingModal } from '../ondc/OndcVendorOnboardingModal';
import { AndroidApkModal } from '../android/AndroidApkModal';

interface OpdNavbarProps {
  currentPortal: PortalType;
  currentRole: OpdUserRole;
  onPortalChange: (portal: PortalType) => void;
  onOpdRoleChange: (role: OpdRole) => void;
  stats: OpdStats;
  onOpenWhatsAppView: () => void;
  onOpenCareJourney?: () => void;
  onOpenPatientHub?: () => void;
  onOpenKnowledgeLibrary?: () => void;
  onOpenCostEstimator?: () => void;
  onOpenDoctorCounselling?: () => void;
  onOpenLabourTracker?: () => void;
  onOpenNotifications?: () => void;
  onOpenVideoTour?: () => void;
  onLogout?: () => void;
}

export const OpdNavbar: React.FC<OpdNavbarProps> = ({
  currentPortal,
  currentRole,
  onPortalChange,
  onOpdRoleChange,
  stats,
  onOpenWhatsAppView,
  onOpenCareJourney,
  onOpenPatientHub,
  onOpenKnowledgeLibrary,
  onOpenCostEstimator,
  onOpenDoctorCounselling,
  onOpenLabourTracker,
  onOpenNotifications,
  onOpenVideoTour,
  onLogout
}) => {

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showOndcModal, setShowOndcModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const currentUser = authService.getCurrentUser();
  const allUsers = authService.getUsers().filter(u => u.role !== 'PATIENT');
  // The vicinity network (ONDC order intake) is not part of the doctor's workspace
  const isDoctorContext = (currentPortal === 'OPD' && currentRole === 'DOCTOR') || authService.getCurrentUser()?.role === 'DOCTOR';
  const currentDoctor = opdStore.getCurrentDoctor();
  const facility = opdStore.getHospitalFacility();

  const handleUserSelect = (user: AuthUser) => {
    authService.quickLogin(user.id);
    if (user.role === 'ADMIN') {
      opdStore.setPortal('ADMIN');
      onPortalChange('ADMIN');
    } else if (user.role === 'DOCTOR') {
      if (user.doctorId) {
        opdStore.setDoctorProfile(user.doctorId);
      }
      opdStore.setPortal('OPD');
      opdStore.setOpdRole('DOCTOR');
      onPortalChange('OPD');
      onOpdRoleChange('DOCTOR');
    } else if (user.role === 'RECEPTION') {
      opdStore.setPortal('OPD');
      opdStore.setOpdRole('RECEPTION');
      onPortalChange('OPD');
      onOpdRoleChange('RECEPTION');
    } else if (user.role === 'LAB') {
      if (user.vendorPartnerId) {
        opdStore.setSelectedLab(user.vendorPartnerId);
      }
      opdStore.setPortal('LAB');
      onPortalChange('LAB');
    } else if (user.role === 'PHARMA') {
      if (user.vendorPartnerId) {
        opdStore.setSelectedPharmacy(user.vendorPartnerId);
      }
      opdStore.setPortal('PHARMA');
      onPortalChange('PHARMA');
    }
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Hospital Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-white">{facility.name}</span>
          <span className="text-slate-400 hidden sm:inline">• {facility.address.split(',')[0]}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* User Account / Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium transition cursor-pointer border border-slate-700"
            >
              <span className="text-xs">{currentUser?.avatar || '👤'}</span>
              <span className="font-semibold text-white">{currentUser?.name || 'Staff User'}</span>
              <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold uppercase ml-1">
                {currentUser?.role || currentRole}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs text-slate-800 space-y-1">
                <div className="p-2 border-b border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current User</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{currentUser?.name}</div>
                  <div className="text-slate-500 text-[11px]">{currentUser?.title}</div>
                  {currentUser?.allocatedRoom && (
                    <div className="text-rose-700 font-semibold text-[11px] mt-0.5">{currentUser.allocatedRoom}</div>
                  )}
                </div>

                <div className="pt-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Switch User
                  </div>

                  {allUsers.map(u => {
                    const isCurrent = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleUserSelect(u)}
                        className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition cursor-pointer ${
                          isCurrent ? 'bg-rose-50 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${u.avatarBg}`}>
                          {u.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 block truncate text-xs">{u.name}</span>
                            <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                              {u.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 truncate block">
                            {u.allocatedRoom || u.department}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Onboard ONDC Vendor Action */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowOndcModal(true);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-700" />
                    <span>+ Register ONDC Partner Shop</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="pt-1.5 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onLogout) {
                        onLogout();
                      } else {
                        authService.logout();
                      }
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>


          {onOpenVideoTour && (
            <button
              onClick={onOpenVideoTour}
              className="text-purple-200 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 px-2.5 py-1 rounded-lg border border-purple-600/70 transition text-xs shadow-xs"
              title="Watch Complete System Video Tour covering all 8 users and core functionalities"
            >
              <Video className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
              <span className="hidden sm:inline">🎬 Video Tour</span>
            </button>
          )}

          <button
            onClick={() => onOpenCareJourney && onOpenCareJourney()}
            className="text-teal-200 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-teal-900 to-emerald-900 hover:from-teal-800 hover:to-emerald-800 px-2.5 py-1 rounded-lg border border-teal-600/70 transition text-xs shadow-xs"
            title="My Care Journey — All OPD Patient Milestones & Continuity Achievements"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">🌟 My Care Journey</span>
          </button>

          <button
            onClick={() => setShowApkModal(true)}
            className="text-rose-200 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-rose-900 to-pink-900 hover:from-rose-800 hover:to-pink-800 px-2 py-1 rounded-lg border border-rose-600/70 transition text-xs shadow-xs"
            title="Where is the APK? Android Installation & Download Center"
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-300" />
            <span className="hidden sm:inline">📱 APK</span>
          </button>

          <button 
            onClick={onOpenWhatsAppView}
            className="text-emerald-300 hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer bg-emerald-950/80 hover:bg-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-700/50 transition text-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar with Vyuhaa Logo */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Vyuhaa Logo on the Window */}
        <div className="flex items-center gap-3 shrink-0">
          <img 
            src="/vyuhaa-logo.png" 
            alt="Vyuhaa Logo" 
            className="h-8 md:h-9 w-auto object-contain cursor-pointer" 
            onClick={() => onPortalChange('OPD')}
          />
          <div className="hidden sm:block h-6 w-px bg-slate-200" />
          <span className="hidden sm:inline text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Continuum Care
          </span>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          {/* Patient Portal Switcher */}
          <button
            onClick={() => {
              authService.quickLogin('user-patient-sunita');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 text-rose-800 bg-rose-100/80 hover:bg-rose-200 border border-rose-300 font-extrabold"
            title="Switch directly to Individual Patient & Family Portal (Sunita Das)"
          >
            <span>🤰 Patient Portal</span>
          </button>

          {/* Portal 0: Hospital Admin Portal */}
          <button
            onClick={() => {
              onPortalChange('ADMIN');
              opdStore.setPortal('ADMIN');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
              currentPortal === 'ADMIN'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Admin</span>
          </button>

          {/* Portal 1: OPD Outpatient Clinics */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => {
                onPortalChange('OPD');
                opdStore.setPortal('OPD');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                currentPortal === 'OPD'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>OPD</span>
            </button>

            {/* Sub-role toggle (Reception vs Doctor) when in OPD */}
            {currentPortal === 'OPD' && (
              <div className="flex items-center ml-1 pl-1 border-l border-slate-200 gap-1">
                <button
                  onClick={() => {
                    onOpdRoleChange('RECEPTION');
                    opdStore.setOpdRole('RECEPTION');
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition ${
                    currentRole === 'RECEPTION'
                      ? 'bg-rose-700 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Reception
                </button>
                <button
                  onClick={() => {
                    onOpdRoleChange('DOCTOR');
                    opdStore.setOpdRole('DOCTOR');
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition ${
                    currentRole === 'DOCTOR'
                      ? 'bg-rose-700 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Doctor
                </button>
              </div>
            )}
          </div>

          {/* Portal 2: Diagnostic Labs */}
          <button
            onClick={() => {
              onPortalChange('LAB');
              opdStore.setPortal('LAB');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
              currentPortal === 'LAB'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pathology Lab</span>
            {stats.labPending > 0 && (
              <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full font-bold">
                {stats.labPending}
              </span>
            )}
          </button>

          {/* Portal 3: Pharmacy */}
          <button
            onClick={() => {
              onPortalChange('PHARMA');
              opdStore.setPortal('PHARMA');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
              currentPortal === 'PHARMA'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pharmacy</span>
            {stats.pharmacyPendingCount > 0 && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                {stats.pharmacyPendingCount}
              </span>
            )}
          </button>

          {/* Portal 4: Vicinity Radar & Order Intake */}
          {!isDoctorContext && (
          <button
            onClick={() => {
              onPortalChange('VICINITY');
              opdStore.setPortal('VICINITY');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
              currentPortal === 'VICINITY'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Vicinity Radar</span>
            <span className="text-[10px] bg-rose-950/40 text-rose-200 px-1.5 py-0.2 rounded-full font-bold">
              ONDC
            </span>
          </button>
          )}

          {/* Portal 5: Doctor Revenue Attribution */}
          <button
            onClick={() => {
              onPortalChange('REVENUES');
              opdStore.setPortal('REVENUES');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0 ${
              currentPortal === 'REVENUES'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-900'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-300" />
            <span>Doctor Revenues</span>
          </button>
        </div>

        {/* Right side doctor/room indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-900">{currentDoctor.name}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-medium">{currentDoctor.roomNumber}</span>
          </div>
        </div>
      </div>

      {/* ONDC Vendor Onboarding Modal */}
      {showOndcModal && (
        <OndcVendorOnboardingModal
          onClose={() => setShowOndcModal(false)}
          onSuccess={(newUser) => {
            setShowOndcModal(false);
            handleUserSelect(newUser);
          }}
        />
      )}

      {/* Android Application & APK Information Modal */}
      {showApkModal && (
        <AndroidApkModal
          onClose={() => setShowApkModal(false)}
          onNavigateToPortal={(portal, role) => {
            onPortalChange(portal);
            if (role) onOpdRoleChange(role);
          }}
        />
      )}
    </header>
  );
};
