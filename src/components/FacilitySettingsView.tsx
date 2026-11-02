import React, { useState } from 'react';
import { 
  Building, 
  Languages, 
  MessageSquare, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Fingerprint,
  Phone
} from 'lucide-react';
import { store } from '../services/store';

export const FacilitySettingsView: React.FC = () => {
  const [facilityName, setFacilityName] = useState(store.currentFacility.name);
  const [district, setDistrict] = useState(store.currentFacility.district);
  const [defaultLanguage, setDefaultLanguage] = useState(store.currentFacility.defaultLanguage);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.currentFacility = {
      ...store.currentFacility,
      name: facilityName,
      district,
      defaultLanguage
    };
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Facility & Communication Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hospital Admin portal for local language defaults, ABDM gateway, and outreach channels.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Facility Info Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-700" />
            <span>Facility Identification & Regional Language</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Facility Name</label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">District / Region</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Primary Regional Language (Default for WhatsApp templates)
            </label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
            >
              <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>

        {/* Integration Gateways */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Digital Health Integrations & Gateways</span>
          </h3>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">ABDM Sandbox Adapter (NRCeS India FHIR R4)</p>
                  <p className="text-[11px] text-slate-500">Connected as Health Repository Provider (HRP)</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Active / Bridge Online
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">WhatsApp Cloud Business API</p>
                  <p className="text-[11px] text-slate-500">Interactive hospital outreach channel</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Active / Verified
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">SMS Fallback Gateway (CDAC / NIC DLT)</p>
                  <p className="text-[11px] text-slate-500">Automatic secondary dispatch when WhatsApp delivery fails</p>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Communication Templates (Section 18) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Languages className="w-4 h-4 text-teal-700" />
            <span>Configured Outreach Templates</span>
          </h3>

          <div className="space-y-2">
            {store.communicationTemplates.map(tmpl => (
              <div key={tmpl.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-bold text-slate-900">{tmpl.title}</span>
                  <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                    {tmpl.language}
                  </span>
                </div>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">{tmpl.message}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </form>
    </div>
  );
};
