/**
 * Care gaps for front-desk nudging.
 * Derived from the records the OPD already holds: lab referrals the patient has not
 * given a sample for (or whose report is ready to review), pharmacy orders not yet
 * collected, missed follow-ups and due/overdue vaccinations. Nothing here is a clinical
 * judgement: each gap states what was ordered or scheduled and that it has not happened.
 */
import { OpdPatient } from '../types';
import { opdStore } from './opdStore';
import { deliverWhatsApp, DeliverResult } from './whatsappGateway';
import { runRuleSimulation, ruleWindowDays, INITIAL_RULES } from './rulesEngine';

export type NudgeCategory = 'TESTING' | 'PHARMACY' | 'ADHERENCE';

export interface CareGapNudge {
  key: string;               // stable id for this gap, used to record that a nudge went out
  patient: OpdPatient;
  category: NudgeCategory;
  title: string;             // what is due
  reason: string;            // plain-language reason shown to desk staff
  since?: string;            // when it was ordered / scheduled / due
  urgent: boolean;
  message: string;           // WhatsApp text in the patient's preferred language
  ruleId?: string;           // set when the gap comes from the care-schedule rule table
}

type Lang = 'English' | 'Hindi' | 'Bengali';

const T: Record<string, Record<Lang, (name: string, item: string, extra: string) => string>> = {
  test: {
    English: (n, i, x) => `Hello ${n}, this is St. Anne Hospital. Your doctor has asked for ${i}. Please visit the lab${x} to give your sample. Reply CALL if you need help.`,
    Hindi: (n, i, x) => `नमस्ते ${n}, यह सेंट ऐनी अस्पताल से संदेश है। आपके डॉक्टर ने ${i} जांच लिखी है। कृपया सैंपल देने के लिए लैब${x} आएं। मदद चाहिए तो CALL लिखें।`,
    Bengali: (n, i, x) => `নমস্কার ${n}, সেন্ট অ্যান হাসপাতাল থেকে বলছি। আপনার ডাক্তার ${i} পরীক্ষা করাতে বলেছেন। নমুনা দিতে অনুগ্রহ করে ল্যাবে${x} আসুন। সাহায্য লাগলে CALL লিখুন।`,
  },
  report: {
    English: (n, i) => `Hello ${n}, your ${i} report is ready at St. Anne Hospital. Please book a visit so your doctor can go through it with you.`,
    Hindi: (n, i) => `नमस्ते ${n}, सेंट ऐनी अस्पताल में आपकी ${i} रिपोर्ट तैयार है। कृपया डॉक्टर से रिपोर्ट दिखाने के लिए समय लें।`,
    Bengali: (n, i) => `নমস্কার ${n}, সেন্ট অ্যান হাসপাতালে আপনার ${i} রিপোর্ট তৈরি। ডাক্তারকে রিপোর্ট দেখাতে অনুগ্রহ করে একটি সময় নিন।`,
  },
  pickup: {
    English: (n, i, x) => `Hello ${n}, your medicines (${i}) are ready for pickup at ${x}. Please collect them so you do not miss a dose.`,
    Hindi: (n, i, x) => `नमस्ते ${n}, आपकी दवाइयां (${i}) ${x} पर तैयार हैं। कृपया इन्हें ले लें ताकि कोई खुराक न छूटे।`,
    Bengali: (n, i, x) => `নমস্কার ${n}, আপনার ওষুধ (${i}) ${x}-এ তৈরি আছে। কোনো ডোজ যেন বাদ না যায়, অনুগ্রহ করে সংগ্রহ করুন।`,
  },
  pharmacy: {
    English: (n, i, x) => `Hello ${n}, your prescription (${i}) has been sent to ${x}. Please visit the pharmacy to get your medicines.`,
    Hindi: (n, i, x) => `नमस्ते ${n}, आपका पर्चा (${i}) ${x} को भेजा गया है। कृपया दवाइयां लेने फार्मेसी जाएं।`,
    Bengali: (n, i, x) => `নমস্কার ${n}, আপনার প্রেসক্রিপশন (${i}) ${x}-এ পাঠানো হয়েছে। ওষুধ নিতে অনুগ্রহ করে ফার্মেসিতে যান।`,
  },
  followup: {
    English: (n, i, x) => `Hello ${n}, your follow-up visit at St. Anne Hospital${x} is pending. ${i ? i + ' ' : ''}Reply YES to book a slot.`,
    Hindi: (n, i, x) => `नमस्ते ${n}, सेंट ऐनी अस्पताल में आपकी फॉलो-अप विज़िट${x} बाकी है। ${i ? i + ' ' : ''}समय बुक करने के लिए YES लिखें।`,
    Bengali: (n, i, x) => `নমস্কার ${n}, সেন্ট অ্যান হাসপাতালে আপনার ফলো-আপ ভিজিট${x} বাকি আছে। ${i ? i + ' ' : ''}সময় বুক করতে YES লিখুন।`,
  },
  vaccine: {
    English: (n, i, x) => `Hello, this is St. Anne Hospital. ${n}'s ${i} vaccination is ${x}. Please bring the MCP card when you visit.`,
    Hindi: (n, i, x) => `नमस्ते, सेंट ऐनी अस्पताल से संदेश। ${n} का ${i} टीका ${x === 'overdue' ? 'छूट गया है' : 'लगना है'}। आते समय MCP कार्ड साथ लाएं।`,
    Bengali: (n, i, x) => `নমস্কার, সেন্ট অ্যান হাসপাতাল থেকে বলছি। ${n}-এর ${i} টিকা ${x === 'overdue' ? 'বাকি পড়ে আছে' : 'দেওয়ার সময় হয়েছে'}। আসার সময় MCP কার্ড সঙ্গে আনুন।`,
  },
};

const SCHEDULE: Record<Lang, (name: string, item: string, when: string) => string> = {
  English: (n, i, w) => `Hello ${n}, as per your care schedule your ${i} is due (${w}). Reply YES and we will book it for you.`,
  Hindi: (n, i, w) => `नमस्ते ${n}, आपकी देखभाल अनुसूची के अनुसार आपका ${i} (${w}) होना है। बुक करने के लिए YES लिखें।`,
  Bengali: (n, i, w) => `নমস্কার ${n}, আপনার যত্নের সময়সূচি অনুযায়ী আপনার ${i} (${w}) করানোর সময় হয়েছে। বুক করতে YES লিখুন।`,
};

// Evidence that a scheduled item is already ordered or done (then the order nudge or the record covers it)
const EVIDENCE: Record<string, RegExp> = {
  A2: /CBC|blood group|VDRL|HIV|HBsAg|antenatal profile/i,
  A7: /glucose|OGTT|GTT/i, A8: /CBC|ha?emoglobin|\bHb\b/i, A9: /antibody|ICT|coombs/i,
  F1: /scan|ultrasound|USG/i, F2: /scan|ultrasound|USG|nuchal|NT/i, F3: /anomaly|TIFFA|level.?II|ultrasound/i,
  F4: /growth|doppler|biometry/i, F5: /growth|doppler|biometry/i, P4: /glucose|OGTT|GTT/i,
};

/** Items due from the clinic's care-schedule rules for this patient (pregnancy week / days after delivery). */
function scheduleGaps(p: OpdPatient, L: Lang, nm: string): CareGapNudge[] {
  let input: Parameters<typeof runRuleSimulation>[0] | null = null;
  let now = 0;
  const flags = [...(p.pregnancyDetails?.clinicalFlags || [])];
  if (p.isPregnant && p.pregnancyDetails?.gestationalAgeWeeks) {
    now = p.pregnancyDetails.gestationalAgeWeeks * 7;
    input = { patientType: 'pregnancy', gestationalAgeWeeks: p.pregnancyDetails.gestationalAgeWeeks, flags };
  } else if (p.postnatalDetails?.postpartumDay !== undefined) {
    now = p.postnatalDetails.postpartumDay;
    if (p.postnatalDetails.hadGdm) flags.push('GDM history');
    input = { patientType: 'mother', postpartumDays: p.postnatalDetails.postpartumDay, flags };
  }
  if (!input) return [];
  const orders = [...(p.labReferrals || []).map(r => r.testName), ...(p.labOrders || []).map(o => o.testName)].join(' | ');
  return runRuleSimulation(input, INITIAL_RULES)
    .filter(r => r.status === 'DUE' || r.status === 'OVERDUE')
    .filter(r => {
      // only recent overdue items: older windows are assumed handled before the patient joined
      const rule = INITIAL_RULES.find(x => x.rule_id === r.ruleId)!;
      const { end, grace } = ruleWindowDays(rule);
      return r.status === 'DUE' || now - (end + grace) <= 28;
    })
    .filter(r => !(EVIDENCE[r.ruleId] && EVIDENCE[r.ruleId].test(orders)))
    .map(r => {
      const rule = INITIAL_RULES.find(x => x.rule_id === r.ruleId)!;
      const test = /test|scan|screening/.test(rule.required_action);
      return {
        key: `rule-${p.id}-${r.ruleId}`, patient: p, category: test ? 'TESTING' as const : 'ADHERENCE' as const,
        title: rule.name, ruleId: r.ruleId,
        reason: r.plainReason, since: r.expectedWindow, urgent: r.status === 'OVERDUE',
        message: SCHEDULE[L](nm, rule.name.replace(/\s*\(.*\)\s*/, ' ').trim(), r.expectedWindow),
      };
    });
}

const firstName = (p: OpdPatient) => p.name.split(' ')[0];
const lang = (p: OpdPatient): Lang => (p.preferredLanguage === 'Hindi' || p.preferredLanguage === 'Bengali' ? p.preferredLanguage : 'English');

export function getCareGapNudges(patients: OpdPatient[]): CareGapNudge[] {
  const out: CareGapNudge[] = [];
  for (const p of patients) {
    const L = lang(p);
    const nm = p.isNewborn ? p.name : firstName(p);

    // SCHEDULE: what the care-schedule rules say is due now (not yet ordered or done)
    out.push(...scheduleGaps(p, L, nm));

    // TESTING: ordered tests the patient has not given a sample for; reports ready to review
    for (const r of p.labReferrals || []) {
      const s = String(r.status || '').toUpperCase();
      if (s === 'REQUESTED') {
        out.push({
          key: `lab-${r.id}`, patient: p, category: 'TESTING', title: r.testName,
          reason: `Ordered${r.requestedBy ? ` by ${r.requestedBy}` : ''}; sample not yet given.`,
          since: r.requestedAt, urgent: /urgent|stat/i.test(r.priority || ''),
          message: T.test[L](nm, r.testName, ''),
        });
      } else if (s === 'REPORT READY' && !r.reviewedByDoctor) {
        out.push({
          key: `report-${r.id}`, patient: p, category: 'TESTING', title: `${r.testName}: report ready`,
          reason: 'Report released; patient has not come back for the doctor to review it.',
          since: r.releasedAt, urgent: false,
          message: T.report[L](nm, r.testName, ''),
        });
      }
    }

    // PHARMACY: prescriptions not yet collected
    for (const o of p.pharmacyOrders || []) {
      const meds = (o.medicines || []).map(m => m.medicineName.split(' ').slice(0, 2).join(' ')).slice(0, 2).join(', ') || 'prescribed medicines';
      if (o.status === 'READY_FOR_PICKUP') {
        out.push({
          key: `rx-${o.id}`, patient: p, category: 'PHARMACY', title: `Medicines ready, not collected`,
          reason: `${meds} packed at ${o.pharmacyName}; not yet dispensed to the patient.`,
          since: o.prescribedAt, urgent: false,
          message: T.pickup[L](nm, meds, o.pharmacyName),
        });
      } else if (o.status === 'REFERRED') {
        out.push({
          key: `rx-${o.id}`, patient: p, category: 'PHARMACY', title: 'Prescription not yet taken to pharmacy',
          reason: `${meds} sent to ${o.pharmacyName}; patient has not visited.`,
          since: o.prescribedAt, urgent: false,
          message: T.pharmacy[L](nm, meds, o.pharmacyName),
        });
      }
    }

    // ADHERENCE: missed follow-ups and due/overdue vaccinations
    if (p.followUpStatus === 'Overdue' || p.followUpStatus === 'Due Today' || p.followUpStatus === 'Rescheduled') {
      const instr = p.followUpInstruction ? `${p.followUpInstruction.replace(/\.$/, '')}.` : '';
      out.push({
        key: `fu-${p.id}-${p.followUpDate || ''}`, patient: p, category: 'ADHERENCE',
        title: p.followUpStatus === 'Due Today' ? 'Follow-up due today' : p.followUpStatus === 'Rescheduled' ? 'Rescheduled follow-up' : 'Follow-up visit missed',
        reason: `${p.followUpStatus}${p.followUpDate ? ` (${p.followUpDate})` : ''}${p.followUpInstruction ? `: ${p.followUpInstruction}` : ''}`,
        since: p.followUpDate, urgent: p.followUpStatus === 'Overdue',
        // the doctor's instruction is recorded in English, so only include it in English messages
        message: T.followup[L](nm, L === 'English' ? instr : '', p.followUpDate ? ` (${p.followUpDate})` : ''),
      });
    }
    for (const v of p.vaccinationSchedule || []) {
      if (v.status !== 'OVERDUE' && v.status !== 'DUE') continue;
      const overdue = v.status === 'OVERDUE';
      out.push({
        key: `vac-${p.id}-${v.vaccineCode}`, patient: p, category: 'ADHERENCE',
        title: `${v.vaccineName} vaccination ${overdue ? 'overdue' : 'due'}`,
        reason: `${v.recommendedAgeLabel || v.targetAge || 'Scheduled dose'}${v.dueDate ? `, due ${v.dueDate}` : ''}; not yet given.`,
        since: v.dueDate, urgent: overdue,
        message: T.vaccine[L](nm, v.vaccineName, overdue ? 'overdue' : 'due now'),
      });
    }
  }
  // urgent first, then by category
  const order: Record<NudgeCategory, number> = { TESTING: 0, PHARMACY: 1, ADHERENCE: 2 };
  return out.sort((a, b) => Number(b.urgent) - Number(a.urgent) || order[a.category] - order[b.category]);
}

/** When this gap was last nudged, if ever (read from the patient's WhatsApp log). */
export function lastNudge(n: CareGapNudge): string | null {
  const m = [...(n.patient.whatsappMessages || [])].reverse()
    .find(w => w.nudgeKey === n.key && w.deliveryStatus !== 'not_sent' && w.deliveryStatus !== 'failed');
  return m ? (m.timestamp || 'sent') : null;
}

/** Send the nudge on WhatsApp (billed to the OPD's credit) and record it on the patient's timeline. */
export async function sendNudge(n: CareGapNudge, sentBy: string): Promise<DeliverResult> {
  const p = opdStore.patients.find(x => x.id === n.patient.id);
  if (!p) return { ok: false, reason: 'failed', message: 'Patient not found' };
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msg: any = {
    id: `WA-NUDGE-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    direction: 'outgoing', type: 'care_gap', text: n.message, timestamp: time, nudgeKey: n.key,
  };
  p.whatsappMessages.push(msg);
  const r = await deliverWhatsApp(p, msg, () => opdStore.notify());
  if (r.ok) {
    p.timeline.unshift({
      id: `TL-NUDGE-${Date.now()}`, time, title: `Care-gap nudge sent on WhatsApp: ${n.title}`,
      actor: sentBy, details: `${p.preferredLanguage || 'English'} message to ${p.mobile}.`,
    });
    opdStore.notify();
  }
  return r;
}
