import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Fingerprint, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  Globe,
  IndianRupee,
  Check,
  UserCheck,
  MapPin
} from 'lucide-react';
import { opdStore } from '../../services/opdStore';

interface NewPatientModalProps {
  onClose: () => void;
  onPatientEnrolled: () => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  onClose,
  onPatientEnrolled
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Mobile & OTP
  const [mobile, setMobile] = useState('+91 98452 33411');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Step 2: ABHA / Demographics
  const [hasAbhaConsent, setHasAbhaConsent] = useState<boolean>(true);
  const [abhaId, setAbhaId] = useState('91-8842-1049-2311');
  const [name, setName] = useState('Sunita Das');
  const [age, setAge] = useState<number>(28);
  const [dob, setDob] = useState('1998-04-12');
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('female');
  const [address, setAddress] = useState('Unkal, Hubballi, Karnataka - 580031');
  const [abhaRetrieved, setAbhaRetrieved] = useState(true);

  // Preferred Language for WhatsApp & Alerts (Hindi & Bengali supported)
  const [preferredLanguage, setPreferredLanguage] = useState<'Hindi' | 'Bengali' | 'English'>('Bengali');

  // Consulting Fee & Scheme
  const [billingScheme, setBillingScheme] = useState<'JSSK / NHM (Free Antenatal)' | 'General OPD (Paid - ₹300)' | 'Specialty OPD (Paid - ₹500)'>('JSSK / NHM (Free Antenatal)');
  const [consultationFee, setConsultationFee] = useState<number>(0);

  // Step 3: Pathway & Clinical Details
  type PatientEnrollmentPathway = 'ANC' | 'PNC' | 'NEWBORN' | 'GENERAL';
  const [enrollmentPathway, setEnrollmentPathway] = useState<PatientEnrollmentPathway>('ANC');

  // Antenatal
  const [isPregnant, setIsPregnant] = useState(true);
  const [lmp, setLmp] = useState('2026-03-01');
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState(28);
  const [previousChildren, setPreviousChildren] = useState(1);
  const [previousOutcome, setPreviousOutcome] = useState('Normal delivery');
  const [gravida, setGravida] = useState(2);
  const [para, setPara] = useState(1);
  const [selectedFlags, setSelectedFlags] = useState<string[]>(['Rh Negative (O-)']);

  // Newborn specific
  const [birthWeightKg, setBirthWeightKg] = useState<number>(3.1);
  const [deliveryType, setDeliveryType] = useState<'Normal Vaginal' | 'Caesarean (LSCS)' | 'Assisted Vacuum/Forceps'>('Normal Vaginal');
  const [maternalBloodGroup, setMaternalBloodGroup] = useState<string>('B Positive (B+)');

  // Postnatal specific
  const [deliveryDate, setDeliveryDate] = useState<string>('2026-08-28');
  const [infantFeeding, setInfantFeeding] = useState<'Exclusive Breastfeeding' | 'Formula' | 'Mixed'>('Exclusive Breastfeeding');
  const [postnatalComplications, setPostnatalComplications] = useState<string[]>(['History of GDM']);

  const [visitReason, setVisitReason] = useState('Antenatal follow-up & Glucose screening');

  const availableFlags = ['Rh Negative (O-)', 'Mild Anaemia', 'Previous LSCS', 'GDM suspect', 'Hypertension'];

  const handlePathwaySelect = (pathway: PatientEnrollmentPathway) => {
    setEnrollmentPathway(pathway);
    if (pathway === 'ANC') {
      setIsPregnant(true);
      setBillingScheme('JSSK / NHM (Free Antenatal)');
      setConsultationFee(0);
      setVisitReason('Antenatal follow-up & Glucose screening');
    } else if (pathway === 'PNC') {
      setIsPregnant(false);
      setBillingScheme('JSSK / NHM (Free Antenatal)');
      setConsultationFee(0);
      setVisitReason('Postnatal 6-week maternal recovery & 75g OGTT check');
    } else if (pathway === 'NEWBORN') {
      setIsPregnant(false);
      setAge(0);
      setBillingScheme('JSSK / NHM (Free Antenatal)');
      setConsultationFee(0);
      setVisitReason('Newborn routine checkup & 6-week immunization dose');
      if (!name || name === 'Sunita Das') setName('Baby Reyansh');
    } else {
      setIsPregnant(false);
      setBillingScheme('General OPD (Paid - ₹300)');
      setConsultationFee(300);
      setVisitReason('Gynaecological consultation / health check');
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtp('584210'); // Auto-fill mock OTP for quick reception demo
  };

  const handleVerifyOtp = () => {
    setOtpVerified(true);
    setStep(2);
  };

  const handleRetrieveAbha = () => {
    setAbhaRetrieved(true);
    setName(enrollmentPathway === 'NEWBORN' ? 'Baby Reyansh' : 'Sunita Das');
    setAge(enrollmentPathway === 'NEWBORN' ? 0 : 28);
    setGender(enrollmentPathway === 'NEWBORN' ? 'male' : 'female');
    setAddress('Unkal, Hubballi, Karnataka - 580031');
  };

  // Skip ABHA completely when patient does not consent
  const handleSkipAbha = () => {
    setHasAbhaConsent(false);
    setAbhaId('Skipped (Consent Declined)');
    if (!name) setName(enrollmentPathway === 'NEWBORN' ? 'Baby of Sunita' : 'Amina Begum');
    setStep(3);
  };

  const handleSchemeChange = (scheme: typeof billingScheme) => {
    setBillingScheme(scheme);
    if (scheme === 'JSSK / NHM (Free Antenatal)') {
      setConsultationFee(0);
    } else if (scheme === 'General OPD (Paid - ₹300)') {
      setConsultationFee(300);
    } else {
      setConsultationFee(500);
    }
  };

  const handleStartOpdVisit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNewbornPatient = enrollmentPathway === 'NEWBORN';
    const isAncPatient = enrollmentPathway === 'ANC';
    const isPncPatient = enrollmentPathway === 'PNC';

    opdStore.startOpdVisit({
      mobile,
      abhaId: hasAbhaConsent ? abhaId : 'Skipped (Consent Declined)',
      hasAbhaConsent,
      name: name || (isNewbornPatient ? 'Baby Reyansh' : 'Sunita Das'),
      age: isNewbornPatient ? 0 : age,
      gender: isNewbornPatient ? gender : gender,
      dob: isNewbornPatient ? '2026-09-19' : dob,
      address,
      preferredLanguage,
      consultationFee,
      billingScheme,
      isPregnant: isAncPatient,
      isNewborn: isNewbornPatient,
      birthDetails: isNewbornPatient ? {
        birthWeightKg,
        deliveryType,
        maternalBloodGroup
      } : undefined,
      postnatalDetails: isPncPatient ? {
        deliveryDate,
        deliveryType,
        infantFeeding,
        complications: postnatalComplications
      } : undefined,
      pregnancy: isAncPatient ? {
        lmp,
        gestationalAgeWeeks,
        edd: '15 Dec 2026',
        previousChildren,
        previousOutcome,
        gravida,
        para,
        clinicalFlags: selectedFlags
      } : undefined,
      visitReason,
      visitType: isNewbornPatient ? 'Immunisation' : isAncPatient ? 'ANC' : isPncPatient ? 'PNC' : 'General'
    });

    onPatientEnrolled();
    onClose();
  };

  const toggleFlag = (flag: string) => {
    if (selectedFlags.includes(flag)) {
      setSelectedFlags(selectedFlags.filter(f => f !== flag));
    } else {
      setSelectedFlags([...selectedFlags, flag]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Header */}
        <div className="p-4 bg-teal-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">New Patient OPD Enrolment</h2>
            <p className="text-xs text-teal-200">
              Optional ABHA, Multilingual WhatsApp Alerts (Hindi/Bengali), & Clinic Token.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-teal-300 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper bar */}
        <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-teal-800' : step > 1 ? 'text-emerald-700' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-teal-700 text-white' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
              {step > 1 ? '✓' : '1'}
            </span>
            <span>Mobile OTP</span>
          </div>

          <span className="text-slate-300">→</span>

          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-teal-800 font-bold' : step > 2 ? 'text-emerald-700' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-teal-700 text-white' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
              {step > 2 ? '✓' : '2'}
            </span>
            <span>Optional ABHA</span>
          </div>

          <span className="text-slate-300">→</span>

          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-teal-800 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-teal-700 text-white' : 'bg-slate-300 text-slate-700'}`}>
              3
            </span>
            <span>Language & OPD</span>
          </div>
        </div>

        {/* Step 1: Mobile & OTP */}
        {step === 1 && (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Patient Mobile Number (WhatsApp-enabled)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-teal-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  Send OTP
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-950 text-xs">Enter 6-Digit OTP</span>
                  <span className="text-[10px] text-teal-700 font-mono">Demo: 584210</span>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  placeholder="584210"
                  className="w-full text-center tracking-widest text-lg font-mono font-black p-2 border border-teal-300 rounded-xl bg-white"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Verify Mobile & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Optional ABHA Consent & Demographics */}
        {step === 2 && (
          <div className="p-5 space-y-4">
            {/* Consent banner: explicit choice to Link or Skip */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="font-bold text-slate-800 block text-xs">
                ABHA ID Linking Consent
              </span>
              <p className="text-[11px] text-slate-600">
                ABHA ID linking is purely optional. Patients may proceed with normal OPD registration without ABHA.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="abhaChoice"
                    checked={hasAbhaConsent}
                    onChange={() => setHasAbhaConsent(true)}
                    className="text-teal-700"
                  />
                  <span className="font-bold text-teal-950 text-xs">Yes, link ABHA</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="abhaChoice"
                    checked={!hasAbhaConsent}
                    onChange={handleSkipAbha}
                    className="text-slate-600"
                  />
                  <span className="font-semibold text-slate-600 text-xs">Skip ABHA (No consent)</span>
                </label>
              </div>
            </div>

            {!hasAbhaConsent ? (
              /* If patient opts out of ABHA */
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950 block text-xs">
                      ABHA Opt-Out Acknowledged
                    </span>
                    <p className="text-[11px] text-amber-800">
                      The patient will be registered for OPD directly. Demographics can be entered below.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-0.5">Patient Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Amina Begum"
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block mb-0.5">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue Directly to OPD & Language</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* If patient consents, allow ABHA lookup */
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-800 block text-xs mb-1">
                    ABHA Address / Health ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={abhaId}
                      onChange={(e) => setAbhaId(e.target.value)}
                      placeholder="91-8842-1049-2311"
                      className="flex-1 p-2 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleRetrieveAbha}
                      className="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                      <span>Retrieve</span>
                    </button>
                  </div>
                </div>

                {abhaRetrieved && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span className="font-extrabold text-emerald-950 block text-xs">
                        ABHA Demographic Record Retrieved:
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-800 text-[11px] bg-white p-2.5 rounded-xl border border-emerald-100">
                      <p><strong>Name:</strong> {name}</p>
                      <p><strong>Age:</strong> {age} years ({gender})</p>
                      <p><strong>Mobile:</strong> {mobile}</p>
                      <p><strong>ABHA ID:</strong> {abhaId}</p>
                      <p className="col-span-2"><strong>Address:</strong> {address}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed with Demographics</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipAbha}
                    className="px-3 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl cursor-pointer"
                    title="Skip ABHA and proceed without linking"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Basic OPD, Language Selection, and Consultation Fee */}
        {step === 3 && (
          <form onSubmit={handleStartOpdVisit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-teal-700" />
              <span>Step 3 — Clinic Selection, Language & Reason</span>
            </h3>

            {/* Multilingual Alerts Selection (Hindi & Bengali supported) */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-700" />
                  <span>Preferred Language for WhatsApp & Alerts</span>
                </span>
                <span className="text-[10px] text-blue-700 font-bold">Try Hindi & Bengali</span>
              </div>
              <p className="text-[11px] text-blue-800">
                Patient will receive all tokens, prescription instructions, lab updates, and follow-up notes in this language:
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1 font-bold">
                <button
                  type="button"
                  onClick={() => setPreferredLanguage('Bengali')}
                  className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer ${
                    preferredLanguage === 'Bengali'
                      ? 'bg-blue-800 text-white border-blue-800 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs">বাংলা</span>
                  <span className="text-[10px] opacity-80 block">(Bengali)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredLanguage('Hindi')}
                  className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer ${
                    preferredLanguage === 'Hindi'
                      ? 'bg-blue-800 text-white border-blue-800 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs">हिन्दी</span>
                  <span className="text-[10px] opacity-80 block">(Hindi)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredLanguage('English')}
                  className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer ${
                    preferredLanguage === 'English'
                      ? 'bg-blue-800 text-white border-blue-800 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs">English</span>
                  <span className="text-[10px] opacity-80 block">(Standard)</span>
                </button>
              </div>
            </div>

            {/* Consulting Fee & Billing Scheme */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
              <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                <span>Consulting Fee & Scheme</span>
              </span>

              <div className="space-y-1.5">
                {[
                  { label: 'JSSK / NHM Scheme (Free Antenatal — ₹0)', val: 'JSSK / NHM (Free Antenatal)' },
                  { label: 'General OPD Consultation (Standard — ₹300)', val: 'General OPD (Paid - ₹300)' },
                  { label: 'Specialty Doctor Consultation (Pediatrics/High-Risk — ₹500)', val: 'Specialty OPD (Paid - ₹500)' }
                ].map(sch => (
                  <label
                    key={sch.val}
                    className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition text-xs ${
                      billingScheme === sch.val
                        ? 'bg-white border-emerald-600 font-bold text-emerald-950 shadow-2xs'
                        : 'bg-emerald-50/40 border-transparent text-slate-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="billingScheme"
                        checked={billingScheme === sch.val}
                        onChange={() => handleSchemeChange(sch.val as any)}
                        className="text-emerald-700"
                      />
                      <span>{sch.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Clinical Care Pathway Selection */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <span className="font-extrabold text-slate-900 block text-xs">
                Clinical Care Pathway &amp; Patient Category:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'ANC', label: 'Antenatal Mother', sub: 'Pregnancy Care' },
                  { id: 'PNC', label: 'Postnatal Mother', sub: 'Postpartum (PNC)' },
                  { id: 'NEWBORN', label: 'Newborn / Infant', sub: 'NIS Immunization' },
                  { id: 'GENERAL', label: 'General / Gynae', sub: 'OPD Consultation' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePathwaySelect(p.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      enrollmentPathway === p.id
                        ? 'bg-teal-900 text-white border-teal-950 shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-xs">{p.label}</span>
                    <span className={`text-[9px] mt-0.5 ${enrollmentPathway === p.id ? 'text-teal-200' : 'text-slate-500'}`}>
                      {p.sub}
                    </span>
                  </button>
                ))}
              </div>

              {/* Pathway 1: Antenatal Details */}
              {enrollmentPathway === 'ANC' && (
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Gestational Age (Weeks)</label>
                    <input
                      type="number"
                      value={gestationalAgeWeeks}
                      onChange={(e) => setGestationalAgeWeeks(Number(e.target.value))}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Gravida / Para</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="G"
                        value={gravida}
                        onChange={(e) => setGravida(Number(e.target.value))}
                        className="w-1/2 p-1.5 border border-slate-200 rounded-lg bg-white text-center"
                      />
                      <input
                        type="number"
                        placeholder="P"
                        value={para}
                        onChange={(e) => setPara(Number(e.target.value))}
                        className="w-1/2 p-1.5 border border-slate-200 rounded-lg bg-white text-center"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">High-Risk / Clinical Flags</label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableFlags.map(flag => (
                        <button
                          type="button"
                          key={flag}
                          onClick={() => toggleFlag(flag)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                            selectedFlags.includes(flag)
                              ? 'bg-rose-100 text-rose-900 border-rose-300'
                              : 'bg-white text-slate-600 border-slate-200'
                          }`}
                        >
                          {flag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pathway 2: Postnatal Details */}
              {enrollmentPathway === 'PNC' && (
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Delivery Type</label>
                    <select
                      value={deliveryType}
                      onChange={(e) => setDeliveryType(e.target.value as any)}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Normal Vaginal">Normal Vaginal</option>
                      <option value="Caesarean (LSCS)">Caesarean (LSCS)</option>
                      <option value="Assisted Vacuum/Forceps">Assisted Vacuum/Forceps</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-600 font-semibold mb-0.5">Infant Feeding Mode</label>
                    <select
                      value={infantFeeding}
                      onChange={(e) => setInfantFeeding(e.target.value as any)}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Exclusive Breastfeeding">Exclusive Breastfeeding (EBF)</option>
                      <option value="Formula">Formula Feeding</option>
                      <option value="Mixed">Mixed Feeding</option>
                    </select>
                  </div>

                  <div className="col-span-2 p-2 bg-purple-50 rounded-xl border border-purple-200 text-[10px] text-purple-900">
                    🔬 Postnatal diagnostic protocols (Day 1–3 and 6-Week 75g OGTT GDM reclassification, postpartum thyroid TSH, and EPDS) will be active.
                  </div>
                </div>
              )}

              {/* Pathway 3: Newborn Details */}
              {enrollmentPathway === 'NEWBORN' && (
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Birth Weight (kg)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={birthWeightKg}
                      onChange={(e) => setBirthWeightKg(Number(e.target.value))}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Delivery Type</label>
                    <select
                      value={deliveryType}
                      onChange={(e) => setDeliveryType(e.target.value as any)}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Normal Vaginal">Normal Vaginal</option>
                      <option value="Caesarean (LSCS)">Caesarean (LSCS)</option>
                      <option value="Assisted Vacuum/Forceps">Assisted Vacuum/Forceps</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-600 font-semibold mb-0.5">Maternal Blood Group</label>
                    <input
                      type="text"
                      value={maternalBloodGroup}
                      onChange={(e) => setMaternalBloodGroup(e.target.value)}
                      placeholder="e.g. B Positive (B+)"
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div className="col-span-2 p-2 bg-sky-50 rounded-xl border border-sky-200 text-[10px] text-sky-900">
                    👶 National Immunization Schedule (Birth, 6w, 10w, 14w, 9-12m, 16-24m, 5-6y) with digital MCP Card tracking and WhatsApp alerts will be auto-generated.
                  </div>
                </div>
              )}
            </div>

            {/* Visit Reason */}
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Reason for OPD Consultation
              </label>
              <input
                type="text"
                value={visitReason}
                onChange={(e) => setVisitReason(e.target.value)}
                placeholder="e.g. Antenatal follow-up, BP check, screening"
                className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white"
              />
            </div>

            {/* Enrol & Generate Token Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white font-extrabold rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2 text-sm transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Issue OPD Token & Sync Patient WhatsApp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
