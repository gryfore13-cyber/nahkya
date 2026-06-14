import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PUBLIC_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useLandingPageStore } from '@/stores/landingPageStore';

interface NavItem {
  label: string;
  href: string;
}

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  // Dynamic nav config from the landing/front-page store
  const landingNav = useLandingPageStore((s) => s.config?.nav);
  const isLoaded = useLandingPageStore((s) => s.isLoaded);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Hide on scroll down, show on scroll up
      if (currentY > lastScrollY.current && currentY > 200) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    // Reset nav state on route change
    /* eslint-disable react-hooks/set-state-in-effect */
    setMobileOpen(false);
    setHidden(false);
    /* eslint-enable react-hooks/set-state-in-effect */
    lastScrollY.current = 0;
  }, [location.pathname]);

  // Resolve nav links and CTA from landing-page config, falling back to constants
  const links: NavItem[] =
    isLoaded && landingNav?.links
      ? landingNav.links.map((link) => ({ label: link.label, href: link.target }))
      : PUBLIC_NAV.map((item) => ({ label: item.label, href: item.href }));

  const cta =
    isLoaded && landingNav
      ? { label: landingNav.ctaText, href: landingNav.ctaTarget, visible: true }
      : { label: 'Enter Atelier', href: '/login', visible: true };

  const contactTarget =
    isLoaded && landingNav?.contactTarget ? landingNav.contactTarget : '/contact';
  const contactText =
    isLoaded && landingNav?.contactText ? landingNav.contactText : 'Contact';

  const logoText = landingNav?.logoText || 'NAHKYA';
  const logoMark = logoText.charAt(0).toUpperCase() || 'N';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-nav transition-all duration-300',
          hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0',
          'relative flex items-center justify-between gap-4',
          'px-5 py-3.5 lg:px-8 lg:py-nav-y',
          'border-b border-nahkya-border',
          'bg-nahkya-surface-raised text-nahkya-text'
        )}
      >
        <Link to="/" className="flex items-center">
          <LogoBlock
            logoText={logoText}
            logoMark={logoMark}
            logoImageUrl={landingNav?.logoImageUrl}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {links.map((item) => (
            <PublicNavLink key={item.href + item.label} item={item} />
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <NavCta target={contactTarget} text={contactText} variant="ghost" />
          {cta.visible && (
            <NavCta target={cta.href} text={cta.label} variant="primary" />
          )}
        </div>

        {/* Mobile hamburger — visible below lg */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden w-11 h-11 -mr-2 flex items-center justify-center rounded-nahkya transition-colors hover:bg-nahkya-text/5"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </header>

      {/* Mobile drawer menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-modal lg:hidden">
          <div
            className="absolute inset-0 bg-nahkya-text/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-nahkya-surface-raised shadow-2xl flex flex-col">
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-nahkya-border">
              <LogoBlock
                logoText={logoText}
                logoMark={logoMark}
                logoImageUrl={landingNav?.logoImageUrl}
              />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-nahkya text-nahkya-text hover:bg-nahkya-text/5 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-2">
              {links.map((item) => (
                <MobileNavLink
                  key={item.href + item.label}
                  item={item}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
              <MobileNavLink
                item={{ label: contactText, href: contactTarget }}
                onClick={() => setMobileOpen(false)}
              />
            </nav>

            <div className="px-5 py-6 border-t border-nahkya-border flex flex-col gap-3">
              <NavCta
                target={contactTarget}
                text={contactText}
                variant="ghost"
                onClick={() => setMobileOpen(false)}
              />
              {cta.visible && (
                <NavCta
                  target={cta.href}
                  text={cta.label}
                  variant="primary"
                  onClick={() => setMobileOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LogoBlock({
  logoText,
  logoMark,
  logoImageUrl,
}: {
  logoText: string;
  logoMark: string;
  logoImageUrl?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-nav-logo h-nav-logo rounded-nahkya-lg border border-dashed border-nahkya-border bg-nahkya-bg grid place-items-center shrink-0 overflow-hidden">
        {logoImageUrl ? (
          <img
            src={logoImageUrl}
            alt=""
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <span className="font-display text-lg text-nahkya-accent font-semibold">
            {logoMark}
          </span>
        )}
      </div>
      <span className="font-display text-xl tracking-wide truncate">
        {logoText}
      </span>
    </div>
  );
}

function PublicNavLink({ item }: { item: NavItem }) {
  return (
    <Link
      to={item.href}
      className={cn(
        'relative text-nav-link font-medium transition-colors duration-200 group',
        'opacity-80 hover:opacity-100 text-nahkya-text'
      )}
    >
      {item.label}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-nahkya-highlight transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({
  item,
  onClick,
}: {
  item: NavItem;
  onClick?: () => void;
}) {
  return (
    <Link
      to={item.href}
      onClick={onClick}
      className="min-h-[48px] flex items-center font-display text-display-sm text-nahkya-text hover:text-nahkya-highlight transition-colors"
    >
      {item.label}
    </Link>
  );
}

function NavCta({
  target,
  text,
  variant = 'primary',
  onClick,
}: {
  target: string;
  text: string;
  variant?: 'primary' | 'ghost';
  onClick?: () => void;
}) {
  const className = cn(
    'inline-flex items-center justify-center',
    'py-2.5 px-5 rounded-nahkya-pill',
    'text-xs font-bold transition-colors',
    variant === 'primary'
      ? 'bg-nahkya-highlight text-nahkya-text hover:bg-nahkya-highlight-hover'
      : 'text-current opacity-80 hover:opacity-100 text-nahkya-text'
  );

  return (
    <Link to={target} onClick={onClick} className={className}>
      {text}
    </Link>
  );
}
