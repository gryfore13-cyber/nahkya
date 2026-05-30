// src/components/studio/StudioViewPill.tsx — Studio workspace view-mode segmented pill

import { cn } from '@/lib/utils';

export type StudioViewMode = 'workspace' | 'preview' | 'both';

interface StudioViewPillProps {
  value: StudioViewMode;
  onChange: (mode: StudioViewMode) => void;
}

const MODES: { key: StudioViewMode; label: string }[] = [
  { key: 'workspace', label: 'Design' },
  { key: 'preview', label: 'Preview' },
  { key: 'both', label: 'Both' },
];

export function StudioViewPill({ value, onChange }: StudioViewPillProps) {
  return (
    <div
      className={cn(
        'absolute top-4 left-1/2 -translate-x-1/2',
        'flex items-center',
        'bg-nahkya-surface/90 backdrop-blur-sm',
        'border border-nahkya-border',
        'rounded-full overflow-hidden',
        'shadow-lg shadow-black/10',
        'z-modal'
      )}
      role="radiogroup"
      aria-label="View mode"
    >
      {MODES.map((mode, index) => {
        const isActive = value === mode.key;
        const isFirst = index === 0;
        const isLast = index === MODES.length - 1;
        return (
          <button
            key={mode.key}
            onClick={() => onChange(mode.key)}
            className={cn(
              'px-4 py-1.5',
              'font-mono text-mono-sm font-semibold uppercase tracking-wide',
              'transition-colors',
              isFirst && 'rounded-l-full pl-5',
              isLast && 'rounded-r-full pr-5',
              isActive
                ? 'bg-nahkya-burgundy text-white'
                : 'text-nahkya-text-muted hover:text-nahkya-burgundy hover:bg-nahkya-gold-veil'
            )}
            role="radio"
            aria-checked={isActive}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
