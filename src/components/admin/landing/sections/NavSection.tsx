import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LandingNavLink, LandingNavSection } from '@/types/landingPage';

interface NavSectionProps {
  section: LandingNavSection;
  editable?: boolean;
}

export function NavSection({ section, editable }: NavSectionProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoMark = section.logoText.charAt(0).toUpperCase() || 'N';
  const isTransparent = section.style === 'transparent';
  const isFloating = section.style === 'floating';

  const textColorClass = isTransparent ? 'text-nahkya-inverse' : 'text-nahkya-text';

  return (
    <>
      <nav
        id={section.id}
        className={cn(
          'relative z-10 flex items-center justify-between gap-4',
          'px-5 py-3.5 @landing-md:px-nav-x @landing-md:py-nav-y',
          'border-b border-nahkya-border',
          'bg-nahkya-surface-raised text-nahkya-text',
          section.sticky && 'sticky top-0',
          isFloating &&
            'mx-4 my-4 rounded-nahkya-pill shadow-xl border border-nahkya-border',
          isTransparent &&
            'absolute inset-x-0 top-0 bg-gradient-to-b from-nahkya-text/60 to-transparent border-b-0 text-nahkya-inverse',
        )}
      >
        <LogoBlock section={section} logoMark={logoMark} />

        <div className="hidden @landing-md:flex items-center gap-5">
          {section.links.map((link, index) => (
            <NavLink key={`${link.target}-${index}`} link={link} editable={editable} />
          ))}
        </div>

        <div className="hidden @landing-md:flex items-center gap-3">
          {section.contactText && (
            <NavCta
              target={section.contactTarget ?? '/contact'}
              text={section.contactText}
              variant="ghost"
              editable={editable}
            />
          )}
          <NavCta target={section.ctaTarget} text={section.ctaText} editable={editable} />
        </div>

        {/* Mobile hamburger — visible below @landing-md, disabled in builder */}
        {!editable && (
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={cn(
              '@landing-md:hidden w-11 h-11 -mr-2 flex items-center justify-center rounded-nahkya transition-colors',
              textColorClass,
              isTransparent ? 'hover:bg-nahkya-inverse/10' : 'hover:bg-nahkya-text/5',
            )}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
        )}
      </nav>

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-modal @landing-md:hidden">
          <div
            className="absolute inset-0 bg-nahkya-text/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-nahkya-surface-raised shadow-2xl flex flex-col">
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-nahkya-border">
              <LogoBlock section={section} logoMark={logoMark} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-nahkya text-nahkya-text hover:bg-nahkya-text/5 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-2">
              {section.links.map((link, index) => (
                <MobileNavLink
                  key={`${link.target}-${index}`}
                  link={link}
                  onClick={() => setMobileOpen(false)}
                  editable={editable}
                />
              ))}
            </div>

            <div className="px-5 py-6 border-t border-nahkya-border flex flex-col gap-3">
              {section.contactText && (
                <NavCta
                  target={section.contactTarget ?? '/contact'}
                  text={section.contactText}
                  variant="ghost"
                  onClick={() => setMobileOpen(false)}
                  editable={editable}
                />
              )}
              <NavCta
                target={section.ctaTarget}
                text={section.ctaText}
                onClick={() => setMobileOpen(false)}
                editable={editable}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LogoBlock({
  section,
  logoMark,
}: {
  section: LandingNavSection;
  logoMark: string;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-nav-logo h-nav-logo rounded-nahkya-lg border border-dashed border-nahkya-border bg-nahkya-bg grid place-items-center shrink-0 overflow-hidden">
        {section.logoImageUrl ? (
          <img
            src={section.logoImageUrl}
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
        {section.logoText}
      </span>
    </div>
  );
}

function NavLink({ link, editable }: { link: LandingNavLink; editable?: boolean }) {
  const className =
    'text-nav-link font-medium text-current opacity-80 hover:opacity-100 transition-opacity';

  if (editable) {
    return (
      <span className={className} aria-disabled="true">
        {link.label}
      </span>
    );
  }

  if (isAnchor(link.target)) {
    return (
      <a href={link.target} className={className}>
        {link.label}
      </a>
    );
  }

  if (isExternal(link.target)) {
    return (
      <a
        href={link.target}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.target} className={className}>
      {link.label}
    </Link>
  );
}

function NavCta({
  target,
  text,
  variant = 'primary',
  onClick,
  editable,
}: {
  target: string;
  text: string;
  variant?: 'primary' | 'ghost';
  onClick?: () => void;
  editable?: boolean;
}) {
  const className = cn(
    'inline-flex items-center justify-center',
    'py-2.5 px-5 rounded-nahkya-pill',
    'text-xs font-bold transition-colors',
    variant === 'primary'
      ? 'bg-nahkya-highlight text-nahkya-text hover:bg-nahkya-highlight-hover'
      : 'text-current opacity-80 hover:opacity-100',
  );

  if (editable) {
    return (
      <span className={className} aria-disabled="true">
        {text}
      </span>
    );
  }

  if (isAnchor(target)) {
    return (
      <a href={target} className={className} onClick={onClick}>
        {text}
      </a>
    );
  }

  if (isExternal(target)) {
    return (
      <a
        href={target}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {text}
      </a>
    );
  }

  return (
    <Link to={target} className={className} onClick={onClick}>
      {text}
    </Link>
  );
}

function MobileNavLink({
  link,
  onClick,
  editable,
}: {
  link: LandingNavLink;
  onClick?: () => void;
  editable?: boolean;
}) {
  const className =
    'min-h-[48px] flex items-center font-display text-display-sm text-nahkya-text hover:text-nahkya-accent transition-colors';

  if (editable) {
    return (
      <span className={className} aria-disabled="true">
        {link.label}
      </span>
    );
  }

  if (isAnchor(link.target)) {
    return (
      <a href={link.target} className={className} onClick={onClick}>
        {link.label}
      </a>
    );
  }

  if (isExternal(link.target)) {
    return (
      <a
        href={link.target}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.target} className={className} onClick={onClick}>
      {link.label}
    </Link>
  );
}

function isAnchor(target: string): boolean {
  return target.startsWith('#');
}

function isExternal(target: string): boolean {
  return /^https?:\/\//i.test(target) || /^mailto:/i.test(target);
}
