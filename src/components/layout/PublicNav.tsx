import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { PUBLIC_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => setMobileOpen(false), [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-nav transition-all duration-300',
          scrolled || !isHome
            ? 'bg-nahkya-surface/95 backdrop-blur-md border-b border-nahkya-border'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-container mx-auto h-nav flex items-center justify-between">
          <Link to="/">
            <Logo variant={scrolled || !isHome ? 'dark' : 'light'} size="sm" />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'relative font-body text-sm font-normal tracking-wide transition-colors duration-200 group',
                  scrolled || !isHome
                    ? 'text-nahkya-text hover:text-nahkya-burgundy'
                    : 'text-nahkya-ivory hover:text-nahkya-gold'
                )}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-nahkya-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

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

          <button
            className={cn(
              'lg:hidden p-2',
              scrolled || !isHome ? 'text-nahkya-text' : 'text-nahkya-ivory'
            )}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-modal bg-nahkya-bg flex flex-col items-center justify-center">
          <button
            className="absolute top-6 right-6 text-nahkya-text"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <nav className="flex flex-col items-center gap-8">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="font-display text-display-sm text-nahkya-text hover:text-nahkya-burgundy transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/login">
              <LuxuryButton variant="primary" size="md">
                Enter Atelier
              </LuxuryButton>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
