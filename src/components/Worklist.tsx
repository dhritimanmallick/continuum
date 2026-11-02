import React, { useState } from 'react';
import { 
  AlertCircle, 
  MessageSquare, 
  CheckCircle2, 
  Filter, 
  Search, 
  UserCheck, 
  Eye, 
  ChevronRight, 
  Clock, 
  Phone, 
  AlertTriangle,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CareGap, CareGapStatus } from '../types';

interface WorklistProps {
  careGaps: CareGap[];
  initialFilter?: string;
  onContactPatient: (gap: CareGap) => void;
  onRecordAction: (gap: CareGap) => void;
  onViewPatientProfile: (patientId: string) => void;
  onWaiveGap: (gap: CareGap) => void;
}

export const Worklist: React.FC<WorklistProps> = ({
  careGaps,
  initialFilter = 'all',
  onContactPatient,
  onRecordAction,
  onViewPatientProfile,
  onWaiveGap
}) => {
  const [selectedPopulation, setSelectedPopulation] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilter === 'due_today' ? 'due_today' : initialFilter === 'overdue' ? 'overdue' : 'all');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'assigned_me' | 'unassigned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGapId, setExpandedGapId] = useState<string | null>('GAP-001'); // Sunita D. expanded by default for easy demo

  // Filter calculations
  const filteredGaps = careGaps.filter(gap => {
    // Population filter
    if (selectedPopulation !== 'all') {
      if (selectedPopulation === 'laboratory' && gap.category !== 'laboratory') return false;
      if (selectedPopulation !== 'laboratory' && gap.population !== selectedPopulation) return false;
    }

    // Status filter
    if (selectedStatus === 'overdue' && gap.status !== 'OVERDUE') return false;
    if (selectedStatus === 'due_today' && !(gap.status === 'DUE' && gap.overdueDurationDisplay === 'Today')) return false;
    if (selectedStatus === 'due_soon' && !(gap.status === 'DUE' && gap.overdueDurationDisplay !== 'Today')) return false;
    if (selectedStatus === 'closed' && gap.status !== 'CLOSED') return false;

    // Assignment filter
    if (assignmentFilter === 'assigned_me' && !gap.assignedTo?.includes('Savitha') && !gap.assignedTo?.includes('Pooja')) return false;
    if (assignmentFilter === 'unassigned' && gap.assignedTo) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        gap.patientName.toLowerCase().includes(q) ||
        gap.patientAbha.toLowerCase().includes(q) ||
        gap.gapTitle.toLowerCase().includes(q) ||
        gap.ruleId.toLowerCase().includes(q) ||
        gap.plainReason.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const getStatusBadge = (status: CareGapStatus, duration: string) => {
    switch (status) {
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Overdue ({duration})</span>
          </span>
        );
      case 'DUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Due {duration === 'Today' ? 'Today' : duration}</span>
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Phone className="w-3 h-3 text-blue-600" />
            <span>Contacted</span>
          </span>
        );
      case 'ACTION_RECORDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <CheckCircle2 className="w-3 h-3 text-purple-600" />
            <span>Action Recorded</span>
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Closed</span>
          </span>
        );
      case 'WAIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span>Waived</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
            Not Due
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Primary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Today&apos;s Worklist</h1>
          <p className="text-xs font-semibold text-teal-800 mt-0.5">
            Who is overdue, for what and why.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
            Showing <strong className="text-slate-900 font-bold">{filteredGaps.length}</strong> items of {careGaps.length}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Population Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Population:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'mother', label: 'Mother' },
            { id: 'pregnancy', label: 'Pregnancy' },
            { id: 'foetus', label: 'Foetus' },
            { id: 'newborn', label: 'Newborn' },
            { id: 'child', label: 'Child' },
            { id: 'laboratory', label: 'Laboratory' },
          ].map(pop => (
            <button
              key={pop.id}
              onClick={() => setSelectedPopulation(pop.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                selectedPopulation === pop.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pop.label}
            </button>
          ))}
        </div>

        {/* Status Filter Buttons & Assignment */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'overdue', label: 'Overdue Only', count: careGaps.filter(g => g.status === 'OVERDUE').length, color: 'text-rose-700' },
              { id: 'due_today', label: 'Due Today', count: careGaps.filter(g => g.status === 'DUE' && g.overdueDurationDisplay === 'Today').length, color: 'text-amber-800' },
              { id: 'due_soon', label: 'Due Soon' },
              { id: 'closed', label: 'Closed' }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                  selectedStatus === st.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{st.label}</span>
                {st.count !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${selectedStatus === st.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'}`}>
                    {st.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quick search input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search worklist..."
              className="w-full pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Main Worklist Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-3">Gestation/Age</th>
                <th className="py-3 px-4">Care Gap</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Overdue</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredGaps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No care gaps match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredGaps.map((gap) => {
                  const isExpanded = expandedGapId === gap.id;
                  const isSunita = gap.patientName === 'Sunita D.';

                  return (
                    <React.Fragment key={gap.id}>
                      <tr 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSunita ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        {/* Patient Name & ABHA */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedGapId(isExpanded ? null : gap.id)}
                              className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                              title="Toggle plain-language explanation"
                            >
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                            <div>
                              <button
                                onClick={() => gap.patientId && onViewPatientProfile(gap.patientId)}
                                className="font-bold text-teal-900 hover:underline cursor-pointer text-left block"
                              >
                                {gap.patientName}
                              </button>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {gap.patientAbha}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Stage */}
                        <td className="py-3.5 px-3">
                          <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {gap.population}
                          </span>
                        </td>

                        {/* Gestation / Age */}
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          {gap.gestationOrAgeDisplay}
                        </td>

                        {/* Gap Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{gap.gapTitle}</span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 rounded">
                              {gap.ruleId}
                            </span>
                          </div>
                          {/* Brief preview of window */}
                          <span className="text-[11px] text-slate-500 block">
                            Expected: {gap.expectedWindowDisplay}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          {getStatusBadge(gap.status, gap.overdueDurationDisplay || '')}
                        </td>

                        {/* Overdue Duration */}
                        <td className="py-3.5 px-3 font-bold">
                          {gap.status === 'OVERDUE' ? (
                            <span className="text-rose-700 font-extrabold">{gap.overdueDurationDisplay}</span>
                          ) : gap.status === 'DUE' ? (
                            <span className="text-amber-800 font-bold">{gap.overdueDurationDisplay}</span>
                          ) : (
                            <span className="text-slate-400 font-normal">{gap.overdueDurationDisplay}</span>
                          )}
                        </td>

                        {/* Actions (Contact, Record Action, View) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {gap.status !== 'CLOSED' && gap.status !== 'WAIVED' && (
                              <>
                                {/* Step 5: Contact Button */}
                                <button
                                  onClick={() => onContactPatient(gap)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded shadow-xs transition cursor-pointer"
                                  title="Contact Patient via WhatsApp or SMS"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>Contact</span>
                                </button>

                                {/* Step 8-10: Record Action / Close Loop */}
                                <button
                                  onClick={() => onRecordAction(gap)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 text-xs font-semibold rounded transition cursor-pointer"
                                  title="Record visit, test, scan to formally close care gap"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                                  <span>Record Action</span>
                                </button>
                              </>
                            )}

                            {/* View Details */}
                            <button
                              onClick={() => gap.patientId && onViewPatientProfile(gap.patientId)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition cursor-pointer"
                              title="View Patient Profile & Timeline"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* CRITICAL UI RULE (Section 5): Expanded Plain-Language Reason */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={7} className="px-6 py-3.5">
                            <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-slate-900">
                                  <Info className="w-4 h-4 text-teal-700" />
                                  <span>Plain-Language Reason (Assistive Explanation)</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Rule ID: {gap.ruleId} • Target Closure Action: {gap.requiredAction}
                                </span>
                              </div>

                              {/* Plain language text */}
                              <p className="text-slate-800 text-xs leading-relaxed font-semibold bg-amber-50/50 p-2.5 rounded border border-amber-200/60">
                                &ldquo;{gap.plainReason}&rdquo;
                              </p>

                              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                                <div className="flex items-center gap-4">
                                  <span>Assigned: <strong>{gap.assignedTo || 'Unassigned'}</strong></span>
                                  {gap.lastContactedAt && (
                                    <span>Last Contact: <strong>{gap.lastContactedAt.slice(0, 10)} via {(gap.lastContactChannel || 'whatsapp').toUpperCase()}</strong></span>
                                  )}
                                  {gap.closedAt && (
                                    <span className="text-emerald-700 font-bold">Closed on {gap.closedAt.slice(0, 10)} by {gap.closedBy}</span>
                                  )}
                                </div>

                                {gap.status !== 'CLOSED' && gap.status !== 'WAIVED' && (
                                  <button
                                    onClick={() => onWaiveGap(gap)}
                                    className="text-slate-400 hover:text-rose-600 font-medium underline text-[11px] cursor-pointer"
                                  >
                                    Waive Gap (Authorised Reason Required)
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
