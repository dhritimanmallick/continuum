import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Timer, 
  FileCheck, 
  TestTube, 
  ShieldCheck, 
  Users,
  Download
} from 'lucide-react';
import { store } from '../services/store';

export const ReportsView: React.FC = () => {
  const metrics = store.getDashboardMetrics();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & Operational Measures</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tier-2 hospital registry metrics, result-loop monitoring, and staff workloads.
          </p>
        </div>

        <button 
          onClick={() => alert('Operational KPI summary exported.')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export KPI Summary</span>
        </button>
      </div>

      {/* The 4 Prototype Core Measures (Section 31) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">KPI 1: Safety Closure</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mt-1">Care-Gap Closure</h3>
          <p className="text-3xl font-extrabold text-teal-700 mt-2">{metrics.closurePercentage}%</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Share of overdue milestones closed within two weeks.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Target: &gt; 85%</span>
            <span className="text-emerald-700 font-bold">On Target</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">KPI 2: Operational Efficiency</span>
            <Timer className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mt-1">Time to Compile Worklist</h3>
          <p className="text-3xl font-extrabold text-blue-700 mt-2">2 mins</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Staff time required every morning vs 180 min manual compilation.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Previous: 3 Hours</span>
            <span className="text-emerald-700 font-bold">98% Time Saved</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">KPI 3: Clinical Safety</span>
            <TestTube className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mt-1">Result-Loop Completion</h3>
          <p className="text-3xl font-extrabold text-purple-700 mt-2">{metrics.resultLoopCompletionRate}%</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Samples sent whose report is returned and acted on.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Target: &gt; 90%</span>
            <span className="text-purple-700 font-bold">Monitored</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">KPI 4: Digital Health</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mt-1">Record Completeness</h3>
          <p className="text-3xl font-extrabold text-emerald-700 mt-2">{metrics.recordCompletenessRate}%</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Women with complete ABHA-linked record at delivery.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Target: &gt; 90%</span>
            <span className="text-emerald-700 font-bold">Compliant</span>
          </div>
        </div>
      </div>

      {/* Operational Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Gaps by Category */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-700" />
            <span>Care Gaps Distribution by Clinical Category</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { label: 'Antenatal Screenings (Blood, Glucose, Td)', count: 12, pct: 50, color: 'bg-teal-600' },
              { label: 'Foetal Ultrasounds (Anomaly, Dating, Growth)', count: 6, pct: 25, color: 'bg-purple-600' },
              { label: 'Child Immunisation (Penta, OPV, MR-1)', count: 4, pct: 16, color: 'bg-blue-600' },
              { label: 'Postnatal & Newborn Follow-up', count: 2, pct: 9, color: 'bg-amber-600' }
            ].map(row => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-800">
                  <span>{row.label}</span>
                  <span>{row.count} gaps ({row.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Workload Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-700" />
            <span>Staff Workload Allocation (Tier-2 MCH Desk)</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Sister Savitha K.</p>
                <p className="text-[11px] text-slate-500">Antenatal Nursing Station</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 block">14 assigned gaps</span>
                <span className="text-emerald-700 text-[11px] font-semibold">18 closed this week</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Pooja Naik</p>
                <p className="text-[11px] text-slate-500">MCH Registry / OPD Reception</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 block">10 assigned gaps</span>
                <span className="text-emerald-700 text-[11px] font-semibold">20 closed this week</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Dr. Anita Rao</p>
                <p className="text-[11px] text-slate-500">Clinical Lead / Senior Specialist</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-indigo-700 block">7 lab reviews pending</span>
                <span className="text-slate-400 text-[11px]">Rule oversight</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
