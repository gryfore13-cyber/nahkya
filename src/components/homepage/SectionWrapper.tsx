import { cn } from '@/lib/utils';
import type { SectionSettings } from '@/types';

const BG_MAP: Record<string, string> = {
  'nahkya-ivory': 'bg-nahkya-ivory',
  'nahkya-cream': 'bg-nahkya-cream',
  'nahkya-stone': 'bg-nahkya-stone',
  'nahkya-taupe': 'bg-nahkya-taupe',
  'nahkya-sand': 'bg-nahkya-sand',
  'nahkya-charcoal': 'bg-nahkya-charcoal',
  'nahkya-soft-black': 'bg-nahkya-soft-black',
  'nahkya-gold': 'bg-nahkya-gold',
  'nahkya-gold-light': 'bg-nahkya-gold-light',
  'nahkya-gold-muted': 'bg-nahkya-gold-muted',
  'nahkya-text-secondary': 'bg-nahkya-text-secondary',
  'nahkya-error': 'bg-nahkya-error',
  'nahkya-success': 'bg-nahkya-success',
  'nahkya-bg': 'bg-nahkya-bg',
  'nahkya-surface': 'bg-nahkya-surface',
  'nahkya-surface-soft': 'bg-nahkya-surface-soft',
  'nahkya-surface-warm': 'bg-nahkya-surface-warm',
  'nahkya-text': 'bg-nahkya-text',
  'nahkya-text-strong': 'bg-nahkya-text-strong',
  'nahkya-text-muted': 'bg-nahkya-text-muted',
  'nahkya-text-soft': 'bg-nahkya-text-soft',
  'nahkya-text-inverse': 'bg-nahkya-text-inverse',
  'nahkya-burgundy': 'bg-nahkya-burgundy',
  'nahkya-burgundy-dark': 'bg-nahkya-burgundy-dark',
  'nahkya-burgundy-soft': 'bg-nahkya-burgundy-soft',
  'nahkya-gold-soft': 'bg-nahkya-gold-soft',
  'nahkya-gold-veil': 'bg-nahkya-gold-veil',
  'nahkya-border': 'bg-nahkya-border',
  'nahkya-border-strong': 'bg-nahkya-border-strong',
  'workspace-bg': 'bg-workspace-bg',
  'workspace-panel': 'bg-workspace-panel',
  'workspace-border': 'bg-workspace-border',
};

const TEXT_MAP: Record<string, string> = {
  'nahkya-ivory': 'text-nahkya-ivory',
  'nahkya-cream': 'text-nahkya-cream',
  'nahkya-stone': 'text-nahkya-stone',
  'nahkya-taupe': 'text-nahkya-taupe',
  'nahkya-sand': 'text-nahkya-sand',
  'nahkya-charcoal': 'text-nahkya-charcoal',
  'nahkya-soft-black': 'text-nahkya-soft-black',
  'nahkya-gold': 'text-nahkya-gold',
  'nahkya-gold-light': 'text-nahkya-gold-light',
  'nahkya-gold-muted': 'text-nahkya-gold-muted',
  'nahkya-text-secondary': 'text-nahkya-text-secondary',
  'nahkya-error': 'text-nahkya-error',
  'nahkya-success': 'text-nahkya-success',
  'nahkya-bg': 'text-nahkya-bg',
  'nahkya-surface': 'text-nahkya-surface',
  'nahkya-surface-soft': 'text-nahkya-surface-soft',
  'nahkya-surface-warm': 'text-nahkya-surface-warm',
  'nahkya-text': 'text-nahkya-text',
  'nahkya-text-strong': 'text-nahkya-text-strong',
  'nahkya-text-muted': 'text-nahkya-text-muted',
  'nahkya-text-soft': 'text-nahkya-text-soft',
  'nahkya-text-inverse': 'text-nahkya-text-inverse',
  'nahkya-burgundy': 'text-nahkya-burgundy',
  'nahkya-burgundy-dark': 'text-nahkya-burgundy-dark',
  'nahkya-burgundy-soft': 'text-nahkya-burgundy-soft',
  'nahkya-gold-soft': 'text-nahkya-gold-soft',
  'nahkya-gold-veil': 'text-nahkya-gold-veil',
  'nahkya-border': 'text-nahkya-border',
  'nahkya-border-strong': 'text-nahkya-border-strong',
  'workspace-bg': 'text-workspace-bg',
  'workspace-panel': 'text-workspace-panel',
  'workspace-border': 'text-workspace-border',
};

const PADDING_MAP: Record<string, string> = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-20',
  lg: 'py-20 md:py-24',
  xl: 'py-24 md:py-32',
};

interface SectionWrapperProps {
  settings: SectionSettings;
  children: React.ReactNode;
  className?: string;
}

const DEFAULT_SETTINGS: SectionSettings = {
  backgroundColor: 'nahkya-ivory',
  textColor: 'nahkya-text',
  padding: 'lg',
  fullWidth: false,
  isVisible: true,
};

export function SectionWrapper({ settings: rawSettings, children, className }: SectionWrapperProps) {
  const settings = rawSettings ?? DEFAULT_SETTINGS;
  if (!settings.isVisible) return null;

  const bgClass = BG_MAP[settings.backgroundColor] ?? 'bg-nahkya-ivory';
  const textClass = TEXT_MAP[settings.textColor] ?? 'text-nahkya-text';
  const paddingClass = PADDING_MAP[settings.padding] ?? PADDING_MAP.lg;

  return (
    <section
      className={cn(
        bgClass,
        textClass,
        paddingClass,
        'transition-colors duration-300',
        className
      )}
    >
      {settings.fullWidth ? (
        children
      ) : (
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {children}
        </div>
      )}
    </section>
  );
}
