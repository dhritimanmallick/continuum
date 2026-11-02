import React from 'react';
import { 
  MessageSquare, 
  Phone, 
  Clock, 
  CheckCircle2, 
  User, 
  ArrowRight 
} from 'lucide-react';
import { store } from '../services/store';

export const MessagesView: React.FC = () => {
  const comms = store.communications;

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Outreach & Communications Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dispatched WhatsApp notifications and SMS fallback records ({comms.length} messages logged).
          </p>
        </div>
      </div>

      {comms.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-2 text-xs text-slate-400">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-600">No patient messages dispatched yet today.</p>
          <p>Click &ldquo;Contact&rdquo; on any care gap in Today&apos;s Worklist to dispatch a multilingual WhatsApp notification.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comms.map(comm => (
            <div key={comm.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${comm.channel === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                    {comm.channel === 'whatsapp' ? <MessageSquare className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{comm.patientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">{comm.mobile}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-bold">
                    {comm.language}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {comm.deliveryStatus}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-sans">
                &ldquo;{comm.messageBody}&rdquo;
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Outcome: <strong className="text-slate-800">{comm.patientResponse?.replace('_', ' ')}</strong></span>
                <span>Dispatched by <strong>{comm.staffUserName}</strong> at {(comm.sentAt || '').replace('T', ' ').slice(0, 16)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
