import { useState } from 'react';
import {
  Type,
  Layout,
  Palette,
  Sparkles,
  Smartphone,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  HomepageSection,
  SectionSettings,
  SectionAnimation,
  SectionResponsiveSettings,
  ResponsiveBreakpointSettings,
  SectionStatus,
} from '@/types/homepage';
import { TEMPLATE_LABELS } from '@/types/homepage';

const BG_COLOR_OPTIONS = [
  { value: 'nahkya-bg', label: 'Ivory' },
  { value: 'nahkya-surface', label: 'Cream' },
  { value: 'nahkya-surface-raised', label: 'White' },
  { value: 'nahkya-accent', label: 'Burgundy' },
  { value: 'nahkya-accent-subtle', label: 'Burgundy Soft' },
  { value: 'nahkya-highlight', label: 'Gold' },
  { value: 'nahkya-highlight-subtle', label: 'Gold Soft' },
  { value: 'nahkya-text', label: 'Charcoal' },
  { value: 'nahkya-border', label: 'Stone' },
];

const TEXT_COLOR_OPTIONS = [
  { value: 'nahkya-text', label: 'Primary' },
  { value: 'nahkya-text-secondary', label: 'Secondary' },
  { value: 'nahkya-inverse', label: 'Inverse' },
  { value: 'nahkya-accent', label: 'Burgundy' },
  { value: 'nahkya-highlight', label: 'Gold' },
  { value: 'nahkya-bg', label: 'Light' },
];

const PADDING_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const CONTAINER_WIDTH_OPTIONS = [
  { value: 'narrow', label: 'Narrow' },
  { value: 'default', label: 'Default' },
  { value: 'wide', label: 'Wide' },
  { value: 'full', label: 'Full Width' },
];

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const CONTENT_ALIGNMENT_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'center', label: 'Center' },
  { value: 'bottom', label: 'Bottom' },
];

const BORDER_STYLE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'accent', label: 'Accent' },
];

const SHADOW_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'soft', label: 'Soft' },
  { value: 'card', label: 'Card' },
  { value: 'gold', label: 'Gold' },
];

const DIVIDER_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'accent', label: 'Accent' },
];

const IMAGE_SHAPE_OPTIONS = [
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
  { value: 'arch', label: 'Arch' },
];

const MEDIA_POSITION_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'background', label: 'Background' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
];

const ANIMATION_TYPE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'fadeIn', label: 'Fade In' },
  { value: 'slideUp', label: 'Slide Up' },
  { value: 'softReveal', label: 'Soft Reveal' },
  { value: 'staggeredCards', label: 'Staggered Cards' },
  { value: 'gentleScale', label: 'Gentle Scale' },
  { value: 'imageParallax', label: 'Image Parallax' },
  { value: 'sectionOverlap', label: 'Section Overlap' },
  { value: 'softDivider', label: 'Soft Divider' },
];

const ANIMATION_DURATION_OPTIONS = [
  { value: 'fast', label: 'Fast' },
  { value: 'normal', label: 'Normal' },
  { value: 'slow', label: 'Slow' },
];

const STATUS_OPTIONS: { value: SectionStatus; label: string; color: string }[] = [
  { value: 'published', label: 'Published', color: 'bg-nahkya-success' },
  { value: 'draft', label: 'Draft', color: 'bg-nahkya-highlight' },
  { value: 'hidden', label: 'Hidden', color: 'bg-nahkya-text-secondary' },
];

const LAYOUT_OPTIONS = [
  { value: 'stacked', label: 'Stacked' },
  { value: 'twoColumn', label: 'Two Column' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'grid', label: 'Grid' },
  { value: 'carousel', label: 'Carousel' },
];

const ASPECT_RATIO_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '1:1', label: '1:1 Square' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4 Portrait' },
  { value: '4:5', label: '4:5 Portrait' },
  { value: '16:9', label: '16:9 Widescreen' },
];

type TabKey = 'content' | 'layout' | 'style' | 'animation' | 'responsive';

interface SectionSettingsPanelProps {
  section: HomepageSection | null;
  onUpdateSettings: (id: string, updates: Partial<SectionSettings>) => void;
  onUpdateAnimation: (id: string, animation: Partial<SectionAnimation>) => void;
  onUpdateResponsive: (id: string, responsive: Partial<SectionResponsiveSettings>) => void;
  onUpdateStatus: (id: string, status: SectionStatus) => void;
  onUpdateName: (id: string, name: string) => void;
}

function SettingsSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-body text-body-sm text-nahkya-text-secondary">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 px-3 pr-8 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm text-nahkya-text focus:outline-none focus:ring-2 focus:ring-nahkya-highlight/50 appearance-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-nahkya-text-secondary pointer-events-none" />
      </div>
    </div>
  );
}

function SettingsToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-body text-body-sm text-nahkya-text-secondary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'w-10 h-5 rounded-full transition-colors relative',
          checked ? 'bg-nahkya-highlight' : 'bg-nahkya-border'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
            checked ? 'left-5' : 'left-0.5'
          )}
        />
      </button>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">{title}</h4>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

export function SectionSettingsPanel({
  section,
  onUpdateSettings,
  onUpdateAnimation,
  onUpdateResponsive,
  onUpdateStatus,
  onUpdateName,
}: SectionSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('content');

  if (!section) {
    return (
      <div className="flex flex-col h-full bg-nahkya-surface border-l border-nahkya-border">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Layout size={24} className="mx-auto text-nahkya-text-secondary/30 mb-3" />
            <p className="font-body text-body-sm text-nahkya-text-secondary">Select a section to edit its settings</p>
          </div>
        </div>
      </div>
    );
  }

  const settings = section.settings;
  const animation = section.animation;

  const responsive = section.responsive ?? {};
  const status = section.status ?? 'published';

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'content', label: 'Content', icon: <Type size={14} /> },
    { key: 'layout', label: 'Layout', icon: <Layout size={14} /> },
    { key: 'style', label: 'Style', icon: <Palette size={14} /> },
    { key: 'animation', label: 'Animate', icon: <Sparkles size={14} /> },
    { key: 'responsive', label: 'Responsive', icon: <Smartphone size={14} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-nahkya-surface border-l border-nahkya-border">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-nahkya-border">
        <input
          type="text"
          value={section.name ?? ''}
          onChange={(e) => onUpdateName(section.id, e.target.value)}
          className="w-full font-display text-heading-sm font-medium text-nahkya-text bg-transparent border-none outline-none focus:ring-0 placeholder:text-nahkya-text-secondary/40"
          placeholder="Section Name"
        />
        <p className="font-mono text-mono-sm text-nahkya-text-secondary mt-1">{TEMPLATE_LABELS[section.templateType]}</p>

        {/* Status selector */}
        <div className="flex items-center gap-2 mt-3">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onUpdateStatus(section.id, s.value)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-nahkya font-mono text-mono-sm transition-all',
                status === s.value
                  ? 'bg-nahkya-bg text-nahkya-text ring-1 ring-nahkya-highlight/50'
                  : 'text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-bg/50'
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', s.color)} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex items-center gap-0 border-b border-nahkya-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2.5 font-body text-body-sm whitespace-nowrap transition-colors border-b-2',
              activeTab === tab.key
                ? 'text-nahkya-highlight border-nahkya-highlight'
                : 'text-nahkya-text-secondary border-transparent hover:text-nahkya-text'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
        {activeTab === 'content' && (
          <div className="space-y-4">
            <SettingsGroup title="Information">
              <p className="font-body text-body-sm text-nahkya-text-secondary">
                Edit content directly in the preview area. Click on any text or image to edit it inline.
              </p>
            </SettingsGroup>

            <SettingsGroup title="Media">
              <SettingsSelect
                label="Media Position"
                value={settings.mediaPosition ?? 'right'}
                options={MEDIA_POSITION_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { mediaPosition: v as SectionSettings['mediaPosition'] })}
              />
              <SettingsSelect
                label="Image Shape"
                value={settings.imageShape ?? 'rectangle'}
                options={IMAGE_SHAPE_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { imageShape: v as SectionSettings['imageShape'] })}
              />
            </SettingsGroup>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-6">
            <SettingsGroup title="Container">
              <SettingsSelect
                label="Container Width"
                value={settings.containerWidth ?? 'default'}
                options={CONTAINER_WIDTH_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { containerWidth: v as SectionSettings['containerWidth'] })}
              />
              <SettingsSelect
                label="Content Alignment"
                value={settings.contentAlignment ?? 'center'}
                options={CONTENT_ALIGNMENT_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { contentAlignment: v as SectionSettings['contentAlignment'] })}
              />
              <SettingsSelect
                label="Text Alignment"
                value={settings.textAlign ?? 'left'}
                options={ALIGNMENT_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { textAlign: v as SectionSettings['textAlign'] })}
              />
              <SettingsToggle
                label="Full Width"
                checked={settings.fullWidth ?? false}
                onChange={(v) => onUpdateSettings(section.id, { fullWidth: v })}
              />
            </SettingsGroup>

            <SettingsGroup title="Media Placement">
              <SettingsSelect
                label="Media Position"
                value={settings.mediaPosition ?? 'right'}
                options={MEDIA_POSITION_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { mediaPosition: v as SectionSettings['mediaPosition'] })}
              />
              <SettingsSelect
                label="Image Shape"
                value={settings.imageShape ?? 'rectangle'}
                options={IMAGE_SHAPE_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { imageShape: v as SectionSettings['imageShape'] })}
              />
            </SettingsGroup>

            <SettingsGroup title="Mobile">
              <SettingsSelect
                label="Mobile Layout"
                value={settings.mobileLayout ?? 'stacked'}
                options={[
                  { value: 'stacked', label: 'Stacked' },
                  { value: 'twoColumn', label: 'Two Column' },
                ]}
                onChange={(v) => onUpdateSettings(section.id, { mobileLayout: v as SectionSettings['mobileLayout'] })}
              />
              <SettingsSelect
                label="Mobile Text Align"
                value={settings.mobileTextAlign ?? 'center'}
                options={ALIGNMENT_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { mobileTextAlign: v as SectionSettings['mobileTextAlign'] })}
              />
            </SettingsGroup>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-6">
            <SettingsGroup title="Colors">
              <SettingsSelect
                label="Background Color"
                value={settings.backgroundColor ?? 'nahkya-bg'}
                options={BG_COLOR_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { backgroundColor: v })}
              />
              <SettingsSelect
                label="Text Color"
                value={settings.textColor ?? 'nahkya-text'}
                options={TEXT_COLOR_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { textColor: v })}
              />
            </SettingsGroup>

            <SettingsGroup title="Spacing">
              <SettingsSelect
                label="Padding"
                value={settings.padding ?? 'lg'}
                options={PADDING_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { padding: v as SectionSettings['padding'] })}
              />
            </SettingsGroup>

            <SettingsGroup title="Effects">
              <SettingsSelect
                label="Border Style"
                value={settings.borderStyle ?? 'none'}
                options={BORDER_STYLE_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { borderStyle: v as SectionSettings['borderStyle'] })}
              />
              <SettingsSelect
                label="Shadow"
                value={settings.shadow ?? 'none'}
                options={SHADOW_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { shadow: v as SectionSettings['shadow'] })}
              />
              <SettingsSelect
                label="Divider"
                value={settings.divider ?? 'none'}
                options={DIVIDER_OPTIONS}
                onChange={(v) => onUpdateSettings(section.id, { divider: v as SectionSettings['divider'] })}
              />
            </SettingsGroup>
          </div>
        )}

        {activeTab === 'animation' && (
          <div className="space-y-6">
            <SettingsGroup title="Animation">
              <SettingsSelect
                label="Animation Type"
                value={animation?.type ?? 'fadeIn'}
                options={ANIMATION_TYPE_OPTIONS}
                onChange={(v) => onUpdateAnimation(section.id, { type: v as SectionAnimation['type'] })}
              />
              <SettingsSelect
                label="Duration"
                value={animation?.duration ?? 'normal'}
                options={ANIMATION_DURATION_OPTIONS}
                onChange={(v) => onUpdateAnimation(section.id, { duration: v as SectionAnimation['duration'] })}
              />
              <div className="space-y-1.5">
                <label className="font-body text-body-sm text-nahkya-text-secondary">Delay (ms)</label>
                <input
                  type="number"
                  min={0}
                  max={5000}
                  step={100}
                  value={animation?.delay ?? 0}
                  onChange={(e) => onUpdateAnimation(section.id, { delay: parseInt(e.target.value, 10) || 0 })}
                  className="w-full h-10 px-3 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm text-nahkya-text focus:outline-none focus:ring-2 focus:ring-nahkya-highlight/50"
                />
              </div>
            </SettingsGroup>

            <SettingsGroup title="Preview">
              <p className="font-body text-body-sm text-nahkya-text-secondary">
                Animations play when the section enters the viewport on the public homepage. In the editor, animations are simplified for performance.
              </p>
            </SettingsGroup>
          </div>
        )}

        {activeTab === 'responsive' && (
          <div className="space-y-6">
            {(['mobile', 'tablet', 'desktop'] as const).map((breakpoint) => {
              const bp = responsive[breakpoint] ?? {};
              return (
                <SettingsGroup key={breakpoint} title={breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}>
                  <SettingsSelect
                    label="Layout"
                    value={bp.layout ?? 'stacked'}
                    options={LAYOUT_OPTIONS}
                    onChange={(v) =>
                      onUpdateResponsive(section.id, {
                        [breakpoint]: { ...bp, layout: v as ResponsiveBreakpointSettings['layout'] },
                      })
                    }
                  />
                  <SettingsSelect
                    label="Text Align"
                    value={bp.textAlign ?? 'center'}
                    options={ALIGNMENT_OPTIONS}
                    onChange={(v) =>
                      onUpdateResponsive(section.id, {
                        [breakpoint]: { ...bp, textAlign: v as ResponsiveBreakpointSettings['textAlign'] },
                      })
                    }
                  />
                  <SettingsSelect
                    label="Image Aspect Ratio"
                    value={bp.imageAspectRatio ?? 'auto'}
                    options={ASPECT_RATIO_OPTIONS}
                    onChange={(v) =>
                      onUpdateResponsive(section.id, {
                        [breakpoint]: { ...bp, imageAspectRatio: v as ResponsiveBreakpointSettings['imageAspectRatio'] },
                      })
                    }
                  />
                  <SettingsToggle
                    label="Hide Image"
                    checked={bp.hideImage ?? false}
                    onChange={(v) =>
                      onUpdateResponsive(section.id, {
                        [breakpoint]: { ...bp, hideImage: v },
                      })
                    }
                  />
                </SettingsGroup>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
