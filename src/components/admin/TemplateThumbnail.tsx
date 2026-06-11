import type { TemplateType } from '@/types';

interface Props {
  type: TemplateType;
  className?: string;
}

const FILL_MUTED = '#C4A882';
const FILL_ACCENT = '#B88B4A';

export function TemplateThumbnail({ type, className = '' }: Props) {
  const base = 'w-full h-full';
  const cn = `${base} ${className}`.trim();

  switch (type) {
    case 'splitScreenHero':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="52" height="72" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="64" y="4" width="52" height="72" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="72" y="28" width="36" height="4" rx="1" fill={FILL_ACCENT} opacity="0.9" />
          <rect x="72" y="38" width="28" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
        </svg>
      );

    case 'singleColumnFocus':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="20" y="4" width="80" height="72" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="36" y="24" width="48" height="4" rx="1" fill={FILL_ACCENT} opacity="0.9" />
          <rect x="40" y="34" width="40" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="44" y="52" width="32" height="8" rx="1" fill={FILL_ACCENT} opacity="0.8" />
        </svg>
      );

    case 'zPattern':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="40" height="20" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="52" y="8" width="60" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="76" y="30" width="40" height="20" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="34" width="60" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="4" y="56" width="40" height="20" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="52" y="60" width="60" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
        </svg>
      );

    case 'fPattern':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="112" height="6" rx="1" fill={FILL_ACCENT} opacity="0.9" />
          <rect x="4" y="18" width="28" height="20" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="40" y="20" width="76" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="40" y="28" width="56" height="2" rx="1" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="46" width="28" height="20" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="40" y="48" width="76" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="40" y="56" width="56" height="2" rx="1" fill={FILL_MUTED} opacity="0.6" />
        </svg>
      );

    case 'invertedPyramid':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="8" width="112" height="8" rx="1" fill={FILL_ACCENT} opacity="0.9" />
          <rect x="16" y="24" width="88" height="6" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="32" y="40" width="56" height="4" rx="1" fill={FILL_MUTED} opacity="0.7" />
          <rect x="44" y="56" width="32" height="8" rx="1" fill={FILL_ACCENT} opacity="0.8" />
        </svg>
      );

    case 'cardGrid':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="52" height="33" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="64" y="4" width="52" height="33" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="43" width="52" height="33" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="64" y="43" width="52" height="33" rx="2" fill={FILL_MUTED} opacity="0.6" />
        </svg>
      );

    case 'alternating':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="40" height="30" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="52" y="10" width="60" height="4" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="52" y="18" width="48" height="2" rx="1" fill={FILL_MUTED} opacity="0.6" />
          <rect x="76" y="46" width="40" height="30" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="52" width="60" height="4" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="4" y="60" width="48" height="2" rx="1" fill={FILL_MUTED} opacity="0.6" />
        </svg>
      );

    case 'longFormSales':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="112" height="6" rx="1" fill={FILL_ACCENT} opacity="0.9" />
          <rect x="4" y="16" width="112" height="3" rx="1" fill={FILL_MUTED} opacity="0.7" />
          <rect x="4" y="24" width="112" height="3" rx="1" fill={FILL_MUTED} opacity="0.7" />
          <rect x="4" y="36" width="34" height="18" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="44" y="36" width="34" height="18" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="84" y="36" width="32" height="18" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="62" width="112" height="4" rx="1" fill={FILL_MUTED} opacity="0.7" />
          <rect x="40" y="72" width="40" height="6" rx="1" fill={FILL_ACCENT} opacity="0.8" />
        </svg>
      );

    case 'storytellingScroll':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <text x="8" y="16" fontSize="10" fill={FILL_ACCENT} opacity="0.85" fontFamily="serif">01</text>
          <rect x="36" y="4" width="36" height="22" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="78" y="8" width="36" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <text x="8" y="44" fontSize="10" fill={FILL_ACCENT} opacity="0.85" fontFamily="serif">02</text>
          <rect x="36" y="32" width="36" height="22" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="78" y="36" width="36" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <text x="8" y="72" fontSize="10" fill={FILL_ACCENT} opacity="0.85" fontFamily="serif">03</text>
          <rect x="36" y="60" width="36" height="16" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="78" y="64" width="36" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
        </svg>
      );

    case 'asymmetricalEditorial':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="24" y="4" width="80" height="52" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="44" width="44" height="32" rx="2" fill={FILL_MUTED} opacity="0.7" stroke="white" strokeWidth="2" />
          <rect x="32" y="14" width="48" height="4" rx="1" fill={FILL_ACCENT} opacity="0.9" />
        </svg>
      );

    case 'productShowcase':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="56" y="4" width="60" height="72" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="12" width="40" height="3" rx="1" fill={FILL_ACCENT} opacity="0.9" />
          <rect x="4" y="22" width="36" height="2" rx="1" fill={FILL_MUTED} opacity="0.7" />
          <circle cx="10" cy="38" r="4" fill={FILL_MUTED} opacity="0.6" />
          <rect x="18" y="36" width="30" height="2" rx="1" fill={FILL_MUTED} opacity="0.7" />
          <circle cx="10" cy="52" r="4" fill={FILL_MUTED} opacity="0.6" />
          <rect x="18" y="50" width="30" height="2" rx="1" fill={FILL_MUTED} opacity="0.7" />
          <rect x="4" y="66" width="32" height="6" rx="1" fill={FILL_ACCENT} opacity="0.8" />
        </svg>
      );

    case 'leadCapture':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="20" y="4" width="80" height="48" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="32" y="14" width="56" height="4" rx="1" fill={FILL_ACCENT} opacity="0.9" />
          <rect x="32" y="24" width="48" height="3" rx="1" fill={FILL_MUTED} opacity="0.7" />
          <rect x="32" y="34" width="56" height="6" rx="1" fill={FILL_MUTED} opacity="0.1" />
          <rect x="52" y="44" width="16" height="6" rx="1" fill={FILL_ACCENT} opacity="0.8" />
          <circle cx="28" y="62" r="3" fill={FILL_MUTED} opacity="0.6" />
          <rect x="36" y="60" width="28" height="2" rx="1" fill={FILL_MUTED} opacity="0.7" />
          <circle cx="28" cy="72" r="3" fill={FILL_MUTED} opacity="0.6" />
          <rect x="36" y="70" width="28" height="2" rx="1" fill={FILL_MUTED} opacity="0.7" />
        </svg>
      );

    case 'benefits':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="52" height="33" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="64" y="4" width="52" height="33" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="43" width="52" height="33" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="64" y="43" width="52" height="33" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <circle cx="20" cy="18" r="4" fill={FILL_ACCENT} opacity="0.8" />
          <circle cx="80" cy="18" r="4" fill={FILL_ACCENT} opacity="0.8" />
          <circle cx="20" cy="57" r="4" fill={FILL_ACCENT} opacity="0.8" />
          <circle cx="80" cy="57" r="4" fill={FILL_ACCENT} opacity="0.8" />
        </svg>
      );

    case 'testimonials':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="34" height="72" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="42" y="4" width="34" height="72" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="80" y="4" width="36" height="72" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="10" y="14" width="22" height="3" rx="1" fill={FILL_ACCENT} opacity="0.8" />
          <rect x="48" y="14" width="22" height="3" rx="1" fill={FILL_ACCENT} opacity="0.8" />
          <rect x="86" y="14" width="22" height="3" rx="1" fill={FILL_ACCENT} opacity="0.8" />
        </svg>
      );

    case 'faq':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="112" height="14" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="24" width="112" height="14" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="44" width="112" height="14" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="4" y="64" width="112" height="14" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="96" y="8" width="12" height="6" rx="1" fill={FILL_ACCENT} opacity="0.8" />
          <rect x="96" y="28" width="12" height="6" rx="1" fill={FILL_ACCENT} opacity="0.8" />
          <rect x="96" y="48" width="12" height="6" rx="1" fill={FILL_ACCENT} opacity="0.8" />
          <rect x="96" y="68" width="12" height="6" rx="1" fill={FILL_ACCENT} opacity="0.8" />
        </svg>
      );

    case 'howItWorks':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <circle cx="16" cy="20" r="10" fill={FILL_ACCENT} opacity="0.8" />
          <circle cx="46" cy="20" r="10" fill={FILL_ACCENT} opacity="0.8" />
          <circle cx="76" cy="20" r="10" fill={FILL_ACCENT} opacity="0.8" />
          <circle cx="106" cy="20" r="10" fill={FILL_ACCENT} opacity="0.8" />
          <rect x="10" y="40" width="12" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="40" y="40" width="12" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="70" y="40" width="12" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="100" y="40" width="12" height="3" rx="1" fill={FILL_MUTED} opacity="0.75" />
          <rect x="6" y="50" width="20" height="2" rx="1" fill={FILL_MUTED} opacity="0.5" />
          <rect x="36" y="50" width="20" height="2" rx="1" fill={FILL_MUTED} opacity="0.5" />
          <rect x="66" y="50" width="20" height="2" rx="1" fill={FILL_MUTED} opacity="0.5" />
          <rect x="96" y="50" width="20" height="2" rx="1" fill={FILL_MUTED} opacity="0.5" />
        </svg>
      );

    case 'lookbook':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="52" height="72" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="60" y="4" width="56" height="34" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="60" y="42" width="56" height="34" rx="2" fill={FILL_MUTED} opacity="0.6" />
        </svg>
      );

    case 'collectionPreview':
      return (
        <svg viewBox="0 0 120 80" className={cn} fill="none" aria-hidden>
          <rect x="4" y="4" width="25" height="50" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="34" y="4" width="25" height="50" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="64" y="4" width="25" height="50" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="94" y="4" width="22" height="50" rx="2" fill={FILL_MUTED} opacity="0.6" />
          <rect x="40" y="64" width="40" height="8" rx="1" fill={FILL_ACCENT} opacity="0.8" />
        </svg>
      );
  }
}
