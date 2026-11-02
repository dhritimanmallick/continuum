import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Award, 
  Calendar, 
  User, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Heart, 
  FileCheck2, 
  TrendingUp, 
  Milestone, 
  Compass, 
  Baby, 
  Smile, 
  Lock, 
  AlertCircle,
  FileText,
  Activity,
  Layers,
  Check
} from 'lucide-react';
import { OpdPatient, CareJourneyType, CareJourney, PatientAchievement, CareMilestone } from '../../types';
import { opdStore } from '../../services/opdStore';
import { CARE_JOURNEY_TEMPLATES } from '../../services/gamificationEngine';

interface MyCareJourneyPanelProps {
  patient: OpdPatient;
  onSelectPatientId?: (patientId: string) => void;
  showPatientSelector?: boolean;
}

export const MyCareJourneyPanel: React.FC<MyCareJourneyPanelProps> = ({
  patient,
  onSelectPatientId,
  showPatientSelector = false
}) => {
  const [isEditingJourney, setIsEditingJourney] = useState(false);
  const [selectedJourneyType, setSelectedJourneyType] = useState<CareJourneyType>(
    patient.careJourney?.type || 'GENERAL_OPD'
  );
  const [customNote, setCustomNote] = useState('');

  const currentPatient = opdStore.patients.find(p => p.id === patient.id) || patient;
  const journey = currentPatient.careJourney || {
    id: `CJ-${patient.id}`,
    patientId: patient.id,
    type: 'GENERAL_OPD' as CareJourneyType,
    title: 'General OPD Care Pathway',
    startDate: patient.visitDate || '10 Oct 2026',
    status: 'ACTIVE' as const,
    isFollowUpRequired: true,
    completionCriteria: 'Complete clinical consultation and follow-up advice.',
    currentProgress: { completed: 1, total: 2, percentage: 50 },
    milestones: []
  };

  const achievements = currentPatient.achievements || [];
  const universalAchievements = achievements.filter(a => a.category === 'UNIVERSAL');
  const pregnancyAchievements = achievements.filter(a => a.category === 'PREGNANCY');

  const isPregnancyEnrolled = journey.type === 'PREGNANCY' || journey.type === 'POSTNATAL' || patient.isPregnant;

  const handleUpdateCareJourney = () => {
    opdStore.updateCareJourney(patient.id, selectedJourneyType, customNote.trim() || undefined);
    setIsEditingJourney(false);
  };

  const completedMilestones = journey.milestones.filter((m: CareMilestone) => m.status === 'COMPLETED');
  const nextMilestones = journey.milestones.filter((m: CareMilestone) => m.status === 'SCHEDULED' || m.status === 'PENDING');
  const isOneTimeVisit = !journey.isFollowUpRequired || patient.followUpStatus === 'Not Required';

  const renderIcon = (iconName: string, earned: boolean) => {
    const className = `w-4 h-4 ${earned ? 'text-amber-600' : 'text-slate-400'}`;
    switch (iconName) {
      case 'UserCheck': return <User className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      case 'FileCheck2': return <FileCheck2 className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Milestone': return <Milestone className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Baby': return <Baby className={className} />;
      case 'Smile': return <Smile className={className} />;
      default: return <Award className={className} />;
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Patient Switcher Bar if enabled */}
      {showPatientSelector && (
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Patient File:
            </span>
            <span className="text-sm font-black text-slate-900">{patient.name}</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-bold">
              {patient.opdId}
            </span>
            {patient.isPregnant ? (
              <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                Pregnancy Care ({patient.pregnancyDetails?.gestationalAgeWeeks}w)
              </span>
            ) : (
              <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-bold">
                General OPD / Gynaecology
              </span>
            )}
          </div>

          {onSelectPatientId && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Switch Patient:</span>
              <select
                value={patient.id}
                onChange={(e) => onSelectPatientId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 font-semibold text-slate-800 text-xs cursor-pointer focus:ring-2 focus:ring-rose-500/20"
              >
                {opdStore.patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.isPregnant ? 'Pregnancy' : p.visitReason.slice(0, 18)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Main Encouraging Hero Card: "MY CARE JOURNEY" */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background pulse */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-teal-800/80 text-teal-200 border border-teal-700/80 px-2.5 py-0.5 rounded-full">
                  CONTINUITY OF CARE • ALL PATIENTS
                </span>
                <span className="text-[10px] font-semibold text-teal-300">
                  {patient.clinicName?.split('(')[0]?.trim() || 'Women’s Health & OPD'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                MY CARE JOURNEY
              </h2>
              <p className="text-xs sm:text-sm text-teal-100/90 font-medium mt-0.5 italic flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>&ldquo;Every step towards taking care of your health counts.&rdquo;</span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsEditingJourney(!isEditingJourney)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer border border-white/20 flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-teal-300" />
                <span>{isEditingJourney ? 'Cancel Customization' : 'Customize Journey'}</span>
              </button>
            </div>
          </div>

          {/* Clinician Journey Customizer Form */}
          {isEditingJourney && (
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-teal-500/40 space-y-3 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>Clinician Care Pathway Configuration</span>
                </span>
                <span className="text-[10px] text-slate-300">
                  Doctor determines journey based on clinical indications
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                    Select Care Journey Pathway:
                  </label>
                  <select
                    value={selectedJourneyType}
                    onChange={(e) => setSelectedJourneyType(e.target.value as CareJourneyType)}
                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-teal-400"
                  >
                    <option value="PREGNANCY">1. Pregnancy & Antenatal Care</option>
                    <option value="POSTNATAL">2. Postnatal Maternal Care</option>
                    <option value="GYNECOLOGY">3. Gynaecology Consultation</option>
                    <option value="ONGOING_CONDITION">4. Ongoing Condition (PCOS / Menstrual)</option>
                    <option value="PREVENTIVE_SCREENING">5. Preventive Health Screening</option>
                    <option value="INVESTIGATION_REVIEW">6. Investigation & Report Review</option>
                    <option value="GENERAL_OPD">7. General OPD Follow-up</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                    Clinician Care Note / Milestone Goal:
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Follow-up after pelvic ultrasound & endocrine screen"
                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-1.5 text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditingJourney(false)}
                  className="px-3 py-1 text-slate-400 hover:text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCareJourney}
                  className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-teal-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Pathway</span>
                </button>
              </div>
            </div>
          )}

          {/* Current Journey Summary Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] text-teal-200 uppercase font-bold tracking-wider block">
                Current Care Pathway
              </span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {journey.title}
              </span>
              <span className="text-[11px] text-teal-100/80 mt-0.5 block">
                Started on {journey.startDate} • {patient.assignedDoctor || 'Dr. Anita Rao'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-teal-200 uppercase font-bold tracking-wider block">
                Pathway Goal & Criteria
              </span>
              <p className="text-xs text-white/90 mt-0.5 leading-snug line-clamp-2">
                {journey.completionCriteria}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-teal-200 uppercase font-bold tracking-wider block">
                Milestone Adherence Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-black text-amber-300">
                  {journey.currentProgress.completed} of {journey.currentProgress.total}
                </span>
                <span className="text-xs text-teal-100 font-semibold">
                  applicable milestones completed ({journey.currentProgress.percentage}%)
                </span>
              </div>
              <div className="w-full bg-black/30 h-2 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${journey.currentProgress.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed vs Next Steps & One-Time Visit Acknowledgement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card A: Completed Milestones */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Completed Steps ({completedMilestones.length})</span>
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              Verified Adherence
            </span>
          </div>

          {completedMilestones.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-2xl border border-slate-100">
              Initial clinical consultation in progress. Completed steps will appear here.
            </p>
          ) : (
            <div className="space-y-2">
              {completedMilestones.map((m: CareMilestone) => (
                <div 
                  key={m.id}
                  className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-200/80 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-emerald-950 truncate">{m.title}</h4>
                      {m.completedAt && (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 shrink-0">
                          {m.completedAt}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card B: Next Steps & Clinician-Defined Follow-up */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Next Clinical Steps & Follow-up</span>
            </span>
            {isOneTimeVisit ? (
              <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-bold">
                Routine Closure
              </span>
            ) : (
              <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                Follow-up Documented
              </span>
            )}
          </div>

          {/* Section 6: One-Time Consultation Acknowledgement */}
          {isOneTimeVisit ? (
            <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <h4 className="font-black text-teal-950 text-sm">
                  Single Consultation Care Plan Complete
                </h4>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                The doctor recorded that no immediate follow-up consultation is required for this visit. Your preventive advice and instructions are fulfilled.
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-teal-200 text-[11px] text-teal-900 font-medium">
                <strong>Clinician Record:</strong> {patient.followUpInstruction || patient.doctorNotes || 'Routine check complete; proceed with healthy lifestyle counseling.'}
              </div>
            </div>
          ) : nextMilestones.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">All current milestones completed!</p>
              <p>Next review will be recorded by Dr. Anita Rao during subsequent follow-up.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {nextMilestones.map((m: CareMilestone) => {
                const isExcluded = m.status === 'EXCLUDED';

                return (
                  <div 
                    key={m.id}
                    className={`p-3 rounded-2xl border flex items-start gap-3 ${
                      isExcluded 
                        ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                        : 'bg-teal-50/40 border-teal-200 text-slate-800'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isExcluded ? 'bg-amber-600 text-white' : 'bg-teal-700 text-white'
                    }`}>
                      {isExcluded ? <ShieldCheck className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold truncate">{m.title}</h4>
                        {m.scheduledDate && (
                          <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 shrink-0">
                            Due: {m.scheduledDate}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {m.description}
                      </p>
                      {m.exclusionReason && (
                        <p className="text-[10px] font-semibold text-amber-800 mt-1 bg-white/80 p-1.5 rounded-lg border border-amber-200">
                          🛡️ Transparent Exclusion: {m.exclusionReason}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Patient Achievements Showcase: Universal & Optional Pregnancy Track */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>Patient Achievements & Milestone Badges</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Recognizing continuity of care, report verification, and adherence for all patient consultations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{achievements.filter(a => a.earned).length} Badges Earned</span>
          </div>
        </div>

        {/* 1. Universal Achievements Shelf */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-900">
              Universal Patient Achievements
            </span>
            <span className="text-[10px] text-slate-400">
              (Eligible across all OPD consultations: Gynaecology, PCOS, Screening, ANC & General)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {universalAchievements.map(ach => (
              <div 
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                  ach.earned 
                    ? 'bg-gradient-to-br from-white to-amber-50/40 border-amber-300 shadow-xs ring-1 ring-amber-400/20' 
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        ach.earned ? 'bg-amber-100 border border-amber-300 text-amber-800' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {renderIcon(ach.iconName, ach.earned)}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                          {ach.title}
                        </h4>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                          {ach.earned ? '✓ Earned' : '○ In Progress'}
                        </span>
                      </div>
                    </div>

                    {ach.earned && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                        Unlocked
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate pr-1">{ach.criteria}</span>
                  {ach.earnedAt && (
                    <span className="font-mono font-bold text-slate-700 shrink-0">
                      {ach.earnedAt}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Pregnancy-Specific Achievements Shelf (ONLY shown when enrolled in pregnancy/postnatal) */}
        {isPregnancyEnrolled && pregnancyAchievements.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-200/80">
            <div className="flex items-center gap-2 border-b border-rose-100 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-600" />
                <span>Pregnancy & Postnatal Care Pathway Achievements</span>
              </span>
              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.2 rounded-full font-bold">
                Activated for Maternal Pathway
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pregnancyAchievements.map(ach => (
                <div 
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                    ach.earned 
                      ? 'bg-gradient-to-br from-white to-rose-50/40 border-rose-300 shadow-xs ring-1 ring-rose-400/20' 
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          ach.earned ? 'bg-rose-100 border border-rose-300 text-rose-800' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {renderIcon(ach.iconName, ach.earned)}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                            {ach.title}
                          </h4>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                            {ach.earned ? '✓ Earned' : '○ In Progress'}
                          </span>
                        </div>
                      </div>

                      {ach.earned && (
                        <span className="text-[10px] bg-rose-100 text-rose-900 font-bold px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                          Unlocked
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {ach.description}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate pr-1">{ach.criteria}</span>
                    {ach.earnedAt && (
                      <span className="font-mono font-bold text-slate-700 shrink-0">
                        {ach.earnedAt}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
