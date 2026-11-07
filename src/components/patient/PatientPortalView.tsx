import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calculator, 
  PhoneCall, 
  Baby, 
  Bell, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Award,
  LogOut,
  Syringe,
  Phone,
  AlertTriangle,
  ChevronRight,
  MessageCircle,
  Navigation,
  MapPin,
  Video,
  Stethoscope,
  CalendarDays,
  Building2
} from 'lucide-react';
import { AuthUser, OpdPatient, FamilyMember, MaternalTestProtocol, VaccineScheduleItem } from '../../types';
import { opdStore } from '../../services/opdStore';
import { authService } from '../../services/authService';
import { familyService } from '../../services/familyService';
import { generateNewbornVaccineSchedule, ALL_MATERNAL_TESTS } from '../../services/clinicalProtocols';
import { FamilyMemberManagementPanel } from './FamilyMemberManagementPanel';
import { AiKnowledgeCounsellorPanel } from './AiKnowledgeCounsellorPanel';
import { KnowledgeLibraryModal } from './KnowledgeLibraryModal';
import { TreatmentCostEstimatorModal } from './TreatmentCostEstimatorModal';
import { EmergencyDoctorCounsellingModal } from './EmergencyDoctorCounsellingModal';
import { LabourDeliveryLiveTrackerModal } from './LabourDeliveryLiveTrackerModal';
import { NotificationCenterModal } from './NotificationCenterModal';
import { MyCareJourneyModal } from '../opd/MyCareJourneyModal';
import { WhatsAppJourneyModal } from '../opd/WhatsAppJourneyModal';
import { GoogleMapsVicinityTracker } from '../vicinity/GoogleMapsVicinityTracker';
import { DoctorChooserAndEstimatesPanel } from './DoctorChooserAndEstimatesPanel';
import { PatientSchedulesPanel } from './PatientSchedulesPanel';
import { DoctorWhatsAppMessagesFeed } from './DoctorWhatsAppMessagesFeed';
import { AbhaHealthLockerPanel } from './AbhaHealthLockerPanel';
import { CultPatientDashboard } from './CultPatientDashboard';
import { AbhaMultiHospitalConsentModal } from './AbhaMultiHospitalConsentModal';
import { PortalSidebarLayout } from '../layout/PortalSidebarLayout';
import { CareFinderPanel } from './CareFinderPanel';
import { NearbyCareMap } from '../vicinity/NearbyCareMap';

interface PatientPortalViewProps {
  currentUser: AuthUser;
  patientId: string;
  onLogout: () => void;
  onOpenVideoTour?: () => void;
}

export type PatientPortalTab = 
  | 'OVERVIEW'
  | 'DOCTORS_ESTIMATES'
  | 'MY_SCHEDULE'
  | 'WHATSAPP_FEED'
  | 'ABHA_RECORDS'
  | 'FAMILY'
  | 'LIBRARY_AI'
  | 'COSTS'
  | 'VICINITY_MAP'
  | 'TELE_COUNSELLING'
  | 'LABOUR_TRACKER'
  | 'VACCINES_TESTS'
  | 'CARE_JOURNEY'
  | 'NOTIFICATIONS';

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  currentUser,
  patientId,
  onLogout,
  onOpenVideoTour
}) => {
  const [activeTab, setActiveTab] = useState<PatientPortalTab>('OVERVIEW');
  const [, setSelectedFamilyMember] = useState<FamilyMember | null>(null);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showLabourModal, setShowLabourModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showConsentManager, setShowConsentManager] = useState(false);

  // Vaccine filter
  const [vaccineAgeFilter, setVaccineAgeFilter] = useState<'ALL' | 'AT_BIRTH' | '6_WEEKS' | '10_WEEKS' | '14_WEEKS'>('ALL');
  // Maternal test filter
  const [testStageFilter, setTestStageFilter] = useState<'ALL' | 'PREGNANCY_1ST_TRIMESTER' | 'PREGNANCY_2ND_TRIMESTER' | 'PREGNANCY_3RD_TRIMESTER' | 'POSTNATAL_6WEEKS'>('ALL');

  // Look up current patient or fallback to Sunita Das
  const patient: OpdPatient = opdStore.patients.find(p => p.id === patientId) || opdStore.patients.find(p => p.id === 'PAT-104') || opdStore.patients[0];

  const familyMembers = familyService.getMembersForPatient(patient.id);
  const newbornSchedule: VaccineScheduleItem[] = generateNewbornVaccineSchedule(patient.id, '2026-10-10', 3);

  const filteredVaccines = vaccineAgeFilter === 'ALL' 
    ? newbornSchedule 
    : newbornSchedule.filter(v => v.milestone === vaccineAgeFilter);

  const filteredTests = testStageFilter === 'ALL'
    ? ALL_MATERNAL_TESTS
    : ALL_MATERNAL_TESTS.filter((t: MaternalTestProtocol) => t.stage === testStageFilter);

  return (
    <div className="min-h-screen bg-[#faf8f7] text-slate-900 flex flex-col font-sans selection:bg-rose-200">
      
      {/* Top Patient Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        {/* Top Emergency & Trust Alert Bar */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-purple-950 text-white px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-rose-200">Vyuhaa Continuum</span>
            <span className="text-slate-400 hidden sm:inline">• Vicinity Hospitals, Diagnostic Labs &amp; Unified ABHA Storage</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
            <div className="flex items-center gap-1.5 text-amber-300 bg-amber-950/70 border border-amber-600/50 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">24x7 Care Line: 080-2211-9999</span>
              <span className="sm:hidden">Care Line 080-2211-9999</span>
            </div>
            <a 
              href="tel:108"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[11px] shadow-xs transition"
            >
              <AlertTriangle className="w-3 h-3 text-white" />
              <span className="hidden sm:inline">Emergency 108 SOS</span>
              <span className="sm:hidden">108 SOS</span>
            </a>
          </div>
        </div>

        {/* Main Navbar Bar */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/vyuhaa-logo.png" 
              alt="Vyuhaa Logo" 
              className="h-8 md:h-9 w-auto object-contain" 
            />
            <div className="hidden sm:block h-6 w-px bg-slate-200" />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Vyuhaa Continuum</span>
                <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase">
                  Patient &amp; Family
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Individual Health Account</p>
            </div>
          </div>

          {/* User Profile, ABHA badge, and Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ABHA Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ABHA: {patient.abhaId || '91-4452-9871-3320'}</span>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-2 sm:bg-slate-50 sm:border sm:border-slate-200 sm:px-3 py-1.5 rounded-xl shrink-0">
              <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-300 text-rose-800 flex items-center justify-center font-bold text-sm shrink-0">
                {currentUser.avatar || '🤰'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  {currentUser.isFamilyMember && (
                    <span className="text-[9px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-bold">
                      Family Access
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentUser.isFamilyMember ? `Spouse of ${currentUser.primaryPatientName || 'Sunita Das'}` : `ID: ${patient.id} • ${patient.age}y`}
                </div>
              </div>
            </div>

            {/* Video Tour Button */}
            {onOpenVideoTour && (
              <button
                type="button"
                onClick={onOpenVideoTour}
                className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-auto w-9 sm:w-auto sm:px-3 py-1.5 rounded-xl shrink-0 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-purple-200 hover:text-white text-xs font-bold border border-purple-500/70 shadow-xs transition cursor-pointer"
                title="Watch Complete System Video Tour covering all 8 users and core functionalities"
              >
                <Video className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                <span className="hidden sm:inline">🎬 System Video Tour</span>
                              </button>
            )}

            {/* Switch to Doctor Station */}
            <button
              type="button"
              onClick={() => {
                authService.quickLogin('user-doc-anita');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              title="Switch session to Dr. Anita Rao (OPD Doctor Station)"
            >
              <Stethoscope className="w-3.5 h-3.5 text-rose-300" />
              <span>Switch to Doctor Station</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
              title="Sign out of patient account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        <PortalSidebarLayout
          activeId={activeTab}
          onSelect={id => setActiveTab(id as PatientPortalTab)}
          header={
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                {patient.isPregnant && patient.pregnancyDetails?.gestationalAgeWeeks ? `Week ${patient.pregnancyDetails.gestationalAgeWeeks}` : 'My health'}
              </div>
              <div className="text-sm font-extrabold text-slate-900 truncate">{patient.name}</div>
              <div className="text-[11px] text-slate-500 truncate">Primary doctor: {patient.assignedDoctor || 'Dr. Anita Rao'}</div>
            </div>
          }
          groups={[
            { heading: 'My care', items: [
              { id: 'OVERVIEW', label: 'Home', icon: Heart },
              { id: 'MY_SCHEDULE', label: 'My Schedule', icon: CalendarDays },
              { id: 'VACCINES_TESTS', label: 'Vaccinations & Tests', icon: Syringe },
              { id: 'CARE_JOURNEY', label: 'My Care Journey', icon: Award },
              { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
            ]},
            { heading: 'Find care', items: [
              { id: 'DOCTORS_ESTIMATES', label: 'Consult a Doctor', icon: Stethoscope },
              { id: 'COSTS', label: 'Costs & Procedures', icon: Calculator },
              { id: 'VICINITY_MAP', label: 'Nearby on Map', icon: MapPin },
              { id: 'TELE_COUNSELLING', label: '5-Min Doctor Call', icon: PhoneCall },
            ]},
            { heading: 'My records', items: [
              { id: 'WHATSAPP_FEED', label: 'Doctor WhatsApp', icon: MessageCircle },
              { id: 'ABHA_RECORDS', label: 'ABHA Health Locker', icon: ShieldCheck },
              { id: 'consents', label: 'Hospital Consents', icon: Building2, onClick: () => setShowConsentManager(true) },
            ]},
            { heading: 'Pregnancy & family', items: [
              { id: 'LABOUR_TRACKER', label: 'Labour Live Tracker', icon: Baby },
              { id: 'LIBRARY_AI', label: 'Library & AI Counsellor', icon: BookOpen },
              { id: 'FAMILY', label: 'Family Circle', icon: Users, badge: familyMembers.length },
            ]},
          ]}
          footer={
            <a href="tel:108" className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition">
              <AlertTriangle className="w-3.5 h-3.5" /> Emergency 108
            </a>
          }
        >
          <div className="space-y-6">

        {/* TAB 0: OVERVIEW DASHBOARD (CLEAN & LIGHT PATIENT INTERFACE) */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <CultPatientDashboard
              patient={patient}
              onOpenVicinityMap={() => setActiveTab('VICINITY_MAP')}
              onOpenTeleCounselling={() => setShowDoctorModal(true)}
              onOpenDoctorWhatsApp={() => setActiveTab('WHATSAPP_FEED')}
              onOpenCostEstimates={() => setActiveTab('DOCTORS_ESTIMATES')}
              onOpenAbhaLocker={() => setActiveTab('ABHA_RECORDS')}
              onOpenSchedule={() => setActiveTab('MY_SCHEDULE')}
            />

            {/* My Care Journey Banner */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-2xl shrink-0 border border-amber-200">
                  🌟
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    My Care Journey — Continuity Health Achievements
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    "Every step towards taking care of your health counts." Follow-up schedule and clinician-recorded milestones.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowJourneyModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-xs flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View My Care Journey</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB: DOCTORS & ESTIMATES */}
        {activeTab === 'DOCTORS_ESTIMATES' && (
          <CareFinderPanel mode="consult" onAskDoctor={() => setActiveTab('WHATSAPP_FEED')} />
        )}

        {/* TAB: MY SCHEDULES */}
        {activeTab === 'MY_SCHEDULE' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <PatientSchedulesPanel
              patient={patient}
              onBookNewAppointment={() => setActiveTab('DOCTORS_ESTIMATES')}
              onOpenWhatsApp={() => setActiveTab('WHATSAPP_FEED')}
            />
          </div>
        )}

        {/* TAB: DOCTOR WHATSAPP MESSAGES */}
        {activeTab === 'WHATSAPP_FEED' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <DoctorWhatsAppMessagesFeed
              patient={patient}
              onOpenDoctorCounselling={() => setActiveTab('TELE_COUNSELLING')}
            />
          </div>
        )}

        {/* TAB: ABHA HEALTH LOCKER */}
        {activeTab === 'ABHA_RECORDS' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <AbhaHealthLockerPanel
              patient={patient}
            />
          </div>
        )}

        {/* TAB 1: FAMILY CIRCLE */}
        {activeTab === 'FAMILY' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <FamilyMemberManagementPanel
              patient={patient}
              onSelectFamilyMemberAsActive={(member: FamilyMember) => setSelectedFamilyMember(member)}
            />
          </div>
        )}

        {/* TAB 2: LIBRARY & AI COUNSELLOR */}
        {activeTab === 'LIBRARY_AI' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Medical Knowledge Library &amp; Grounded AI</h2>
                <p className="text-xs text-slate-500">
                  Browse clinical reference material, watch educational videos, or ask the AI assistant questions grounded in FOGSI and WHO guidelines.
                </p>
              </div>
              <button
                onClick={() => setShowLibraryModal(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Full Library Reader</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <AiKnowledgeCounsellorPanel
                onOpenDoctorCounselling={() => setActiveTab('TELE_COUNSELLING')}
                patientGestation={patient.isPregnant ? `${patient.pregnancyWeeks || 28} weeks` : undefined}
              />
            </div>
          </div>
        )}

        {/* TAB 3: TREATMENT COSTS */}
        {activeTab === 'COSTS' && (
          <CareFinderPanel mode="costs" onAskDoctor={() => setActiveTab('WHATSAPP_FEED')} />
        )}

        {/* TAB 3B: GOOGLE MAPS VICINITY TRACKER & COST CHOOSER */}
        {activeTab === 'VICINITY_MAP' && <NearbyCareMap />}

        {/* TAB 4: TELE COUNSELLING */}
        {activeTab === 'TELE_COUNSELLING' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <EmergencyDoctorCounsellingModal
              initialPatientId={patient.id}
              onClose={() => setActiveTab('OVERVIEW')}
            />
          </div>
        )}

        {/* TAB 5: LABOUR LIVE TRACKER */}
        {activeTab === 'LABOUR_TRACKER' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <LabourDeliveryLiveTrackerModal
              initialPatientId={patient.id}
              onClose={() => setActiveTab('OVERVIEW')}
            />
          </div>
        )}

        {/* TAB 6: NEWBORN VACCINATIONS & MATERNAL TESTS */}
        {activeTab === 'VACCINES_TESTS' && (
          <div className="space-y-6">
            
            {/* Header & Explainer */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💉</span>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Vaccinations &amp; Clinical Testing Protocols
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                      National Immunization Schedule &amp; FOGSI Guidelines
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Specific vaccinations for newborns and infants, along with essential tests for mothers during pregnancy and the postpartum recovery phase.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowWhatsAppModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs border border-emerald-300 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Schedule</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Subsection 1: Newborn Immunization Schedule */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>👶 Newborn &amp; Infant Vaccination Schedule</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Administered according to standard WHO and Ministry of Health (MoHFW) protocols.
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  {(['ALL', 'AT_BIRTH', '6_WEEKS', '10_WEEKS', '14_WEEKS'] as const).map(milestone => (
                    <button
                      key={milestone}
                      onClick={() => setVaccineAgeFilter(milestone)}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                        vaccineAgeFilter === milestone 
                          ? 'bg-indigo-700 text-white font-bold' 
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {milestone === 'ALL' ? 'All Vaccines' : milestone.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vaccine Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVaccines.map((vac: VaccineScheduleItem) => {
                  const isGiven = vac.status === 'GIVEN';
                  const isDue = vac.status === 'DUE';
                  return (
                    <div 
                      key={vac.id}
                      className={`p-4 rounded-2xl border transition ${
                        isGiven 
                          ? 'bg-emerald-50/40 border-emerald-200' 
                          : isDue 
                            ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-200' 
                            : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                          {vac.recommendedAgeLabel}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isGiven 
                            ? 'bg-emerald-600 text-white' 
                            : isDue 
                              ? 'bg-amber-500 text-white animate-pulse' 
                              : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isGiven ? '✓ Administered' : isDue ? '● Due Now' : 'Upcoming'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {vac.vaccineName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Protects against: <span className="font-semibold text-slate-700">{vac.targetDisease}</span>
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] space-y-1 text-slate-600">
                        {vac.administeredDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Date:</span>
                            <span className="font-semibold text-emerald-800">{vac.administeredDate}</span>
                          </div>
                        )}
                        {vac.batchNumber && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Batch:</span>
                            <span className="font-mono text-[10px] text-slate-700">{vac.batchNumber}</span>
                          </div>
                        )}
                        {vac.administeredBy && (
                          <div className="text-[10px] text-slate-500 truncate">
                            By: {vac.administeredBy}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subsection 2: Mother's Tests During & After Pregnancy */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>🤰 Mother's Clinical Tests (Antenatal &amp; Postnatal)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mandatory laboratory scans and biochemistry screens across trimesters and postpartum follow-up.
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
                  {(['ALL', 'PREGNANCY_1ST_TRIMESTER', 'PREGNANCY_2ND_TRIMESTER', 'PREGNANCY_3RD_TRIMESTER', 'POSTNATAL_6WEEKS'] as const).map(stage => (
                    <button
                      key={stage}
                      onClick={() => setTestStageFilter(stage)}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] whitespace-nowrap ${
                        testStageFilter === stage 
                          ? 'bg-rose-700 text-white font-bold' 
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {stage === 'ALL' ? 'All Stages' : stage.replace('PREGNANCY_', '').replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTests.map((test: MaternalTestProtocol) => (
                  <div 
                    key={test.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-rose-300 transition space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                        {test.stageLabel}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        test.isMandatory ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {test.isMandatory ? 'Mandatory Protocol' : 'Elective Screening'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {test.testName}
                    </h4>
                    
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {test.clinicalRationale}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 font-medium">
                      <span>Timing: <strong className="text-slate-700">{test.timingDescription}</strong></span>
                      <span>Sample: <strong className="text-slate-700">{test.sampleType}</strong></span>
                      <span>Turnaround: <strong className="text-slate-700">{test.turnaroundHours}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 7: CARE JOURNEY */}
        {activeTab === 'CARE_JOURNEY' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <MyCareJourneyModal
              initialPatientId={patient.id}
              onClose={() => setActiveTab('OVERVIEW')}
            />
          </div>
        )}

        {/* TAB 8: NOTIFICATIONS */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <NotificationCenterModal
              initialPatientId={patient.id}
              onClose={() => setActiveTab('OVERVIEW')}
            />
          </div>
        )}

                </div>
        </PortalSidebarLayout>
      </main>

      {/* Auxiliary Modals */}
      {showLibraryModal && (
        <KnowledgeLibraryModal 
          onClose={() => setShowLibraryModal(false)}
          onOpenDoctorCounselling={() => {
            setShowLibraryModal(false);
            setActiveTab('TELE_COUNSELLING');
          }}
        />
      )}

      {showCostModal && (
        <TreatmentCostEstimatorModal
          initialPatientId={patient.id}
          onClose={() => setShowCostModal(false)}
        />
      )}

      {showDoctorModal && (
        <EmergencyDoctorCounsellingModal
          initialPatientId={patient.id}
          onClose={() => setShowDoctorModal(false)}
        />
      )}

      {showLabourModal && (
        <LabourDeliveryLiveTrackerModal
          initialPatientId={patient.id}
          onClose={() => setShowLabourModal(false)}
        />
      )}

      {showNotificationModal && (
        <NotificationCenterModal
          initialPatientId={patient.id}
          onClose={() => setShowNotificationModal(false)}
        />
      )}

      {showJourneyModal && (
        <MyCareJourneyModal
          initialPatientId={patient.id}
          onClose={() => setShowJourneyModal(false)}
        />
      )}

      {showWhatsAppModal && (
        <WhatsAppJourneyModal
          initialPatientId={patient.id}
          onClose={() => setShowWhatsAppModal(false)}
        />
      )}

      <AbhaMultiHospitalConsentModal
        patient={patient}
        isOpen={showConsentManager}
        onClose={() => setShowConsentManager(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Continuum Maternal &amp; Family Care Portal &bull; Constant ABHA Data Storage Across All Vicinity Hospitals</span>
          <span className="text-[11px] text-slate-400">
            Compliant with ABDM, NDHM and Personal Health Data Privacy Standards
          </span>
        </div>
      </footer>

    </div>
  );
};
