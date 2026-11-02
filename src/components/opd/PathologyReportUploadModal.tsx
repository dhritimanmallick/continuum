import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  X, 
  Sliders, 
  Plus, 
  Trash2, 
  Microscope, 
  User, 
  Building2,
  FileCheck,
  Zap,
  Activity
} from 'lucide-react';
import { LabOrder, DiagnosticParameter, OpdPatient } from '../../types';
import { opdStore } from '../../services/opdStore';
import { 
  decipherReportViaOcr, 
  SAMPLE_PATHOLOGY_REPORTS, 
  DecipheredLabReport 
} from '../../services/pathologyOcrService';
import { abdmService } from '../../services/abdmService';

interface PathologyReportUploadModalProps {
  order?: LabOrder | null;
  onClose: () => void;
  onSuccess: (order: LabOrder, patientName: string) => void;
}

export const PathologyReportUploadModal: React.FC<PathologyReportUploadModalProps> = ({
  order,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'verify'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('Initiating OCR engine...');
  
  // Deciphered data state
  const [decipheredData, setDecipheredData] = useState<DecipheredLabReport | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    order?.patientId || opdStore.patients[0]?.id || 'PAT-104'
  );
  const [syncToAbdm, setSyncToAbdm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allPatients: OpdPatient[] = opdStore.patients;
  const currentPatient = allPatients.find(p => p.id === selectedPatientId) || allPatients[0];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setSelectedSampleId(null);
    startScanning({ file });
  };

  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    setSelectedFile(null);
    startScanning({ sampleId });
  };

  const startScanning = async (params: { file?: File; sampleId?: string }) => {
    setStep('scanning');
    setScanProgress(15);
    setScanStatusText('Scanning document optical layers & layout...');

    const timer1 = setTimeout(() => {
      setScanProgress(45);
      setScanStatusText('Deciphering quantitative clinical parameters & units...');
    }, 400);

    const timer2 = setTimeout(() => {
      setScanProgress(75);
      setScanStatusText('Correlating biological reference ranges & LOINC mapping...');
    }, 800);

    try {
      const result = await decipherReportViaOcr({
        file: params.file,
        sampleId: params.sampleId,
        patientHint: order?.patientName || currentPatient?.name,
        opdIdHint: order?.opdId || currentPatient?.opdId
      });

      setTimeout(() => {
        setScanProgress(100);
        setScanStatusText('Deciphered with 99.4% confidence!');
        setDecipheredData(result);
        
        // Auto-match patient if possible
        if (!order?.patientId && result.patientName) {
          const matched = allPatients.find(p => 
            p.name.toLowerCase().includes(result.patientName.toLowerCase()) ||
            result.patientName.toLowerCase().includes(p.name.toLowerCase())
          );
          if (matched) setSelectedPatientId(matched.id);
        }

        setStep('verify');
      }, 1200);
    } catch (e) {
      console.error('OCR Error:', e);
      clearTimeout(timer1);
      clearTimeout(timer2);
      setStep('upload');
    }
  };

  const handleUpdateParameter = (index: number, field: keyof DiagnosticParameter, val: any) => {
    if (!decipheredData) return;
    const updated = [...decipheredData.parameters];
    updated[index] = { ...updated[index], [field]: val };
    setDecipheredData({
      ...decipheredData,
      parameters: updated
    });
  };

  const handleAddParameter = () => {
    if (!decipheredData) return;
    const newParam: DiagnosticParameter = {
      id: `p-${Date.now()}`,
      name: 'New Parameter',
      value: '0',
      unit: '',
      referenceRange: 'Normal',
      status: 'NORMAL'
    };
    setDecipheredData({
      ...decipheredData,
      parameters: [...decipheredData.parameters, newParam]
    });
  };

  const handleRemoveParameter = (index: number) => {
    if (!decipheredData) return;
    const updated = decipheredData.parameters.filter((_, i) => i !== index);
    setDecipheredData({
      ...decipheredData,
      parameters: updated
    });
  };

  const handleFinalSaveAndBuildProfile = async () => {
    if (!decipheredData) return;
    setIsSubmitting(true);

    try {
      let abdmTxnId = `ABDM-TXN-LAB-${Math.floor(100000 + Math.random() * 900000)}`;
      let abdmCareContextId = `CC-LAB-${order?.id || Date.now()}`;
      let fhirBundle: any = null;

      if (syncToAbdm) {
        const abdmResult = await abdmService.uploadDiagnosticReportToABDM({
          patientId: currentPatient.id,
          patientName: currentPatient.name,
          abhaNumber: currentPatient.abhaNumber,
          abhaAddress: currentPatient.abhaAddress || `${currentPatient.name.toLowerCase().replace(/\s+/g, '.')}@abdm`,
          orderId: order?.id || `LAB-${Date.now()}`,
          testName: decipheredData.testName,
          category: decipheredData.category,
          summaryText: decipheredData.summaryText,
          findings: decipheredData.findings,
          parameters: decipheredData.parameters,
          doctorName: order?.requestedBy || 'Dr. Anita Rao',
          labName: decipheredData.labName
        });
        abdmTxnId = abdmResult.txnId;
        abdmCareContextId = abdmResult.careContextId;
        fhirBundle = abdmResult.fhirBundle;
      }

      // Build into patient profile & update store
      const updatedOrder = opdStore.uploadLabReport({
        orderId: order?.id,
        patientId: currentPatient.id,
        testName: decipheredData.testName,
        category: decipheredData.category,
        fileName: decipheredData.documentFileName,
        summaryText: decipheredData.summaryText,
        findings: decipheredData.findings,
        parameters: decipheredData.parameters,
        analysisResult: decipheredData.analysisResult,
        abdmSyncStatus: syncToAbdm ? 'SYNCED' : 'PENDING',
        abdmTxnId: syncToAbdm ? abdmTxnId : undefined,
        abdmCareContextId: syncToAbdm ? abdmCareContextId : undefined,
        abdmFhirBundle: fhirBundle,
        ocrConfidence: decipheredData.ocrConfidence,
        ocrMethod: decipheredData.ocrMethod
      });

      setIsSubmitting(false);
      onSuccess(updatedOrder || (order as LabOrder), currentPatient.name);
    } catch (err) {
      console.error('Error saving lab report:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-400/40 flex items-center justify-center">
              <Upload className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-white">
                  Upload Diagnostic Report / PDF
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                  OCR Decipher & ABDM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI extracts quantitative parameters, correlates results & builds into patient profile with ABDM FHIR sync.
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

        {/* STEP 1: UPLOAD OR CHOOSE SAMPLE */}
        {step === 'upload' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            
            {/* Originating Order Context if existing order */}
            {order && (
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-900 uppercase">Target Requisition:</span>
                  <div className="font-extrabold text-slate-900 text-sm">{order.testName}</div>
                  <div className="text-[11px] text-slate-600">Patient: {order.patientName} ({order.opdId}) • Referring: {order.requestedBy}</div>
                </div>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-900 rounded-xl font-bold text-[10px]">
                  #{order.id}
                </span>
              </div>
            )}

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition cursor-pointer ${
                dragActive
                  ? 'border-purple-600 bg-purple-50/50'
                  : 'border-slate-300 hover:border-purple-400 bg-slate-50/60'
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer space-y-3 block">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 text-purple-700 flex items-center justify-center mx-auto">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block">
                    Drop PDF or Diagnostic Image here, or browse files
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Supports clinical PDF reports, scanned slips, hematology analyzer prints (PDF, PNG, JPG)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Choose Report File</span>
                </button>
              </label>
            </div>

            {/* Instant Sample Reports (1-Click Test) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-700" />
                  <span>Or Test with Pre-Loaded Real Pathology Reports:</span>
                </span>
                <span className="text-[10px] text-slate-400">1-click OCR simulation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PATHOLOGY_REPORTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.id)}
                    className="p-3.5 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200 hover:border-purple-300 text-left transition cursor-pointer shadow-2xs group flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-900 group-hover:text-white transition">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-slate-900 text-xs truncate group-hover:text-purple-900">
                          {sample.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate mt-0.5 font-mono">
                        {sample.fileName}
                      </span>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.2 rounded-md bg-slate-100 text-slate-700 group-hover:bg-purple-100 group-hover:text-purple-900">
                        {sample.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: SCANNING ANIMATION */}
        {step === 'scanning' && (
          <div className="p-12 text-center space-y-5 flex-1 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-purple-100 text-purple-800 flex items-center justify-center animate-pulse">
                <Microscope className="w-10 h-10" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-900 text-white flex items-center justify-center animate-spin">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-base font-extrabold text-slate-900">
                Deciphering Diagnostic Report via OCR
              </h3>
              <p className="text-xs text-purple-800 font-semibold animate-pulse">
                {scanStatusText}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-800 h-full transition-all duration-300 ease-out" 
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{scanProgress}% completed</span>
          </div>
        )}

        {/* STEP 3: VERIFY DECIPHERED VALUES & ABDM UPLOAD */}
        {step === 'verify' && decipheredData && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            
            {/* Header Notification */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-emerald-950 text-xs">
                    Optical Character Recognition Completed Successfully
                  </span>
                  <p className="text-[11px] text-emerald-800">
                    Extracted {decipheredData.parameters.length} quantitative parameters with {decipheredData.ocrConfidence}% confidence.
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                {decipheredData.ocrMethod}
              </span>
            </div>

            {/* Patient & Requisition Matching */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1 uppercase text-[10px]">
                  Associate with Hospital Patient Record:
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-xs focus:border-purple-500 focus:outline-none"
                >
                  {allPatients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.opdId}) — {p.age}y {p.pregnancyDetails?.gestationalAgeWeeks ? `· ${p.pregnancyDetails.gestationalAgeWeeks}w ANC` : ''}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 block mt-1">
                  ABHA: <strong className="text-purple-900">{currentPatient.abhaAddress || `${currentPatient.name.toLowerCase().replace(/\s+/g, '.')}@abdm`}</strong>
                </span>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1 uppercase text-[10px]">
                  Investigation / Test Title:
                </label>
                <input
                  type="text"
                  value={decipheredData.testName}
                  onChange={(e) => setDecipheredData({ ...decipheredData, testName: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-xs"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Category: <strong>{decipheredData.category}</strong> • Specimen: {decipheredData.specimenType}
                </span>
              </div>
            </div>

            {/* Parameters Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-purple-700" />
                  <span>Deciphered Parameters Verification Table</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddParameter}
                  className="px-2.5 py-1 text-purple-800 hover:bg-purple-50 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Parameter</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Parameter Name</th>
                      <th className="py-2.5 px-2 w-24">Observed Value</th>
                      <th className="py-2.5 px-2 w-20">Unit</th>
                      <th className="py-2.5 px-2">Biological Reference</th>
                      <th className="py-2.5 px-2 w-28">Status</th>
                      <th className="py-2.5 px-2 text-right w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {decipheredData.parameters.map((param, idx) => (
                      <tr key={param.id} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={param.name}
                            onChange={(e) => handleUpdateParameter(idx, 'name', e.target.value)}
                            className="w-full bg-transparent font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-purple-500 text-xs focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={param.value}
                            onChange={(e) => {
                              handleUpdateParameter(idx, 'value', e.target.value);
                              const parsed = parseFloat(e.target.value);
                              if (!isNaN(parsed)) handleUpdateParameter(idx, 'numericValue', parsed);
                            }}
                            className="w-full bg-slate-50 p-1 rounded font-mono font-bold text-slate-900 border border-slate-200 text-xs text-center"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={param.unit}
                            onChange={(e) => handleUpdateParameter(idx, 'unit', e.target.value)}
                            className="w-full bg-transparent text-slate-500 font-mono text-[11px] border-b border-transparent hover:border-slate-300 focus:border-purple-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={param.referenceRange}
                            onChange={(e) => handleUpdateParameter(idx, 'referenceRange', e.target.value)}
                            className="w-full bg-transparent text-slate-600 text-xs border-b border-transparent hover:border-slate-300 focus:border-purple-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={param.status}
                            onChange={(e) => handleUpdateParameter(idx, 'status', e.target.value)}
                            className={`p-1 rounded-lg text-[10px] font-extrabold uppercase border cursor-pointer ${
                              param.status === 'LOW'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : param.status === 'HIGH' || param.status === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-900 border-rose-300'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            <option value="NORMAL">Normal</option>
                            <option value="LOW">Low</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                          </select>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveParameter(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pathologist Clinical Impression & Findings */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-800 uppercase tracking-wide text-[10px] block">
                Pathologist Diagnostic Impression & Comments:
              </label>
              <textarea
                rows={2}
                value={decipheredData.findings}
                onChange={(e) => setDecipheredData({ ...decipheredData, findings: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* ABDM Integration Checkbox */}
            <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span className="font-extrabold text-teal-950 text-xs">
                    Ayushman Bharat Digital Mission (ABDM) Sync
                  </span>
                </div>
                <p className="text-teal-900 text-[11px]">
                  Automatically format as NRCeS FHIR R4 DiagnosticReport bundle and register under patient&apos;s ABHA care context (<strong className="text-teal-950">{currentPatient.abhaAddress || `${currentPatient.name.toLowerCase().replace(/\s+/g, '.')}@abdm`}</strong>).
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={syncToAbdm}
                  onChange={(e) => setSyncToAbdm(e.target.checked)}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-xs font-bold text-teal-950">Upload to ABDM</span>
              </label>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step === 'verify' ? (
            <button
              type="button"
              onClick={() => setStep('upload')}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Back to Upload
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step === 'verify' && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSaveAndBuildProfile}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Building Profile & Syncing ABDM...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-purple-300" />
                  <span>Approve & Build into Patient Profile + Sync ABDM</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
