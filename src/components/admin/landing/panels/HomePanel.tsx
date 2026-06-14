import { useEffect, useRef } from 'react';
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Type,
  Image,
  Upload,
  ImageOff,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Link,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SettingsToggle } from '@/components/admin/SettingsPanelPrimitives';
import {
  RibbonGroup,
  RibbonButton,
  RibbonToggleGroup,
  RibbonToggle,
} from '@/components/shared/Ribbon';
import { useLandingPageStore } from '@/stores/landingPageStore';
import type { LandingStudioState, LandingApi } from '@/components/admin/landing/LandingRibbon';

interface HomePanelProps {
  state: LandingStudioState | null;
  callApi: <K extends keyof LandingApi>(method: K, ...args: Parameters<LandingApi[K]>) => void;
  canMove: boolean;
}

export function HomePanel({ state, callApi, canMove }: HomePanelProps) {
  const hasSelection = !!state?.id;
  const isNav = state?.isNav ?? false;
  const { config, selectedNavLinkIndex, selectNavLinkIndex } = useLandingPageStore();
  const labelRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);

  const links: { index: number; label: string; target: string }[] = isNav ? callApi('getNavLinks') ?? [] : [];
  const safeIndex = Math.min(selectedNavLinkIndex, Math.max(0, links.length - 1));
  const selectedLink = links[safeIndex] ?? null;

  useEffect(() => {
    if (labelRef.current) labelRef.current.value = selectedLink?.label ?? '';
    if (targetRef.current) targetRef.current.value = selectedLink?.target ?? '#';
  }, [selectedLink]);

  const handleUpdateLink = () => {
    callApi('updateNavLink', safeIndex, labelRef.current?.value ?? '', targetRef.current?.value ?? '#');
  };

  const handleAddLink = () => {
    callApi('addNavLink', labelRef.current?.value || 'New link', targetRef.current?.value || '#');
  };

  const handleRemoveLink = () => {
    callApi('removeNavLink', safeIndex);
    selectNavLinkIndex(Math.max(0, safeIndex - 1));
  };

  const handleMoveLink = (dir: 'left' | 'right') => {
    callApi('moveNavLink', dir);
  };

  return (
    <>
      {!isNav && (
        <RibbonGroup title="Section">
          <RibbonButton
            icon={<Copy className="w-4 h-4" />}
            label="Duplicate"
            onClick={() => callApi('duplicateSelected')}
            disabled={!hasSelection}
          />
          <RibbonButton
            icon={<Trash2 className="w-4 h-4" />}
            label="Delete"
            onClick={() => callApi('deleteSelected')}
            disabled={!hasSelection}
          />
          <RibbonButton
            icon={<ArrowUp className="w-4 h-4" />}
            label="Move Up"
            onClick={() => callApi('moveSection', 'up')}
            disabled={!canMove}
          />
          <RibbonButton
            icon={<ArrowDown className="w-4 h-4" />}
            label="Move Down"
            onClick={() => callApi('moveSection', 'down')}
            disabled={!canMove}
          />
        </RibbonGroup>
      )}

      <RibbonGroup title="Visibility">
        <RibbonButton
          icon={state?.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          label={state?.isVisible ? 'Hide' : 'Show'}
          onClick={() => callApi('toggleVisibility')}
          disabled={!hasSelection || isNav}
          active={state?.isVisible}
        />
        <RibbonButton
          icon={state?.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          label={state?.locked ? 'Unlock' : 'Lock'}
          onClick={() => callApi('toggleLock')}
          disabled={!hasSelection}
          active={state?.locked}
        />
      </RibbonGroup>

      {isNav && (
        <>
          <RibbonGroup title="Logo & CTA">
            <Input
              value={config.nav.logoText}
              onChange={(e) => callApi('updateNavContent', e.target.value, config.nav.ctaText)}
              placeholder="Logo text"
              className="h-8 w-40 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm"
            />
            <Input
              value={config.nav.ctaText}
              onChange={(e) => callApi('updateNavContent', config.nav.logoText, e.target.value)}
              placeholder="CTA text"
              className="h-8 w-40 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm"
            />
            <Input
              value={config.nav.contactText ?? ''}
              onChange={(e) => callApi('updateNavContact', e.target.value, config.nav.contactTarget ?? '/contact')}
              placeholder="Contact text"
              className="h-8 w-36 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm"
            />
            <Input
              value={config.nav.contactTarget ?? ''}
              onChange={(e) => callApi('updateNavContact', config.nav.contactText ?? 'Contact', e.target.value)}
              placeholder="Contact target"
              className="h-8 w-36 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm"
            />
          </RibbonGroup>

          <RibbonGroup title="Logo">
            <RibbonButton
              icon={<Type className="w-4 h-4" />}
              label="Text"
              onClick={() => callApi('applyLogoMode', 'text')}
              active={state?.logoMode === 'text'}
            />
            <RibbonButton
              icon={<Image className="w-4 h-4" />}
              label="Image"
              onClick={() => callApi('applyLogoMode', 'image')}
              active={state?.logoMode === 'image'}
            />
            <RibbonButton
              icon={<Upload className="w-4 h-4" />}
              label="Upload"
              onClick={() => document.getElementById('landing-logo-upload')?.click()}
            />
            <RibbonButton
              icon={<ImageOff className="w-4 h-4" />}
              label="Remove"
              onClick={() => callApi('removeLogoImage')}
            />
            <input
              id="landing-logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await readFile(file);
                callApi('setLogoImage', url);
                e.currentTarget.value = '';
              }}
            />
            <div className="flex items-center gap-2">
              <Label className="text-body-xs text-nahkya-text-secondary whitespace-nowrap">Size</Label>
              <input
                type="range"
                min={28}
                max={72}
                defaultValue={38}
                onChange={(e) => callApi('setLogoSize', Number(e.target.value))}
                className="w-24 accent-nahkya-accent"
              />
            </div>
          </RibbonGroup>

          <RibbonGroup title="Links">
            <Select value={String(safeIndex)} onValueChange={(v) => selectNavLinkIndex(Number(v))}>
              <SelectTrigger className="h-8 w-44 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm">
                <SelectValue placeholder="Select link" />
              </SelectTrigger>
              <SelectContent>
                {links.map((l) => (
                  <SelectItem key={l.index} value={String(l.index)}>
                    {l.label} → {l.target}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              key={`label-${safeIndex}`}
              ref={labelRef}
              defaultValue={selectedLink?.label ?? ''}
              placeholder="Label"
              className="h-8 w-32 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm"
            />
            <Input
              key={`target-${safeIndex}`}
              ref={targetRef}
              defaultValue={selectedLink?.target ?? '#'}
              placeholder="#target"
              className="h-8 w-32 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm"
            />
            <RibbonButton icon={<Plus className="w-4 h-4" />} label="Update" onClick={handleUpdateLink} disabled={!links.length} />
            <RibbonButton icon={<Plus className="w-4 h-4" />} label="Add" onClick={handleAddLink} />
            <RibbonButton icon={<Minus className="w-4 h-4" />} label="Remove" onClick={handleRemoveLink} disabled={links.length <= 1} />
            <RibbonButton icon={<ArrowLeft className="w-4 h-4" />} label="Left" onClick={() => handleMoveLink('left')} disabled={safeIndex <= 0} />
            <RibbonButton icon={<ArrowRight className="w-4 h-4" />} label="Right" onClick={() => handleMoveLink('right')} disabled={safeIndex >= links.length - 1} />
            <RibbonButton icon={<Link className="w-4 h-4" />} label="Auto-link" onClick={() => callApi('autoLinkSections')} />
          </RibbonGroup>

          <RibbonGroup title="Sticky">
            <SettingsToggle label="Sticky" checked={state?.sticky ?? true} onChange={(v) => callApi('setSticky', v)} />
            <Select value={state?.stickyBehavior ?? 'always'} onValueChange={(v) => callApi('setStickyBehavior', v)}>
              <SelectTrigger className="h-8 w-36 bg-nahkya-bg border-nahkya-border rounded-nahkya text-body-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always</SelectItem>
                <SelectItem value="scroll">On scroll</SelectItem>
              </SelectContent>
            </Select>
          </RibbonGroup>

          <RibbonGroup title="Nav Style">
            <RibbonToggleGroup>
              <RibbonToggle active={state?.navStyle === 'solid'} onClick={() => callApi('applyNavStyle', 'solid')}>
                Solid
              </RibbonToggle>
              <RibbonToggle active={state?.navStyle === 'transparent'} onClick={() => callApi('applyNavStyle', 'transparent')}>
                Transparent
              </RibbonToggle>
              <RibbonToggle active={state?.navStyle === 'floating'} onClick={() => callApi('applyNavStyle', 'floating')}>
                Floating
              </RibbonToggle>
            </RibbonToggleGroup>
          </RibbonGroup>
        </>
      )}
    </>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
