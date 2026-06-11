import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { PUBLIC_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 100);
      // Hide on scroll down, show on scroll up (mobile behavior)
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHidden(false);
    lastScrollY.current = 0;
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-nav transition-all duration-300',
          hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0',
          scrolled || !isHome
            ? 'bg-nahkya-surface/95 backdrop-blur-md border-b border-nahkya-border'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-container mx-auto h-nav flex items-center justify-between px-5 lg:px-8">
          <Link to="/">
            <Logo variant={scrolled || !isHome ? 'dark' : 'light'} size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'relative font-body text-sm font-normal tracking-wide transition-colors duration-200 group',
                  scrolled || !isHome
                    ? 'text-nahkya-text hover:text-nahkya-accent'
                    : 'text-nahkya-bg hover:text-nahkya-highlight'
                )}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-nahkya-highlight transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <LuxuryButton
              variant={scrolled || !isHome ? 'ghost' : 'dark-ghost'}
              size="sm"
              onClick={() => {}}
            >
              Contact
            </LuxuryButton>
            <Link to="/login">
              <LuxuryButton
                variant={scrolled || !isHome ? 'primary' : 'dark-primary'}
                size="sm"
              >
                Enter Atelier
              </LuxuryButton>
            </Link>
          </div>

          {/* Mobile hamburger — 44px touch target */}
          <button
            className={cn(
              'lg:hidden w-11 h-11 flex items-center justify-center rounded-nahkya transition-colors',
              scrolled || !isHome ? 'text-nahkya-text' : 'text-nahkya-bg'
            )}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-modal bg-nahkya-surface flex flex-col">
          {/* Close button — top right for thumb reach */}
          <div className="h-nav flex items-center justify-end px-5">
            <button
              className="w-11 h-11 flex items-center justify-center rounded-nahkya text-nahkya-text"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-5">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="min-h-[48px] flex items-center font-display text-display-sm text-nahkya-text hover:text-nahkya-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <LuxuryButton variant="primary" size="lg" className="mt-4">
                Enter Atelier
              </LuxuryButton>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
