import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Fingerprint, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  Filter
} from 'lucide-react';
import { Patient } from '../types';
import { store } from '../services/store';

interface PatientRegistryProps {
  onViewPatientProfile: (patientId: string) => void;
  onEnrolNewPatient: () => void;
}

export const PatientRegistry: React.FC<PatientRegistryProps> = ({
  onViewPatientProfile,
  onEnrolNewPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEpisode, setFilterEpisode] = useState<'all' | 'pregnancy' | 'child'>('all');

  const patients = store.patients.filter(p => {
    if (filterEpisode === 'pregnancy' && p.currentEpisodeType !== 'pregnancy') return false;
    if (filterEpisode === 'child' && p.currentEpisodeType !== 'child') return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.abhaNumber.toLowerCase().includes(q) ||
        p.abhaAddress.toLowerCase().includes(q) ||
        p.mobile.includes(q) ||
        p.patientIdNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ABDM & NRCeS India FHIR R4 linked longitudinal records ({store.patients.length} active records)
          </p>
        </div>

        <button
          onClick={onEnrolNewPatient}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Enrol Patient / Pregnancy</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Filter Episode:</span>
          {(['all', 'pregnancy', 'child'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterEpisode(type)}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer capitalize ${
                filterEpisode === type
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type === 'all' ? 'All Episodes' : type}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, ABHA, Mobile, Patient ID..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Patient Name & ID</th>
                <th className="py-3 px-3">ABHA Identifier</th>
                <th className="py-3 px-3">Age / Sex</th>
                <th className="py-3 px-3">Mobile</th>
                <th className="py-3 px-3">Current Episode</th>
                <th className="py-3 px-3 text-center">Open Gaps</th>
                <th className="py-3 px-3">Last Visit</th>
                <th className="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {patients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <button 
                      onClick={() => onViewPatientProfile(p.id)}
                      className="text-teal-900 hover:underline cursor-pointer block text-left"
                    >
                      {p.name}
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">{p.patientIdNumber}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-800">
                      <Fingerprint className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{p.abhaNumber}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">{p.abhaAddress}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    {p.age} yrs • {p.gender === 'female' ? 'F' : 'M'}
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px]">
                    {p.mobile}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="capitalize font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {p.currentEpisodeType || 'Antenatal'}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    {p.activeCareGapsCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>{p.activeCareGapsCount}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>0</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                    {p.lastVisitDate || '2026-09-15'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onViewPatientProfile(p.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition cursor-pointer"
                      title="View Unified Longitudinal Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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
