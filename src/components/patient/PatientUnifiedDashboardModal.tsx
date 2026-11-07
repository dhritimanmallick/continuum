import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calculator, 
  PhoneCall, 
  Baby, 
  Bell, 
  Sparkles, 
  X, 
  Heart, 
  ShieldCheck, 
  Award,
  ChevronRight,
  User,
  Activity
} from 'lucide-react';
import { OpdPatient, FamilyMember } from '../../types';
import { opdStore } from '../../services/opdStore';
import { FamilyMemberManagementPanel } from './FamilyMemberManagementPanel';
import { AiKnowledgeCounsellorPanel } from './AiKnowledgeCounsellorPanel';
import { KnowledgeLibraryModal } from './KnowledgeLibraryModal';
import { TreatmentCostEstimatorModal } from './TreatmentCostEstimatorModal';
import { EmergencyDoctorCounsellingModal } from './EmergencyDoctorCounsellingModal';
import { LabourDeliveryLiveTrackerModal } from './LabourDeliveryLiveTrackerModal';
import { NotificationCenterModal } from './NotificationCenterModal';

interface PatientUnifiedDashboardModalProps {
  initialPatientId?: string;
  initialTab?: 'FAMILY' | 'LIBRARY' | 'AI_COUNSELLOR' | 'COSTS' | 'COUNSELLING' | 'LABOUR' | 'NOTIFICATIONS';
  onClose: () => void;
  onOpenWhatsAppView?: (patientId?: string) => void;
  onOpenCareJourney?: (patientId?: string) => void;
}

export const PatientUnifiedDashboardModal: React.FC<PatientUnifiedDashboardModalProps> = ({
  initialPatientId,
  initialTab = 'FAMILY',
  onClose,
  onOpenWhatsAppView,
  onOpenCareJourney
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatientId || opdStore.patients[0]?.id || 'PAT-104'
  );
  const [activeTab, setActiveTab] = useState<'FAMILY' | 'LIBRARY' | 'AI_COUNSELLOR' | 'COSTS' | 'COUNSELLING' | 'LABOUR' | 'NOTIFICATIONS'>(initialTab);
  const [activeFamilyMember, setActiveFamilyMember] = useState<FamilyMember | null>(null);

  const patient = opdStore.patients.find(p => p.id === selectedPatientId) || opdStore.patients[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-[#faf8f6] rounded-3xl shadow-2xl border border-slate-200 max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden text-xs">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950 via-purple-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-rose-900/60 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center font-bold text-rose-300 text-base shadow-xs">
              👩‍👧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">CONTINUUM — PATIENT &amp; FAMILY HUB</h3>
                <span className="text-[10px] bg-rose-800 text-rose-200 px-2 py-0.5 rounded-full font-bold">
                  All-In-One Maternal &amp; OPD Suite
                </span>
              </div>
              <p className="text-[11px] text-rose-200 font-medium">
                Family members, grounded AI counselling, delivery updates, cost estimates, and rapid doctor access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Patient Chooser */}
            <div className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
              <span className="text-rose-200 text-[11px] font-semibold hidden sm:inline">Active Patient:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  setActiveFamilyMember(null);
                }}
                className="bg-rose-900/90 text-white text-[11px] rounded-lg px-2 py-1 font-bold border border-rose-700/80 cursor-pointer"
              >
                {opdStore.patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.isPregnant ? 'Pregnancy' : p.visitReason.slice(0, 15)})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 overflow-x-auto flex items-center gap-1.5 shrink-0">
          {[
            { key: 'FAMILY', label: 'Family Members', icon: Users, color: 'text-rose-600' },
            { key: 'AI_COUNSELLOR', label: 'AI Health Counsellor', icon: Sparkles, color: 'text-purple-600' },
            { key: 'LIBRARY', label: 'Medical Library & Videos', icon: BookOpen, color: 'text-indigo-600' },
            { key: 'COSTS', label: 'Estimated Treatment Costs', icon: Calculator, color: 'text-emerald-600' },
            { key: 'COUNSELLING', label: 'Doctor Tele-Counselling', icon: PhoneCall, color: 'text-red-600' },
            { key: 'LABOUR', label: 'Labour & Delivery Tracker', icon: Baby, color: 'text-pink-600' },
            { key: 'NOTIFICATIONS', label: 'Notification Hub', icon: Bell, color: 'text-blue-600' }
          ].map(tab => {
            const isSelected = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: FAMILY MEMBERS */}
          {activeTab === 'FAMILY' && (
            <FamilyMemberManagementPanel 
              patient={patient} 
              onSelectFamilyMemberAsActive={(member) => setActiveFamilyMember(member)}
              activeMemberId={activeFamilyMember?.id}
            />
          )}

          {/* TAB 2: AI HEALTH COUNSELLOR (RAG) */}
          {activeTab === 'AI_COUNSELLOR' && (
            <AiKnowledgeCounsellorPanel 
              onOpenDoctorCounselling={() => setActiveTab('COUNSELLING')}
              patientGestation={patient.pregnancyDetails ? `${patient.pregnancyDetails.gestationalAgeWeeks} weeks` : undefined}
            />
          )}

          {/* TAB 3: MEDICAL KNOWLEDGE LIBRARY */}
          {activeTab === 'LIBRARY' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <KnowledgeLibraryModal 
                onClose={() => {}} 
                onOpenDoctorCounselling={() => setActiveTab('COUNSELLING')} 
              />
            </div>
          )}

          {/* TAB 4: ESTIMATED TREATMENT COSTS */}
          {activeTab === 'COSTS' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-2">
              <TreatmentCostEstimatorModal
                initialPatientId={patient.id}
                onClose={() => {}}
              />
            </div>
          )}

          {/* TAB 5: DOCTOR TELE-COUNSELLING */}
          {activeTab === 'COUNSELLING' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-2">
              <EmergencyDoctorCounsellingModal
                initialPatientId={patient.id}
                onClose={() => {}}
              />
            </div>
          )}

          {/* TAB 6: LABOUR & DELIVERY TRACKER */}
          {activeTab === 'LABOUR' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-2">
              <LabourDeliveryLiveTrackerModal
                initialPatientId={patient.id}
                onClose={() => {}}
              />
            </div>
          )}

          {/* TAB 7: NOTIFICATIONS */}
          {activeTab === 'NOTIFICATIONS' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-2">
              <NotificationCenterModal
                initialPatientId={patient.id}
                onClose={() => {}}
                onOpenWhatsAppView={() => onOpenWhatsAppView && onOpenWhatsAppView(patient.id)}
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
