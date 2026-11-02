import React from 'react';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  CalendarClock, 
  TestTube, 
  Users, 
  ArrowRight, 
  TrendingUp, 
  Timer, 
  FileCheck, 
  HeartHandshake,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { DashboardMetrics } from '../types';

interface DashboardProps {
  metrics: DashboardMetrics;
  onNavigate: (view: string, filter?: string) => void;
  onOpenWorklistOverdue: () => void;
  onOpenWorklistDueToday: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  onNavigate,
  onOpenWorklistOverdue,
  onOpenWorklistDueToday
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Question */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
            Daily Operational Command Centre
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">What needs attention today?</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maternal & child registry overview for <span className="font-semibold text-slate-700">District Hospital Hubballi</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('worklist')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            <span>Open Today's Worklist</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main KPI Row — Clicking 24 Overdue opens Today's Worklist (Step 2 in Demo flow) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Active Patients */}
        <div 
          onClick={() => onNavigate('patients')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Patients</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.activePatients}</p>
          <p className="text-[11px] text-slate-500 mt-1">Mothers, Pregnancies & Children</p>
        </div>

        {/* 24 OVERDUE GAPS (Critical Demo Click Target) */}
        <div 
          onClick={onOpenWorklistOverdue}
          className="bg-rose-50/80 p-4 rounded-xl border-2 border-rose-300 shadow-xs hover:border-rose-500 transition cursor-pointer relative group"
        >
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue Gaps</span>
            <AlertCircle className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold text-rose-700 mt-2">{metrics.overdueGaps}</p>
          <div className="flex items-center justify-between mt-1 text-[11px] font-semibold text-rose-700">
            <span>Requires patient contact</span>
            <span className="group-hover:translate-x-0.5 transition-transform">View →</span>
          </div>
        </div>

        {/* DUE TODAY (11) */}
        <div 
          onClick={onOpenWorklistDueToday}
          className="bg-amber-50/70 p-4 rounded-xl border border-amber-300 shadow-xs hover:border-amber-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold uppercase tracking-wider">Due Today</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-900 mt-2">{metrics.dueToday}</p>
          <p className="text-[11px] text-amber-700 mt-1">Scheduled clinic & scan visits</p>
        </div>

        {/* RESULTS AWAITING ACTION (7) */}
        <div 
          onClick={() => onNavigate('lab')}
          className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 shadow-xs hover:border-indigo-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-semibold">Results Needing Action</span>
            <TestTube className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-900 mt-2">{metrics.reportsAwaitingAction}</p>
          <p className="text-[11px] text-indigo-700 mt-1">Unclosed lab loops (e.g. HBsAg+)</p>
        </div>

        {/* CLOSED THIS WEEK (38) */}
        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-semibold">Closed This Week</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-900 mt-2">{metrics.closedThisWeek}</p>
          <div className="flex items-center justify-between text-[11px] text-emerald-700 mt-1">
            <span>Closed Today: <strong className="font-bold text-emerald-900">{metrics.closedToday}</strong></span>
            <span>{metrics.closurePercentage}% closure</span>
          </div>
        </div>
      </div>

      {/* The 4 Core Prototype KPIs Section (Section 31) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              Core Prototype Operational Measures (KPIs)
            </h2>
            <p className="text-xs text-slate-500">
              Operational speed, safety closure, and completeness metrics — not clinical outcome scores.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 self-start">
            Audit-Verified Operational Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Care-gap Closure */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Care-Gap Closure</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{metrics.closurePercentage}%</span>
              <span className="text-[11px] text-emerald-700 font-medium">Overdue closed in &lt; 2 wks</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
              <div 
                className="bg-teal-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${metrics.closurePercentage}%` }} 
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Loop only closes on recorded action/result, not on phone call.
            </p>
          </div>

          {/* KPI 2: Staff Time to Compile Worklist */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
              <Timer className="w-4 h-4 text-blue-600" />
              <span>Time to Compile Worklist</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-teal-700">2 mins</span>
              <span className="text-xs text-slate-400 line-through">180 mins manual</span>
            </div>
            <p className="text-[11px] text-teal-900 font-medium mt-1">
              98% reduction in nursing compilation hours
            </p>
            <p className="text-[10px] text-slate-500 mt-2">
              Replaces manual register cross-referencing every morning.
            </p>
          </div>

          {/* KPI 3: Result Loop Completion */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
              <TestTube className="w-4 h-4 text-purple-600" />
              <span>Result-Loop Completion</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{metrics.resultLoopCompletionRate}%</span>
              <span className="text-[11px] text-purple-700 font-medium">Acted on & closed</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${metrics.resultLoopCompletionRate}%` }} 
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Samples sent → report returned → clinician action recorded.
            </p>
          </div>

          {/* KPI 4: Record Completeness */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Record Completeness</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{metrics.recordCompletenessRate}%</span>
              <span className="text-[11px] text-emerald-700 font-medium">ABHA-linked at delivery</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${metrics.recordCompletenessRate}%` }} 
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Unified thread: Mother → Pregnancy → Baby linked ABHA.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Today's Action Items & Laboratory Result Loop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Immediate Care-Gap Operational Focus */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Key Care Gaps Requiring Contact</h3>
              </div>
              <button 
                onClick={onOpenWorklistOverdue}
                className="text-xs text-teal-700 font-semibold hover:underline"
              >
                View all 24 overdue →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Sunita D. item */}
              <div 
                onClick={onOpenWorklistOverdue}
                className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">Sunita D.</span>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-medium">Pregnancy 28 wks</span>
                  </div>
                  <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Overdue +3 wks
                  </span>
                </div>
                <p className="text-xs font-semibold text-rose-900 mt-1">Glucose test not done (OGTT 75g)</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Expected between 24–28 weeks. Patient is currently 31 weeks.
                </p>
              </div>

              {/* Meena R. item */}
              <div 
                onClick={onOpenWorklistOverdue}
                className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">Meena R.</span>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-medium">Pregnancy 23 wks</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Overdue +1 wk
                  </span>
                </div>
                <p className="text-xs font-semibold text-amber-900 mt-1">Anomaly scan not recorded (TIFFA)</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Expected window 18–22 weeks. Patient is currently 23 weeks.
                </p>
              </div>

              {/* Anjali P. item */}
              <div 
                onClick={onOpenWorklistOverdue}
                className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">Anjali P.</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-medium">Rh-Negative</span>
                  </div>
                  <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Overdue +5 wks
                  </span>
                </div>
                <p className="text-xs font-semibold text-rose-900 mt-1">No antibody screen recorded</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Indirect Coombs Test required before Anti-D prophylaxis window closes.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary operational question answered every morning.</span>
            <button 
              onClick={() => onNavigate('worklist')}
              className="text-teal-700 font-bold hover:underline"
            >
              Open Worklist →
            </button>
          </div>
        </div>

        {/* Right: Unclosed Laboratory Loop Tracking */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Laboratory Result Loop Status</h3>
              </div>
              <button 
                onClick={() => onNavigate('lab')}
                className="text-xs text-teal-700 font-semibold hover:underline"
              >
                View all samples →
              </button>
            </div>

            {/* Loop Flow Diagram */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Result Loop Stages</p>
              <div className="flex items-center justify-between text-center text-xs">
                <div className="flex flex-col items-center">
                  <span className="text-slate-900 font-bold">{metrics.samplesSent}</span>
                  <span className="text-[10px] text-slate-500">Sent</span>
                </div>
                <span className="text-slate-300 font-bold">→</span>
                <div className="flex flex-col items-center">
                  <span className="text-slate-900 font-bold">{metrics.reportsReceived}</span>
                  <span className="text-[10px] text-slate-500">Received</span>
                </div>
                <span className="text-slate-300 font-bold">→</span>
                <div className="flex flex-col items-center">
                  <span className="text-indigo-700 font-bold">{metrics.reportsAwaitingAction}</span>
                  <span className="text-[10px] text-indigo-700 font-semibold">Action Due</span>
                </div>
                <span className="text-slate-300 font-bold">→</span>
                <div className="flex flex-col items-center">
                  <span className="text-emerald-700 font-bold">{metrics.reportsWithActionRecorded}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Closed</span>
                </div>
              </div>
            </div>

            {/* Urgent Lab Alert Item */}
            <div className="mt-3.5 space-y-2.5">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">Deepa K. (SMP-2026-0891)</span>
                  <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                    HBsAg POSITIVE
                  </span>
                </div>
                <p className="text-xs text-rose-800 font-medium mt-1">
                  Report arrived after OPD discharge. Newborn HBIG birth dose coordination pending.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-rose-600 font-medium">Specimen: Maternal Serology</span>
                  <button 
                    onClick={() => onNavigate('lab')}
                    className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-semibold rounded cursor-pointer"
                  >
                    Record Clinical Action
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Laxmi G. (SMP-2026-0895)</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    OGTT Elevated (168 mg/dL)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Gestational diabetes detected. Dietary counseling & MCH follow-up required.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Result loop only closes when clinician action is recorded.</span>
            <button 
              onClick={() => onNavigate('lab')}
              className="text-teal-700 font-bold hover:underline"
            >
              Go to Lab Desk →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
