import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, ChevronDown, ChevronLeft, Search, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  /** Portal title shown next to the logo seal. */
  title?: string;
  /** Width when expanded. Defaults to 320px. */
  expandedWidth?: number;
  /** Width when collapsed. Defaults to 68px. */
  collapsedWidth?: number;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapse toggles */
  onCollapseToggle?: () => void;
  /** Whether to show the search box. Defaults to true. */
  searchable?: boolean;
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

function filterSections(
  sections: SidebarSection[],
  query: string
): SidebarSection[] {
  const q = query.trim().toLowerCase();
  if (!q) return sections;
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(q)
      ),
    }))
    .filter((section) => section.items.length > 0);
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

  const icon = (
    <span className="sidebar-menu-icon">
      <item.icon strokeWidth={1.75} />
    </span>
  );

  const rowClasses = cn(
    'sidebar-menu-item',
    active && 'active',
    collapsed && 'justify-center px-0',
    expanded && !collapsed && 'expanded'
  );

  if (hasChildren && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setExpanded((p) => !p)}
          className={rowClasses}
          style={
            !collapsed && depth > 0
              ? { paddingLeft: `calc(var(--space-lg) + ${depth * 16}px)` }
              : undefined
          }
        >
          {icon}
          <span className="sidebar-menu-label">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="sidebar-badge">{item.badge}</span>
          )}
          <span
            className={cn(
              'sidebar-menu-chevron',
              expanded && 'rotate-180'
            )}
          >
            <ChevronDown className="w-3 h-3" />
          </span>
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

  const linkContent = collapsed ? (
    <>
      {icon}
      <span className="sr-only">{item.label}</span>
    </>
  ) : (
    <>
      {icon}
      <span className="sidebar-menu-label">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <span className="sidebar-badge">{item.badge}</span>
      )}
    </>
  );

  const link = (
    <Link
      to={item.href}
      className={rowClasses}
      style={
        !collapsed && depth > 0
          ? { paddingLeft: `calc(var(--space-lg) + ${depth * 16}px)` }
          : undefined
      }
    >
      {linkContent}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

/* ── Main Sidebar ── */

export function AtelierSidebar({
  sections,
  rootHref,
  footerItems = [],
  title = 'Atelier',
  expandedWidth = 320,
  collapsedWidth = 68,
  collapsed: controlledCollapsed,
  onCollapseToggle,
  searchable = true,
}: AtelierSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const toggleCollapsed = () => {
    if (onCollapseToggle) onCollapseToggle();
    else setInternalCollapsed((p) => !p);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSections = useMemo(
    () => filterSections(sections, searchQuery),
    [sections, searchQuery]
  );

  const asideRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (asideRef.current) {
      asideRef.current.style.setProperty(
        '--sidebar-width',
        collapsed ? `${collapsedWidth}px` : `${expandedWidth}px`
      );
    }
  }, [collapsed, collapsedWidth, expandedWidth]);

  const { user, logout } = useAuthStore();
  const initials =
    user?.displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('') || 'NA';
  const isActive = useActiveCheck(rootHref);

  return (
    <TooltipProvider>
      <aside
        ref={asideRef}
        className={cn(
          'fixed left-0 top-0 bottom-0 bg-nahkya-surface border-r border-nahkya-border z-nav',
          'flex flex-col transition-[width] duration-300',
          'w-[var(--sidebar-width)]'
        )}
        style={{
          transitionTimingFunction: 'var(--transition-slow)',
        }}
        data-theme-sidebar
      >
        {/* ── Header ── */}
        <div
          className={cn(
            'flex border-b border-nahkya-border shrink-0',
            collapsed
              ? 'flex-col items-center justify-center gap-2 px-2 py-3'
              : 'flex-row items-center h-sidebar-header px-5 gap-3'
          )}
        >
          <Link
            to="/"
            className={cn(
              'flex items-center overflow-hidden',
              collapsed ? 'gap-0' : 'gap-3'
            )}
          >
            <img
              src="/assets/logo.png"
              alt="Haus of Nahkya"
              className={cn(
                'object-contain shrink-0',
                collapsed
                  ? 'w-sidebar-logo-collapsed h-sidebar-logo-collapsed'
                  : 'w-sidebar-logo h-sidebar-logo'
              )}
            />
            {!collapsed && (
              <span className="font-display text-sidebar-title text-nahkya-accent whitespace-nowrap">
                {title}
              </span>
            )}
          </Link>
          <button
            onClick={toggleCollapsed}
            className={cn(
              'rounded-nahkya-lg border border-nahkya-border',
              'flex items-center justify-center',
              'text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-surface-raised',
              'transition-colors shrink-0',
              collapsed ? 'w-8 h-8 mx-auto' : 'w-9 h-9 ml-auto'
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={cn(
                'transition-transform duration-300',
                collapsed ? 'w-4 h-4 rotate-180' : 'w-[18px] h-[18px]'
              )}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* ── Search ── */}
        {!collapsed && searchable && (
          <div className="px-5 pb-3 pt-2">
            <label className="flex items-center gap-2.5 h-11 px-3 border border-nahkya-border rounded-nahkya-lg bg-nahkya-surface-raised text-nahkya-text-secondary focus-within:border-nahkya-highlight focus-within:ring-1 focus-within:ring-nahkya-highlight/30 transition-all">
              <Search className="w-4 h-4" strokeWidth={1.75} />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 min-w-0 bg-transparent border-0 outline-0 text-sm text-nahkya-text placeholder:text-nahkya-muted"
              />
              <span className="hidden lg:inline-flex text-body-2xs text-nahkya-muted px-1.5 py-0.5 border border-nahkya-border rounded-nahkya-sm bg-nahkya-bg">
                ⌘K
              </span>
            </label>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto dark-scroll px-2.5 pb-4">
          {filteredSections.length === 0 ? (
            <div className="px-5 py-6 text-center text-body-sm text-nahkya-muted">
              No items match your search.
            </div>
          ) : (
            filteredSections.map((section, sIdx) => (
              <div
                key={section.title || `section-${sIdx}`}
                className={cn(
                  'py-1.5',
                  sIdx > 0 && 'mt-4'
                )}
              >
                {!collapsed && section.title && (
                  <div className="px-3 pb-2 text-body-2xs font-bold uppercase tracking-label text-nahkya-muted">
                    {section.title}
                  </div>
                )}
                <div
                  className={cn(
                    'flex flex-col',
                    collapsed ? 'gap-2' : 'gap-2'
                  )}
                >
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
            ))
          )}
        </nav>

        {/* ── Footer ── */}
        <div className="shrink-0 px-2.5 py-2.5">
          {footerItems.length > 0 && (
            <div
              className={cn(
                'flex flex-col mb-2',
                collapsed ? 'gap-2' : 'gap-2'
              )}
            >
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
          <div
            className={cn(
              'flex items-center rounded-nahkya-lg transition-colors hover:bg-nahkya-surface-raised',
              collapsed ? 'justify-center gap-2 px-1 py-2' : 'justify-between gap-3 px-2 py-1.5'
            )}
          >
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'flex items-center',
                    collapsed ? 'gap-0' : 'gap-3 min-w-0'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-full flex items-center justify-center shrink-0 font-display font-semibold',
                      'bg-nahkya-accent text-nahkya-inverse border-2 border-nahkya-border',
                      collapsed ? 'w-10 h-10 text-base' : 'w-sidebar-logo h-sidebar-logo text-xl'
                    )}
                  >
                    {initials}
                  </div>
                  {!collapsed && (
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-nahkya-text truncate">
                        {user?.displayName || 'Guest'}
                      </div>
                      <div className="text-body-3xs text-nahkya-text-secondary truncate">
                        {user?.email || ''}
                      </div>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" sideOffset={12}>
                  {user?.displayName || 'Guest'}
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className={cn(
                    'rounded-nahkya-lg flex items-center justify-center',
                    'text-nahkya-text-secondary hover:text-nahkya-error hover:bg-nahkya-error-subtle',
                    'transition-colors shrink-0',
                    collapsed ? 'w-9 h-9' : 'w-9 h-9'
                  )}
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={collapsed ? 12 : 8}>
                Logout
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
