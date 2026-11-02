import React, { useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  Building2, 
  Search, 
  Filter, 
  ChevronRight,
  ArrowUpRight,
  Globe,
  FileText,
  UserCheck,
  Award,
  Microscope,
  Compass,
  Check
} from 'lucide-react';
import { OpdPatient, WeeklyMonthlyStats } from '../../types';
import { opdStore } from '../../services/opdStore';

interface DoctorDashboardProps {
  onOpenWhatsAppView?: (patientId?: string) => void;
  onSelectPatient?: (patient: OpdPatient) => void;
  restrictClinicId?: string;
  doctorName?: string;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onOpenWhatsAppView,
  onSelectPatient,
  restrictClinicId,
  doctorName = 'Dr. Anita Rao'
}) => {
  const [period, setPeriod] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [activeTab, setActiveTab] = useState<'VISITORS' | 'FOLLOW_UP' | 'REVENUE' | 'ACHIEVEMENTS'>('VISITORS');
  const [searchQuery, setSearchQuery] = useState('');
  const [clinicFilter, setClinicFilter] = useState<string>(restrictClinicId || 'ALL');
  const [languageFilter, setLanguageFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const targetClinic = restrictClinicId || (clinicFilter === 'ALL' ? undefined : clinicFilter);
  const stats: WeeklyMonthlyStats = period === 'WEEKLY' 
    ? opdStore.getWeeklyStats(targetClinic) 
    : opdStore.getMonthlyStats(targetClinic);

  const handleSendAiFollowUp = (patientId: string) => {
    const p = opdStore.patients.find(pt => pt.id === patientId);
    if (!p) return;
    opdStore.sendAiFollowUp(patientId);
    setToastMessage(`Automated AI follow-up sent to ${p.name} on WhatsApp in ${p.preferredLanguage || 'English'}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleBatchAutoSend = () => {
    const sentCount = opdStore.autoSendAllDueAiFollowUps();
    setToastMessage(`Automated batch complete: ${sentCount} AI follow-up notes dispatched to patients via WhatsApp in Hindi & Bengali!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Filter visitors list
  const filteredVisitors = stats.patientsWhoCame.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mobile.includes(searchQuery) ||
      p.opdId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.abhaId && p.abhaId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClinic = clinicFilter === 'ALL' || p.clinicId === clinicFilter;
    const matchesLang = languageFilter === 'ALL' || (p.preferredLanguage || 'English') === languageFilter;

    return matchesSearch && matchesClinic && matchesLang;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-950 text-white px-5 py-3 rounded-2xl shadow-xl border border-teal-500 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Top Banner with Period Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full">
                DOCTOR ANALYTICS & PATIENT VISITATION
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                {stats.periodLabel}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              {restrictClinicId ? `${doctorName} — Patient Tracking & Consulting Revenue` : 'Patient Tracking & Consulting Services Dashboard'}
            </h1>
            <p className="text-xs text-slate-500">
              {restrictClinicId 
                ? `Personalized consultation records for ${doctorName}. Showing your visited antenatal patients, pending follow-ups with automated WhatsApp notes, and consulting fees.`
                : 'Overview of who has attended OPD, pending follow-ups with intelligent AI WhatsApp automation, and consulting revenue numbers.'}
            </p>
          </div>

          {/* Weekly vs Monthly Period Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setPeriod('WEEKLY')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                period === 'WEEKLY'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekly View (Last 7 Days)</span>
            </button>

            <button
              onClick={() => setPeriod('MONTHLY')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                period === 'MONTHLY'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Monthly View (October 2026)</span>
            </button>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* 1. Total Consultations */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
            <div className="flex items-center justify-between text-teal-800 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Total Patients Seen</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-teal-950">{stats.totalConsultations}</div>
            <div className="text-[11px] text-teal-700 mt-1 font-medium flex items-center gap-1">
              <span>{stats.paidCount} Paid</span>
              <span>•</span>
              <span>{stats.freeGovtCount} Free Govt (JSSK)</span>
            </div>
          </div>

          {/* 2. Consulting Services Revenue */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between text-emerald-800 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Consulting Revenue</span>
              <IndianRupee className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-emerald-950">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-emerald-700 mt-1 font-medium">
              Avg ₹{stats.averageFee} per paid consultation
            </div>
          </div>

          {/* 3. Follow-ups Required */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between text-amber-800 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Needs Follow-Up</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-amber-950">{stats.patientsNeedingFollowUp.length}</div>
            <div className="text-[11px] text-amber-700 mt-1 font-medium">
              Antenatal, High BP & Lab Reviews
            </div>
          </div>

          {/* 4. Automated AI Follow-ups Dispatched */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
            <div className="flex items-center justify-between text-purple-800 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">AI WhatsApp Notes</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-purple-950">{stats.aiFollowUpsSentCount}</div>
            <div className="text-[11px] text-purple-700 mt-1 font-medium">
              Sent in Hindi & Bengali
            </div>
          </div>
        </div>

        {/* Dashboard Sub-navigation Tabs */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-xs font-bold">
          <button
            onClick={() => setActiveTab('VISITORS')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'VISITORS'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>1. Who Has Come (Visitor Log — {stats.patientsWhoCame.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('FOLLOW_UP')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'FOLLOW_UP'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>2. Who Needs Follow-Up ({stats.patientsNeedingFollowUp.length})</span>
            {stats.patientsNeedingFollowUp.filter(p => !p.aiFollowUpSent).length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full font-black">
                {stats.patientsNeedingFollowUp.filter(p => !p.aiFollowUpSent).length} pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('REVENUE')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'REVENUE'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            <span>3. Consulting Revenue Numbers (₹{stats.totalRevenue.toLocaleString('en-IN')})</span>
          </button>

          <button
            onClick={() => setActiveTab('ACHIEVEMENTS')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'ACHIEVEMENTS'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>4. Clinical Quality & Achievements (All OPD Pathways)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: WHO HAS COME (VISITOR LOG) */}
      {activeTab === 'VISITORS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Patient Visitation Log — {stats.periodLabel}
              </h2>
              <p className="text-xs text-slate-500">
                Complete historical record of all patients consulted with ABHA consent status, consulting fees, and preferred language.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, ABHA, mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700 w-48"
                />
              </div>

              {!restrictClinicId && (
                <select
                  value={clinicFilter}
                  onChange={(e) => setClinicFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-xl px-2 py-1.5 bg-white font-medium text-slate-700"
                >
                  <option value="ALL">All OPD Clinics</option>
                  <option value="opd-anc">Maternal (Room 4)</option>
                  <option value="opd-gen">General (Room 1)</option>
                  <option value="opd-ped">Pediatrics (Room 2)</option>
                </select>
              )}

              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-2 py-1.5 bg-white font-medium text-slate-700"
              >
                <option value="ALL">All Languages</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* Visitor Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Visit Date & Token</th>
                  <th className="p-3">Patient Details</th>
                  <th className="p-3">OPD Clinic</th>
                  <th className="p-3">ABHA Status</th>
                  <th className="p-3">Alerts Language</th>
                  <th className="p-3">Consulting Fee</th>
                  <th className="p-3">Diagnosis / Outcome</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisitors.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-mono">
                      <span className="font-bold text-slate-900 block">{p.visitDate || '10 Oct 2026'}</span>
                      <span className="text-[10px] text-teal-700 font-extrabold">Token #{p.tokenNumber}</span>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.isPregnant && (
                          <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded font-normal">
                            ANC
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.age}y • {p.gender} • {p.mobile}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="text-slate-800 font-medium block">
                        {p.clinicName?.split('(')[0]?.trim() || 'Maternal OPD'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{p.assignedDoctor}</span>
                    </td>

                    <td className="p-3">
                      {p.hasAbhaConsent !== false ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>ABHA Linked</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full" title="Optional ABHA registration declined by patient">
                          <span>Skipped (No Consent)</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        p.preferredLanguage === 'Bengali'
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : p.preferredLanguage === 'Hindi'
                          ? 'bg-blue-50 text-blue-900 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {p.preferredLanguage === 'Bengali' ? 'বাংলা (Bengali)' : p.preferredLanguage === 'Hindi' ? 'हिन्दी (Hindi)' : 'English'}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="font-extrabold text-slate-900 block">
                        ₹{p.consultationFee !== undefined ? p.consultationFee : 300}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {p.billingScheme || (p.isPregnant ? 'JSSK Free ANC' : 'General OPD')}
                      </span>
                    </td>

                    <td className="p-3 max-w-xs">
                      <p className="text-slate-700 truncate" title={p.assessmentOutcome || p.visitReason}>
                        {p.assessmentOutcome || p.visitReason}
                      </p>
                      {p.followUpDate && (
                        <span className="text-[10px] text-teal-800 font-medium">
                          Next Follow-up: {p.followUpDate}
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenWhatsAppView && onOpenWhatsAppView(p.id)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                          title="Open WhatsApp patient thread"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        {onSelectPatient && (
                          <button
                            onClick={() => onSelectPatient(p)}
                            className="px-2 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 font-bold border border-teal-200 transition cursor-pointer"
                          >
                            Profile
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WHO NEEDS TO BE FOLLOWED UP (INTELLIGENT AI AUTOMATION) */}
      {activeTab === 'FOLLOW_UP' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Follow-Up Queue & Automated AI Notes
                </h2>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  {stats.patientsNeedingFollowUp.length} Patients Scheduled
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Patients who need clinical review, glucose/CBC lab checks, or high-risk monitoring. The AI Assistant personalizes follow-up notes in Hindi and Bengali.
              </p>
            </div>

            {/* Batch Auto-Dispatch Button */}
            <button
              onClick={handleBatchAutoSend}
              className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-2xl font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-2 self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Auto-Send All Scheduled AI Follow-Ups</span>
            </button>
          </div>

          {/* Follow-up Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.patientsNeedingFollowUp.map(p => {
              const isOverdue = p.followUpStatus === 'Overdue';
              const isDueToday = p.followUpStatus === 'Due Today';
              const aiGeneratedMessage = opdStore.generateAiFollowUpMessage(p.id);

              return (
                <div 
                  key={p.id}
                  className={`rounded-2xl p-4 border transition space-y-3 ${
                    isOverdue 
                      ? 'bg-rose-50/40 border-rose-200' 
                      : isDueToday 
                      ? 'bg-amber-50/40 border-amber-200' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{p.name}</span>
                        <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600">
                          {p.opdId}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isOverdue 
                            ? 'bg-rose-100 text-rose-800' 
                            : isDueToday 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {p.followUpStatus || 'Scheduled'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {p.mobile} • {p.age} yrs • {p.clinicName?.split('(')[0]?.trim()}
                      </p>
                    </div>

                    {/* Language Badge */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shrink-0">
                      Alerts: {p.preferredLanguage === 'Bengali' ? 'বাংলা' : p.preferredLanguage === 'Hindi' ? 'हिन्दी' : 'English'}
                    </span>
                  </div>

                  {/* Clinical Reason for Follow-up */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">
                        Scheduled Date: <strong className="text-teal-900">{p.followUpDate || 'Within 7 days'}</strong>
                      </span>
                      <span className="text-slate-400 font-mono">Dr. {p.assignedDoctor?.split(' ')[1] || 'Anita'}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      <strong>Follow-up Instruction:</strong> {p.followUpInstruction || p.assessmentOutcome || p.visitReason}
                    </p>
                  </div>

                  {/* AI Preview of Note */}
                  <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-bold text-purple-900">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-700" />
                        <span>AI WhatsApp Follow-up Note ({p.preferredLanguage || 'English'})</span>
                      </span>
                      {p.aiFollowUpSent ? (
                        <span className="text-emerald-700 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Dispatched
                        </span>
                      ) : (
                        <span className="text-purple-700">Ready to Send</span>
                      )}
                    </div>
                    <p className="text-slate-800 text-[11px] leading-relaxed whitespace-pre-line line-clamp-3">
                      {p.aiFollowUpNote || aiGeneratedMessage}
                    </p>
                  </div>

                  {/* Trigger AI Dispatch Button */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => onOpenWhatsAppView && onOpenWhatsAppView(p.id)}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>View WhatsApp Thread</span>
                    </button>

                    <button
                      onClick={() => handleSendAiFollowUp(p.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                        p.aiFollowUpSent
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-teal-800 hover:bg-teal-900 text-white shadow-2xs'
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{p.aiFollowUpSent ? 'Resend AI Follow-Up' : 'Send AI Follow-Up Note'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CONSULTING SERVICES REVENUE NUMBERS */}
      {activeTab === 'REVENUE' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Consulting Services Revenue Numbers — {stats.periodLabel}
              </h2>
              <p className="text-xs text-slate-500">
                Clean and transparent financial breakdown from outpatient doctor consultations and government welfare coverage.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold block">
                Total Consulting Revenue
              </span>
              <span className="text-2xl font-black text-emerald-950">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Revenue Breakdown by Clinic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.revenueByClinic.map(c => (
              <div key={c.clinicId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{c.clinicName}</span>
                  <Building2 className="w-4 h-4 text-teal-700" />
                </div>
                <div className="text-xl font-black text-slate-900">₹{c.amount.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{c.count} Patient Consultations</span>
                  <span className="font-bold text-teal-800">
                    {stats.totalRevenue > 0 ? `${Math.round((c.amount / stats.totalRevenue) * 100)}%` : '0%'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Breakdown by Billing Scheme */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-3 border-b border-slate-200 font-bold text-xs text-slate-700">
              Breakdown by Consulting Fee & Welfare Tier
            </div>
            <div className="divide-y divide-slate-100">
              {stats.revenueByScheme.map((scheme, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{scheme.scheme}</span>
                    <span className="text-[11px] text-slate-500">{scheme.count} Consultations Recorded</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-sm block">
                      ₹{scheme.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {scheme.amount === 0 ? '100% Subsidized (Govt JSSK)' : 'Collected'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DOCTOR CLINICAL QUALITY & ACHIEVEMENTS ACROSS ALL OPD PATHWAYS */}
      {activeTab === 'ACHIEVEMENTS' && (() => {
        const docAchievements = opdStore.getDoctorAchievements(doctorName);
        const earnedCount = docAchievements.filter(a => a.earned).length;

        return (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Top Philosophy & Guardrail Banner */}
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-teal-800 text-teal-200 px-2.5 py-0.5 rounded-full border border-teal-700">
                      CLINICIAN QUALITY RECOGNITION
                    </span>
                    <span className="text-[10px] font-bold text-teal-300">
                      Evaluated Across All Supported OPD Pathways
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    {doctorName} — Continuity of Care & Clinical Performance
                  </h3>
                  <p className="text-xs text-teal-100/90 mt-0.5">
                    Recognition is computed across <strong>Pregnancy, Gynaecology, PCOS, Preventive Screening, and General OPD</strong>. Not limited to antenatal follow-ups alone.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center shrink-0">
                  <span className="text-2xl font-black text-amber-300 block">{earnedCount} of {docAchievements.length}</span>
                  <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider">Quality Badges Earned</span>
                </div>
              </div>

              {/* Transparent Exclusions Notice */}
              <div className="bg-white/10 p-3 rounded-2xl border border-white/15 flex items-start gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-teal-100 leading-relaxed">
                  <strong className="text-white">Transparent Adherence Exclusions:</strong> Patients whose consultations were cancelled or rescheduled appropriately at patient request are excluded from non-compliance penalties, preserving accurate continuity metrics without distorting clinical realities.
                </div>
              </div>
            </div>

            {/* Doctor Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docAchievements.map(ach => (
                <div 
                  key={ach.id}
                  className={`p-5 rounded-3xl border transition relative overflow-hidden flex flex-col justify-between ${
                    ach.earned
                      ? 'bg-white border-teal-300 shadow-xs ring-1 ring-teal-400/20'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          ach.earned ? 'bg-teal-100 text-teal-900 border border-teal-300' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Award className="w-5 h-5 text-teal-700" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                            {ach.title}
                          </h4>
                          <span className={`text-[10px] font-bold uppercase tracking-wider block mt-0.5 ${
                            ach.earned ? 'text-emerald-700' : 'text-slate-500'
                          }`}>
                            {ach.earned ? '✓ Quality Target Achieved' : '○ In Progress'}
                          </span>
                        </div>
                      </div>

                      {ach.earned && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300 shrink-0">
                          Earned
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ach.description}
                    </p>

                    {/* Progress Indicator */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500">Metric Adherence:</span>
                        <span className="font-mono text-slate-900">
                          {ach.metricCurrent} / {ach.metricTarget}
                          {ach.code === 'CONTINUITY_GUARDIAN' ? '%' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.round((ach.metricCurrent / Math.max(ach.metricTarget, 1)) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                    <div className="text-slate-500">
                      <strong>Qualifying Pathways:</strong> {ach.eligiblePathways.join(' • ')}
                    </div>
                    {ach.exclusionsHandled > 0 && (
                      <div className="text-amber-800 font-medium">
                        🛡️ {ach.exclusionsHandled} rescheduled / cancelled visits protected via transparent exclusion.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
