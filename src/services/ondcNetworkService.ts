import { 
  OndcNetworkNode, 
  OndcTransaction, 
  OndcOnboardingPayload, 
  LabPartner, 
  PharmacyPartner, 
  AuthUser 
} from '../types';
import { integrationBackbone } from './integrationBackbone';

export const INITIAL_ONDC_NODES: OndcNetworkNode[] = [
  {
    subscriberId: 'BAP-HOSP-STANNE-001',
    type: 'BAP',
    category: 'HOSPITAL',
    domain: 'ONDC:RET18',
    entityName: 'St. Anne Mother & Child Hospital (OPD Gateway)',
    inCharge: 'Dr. Radhika Sen (Superintendent)',
    status: 'ACTIVE',
    city: 'Hubballi-Dharwad',
    pincode: '580020',
    catalogItemsCount: 45,
    rating: 4.9,
    connectedAt: '2026-01-10T09:00:00Z',
    becknVersion: '1.1.0',
    endpointUrl: 'https://gateway.ondc.org/bap/stanne/v1'
  },
  {
    subscriberId: 'BPP-LAB-APEX-092',
    type: 'BPP',
    category: 'DIAGNOSTICS',
    domain: 'ONDC:RET18',
    entityName: 'Apex Diagnostic Centre & Advanced Path Lab',
    inCharge: 'Dr. Sudhir Shenoy, MD (Pathology)',
    status: 'ACTIVE',
    city: 'Hubballi-Dharwad',
    pincode: '580029',
    catalogItemsCount: 160,
    rating: 4.8,
    connectedAt: '2026-02-01T10:30:00Z',
    becknVersion: '1.1.0',
    endpointUrl: 'https://bpp.apexdiag.in/ondc/v1'
  },
  {
    subscriberId: 'BPP-LAB-SURAKSHA-114',
    type: 'BPP',
    category: 'DIAGNOSTICS',
    domain: 'ONDC:RET18',
    entityName: 'Suraksha Ultrasound & Diagnostic Imaging',
    inCharge: 'Dr. Veena Hegde, DMRD',
    status: 'ACTIVE',
    city: 'Hubballi-Dharwad',
    pincode: '580021',
    catalogItemsCount: 42,
    rating: 4.9,
    connectedAt: '2026-02-15T11:15:00Z',
    becknVersion: '1.1.0',
    endpointUrl: 'https://bpp.surakshaimaging.in/ondc/v1'
  },
  {
    subscriberId: 'BPP-PHARM-JANAUSHADHI-5048',
    type: 'BPP',
    category: 'PHARMACY',
    domain: 'ONDC:RET18',
    entityName: 'Pradhan Mantri Jan Aushadhi Kendra (#5048)',
    inCharge: 'Suresh Hegde, R.Ph.',
    status: 'ACTIVE',
    city: 'Hubballi-Dharwad',
    pincode: '580020',
    catalogItemsCount: 920,
    rating: 4.9,
    connectedAt: '2026-01-18T08:00:00Z',
    becknVersion: '1.1.0',
    endpointUrl: 'https://janaushadhi.gov.in/bpp/5048'
  },
  {
    subscriberId: 'BPP-PHARM-MEDPLUS-882',
    type: 'BPP',
    category: 'PHARMACY',
    domain: 'ONDC:RET18',
    entityName: 'MedPlus Pharmacy Station Road',
    inCharge: 'Priya N., R.Ph.',
    status: 'ACTIVE',
    city: 'Hubballi-Dharwad',
    pincode: '580020',
    catalogItemsCount: 3400,
    rating: 4.7,
    connectedAt: '2026-02-05T14:20:00Z',
    becknVersion: '1.1.0',
    endpointUrl: 'https://bpp.medplus.in/ondc/v1'
  }
];

export const INITIAL_ONDC_TRANSACTIONS: OndcTransaction[] = [
  {
    id: 'tx-ondc-001',
    timestamp: 'Just now',
    transactionId: 'TXN-ONDC-883492',
    action: 'confirm',
    bapId: 'BAP-HOSP-STANNE-001',
    bppId: 'BPP-LAB-APEX-092',
    vendorName: 'Apex Diagnostic Centre',
    category: 'DIAGNOSTICS',
    patientName: 'Sunita Das',
    summary: 'OGTT 75g + CBC Anemia Panel requisition confirmed via Beckn BPP',
    status: 'SUCCESS'
  },
  {
    id: 'tx-ondc-002',
    timestamp: '12 mins ago',
    transactionId: 'TXN-ONDC-883491',
    action: 'on_init',
    bapId: 'BAP-HOSP-STANNE-001',
    bppId: 'BPP-PHARM-JANAUSHADHI-5048',
    vendorName: 'PM Jan Aushadhi Kendra #5048',
    category: 'PHARMACY',
    patientName: 'Meena Roy',
    summary: 'Generic IFA + Calcium Carbonate quote acknowledged (₹145 savings)',
    status: 'SUCCESS'
  },
  {
    id: 'tx-ondc-003',
    timestamp: '35 mins ago',
    transactionId: 'TXN-ONDC-883489',
    action: 'on_search',
    bapId: 'BAP-HOSP-STANNE-001',
    bppId: 'BPP-LAB-SURAKSHA-114',
    vendorName: 'Suraksha Ultrasound',
    category: 'DIAGNOSTICS',
    patientName: 'Farida Begum',
    summary: 'Fetal Obstetric Biometry & Anomaly scan slot published',
    status: 'ACK'
  }
];

class OndcNetworkService {
  private nodes: OndcNetworkNode[] = [...INITIAL_ONDC_NODES];
  private transactions: OndcTransaction[] = [...INITIAL_ONDC_TRANSACTIONS];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.restoreFromStorage();
  }

  private restoreFromStorage() {
    try {
      const storedNodes = localStorage.getItem('vyuhaa_ondc_nodes');
      if (storedNodes) {
        this.nodes = JSON.parse(storedNodes);
      }
      const storedTx = localStorage.getItem('vyuhaa_ondc_tx');
      if (storedTx) {
        this.transactions = JSON.parse(storedTx);
      }
    } catch {
      // fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('vyuhaa_ondc_nodes', JSON.stringify(this.nodes));
      localStorage.setItem('vyuhaa_ondc_tx', JSON.stringify(this.transactions));
    } catch {
      // ignore
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(fn => fn());
  }

  getNodes(): OndcNetworkNode[] {
    return [...this.nodes];
  }

  getTransactions(): OndcTransaction[] {
    return [...this.transactions];
  }

  getNodeBySubscriberId(subId: string): OndcNetworkNode | undefined {
    return this.nodes.find(n => n.subscriberId === subId);
  }

  /**
   * Log an ONDC Beckn Protocol Transaction
   */
  logTransaction(tx: Omit<OndcTransaction, 'id' | 'timestamp'>) {
    const newTx: OndcTransaction = {
      id: `tx-ondc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      ...tx
    };
    this.transactions.unshift(newTx);
    if (this.transactions.length > 50) {
      this.transactions.pop();
    }
    this.notify();
  }

  /**
   * Onboard an interested pathology laboratory or pharmacy shop as an Add-on Vendor login
   * via the ONDC Open Network.
   */
  registerVendorShop(payload: OndcOnboardingPayload): {
    node: OndcNetworkNode;
    subscriberId: string;
    shopId: string;
    userLogin: {
      username: string;
      role: 'LAB' | 'PHARMA';
      name: string;
    };
  } {
    const slug = payload.shopName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 16);
    const randNum = Math.floor(100 + Math.random() * 900);
    const category = payload.vendorType === 'PATHOLOGY_LAB' ? 'DIAGNOSTICS' : 'PHARMACY';
    const subPrefix = payload.vendorType === 'PATHOLOGY_LAB' ? 'BPP-LAB' : 'BPP-PHARM';
    const subscriberId = `${subPrefix}-${slug.toUpperCase()}-${randNum}`;
    const shopId = payload.vendorType === 'PATHOLOGY_LAB' ? `lab-${slug}-${randNum}` : `pharm-${slug}-${randNum}`;

    // 1. Create ONDC Node
    const newNode: OndcNetworkNode = {
      subscriberId,
      type: 'BPP',
      category,
      domain: 'ONDC:RET18',
      entityName: payload.shopName,
      inCharge: payload.inChargeName,
      status: 'ACTIVE',
      city: payload.city || 'Hubballi-Dharwad',
      pincode: payload.pincode || '580020',
      catalogItemsCount: payload.vendorType === 'PATHOLOGY_LAB' ? 52 : 380,
      rating: 5.0,
      connectedAt: new Date().toISOString(),
      becknVersion: '1.1.0',
      endpointUrl: `https://bpp.${slug}.ondc-health.in/v1`,
      encryptionPublicKey: `ed25519_${Math.random().toString(36).substring(2, 15)}`
    };

    this.nodes.push(newNode);

    // 2. Log initial ONDC network event
    this.logTransaction({
      transactionId: `TXN-ONDC-REG-${randNum}`,
      action: 'on_search',
      bapId: 'BAP-HOSP-STANNE-001',
      bppId: subscriberId,
      vendorName: payload.shopName,
      category,
      patientName: 'Open Health Network Registry',
      summary: `New ${payload.vendorType === 'PATHOLOGY_LAB' ? 'Diagnostic Path Lab' : 'Pharmacy'} onboarded with published catalog`,
      status: 'SUCCESS'
    });

    integrationBackbone.logEvent({
      sourceModule: 'ADMIN_PORTAL',
      targetModule: payload.vendorType === 'PATHOLOGY_LAB' ? 'PATHOLOGY_LAB' : 'PHARMACY_HUB',
      eventType: 'VENDOR_ONBOARDED' as any,
      title: `ONDC Network Add-On Vendor Registered: ${payload.shopName}`,
      details: `${payload.shopName} successfully provisioned on ONDC Gateway (${subscriberId}). Ready for clinical requisitions and OCR deciphering.`,
      status: 'SUCCESS'
    });

    this.notify();

    return {
      node: newNode,
      subscriberId,
      shopId,
      userLogin: {
        username: payload.username,
        role: payload.vendorType === 'PATHOLOGY_LAB' ? 'LAB' : 'PHARMA',
        name: payload.inChargeName
      }
    };
  }
}

export const ondcNetworkService = new OndcNetworkService();
