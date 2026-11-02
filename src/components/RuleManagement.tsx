import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  History, 
  Edit3, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Info,
  Sparkles
} from 'lucide-react';
import { CareGapRule, RuleCategory } from '../types';
import { store } from '../services/store';

interface RuleManagementProps {
  onOpenSimulator: () => void;
}

export const RuleManagement: React.FC<RuleManagementProps> = ({ onOpenSimulator }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingRule, setEditingRule] = useState<CareGapRule | null>(null);
  const [editName, setEditName] = useState('');
  const [editDisplayReason, setEditDisplayReason] = useState('');
  const [editStartWeeks, setEditStartWeeks] = useState<number>(0);
  const [editEndWeeks, setEditEndWeeks] = useState<number>(0);
  const [editOverdueWeeks, setEditOverdueWeeks] = useState<number>(2);
  const [changeReason, setChangeReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const rules = store.rules.filter(r => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    return true;
  });

  const handleStartEdit = (rule: CareGapRule) => {
    setEditingRule(rule);
    setEditName(rule.name);
    setEditDisplayReason(rule.display_reason);
    setEditStartWeeks(rule.trigger.start_weeks || 0);
    setEditEndWeeks(rule.trigger.end_weeks || 0);
    setEditOverdueWeeks(rule.overdue_after.weeks || 2);
    setChangeReason('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    setIsSaving(true);
    setTimeout(() => {
      store.updateRule(
        editingRule.rule_id,
        {
          name: editName,
          display_reason: editDisplayReason,
          trigger: {
            ...editingRule.trigger,
            start_weeks: editStartWeeks,
            end_weeks: editEndWeeks
          },
          overdue_after: {
            ...editingRule.overdue_after,
            weeks: editOverdueWeeks
          }
        },
        changeReason || 'Clinician protocol schedule review'
      );

      setIsSaving(false);
      setEditingRule(null);
    }, 500);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Care-Gap Rule Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            The rules are configuration, not hard-coded code. 28 clinician-defined draft pathways.
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Rule Simulator</span>
        </button>
      </div>

      {/* Clinical Validation Warning Banner (Section 14) */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>Configuration & Prototype Rules Notice</span>
        </div>
        <p className="text-amber-800 text-[11px] leading-relaxed">
          These 28 seeded rules represent illustrative unit protocols requiring clinical lead validation for each district facility. The system never silently overwrites clinical rules: every change automatically creates an incremental version and permanent audit trail entry.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Pathway Category:</span>
        {[
          { id: 'all', label: 'All 28 Rules' },
          { id: 'antenatal', label: 'Antenatal (10)' },
          { id: 'foetal', label: 'Foetal Scans (5)' },
          { id: 'postnatal', label: 'Postnatal (4)' },
          { id: 'newborn', label: 'Newborn (5)' },
          { id: 'child', label: 'Child Immunisation (4)' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Rule ID</th>
                <th className="py-3 px-3">Milestone / Rule Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Due Window</th>
                <th className="py-3 px-3">Overdue After</th>
                <th className="py-3 px-4">Plain-Language Display Reason</th>
                <th className="py-3 px-3">Ver.</th>
                <th className="py-3 px-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rules.map(rule => (
                <tr key={rule.rule_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-900">
                    {rule.rule_id}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block">{rule.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Target: {rule.required_action}</span>
                  </td>

                  <td className="py-3.5 px-3 capitalize">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {rule.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {rule.trigger.start_weeks !== undefined 
                      ? `${rule.trigger.start_weeks}–${rule.trigger.end_weeks} weeks`
                      : rule.trigger.days !== undefined
                      ? `Day ${rule.trigger.days}`
                      : 'Per Protocol'}
                  </td>

                  <td className="py-3.5 px-3 text-rose-700 font-bold">
                    +{rule.overdue_after.weeks || rule.overdue_after.days} {rule.overdue_after.weeks ? 'weeks' : 'days'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    &ldquo;{rule.display_reason}&rdquo;
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-slate-500">
                    v{rule.version}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleStartEdit(rule)}
                      className="p-1.5 text-teal-700 hover:bg-teal-50 rounded transition cursor-pointer inline-flex items-center gap-1 font-semibold"
                      title="Edit Rule Schedule & Reason"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Rule Modal with Versioning & Audit Trail (Section 15) */}
      {editingRule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden p-5 text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-700" />
                <span>Modify Rule: {editingRule.rule_id} (Increments to v{editingRule.version + 1})</span>
              </h3>
              <button 
                onClick={() => setEditingRule(null)}
                className="text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg text-amber-900 text-[11px]">
              <strong>Versioning Safeguard:</strong> This change will not overwrite past clinical decisions. It creates Version {editingRule.version + 1} and records your name and rationale into the hospital audit trail.
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Rule Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Start (Weeks)</label>
                  <input
                    type="number"
                    value={editStartWeeks}
                    onChange={(e) => setEditStartWeeks(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">End (Weeks)</label>
                  <input
                    type="number"
                    value={editEndWeeks}
                    onChange={(e) => setEditEndWeeks(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Overdue (Weeks)</label>
                  <input
                    type="number"
                    value={editOverdueWeeks}
                    onChange={(e) => setEditOverdueWeeks(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Plain-Language Display Reason</label>
                <input
                  type="text"
                  value={editDisplayReason}
                  onChange={(e) => setEditDisplayReason(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1 text-rose-800">
                  Mandatory Change Justification (Audit Reason):
                </label>
                <textarea
                  rows={2}
                  required
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="e.g. Updated screening interval to conform with updated state health department guidance"
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving || !changeReason.trim()}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving Version...' : `Approve & Create v${editingRule.version + 1}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
