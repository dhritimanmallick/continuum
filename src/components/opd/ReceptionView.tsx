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
  Heart
} from 'lucide-react';
import { OpdPatient, OpdClinic } from '../../types';
import { opdStore, OPD_CLINICS } from '../../services/opdStore';
import { PatientDatabaseView } from './PatientDatabaseView';
import { ScanPrescriptionModal } from './ScanPrescriptionModal';
import { CareGapNudgesPanel } from './CareGapNudgesPanel';
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
  const [receptionViewMode, setReceptionViewMode] = useState<'QUEUE' | 'DATABASE' | 'CARE_GAPS'>('QUEUE');
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
    <div className="space-y-6 max-w-7xl mx-auto text-xs">
      {/* Reception Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {selectedClinic.roomNumber}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Lead: {selectedClinic.leadDoctor} • Reception: {selectedClinic.receptionistName}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {selectedClinic.name}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setReceptionViewMode(receptionViewMode === 'DATABASE' ? 'QUEUE' : 'DATABASE')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border font-extrabold text-xs rounded-2xl shadow-2xs transition cursor-pointer active:scale-95 ${
                receptionViewMode === 'DATABASE'
                  ? 'bg-rose-800 text-white border-rose-900'
                  : 'bg-white hover:bg-rose-50 text-slate-800 border-rose-200'
              }`}
            >
              <Users className="w-4 h-4 text-rose-600" />
              <span>{receptionViewMode === 'DATABASE' ? "← Today's Queue" : 'All Visited Mothers Database'}</span>
            </button>

            <button
              onClick={() => handleOpenScanRx()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-rose-50 border border-rose-200 text-slate-800 font-extrabold text-xs rounded-2xl shadow-2xs transition cursor-pointer active:scale-95"
              title="Digitize physical paper prescription brought from outside doctor"
            >
              <Scan className="w-4 h-4 text-rose-700" />
              <span>Digitize External Paper Slip</span>
            </button>

            <button
              onClick={onOpenNewPatientModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-slate-300" />
              <span>+ Register New Patient</span>
            </button>
          </div>
        </div>

        {/* OPD Clinic Switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-rose-200/60 text-xs">
          <span className="text-rose-900 font-bold text-[11px]">OPD Room:</span>
          <div className="flex flex-wrap items-center gap-1.5 font-bold">
            {OPD_CLINICS.map(clinic => (
              <button
                key={clinic.id}
                onClick={() => opdStore.setSelectedClinic(clinic.id)}
                className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  clinic.id === selectedClinic.id
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-rose-100/60 border border-rose-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{clinic.shortName}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {opdStore.getPatientsForClinic(clinic.id).length}
                </span>
              </button>
            ))}
          </div>
          <button
              onClick={() => setReceptionViewMode(receptionViewMode === 'CARE_GAPS' ? 'QUEUE' : 'CARE_GAPS')}
              className={`ml-auto inline-flex items-center gap-2 px-4 py-1.5 border font-extrabold text-xs rounded-2xl shadow-2xs transition cursor-pointer active:scale-95 ${
                receptionViewMode === 'CARE_GAPS'
                  ? 'bg-rose-800 text-white border-rose-900'
                  : 'bg-white hover:bg-rose-50 text-slate-800 border-rose-200'
              }`}
              title="Patients to nudge for tests, medicines, follow-ups and vaccinations"
            >
              <Send className={`w-4 h-4 ${receptionViewMode === 'CARE_GAPS' ? 'text-rose-200' : 'text-rose-600'}`} />
              <span>{receptionViewMode === 'CARE_GAPS' ? "← Today's Queue" : 'Care Gaps'}</span>
              {receptionViewMode !== 'CARE_GAPS' && pendingNudges > 0 && (
                <span className="text-[10px] bg-rose-600 text-white px-1.5 rounded-full font-bold">{pendingNudges}</span>
              )}
            </button>
        </div>
      </div>

      {/* Main Reception Workspace: Database or Active Queue */}
      {receptionViewMode === 'CARE_GAPS' ? (
        <CareGapNudgesPanel
          patients={clinicPatients}
          scopeLabel={selectedClinic.name}
          sentBy={`${selectedClinic.receptionistName || 'Reception'} (Reception)`}
          onOpenWhatsAppView={onOpenWhatsAppView}
          onSelectPatient={onSelectPatient}
        />
      ) : receptionViewMode === 'DATABASE' ? (
        <PatientDatabaseView 
          onOpenWhatsAppView={onOpenWhatsAppView}
          onSelectPatient={onSelectPatient}
        />
      ) : (
        <>
          {/* KPI Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Waiting for Doctor</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">
                {clinicPatients.filter(p => p.queueStatus === 'Waiting').length}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">In Consultation</span>
              <span className="text-2xl font-black text-rose-700 mt-1 block">
                {clinicPatients.filter(p => p.queueStatus === 'With Doctor').length}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">In Lab / Diagnostics</span>
              <span className="text-2xl font-black text-purple-700 mt-1 block">
                {clinicPatients.filter(p => p.queueStatus === 'Lab Pending' || p.queueStatus === 'In Lab').length}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Care Loop Completed</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {clinicPatients.filter(p => p.queueStatus === 'Completed').length}
              </span>
            </div>
          </div>

          {/* Search & Patient Queue Table */}
          <div className="bg-white rounded-3xl border border-rose-100 shadow-2xs overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-rose-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search mother name, ABHA ID, mobile, token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-rose-50/40 border border-rose-200 rounded-xl text-xs font-medium focus:bg-white focus:border-rose-400 focus:outline-none"
                />
              </div>

              <span className="text-xs font-bold text-slate-500">
                Showing {patients.length} patients registered in {selectedClinic.shortName}
              </span>
            </div>

            <div className="overflow-x-auto">
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
