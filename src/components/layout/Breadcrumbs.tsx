import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-sm', className)}
    >
      <Link
        to="/"
        className="flex items-center gap-1 text-nahkya-text-secondary hover:text-nahkya-accent transition-colors"
      >
        <Home className="w-3.5 h-3.5" strokeWidth={1.5} />
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-nahkya-border shrink-0" strokeWidth={1.5} />
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-nahkya-text-secondary hover:text-nahkya-accent transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'text-nahkya-text',
                  isLast && 'font-medium'
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
