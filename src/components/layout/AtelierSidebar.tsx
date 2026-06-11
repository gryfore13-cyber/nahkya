import { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, ChevronDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

/* ── Types ── */

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: SidebarItem[];
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface AtelierSidebarProps {
  sections: SidebarSection[];
  rootHref: string;
  footerItems?: SidebarItem[];
  /** Width when expanded. Defaults to 280px. */
  expandedWidth?: number;
  /** Width when collapsed. Defaults to 64px. */
  collapsedWidth?: number;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapse toggles */
  onCollapseToggle?: () => void;
}

/* ── Helpers ── */

function useActiveCheck(rootHref: string) {
  const location = useLocation();
  return useCallback(
    (href: string) => {
      if (location.pathname === href) return true;
      if (href === rootHref) return false;
      return location.pathname.startsWith(href + '/');
    },
    [location.pathname, rootHref]
  );
}

/* ── Components ── */

function SidebarItemRow({
  item,
  isActive,
  collapsed,
  depth = 0,
}: {
  item: SidebarItem;
  isActive: (href: string) => boolean;
  collapsed: boolean;
  depth?: number;
}) {
  const active = isActive(item.href);
  const hasChildren = !!item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(active);

  const content = (
    <>
      <span className="sidebar-menu-icon">
        <item.icon strokeWidth={1.5} />
      </span>
      {!collapsed && (
        <>
          <span className="sidebar-menu-label">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="sidebar-badge">{item.badge}</span>
          )}
          {hasChildren && (
            <span
              className={cn(
                'sidebar-menu-chevron',
                expanded && 'rotate-180'
              )}
            >
              <ChevronDown className="w-3 h-3" />
            </span>
          )}
        </>
      )}
    </>
  );

  if (hasChildren && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setExpanded((p) => !p)}
          className={cn(
            'sidebar-menu-item',
            active && 'active',
            expanded && 'expanded'
          )}
          style={{ paddingLeft: `calc(var(--space-lg) + ${depth * 16}px)` }}
        >
          {content}
        </button>
        <div className={cn('sidebar-submenu', expanded && 'open')}>
          <div>
            {item.children!.map((child) => (
              <SidebarItemRow
                key={child.href}
                item={child}
                isActive={isActive}
                collapsed={collapsed}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn('sidebar-menu-item', active && 'active')}
      style={
        !collapsed && depth > 0
          ? { paddingLeft: `calc(var(--space-lg) + ${depth * 16}px)` }
          : undefined
      }
      title={collapsed ? item.label : undefined}
    >
      {content}
    </Link>
  );
}

/* ── Main Sidebar ── */

export function AtelierSidebar({
  sections,
  rootHref,
  footerItems = [],
  expandedWidth = 280,
  collapsedWidth = 64,
  collapsed: controlledCollapsed,
  onCollapseToggle,
}: AtelierSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const toggleCollapsed = () => {
    const next = !collapsed;
    if (onCollapseToggle) onCollapseToggle();
    else setInternalCollapsed(next);
  };

  const { user, logout } = useAuthStore();
  const initials = user?.displayName?.split(' ').map((n) => n[0]).join('') || 'NA';
  const isActive = useActiveCheck(rootHref);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 bg-nahkya-surface border-r border-nahkya-border z-nav',
        'flex flex-col transition-[width] duration-300',
        collapsed ? 'w-[64px]' : 'w-[280px]'
      )}
      style={{
        width: collapsed ? collapsedWidth : expandedWidth,
        transitionTimingFunction: 'var(--transition-slow)',
      }}
      data-theme-sidebar
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-nahkya-border h-[72px] shrink-0">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <img
            src="/assets/logo.png"
            alt="Haus of Nahkya"
            className="w-8 h-8 object-contain shrink-0"
          />
          {!collapsed && (
            <span
              className="font-display text-[22px] font-semibold text-nahkya-accent whitespace-nowrap"
              style={{ letterSpacing: '-0.3px' }}
            >
              Atelier
            </span>
          )}
        </Link>
        <button
          onClick={toggleCollapsed}
          className="ml-auto w-8 h-8 rounded-[var(--radius-md)] border border-nahkya-border flex items-center justify-center text-nahkya-text-secondary hover:text-nahkya-text hover:bg-[var(--nahkya-accent-subtle)] transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('transition-transform duration-300', collapsed && 'rotate-180')}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto dark-scroll py-2">
        {sections.map((section, sIdx) => (
          <div key={section.title || `section-${sIdx}`}>
            {sIdx > 0 && (
              <div className="mx-5 my-2 border-t border-nahkya-border" />
            )}
            {!collapsed && section.title && (
              <div className="px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.8px] text-nahkya-muted">
                {section.title}
              </div>
            )}
            <div className="px-2">
              {section.items.map((item) => (
                <SidebarItemRow
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="shrink-0 border-t border-nahkya-border">
        {footerItems.length > 0 && (
          <div className="px-2 py-2">
            {footerItems.map((item) => (
              <SidebarItemRow
                key={item.href}
                item={item}
                isActive={isActive}
                collapsed={collapsed}
              />
            ))}
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 px-5 py-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-display font-semibold text-sm border-2"
            style={{
              background: 'var(--nahkya-accent)',
              color: '#FFFFFF',
              borderColor: 'var(--nahkya-border)',
            }}
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-nahkya-text truncate">
                {user?.displayName || 'Guest'}
              </div>
              <div className="text-xs text-nahkya-text-secondary truncate">
                {user?.email || ''}
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center text-nahkya-text-secondary hover:text-nahkya-error hover:bg-[var(--nahkya-error-subtle)] transition-colors shrink-0"
            title="Logout"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
