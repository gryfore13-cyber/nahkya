import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface AtelierTopBarProps {
  /** Page title shown in the center */
  title: string;
  /** Optional description shown below title */
  subtitle?: string;
  /** Left slot — breadcrumbs, back button, etc. */
  left?: ReactNode;
  /** Right slot — action buttons, filters, etc. */
  right?: ReactNode;
  /** Additional toolbar rows rendered below the main bar */
  ribbon?: ReactNode;
  className?: string;
}

export function AtelierTopBar({
  title,
  subtitle,
  left,
  right,
  ribbon,
  className,
}: AtelierTopBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-nahkya-surface/95 backdrop-blur-md',
        'border-b border-nahkya-border',
        'transition-[border-color,background-color] duration-300',
        className
      )}
    >
      {/* Main bar */}
      <div className="flex items-center h-toolbar px-8">
        {/* Left */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {left}
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-nahkya-text truncate leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-nahkya-text-secondary truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          {right}
          <div className="w-px h-6 bg-nahkya-border mx-1" />
          <ThemeToggle />
        </div>
      </div>

      {/* Ribbon toolbar */}
      {ribbon && (
        <div className="flex items-center gap-2 px-8 py-2 bg-nahkya-surface/80 border-t border-nahkya-border">
          {ribbon}
        </div>
      )}
    </header>
  );
}
