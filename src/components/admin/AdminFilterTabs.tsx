import { cn } from '@/lib/utils';

export interface FilterTab {
  key: string;
  label: string;
}

interface AdminFilterTabsProps {
  tabs: FilterTab[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export function AdminFilterTabs({ tabs, active, onChange, className }: AdminFilterTabsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1 p-1 bg-nahkya-surface border border-nahkya-border rounded-nahkya',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'px-4 py-2 font-body text-sm rounded-nahkya transition-colors',
            active === tab.key
              ? 'bg-nahkya-accent text-nahkya-inverse'
              : 'text-nahkya-text-secondary hover:text-nahkya-text'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
