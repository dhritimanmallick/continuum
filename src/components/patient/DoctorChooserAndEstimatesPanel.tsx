import React, { useState } from 'react';
import { 
  Stethoscope, 
  Calculator, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  PhoneCall, 
  MessageCircle, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  Info,
  Send
} from 'lucide-react';
import { opdStore } from '../../services/opdStore';
import { OpdPatient } from '../../types';

interface DoctorChooserAndEstimatesPanelProps {
  patient: OpdPatient;
  onBookDoctor?: (doctorId: string) => void;
  onRequestQuoteWhatsApp?: (quoteDetails: any) => void;
}

export const DoctorChooserAndEstimatesPanel: React.FC<DoctorChooserAndEstimatesPanelProps> = ({
  patient,
  onBookDoctor,
  onRequestQuoteWhatsApp
}) => {
  const doctors = opdStore.getDoctorProfiles();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || 'doc-anita');
  const [selectedPackage, setSelectedPackage] = useState<'NORMAL' | 'C_SECTION' | 'ANC_COMPREHENSIVE' | 'OPD_ONLY'>('NORMAL');
  const [roomTier, setRoomTier] = useState<'GENERAL' | 'SEMI_PRIVATE' | 'DELUXE_SINGLE'>('SEMI_PRIVATE');
  const [hasGovernmentInsurance, setHasGovernmentInsurance] = useState<boolean>(true); // JSSK / PM-JAY
  const [showQuoteToast, setShowQuoteToast] = useState(false);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  // Base pricing
  const packagePricing = {
    NORMAL: {
      title: 'Normal Vaginal Delivery (NVD) Package',
      basePrice: 32500,
      stayDays: '3 Days / 2 Nights',
      includes: [
        'Dedicated Labour Room (LDR) with continuous electronic fetal monitoring',
        'Senior Consultant OB/GYN attending and delivery charges',
        'Senior Paediatrician newborn evaluation at birth & APGAR score',
        'Newborn birth vaccinations (BCG, OPV-0, Hep-B birth dose)',
        'Routine postnatal nursing care, medications, and sterile maternity pack'
      ]
    },
    C_SECTION: {
      title: 'Caesarean Section (LSCS) Delivery Package',
      basePrice: 54000,
      stayDays: '5 Days / 4 Nights',
      includes: [
        'Major Operation Theatre (OT) suite, surgical consumables, and sterile drape kit',
        'Chief Obstetric Surgeon & Assistant Surgeon charges',
        'Consultant Anaesthesiologist pre-op evaluation and spinal anaesthesia',
        'High-Dependency Unit (HDU) monitoring for 24h post-op',
        'Neonatologist resuscitation readiness in OT & newborn nursery evaluation'
      ]
    },
    ANC_COMPREHENSIVE: {
      title: 'Full-Term Antenatal Care (ANC) Protocol Package',
      basePrice: 6500,
      stayDays: 'Outpatient Care',
      includes: [
        '3 Scheduled consultations with Dr. Anita Rao (OB/GYN)',
        'Level-II TIFFA Scan & 3rd Trimester Fetal Doppler Ultrasound',
        '75g Oral Glucose Tolerance Test (OGTT), CBC, Urine Routine, TSH',
        '2 Doses of Tdap Maternal Immunization'
      ]
    },
    OPD_ONLY: {
      title: 'Single Specialist Consultation & Clinical Review',
      basePrice: selectedDoctor.consultationFee || 500,
      stayDays: 'Day Consultation',
      includes: [
        'Detailed 20-min physical examination and obstetric palpation',
        'Vitals triage (BP, SpO2, FHR, BMI, Random Blood Sugar)',
        'E-Prescription with Jan Aushadhi 72% generic substitution',
        'My Care Journey patient continuity badge assignment'
      ]
    }
  };

  const roomSurcharge = {
    GENERAL: 0,
    SEMI_PRIVATE: 3500,
    DELUXE_SINGLE: 8500
  };

  const activePack = packagePricing[selectedPackage];
  const grossTotal = selectedPackage === 'OPD_ONLY' 
    ? (selectedDoctor.consultationFee || 500)
    : activePack.basePrice + (selectedPackage === 'ANC_COMPREHENSIVE' ? 0 : roomSurcharge[roomTier]);

  const jsskCoverage = hasGovernmentInsurance 
    ? (selectedPackage === 'NORMAL' || selectedPackage === 'C_SECTION' ? grossTotal : 0)
    : 0;

  const netPayable = grossTotal - jsskCoverage;

  const handleSendWhatsAppQuote = () => {
    setShowQuoteToast(true);
    if (onRequestQuoteWhatsApp) {
      onRequestQuoteWhatsApp({
        doctor: selectedDoctor.name,
        package: activePack.title,
        gross: grossTotal,
        schemeDiscount: jsskCoverage,
        net: netPayable
      });
    }
    setTimeout(() => setShowQuoteToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {showQuoteToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Official Estimate Quotation sent to patient WhatsApp <strong>{patient.mobile}</strong>. St. Anne Hospital billing desk notified!
            </span>
          </div>
          <button onClick={() => setShowQuoteToast(false)} className="text-emerald-700 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white border border-rose-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Transparent Hospital Billing &amp; Doctor Roster</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Choose Doctor &amp; Calculate Maternity Estimates
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Select your attending Obstetrician or Specialist, review room options, and get an itemized estimate for Normal Delivery or C-Section. 100% Cashless scheme coverage under JSSK &amp; PM-JAY is automatically calculated.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 shrink-0">
            <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold text-white block">JSSK / PM-JAY Cashless</span>
              <span className="text-slate-300 text-[11px]">Govt Scheme Zero Out-of-Pocket</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. DOCTOR SELECTION ROSTER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>👨‍⚕️</span>
            <span>1. Select Attending Doctor / Specialist</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">All doctors available for OPD &amp; In-Patient delivery</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctors.map(doc => {
            const isSelected = doc.id === selectedDoctorId;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctorId(doc.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                  isSelected 
                    ? 'bg-rose-50/50 border-rose-500 shadow-sm ring-1 ring-rose-500' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-xl shrink-0">
                      {doc.name.toLowerCase().includes('dr.') ? '👩‍⚕️' : '👨‍⚕️'}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{doc.name}</h4>
                      <p className="text-[11px] font-semibold text-rose-700">{doc.specialty}</p>
                      <p className="text-[10px] text-slate-500">{doc.qualification}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>4.9★</span>
                    <span className="text-slate-400 font-normal">(120+ deliveries)</span>
                  </div>
                  <div className="font-extrabold text-slate-900">
                    OPD: ₹{doc.consultationFee || 500}
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Room #{doc.roomNumber} • {doc.clinicName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MATERNITY & PROCEDURE PACKAGE CHOOSER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Packages & Customizer */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>💰</span>
            <span>2. Choose Maternity or Consultation Package</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'NORMAL', title: 'Normal Vaginal Delivery', price: '₹ 32,500', sub: '3 Days / 2 Nights', tag: 'Most Common' },
              { id: 'C_SECTION', title: 'Caesarean (LSCS) Delivery', price: '₹ 54,000', sub: '5 Days / 4 Nights', tag: 'Surgical OT' },
              { id: 'ANC_COMPREHENSIVE', title: 'Full Antenatal Protocol', price: '₹ 6,500', sub: '3 Visits + Scans + Tests', tag: 'OPD Package' },
              { id: 'OPD_ONLY', title: 'Specialist Consultation', price: `₹ ${selectedDoctor.consultationFee || 500}`, sub: 'Detailed Clinical Review', tag: 'Single Visit' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPackage(p.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedPackage === p.id 
                    ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>{p.sub}</span>
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">{p.tag}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                </div>
                <div className="text-base font-black text-rose-800 mt-2">
                  {p.price}
                </div>
              </button>
            ))}
          </div>

          {/* Room Selection (for Inpatient delivery) */}
          {(selectedPackage === 'NORMAL' || selectedPackage === 'C_SECTION') && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">Select Room Category</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'GENERAL', label: 'General Ward', surcharge: '+₹0' },
                  { id: 'SEMI_PRIVATE', label: 'Semi-Private (Twin)', surcharge: '+₹3,500' },
                  { id: 'DELUXE_SINGLE', label: 'Deluxe Single A/C', surcharge: '+₹8,500' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoomTier(r.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      roomTier === r.id 
                        ? 'bg-slate-900 text-white border-slate-900 font-bold' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs">{r.label}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{r.surcharge}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cashless Scheme Policy Callout */}
          <div className="bg-emerald-50/80 border border-emerald-300 p-4 rounded-2xl space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold text-emerald-950 block">
                    Janani Shishu Suraksha Karyakram (JSSK) &amp; PM-JAY Scheme Policy
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    <strong>Inpatient Delivery (IPD):</strong> 100% Cashless under JSSK &amp; PM-JAY (Normal Delivery &amp; LSCS packages include hospital stay, surgeon fees, OT, drugs &amp; newborn care).<br/>
                    <strong>Outpatient (OPD):</strong> Routine OPD consultations (₹400–₹500) are paid out-of-pocket as standard PM-JAY policy does not cover outpatient visits (free at Govt PHCs/CHCs or under PMSMA on the 9th of each month).
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={hasGovernmentInsurance}
                  onChange={(e) => setHasGovernmentInsurance(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            
            <div className="text-[10px] text-emerald-700 bg-white/70 p-2 rounded-xl border border-emerald-200">
              💡 <em>Government Policy Note:</em> Under Ayushman Bharat National Health Authority rules, secondary/tertiary hospitalisation packages are fully funded, while routine standalone OPD consultations remain patient out-of-pocket.
            </div>
          </div>

          {/* Inclusions checklist */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block">
              Package Inclusions for {activePack.title}:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {activePack.includes.map((inc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Live Itemized Estimate Quotation Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-5 sticky top-20">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Official Cost Estimate
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                St. Anne Hospital
              </span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mt-1">
              {activePack.title}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Doctor: <strong>{selectedDoctor.name}</strong> • Patient: <strong>{patient.name}</strong>
            </p>
          </div>

          {/* Itemized breakdown table */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Base Procedure &amp; Doctor Fee:</span>
              <span className="font-bold text-slate-900">₹ {activePack.basePrice.toLocaleString()}</span>
            </div>

            {(selectedPackage === 'NORMAL' || selectedPackage === 'C_SECTION') && (
              <div className="flex justify-between text-slate-600">
                <span>Room Charges ({roomTier}):</span>
                <span className="font-bold text-slate-900">₹ {roomSurcharge[roomTier].toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Diagnostic Workup &amp; Medication Inclusions:</span>
              <span className="font-bold text-emerald-700">Included in Package</span>
            </div>

            <div className="border-t border-slate-200 pt-2 flex justify-between text-xs font-bold text-slate-800">
              <span>Gross Estimated Cost:</span>
              <span>₹ {grossTotal.toLocaleString()}</span>
            </div>

            {hasGovernmentInsurance && jsskCoverage > 0 && (
              <div className="flex justify-between text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                <span>JSSK / PM-JAY Cashless Waiver:</span>
                <span>- ₹ {jsskCoverage.toLocaleString()}</span>
              </div>
            )}

            <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-baseline">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Net Estimated Out-of-Pocket:</span>
                <span className="text-[10px] text-slate-400">Subject to actual clinical requirements</span>
              </div>
              <span className="text-2xl font-black text-rose-700">
                ₹ {netPayable.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleSendWhatsAppQuote}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Quotation to Patient WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => onBookDoctor && onBookDoctor(selectedDoctor.id)}
              className="w-full py-3 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment with {selectedDoctor.name}</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 text-center leading-relaxed">
            Estimates comply with the Clinical Establishments Act and St. Anne Mother &amp; Child Hospital charter. No hidden charges.
          </div>
        </div>

      </div>

    </div>
  );
};
