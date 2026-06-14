import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { RibbonGroup, RibbonToggleGroup, RibbonToggle } from '@/components/shared/Ribbon';
import type { LandingStudioState, LandingApi } from '@/components/admin/landing/LandingRibbon';

interface LayoutPanelProps {
  state: LandingStudioState | null;
  callApi: <K extends keyof LandingApi>(
    method: K,
    ...args: Parameters<LandingApi[K]>
  ) => ReturnType<LandingApi[K]> | undefined;
}

const SPACING_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'standard', label: 'Standard' },
  { value: 'luxury', label: 'Luxury' },
] as const;

export function LayoutPanel({ state, callApi }: LayoutPanelProps) {
  const hasSelection = !!state?.id;
  const currentSpacing = state?.spacing ?? 'standard';
  const currentAlign = state?.align ?? 'center';

  return (
    <>
      <RibbonGroup title="Spacing">
        <RibbonToggleGroup>
          {SPACING_OPTIONS.map((option) => (
            <RibbonToggle
              key={option.value}
              disabled={!hasSelection}
              active={currentSpacing === option.value}
              onClick={() => callApi('setSpacing', option.value)}
            >
              {option.label}
            </RibbonToggle>
          ))}
        </RibbonToggleGroup>
      </RibbonGroup>

      <RibbonGroup title="Align">
        <RibbonToggleGroup>
          <RibbonToggle
            disabled={!hasSelection}
            active={currentAlign === 'left'}
            onClick={() => callApi('setAlign', 'left')}
            title="Left"
          >
            <AlignLeft className="w-4 h-4" />
          </RibbonToggle>
          <RibbonToggle
            disabled={!hasSelection}
            active={currentAlign === 'center'}
            onClick={() => callApi('setAlign', 'center')}
            title="Center"
          >
            <AlignCenter className="w-4 h-4" />
          </RibbonToggle>
          <RibbonToggle
            disabled={!hasSelection}
            active={currentAlign === 'right'}
            onClick={() => callApi('setAlign', 'right')}
            title="Right"
          >
            <AlignRight className="w-4 h-4" />
          </RibbonToggle>
        </RibbonToggleGroup>
      </RibbonGroup>

      <RibbonGroup title="Rule">
        <span className="text-body-xs text-nahkya-text-secondary font-body whitespace-nowrap">
          Alignment sets text flow. Spacing controls section breathing room.
        </span>
      </RibbonGroup>
    </>
  );
}
