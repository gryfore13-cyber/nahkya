import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'default'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'featured'
  | 'active'
  | 'inactive'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'outline';

interface AtelierBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function AtelierBadge({
  variant = 'default',
  children,
  className,
  dot = false,
}: AtelierBadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default:
      'bg-nahkya-accent-subtle text-nahkya-accent border-nahkya-accent/20',
    pending:
      'bg-nahkya-highlight-subtle text-nahkya-highlight border-nahkya-highlight/20',
    approved:
      'bg-nahkya-success-subtle text-nahkya-success border-nahkya-success/20',
    rejected:
      'bg-nahkya-error-subtle text-nahkya-error border-nahkya-error/20',
    featured:
      'bg-nahkya-accent-subtle text-nahkya-accent border-nahkya-accent/20',
    active:
      'bg-nahkya-success-subtle text-nahkya-success border-nahkya-success/20',
    inactive:
      'bg-nahkya-surface text-nahkya-muted border-nahkya-border',
    success:
      'bg-nahkya-success-subtle text-nahkya-success border-nahkya-success/20',
    error:
      'bg-nahkya-error-subtle text-nahkya-error border-nahkya-error/20',
    warning:
      'bg-nahkya-warning-subtle text-nahkya-warning border-nahkya-warning/20',
    info:
      'bg-nahkya-info-subtle text-nahkya-info border-nahkya-info/20',
    outline:
      'bg-transparent text-nahkya-text-secondary border-nahkya-border',
  };

  const dotColor: Record<BadgeVariant, string> = {
    default: 'bg-nahkya-accent',
    pending: 'bg-nahkya-highlight',
    approved: 'bg-nahkya-success',
    rejected: 'bg-nahkya-error',
    featured: 'bg-nahkya-accent',
    active: 'bg-nahkya-success',
    inactive: 'bg-nahkya-muted',
    success: 'bg-nahkya-success',
    error: 'bg-nahkya-error',
    warning: 'bg-nahkya-warning',
    info: 'bg-nahkya-info',
    outline: 'bg-nahkya-text-secondary',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-nahkya border text-xs font-medium font-body uppercase tracking-label',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor[variant])}
        />
      )}
      {children}
    </span>
  );
}
