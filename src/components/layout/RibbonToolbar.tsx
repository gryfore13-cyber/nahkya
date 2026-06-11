import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface RibbonGroup {
  label?: string;
  items: ReactNode[];
}

interface RibbonToolbarProps {
  groups: RibbonGroup[];
  className?: string;
}

export function RibbonToolbar({ groups, className }: RibbonToolbarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 px-3 py-1.5',
        'bg-nahkya-surface rounded-[var(--radius-md)] border border-nahkya-border',
        className
      )}
    >
      {groups.map((group, gIdx) => (
        <div key={group.label || `group-${gIdx}`} className="flex items-center">
          {gIdx > 0 && (
            <div className="w-px h-6 bg-nahkya-border mx-2" />
          )}
          {group.label && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-nahkya-muted mr-2 select-none">
              {group.label}
            </span>
          )}
          <div className="flex items-center gap-1">
            {group.items.map((item, iIdx) => (
              <div key={iIdx}>{item}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Ribbon button helpers ── */

interface RibbonButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export function RibbonButton({
  icon,
  label,
  onClick,
  active,
  disabled,
  className,
}: RibbonButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-[var(--radius-sm)]',
        'text-nahkya-text-secondary hover:text-nahkya-text hover:bg-[var(--nahkya-highlight-subtle)]',
        'transition-colors duration-150',
        active && 'text-nahkya-accent bg-[var(--nahkya-accent-subtle)]',
        disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-nahkya-text-secondary',
        className
      )}
      title={label}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      <span className="text-[10px] font-medium leading-tight">{label}</span>
    </button>
  );
}

interface RibbonActionProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'accent';
  disabled?: boolean;
  className?: string;
}

export function RibbonAction({
  icon,
  label,
  onClick,
  variant = 'default',
  disabled,
  className,
}: RibbonActionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium',
        'transition-colors duration-150',
        variant === 'default' && [
          'bg-nahkya-surface border border-nahkya-border',
          'text-nahkya-text hover:bg-[var(--nahkya-highlight-subtle)]',
        ],
        variant === 'accent' && [
          'bg-nahkya-accent text-white',
          'hover:opacity-90',
        ],
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
      title={label}
    >
      <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
