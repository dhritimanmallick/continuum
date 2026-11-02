import { DoctorRevenueRecord, VicinityOrderBroadcast, LabPartner, PharmacyPartner } from '../types';
import { opdStore } from './opdStore';
import { integrationBackbone } from './integrationBackbone';

type Listener = () => void;

export class VicinityRevenueService {
  private listeners: Listener[] = [];

  // Default vicinity radius in kilometers (can be adjusted by user: 0.5km, 1km, 3km, 5km)
  public activeRadiusKm: number = 3.0;

  // Active broadcasts awaiting pickup or recently accepted
  private activeBroadcasts: VicinityOrderBroadcast[] = [
    {
      id: 'v-bcast-101',
      broadcastAt: '12 mins ago',
      doctorId: 'doc-anita-rao',
      doctorName: 'Dr. Anita Rao',
      clinicRoom: 'Room 4 (Maternal Suite)',
      patientId: 'PAT-OPD-1002',
      patientName: 'Meena Roy',
      patientPhone: '+91 98450 78219',
      category: 'LAB',
      items: [
        { name: 'Oral Glucose Tolerance Test 75g (OGTT)', price: 350 },
        { name: 'Ultrasound Growth & AFI Scan', price: 850 }
      ],
      totalValue: 1200,
      targetPartnerId: 'lab-apex',
      acceptedByPartnerId: 'lab-apex',
      acceptedByPartnerName: 'Apex Diagnostic Centre',
      status: 'ACCEPTED',
      radiusKm: 2.5
    },
    {
      id: 'v-bcast-102',
      broadcastAt: '25 mins ago',
      doctorId: 'doc-anita-rao',
      doctorName: 'Dr. Anita Rao',
      clinicRoom: 'Room 4 (Maternal Suite)',
      patientId: 'PAT-OPD-1002',
      patientName: 'Meena Roy',
      patientPhone: '+91 98450 78219',
      category: 'PHARMACY',
      items: [
        { name: 'Ferrous Ascorbate 100mg + Folic Acid 1.5mg', price: 42, genericName: 'Jan Aushadhi IFA' },
        { name: 'Calcium Carbonate 500mg + Vit D3', price: 35, genericName: 'Jan Aushadhi Cal-D3' }
      ],
      totalValue: 77,
      targetPartnerId: 'pharm-janaushadhi',
      acceptedByPartnerId: 'pharm-janaushadhi',
      acceptedByPartnerName: 'PM Jan Aushadhi Kendra (#5048)',
      status: 'ACCEPTED',
      radiusKm: 0.35
    },
    {
      id: 'v-bcast-103',
      broadcastAt: 'Just now',
      doctorId: 'doc-rajesh-kulkarni',
      doctorName: 'Dr. Rajesh Kulkarni',
      clinicRoom: 'Room 1 (General OPD)',
      patientId: 'PAT-OPD-1004',
      patientName: 'Pooja Kulkarni',
      patientPhone: '+91 98450 91823',
      category: 'LAB',
      items: [
        { name: 'Complete Hemogram (CBC)', price: 250 },
        { name: 'Thyroid Function Test (TSH, FT4)', price: 380 }
      ],
      totalValue: 630,
      status: 'BROADCASTING',
      radiusKm: 1.8
    }
  ];

  // Ledger of doctor-generated revenue for local vicinity shops
  private revenueRecords: DoctorRevenueRecord[] = [
    {
      id: 'REV-2026-001',
      orderId: 'ORD-OPD-981',
      timestamp: 'Today, 10:15 AM',
      doctorId: 'doc-anita-rao',
      doctorName: 'Dr. Anita Rao',
      doctorSpecialty: 'Senior Consultant OB/GYN',
      doctorRoom: 'Room 4 Maternal Suite',
      patientId: 'PAT-OPD-1002',
      patientName: 'Meena Roy',
      patientPhone: '+91 98450 78219',
      tokenNumber: 2,
      category: 'COMBINED',
      labPartnerId: 'lab-apex',
      labPartnerName: 'Apex Diagnostic Centre',
      labItems: ['75g Oral Glucose (OGTT)', 'Obstetric Growth Biometry'],
      labRevenue: 1200,
      pharmacyPartnerId: 'pharm-janaushadhi',
      pharmacyPartnerName: 'PM Jan Aushadhi Kendra #5048',
      pharmacyItems: ['Ferrous Ascorbate', 'Calcium Carbonate Vit D3'],
      pharmacyRevenue: 77,
      patientSavingsFromGeneric: 280,
      totalRevenueGenerated: 1277,
      status: 'ACCEPTED_BY_VENDOR',
      vicinityDistanceKm: 0.35,
      acceptedAt: '10:18 AM',
      vendorNotes: 'Jan Aushadhi dispatched to OPD gate counter. Apex phlebotomist assigned.'
    },
    {
      id: 'REV-2026-002',
      orderId: 'ORD-OPD-974',
      timestamp: 'Today, 09:30 AM',
      doctorId: 'doc-anita-rao',
      doctorName: 'Dr. Anita Rao',
      doctorSpecialty: 'Senior Consultant OB/GYN',
      doctorRoom: 'Room 4 Maternal Suite',
      patientId: 'PAT-OPD-1001',
      patientName: 'Sunita Das',
      patientPhone: '+91 98450 67341',
      tokenNumber: 1,
      category: 'COMBINED',
      labPartnerId: 'lab-apex',
      labPartnerName: 'Apex Diagnostic Centre',
      labItems: ['CBC Anemia Panel', 'Serum Ferritin'],
      labRevenue: 550,
      pharmacyPartnerId: 'pharm-janaushadhi',
      pharmacyPartnerName: 'PM Jan Aushadhi Kendra #5048',
      pharmacyItems: ['Therapeutic Elemental Iron BD', 'Vitamin C 500mg'],
      pharmacyRevenue: 95,
      patientSavingsFromGeneric: 310,
      totalRevenueGenerated: 645,
      status: 'COMPLETED',
      vicinityDistanceKm: 0.35,
      acceptedAt: '09:32 AM'
    },
    {
      id: 'REV-2026-003',
      orderId: 'ORD-OPD-965',
      timestamp: 'Yesterday, 04:15 PM',
      doctorId: 'doc-rajesh-kulkarni',
      doctorName: 'Dr. Rajesh Kulkarni',
      doctorSpecialty: 'Senior Consultant Physician',
      doctorRoom: 'Room 1 General OPD',
      patientId: 'PAT-OPD-1004',
      patientName: 'Pooja Kulkarni',
      patientPhone: '+91 98450 91823',
      tokenNumber: 4,
      category: 'LAB',
      labPartnerId: 'lab-suraksha',
      labPartnerName: 'Suraksha Ultrasound & Imaging',
      labItems: ['Targeted Organ Sonography', 'Renal Function'],
      labRevenue: 950,
      pharmacyRevenue: 0,
      patientSavingsFromGeneric: 0,
      totalRevenueGenerated: 950,
      status: 'COMPLETED',
      vicinityDistanceKm: 1.8,
      acceptedAt: '04:17 PM'
    },
    {
      id: 'REV-2026-004',
      orderId: 'ORD-OPD-958',
      timestamp: 'Yesterday, 02:40 PM',
      doctorId: 'doc-sneha-patil',
      doctorName: 'Dr. Sneha Patil',
      doctorSpecialty: 'Consultant Pediatrician',
      doctorRoom: 'Room 2 Pediatric Suite',
      patientId: 'PAT-OPD-1003',
      patientName: 'Aarav Sharma (Infant)',
      patientPhone: '+91 98450 83920',
      tokenNumber: 3,
      category: 'PHARMACY',
      pharmacyPartnerId: 'pharm-medplus',
      pharmacyPartnerName: 'MedPlus Pharmacy Station Road',
      pharmacyItems: ['Pediatric Paracetamol Syrup', 'ORS Oral Electrolytes', 'Zinc Drops'],
      pharmacyRevenue: 240,
      labRevenue: 0,
      patientSavingsFromGeneric: 110,
      totalRevenueGenerated: 240,
      status: 'COMPLETED',
      vicinityDistanceKm: 1.2,
      acceptedAt: '02:42 PM'
    },
    {
      id: 'REV-2026-005',
      orderId: 'ORD-OPD-942',
      timestamp: '12 Oct, 11:20 AM',
      doctorId: 'doc-anita-rao',
      doctorName: 'Dr. Anita Rao',
      doctorSpecialty: 'Senior Consultant OB/GYN',
      doctorRoom: 'Room 4 Maternal Suite',
      patientId: 'PAT-OPD-1006',
      patientName: 'Lakshmi Patil',
      patientPhone: '+91 98450 77112',
      tokenNumber: 6,
      category: 'COMBINED',
      labPartnerId: 'lab-apex',
      labPartnerName: 'Apex Diagnostic Centre',
      labItems: ['Fasting Glucose', 'Urine Albumin Microalbumin'],
      labRevenue: 420,
      pharmacyPartnerId: 'pharm-janaushadhi',
      pharmacyPartnerName: 'PM Jan Aushadhi Kendra #5048',
      pharmacyItems: ['Metformin 500mg SR', 'Multivitamins for Gestation'],
      pharmacyRevenue: 60,
      patientSavingsFromGeneric: 220,
      totalRevenueGenerated: 480,
      status: 'COMPLETED',
      vicinityDistanceKm: 0.35,
      acceptedAt: '11:23 AM'
    }
  ];

  // Map of vendor IDs to their live vicinity order intake toggle
  private vendorIntakeState: Record<string, {
    isTakingOrders: boolean;
    homeCollection: boolean;
    expressDeliveryMinutes: number;
    etaMinutes: number;
    discountPercent: number;
    note: string;
  }> = {
    'lab-apex': {
      isTakingOrders: true,
      homeCollection: true,
      expressDeliveryMinutes: 0,
      etaMinutes: 25,
      discountPercent: 15,
      note: 'Phlebotomist available for 25-min OPD courier pickup or patient walk-in'
    },
    'lab-suraksha': {
      isTakingOrders: true,
      homeCollection: false,
      expressDeliveryMinutes: 0,
      etaMinutes: 45,
      discountPercent: 10,
      note: 'Ultrasound slots available immediately on Vidyanagar Circle'
    },
    'lab-district': {
      isTakingOrders: true,
      homeCollection: false,
      expressDeliveryMinutes: 0,
      etaMinutes: 60,
      discountPercent: 50,
      note: 'Government subsidized referral pricing'
    },
    'pharm-inhouse': {
      isTakingOrders: true,
      homeCollection: false,
      expressDeliveryMinutes: 5,
      etaMinutes: 5,
      discountPercent: 100,
      note: 'Ground floor hospital dispensary (Free under JSSK)'
    },
    'pharm-janaushadhi': {
      isTakingOrders: true,
      homeCollection: true,
      expressDeliveryMinutes: 15,
      etaMinutes: 15,
      discountPercent: 70,
      note: '350m away • 70% cheaper Jan Aushadhi certified generics • Express counter delivery'
    },
    'pharm-medplus': {
      isTakingOrders: true,
      homeCollection: true,
      expressDeliveryMinutes: 20,
      etaMinutes: 20,
      discountPercent: 15,
      note: '24-hour retail chemist on Station Road'
    }
  };

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  setVicinityRadius(radiusKm: number) {
    this.activeRadiusKm = radiusKm;
    this.notify();
  }

  getVicinityRadius(): number {
    return this.activeRadiusKm;
  }

  // Check if a vendor is currently taking orders in the vicinity
  isVendorTakingOrders(vendorId: string): boolean {
    return this.vendorIntakeState[vendorId]?.isTakingOrders ?? true;
  }

  getVendorIntakeDetails(vendorId: string) {
    return this.vendorIntakeState[vendorId] || {
      isTakingOrders: true,
      homeCollection: true,
      expressDeliveryMinutes: 20,
      etaMinutes: 30,
      discountPercent: 15,
      note: 'Online and connected via ONDC Vicinity Node'
    };
  }

  // Toggle order intake state for a vendor (e.g. Apex Lab or Jan Aushadhi chemist)
  toggleVendorIntake(vendorId: string, isTakingOrders: boolean, note?: string) {
    if (!this.vendorIntakeState[vendorId]) {
      this.vendorIntakeState[vendorId] = {
        isTakingOrders,
        homeCollection: true,
        expressDeliveryMinutes: 20,
        etaMinutes: 30,
        discountPercent: 15,
        note: note || (isTakingOrders ? 'Active in vicinity' : 'Temporarily paused')
      };
    } else {
      this.vendorIntakeState[vendorId].isTakingOrders = isTakingOrders;
      if (note) this.vendorIntakeState[vendorId].note = note;
    }

    integrationBackbone.logEvent({
      sourceModule: 'DOCTOR_STATION',
      targetModule: 'PATHOLOGY_LAB',
      eventType: 'VICINITY_INTAKE_TOGGLED',
      title: 'Vicinity Order Intake Status Update',
      details: `Vendor ${vendorId} updated vicinity order taking status: ${isTakingOrders ? 'OPEN FOR ORDERS' : 'PAUSED'}`,
      status: 'SUCCESS'
    });

    this.notify();
  }

  // Get all active labs in the specified radius that are taking orders
  getVicinityLabs(radiusKm: number = this.activeRadiusKm): Array<LabPartner & { distanceKm: number; isConnected: boolean; intakeInfo: any }> {
    const allLabs = opdStore.getLabPartners();
    
    return allLabs.map(lab => {
      // Calculate or parse distance
      let distKm = 2.0;
      if (lab.id === 'lab-apex') distKm = 1.2;
      else if (lab.id === 'lab-suraksha') distKm = 1.8;
      else if (lab.id === 'lab-district') distKm = 4.2;
      else distKm = 2.5;

      const intakeInfo = this.getVendorIntakeDetails(lab.id);

      return {
        ...lab,
        distanceKm: distKm,
        isConnected: intakeInfo.isTakingOrders,
        intakeInfo
      };
    }).filter(lab => lab.distanceKm <= radiusKm);
  }

  // Get all active pharmacies in the specified radius that are taking orders
  getVicinityPharmacies(radiusKm: number = this.activeRadiusKm): Array<PharmacyPartner & { distanceKm: number; isConnected: boolean; intakeInfo: any }> {
    const allPharms = opdStore.getPharmacyPartners();

    return allPharms.map(pharm => {
      let distKm = 1.0;
      if (pharm.id === 'pharm-inhouse') distKm = 0.05;
      else if (pharm.id === 'pharm-janaushadhi') distKm = 0.35;
      else if (pharm.id === 'pharm-medplus') distKm = 1.2;
      else distKm = 2.0;

      const intakeInfo = this.getVendorIntakeDetails(pharm.id);

      return {
        ...pharm,
        distanceKm: distKm,
        isConnected: intakeInfo.isTakingOrders,
        intakeInfo
      };
    }).filter(pharm => pharm.distanceKm <= radiusKm);
  }

  // Broadcast an order from a doctor to vicinity shops
  broadcastDoctorOrder(payload: {
    doctorId: string;
    doctorName: string;
    clinicRoom: string;
    patientId: string;
    patientName: string;
    patientPhone: string;
    category: 'LAB' | 'PHARMACY';
    items: Array<{ name: string; price: number; genericName?: string }>;
    targetPartnerId?: string;
  }): VicinityOrderBroadcast {
    const totalValue = payload.items.reduce((sum, item) => sum + item.price, 0);

    const newBroadcast: VicinityOrderBroadcast = {
      id: `v-bcast-${Date.now()}`,
      broadcastAt: 'Just now',
      doctorId: payload.doctorId,
      doctorName: payload.doctorName,
      clinicRoom: payload.clinicRoom,
      patientId: payload.patientId,
      patientName: payload.patientName,
      patientPhone: payload.patientPhone,
      category: payload.category,
      items: payload.items,
      totalValue,
      targetPartnerId: payload.targetPartnerId,
      status: payload.targetPartnerId ? 'ACCEPTED' : 'BROADCASTING',
      radiusKm: this.activeRadiusKm
    };

    if (payload.targetPartnerId) {
      if (payload.category === 'LAB') {
        const lab = opdStore.getLabPartners().find(l => l.id === payload.targetPartnerId);
        if (lab) {
          newBroadcast.acceptedByPartnerId = lab.id;
          newBroadcast.acceptedByPartnerName = lab.name;
        }
      } else {
        const pharm = opdStore.getPharmacyPartners().find(p => p.id === payload.targetPartnerId);
        if (pharm) {
          newBroadcast.acceptedByPartnerId = pharm.id;
          newBroadcast.acceptedByPartnerName = pharm.name;
        }
      }
    }

    this.activeBroadcasts.unshift(newBroadcast);

    // Also register in doctor revenue ledger
    this.recordDoctorGeneratedRevenue({
      orderId: `ORD-${Date.now().toString().slice(-4)}`,
      doctorId: payload.doctorId,
      doctorName: payload.doctorName,
      doctorSpecialty: payload.doctorId.includes('anita') ? 'Senior Consultant OB/GYN' : 'Consultant Physician',
      doctorRoom: payload.clinicRoom,
      patientId: payload.patientId,
      patientName: payload.patientName,
      patientPhone: payload.patientPhone,
      tokenNumber: Math.floor(Math.random() * 10) + 1,
      category: payload.category,
      labPartnerId: payload.category === 'LAB' ? payload.targetPartnerId : undefined,
      labPartnerName: payload.category === 'LAB' ? newBroadcast.acceptedByPartnerName : undefined,
      labItems: payload.category === 'LAB' ? payload.items.map(i => i.name) : undefined,
      labRevenue: payload.category === 'LAB' ? totalValue : 0,
      pharmacyPartnerId: payload.category === 'PHARMACY' ? payload.targetPartnerId : undefined,
      pharmacyPartnerName: payload.category === 'PHARMACY' ? newBroadcast.acceptedByPartnerName : undefined,
      pharmacyItems: payload.category === 'PHARMACY' ? payload.items.map(i => i.name) : undefined,
      pharmacyRevenue: payload.category === 'PHARMACY' ? totalValue : 0,
      patientSavingsFromGeneric: payload.category === 'PHARMACY' ? Math.round(totalValue * 1.8) : 0,
      totalRevenueGenerated: totalValue,
      status: payload.targetPartnerId ? 'ACCEPTED_BY_VENDOR' : 'DISPATCHED',
      vicinityDistanceKm: payload.category === 'PHARMACY' ? 0.35 : 1.2
    });

    integrationBackbone.logEvent({
      sourceModule: 'DOCTOR_STATION',
      targetModule: payload.category === 'LAB' ? 'PATHOLOGY_LAB' : 'PHARMACY_HUB',
      eventType: payload.category === 'LAB' ? 'LAB_REQUISITION_RECEIVED' : 'PRESCRIPTION_DISPATCHED',
      title: `Vicinity Order Dispatched by ${payload.doctorName}`,
      details: `Order created by ${payload.doctorName} dispatched to vicinity network (Value: ₹${totalValue})`,
      patientId: payload.patientId,
      patientName: payload.patientName,
      doctorName: payload.doctorName,
      status: 'SUCCESS'
    });

    this.notify();
    return newBroadcast;
  }

  // Accept a broadcasted order (called by a vendor shop like Apex Lab or Jan Aushadhi Chemist)
  acceptBroadcastOrder(broadcastId: string, partnerId: string, partnerName: string) {
    const bcast = this.activeBroadcasts.find(b => b.id === broadcastId);
    if (bcast) {
      bcast.status = 'ACCEPTED';
      bcast.acceptedByPartnerId = partnerId;
      bcast.acceptedByPartnerName = partnerName;

      // Update corresponding revenue record
      const rev = this.revenueRecords.find(r => r.patientId === bcast.patientId);
      if (rev) {
        rev.status = 'ACCEPTED_BY_VENDOR';
        if (bcast.category === 'LAB') {
          rev.labPartnerId = partnerId;
          rev.labPartnerName = partnerName;
        } else {
          rev.pharmacyPartnerId = partnerId;
          rev.pharmacyPartnerName = partnerName;
        }
      }

      integrationBackbone.logEvent({
        sourceModule: bcast.category === 'LAB' ? 'PATHOLOGY_LAB' : 'PHARMACY_HUB',
        targetModule: 'DOCTOR_STATION',
        eventType: 'VICINITY_ORDER_ACCEPTED',
        title: 'Vicinity Order Accepted by Partner',
        details: `Vicinity partner ${partnerName} accepted order from ${bcast.doctorName} (Value: ₹${bcast.totalValue})`,
        patientId: bcast.patientId,
        patientName: bcast.patientName,
        doctorName: bcast.doctorName,
        status: 'SUCCESS'
      });

      this.notify();
    }
  }

  // Record revenue created by doctor for external shops
  recordDoctorGeneratedRevenue(record: Omit<DoctorRevenueRecord, 'id' | 'timestamp'>) {
    const newRecord: DoctorRevenueRecord = {
      id: `REV-2026-${(this.revenueRecords.length + 1).toString().padStart(3, '0')}`,
      timestamp: 'Just now',
      ...record
    };
    this.revenueRecords.unshift(newRecord);
    this.notify();
  }

  // Get all revenue records (or filtered by doctor)
  getRevenueRecords(doctorId?: string): DoctorRevenueRecord[] {
    if (!doctorId) return this.revenueRecords;
    return this.revenueRecords.filter(r => r.doctorId === doctorId);
  }

  // Get aggregated doctor revenue metrics
  getDoctorRevenueSummary(doctorId?: string) {
    const records = this.getRevenueRecords(doctorId);
    
    const totalRevenue = records.reduce((sum, r) => sum + r.totalRevenueGenerated, 0);
    const labRevenue = records.reduce((sum, r) => sum + r.labRevenue, 0);
    const pharmacyRevenue = records.reduce((sum, r) => sum + r.pharmacyRevenue, 0);
    const totalPatientSavings = records.reduce((sum, r) => sum + r.patientSavingsFromGeneric, 0);
    const totalOrdersCount = records.length;
    
    // Revenue breakdown by partner shop
    const shopBreakdown: Record<string, { name: string; revenue: number; ordersCount: number; category: string }> = {};
    
    records.forEach(r => {
      if (r.labPartnerId && r.labPartnerName) {
        if (!shopBreakdown[r.labPartnerId]) {
          shopBreakdown[r.labPartnerId] = {
            name: r.labPartnerName,
            revenue: 0,
            ordersCount: 0,
            category: 'Diagnostic Lab'
          };
        }
        shopBreakdown[r.labPartnerId].revenue += r.labRevenue;
        shopBreakdown[r.labPartnerId].ordersCount += 1;
      }

      if (r.pharmacyPartnerId && r.pharmacyPartnerName) {
        if (!shopBreakdown[r.pharmacyPartnerId]) {
          shopBreakdown[r.pharmacyPartnerId] = {
            name: r.pharmacyPartnerName,
            revenue: 0,
            ordersCount: 0,
            category: 'Pharmacy'
          };
        }
        shopBreakdown[r.pharmacyPartnerId].revenue += r.pharmacyRevenue;
        shopBreakdown[r.pharmacyPartnerId].ordersCount += 1;
      }
    });

    const topBeneficiaries = Object.values(shopBreakdown).sort((a, b) => b.revenue - a.revenue);

    return {
      totalRevenue,
      labRevenue,
      pharmacyRevenue,
      totalPatientSavings,
      totalOrdersCount,
      averageRevenuePerConsultation: totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0,
      topBeneficiaries
    };
  }

  getActiveBroadcasts(): VicinityOrderBroadcast[] {
    return this.activeBroadcasts;
  }
}

export const vicinityRevenueService = new VicinityRevenueService();
