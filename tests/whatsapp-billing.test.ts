/**
 * WhatsApp credit ledger: starter credit, per-message charging, running out, refunds on
 * provider failure, top-ups, and starter-credit expiry. Run: npm run test:whatsapp
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import express from 'express';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wa-'));
process.chdir(tmp);                       // ledger file goes to a throwaway folder
process.env.WA_PRICE_PER_MESSAGE = '300'; // big fee so the ₹1,000 starter credit runs out fast

let pass = 0, fail = 0;
const check = (name: string, cond: boolean, got?: unknown) => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}  (got ${JSON.stringify(got)})`); }
};

const { mountWhatsApp } = await import('../src/server/whatsapp.ts');
let providerOk = true;
const provider = { name: 'Test', live: true, send: async () => providerOk
  ? { ok: true, messageId: `T-${Math.random()}`, status: 'submitted' }
  : { ok: false, status: 'failed', error: 'number not on WhatsApp' } };

const app = express(); app.use(express.json());
mountWhatsApp(app as any, provider as any);
const server = app.listen(0);
const port = (server.address() as any).port;
const call = async (method: string, p: string, body?: unknown) => {
  const r = await fetch(`http://127.0.0.1:${port}${p}`, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, body: await r.json() as any };
};
const send = () => call('POST', '/api/whatsapp/send', { facilityId: 'opd1', to: '9845233411', text: 'Test reminder' });

console.log('WhatsApp credit ledger');
let a = (await call('GET', '/api/whatsapp/account?facilityId=opd1')).body;
check('new OPD gets ₹1,000 starter credit', a.balance === 1000 && a.starterCredit === 1000, a.balance);
const days = Math.round((Date.parse(a.starterExpiresAt) - Date.now()) / 864e5);
check('starter credit valid ~90 days', days === 90, days);

let r = await send();
check('accepted message charged the fee', r.status === 200 && r.body.charged === 300 && r.body.account.balance === 700, r.body.account?.balance);

providerOk = false;
r = await send();
check('failed send is refunded (balance unchanged)', r.status === 502 && r.body.account.balance === 700 && r.body.account.starterCredit === 700, r.body.account);
providerOk = true;

await send(); await send();               // 700 -> 400 -> 100
r = await send();
check('blocked with 402 when credit is used up', r.status === 402 && r.body.error === 'insufficient_credit', r.status);
check('balance never goes negative', r.body.account.balance === 100, r.body.account.balance);

r = await call('POST', '/api/whatsapp/topup', { facilityId: 'opd1', amount: 500 });
check('top-up adds non-expiring paid balance', r.body.account.paidBalance === 500 && r.body.account.balance === 600, r.body.account);
r = await send();
check('starter credit used before paid balance', r.body.account.starterCredit === 0 && r.body.account.paidBalance === 300, r.body.account);
r = await call('POST', '/api/whatsapp/topup', { facilityId: 'opd1', amount: 123 });
check('odd top-up amounts are rejected', r.status === 400, r.status);

// Expiry: age the starter credit of a fresh OPD
await call('GET', '/api/whatsapp/account?facilityId=opd2');
const file = path.join(tmp, 'data', 'whatsapp-ledger.json');
const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
check('ledger persisted to disk', !!saved.opd2, Object.keys(saved));
server.close();

// Re-import with an expired starter date to check it lapses
saved.opd2.starterExpiresAt = new Date(Date.now() - 864e5).toISOString();
fs.writeFileSync(file, JSON.stringify(saved));
const fresh = await import(`../src/server/whatsapp.ts?reload=${Date.now()}`);
const app2 = express(); app2.use(express.json()); fresh.mountWhatsApp(app2 as any, provider as any);
const s2 = app2.listen(0); const p2 = (s2.address() as any).port;
const exp = await (await fetch(`http://127.0.0.1:${p2}/api/whatsapp/account?facilityId=opd2`)).json() as any;
check('unused starter credit lapses after 3 months', exp.starterCredit === 0 && exp.balance === 0 && exp.ledger[0].kind === 'starter_expired', exp);
s2.close();

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
