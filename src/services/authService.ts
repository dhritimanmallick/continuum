import { AuthUser, DoctorProfile } from '../types';
import { integrationBackbone } from './integrationBackbone';

export const INITIAL_AUTH_USERS: AuthUser[] = [
  {
    id: 'user-admin',
    username: 'admin',
    name: 'Dr. Radhika Sen',
    title: 'Medical Superintendent & Hospital Director',
    role: 'ADMIN',
    department: 'Hospital Administration & Clinical Governance',
    avatar: '🏥',
    avatarBg: 'bg-slate-900 text-rose-200 border-slate-700',
    email: 'admin@stannehospital.in',
    phone: '+91 98450 11223',
    allocatedRoom: 'Superintendent Office (Floor 2)',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Active now'
  },
  {
    id: 'user-doc-anita',
    username: 'anita',
    name: 'Dr. Anita Rao',
    title: 'Senior Consultant OB/GYN',
    role: 'DOCTOR',
    doctorId: 'doc-anita',
    department: 'Maternal & Foetal Health Suite',
    avatar: '👩‍⚕️',
    avatarBg: 'bg-rose-100 text-rose-800 border-rose-300',
    email: 'anita.rao@stannehospital.in',
    phone: '+91 98450 22334',
    allocatedRoom: 'Room 4 (Maternal Suite)',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Active now'
  },
  {
    id: 'user-doc-rajesh',
    username: 'rajesh',
    name: 'Dr. Rajesh Kulkarni',
    title: 'Senior Consultant Physician',
    role: 'DOCTOR',
    doctorId: 'doc-rajesh',
    department: 'Internal Medicine & Chronic Disease',
    avatar: '👨‍⚕️',
    avatarBg: 'bg-blue-100 text-blue-800 border-blue-300',
    email: 'rajesh.kulkarni@stannehospital.in',
    phone: '+91 98450 33445',
    allocatedRoom: 'Room 1 (General Medicine)',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Today 08:45 AM'
  },
  {
    id: 'user-doc-sneha',
    username: 'sneha',
    name: 'Dr. Sneha Patil',
    title: 'Consultant Pediatrician & Neonatologist',
    role: 'DOCTOR',
    doctorId: 'doc-sneha',
    department: 'Pediatrics & Child Health',
    avatar: '👩‍⚕️',
    avatarBg: 'bg-purple-100 text-purple-800 border-purple-300',
    email: 'sneha.patil@stannehospital.in',
    phone: '+91 98450 44556',
    allocatedRoom: 'Room 2 (Pediatric Suite)',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Today 09:00 AM'
  },
  {
    id: 'user-reception',
    username: 'reception',
    name: 'Sister Mary Fernandez',
    title: 'Chief Nursing Officer & Triage Executive',
    role: 'RECEPTION',
    department: 'Central Triage & Patient Enrolment',
    avatar: '📋',
    avatarBg: 'bg-pink-100 text-pink-800 border-pink-300',
    email: 'reception@stannehospital.in',
    phone: '+91 98450 55667',
    allocatedRoom: 'Central Front-Desk Triage',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Active now'
  },
  {
    id: 'user-lab',
    username: 'lab',
    name: 'Dr. Suniti Patel',
    title: 'In-House Pathology Hub Director',
    role: 'LAB',
    department: 'Hospital Central Pathology Wing',
    avatar: '🔬',
    avatarBg: 'bg-purple-100 text-purple-800 border-purple-300',
    email: 'pathology@stannehospital.in',
    phone: '+91 98450 66778',
    allocatedRoom: 'Diagnostic Wing (Lab L-01)',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Active now',
    vendorType: 'PATHOLOGY_LAB',
    vendorPartnerId: 'lab-district'
  },
  {
    id: 'user-lab-apex',
    username: 'apexlab',
    name: 'Dr. Sudhir Shenoy, MD',
    title: 'Apex Diagnostic Hub (ONDC BPP Node)',
    role: 'LAB',
    department: 'Apex Diagnostic Centre & Advanced Path Lab',
    avatar: '🔬',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    email: 'shenoy@apexdiag.in',
    phone: '+91 836 2251900',
    allocatedRoom: 'ONDC Node: BPP-LAB-APEX-092 (City Centre)',
    facilityName: 'Apex Diagnostic Centre & Advanced Path Lab',
    isOnline: true,
    lastLogin: 'Active now',
    vendorType: 'PATHOLOGY_LAB',
    vendorPartnerId: 'lab-apex',
    ondcParticipantId: 'BPP-LAB-APEX-092',
    isAddonVendor: true
  },
  {
    id: 'user-lab-suraksha',
    username: 'surakshalab',
    name: 'Dr. Veena Hegde, DMRD',
    title: 'Suraksha Ultrasound (ONDC BPP Node)',
    role: 'LAB',
    department: 'Suraksha Ultrasound & Diagnostic Imaging',
    avatar: '🔬',
    avatarBg: 'bg-blue-100 text-blue-800 border-blue-300',
    email: 'veena@surakshaimaging.in',
    phone: '+91 836 2374100',
    allocatedRoom: 'ONDC Node: BPP-LAB-SURAKSHA-114 (Vidyanagar)',
    facilityName: 'Suraksha Ultrasound & Diagnostic Imaging',
    isOnline: true,
    lastLogin: 'Active now',
    vendorType: 'PATHOLOGY_LAB',
    vendorPartnerId: 'lab-suraksha',
    ondcParticipantId: 'BPP-LAB-SURAKSHA-114',
    isAddonVendor: true
  },
  {
    id: 'user-pharma-janaushadhi',
    username: 'janaushadhi',
    name: 'Suresh Hegde, R.Ph.',
    title: 'PM Jan Aushadhi Kendra #5048 (ONDC Node)',
    role: 'PHARMA',
    department: 'Pradhan Mantri Jan Aushadhi Kendra (#5048)',
    avatar: '🌿',
    avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    email: 'janaushadhi5048@gov.in',
    phone: '+91 94480 32188',
    allocatedRoom: 'ONDC Node: BPP-PHARM-JANAUSHADHI-5048',
    facilityName: 'Pradhan Mantri Jan Aushadhi Kendra (#5048)',
    isOnline: true,
    lastLogin: 'Active now',
    vendorType: 'PHARMACY',
    vendorPartnerId: 'pharm-janaushadhi',
    ondcParticipantId: 'BPP-PHARM-JANAUSHADHI-5048',
    isAddonVendor: true
  },
  {
    id: 'user-pharma-medplus',
    username: 'medplus',
    name: 'Priya N., R.Ph.',
    title: 'MedPlus 24hr Chemist (ONDC Node)',
    role: 'PHARMA',
    department: 'MedPlus Pharmacy & Chemist Station Road',
    avatar: '💊',
    avatarBg: 'bg-teal-100 text-teal-800 border-teal-300',
    email: 'priya@medplus.in',
    phone: '+91 836 235678',
    allocatedRoom: 'ONDC Node: BPP-PHARM-MEDPLUS-882 (Station Rd)',
    facilityName: 'MedPlus Pharmacy & Chemist',
    isOnline: true,
    lastLogin: 'Active now',
    vendorType: 'PHARMACY',
    vendorPartnerId: 'pharm-medplus',
    ondcParticipantId: 'BPP-PHARM-MEDPLUS-882',
    isAddonVendor: true
  },
  {
    id: 'user-pharma',
    username: 'pharma',
    name: 'Rajesh Kumar, R.Ph.',
    title: 'Hospital Dispensary In-Charge',
    role: 'PHARMA',
    department: 'Hospital Central Dispensary & Window #1',
    avatar: '🌿',
    avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    email: 'pharmacy@stannehospital.in',
    phone: '+91 98450 77889',
    allocatedRoom: 'Dispensary Counter (Ground Floor)',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Active now',
    vendorType: 'PHARMACY',
    vendorPartnerId: 'pharm-inhouse'
  },
  {
    id: 'user-patient-sunita',
    username: 'sunita',
    name: 'Sunita Das',
    title: 'Expectant Mother (28w Gestation, Primigravida)',
    role: 'PATIENT',
    department: 'Patient & Family Portal',
    avatar: '🤰',
    avatarBg: 'bg-rose-100 text-rose-800 border-rose-300',
    email: 'sunita.das@gmail.com',
    phone: '+91 98451 12340',
    allocatedRoom: 'Personal Health Portal',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Active now',
    patientId: 'PAT-104',
    gestationalWeeks: 28
  },
  {
    id: 'user-patient-rajesh-fam',
    username: 'rajesh_fam',
    name: 'Rajesh Das',
    title: 'Nominated Spouse & Emergency Delivery Contact',
    role: 'PATIENT',
    department: 'Patient & Family Portal (Family Member Access)',
    avatar: '👨',
    avatarBg: 'bg-blue-100 text-blue-800 border-blue-300',
    email: 'rajesh.das@gmail.com',
    phone: '+91 98451 12340',
    allocatedRoom: 'Family Circle Access',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Active now',
    patientId: 'PAT-104',
    familyMemberId: 'fam-1',
    isFamilyMember: true,
    primaryPatientName: 'Sunita Das',
    gestationalWeeks: 28
  },
  {
    id: 'user-patient-kavita',
    username: 'kavita',
    name: 'Kavita Patil',
    title: 'Postnatal Mother of Baby Aarav (6w Postpartum)',
    role: 'PATIENT',
    department: 'Patient & Family Portal',
    avatar: '👩‍👧',
    avatarBg: 'bg-purple-100 text-purple-800 border-purple-300',
    email: 'kavita.patil@gmail.com',
    phone: '+91 98452 33410',
    allocatedRoom: 'Personal Health Portal',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Today 10:15 AM',
    patientId: 'PAT-101'
  },
  {
    id: 'user-patient-pooja',
    username: 'pooja',
    name: 'Pooja Verma',
    title: 'Gynaecology & Endocrine Care Patient',
    role: 'PATIENT',
    department: 'Patient & Family Portal',
    avatar: '🌸',
    avatarBg: 'bg-pink-100 text-pink-800 border-pink-300',
    email: 'pooja.verma@gmail.com',
    phone: '+91 98453 77890',
    allocatedRoom: 'Personal Health Portal',
    facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
    isOnline: true,
    lastLogin: 'Yesterday',
    patientId: 'PAT-102'
  }
];

class AuthService {
  private users: AuthUser[] = [...INITIAL_AUTH_USERS];
  // Start on the profile home screen; a profile is chosen there (or via staff sign-in)
  private currentUser: AuthUser | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Restore custom add-on vendor users
    try {
      const customUsersStr = localStorage.getItem('continuum_custom_users');
      if (customUsersStr) {
        const customUsers: AuthUser[] = JSON.parse(customUsersStr);
        customUsers.forEach(cu => {
          if (!this.users.some(u => u.username === cu.username)) {
            this.users.push(cu);
          }
        });
      }
    } catch {
      // ignore
    }

    // Sessions are not restored on reload: the app always opens on the profile home screen
    try { localStorage.removeItem('continuum_logged_in_user_id'); } catch { /* ignore */ }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  getUsers(): AuthUser[] {
    return [...this.users];
  }

  login(username: string, _password?: string): { success: boolean; user?: AuthUser; error?: string } {
    const cleanUser = username.trim().toLowerCase();
    const digitsOnly = cleanUser.replace(/\D/g, '');

    const user = this.users.find(u => {
      if (u.username.toLowerCase() === cleanUser) return true;
      if (u.email.toLowerCase() === cleanUser) return true;
      if (u.patientId && u.patientId.toLowerCase() === cleanUser) return true;
      if (digitsOnly.length >= 10 && u.phone.replace(/\D/g, '').includes(digitsOnly)) return true;
      return false;
    });
    
    if (!user) {
      return { success: false, error: 'Account not found. Please verify username, registered mobile number, or Patient ID.' };
    }

    this.currentUser = user;
    try {
      localStorage.setItem('continuum_logged_in_user_id', user.id);
    } catch {
      // ignore
    }

    integrationBackbone.logEvent({
      sourceModule: 'ADMIN_PORTAL',
      targetModule: user.role === 'PATIENT' ? 'PATIENT_APP' : 'DOCTOR_STATION',
      eventType: 'CONSULTATION_STARTED',
      title: `${user.role === 'PATIENT' ? 'Patient Portal' : 'Staff Session'} Authenticated: ${user.name}`,
      details: `${user.name} logged into ${user.department} (${user.role} Role).`,
      status: 'SUCCESS'
    });

    this.notify();
    return { success: true, user };
  }

  quickLogin(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      try {
        localStorage.setItem('continuum_logged_in_user_id', user.id);
      } catch {
        // ignore
      }

      integrationBackbone.logEvent({
        sourceModule: 'ADMIN_PORTAL',
        targetModule: 'DOCTOR_STATION',
        eventType: 'CONSULTATION_STARTED',
        title: `Fast Login: ${user.name} (${user.role})`,
        details: `Active session switched to ${user.name} - ${user.title}.`,
        status: 'SUCCESS'
      });

      this.notify();
    }
  }

  logout() {
    if (this.currentUser) {
      integrationBackbone.logEvent({
        sourceModule: 'ADMIN_PORTAL',
        targetModule: 'ADMIN_PORTAL',
        eventType: 'CONSULTATION_STARTED',
        title: `User Logged Out: ${this.currentUser.name}`,
        details: `${this.currentUser.name} closed session. Returned to secure hospital gate.`,
        status: 'SUCCESS'
      });
    }
    this.currentUser = null;
    try {
      localStorage.removeItem('continuum_logged_in_user_id');
    } catch {
      // ignore
    }
    this.notify();
  }

  /**
   * Automatically provisions a login account when the Hospital Admin adds a doctor
   */
  addUserForDoctor(doctor: DoctorProfile): AuthUser {
    const sanitizedUsername = doctor.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
    const existingIndex = this.users.findIndex(u => u.doctorId === doctor.id);

    const newUser: AuthUser = {
      id: `user-${doctor.id}`,
      username: sanitizedUsername,
      name: doctor.name,
      title: `${doctor.specialty} (${doctor.qualification})`,
      role: 'DOCTOR',
      doctorId: doctor.id,
      department: doctor.department || 'Clinical OPD Suite',
      avatar: doctor.name.toLowerCase().includes('dr.') ? '👩‍⚕️' : '👨‍⚕️',
      avatarBg: 'bg-rose-100 text-rose-800 border-rose-300',
      email: doctor.email || `${sanitizedUsername}@stannehospital.in`,
      phone: doctor.phone || '+91 98450 99000',
      allocatedRoom: `${doctor.roomNumber} (${doctor.clinicName})`,
      facilityName: 'St. Anne Mother & Child Hospital & Nursing Home',
      isOnline: true,
      lastLogin: 'Just provisioned'
    };

    if (existingIndex >= 0) {
      this.users[existingIndex] = newUser;
    } else {
      this.users.push(newUser);
    }

    this.notify();
    return newUser;
  }

  updateUserRoomAllocation(doctorId: string, roomNumber: string, clinicName: string) {
    const user = this.users.find(u => u.doctorId === doctorId);
    if (user) {
      user.allocatedRoom = `${roomNumber} (${clinicName})`;
      this.notify();
    }
  }

  /**
   * Provisions a dedicated login account for an external shop/vendor onboarded via ONDC Network
   */
  addVendorUser(params: {
    username: string;
    password?: string;
    name: string;
    title: string;
    role: 'LAB' | 'PHARMA';
    vendorType: 'PATHOLOGY_LAB' | 'PHARMACY';
    vendorPartnerId: string;
    ondcParticipantId: string;
    facilityName?: string;
    phone?: string;
    email?: string;
  }): AuthUser {
    const newUser: AuthUser = {
      id: `user-vendor-${params.vendorPartnerId}`,
      username: params.username.toLowerCase().replace(/[^a-z0-9]/g, ''),
      name: params.name,
      title: params.title,
      role: params.role,
      department: `${params.facilityName || params.name} • ONDC BPP Network Node`,
      avatar: params.role === 'LAB' ? '🔬' : '💊',
      avatarBg: params.role === 'LAB' 
        ? 'bg-purple-100 text-purple-800 border-purple-300' 
        : 'bg-emerald-100 text-emerald-800 border-emerald-300',
      email: params.email || `${params.username.toLowerCase()}@ondc-health.in`,
      phone: params.phone || '+91 98450 88000',
      allocatedRoom: `ONDC Seller Node: ${params.ondcParticipantId}`,
      facilityName: params.facilityName || 'ONDC Connected Shop',
      isOnline: true,
      lastLogin: 'Just Onboarded',
      vendorType: params.vendorType,
      vendorPartnerId: params.vendorPartnerId,
      ondcParticipantId: params.ondcParticipantId,
      isAddonVendor: true
    };

    const existingIdx = this.users.findIndex(u => u.username === newUser.username);
    if (existingIdx >= 0) {
      this.users[existingIdx] = newUser;
    } else {
      this.users.push(newUser);
    }

    try {
      localStorage.setItem('continuum_custom_users', JSON.stringify(this.users.filter(u => u.isAddonVendor)));
    } catch {
      // ignore
    }

    integrationBackbone.logEvent({
      sourceModule: 'ADMIN_PORTAL',
      targetModule: params.role === 'LAB' ? 'PATHOLOGY_LAB' : 'PHARMACY_HUB',
      eventType: 'CONSULTATION_STARTED',
      title: `ONDC Vendor Login Created: ${params.username}`,
      details: `Add-on account provisioned for ${params.name} (${params.facilityName}) via ONDC Gateway.`,
      status: 'SUCCESS'
    });

    this.notify();
    return newUser;
  }
}

export const authService = new AuthService();
