import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AtelierCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'feature' | 'image';
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function AtelierCard({
  children,
  variant = 'default',
  className,
  onClick,
  href,
}: AtelierCardProps) {
  const base =
    'bg-nahkya-surface rounded-[var(--radius-md)] border border-nahkya-border overflow-hidden transition-all duration-200';

  const variants = {
    default: 'hover:border-nahkya-text-secondary/30',
    elevated:
      'shadow-card hover:shadow-lg hover:-translate-y-0.5 hover:border-nahkya-text-secondary/20',
    feature:
      'border-l-4 border-l-nahkya-accent hover:border-nahkya-text-secondary/30',
    image: 'p-0 hover:border-nahkya-text-secondary/30',
  };

  const Comp = href ? 'a' : onClick ? 'button' : 'div';

  return (
    <Comp
      {...(href ? { href } : {})}
      {...(onClick ? { onClick, type: 'button' } : {})}
      className={cn(
        base,
        variants[variant],
        (onClick || href) && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Comp>
  );
}

/* ── Card sections ── */

AtelierCard.Header = function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-6 pt-6 pb-2', className)}>
      {children}
    </div>
  );
};

AtelierCard.Title = function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn('text-heading-sm font-semibold text-nahkya-text', className)}>
      {children}
    </h3>
  );
};

AtelierCard.Description = function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-body-sm text-nahkya-text-secondary mt-1', className)}>
      {children}
    </p>
  );
};

AtelierCard.Content = function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
};

AtelierCard.Footer = function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-nahkya-border flex items-center gap-3',
        className
      )}
    >
      {children}
    </div>
  );
};

AtelierCard.Image = function CardImage({
  src,
  alt,
  className,
  aspectRatio = '4/3',
}: {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div
      className={cn('w-full overflow-hidden', className)}
      style={{ aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
};
