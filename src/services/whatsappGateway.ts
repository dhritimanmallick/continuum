/**
 * App-side WhatsApp gateway. Every outgoing WhatsApp message in the app goes through
 * deliverWhatsApp(): it shows on the patient's thread at once as "sending", then the server
 * sends it through the provider (Gupshup) and takes the per-message fee from the OPD's credit.
 */
import { apiUrl } from './apiBase';
import { WhatsAppAccount } from './whatsappPricing';

export const FACILITY = { id: 'opd-st-anne-mch', name: 'St. Anne Mother & Child Hospital OPD' };

type Listener = (a: WhatsAppAccount | null) => void;
let current: WhatsAppAccount | null = null;
let lastError: string | null = null;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach(l => l(current));

export const whatsappAccount = {
  get: () => current,
  lastError: () => lastError,
  subscribe(l: Listener) { listeners.add(l); return () => { listeners.delete(l); }; },
  async refresh(): Promise<WhatsAppAccount | null> {
    try {
      const r = await fetch(apiUrl(`/api/whatsapp/account?facilityId=${FACILITY.id}&facilityName=${encodeURIComponent(FACILITY.name)}`));
      if (r.ok) { current = await r.json(); emit(); }
    } catch { /* offline: keep last known */ }
    return current;
  },
  async topUp(amount: number): Promise<{ ok: boolean; error?: string }> {
    try {
      const r = await fetch(apiUrl('/api/whatsapp/topup'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facilityId: FACILITY.id, facilityName: FACILITY.name, amount }),
      });
      const b = await r.json();
      if (b.account) { current = b.account; emit(); }
      return { ok: !!b.ok, error: b.error };
    } catch (e: any) { return { ok: false, error: e?.message || 'network error' }; }
  },
};

export interface DeliverResult { ok: boolean; reason?: 'insufficient_credit' | 'failed' | 'offline'; message?: string }

/**
 * Send one WhatsApp message to a patient. `msg` is the object already (or about to be) shown on
 * the patient's thread; its delivery fields are updated in place, then `onChange` is called.
 */
export async function deliverWhatsApp(
  patient: { name: string; mobile: string },
  msg: { text: string; delivered?: boolean; deliveryStatus?: string; deliveryNote?: string; charge?: number },
  onChange: () => void,
): Promise<DeliverResult> {
  msg.delivered = false;
  msg.deliveryStatus = 'sending';
  onChange();
  try {
    const r = await fetch(apiUrl('/api/whatsapp/send'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        facilityId: FACILITY.id, facilityName: FACILITY.name,
        to: patient.mobile, recipientName: patient.name.split(' ')[0], text: msg.text,
      }),
    });
    const b = await r.json().catch(() => ({}));
    if (b.account) { current = b.account; emit(); }
    if (r.status === 402) {
      msg.deliveryStatus = 'not_sent';
      msg.deliveryNote = 'Not sent: WhatsApp credit used up. Top up under WhatsApp & Credits.';
      lastError = msg.deliveryNote;
      onChange();
      return { ok: false, reason: 'insufficient_credit', message: msg.deliveryNote };
    }
    if (!b.ok) {
      msg.deliveryStatus = 'failed';
      msg.deliveryNote = `Not sent (${b.error || 'provider error'}); no fee charged.`;
      onChange();
      return { ok: false, reason: 'failed', message: msg.deliveryNote };
    }
    msg.delivered = true;
    msg.deliveryStatus = 'sent';
    msg.charge = b.charged;
    msg.deliveryNote = undefined;
    lastError = null;
    onChange();
    return { ok: true };
  } catch {
    msg.deliveryStatus = 'failed';
    msg.deliveryNote = 'Not sent: no connection. Try again when online.';
    onChange();
    return { ok: false, reason: 'offline', message: msg.deliveryNote };
  }
}
