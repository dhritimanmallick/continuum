import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  UserPlus, 
  Clock, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Printer, 
  AlertCircle,
  Eye,
  UserCheck,
  Send,
  Sparkles,
  ChevronRight,
  Filter,
  Users,
  Scan,
  Baby,
  Heart,
  Phone,
  Wallet
} from 'lucide-react';
import { OpdPatient, OpdClinic } from '../../types';
import { opdStore, OPD_CLINICS } from '../../services/opdStore';
import { PatientDatabaseView } from './PatientDatabaseView';
import { ScanPrescriptionModal } from './ScanPrescriptionModal';
import { CareGapNudgesPanel } from './CareGapNudgesPanel';
import { WhatsAppCreditsPanel } from '../billing/WhatsAppCredits';
import { PortalSidebarLayout } from '../layout/PortalSidebarLayout';
import { getCareGapNudges, lastNudge } from '../../services/careGapNudges';

interface ReceptionViewProps {
  onOpenNewPatientModal: () => void;
  onOpenWhatsAppView: (patientId?: string) => void;
  onSelectPatient: (patient: OpdPatient) => void;
}

export const ReceptionView: React.FC<ReceptionViewProps> = ({
  onOpenNewPatientModal,
  onOpenWhatsAppView,
  onSelectPatient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [receptionViewMode, setReceptionViewMode] = useState<'QUEUE' | 'DATABASE' | 'CARE_GAPS' | 'CREDITS'>('QUEUE');
  const [isScanRxModalOpen, setIsScanRxModalOpen] = useState(false);
  const [selectedScanPatient, setSelectedScanPatient] = useState<OpdPatient | null>(null);

  const selectedClinic = opdStore.getSelectedClinic();
  const clinicPatients = opdStore.getPatientsForClinic(selectedClinic.id);

  const patients = clinicPatients.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.mobile.includes(q) ||
        p.opdId.toLowerCase().includes(q) ||
        (p.abhaId || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingNudges = getCareGapNudges(clinicPatients).filter(n => !lastNudge(n)).length;

  const handleOpenScanRx = (patient?: OpdPatient) => {
    setSelectedScanPatient(patient || null);
    setIsScanRxModalOpen(true);
  };

  return (
    <div className="space-y-6 mx-auto text-xs">
      <PortalSidebarLayout
        activeId={receptionViewMode}
        onSelect={id => setReceptionViewMode(id as 'QUEUE' | 'DATABASE' | 'CARE_GAPS' | 'CREDITS')}
        mobileTabs={[
          { id: 'QUEUE', label: 'Queue' },
          { id: 'CARE_GAPS', label: 'Care gaps' },
          { id: 'register', label: 'Register' },
          { id: 'scan', label: 'Scan slip' },
        ]}
        header={
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Front desk</div>
            <div className="text-sm font-extrabold text-slate-900 truncate">{selectedClinic.receptionistName || 'Reception'}</div>
            <div className="text-[11px] text-slate-500 truncate">{selectedClinic.shortName}</div>
          </div>
        }
        groups={[
          { heading: 'Front desk', items: [
            { id: 'QUEUE', label: "Today's Queue", icon: Clock, badge: clinicPatients.filter(p => p.queueStatus === 'Waiting').length, badgeTone: 'amber' },
            { id: 'CARE_GAPS', label: 'Care Gaps & Nudges', icon: Send, badge: pendingNudges, badgeTone: 'rose' },
            { id: 'DATABASE', label: 'Patient Database', icon: Users },
            { id: 'CREDITS', label: 'WhatsApp & Credits', icon: Wallet },
          ]},
          { heading: 'Actions', items: [
            { id: 'register', label: 'Register New Patient', icon: UserPlus, onClick: onOpenNewPatientModal },
            { id: 'scan', label: 'Digitize Paper Slip', icon: Scan, onClick: () => handleOpenScanRx() },
          ]},
          { heading: 'OPD rooms', items: OPD_CLINICS.map(clinic => ({
            id: `room-${clinic.id}`,
            label: clinic.shortName.replace(/\s*\(.*\)\s*/, ''),
            icon: Building2,
            badge: opdStore.getPatientsForClinic(clinic.id).length,
            selected: clinic.id === selectedClinic.id,
            onClick: () => opdStore.setSelectedClinic(clinic.id),
          }))},
        ]}
      >
        <div className="space-y-4 sm:space-y-6">
      {/* Reception Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            {selectedClinic.roomNumber}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Lead: {selectedClinic.leadDoctor} • Reception: {selectedClinic.receptionistName}
          </span>
        </div>
        <h1 className="text-lg sm:text-2xl font-bold text-slate-900 sm:mt-1">
          {receptionViewMode === 'CREDITS' ? 'WhatsApp & Credits' : receptionViewMode === 'CARE_GAPS' ? 'Care Gaps & Nudges' : receptionViewMode === 'DATABASE' ? 'Visited Patients Database' : "Today's Queue"}
          <span className="hidden sm:inline text-slate-400 font-semibold text-base"> · {selectedClinic.name}</span>
        </h1>
        <p className="sm:hidden text-xs text-slate-500 mt-0.5">{selectedClinic.roomNumber} · {selectedClinic.leadDoctor}</p>
      </div>

      {/* Main Reception Workspace: Database or Active Queue */}
      {receptionViewMode === 'CARE_GAPS' ? (
        <CareGapNudgesPanel
          patients={clinicPatients}
          scopeLabel={selectedClinic.name}
          sentBy={`${selectedClinic.receptionistName || 'Reception'} (Reception)`}
          onOpenWhatsAppView={onOpenWhatsAppView}
          onSelectPatient={onSelectPatient}
          onOpenCredits={() => setReceptionViewMode('CREDITS')}
        />
      ) : receptionViewMode === 'CREDITS' ? (
        <WhatsAppCreditsPanel />
      ) : receptionViewMode === 'DATABASE' ? (
        <PatientDatabaseView 
          onOpenWhatsAppView={onOpenWhatsAppView}
          onSelectPatient={onSelectPatient}
        />
      ) : (
        <>
          {/* KPI Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Waiting for Doctor</span>
              <span className="text-xl sm:text-2xl font-black text-amber-600 mt-1 block">
                {clinicPatients.filter(p => p.queueStatus === 'Waiting').length}
              </span>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">In Consultation</span>
              <span className="text-xl sm:text-2xl font-black text-rose-700 mt-1 block">
                {clinicPatients.filter(p => p.queueStatus === 'With Doctor').length}
              </span>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">In Lab / Diagnostics</span>
              <span className="text-xl sm:text-2xl font-black text-purple-700 mt-1 block">
                {clinicPatients.filter(p => p.queueStatus === 'Lab Pending' || p.queueStatus === 'In Lab').length}
              </span>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Care Loop Completed</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 block">
                {clinicPatients.filter(p => p.queueStatus === 'Completed').length}
              </span>
            </div>
          </div>

          {/* Search & Patient Queue Table */}
          <div className="bg-white rounded-3xl border border-rose-100 shadow-2xs overflow-hidden space-y-4 p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-rose-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, mobile, ABHA or token"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 sm:py-2 text-base sm:text-xs bg-rose-50/40 border border-rose-200 rounded-xl text-xs font-medium focus:bg-white focus:border-rose-400 focus:outline-none"
                />
              </div>

              <span className="text-xs font-bold text-slate-500">
                Showing {patients.length} patients registered in {selectedClinic.shortName}
              </span>
            </div>

            {/* Phone: one card per patient, big actions */}
            <ul className="md:hidden space-y-3">
              {patients.length === 0 && (
                <li className="text-center text-sm text-slate-500 py-8">No patients match your search.</li>
              )}
              {patients.map(p => {
                const status = p.queueStatus;
                const tone = status === 'Completed' ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : status === 'Lab Pending' || status === 'In Lab' ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : status === 'With Doctor' ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300';
                return (
                  <li key={p.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                    <button type="button" onClick={() => onSelectPatient(p)} className="w-full flex items-start gap-3 text-left cursor-pointer">
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-700 to-pink-600 text-white font-mono font-black text-sm flex items-center justify-center shrink-0">
                        #{p.tokenNumber}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-base font-extrabold text-slate-900 truncate">{p.name}</span>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${tone}`}>{status}</span>
                        </span>
                        <span className="block text-xs text-slate-500 mt-0.5">
                          {p.age} yrs{p.pregnancyDetails ? ` · ${p.pregnancyDetails.gestationalAgeWeeks} weeks pregnant` : ''}
                        </span>
                        <span className="block text-sm text-slate-700 mt-1 line-clamp-2">{p.visitReason}</span>
                      </span>
                    </button>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <a href={`tel:${p.mobile.replace(/\s/g, '')}`} className="flex items-center justify-center gap-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-800 active:bg-slate-50">
                        <Phone className="w-4 h-4" /> Call
                      </a>
                      <button type="button" onClick={() => onOpenWhatsAppView(p.id)} className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-emerald-600 text-white text-[13px] font-bold active:bg-emerald-700 cursor-pointer">
                        <MessageSquare className="w-4 h-4" /> WhatsApp
                      </button>
                      <button type="button" onClick={() => onSelectPatient(p)} className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-rose-700 text-white text-[13px] font-bold active:bg-rose-800 cursor-pointer">
                        <Eye className="w-4 h-4" /> Open
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-rose-50/50 text-rose-900 font-bold border-b border-rose-100 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Token & Patient</th>
                    <th className="py-3 px-3">ABHA & Mobile</th>
                    <th className="py-3 px-4">Gestation / Reason</th>
                    <th className="py-3 px-3">Assigned Doctor</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  {patients.map(p => {
                    const isCompleted = p.queueStatus === 'Completed';

                    return (
                      <tr key={p.id} className="hover:bg-rose-50/40 transition">
                        {/* Token & Patient */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-700 to-pink-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                              #{p.tokenNumber}
                            </span>
                            <div>
                              <span className="font-extrabold text-slate-900 block">{p.name}</span>
                              <span className="text-[11px] text-slate-500">{p.age} yrs • {p.gender}</span>
                            </div>
                          </div>
                        </td>

                        {/* ABHA & Mobile */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-[11px] font-bold text-slate-700 block">{p.abhaId}</span>
                          <span className="text-[11px] text-slate-500">📞 {p.mobile}</span>
                        </td>

                        {/* Reason for Visit */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 block">{p.visitReason}</span>
                            {p.pregnancyDetails && (
                              <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-full inline-block border border-rose-200">
                                🤰 {p.pregnancyDetails.gestationalAgeWeeks}w · EDD: {p.pregnancyDetails.edd}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Assigned Doctor */}
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-900 block">{p.assignedDoctor || selectedClinic.leadDoctor}</span>
                          <span className="text-[11px] text-slate-500">{selectedClinic.roomNumber}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : p.queueStatus === 'Lab Pending' || p.queueStatus === 'In Lab'
                              ? 'bg-purple-100 text-purple-900 border-purple-300'
                              : p.queueStatus === 'With Doctor'
                              ? 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}>
                            {p.queueStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onSelectPatient(p)}
                              className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-900 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition shadow-2xs"
                              title="View patient gist & records"
                            >
                              <Eye className="w-3.5 h-3.5 text-rose-600" />
                              <span>Profile</span>
                            </button>

                            <button
                              onClick={() => onOpenWhatsAppView(p.id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition shadow-2xs"
                              title="Inspect WhatsApp messages sent to this mother"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

        </div>
      </PortalSidebarLayout>

      {/* External Paper Prescription Digitize Modal */}
      {isScanRxModalOpen && (
        <ScanPrescriptionModal
          isOpen={isScanRxModalOpen}
          onClose={() => setIsScanRxModalOpen(false)}
          initialPatient={selectedScanPatient}
        />
      )}
    </div>
  );
};
