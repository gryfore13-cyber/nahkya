import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, X } from 'lucide-react';
import { RibbonGroup, RibbonButton, RibbonToggleGroup, RibbonToggle, RibbonColorPicker } from '@/components/shared/Ribbon';
import type { LandingStudioState, LandingApi } from '@/components/admin/landing/LandingRibbon';
import type { LandingTextStyle } from '@/types/landingPage';

interface FontPanelProps {
  state: LandingStudioState | null;
  callApi: <K extends keyof LandingApi>(method: K, ...args: Parameters<LandingApi[K]>) => ReturnType<LandingApi[K]> | undefined;
}

const PRESET_COLORS = [
  '#1A1512',
  '#F5EDE3',
  '#FFFFFF',
  '#C8A66A',
  '#B8704D',
  '#3B0D1A',
  '#D4C4B0',
  '#8B0000',
];

export function FontPanel({ state, callApi }: FontPanelProps) {
  const path = state?.selectedTextPath ?? null;
  const style = state?.selectedTextStyle ?? {};
  const disabled = !path;

  const toggle = (key: keyof LandingTextStyle) => {
    if (disabled) return;
    const current = !!style[key];
    callApi('applyTextStyle', { [key]: !current } as Partial<LandingTextStyle>);
  };

  const setAlign = (align: LandingTextStyle['align']) => {
    if (disabled) return;
    callApi('applyTextStyle', { align });
  };

  const setColor = (color: string) => {
    if (disabled) return;
    callApi('applyTextStyle', { color });
  };

  const clearColor = () => {
    if (disabled) return;
    callApi('applyTextStyle', { color: undefined });
  };

  return (
    <>
      <RibbonGroup title="Style">
        <RibbonToggleGroup>
          <RibbonToggle active={style.bold} onClick={() => toggle('bold')} disabled={disabled} title="Bold">
            <Bold className="w-4 h-4" />
          </RibbonToggle>
          <RibbonToggle active={style.italic} onClick={() => toggle('italic')} disabled={disabled} title="Italic">
            <Italic className="w-4 h-4" />
          </RibbonToggle>
          <RibbonToggle active={style.underline} onClick={() => toggle('underline')} disabled={disabled} title="Underline">
            <Underline className="w-4 h-4" />
          </RibbonToggle>
        </RibbonToggleGroup>
      </RibbonGroup>

      <RibbonGroup title="Alignment">
        <RibbonToggleGroup>
          <RibbonToggle active={style.align === 'left' || !style.align} onClick={() => setAlign('left')} disabled={disabled} title="Align left">
            <AlignLeft className="w-4 h-4" />
          </RibbonToggle>
          <RibbonToggle active={style.align === 'center'} onClick={() => setAlign('center')} disabled={disabled} title="Align center">
            <AlignCenter className="w-4 h-4" />
          </RibbonToggle>
          <RibbonToggle active={style.align === 'right'} onClick={() => setAlign('right')} disabled={disabled} title="Align right">
            <AlignRight className="w-4 h-4" />
          </RibbonToggle>
        </RibbonToggleGroup>
      </RibbonGroup>

      <RibbonGroup title="Colour">
        <div className="flex items-center gap-2">
          <RibbonColorPicker colors={PRESET_COLORS} value={style.color} onSelect={setColor} />
          <RibbonButton label="Default" icon={<X className="w-3.5 h-3.5" />} onClick={clearColor} disabled={disabled} />
        </div>
      </RibbonGroup>

      {!path && (
        <div className="flex items-center px-4 text-body-xs text-nahkya-text-secondary">
          Select a text element on the canvas to format it.
        </div>
      )}
    </>
  );
}
