import React, { useState } from 'react';
import { 
  Baby, 
  User, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Fingerprint, 
  ShieldCheck, 
  Scale, 
  Syringe,
  Info
} from 'lucide-react';
import { store } from '../services/store';

interface NewbornChildModuleProps {
  onViewPatientProfile: (patientId: string) => void;
}

export const NewbornChildModule: React.FC<NewbornChildModuleProps> = ({ onViewPatientProfile }) => {
  const [activeTab, setActiveTab] = useState<'newborns' | 'children'>('newborns');

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Newborn & Child Health Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Birth episodes linked to maternal ABHA records, national immunisation schedule tracking, and non-diagnostic growth check intervals.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('newborns')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'newborns' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Newborn Records ({store.newborns.length})
          </button>
          <button
            onClick={() => setActiveTab('children')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'children' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Child Cohort ({store.children.length})
          </button>
        </div>
      </div>

      {/* Safety Notice (Section 11) */}
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Safety Rule (Child Growth Tracking):</strong> The system strictly tracks calendar milestone intervals (e.g. &ldquo;Growth check overdue&rdquo;), and displays physical measurements without diagnosing growth faltering or stunting. Diagnosis remains the exclusive responsibility of the pediatric clinical lead.
        </p>
      </div>

      {/* Newborns List */}
      {activeTab === 'newborns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {store.newborns.map(nb => (
            <div key={nb.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                    <Baby className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{nb.babyName}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{nb.id}</span>
                  </div>
                </div>
                <span className="capitalize font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {nb.sex}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg font-mono text-[11px] space-y-1 text-slate-700">
                <p className="flex items-center justify-between">
                  <span>Linked ABHA:</span>
                  <span className="font-bold text-teal-900">{nb.abhaNumber}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Mother:</span>
                  <span className="font-sans font-semibold text-slate-900">{nb.motherName}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Birth Weight:</span>
                  <span className="font-bold">{nb.birthWeightKg} kg</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Delivery:</span>
                  <span>{nb.deliveryType}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">DOB: {nb.dob}</span>
                <button
                  onClick={() => onViewPatientProfile(nb.motherId)}
                  className="text-teal-800 font-bold hover:underline"
                >
                  Mother Thread →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Children List */}
      {activeTab === 'children' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Child Name & ID</th>
                  <th className="py-3 px-3">Mother Record</th>
                  <th className="py-3 px-3">Age (Weeks)</th>
                  <th className="py-3 px-4">Immunisation Series Status</th>
                  <th className="py-3 px-3">Latest Recorded Weight</th>
                  <th className="py-3 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {store.children.map(ch => {
                  const isBabyOfRekha = ch.id === 'CH-001';
                  return (
                    <tr key={ch.id} className={`hover:bg-slate-50/80 transition-colors ${isBabyOfRekha ? 'bg-amber-50/25' : ''}`}>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <span>{ch.childName}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{ch.id}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-900 block">{ch.motherName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Mother ID: {ch.motherId}</span>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-800">
                        {ch.currentAgeWeeks} Weeks
                      </td>

                      <td className="py-3.5 px-4">
                        {isBabyOfRekha ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>10-Wk Immunisation Overdue (+2 wks)</span>
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              Pentavalent-1 & OPV-1 recorded on 20-Aug.
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Age Appropriate Series</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        {ch.growthChecks && ch.growthChecks.length > 0 ? (
                          <div>
                            <span className="font-bold text-slate-900">{ch.growthChecks[ch.growthChecks.length - 1].weightKg} kg</span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              at {ch.growthChecks[ch.growthChecks.length - 1].ageWeeks} wks
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => ch.motherId && onViewPatientProfile(ch.motherId)}
                          className="px-2.5 py-1 text-teal-800 bg-teal-50 border border-teal-200 rounded font-semibold hover:bg-teal-100 cursor-pointer"
                        >
                          View Thread →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
