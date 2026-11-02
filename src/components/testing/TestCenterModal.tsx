import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  Download, 
  Printer, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  X, 
  FileText, 
  ExternalLink, 
  AlertTriangle, 
  ArrowRight, 
  Filter, 
  Search, 
  Activity, 
  Globe, 
  Microscope, 
  Stethoscope, 
  Users, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { testSuiteService, TestCase, TestStatus, AutomatedTestResult } from '../../services/testSuiteService';
import { pdfGeneratorService } from '../../services/pdfGeneratorService';
import { authService } from '../../services/authService';
import { opdStore } from '../../services/opdStore';

interface TestCenterModalProps {
  onClose: () => void;
  onNavigateToPortal?: (portal: 'ADMIN' | 'OPD' | 'LAB' | 'PHARMA', role?: 'RECEPTION' | 'DOCTOR') => void;
}

export const TestCenterModal: React.FC<TestCenterModalProps> = ({ onClose, onNavigateToPortal }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'automated' | 'pdf' | 'fixtures'>('matrix');
  const [selectedSuite, setSelectedSuite] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>(testSuiteService.getAllTestCases());
  const [testerName, setTesterName] = useState('QA Tester');

  // Automated suite state
  const [isAutomatedRunning, setIsAutomatedRunning] = useState(false);
  const [automatedResults, setAutomatedResults] = useState<AutomatedTestResult[] | null>(null);
  const [automatedDuration, setAutomatedDuration] = useState<number | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Subscribe to test suite changes
  useEffect(() => {
    const unsub = testSuiteService.subscribe(() => {
      setTestCases(testSuiteService.getAllTestCases());
    });
    return () => {
      unsub();
    };
  }, []);

  const stats = testSuiteService.getSummaryStats();

  const filteredTests = testCases.filter(tc => {
    const matchesSuite = selectedSuite === 'all' || tc.suiteId === selectedSuite;
    const matchesStatus = selectedStatusFilter === 'all' || tc.status === selectedStatusFilter;
    const matchesSearch = 
      tc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.persona.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSuite && matchesStatus && matchesSearch;
  });

  const handleStatusChange = (testId: string, status: TestStatus) => {
    testSuiteService.updateTestCaseStatus(testId, status, undefined, testerName);
  };

  const handleRunAutomatedSuite = async () => {
    setIsAutomatedRunning(true);
    setAutomatedResults(null);
    try {
      const res = await testSuiteService.runAutomatedVerification();
      setAutomatedResults(res.results);
      setAutomatedDuration(res.durationMs);
    } catch {
      // ignore
    } finally {
      setIsAutomatedRunning(false);
    }
  };

  const handleDownloadPdf = () => {
    try {
      pdfGeneratorService.generateAndDownloadTestPlanPdf();
      setDownloadSuccessToast('PDF test plan downloaded successfully! Ready for distribution to your testing team.');
      setTimeout(() => setDownloadSuccessToast(null), 5000);
    } catch (err: any) {
      alert(`PDF generation failed: ${err.message}`);
    }
  };

  const handleQuickAction = (tc: TestCase) => {
    if (!tc.quickAction) return;

    if (tc.quickAction.targetUserId) {
      authService.quickLogin(tc.quickAction.targetUserId);
    }

    if (tc.quickAction.targetPortal) {
      opdStore.setPortal(tc.quickAction.targetPortal);
      if (tc.quickAction.targetRole) {
        opdStore.setOpdRole(tc.quickAction.targetRole);
      }
      if (onNavigateToPortal) {
        onNavigateToPortal(tc.quickAction.targetPortal, tc.quickAction.targetRole);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full my-auto overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xl shrink-0">
              <ShieldCheck className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Continuous QA & Validation Center
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  v2.4 Ready
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                Vyuhaa Continuum Testing Engine & QA Suite
              </h2>
              <p className="text-xs text-indigo-200/80">
                Execute structured end-to-end clinical scenarios, verify automated system health, and generate PDF test plans.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            {/* Quick PDF Download button */}
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition cursor-pointer"
              title="Download QA Test Plan PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Test Plan</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Test Progress KPI Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold text-[11px] uppercase">Pass Rate:</span>
              <span className="font-black text-emerald-700 text-sm">{stats.passRate}%</span>
              <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.passRate}%` }} 
                />
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[11px]">
              <span className="text-slate-600 font-medium">
                Total: <strong>{stats.total}</strong>
              </span>
              <span className="text-emerald-700 font-bold">
                Passed: {stats.passed}
              </span>
              {stats.failed > 0 && (
                <span className="text-rose-700 font-bold">
                  Failed: {stats.failed}
                </span>
              )}
              {stats.untested > 0 && (
                <span className="text-slate-500">
                  Untested: {stats.untested}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
              <span>Tester:</span>
              <input
                type="text"
                value={testerName}
                onChange={(e) => setTesterName(e.target.value)}
                className="px-2 py-0.5 rounded border border-slate-300 bg-white text-xs font-semibold w-24 text-slate-800"
              />
            </div>

            <button
              onClick={() => testSuiteService.markAllPassed()}
              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] transition cursor-pointer"
            >
              Mark All Passed
            </button>
            <button
              onClick={() => testSuiteService.resetAllTests()}
              className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-[11px] transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {downloadSuccessToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 text-emerald-900 text-xs flex items-center justify-between font-semibold animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{downloadSuccessToast}</span>
            </div>
            <button onClick={() => setDownloadSuccessToast(null)} className="text-emerald-700 font-bold">✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 bg-white overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'matrix'
                ? 'border-indigo-600 text-indigo-900 bg-indigo-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Interactive Test Matrix ({testCases.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('automated');
              if (!automatedResults && !isAutomatedRunning) {
                handleRunAutomatedSuite();
              }
            }}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'automated'
                ? 'border-indigo-600 text-indigo-900 bg-indigo-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>Automated Verification Runner</span>
            {automatedResults && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'pdf'
                ? 'border-indigo-600 text-indigo-900 bg-indigo-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>PDF Test Document & Print</span>
          </button>

          <button
            onClick={() => setActiveTab('fixtures')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'fixtures'
                ? 'border-indigo-600 text-indigo-900 bg-indigo-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Quick Scenario Launchers</span>
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* ======================================================== */}
          {/* TAB 1: INTERACTIVE TEST MATRIX */}
          {/* ======================================================== */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-700">Suite:</span>
                  <select
                    value={selectedSuite}
                    onChange={(e) => setSelectedSuite(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="all">All Suites (5)</option>
                    <option value="AUTH">Suite 1: Single-App & Roles</option>
                    <option value="LAB_OCR">Suite 2: Pathology OCR & ABDM</option>
                    <option value="ANALYSER">Suite 3: Diagnostic Analyser</option>
                    <option value="ONDC">Suite 4: ONDC Network & Vendors</option>
                    <option value="CLINICAL">Suite 5: Clinical OPD & Rx</option>
                  </select>

                  <span className="font-bold text-slate-700 ml-2">Status:</span>
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="all">All Statuses</option>
                    <option value="PASS">Pass Only</option>
                    <option value="FAIL">Fail Only</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="UNTESTED">Untested</option>
                  </select>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search test case or persona..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Test Cases List */}
              <div className="space-y-3">
                {filteredTests.map((tc) => {
                  const isPass = tc.status === 'PASS';
                  const isFail = tc.status === 'FAIL';
                  const isProg = tc.status === 'IN_PROGRESS';

                  return (
                    <div 
                      key={tc.id} 
                      className={`p-4 rounded-2xl border transition text-xs space-y-3 ${
                        isPass ? 'bg-white border-emerald-200 shadow-2xs hover:border-emerald-300' :
                        isFail ? 'bg-rose-50/40 border-rose-300 shadow-2xs' :
                        isProg ? 'bg-amber-50/40 border-amber-300 shadow-2xs' :
                        'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
                            {tc.id}
                          </span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            {tc.title}
                          </span>
                        </div>

                        {/* Status Toggle Buttons */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <button
                            onClick={() => handleStatusChange(tc.id, 'PASS')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition cursor-pointer ${
                              isPass 
                                ? 'bg-emerald-600 text-white shadow-xs' 
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>PASS</span>
                          </button>

                          <button
                            onClick={() => handleStatusChange(tc.id, 'FAIL')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition cursor-pointer ${
                              isFail 
                                ? 'bg-rose-600 text-white shadow-xs' 
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-800'
                            }`}
                          >
                            <XCircle className="w-3 h-3" />
                            <span>FAIL</span>
                          </button>

                          <button
                            onClick={() => handleStatusChange(tc.id, 'IN_PROGRESS')}
                            className={`px-2 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                              isProg 
                                ? 'bg-amber-600 text-white shadow-xs' 
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                            }`}
                          >
                            Testing
                          </button>
                        </div>
                      </div>

                      {/* Description & Persona */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                        <div className="md:col-span-2">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Objective</span>
                          <p className="text-slate-700 mt-0.5 leading-relaxed">{tc.description}</p>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Persona & Login</span>
                          <span className="font-bold text-slate-900 block mt-0.5">{tc.persona}</span>
                          <span className="font-mono text-slate-600 text-[10px]">
                            User: <strong className="text-indigo-700">{tc.credentials.username}</strong> / Key: <strong>{tc.credentials.passcode}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Step-by-Step Instructions */}
                      <div>
                        <span className="font-bold text-slate-800 block mb-1 text-[11px]">Verification Steps:</span>
                        <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                          {tc.steps.map((st, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2 text-[11px] text-slate-700">
                              <span className="font-bold text-slate-400 w-4 shrink-0">{sIdx + 1}.</span>
                              <span>{st}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expected Result & Quick Action Launcher */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                        <div className="flex-1">
                          <span className="font-bold text-teal-800">Expected Result: </span>
                          <span className="text-slate-700">{tc.expectedResult}</span>
                        </div>

                        {tc.quickAction && (
                          <button
                            type="button"
                            onClick={() => handleQuickAction(tc)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-extrabold text-[11px] flex items-center gap-1.5 transition cursor-pointer border border-indigo-200 shrink-0 self-end sm:self-auto"
                          >
                            <ExternalLink className="w-3 h-3 text-indigo-600" />
                            <span>{tc.quickAction.label}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: AUTOMATED VERIFICATION RUNNER */}
          {/* ======================================================== */}
          {activeTab === 'automated' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <h3 className="font-bold text-base text-white">
                    Automated System Verification Suite
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Runs real-time schema assertions on OPD Store, Multi-Role Auth, FHIR Bundles, Mentzer Index Logic, and ONDC Gateway.
                  </p>
                </div>

                <button
                  disabled={isAutomatedRunning}
                  onClick={handleRunAutomatedSuite}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow transition cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAutomatedRunning ? 'animate-spin' : ''}`} />
                  <span>{isAutomatedRunning ? 'Executing Test Checks...' : 'Re-Run All Automated Tests'}</span>
                </button>
              </div>

              {automatedResults ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                    <span>
                      Tests Run: <strong>{automatedResults.length}</strong> • Passed: <strong className="text-emerald-700">{automatedResults.filter(r => r.status === 'PASS').length}</strong>
                    </span>
                    <span>Total Latency: <strong>{automatedDuration} ms</strong></span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {automatedResults.map(res => (
                      <div 
                        key={res.id} 
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                          res.status === 'PASS' 
                            ? 'bg-white border-emerald-200 shadow-2xs' 
                            : 'bg-rose-50 border-rose-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-slate-900">{res.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            res.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {res.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 font-medium">
                          {res.details}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                          <span>{res.category} Module</span>
                          <span>{res.durationMs} ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <Activity className="w-8 h-8 text-indigo-400 mx-auto animate-pulse mb-2" />
                  <span>Click above to execute all automated test assertions.</span>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PDF TEST DOCUMENT PREVIEW & PRINT */}
          {/* ======================================================== */}
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              {/* PDF Action Banner */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 p-5 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                    Printable QA Manual & Binary PDF
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Download Official QA Test Plan PDF Document
                  </h3>
                  <p className="text-xs text-emerald-200/80 max-w-xl">
                    Multi-page official PDF containing Document Control, User Credentials Matrix, Detailed Test Steps, Clinical OCR Rubric, and QA Sign-Off Sheets.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF (.pdf)</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Page</span>
                  </button>
                </div>
              </div>

              {/* Printable Document Preview Container */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-sm space-y-6 text-xs text-slate-800 font-sans">
                
                {/* Document Header in Preview */}
                <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-black text-slate-950 tracking-tight">
                      VYUHAA CONTINUUM CARE — TEST PLAN & VALIDATION MANUAL
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Unified Hospital OPD • Multimodal Pathology OCR • Diagnostic Analyser • ONDC Health Network
                    </p>
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-500">
                    <div>Doc ID: VYU-QA-2026-v2.4</div>
                    <div className="font-bold text-emerald-700">STATUS: APPROVED</div>
                  </div>
                </div>

                {/* Section Preview: Executive Summary */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-900">
                    1. Executive Testing Scope
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    This validation manual defines test execution procedures for testing teams, clinical consultants, and ONDC network participants. Testers evaluate role isolation (Admin, Doctors, Front-Desk, Pathologists, Pharmacists), live OCR extraction from uploaded diagnostic PDFs, clinical multi-parameter correlation (anemia Mentzer index, DIPSI gestational diabetes, thyroid TSH), ABDM NRCeS FHIR R4 DiagnosticReport synchronization, and ONDC BPP seller node onboarding.
                  </p>
                </div>

                {/* Section Preview: Credentials Table */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-900">
                    2. User Credentials & Access Roles Matrix
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900 text-white font-bold text-[10px]">
                        <tr>
                          <th className="p-2">Role Persona</th>
                          <th className="p-2">Assigned Desk / Store</th>
                          <th className="p-2">Username</th>
                          <th className="p-2">Passcode</th>
                          <th className="p-2">ONDC Node</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-2 font-bold">Hospital Admin</td>
                          <td className="p-2 text-slate-500">Superintendent Office</td>
                          <td className="p-2 font-mono font-bold text-rose-700">admin</td>
                          <td className="p-2 text-slate-500">admin123</td>
                          <td className="p-2 font-mono text-indigo-700 font-bold">BAP-HOSP-001</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">Consultant OB/GYN</td>
                          <td className="p-2 text-slate-500">Room 4 Maternal Suite</td>
                          <td className="p-2 font-mono font-bold text-rose-700">anita</td>
                          <td className="p-2 text-slate-500">doctor123</td>
                          <td className="p-2 text-slate-400">—</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">Triage Nurse (Reception)</td>
                          <td className="p-2 text-slate-500">Central Front-Desk Triage</td>
                          <td className="p-2 font-mono font-bold text-rose-700">reception</td>
                          <td className="p-2 text-slate-500">nurse123</td>
                          <td className="p-2 text-slate-400">—</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">Pathologist Vendor</td>
                          <td className="p-2 text-slate-500">Apex Diagnostic Hub</td>
                          <td className="p-2 font-mono font-bold text-rose-700">apexlab</td>
                          <td className="p-2 text-slate-500">vendor123</td>
                          <td className="p-2 font-mono text-indigo-700 font-bold">BPP-LAB-APEX-092</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">Pharmacy Vendor</td>
                          <td className="p-2 text-slate-500">PM Jan Aushadhi Kendra #5048</td>
                          <td className="p-2 font-mono font-bold text-rose-700">janaushadhi</td>
                          <td className="p-2 text-slate-500">vendor123</td>
                          <td className="p-2 font-mono text-indigo-700 font-bold">BPP-PHARM-5048</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section Preview: Clinical Rubric */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-900">
                    3. Pathology OCR & Diagnostic Analyser Clinical Rubric
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900">Anemia Mentzer Index Formula:</strong>
                      <p className="text-slate-600 mt-0.5">Mentzer = MCV / RBC. Value &gt; 13: Iron deficiency; Value &lt; 13: Thalassemia trait.</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-900">Gestational Diabetes (DIPSI/ACOG):</strong>
                      <p className="text-slate-600 mt-0.5">Fasting &gt;= 92 mg/dL or 2-hr &gt;= 153 mg/dL. Triggers immediate nutrition therapy flag.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Full 5-page QA manual included in download.</span>
                  <button
                    onClick={handleDownloadPdf}
                    className="font-bold text-indigo-700 hover:text-indigo-900 underline"
                  >
                    Click to download complete file →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: QUICK SCENARIO LAUNCHERS & DATA FIXTURES */}
          {/* ======================================================== */}
          {activeTab === 'fixtures' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  One-Click QA Scenario Launchers
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-load authentication state, target hospital desks, and workflows in one click.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 1. Pathologist Desk */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-purple-700" />
                    <div>
                      <span className="font-extrabold text-slate-900 block">Scenario 1: Pathologist OCR Workflow</span>
                      <span className="text-[11px] text-slate-500">Apex Diagnostic Hub (ONDC Node)</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Log in as Dr. Sudhir Shenoy, open Pathology Lab portal, and test PDF upload & OCR deciphering.
                  </p>
                  <button
                    onClick={() => {
                      authService.quickLogin('user-lab-apex');
                      opdStore.setSelectedLab('lab-apex');
                      opdStore.setPortal('LAB');
                      if (onNavigateToPortal) onNavigateToPortal('LAB');
                      onClose();
                    }}
                    className="w-full py-2 bg-purple-800 hover:bg-purple-900 text-white font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Launch as Pathologist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Doctor Consultation */}
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-rose-700" />
                    <div>
                      <span className="font-extrabold text-slate-900 block">Scenario 2: OB/GYN Consultation Desk</span>
                      <span className="text-[11px] text-slate-500">Dr. Anita Rao • Room 4 Maternal Suite</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Test patient consultation, foetal heart monitoring, e-prescriptions, and diagnostic analyser insights.
                  </p>
                  <button
                    onClick={() => {
                      authService.quickLogin('user-doc-anita');
                      opdStore.setDoctorProfile('doc-anita');
                      opdStore.setPortal('OPD');
                      opdStore.setOpdRole('DOCTOR');
                      if (onNavigateToPortal) onNavigateToPortal('OPD', 'DOCTOR');
                      onClose();
                    }}
                    className="w-full py-2 bg-rose-800 hover:bg-rose-900 text-white font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Launch as OB/GYN Doctor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. Jan Aushadhi Chemist */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-700" />
                    <div>
                      <span className="font-extrabold text-slate-900 block">Scenario 3: PM Jan Aushadhi Chemist</span>
                      <span className="text-[11px] text-slate-500">Kendra #5048 (ONDC Seller Node)</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Test e-prescription dispensing, generic drug substitutions, and patient savings calculation.
                  </p>
                  <button
                    onClick={() => {
                      authService.quickLogin('user-pharma-janaushadhi');
                      opdStore.setSelectedPharmacy('pharm-janaushadhi');
                      opdStore.setPortal('PHARMA');
                      if (onNavigateToPortal) onNavigateToPortal('PHARMA');
                      onClose();
                    }}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Launch as Jan Aushadhi Pharmacist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4. Hospital Admin & ONDC Hub */}
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-slate-800" />
                    <div>
                      <span className="font-extrabold text-slate-900 block">Scenario 4: Hospital Governance & ONDC Hub</span>
                      <span className="text-[11px] text-slate-500">Superintendent Dr. Radhika Sen</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Test hospital census, room reallocations, ONDC vendor network nodes, and live Beckn protocol feed.
                  </p>
                  <button
                    onClick={() => {
                      authService.quickLogin('user-admin');
                      opdStore.setPortal('ADMIN');
                      if (onNavigateToPortal) onNavigateToPortal('ADMIN');
                      onClose();
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Launch as Hospital Admin</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Vyuhaa Continuum Quality Assurance Suite • Ready for Team Testing</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Test Plan PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition"
            >
              Close Test Center
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
