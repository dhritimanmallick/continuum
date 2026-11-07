import React, { useState } from 'react';
import { 
  Calculator, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Download, 
  Share2, 
  X,
  AlertCircle,
  Building,
  CreditCard,
  Send,
  Sparkles,
  Phone,
  Navigation
} from 'lucide-react';
import { TreatmentPackageConfig, CostQuotationRequest, ItemizedCostItem, OpdPatient } from '../../types';
import { costEstimatorService } from '../../services/costEstimatorService';
import { opdStore } from '../../services/opdStore';
import { GoogleMapsVicinityTracker, VicinityCostOption } from '../vicinity/GoogleMapsVicinityTracker';

interface TreatmentCostEstimatorModalProps {
  initialPatientId?: string;
  onClose: () => void;
}

export const TreatmentCostEstimatorModal: React.FC<TreatmentCostEstimatorModalProps> = ({
  initialPatientId,
  onClose
}) => {
  const [, setVersion] = useState(0);
  const patient = opdStore.patients.find(p => p.id === (initialPatientId || 'PAT-104')) || opdStore.patients[0];
  const packages = costEstimatorService.getAllPackages();
  
  const [selectedPackageId, setSelectedPackageId] = useState<string>(packages[0]?.id || 'pkg-normal-delivery');
  const [roomType, setRoomType] = useState<'General Ward' | 'Semi-Private Sharing' | 'Private AC Room' | 'Deluxe Suite'>('General Ward');
  const [activeTab, setActiveTab] = useState<'ESTIMATOR' | 'VICINITY_MAP' | 'QUOTATIONS_HISTORY'>('ESTIMATOR');
  const [chosenVicinityProvider, setChosenVicinityProvider] = useState<VicinityCostOption | null>(null);

  // WhatsApp Quotation Modal state
  const [generatedQuotation, setGeneratedQuotation] = useState<CostQuotationRequest | null>(null);
  const [whatsAppSuccessToast, setWhatsAppSuccessToast] = useState(false);
  const [billingQueryText, setBillingQueryText] = useState('');
  const [activeQueryQuoteId, setActiveQueryQuoteId] = useState<string | null>(null);

  const currentPackage = packages.find(p => p.id === selectedPackageId) || packages[0];


  // Room surcharge multiplier calculation
  const roomMultiplier = roomType === 'General Ward' ? 1 : roomType === 'Semi-Private Sharing' ? 1.15 : roomType === 'Private AC Room' ? 1.35 : 1.6;

  // Recalculated items based on room selection
  const calculatedItems = currentPackage.items.map(item => {
    if (item.category === 'BED_AND_ROOM') {
      return { ...item, amountInr: Math.round(item.amountInr * roomMultiplier) };
    }
    return item;
  });

  const calculatedTotal = calculatedItems.reduce((acc, item) => acc + item.amountInr, 0);

  const patientQuotations = costEstimatorService.getQuotationsForPatient(patient.id);

  const handleGenerateAndShareWhatsApp = () => {
    const newQuote = costEstimatorService.createQuotation({
      patientId: patient.id,
      patientName: patient.name,
      mobile: patient.mobile,
      packageId: currentPackage.id,
      roomTypeSelected: roomType
    });

    costEstimatorService.sendQuotationViaWhatsApp(newQuote.id);
    setGeneratedQuotation(newQuote);
    setWhatsAppSuccessToast(true);
    setVersion(v => v + 1);
    setTimeout(() => setWhatsAppSuccessToast(false), 5000);
  };

  const handleSendBillingQuery = (quoteId: string) => {
    if (!billingQueryText.trim()) return;
    costEstimatorService.recordPatientQuery(quoteId, billingQueryText);
    setBillingQueryText('');
    setActiveQueryQuoteId(null);
    setVersion(v => v + 1);
    alert('Billing query logged and routed to District Hospital Accounts & WhatsApp desk.');
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#faf8f6] rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-xs">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-emerald-900/70 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-300 text-base shadow-xs">
              <Calculator className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">TREATMENT COST ESTIMATOR &amp; WHATSAPP</h3>
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  Transparent Hospital Billing
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 font-medium">
                Hospital-configured itemized maternity packages, government PM-JAY scheme subsidies, and instant WhatsApp quotation delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher & Success Toast */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl font-bold text-xs">
            <button
              onClick={() => setActiveTab('ESTIMATOR')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'ESTIMATOR' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cost Estimator &amp; Package Builder
            </button>
            <button
              onClick={() => setActiveTab('VICINITY_MAP')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'VICINITY_MAP' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-rose-600" />
              <span>🗺️ Compare Nearby Options on Google Map</span>
              {chosenVicinityProvider && (
                <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full font-bold">
                  Selected
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('QUOTATIONS_HISTORY')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'QUOTATIONS_HISTORY' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Saved Quotations &amp; WhatsApp History</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                {patientQuotations.length}
              </span>
            </button>
          </div>

          {whatsAppSuccessToast && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-xl font-bold text-xs animate-in fade-in duration-200">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quotation sent to {patient.mobile} via WhatsApp Business!</span>
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab === 'ESTIMATOR' && (
            <div className="space-y-5">
              
              {/* Package Chooser Cards */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 block">
                  Select Maternity &amp; OB-GYN Clinical Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {packages.map(pkg => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                              {pkg.packageType.replace('_', ' ')}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          </div>
                          <h4 className="font-black text-slate-900 text-xs mt-1 leading-snug">
                            {pkg.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            {pkg.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-semibold">{pkg.durationStay}</span>
                          <span className="text-sm font-black text-emerald-800">
                            ₹{pkg.basePriceInr.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Room Tier & Patient Info */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                    Room / Accommodation Preference
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { key: 'General Ward', label: 'General Ward (Base)' },
                      { key: 'Semi-Private Sharing', label: 'Semi-Private (+15%)' },
                      { key: 'Private AC Room', label: 'Private AC (+35%)' },
                      { key: 'Deluxe Suite', label: 'Deluxe Suite (+60%)' }
                    ].map(r => (
                      <button
                        key={r.key}
                        onClick={() => setRoomType(r.key as any)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                          roomType === r.key 
                            ? 'bg-slate-900 text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">Estimated Total for {patient.name}</span>
                  <div className="text-2xl font-black text-emerald-900">
                    ₹{calculatedTotal.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400 block">*Excludes non-standard emergency medications</span>
                </div>
              </div>

              {/* Itemized Cost Breakdown Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-black text-slate-900 text-xs">
                      Itemized Cost Breakdown — {currentPackage.name}
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">
                    {calculatedItems.length} Billable Components
                  </span>
                </div>

                {/* Government Policy Clarification Banner */}
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">PM-JAY &amp; JSSK Maternity Entitlement Policy:</span>
                    <p className="text-[11px] text-blue-800 leading-relaxed mt-0.5">
                      Under Government of India norms, PM-JAY and Janani Shishu Suraksha Karyakram (JSSK) provide 100% cashless coverage for <strong>Inpatient Deliveries, C-Sections &amp; Newborn Hospitalisation (IPD)</strong>. Standard Outpatient (OPD) consultation fees are not covered by PM-JAY and are paid out-of-pocket (or free at government facilities).
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="p-3">Category</th>
                        <th className="p-3">Service / Charge Item</th>
                        <th className="p-3">Description &amp; Inclusions</th>
                        <th className="p-3">PM-JAY Scheme</th>
                        <th className="p-3 text-right">Estimated Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {calculatedItems.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">
                              {item.category.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-900">{item.name}</td>
                          <td className="p-3 text-slate-500 text-[11px]">{item.description}</td>
                          <td className="p-3">
                            {item.isCoveredByAyushmanBharatPMJAY ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                100% Cashless PM-JAY
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Co-Pay / Out-of-Pocket</span>
                            )}
                          </td>
                          <td className="p-3 text-right font-black text-slate-900">
                            ₹{item.amountInr.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-emerald-50/70 font-black text-slate-900 border-t border-emerald-200">
                        <td colSpan={4} className="p-3 text-right text-xs">
                          Estimated Subtotal (Subject to clinical requirements during delivery):
                        </td>
                        <td className="p-3 text-right text-base text-emerald-900">
                          ₹{calculatedTotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Government Schemes / Subsidies Note */}
                {currentPackage.pmjayCoverageNote && (
                  <div className="p-3.5 bg-emerald-50/40 border-t border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-emerald-950 font-bold">Government Maternal Health Benefit Available:</strong>
                      <span>{currentPackage.pmjayCoverageNote}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer Notice: Distinction from Final Bill */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-amber-950">Crucial Billing Transparency Notice:</h5>
                  <p className="mt-0.5 text-amber-800 leading-relaxed text-[11px]">
                    This tool generates an <strong>estimate</strong> for anticipated clinical workflows based on hospital pricing regulations. 
                    Actual final invoices may vary if medical necessity dictates additional ICU stay, emergency blood transfusions, high-grade antibiotics, or specialized neonatology intervention. Final billing is reconciled upon discharge.
                  </p>
                </div>
              </div>

              {/* WhatsApp Action Bar */}
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div>
                  <h4 className="font-black text-base text-white">Share Quotation via WhatsApp</h4>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Send an official itemized estimate PDF and interactive booking button directly to <strong className="text-white">{patient.mobile}</strong>.
                  </p>
                </div>

                <button
                  onClick={handleGenerateAndShareWhatsApp}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition cursor-pointer shrink-0"
                >
                  <MessageSquare className="w-4 h-4 text-slate-950" />
                  <span>Send WhatsApp Quotation</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: GOOGLE MAPS VICINITY TRACKER & COST OPTIONS */}
          {activeTab === 'VICINITY_MAP' && (
            <div className="space-y-4">
              <GoogleMapsVicinityTracker
                patientId={patient.id}
                patientName={patient.name}
                patientPhone={patient.mobile}
                onSelectOption={(opt) => {
                  setChosenVicinityProvider(opt);
                }}
              />
            </div>
          )}

          {/* TAB 3: SAVED QUOTATIONS & WHATSAPP HISTORY */}
          {activeTab === 'QUOTATIONS_HISTORY' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  Official Quotation Ledger for {patient.name}
                </h4>
                <span className="text-[11px] text-slate-500">
                  Track estimates, WhatsApp deliveries, and billing queries
                </span>
              </div>

              <div className="space-y-3">
                {patientQuotations.map(quote => (
                  <div
                    key={quote.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{quote.packageName}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                            {quote.quotationReference}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Generated on {quote.generatedAt} · Valid until {quote.validUntil}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-emerald-800">
                          ₹{quote.estimatedTotalInr.toLocaleString('en-IN')}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg">
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp {quote.whatsAppDeliveryStatus || 'Sent'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown pill preview */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                      {quote.breakdown.map((item, i) => (
                        <span key={i} className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          {item.name}: <strong>₹{item.amountInr.toLocaleString('en-IN')}</strong>
                        </span>
                      ))}
                    </div>

                    {/* Patient Query if logged */}
                    {quote.patientQuery && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                        <strong className="block font-bold">Patient Billing Query:</strong>
                        <p className="mt-0.5">{quote.patientQuery}</p>
                        <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
                          Status: Routed to Hospital TPA / Accounts Desk
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            costEstimatorService.sendQuotationViaWhatsApp(quote.id);
                            alert(`Quotation ${quote.quotationReference} re-sent to ${quote.mobile} on WhatsApp.`);
                            setVersion(v => v + 1);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3 h-3 text-slate-500" />
                          <span>Resend via WhatsApp</span>
                        </button>

                        <button
                          onClick={() => setActiveQueryQuoteId(quote.id === activeQueryQuoteId ? null : quote.id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                          <span>Raise Billing Query</span>
                        </button>
                      </div>

                      <a
                        href={`https://wa.me/918362233445?text=Hello%20Continuum%20Billing%20Desk,%20I%20have%20a%20question%20regarding%20Quotation%20${quote.quotationReference}%20for%20${encodeURIComponent(quote.packageName)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat with Billing Desk on WhatsApp</span>
                      </a>
                    </div>

                    {/* Query Input Box */}
                    {activeQueryQuoteId === quote.id && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Type your question or insurance query regarding this estimate:
                        </label>
                        <textarea
                          rows={2}
                          value={billingQueryText}
                          onChange={(e) => setBillingQueryText(e.target.value)}
                          placeholder="e.g. Does my corporate Star Health / PM-JAY card cover the private room upgrade?"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveQueryQuoteId(null)}
                            className="px-3 py-1 rounded-lg text-xs text-slate-600 font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendBillingQuery(quote.id)}
                            className="px-4 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white cursor-pointer"
                          >
                            Submit Query
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                ))}

                {patientQuotations.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
                    No quotations generated yet. Use the Cost Estimator tab to create your first itemized estimate.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
