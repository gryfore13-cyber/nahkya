// src/components/studio/StudioViewPill.tsx — Studio workspace view-mode segmented pill

import { cn } from '@/lib/utils';

export type StudioViewMode = 'workspace' | 'preview';

interface StudioViewPillProps {
  value: StudioViewMode;
  onChange: (mode: StudioViewMode) => void;
  className?: string;
}

const MODES: { key: StudioViewMode; label: string }[] = [
  { key: 'workspace', label: 'Design' },
  { key: 'preview', label: 'Preview' },
];

export function StudioViewPill({ value, onChange, className }: StudioViewPillProps) {
  return (
    <div
      className={cn('nk-zoom-controls', className)}
      role="radiogroup"
      aria-label="View mode"
    >
      {MODES.map((mode) => {
        const isActive = value === mode.key;
        return (
          <button
            key={mode.key}
            onClick={() => onChange(mode.key)}
            className={cn('nk-zoom-pill', isActive && 'is-active')}
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
