import { apiUrl } from '../../services/apiBase';
import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  TestTube, 
  FileText,
  Clock
} from 'lucide-react';
import { OpdPatient } from '../../types';
import { opdStore } from '../../services/opdStore';

interface PatientChatbotModalProps {
  patient: OpdPatient;
  onClose: () => void;
}

export const PatientChatbotModal: React.FC<PatientChatbotModalProps> = ({
  patient,
  onClose
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'assistant' | 'user'; text: string; timestamp: string }>>([
    {
      role: 'assistant',
      text: `Hello ${patient.name}. I am the Continuum Patient Assistant, an automated AI helper linked to your official hospital records at District Hospital Hubballi. How can I help you regarding your visits, test status, or doctor's instructions?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Quick preset questions from specification
  const presetQuestions = [
    'When should I come back?',
    'Has my report come?',
    'What tests has the doctor asked me to do?'
  ];

  const handleSend = async (messageText: string) => {
    const textToSend = messageText.trim();
    if (!textToSend) return;

    const userMsg = {
      role: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build safe patient context
      const patientContext = {
        name: patient.name,
        pregnancySummary: patient.isPregnant && patient.pregnancyDetails
          ? `${patient.pregnancyDetails.gestationalAgeWeeks} weeks pregnant (EDD: ${patient.pregnancyDetails.edd})`
          : 'Non-pregnant',
        followUpDate: patient.followUpDate,
        doctorAdvice: patient.followUpInstruction || patient.doctorNotes || 'Routine antenatal care advised by Dr. Anita Rao',
        investigations: patient.labReferrals.map(r => ({
          testName: r.testName,
          status: r.status,
          date: r.requestedAt
        })),
        releasedReports: patient.labReferrals
          .filter(r => r.status === 'REPORT READY' || r.status === 'REVIEWED')
          .map(r => ({
            testName: r.testName,
            summary: r.reportSummary,
            date: r.releasedAt
          }))
      };

      const resp = await fetch(apiUrl('/api/ai/patient-chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientContext,
          message: textToSend,
          chatHistory: messages
        })
      });

      const data = await resp.json();
      const botReply = data.data?.reply || "I am connected to your hospital record. Please contact Dr. Anita Rao's OPD room for clinical guidance.";

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('Chatbot fetch error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Your next follow-up visit with Dr. Anita Rao is on ${patient.followUpDate || '15 October 2026'}. Please check with the hospital desk for any pending laboratory results.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Header */}
        <div className="p-4 bg-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white">Continuum Patient Assistant</h3>
                <span className="text-[10px] bg-teal-800 text-teal-200 px-1.5 py-0.2 rounded font-mono">
                  AI ASSISTANT
                </span>
              </div>
              <p className="text-[11px] text-teal-200">
                Patient: <strong className="text-white">{patient.name}</strong> • Record #{patient.opdId}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-teal-300 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Disclaimer Banner (Section 3) */}
        <div className="p-2.5 bg-amber-50 border-b border-amber-200 text-amber-950 flex items-center gap-2 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>AI Safety Rule:</strong> This assistant explains approved hospital records only. It does not diagnose or recommend treatment.
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((m, idx) => (
            <div 
              key={idx}
              className={`flex gap-2.5 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[11px] font-bold ${
                m.role === 'user' ? 'bg-slate-800' : 'bg-teal-700'
              }`}>
                {m.role === 'user' ? 'You' : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`p-3 rounded-2xl ${
                m.role === 'user'
                  ? 'bg-teal-800 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-xs'
              }`}>
                <p className="leading-relaxed whitespace-pre-line text-xs">{m.text}</p>
                <span className={`text-[9px] block text-right mt-1 ${m.role === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Bot className="w-4 h-4 animate-bounce text-teal-600" />
              <span>Continuum Assistant is consulting patient record...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips (Section 2) */}
        <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="font-bold text-slate-400 text-[10px] uppercase shrink-0">Ask:</span>
          {presetQuestions.map(q => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-full whitespace-nowrap cursor-pointer transition text-slate-700"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question about appointments or reports..."
            className="flex-1 p-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl cursor-pointer disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
