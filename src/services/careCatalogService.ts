/**
 * Patient-facing care catalogue: what a mother may need (consultations, tests, scans, delivery)
 * and who in the network offers it, at what cost. Built from the hospital network data;
 * lab prices are indicative demo values and say so in the UI.
 */
import { VICINITY_HEALTH_CENTERS } from './multiHospitalConsentService';

export type NeedCategory = 'Consultation' | 'Test' | 'Scan' | 'Delivery';

export interface CareProvider {
  id: string;
  kind: 'Doctor' | 'Hospital' | 'Lab';
  name: string;
  detail: string;          // specialty / lab type
  place: string;           // hospital or area
  hospitalId?: string;
  distanceKm: number;
  price: number;
  priceNote: string;       // what the price covers
  schemes: string[];       // PM-JAY, JSSK
  slots?: string[];
  rating?: number;
}

export interface CareNeed {
  id: string;
  name: string;
  category: NeedCategory;
  whenNeeded: string;
  consider: string;        // consultative note: what drives cost / what to ask
  providers: CareProvider[];
}

const H = VICINITY_HEALTH_CENTERS;
const schemesOf = (h: typeof H[number]) => [h.pmjayEmpanelled ? 'PM-JAY' : '', h.jsskCovered ? 'JSSK' : ''].filter(Boolean);

const doctorsMatching = (re: RegExp): CareProvider[] =>
  H.flatMap(h => h.specialists.filter(s => re.test(s.specialty)).map(s => ({
    id: `${h.id}-${s.id}`, kind: 'Doctor' as const, name: s.name, detail: `${s.qualification} · ${s.specialty}`,
    place: h.shortName, hospitalId: h.id, distanceKm: h.distanceKm, price: s.fee,
    priceNote: 'Consultation fee', schemes: [], slots: h.availableSlotsToday, rating: h.rating,
  })));

const hospitalsFor = (field: 'normalDeliveryEstInr' | 'cSectionEstInr', note: string): CareProvider[] =>
  H.map(h => ({
    id: `${h.id}-${field}`, kind: 'Hospital' as const, name: h.shortName, detail: h.categoryLabel,
    place: h.address, hospitalId: h.id, distanceKm: h.distanceKm, price: h[field], priceNote: note,
    schemes: schemesOf(h), rating: h.rating,
  }));

// Indicative lab prices (demo values; confirm with the lab)
const LABS = [
  { id: 'lab-apex', name: 'Apex Diagnostic Hub', detail: 'NABL lab · home collection', place: 'City Centre', km: 0.8, rating: 4.9 },
  { id: 'lab-metropolis', name: 'Metropolis Collection Centre', detail: 'NABL lab', place: 'Vidyanagar', km: 1.6, rating: 4.7 },
  { id: 'lab-lal', name: 'Dr. Lal PathLabs', detail: 'NABL lab', place: 'Deshpande Nagar', km: 2.2, rating: 4.6 },
  { id: 'lab-suraksha', name: 'Suraksha Ultrasound & Imaging', detail: 'Ultrasound centre', place: 'Vidyanagar', km: 1.8, rating: 4.7 },
];
const LAB_PRICES: Record<string, Record<string, number>> = {
  ogtt: { 'lab-apex': 350, 'lab-metropolis': 420, 'lab-lal': 390 },
  cbc: { 'lab-apex': 220, 'lab-metropolis': 260, 'lab-lal': 240 },
  tsh: { 'lab-apex': 300, 'lab-metropolis': 280, 'lab-lal': 320 },
  anc_profile: { 'lab-apex': 1350, 'lab-metropolis': 1200, 'lab-lal': 1290 },
  growth_scan: { 'lab-suraksha': 1800 },
  anomaly_scan: { 'lab-suraksha': 2800 },
};
const labsFor = (test: string, note: string): CareProvider[] =>
  LABS.filter(l => LAB_PRICES[test]?.[l.id] !== undefined).map(l => ({
    id: `${l.id}-${test}`, kind: 'Lab' as const, name: l.name, detail: l.detail, place: l.place,
    distanceKm: l.km, price: LAB_PRICES[test][l.id], priceNote: note, schemes: [], rating: l.rating,
  }));

export const CARE_NEEDS: CareNeed[] = [
  {
    id: 'anc-consult', name: 'Pregnancy check-up', category: 'Consultation',
    whenNeeded: 'Every 4 weeks until 28 weeks, every 2 weeks to 36, then weekly.',
    consider: 'Continuity matters more than price: seeing the same obstetrician through pregnancy helps. Your ABHA records follow you if you switch.',
    providers: doctorsMatching(/obstet|maternal|pregnan|fetal medicine|high-risk/i),
  },
  {
    id: 'high-risk-consult', name: 'High-risk pregnancy opinion', category: 'Consultation',
    whenNeeded: 'If your doctor flags anaemia, high BP, diabetes, Rh-negative blood group or a previous complication.',
    consider: 'Ask whether the hospital has a NICU and blood bank on site; that matters more than the consultation fee.',
    providers: doctorsMatching(/high-risk|fetal|alloimmun|intensive|maternal-fetal/i),
  },
  {
    id: 'pnc-consult', name: 'After-delivery check-up', category: 'Consultation',
    whenNeeded: 'Within 7 days of delivery and again at 6 weeks.',
    consider: 'Lactation support and a post-GDM sugar test (if you had gestational diabetes) can be done at the same visit.',
    providers: doctorsMatching(/postnatal|lactation|obstet/i),
  },
  {
    id: 'newborn-consult', name: 'Newborn & baby check-up', category: 'Consultation',
    whenNeeded: 'In the first week, then with each vaccination visit.',
    consider: 'Vaccines under the national schedule are free at government centres; private hospitals charge for the visit and some vaccines.',
    providers: doctorsMatching(/neonat|infant|paediat|pediat/i),
  },
  {
    id: 'ogtt', name: 'Glucose test (75g OGTT)', category: 'Test',
    whenNeeded: 'Between 24 and 28 weeks; earlier if you are at higher risk.',
    consider: 'Needs overnight fasting and about 2 hours at the lab. Home collection is not possible for this test.',
    providers: labsFor('ogtt', 'Fasting + 2-hour sample'),
  },
  {
    id: 'cbc', name: 'Blood count (CBC / Hb)', category: 'Test',
    whenNeeded: 'At booking, at 28 weeks and before delivery; more often if anaemic.',
    consider: 'Most labs offer home collection for this test.',
    providers: labsFor('cbc', 'Single blood sample'),
  },
  {
    id: 'tsh', name: 'Thyroid test (TSH)', category: 'Test',
    whenNeeded: 'At booking; repeated if you take thyroid medicine.',
    consider: 'No fasting needed.',
    providers: labsFor('tsh', 'Single blood sample'),
  },
  {
    id: 'anc-profile', name: 'Booking blood tests (antenatal profile)', category: 'Test',
    whenNeeded: 'In the first trimester, at your booking visit.',
    consider: 'Check that the profile includes blood group, CBC, HIV, HBsAg, VDRL, thyroid and urine; packages differ.',
    providers: labsFor('anc_profile', 'Full first-trimester panel'),
  },
  {
    id: 'anomaly-scan', name: 'Anomaly scan (18-22 weeks)', category: 'Scan',
    whenNeeded: 'Once, between 18 and 22 weeks.',
    consider: 'Prefer a centre with a fetal medicine specialist; the timing window is narrow, so book early.',
    providers: [...labsFor('anomaly_scan', 'Level-II scan with report'), ...doctorsMatching(/fetal ultrasound|fetal echo/i).map(d => ({ ...d, price: d.price + 2500, priceNote: 'Specialist scan + consultation' }))],
  },
  {
    id: 'growth-scan', name: 'Growth scan (third trimester)', category: 'Scan',
    whenNeeded: 'Around 32-36 weeks, or earlier if your doctor is checking baby\'s growth.',
    consider: 'A Doppler may be added if growth is a concern; ask if it is included in the price.',
    providers: [...labsFor('growth_scan', 'Growth scan with report'), ...doctorsMatching(/fetal ultrasound|fetal echo/i).map(d => ({ ...d, price: d.price + 1500, priceNote: 'Specialist scan + consultation' }))],
  },
  {
    id: 'normal-delivery', name: 'Normal delivery', category: 'Delivery',
    whenNeeded: 'Around 37-40 weeks.',
    consider: 'Cost depends on room type and length of stay. Under JSSK, delivery at participating facilities is cashless; PM-JAY covers eligible families.',
    providers: hospitalsFor('normalDeliveryEstInr', 'Estimate: 2-3 day stay, general ward'),
  },
  {
    id: 'c-section', name: 'Caesarean delivery', category: 'Delivery',
    whenNeeded: 'Planned if your doctor advises it, or as an emergency during labour.',
    consider: 'Ask what the estimate excludes (NICU stay, blood products). Emergency caesareans can cost more than planned ones.',
    providers: hospitalsFor('cSectionEstInr', 'Estimate: 4-day stay, semi-private'),
  },
];

export const priceRange = (n: CareNeed) => {
  const p = n.providers.map(x => x.price);
  return p.length ? { min: Math.min(...p), max: Math.max(...p), count: p.length } : { min: 0, max: 0, count: 0 };
};
