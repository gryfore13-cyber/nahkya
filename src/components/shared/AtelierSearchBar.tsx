import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AtelierSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function AtelierSearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  autoFocus,
}: AtelierSearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-secondary pointer-events-none"
        strokeWidth={1.5}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full h-10 pl-10 pr-9',
          'bg-nahkya-surface border border-nahkya-border',
          'rounded-[var(--radius-pill)]',
          'text-sm text-nahkya-text placeholder:text-nahkya-text-secondary',
          'focus:outline-none focus:border-nahkya-accent focus:ring-1 focus:ring-nahkya-accent/20',
          'transition-colors duration-150',
          'font-body'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-border transition-colors"
          type="button"
          aria-label="Clear search"
        >
          <X className="w-3 h-3" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
