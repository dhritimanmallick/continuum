import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCheck, 
  FileText, 
  Download, 
  PhoneCall, 
  Clock, 
  ShieldCheck, 
  Stethoscope, 
  Pill, 
  Activity, 
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { OpdPatient } from '../../types';

interface DoctorWhatsAppMessagesFeedProps {
  patient: OpdPatient;
  onOpenDoctorCounselling?: () => void;
}

export const DoctorWhatsAppMessagesFeed: React.FC<DoctorWhatsAppMessagesFeedProps> = ({
  patient,
  onOpenDoctorCounselling
}) => {
  const [messages, setMessages] = useState([
    {
      id: 'WA-01',
      sender: 'Dr. Anita Rao (OB/GYN) • St. Anne Hospital',
      senderType: 'DOCTOR',
      time: 'Today 09:30 AM',
      text: `Dear ${patient.name}, your 28-week antenatal clinical review has been recorded. Your vital signs (BP 118/76, FHR 142 bpm) are reassuring. Please download your official digital e-prescription below. We have applied Jan Aushadhi generic equivalents to save you 72% on medication costs.`,
      attachment: {
        type: 'PDF',
        name: `Prescription_${patient.name.replace(' ', '_')}_28w.pdf`,
        size: '184 KB'
      },
      status: 'READ'
    },
    {
      id: 'WA-02',
      sender: 'St. Anne Diagnostic Coordinator',
      senderType: 'HOSPITAL',
      time: 'Today 09:32 AM',
      text: `Dr. Anita Rao has ordered your 75g Oral Glucose Tolerance Test (OGTT) and Complete Blood Count. You may walk into Apex Diagnostics (City Centre) or request free doorstep sample pickup. Fasting for 8 hours is required.`,
      attachment: {
        type: 'LAB_SLIP',
        name: `Lab_Requisition_OGTT_CBC.pdf`,
        size: '120 KB'
      },
      status: 'READ'
    },
    {
      id: 'WA-03',
      sender: 'Continuum Care Reminders',
      senderType: 'SYSTEM',
      time: 'Today 01:55 PM',
      text: `💊 Medication Reminder: Time for your Tab. Calcium Carbonate 500mg with Vitamin D3 (after lunch with plain water). Remember to keep at least a 2-hour gap before taking your Iron tablet.`,
      status: 'READ'
    },
    {
      id: 'WA-04',
      sender: 'Dr. Anita Rao (OB/GYN)',
      senderType: 'DOCTOR',
      time: 'Today 02:10 PM',
      text: `Sunita, if you notice any unusual swelling, sudden headache, or blurred vision, please do not wait. Connect with me immediately using the 5-Minute Emergency Tele-Counselling button or call our 24x7 helpline: 080-2211-9999.`,
      status: 'READ'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: `WA-USER-${Date.now()}`,
      sender: patient.name,
      senderType: 'PATIENT',
      time: 'Just now',
      text: inputMessage,
      status: 'SENT'
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setIsSending(true);

    // Simulated doctor reply after 1.5 seconds
    setTimeout(() => {
      const docReply = {
        id: `WA-DOC-${Date.now()}`,
        sender: 'Dr. Anita Rao (OB/GYN)',
        senderType: 'DOCTOR',
        time: 'Just now',
        text: `Thank you for updating me, ${patient.name}. I have noted this in your active OPD clinical record. Continue your prescribed doses and see you on 12 Nov.`,
        status: 'DELIVERED'
      };
      setMessages(prev => [...prev, docReply]);
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-[#075e54] text-white p-5 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-white text-[#075e54] flex items-center justify-center font-bold text-xl border-2 border-emerald-300 shrink-0">
            👩‍⚕️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                Dr. Anita Rao, Senior Consultant OB/GYN
              </h2>
              <span className="text-[10px] bg-emerald-700 text-emerald-100 border border-emerald-500 px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                <CheckCheck className="w-3 h-3 text-emerald-300" />
                <span>Verified WhatsApp Hospital Channel</span>
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              Official Medical Consultation &amp; Care Updates • Connected to ABHA <strong>{patient.abhaId}</strong>
            </p>
          </div>
        </div>

        {onOpenDoctorCounselling && (
          <button
            type="button"
            onClick={onOpenDoctorCounselling}
            className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 shadow-sm transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>5-Min Emergency Call</span>
          </button>
        )}
      </div>

      {/* WhatsApp Message Chat Stream */}
      <div className="bg-[#efeae2] rounded-3xl border border-slate-300 p-4 sm:p-6 space-y-4 max-h-[550px] overflow-y-auto shadow-inner">
        <div className="text-center my-2">
          <span className="text-[10px] bg-white/80 text-slate-600 font-semibold px-3 py-1 rounded-full shadow-2xs border border-slate-200">
            Messages are end-to-end encrypted and linked to your ABHA health record
          </span>
        </div>

        {messages.map((m) => {
          const isPatient = m.senderType === 'PATIENT';
          return (
            <div 
              key={m.id}
              className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div 
                className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl shadow-xs text-xs space-y-2 ${
                  isPatient 
                    ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-xs' 
                    : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200'
                }`}
              >
                {!isPatient && (
                  <div className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-emerald-600" />
                    <span>{m.sender}</span>
                  </div>
                )}

                <p className="leading-relaxed whitespace-pre-line text-xs">
                  {m.text}
                </p>

                {/* Optional Document Attachment */}
                {m.attachment && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-3 mt-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                          {m.attachment.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {m.attachment.size} • Digital Signed PDF
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Downloading verified document: ${m.attachment?.name}`)}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 transition cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-0.5">
                  <span>{m.time}</span>
                  {isPatient && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic ml-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Dr. Anita Rao is typing...</span>
          </div>
        )}
      </div>

      {/* Reply Input Bar */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Message Dr. Anita Rao or ask a clarification regarding your medicines...`}
          className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#075e54] hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Reply</span>
        </button>
      </form>

    </div>
  );
};
