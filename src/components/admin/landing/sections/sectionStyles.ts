import { cn } from '@/lib/utils';
import type { LandingSectionSettings } from '@/types/landingPage';

export function sectionPadding(value: LandingSectionSettings['padding']): string {
  switch (value) {
    case 'compact':
      return 'py-11 px-6 @landing-md:py-14 @landing-md:px-12';
    case 'luxury':
      return 'py-20 px-6 @landing-md:py-28 @landing-md:px-16';
    case 'standard':
    default:
      // Matches landing-studio.html prototype: 78px 58px desktop, 52px 22px mobile
      return 'py-landing-section-y-mobile px-landing-section-x-mobile @landing-md:py-landing-section-y @landing-md:px-landing-section-x';
  }
}

export function sectionAlignment(value: LandingSectionSettings['align']): string {
  switch (value) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    case 'center':
    default:
      return 'text-center';
  }
}

export function sectionBackground(color: string): string {
  switch (color) {
    case 'image':
      return 'bg-nahkya-text';
    case 'gradient-warm':
      return 'bg-gradient-to-br from-nahkya-surface-raised to-nahkya-landing-warm';
    case 'gradient-dark':
      return 'bg-gradient-to-br from-nahkya-text to-nahkya-accent-hover';
    case '#FFFDF8':
    case 'ivory':
      return 'bg-nahkya-landing-ivory';
    case '#F8F1E7':
    case 'cream':
      return 'bg-nahkya-landing-cream';
    case '#2C2C2C':
    case 'ink':
      return 'bg-nahkya-text';
    case '#3B0D1A':
    case 'burgundy':
      return 'bg-nahkya-accent';
    case 'surface':
      return 'bg-nahkya-surface';
    case 'transparent':
      return 'bg-transparent';
    default:
      return 'bg-nahkya-bg';
  }
}

export function sectionTextColor(color: string): string {
  switch (color) {
    case 'inverse':
      return 'text-nahkya-inverse';
    case 'text':
    default:
      return 'text-nahkya-text';
  }
}

export function sectionWrapperClasses(
  settings: LandingSectionSettings,
  extra?: string,
): string {
  return cn(
    'relative border-b border-nahkya-border last:border-b-0',
    sectionBackground(settings.backgroundColor),
    sectionTextColor(settings.textColor),
    sectionPadding(settings.padding),
    sectionAlignment(settings.align),
    !settings.isVisible && 'opacity-35',
    extra,
  );
}

export const containerClasses =
  'mx-auto w-full max-w-landing-desktop px-6 @landing-md:px-10';

export function eyebrowClasses(): string {
  return cn(
    'font-mono text-landing-eyebrow uppercase tracking-widest-alt text-nahkya-landing-rose mb-4',
  );
}

export function landingCardClasses(): string {
  return cn(
    'bg-nahkya-surface-raised/74 border border-nahkya-border rounded-landing-card p-5 text-left text-nahkya-text',
  );
}
