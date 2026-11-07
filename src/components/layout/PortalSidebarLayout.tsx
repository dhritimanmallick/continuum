/**
 * Shared left-side navigation for portal screens (patient portal, reception, ...).
 * Grouped sections, one active item, optional badges and one-off action items.
 * On small screens the same grouped menu opens as a slide-in drawer. With `mobileTabs`, phones also get a
 * thumb-friendly bottom tab bar (the last tab, Menu, opens the full drawer).
 */
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
  /** Phone bottom bar: up to 4 item ids (with optional short labels); a Menu tab is added automatically. */
  mobileTabs?: { id: string; label?: string }[];
}

const TONE: Record<NonNullable<SidebarItem['badgeTone']>, string> = {
  rose: 'bg-rose-100 text-rose-800',
  amber: 'bg-amber-100 text-amber-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  slate: 'bg-slate-100 text-slate-700',
};

export const PortalSidebarLayout: React.FC<PortalSidebarLayoutProps> = ({
  groups, activeId, onSelect, header, footer, children, mobileTabs
}) => {
  const all = groups.flatMap(g => g.items);
  const [drawer, setDrawer] = useState(false);
  const current = all.find(it => !it.onClick && it.id === activeId);
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer]);

  const MenuList = ({ onPick }: { onPick?: () => void }) => (
    <nav className={`p-2.5 space-y-4 ${onPick ? 'text-sm' : ''}`}>
      {groups.map((g, gi) => (
        <div key={gi} className="space-y-0.5">
          {g.heading && (
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{g.heading}</div>
          )}
          {g.items.map(it => <Item key={it.id} it={it} onPick={onPick} large={!!onPick} />)}
        </div>
      ))}
    </nav>
  );

  const Item = ({ it, compact, onPick, large }: { it: SidebarItem; compact?: boolean; onPick?: () => void; large?: boolean }) => {
    const Icon = it.icon;
    const active = !it.onClick && it.id === activeId;
    return (
      <button
        type="button"
        onClick={() => { if (it.onClick) it.onClick(); else onSelect(it.id); onPick?.(); }}
        aria-current={active ? 'page' : undefined}
        className={`group w-full flex items-center gap-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
          compact ? 'px-3 py-1.5 whitespace-nowrap w-auto' : large ? 'px-3.5 py-3 text-sm' : 'px-3 py-2'
        } ${
          active
            ? 'bg-rose-700 text-white shadow-xs'
            : it.selected
            ? 'bg-rose-50 text-rose-900 ring-1 ring-rose-200'
            : 'text-slate-700 hover:bg-rose-50 hover:text-rose-900'
        }`}
      >
        <Icon className={`${large ? 'w-5 h-5' : 'w-4 h-4'} shrink-0 ${active ? 'text-rose-100' : it.selected ? 'text-rose-600' : 'text-slate-400 group-hover:text-rose-600'}`} />
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
      {/* Mobile / tablet: menu button that opens the same side menu as a drawer */}
      <button
        type="button"
        onClick={() => setDrawer(true)}
        className={`${mobileTabs ? 'hidden' : 'lg:hidden'} w-full flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-2xs text-left cursor-pointer`}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-rose-700" />
        <span className="flex-1 min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Menu</span>
          <span className="block text-sm font-bold text-slate-900 truncate">{current?.label || 'Choose a section'}</span>
        </span>
      </button>
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setDrawer(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[82%] max-w-xs bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-start justify-between gap-2 p-4 border-b border-slate-100">
              <div className="min-w-0 flex-1">{header}</div>
              <button type="button" onClick={() => setDrawer(false)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer" aria-label="Close menu">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <MenuList onPick={() => setDrawer(false)} />
            {footer && <div className="mt-auto p-3 border-t border-slate-100">{footer}</div>}
          </aside>
        </div>
      )}

      {/* Desktop: left sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-4 self-start bg-white border border-slate-200 rounded-2xl shadow-2xs max-h-[calc(100vh-2rem)] overflow-y-auto">
        {header && <div className="p-4 border-b border-slate-100">{header}</div>}
        <MenuList />
        {footer && <div className="mt-auto p-3 border-t border-slate-100">{footer}</div>}
      </aside>

      <section className="flex-1 min-w-0 w-full">
        {children}
        {mobileTabs && <div className="h-24 lg:hidden" aria-hidden="true" />}
      </section>

      {/* Phone: bottom tab bar */}
      {mobileTabs && (
        <nav
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-6px_20px_rgba(15,23,42,0.06)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          aria-label="Main sections"
        >
          <div className="grid" style={{ gridTemplateColumns: `repeat(${mobileTabs.length + 1}, minmax(0, 1fr))` }}>
            {mobileTabs.map(t => {
              const it = all.find(x => x.id === t.id);
              if (!it) return null;
              const Icon = it.icon;
              const active = !it.onClick && it.id === activeId;
              const hasBadge = it.badge !== undefined && it.badge !== 0 && it.badge !== '';
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { if (it.onClick) it.onClick(); else { onSelect(it.id); window.scrollTo({ top: 0 }); } }}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex flex-col items-center justify-center gap-1 py-2.5 min-h-[60px] text-[11px] font-bold cursor-pointer ${active ? 'text-rose-700' : 'text-slate-500'}`}
                >
                  {active && <span className="absolute top-0 inset-x-5 h-0.5 rounded-full bg-rose-600" />}
                  <span className="relative">
                    <Icon className="w-6 h-6" />
                    {hasBadge && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">
                        {it.badge}
                      </span>
                    )}
                  </span>
                  <span className="truncate max-w-full px-1">{t.label || it.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="flex flex-col items-center justify-center gap-1 py-2.5 min-h-[60px] text-[11px] font-bold text-slate-500 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
              <span>Menu</span>
            </button>
          </div>
        </nav>
      )}
    </div>

  );
};
