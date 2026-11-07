// Independent boundary test of Continuum's 28 care-gap rules.
// Spec used: NOT_DUE before window start; DUE from start through end + grace (overdue_after);
// OVERDUE after end + grace. Conditional rules only fire when their condition flag is present.
import { INITIAL_RULES, runRuleSimulation } from '../src/services/rulesEngine.ts';

type Row = { id: string; cat: string; checks: number; pass: number; issues: string[] };
const rows: Row[] = [];

const weeksOf = (r: any, key: 'start' | 'end') => {
  const t = r.trigger;
  if (key === 'start') return t.start_weeks ?? (t.days !== undefined ? t.days / 7 : 0);
  return t.end_weeks ?? t.start_weeks ?? (t.days !== undefined ? t.days / 7 : 0);
};
const graceWeeks = (r: any) => (r.overdue_after.weeks ?? 0) + (r.overdue_after.days ?? 0) / 7;

const flagsFor = (r: any) =>
  r.trigger.condition === 'rh_negative' ? ['Rh negative'] :
  r.trigger.condition === 'flagged_small_or_high_risk' ? ['Small for dates'] :
  r.trigger.condition === 'gdm_history' ? ['GDM history'] : [];

for (const r of INITIAL_RULES as any[]) {
  const row: Row = { id: r.rule_id, cat: r.category, checks: 0, pass: 0, issues: [] };
  const s = weeksOf(r, 'start'), e = weeksOf(r, 'end'), g = graceWeeks(r);
  const probes: [number, string][] = [
    [Math.max(s - 1, 0), s - 1 >= 0 ? 'NOT_DUE' : ''],
    [s, 'DUE'],
    [e, 'DUE'],
    [e + g, 'DUE'],
    [e + g + 1, 'OVERDUE'],
  ].filter(p => p[1]) as [number, string][];

  const isPreg = r.category === 'antenatal' || r.category === 'foetal';
  const isMother = r.category === 'postnatal';
  for (const [w, expected] of probes) {
    const input: any = isPreg ? { patientType: 'pregnancy', gestationalAgeWeeks: w, flags: flagsFor(r) }
      : isMother ? { patientType: 'mother', postpartumDays: Math.round(w * 7), flags: flagsFor(r) }
      : { patientType: 'child', childAgeWeeks: w, flags: flagsFor(r) };
    const out = runRuleSimulation(input).find(x => x.ruleId === r.rule_id);
    const got = out ? out.status : 'NOT_EVALUATED';
    row.checks++;
    if (got === expected) row.pass++;
    else row.issues.push(`at ${+w.toFixed(2)}w expected ${expected}, got ${got}`);
  }
  // Conditional rules must stay silent without their flag
  if (r.trigger.condition) {
    row.checks++;
    const input: any = isPreg ? { patientType: 'pregnancy', gestationalAgeWeeks: e + g + 1, flags: [] }
      : isMother ? { patientType: 'mother', postpartumDays: 70, flags: [] } : { patientType: 'child', childAgeWeeks: e + 1, flags: [] };
    const out = runRuleSimulation(input).find(x => x.ruleId === r.rule_id);
    if (!out) row.pass++; else row.issues.push(`fires without condition "${r.trigger.condition}" (${out.status})`);
  }
  // Closing: recorded milestone must close the gap
  row.checks++;
  const closeInput: any = isPreg ? { patientType: 'pregnancy', gestationalAgeWeeks: e + g + 1, flags: flagsFor(r), recordedMilestones: [r.rule_id] }
    : isMother ? { patientType: 'mother', postpartumDays: 70, flags: flagsFor(r), recordedMilestones: [r.rule_id] }
    : { patientType: 'child', childAgeWeeks: e + g + 1, flags: flagsFor(r), recordedMilestones: [r.rule_id] };
  const c = runRuleSimulation(closeInput).find(x => x.ruleId === r.rule_id);
  if (c?.status === 'COMPLETED') row.pass++; else row.issues.push(`recorded action does not close gap (${c?.status ?? 'NOT_EVALUATED'})`);
  rows.push(row);
}

const byCat: Record<string, { rules: number; clean: number; checks: number; pass: number }> = {};
for (const r of rows) {
  byCat[r.cat] ??= { rules: 0, clean: 0, checks: 0, pass: 0 };
  byCat[r.cat].rules++; byCat[r.cat].checks += r.checks; byCat[r.cat].pass += r.pass;
  if (!r.issues.length) byCat[r.cat].clean++;
}
console.log(JSON.stringify({ byCat, total: {
  rules: rows.length, clean: rows.filter(r => !r.issues.length).length,
  checks: rows.reduce((a, r) => a + r.checks, 0), pass: rows.reduce((a, r) => a + r.pass, 0) } }, null, 1));
for (const r of rows) if (r.issues.length) console.log(r.id, '|', r.issues.join('; '));

// Exit non-zero if any check fails, so this can gate rule changes.
if (rows.some(r => r.issues.length)) process.exit(1);
