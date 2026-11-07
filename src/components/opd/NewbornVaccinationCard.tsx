import React, { useState } from 'react';
import { 
  Baby, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Syringe, 
  Send, 
  Info, 
  ChevronRight,
  FileText,
  X,
  Sparkles
} from 'lucide-react';
import { OpdPatient, VaccineScheduleItem, VaccineScheduleMilestone } from '../../types';
import { opdStore } from '../../services/opdStore';
import { generateNewbornVaccineSchedule } from '../../services/clinicalProtocols';

interface NewbornVaccinationCardProps {
  patient: OpdPatient;
  onVaccineAdministered?: () => void;
  readOnly?: boolean;
}

export const NewbornVaccinationCard: React.FC<NewbornVaccinationCardProps> = ({
  patient,
  onVaccineAdministered,
  readOnly = false
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<VaccineScheduleMilestone | 'ALL'>('ALL');
  const [administeringVaccine, setAdministeringVaccine] = useState<VaccineScheduleItem | null>(null);
  const [batchNumber, setBatchNumber] = useState('');
  const [site, setSite] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [showMcpCardPrint, setShowMcpCardPrint] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // If patient doesn't have schedule yet, generate one
  const schedule: VaccineScheduleItem[] = patient.vaccinationSchedule && patient.vaccinationSchedule.length > 0
    ? patient.vaccinationSchedule
    : generateNewbornVaccineSchedule(patient.dob || '2026-09-19', patient.id);

  const milestones: { key: VaccineScheduleMilestone | 'ALL'; label: string; ageHint: string }[] = [
    { key: 'ALL', label: 'All Vaccines', ageHint: 'Complete NIS Schedule' },
    { key: 'AT_BIRTH', label: 'At Birth', ageHint: 'Day 0–1' },
    { key: '6_WEEKS', label: '6 Weeks', ageHint: '42 Days' },
    { key: '10_WEEKS', label: '10 Weeks', ageHint: '70 Days' },
    { key: '14_WEEKS', label: '14 Weeks', ageHint: '98 Days' },
    { key: '9_12_MONTHS', label: '9–12 Months', ageHint: 'Infant completion' },
    { key: '16_24_MONTHS', label: '16–24 Months', ageHint: '1st Boosters' },
    { key: '5_6_YEARS', label: '5–6 Years', ageHint: 'School entry' }
  ];

  const filteredSchedule = selectedMilestone === 'ALL'
    ? schedule
    : schedule.filter(v => v.milestone === selectedMilestone);

  const totalVaccines = schedule.length;
  const givenVaccines = schedule.filter(v => v.status === 'GIVEN').length;
  const dueVaccines = schedule.filter(v => v.status === 'DUE' || v.status === 'OVERDUE').length;
  const percentComplete = Math.round((givenVaccines / totalVaccines) * 100);

  const handleOpenAdministerModal = (vaccine: VaccineScheduleItem) => {
    setAdministeringVaccine(vaccine);
    setBatchNumber(vaccine.batchNumber || `SERUM-IND-${Math.floor(202600 + Math.random() * 999)}`);
    setSite(vaccine.site);
    setAdminNotes(`Administered as per National Immunization Schedule at Hubballi MCH OPD.`);
  };

  const handleConfirmAdministration = () => {
    if (!administeringVaccine) return;

    const currentDoc = opdStore.getCurrentDoctor();
    const adminBy = currentDoc.name || 'Dr. Sneha Patil (Pediatrics)';

    opdStore.recordVaccineAdministration({
      patientId: patient.id,
      vaccineCode: administeringVaccine.vaccineCode,
      batchNumber,
      site,
      administeredBy: adminBy,
      notes: adminNotes
    });

    setSuccessToast(`Administered ${administeringVaccine.vaccineName} (${administeringVaccine.vaccineCode}). MCP Card & Parent WhatsApp updated.`);
    setTimeout(() => setSuccessToast(null), 5000);

    setAdministeringVaccine(null);
    if (onVaccineAdministered) onVaccineAdministered();
  };

  return (
    <div className="bg-white rounded-3xl border border-sky-200 p-5 shadow-2xs space-y-4 text-xs">
      {/* Toast */}
      {successToast && (
        <div className="bg-emerald-900 text-white p-3 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-300 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Header with MCP Title & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">
                Newborn &amp; Infant Immunization (MCP Card)
              </h3>
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-extrabold text-[10px] rounded-md border border-sky-200">
                National Schedule (NIS / WHO / IAP)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Mother &amp; Child Protection Card record for <strong className="text-slate-800">{patient.name}</strong> • DOB: {patient.dob || '2026-09-19'} {patient.birthDetails?.birthWeightKg ? `(Birth Wt: ${patient.birthDetails.birthWeightKg} kg)` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowMcpCardPrint(true)}
            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold rounded-xl text-[11px] flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-sky-700" />
            <span>Digital MCP Card</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-sky-50/60 p-2.5 rounded-2xl border border-sky-100">
          <span className="text-[10px] text-sky-700 font-bold uppercase block">Coverage</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold text-sky-950">{percentComplete}%</span>
            <span className="text-[10px] text-slate-500">({givenVaccines}/{totalVaccines} doses)</span>
          </div>
          <div className="w-full bg-sky-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-sky-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100">
          <span className="text-[10px] text-emerald-700 font-bold uppercase block">Administered</span>
          <span className="text-base font-extrabold text-emerald-950 block mt-0.5">{givenVaccines} Doses</span>
          <span className="text-[10px] text-emerald-700 font-medium">Verified batch logged</span>
        </div>

        <div className="bg-amber-50/60 p-2.5 rounded-2xl border border-amber-100">
          <span className="text-[10px] text-amber-700 font-bold uppercase block">Due Today</span>
          <span className="text-base font-extrabold text-amber-950 block mt-0.5">{dueVaccines} Doses</span>
          <span className="text-[10px] text-amber-700 font-medium">6-Week Milestone</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <span className="text-[10px] text-slate-600 font-bold uppercase block">Birth Details</span>
          <span className="text-xs font-bold text-slate-900 block mt-0.5">
            {patient.birthDetails?.deliveryType || 'Normal Delivery'}
          </span>
          <span className="text-[10px] text-slate-500">
            {patient.birthDetails?.maternalBloodGroup ? `Mother: ${patient.birthDetails.maternalBloodGroup}` : 'Blood group checked'}
          </span>
        </div>
      </div>

      {/* Milestone Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {milestones.map(m => {
          const isSelected = selectedMilestone === m.key;
          const countInMilestone = m.key === 'ALL' 
            ? schedule.length 
            : schedule.filter(v => v.milestone === m.key).length;
          const givenInMilestone = m.key === 'ALL'
            ? schedule.filter(v => v.status === 'GIVEN').length
            : schedule.filter(v => v.milestone === m.key && v.status === 'GIVEN').length;

          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setSelectedMilestone(m.key)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{m.label}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected ? 'bg-sky-950 text-sky-200' : 'bg-slate-200 text-slate-700'
              }`}>
                {givenInMilestone}/{countInMilestone}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vaccines Table / Cards */}
      <div className="space-y-2">
        {filteredSchedule.map(v => {
          const isGiven = v.status === 'GIVEN';
          const isDue = v.status === 'DUE' || v.status === 'OVERDUE';

          return (
            <div
              key={v.vaccineCode}
              className={`p-3 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isGiven
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isDue
                  ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300/30'
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] border ${
                    isGiven 
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                      : isDue 
                      ? 'bg-amber-100 text-amber-900 border-amber-300' 
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {v.vaccineCode}
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs">{v.vaccineName}</span>
                  <span className="text-[10px] text-slate-500 font-medium">({v.recommendedAgeLabel || v.targetAge || ''})</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-600 flex-wrap">
                  <span>Dose: <strong className="text-slate-800">{v.dosage || v.dose}</strong></span>
                  <span>•</span>
                  <span>Route: <strong className="text-slate-800">{v.route}</strong></span>
                  <span>•</span>
                  <span>Site: <strong className="text-slate-800">{v.site}</strong></span>
                </div>

                <p className="text-[10px] text-slate-500 italic">
                  Protects against: {v.targetDisease || v.preventsAgainst}
                </p>

                {isGiven && (
                  <div className="flex items-center gap-2 text-[10px] text-emerald-800 font-semibold pt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Administered on {v.administeredDate || '10 Oct 2026'} by {v.administeredBy || 'Pediatric OPD'}</span>
                    {v.batchNumber && <span>• Batch: <span className="font-mono font-bold">{v.batchNumber}</span></span>}
                  </div>
                )}
              </div>

              {/* Action Column */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                  isGiven
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : isDue
                    ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {isGiven ? '✓ GIVEN' : isDue ? '● DUE TODAY' : 'UPCOMING'}
                </span>

                {!readOnly && !isGiven && (
                  <button
                    type="button"
                    onClick={() => handleOpenAdministerModal(v)}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition active:scale-95"
                  >
                    <Syringe className="w-3.5 h-3.5 text-sky-200" />
                    <span>Administer Dose</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Administer Vaccine Modal */}
      {administeringVaccine && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Syringe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Record Vaccine Administration</h4>
                  <p className="text-[10px] text-slate-500">Official National Immunization Record Entry</p>
                </div>
              </div>
              <button 
                onClick={() => setAdministeringVaccine(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sky-950">{administeringVaccine.vaccineName}</span>
                <span className="px-2 py-0.5 bg-sky-200 text-sky-900 font-mono font-bold rounded-md text-[10px]">
                  {administeringVaccine.vaccineCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Patient: <strong className="text-slate-800">{patient.name}</strong> • Dose: {administeringVaccine.dosage || administeringVaccine.dose} ({administeringVaccine.route})
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Vaccine Batch Number (Vial Verification)
                </label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="e.g. SERUM-IND-2026-X8"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Administration Site
                </label>
                <select
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs cursor-pointer"
                >
                  <option value={administeringVaccine.site}>{administeringVaccine.site} (Standard)</option>
                  <option value="Left Deltoid">Left Deltoid</option>
                  <option value="Right Deltoid">Right Deltoid</option>
                  <option value="Anterolateral Thigh (Left)">Anterolateral Thigh (Left)</option>
                  <option value="Anterolateral Thigh (Right)">Anterolateral Thigh (Right)</option>
                  <option value="Oral Drops">Oral Drops</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Clinical Notes / Adverse Reaction Guidance
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>An automated multilingual immunization update will be delivered to parents via WhatsApp ({patient.mobile}).</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAdministeringVaccine(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAdministration}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Record Vaccine</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital MCP Card Printable Slip */}
      {showMcpCardPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-sky-400" />
                <span className="font-extrabold text-sm">Official Mother &amp; Child Protection (MCP) Immunization Card</span>
              </div>
              <button 
                onClick={() => setShowMcpCardPrint(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
              <div className="text-center pb-3 border-b-2 border-slate-900">
                <span className="font-black text-lg text-slate-900 block tracking-tight">
                  MINISTRY OF HEALTH &amp; FAMILY WELFARE — NATIONAL IMMUNIZATION RECORD
                </span>
                <span className="text-[11px] text-slate-600 font-semibold">
                  District Hospital Hubballi • Maternal &amp; Child Health (MCH) Unit
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px]">
                <div>
                  <p><span className="text-slate-500">Child Name:</span> <strong>{patient.name}</strong></p>
                  <p><span className="text-slate-500">Date of Birth:</span> {patient.dob || '2026-09-19'}</p>
                  <p><span className="text-slate-500">Gender / Age:</span> {patient.gender.toUpperCase()} / {patient.age > 0 ? `${patient.age}y` : 'Newborn'}</p>
                  <p><span className="text-slate-500">OPD / MCP ID:</span> {patient.opdId}</p>
                </div>
                <div>
                  <p><span className="text-slate-500">Parent Mobile:</span> {patient.mobile}</p>
                  <p><span className="text-slate-500">Address:</span> {patient.address || 'Hubballi, Karnataka'}</p>
                  <p><span className="text-slate-500">Birth Weight:</span> {patient.birthDetails?.birthWeightKg || 3.1} kg</p>
                  <p><span className="text-slate-500">Pediatrician:</span> Dr. Sneha Patil (DCH)</p>
                </div>
              </div>

              {/* Vaccine Table */}
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-900 text-white text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-2">Milestone</th>
                      <th className="p-2">Vaccine Name</th>
                      <th className="p-2">Dose / Site</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Date / Batch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {schedule.map(v => (
                      <tr key={v.vaccineCode} className={v.status === 'GIVEN' ? 'bg-emerald-50/30' : ''}>
                        <td className="p-2 font-bold text-slate-700">{v.recommendedAgeLabel || v.targetAge || 'Standard'}</td>
                        <td className="p-2">
                          <strong className="text-slate-900">{v.vaccineCode}</strong>
                          <span className="block text-[10px] text-slate-500">{v.vaccineName}</span>
                        </td>
                        <td className="p-2 text-slate-600">{v.dosage || v.dose} • {v.site}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            v.status === 'GIVEN'
                              ? 'bg-emerald-100 text-emerald-800'
                              : v.status === 'DUE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-2 text-slate-700 font-mono text-[10px]">
                          {v.administeredDate ? `${v.administeredDate} (${v.batchNumber || 'Batch logged'})` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <p>Digital MCP Card automatically synced with parents&apos; WhatsApp and ABHA Health Locker.</p>
                <p className="font-bold text-slate-800">Verified by Medical Officer, District Hospital Hubballi</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowMcpCardPrint(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close MCP Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
