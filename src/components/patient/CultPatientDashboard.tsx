import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Video, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  Download, 
  Play, 
  X, 
  Pill, 
  Microscope, 
  Stethoscope, 
  Baby, 
  Navigation,
  Info,
  Heart,
  Building2
} from 'lucide-react';
import { OpdPatient } from '../../types';
import { opdStore } from '../../services/opdStore';
import { VICINITY_COST_OPTIONS, VicinityCostOption } from '../vicinity/GoogleMapsVicinityTracker';
import { 
  multiHospitalConsentService, 
  VicinityHealthCenter, 
  VICINITY_HEALTH_CENTERS 
} from '../../services/multiHospitalConsentService';
import { AbhaMultiHospitalConsentModal } from './AbhaMultiHospitalConsentModal';

export interface PatientOverviewDashboardProps {
  patient: OpdPatient;
  onOpenVicinityMap: () => void;
  onOpenTeleCounselling: () => void;
  onOpenDoctorWhatsApp: () => void;
  onOpenCostEstimates: () => void;
  onOpenAbhaLocker: () => void;
  onOpenSchedule: () => void;
}

export type CultPatientDashboardProps = PatientOverviewDashboardProps;

export const PatientOverviewDashboard: React.FC<PatientOverviewDashboardProps> = ({
  patient,
  onOpenVicinityMap,
  onOpenTeleCounselling,
  onOpenDoctorWhatsApp,
  onOpenCostEstimates,
  onOpenAbhaLocker,
  onOpenSchedule
}) => {
  // Multi-Hospital & Vicinity Health Center state
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp-st-anne');
  const [showAbhaConsentModal, setShowAbhaConsentModal] = useState<boolean>(false);

  // Booking widget category state
  const [bookingCategory, setBookingCategory] = useState<'DOCTOR' | 'LAB' | 'ONDC_PHARMA' | 'VIDEO'>('DOCTOR');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-anita');
  const [selectedLabTest, setSelectedLabTest] = useState<string>('OGTT_75G');
  const [selectedPharmaNeed, setSelectedPharmaNeed] = useState<string>('IFA_CALCIUM');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-12');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30 AM');
  const [bookingConfirmedToast, setBookingConfirmedToast] = useState<string | null>(null);

  // Vicinity partner tab filter (Hospitals vs Path Labs vs Doctors vs ONDC Pharmacies)
  const [vicinityTab, setVicinityTab] = useState<'HOSPITALS' | 'LABS' | 'DOCTORS' | 'ONDC_PHARMA'>('HOSPITALS');

  // Video guide player modal state
  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    instructor: string;
    role: string;
    summary: string;
    youtubeId: string;
  } | null>(null);

  const doctors = opdStore.getDoctorProfiles();

  // Doctor guidance videos: real YouTube videos published by Cloudnine Hospitals (IDs verified via YouTube oEmbed)
  const guidanceVideos = [
    {
      id: 'vid-ogtt', youtubeId: '-iBE1C7oRKc',
      title: 'Oral Glucose Tolerance Test (OGTT)',
      instructor: 'Dr. Ashima Gulia', role: 'Senior Consultant, Obstetrics & Gynaecology',
      tag: 'Due at 24-28 weeks', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      summary: 'What the glucose test involves and how to prepare for it.',
    },
    {
      id: 'vid-gdm', youtubeId: 'mk8UnNlNFWw',
      title: 'Diabetes in Pregnancy: What You Should Know',
      instructor: 'Dr. Modhulika Bhattacharya', role: 'Consultant Obstetrician & Gynaecologist',
      tag: 'Gestational diabetes', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      summary: 'An obstetrician explains gestational diabetes and why it is screened for.',
    },
    {
      id: 'vid-diet', youtubeId: '4dlSiQQFCfE',
      title: 'Pregnancy Diet: What to Eat & Avoid',
      instructor: 'Dr. Jyotsna Gupta', role: 'Consultant Obstetrician & Gynaecologist',
      tag: 'Nutrition', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      summary: 'Practical guidance on eating well during pregnancy.',
    },
    {
      id: 'vid-exercise', youtubeId: 'iuKz1e23Dps',
      title: 'A Guide to Working Out While Pregnant',
      instructor: 'Dr. Maljini N.', role: 'Cloudnine Hospitals',
      tag: 'Staying active', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      summary: 'Why exercise matters in pregnancy and which kinds are recommended.',
    },
    {
      id: 'vid-labour', youtubeId: 'ivIkUdd-7XQ',
      title: 'Signs of Labour: When to Go to the Hospital',
      instructor: 'Dr. Modhulika Bhattacharya', role: 'Consultant Obstetrician & Gynaecologist',
      tag: 'Preparing for delivery', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      summary: 'The key signs of labour and when to head to the hospital.',
    },
    {
      id: 'vid-warning', youtubeId: 'tSLlIgeT_eQ',
      title: 'Pregnancy Warning Signs: When to Rush to the Hospital',
      instructor: 'Dr. Manisha Ranjan', role: 'Consultant Obstetrician & Gynaecologist',
      tag: 'Safety', badgeColor: 'bg-red-50 text-red-700 border-red-200',
      summary: 'Warning signs in pregnancy that need urgent hospital care.',
    },
  ];

  // Verified vicinity providers
  const pathLabs = [
    {
      id: 'lab-apex',
      name: 'Apex Diagnostic Hub & Pathology Node',
      type: 'NABL Accredited • ONDC BPP Node',
      distance: '0.8 km',
      eta: '3 mins drive • 10 mins walk',
      rating: 4.9,
      reviews: 420,
      badge: 'Home Blood Draw in 30 Mins',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      priceSnippet: '75g OGTT: ₹350 • CBC: ₹220 • Free Home Collection',
      coverageNote: 'ABDM FHIR M3 Synced directly to Dr. Anita Rao',
      phone: '+91 98452 33441'
    },
    {
      id: 'lab-metropolis',
      name: 'Metropolis Healthcare Collection Center',
      type: 'NABL Certified Diagnostic Center',
      distance: '1.2 km',
      eta: '5 mins drive • 16 mins walk',
      rating: 4.8,
      reviews: 280,
      badge: 'Hospital Empanelled',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      priceSnippet: 'Full Antenatal Profile: ₹1,200 • Thyroid TSH: ₹280',
      coverageNote: 'Direct report integration to ABHA Locker',
      phone: '+91 98450 88771'
    },
    {
      id: 'lab-lal',
      name: 'Dr. Lal PathLabs Vicinity Point',
      type: 'National Reference Laboratory Network',
      distance: '1.5 km',
      eta: '6 mins drive • 19 mins walk',
      rating: 4.7,
      reviews: 310,
      badge: 'Courier Specimen Tracking',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      priceSnippet: 'Double Marker: ₹1,650 • Urine Routine: ₹150',
      coverageNote: 'Barcoded digital tracking with WhatsApp alerts',
      phone: '+91 98453 99220'
    },
    {
      id: 'lab-st-anne',
      name: 'St. Anne In-House Hospital Laboratory',
      type: 'Hospital Core STAT & Emergency Lab',
      distance: '0.1 km',
      eta: '1 min walk (Ground Floor Room 2)',
      rating: 4.9,
      reviews: 580,
      badge: '24x7 STAT Lab',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      priceSnippet: 'Blood Cross-Match: ₹450 • Emergency Hb: ₹100',
      coverageNote: 'Free diagnostic workup during JSSK inpatient delivery',
      phone: '+91 080-2211-9999'
    }
  ];

  const doctorsList = [
    {
      id: 'doc-anita',
      name: 'Dr. Anita Rao',
      speciality: 'Senior Consultant OB/GYN & Maternal Specialist',
      experience: '18 Years Experience • MBBS, MS (OBG)',
      room: 'Room 4 Maternal Suite • St. Anne Hospital',
      distance: '0.4 km',
      fee: '₹ 500 (OPD Out-of-Pocket)',
      rating: 4.9,
      reviews: 512,
      availability: 'Available Today • Next: 10:30 AM',
      note: 'Routine OPD fee paid out-of-pocket (Inpatient Delivery 100% Cashless under JSSK/PM-JAY)'
    },
    {
      id: 'doc-rajesh',
      name: 'Dr. Rajesh Kulkarni',
      speciality: 'Senior Consultant Physician & Diabetologist',
      experience: '22 Years Experience • MD (Internal Medicine)',
      room: 'Room 1 General OPD • St. Anne Hospital',
      distance: '0.4 km',
      fee: '₹ 400 (OPD Out-of-Pocket)',
      rating: 4.8,
      reviews: 340,
      availability: 'Available Today • Next: 11:15 AM',
      note: 'Specialist in Gestational Diabetes, Thyroid Disorders & Hypertension'
    },
    {
      id: 'doc-shenoy',
      name: 'Dr. Sudhir Shenoy',
      speciality: 'Consultant Clinical Pathologist & Hematologist',
      experience: '16 Years Experience • MD (Pathology)',
      room: 'Room 6 Diagnostic Consultation Desk',
      distance: '0.8 km',
      fee: '₹ 450 (OPD Out-of-Pocket)',
      rating: 4.9,
      reviews: 290,
      availability: 'Available Today • Next: 12:00 PM',
      note: 'Expert in Mentzer Index anemia differentiation & prenatal genetics'
    }
  ];

  const ondcPharmacies = [
    {
      id: 'pharma-janaushadhi',
      name: 'PM Jan Aushadhi Kendra #5048',
      type: 'Government Generic Dispensary • ONDC BPP Node',
      distance: '0.6 km',
      eta: '2 mins drive • 8 mins walk',
      rating: 4.9,
      reviews: 620,
      badge: '72% Generic Savings',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      priceSnippet: 'Tab Iron + Folic: ₹22 • Tab Calcium 500mg: ₹35',
      coverageNote: 'Doorstep 30-min courier delivery via ONDC network',
      phone: '+91 98451 12340'
    },
    {
      id: 'pharma-apollo',
      name: 'Apollo Pharmacy Vicinity Express',
      type: 'Retail & Emergency Chemist',
      distance: '0.9 km',
      eta: '3 mins drive • 12 mins walk',
      rating: 4.7,
      reviews: 410,
      badge: '24/7 Open',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      priceSnippet: 'Prescription maternity kits, feeding bottles & breast pumps',
      coverageNote: 'Instant express counter pickup or home delivery',
      phone: '+91 98450 44552'
    },
    {
      id: 'pharma-medplus',
      name: 'MedPlus Health & Diagnostic Store',
      type: 'Verified ONDC Network Participant',
      distance: '1.4 km',
      eta: '4 mins drive • 17 mins walk',
      rating: 4.6,
      reviews: 280,
      badge: 'ONDC Verified Node',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      priceSnippet: 'Branded & generic formulations with prescription scan upload',
      coverageNote: 'Digital bill dispatch directly to patient WhatsApp',
      phone: '+91 98454 77889'
    }
  ];

  // Handle instant booking
  const handleConfirmBooking = () => {
    let serviceName = '';
    const currentHosp = multiHospitalConsentService.getHealthCenterById(selectedHospitalId);
    if (bookingCategory === 'DOCTOR') {
      const doc = doctorsList.find(d => d.id === selectedDoctorId);
      serviceName = `OPD Consultation with ${doc?.name || 'Specialist'} at ${currentHosp?.name || 'Medical Centre'}`;
      multiHospitalConsentService.bookAppointment({
        hospitalId: selectedHospitalId,
        doctorName: doc?.name || 'Specialist',
        serviceType: 'OB-GYN Clinical Consultation',
        date: selectedDate,
        slot: selectedSlot
      });
    } else if (bookingCategory === 'LAB') {
      serviceName = `75g OGTT & CBC Blood Draw at Apex Diagnostics (Free Home Phlebotomy)`;
    } else if (bookingCategory === 'ONDC_PHARMA') {
      serviceName = `Jan Aushadhi Prescription Order (Tab Iron + Calcium 500mg) for 30-min delivery`;
    } else {
      serviceName = `5-Min Urgent Doctor Tele-Video Call`;
    }

    setBookingConfirmedToast(`Appointment confirmed! ${serviceName} on ${selectedDate} at ${selectedSlot}. Confirmation slip and ABHA token dispatched to WhatsApp.`);
    setTimeout(() => setBookingConfirmedToast(null), 6000);
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 animate-fadeIn">
      
      {/* Toast Notification */}
      {bookingConfirmedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-3xl text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md animate-slideDown">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{bookingConfirmedToast}</span>
          </div>
          <button 
            onClick={() => setBookingConfirmedToast(null)}
            className="text-emerald-700 font-bold ml-2 hover:text-emerald-950 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. CLEAN LIGHT GREETING & GESTATIONAL BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>Week 28 • Trimester 3</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                Baby is approx 1.1 kg (Eggplant size 🍆)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Good morning, {patient.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Every step towards taking care of your health counts. Taking care of yourself and baby, one day at a time.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-600 font-medium">
              <div className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span className="text-slate-500 font-bold">🏥 Selected Care Center:</span>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => {
                    setSelectedHospitalId(e.target.value);
                    multiHospitalConsentService.setActiveHospital(e.target.value);
                    const center = multiHospitalConsentService.getHealthCenterById(e.target.value);
                    if (center && center.specialists.length > 0) {
                      setSelectedDoctorId(center.specialists[0].id);
                    }
                    setBookingConfirmedToast(`Switched active care center to ${center?.name}. Your constant ABHA data remains securely synchronized.`);
                  }}
                  className="bg-transparent font-black text-rose-800 border-none focus:outline-none cursor-pointer"
                >
                  {VICINITY_HEALTH_CENTERS.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.distanceKm} km)</option>
                  ))}
                </select>
              </div>

              <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                👩‍⚕️ Attending: <strong>{multiHospitalConsentService.getHealthCenterById(selectedHospitalId)?.specialists[0]?.name || 'Dr. Anita Rao'}</strong>
              </span>

              <button 
                onClick={() => setShowAbhaConsentModal(true)}
                className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-xl font-bold hover:bg-emerald-100 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Manage federated ABHA consent across all vicinity hospitals"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ABHA: 91-8842-1049-2311@abdm • Constant Health Locker</span>
              </button>
            </div>
          </div>

          {/* Quick Right Action Pills */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={onOpenTeleCounselling}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>5-Min Doctor Video Call</span>
            </button>
            <button
              onClick={onOpenDoctorWhatsApp}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Doctor's WhatsApp Feed</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. YOUR UP-NEXT CHECK-UPS (FIRST THING ON THE HOME SCREEN) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📅 Your Upcoming Check-ups</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                {multiHospitalConsentService.getBookedAppointments().filter(a => a.status === 'CONFIRMED').length + 1} upcoming
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Care routines recommended by Dr. Anita Rao for your 28th gestational week.
            </p>
          </div>

          <button
            onClick={onOpenSchedule}
            className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Booked appointments across the network (newest bookings appear here immediately) */}
          {multiHospitalConsentService.getBookedAppointments().filter(a => a.status === 'CONFIRMED').map(apt => (
            <div key={apt.id} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded">Confirmed visit</span>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1">{apt.serviceType}</h3>
                  <p className="text-xs text-slate-600 font-medium">{apt.doctorName}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-rose-800">{new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  <div className="text-[11px] font-bold text-slate-600">{apt.slot}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between gap-2">
                <span>📍 {apt.hospitalName}</span>
                {apt.abhaConsentVerified && <span className="text-emerald-700 font-bold">ABHA records shared</span>}
              </div>
            </div>
          ))}

          {/* Card 2: Fasting Blood Draw */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  Diagnostic Blood Draw
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                  75g Oral Glucose Tolerance Test (OGTT) &amp; CBC
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Apex Diagnostics Hub (ONDC Node)
                </p>
                <p className="text-[11px] text-slate-500">
                  Free Doorstep Phlebotomist Collection (Barcoded: SP-8842)
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-slate-900 block font-mono">
                  12 Nov 2026
                </span>
                <span className="text-[11px] font-bold text-purple-700">
                  08:30 AM
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-purple-200/60">
              <span className="px-2.5 py-1 rounded-xl bg-white border border-purple-200 text-purple-900 text-[11px] font-bold">
                ✓ 8h Fasting Required
              </span>
              <button
                onClick={() => {
                  const vid = guidanceVideos.find(v => v.id === 'vid-2');
                  if (vid) setActiveVideoModal(vid);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Watch Test Prep Video (3m)</span>
              </button>
              <span className="text-[10px] font-semibold text-slate-500 ml-auto">
                Syncs to ABHA
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. TOP PRIORITY: BASIC APPOINTMENT BOOKING SYSTEM RIGHT ON DASHBOARD */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>⚡ Book an Appointment</span>
              <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                Direct Booking
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select what you need, pick a specialist or facility, and confirm your slot instantly.
            </p>
          </div>

          {/* Category Selector Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setBookingCategory('DOCTOR')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                bookingCategory === 'DOCTOR' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👩‍⚕️ Doctor OPD
            </button>
            <button
              onClick={() => setBookingCategory('LAB')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                bookingCategory === 'LAB' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔬 Path Lab Test
            </button>
            <button
              onClick={() => setBookingCategory('ONDC_PHARMA')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                bookingCategory === 'ONDC_PHARMA' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💊 ONDC Medicine
            </button>
            <button
              onClick={() => setBookingCategory('VIDEO')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                bookingCategory === 'VIDEO' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📹 5-Min Video Call
            </button>
          </div>
        </div>

        {/* Hospital Center Selector Bar */}
        <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-rose-700 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Select Hospital / Medical Center in Vicinity:</span>
              <span className="font-extrabold text-slate-900">
                {multiHospitalConsentService.getHealthCenterById(selectedHospitalId)?.name} • {multiHospitalConsentService.getHealthCenterById(selectedHospitalId)?.distanceKm} km away
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedHospitalId}
              onChange={(e) => {
                setSelectedHospitalId(e.target.value);
                multiHospitalConsentService.setActiveHospital(e.target.value);
                const hosp = multiHospitalConsentService.getHealthCenterById(e.target.value);
                if (hosp && hosp.specialists.length > 0) {
                  setSelectedDoctorId(hosp.specialists[0].id);
                }
              }}
              className="text-xs font-bold bg-white border border-rose-300 rounded-xl px-3 py-1.5 focus:outline-rose-600 cursor-pointer shadow-xs"
            >
              {VICINITY_HEALTH_CENTERS.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.distanceKm} km • {h.type.replace('_', ' ')})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowAbhaConsentModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
              title="Ensure this hospital has active ABHA consent to view your constant medical history"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ABHA Consent</span>
            </button>
          </div>
        </div>

        {/* In-Line Booking Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Field 1: Choose Practitioner / Item */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {bookingCategory === 'DOCTOR' && 'Select Doctor & OPD Speciality'}
              {bookingCategory === 'LAB' && 'Select Diagnostic Test / Scan'}
              {bookingCategory === 'ONDC_PHARMA' && 'Select Jan Aushadhi Medicines'}
              {bookingCategory === 'VIDEO' && 'Select Online Doctor'}
            </label>

            {bookingCategory === 'DOCTOR' && (
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-rose-600"
              >
                {doctorsList.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} • {doc.speciality.split('&')[0]} ({doc.fee.split('(')[0].trim()})
                  </option>
                ))}
              </select>
            )}

            {bookingCategory === 'LAB' && (
              <select
                value={selectedLabTest}
                onChange={(e) => setSelectedLabTest(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-rose-600"
              >
                <option value="OGTT_75G">75g Oral Glucose Tolerance Test (OGTT) • ₹350</option>
                <option value="CBC_ANEMIA">Complete Blood Count (CBC &amp; Mentzer Index) • ₹220</option>
                <option value="ULTRASOUND_DOPPLER">Foetal Doppler &amp; Growth Scan • ₹1,400</option>
                <option value="THYROID_TSH">Thyroid Stimulating Hormone (TSH) • ₹280</option>
              </select>
            )}

            {bookingCategory === 'ONDC_PHARMA' && (
              <select
                value={selectedPharmaNeed}
                onChange={(e) => setSelectedPharmaNeed(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-rose-600"
              >
                <option value="IFA_CALCIUM">Tab Ferrous Ascorbate + Calcium 500mg (30 Days) • ₹57</option>
                <option value="GESTATIONAL_KIT">Complete Maternal Nutrition &amp; Protein Pack • ₹195</option>
                <option value="TDAP_VACCINE">Tdap Maternal Vaccination Dose • ₹480</option>
              </select>
            )}

            {bookingCategory === 'VIDEO' && (
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-rose-600"
              >
                <option value="doc-anita">Dr. Anita Rao, OB/GYN (Available Now • Under 2 mins)</option>
                <option value="doc-rajesh">Dr. Rajesh Kulkarni, Physician (Available Now)</option>
              </select>
            )}
          </div>

          {/* Field 2: Preferred Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Date of Appointment</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-rose-600"
            />
          </div>

          {/* Field 3: Time Slot */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Available Time Slot</label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-rose-600"
            >
              <option value="08:30 AM">08:30 AM (Fasting blood draw slot)</option>
              <option value="09:15 AM">09:15 AM</option>
              <option value="10:30 AM">10:30 AM (Doctor OPD session)</option>
              <option value="11:45 AM">11:45 AM</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>

          {/* Field 4: Confirm Action */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer h-[42px]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Confirm Booking</span>
            </button>
          </div>

        </div>

        {/* Accurate Policy Notice on OPD vs Inpatient PM-JAY Coverage */}
        <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Government Scheme Notice (PM-JAY &amp; JSSK):</strong> Routine Outpatient (OPD) consultation fees (₹400–₹500) and standalone outpatient tests are paid out-of-pocket, as standard Ayushman Bharat PM-JAY rules do not cover OPD visits (unless visiting government civil hospitals or under PMSMA on the 9th of each month). In contrast, <strong>Inpatient Normal Delivery and C-Sections (IPD) are 100% Cashless</strong> under JSSK and PM-JAY packages.
          </div>
        </div>
      </div>

      {/* 5. VIDEO SESSIONS & DOCTOR GUIDANCE (ON THE MAIN DASHBOARD) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📹 Video Consultations &amp; Guidance Sessions</span>
              <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                Real doctor videos
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Short videos from practising obstetricians on YouTube, picked for your stage of pregnancy.
            </p>
          </div>

          <button
            onClick={onOpenTeleCounselling}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>5-Min Urgent Doctor Call</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guidanceVideos.map(vid => (
            <button
              type="button"
              key={vid.id}
              onClick={() => setActiveVideoModal(vid)}
              className="text-left rounded-2xl border border-slate-200 overflow-hidden hover:border-rose-400 hover:shadow-md transition cursor-pointer group bg-white flex flex-col"
            >
              <div className="relative aspect-video bg-slate-900">
                <img
                  src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-rose-600/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">YouTube</span>
              </div>
              <div className="p-3.5 space-y-1.5 flex-1">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border inline-block ${vid.badgeColor}`}>{vid.tag}</span>
                <h3 className="text-xs font-extrabold text-slate-900 leading-snug">{vid.title}</h3>
                <p className="text-[11px] text-slate-500">{vid.instructor} · {vid.role}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-400">Videos published by Cloudnine Hospitals on YouTube. General education only; follow your own doctor's advice.</p>
      </div>

      {/* 6. DOCTOR WHATSAPP MESSAGES & PRESCRIPTION FEED (ON DASHBOARD) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>💬 Doctor WhatsApp Feed &amp; Prescriptions</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Official Stream
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified clinical instructions and signed PDF prescriptions from Dr. Anita Rao.
            </p>
          </div>

          <button
            onClick={onOpenDoctorWhatsApp}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Full Chat History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* WhatsApp Card Preview */}
        <div className="bg-[#efeae2]/80 p-4 rounded-2xl border border-slate-300 space-y-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 max-w-2xl text-xs space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800 text-xs">
                Dr. Anita Rao (OB/GYN) · your primary obstetrician
              </span>
              <span className="text-[10px] text-slate-400">Today, 09:15 AM</span>
            </div>
            <p className="text-slate-800 leading-relaxed">
              Dear Sunita, your 28-week antenatal clinical review has been recorded. Your vital signs (BP 118/76, FHR 142 bpm) are reassuring. Please download your official digital signed prescription PDF below.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📄</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Prescription_Sunita_28w.pdf</h4>
                  <p className="text-[10px] text-slate-500">184 KB • Cryptographically signed by Dr. Anita Rao</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Downloading official signed prescription PDF: Prescription_Sunita_28w.pdf')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Timed reminder pill */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 max-w-lg text-xs space-y-1 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-[11px]">
              <span>⏰ Timed Medication Reminder</span>
              <span className="text-slate-400 font-normal">• 2:00 PM</span>
            </div>
            <p className="text-slate-700">
              💊 Please take <strong>Tab Calcium Carbonate 500mg</strong> after lunch with plain water. Maintain a 2-hour interval away from your Iron tablet.
            </p>
          </div>
        </div>
      </div>

      {/* 4. FIND PATH LABS, DOCTORS & ONDC PARTNERS (IN VICINITY) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📍 Find Near You in Vicinity</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Live Providers
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose among accredited pathology laboratories, attending doctors, and ONDC Jan Aushadhi pharmacies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Vicinity Category Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setVicinityTab('HOSPITALS')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  vicinityTab === 'HOSPITALS' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏥 Hospitals &amp; Clinics (6)
              </button>
              <button
                onClick={() => setVicinityTab('LABS')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  vicinityTab === 'LABS' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔬 Path Labs (4)
              </button>
              <button
                onClick={() => setVicinityTab('DOCTORS')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  vicinityTab === 'DOCTORS' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👩‍⚕️ Doctors (3)
              </button>
              <button
                onClick={() => setVicinityTab('ONDC_PHARMA')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  vicinityTab === 'ONDC_PHARMA' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💊 ONDC Pharmacies (3)
              </button>
            </div>

            <button
              onClick={onOpenVicinityMap}
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-300" />
              <span>Map Tracker</span>
            </button>
          </div>
        </div>

        {/* TAB 0: HOSPITALS & MEDICAL CENTERS IN VICINITY */}
        {vicinityTab === 'HOSPITALS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VICINITY_HEALTH_CENTERS.map(hosp => {
              const consentGranted = multiHospitalConsentService.isConsentGrantedForHospital(hosp.id);
              return (
                <div 
                  key={hosp.id}
                  className="p-4 rounded-2xl border border-slate-200/90 hover:border-rose-300 hover:shadow-sm transition bg-white space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">{hosp.name}</h3>
                        <p className="text-[11px] text-rose-700 font-bold">{hosp.categoryLabel}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{hosp.rating}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Normal Delivery Est:</span>
                        <span className="font-extrabold text-slate-900">₹{hosp.normalDeliveryEstInr.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">LSCS C-Section Est:</span>
                        <span className="font-extrabold text-slate-900">₹{hosp.cSectionEstInr.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold pt-0.5">
                        {hosp.accreditation}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{hosp.distanceKm} km • {hosp.drivingEtaMinutes}m drive</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {hosp.specialists.length} Specialists
                      </span>
                    </div>

                    {/* ABHA Consent Status Indicator */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50 border border-emerald-200 text-[11px]">
                      <span className="text-slate-700 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ABHA Federated Record:</span>
                      </span>
                      {consentGranted ? (
                        <span className="text-emerald-800 font-bold">Access Granted</span>
                      ) : (
                        <span className="text-amber-800 font-bold">Consent Pending</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAbhaConsentModal(true)}
                      className="px-2.5 py-1.5 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 font-bold text-xs transition cursor-pointer"
                    >
                      ABHA Consent
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedHospitalId(hosp.id);
                        multiHospitalConsentService.setActiveHospital(hosp.id);
                        setBookingCategory('DOCTOR');
                        setBookingConfirmedToast(`Selected ${hosp.name}. Choose your preferred slot and confirm above.`);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer text-center"
                    >
                      Book OPD (₹{hosp.consultationFeeInr})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 1: PATHOLOGY LABS */}
        {vicinityTab === 'LABS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pathLabs.map(lab => (
              <div 
                key={lab.id}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-purple-300 hover:shadow-sm transition bg-white space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">{lab.name}</h3>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${lab.badgeColor}`}>
                        {lab.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{lab.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shrink-0">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{lab.rating}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{lab.priceSnippet}</div>
                  <div className="text-[11px] text-emerald-700 font-medium">{lab.coverageNote}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{lab.distance} • {lab.eta}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setBookingCategory('LAB');
                        setBookingConfirmedToast(`Diagnostic blood draw booking initiated with ${lab.name}. Please select date and slot above.`);
                      }}
                      className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Book Blood Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: DOCTORS & SPECIALISTS */}
        {vicinityTab === 'DOCTORS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctorsList.map(doc => (
              <div 
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-rose-300 hover:shadow-sm transition bg-white space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">{doc.name}</h3>
                      <p className="text-[11px] text-rose-700 font-bold">{doc.speciality}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">{doc.room}</p>
                  
                  <div className="mt-2 p-2 rounded-xl bg-rose-50/60 border border-rose-100 text-xs">
                    <span className="font-extrabold text-slate-900 block">{doc.fee}</span>
                    <span className="text-[10px] text-slate-500">{doc.note}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-bold">{doc.availability.split('•')[0]}</span>
                  <button
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                      setBookingCategory('DOCTOR');
                      setBookingConfirmedToast(`Selected ${doc.name}. Choose slot and click Confirm Booking.`);
                    }}
                    className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Select Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: ONDC PHARMACIES & JAN AUSHADHI */}
        {vicinityTab === 'ONDC_PHARMA' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ondcPharmacies.map(ph => (
              <div 
                key={ph.id}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-sm transition bg-white space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">{ph.name}</h3>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ph.type}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${ph.badgeColor}`}>
                      {ph.badge}
                    </span>
                  </div>

                  <div className="mt-2 p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs space-y-0.5">
                    <div className="font-bold text-emerald-950">{ph.priceSnippet}</div>
                    <div className="text-[10px] text-emerald-800">{ph.coverageNote}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">{ph.distance} • {ph.eta.split('•')[0]}</span>
                  <button
                    onClick={() => {
                      setBookingCategory('ONDC_PHARMA');
                      setBookingConfirmedToast(`Selected ${ph.name}. Prescriptions will be routed via ONDC.`);
                    }}
                    className="px-3 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Order via ONDC
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIDEO PLAYER MODAL: embedded YouTube */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5" onClick={() => setActiveVideoModal(null)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeId}?autoplay=1&rel=0`}
                title={activeVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{activeVideoModal.title}</h3>
                <p className="text-slate-500 mt-0.5">{activeVideoModal.instructor} · {activeVideoModal.role}{activeVideoModal.role.includes('Cloudnine') ? '' : ' · Cloudnine Hospitals'}</p>
                <p className="text-slate-700 mt-2">{activeVideoModal.summary}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideoModal.youtubeId}`}
                  target="_blank" rel="noreferrer"
                  className="text-rose-700 font-bold hover:underline"
                >Watch on YouTube ↗</a>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setActiveVideoModal(null); onOpenTeleCounselling(); }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Ask your doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVideoModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABHA MULTI-HOSPITAL FEDERATED CONSENT MANAGER MODAL */}
      <AbhaMultiHospitalConsentModal
        patient={patient}
        isOpen={showAbhaConsentModal}
        onClose={() => setShowAbhaConsentModal(false)}
      />

    </div>
  );
};

export const CultPatientDashboard = PatientOverviewDashboard;
