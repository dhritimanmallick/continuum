import React, { useState } from 'react';
import { 
  Baby, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  User,
  Heart,
  Sparkles,
  Lock
} from 'lucide-react';
import { LabourStageCode, OpdPatient } from '../../types';
import { labourDeliveryService, LABOUR_STAGES_INFO } from '../../services/labourDeliveryService';

interface HospitalLabourDeliveryPanelProps {
  patient: OpdPatient;
  doctorName: string;
  onOpenLiveTracker?: (patientId: string) => void;
}

export const HospitalLabourDeliveryPanel: React.FC<HospitalLabourDeliveryPanelProps> = ({
  patient,
  doctorName,
  onOpenLiveTracker
}) => {
  const [, setVersion] = useState(0);
  const tracker = labourDeliveryService.getTracker(patient.id)!;
  const currentStageInfo = LABOUR_STAGES_INFO.find(s => s.code === tracker.currentStage) || LABOUR_STAGES_INFO[0];

  const [selectedStage, setSelectedStage] = useState<LabourStageCode>(tracker.currentStage);
  const [customMsg, setCustomMsg] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [showBirthInputs, setShowBirthInputs] = useState(false);

  // Baby announcement inputs
  const [babyGender, setBabyGender] = useState<'Boy' | 'Girl' | 'Twins'>('Girl');
  const [babyWeightKg, setBabyWeightKg] = useState(3.1);
  const [deliveryType, setDeliveryType] = useState<'Normal Vaginal' | 'Lower Segment C-Section (LSCS)' | 'Assisted Vacuum'>('Normal Vaginal');
  const [timeOfBirth, setTimeOfBirth] = useState(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  const [motherStatus, setMotherStatus] = useState('Mother stable, resting comfortably in observation.');

  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const stageDetails = LABOUR_STAGES_INFO.find(s => s.code === selectedStage);

    const update = labourDeliveryService.updateStage({
      patientId: patient.id,
      stage: selectedStage,
      doctorOrStaffName: doctorName,
      customMessage: customMsg || stageDetails?.defaultDescription,
      privateClinicalNote: privateNote,
      babyDetails: selectedStage === 'STAGE_5_BABY_DELIVERED' ? {
        gender: babyGender,
        birthWeightKg: babyWeightKg,
        deliveryType,
        timeOfBirth,
        motherStatus
      } : undefined
    });

    setCustomMsg('');
    setPrivateNote('');
    setSuccessToast(`Stage updated to "${update.stageTitle}". WhatsApp alert sent to ${tracker.consentedContacts.length} consented family members.`);
    setTimeout(() => setSuccessToast(null), 5000);
    setVersion(v => v + 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
            <Baby className="w-4 h-4 text-pink-700" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-xs">Labour &amp; Delivery Ward Monitor</h4>
            <p className="text-[11px] text-slate-500">
              Active Patient: <strong className="text-slate-800">{patient.name}</strong> · Bed: {tracker.wardBed}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenLiveTracker && (
            <button
              onClick={() => onOpenLiveTracker(patient.id)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>View Family Live Tracker ({tracker.consentedContacts.length})</span>
            </button>
          )}
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Current Status banner */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Stage</span>
          <span className="font-black text-rose-950 text-sm">{currentStageInfo.title}</span>
          <p className="text-slate-500 text-[11px] mt-0.5">{currentStageInfo.defaultDescription}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-700">{tracker.currentStageProgressPercent}% progress</span>
          <div className="w-20 bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-rose-600 h-full rounded-full transition-all" 
              style={{ width: `${tracker.currentStageProgressPercent}%` }} 
            />
          </div>
        </div>
      </div>

      {/* 1-Click Update Stage form */}
      <form onSubmit={handleUpdate} className="space-y-3 pt-1">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Advance Milestone Stage (Triggers WhatsApp to Family)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LABOUR_STAGES_INFO.map(s => {
              const isSelected = selectedStage === s.code;
              return (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => {
                    setSelectedStage(s.code);
                    setShowBirthInputs(s.code === 'STAGE_5_BABY_DELIVERED');
                  }}
                  className={`p-2 rounded-xl border text-[11px] font-bold text-left transition cursor-pointer ${
                    isSelected 
                      ? 'bg-rose-900 text-white border-rose-950 shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-[10px] opacity-75">Stage {s.stageNumber}</span>
                  <span className="line-clamp-1">{s.title.split(' ')[0]}...</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Baby birth announcement if Stage 5 */}
        {selectedStage === 'STAGE_5_BABY_DELIVERED' && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-2">
            <span className="font-bold text-rose-950 text-xs block">👶 Baby Birth Announcement Details</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block">Gender</label>
                <select
                  value={babyGender}
                  onChange={(e) => setBabyGender(e.target.value as any)}
                  className="w-full p-1.5 bg-white border rounded font-semibold text-xs"
                >
                  <option value="Girl">Baby Girl 👧</option>
                  <option value="Boy">Baby Boy 👦</option>
                  <option value="Twins">Twins 👶👶</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block">Weight (kg)</label>
                <input
                  type="number"
                  step="0.05"
                  value={babyWeightKg}
                  onChange={(e) => setBabyWeightKg(parseFloat(e.target.value) || 3.1)}
                  className="w-full p-1.5 bg-white border rounded font-semibold text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block">Delivery</label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value as any)}
                  className="w-full p-1.5 bg-white border rounded font-semibold text-xs"
                >
                  <option value="Normal Vaginal">Normal Vaginal</option>
                  <option value="Lower Segment C-Section (LSCS)">LSCS</option>
                  <option value="Assisted Vacuum">Vacuum</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block">Time</label>
                <input
                  type="text"
                  value={timeOfBirth}
                  onChange={(e) => setTimeOfBirth(e.target.value)}
                  className="w-full p-1.5 bg-white border rounded font-semibold text-xs"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              WhatsApp Broadcast Text (Family View)
            </label>
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={LABOUR_STAGES_INFO.find(s => s.code === selectedStage)?.defaultDescription}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Confidential Clinical Note (EMR internal only, not sent to family)
            </label>
            <input
              type="text"
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
              placeholder="e.g. FHR 140 bpm, contractions regular, cervix 7cm."
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500">
            Will broadcast to <strong>{tracker.consentedContacts.length} consented WhatsApp contacts</strong>.
          </span>

          <button
            type="submit"
            className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Update Stage &amp; Send WhatsApp</span>
          </button>
        </div>
      </form>
    </div>
  );
};
