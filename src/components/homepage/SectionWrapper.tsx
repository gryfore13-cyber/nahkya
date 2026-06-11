import { cn } from '@/lib/utils';
import type { SectionSettings, SectionAnimation } from '@/types/homepage';

const BG_MAP: Record<string, string> = {
  'nahkya-ivory': 'bg-nahkya-bg',
  'nahkya-cream': 'bg-nahkya-surface',
  'nahkya-stone': 'bg-nahkya-border',
  'nahkya-taupe': 'bg-nahkya-text-secondary',
  'nahkya-sand': 'bg-nahkya-highlight',
  'nahkya-charcoal': 'bg-nahkya-text',
  'nahkya-soft-black': 'bg-nahkya-text',
  'nahkya-gold': 'bg-nahkya-highlight',
  'nahkya-gold-light': 'bg-nahkya-highlight-subtle',
  'nahkya-gold-muted': 'bg-nahkya-highlight',
  'nahkya-text-secondary': 'bg-nahkya-text-secondary',
  'nahkya-error': 'bg-nahkya-error',
  'nahkya-success': 'bg-nahkya-success',
  'nahkya-bg': 'bg-nahkya-bg',
  'nahkya-surface': 'bg-nahkya-surface',
  'nahkya-surface-soft': 'bg-nahkya-surface',
  'nahkya-surface-warm': 'bg-nahkya-surface',
  'nahkya-surface-raised': 'bg-nahkya-surface-raised',
  'nahkya-text': 'bg-nahkya-text',
  'nahkya-text-strong': 'bg-nahkya-text',
  'nahkya-text-muted': 'bg-nahkya-text-secondary',
  'nahkya-text-soft': 'bg-nahkya-text-secondary',
  'nahkya-text-inverse': 'bg-nahkya-inverse',
  'nahkya-burgundy': 'bg-nahkya-accent',
  'nahkya-burgundy-dark': 'bg-nahkya-accent-hover',
  'nahkya-burgundy-soft': 'bg-nahkya-accent-subtle',
  'nahkya-gold-soft': 'bg-nahkya-border',
  'nahkya-gold-veil': 'bg-nahkya-highlight-subtle',
  'nahkya-border': 'bg-nahkya-border',
  'nahkya-border-strong': 'bg-nahkya-border',
  'nahkya-accent': 'bg-nahkya-accent',
  'nahkya-accent-hover': 'bg-nahkya-accent-hover',
  'nahkya-accent-subtle': 'bg-nahkya-accent-subtle',
  'nahkya-highlight': 'bg-nahkya-highlight',
  'nahkya-highlight-subtle': 'bg-nahkya-highlight-subtle',
  'workspace-bg': 'bg-nahkya-bg',
  'workspace-panel': 'bg-nahkya-surface',
  'workspace-border': 'bg-nahkya-border',
};

const TEXT_MAP: Record<string, string> = {
  'nahkya-ivory': 'text-nahkya-bg',
  'nahkya-cream': 'text-nahkya-surface',
  'nahkya-stone': 'text-nahkya-border',
  'nahkya-taupe': 'text-nahkya-text-secondary',
  'nahkya-sand': 'text-nahkya-highlight',
  'nahkya-charcoal': 'text-nahkya-text',
  'nahkya-soft-black': 'text-nahkya-text',
  'nahkya-gold': 'text-nahkya-highlight',
  'nahkya-gold-light': 'text-nahkya-highlight',
  'nahkya-gold-muted': 'text-nahkya-highlight',
  'nahkya-text-secondary': 'text-nahkya-text-secondary',
  'nahkya-error': 'text-nahkya-error',
  'nahkya-success': 'text-nahkya-success',
  'nahkya-bg': 'text-nahkya-bg',
  'nahkya-surface': 'text-nahkya-surface',
  'nahkya-surface-soft': 'text-nahkya-surface',
  'nahkya-surface-warm': 'text-nahkya-surface',
  'nahkya-surface-raised': 'text-nahkya-surface-raised',
  'nahkya-text': 'text-nahkya-text',
  'nahkya-text-strong': 'text-nahkya-text',
  'nahkya-text-muted': 'text-nahkya-text-secondary',
  'nahkya-text-soft': 'text-nahkya-text-secondary',
  'nahkya-text-inverse': 'text-nahkya-inverse',
  'nahkya-burgundy': 'text-nahkya-accent',
  'nahkya-burgundy-dark': 'text-nahkya-accent-hover',
  'nahkya-burgundy-soft': 'text-nahkya-accent-subtle',
  'nahkya-gold-soft': 'text-nahkya-border',
  'nahkya-gold-veil': 'text-nahkya-highlight-subtle',
  'nahkya-border': 'text-nahkya-border',
  'nahkya-border-strong': 'text-nahkya-border',
  'nahkya-accent': 'text-nahkya-accent',
  'nahkya-accent-hover': 'text-nahkya-accent-hover',
  'nahkya-accent-subtle': 'text-nahkya-accent-subtle',
  'nahkya-highlight': 'text-nahkya-highlight',
  'nahkya-highlight-subtle': 'text-nahkya-highlight-subtle',
  'workspace-bg': 'text-nahkya-bg',
  'workspace-panel': 'text-nahkya-surface',
  'workspace-border': 'text-nahkya-border',
};

const PADDING_MAP: Record<string, string> = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-20',
  lg: 'py-20 md:py-24',
  xl: 'py-24 md:py-32',
};

const CONTAINER_WIDTH_MAP: Record<string, string> = {
  narrow: 'max-w-4xl',
  default: 'max-w-7xl',
  wide: 'max-w-[96rem]',
  full: 'max-w-none',
};

const CONTENT_ALIGNMENT_MAP: Record<string, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
};

const TEXT_ALIGN_MAP: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const BORDER_STYLE_MAP: Record<string, string> = {
  none: '',
  subtle: 'border-y border-nahkya-border/30',
  accent: 'border-y-2 border-nahkya-highlight/20',
};

const SHADOW_MAP: Record<string, string> = {
  none: '',
  soft: 'shadow-soft',
  card: 'shadow-card',
  gold: 'shadow-burgundy',
};

const DIVIDER_MAP: Record<string, string> = {
  none: '',
  subtle: 'relative before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-24 before:h-px before:bg-nahkya-border/40',
  accent: 'relative before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-32 before:h-px before:bg-nahkya-highlight/30',
};

interface SectionWrapperProps {
  settings: SectionSettings;
  children: React.ReactNode;
  className?: string;
  animation?: SectionAnimation;
}

const DEFAULT_SETTINGS: SectionSettings = {
  backgroundColor: 'nahkya-ivory',
  textColor: 'nahkya-text',
  padding: 'lg',
  fullWidth: false,
  isVisible: true,
  containerWidth: 'default',
  contentAlignment: 'center',
  textAlign: 'left',
  borderStyle: 'none',
  shadow: 'none',
  divider: 'none',
  imageShape: 'rectangle',
  mediaPosition: 'right',
  overlayOpacity: 0,
  mobileLayout: 'stacked',
  mobileTextAlign: 'center',
};

export function SectionWrapper({ settings: rawSettings, children, className, animation }: SectionWrapperProps) {
  const settings = rawSettings ?? DEFAULT_SETTINGS;
  if (!settings.isVisible) return null;

  const bgClass = BG_MAP[settings.backgroundColor] ?? 'bg-nahkya-bg';
  const textClass = TEXT_MAP[settings.textColor] ?? 'text-nahkya-text';
  const paddingClass = PADDING_MAP[settings.padding] ?? PADDING_MAP.lg;
  const containerWidthClass = CONTAINER_WIDTH_MAP[settings.containerWidth ?? 'default'] ?? CONTAINER_WIDTH_MAP.default;
  const contentAlignClass = CONTENT_ALIGNMENT_MAP[settings.contentAlignment ?? 'center'] ?? CONTENT_ALIGNMENT_MAP.center;
  const textAlignClass = TEXT_ALIGN_MAP[settings.textAlign ?? 'left'] ?? TEXT_ALIGN_MAP.left;
  const borderClass = BORDER_STYLE_MAP[settings.borderStyle ?? 'none'] ?? '';
  const shadowClass = SHADOW_MAP[settings.shadow ?? 'none'] ?? '';
  const dividerClass = DIVIDER_MAP[settings.divider ?? 'none'] ?? '';

  return (
    <section
      className={cn(
        bgClass,
        textClass,
        paddingClass,
        borderClass,
        shadowClass,
        dividerClass,
        'transition-colors duration-300',
        className
      )}
      data-animation={animation?.type ?? 'none'}
    >
      {settings.fullWidth ? (
        <div className={cn('flex flex-col', contentAlignClass, textAlignClass)}>
          {children}
        </div>
      ) : (
        <div className={cn(containerWidthClass, 'mx-auto px-6 md:px-8 lg:px-12', 'flex flex-col', contentAlignClass, textAlignClass)}>
          {children}
        </div>
      )}
    </section>
  );
}
