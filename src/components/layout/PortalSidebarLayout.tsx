/**
 * Shared left-side navigation for portal screens (patient portal, reception, ...).
 * Grouped sections, one active item, optional badges and one-off action items.
 * On small screens the menu collapses into a horizontal strip above the content.
 */
import React from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeTone?: 'rose' | 'amber' | 'emerald' | 'slate';
  /** Action items run onClick and are never shown as "active". */
  onClick?: () => void;
  /** For action items that pick a context (e.g. which OPD room): show as selected. */
  selected?: boolean;
}

export interface SidebarGroup {
  heading?: string;
  items: SidebarItem[];
}

interface PortalSidebarLayoutProps {
  groups: SidebarGroup[];
  activeId: string;
  onSelect: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const TONE: Record<NonNullable<SidebarItem['badgeTone']>, string> = {
  rose: 'bg-rose-100 text-rose-800',
  amber: 'bg-amber-100 text-amber-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  slate: 'bg-slate-100 text-slate-700',
};

export const PortalSidebarLayout: React.FC<PortalSidebarLayoutProps> = ({
  groups, activeId, onSelect, header, footer, children
}) => {
  const all = groups.flatMap(g => g.items);

  const Item = ({ it, compact }: { it: SidebarItem; compact?: boolean }) => {
    const Icon = it.icon;
    const active = !it.onClick && it.id === activeId;
    return (
      <button
        type="button"
        onClick={() => (it.onClick ? it.onClick() : onSelect(it.id))}
        aria-current={active ? 'page' : undefined}
        className={`group w-full flex items-center gap-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
          compact ? 'px-3 py-1.5 whitespace-nowrap w-auto' : 'px-3 py-2'
        } ${
          active
            ? 'bg-rose-700 text-white shadow-xs'
            : it.selected
            ? 'bg-rose-50 text-rose-900 ring-1 ring-rose-200'
            : 'text-slate-700 hover:bg-rose-50 hover:text-rose-900'
        }`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-rose-100' : it.selected ? 'text-rose-600' : 'text-slate-400 group-hover:text-rose-600'}`} />
        <span className="flex-1 truncate">{it.label}</span>
        {it.badge !== undefined && it.badge !== 0 && it.badge !== '' && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/25 text-white' : TONE[it.badgeTone || 'slate']}`}>
            {it.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start w-full">
      {/* Mobile / tablet: horizontal strip */}
      <nav className="lg:hidden w-full overflow-x-auto bg-white border border-slate-200 rounded-2xl p-1.5 flex gap-1 shadow-2xs">
        {all.map(it => <Item key={it.id} it={it} compact />)}
      </nav>

      {/* Desktop: left sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-4 self-start bg-white border border-slate-200 rounded-2xl shadow-2xs max-h-[calc(100vh-2rem)] overflow-y-auto">
        {header && <div className="p-4 border-b border-slate-100">{header}</div>}
        <nav className="p-2.5 space-y-4">
          {groups.map((g, gi) => (
            <div key={gi} className="space-y-0.5">
              {g.heading && (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{g.heading}</div>
              )}
              {g.items.map(it => <Item key={it.id} it={it} />)}
            </div>
          ))}
        </nav>
        {footer && <div className="mt-auto p-3 border-t border-slate-100">{footer}</div>}
      </aside>

      <section className="flex-1 min-w-0 w-full">{children}</section>
    </div>
  );
};
