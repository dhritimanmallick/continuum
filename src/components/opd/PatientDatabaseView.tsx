import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Send,
  UserCheck,
  FileText,
  Activity,
  Heart
} from 'lucide-react';
import { OpdPatient } from '../../types';
import { opdStore } from '../../services/opdStore';

interface PatientDatabaseViewProps {
  onOpenWhatsAppView?: (patientId?: string) => void;
  onSelectPatient?: (patient: OpdPatient) => void;
  restrictClinicId?: string;
  doctorName?: string;
}

export const PatientDatabaseView: React.FC<PatientDatabaseViewProps> = ({
  onOpenWhatsAppView,
  onSelectPatient,
  restrictClinicId,
  doctorName = 'Dr. Anita Rao'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [clinicFilter, setClinicFilter] = useState(restrictClinicId || 'ALL');
  const [abhaFilter, setAbhaFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [followUpFilter, setFollowUpFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const rawPatients = opdStore.getAllVisitedPatients();
  const allPatients = restrictClinicId 
    ? rawPatients.filter(p => (p.clinicId || 'opd-anc') === restrictClinicId)
    : rawPatients;

  const handleSendAiNote = (patientId: string) => {
    const patient = allPatients.find(p => p.id === patientId);
    if (!patient) return;
    opdStore.sendAiFollowUp(patientId);
    setToastMessage(`Intelligent AI Follow-up sent to ${patient.name} on WhatsApp (${patient.preferredLanguage || 'English'})!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredPatients = allPatients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mobile.includes(searchQuery) ||
      p.opdId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.abhaId && p.abhaId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.visitReason && p.visitReason.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClinic = clinicFilter === 'ALL' || p.clinicId === clinicFilter;
    const matchesAbha = 
      abhaFilter === 'ALL' || 
      (abhaFilter === 'CONSENTED' && p.hasAbhaConsent !== false) ||
      (abhaFilter === 'DECLINED' && p.hasAbhaConsent === false);

    const matchesLang = languageFilter === 'ALL' || (p.preferredLanguage || 'English') === languageFilter;
    const matchesFollowUp = 
      followUpFilter === 'ALL' ||
      (followUpFilter === 'NEEDS_FOLLOW_UP' && (p.followUpStatus === 'Overdue' || p.followUpStatus === 'Due Today' || p.followUpStatus === 'Scheduled')) ||
      (followUpFilter === 'OVERDUE' && p.followUpStatus === 'Overdue') ||
      (followUpFilter === 'ATTENDED' && p.followUpStatus === 'Attended');

    return matchesSearch && matchesClinic && matchesAbha && matchesLang && matchesFollowUp;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-950 text-white px-5 py-3 rounded-2xl shadow-xl border border-teal-500 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                CENTRAL VISITED PATIENT REPOSITORY
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                {allPatients.length} Total Patients on File
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {restrictClinicId ? `${doctorName} — Visited Patient Repository` : 'Network Patient Database & AI Follow-Up Center'}
            </h1>
            <p className="text-xs text-slate-500">
              {restrictClinicId 
                ? `Search and review all antenatal and maternal outpatients registered under ${doctorName}. Send automated follow-up notes via WhatsApp in Hindi & Bengali.`
                : 'Complete archive of all patients who have visited our OPD clinics with ABHA consent tracking, preferred alert languages (Hindi & Bengali), and automated AI WhatsApp outreach.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                const count = opdStore.autoSendAllDueAiFollowUps();
                setToastMessage(`Batch automation: Sent ${count} AI follow-ups to due patients in Hindi & Bengali!`);
                setTimeout(() => setToastMessage(null), 5000);
              }}
              className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-2xl font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Auto-Send AI Follow-Ups to Due Patients</span>
            </button>
          </div>
        </div>

        {/* Search & Multi-Filters */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${restrictClinicId ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-2.5 pt-2 border-t border-slate-100 text-xs`}>
          <div className="relative lg:col-span-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, phone, ABHA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>

          {!restrictClinicId && (
            <select
              value={clinicFilter}
              onChange={(e) => setClinicFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-2 py-1.5 bg-white font-medium text-slate-700"
            >
              <option value="ALL">All OPD Clinics</option>
              <option value="opd-anc">Maternal OPD (Room 4)</option>
              <option value="opd-gen">General Medicine (Room 1)</option>
              <option value="opd-ped">Pediatrics (Room 2)</option>
            </select>
          )}

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-2 py-1.5 bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Languages</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Bengali">বাংলা (Bengali)</option>
            <option value="English">English</option>
          </select>

          <select
            value={abhaFilter}
            onChange={(e) => setAbhaFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-2 py-1.5 bg-white font-medium text-slate-700"
          >
            <option value="ALL">All ABHA Statuses</option>
            <option value="CONSENTED">ABHA Consented & Linked</option>
            <option value="DECLINED">ABHA Skipped (No Consent)</option>
          </select>

          <select
            value={followUpFilter}
            onChange={(e) => setFollowUpFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-2 py-1.5 bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Follow-Up Statuses</option>
            <option value="NEEDS_FOLLOW_UP">Needs Follow-Up</option>
            <option value="OVERDUE">Overdue Follow-Up</option>
            <option value="ATTENDED">Attended / Completed</option>
          </select>
        </div>
      </div>

      {/* Patient Cards / Table List */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
          <span>Showing {filteredPatients.length} of {allPatients.length} patients in database</span>
          <span className="text-[11px] text-slate-400">Click &ldquo;Send AI Follow-Up&rdquo; to dispatch intelligent WhatsApp alerts</span>
        </div>

        {/* Phone: one card per patient */}
        <ul className="md:hidden space-y-3">
          {filteredPatients.map(p => (
            <li key={p.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <button type="button" onClick={() => onSelectPatient?.(p)} className="w-full text-left cursor-pointer">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-base font-extrabold text-slate-900 truncate">{p.name}</span>
                  {p.followUpStatus && (
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      p.followUpStatus === 'Overdue' ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : p.followUpStatus === 'Due Today' ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>{p.followUpStatus}</span>
                  )}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  {p.age} yrs{p.isPregnant ? ` · ${p.pregnancyDetails?.gestationalAgeWeeks} weeks pregnant` : ''} · {p.preferredLanguage || 'English'}
                </span>
                <span className="block text-xs text-slate-500">
                  {p.clinicName?.split('(')[0]?.trim() || 'Maternal OPD'}{p.followUpDate ? ` · follow-up ${p.followUpDate}` : ''}
                </span>
              </button>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <a href={`tel:${p.mobile.replace(/\s/g, '')}`} className="flex items-center justify-center gap-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-800 active:bg-slate-50">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <button type="button" onClick={() => onOpenWhatsAppView?.(p.id)} className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-emerald-600 text-white text-[13px] font-bold cursor-pointer">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Patient & ID</th>
                <th className="p-3">Clinic & Doctor</th>
                <th className="p-3">ABHA Status</th>
                <th className="p-3">Language</th>
                <th className="p-3">Last Visit</th>
                <th className="p-3">Follow-Up Date & Status</th>
                <th className="p-3">AI WhatsApp Note</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map(p => {
                const isOverdue = p.followUpStatus === 'Overdue';
                const isDueToday = p.followUpStatus === 'Due Today';

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.isPregnant && (
                          <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1 py-0.2 rounded font-normal">
                            ANC ({p.pregnancyDetails?.gestationalAgeWeeks}w)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.opdId} • {p.mobile} • {p.age}y {p.gender}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-slate-800 block">
                        {p.clinicName?.split('(')[0]?.trim() || 'Maternal OPD'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{p.assignedDoctor}</span>
                    </td>

                    <td className="p-3">
                      {p.hasAbhaConsent !== false ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Linked</span>
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5 truncate max-w-[120px]">
                            {p.abhaId}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full" title="Patient opted out under ABDM voluntary consent guidelines">
                            <span>Skipped (No Consent)</span>
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Non-ABHA OPD</span>
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
                        {p.preferredLanguage === 'Bengali' ? 'বাংলা' : p.preferredLanguage === 'Hindi' ? 'हिन्दी' : 'English'}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-slate-700">
                      {p.visitDate || '10 Oct 2026'}
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">
                        {p.followUpDate || 'None scheduled'}
                      </div>
                      {p.followUpStatus && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          isOverdue 
                            ? 'bg-rose-100 text-rose-800' 
                            : isDueToday 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {p.followUpStatus}
                        </span>
                      )}
                    </td>

                    <td className="p-3 max-w-xs">
                      {p.aiFollowUpSent ? (
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Dispatched via WhatsApp</span>
                          </span>
                          <p className="text-[10px] text-slate-500 truncate" title={p.aiFollowUpNote}>
                            {p.aiFollowUpNote}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Not sent yet</span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSendAiNote(p.id)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                            p.aiFollowUpSent
                              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                          }`}
                          title="Generate & send personalized AI follow-up note on WhatsApp"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{p.aiFollowUpSent ? 'Resend' : 'Send AI Note'}</span>
                        </button>

                        <button
                          onClick={() => onOpenWhatsAppView && onOpenWhatsAppView(p.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          title="Open WhatsApp chat window"
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
