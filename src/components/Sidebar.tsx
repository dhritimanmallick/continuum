import React from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Users, 
  Baby, 
  HeartHandshake, 
  TestTubes, 
  AlertTriangle, 
  MessageSquare, 
  BarChart3, 
  Sliders, 
  ShieldCheck, 
  Building, 
  FileText,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  overdueCount: number;
  labActionCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  overdueCount,
  labActionCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'worklist', label: "Today's Worklist", icon: ListTodo, badge: overdueCount, badgeColor: 'bg-rose-500' },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'pregnancies', label: 'Pregnancies', icon: HeartHandshake },
    { id: 'children', label: 'Newborns & Children', icon: Baby },
    { id: 'lab', label: 'Laboratory / Results', icon: TestTubes, badge: labActionCount, badgeColor: 'bg-amber-500' },
    { id: 'care-gaps', label: 'Care Gaps', icon: AlertTriangle },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reports', label: 'Reports & KPIs', icon: BarChart3 },
    { id: 'rules', label: 'Rules & Protocols', icon: Sliders },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck },
    { id: 'facility', label: 'Facility Settings', icon: Building },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-6rem)] border-r border-slate-800">
      {/* Purpose Banner */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <p className="text-[11px] uppercase tracking-wider font-bold text-teal-400">Operational Question</p>
        <p className="text-xs font-medium text-slate-200 mt-1 leading-relaxed">
          &ldquo;Who is overdue today, for what, and why?&rdquo;
        </p>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                isActive 
                  ? 'bg-teal-700 text-white font-semibold shadow-xs' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-teal-400 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Care-Gap Engine v2.4</span>
        </div>
        <p className="leading-snug text-slate-400">
          Assistive registry. Configuration, not hardcoded logic. Does not diagnose or replace clinician.
        </p>
      </div>
    </aside>
  );
};
