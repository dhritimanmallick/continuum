import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Video, 
  ShieldAlert, 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  X,
  FileText,
  Ambulance,
  Lock,
  Stethoscope,
  Smile,
  ChevronRight
} from 'lucide-react';
import { EmergencyCounsellingSlot, CounsellingAppointment, OpdPatient } from '../../types';
import { emergencyCounsellingService } from '../../services/emergencyCounsellingService';
import { opdStore } from '../../services/opdStore';

interface EmergencyDoctorCounsellingModalProps {
  initialPatientId?: string;
  onClose: () => void;
  onNavigateToPhysicalOpd?: () => void;
}

export const EmergencyDoctorCounsellingModal: React.FC<EmergencyDoctorCounsellingModalProps> = ({
  initialPatientId,
  onClose,
  onNavigateToPhysicalOpd
}) => {
  const [, setVersion] = useState(0);
  const patient = opdStore.patients.find(p => p.id === (initialPatientId || 'PAT-104')) || opdStore.patients[0];
  const slots = emergencyCounsellingService.getSlots();
  const appointments = emergencyCounsellingService.getAppointmentsForPatient(patient.id);

  // Booking form state
  const [selectedSlotId, setSelectedSlotId] = useState<string>(slots[0]?.id || '');
  const [consultationType, setConsultationType] = useState<'AUDIO' | 'VIDEO'>('VIDEO');
  const [isEmergencyPriority, setIsEmergencyPriority] = useState(false);
  const [urgencyReason, setUrgencyReason] = useState('');
  const [consentRecordsAccess, setConsentRecordsAccess] = useState(true);

  // Active call state
  const [activeCallAppt, setActiveCallAppt] = useState<CounsellingAppointment | null>(null);
  const [callDurationSeconds, setCallDurationSeconds] = useState(600); // 10 minutes
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [doctorCallNotes, setDoctorCallNotes] = useState('');

  const selectedSlot = slots.find(s => s.id === selectedSlotId) || slots[0];

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (activeCallAppt && callDurationSeconds > 0) {
      timer = setInterval(() => {
        setCallDurationSeconds(s => Math.max(0, s - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCallAppt, callDurationSeconds]);

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urgencyReason.trim()) return;

    const newAppt = emergencyCounsellingService.bookEmergencySlot({
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientMobile: patient.mobile,
      doctorId: selectedSlot.doctorId,
      doctorName: selectedSlot.doctorName,
      consultationType,
      isEmergencyPriority,
      urgencyReason,
      patientConsentedRecordsAccess: consentRecordsAccess
    });

    setVersion(v => v + 1);
    // Automatically launch into active call room
    setActiveCallAppt(newAppt);
    setCallDurationSeconds(selectedSlot.consultationDurationMinutes * 60);
  };

  const handleEndCall = () => {
    if (activeCallAppt) {
      emergencyCounsellingService.completeCall(
        activeCallAppt.id, 
        doctorCallNotes || 'Patient counselled regarding gestational symptoms. Clinical reassurance provided.',
        'Follow standard dietary and resting advice. Report immediately if acute red-flags develop.'
      );
      setActiveCallAppt(null);
      setVersion(v => v + 1);
    }
  };

  const handleEscalateToER = () => {
    if (activeCallAppt) {
      emergencyCounsellingService.escalateToEmergency(
        activeCallAppt.id,
        'High-risk obstetric red flag observed during tele-counselling. Immediate triage transfer required.',
        '24/7 Maternity Emergency Ward'
      );
      setActiveCallAppt(null);
      setVersion(v => v + 1);
      alert('Patient transferred to 24/7 Maternity Emergency Ward priority admission.');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#faf8f6] rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950 via-rose-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-red-900/60 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center font-bold text-red-300 text-base shadow-xs">
              <PhoneCall className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">RAPID-ACCESS DOCTOR COUNSELLING</h3>
                <span className="text-[10px] bg-red-800 text-red-200 px-2 py-0.5 rounded-full font-bold">
                  5–10 Min Priority Tele-Care
                </span>
              </div>
              <p className="text-[11px] text-red-200 font-medium">
                Immediate audio/video consultation with on-duty OB-GYN specialists for urgent doubt clearance and clinical guidance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* CRITICAL EMERGENCY RED-FLAG BANNER */}
          <div className="bg-red-600 text-white rounded-2xl p-4 shadow-md flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-yellow-300 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <h4 className="font-black text-sm uppercase tracking-wider text-yellow-200">
                  LIFE-THREATENING EMERGENCY SAFETY NOTICE
                </h4>
                <p className="text-xs text-red-100 mt-1 leading-relaxed">
                  If you or the expectant mother are experiencing: <strong>Active bright red bleeding</strong>, <strong>sudden severe headache with blurred vision</strong>, <strong>loss of fetal movements</strong>, <strong>water breaking / fluid leakage</strong>, or <strong>severe chest / abdominal pain</strong> — 
                  <span className="text-white font-black underline ml-1">DO NOT wait for an online tele-appointment!</span>
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <a
                    href="tel:108"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-red-950 font-black rounded-lg text-xs hover:bg-yellow-300 shadow-sm"
                  >
                    <Ambulance className="w-4 h-4" />
                    <span>Call 108 Emergency Ambulance</span>
                  </a>
                  <span className="text-[11px] text-red-200">
                    District Hospital Casualty 24/7: <strong>+91 836 2233445</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE CALL ROOM OVERLAY IF SESSION IN PROGRESS */}
          {activeCallAppt ? (
            <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-2xl border border-slate-800 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <div>
                    <h3 className="text-sm font-black text-white">{activeCallAppt.doctorName}</h3>
                    <span className="text-xs text-slate-400">Consultation for {activeCallAppt.patientName} ({activeCallAppt.patientAge}y)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-slate-800 rounded-xl font-mono text-sm font-bold text-amber-400 border border-slate-700">
                    ⏱ {formatTimer(callDurationSeconds)}
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    HD Audio/Video Encrypted
                  </span>
                </div>
              </div>

              {/* Video Mock Screens */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-64">
                {/* Doctor Video Screen */}
                <div className="md:col-span-2 bg-slate-950 rounded-2xl relative flex items-center justify-center overflow-hidden border border-slate-800">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-rose-900/60 border border-rose-500 flex items-center justify-center text-2xl mx-auto mb-2">
                      👩‍⚕️
                    </div>
                    <div className="font-bold text-sm text-slate-200">{activeCallAppt.doctorName}</div>
                    <div className="text-xs text-slate-400">Attending Consultant · Hubballi OPD Tele-Room</div>
                    <div className="mt-3 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="w-1.5 h-6 bg-emerald-400 rounded-full animate-pulse delay-75" />
                      <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-pulse delay-150" />
                      <span className="w-1.5 h-5 bg-emerald-400 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded-lg text-[10px] text-white font-bold flex items-center gap-1">
                    <Video className="w-3 h-3 text-emerald-400" />
                    <span>Doctor Feed (Active)</span>
                  </div>
                </div>

                {/* Patient Self-View & Record Context */}
                <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="aspect-video bg-slate-950 rounded-xl flex items-center justify-center relative overflow-hidden mb-2">
                      <span className="text-xl">🤰</span>
                      <span className="absolute bottom-1 right-2 text-[9px] bg-black/70 px-1 rounded text-slate-300">
                        You ({patient.name})
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Lock className="w-3 h-3" />
                        <span>Consented Records Shared</span>
                      </div>
                      <div className="text-slate-400">Gestation: 28 weeks (EDD: Dec 2026)</div>
                      <div className="text-slate-400">Recent Hb: 10.2 g/dL · O Negative</div>
                      <div className="text-slate-400">Reason: {activeCallAppt.urgencyReason}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Doctor Clinical Notes:
                    </label>
                    <textarea
                      rows={2}
                      value={doctorCallNotes}
                      onChange={(e) => setDoctorCallNotes(e.target.value)}
                      placeholder="Doctor advice, symptom review, and home care recommendations..."
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Call Control Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      isMuted ? 'bg-red-600 border-red-700 text-white' : 'bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsVideoDisabled(!isVideoDisabled)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      isVideoDisabled ? 'bg-red-600 border-red-700 text-white' : 'bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    {isVideoDisabled ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleEscalateToER}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Ambulance className="w-4 h-4" />
                    <span>Escalate to Hospital Emergency Ward</span>
                  </button>
                </div>

                <button
                  onClick={handleEndCall}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Complete Consultation &amp; Save Notes</span>
                </button>
              </div>
            </div>
          ) : (
            /* BOOKING FLOW WHEN NO ACTIVE CALL */
            <div className="space-y-4">
              
              {/* Doctor Slots List */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 block">
                  Select Available On-Duty Obstetrician
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {slots.map(slot => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-rose-50/70 border-rose-500 shadow-xs ring-1 ring-rose-500' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl">{slot.doctorAvatar}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              slot.status === 'AVAILABLE_NOW' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {slot.status === 'AVAILABLE_NOW' ? '🟢 Available Now' : '🟡 In OPD Room'}
                            </span>
                          </div>

                          <h4 className="font-black text-slate-900 text-xs">{slot.doctorName}</h4>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{slot.doctorSpecialty}</p>
                          <p className="text-[10px] text-rose-700 font-semibold mt-1">{slot.roomNumber}</p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 flex items-center gap-1 font-semibold">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Wait: ~{slot.estimatedWaitMinutes} mins
                          </span>
                          <span className="font-bold text-slate-800">
                            {slot.consultationDurationMinutes} min slot
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Details Form */}
              <form onSubmit={handleBookSession} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Consultation Mode</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConsultationType('VIDEO')}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          consultationType === 'VIDEO' ? 'bg-rose-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Video Consultation</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConsultationType('AUDIO')}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          consultationType === 'AUDIO' ? 'bg-rose-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Audio Call</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Patient Details</label>
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                      <span className="font-bold text-slate-900">{patient.name} ({patient.age}y)</span>
                      <span className="text-slate-500">{patient.mobile}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Describe your symptom or reason for rapid counselling *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={urgencyReason}
                    onChange={(e) => setUrgencyReason(e.target.value)}
                    placeholder="e.g. Mild lower abdominal stretching sensation, need to verify if normal at 28 weeks; also check iron tablet timings."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-rose-500 outline-hidden"
                  />
                </div>

                {/* Consent to access existing medical history */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 text-xs">Authorize Doctor to Review Prior Hospital Records</span>
                      <p className="text-[10px] text-slate-500">
                        Allows {selectedSlot.doctorName} to view your previous blood tests, ultrasound scans, and prescriptions during the session.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={consentRecordsAccess}
                    onChange={(e) => setConsentRecordsAccess(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Expected wait time: <strong>~{selectedSlot.estimatedWaitMinutes} minutes</strong>
                  </span>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-black rounded-xl text-xs shadow-md flex items-center gap-2 transition cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Connect with {selectedSlot.doctorName.split(',')[0]} Now</span>
                  </button>
                </div>
              </form>

              {/* Consultation History Ledger */}
              {appointments.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Previous Tele-Counselling Sessions &amp; Notes</span>
                  </h4>

                  <div className="space-y-2">
                    {appointments.map(appt => (
                      <div key={appt.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{appt.doctorName}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                            {appt.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">Booked: {appt.bookedAt} · Reason: {appt.urgencyReason}</div>
                        {appt.clinicalNotes && (
                          <div className="p-2 bg-white rounded-lg border border-slate-100 text-[11px] text-slate-700">
                            <strong>Doctor Clinical Note:</strong> {appt.clinicalNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
