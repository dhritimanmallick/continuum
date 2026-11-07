import React, { useState } from 'react';
import { 
  Heart, 
  TestTubes, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Plus, 
  Send, 
  Sparkles, 
  Info,
  Calendar,
  Baby,
  Activity,
  FileCheck,
  Check
} from 'lucide-react';
import { 
  OpdPatient, 
  MaternalClinicalStage, 
  MaternalTestProtocol, 
  LabPartner 
} from '../../types';
import { opdStore } from '../../services/opdStore';
import { 
  MATERNAL_ANC_TESTS, 
  MATERNAL_PNC_TESTS, 
  ALL_MATERNAL_TESTS, 
  detectMaternalStage,
  getTestsForMaternalStage 
} from '../../services/clinicalProtocols';

interface MaternalTestingPanelProps {
  patient: OpdPatient;
  onTestsOrdered?: () => void;
  selectedLabPartnerId?: string;
  onSelectLabPartnerId?: (id: string) => void;
}

export const MaternalTestingPanel: React.FC<MaternalTestingPanelProps> = ({
  patient,
  onTestsOrdered,
  selectedLabPartnerId,
  onSelectLabPartnerId
}) => {
  // Detect current stage based on patient data
  const initialStage: MaternalClinicalStage = patient.maternalStage || 
    detectMaternalStage({
      isPregnant: patient.isPregnant,
      pregnancyDetails: patient.pregnancyDetails,
      postnatalDetails: patient.postnatalDetails,
      visitType: patient.visitType
    });

  const [activeStage, setActiveStage] = useState<MaternalClinicalStage>(
    initialStage === 'GENERAL_NON_PREGNANT' ? 'PREGNANCY_1ST_TRIMESTER' : initialStage
  );
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [labPriority, setLabPriority] = useState<'Routine' | 'Urgent' | 'Stat'>('Routine');
  const [customTestInput, setCustomTestInput] = useState('');
  const [orderToast, setOrderToast] = useState<string | null>(null);

  const stages: { key: MaternalClinicalStage; label: string; period: string; isPostnatal?: boolean }[] = [
    { key: 'PREGNANCY_1ST_TRIMESTER', label: '1st Trimester', period: 'Gestation < 13 Weeks' },
    { key: 'PREGNANCY_2ND_TRIMESTER', label: '2nd Trimester', period: 'Gestation 14–27 Weeks' },
    { key: 'PREGNANCY_3RD_TRIMESTER', label: '3rd Trimester', period: 'Gestation 28–40 Weeks' },
    { key: 'POSTNATAL_IMMEDIATE', label: 'Postnatal Immediate', period: 'Day 1–3 Postpartum', isPostnatal: true },
    { key: 'POSTNATAL_6WEEKS', label: 'Postnatal 6-Week Check', period: 'Day 42 Follow-up', isPostnatal: true }
  ];

  const currentStageTests: MaternalTestProtocol[] = getTestsForMaternalStage(activeStage);

  const handleToggleTest = (testName: string) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter(t => t !== testName));
    } else {
      setSelectedTests([...selectedTests, testName]);
    }
  };

  const handleSelectEntireStagePanel = () => {
    const stageNames = currentStageTests.map(t => t.testName);
    const combined = Array.from(new Set([...selectedTests, ...stageNames]));
    setSelectedTests(combined);
  };

  const handleAddCustomTest = () => {
    if (customTestInput.trim() && !selectedTests.includes(customTestInput.trim())) {
      setSelectedTests([...selectedTests, customTestInput.trim()]);
      setCustomTestInput('');
    }
  };

  const handleOrderMaternalTests = () => {
    if (selectedTests.length === 0) return;

    const currentDoc = opdStore.getCurrentDoctor();
    const allLabs = opdStore.getLabPartners();
    const labId = selectedLabPartnerId || opdStore.selectedLabId;
    const partner = allLabs.find(l => l.id === labId) || allLabs[0];

    opdStore.orderMaternalTestProtocol({
      patientId: patient.id,
      testNames: selectedTests,
      stage: activeStage,
      priority: labPriority,
      requestedBy: currentDoc.name
    });

    setOrderToast(`Successfully routed ${selectedTests.length} maternal clinical protocol test(s) to ${partner.name}.`);
    setTimeout(() => setOrderToast(null), 5000);

    setSelectedTests([]);
    if (onTestsOrdered) onTestsOrdered();
  };

  // Check which tests the patient already has ordered/received
  const existingTestNames = new Set(patient.labOrders.map(o => o.testName));

  return (
    <div className="bg-white rounded-3xl border border-purple-200 p-5 shadow-2xs space-y-4 text-xs">
      {/* Toast */}
      {orderToast && (
        <div className="bg-purple-900 text-white p-3 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
            <span className="font-medium">{orderToast}</span>
          </div>
          <button onClick={() => setOrderToast(null)} className="text-purple-300 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-xs shrink-0">
            <TestTubes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">
                Maternal Clinical Diagnostic Testing Protocol Suite
              </h3>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-extrabold text-[10px] rounded-md border border-purple-200">
                During &amp; After Pregnancy
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Evidence-based laboratory screening panel for <strong className="text-slate-800">{patient.name}</strong> • Stage: <span className="font-bold text-purple-800">{activeStage}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[10px] font-bold text-slate-500">Priority:</span>
          <select
            value={labPriority}
            onChange={(e) => setLabPriority(e.target.value as any)}
            className="bg-purple-50 border border-purple-300 text-purple-950 font-bold rounded-xl px-2.5 py-1 text-xs cursor-pointer focus:outline-none"
          >
            <option value="Routine">Routine Protocol</option>
            <option value="Urgent">Urgent High-Risk</option>
            <option value="Stat">STAT (Emergency)</option>
          </select>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
            Select Maternal Pathway Stage:
          </span>
          <span className="text-[10px] text-purple-700 font-bold">
            {patient.isPregnant 
              ? `Currently ${patient.pregnancyDetails?.gestationalAgeWeeks || 28}w pregnant`
              : patient.postnatalDetails
              ? `Postnatal (Delivered ${patient.postnatalDetails.deliveryDate || 'Recently'})`
              : 'Obstetric & Postpartum Guidance'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {stages.map(s => {
            const isSelected = activeStage === s.key;
            const isRecommended = initialStage === s.key;

            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveStage(s.key)}
                className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-900 text-white border-purple-950 shadow-xs'
                    : isRecommended
                    ? 'bg-purple-50 text-purple-950 border-purple-300 ring-1 ring-purple-300/40 hover:bg-purple-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-[11px] block">{s.label}</span>
                    {isRecommended && (
                      <span className={`text-[8px] px-1 py-0.2 rounded font-extrabold uppercase ${
                        isSelected ? 'bg-purple-800 text-purple-200' : 'bg-purple-200 text-purple-900'
                      }`}>
                        Active
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] block mt-0.5 ${isSelected ? 'text-purple-200' : 'text-slate-500'}`}>
                    {s.period}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Panel Quick Action Banner */}
      <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span className="font-extrabold text-xs text-purple-950">
              Standard {activeStage} Testing Protocol
            </span>
            <span className="text-[10px] text-purple-700 font-medium">
              ({currentStageTests.length} recommended diagnostic investigations)
            </span>
          </div>
          <p className="text-[10px] text-purple-800">
            {activeStage.startsWith('Postnatal')
              ? 'Postpartum recovery assessment, anemia screening, GDM reclassification & maternal well-being.'
              : 'Trimester-appropriate fetal organ surveillance, maternal glycemic & hemoglobin tracking.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSelectEntireStagePanel}
          className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition active:scale-95 shrink-0"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Select Recommended Panel</span>
        </button>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {currentStageTests.map(test => {
          const isSelected = selectedTests.includes(test.testName);
          const isAlreadyOrdered = existingTestNames.has(test.testName);

          return (
            <div
              key={test.id}
              onClick={() => handleToggleTest(test.testName)}
              className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                isSelected
                  ? 'bg-purple-900 text-white border-purple-950 shadow-xs ring-1 ring-purple-600'
                  : isAlreadyOrdered
                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                  : 'bg-white hover:bg-purple-50/40 border-slate-200 text-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-white text-purple-900 border-white'
                        : isAlreadyOrdered
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      {!isSelected && isAlreadyOrdered && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className={`font-extrabold text-xs ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {test.testName}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${
                    isSelected
                      ? 'bg-purple-800 text-purple-100'
                      : test.priority === 'Stat'
                      ? 'bg-rose-100 text-rose-800'
                      : test.priority === 'Urgent'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {test.priority}
                  </span>
                </div>

                <p className={`text-[11px] leading-tight ${isSelected ? 'text-purple-100' : 'text-slate-600'}`}>
                  {test.clinicalRationale || test.clinicalIndication}
                </p>
              </div>

              <div className={`pt-2 border-t flex items-center justify-between text-[10px] ${
                isSelected ? 'border-purple-800 text-purple-200' : 'border-slate-100 text-slate-500'
              }`}>
                <span>{test.timingDescription || test.timing || test.stageLabel}</span>
                {isAlreadyOrdered ? (
                  <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Already Ordered / Logged
                  </span>
                ) : (
                  <span>Click to select</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Test Entry & Order Dispatch Footer */}
      <div className="pt-2 border-t border-purple-100 space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add specific or additional maternal diagnostic test..."
            value={customTestInput}
            onChange={(e) => setCustomTestInput(e.target.value)}
            className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
          <button
            type="button"
            onClick={handleAddCustomTest}
            className="px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded-xl text-xs cursor-pointer"
          >
            + Add Custom
          </button>
        </div>

        {/* Selected Summary & Order Button */}
        <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-extrabold text-xs text-purple-950">
              {selectedTests.length} Maternal Test(s) Selected for Order
            </span>
            <p className="text-[10px] text-purple-800 truncate max-w-md">
              {selectedTests.length > 0 
                ? selectedTests.join(', ')
                : 'Click tests above or choose "Select Recommended Panel" to order.'}
            </p>
          </div>

          <button
            type="button"
            disabled={selectedTests.length === 0}
            onClick={handleOrderMaternalTests}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition shadow-sm ${
              selectedTests.length > 0
                ? 'bg-purple-900 hover:bg-purple-950 text-white cursor-pointer active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Order Selected Tests ({selectedTests.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
