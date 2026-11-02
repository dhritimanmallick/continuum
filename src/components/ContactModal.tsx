import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Phone, 
  Languages, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Info,
  Sparkles
} from 'lucide-react';
import { CareGap, PatientCommunication } from '../types';
import { store } from '../services/store';

interface ContactModalProps {
  careGap: CareGap;
  onClose: () => void;
  onMessageLogged: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  careGap,
  onClose,
  onMessageLogged
}) => {
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [patientResponse, setPatientResponse] = useState<PatientCommunication['patientResponse']>('CONTACTED');
  const [customNotes, setCustomNotes] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Facility info
  const facilityName = store.currentFacility.name;
  const facilityContact = '+91 836 2233445 (OPD Helpdesk)';

  // Build default message text based on language
  const getTemplateText = (lang: string) => {
    switch (lang) {
      case 'Hindi':
        return `नमस्ते ${careGap.patientName}, यह ${facilityName} से संदेश है। हमारे रिकॉर्ड के अनुसार आपका ${careGap.gapTitle} (${careGap.expectedWindowDisplay}) ${careGap.overdueDurationDisplay} से लंबित है। कृपया आवश्यक जांच और स्वास्थ्य परामर्श हेतु प्रसवपूर्व ओपीडी, कमरा 12 में सुबह 9 से दोपहर 1 बजे के बीच पधारें। संपर्क: ${facilityContact}।`;
      case 'Kannada':
        return `ನಮಸ್ಕಾರ ${careGap.patientName}, ಇದು ${facilityName} ಆಸ್ಪತ್ರೆಯ ಸಂದೇಶ. ನಿಮ್ಮ ${careGap.gapTitle} (${careGap.expectedWindowDisplay}) ${careGap.overdueDurationDisplay} ತಡವಾಗಿದೆ. ದಯವಿಟ್ಟು ಬೆಳಿಗ್ಗೆ 9 ರಿಂದ ಮಧ್ಯಾಹ್ನ 1 ರವರೆಗೆ ಕೊಠಡಿ 12 ರ ಗರ್ಭಿಣಿ ಒಪಿಡಿಗೆ ಭೇಟಿ ನೀಡಿ. ಸಂಪರ್ಕಿಸಿ: ${facilityContact}.`;
      case 'Tamil':
        return `வணக்கம் ${careGap.patientName}, இது ${facilityName}. உங்கள் ${careGap.gapTitle} (${careGap.expectedWindowDisplay}) ${careGap.overdueDurationDisplay} நிலுவையில் உள்ளது. தயவுசெய்து அறை 12 மகப்பேறு வெளிநோயாளர் பிரிவுக்கு வரவும். தொடர்பு: ${facilityContact}.`;
      case 'Marathi':
        return `नमस्कार ${careGap.patientName}, हे ${facilityName} कडून संदेश आहे. आपल्या नोंदीनुसार आपली ${careGap.gapTitle} तपासणी (${careGap.expectedWindowDisplay}) ${careGap.overdueDurationDisplay} थकीत आहे. कृपया ओपीडी कक्ष 12 ला सकाळी 9 ते 1 दरम्यान भेट द्या. संपर्क: ${facilityContact}।`;
      default:
        return `Hello ${careGap.patientName}, this is ${facilityName}. Our records show that your ${careGap.gapTitle} (${careGap.expectedWindowDisplay}) is overdue by ${careGap.overdueDurationDisplay}. Please visit Room 12, Antenatal OPD between 9 AM and 1 PM for testing. Timely screening ensures safe pregnancy care. Contact us: ${facilityContact}.`;
    }
  };

  const [messageBody, setMessageBody] = useState(getTemplateText('English'));

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setMessageBody(getTemplateText(lang));
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      store.logContact({
        careGapId: careGap.id,
        channel,
        templateId: `TMPL-${selectedLanguage.slice(0, 2).toUpperCase()}-${careGap.ruleId}`,
        language: selectedLanguage,
        messageBody,
        patientResponse,
        notes: customNotes
      });

      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        onMessageLogged();
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Contact Patient</h2>
              <p className="text-xs text-slate-300">
                {careGap.patientName} • {careGap.patientMobile}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Critical Safety Notice (Section 16) */}
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Care-Gap Policy:</strong> A care gap is <em>not</em> closed simply because a patient was contacted. It closes only when the required clinical action/visit/result is recorded.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Target Gap Summary */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-semibold text-slate-900">{careGap.gapTitle}</span>
              <span className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                {careGap.overdueDurationDisplay}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{careGap.plainReason}</p>
          </div>

          {/* Channel Selector */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5 uppercase tracking-wider text-[10px]">
              Communication Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 font-semibold transition cursor-pointer ${
                  channel === 'whatsapp'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Notification</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('sms')}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 font-semibold transition cursor-pointer ${
                  channel === 'sms'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>SMS Fallback</span>
              </button>
            </div>
          </div>

          {/* Local Language Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-slate-500" />
                <span>Local Language Template</span>
              </label>
              <span className="text-[10px] text-slate-500">Configurable facility languages</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['English', 'Kannada', 'Hindi', 'Marathi', 'Tamil'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-teal-700 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Editable Message Box */}
          <div>
            <label className="font-bold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
              Pre-Populated Message Body
            </label>
            <textarea
              rows={4}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 font-sans leading-relaxed text-slate-800"
            />
          </div>

          {/* Patient Response Recording (Section 19) */}
          <div>
            <label className="font-bold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
              Patient Response / Call Outcome
            </label>
            <select
              value={patientResponse}
              onChange={(e) => setPatientResponse(e.target.value as any)}
              className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="CONTACTED">Patient contacted (notification dispatched)</option>
              <option value="CONFIRMED_VISIT">Patient confirmed upcoming visit</option>
              <option value="ALREADY_COMPLETED_ELSEWHERE">Patient already completed test elsewhere</option>
              <option value="RESCHEDULED">Patient requested rescheduling</option>
              <option value="DECLINED">Patient declined visit</option>
              <option value="UNABLE_TO_CONTACT">Unable to reach / Phone switched off</option>
              <option value="WRONG_NUMBER">Wrong telephone number recorded</option>
            </select>
          </div>

          {/* Staff notes */}
          <div>
            <label className="font-bold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
              Internal Staff Note (Optional)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Mother stated husband will accompany next Tuesday morning"
              className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || sentSuccess}
            className={`px-5 py-2.5 rounded-lg text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer ${
              sentSuccess
                ? 'bg-emerald-600'
                : 'bg-teal-700 hover:bg-teal-800'
            }`}
          >
            {sentSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Message Dispatched & Logged!</span>
              </>
            ) : isSending ? (
              <span>Dispatching...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send via {channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} & Log</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
