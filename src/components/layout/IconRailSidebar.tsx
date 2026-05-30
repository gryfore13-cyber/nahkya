import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  shortLabel: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

interface IconRailSidebarProps {
  sections: NavSection[];
  portalLinks?: NavItem[];
  rootHref: string;
}

function useActiveCheck(rootHref: string) {
  const location = useLocation();
  return (href: string) => {
    if (location.pathname === href) return true;
    if (href === rootHref) return false;
    return location.pathname.startsWith(href + '/');
  };
}

export function IconRailSidebarContent({ sections, portalLinks, rootHref }: IconRailSidebarProps) {
  const { user, logout } = useAuthStore();
  const initials = user?.displayName?.split(' ').map((n) => n[0]).join('') || 'NA';
  const isActive = useActiveCheck(rootHref);

  return (
    <>
      {/* Logo mark */}
      <div className="px-1 py-4 pb-2 text-center">
        <Link to="/" className="block">
          <img
            src="/assets/logo.png"
            alt="Haus of Nahkya"
            className="w-12 h-12 object-contain mx-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto workspace-scroll">
        {sections.map((section, sIdx) => (
          <div key={section.title || `section-${sIdx}`}>
            {sIdx > 0 && <div className="mx-2 my-2 border-t border-nahkya-border" />}
            <div className="nk-icon-rail">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn('nk-icon-rail-item', isActive(item.href) && 'is-active')}
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  <span>{item.shortLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {portalLinks && portalLinks.length > 0 && (
          <>
            <div className="mx-2 my-2 border-t border-nahkya-border" />
            <div className="nk-icon-rail">
              {portalLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn('nk-icon-rail-item', isActive(item.href) && 'is-active')}
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  <span>{item.shortLabel}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* User / Logout */}
      <div className="p-3 border-t border-nahkya-border flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-nahkya-gold-veil border border-nahkya-border flex items-center justify-center">
          <span className="font-mono text-mono-sm text-nahkya-burgundy">{initials}</span>
        </div>
        <button
          onClick={logout}
          className="nk-icon-rail-item w-full"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}

export function IconRailSidebar(props: IconRailSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-sidebar-member-collapsed bg-nahkya-surface border-r border-nahkya-border z-nav flex flex-col">
      <IconRailSidebarContent {...props} />
    </aside>
  );
}
