import { Play, Wind, ZoomIn, Ban } from 'lucide-react';
import { RibbonGroup, RibbonButton, RibbonToggleGroup, RibbonToggle } from '@/components/shared/Ribbon';
import type { LandingStudioState, LandingApi } from '@/components/admin/landing/LandingRibbon';

interface MotionPanelProps {
  state: LandingStudioState | null;
  callApi: <K extends keyof LandingApi>(
    method: K,
    ...args: Parameters<LandingApi[K]>
  ) => ReturnType<LandingApi[K]> | undefined;
}

const MOTIONS = [
  { value: 'none', label: 'None', icon: <Ban className="w-4 h-4" /> },
  { value: 'fade', label: 'Fade', icon: <Wind className="w-4 h-4" /> },
  { value: 'reveal', label: 'Reveal', icon: <Play className="w-4 h-4" /> },
  { value: 'zoom', label: 'Zoom', icon: <ZoomIn className="w-4 h-4" /> },
] as const;

export function MotionPanel({ state, callApi }: MotionPanelProps) {
  const hasSelection = !!state?.id;
  const current = state?.motion ?? 'none';

  return (
    <>
      <RibbonGroup title="Motion">
        <RibbonToggleGroup>
          {MOTIONS.map((motion) => (
            <RibbonToggle
              key={motion.value}
              disabled={!hasSelection}
              active={current === motion.value}
              onClick={() => callApi('setMotion', motion.value)}
              title={motion.label}
            >
              {motion.icon}
            </RibbonToggle>
          ))}
        </RibbonToggleGroup>
      </RibbonGroup>

      <RibbonGroup title="Preview">
        <RibbonButton
          icon={<Play className="w-4 h-4" />}
          label="Preview"
          onClick={() => callApi('previewMotion')}
          disabled={!hasSelection}
        />
      </RibbonGroup>
    </>
  );
}
