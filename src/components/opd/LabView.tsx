import React, { useState } from 'react';
import { 
  TestTubes, 
  TestTube, 
  Upload, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  AlertCircle,
  Eye,
  Check,
  Building2,
  Search,
  Filter,
  Printer,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  QrCode,
  Microscope,
  Activity,
  MapPin,
  Bike,
  Navigation,
  Compass,
  Globe,
  Award,
  CheckCheck,
  FileCheck
} from 'lucide-react';
import { LabOrder, LabReferral, OpdClinic, LabPartner } from '../../types';
import { opdStore, OPD_CLINICS } from '../../services/opdStore';
import { PathologyReportUploadModal } from './PathologyReportUploadModal';
import { DiagnosticAnalyserModal } from './DiagnosticAnalyserModal';

interface LabViewProps {
  onOpenWhatsAppView?: (patientId?: string) => void;
}

export const LabView: React.FC<LabViewProps> = ({ onOpenWhatsAppView }) => {
  const [selectedLabId, setSelectedLabId] = useState<string>(opdStore.selectedLabId || 'lab-apex');
  const [selectedClinicFilter, setSelectedClinicFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const [selectedOrderForUpload, setSelectedOrderForUpload] = useState<LabOrder | null>(null);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<LabOrder | null>(null);
  const [showOcrUploadModal, setShowOcrUploadModal] = useState(false);
  const [orderForOcrUpload, setOrderForOcrUpload] = useState<LabOrder | null>(null);
  const [orderForAnalyser, setOrderForAnalyser] = useState<LabOrder | null>(null);
  
  const [summaryInput, setSummaryInput] = useState('');
  const [fileNameInput, setFileNameInput] = useState('Glucose_OGTT_Report.pdf');
  const [findingsInput, setFindingsInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [publishSuccessToast, setPublishSuccessToast] = useState<string | null>(null);
  const [showAchievementsCard, setShowAchievementsCard] = useState(false);

  const pathologistAchievements = opdStore.getPathologistAchievements();
  const allLabPartners = opdStore.getLabPartners();
  const currentLab: LabPartner = allLabPartners.find(l => l.id === selectedLabId) || allLabPartners[0];

  // Get all orders across all clinics or filtered
  const labOrders = opdStore.getAllLabOrders(selectedClinicFilter === 'all' ? undefined : selectedClinicFilter);

  // Filter by search & status
  const filteredOrders = labOrders.filter(order => {
    const matchesSearch = 
      (order.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.testName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.opdId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.requestedBy || '').toLowerCase().includes(searchQuery.toLowerCase());

    const isDone = order.reportStatus === 'Report Uploaded' || order.sampleStatus === 'Test Completed';
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'pending' ? !isDone :
      isDone;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = labOrders.filter(o => o.reportStatus !== 'Report Uploaded').length;
  const inProgressCount = labOrders.filter(o => o.sampleStatus === 'Sample Received').length;
  const completedCount = labOrders.filter(o => o.reportStatus === 'Report Uploaded').length;

  const handleSampleReceived = (orderId: string) => {
    opdStore.updateLabSampleStatus(orderId, 'Sample Received');
  };

  const handleOpenUpload = (order: LabOrder) => {
    setSelectedOrderForUpload(order);
    const test = (order.testName || '').toLowerCase();
    
    if (test.includes('glucose') || test.includes('ogtt') || test.includes('sugar')) {
      setSummaryInput('Fasting Blood Sugar: 88 mg/dL (Normal: 70-99), 2-hr Post 75g: 132 mg/dL (Normal <140)');
      setFindingsInput('Normal glucose tolerance curve. Gestational diabetes mellitus (GDM) ruled out at 28 weeks.');
      setFileNameInput('OGTT_75g_Report.pdf');
    } else if (test.includes('cbc') || test.includes('hb') || test.includes('blood count')) {
      setSummaryInput('Hb: 10.4 g/dL (Mild microcytic anaemia), Platelets: 2.1 Lakhs/mcL, TLC: 8,400 /mcL, PCV: 32%');
      setFindingsInput('Peripheral smear shows mild hypochromia. Compatible with nutritional iron deficiency. Recommend daily IFA continuation.');
      setFileNameInput('CBC_Haemogram_Report.pdf');
    } else if (test.includes('urine') || test.includes('albumin')) {
      setSummaryInput('Urine Protein: Trace/Negative, Pus cells: 1-2 /hpf, RBCs: Nil, Sugar: Nil');
      setFindingsInput('No evidence of active urinary tract infection or significant pre-eclamptic proteinuria.');
      setFileNameInput('Urine_Routine_Report.pdf');
    } else if (test.includes('coombs') || test.includes('rh')) {
      setSummaryInput('Indirect Coombs Test (ICT): NEGATIVE (Titre < 1:2)');
      setFindingsInput('No maternal Rh(D) isoimmunisation detected at 28 weeks. Candidate for prophylactic Anti-D Immunoglobulin as planned.');
      setFileNameInput('Indirect_Coombs_Test.pdf');
    } else if (test.includes('hba1c')) {
      setSummaryInput('Glycated Haemoglobin (HbA1c): 7.2% (Target < 7.0%), Estimated Avg Glucose: 160 mg/dL');
      setFindingsInput('Moderate glycaemic control. Recommend lifestyle reinforcement and adherence to dual oral anti-hyperglycaemics.');
      setFileNameInput('HbA1c_Report.pdf');
    } else {
      setSummaryInput('Biochemical / Haematological parameters within standard physiological diagnostic reference limits.');
      setFindingsInput('Satisfactory clinical investigation findings.');
      setFileNameInput('Diagnostic_Pathology_Report.pdf');
    }
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForUpload) return;

    setIsUploading(true);
    setTimeout(() => {
      opdStore.uploadLabReport({
        orderId: selectedOrderForUpload.id,
        fileName: fileNameInput,
        summaryText: summaryInput
      });

      const patientName = selectedOrderForUpload.patientName || 'Patient';
      setIsUploading(false);
      setSelectedOrderForUpload(null);
      setPublishSuccessToast(`Digital report published for ${patientName}! Transmitted across town to referring OPD doctor and delivered to patient via WhatsApp.`);
      setTimeout(() => setPublishSuccessToast(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {publishSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-950 text-white px-5 py-3 rounded-2xl shadow-xl border border-teal-500 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-teal-300 shrink-0" />
          <p className="text-xs font-bold">{publishSuccessToast}</p>
        </div>
      )}

      {/* Diagnostic Lab Store Switcher Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-purple-700" />
          <span className="font-extrabold text-slate-800 uppercase tracking-wide text-[11px]">
            Active Diagnostic Facility / Laboratory Store:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-bold">
          {allLabPartners.map(lab => (
            <button
              key={lab.id}
              onClick={() => {
                setSelectedLabId(lab.id);
                opdStore.setSelectedLab(lab.id);
              }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                lab.id === currentLab.id
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Microscope className="w-3.5 h-3.5" />
              <span>{lab.name.split(' ')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {lab.distance.split(' ')[0]} {lab.distance.split(' ')[1]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Header Banner - Diagnostic Facility */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800 px-2.5 py-0.5 rounded-full">
                {currentLab.type}
              </span>
              {currentLab.ondcParticipantId ? (
                <span className="text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-400" />
                  <span>ONDC BPP Seller Node: {currentLab.ondcParticipantId}</span>
                </span>
              ) : null}
              <span className="text-xs text-slate-400">
                {currentLab.location} • Turnaround: {currentLab.turnaroundHours}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentLab.name}
            </h1>
            <p className="text-xs text-slate-400">
              In-Charge: {currentLab.inCharge} • Contact: {currentLab.contact}
            </p>
          </div>

          {/* Header Actions & Quick Metrics */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setShowAchievementsCard(!showAchievementsCard)}
              className={`px-3.5 py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition border ${
                showAchievementsCard
                  ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-md font-extrabold'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
              title="View Pathologist Quality & Reporting Achievements"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Reporting Quality ({pathologistAchievements.filter(a => a.earned).length}/{pathologistAchievements.length})</span>
            </button>

            <button
              onClick={() => {
                setOrderForOcrUpload(null);
                setShowOcrUploadModal(true);
              }}
              className="px-4 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition active:scale-95 border border-purple-400/40"
            >
              <Upload className="w-4 h-4 text-purple-200" />
              <span>Upload Report / PDF (OCR Decipher)</span>
            </button>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 shrink-0 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-center">
              <div className="px-3 py-1">
                <span className="block text-xl font-bold text-amber-300">{pendingCount}</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider">Pending</span>
              </div>
              <div className="px-3 py-1 border-x border-slate-700">
                <span className="block text-xl font-bold text-fuchsia-300">{inProgressCount}</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider">In Analysis</span>
              </div>
              <div className="px-3 py-1">
                <span className="block text-xl font-bold text-emerald-300">{completedCount}</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pathologist Reporting Quality & Continuity Achievements Panel */}
      {showAchievementsCard && (
        <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white p-5 rounded-3xl border border-purple-800 shadow-lg space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-800/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300 shadow-xs">
                <Award className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>Pathologist Reporting Quality &amp; Achievements</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    All Referral Types (Zero Pregnancy Dependency)
                  </span>
                </h3>
                <p className="text-[11px] text-purple-200">
                  Rewarding clinical turnaround speed, report-field completeness, and reliable handoff across pregnancy, gynaecology, PCOS, and screening tests.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAchievementsCard(false)}
              className="text-xs text-purple-300 hover:text-white font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition cursor-pointer self-end sm:self-auto"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pathologistAchievements.map(ach => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border text-xs flex flex-col justify-between space-y-2.5 transition ${
                  ach.earned
                    ? 'bg-slate-900/90 border-emerald-500/50 shadow-xs'
                    : 'bg-slate-900/50 border-slate-700/60 opacity-80'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300">
                      {ach.title}
                    </span>
                    {ach.earned ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" />
                        <span>Earned</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {ach.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/10 text-[10px]">
                  <div className="flex items-center justify-between font-bold text-slate-400">
                    <span>Performance Target:</span>
                    <span className="text-purple-300">{ach.metricCurrent} / {ach.metricTarget}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    Criteria: {ach.criteria}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter by Referring Doctor Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
              Filter by Referring Doctor & Hospital Facility:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setSelectedClinicFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                selectedClinicFilter === 'all'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All Referring Doctors</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {opdStore.getAllLabOrders().length}
              </span>
            </button>

            {OPD_CLINICS.map(clinic => {
              const count = opdStore.getAllLabOrders(clinic.id).length;
              return (
                <button
                  key={clinic.id}
                  onClick={() => setSelectedClinicFilter(clinic.id)}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    selectedClinicFilter === clinic.id
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{clinic.leadDoctor} ({clinic.department.split(' ')[0]})</span>
                  {count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-900 font-bold">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filter row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search test name, patient, doctor, OPD ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Filter:</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 font-bold text-[11px]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
              >
                All ({labOrders.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === 'pending' ? 'bg-white text-amber-900 shadow-2xs' : 'text-slate-600'}`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === 'completed' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'}`}
              >
                Published ({completedCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Requisitions Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
            <TestTubes className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">No laboratory investigations found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When a doctor in any referring OPD orders a laboratory test for this diagnostic centre, the requisition immediately appears here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Patient & Hospital Origin</th>
                  <th className="py-3 px-3">Referring Doctor</th>
                  <th className="py-3 px-4">Test Requested</th>
                  <th className="py-3 px-3">Sample Status</th>
                  <th className="py-3 px-4">Diagnostic Findings / Result</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => {
                  const isUploaded = ord.reportStatus === 'Report Uploaded';
                  const isReceived = ord.sampleStatus === 'Sample Received' || ord.sampleStatus === 'Test Completed' || isUploaded;
                  const cleanFacility = (ord.clinicName || 'District Hospital Hubballi — Antenatal OPD')
                    .replace(/\(Room \d+\)/g, '')
                    .replace(/Room \d+:\s*/g, '')
                    .trim();
                  const cleanDoctor = (ord.requestedBy || 'Dr. Anita Rao')
                    .replace(/\(Room \d+\)/g, '')
                    .trim();

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                      {/* Patient & Hospital */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{ord.patientName || 'Unknown Patient'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono">{ord.opdId}</span>
                          {ord.patientGestation && (
                            <span className="px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold">
                              {ord.patientGestation}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-purple-700 font-bold flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          <span>Hospital: {cleanFacility}</span>
                        </div>
                      </td>

                      {/* Referring Doctor */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 block">{cleanDoctor}</span>
                        <span className="text-[10px] text-slate-500 block">Prescribing Physician</span>
                        <div className="flex items-center gap-1 text-[10px] text-amber-800 font-bold mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{currentLab.distance}</span>
                        </div>
                      </td>

                      {/* Test Requested */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <TestTube className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span>{ord.testName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Specimen: {ord.testName.toLowerCase().includes('urine') ? 'Midstream Urine' : 'Venous Whole Blood'}
                        </span>
                      </td>

                      {/* Sample Status */}
                      <td className="py-3.5 px-3">
                        {isReceived ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 font-bold text-[11px] border border-purple-200">
                            <Check className="w-3 h-3 text-purple-600" />
                            {ord.sampleStatus || 'Sample Received'}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSampleReceived(ord.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300 transition cursor-pointer"
                          >
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Accept Sample Arrival</span>
                          </button>
                        )}
                      </td>

                      {/* Findings / Result */}
                      <td className="py-3.5 px-4">
                        {isUploaded ? (
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 font-bold text-[10px] border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Transmitted to OPD
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-900 font-bold text-[10px] border border-teal-300">
                                <ShieldCheck className="w-3 h-3 text-teal-600" />
                                ABDM Synced
                              </span>
                              {ord.ocrConfidence && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-purple-50 text-purple-900 font-mono text-[9px] font-bold border border-purple-200">
                                  OCR {ord.ocrConfidence}%
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] font-semibold text-slate-800 line-clamp-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                              {ord.reportSummary}
                            </p>

                            {/* Extracted Parameter Pills */}
                            {ord.parameters && ord.parameters.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-0.5">
                                {ord.parameters.slice(0, 3).map((p, i) => (
                                  <span key={i} className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${
                                    p.status === 'LOW'
                                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                                      : p.status === 'HIGH' || p.status === 'CRITICAL'
                                      ? 'bg-rose-50 text-rose-900 border-rose-300'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}>
                                    {p.name.split(' ')[0]}: {p.value} {p.unit}
                                  </span>
                                ))}
                                {ord.parameters.length > 3 && (
                                  <span className="text-[10px] text-slate-400 font-bold self-center">
                                    +{ord.parameters.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            {isReceived ? 'Analyzer processing in progress...' : 'Awaiting phlebotomy collection / courier'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isUploaded ? (
                            <>
                              {/* DIAGNOSTIC ANALYSER BUTTON */}
                              <button
                                onClick={() => setOrderForAnalyser(ord)}
                                className="px-3 py-1.5 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                                title="Run Intelligent Diagnostic Analyser"
                              >
                                <Activity className="w-3.5 h-3.5 text-purple-300" />
                                <span>Analyser</span>
                              </button>

                              <button
                                onClick={() => setSelectedOrderForPrint(ord)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Slip</span>
                              </button>

                              {onOpenWhatsAppView && (
                                <button
                                  onClick={() => onOpenWhatsAppView(ord.patientId)}
                                  className="px-2 py-1 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                                  title="View WhatsApp report message"
                                >
                                  <Send className="w-3 h-3 text-emerald-600" />
                                </button>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              {/* 1-Click OCR Upload & Decipher Button */}
                              <button
                                onClick={() => {
                                  setOrderForOcrUpload(ord);
                                  setShowOcrUploadModal(true);
                                }}
                                className="px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white transition active:scale-95"
                              >
                                <Upload className="w-3.5 h-3.5 text-purple-200" />
                                <span>Upload (OCR)</span>
                              </button>

                              <button
                                onClick={() => handleOpenUpload(ord)}
                                disabled={!isReceived}
                                title="Manual parameter entry"
                                className={`px-2 py-1.5 rounded-xl text-xs font-bold transition ${
                                  isReceived
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
                                    : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Enter Results & Publish Report */}
      {selectedOrderForUpload && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Microscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Verify Parameters & Transmit Report to OPD Doctor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Test: <strong className="text-purple-900">{selectedOrderForUpload.testName}</strong>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrderForUpload(null)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Originating Clinic & Distance Context */}
            <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Patient:</span>
                <span className="font-extrabold text-slate-900">
                  {selectedOrderForUpload.patientName} ({selectedOrderForUpload.opdId})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Referring OPD Clinic:</span>
                <span className="font-bold text-purple-900">
                  {selectedOrderForUpload.clinicName || 'Room 4: MCH Antenatal'} ({currentLab.distance})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Referring Doctor:</span>
                <span className="font-bold text-slate-800">{selectedOrderForUpload.requestedBy || 'Dr. Anita Rao'}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Quantitative Parameters & Diagnostic Values
                </label>
                <textarea
                  rows={3}
                  required
                  value={summaryInput}
                  onChange={(e) => setSummaryInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:border-purple-500 focus:outline-none"
                  placeholder="e.g. Fasting: 88 mg/dL, 2-hr: 132 mg/dL"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Pathologist Clinical Findings & Remarks
                </label>
                <textarea
                  rows={2}
                  value={findingsInput}
                  onChange={(e) => setFindingsInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-500 focus:outline-none"
                  placeholder="e.g. Normal glucose tolerance curve confirmed..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Digital PDF Report Attachment</label>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-700" />
                  <input
                    type="text"
                    value={fileNameInput}
                    onChange={(e) => setFileNameInput(e.target.value)}
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-teal-900 text-[11px] leading-relaxed">
                <strong className="block font-bold mb-0.5">Instant Cross-Town Digital Delivery:</strong>
                Because this diagnostic lab is located {currentLab.distance}, releasing this report transmits the results directly into the referring OPD doctor&apos;s active screen in real-time and delivers an instant WhatsApp download link to the patient, saving a physical travel trip.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForUpload(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transmitting Across Town...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-purple-200" />
                      <span>Authorize & Transmit to Doctor</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Printable Diagnostic Report Slip */}
      {selectedOrderForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase">Diagnostic Laboratory Report</span>
              <button 
                onClick={() => setSelectedOrderForPrint(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Official Report Slip */}
            <div className="border-2 border-slate-300 p-6 rounded-2xl bg-white space-y-4 font-sans text-xs">
              <div className="text-center pb-3 border-b-2 border-slate-900">
                <span className="font-black text-base text-slate-900 block tracking-tight uppercase">
                  {currentLab.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {currentLab.accreditation} • {currentLab.location} • {currentLab.contact}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-slate-200">
                <div>
                  <p><span className="text-slate-500">Patient:</span> <strong>{selectedOrderForPrint.patientName}</strong></p>
                  <p><span className="text-slate-500">OPD ID:</span> {selectedOrderForPrint.opdId}</p>
                  <p><span className="text-slate-500">Originating OPD:</span> {selectedOrderForPrint.clinicName} ({currentLab.distance})</p>
                </div>
                <div className="text-right">
                  <p><span className="text-slate-500">Requisition:</span> #{selectedOrderForPrint.id}</p>
                  <p><span className="text-slate-500">Referring Dr:</span> {selectedOrderForPrint.requestedBy}</p>
                  <p><span className="text-slate-500">Date:</span> 10 Oct 2026</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-extrabold text-sm text-slate-900 block border-b border-slate-100 pb-1">
                  Investigation: {selectedOrderForPrint.testName}
                </span>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Observed Parameters:</span>
                  <p className="font-mono font-bold text-xs text-slate-900">
                    {selectedOrderForPrint.reportSummary}
                  </p>
                </div>

                {selectedOrderForPrint.findings && (
                  <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-200 text-[11px] text-purple-950">
                    <span className="font-bold block text-[10px] uppercase text-purple-900">Pathologist Comments:</span>
                    <p>{selectedOrderForPrint.findings}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200 text-[10px] text-slate-500">
                <span>Verified electronically by {currentLab.inCharge}</span>
                <span className="font-bold text-emerald-800">STATUS: APPROVED & RELEASED</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForPrint(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print NABL Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Pathology Document / PDF Upload with OCR Decipher & ABDM */}
      {showOcrUploadModal && (
        <PathologyReportUploadModal
          order={orderForOcrUpload}
          onClose={() => {
            setShowOcrUploadModal(false);
            setOrderForOcrUpload(null);
          }}
          onSuccess={(uploadedOrder, patientName) => {
            setShowOcrUploadModal(false);
            setOrderForOcrUpload(null);
            setPublishSuccessToast(`Report deciphered via OCR & built into ${patientName}'s profile! Synced to ABDM Gateway & transmitted to referring doctor.`);
            setTimeout(() => setPublishSuccessToast(null), 5000);
          }}
        />
      )}

      {/* MODAL 4: Intelligent Diagnostic Results Analyser */}
      {orderForAnalyser && (
        <DiagnosticAnalyserModal
          order={orderForAnalyser}
          patientGestationWeeks={orderForAnalyser.patientGestation ? parseInt(orderForAnalyser.patientGestation) || 28 : 28}
          onClose={() => setOrderForAnalyser(null)}
          onSendToDoctor={() => {
            setPublishSuccessToast(`Diagnostic Analyser insights transmitted directly to Dr. Anita Rao's consultation screen.`);
            setTimeout(() => setPublishSuccessToast(null), 4000);
          }}
        />
      )}
    </div>
  );
};
