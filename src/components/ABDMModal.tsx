import React, { useState } from 'react';
import { 
  X, 
  Fingerprint, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Search, 
  FileCode2,
  Building2,
  Lock
} from 'lucide-react';
import { abdmService, ABHAPatientProfile } from '../services/abdmService';

interface ABDMModalProps {
  onClose: () => void;
}

export const ABDMModal: React.FC<ABDMModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'lookup' | 'fhir'>('create');
  
  // ABHA Creation State
  const [aadhaarInput, setAadhaarInput] = useState('5544 3322 1100');
  const [desiredAddress, setDesiredAddress] = useState('sunita.devi');
  const [otpInput, setOtpInput] = useState('');
  const [txnId, setTxnId] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [createdProfile, setCreatedProfile] = useState<ABHAPatientProfile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ABHA Lookup State
  const [lookupQuery, setLookupQuery] = useState('91-8842-1049-2311');
  const [lookupResult, setLookupResult] = useState<ABHAPatientProfile | null>(null);

  // FHIR Bundle Preview
  const fhirSample = abdmService.generateFHIRBundleForPregnancy('PREG-2026-001', {
    id: 'PAT-001',
    name: 'Sunita D.',
    abhaNumber: '91-8842-1049-2311',
    mobile: '+91 98452 11029',
    gender: 'female'
  });

  const handleGenerateOtp = async () => {
    setIsProcessing(true);
    try {
      const res = await abdmService.generateOtpForAadhaar(aadhaarInput.replace(/\s+/g, ''));
      setTxnId(res.txnId);
      setOtpSentMessage(res.message);
      setOtpInput('123456'); // Pre-fill mock OTP for smooth demo
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsProcessing(true);
    try {
      const profile = await abdmService.verifyOtpAndCreateAbha(txnId, otpInput, desiredAddress);
      setCreatedProfile(profile);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLookup = async () => {
    setIsProcessing(true);
    try {
      const profile = await abdmService.lookupPatientByAbha(lookupQuery);
      setLookupResult(profile);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 rounded-lg text-white">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>ABDM Integration Sandbox</span>
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-mono">
                  NRCeS India FHIR R4
                </span>
              </h2>
              <p className="text-xs text-emerald-200">
                Ayushman Bharat Digital Mission • Health Repository Provider (HRP)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-emerald-300 hover:text-white rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-200 bg-white flex items-center gap-6 text-xs font-semibold text-slate-600 shrink-0">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'create' ? 'border-emerald-700 text-emerald-900 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            ABHA Generation & OTP
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'lookup' ? 'border-emerald-700 text-emerald-900 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            ABHA Patient Lookup
          </button>
          <button
            onClick={() => setActiveTab('fhir')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'fhir' ? 'border-emerald-700 text-emerald-900 font-bold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            FHIR R4 Bundle Preview
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs space-y-4 bg-slate-50">
          {/* TAB 1: Create ABHA */}
          {activeTab === 'create' && (
            <div className="space-y-4 max-w-lg mx-auto">
              {!createdProfile ? (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
                  <h3 className="font-bold text-slate-900 text-sm">Create Verified ABHA ID via Aadhaar</h3>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Aadhaar Number (12-Digit)</label>
                    <input
                      type="text"
                      value={aadhaarInput}
                      onChange={(e) => setAadhaarInput(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Desired ABHA Address</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={desiredAddress}
                        onChange={(e) => setDesiredAddress(e.target.value)}
                        className="w-full p-2 border border-r-0 border-slate-200 rounded-l-lg text-xs font-mono"
                      />
                      <span className="p-2 bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg font-mono text-slate-500 text-xs">
                        @abdm
                      </span>
                    </div>
                  </div>

                  {!txnId ? (
                    <button
                      type="button"
                      onClick={handleGenerateOtp}
                      disabled={isProcessing}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer transition shadow-xs"
                    >
                      {isProcessing ? 'Generating OTP...' : 'Generate Aadhaar OTP'}
                    </button>
                  ) : (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="p-2 bg-emerald-50 rounded text-emerald-900 text-[11px] font-medium">
                        {otpSentMessage}
                      </div>

                      <div>
                        <label className="font-bold text-slate-800 block mb-1">Enter 6-Digit OTP</label>
                        <input
                          type="text"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono tracking-widest text-center text-lg"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isProcessing}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer transition shadow-xs"
                      >
                        {isProcessing ? 'Verifying with ABDM Sandbox...' : 'Verify OTP & Create ABHA'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white p-5 rounded-xl border border-emerald-300 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>ABHA Created & Verified Successfully!</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-lg space-y-1 font-mono text-[11px] text-emerald-950">
                    <p><strong>ABHA Number:</strong> {createdProfile.abhaNumber}</p>
                    <p><strong>ABHA Address:</strong> {createdProfile.abhaAddress}</p>
                    <p><strong>KYC Status:</strong> {createdProfile.kycStatus}</p>
                    <p><strong>Facility Linkage:</strong> District Hospital Hubballi (HRP)</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCreatedProfile(null);
                      setTxnId('');
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                  >
                    Enrol Another ABHA
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Lookup */}
          {activeTab === 'lookup' && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Query ABHA Health Repository</h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="Enter 14-digit ABHA or address..."
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleLookup}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Lookup
                  </button>
                </div>

                {lookupResult && (
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 mt-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="font-bold text-slate-900">{lookupResult.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">VERIFIED</span>
                    </div>
                    <p className="font-mono text-[11px] text-slate-700">ABHA: {lookupResult.abhaNumber}</p>
                    <p className="font-mono text-[11px] text-slate-700">Address: {lookupResult.abhaAddress}</p>
                    <p className="text-slate-600 text-[11px]">{lookupResult.district}, {lookupResult.state}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FHIR R4 Bundle */}
          {activeTab === 'fhir' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4 text-emerald-700" />
                  <span>NRCeS India FHIR R4 JSON Bundle (Patient & EpisodeOfCare)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Specification Compliant</span>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed border border-slate-800">
                {JSON.stringify(fhirSample, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
