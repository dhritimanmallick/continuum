/**
 * Server-side WhatsApp gateway: provider adapters (Gupshup first, swappable) and the
 * per-OPD prepaid credit ledger. Mounted by server.ts under /api/whatsapp.
 *
 * Provider selection (env):
 *   WA_PROVIDER=gupshup            (default when GUPSHUP_API_KEY is set; otherwise "simulated")
 *   GUPSHUP_API_KEY=...            Gupshup account API key
 *   GUPSHUP_SOURCE=91XXXXXXXXXX    registered WhatsApp Business number (E.164, no +)
 *   GUPSHUP_APP_NAME=...           Gupshup app name
 *   WA_TEMPLATE_UPDATE_ID=...      approved utility template id: "Hello {{1}}, an update from {{2}}: {{3}}"
 *   WA_PRICE_PER_MESSAGE=0.35      fee charged to the OPD per accepted message (INR)
 *   WA_WEBHOOK_TOKEN=...           shared secret expected as ?token= on the Gupshup callback URL
 */
import fs from 'fs';
import path from 'path';
import type { Express, Request, Response } from 'express';
import {
  STARTER_CREDIT_INR, STARTER_CREDIT_DAYS, DEFAULT_PRICE_PER_MESSAGE_INR, TOP_UP_OPTIONS_INR,
  WhatsAppAccount, WhatsAppLedgerEntry,
} from '../services/whatsappPricing.ts';

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------
export interface OutgoingWhatsApp {
  to: string;             // E.164 digits, e.g. 919876543210
  text: string;           // full message text (used for session messages and as template param)
  recipientName?: string;
  facilityName?: string;
  /** true when the patient wrote to us in the last 24h, so free text is allowed */
  sessionOpen?: boolean;
}

export interface SendResult { ok: boolean; messageId?: string; status: string; error?: string }

export interface WhatsAppProvider {
  name: string;
  live: boolean;
  send(msg: OutgoingWhatsApp): Promise<SendResult>;
}

class SimulatedProvider implements WhatsAppProvider {
  name = 'Gupshup (simulated)';
  live = false;
  async send(): Promise<SendResult> {
    return { ok: true, messageId: `SIM-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, status: 'submitted' };
  }
}

class GupshupProvider implements WhatsAppProvider {
  name = 'Gupshup';
  live = true;
  constructor(private apiKey: string, private source: string, private appName: string, private templateId?: string) {}

  private async post(url: string, form: Record<string, string>): Promise<SendResult> {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { apikey: this.apiKey, 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' },
        body: new URLSearchParams(form).toString(),
        signal: AbortSignal.timeout(15000),
      });
      const body: any = await r.json().catch(() => ({}));
      if (!r.ok || body.status === 'error') {
        return { ok: false, status: 'failed', error: body.message || `HTTP ${r.status}` };
      }
      return { ok: true, messageId: body.messageId, status: body.status || 'submitted' };
    } catch (e: any) {
      return { ok: false, status: 'failed', error: e?.message || 'network error' };
    }
  }

  async send(m: OutgoingWhatsApp): Promise<SendResult> {
    // Inside the 24-hour customer-service window: free-form text.
    if (m.sessionOpen || !this.templateId) {
      return this.post('https://api.gupshup.io/wa/api/v1/msg', {
        channel: 'whatsapp',
        source: this.source,
        destination: m.to,
        'src.name': this.appName,
        message: JSON.stringify({ type: 'text', text: m.text.slice(0, 4096) }),
      });
    }
    // Business-initiated: approved utility template with three parameters.
    return this.post('https://api.gupshup.io/wa/api/v1/template/msg', {
      source: this.source,
      destination: m.to,
      'src.name': this.appName,
      template: JSON.stringify({
        id: this.templateId,
        params: [m.recipientName || 'there', m.facilityName || 'your clinic', m.text.replace(/\s+/g, ' ').slice(0, 900)],
      }),
    });
  }
}

export function makeProvider(env = process.env): WhatsAppProvider {
  const want = (env.WA_PROVIDER || (env.GUPSHUP_API_KEY ? 'gupshup' : 'simulated')).toLowerCase();
  if (want === 'gupshup' && env.GUPSHUP_API_KEY && env.GUPSHUP_SOURCE) {
    return new GupshupProvider(env.GUPSHUP_API_KEY, env.GUPSHUP_SOURCE, env.GUPSHUP_APP_NAME || 'Continuum', env.WA_TEMPLATE_UPDATE_ID);
  }
  return new SimulatedProvider();
}

// ---------------------------------------------------------------------------
// Credit ledger (JSON file; swap for the production database)
// ---------------------------------------------------------------------------
interface FacilityState {
  facilityId: string;
  facilityName: string;
  activatedAt: string;
  starterCredit: number;
  starterExpiresAt: string;
  starterExpiredLogged?: boolean;
  paidBalance: number;
  ledger: WhatsAppLedgerEntry[];
}

const DATA_FILE = path.join(process.cwd(), 'data', 'whatsapp-ledger.json');
const facilities: Record<string, FacilityState> = (() => {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return {}; }
})();
// Patients who wrote to us recently (phone -> ISO time), from the inbound webhook
const lastInbound: Record<string, string> = {};

function save() {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(facilities, null, 1));
  } catch (e) { console.warn('[WhatsApp] could not persist ledger:', (e as Error).message); }
}

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const price = () => Number(process.env.WA_PRICE_PER_MESSAGE) || DEFAULT_PRICE_PER_MESSAGE_INR;
const round2 = (n: number) => Math.round(n * 100) / 100;

function facility(facilityId: string, facilityName?: string): FacilityState {
  let f = facilities[facilityId];
  if (!f) {
    const now = new Date();
    const exp = new Date(now.getTime() + STARTER_CREDIT_DAYS * 864e5);
    f = facilities[facilityId] = {
      facilityId, facilityName: facilityName || facilityId, activatedAt: now.toISOString(),
      starterCredit: STARTER_CREDIT_INR, starterExpiresAt: exp.toISOString(), paidBalance: 0,
      ledger: [{ id: uid('LED'), at: now.toISOString(), kind: 'starter_credit', amount: STARTER_CREDIT_INR,
        note: `Starter credit, valid ${STARTER_CREDIT_DAYS} days (until ${exp.toLocaleDateString('en-IN')})` }],
    };
    save();
  }
  if (facilityName && f.facilityName !== facilityName) f.facilityName = facilityName;
  // Lapse unused starter credit after it expires
  if (!f.starterExpiredLogged && Date.now() > Date.parse(f.starterExpiresAt) && f.starterCredit > 0) {
    f.ledger.unshift({ id: uid('LED'), at: new Date().toISOString(), kind: 'starter_expired', amount: -f.starterCredit,
      note: 'Unused starter credit expired' });
    f.starterCredit = 0;
    f.starterExpiredLogged = true;
    save();
  }
  return f;
}

function account(f: FacilityState, provider: WhatsAppProvider): WhatsAppAccount {
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const msgs = f.ledger.filter(l => l.kind === 'message' && Date.parse(l.at) >= monthStart.getTime());
  const refunds = f.ledger.filter(l => l.kind === 'refund' && Date.parse(l.at) >= monthStart.getTime());
  return {
    facilityId: f.facilityId,
    facilityName: f.facilityName,
    provider: provider.name,
    mode: provider.live ? 'live' : 'simulated',
    pricePerMessage: price(),
    starterCredit: round2(f.starterCredit),
    starterExpiresAt: f.starterExpiresAt,
    paidBalance: round2(f.paidBalance),
    balance: round2(f.starterCredit + f.paidBalance),
    messagesThisMonth: msgs.length - refunds.length,
    spentThisMonth: round2(-(msgs.reduce((s, l) => s + l.amount, 0) + refunds.reduce((s, l) => s + l.amount, 0))),
    ledger: f.ledger.slice(0, 50),
  };
}

/** Take the fee from starter credit first, then the paid balance. Returns null if not enough. */
function charge(f: FacilityState, amount: number): { fromStarter: number; fromPaid: number } | null {
  if (f.starterCredit + f.paidBalance + 1e-9 < amount) return null;
  const fromStarter = round2(Math.min(f.starterCredit, amount));
  const fromPaid = round2(amount - fromStarter);
  f.starterCredit = round2(f.starterCredit - fromStarter);
  f.paidBalance = round2(f.paidBalance - fromPaid);
  return { fromStarter, fromPaid };
}

const digits = (phone: string) => {
  const d = (phone || '').replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d;
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
export function mountWhatsApp(app: Express, provider: WhatsAppProvider = makeProvider()) {
  console.log(`[WhatsApp] provider: ${provider.name}${provider.live ? ' (live)' : ''}, fee ₹${price()}/message`);

  app.get('/api/whatsapp/account', (req: Request, res: Response) => {
    const f = facility(String(req.query.facilityId || 'default'), req.query.facilityName as string | undefined);
    res.json(account(f, provider));
  });

  app.post('/api/whatsapp/send', async (req: Request, res: Response) => {
    const { facilityId = 'default', facilityName, to, text, recipientName } = req.body || {};
    if (!to || !text) return res.status(400).json({ ok: false, error: 'to and text are required' });
    const f = facility(facilityId, facilityName);
    const fee = price();
    const taken = charge(f, fee);
    if (!taken) {
      return res.status(402).json({ ok: false, error: 'insufficient_credit',
        message: 'WhatsApp credit is used up. Top up to keep sending reminders.', account: account(f, provider) });
    }
    const dest = digits(to);
    const at = new Date().toISOString();
    const entry: WhatsAppLedgerEntry = { id: uid('LED'), at, kind: 'message', amount: -fee, to: dest, status: 'sending',
      note: String(text).slice(0, 80) };
    f.ledger.unshift(entry);
    const sessionOpen = !!lastInbound[dest] && Date.now() - Date.parse(lastInbound[dest]) < 24 * 3600e3;
    const r = await provider.send({ to: dest, text: String(text), recipientName, facilityName: f.facilityName, sessionOpen });
    entry.status = r.status;
    entry.messageId = r.messageId;
    if (!r.ok) {
      // Not accepted by the provider: give the fee back
      f.starterCredit = round2(f.starterCredit + taken.fromStarter);
      f.paidBalance = round2(f.paidBalance + taken.fromPaid);
      f.ledger.unshift({ id: uid('LED'), at: new Date().toISOString(), kind: 'refund', amount: fee, to: dest,
        note: `Not sent (${r.error || 'provider error'}); fee refunded` });
    }
    save();
    res.status(r.ok ? 200 : 502).json({ ok: r.ok, messageId: r.messageId, status: r.status, error: r.error,
      charged: r.ok ? fee : 0, account: account(f, provider) });
  });

  // Top-up. In production this is called by the payment gateway's verified webhook
  // (e.g. Razorpay payment.captured); in the MVP it records a simulated UPI payment.
  app.post('/api/whatsapp/topup', (req: Request, res: Response) => {
    const { facilityId = 'default', facilityName, amount, reference } = req.body || {};
    const amt = Number(amount);
    if (!TOP_UP_OPTIONS_INR.includes(amt)) return res.status(400).json({ ok: false, error: `amount must be one of ${TOP_UP_OPTIONS_INR.join(', ')}` });
    const f = facility(facilityId, facilityName);
    f.paidBalance = round2(f.paidBalance + amt);
    f.ledger.unshift({ id: uid('LED'), at: new Date().toISOString(), kind: 'top_up', amount: amt,
      note: `Top-up${reference ? ` (${reference})` : ' (UPI, simulated in demo)'}` });
    save();
    res.json({ ok: true, account: account(f, provider) });
  });

  // Gupshup callback: delivery events and inbound messages (opens the 24h session window)
  app.post('/api/whatsapp/webhook', (req: Request, res: Response) => {
    const token = process.env.WA_WEBHOOK_TOKEN;
    if (token && req.query.token !== token) return res.sendStatus(403);
    const b = req.body || {};
    if (b.type === 'message' && b.payload?.source) {
      lastInbound[digits(b.payload.source)] = new Date().toISOString();
    } else if (b.type === 'message-event' && b.payload?.gsId) {
      for (const f of Object.values(facilities)) {
        const e = f.ledger.find(l => l.messageId === b.payload.gsId || l.messageId === b.payload.id);
        if (e) { e.status = b.payload.type || e.status; break; }
      }
      save();
    }
    res.sendStatus(200);
  });
}
