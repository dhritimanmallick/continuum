import type React from 'react';
import { Baby, ClipboardList, Stethoscope, FlaskConical, Pill, Building2 } from 'lucide-react';
import type { AuthUser } from '../../types';

export type ProfileKey = 'MOTHER' | 'FRONT_DESK' | 'DOCTOR' | 'LAB' | 'PHARMACY' | 'ADMIN';

export const PROFILE_META: Record<ProfileKey, {
  label: string; userId: string; icon: React.ElementType; chip: string; tile: string;
  who: string; what: string[];
}> = {
  MOTHER: {
    label: 'Mother & Family', userId: 'user-patient-sunita', icon: Baby,
    chip: 'bg-rose-50 text-rose-800 border-rose-200', tile: 'from-rose-500 to-pink-600',
    who: 'Sunita, 28 weeks pregnant',
    what: ['Check-ups and doctor videos for her stage', 'Doctors, labs and costs across hospitals', 'ABHA records, consents and family circle'],
  },
  FRONT_DESK: {
    label: 'OPD Front Desk', userId: 'user-reception', icon: ClipboardList,
    chip: 'bg-amber-50 text-amber-900 border-amber-200', tile: 'from-amber-500 to-orange-600',
    who: 'Reception & nursing',
    what: ['Register by mobile and ABHA', 'Digitise paper prescriptions', 'Care gaps and WhatsApp nudges'],
  },
  DOCTOR: {
    label: 'Doctor', userId: 'user-doc-anita', icon: Stethoscope,
    chip: 'bg-sky-50 text-sky-900 border-sky-200', tile: 'from-sky-500 to-blue-700',
    who: 'Dr Anita Rao, OB/GYN',
    what: ['10-second gist and ABHA records', 'Prescribe and order tests', 'Labour updates and practice journey'],
  },
  LAB: {
    label: 'Pathology Lab', userId: 'user-lab-apex', icon: FlaskConical,
    chip: 'bg-violet-50 text-violet-900 border-violet-200', tile: 'from-violet-500 to-purple-700',
    who: 'Apex Diagnostic Centre',
    what: ['Receive test orders', 'Upload reports (OCR) and analyse', 'Send FHIR reports back to the OPD'],
  },
  PHARMACY: {
    label: 'Pharmacy', userId: 'user-pharma-janaushadhi', icon: Pill,
    chip: 'bg-emerald-50 text-emerald-900 border-emerald-200', tile: 'from-emerald-500 to-teal-700',
    who: 'PM Jan Aushadhi Kendra',
    what: ['Receive e-prescriptions', 'Offer Jan Aushadhi generics', 'Dispense and close the loop'],
  },
  ADMIN: {
    label: 'Hospital Admin', userId: 'user-admin', icon: Building2,
    chip: 'bg-slate-100 text-slate-900 border-slate-300', tile: 'from-slate-600 to-slate-900',
    who: 'Medical Superintendent',
    what: ['Doctors and room allocation', 'Care gaps across every room', 'Partner labs, ONDC and integrations'],
  },
};

export const PROFILE_ORDER: ProfileKey[] = ['MOTHER', 'FRONT_DESK', 'DOCTOR', 'LAB', 'PHARMACY', 'ADMIN'];

export function profileForUser(u: AuthUser): ProfileKey {
  switch (u.role) {
    case 'PATIENT': return 'MOTHER';
    case 'RECEPTION': return 'FRONT_DESK';
    case 'DOCTOR': return 'DOCTOR';
    case 'LAB': return 'LAB';
    case 'PHARMA': return 'PHARMACY';
    default: return 'ADMIN';
  }
}
