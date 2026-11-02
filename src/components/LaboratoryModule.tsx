import React, { useState } from 'react';
import { 
  TestTubes, 
  TestTube, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  ShieldAlert, 
  Filter, 
  Search,
  Plus,
  Sparkles
} from 'lucide-react';
import { LaboratorySample } from '../types';
import { store } from '../services/store';

interface LaboratoryModuleProps {
  onViewPatientProfile: (patientId: string) => void;
}

export const LaboratoryModule: React.FC<LaboratoryModuleProps> = ({ onViewPatientProfile }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_action' | 'pending_report' | 'closed'>('pending_action');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSampleForAction, setSelectedSampleForAction] = useState<LaboratorySample | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const samples = store.labSamples.filter(s => {
    if (filterStatus === 'pending_action' && s.closureStatus !== 'PENDING_ACTION') return false;
    if (filterStatus === 'pending_report' && s.closureStatus !== 'PENDING_REPORT') return false;
    if (filterStatus === 'closed' && s.closureStatus !== 'LOOP_CLOSED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (s.patientName || '').toLowerCase().includes(q) ||
        (s.sampleId || '').toLowerCase().includes(q) ||
        (s.testName || '').toLowerCase().includes(q) ||
        (s.resultSummary && s.resultSummary.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleRecordAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSampleForAction) return;

    setIsSubmittingAction(true);
    setTimeout(() => {
      store.recordLabAction({
        sampleId: selectedSampleForAction.id,
        actionDetails: actionNotes,
        recordedBy: store.currentUser.name
      });

      setIsSubmittingAction(false);
      setSelectedSampleForAction(null);
      setActionNotes('');
    }, 500);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Laboratory / Result Loop</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explicit tracking: Sample sent → Report received → Report reviewed → Action recorded → Loop closed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg border border-amber-300">
            {store.labSamples.filter(s => s.closureStatus === 'PENDING_ACTION').length} Results Awaiting Action
          </span>
        </div>
      </div>

      {/* Result Loop Architecture Deck Banner */}
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-indigo-900">
            <TestTubes className="w-4 h-4 text-indigo-700" />
            <span>Post-Discharge Result Safeguard</span>
          </div>
          <p className="text-indigo-800 text-[11px] leading-relaxed">
            Catches critical situations where laboratory and screening results arrive after OPD consultation or delivery discharge. Results with abnormal findings remain open until explicit clinician action is recorded.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Result Loop Filter:</span>
          {[
            { id: 'pending_action', label: 'Awaiting Action', count: store.labSamples.filter(s => s.closureStatus === 'PENDING_ACTION').length, color: 'bg-rose-100 text-rose-800' },
            { id: 'pending_report', label: 'Pending Report in Lab', count: store.labSamples.filter(s => s.closureStatus === 'PENDING_REPORT').length, color: 'bg-slate-200 text-slate-700' },
            { id: 'closed', label: 'Loop Closed & Acted On', count: store.labSamples.filter(s => s.closureStatus === 'LOOP_CLOSED').length, color: 'bg-emerald-100 text-emerald-800' },
            { id: 'all', label: 'All Samples', count: store.labSamples.length }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilterStatus(btn.id as any)}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                filterStatus === btn.id
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{btn.label}</span>
              {btn.count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${filterStatus === btn.id ? 'bg-white/20 text-white' : btn.color || 'bg-slate-200 text-slate-700'}`}>
                  {btn.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specimen or test..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* Lab Samples Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Sample ID & Date</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Investigation / Test</th>
                <th className="py-3 px-4">Diagnostic Result</th>
                <th className="py-3 px-3">Loop Status</th>
                <th className="py-3 px-4 text-right">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {samples.map(s => (
                <tr key={s.id} className={`hover:bg-slate-50/80 transition-colors ${s.isAbnormal ? 'bg-rose-50/20' : ''}`}>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-slate-900 block">{s.sampleId}</span>
                    <span className="text-[10px] text-slate-400">{s.collectionDate}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => s.patientId && onViewPatientProfile(s.patientId)}
                      className="font-bold text-teal-900 hover:underline cursor-pointer block text-left"
                    >
                      {s.patientName}
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">{s.patientAbha}</span>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-900">
                    <span>{s.testName}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">{s.testCategory}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    {s.resultSummary ? (
                      <div>
                        <span className={`font-bold ${s.isAbnormal ? 'text-rose-700 font-extrabold' : 'text-slate-800'}`}>
                          {s.resultSummary}
                        </span>
                        {s.actionRequiredDetails && (
                          <p className="text-[11px] text-rose-800 mt-0.5 leading-snug font-medium">
                            {s.actionRequiredDetails}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Sample in transit / processing</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    {s.closureStatus === 'PENDING_ACTION' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Action Required</span>
                      </span>
                    ) : s.closureStatus === 'PENDING_REPORT' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Pending Report</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Loop Closed</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {s.closureStatus === 'PENDING_ACTION' ? (
                      <button
                        onClick={() => {
                          setSelectedSampleForAction(s);
                          setActionNotes(s.actionRequiredDetails ? `Action Taken: ${s.actionRequiredDetails}` : 'Reviewed and action initiated.');
                        }}
                        className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded shadow-xs text-xs cursor-pointer"
                      >
                        Record Action & Close
                      </button>
                    ) : s.actionRecorded ? (
                      <div className="text-[11px] text-slate-500">
                        <span className="text-emerald-700 font-semibold block">Action Recorded</span>
                        <span>{s.actionRecordedBy}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Action Modal */}
      {selectedSampleForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden p-5 text-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span>Record Action Against Laboratory Report</span>
            </h3>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <p className="font-bold text-rose-900">{selectedSampleForAction.patientName} • {selectedSampleForAction.testName}</p>
              <p className="text-xs font-semibold text-rose-800 mt-1">{selectedSampleForAction.resultSummary}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{selectedSampleForAction.actionRequiredDetails}</p>
            </div>

            <form onSubmit={handleRecordAction} className="space-y-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Clinical Action Recorded Details:
                </label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white"
                  placeholder="e.g. Prescribed treatment, scheduled neonatal HBIG dose at delivery, coordinated OPD visit..."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSampleForAction(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingAction}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  {isSubmittingAction ? 'Closing Result Loop...' : 'Confirm Action & Close Result Loop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
