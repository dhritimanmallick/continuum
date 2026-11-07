import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Plus, 
  Stethoscope, 
  Activity, 
  Syringe, 
  Baby, 
  Bell,
  MessageCircle
} from 'lucide-react';
import { OpdPatient } from '../../types';

interface PatientSchedulesPanelProps {
  patient: OpdPatient;
  onBookNewAppointment?: () => void;
  onOpenWhatsApp?: () => void;
}

export const PatientSchedulesPanel: React.FC<PatientSchedulesPanelProps> = ({
  patient,
  onBookNewAppointment,
  onOpenWhatsApp
}) => {
  const [scheduleFilter, setScheduleFilter] = useState<'UPCOMING' | 'COMPLETED' | 'ALL'>('UPCOMING');
  const [rescheduleToast, setRescheduleToast] = useState<string | null>(null);

  const schedules = [
    {
      id: 'SCH-01',
      date: '12 Nov 2026',
      time: '10:30 AM',
      title: '28-Week Antenatal Clinical Review & Protocol Assessment',
      doctor: 'Dr. Anita Rao, Senior Consultant OB/GYN',
      location: 'Room 4 (Maternal Suite), St. Anne Hospital',
      type: 'DOCTOR_OPD',
      status: 'CONFIRMED',
      instructions: 'Bring your Mother & Child Protection (MCP) card. Fasting not required for doctor visit.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
    },
    {
      id: 'SCH-02',
      date: '12 Nov 2026',
      time: '08:30 AM (Fasting)',
      title: '75g Oral Glucose Tolerance Test (OGTT) & CBC Smear',
      doctor: 'Ordered by Dr. Anita Rao',
      location: 'Apex Diagnostic Centre (ONDC Node) or St. Anne Central Lab',
      type: 'LAB_TEST',
      status: 'CONFIRMED',
      instructions: 'Fast for 8 hours overnight before morning blood draw. 75g glucose drink provided at lab.',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      id: 'SCH-03',
      date: '26 Nov 2026',
      time: '04:00 PM',
      title: '30-Week Fetal Growth & Umbilical Doppler Ultrasound Scan',
      doctor: 'Dr. Veena Hegde, DMRD',
      location: 'Suraksha Ultrasound & Imaging Centre (Vidyanagar)',
      type: 'ULTRASOUND',
      status: 'SCHEDULED',
      instructions: 'Drink 2 glasses of water 45 mins prior to scan. Carry previous 20w TIFFA report.',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    },
    {
      id: 'SCH-04',
      date: '10 Dec 2026',
      time: '11:00 AM',
      title: '32-Week Maternal Health Review & Pre-Delivery Planning',
      doctor: 'Dr. Anita Rao, Senior Consultant OB/GYN',
      location: 'Room 4, St. Anne Hospital',
      type: 'DOCTOR_OPD',
      status: 'SCHEDULED',
      instructions: 'Birth plan review, birth companion registration, and hospital labour room tour.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
    },
    {
      id: 'SCH-05',
      date: '25 Aug 2026',
      time: '11:15 AM',
      title: '24-Week Antenatal Review & Tdap Maternal Immunization',
      doctor: 'Dr. Anita Rao & Sister Mary Fernandez',
      location: 'St. Anne Hospital (Room 4)',
      type: 'DOCTOR_OPD',
      status: 'COMPLETED',
      instructions: 'Completed successfully. Tdap dose 1 administered and logged into ABDM.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'SCH-06',
      date: '28 Jul 2026',
      time: '02:30 PM',
      title: 'Level-II Targeted Imaging for Fetal Anomalies (TIFFA)',
      doctor: 'Dr. Veena Hegde, DMRD',
      location: 'Suraksha Imaging (ONDC Node)',
      type: 'ULTRASOUND',
      status: 'COMPLETED',
      instructions: 'Normal fetal structural anatomy documented. Report synced to ABHA.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  ];

  const filtered = schedules.filter(s => {
    if (scheduleFilter === 'UPCOMING') return s.status === 'CONFIRMED' || s.status === 'SCHEDULED';
    if (scheduleFilter === 'COMPLETED') return s.status === 'COMPLETED';
    return true;
  });

  const handleReschedule = (id: string, date: string) => {
    setRescheduleToast(`Reschedule request for ${date} submitted! Our receptionist will confirm your preferred slot via WhatsApp.`);
    setTimeout(() => setRescheduleToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {rescheduleToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{rescheduleToast}</span>
          </div>
          <button onClick={() => setRescheduleToast(null)} className="text-emerald-700 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              My Appointment Schedules &amp; Protocol Timeline
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track upcoming doctor consultations, fasting diagnostic blood draws, ultrasound scans, and postpartum reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBookNewAppointment && (
            <button
              onClick={onBookNewAppointment}
              className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Visit</span>
            </button>
          )}

          {onOpenWhatsApp && (
            <button
              onClick={onOpenWhatsApp}
              className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs border border-emerald-300 transition cursor-pointer flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Reminders</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'UPCOMING', label: 'Upcoming Appointments (4)' },
          { id: 'COMPLETED', label: 'Past Completed Visits (2)' },
          { id: 'ALL', label: 'Complete Timeline (6)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setScheduleFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              scheduleFilter === tab.id 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4">
        {filtered.map(item => (
          <div 
            key={item.id}
            className={`p-5 rounded-3xl border transition space-y-3 bg-white ${
              item.status === 'CONFIRMED' 
                ? 'border-rose-300 shadow-sm ring-1 ring-rose-200' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {item.date.split(' ')[1]}
                  </span>
                  <span className="text-base font-black text-slate-900">
                    {item.date.split(' ')[0]}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.time}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs font-semibold text-rose-800 mt-0.5">{item.doctor}</p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex sm:flex-col items-end gap-2 shrink-0">
                {item.status !== 'COMPLETED' ? (
                  <button
                    type="button"
                    onClick={() => handleReschedule(item.id, item.date)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    Reschedule
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Completed &amp; Signed</span>
                  </span>
                )}
              </div>
            </div>

            {/* Location & Instructions */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{item.location}</span>
              </div>
              <div className="text-slate-500 italic text-[11px]">
                📌 {item.instructions}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
