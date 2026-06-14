import { useRef } from 'react';
import { Upload, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RibbonGroup,
  RibbonButton,
  RibbonColorPicker,
  RibbonToggleGroup,
  RibbonToggle,
} from '@/components/shared/Ribbon';
import type { LandingStudioState, LandingApi } from '@/components/admin/landing/LandingRibbon';

interface PicturePanelProps {
  state: LandingStudioState | null;
  callApi: <K extends keyof LandingApi>(
    method: K,
    ...args: Parameters<LandingApi[K]>
  ) => ReturnType<LandingApi[K]> | undefined;
}

const SOLID_COLORS = [
  { value: '#F8F1E7', label: 'Warm Cream' },
  { value: '#FFFDF8', label: 'Ivory' },
  { value: '#3B0D1A', label: 'Burgundy' },
  { value: '#596341', label: 'Olive' },
  { value: '#201B18', label: 'Ink' },
];

const GRADIENTS = [
  { value: 'warm', label: 'Warm Ivory' },
  { value: 'burgundy', label: 'Burgundy Gold' },
  { value: 'olive', label: 'Olive Atelier' },
  { value: 'editorial', label: 'Editorial Dark' },
];

const POSITION_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top left', label: 'Top Left' },
  { value: 'top right', label: 'Top Right' },
  { value: 'bottom left', label: 'Bottom Left' },
  { value: 'bottom right', label: 'Bottom Right' },
];

const OVERLAY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'burgundy', label: 'Burgundy' },
];

export function PicturePanel({ state, callApi }: PicturePanelProps) {
  const hasSelection = !!state?.id;
  const pictureInputRef = useRef<HTMLInputElement>(null);
  const slotInputRef = useRef<HTMLInputElement>(null);

  const bgType = state?.bg ?? 'solid';
  const activeSlot = state?.activeSlotId;

  const handleFile = async (file: File, onDataUrl: (url: string) => void, input: HTMLInputElement | null) => {
    const url = await readFileAsDataUrl(file);
    onDataUrl(url);
    if (input) input.value = '';
  };

  return (
    <>
      {activeSlot && (
        <RibbonGroup title="Media Slot">
          <RibbonButton
            icon={<Upload className="w-4 h-4" />}
            label="Replace"
            onClick={() => slotInputRef.current?.click()}
          />
          <input
            ref={slotInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file, (url) => callApi('replaceMedia', url), slotInputRef.current);
            }}
          />
          <RibbonButton
            icon={<ImageOff className="w-4 h-4" />}
            label="Remove"
            onClick={() => callApi('removeMedia')}
            disabled={!state?.activeSlotHasImage}
          />
        </RibbonGroup>
      )}

      <RibbonGroup title="Background">
        <RibbonToggleGroup>
          <RibbonToggle
            disabled={!hasSelection}
            active={bgType === 'solid'}
            onClick={() => callApi('applySolid', state?.solidColor || '#F8F1E7')}
          >
            Solid
          </RibbonToggle>
          <RibbonToggle
            disabled={!hasSelection}
            active={bgType === 'gradient'}
            onClick={() => callApi('applyGradient', state?.gradient || 'warm')}
          >
            Gradient
          </RibbonToggle>
          <RibbonToggle disabled={!hasSelection} active={bgType === 'image'} onClick={() => callApi('applyPicture', '')}>
            Picture
          </RibbonToggle>
        </RibbonToggleGroup>
      </RibbonGroup>

      {bgType === 'solid' && (
        <RibbonGroup title="Solid">
          <RibbonColorPicker
            colors={SOLID_COLORS.map((c) => c.value)}
            value={state?.solidColor}
            onSelect={(color) => callApi('applySolid', color)}
          />
        </RibbonGroup>
      )}

      {bgType === 'gradient' && (
        <RibbonGroup title="Gradient">
          <Select
            value={state?.gradient || 'warm'}
            onValueChange={(v) => callApi('applyGradient', v)}
            disabled={!hasSelection}
          >
            <SelectTrigger className="h-8 w-44 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GRADIENTS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </RibbonGroup>
      )}

      {bgType === 'image' && (
        <RibbonGroup title="Picture">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => pictureInputRef.current?.click()}
            disabled={!hasSelection}
            className="h-8 px-2.5 border-nahkya-border bg-nahkya-bg text-nahkya-text hover:bg-nahkya-surface rounded-nahkya text-body-sm"
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            Replace
          </Button>
          <input
            ref={pictureInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file, (url) => callApi('applyPicture', `url('${url}')`), pictureInputRef.current);
            }}
          />
          <RibbonButton
            label="Remove"
            icon={<ImageOff className="w-4 h-4" />}
            onClick={() => callApi('removeMedia')}
            disabled={!state?.activeSlotHasImage}
          />
          <Select
            value={state?.backgroundPosition || 'center'}
            onValueChange={(v) => callApi('setBackgroundPosition', v)}
            disabled={!hasSelection}
          >
            <SelectTrigger className="h-8 w-40 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSITION_OPTIONS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  Move: {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </RibbonGroup>
      )}

      <RibbonGroup title="Overlay">
        <Select
          value={state?.overlay || 'none'}
          onValueChange={(v) => callApi('applyOverlay', v, state?.opacity ?? 35)}
          disabled={!hasSelection}
        >
          <SelectTrigger className="h-8 w-36 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OVERLAY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 w-32">
          <Slider
            value={[state?.opacity ?? 35]}
            min={0}
            max={90}
            step={1}
            onValueChange={(v) => callApi('applyOverlay', state?.overlay || 'none', v[0])}
            disabled={!hasSelection || state?.overlay === 'none'}
          />
        </div>
        <span className="text-body-xs text-nahkya-text-secondary font-mono w-8">{state?.opacity ?? 35}%</span>
      </RibbonGroup>
    </>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
