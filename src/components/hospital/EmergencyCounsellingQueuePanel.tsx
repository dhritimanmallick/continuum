import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Video, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Ambulance, 
  FileText, 
  User, 
  Lock,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff
} from 'lucide-react';
import { CounsellingAppointment } from '../../types';
import { emergencyCounsellingService } from '../../services/emergencyCounsellingService';

interface EmergencyCounsellingQueuePanelProps {
  doctorId: string;
  doctorName: string;
}

export const EmergencyCounsellingQueuePanel: React.FC<EmergencyCounsellingQueuePanelProps> = ({
  doctorId,
  doctorName
}) => {
  const [, setVersion] = useState(0);
  const queue = emergencyCounsellingService.getDoctorQueue(doctorId);
  const allAppts = emergencyCounsellingService.getAppointments();

  const [activeCall, setActiveCall] = useState<CounsellingAppointment | null>(null);
  const [callNotes, setCallNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleAcceptCall = (appt: CounsellingAppointment) => {
    emergencyCounsellingService.startCall(appt.id);
    setActiveCall(appt);
    setVersion(v => v + 1);
  };

  const handleEndCall = () => {
    if (activeCall) {
      emergencyCounsellingService.completeCall(
        activeCall.id,
        callNotes || 'Patient evaluated via priority tele-counselling. Clinical recommendations provided.',
        recommendations || 'Continue prescribed routine care.'
      );
      setActiveCall(null);
      setCallNotes('');
      setRecommendations('');
      setVersion(v => v + 1);
    }
  };

  const handleEscalateToER = () => {
    if (activeCall) {
      emergencyCounsellingService.escalateToEmergency(
        activeCall.id,
        'High-risk obstetric red flag observed. Patient transferred to Emergency Triage.',
        '24/7 Maternity Emergency Room'
      );
      setActiveCall(null);
      setCallNotes('');
      setRecommendations('');
      setVersion(v => v + 1);
      alert('Patient escalated to 24/7 Maternity Emergency Ward.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
            <PhoneCall className="w-4 h-4 text-red-600 animate-pulse" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-xs">Emergency Doctor Tele-Counselling Queue</h4>
            <p className="text-[11px] text-slate-500">
              On-Duty Doctor: <strong>{doctorName}</strong> · 5–10 min rapid consults
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
          {queue.length} Patients in Queue
        </span>
      </div>

      {/* Active Call UI if in call */}
      {activeCall ? (
        <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-xs">Live Call with {activeCall.patientName} ({activeCall.patientAge}y)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                {activeCall.consultationType}
              </span>
            </div>
            <span className="text-amber-400 font-mono font-bold text-xs">⏱ In Call (10m slot)</span>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl text-xs space-y-1">
            <div className="text-slate-300 font-semibold">Patient Stated Reason:</div>
            <p className="text-slate-100 italic">"{activeCall.urgencyReason}"</p>
            {activeCall.patientConsentedRecordsAccess && (
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1">
                <Lock className="w-3 h-3" />
                <span>Patient has consented to full hospital EHR review</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Clinical Observation Notes:</label>
              <textarea
                rows={2}
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Doctor findings, maternal status, symptom review..."
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Follow-up Recommendation:</label>
              <textarea
                rows={2}
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                placeholder="Prescription adjustments, scheduled visits, red flags..."
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleEscalateToER}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Ambulance className="w-3.5 h-3.5" />
              <span>Escalate to Emergency Room</span>
            </button>

            <button
              onClick={handleEndCall}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>End &amp; Record Consultation</span>
            </button>
          </div>
        </div>
      ) : (
        /* Waiting Queue list */
        <div className="space-y-2">
          {queue.length > 0 ? (
            queue.map(appt => (
              <div key={appt.id} className="p-3 bg-red-50/50 border border-red-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-black text-slate-900">{appt.patientName}</h5>
                    <span className="text-slate-500">({appt.patientAge}y · {appt.patientMobile})</span>
                    {appt.isEmergencyPriority && (
                      <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 rounded">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    <strong>Reason:</strong> {appt.urgencyReason}
                  </p>
                </div>

                <button
                  onClick={() => handleAcceptCall(appt)}
                  className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Accept Call</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-100">
              No patients waiting in rapid-access tele-counselling queue. Status: Available on call.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
