import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  HeartHandshake, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { store } from '../services/store';

interface EnrolmentModalProps {
  onClose: () => void;
  onEnrolledSuccessfully: () => void;
}

export const EnrolmentModal: React.FC<EnrolmentModalProps> = ({
  onClose,
  onEnrolledSuccessfully
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('+91 ');
  const [age, setAge] = useState<number>(24);
  const [preferredLanguage, setPreferredLanguage] = useState<'Kannada' | 'Hindi' | 'Marathi' | 'Tamil' | 'English'>('Kannada');
  const [bloodGroup, setBloodGroup] = useState('B');
  const [rhFactor, setRhFactor] = useState<'Positive' | 'Negative'>('Positive');
  const [createPregnancy, setCreatePregnancy] = useState(true);
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState(30); // E.g. 30 weeks so glucose test is overdue!
  const [lmpDate, setLmpDate] = useState('2026-03-01');
  const [flags, setFlags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableFlags = ['Rh negative', 'pregnancy flagged small', 'Previous LSCS', 'GDM suspect'];

  const handleToggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // 1. Enrol Patient
      const patNumber = `91-${Math.floor(2000 + Math.random() * 7000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const patient = store.enrolPatient({
        patientIdNumber: `DH-ANC-2026-${String(store.patients.length + 1).padStart(3, '0')}`,
        abhaNumber: patNumber,
        abhaAddress: `${name.toLowerCase().replace(/[^a-z]/g, '')}@abdm`,
        name,
        dob: `${2026 - age}-05-15`,
        age,
        gender: 'female',
        mobile: mobile.trim() || '+91 98450 12345',
        preferredLanguage: preferredLanguage as any,
        facilityId: store.currentFacility.id,
        address: { villageOrTown: 'Dharwad Urban', talukOrDistrict: 'Dharwad', pincode: '580001' },
        bloodGroup,
        rhFactor,
        currentEpisodeType: createPregnancy ? 'pregnancy' : undefined
      });

      // 2. Create Pregnancy & trigger rules engine
      if (createPregnancy) {
        store.createPregnancyEpisode({
          motherId: patient.id,
          lmpDate,
          edd: '2026-12-08',
          gestationalAgeWeeks,
          gravida: 1,
          para: 0,
          flags
        });
      }

      setIsSubmitting(false);
      onEnrolledSuccessfully();
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-700 rounded-lg text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Enrol Patient & Pregnancy Episode</h2>
              <p className="text-xs text-teal-200">
                Care-gap engine will instantly calculate milestones and overdue tasks.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-teal-300 hover:text-white rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 text-xs space-y-4">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              1. Mother Information
            </h3>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Renuka B."
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                >
                  <option value="Kannada">Kannada</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="O">O</option>
                  <option value="AB">AB</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Rh Factor</label>
                <select
                  value={rhFactor}
                  onChange={(e) => setRhFactor(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                >
                  <option value="Positive">Positive (+)</option>
                  <option value="Negative">Negative (-)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pregnancy Episode Section */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-teal-700" />
                <span>2. Active Pregnancy Episode</span>
              </h3>
              <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={createPregnancy}
                  onChange={(e) => setCreatePregnancy(e.target.checked)}
                  className="accent-teal-700"
                />
                <span>Enrol Episode Now</span>
              </label>
            </div>

            {createPregnancy && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Current Gestation (Weeks)</label>
                    <input
                      type="number"
                      min={4}
                      max={42}
                      value={gestationalAgeWeeks}
                      onChange={(e) => setGestationalAgeWeeks(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white font-bold text-teal-900"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Tip: Set to 30wks to see Glucose test overdue!
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">LMP Date</label>
                    <input
                      type="date"
                      value={lmpDate}
                      onChange={(e) => setLmpDate(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Clinician Recorded Flags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableFlags.map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => handleToggleFlag(f)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                          flags.includes(f)
                            ? 'bg-amber-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Calculating Care Gaps...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enrol & Compute Milestones</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
