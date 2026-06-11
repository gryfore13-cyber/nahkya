import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

export type AlertVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface AtelierAlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const config: Record<
  AlertVariant,
  { icon: LucideIcon; border: string; bg: string; iconColor: string }
> = {
  default: {
    icon: Info,
    border: 'border-l-nahkya-text-secondary',
    bg: 'bg-nahkya-surface-raised',
    iconColor: 'text-nahkya-text-secondary',
  },
  success: {
    icon: CheckCircle2,
    border: 'border-l-nahkya-success',
    bg: 'bg-nahkya-success-subtle',
    iconColor: 'text-nahkya-success',
  },
  error: {
    icon: XCircle,
    border: 'border-l-nahkya-error',
    bg: 'bg-nahkya-error-subtle',
    iconColor: 'text-nahkya-error',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-l-nahkya-warning',
    bg: 'bg-nahkya-warning-subtle',
    iconColor: 'text-nahkya-warning',
  },
  info: {
    icon: Info,
    border: 'border-l-nahkya-info',
    bg: 'bg-nahkya-info-subtle',
    iconColor: 'text-nahkya-info',
  },
};

export function AtelierAlert({
  variant = 'default',
  title,
  children,
  className,
}: AtelierAlertProps) {
  const { icon: Icon, border, bg, iconColor } = config[variant];

  return (
    <div
      role="alert"
      className={cn(
        'w-full rounded-[var(--radius-md)] border border-nahkya-border border-l-4 px-4 py-3',
        'flex items-start gap-3',
        border,
        bg,
        className
      )}
    >
      <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', iconColor)} strokeWidth={1.5} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold text-nahkya-text">{title}</p>
        )}
        <div className="text-sm text-nahkya-text-secondary">{children}</div>
      </div>
    </div>
  );
}
