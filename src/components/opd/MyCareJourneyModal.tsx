import React, { useState } from 'react';
import { X, Sparkles, User, Award, ShieldCheck, Heart } from 'lucide-react';
import { OpdPatient } from '../../types';
import { opdStore } from '../../services/opdStore';
import { MyCareJourneyPanel } from './MyCareJourneyPanel';

interface MyCareJourneyModalProps {
  initialPatientId?: string;
  onClose: () => void;
}

export const MyCareJourneyModal: React.FC<MyCareJourneyModalProps> = ({
  initialPatientId,
  onClose
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatientId || opdStore.patients[0]?.id || 'PAT-104'
  );

  const patient = opdStore.patients.find(p => p.id === selectedPatientId) || opdStore.patients[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#faf8f6] rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-950 via-emerald-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-teal-800/60 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center font-bold text-amber-300 text-base shadow-xs">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">MY CARE JOURNEY</h3>
                <span className="text-[10px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded-full font-bold">
                  All OPD Pathways
                </span>
              </div>
              <p className="text-[11px] text-teal-200 font-medium">
                Encouraging continuity of care, report verification & milestone achievements for every patient.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Patient Switcher */}
            <div className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
              <span className="text-teal-200 text-[11px] font-semibold hidden sm:inline">Patient:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-teal-900/90 text-white text-[11px] rounded-lg px-2 py-1 font-bold border border-teal-700/80 cursor-pointer"
              >
                {opdStore.patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.isPregnant ? 'Pregnancy' : p.visitReason.slice(0, 15)})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {patient ? (
            <MyCareJourneyPanel
              patient={patient}
              onSelectPatientId={(id) => setSelectedPatientId(id)}
              showPatientSelector={false}
            />
          ) : (
            <div className="text-center py-12 text-slate-500">
              No patient record found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
