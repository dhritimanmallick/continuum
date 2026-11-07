import { FamilyMember, FamilyRelationship, ConsentLevel } from '../types';

class FamilyService {
  private members: FamilyMember[] = [
    {
      id: 'fam-1',
      primaryPatientId: 'PAT-104',
      name: 'Rajesh Das',
      relationship: 'SPOUSE',
      age: 32,
      gender: 'Male',
      mobile: '+91 98451 12340',
      abhaNumber: '91-4432-8871-1290',
      abhaAddress: 'rajesh.das@abdm',
      abhaLinked: true,
      bloodGroup: 'O Positive',
      isEmergencyContact: true,
      emergencyPriority: 1,
      consentLevel: 'FULL_ACCESS',
      allowedRecordTypes: ['PRESCRIPTIONS', 'LAB_REPORTS', 'APPOINTMENTS', 'MATERNITY_UPDATES'],
      medicalHistorySummary: 'Healthy, no known chronic illness. Non-smoker.',
      allergies: ['None reported'],
      chronicConditions: []
    },
    {
      id: 'fam-2',
      primaryPatientId: 'PAT-104',
      name: 'Kamala Das',
      relationship: 'MOTHER_IN_LAW',
      age: 58,
      gender: 'Female',
      mobile: '+91 94482 99812',
      abhaNumber: '91-1120-7741-9921',
      abhaAddress: 'kamala.das@abdm',
      abhaLinked: true,
      bloodGroup: 'B Positive',
      isEmergencyContact: false,
      consentLevel: 'LAB_AND_MEDS_ONLY',
      allowedRecordTypes: ['PRESCRIPTIONS', 'LAB_REPORTS', 'APPOINTMENTS'],
      medicalHistorySummary: 'Hypertension on Telmisartan 40mg. Regular check-up at Hubballi Civil OPD.',
      allergies: ['Sulfa drugs'],
      chronicConditions: ['Hypertension']
    },
    {
      id: 'fam-3',
      primaryPatientId: 'PAT-104',
      name: 'Baby of Sunita',
      relationship: 'CHILD',
      age: 0,
      gender: 'Female',
      mobile: '+91 98451 12340',
      abhaNumber: '91-9900-1122-3344',
      abhaAddress: 'baby.sunita@abdm',
      abhaLinked: true,
      bloodGroup: 'O Negative',
      isEmergencyContact: false,
      consentLevel: 'FULL_ACCESS',
      allowedRecordTypes: ['VACCINATIONS', 'LAB_REPORTS', 'APPOINTMENTS'],
      linkedPatientRecordId: 'PAT-NEWBORN-104',
      medicalHistorySummary: 'Delivered at 38 weeks. Birth weight 3.1 kg. BCG, OPV-0, Hep-B administered.',
      allergies: ['None']
    },
    {
      id: 'fam-4',
      primaryPatientId: 'PAT-104',
      name: 'Meena Sharma',
      relationship: 'MOTHER',
      age: 54,
      gender: 'Female',
      mobile: '+91 97410 44521',
      isEmergencyContact: true,
      emergencyPriority: 2,
      abhaLinked: false,
      consentLevel: 'EMERGENCY_ONLY',
      allowedRecordTypes: ['MATERNITY_UPDATES', 'APPOINTMENTS'],
      medicalHistorySummary: 'Healthy. Accompanying daughter during delivery.'
    },
    {
      id: 'fam-5',
      primaryPatientId: 'PAT-101',
      name: 'Suresh Patil',
      relationship: 'SPOUSE',
      age: 30,
      gender: 'Male',
      mobile: '+91 98452 33410',
      abhaNumber: '91-3321-4455-6677',
      abhaAddress: 'suresh.patil@abdm',
      abhaLinked: true,
      bloodGroup: 'A Positive',
      isEmergencyContact: true,
      emergencyPriority: 1,
      consentLevel: 'FULL_ACCESS',
      allowedRecordTypes: ['PRESCRIPTIONS', 'LAB_REPORTS', 'APPOINTMENTS', 'MATERNITY_UPDATES'],
      medicalHistorySummary: 'Healthy'
    },
    {
      id: 'fam-6',
      primaryPatientId: 'PAT-101',
      name: 'Ananya Patil',
      relationship: 'CHILD',
      age: 4,
      gender: 'Female',
      mobile: '+91 98452 33410',
      abhaLinked: false,
      bloodGroup: 'B Positive',
      isEmergencyContact: false,
      consentLevel: 'FULL_ACCESS',
      allowedRecordTypes: ['VACCINATIONS', 'APPOINTMENTS'],
      medicalHistorySummary: 'Immunisation up-to-date up to 4 years.'
    }
  ];

  private activeMemberByPatient: Record<string, string> = {};
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

  getMembersForPatient(patientId: string): FamilyMember[] {
    return this.members.filter(m => m.primaryPatientId === patientId);
  }

  getActiveMemberId(patientId: string): string | null {
    return this.activeMemberByPatient[patientId] || null;
  }

  setActiveMemberId(patientId: string, memberId: string | null) {
    if (memberId) {
      this.activeMemberByPatient[patientId] = memberId;
    } else {
      delete this.activeMemberByPatient[patientId];
    }
    this.notify();
  }

  addMember(member: Omit<FamilyMember, 'id'>): FamilyMember {
    const newMember: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}`
    };
    this.members.push(newMember);
    this.notify();
    return newMember;
  }

  updateMember(id: string, updates: Partial<FamilyMember>): FamilyMember | null {
    const idx = this.members.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.members[idx] = { ...this.members[idx], ...updates };
    this.notify();
    return this.members[idx];
  }

  deleteMember(id: string): boolean {
    const prevLen = this.members.length;
    this.members = this.members.filter(m => m.id !== id);
    if (this.members.length !== prevLen) {
      this.notify();
      return true;
    }
    return false;
  }

  linkAbha(id: string, abhaNumber: string, abhaAddress: string): boolean {
    const member = this.members.find(m => m.id === id);
    if (!member) return false;
    member.abhaNumber = abhaNumber;
    member.abhaAddress = abhaAddress;
    member.abhaLinked = true;
    this.notify();
    return true;
  }

  setEmergencyContact(id: string, isEmergency: boolean, priority?: number): boolean {
    const member = this.members.find(m => m.id === id);
    if (!member) return false;
    member.isEmergencyContact = isEmergency;
    if (priority) member.emergencyPriority = priority;
    this.notify();
    return true;
  }
}

export const familyService = new FamilyService();
