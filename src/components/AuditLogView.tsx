import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  FileText, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { store } from '../services/store';

export const AuditLogView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const logs = store.auditLogs.filter(log => {
    if (filterAction !== 'all' && !(log.action || '').includes(filterAction.toUpperCase())) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        (log.userName || '').toLowerCase().includes(q) ||
        (log.action || '').toLowerCase().includes(q) ||
        (log.patientName && log.patientName.toLowerCase().includes(q)) ||
        (log.reason && log.reason.toLowerCase().includes(q)) ||
        (log.entityId && log.entityId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Audit Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable clinical governance record. Every patient contact, rule change, and result action is permanently logged.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Facility-Level Isolation Active</span>
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Filter Action:</span>
          {[
            { id: 'all', label: 'All Events' },
            { id: 'contact', label: 'Patient Contacts' },
            { id: 'closed', label: 'Gap Closures' },
            { id: 'rule', label: 'Rule Changes' },
            { id: 'lab', label: 'Lab Results' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilterAction(btn.id)}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                filterAction === btn.id
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">Staff User</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-3">Entity & Patient</th>
                <th className="py-3 px-4">Audit Details & Rationale</th>
                <th className="py-3 px-4">Old → New Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-mono text-[11px]">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-bold text-slate-900 block font-sans text-xs">{log.userName}</span>
                    <span className="text-[10px] text-slate-400">{log.userRole}</span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-sans">
                    <span className="font-semibold text-slate-900 block">{log.patientName || log.entityId}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.entityType}: {log.entityId}</span>
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-700 text-xs">
                    <p className="leading-snug">{log.reason || 'Verified action executed'}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Source: {log.source} • IP: {log.ipAddress}</span>
                  </td>

                  <td className="py-3 px-4 text-[10px] text-slate-600">
                    {log.oldValue && (
                      <span className="text-slate-400 block line-through">{log.oldValue}</span>
                    )}
                    <span className="text-teal-800 font-bold block">{log.newValue}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
