import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  FileText, 
  Upload, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CareGap } from '../types';
import { store } from '../services/store';

interface ActionClosureModalProps {
  careGap: CareGap;
  onClose: () => void;
  onClosedSuccessfully: () => void;
}

export const ActionClosureModal: React.FC<ActionClosureModalProps> = ({
  careGap,
  onClose,
  onClosedSuccessfully
}) => {
  const [actionType, setActionType] = useState<string>('Test Completed');
  const [actionDate, setActionDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [performingClinician, setPerformingClinician] = useState<string>(store.currentUser.name);
  const [closureNotes, setClosureNotes] = useState<string>(
    careGap.ruleId === 'A7' 
      ? 'OGTT 75g completed at District Lab. Fasting: 88 mg/dL, 2-hr: 132 mg/dL (Normal). Report verified.'
      : careGap.ruleId === 'F3'
      ? 'Anomaly scan (TIFFA) completed by Sonologist Dr. R. Verma. Normal foetal anatomy confirmed.'
      : careGap.ruleId === 'C2'
      ? 'Administered Pentavalent-2, OPV-2, Rotavirus-2. Weight 5.2 kg recorded.'
      : 'Clinical milestone completed and verified in OPD.'
  );
  const [testValue1, setTestValue1] = useState(careGap.ruleId === 'A7' ? '88 mg/dL' : '');
  const [testValue2, setTestValue2] = useState(careGap.ruleId === 'A7' ? '132 mg/dL' : '');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      store.closeCareGap({
        careGapId: careGap.id,
        closureReason: `${actionType}: ${closureNotes}`,
        actionType,
        resultData: {
          primaryValue: testValue1,
          secondaryValue: testValue2,
          date: actionDate,
          clinician: performingClinician
        }
      });

      setIsSaving(false);
      setSuccess(true);

      setTimeout(() => {
        onClosedSuccessfully();
        onClose();
      }, 1000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-700 rounded-lg text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Record Clinical Action & Close Gap</h2>
              <p className="text-xs text-teal-200">
                {careGap.patientName} • {careGap.gapTitle}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-teal-300 hover:text-white rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Deck Principle Banner */}
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold mb-0.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>&ldquo;The loop only closes on a recorded action.&rdquo;</span>
            </div>
            Recording this verified visit, scan, or lab result officially transitions this care gap to <strong>CLOSED</strong> in the registry and updates the operational dashboard in real-time.
          </div>

          {/* Action Type */}
          <div>
            <label className="font-bold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
              Closure Action Type
            </label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="Test Completed">Laboratory Test Completed & Verified</option>
              <option value="Scan Completed">Ultrasound Scan Performed & Filed</option>
              <option value="Clinical Visit Completed">OPD Antenatal/Postnatal Visit Recorded</option>
              <option value="Immunisation Administered">Vaccine Dose Administered</option>
              <option value="Report Received from External Facility">Verified Completed at External Centre</option>
            </select>
          </div>

          {/* Two Columns: Date & Recorded By */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
                Date Action Recorded
              </label>
              <input
                type="date"
                value={actionDate}
                onChange={(e) => setActionDate(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
                Authorised User
              </label>
              <input
                type="text"
                value={performingClinician}
                onChange={(e) => setPerformingClinician(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Dynamic Test Values if Glucose or Scan */}
          {careGap.ruleId === 'A7' && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 text-[11px] block">Recorded OGTT 75g Results</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block">Fasting Blood Glucose</label>
                  <input
                    type="text"
                    value={testValue1}
                    onChange={(e) => setTestValue1(e.target.value)}
                    className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">2-Hour Post 75g Glucose</label>
                  <input
                    type="text"
                    value={testValue2}
                    onChange={(e) => setTestValue2(e.target.value)}
                    className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Closure Notes */}
          <div>
            <label className="font-bold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
              Clinical Loop Closure Record
            </label>
            <textarea
              rows={3}
              value={closureNotes}
              onChange={(e) => setClosureNotes(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 leading-relaxed text-slate-800"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || success}
              className={`px-5 py-2.5 rounded-lg text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer ${
                success ? 'bg-emerald-600' : 'bg-teal-700 hover:bg-teal-800'
              }`}
            >
              {success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gap Closed Successfully!</span>
                </>
              ) : isSaving ? (
                <span>Recording Action...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Action & Close Care Gap</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
