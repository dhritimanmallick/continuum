import React, { useState } from 'react';
import { 
  Baby, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Users, 
  UserPlus, 
  Lock, 
  Heart, 
  Sparkles, 
  Send, 
  X,
  Phone,
  AlertCircle,
  Share2,
  Calendar,
  Activity
} from 'lucide-react';
import { 
  LabourDeliveryTracker, 
  LabourStageCode, 
  ConsentedFamilyContact, 
  LabourStageUpdate,
  OpdPatient 
} from '../../types';
import { labourDeliveryService, LABOUR_STAGES_INFO } from '../../services/labourDeliveryService';
import { opdStore } from '../../services/opdStore';

interface LabourDeliveryLiveTrackerModalProps {
  initialPatientId?: string;
  onClose: () => void;
  isHospitalStaffView?: boolean;
}

export const LabourDeliveryLiveTrackerModal: React.FC<LabourDeliveryLiveTrackerModalProps> = ({
  initialPatientId,
  onClose,
  isHospitalStaffView = false
}) => {
  const [, setVersion] = useState(0);
  const patient = opdStore.patients.find(p => p.id === (initialPatientId || 'PAT-104')) || opdStore.patients[0];
  const tracker = labourDeliveryService.getTracker(patient.id)!;

  const [activeTab, setActiveTab] = useState<'LIVE_TIMELINE' | 'FAMILY_CONSENT' | 'STAFF_CONTROL'>(
    isHospitalStaffView ? 'STAFF_CONTROL' : 'LIVE_TIMELINE'
  );

  // New family contact modal
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelationship, setNewContactRelationship] = useState('Spouse');
  const [newContactMobile, setNewContactMobile] = useState('+91 ');
  const [canWhatsApp, setCanWhatsApp] = useState(true);
  const [canSms, setCanSms] = useState(true);

  // Staff Update State
  const [staffSelectedStage, setStaffSelectedStage] = useState<LabourStageCode>('STAGE_4_DELIVERY_UNDERWAY');
  const [customUpdateText, setCustomUpdateText] = useState('');
  const [privateClinicalNote, setPrivateClinicalNote] = useState('');
  
  // Baby details form if stage 5
  const [babyGender, setBabyGender] = useState<'Boy' | 'Girl' | 'Twins'>('Girl');
  const [babyWeightKg, setBabyWeightKg] = useState(3.1);
  const [deliveryType, setDeliveryType] = useState<'Normal Vaginal' | 'Lower Segment C-Section (LSCS)' | 'Assisted Vacuum'>('Normal Vaginal');
  const [timeOfBirth, setTimeOfBirth] = useState('11:42 AM');
  const [motherStatus, setMotherStatus] = useState('Mother is resting comfortably, vitals stable.');

  const currentStageInfo = LABOUR_STAGES_INFO.find(s => s.code === tracker.currentStage) || LABOUR_STAGES_INFO[0];

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    labourDeliveryService.addConsentedContact(patient.id, {
      name: `${newContactName} (${newContactRelationship})`,
      relationship: newContactRelationship,
      mobile: newContactMobile,
      canReceiveWhatsApp: canWhatsApp,
      canReceiveSms: canSms,
      allowedMilestones: [
        'STAGE_1_ADMISSION',
        'STAGE_2_LABOUR_INITIATED',
        'STAGE_3_LABOUR_ROOM',
        'STAGE_4_DELIVERY_UNDERWAY',
        'STAGE_5_BABY_DELIVERED',
        'STAGE_6_RECOVERY_WARD',
        'STAGE_7_DISCHARGE_READY'
      ],
      isActive: true
    });

    setShowAddContact(false);
    setNewContactName('');
    setVersion(v => v + 1);
  };

  const handleStaffAdvanceStage = (e: React.FormEvent) => {
    e.preventDefault();
    const stageDetails = LABOUR_STAGES_INFO.find(s => s.code === staffSelectedStage);

    labourDeliveryService.updateStage({
      patientId: patient.id,
      stage: staffSelectedStage,
      doctorOrStaffName: 'Dr. Anita Rao & Sister Rekha',
      customMessage: customUpdateText || stageDetails?.defaultDescription,
      privateClinicalNote,
      babyDetails: staffSelectedStage === 'STAGE_5_BABY_DELIVERED' ? {
        gender: babyGender,
        birthWeightKg: babyWeightKg,
        deliveryType,
        timeOfBirth,
        motherStatus
      } : undefined
    });

    setCustomUpdateText('');
    setPrivateClinicalNote('');
    setVersion(v => v + 1);
    setActiveTab('LIVE_TIMELINE');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#faf8f6] rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-xs">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-950 via-rose-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-rose-900/60 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center font-bold text-rose-300 text-base shadow-xs">
              <Baby className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">LABOUR &amp; DELIVERY FAMILY UPDATES</h3>
                <span className="text-[10px] bg-rose-800 text-rose-200 px-2 py-0.5 rounded-full font-bold">
                  Consented Real-Time Milestones
                </span>
              </div>
              <p className="text-[11px] text-rose-200 font-medium">
                Keep loved ones reassured with authenticated stage updates, baby birth announcements, and WhatsApp delivery receipts.
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

        {/* Current Patient & Ward Info Bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{patient.name}</span>
              <span className="text-[11px] text-slate-500">({patient.age}y · G2P1)</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="text-slate-600 font-medium">
              Bed: <strong className="text-rose-900">{tracker.wardBed}</strong>
            </div>
            <span className="text-slate-300">|</span>
            <div className="text-slate-600 font-medium hidden sm:block">
              Doctor: <strong>{tracker.attendingDoctor}</strong>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl font-bold text-xs">
            <button
              onClick={() => setActiveTab('LIVE_TIMELINE')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeTab === 'LIVE_TIMELINE' ? 'bg-white text-rose-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Timeline ({tracker.history.length})
            </button>
            <button
              onClick={() => setActiveTab('FAMILY_CONSENT')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'FAMILY_CONSENT' ? 'bg-white text-rose-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-rose-600" />
              <span>Consented Family ({tracker.consentedContacts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('STAFF_CONTROL')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'STAFF_CONTROL' ? 'bg-rose-900 text-white shadow-xs' : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <span>+ Staff 1-Click Update</span>
            </button>
          </div>
        </div>

        {/* 7-Stage Horizontal Pipeline Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 overflow-x-auto shrink-0">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {LABOUR_STAGES_INFO.map(stage => {
              const isPastOrCurrent = stage.percent <= tracker.currentStageProgressPercent;
              const isCurrent = stage.code === tracker.currentStage;
              return (
                <div key={stage.code} className="flex-1 flex flex-col items-center text-center relative group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition shadow-xs ${
                    isCurrent 
                      ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse' 
                      : isPastOrCurrent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isPastOrCurrent && !isCurrent ? '✓' : stage.stageNumber}
                  </div>
                  <span className={`text-[10px] font-bold mt-1.5 max-w-[90px] leading-tight ${
                    isCurrent ? 'text-rose-950 font-black' : isPastOrCurrent ? 'text-emerald-900 font-semibold' : 'text-slate-400'
                  }`}>
                    {stage.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: LIVE TIMELINE */}
          {activeTab === 'LIVE_TIMELINE' && (
            <div className="space-y-4">
              
              {/* Progress Summary Card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Current Delivery Stage</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">{currentStageInfo.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{currentStageInfo.defaultDescription}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-black text-rose-900 block">{tracker.currentStageProgressPercent}% Complete</span>
                    <span className="text-[10px] text-slate-400">All updates sent via WhatsApp</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-rose-600 flex items-center justify-center font-bold text-xs text-rose-950">
                    {tracker.currentStageProgressPercent}%
                  </div>
                </div>
              </div>

              {/* Updates List */}
              <div className="space-y-3">
                {tracker.history.map((update, idx) => {
                  const isBabyAnnouncement = update.stage === 'STAGE_5_BABY_DELIVERED' && update.babyDetails;
                  return (
                    <div
                      key={update.id}
                      className={`rounded-2xl border p-4 shadow-xs transition-all ${
                        isBabyAnnouncement 
                          ? 'bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border-rose-300 ring-2 ring-rose-200' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
                          <h4 className="font-black text-xs text-slate-900">{update.stageTitle}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                            {update.doctorOrStaffName}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{update.timestamp}</span>
                      </div>

                      {/* Public text sent to family */}
                      <p className="text-xs text-slate-800 font-medium mt-2 leading-relaxed">
                        {update.publicMessage}
                      </p>

                      {/* Baby Birth Announcement Card */}
                      {isBabyAnnouncement && (
                        <div className="mt-3 bg-white/90 border border-rose-200 rounded-xl p-3.5 shadow-xs space-y-2">
                          <div className="flex items-center gap-2 text-rose-900 font-black text-xs">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>OFFICIAL BABY BIRTH ANNOUNCEMENT</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                            <div className="bg-rose-50 p-2 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Gender</span>
                              <strong className="text-slate-900">{update.babyDetails!.gender} 👶</strong>
                            </div>
                            <div className="bg-rose-50 p-2 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Birth Weight</span>
                              <strong className="text-slate-900">{update.babyDetails!.birthWeightKg} kg</strong>
                            </div>
                            <div className="bg-rose-50 p-2 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Delivery Mode</span>
                              <strong className="text-slate-900">{update.babyDetails!.deliveryType}</strong>
                            </div>
                            <div className="bg-rose-50 p-2 rounded-lg">
                              <span className="text-slate-500 block text-[10px]">Time of Birth</span>
                              <strong className="text-slate-900">{update.babyDetails!.timeOfBirth}</strong>
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-600 pt-1">
                            <strong>Maternal Status:</strong> {update.babyDetails!.motherStatus}
                          </div>
                        </div>
                      )}

                      {/* Private Clinical Doctor Note (Confidential / Hospital staff only) */}
                      {update.privateClinicalNote && (
                        <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-600 flex items-start gap-2">
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-800">Confidential Clinical Note (Hospital Staff Only):</strong>
                            <p className="mt-0.5">{update.privateClinicalNote}</p>
                          </div>
                        </div>
                      )}

                      {/* Recipients Delivery Receipts */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp Broadcast:</span>
                          <span className="font-bold text-emerald-700">
                            {update.recipientsNotified.length} Family Contacts Notified
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {update.recipientsNotified.map((rec, i) => (
                            <span key={i} className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                              ✓ {rec.name} ({rec.status})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CONSENTED FAMILY CONTACTS */}
          {activeTab === 'FAMILY_CONSENT' && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-rose-950">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-rose-600" />
                  <div>
                    <h4 className="font-bold">Maternal Consent &amp; Family Nomination</h4>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      Only contacts approved by {patient.name} receive automated WhatsApp delivery updates. Clinical internal notes remain confidential.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddContact(true)}
                  className="px-3.5 py-2 bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:bg-rose-800 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Family Contact</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tracker.consentedContacts.map(contact => (
                  <div key={contact.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-black text-slate-900 text-xs">{contact.name}</h4>
                        <span className="text-[11px] text-rose-700 font-semibold">{contact.relationship}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Active Recipient
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.mobile}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        {contact.canReceiveWhatsApp && (
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </span>
                        )}
                        {contact.canReceiveSms && (
                          <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                            SMS
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          labourDeliveryService.removeConsentedContact(patient.id, contact.id);
                          setVersion(v => v + 1);
                        }}
                        className="text-red-600 hover:text-red-700 font-bold text-[10px] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Contact Modal */}
              {showAddContact && (
                <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 text-xs space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-black text-slate-900 text-sm">Nominate Consented Family Member</h4>
                      <button onClick={() => setShowAddContact(false)} className="text-lg font-bold">×</button>
                    </div>

                    <form onSubmit={handleAddContact} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Name</label>
                        <input
                          type="text"
                          required
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                          placeholder="e.g. Rajesh Das"
                          className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Relationship</label>
                        <select
                          value={newContactRelationship}
                          onChange={(e) => setNewContactRelationship(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-semibold"
                        >
                          <option value="Spouse">Spouse (Husband / Partner)</option>
                          <option value="Mother">Mother</option>
                          <option value="Mother-in-Law">Mother-in-Law</option>
                          <option value="Father">Father</option>
                          <option value="Sister">Sister</option>
                          <option value="Brother">Brother</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile (WhatsApp Number)</label>
                        <input
                          type="tel"
                          required
                          value={newContactMobile}
                          onChange={(e) => setNewContactMobile(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-semibold"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddContact(false)}
                          className="px-3 py-1.5 rounded-lg text-slate-600 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-rose-700 text-white rounded-xl font-bold shadow-sm"
                        >
                          Save Contact &amp; Grant Consent
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STAFF 1-CLICK PROGRESS CONTROL */}
          {activeTab === 'STAFF_CONTROL' && (
            <form onSubmit={handleStaffAdvanceStage} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                  Authorised Clinical Staff &amp; Doctor Interface
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-0.5">
                  Advance Labour Stage &amp; Broadcast to Consented Family
                </h4>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Milestone Stage to Announce</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LABOUR_STAGES_INFO.map(s => (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => setStaffSelectedStage(s.code)}
                      className={`text-left p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        staffSelectedStage === s.code 
                          ? 'bg-rose-50 border-rose-500 text-rose-950' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>Stage {s.stageNumber}: {s.title}</span>
                      {staffSelectedStage === s.code && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* If Stage 5 (Baby Delivered), show birth inputs */}
              {staffSelectedStage === 'STAGE_5_BABY_DELIVERED' && (
                <div className="bg-pink-50/70 border border-pink-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-pink-900 font-bold text-xs">
                    <Baby className="w-4 h-4 text-pink-600" />
                    <span>Newborn Birth Announcement Details (Family Broadcast)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={babyGender}
                        onChange={(e) => setBabyGender(e.target.value as any)}
                        className="w-full p-2 bg-white border rounded-lg font-bold"
                      >
                        <option value="Girl">Baby Girl 👧</option>
                        <option value="Boy">Baby Boy 👦</option>
                        <option value="Twins">Twins 👶👶</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Birth Weight (kg)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={babyWeightKg}
                        onChange={(e) => setBabyWeightKg(parseFloat(e.target.value) || 3.0)}
                        className="w-full p-2 bg-white border rounded-lg font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Delivery Type</label>
                      <select
                        value={deliveryType}
                        onChange={(e) => setDeliveryType(e.target.value as any)}
                        className="w-full p-2 bg-white border rounded-lg font-bold"
                      >
                        <option value="Normal Vaginal">Normal Vaginal</option>
                        <option value="Lower Segment C-Section (LSCS)">LSCS C-Section</option>
                        <option value="Assisted Vacuum">Assisted Vacuum</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Time of Birth</label>
                      <input
                        type="text"
                        value={timeOfBirth}
                        onChange={(e) => setTimeOfBirth(e.target.value)}
                        className="w-full p-2 bg-white border rounded-lg font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Custom WhatsApp Message for Family (Leave blank for default)
                </label>
                <textarea
                  rows={2}
                  value={customUpdateText}
                  onChange={(e) => setCustomUpdateText(e.target.value)}
                  placeholder={LABOUR_STAGES_INFO.find(s => s.code === staffSelectedStage)?.defaultDescription}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Confidential Doctor Clinical Note (Private to EMR, NOT sent to family WhatsApp)
                </label>
                <input
                  type="text"
                  value={privateClinicalNote}
                  onChange={(e) => setPrivateClinicalNote(e.target.value)}
                  placeholder="e.g. FHR 144 bpm regular, cervix 8 cm, clear liquor, maternal BP 120/80."
                  className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-slate-500">
                  Will instantly dispatch to <strong>{tracker.consentedContacts.length} consented contacts</strong> via WhatsApp.
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast Stage Update to WhatsApp</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
