import { cn } from '@/lib/utils';
import { ORDER_STATUS_CONFIG } from '@/lib/constants';
import type { OrderStatus } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.submitted;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 font-mono text-mono-sm font-medium uppercase tracking-label rounded-nahkya',
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}
