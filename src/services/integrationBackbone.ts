import { IntegrationBackboneEvent } from '../types';

export interface IntegrationNodeStatus {
  id: string;
  name: string;
  category: 'CORE' | 'CLINICAL' | 'DIAGNOSTIC' | 'DISPENSARY' | 'GATEWAY';
  protocol: 'FHIR R4' | 'HL7 v2.5' | 'REST / JSON' | 'MQTT / WS';
  status: 'ONLINE' | 'ACTIVE_TRAFFIC' | 'DEGRADED';
  pingMs: number;
  lastSync: string;
  recordsSyncedToday: number;
}

const INITIAL_EVENTS: IntegrationBackboneEvent[] = [
  {
    id: 'INT-8910',
    timestamp: 'Just now',
    sourceModule: 'DOCTOR_STATION',
    targetModule: 'PATHOLOGY_LAB',
    eventType: 'LAB_REQUISITION_RECEIVED',
    title: 'Stat CBC & Oral GTT Requisition Transmitted',
    details: 'Dr. Anita Rao ordered Serum Ferritin & 75g OGTT for Sunita Das (28w ANC). Specimen tube barcode #TUBE-8821 assigned.',
    patientId: 'PAT-104',
    patientName: 'Sunita Das',
    doctorId: 'doc-anita',
    doctorName: 'Dr. Anita Rao',
    payloadSummary: '{"test": "Serum Ferritin + OGTT", "priority": "Urgent", "fasting": true}',
    status: 'SUCCESS'
  },
  {
    id: 'INT-8909',
    timestamp: '3 mins ago',
    sourceModule: 'DOCTOR_STATION',
    targetModule: 'PHARMACY_HUB',
    eventType: 'PRESCRIPTION_DISPATCHED',
    title: 'E-Prescription Routed to Jan Aushadhi Pharmacy',
    details: 'Digital prescription for Tab IFA 100mg + Calcium VitD3 transmitted with generic substitution consent.',
    patientId: 'PAT-104',
    patientName: 'Sunita Das',
    doctorId: 'doc-anita',
    doctorName: 'Dr. Anita Rao',
    payloadSummary: '{"items": 2, "dispenser": "Jan Aushadhi #402", "scheme": "JSSK Free Antenatal"}',
    status: 'SUCCESS'
  },
  {
    id: 'INT-8908',
    timestamp: '12 mins ago',
    sourceModule: 'RECEPTION_DESK',
    targetModule: 'DOCTOR_STATION',
    eventType: 'TOKEN_GENERATED',
    title: 'Patient Triage & Queue Allocation',
    details: 'Token #1 issued to Sunita Das for Consultation Room 4 (Dr. Anita Rao - Maternal Suite).',
    patientId: 'PAT-104',
    patientName: 'Sunita Das',
    doctorId: 'doc-anita',
    doctorName: 'Dr. Anita Rao',
    payloadSummary: '{"token": 1, "room": "Room 4", "triagePriority": "Routine ANC"}',
    status: 'SUCCESS'
  },
  {
    id: 'INT-8907',
    timestamp: '25 mins ago',
    sourceModule: 'ADMIN_PORTAL',
    targetModule: 'DOCTOR_STATION',
    eventType: 'ROOM_ALLOCATED',
    title: 'Consultation Room Allocation Synced',
    details: 'Room 4 allocated to Dr. Anita Rao (Shift: 08:30 - 15:30 IST) with fetal ultrasound Doppler enabled.',
    doctorId: 'doc-anita',
    doctorName: 'Dr. Anita Rao',
    payloadSummary: '{"roomId": "room-4", "roomNumber": "Room 4", "suite": "Maternal Suite"}',
    status: 'SUCCESS'
  },
  {
    id: 'INT-8906',
    timestamp: '40 mins ago',
    sourceModule: 'PATHOLOGY_LAB',
    targetModule: 'ABDM_GATEWAY',
    eventType: 'LAB_REPORT_SYNCED',
    title: 'FHIR DiagnosticReport Bundle Uploaded',
    details: 'Urine Routine & Microscopic examination authorized by Dr. Suniti Patel linked to ABHA #91-8842-1049-2311.',
    patientId: 'PAT-104',
    patientName: 'Sunita Das',
    payloadSummary: '{"bundle": "FHIR DiagnosticReport v4.0.1", "status": "FINAL"}',
    status: 'SUCCESS'
  }
];

export class IntegrationBackboneService {
  private events: IntegrationBackboneEvent[] = [...INITIAL_EVENTS];
  private listeners: Set<() => void> = new Set();

  private nodes: IntegrationNodeStatus[] = [
    {
      id: 'node-admin',
      name: 'Hospital Administration & Roster Bus',
      category: 'CORE',
      protocol: 'REST / JSON',
      status: 'ONLINE',
      pingMs: 12,
      lastSync: 'Continuous',
      recordsSyncedToday: 142
    },
    {
      id: 'node-reception',
      name: 'Front-Desk Triage & Token Engine',
      category: 'CLINICAL',
      protocol: 'REST / JSON',
      status: 'ONLINE',
      pingMs: 14,
      lastSync: 'Continuous',
      recordsSyncedToday: 38
    },
    {
      id: 'node-doctor',
      name: 'Doctor Consultation Stations (OPD EHR)',
      category: 'CLINICAL',
      protocol: 'REST / JSON',
      status: 'ONLINE',
      pingMs: 18,
      lastSync: 'Continuous',
      recordsSyncedToday: 74
    },
    {
      id: 'node-lab',
      name: 'Pathology & Diagnostic LIS Bridge',
      category: 'DIAGNOSTIC',
      protocol: 'HL7 v2.5',
      status: 'ONLINE',
      pingMs: 24,
      lastSync: '1 min ago',
      recordsSyncedToday: 29
    },
    {
      id: 'node-pharmacy',
      name: 'Dispensary & PM Jan Aushadhi PMS',
      category: 'DISPENSARY',
      protocol: 'REST / JSON',
      status: 'ONLINE',
      pingMs: 16,
      lastSync: '2 mins ago',
      recordsSyncedToday: 45
    },
    {
      id: 'node-abdm',
      name: 'ABDM Ayushman Bharat FHIR Gateway',
      category: 'GATEWAY',
      protocol: 'FHIR R4',
      status: 'ONLINE',
      pingMs: 42,
      lastSync: 'Continuous',
      recordsSyncedToday: 31
    }
  ];

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  getEvents(): IntegrationBackboneEvent[] {
    return [...this.events];
  }

  getNodes(): IntegrationNodeStatus[] {
    return [...this.nodes];
  }

  logEvent(event: Omit<IntegrationBackboneEvent, 'id' | 'timestamp'> & { timestamp?: string }) {
    const newEvent: IntegrationBackboneEvent = {
      id: `INT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: event.timestamp || 'Just now',
      ...event
    };
    this.events.unshift(newEvent);
    // keep max 100 events
    if (this.events.length > 100) {
      this.events.pop();
    }
    this.notify();
    return newEvent;
  }

  /**
   * Simulates an end-to-end integration transaction across all nodes
   */
  simulateEndToEndTransaction(patientName: string = 'Sunita Das', doctorName: string = 'Dr. Anita Rao') {
    // 1. Reception token generated
    this.logEvent({
      sourceModule: 'RECEPTION_DESK',
      targetModule: 'DOCTOR_STATION',
      eventType: 'TOKEN_GENERATED',
      title: `Triage Allocation for ${patientName}`,
      details: `Token priority assigned to ${doctorName} consultation queue. High-risk flag: Gestational Hypertension screening requested.`,
      patientName,
      doctorName,
      payloadSummary: '{"priority": "NORMAL", "maternalGestation": "28w"}',
      status: 'SUCCESS'
    });

    // 2. Doctor consultation initiated
    setTimeout(() => {
      this.logEvent({
        sourceModule: 'DOCTOR_STATION',
        targetModule: 'PATHOLOGY_LAB',
        eventType: 'LAB_REQUISITION_RECEIVED',
        title: `Auto-Routed Diagnostic Order to Allocated Lab`,
        details: `${doctorName} issued urgent Serum Albumin & Platelet Count request. Auto-routed to In-House Apex Diagnostic Hub.`,
        patientName,
        doctorName,
        payloadSummary: '{"tests": ["Platelet Count", "Serum Albumin"], "routing": "PRIMARY_ALLOCATED_LAB"}',
        status: 'SUCCESS'
      });
    }, 400);

    // 3. Prescription sent to pharmacy
    setTimeout(() => {
      this.logEvent({
        sourceModule: 'DOCTOR_STATION',
        targetModule: 'PHARMACY_HUB',
        eventType: 'PRESCRIPTION_DISPATCHED',
        title: `Prescription Synced with Jan Aushadhi Hub`,
        details: `E-Prescription for Labetalol 100mg BD & Iron-Folic Acid dispatched. Pharmacy inventory reserved.`,
        patientName,
        doctorName,
        payloadSummary: '{"dispenseCode": "RX-2026", "genericStock": "AVAILABLE"}',
        status: 'SUCCESS'
      });
    }, 800);

    // 4. ABDM FHIR bundle synchronized
    setTimeout(() => {
      this.logEvent({
        sourceModule: 'PATHOLOGY_LAB',
        targetModule: 'ABDM_GATEWAY',
        eventType: 'FHIR_BUNDLE_EXPORTED',
        title: `ABHA Health Records FHIR Bundle Created`,
        details: `Encounter & Prescription records encoded into ABDM HL7 FHIR Bundle and encrypted with patient ABHA key.`,
        patientName,
        payloadSummary: '{"fhirResource": "Bundle/Encounter+MedicationRequest", "abhaLinked": true}',
        status: 'SUCCESS'
      });
    }, 1200);
  }
}

export const integrationBackbone = new IntegrationBackboneService();
