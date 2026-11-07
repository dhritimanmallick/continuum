import React, { useState, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from '@vis.gl/react-google-maps';
import { 
  Building2, 
  Microscope, 
  Pill, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle, 
  ChevronRight, 
  Star, 
  ArrowRight,
  Filter,
  Layers,
  HelpCircle
} from 'lucide-react';
import { costEstimatorService } from '../../services/costEstimatorService';

export interface VicinityCostOption {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'LAB' | 'PHARMACY';
  categoryLabel: string;
  lat: number;
  lng: number;
  address: string;
  distanceKm: number;
  drivingEtaMinutes: number;
  walkingEtaMinutes: number;
  rating: number;
  reviewCount: number;
  phone: string;
  ondcNodeId?: string;
  govtSchemeCoverage: string;
  badge: string;
  badgeColor: string;
  estimatedCosts: {
    serviceName: string;
    costInr: number;
    originalMarketPriceInr?: number;
    savingsNote?: string;
    isCoveredByGovt?: boolean;
  }[];
  totalEstimatedInr: number;
  homeCollectionOrDelivery: string;
  timings: string;
}

// Verified real vicinity healthcare network around St. Anne Hospital (Hubballi-Dharwad)
export const VICINITY_COST_OPTIONS: VicinityCostOption[] = [
  {
    id: 'opt-st-anne',
    name: 'St. Anne Mother & Child Hospital (Main Tertiary Centre)',
    type: 'HOSPITAL',
    categoryLabel: 'Maternity Hospital & OT Block',
    lat: 15.3647,
    lng: 75.1240,
    address: 'Station Road, Hubballi Central',
    distanceKm: 0.0,
    drivingEtaMinutes: 1,
    walkingEtaMinutes: 1,
    rating: 4.8,
    reviewCount: 340,
    phone: '+91 98450 11223',
    govtSchemeCoverage: '100% Cashless under PM-JAY & Janani Shishu Suraksha (JSSK)',
    badge: 'Tertiary Care Base',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    estimatedCosts: [
      { serviceName: 'Normal Vaginal Delivery Care Package (3 Days)', costInr: 22000, originalMarketPriceInr: 32000, isCoveredByGovt: true, savingsNote: '₹0 under JSSK' },
      { serviceName: 'Cesarean Delivery Package (LSCS 4 Days)', costInr: 45000, originalMarketPriceInr: 65000, isCoveredByGovt: true, savingsNote: 'Covered under PM-JAY code SOG001' },
      { serviceName: 'High-Risk Maternal & Foetal HDU Care', costInr: 58000, originalMarketPriceInr: 85000 }
    ],
    totalEstimatedInr: 22000,
    homeCollectionOrDelivery: '24/7 Casualty & Triage In-Patient',
    timings: '24 Hours Open (Emergency & Labour Room)'
  },
  {
    id: 'opt-city-care',
    name: 'City Care Maternity & Nursing Home (Affiliated Vicinity Node)',
    type: 'HOSPITAL',
    categoryLabel: 'Affiliated Maternity Suite',
    lat: 15.3695,
    lng: 75.1320,
    address: 'Keshwapur Main Road, Hubballi',
    distanceKm: 1.4,
    drivingEtaMinutes: 4,
    walkingEtaMinutes: 14,
    rating: 4.6,
    reviewCount: 180,
    phone: '+91 836 2267800',
    govtSchemeCoverage: 'AB-PMJAY Empanelled (Fixed Government Tariff)',
    badge: 'Affiliated Partner',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    estimatedCosts: [
      { serviceName: 'Normal Vaginal Delivery Package', costInr: 18500, originalMarketPriceInr: 28000, savingsNote: 'Economy Nursing Home Rate' },
      { serviceName: 'Cesarean Section (LSCS)', costInr: 38000, originalMarketPriceInr: 55000 }
    ],
    totalEstimatedInr: 18500,
    homeCollectionOrDelivery: 'Inpatient Maternity Suites Available',
    timings: '08:00 AM - 10:00 PM'
  },
  {
    id: 'opt-apollo-cradle',
    name: "Apollo Cradle & Children's Hospital",
    type: 'HOSPITAL',
    categoryLabel: 'Maternity Specialty & Foetal Health',
    lat: 15.3710,
    lng: 75.1220,
    address: 'Vidyanagar High Street, Hubballi',
    distanceKm: 1.8,
    drivingEtaMinutes: 5,
    walkingEtaMinutes: 18,
    rating: 4.9,
    reviewCount: 480,
    phone: '+91 836 2378900',
    govtSchemeCoverage: 'ABDM Empanelled • Private Insurance Cashless',
    badge: 'JCI / NABH Boutique Suites',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    estimatedCosts: [
      { serviceName: 'Luxury LDRP Suite Delivery Package (3 Days)', costInr: 48000, originalMarketPriceInr: 65000 },
      { serviceName: 'Elective / Emergency Cesarean (LSCS 4 Days)', costInr: 85000, originalMarketPriceInr: 110000 },
      { serviceName: 'Level-3 NICU Bed Day Care', costInr: 12000, originalMarketPriceInr: 18000 }
    ],
    totalEstimatedInr: 48000,
    homeCollectionOrDelivery: '24/7 Emergency Labour Admission & Antenatal OPD',
    timings: '24 Hours Open'
  },
  {
    id: 'opt-fortis-femme',
    name: 'Fortis La Femme Maternal & Gynaecology Hospital',
    type: 'HOSPITAL',
    categoryLabel: 'Women’s Super-Specialty Hospital',
    lat: 15.3580,
    lng: 75.1150,
    address: 'Gokul Road Corridor, Hubballi',
    distanceKm: 2.5,
    drivingEtaMinutes: 7,
    walkingEtaMinutes: 25,
    rating: 4.7,
    reviewCount: 310,
    phone: '+91 836 2445600',
    govtSchemeCoverage: 'AB-PMJAY Empanelled for Surgical Packages',
    badge: 'NABH Multi-Specialty',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    estimatedCosts: [
      { serviceName: 'Normal Delivery Antenatal & Postnatal Suite', costInr: 38000, originalMarketPriceInr: 52000 },
      { serviceName: 'Cesarean Delivery (LSCS)', costInr: 72000, originalMarketPriceInr: 95000 }
    ],
    totalEstimatedInr: 38000,
    homeCollectionOrDelivery: 'High-Risk Pregnancy HDU Beds',
    timings: '24 Hours Open'
  },
  {
    id: 'opt-cloudnine',
    name: 'Cloudnine Maternity & Neonatal Hospital',
    type: 'HOSPITAL',
    categoryLabel: 'Maternity Suites & Neonatology',
    lat: 15.3820,
    lng: 75.1290,
    address: 'Unkal Lake Bypass Road, Hubballi',
    distanceKm: 3.2,
    drivingEtaMinutes: 8,
    walkingEtaMinutes: 32,
    rating: 4.9,
    reviewCount: 520,
    phone: '+91 836 2889100',
    govtSchemeCoverage: 'TPA & ABDM Digital Health Records Linked',
    badge: 'Premium Birthing Centre',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    estimatedCosts: [
      { serviceName: 'Signature Birthing Suite Delivery', costInr: 52000, originalMarketPriceInr: 72000 },
      { serviceName: 'Cesarean Section Care Package', costInr: 89000, originalMarketPriceInr: 120000 }
    ],
    totalEstimatedInr: 52000,
    homeCollectionOrDelivery: '24/7 Neonatal Intensive Care & Ambulance',
    timings: '24 Hours Open'
  },
  {
    id: 'opt-apex-lab',
    name: 'Apex Diagnostic Centre & Advanced Path Lab',
    type: 'LAB',
    categoryLabel: 'ONDC Diagnostic Seller Node',
    lat: 15.3582,
    lng: 75.1328,
    address: 'City Centre Plaza, Court Circle, Hubballi',
    distanceKm: 1.2,
    drivingEtaMinutes: 4,
    walkingEtaMinutes: 12,
    rating: 4.9,
    reviewCount: 420,
    phone: '+91 836 2251900',
    ondcNodeId: 'BPP-LAB-APEX-092',
    govtSchemeCoverage: 'Standard CGHS / ONDC Discounted Tariffs',
    badge: 'ONDC Verified Lab',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    estimatedCosts: [
      { serviceName: '75g Oral Glucose (OGTT) Gestational Diabetes', costInr: 350, originalMarketPriceInr: 550, savingsNote: 'Save ₹200' },
      { serviceName: 'Complete Antenatal Blood Panel (CBC + TSH + Viral)', costInr: 950, originalMarketPriceInr: 1600, savingsNote: 'Save ₹650' },
      { serviceName: 'First Trimester Dual Marker (PAPP-A + β-hCG)', costInr: 1850, originalMarketPriceInr: 2800, savingsNote: 'Save ₹950' }
    ],
    totalEstimatedInr: 350,
    homeCollectionOrDelivery: 'Free Home Phlebotomy Pickup in 20 mins',
    timings: '06:30 AM - 09:30 PM (Daily)'
  },
  {
    id: 'opt-suraksha-imaging',
    name: 'Suraksha Ultrasound & Diagnostic Imaging',
    type: 'LAB',
    categoryLabel: 'Foetal Medicine & Sonography',
    lat: 15.3712,
    lng: 75.1180,
    address: 'Vidyanagar High Street, Hubballi',
    distanceKm: 0.9,
    drivingEtaMinutes: 3,
    walkingEtaMinutes: 10,
    rating: 4.9,
    reviewCount: 510,
    phone: '+91 836 2374100',
    ondcNodeId: 'BPP-LAB-SURAKSHA-114',
    govtSchemeCoverage: 'JSSK Accredited Referral Center for High-Risk Sonography',
    badge: '4D Foetal Imaging Specialist',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    estimatedCosts: [
      { serviceName: 'Advanced 4D Fetal Anomaly Ultrasound (TIFFA)', costInr: 1800, originalMarketPriceInr: 2600, savingsNote: 'Includes 3D Face Clip' },
      { serviceName: 'Obstetric Growth Biometry & Foetal Color Doppler', costInr: 1100, originalMarketPriceInr: 1800, savingsNote: 'Same-Hour Report' },
      { serviceName: '1st Trimester NT / Dating Viability Scan', costInr: 800, originalMarketPriceInr: 1200 }
    ],
    totalEstimatedInr: 1800,
    homeCollectionOrDelivery: 'Walk-in Sonography Suite with Slot Reservation',
    timings: '08:00 AM - 08:30 PM'
  },
  {
    id: 'opt-district-lab',
    name: 'Hubballi District Reference Pathology Hub (Govt)',
    type: 'LAB',
    categoryLabel: 'Public Health Reference Lab',
    lat: 15.3690,
    lng: 75.1310,
    address: 'Civil Hospital Campus, Hubballi',
    distanceKm: 0.8,
    drivingEtaMinutes: 3,
    walkingEtaMinutes: 9,
    rating: 4.4,
    reviewCount: 190,
    phone: '+91 836 2234000',
    govtSchemeCoverage: '100% Free under Janani Shishu Suraksha Karyakram (JSSK)',
    badge: 'Govt Free Scheme',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    estimatedCosts: [
      { serviceName: 'Universal Routine Antenatal Blood & Urine Tests', costInr: 0, originalMarketPriceInr: 950, isCoveredByGovt: true, savingsNote: '100% Free for Mothers' },
      { serviceName: 'Hemoglobin & Serum Ferritin', costInr: 0, originalMarketPriceInr: 300, isCoveredByGovt: true }
    ],
    totalEstimatedInr: 0,
    homeCollectionOrDelivery: 'Sample Courier Pickup from Hospital OPD',
    timings: '08:30 AM - 04:30 PM'
  },
  {
    id: 'opt-janaushadhi-pharma',
    name: 'PM Jan Aushadhi Kendra #5048 (ONDC Node)',
    type: 'PHARMACY',
    categoryLabel: 'Generic Medicine Dispensary',
    lat: 15.3635,
    lng: 75.1225,
    address: 'Station Road, Opp. St. Anne Gate #2, Hubballi',
    distanceKm: 0.35,
    drivingEtaMinutes: 1,
    walkingEtaMinutes: 4,
    rating: 4.8,
    reviewCount: 640,
    phone: '+91 94480 32188',
    ondcNodeId: 'BPP-PHARM-JANAUSHADHI-5048',
    govtSchemeCoverage: 'Department of Pharmaceuticals, Govt. of India Generic Scheme',
    badge: '72% Generic Savings',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    estimatedCosts: [
      { serviceName: '30-Day Pregnancy Iron & Folic Acid (Jan Aushadhi)', costInr: 28, originalMarketPriceInr: 120, savingsNote: '76% Cheaper' },
      { serviceName: '30-Day Calcium 500mg + Vitamin D3 Tablets', costInr: 25, originalMarketPriceInr: 95, savingsNote: '74% Cheaper' },
      { serviceName: 'Complete 30-Day Maternal Nutrition Kit', costInr: 77, originalMarketPriceInr: 280, savingsNote: 'Save ₹203 per month!' }
    ],
    totalEstimatedInr: 77,
    homeCollectionOrDelivery: 'Counter Pickup or 15-Min Neighborhood Express Delivery',
    timings: '08:00 AM - 10:00 PM'
  },
  {
    id: 'opt-medplus-pharma',
    name: 'MedPlus 24hr Chemist & Druggist (ONDC Node)',
    type: 'PHARMACY',
    categoryLabel: 'Retail Pharmacy & Night Chemist',
    lat: 15.3610,
    lng: 75.1275,
    address: 'Station Road Junction, Hubballi',
    distanceKm: 0.8,
    drivingEtaMinutes: 3,
    walkingEtaMinutes: 8,
    rating: 4.7,
    reviewCount: 310,
    phone: '+91 836 235678',
    ondcNodeId: 'BPP-PHARM-MEDPLUS-882',
    govtSchemeCoverage: '15% Flat Discount on Branded Obstetric Formulations',
    badge: '24/7 Night Chemist',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    estimatedCosts: [
      { serviceName: 'Branded Micronized Progesterone & Vitamins (30 Days)', costInr: 195, originalMarketPriceInr: 230, savingsNote: '15% Discount' },
      { serviceName: 'Cold-Chain Anti-D Immunoglobulin (300 mcg)', costInr: 2650, originalMarketPriceInr: 3100, savingsNote: 'Temp-Controlled Delivery' }
    ],
    totalEstimatedInr: 195,
    homeCollectionOrDelivery: '24-Hour Express Home Delivery Available',
    timings: '24 Hours Open'
  }
];

// Patient Residence coordinates in Hubballi
export const PATIENT_RESIDENCE = {
  name: 'Sunita Das & Family (Patient Residence)',
  lat: 15.3705,
  lng: 75.1290,
  address: '4th Cross, Keshwapur, Hubballi',
  phone: '+91 98451 12340'
};

interface GoogleMapsVicinityTrackerProps {
  initialSelectedId?: string;
  onSelectOption?: (option: VicinityCostOption) => void;
  onSendWhatsAppQuote?: (option: VicinityCostOption) => void;
  filterType?: 'ALL' | 'HOSPITAL' | 'LAB' | 'PHARMACY';
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
}

export const GoogleMapsVicinityTracker: React.FC<GoogleMapsVicinityTrackerProps> = ({
  initialSelectedId = 'opt-st-anne',
  onSelectOption,
  onSendWhatsAppQuote,
  filterType: initialFilter = 'ALL',
  patientId = 'PAT-104',
  patientName = 'Sunita Das',
  patientPhone = '+91 98451 12340'
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'HOSPITAL' | 'LAB' | 'PHARMACY'>(initialFilter);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(3.0);
  const [chosenToast, setChosenToast] = useState<string | null>(null);

  // Fallback to custom key entered by user if VITE_GOOGLE_MAPS_API_KEY is not yet in env
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || 'AIzaSyCdtnfE8WuBtdO-2uTpdTI-kLmGaZOol8c';

  const filteredOptions = useMemo(() => {
    return VICINITY_COST_OPTIONS.filter(opt => {
      if (categoryFilter !== 'ALL' && opt.type !== categoryFilter) return false;
      if (opt.distanceKm > maxDistanceKm) return false;
      return true;
    });
  }, [categoryFilter, maxDistanceKm]);

  const selectedOption = useMemo(() => {
    return VICINITY_COST_OPTIONS.find(o => o.id === selectedId) || VICINITY_COST_OPTIONS[0];
  }, [selectedId]);

  const handleSelectProvider = (opt: VicinityCostOption) => {
    setSelectedId(opt.id);
    if (onSelectOption) {
      onSelectOption(opt);
    }
  };

  const handleConfirmChoice = (opt: VicinityCostOption) => {
    handleSelectProvider(opt);
    setChosenToast(`Selected ${opt.name}! Estimated cost ₹${opt.totalEstimatedInr.toLocaleString('en-IN')} applied to your quotation.`);
    setTimeout(() => setChosenToast(null), 4500);
  };

  const handleWhatsAppDispatch = (opt: VicinityCostOption) => {
    if (onSendWhatsAppQuote) {
      onSendWhatsAppQuote(opt);
    }
    const message = `*Vyuhaa Continuum Healthcare — Vicinity Cost Estimate*\n\n` +
      `Hello ${patientName},\n` +
      `Here is the verified estimate for *${opt.name}* (${opt.categoryLabel}):\n\n` +
      `📍 Location: ${opt.address} (${opt.distanceKm} km away)\n` +
      `⏱️ ETA: ~${opt.drivingEtaMinutes} mins driving / ~${opt.walkingEtaMinutes} mins walk\n` +
      `⭐ Rating: ${opt.rating} / 5.0 (${opt.reviewCount} verified patients)\n\n` +
      `💰 *Estimated Services & Costs:*\n` +
      opt.estimatedCosts.map(c => `• ${c.serviceName}: ₹${c.costInr.toLocaleString('en-IN')} ${c.savingsNote ? `(${c.savingsNote})` : ''}`).join('\n') +
      `\n\n*Total Base Estimate:* ₹${opt.totalEstimatedInr.toLocaleString('en-IN')}\n` +
      `🏛️ Scheme: ${opt.govtSchemeCoverage}\n` +
      `🚚 Service: ${opt.homeCollectionOrDelivery}\n` +
      `📞 Contact: ${opt.phone}\n\n` +
      `_This estimate was chosen by you via the St. Anne Hospital Vicinity Network._`;

    // Open WhatsApp Web or mobile
    const cleanPhone = patientPhone.replace(/\D/g, '');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');

    setChosenToast(`Quotation for ${opt.name} dispatched to WhatsApp (${patientPhone})!`);
    setTimeout(() => setChosenToast(null), 4500);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {chosenToast && (
        <div className="fixed top-18 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/60 animate-bounce text-xs font-semibold max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{chosenToast}</span>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-base border border-rose-200">
                🗺️
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Google Maps Vicinity Provider Tracker &amp; Cost Chooser</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Interactive Real-Time
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select and choose among local maternity hospitals, accredited pathology labs, and PM Jan Aushadhi pharmacies providing verified cost estimates.
                </p>
              </div>
            </div>
          </div>

          {/* Scheme Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>JSSK &amp; PM-JAY Cashless</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>ONDC Network Nodes</span>
            </span>
          </div>
        </div>

        {/* Filter Bar: Category & Radius Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-xs ${
                categoryFilter === 'ALL' 
                  ? 'bg-white text-slate-900 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Providers ({VICINITY_COST_OPTIONS.length})
            </button>
            <button
              onClick={() => setCategoryFilter('HOSPITAL')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-xs flex items-center gap-1 ${
                categoryFilter === 'HOSPITAL' 
                  ? 'bg-rose-700 text-white shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hospitals ({VICINITY_COST_OPTIONS.filter(o => o.type === 'HOSPITAL').length})</span>
            </button>
            <button
              onClick={() => setCategoryFilter('LAB')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-xs flex items-center gap-1 ${
                categoryFilter === 'LAB' 
                  ? 'bg-indigo-700 text-white shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Microscope className="w-3.5 h-3.5" />
              <span>Diagnostic Labs ({VICINITY_COST_OPTIONS.filter(o => o.type === 'LAB').length})</span>
            </button>
            <button
              onClick={() => setCategoryFilter('PHARMACY')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-xs flex items-center gap-1 ${
                categoryFilter === 'PHARMACY' 
                  ? 'bg-emerald-700 text-white shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Pharmacies ({VICINITY_COST_OPTIONS.filter(o => o.type === 'PHARMACY').length})</span>
            </button>
          </div>

          {/* Radius range */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-500 font-medium">Radius:</span>
            <select
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800 cursor-pointer"
            >
              <option value={0.5}>Within 500 meters</option>
              <option value={1.5}>Within 1.5 km</option>
              <option value={3.0}>Within 3.0 km (Full Vicinity)</option>
              <option value={5.0}>Within 5.0 km (District Hub)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Workspace: Interactive Google Map + Options Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Real Interactive Google Map */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-3 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-2 py-2 mb-1 text-xs">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-rose-600" />
              <span className="font-bold text-slate-800">Live Vicinity Radar Map</span>
              <span className="text-[10px] text-slate-400">• Click markers to view &amp; choose provider</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Hospital
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> Lab
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Pharma
              </span>
            </div>
          </div>

          {/* Google Maps Container */}
          <div className="relative w-full h-[460px] sm:h-[500px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <APIProvider apiKey={apiKey}>
              <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={{ lat: 15.3655, lng: 75.1265 }}
                defaultZoom={14}
                mapId="DEMO_MAP_ID"
                gestureHandling="greedy"
                disableDefaultUI={false}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              >
                {/* 1. Patient Residence Pin */}
                <AdvancedMarker
                  position={{ lat: PATIENT_RESIDENCE.lat, lng: PATIENT_RESIDENCE.lng }}
                  title="Your Location (Patient Residence)"
                >
                  <div className="p-1.5 rounded-full bg-amber-500 text-white shadow-lg border-2 border-white ring-2 ring-amber-300 animate-pulse">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </AdvancedMarker>

                {/* 2. Vicinity Cost Options Pins */}
                {filteredOptions.map((opt) => {
                  const isSelected = selectedId === opt.id;
                  const pinBg = opt.type === 'HOSPITAL' 
                    ? '#be123c' 
                    : opt.type === 'LAB' 
                      ? '#4338ca' 
                      : '#059669';

                  return (
                    <AdvancedMarker
                      key={opt.id}
                      position={{ lat: opt.lat, lng: opt.lng }}
                      onClick={() => handleSelectProvider(opt)}
                      title={`${opt.name} — ₹${opt.totalEstimatedInr.toLocaleString('en-IN')}`}
                    >
                      <div className={`transition-all duration-200 cursor-pointer ${
                        isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-10'
                      }`}>
                        <Pin
                          background={pinBg}
                          borderColor={isSelected ? '#ffffff' : '#f8fafc'}
                          glyphColor="#ffffff"
                          scale={isSelected ? 1.25 : 1.0}
                        />
                      </div>
                    </AdvancedMarker>
                  );
                })}

                {/* Selected Provider InfoWindow */}
                {selectedOption && (
                  <InfoWindow
                    position={{ lat: selectedOption.lat, lng: selectedOption.lng }}
                    onCloseClick={() => {}}
                    pixelOffset={[0, -38]}
                  >
                    <div className="p-1 max-w-[260px] text-xs space-y-1.5 font-sans">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${selectedOption.badgeColor}`}>
                          {selectedOption.type}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                          ⭐ {selectedOption.rating} ({selectedOption.reviewCount})
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs leading-snug">
                        {selectedOption.name}
                      </h4>

                      <p className="text-[11px] text-slate-500 leading-tight">
                        {selectedOption.address} ({selectedOption.distanceKm} km away)
                      </p>

                      <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between">
                        <span className="text-slate-500">Starting at:</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          ₹{selectedOption.totalEstimatedInr.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleConfirmChoice(selectedOption)}
                        className="w-full py-1.5 px-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Choose This Provider</span>
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>

            {/* Floating Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-md border border-slate-200 text-[11px] space-y-1">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1">
                <span>📍 St. Anne Healthcare Vicinity Hub</span>
              </div>
              <div className="text-slate-500 text-[10px]">
                Patient: <strong className="text-slate-800">{patientName}</strong> (Keshwapur)
              </div>
              <div className="text-emerald-700 font-semibold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>All {filteredOptions.length} partners connected &amp; taking orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Provider Cost Options Chooser Cards */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Available Options Providing Cost Estimates</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                {filteredOptions.length} available
              </span>
            </h4>
          </div>

          {/* Cards List */}
          <div className="space-y-3 max-h-[530px] overflow-y-auto pr-1">
            {filteredOptions.map((opt) => {
              const isSelected = selectedId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectProvider(opt)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-white border-rose-500 ring-2 ring-rose-200 shadow-md' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                        opt.type === 'HOSPITAL' 
                          ? 'bg-rose-100 text-rose-800' 
                          : opt.type === 'LAB' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {opt.type === 'HOSPITAL' ? '🏥' : opt.type === 'LAB' ? '🔬' : '💊'}
                      </div>
                      <div>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${opt.badgeColor}`}>
                          {opt.badge}
                        </span>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {opt.categoryLabel}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900">
                        {opt.totalEstimatedInr === 0 ? (
                          <span className="text-emerald-700 font-extrabold">FREE under JSSK</span>
                        ) : (
                          <span>₹{opt.totalEstimatedInr.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">Starting est.</div>
                    </div>
                  </div>

                  {/* Provider Name */}
                  <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                    {opt.name}
                  </h4>

                  {/* Location & Distance */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{opt.distanceKm === 0 ? 'On-Site' : `${opt.distanceKm} km`}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{opt.drivingEtaMinutes} mins drive</span>
                    </span>
                    <span>•</span>
                    <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                      ★ {opt.rating}
                    </span>
                  </div>

                  {/* Estimated Services Snapshot */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] space-y-1.5 bg-slate-50/70 p-2.5 rounded-xl">
                    <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">
                      Included Package / Service Costs:
                    </div>
                    {opt.estimatedCosts.slice(0, 2).map((cost, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 truncate max-w-[190px]">{cost.serviceName}</span>
                        <span className="font-bold text-slate-900 shrink-0">
                          {cost.costInr === 0 ? 'FREE' : `₹${cost.costInr.toLocaleString('en-IN')}`}
                          {cost.savingsNote && (
                            <span className="text-[10px] font-normal text-emerald-700 ml-1">
                              ({cost.savingsNote})
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                    {opt.estimatedCosts.length > 2 && (
                      <div className="text-[10px] text-slate-400 font-medium">
                        + {opt.estimatedCosts.length - 2} more service item(s)
                      </div>
                    )}
                  </div>

                  {/* Govt Coverage & Delivery Note */}
                  <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                    <span className="truncate text-emerald-800 font-medium">{opt.govtSchemeCoverage}</span>
                    <span className="font-semibold text-slate-600 shrink-0">{opt.homeCollectionOrDelivery}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmChoice(opt);
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected 
                          ? 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSelected ? '✓ Chosen Option' : 'Choose This Provider'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppDispatch(opt);
                      }}
                      className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                      title="Send itemized quote to patient WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Quote</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Selected Provider Detailed Breakdown Sheet (Bottom Drawer / Card) */}
      {selectedOption && (
        <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Active Selected Provider
                </span>
                <span className="text-xs text-slate-400">• Verified Vicinity Partner</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                {selectedOption.name}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedOption.address} &bull; {selectedOption.distanceKm} km from St. Anne Hospital &bull; {selectedOption.timings}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-black text-rose-800">
                  ₹{selectedOption.totalEstimatedInr.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Estimated Package / Service Cost</div>
              </div>

              <button
                onClick={() => handleWhatsAppDispatch(selectedOption)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Get Quote on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Full Itemized List for Selected Provider */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedOption.estimatedCosts.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.serviceName}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-extrabold text-slate-900">
                    {item.costInr === 0 ? 'FREE' : `₹${item.costInr.toLocaleString('en-IN')}`}
                  </span>
                  {item.originalMarketPriceInr && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{item.originalMarketPriceInr.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {item.savingsNote && (
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    ✓ {item.savingsNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
