import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  CheckCheck, 
  Phone, 
  User, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  Globe,
  RefreshCw
} from 'lucide-react';
import { OpdPatient } from '../../types';
import { opdStore } from '../../services/opdStore';

interface WhatsAppJourneyModalProps {
  initialPatientId?: string;
  onClose: () => void;
}

export const WhatsAppJourneyModal: React.FC<WhatsAppJourneyModalProps> = ({
  initialPatientId,
  onClose
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(
    initialPatientId || opdStore.patients[0]?.id || 'PAT-104'
  );
  const [customMessage, setCustomMessage] = useState('');

  const patient = opdStore.patients.find(p => p.id === selectedPatientId) || opdStore.patients[0];

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim() || !patient) return;

    opdStore.sendWhatsApp(patient.id, customMessage.trim());
    setCustomMessage('');
  };

  const handleTriggerAiFollowUp = () => {
    if (!patient) return;
    opdStore.sendAiFollowUp(patient.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* WhatsApp Mobile Frame Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-base">
              {patient?.name?.slice(0, 2).toUpperCase() || 'PT'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">{patient?.name}</h3>
                <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.2 rounded font-mono text-emerald-100">
                  {patient?.opdId}
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-emerald-100 font-bold flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>{patient?.preferredLanguage === 'Bengali' ? 'বাংলা (Bengali)' : patient?.preferredLanguage === 'Hindi' ? 'हिन्दी (Hindi)' : 'English'}</span>
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 font-mono flex items-center gap-1">
                <span>{patient?.mobile}</span>
                <span>• {patient?.clinicName?.split('(')[0]?.trim() || 'OPD Clinic'}</span>
                {patient?.hasAbhaConsent !== false ? (
                  <span className="text-emerald-300">| ABHA Linked</span>
                ) : (
                  <span className="text-amber-200">| Non-ABHA</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Patient dropdown selector */}
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-emerald-900 text-white text-[11px] rounded-lg px-2 py-1 border border-emerald-700 font-semibold"
            >
              {opdStore.patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.preferredLanguage === 'Bengali' ? 'BN' : p.preferredLanguage === 'Hindi' ? 'HI' : 'EN'})
                </option>
              ))}
            </select>

            <button 
              onClick={onClose}
              className="p-1 text-emerald-200 hover:text-white rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action bar for Quick AI Follow-Up Trigger */}
        <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-[11px]">
            <span>Automated Patient Notifications</span>
          </div>

          <button
            onClick={handleTriggerAiFollowUp}
            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs transition"
          >
            <Sparkles className="w-3 h-3 text-emerald-200" />
            <span>Send Follow-Up</span>
          </button>
        </div>

        {/* WhatsApp Thread Wallpaper Background */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]/40 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Encryption & Facility Banner */}
            <div className="text-center my-1">
              <span className="inline-block bg-amber-100/90 text-amber-900 border border-amber-200 text-[10px] px-2.5 py-0.5 rounded-md font-medium">
                Official OPD Notifications • {patient?.preferredLanguage || 'English'}
              </span>
            </div>

            {/* Render all WhatsApp messages for this patient */}
            {patient?.whatsappMessages && patient.whatsappMessages.length > 0 ? (
              patient.whatsappMessages.map(msg => {
                const isAiNote = msg.type === 'ai_follow_up' || msg.text.includes('🤖');

                return (
                  <div 
                    key={msg.id}
                    className={`max-w-[85%] rounded-2xl rounded-tl-xs p-3 shadow-xs space-y-1 self-start ${
                      isAiNote 
                        ? 'bg-purple-50 border border-purple-200' 
                        : 'bg-white border border-emerald-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-0.5">
                      <span className={`capitalize ${isAiNote ? 'text-purple-800 flex items-center gap-1' : 'text-emerald-700'}`}>
                        {isAiNote && <Sparkles className="w-3 h-3" />}
                        {(msg.type || '').replace('_', ' ')}
                      </span>
                      <span className="text-slate-400 font-normal">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-800 text-xs leading-relaxed whitespace-pre-line font-sans">
                      {msg.text}
                    </p>
                    <div className="flex justify-end text-[10px] text-emerald-600 font-bold">
                      <CheckCheck className="w-3.5 h-3.5 inline text-emerald-600" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No WhatsApp messages sent yet for this patient. Click &ldquo;Send Intelligent AI Follow-Up&rdquo; above or enter a message below.
              </div>
            )}
          </div>

          {/* Quick Staff Dispatch Bar */}
          <form onSubmit={handleSendCustomMessage} className="mt-4 pt-3 border-t border-slate-200 bg-white p-2 rounded-2xl shadow-xs flex items-center gap-2">
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={`Send instant WhatsApp alert to ${patient?.name}...`}
              className="flex-1 p-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={!customMessage.trim()}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl cursor-pointer disabled:opacity-50 transition"
              title="Send WhatsApp message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
