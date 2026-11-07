import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Star, 
  Phone, 
  Check, 
  Trash2, 
  Edit3, 
  Heart, 
  FileText, 
  Lock, 
  AlertCircle,
  Eye,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { FamilyMember, FamilyRelationship, ConsentLevel, OpdPatient } from '../../types';
import { familyService } from '../../services/familyService';

interface FamilyMemberManagementPanelProps {
  patient: OpdPatient;
  onSelectFamilyMemberAsActive?: (member: FamilyMember) => void;
  activeMemberId?: string | null;
}

export const FamilyMemberManagementPanel: React.FC<FamilyMemberManagementPanelProps> = ({
  patient,
  onSelectFamilyMemberAsActive,
  activeMemberId
}) => {
  const [, setVersion] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<FamilyRelationship>('SPOUSE');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Male');
  const [mobile, setMobile] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O Positive');
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);
  const [emergencyPriority, setEmergencyPriority] = useState(1);
  const [consentLevel, setConsentLevel] = useState<ConsentLevel>('FULL_ACCESS');
  const [abhaNumber, setAbhaNumber] = useState('');
  const [abhaAddress, setAbhaAddress] = useState('');
  const [abhaLinked, setAbhaLinked] = useState(false);
  const [allowedRecords, setAllowedRecords] = useState<('PRESCRIPTIONS' | 'LAB_REPORTS' | 'APPOINTMENTS' | 'MATERNITY_UPDATES' | 'VACCINATIONS')[]>([
    'PRESCRIPTIONS', 'LAB_REPORTS', 'APPOINTMENTS', 'MATERNITY_UPDATES'
  ]);
  const [medicalHistorySummary, setMedicalHistorySummary] = useState('');

  const members = familyService.getMembersForPatient(patient.id);

  const handleOpenAdd = () => {
    setName('');
    setRelationship('SPOUSE');
    setAge(30);
    setGender('Male');
    setMobile('+91 ');
    setBloodGroup('O Positive');
    setIsEmergencyContact(false);
    setEmergencyPriority(1);
    setConsentLevel('FULL_ACCESS');
    setAbhaNumber('');
    setAbhaAddress('');
    setAbhaLinked(false);
    setAllowedRecords(['PRESCRIPTIONS', 'LAB_REPORTS', 'APPOINTMENTS', 'MATERNITY_UPDATES']);
    setMedicalHistorySummary('');
    setEditingMember(null);
    setShowAddModal(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingMember) {
      familyService.updateMember(editingMember.id, {
        name,
        relationship,
        age,
        gender,
        mobile,
        bloodGroup,
        isEmergencyContact,
        emergencyPriority,
        consentLevel,
        abhaNumber: abhaLinked ? abhaNumber : undefined,
        abhaAddress: abhaLinked ? abhaAddress : undefined,
        abhaLinked,
        allowedRecordTypes: allowedRecords,
        medicalHistorySummary
      });
    } else {
      familyService.addMember({
        primaryPatientId: patient.id,
        name,
        relationship,
        age,
        gender,
        mobile,
        bloodGroup,
        isEmergencyContact,
        emergencyPriority,
        consentLevel,
        abhaNumber: abhaLinked ? abhaNumber : undefined,
        abhaAddress: abhaLinked ? abhaAddress : undefined,
        abhaLinked,
        allowedRecordTypes: allowedRecords,
        medicalHistorySummary
      });
    }

    setVersion(v => v + 1);
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this family member?')) {
      familyService.deleteMember(id);
      setVersion(v => v + 1);
    }
  };

  const toggleRecordType = (type: 'PRESCRIPTIONS' | 'LAB_REPORTS' | 'APPOINTMENTS' | 'MATERNITY_UPDATES' | 'VACCINATIONS') => {
    if (allowedRecords.includes(type)) {
      setAllowedRecords(allowedRecords.filter(t => t !== type));
    } else {
      setAllowedRecords([...allowedRecords, type]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-purple-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-rose-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-300" />
            <h3 className="text-base font-black">Family Members &amp; Dependants</h3>
            <span className="text-[10px] bg-rose-500/30 text-rose-200 border border-rose-400/30 px-2 py-0.5 rounded-full font-bold">
              {members.length} Registered
            </span>
          </div>
          <p className="text-xs text-rose-100 mt-1 max-w-xl">
            Manage your family circle under primary account holder <strong className="text-white">{patient.name}</strong>. Nominate emergency contacts, control record sharing consent, and link individual Ayushman Bharat Health Accounts (ABHA).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-rose-900 hover:bg-rose-50 rounded-xl text-xs font-black shadow-md transition shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-rose-700" />
          <span>+ Add Family Member</span>
        </button>
      </div>

      {/* Active Profile Context Banner if switched */}
      {activeMemberId && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Currently viewing records in context of: <strong>{members.find(m => m.id === activeMemberId)?.name}</strong></span>
          </div>
          <button
            onClick={() => onSelectFamilyMemberAsActive && onSelectFamilyMemberAsActive(null as any)}
            className="text-amber-800 font-bold hover:underline cursor-pointer"
          >
            Switch back to {patient.name} (Primary)
          </button>
        </div>
      )}

      {/* Family Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map(member => {
          const isActive = activeMemberId === member.id;
          return (
            <div 
              key={member.id}
              className={`rounded-2xl p-4 border transition-all ${
                isActive 
                  ? 'bg-rose-50/70 border-rose-400 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                    member.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {member.relationship === 'CHILD' ? '👶' : member.gender === 'Female' ? '👩' : '👨'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{member.name}</h4>
                      {member.isEmergencyContact && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded-md">
                          <Star className="w-2.5 h-2.5 fill-red-600 text-red-600" />
                          Emergency Contact #{member.emergencyPriority || 1}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-rose-700">{member.relationship}</span>
                      <span>•</span>
                      <span>{member.age > 0 ? `${member.age} yrs` : 'Newborn (<1 yr)'}</span>
                      <span>•</span>
                      <span>{member.gender}</span>
                      {member.bloodGroup && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-slate-700">🩸 {member.bloodGroup}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setName(member.name);
                      setRelationship(member.relationship);
                      setAge(member.age);
                      setGender(member.gender);
                      setMobile(member.mobile);
                      setBloodGroup(member.bloodGroup || 'O Positive');
                      setIsEmergencyContact(member.isEmergencyContact);
                      setEmergencyPriority(member.emergencyPriority || 1);
                      setConsentLevel(member.consentLevel);
                      setAbhaNumber(member.abhaNumber || '');
                      setAbhaAddress(member.abhaAddress || '');
                      setAbhaLinked(member.abhaLinked);
                      setAllowedRecords(member.allowedRecordTypes);
                      setMedicalHistorySummary(member.medicalHistorySummary || '');
                      setShowAddModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit profile"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Remove member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contact & ABHA */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{member.mobile}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className={`w-3.5 h-3.5 ${member.abhaLinked ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {member.abhaLinked ? (
                    <span className="text-[11px] font-bold text-emerald-800 truncate">
                      ABHA: {member.abhaNumber || member.abhaAddress}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">ABHA not linked</span>
                  )}
                </div>
              </div>

              {/* Medical History Summary */}
              {member.medicalHistorySummary && (
                <div className="mt-2 text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                  <strong className="text-slate-800">History:</strong> {member.medicalHistorySummary}
                </div>
              )}

              {/* Consent & Allowed Records */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-500">Consent:</span>
                  <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                    member.consentLevel === 'FULL_ACCESS' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : member.consentLevel === 'EMERGENCY_ONLY'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {member.consentLevel.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span>Permitted: {member.allowedRecordTypes.length} records</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => onSelectFamilyMemberAsActive && onSelectFamilyMemberAsActive(isActive ? (null as any) : member)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'bg-rose-700 text-white shadow-xs' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>{isActive ? 'Active Profile' : 'Switch to Profile'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Family Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden text-xs">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold">
                  {editingMember ? 'Edit Family Member Profile' : 'Register New Family Member'}
                </h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Das"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-rose-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Relationship to {patient.name} *</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as FamilyRelationship)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-rose-500 outline-hidden"
                  >
                    <option value="SPOUSE">Spouse (Husband / Wife)</option>
                    <option value="CHILD">Child / Newborn</option>
                    <option value="MOTHER">Mother</option>
                    <option value="FATHER">Father</option>
                    <option value="MOTHER_IN_LAW">Mother-in-Law</option>
                    <option value="FATHER_IN_LAW">Father-in-Law</option>
                    <option value="SIBLING">Sibling (Brother / Sister)</option>
                    <option value="DEPENDANT">Other Dependant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-rose-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-rose-500 outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-rose-500 outline-hidden"
                  >
                    <option value="O Positive">O Positive (O+)</option>
                    <option value="O Negative">O Negative (O-)</option>
                    <option value="A Positive">A Positive (A+)</option>
                    <option value="A Negative">A Negative (A-)</option>
                    <option value="B Positive">B Positive (B+)</option>
                    <option value="B Negative">B Negative (B-)</option>
                    <option value="AB Positive">AB Positive (AB+)</option>
                    <option value="AB Negative">AB Negative (AB-)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Contact Number *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98451 12340"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-rose-500 outline-hidden"
                />
              </div>

              {/* Emergency Contact Nomination */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-rose-600 fill-rose-600" />
                    <span className="font-bold text-rose-950 text-xs">Nominate as Emergency Contact</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEmergencyContact}
                    onChange={(e) => setIsEmergencyContact(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                  />
                </div>
                {isEmergencyContact && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-rose-800">
                    <span>Emergency Priority:</span>
                    <select
                      value={emergencyPriority}
                      onChange={(e) => setEmergencyPriority(parseInt(e.target.value) || 1)}
                      className="bg-white border border-rose-300 rounded-lg px-2 py-1 font-bold text-xs"
                    >
                      <option value={1}>#1 Primary Next-of-Kin</option>
                      <option value={2}>#2 Secondary Emergency Contact</option>
                      <option value={3}>#3 Tertiary Contact</option>
                    </select>
                  </div>
                )}
              </div>

              {/* ABHA Linkage */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-xs">Ayushman Bharat Health Account (ABHA)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!abhaLinked) {
                        setAbhaNumber(`91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
                        setAbhaAddress(`${name.toLowerCase().replace(/\s+/g, '.') || 'user'}@abdm`);
                        setAbhaLinked(true);
                      } else {
                        setAbhaLinked(false);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                      abhaLinked ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {abhaLinked ? '✓ ABHA Linked' : '+ Link / Generate ABHA'}
                  </button>
                </div>
                {abhaLinked && (
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">ABHA Number</span>
                      <span className="font-bold text-slate-800">{abhaNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">ABHA Address</span>
                      <span className="font-bold text-slate-800">{abhaAddress}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Consent & Permissions */}
              <div className="border border-slate-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Consent &amp; Privacy Level</span>
                  <select
                    value={consentLevel}
                    onChange={(e) => setConsentLevel(e.target.value as ConsentLevel)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                  >
                    <option value="FULL_ACCESS">Full Access (All Records &amp; Milestones)</option>
                    <option value="LAB_AND_MEDS_ONLY">Lab Reports &amp; Medicines Only</option>
                    <option value="EMERGENCY_ONLY">Emergency Alerts Only</option>
                    <option value="RESTRICTED">Restricted / Limited</option>
                  </select>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">Permitted Health Information:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {[
                      { key: 'APPOINTMENTS', label: 'Appointments & Consultations' },
                      { key: 'PRESCRIPTIONS', label: 'Prescriptions & Medicines' },
                      { key: 'LAB_REPORTS', label: 'Diagnostic Lab Reports' },
                      { key: 'MATERNITY_UPDATES', label: 'Labour & Delivery Updates' },
                      { key: 'VACCINATIONS', label: 'Immunisation & Vaccines' }
                    ].map(rec => (
                      <label key={rec.key} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowedRecords.includes(rec.key as any)}
                          onChange={() => toggleRecordType(rec.key as any)}
                          className="w-3.5 h-3.5 text-rose-600 rounded"
                        />
                        <span className="text-slate-700">{rec.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Medical History &amp; Chronic Conditions (Optional)</label>
                <textarea
                  rows={2}
                  value={medicalHistorySummary}
                  onChange={(e) => setMedicalHistorySummary(e.target.value)}
                  placeholder="e.g. Hypertension on medication, history of allergic rhinitis..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-rose-500 outline-hidden"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white shadow-sm cursor-pointer"
                >
                  {editingMember ? 'Save Changes' : 'Add Family Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
