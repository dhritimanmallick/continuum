import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Microscope, 
  Pill, 
  HeartHandshake, 
  Store, 
  Sparkles, 
  Calendar, 
  Filter, 
  Download, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Stethoscope, 
  ShieldCheck,
  Percent,
  Check,
  ChevronDown
} from 'lucide-react';
import { vicinityRevenueService } from '../../services/vicinityRevenueService';
import { opdStore } from '../../services/opdStore';
import { DoctorRevenueRecord } from '../../types';

interface DoctorRevenueDashboardProps {
  initialDoctorId?: string;
  onNavigateToConsultation?: () => void;
}

export const DoctorRevenueDashboard: React.FC<DoctorRevenueDashboardProps> = ({
  initialDoctorId,
  onNavigateToConsultation
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId || 'all');
  const [records, setRecords] = useState<DoctorRevenueRecord[]>([]);
  const [summary, setSummary] = useState(vicinityRevenueService.getDoctorRevenueSummary(selectedDoctorId === 'all' ? undefined : selectedDoctorId));
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'ALL' | 'LAB' | 'PHARMACY'>('ALL');

  useEffect(() => {
    const update = () => {
      const docId = selectedDoctorId === 'all' ? undefined : selectedDoctorId;
      setRecords(vicinityRevenueService.getRevenueRecords(docId));
      setSummary(vicinityRevenueService.getDoctorRevenueSummary(docId));
    };

    update();
    const unsub = vicinityRevenueService.subscribe(update);
    return () => unsub();
  }, [selectedDoctorId]);

  const doctors = opdStore.getDoctorProfiles();

  const filteredRecords = records.filter(r => {
    if (selectedCategoryFilter === 'ALL') return true;
    if (selectedCategoryFilter === 'LAB') return r.category === 'LAB' || (r.category === 'COMBINED' && r.labRevenue > 0);
    if (selectedCategoryFilter === 'PHARMACY') return r.category === 'PHARMACY' || (r.category === 'COMBINED' && r.pharmacyRevenue > 0);
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Top Banner: Doctor as the Revenue Quarterback */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-rose-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold tracking-wide uppercase">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>Doctor Revenue Generation &amp; Community Impact Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              The Doctor: Primary Revenue Driver for Local Vendors
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every OPD consultation creates vital economic activity for neighborhood businesses. When doctors issue diagnostic requisitions and e-prescriptions, they direct sustainable revenue to nearby pathology labs and chemist shops.
            </p>
          </div>

          {/* Doctor Filter Switcher */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col gap-2 shrink-0">
            <span className="text-xs text-rose-200 font-semibold">Attributed Prescribing Doctor:</span>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="bg-slate-900 border border-rose-500/40 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">🏥 All OPD Doctors (Hospital Total)</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  👩‍⚕️ {d.name} • {d.roomNumber} ({d.specialty})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 text-center">
              Tracking <span className="text-white font-bold">{records.length} orders</span> across OPD desks
            </div>
          </div>
        </div>
      </div>

      {/* 4 Highlight KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Revenue Directed to Local Shops */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Vendor Revenue Built
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{summary.totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-extrabold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +18%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Paid directly to neighbourhood labs &amp; pharmacies
          </p>
        </div>

        {/* Metric 2: Diagnostic Labs Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Diagnostic Labs Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Microscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{summary.labRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Generated for Apex, Suraksha &amp; District Labs
          </p>
        </div>

        {/* Metric 3: Neighborhood Pharmacy Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Retail Pharmacy Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{summary.pharmacyRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Jan Aushadhi #5048, MedPlus, Hospital Chemist
          </p>
        </div>

        {/* Metric 4: Patient Savings via Jan Aushadhi */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Patient Out-Of-Pocket Savings
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              ₹{summary.totalPatientSavings.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Saved for families via Jan Aushadhi generic substitution
          </p>
        </div>

      </div>

      {/* Breakdown: Top Beneficiary Neighborhood Shops */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Top Beneficiary Local Shops Supported by OPD Doctors
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Local enterprises whose monthly revenue depends on clinical OPD order dispatch.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {summary.topBeneficiaries.length} Connected Shops
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.topBeneficiaries.map((shop, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    shop.category.includes('Lab') 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {shop.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mt-2 line-clamp-1">{shop.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {shop.ordersCount} clinical orders received
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                <span className="text-[10px] text-slate-400 uppercase">Revenue Built</span>
                <span className="text-base font-black text-slate-900">₹{shop.revenue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Granular Clinical Order Attribution Ledger */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-rose-700" />
              <span>Granular Doctor Revenue Attribution Ledger</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live audit of each consultation, prescribed investigation, and recipient vendor shop.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setSelectedCategoryFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategoryFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('LAB')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategoryFilter === 'LAB'
                  ? 'bg-purple-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Labs Only
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('PHARMACY')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategoryFilter === 'PHARMACY'
                  ? 'bg-emerald-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Pharmacies Only
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Order ID &amp; Time</th>
                <th className="p-3">Prescribing Doctor</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Ordered Items</th>
                <th className="p-3">Recipient Shop</th>
                <th className="p-3 text-right">Revenue Generated</th>
                <th className="p-3 text-right">Patient Savings</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-mono">
                    <span className="font-bold text-slate-900">{r.orderId}</span>
                    <span className="text-[10px] text-slate-400 block">{r.timestamp}</span>
                  </td>

                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{r.doctorName}</span>
                    <span className="text-[10px] text-slate-500">{r.doctorRoom}</span>
                  </td>

                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{r.patientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Token #{r.tokenNumber}</span>
                  </td>

                  <td className="p-3 max-w-xs">
                    <div className="space-y-0.5">
                      {r.labItems && r.labItems.length > 0 && (
                        <div className="text-[11px] text-purple-900 font-medium">
                          🔬 {r.labItems.join(', ')}
                        </div>
                      )}
                      {r.pharmacyItems && r.pharmacyItems.length > 0 && (
                        <div className="text-[11px] text-emerald-900 font-medium">
                          💊 {r.pharmacyItems.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    {r.labPartnerName && (
                      <span className="block text-[11px] font-bold text-purple-900">
                        {r.labPartnerName}
                      </span>
                    )}
                    {r.pharmacyPartnerName && (
                      <span className="block text-[11px] font-bold text-emerald-900">
                        {r.pharmacyPartnerName}
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right font-black text-slate-900 text-sm">
                    ₹{r.totalRevenueGenerated}
                  </td>

                  <td className="p-3 text-right">
                    {r.patientSavingsFromGeneric > 0 ? (
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                        Saved ₹{r.patientSavingsFromGeneric}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      r.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {r.status === 'COMPLETED' ? 'Fulfillment Complete' : 'Order Accepted'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
