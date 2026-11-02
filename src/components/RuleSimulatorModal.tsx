import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { runRuleSimulation, SimulationResultItem } from '../services/rulesEngine';
import { store } from '../services/store';

interface RuleSimulatorModalProps {
  onClose: () => void;
}

export const RuleSimulatorModal: React.FC<RuleSimulatorModalProps> = ({ onClose }) => {
  const [patientType, setPatientType] = useState<'pregnancy' | 'child'>('pregnancy');
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState<number>(31); // Seed Sunita default
  const [childAgeWeeks, setChildAgeWeeks] = useState<number>(12); // Seed Baby of Rekha default
  const [selectedFlags, setSelectedFlags] = useState<string[]>(['Previous LSCS']);
  const [recordedMilestones, setRecordedMilestones] = useState<string[]>(['A1', 'F1']); // Enrolment & dating scan completed
  const [simulationResults, setSimulationResults] = useState<SimulationResultItem[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const availableFlags = [
    'Rh negative',
    'pregnancy flagged small',
    'GDM suspect',
    'Previous LSCS',
    'Chronic hypertension'
  ];

  const handleToggleFlag = (flag: string) => {
    if (selectedFlags.includes(flag)) {
      setSelectedFlags(selectedFlags.filter(f => f !== flag));
    } else {
      setSelectedFlags([...selectedFlags, flag]);
    }
  };

  const handleToggleMilestone = (ruleId: string) => {
    if (recordedMilestones.includes(ruleId)) {
      setRecordedMilestones(recordedMilestones.filter(id => id !== ruleId));
    } else {
      setRecordedMilestones([...recordedMilestones, ruleId]);
    }
  };

  const handleSimulate = () => {
    const results = runRuleSimulation({
      patientType,
      gestationalAgeWeeks: patientType === 'pregnancy' ? gestationalAgeWeeks : undefined,
      childAgeWeeks: patientType === 'child' ? childAgeWeeks : undefined,
      flags: selectedFlags,
      recordedMilestones
    }, store.rules);

    setSimulationResults(results);
    setHasRun(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-600 rounded-lg text-white">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Care-Gap Rule Simulator</span>
                <span className="text-[10px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded font-mono">
                  Clinician & Developer Portal
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Simulate and test the configuration-driven 28 rules against synthetic clinical inputs in real time.
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

        {/* Informational deck rule */}
        <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700 shrink-0">
          <span>&ldquo;The rules are configuration, not hard-coded UI logic.&rdquo;</span>
          <span className="font-semibold text-teal-800">28 Active Protocol Rules Loaded</span>
        </div>

        {/* Simulator Grid (Inputs Left, Outputs Right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Inputs Column */}
          <div className="md:col-span-5 p-5 border-r border-slate-200 overflow-y-auto space-y-4 bg-slate-50 text-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              1. Simulation Inputs
            </h3>

            {/* Population Type */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Population Episode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPatientType('pregnancy')}
                  className={`py-2 px-3 rounded-lg border font-semibold text-center cursor-pointer ${
                    patientType === 'pregnancy'
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Pregnancy Episode
                </button>
                <button
                  type="button"
                  onClick={() => setPatientType('child')}
                  className={`py-2 px-3 rounded-lg border font-semibold text-center cursor-pointer ${
                    patientType === 'child'
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Child Episode
                </button>
              </div>
            </div>

            {/* Gestational Age / Child Age Slider */}
            {patientType === 'pregnancy' ? (
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Current Gestational Age</label>
                  <span className="font-extrabold text-teal-800 text-sm">{gestationalAgeWeeks} Weeks</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="42"
                  value={gestationalAgeWeeks}
                  onChange={(e) => setGestationalAgeWeeks(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Booking (6w)</span>
                  <span>Anomaly (20w)</span>
                  <span>Glucose (28w)</span>
                  <span>Term (37w)</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Current Child Age</label>
                  <span className="font-extrabold text-teal-800 text-sm">{childAgeWeeks} Weeks</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="52"
                  value={childAgeWeeks}
                  onChange={(e) => setChildAgeWeeks(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Birth (0w)</span>
                  <span>Penta-1 (6w)</span>
                  <span>Penta-2 (10w)</span>
                  <span>MR-1 (9mo/39w)</span>
                </div>
              </div>
            )}

            {/* Clinician Flags */}
            {patientType === 'pregnancy' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Clinician Recorded Flags
                </label>
                <div className="space-y-1.5">
                  {availableFlags.map(flag => (
                    <label key={flag} className="flex items-center gap-2 p-1.5 rounded hover:bg-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFlags.includes(flag)}
                        onChange={() => handleToggleFlag(flag)}
                        className="rounded text-teal-700 accent-teal-700 cursor-pointer"
                      />
                      <span className="text-slate-800 font-medium">{flag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Recorded Action / Completed Milestones */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Already Recorded Milestones (Simulate Closed Loops)
              </label>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 max-h-36 overflow-y-auto space-y-1">
                {store.rules
                  .filter(r => patientType === 'pregnancy' ? (r.category === 'antenatal' || r.category === 'foetal') : (r.category === 'child' || r.category === 'newborn'))
                  .map(rule => (
                    <label key={rule.rule_id} className="flex items-center gap-2 text-[11px] p-1 rounded hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={recordedMilestones.includes(rule.rule_id)}
                        onChange={() => handleToggleMilestone(rule.rule_id)}
                        className="accent-teal-700"
                      />
                      <span className="font-mono text-slate-500">{rule.rule_id}</span>
                      <span className="truncate">{rule.name}</span>
                    </label>
                  ))}
              </div>
            </div>

            {/* Run Button */}
            <button
              type="button"
              onClick={handleSimulate}
              className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Play className="w-4 h-4" />
              <span>Evaluate Against Rules Engine</span>
            </button>
          </div>

          {/* Outputs Column */}
          <div className="md:col-span-7 p-5 overflow-y-auto space-y-3 bg-white text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                2. Engine Evaluation Output
              </h3>
              {hasRun && (
                <span className="text-xs text-slate-500">
                  {simulationResults.length} Milestones Evaluated
                </span>
              )}
            </div>

            {!hasRun ? (
              <div className="py-20 text-center text-slate-400 space-y-2">
                <Sliders className="w-8 h-8 mx-auto text-slate-300" />
                <p>Adjust inputs on the left and click &ldquo;Evaluate Against Rules Engine&rdquo; to test care-gap determinations.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {simulationResults.map(item => (
                  <div 
                    key={item.ruleId} 
                    className={`p-3.5 rounded-xl border transition-colors ${
                      item.status === 'OVERDUE'
                        ? 'border-rose-300 bg-rose-50/50'
                        : item.status === 'DUE'
                        ? 'border-amber-300 bg-amber-50/50'
                        : item.status === 'COMPLETED'
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.ruleName}</span>
                        <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                          {item.ruleId}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.status === 'OVERDUE'
                          ? 'bg-rose-200 text-rose-900'
                          : item.status === 'DUE'
                          ? 'bg-amber-200 text-amber-900'
                          : item.status === 'COMPLETED'
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.status} ({item.overdueDuration})
                      </span>
                    </div>

                    {/* Plain Language Reason */}
                    <p className="text-slate-800 text-xs font-semibold mt-1.5 bg-white/80 p-2 rounded border border-slate-200/60">
                      {item.plainReason}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Window: <strong>{item.expectedWindow}</strong></span>
                      <span>Closure action: <strong className="font-mono">{item.requiredAction}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
