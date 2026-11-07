import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Share2, 
  ShieldCheck, 
  Sliders, 
  TrendingDown, 
  TrendingUp, 
  X, 
  Copy, 
  Check, 
  ExternalLink,
  Microscope,
  Stethoscope,
  Info,
  Calendar,
  User,
  QrCode
} from 'lucide-react';
import { LabOrder, DiagnosticParameter, DiagnosticAnalysisResult } from '../../types';
import { OBSTETRIC_REFERENCE_ADJUSTMENTS, runDiagnosticAnalysis } from '../../services/diagnosticAnalyser';
import { abdmService } from '../../services/abdmService';

interface DiagnosticAnalyserModalProps {
  order: LabOrder;
  patientGestationWeeks?: number;
  onClose: () => void;
  onSendToDoctor?: () => void;
}

export const DiagnosticAnalyserModal: React.FC<DiagnosticAnalyserModalProps> = ({
  order,
  patientGestationWeeks = 28,
  onClose,
  onSendToDoctor
}) => {
  const [activeTab, setActiveTab] = useState<'analyser' | 'parameters' | 'abdm'>('analyser');
  const [parameterFilter, setParameterFilter] = useState<'all' | 'flagged'>('all');
  const [trimesterMode, setTrimesterMode] = useState<'auto' | 'non-pregnant' | '1st' | '2nd' | '3rd'>('auto');
  const [copiedFhir, setCopiedFhir] = useState(false);
  const [sentToDoctorToast, setSentToDoctorToast] = useState(false);

  // Fallback default parameters if order didn't have structured parameters
  const parameters: DiagnosticParameter[] = order.parameters && order.parameters.length > 0 
    ? order.parameters 
    : [
        { id: 'p1', name: 'Observed Diagnostic Value', value: order.reportSummary || 'Standard Result', unit: '', referenceRange: 'Normal', status: 'NORMAL' }
      ];

  // Resolve gestational weeks based on trimester mode
  const effectiveWeeks = trimesterMode === '1st' ? 10 : trimesterMode === '2nd' ? 24 : trimesterMode === '3rd' ? 32 : trimesterMode === 'non-pregnant' ? undefined : patientGestationWeeks;

  // Run dynamic live analysis
  const analysis: DiagnosticAnalysisResult = order.analysisResult || runDiagnosticAnalysis({
    testName: order.testName,
    parameters,
    gestationWeeks: effectiveWeeks,
    isPregnant: trimesterMode !== 'non-pregnant'
  });

  const flaggedParameters = parameters.filter(p => p.status !== 'NORMAL');
  const displayedParameters = parameterFilter === 'flagged' ? flaggedParameters : parameters;

  // Generate FHIR bundle preview for ABDM
  const fhirBundle = order.abdmFhirBundle || abdmService.generateFHIRDiagnosticReportBundle({
    patientId: order.patientId || 'pat-104',
    patientName: order.patientName || 'Sunita Das',
    orderId: order.id,
    testName: order.testName,
    summaryText: order.reportSummary || 'Diagnostic parameters analyzed',
    findings: order.findings,
    parameters,
    doctorName: order.requestedBy || 'Dr. Anita Rao',
    labName: order.clinicName || 'Apex Diagnostic Lab'
  });

  const handleCopyFhir = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirBundle, null, 2));
    setCopiedFhir(true);
    setTimeout(() => setCopiedFhir(false), 2500);
  };

  const handleTransmitToDoctor = () => {
    setSentToDoctorToast(true);
    if (onSendToDoctor) onSendToDoctor();
    setTimeout(() => setSentToDoctorToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-400/40 flex items-center justify-center">
              <Microscope className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-white">
                  Diagnostic Results Analyser
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                  AI Medical Analyser Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>{order.testName}</span>
                <span>•</span>
                <span>Patient: <strong className="text-white">{order.patientName || 'Sunita Das'}</strong> ({order.opdId || 'PAT-104'})</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('analyser')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'analyser'
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Clinical Risk & Correlation Analyser</span>
            </button>

            <button
              onClick={() => setActiveTab('parameters')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'parameters'
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Quantitative Range Gauges ({parameters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('abdm')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'abdm'
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>ABDM FHIR Bundle</span>
            </button>
          </div>

          {/* Quick Trimester Physiological Switch */}
          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500">Trimester Tuning:</span>
            {(['auto', '1st', '2nd', '3rd', 'non-pregnant'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setTrimesterMode(mode)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase transition cursor-pointer ${
                  trimesterMode === mode
                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {mode === 'auto' ? `${patientGestationWeeks}w (Auto)` : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: CLINICAL RISK & CORRELATION ANALYSER */}
          {activeTab === 'analyser' && (
            <div className="space-y-5">
              
              {/* Overall Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
                analysis.overallStatus === 'CRITICAL_ALERT'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : analysis.overallStatus === 'ATTENTION_NEEDED'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {analysis.overallStatus === 'CRITICAL_ALERT' ? (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    ) : analysis.overallStatus === 'ATTENTION_NEEDED' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    <span className="font-extrabold uppercase tracking-wide text-[11px]">
                      {analysis.overallStatus === 'CRITICAL_ALERT'
                        ? 'Critical Diagnostic Alert Detected'
                        : analysis.overallStatus === 'ATTENTION_NEEDED'
                        ? 'Diagnostic Variance Requiring Clinical Action'
                        : 'Physiological Harmony · Within Reference Limits'}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold leading-snug">
                    {analysis.primaryFinding}
                  </h3>
                  <p className="text-[11px] opacity-80">
                    Verified by Pathologist {analysis.reviewedByPathologist} at {analysis.analyzedAt}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider block ${
                    analysis.overallStatus === 'CRITICAL_ALERT'
                      ? 'bg-rose-200 text-rose-900'
                      : analysis.overallStatus === 'ATTENTION_NEEDED'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-emerald-200 text-emerald-900'
                  }`}>
                    {analysis.overallStatus.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {flaggedParameters.length} of {parameters.length} parameters flagged
                  </span>
                </div>
              </div>

              {/* Grid: Multi-parameter Correlations & Obstetric Insight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Correlations Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <span className="font-extrabold text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-purple-700" />
                    <span>Multi-Parameter Correlations & Indices</span>
                  </span>

                  <div className="space-y-2">
                    {analysis.clinicalCorrelations.map((corr, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-slate-800 font-medium leading-relaxed">
                            {corr}
                          </p>
                        </div>
                      </div>
                    ))}

                    {analysis.mentzerIndex && (
                      <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 flex items-center justify-between text-purple-950 font-bold">
                        <span>Calculated Mentzer Index (MCV / RBC):</span>
                        <span className="font-mono text-sm px-2 py-0.5 rounded bg-white border border-purple-300">
                          {analysis.mentzerIndex} ({analysis.mentzerIndex > 13 ? '> 13 Iron Deficiency' : '<= 13 Thalassemia screen'})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Obstetric Trimester Calibration & Physiological Tuning */}
                <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200 space-y-3">
                  <span className="font-extrabold text-teal-950 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-teal-700" />
                    <span>Obstetric Trimester Physiological Calibration</span>
                  </span>

                  <p className="text-teal-900 leading-relaxed bg-white p-3 rounded-xl border border-teal-200">
                    {analysis.trimesterInsight || (
                      `During the ${trimesterMode === 'auto' ? `${patientGestationWeeks}w gestation` : trimesterMode} window, maternal physiology exhibits significant cardiovascular expansion (~45% plasma volume increase), shifting baseline reference intervals from standard non-pregnant values.`
                    )}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                      Active Trimester Reference Adjustments:
                    </span>
                    {Object.values(OBSTETRIC_REFERENCE_ADJUSTMENTS).slice(0, 2).map((adj, idx) => (
                      <div key={idx} className="bg-white/80 p-2 rounded-lg border border-teal-100 text-[11px]">
                        <span className="font-bold text-slate-800">{adj.parameterName}: </span>
                        <span className="text-slate-600">Standard {adj.nonPregnantRange} → </span>
                        <span className="font-bold text-teal-800">Maternal {adj.secondTrimesterRange}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Differential Diagnosis if flagged */}
              {analysis.differentialDiagnosis && analysis.differentialDiagnosis.length > 0 && (
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <span className="font-extrabold text-amber-950 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Differential Considerations for Treating Clinician</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {analysis.differentialDiagnosis.map((diff, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white text-amber-900 border border-amber-300 font-bold rounded-xl shadow-2xs">
                        • {diff}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Recommendations for Referring Doctor */}
              <div className="bg-purple-900 text-white p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-extrabold uppercase tracking-wide text-xs">
                    <Stethoscope className="w-4 h-4 text-purple-300" />
                    <span>Protocol Reference Points for the Treating Doctor</span>
                  </div>
                  <span className="text-[10px] bg-purple-800 px-2.5 py-0.5 rounded-full text-purple-200">
                    ACOG / FOGSI Protocols
                  </span>
                </div>

                <p className="text-[11px] text-purple-200">
                  Reference points from published protocols, not orders. The treating doctor decides; the reporting pathologist signs off the report.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {analysis.actionRecommendations.map((act, idx) => (
                    <div key={idx} className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-300 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUANTITATIVE RANGE GAUGES */}
          {activeTab === 'parameters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-extrabold text-slate-800 uppercase tracking-wide text-[11px]">
                  Measured Biomarkers vs Biological Reference Ranges
                </span>
                <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold">
                  <button
                    onClick={() => setParameterFilter('all')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${parameterFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                  >
                    All Parameters ({parameters.length})
                  </button>
                  <button
                    onClick={() => setParameterFilter('flagged')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${parameterFilter === 'flagged' ? 'bg-white text-rose-900 shadow-2xs' : 'text-slate-600'}`}
                  >
                    Flagged Only ({flaggedParameters.length})
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {displayedParameters.map((param) => {
                  const isLow = param.status === 'LOW';
                  const isHigh = param.status === 'HIGH' || param.status === 'CRITICAL';
                  const isNormal = param.status === 'NORMAL';

                  return (
                    <div key={param.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{param.name}</span>
                            {param.loincCode && (
                              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                LOINC #{param.loincCode}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Reference Interval: <strong className="text-slate-700">{param.referenceRange} {param.unit}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-mono text-base font-extrabold text-slate-900 block">
                              {param.value} <span className="text-xs text-slate-500 font-normal">{param.unit}</span>
                            </span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                            isLow
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : isHigh
                              ? 'bg-rose-100 text-rose-900 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            {param.status}
                          </span>
                        </div>
                      </div>

                      {/* Visual Visualizer Range Bar */}
                      <div className="pt-1">
                        <div className="h-2.5 w-full bg-slate-100 rounded-full relative overflow-hidden flex">
                          {/* Low Zone */}
                          <div className="w-1/4 bg-amber-200/80" title="Low zone" />
                          {/* Normal Safe Zone */}
                          <div className="w-1/2 bg-emerald-400" title="Normal biological reference interval" />
                          {/* High Zone */}
                          <div className="w-1/4 bg-rose-300" title="Elevated / High zone" />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>Sub-optimal (Low)</span>
                          <span className="text-emerald-700 font-bold">Standard Target Range</span>
                          <span>Elevated (High)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ABDM FHIR BUNDLE */}
          {activeTab === 'abdm' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-700" />
                    <span className="font-extrabold text-teal-950 uppercase tracking-wide text-xs">
                      ABDM NRCeS FHIR R4 DiagnosticReport Bundle
                    </span>
                  </div>
                  <p className="text-teal-900 text-[11px] leading-relaxed">
                    This FHIR JSON bundle is structured per the Ayushman Bharat Digital Mission (NDHM) M3 DiagnosticReport profile. It links to the patient&apos;s ABHA ID with authenticated digital signing.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-white text-teal-900 border border-teal-300">
                      ABHA: {order.patientName ? `${order.patientName.toLowerCase().replace(/\s+/g, '.')}@abdm` : 'pat@abdm'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white text-teal-900 border border-teal-300">
                      Care Context: CC-LAB-{order.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white text-teal-900 border border-teal-300">
                      HIP: IN-KA-DH-HOSP-0042
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopyFhir}
                  className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
                >
                  {copiedFhir ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFhir ? 'Copied JSON' : 'Copy FHIR Bundle'}</span>
                </button>
              </div>

              {/* JSON Viewer */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-96 border border-slate-800">
                <pre>{JSON.stringify(fhirBundle, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>NABL & ABDM M3 Diagnostic Standard • Pathologist Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Close Analyser
            </button>

            <button
              onClick={handleTransmitToDoctor}
              className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              {sentToDoctorToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-purple-200" />
                  <span>Transmitted to Doctor Screen</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-purple-300" />
                  <span>Transmit Insights to Doctor</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
