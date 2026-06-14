import { cn } from '@/lib/utils';

interface PublicPageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  variant?: 'dark' | 'light';
  className?: string;
}

export function PublicPageHero({
  eyebrow,
  title,
  description,
  variant = 'dark',
  className,
}: PublicPageHeroProps) {
  const isDark = variant === 'dark';

  return (
    <div
      className={cn(
        'py-20 lg:py-24 px-5',
        isDark
          ? 'bg-nahkya-text text-nahkya-inverse'
          : 'bg-nahkya-bg text-nahkya-text',
        className,
      )}
    >
      <div className="max-w-4xl mx-auto text-center">
        {eyebrow && (
          <p
            className={cn(
              'font-mono text-mono-sm uppercase tracking-hero-wide mb-6',
              isDark ? 'text-nahkya-highlight' : 'text-nahkya-highlight',
            )}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            'font-display text-display-md lg:text-display-lg font-medium mb-4',
            isDark ? 'text-nahkya-bg' : 'text-nahkya-text',
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              'font-body text-body-lg max-w-xl mx-auto',
              isDark ? 'text-nahkya-bg' : 'text-nahkya-text-secondary',
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
