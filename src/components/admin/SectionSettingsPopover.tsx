import { useState, useRef, useEffect, useCallback } from 'react';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHomeContentStore } from '@/stores/homeContentStore';
import type { HomepageSection, SectionSettings } from '@/types';

const BG_COLOR_OPTIONS = [
  'nahkya-bg', 'nahkya-surface', 'nahkya-surface-raised',
  'nahkya-accent', 'nahkya-accent-hover', 'nahkya-accent-subtle',
  'nahkya-highlight', 'nahkya-highlight-subtle',
  'nahkya-error', 'nahkya-success', 'nahkya-border',
];

const TEXT_COLOR_OPTIONS = [
  'nahkya-text', 'nahkya-text-secondary', 'nahkya-inverse',
  'nahkya-accent', 'nahkya-highlight', 'nahkya-border',
];

const PADDING_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

interface Props {
  section: HomepageSection;
}

export function SectionSettingsPopover({ section }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const updateSectionSettings = useHomeContentStore((s) => s.updateSectionSettings);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleChange = useCallback((key: keyof SectionSettings, value: unknown) => {
    updateSectionSettings(section.id, { [key]: value });
  }, [updateSectionSettings, section.id]);

  const settings = section.settings ?? {
    backgroundColor: 'nahkya-bg',
    textColor: 'nahkya-text',
    padding: 'lg',
    fullWidth: false,
    isVisible: true,
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Section Settings"
        aria-label="Open section settings"
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'w-7 h-7 flex items-center justify-center rounded-sm transition-colors',
          open
            ? 'bg-nahkya-highlight text-nahkya-inverse'
            : 'text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-bg'
        )}
      >
        <Settings size={14} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Section settings"
          className="absolute top-full right-0 mt-1 w-72 bg-nahkya-surface-raised border border-nahkya-border rounded-nahkya shadow-card p-4 z-50 space-y-4"
        >
          <h4 className="font-display text-heading-sm font-medium">Section Settings</h4>

          <div className="space-y-2">
            <label htmlFor="bg-color" className="font-body text-body-sm">Background Color</label>
            <select
              id="bg-color"
              value={settings.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-full h-10 px-3 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-nahkya-highlight/50"
            >
              {BG_COLOR_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="text-color" className="font-body text-body-sm">Text Color</label>
            <select
              id="text-color"
              value={settings.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-full h-10 px-3 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-nahkya-highlight/50"
            >
              {TEXT_COLOR_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="padding" className="font-body text-body-sm">Padding</label>
            <select
              id="padding"
              value={settings.padding}
              onChange={(e) => handleChange('padding', e.target.value)}
              className="w-full h-10 px-3 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-nahkya-highlight/50"
            >
              {PADDING_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="full-width" className="font-body text-body-sm">Full Width</label>
            <button
              id="full-width"
              type="button"
              role="switch"
              aria-checked={settings.fullWidth}
              onClick={() => handleChange('fullWidth', !settings.fullWidth)}
              className={cn(
                'w-10 h-5 rounded-full transition-colors relative',
                settings.fullWidth ? 'bg-nahkya-highlight' : 'bg-nahkya-border'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                  settings.fullWidth ? 'left-5' : 'left-0.5'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="visible" className="font-body text-body-sm">Visible</label>
            <button
              id="visible"
              type="button"
              role="switch"
              aria-checked={settings.isVisible}
              onClick={() => handleChange('isVisible', !settings.isVisible)}
              className={cn(
                'w-10 h-5 rounded-full transition-colors relative',
                settings.isVisible ? 'bg-nahkya-highlight' : 'bg-nahkya-border'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                  settings.isVisible ? 'left-5' : 'left-0.5'
                )}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
