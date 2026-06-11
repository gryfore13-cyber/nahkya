import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface AtelierEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function AtelierEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: AtelierEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-16 px-6',
        className
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-nahkya-surface-raised border border-nahkya-border flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-nahkya-text-secondary" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-heading-sm font-semibold text-nahkya-text">{title}</h3>
      {description && (
        <p className="text-body-sm text-nahkya-text-secondary mt-2 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
