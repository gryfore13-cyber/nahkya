import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';

interface AtelierDashboardWidgetProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  change?: number;
  changeLabel?: string;
  accent?: 'default' | 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

export function AtelierDashboardWidget({
  label,
  value,
  icon: Icon,
  change,
  changeLabel,
  accent = 'default',
  className,
}: AtelierDashboardWidgetProps) {
  const accentBorder = {
    default: 'border-l-nahkya-accent',
    success: 'border-l-nahkya-success',
    error: 'border-l-nahkya-error',
    warning: 'border-l-nahkya-warning',
    info: 'border-l-nahkya-info',
  };

  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        'bg-nahkya-surface rounded-[var(--radius-md)] border border-nahkya-border border-l-4 px-5 py-4',
        'flex items-start justify-between gap-4',
        accentBorder[accent],
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-body-xs text-nahkya-text-secondary font-medium uppercase tracking-label">
          {label}
        </p>
        <p className="text-heading-md font-semibold text-nahkya-text mt-1">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1.5">
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-nahkya-success" strokeWidth={2} />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-nahkya-error" strokeWidth={2} />
            )}
            <span
              className={cn(
                'text-body-xs font-medium',
                isPositive ? 'text-nahkya-success' : 'text-nahkya-error'
              )}
            >
              {isPositive ? '+' : ''}
              {change}%
            </span>
            {changeLabel && (
              <span className="text-body-xs text-nahkya-muted">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
      {Icon && (
        <div className="w-9 h-9 rounded-[var(--radius-md)] bg-nahkya-surface-raised border border-nahkya-border flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-nahkya-text-secondary" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}
