/**
 * WhatsApp messaging is the only paid part of Continuum. The app itself is free.
 *
 * - Every OPD (facility) gets a starter credit of ₹1,000, usable for 3 months from activation.
 * - Each outgoing WhatsApp message the provider accepts is charged a flat fee per message.
 *   Failed sends are not charged.
 * - After the starter credit is used up or expires, the OPD tops up a prepaid balance.
 *   Paid top-ups do not expire.
 *
 * The server is the source of truth (it may override the per-message price with
 * WA_PRICE_PER_MESSAGE); these values are defaults and are shown in the UI.
 */
export const STARTER_CREDIT_INR = 1000;
export const STARTER_CREDIT_DAYS = 90;
export const DEFAULT_PRICE_PER_MESSAGE_INR = 0.35;
export const TOP_UP_OPTIONS_INR = [500, 1000, 2000, 5000];

export interface WhatsAppLedgerEntry {
  id: string;
  at: string;              // ISO time
  kind: 'starter_credit' | 'top_up' | 'message' | 'refund' | 'starter_expired';
  amount: number;          // + credit, − charge (INR)
  note: string;
  messageId?: string;
  to?: string;
  status?: string;
}

export interface WhatsAppAccount {
  facilityId: string;
  facilityName: string;
  provider: string;               // e.g. "Gupshup"
  mode: 'live' | 'simulated';     // live once provider keys are configured on the server
  pricePerMessage: number;
  starterCredit: number;          // remaining starter credit
  starterExpiresAt: string;       // ISO
  paidBalance: number;
  balance: number;                // starterCredit (if not expired) + paidBalance
  messagesThisMonth: number;
  spentThisMonth: number;
  ledger: WhatsAppLedgerEntry[];  // newest first (last 50)
}

export const inr = (n: number) =>
  `₹${n.toLocaleString('en-IN', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
