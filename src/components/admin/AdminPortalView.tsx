import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Stethoscope, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Sparkles, 
  DoorOpen, 
  TestTubes, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Heart, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  ChevronRight, 
  Edit3, 
  Filter, 
  Search, 
  Layers, 
  Zap,
  Check,
  Globe,
  Store,
  Pill,
  Microscope
} from 'lucide-react';
import { opdStore } from '../../services/opdStore';
import { integrationBackbone } from '../../services/integrationBackbone';
import { authService } from '../../services/authService';
import { ondcNetworkService } from '../../services/ondcNetworkService';
import { OndcVendorOnboardingModal } from '../ondc/OndcVendorOnboardingModal';
import { CareGapNudgesPanel } from '../opd/CareGapNudgesPanel';
import { PortalSidebarLayout } from '../layout/PortalSidebarLayout';
import { getCareGapNudges, lastNudge } from '../../services/careGapNudges';
import { Send as SendIcon, Wallet as WalletIcon } from 'lucide-react';
import { WhatsAppCreditsPanel } from '../billing/WhatsAppCredits';
import { DoctorProfile, HospitalRoom, DiagnosticLabConfig, OpdPatient } from '../../types';

interface AdminPortalViewProps {
  onNavigateToPortal?: (portal: 'OPD' | 'LAB' | 'PHARMA', role?: 'RECEPTION' | 'DOCTOR') => void;
  onOpenWhatsAppView?: (patientId?: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ onNavigateToPortal, onOpenWhatsAppView }) => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'rooms' | 'patients' | 'caregaps' | 'whatsapp' | 'labs' | 'ondc' | 'backbone'>('doctors');
  
  // Doctors state
  const doctors = opdStore.getDoctorProfiles();
  const rooms = opdStore.getHospitalRooms();
  const labs = opdStore.getDiagnosticLabs();
  const patients = opdStore.patients;
  const facility = opdStore.getHospitalFacility();
  const backboneEvents = integrationBackbone.getEvents();
  const backboneNodes = integrationBackbone.getNodes();
  const ondcNodes = ondcNetworkService.getNodes();
  const ondcTransactions = ondcNetworkService.getTransactions();

  // Modals state
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showReallocateRoomModal, setShowReallocateRoomModal] = useState<DoctorProfile | null>(null);
  const [showReallocateLabModal, setShowReallocateLabModal] = useState<DoctorProfile | null>(null);
  const [showTransferPatientModal, setShowTransferPatientModal] = useState<OpdPatient | null>(null);
  const [showOndcOnboardModal, setShowOndcOnboardModal] = useState(false);

  // New Doctor Form state
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('Obstetrics & Gynaecology (High-Risk Maternal)');
  const [newDocQualification, setNewDocQualification] = useState('MBBS, MS (OB/GYN), DNB');
  const [newDocDepartment, setNewDocDepartment] = useState('Maternal & Child Health (MCH)');
  const [newDocRoom, setNewDocRoom] = useState('Room 5');
  const [newDocLabId, setNewDocLabId] = useState('lab-apex');
  const [newDocFee, setNewDocFee] = useState(350);
  const [newDocPhone, setNewDocPhone] = useState('+91 98450 67890');
  const [newDocEmail, setNewDocEmail] = useState('');
  const [newDocRegNo, setNewDocRegNo] = useState('KMC-59218');
  const [newDocShift, setNewDocShift] = useState('09:00 - 16:00 (General OPD)');
  const [newDocTheme, setNewDocTheme] = useState('rose');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const formattedName = newDocName.trim().startsWith('Dr.') ? newDocName.trim() : `Dr. ${newDocName.trim()}`;
    const created = opdStore.addDoctor({
      name: formattedName,
      specialty: newDocSpecialty,
      qualification: newDocQualification,
      department: newDocDepartment,
      roomNumber: newDocRoom,
      allocatedLabId: newDocLabId,
      consultationFee: Number(newDocFee),
      phone: newDocPhone,
      email: newDocEmail || `${formattedName.toLowerCase().replace(/[^a-z]/g, '')}@stannehospital.in`,
      regNo: newDocRegNo,
      shiftTiming: newDocShift,
      colorTheme: newDocTheme
    });

    showToast(`Dr. ${created.name} successfully registered, allocated to ${newDocRoom}, and login account provisioned!`);
    setShowAddDoctorModal(false);
    // Reset form
    setNewDocName('');
  };

  const handleRoomAllocation = (doctorId: string, targetRoom: string) => {
    const success = opdStore.allocateRoom(doctorId, targetRoom);
    if (success) {
      showToast(`Room updated to ${targetRoom} for doctor.`);
      setShowReallocateRoomModal(null);
    }
  };

  const handleLabAllocation = (doctorId: string, targetLabId: string) => {
    const success = opdStore.allocateLab(doctorId, targetLabId);
    if (success) {
      showToast('Primary diagnostic lab routing updated successfully.');
      setShowReallocateLabModal(null);
    }
  };

  const handlePatientTransfer = (patientId: string, targetDoctorId: string) => {
    const success = opdStore.allocatePatient(patientId, targetDoctorId);
    if (success) {
      const doc = doctors.find(d => d.id === targetDoctorId);
      showToast(`Patient successfully transferred to ${doc?.name || 'doctor'} in ${doc?.roomNumber}.`);
      setShowTransferPatientModal(null);
    }
  };

  const handleTriggerSimulation = () => {
    integrationBackbone.simulateEndToEndTransaction('Sunita Das', 'Dr. Anita Rao');
    showToast('⚡ Live multi-hop transaction triggered across Admin → Doctor → Lab → Pharmacy → ABDM!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-rose-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="text-xs font-bold">{notificationToast}</span>
        </div>
      )}

      <PortalSidebarLayout
        activeId={activeTab}
        onSelect={id => setActiveTab(id as typeof activeTab)}
        header={
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Administration</div>
            <div className="text-sm font-extrabold text-slate-900 truncate">St. Anne Hospital</div>
            <div className="text-[11px] text-slate-500 truncate">Medical Superintendent</div>
          </div>
        }
        groups={[
          { heading: 'People & spaces', items: [
            { id: 'doctors', label: 'Doctors', icon: Stethoscope, badge: doctors.length },
            { id: 'rooms', label: 'Rooms', icon: DoorOpen, badge: rooms.length },
            { id: 'patients', label: 'Patients', icon: Users, badge: patients.length },
          ]},
          { heading: 'Patient follow-through', items: [
            { id: 'caregaps', label: 'Care Gaps & Nudges', icon: SendIcon, badge: getCareGapNudges(opdStore.getAllVisitedPatients()).filter(n => !lastNudge(n)).length, badgeTone: 'rose' },
            { id: 'whatsapp', label: 'WhatsApp & Billing', icon: WalletIcon },
          ]},
          { heading: 'Network & integrations', items: [
            { id: 'labs', label: 'Labs', icon: TestTubes, badge: labs.length },
            { id: 'ondc', label: 'ONDC Vendors', icon: Globe, badge: ondcNodes.filter(n => n.type === 'BPP').length },
            { id: 'backbone', label: 'Integration Backbone', icon: Zap },
          ]},
        ]}
      >
        <div className="space-y-6">
      {/* Facility Overview Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Administration
              </span>
              <span className="text-xs text-slate-500">
                Director: {facility.medicalDirector}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {facility.name}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="px-3.5 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Doctor</span>
            </button>
          </div>
        </div>

        {/* Live Census KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Doctors</span>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">{doctors.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Rooms Occupied</span>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
              {rooms.filter(r => r.status === 'OCCUPIED').length} / {rooms.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">OPD Patients</span>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">{patients.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Lab Requisitions</span>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
              {labs.reduce((acc, l) => acc + l.activeRequisitionsCount, 0)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Total Beds</span>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">{facility.totalBeds}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Integration</span>
            <span className="text-2xl font-bold text-emerald-600 mt-0.5 block">Active</span>
          </div>
        </div>
      </div>

      {/* TAB 1: DOCTORS */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Doctors & Specialists
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search doctor or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>

              <button
                onClick={() => setShowAddDoctorModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Doctor</span>
              </button>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors
              .filter(d => 
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(doc => {
                const assignedPatientsCount = patients.filter(p => (p.clinicId || 'opd-anc') === doc.clinicId || p.assignedDoctor === doc.name).length;
                return (
                  <div 
                    key={doc.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top doctor card header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-300 text-rose-800 flex items-center justify-center font-black text-base shadow-2xs">
                            {doc.avatarInitials}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                              <span>{doc.name}</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active on duty" />
                            </h3>
                            <p className="text-[11px] text-rose-700 font-semibold">{doc.qualification}</p>
                            <span className="text-[10px] text-slate-400 font-mono">Reg: {doc.regNo || 'KMC-Verified'}</span>
                          </div>
                        </div>

                        <span className="px-2 py-1 rounded-lg bg-slate-900 text-rose-200 font-bold text-[10px]">
                          ₹{doc.consultationFee}
                        </span>
                      </div>

                      <div className="mt-3 p-3 bg-slate-50/80 rounded-xl space-y-2 text-xs border border-slate-100">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Specialty:</span>
                          <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">{doc.specialty}</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Allocated Room:</span>
                          <button
                            onClick={() => setShowReallocateRoomModal(doc)}
                            className="font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 flex items-center gap-1 cursor-pointer transition"
                            title="Click to reallocate room"
                          >
                            <span>{doc.roomNumber}</span>
                            <Edit3 className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Primary Lab:</span>
                          <button
                            onClick={() => setShowReallocateLabModal(doc)}
                            className="font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1 cursor-pointer transition truncate max-w-[170px]"
                            title="Click to reallocate primary lab"
                          >
                            <span className="truncate">{doc.allocatedLabName?.split(' ')[0] || 'In-House Lab'}</span>
                            <Edit3 className="w-2.5 h-2.5 shrink-0" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Shift Timings:</span>
                          <span className="font-medium text-slate-700">{doc.shiftTiming || '09:00 - 16:00'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom stats and action bar */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Active Queue:</span>
                        <span className="font-bold text-slate-900 bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full text-[11px]">
                          {assignedPatientsCount} Patients
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setShowReallocateRoomModal(doc)}
                          className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition text-center cursor-pointer"
                        >
                          Change Room
                        </button>

                        <button
                          onClick={() => {
                            opdStore.setDoctorProfile(doc.id);
                            if (onNavigateToPortal) {
                              onNavigateToPortal('OPD', 'DOCTOR');
                            }
                          }}
                          className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[11px] transition text-center cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Open Desk</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 2: ROOM ALLOCATION MATRIX */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Rooms & Suites
              </h2>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Occupied ({rooms.filter(r => r.status === 'OCCUPIED').length})</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-700 ml-3">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>Vacant ({rooms.filter(r => r.status === 'VACANT').length})</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rooms.map(room => {
              const isOccupied = room.status === 'OCCUPIED';
              const assignedDoctor = doctors.find(d => d.id === room.currentDoctorId);

              return (
                <div
                  key={room.id}
                  className={`rounded-2xl p-4 border transition flex flex-col justify-between ${
                    isOccupied 
                      ? 'bg-white border-purple-200 shadow-sm' 
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isOccupied ? 'bg-purple-100 text-purple-900' : 'bg-slate-200 text-slate-600'
                        }`}>
                          🚪
                        </div>
                        <div>
                          <span className="font-black text-slate-900 text-sm block">{room.roomNumber}</span>
                          <span className="text-[10px] text-slate-500">{room.floor}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        isOccupied 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{room.name}</h4>
                      <p className="text-[11px] text-slate-500">{room.department}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                      <div className="text-[11px] text-slate-500">Practicing Doctor:</div>
                      {assignedDoctor ? (
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                          <span>👩‍⚕️</span>
                          <span className="truncate">{assignedDoctor.name}</span>
                        </div>
                      ) : (
                        <div className="text-slate-400 italic text-xs">
                          No doctor allocated
                        </div>
                      )}

                      {room.equipmentNotes && (
                        <div className="pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-500">
                          <strong>Equipment:</strong> {room.equipmentNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {room.activePatientCount || 0} waiting
                    </span>

                    <button
                      onClick={() => {
                        // Open room allocation picker
                        const doc = assignedDoctor || doctors[0];
                        setShowReallocateRoomModal(doc);
                      }}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 hover:underline cursor-pointer"
                    >
                      {isOccupied ? 'Reassign' : 'Allocate Doctor'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PATIENT ALLOCATION & TRIAGE BALANCING */}
      {activeTab === 'patients' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Patient Triage & Allocations
              </h2>
            </div>
            
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <span className="font-semibold">Queue:</span> {patients.length} Patients
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Token / OPD ID</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Age / Gestation</th>
                    <th className="py-3 px-4">Visit Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Currently Allocated Doctor</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.map(p => {
                    const currentDoc = doctors.find(d => d.name === p.assignedDoctor || d.clinicId === p.clinicId) || doctors[0];
                    return (
                      <tr key={p.id} className="hover:bg-rose-50/40 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          #{p.tokenNumber} <span className="text-[10px] text-slate-400 font-normal">({p.opdId})</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {p.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {p.age}y {p.isPregnant ? `• ${p.clinicalGist?.relevantRecords?.currentGestation || 'Pregnant'}` : ''}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {p.visitReason}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.queueStatus === 'With Doctor' ? 'bg-amber-100 text-amber-900' :
                            p.queueStatus === 'Waiting' ? 'bg-rose-100 text-rose-900' :
                            p.queueStatus === 'Lab Pending' ? 'bg-purple-100 text-purple-900' :
                            'bg-emerald-100 text-emerald-900'
                          }`}>
                            {p.queueStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>👩‍⚕️</span>
                            <span>{p.assignedDoctor || currentDoc.name}</span>
                            <span className="text-[10px] text-slate-500 font-normal">({currentDoc.roomNumber})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setShowTransferPatientModal(p)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[11px] transition cursor-pointer"
                          >
                            Transfer Doctor
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIAGNOSTIC LABS & ROUTING SLAS */}
      {activeTab === 'caregaps' && (
        <CareGapNudgesPanel
          patients={opdStore.getAllVisitedPatients()}
          scopeLabel="All OPD rooms"
          sentBy="Hospital Administration"
          onOpenWhatsAppView={id => onOpenWhatsAppView?.(id)}
          onOpenCredits={() => setActiveTab('whatsapp')}
        />
      )}

      {activeTab === 'whatsapp' && <WhatsAppCreditsPanel />}

      {activeTab === 'labs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Diagnostic Labs & Order Routing
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labs.map(lab => {
              const assignedDocs = doctors.filter(d => lab.assignedDoctorIds.includes(d.id));

              return (
                <div 
                  key={lab.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xl border border-purple-300">
                        🔬
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{lab.name}</h3>
                        <p className="text-[11px] text-slate-500">{lab.type}</p>
                        <span className="text-[10px] text-purple-700 font-medium">Head: {lab.inCharge}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] border border-emerald-300">
                      {lab.slaPercent}% SLA
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">In-Flight Orders</span>
                      <strong className="text-base text-slate-900 font-black">{lab.activeRequisitionsCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Avg Turnaround</span>
                      <strong className="text-base text-slate-900 font-black">{lab.avgTurnaroundHours} hrs</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Routing Hub</span>
                      <strong className="text-base text-purple-800 font-black">Digital HL7</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-slate-500 font-semibold block text-[11px]">
                      Doctors Auto-Routed to this Lab ({assignedDocs.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {assignedDocs.length > 0 ? (
                        assignedDocs.map(d => (
                          <span 
                            key={d.id}
                            className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200 text-[11px] font-bold flex items-center gap-1"
                          >
                            <span>👩‍⚕️</span>
                            <span>{d.name} ({d.roomNumber})</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-xs">No doctors assigned yet</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[200px]">📍 {lab.location}</span>
                    <span className="font-mono text-[11px]">📞 {lab.contact}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: INTEGRATION BACKBONE INSPECTOR */}
      {activeTab === 'backbone' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Integration Backbone</span>
              </h2>
            </div>

            <button
              onClick={handleTriggerSimulation}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Transaction</span>
            </button>
          </div>

          {/* Interactive Topology Graph */}
          <div className="bg-slate-950 text-rose-100 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Inter-Module Bus Architecture</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                SLA: 99.98% • Latency: ~18ms
              </span>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {backboneNodes.map(node => (
                <div 
                  key={node.id}
                  className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-rose-500/50 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
                      {node.protocol}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>{node.pingMs}ms</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-xs">{node.name}</h4>
                    <span className="text-[10px] text-rose-300/80">{node.category} MODULE</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Synced today: <strong className="text-white">{node.recordsSyncedToday}</strong></span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{node.lastSync}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Transaction Event Log */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-2">
                <span>Recent Inter-Facility Transaction Stream</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                  {backboneEvents.length} Events Logged
                </span>
              </h3>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {backboneEvents.map(evt => (
                <div 
                  key={evt.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-rose-50/30 transition text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-rose-200 text-[10px] font-mono">
                        {evt.id}
                      </span>
                      <span>{evt.title}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0 font-medium">
                      <span>{evt.timestamp}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        {evt.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs">
                    {evt.details}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                    <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                      FROM: {evt.sourceModule}
                    </span>
                    <span>→</span>
                    <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                      TO: {evt.targetModule}
                    </span>
                    {evt.payloadSummary && (
                      <span className="text-slate-400 truncate max-w-md">
                        PAYLOAD: {evt.payloadSummary}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ONDC NETWORK & VENDOR INTEGRATION HUB */}
      {activeTab === 'ondc' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-950 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-400 animate-spin" style={{ animationDuration: '10s' }} />
                  <span>ONDC Health Domain (RET18)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                  BAP-HOSP-STANNE-001 (Gateway Live)
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                ONDC Network & Vendor Add-On Hub
              </h2>
              <p className="text-xs text-indigo-200/80 max-w-2xl">
                Open Network for Digital Commerce (ONDC) integrates independent neighborhood pathology laboratories and retail chemist shops. Interested vendors join as add-on logins to receive requisitions, decipher reports with OCR, and fulfill prescriptions.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowOndcOnboardModal(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Onboard Partner Shop</span>
              </button>
            </div>
          </div>

          {/* ONDC Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase">Connected BPP Seller Nodes</span>
              <span className="text-2xl font-black text-indigo-900 mt-1 block">
                {ondcNodes.filter(n => n.type === 'BPP').length}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
                ● 100% Verified & Active
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase">Pathology Labs</span>
              <span className="text-2xl font-black text-purple-900 mt-1 block">
                {ondcNodes.filter(n => n.category === 'DIAGNOSTICS').length}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                OCR Decipher & ABDM Sync
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase">Pharmacies & Chemists</span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">
                {ondcNodes.filter(n => n.category === 'PHARMACY').length}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Generic Jan Aushadhi Savings
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase">Beckn Protocol Transactions</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {ondcTransactions.length}
              </span>
              <span className="text-[10px] text-indigo-700 font-bold block mt-0.5">
                v1.1.0 Gateway Active
              </span>
            </div>
          </div>

          {/* Connected Vendor Seller Nodes Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Connected Vendor Seller Nodes (BPP)
              </h3>
              <span className="text-xs text-slate-500">
                Independent shops plugged into hospital OPD
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {ondcNodes.filter(n => n.type === 'BPP').map(node => {
                const isLab = node.category === 'DIAGNOSTICS';
                return (
                  <div 
                    key={node.subscriberId}
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 border ${
                          isLab 
                            ? 'bg-purple-100 text-purple-800 border-purple-200' 
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {isLab ? <Microscope className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 text-xs">
                              {node.entityName}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              isLab ? 'bg-purple-50 text-purple-800' : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {node.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            In-Charge: {node.inCharge} • {node.city} ({node.pincode})
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded shrink-0">
                        {node.subscriberId}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg text-[11px] text-center border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Catalog Items</span>
                        <span className="font-bold text-slate-800">{node.catalogItemsCount} Published</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-slate-400 block text-[9px] uppercase">Quality Rating</span>
                        <span className="font-bold text-amber-700">★ {node.rating} / 5.0</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Network Node</span>
                        <span className="font-bold text-emerald-700">ACTIVE BPP</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500 font-mono text-[10px] truncate max-w-xs">
                        Endpoint: {node.endpointUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateToPortal) {
                            onNavigateToPortal(isLab ? 'LAB' : 'PHARMA');
                          }
                        }}
                        className="font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>Open Desk</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Beckn Protocol Transactions Feed */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Live ONDC Beckn Protocol Transaction Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                ● Listening on gateway.ondc.org
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {ondcTransactions.map(tx => (
                <div key={tx.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded ${
                      tx.action === 'confirm' ? 'bg-emerald-100 text-emerald-800' :
                      tx.action === 'on_init' ? 'bg-indigo-100 text-indigo-800' :
                      tx.action === 'on_search' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {tx.action}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{tx.vendorName}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-semibold text-slate-700">Patient: {tx.patientName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({tx.transactionId})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {tx.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono shrink-0">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      BAP: {tx.bapId}
                    </span>
                    <span>→</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      BPP: {tx.bppId}
                    </span>
                    <span className="text-emerald-700 font-bold ml-1">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

        </div>
      </PortalSidebarLayout>

      {/* MODAL 1: ADD NEW DOCTOR */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-rose-100">
              <div>
                <span className="text-xs font-bold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                  Hospital Admin Portal
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Add New Doctor & Allocate Resources
                </h3>
                <p className="text-xs text-slate-500">
                  Onboard a clinical specialist, assign consultation rooms, designated diagnostic labs, and provision a login.
                </p>
              </div>

              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Kavita Desai"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Medical Qualifications *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBBS, MS (OB/GYN), DNB"
                    value={newDocQualification}
                    onChange={(e) => setNewDocQualification(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Clinical Specialty *
                  </label>
                  <select
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white font-medium"
                  >
                    <option value="Obstetrics & Gynaecology (Maternal & Foetal Health)">Obstetrics & Gynaecology (Maternal & Foetal Health)</option>
                    <option value="High-Risk Fetal Medicine & Advanced Sonography">High-Risk Fetal Medicine & Advanced Sonography</option>
                    <option value="Pediatrics & Neonatal Care">Pediatrics & Neonatal Care</option>
                    <option value="Gynaecological Oncology & Laparoscopy">Gynaecological Oncology & Laparoscopy</option>
                    <option value="Reproductive Medicine & Infertility Care">Reproductive Medicine & Infertility Care</option>
                    <option value="Internal Medicine & Chronic Disease Care">Internal Medicine & Chronic Disease Care</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maternal & Child Health (MCH)"
                    value={newDocDepartment}
                    onChange={(e) => setNewDocDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Resource Allocations */}
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200/80 space-y-3">
                <span className="font-bold text-purple-900 block text-xs uppercase tracking-wider">
                  Resource & Suite Allocation Matrix
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Allocate Consultation Room *
                    </label>
                    <select
                      value={newDocRoom}
                      onChange={(e) => setNewDocRoom(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-300 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white font-bold text-purple-900"
                    >
                      {rooms.map(r => (
                        <option key={r.id} value={r.roomNumber}>
                          {r.roomNumber} — {r.name} ({r.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Allocate Primary Diagnostic Lab *
                    </label>
                    <select
                      value={newDocLabId}
                      onChange={(e) => setNewDocLabId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-purple-300 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white font-bold text-purple-900"
                    >
                      {labs.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.name} ({l.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={newDocFee}
                    onChange={(e) => setNewDocFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Council Reg. Number
                  </label>
                  <input
                    type="text"
                    value={newDocRegNo}
                    onChange={(e) => setNewDocRegNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Shift Timings
                  </label>
                  <input
                    type="text"
                    value={newDocShift}
                    onChange={(e) => setNewDocShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Automatic Provisioning:</strong> A distinct login account with username 
                  <strong> &quot;{newDocName ? newDocName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) : 'doctor'}&quot;</strong> will be created immediately in the integration backbone.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-pink-600 hover:from-rose-800 hover:to-pink-700 text-white font-bold transition shadow-md shadow-rose-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Onboard Doctor & Save Allocations</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REALLOCATE ROOM */}
      {showReallocateRoomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Reallocate Room for {showReallocateRoomModal.name}
            </h3>
            <p className="text-xs text-slate-500">
              Currently practicing in <strong>{showReallocateRoomModal.roomNumber}</strong>. Choose a new suite:
            </p>

            <div className="space-y-2">
              {rooms.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleRoomAllocation(showReallocateRoomModal.id, r.roomNumber)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                    showReallocateRoomModal.roomNumber === r.roomNumber
                      ? 'bg-purple-50 border-purple-400 font-bold text-purple-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-bold block">{r.roomNumber} — {r.name}</span>
                    <span className="text-[10px] text-slate-500">{r.floor} • Status: {r.status}</span>
                  </div>
                  {showReallocateRoomModal.roomNumber === r.roomNumber && (
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowReallocateRoomModal(null)}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: REALLOCATE PRIMARY LAB */}
      {showReallocateLabModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Reassign Primary Diagnostic Lab for {showReallocateLabModal.name}
            </h3>
            <p className="text-xs text-slate-500">
              Outpatient requisitions will auto-route to the selected diagnostic facility:
            </p>

            <div className="space-y-2">
              {labs.map(l => (
                <button
                  key={l.id}
                  onClick={() => handleLabAllocation(showReallocateLabModal.id, l.id)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                    showReallocateLabModal.allocatedLabId === l.id
                      ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-bold block">{l.name}</span>
                    <span className="text-[10px] text-slate-500">{l.type} • {l.avgTurnaroundHours}h turnaround</span>
                  </div>
                  {showReallocateLabModal.allocatedLabId === l.id && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowReallocateLabModal(null)}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: TRANSFER PATIENT */}
      {showTransferPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Transfer Patient: {showTransferPatientModal.name}
            </h3>
            <p className="text-xs text-slate-500">
              Token #{showTransferPatientModal.tokenNumber} • Reason: {showTransferPatientModal.visitReason}. Select a practitioner:
            </p>

            <div className="space-y-2">
              {doctors.map(d => (
                <button
                  key={d.id}
                  onClick={() => handlePatientTransfer(showTransferPatientModal.id, d.id)}
                  className="w-full p-3 rounded-xl border bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-left text-xs transition cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-rose-900">{d.name}</span>
                    <span className="text-[10px] text-slate-500">{d.specialty} • {d.roomNumber}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTransferPatientModal(null)}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: ONDC VENDOR ONBOARDING */}
      {showOndcOnboardModal && (
        <OndcVendorOnboardingModal
          onClose={() => setShowOndcOnboardModal(false)}
          onSuccess={(_newUser, shopName, category) => {
            setShowOndcOnboardModal(false);
            showToast(`${shopName} onboarded and connected to ONDC BPP Gateway! Vendor login credentials created.`);
            if (onNavigateToPortal) {
              onNavigateToPortal(category === 'LAB' ? 'LAB' : 'PHARMA');
            }
          }}
        />
      )}
    </div>
  );
};
