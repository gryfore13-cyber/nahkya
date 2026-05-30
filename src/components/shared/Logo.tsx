import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'inline' | 'stacked';
  className?: string;
}

export function Logo({ variant = 'dark', size = 'md', layout = 'inline', className }: LogoProps) {
  const sizeClasses = {
    sm: 'text-display-sm',
    md: 'text-display-md',
    lg: 'text-display-lg',
  }[size];

  const variantClasses = {
    light: 'text-nahkya-text-inverse',
    dark: 'text-nahkya-text',
    gold: 'text-nahkya-gold',
  }[variant];

  if (layout === 'stacked') {
    return (
      <div className={cn('flex flex-col items-center leading-none select-none', className)}>
        <span className="font-body text-body-xs uppercase tracking-hero-wide text-nahkya-text-muted">
          Haus of
        </span>
        <span className={cn('font-display tracking-normal', sizeClasses, variantClasses)}>
          NAHKYA
        </span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        'font-display tracking-tight leading-none select-none',
        sizeClasses,
        variantClasses,
        className
      )}
    >
      NAHKYA
    </span>
  );
}
