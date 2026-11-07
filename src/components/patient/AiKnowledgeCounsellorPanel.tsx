import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  AlertTriangle, 
  PhoneCall, 
  CheckCircle2, 
  HelpCircle, 
  Globe, 
  ExternalLink,
  ShieldAlert,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { AiCounsellingMessage, RagCitation } from '../../types';

interface AiKnowledgeCounsellorPanelProps {
  onOpenDoctorCounselling?: () => void;
  patientGestation?: string;
}

const DEFAULT_SUGGESTIONS = [
  'What should I eat during the 2nd trimester to prevent anaemia?',
  'How do I differentiate normal cramps from true labour contractions?',
  'What are the warning signs of preeclampsia that require emergency care?',
  'Can I take iron and calcium supplements together?'
];

export const AiKnowledgeCounsellorPanel: React.FC<AiKnowledgeCounsellorPanelProps> = ({
  onOpenDoctorCounselling,
  patientGestation
}) => {
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Bengali' | 'Kannada' | 'Marathi'>('English');
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AiCounsellingMessage[]>([
    {
      id: 'welcome',
      sender: 'AI_COUNSELLOR',
      timestamp: 'Just now',
      content: `Hello! I am the Continuum Medical Knowledge Assistant. I can answer questions about pregnancy trimesters, nutrition, labour stages, postnatal care, and women's health grounded directly in official FOGSI, RCOG, and WHO clinical literature.

Important Safety Notice: I provide educational reference information only. I cannot diagnose conditions, prescribe medications, or replace the personal clinical advice of your treating obstetrician. If you experience emergency symptoms, please proceed immediately to hospital emergency care.`,
      suggestedQuestions: DEFAULT_SUGGESTIONS
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuestion).trim();
    if (!query || loading) return;

    const userMsg: AiCounsellingMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      content: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/knowledge-counselling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          language,
          patientGestation,
          chatHistory: messages.map(m => ({
            role: m.sender === 'USER' ? 'user' : 'model',
            text: m.content
          }))
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const botMsg: AiCounsellingMessage = {
          id: `bot-${Date.now()}`,
          sender: 'AI_COUNSELLOR',
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          content: resData.data.answer,
          citations: resData.data.citations,
          isEmergencyEscalation: resData.data.isEmergencyEscalation,
          escalationReason: resData.data.escalationReason,
          suggestedQuestions: resData.data.suggestedQuestions
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(resData.error || 'Failed to get answer');
      }
    } catch (err: any) {
      const errorMsg: AiCounsellingMessage = {
        id: `err-${Date.now()}`,
        sender: 'AI_COUNSELLOR',
        timestamp: 'Just now',
        content: `I experienced a temporary network connection issue. However, you can review our verified digital books in the Books tab or book a 5-minute tele-counselling appointment directly with Dr. Anita Rao.`,
        suggestedQuestions: DEFAULT_SUGGESTIONS
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      
      {/* Top Controls Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800">Continuum RAG Knowledge Assistant</span>
          <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded">
            Gemini 3.8 Flash Grounded
          </span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium text-[11px]">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800 text-xs cursor-pointer focus:border-indigo-500 outline-hidden"
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Bengali">বাংলা (Bengali)</option>
            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
            <option value="Marathi">मराठी (Marathi)</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender identifier */}
            <div className="text-[10px] text-slate-400 font-bold mb-1 px-1 flex items-center gap-1.5">
              <span>{msg.sender === 'USER' ? 'You' : 'Continuum Knowledge AI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                msg.sender === 'USER'
                  ? 'bg-indigo-900 text-white font-medium rounded-tr-none'
                  : msg.isEmergencyEscalation
                  ? 'bg-rose-50 border-2 border-rose-500 text-rose-950 font-medium rounded-tl-none'
                  : 'bg-white border border-slate-200 text-slate-800 font-normal rounded-tl-none'
              }`}
            >
              {/* Emergency Banner inside response */}
              {msg.isEmergencyEscalation && (
                <div className="mb-3 p-3 bg-red-600 text-white rounded-xl flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-white shrink-0" />
                    <div>
                      <div className="font-black text-xs uppercase tracking-wider">HIGH-RISK RED FLAG DETECTED</div>
                      <div className="text-[11px] text-red-100">{msg.escalationReason}</div>
                    </div>
                  </div>
                  <a
                    href="tel:108"
                    className="px-3 py-1 bg-white text-red-700 font-black rounded-lg text-xs hover:bg-red-50 shrink-0"
                  >
                    Call 108 Emergency
                  </a>
                </div>
              )}

              {/* Message text formatted */}
              <div className="whitespace-pre-line text-xs sm:text-[13px] leading-relaxed">
                {msg.content}
              </div>

              {/* RAG Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-indigo-600" />
                    <span>Approved Clinical References &amp; Citations:</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {msg.citations.map((cite, i) => (
                      <div 
                        key={i} 
                        className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 text-[11px] text-indigo-950"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-indigo-900">
                            📖 {cite.sourceTitle}
                          </span>
                          <span className="text-[10px] bg-indigo-200/70 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                            {cite.confidence}% Grounded
                          </span>
                        </div>
                        <div className="text-slate-600 text-[10px] font-semibold mt-0.5">
                          {cite.chapterOrSection} {cite.pageNumber ? `(Page ${cite.pageNumber})` : ''}
                        </div>
                        <p className="text-slate-700 italic mt-1 text-[11px] border-l-2 border-indigo-400 pl-2">
                          "{cite.excerpt}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action: Escalate to Doctor button */}
              {msg.sender === 'AI_COUNSELLOR' && !msg.isEmergencyEscalation && onOpenDoctorCounselling && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">Need specific medical advice for your pregnancy?</span>
                  <button
                    onClick={onOpenDoctorCounselling}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[11px] border border-rose-200 flex items-center gap-1 transition cursor-pointer"
                  >
                    <PhoneCall className="w-3 h-3 text-rose-600" />
                    <span>5-Min Doctor Tele-Call</span>
                  </button>
                </div>
              )}
            </div>

            {/* Suggested Follow-up Questions */}
            {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                {msg.suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-900 border border-slate-200 hover:border-indigo-300 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Consulting FOGSI &amp; RCOG clinical knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask about pregnancy stages, nutrition, labour pain relief, or health concerns..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-indigo-600 outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-800 disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-1 text-center text-[10px] text-slate-400">
          Educational guidance only · Red-flag symptoms trigger immediate hospital emergency alerts
        </div>
      </div>
    </div>
  );
};
