import { EmergencyCounsellingSlot, CounsellingAppointment } from '../types';

export const DOCTOR_COUNSELLING_SLOTS: EmergencyCounsellingSlot[] = [
  {
    id: 'slot-dr-anita',
    doctorId: 'doc-anita',
    doctorName: 'Dr. Anita Rao, MD (OB-GYN)',
    doctorSpecialty: 'Senior Consultant Obstetrician & Gynaecologist',
    doctorAvatar: '👩‍⚕️',
    roomNumber: 'Room 4 (OPD & Tele-Suite)',
    status: 'AVAILABLE_NOW',
    estimatedWaitMinutes: 2,
    consultationDurationMinutes: 10,
    sessionType: 'VIDEO'
  },
  {
    id: 'slot-dr-sunita',
    doctorId: 'doc-sunita',
    doctorName: 'Dr. Sunita Deshmukh, MS, DGO',
    doctorSpecialty: 'High-Risk Maternal-Fetal Medicine Specialist',
    doctorAvatar: '🩺',
    roomNumber: 'Room 6 (Maternity Block)',
    status: 'AVAILABLE_NOW',
    estimatedWaitMinutes: 5,
    consultationDurationMinutes: 10,
    sessionType: 'VIDEO'
  },
  {
    id: 'slot-dr-ramesh',
    doctorId: 'doc-ramesh',
    doctorName: 'Dr. Ramesh Kulkarni, MD',
    doctorSpecialty: 'Chief Pathologist & Perinatal Consultant',
    doctorAvatar: '🔬',
    roomNumber: 'Room 8 (Pathology Diagnostics)',
    status: 'NEXT_AVAILABLE',
    estimatedWaitMinutes: 12,
    consultationDurationMinutes: 5,
    sessionType: 'AUDIO'
  }
];

class EmergencyCounsellingService {
  private slots: EmergencyCounsellingSlot[] = DOCTOR_COUNSELLING_SLOTS;
  private appointments: CounsellingAppointment[] = [
    {
      id: 'appt-1',
      patientId: 'PAT-104',
      patientName: 'Sunita Das',
      patientAge: 28,
      patientMobile: '+91 98451 12340',
      doctorId: 'doc-anita',
      doctorName: 'Dr. Anita Rao, MD (OB-GYN)',
      bookedAt: '2026-10-21 02:15 PM',
      slotTime: '2:30 PM (Immediate Queue)',
      consultationType: 'VIDEO',
      isEmergencyPriority: false,
      urgencyReason: 'Clarification regarding mild nausea and iron tablet timing',
      patientConsentedRecordsAccess: true,
      status: 'COMPLETED',
      clinicalNotes: 'Advised taking iron tablet with orange juice at night, 2 hours after dinner to alleviate morning nausea. Foetal movement regular. Routine ANC visit on 15 Dec confirmed.',
      doctorRecommendations: 'Continue Tab. Autrin OD at bedtime. Maintain left lateral rest position.'
    }
  ];

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  getSlots(): EmergencyCounsellingSlot[] {
    return this.slots;
  }

  getAppointments(): CounsellingAppointment[] {
    return this.appointments;
  }

  getAppointmentsForPatient(patientId: string): CounsellingAppointment[] {
    return this.appointments.filter(a => a.patientId === patientId);
  }

  getDoctorQueue(doctorId: string): CounsellingAppointment[] {
    return this.appointments.filter(a => a.doctorId === doctorId && (a.status === 'WAITING' || a.status === 'IN_CALL'));
  }

  bookEmergencySlot(params: {
    patientId: string;
    patientName: string;
    patientAge: number;
    patientMobile: string;
    doctorId: string;
    doctorName: string;
    consultationType: 'AUDIO' | 'VIDEO';
    isEmergencyPriority: boolean;
    urgencyReason: string;
    patientConsentedRecordsAccess: boolean;
  }): CounsellingAppointment {
    const newAppt: CounsellingAppointment = {
      id: `tele-${Date.now()}`,
      patientId: params.patientId,
      patientName: params.patientName,
      patientAge: params.patientAge,
      patientMobile: params.patientMobile,
      doctorId: params.doctorId,
      doctorName: params.doctorName,
      bookedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      slotTime: 'Instant Priority Queue (ETA 3 mins)',
      consultationType: params.consultationType,
      isEmergencyPriority: params.isEmergencyPriority,
      urgencyReason: params.urgencyReason,
      patientConsentedRecordsAccess: params.patientConsentedRecordsAccess,
      status: 'WAITING'
    };

    this.appointments.unshift(newAppt);
    this.notify();
    return newAppt;
  }

  startCall(appointmentId: string): boolean {
    const appt = this.appointments.find(a => a.id === appointmentId);
    if (!appt) return false;
    appt.status = 'IN_CALL';
    this.notify();
    return true;
  }

  completeCall(appointmentId: string, notes: string, recommendations?: string): boolean {
    const appt = this.appointments.find(a => a.id === appointmentId);
    if (!appt) return false;
    appt.status = 'COMPLETED';
    appt.clinicalNotes = notes;
    appt.doctorRecommendations = recommendations;
    this.notify();
    return true;
  }

  escalateToEmergency(appointmentId: string, reason: string, referralDept: string = '24/7 Maternity Emergency Room'): boolean {
    const appt = this.appointments.find(a => a.id === appointmentId);
    if (!appt) return false;
    appt.status = 'ESCALATED_TO_ER';
    appt.escalatedToHospitalEmergency = true;
    appt.clinicalNotes = `[EMERGENCY ESCALATION]: ${reason}`;
    appt.referralDepartment = referralDept;
    this.notify();
    return true;
  }

  escalateToPhysicalOpd(appointmentId: string, instruction: string): boolean {
    const appt = this.appointments.find(a => a.id === appointmentId);
    if (!appt) return false;
    appt.status = 'COMPLETED';
    appt.escalatedToPhysicalOpd = true;
    appt.doctorRecommendations = `Advised immediate physical visit to OPD: ${instruction}`;
    this.notify();
    return true;
  }
}

export const emergencyCounsellingService = new EmergencyCounsellingService();
