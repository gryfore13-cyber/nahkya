import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { RibbonGroup, RibbonToggleGroup, RibbonToggle } from '@/components/shared/Ribbon';
import type { LandingStudioState, LandingApi } from '@/components/admin/landing/LandingRibbon';

interface ResponsivePanelProps {
  state: LandingStudioState | null;
  callApi: <K extends keyof LandingApi>(
    method: K,
    ...args: Parameters<LandingApi[K]>
  ) => ReturnType<LandingApi[K]> | undefined;
}

const MODES = [
  { value: 'mobile', label: '390', icon: <Smartphone className="w-4 h-4" /> },
  { value: 'tablet', label: '768', icon: <Tablet className="w-4 h-4" /> },
  { value: 'desktop', label: 'Desktop', icon: <Monitor className="w-4 h-4" /> },
] as const;

export function ResponsivePanel({ state, callApi }: ResponsivePanelProps) {
  const current = state?.previewMode ?? 'desktop';

  return (
    <>
      <RibbonGroup title="Preview">
        <RibbonToggleGroup>
          {MODES.map((mode) => (
            <RibbonToggle
              key={mode.value}
              active={current === mode.value}
              onClick={() => callApi('setPreviewMode', mode.value)}
              title={mode.label}
            >
              {mode.icon}
            </RibbonToggle>
          ))}
        </RibbonToggleGroup>
      </RibbonGroup>

      <RibbonGroup title="Rule">
        <span className="text-body-xs text-nahkya-text-secondary font-body whitespace-nowrap">
          Sections must be redesigned per breakpoint, not squeezed.
        </span>
      </RibbonGroup>
    </>
  );
}
