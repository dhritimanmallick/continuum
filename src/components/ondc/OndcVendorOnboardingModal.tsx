import React, { useState } from 'react';
import { 
  Building2, 
  Microscope, 
  Pill, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight, 
  Key, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Check, 
  RefreshCw,
  Store,
  Layers
} from 'lucide-react';
import { OndcOnboardingPayload, AuthUser } from '../../types';
import { ondcNetworkService } from '../../services/ondcNetworkService';
import { opdStore } from '../../services/opdStore';
import { authService } from '../../services/authService';

interface OndcVendorOnboardingModalProps {
  onClose: () => void;
  onSuccess: (user: AuthUser, shopName: string, category: 'LAB' | 'PHARMA') => void;
  defaultType?: 'PATHOLOGY_LAB' | 'PHARMACY';
}

export const OndcVendorOnboardingModal: React.FC<OndcVendorOnboardingModalProps> = ({
  onClose,
  onSuccess,
  defaultType = 'PATHOLOGY_LAB'
}) => {
  const [vendorType, setVendorType] = useState<'PATHOLOGY_LAB' | 'PHARMACY'>(defaultType);
  const [shopName, setShopName] = useState('');
  const [inChargeName, setInChargeName] = useState('');
  const [contactPhone, setContactPhone] = useState('+91 9');
  const [contactEmail, setContactEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hubballi-Dharwad');
  const [pincode, setPincode] = useState('580020');
  const [serviceRadiusKm, setServiceRadiusKm] = useState<number>(10);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('vendor123');
  const [turnaroundOrDelivery, setTurnaroundOrDelivery] = useState('2 to 4 Hours');
  const [accreditationOrOffer, setAccreditationOrOffer] = useState('NABL Certified / NABH Accredited');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [registrationResult, setRegistrationResult] = useState<{
    subscriberId: string;
    user: AuthUser;
    shopName: string;
  } | null>(null);

  // Auto-generate username from shop name if empty
  const handleShopNameChange = (val: string) => {
    setShopName(val);
    if (!username || username === 'vendor') {
      const generated = val.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
      if (generated) setUsername(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !inChargeName || !username) return;

    setIsSubmitting(true);
    setSubmissionStep('Connecting to ONDC Open Health Gateway (gateway.ondc.org)...');

    setTimeout(() => {
      setSubmissionStep('Validating Clinical / Drug Establishment License & Ed25519 Keys...');
      
      setTimeout(() => {
        setSubmissionStep('Publishing BPP Seller Catalog (ONDC:RET18 - Health & Wellness)...');

        setTimeout(() => {
          setSubmissionStep('Provisioning Dedicated Add-on Vendor Login...');

          const payload: OndcOnboardingPayload = {
            vendorType,
            shopName,
            inChargeName,
            contactPhone,
            contactEmail: contactEmail || `${username}@ondc-health.in`,
            licenseNumber: licenseNumber || (vendorType === 'PATHOLOGY_LAB' ? 'NABL/MC-8920' : 'DL-KA-20B-5591'),
            address: address || 'Opp. District Hospital Cross, Hubballi',
            locality: 'City Centre',
            city,
            pincode,
            serviceRadiusKm,
            username,
            password,
            turnaroundOrDelivery: turnaroundOrDelivery || 'Same-day turnaround',
            accreditationOrOffer
          };

          // 1. Register in ONDC Service
          const reg = ondcNetworkService.registerVendorShop(payload);

          // 2. Add Partner to opdStore
          if (vendorType === 'PATHOLOGY_LAB') {
            opdStore.addLabPartner({
              id: reg.shopId,
              name: shopName,
              type: 'Distant Standalone Diagnostic Hub',
              distance: 'Connected via ONDC Network',
              location: address || `${city} - ${pincode}`,
              city,
              state: 'Karnataka',
              pincode,
              inCharge: inChargeName,
              accreditation: accreditationOrOffer,
              operatingHours: '07:30 AM – 09:30 PM',
              contact: contactPhone,
              sampleCollectionMode: 'Both Available',
              turnaroundHours: turnaroundOrDelivery,
              badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
              ondcParticipantId: reg.subscriberId,
              ondcStatus: 'ACTIVE_SELLER_NODE',
              ondcCatalogCount: 52,
              isOnboardedVendor: true
            });
            opdStore.setSelectedLab(reg.shopId);
          } else {
            opdStore.addPharmacyPartner({
              id: reg.shopId,
              name: shopName,
              type: 'Retail Partner',
              distance: 'Connected via ONDC Network',
              counterLocation: address || `${city} - ${pincode}`,
              city,
              state: 'Karnataka',
              pincode,
              deliveryRadiusKm: serviceRadiusKm,
              isEmergencyNightStore: true,
              operatingHours: '08:00 AM – 10:30 PM',
              contact: contactPhone,
              discountOffer: accreditationOrOffer || 'Flat 15% concession for OPD referrals',
              pharmacistInCharge: inChargeName,
              badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
              ondcParticipantId: reg.subscriberId,
              ondcStatus: 'ACTIVE_SELLER_NODE',
              ondcCatalogCount: 380,
              isOnboardedVendor: true
            });
            opdStore.setSelectedPharmacy(reg.shopId);
          }

          // 3. Create Auth User in authService
          const newUser = authService.addVendorUser({
            username,
            password,
            name: inChargeName,
            title: `${shopName} (${vendorType === 'PATHOLOGY_LAB' ? 'Pathology Lab' : 'Pharmacy'})`,
            role: vendorType === 'PATHOLOGY_LAB' ? 'LAB' : 'PHARMA',
            vendorType,
            vendorPartnerId: reg.shopId,
            ondcParticipantId: reg.subscriberId,
            facilityName: shopName,
            phone: contactPhone,
            email: contactEmail || `${username}@ondc-health.in`
          });

          setIsSubmitting(false);
          setRegistrationResult({
            subscriberId: reg.subscriberId,
            user: newUser,
            shopName
          });
        }, 600);
      }, 600);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-auto overflow-hidden text-slate-800">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-xl shrink-0">
              <Globe className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  ONDC Open Network Health Integration
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Beckn BPP Protocol
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Join as Partner Vendor (Add-on Login)
              </h2>
              <p className="text-xs text-indigo-200/80">
                Interested pathology diagnostic labs and chemist shops can connect to St. Anne Hospital's OPD network via ONDC.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {registrationResult ? (
          /* SUCCESS SCREEN */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-2xl shadow-sm border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                ONDC Vendor Shop Successfully Connected!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                <strong className="text-slate-800">{registrationResult.shopName}</strong> has been provisioned on the ONDC Health Gateway as an active BPP Seller Node with live hospital OPD integration.
              </p>
            </div>

            {/* Credential & Network Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left max-w-lg mx-auto space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">ONDC Subscriber ID (BPP):</span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {registrationResult.subscriberId}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Add-on Login Username:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {registrationResult.user.username}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Default Passcode:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {password}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Domain & Protocol:</span>
                <span className="font-semibold text-slate-700">
                  ONDC:RET18 • Beckn v1.1.0 Gateway
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Features Enabled:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  {vendorType === 'PATHOLOGY_LAB' ? 'OCR Report Decipher + ABDM Sync' : 'E-Rx Dispense + Generic Savings'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onSuccess(registrationResult.user, registrationResult.shopName, vendorType === 'PATHOLOGY_LAB' ? 'LAB' : 'PHARMA');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
              >
                <span>Launch & Enter as {registrationResult.user.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Return to Login Screen
              </button>
            </div>
          </div>
        ) : isSubmitting ? (
          /* SUBMITTING / CONNECTING ANIMATION */
          <div className="p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                Integrating Shop into ONDC Network...
              </h3>
              <p className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 py-1.5 px-3 rounded-lg max-w-md mx-auto animate-pulse">
                {submissionStep}
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-2 text-[11px] text-slate-500 text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>ONDC Gateway Handshake</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Beckn Encryption Key Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>Publishing Catalog to St. Anne Hospital Network</span>
              </div>
            </div>
          </div>
        ) : (
          /* ONBOARDING FORM */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {/* Step 1: Select Vendor Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Select Vendor Category:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setVendorType('PATHOLOGY_LAB');
                    setAccreditationOrOffer('NABL Certified / NABH Accredited');
                    setTurnaroundOrDelivery('2 to 4 Hours');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    vendorType === 'PATHOLOGY_LAB'
                      ? 'bg-purple-50/70 border-purple-400 ring-2 ring-purple-200 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                    <Microscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Pathology Lab / Diagnostic Centre</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Upload PDF reports, live OCR extraction, ABDM sync, diagnostic analyser
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVendorType('PHARMACY');
                    setAccreditationOrOffer('Flat 15% OPD concession / Jan Aushadhi generic savings');
                    setTurnaroundOrDelivery('Within 30 mins / Walk-in');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    vendorType === 'PHARMACY'
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Retail Chemist / Pharmacy Shop</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      E-prescription orders, generic Jan Aushadhi substitution, dispensing
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Shop & Professional Info */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                2. Shop Details & Professional Licensing:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Shop / Diagnostic Lab Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => handleShopNameChange(e.target.value)}
                    placeholder={vendorType === 'PATHOLOGY_LAB' ? 'e.g. LifeCare Diagnostic Hub' : 'e.g. Sanjeevani Medicos & Chemist'}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    In-Charge Professional Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inChargeName}
                    onChange={(e) => setInChargeName(e.target.value)}
                    placeholder={vendorType === 'PATHOLOGY_LAB' ? 'Dr. Ramesh Kulkarni, MD' : 'Suresh Patel, R.Ph.'}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {vendorType === 'PATHOLOGY_LAB' ? 'NABL / Clinical Reg No.' : 'Drug License (Form 20/21) / PCI Reg'}
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder={vendorType === 'PATHOLOGY_LAB' ? 'NABL/MC-4819' : 'KA-DWD-20B-18490'}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Contact Phone (Mobile / WhatsApp) *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Physical Address & Locality
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Near KMC Circle, PB Road"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="580020"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Add-on Login Credentials & ONDC Node Config */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                3. Create Add-on Login Credentials & ONDC Participant:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Vendor Login Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. lifecarelab"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Passcode *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="vendor123"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* ONDC Registry Preview banner */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Auto-Provisioned ONDC BPP ID: </span>
                    <span className="font-mono text-indigo-700 font-bold">
                      {vendorType === 'PATHOLOGY_LAB' ? 'BPP-LAB-' : 'BPP-PHARM-'}
                      {(username || 'vendor').toUpperCase()}-402
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Instant Node Sync
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs cursor-pointer transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition"
              >
                <Globe className="w-4 h-4" />
                <span>Register Shop & Activate ONDC Login</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
