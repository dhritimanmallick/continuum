/**
 * Care Gaps portal: the daily "who is overdue today, for what, and why" view.
 * Wires the care-gap registry screens (dashboard, worklist, lab result loop,
 * rules & simulator, outreach log, KPIs, audit) into the main app.
 */
import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ListTodo, TestTubes, Sliders, MessageSquare, BarChart3, ShieldCheck } from 'lucide-react';
import { store } from '../services/store';
import { CareGap } from '../types';
import { Dashboard } from './Dashboard';
import { Worklist } from './Worklist';
import { LaboratoryModule } from './LaboratoryModule';
import { RuleManagement } from './RuleManagement';
import { RuleSimulatorModal } from './RuleSimulatorModal';
import { MessagesView } from './MessagesView';
import { ReportsView } from './ReportsView';
import { AuditLogView } from './AuditLogView';
import { ContactModal } from './ContactModal';
import { ActionClosureModal } from './ActionClosureModal';
import { PatientProfileModal } from './PatientProfileModal';

type Tab = 'dashboard' | 'worklist' | 'lab' | 'rules' | 'messages' | 'reports' | 'audit';

export const CareGapsView: React.FC = () => {
  const [, setVersion] = useState(0);
  const [tab, setTab] = useState<Tab>('worklist');
  const [worklistFilter, setWorklistFilter] = useState('all');
  const [contactGap, setContactGap] = useState<CareGap | null>(null);
  const [closeGap, setCloseGap] = useState<CareGap | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);

  useEffect(() => store.subscribe(() => setVersion(v => v + 1)), []);

  const metrics = store.getDashboardMetrics();
  const overdue = store.careGaps.filter(g => g.status === 'OVERDUE').length;

  const openWorklist = (filter: string) => {
    setWorklistFilter(filter);
    setTab('worklist');
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'worklist', label: "Today's Worklist", icon: ListTodo, badge: overdue },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lab', label: 'Result Loop', icon: TestTubes },
    { id: 'rules', label: 'Rules & Simulator', icon: Sliders },
    { id: 'messages', label: 'Outreach Log', icon: MessageSquare },
    { id: 'reports', label: 'KPIs', icon: BarChart3 },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Care Gaps</h1>
        <p className="text-sm text-slate-600">
          Who is overdue today, for what, and why: computed from the clinic's rule table, closed only when the action is recorded.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {tabs.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => (t.id === 'worklist' ? openWorklist('all') : setTab(t.id))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                active ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {!!t.badge && (
                <span className={`text-[10px] px-1.5 rounded-full font-bold ${active ? 'bg-white/25' : 'bg-rose-100 text-rose-700'}`}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === 'dashboard' && (
        <Dashboard
          metrics={metrics}
          onNavigate={(view, filter) => {
            if (view === 'worklist') openWorklist(filter || 'all');
            else if (view === 'lab' || view === 'rules' || view === 'messages' || view === 'reports' || view === 'audit') setTab(view);
          }}
          onOpenWorklistOverdue={() => openWorklist('overdue')}
          onOpenWorklistDueToday={() => openWorklist('due_today')}
        />
      )}

      {tab === 'worklist' && (
        <Worklist
          key={worklistFilter}
          careGaps={store.careGaps}
          initialFilter={worklistFilter}
          onContactPatient={gap => setContactGap(gap)}
          onRecordAction={gap => setCloseGap(gap)}
          onViewPatientProfile={id => setProfileId(id)}
          onWaiveGap={gap => {
            const reason = window.prompt('Reason for waiving this care gap (recorded in the audit log):');
            if (reason && reason.trim()) store.waiveCareGap(gap.id, reason.trim());
          }}
        />
      )}

      {tab === 'lab' && <LaboratoryModule onViewPatientProfile={id => setProfileId(id)} />}
      {tab === 'rules' && <RuleManagement onOpenSimulator={() => setShowSimulator(true)} />}
      {tab === 'messages' && <MessagesView />}
      {tab === 'reports' && <ReportsView />}
      {tab === 'audit' && <AuditLogView />}

      {contactGap && (
        <ContactModal careGap={contactGap} onClose={() => setContactGap(null)} onMessageLogged={() => setContactGap(null)} />
      )}
      {closeGap && (
        <ActionClosureModal careGap={closeGap} onClose={() => setCloseGap(null)} onClosedSuccessfully={() => setCloseGap(null)} />
      )}
      {profileId && (
        <PatientProfileModal
          patientId={profileId}
          onClose={() => setProfileId(null)}
          onContactPatient={gap => { setProfileId(null); setContactGap(gap); }}
          onRecordAction={gap => { setProfileId(null); setCloseGap(gap); }}
        />
      )}
      {showSimulator && <RuleSimulatorModal onClose={() => setShowSimulator(false)} />}
    </div>
  );
};
