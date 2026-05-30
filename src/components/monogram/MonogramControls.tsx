// src/components/monogram/MonogramControls.tsx

import { StudioSectionLabel } from '@/components/studio/StudioSectionLabel';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FONT_OPTIONS } from '@/lib/monogramConstants';
import { getFontClasses } from '@/lib/monogram';
import type { MonogramState } from '@/hooks/useMonogramState';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';

interface MonogramControlsProps {
  state: MonogramState;
  activeColorTarget: 'letter' | 'base' | 'border' | 'border2';
  setActiveColorTarget: (t: 'letter' | 'base' | 'border' | 'border2') => void;
}

const COLOR_TARGETS = [
  { key: 'letter' as const, label: 'Letter', description: 'Main monogram or motif mark.' },
  { key: 'base' as const, label: 'Base', description: 'Main scarf background tone.' },
  { key: 'border' as const, label: 'Border', description: 'Outer frame and trims.' },
  { key: 'border2' as const, label: 'Inset', description: 'Inner detail or secondary fill.' },
];

export default function MonogramControls({
  state,
  activeColorTarget,
  setActiveColorTarget,
}: MonogramControlsProps) {
  const {
    letters,
    selectedLetterId,
    setSelectedLetterId,
    addLetter,
    deleteLetter,
    updateTextBoxCharacter,
    updateLetter,
    updateTextSize,
    linkTextSize,
    toggleLinkTextSize,
    showAdvanced,
    setShowAdvanced,
    previewTiles,
    setPreviewTiles,
    tileSpacingCm,
    setTileSpacingCm,
    showBorder,
    setShowBorder,
    borderThicknessCm,
    setBorderThicknessCm,
    showBorder2,
    setShowBorder2,
    borderThicknessCm2,
    setBorderThicknessCm2,
    borderGapCm,
    setBorderGapCm,
    baseColor,
    borderColor,
    borderColor2,
    snapEnabled,
    setSnapEnabled,
    showSourceGuides,
    setShowSourceGuides,
    moveAsGroup,
    setMoveAsGroup,

    selectedLetter,
    resetPrototype,
  } = state;

  return (
    <div className="space-y-6">
      {/* ── Your Monogram ── */}
      <div>
        <div className="mb-4">
          <StudioSectionLabel>Your Monogram</StudioSectionLabel>
          <p className="text-body-xs text-nahkya-text-muted mt-1">
            Begin with the letters that define you.
          </p>
        </div>

        <div className="-mx-6 px-6 flex flex-nowrap gap-2 items-center py-1">
          {letters.map((letter) => {
            const isSelected = letter.id === selectedLetterId;
            return (
              <div key={letter.id} className="relative group">
                <input
                  ref={(el) => {
                    state.tileInputRefs.current[letter.id] = el;
                  }}
                  value={letter.char}
                  maxLength={1}
                  placeholder="?"
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
                    updateTextBoxCharacter(letter.id, val);
                  }}
                  onFocus={() => setSelectedLetterId(letter.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && letter.char === '' && letters.length > 1) {
                      e.preventDefault();
                      deleteLetter(letter.id);
                    }
                  }}
                  className={cn(
                    'nk-monogram-letter',
                    getFontClasses(letter.fontId),
                    isSelected && 'is-selected'
                  )}
                />
                {letters.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLetter(letter.id);
                    }}
                    className="nk-monogram-delete"
                    title="Remove letter"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            );
          })}

          {letters.length < 4 && (
            <button
              onClick={addLetter}
              className="nk-monogram-add"
              title="Add letter"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>

      {/* ── Refine This Letter ── */}
      {selectedLetter && (
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-mono-sm uppercase tracking-widest text-nahkya-text-muted">
              Refine This Letter
            </span>
            <div className="h-px flex-1 bg-workspace-border" />
          </div>

          {/* Font */}
          <div className="mb-4">
            <label className="block text-body-xs text-nahkya-text font-medium mb-2">
              Typeface
            </label>
            <Select
              value={selectedLetter.fontId}
              onValueChange={(fontId) => {
                updateLetter(selectedLetter.id, { fontId: fontId as MonogramState['letters'][number]['fontId'] });
                if (linkTextSize) {
                  state.letters.forEach((l) => {
                    if (l.id !== selectedLetter.id) updateLetter(l.id, { fontId: fontId as MonogramState['letters'][number]['fontId'] });
                  });
                }
              }}
            >
              <SelectTrigger className="w-full bg-workspace-hover border-workspace-border text-nahkya-text h-11 rounded-nahkya">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-workspace-panel border-workspace-border">
                {FONT_OPTIONS.map((font) => (
                  <SelectItem
                    key={font.id}
                    value={font.id}
                    className="text-nahkya-text focus:bg-workspace-hover focus:text-nahkya-text"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-body-sm">{font.name}</span>
                      <span
                        className={cn(
                          'text-body-sm text-nahkya-text-muted',
                          getFontClasses(font.id)
                        )}
                      >
                        Aa
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Size */}
          <SliderControl
            label="Size"
            value={selectedLetter.fontSize}
            min={20}
            max={250}
            step={10}
            suffix="px"
            onChange={(v) => updateTextSize(selectedLetter.id, v)}
          />

          {/* Rotation */}
          <SliderControl
            label="Rotation"
            value={selectedLetter.rotation}
            min={-360}
            max={360}
            step={15}
            suffix="°"
            onChange={(v) => updateLetter(selectedLetter.id, { rotation: v })}
          />

          {/* Advanced Toggle */}
          <button
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 bg-workspace-hover border border-workspace-border rounded-nahkya text-body-sm text-nahkya-text font-medium hover:border-nahkya-text-secondary transition-colors mb-3"
          >
            <span>Advanced</span>
            <span className="text-nahkya-text-muted">{showAdvanced ? '−' : '+'}</span>
          </button>

          {showAdvanced && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-4 py-3 bg-workspace-hover border border-workspace-border rounded-nahkya">
                <span className="text-body-sm text-nahkya-text">Keep All Letters Same Size</span>
                <Switch
                  checked={linkTextSize}
                  onCheckedChange={toggleLinkTextSize}
                  className="data-[state=checked]:bg-nahkya-gold"
                />
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-workspace-hover border border-workspace-border rounded-nahkya">
                <span className="text-body-sm text-nahkya-text">Move as Group</span>
                <Switch
                  checked={moveAsGroup}
                  onCheckedChange={setMoveAsGroup}
                  className="data-[state=checked]:bg-nahkya-gold"
                />
              </div>

              <SliderControl
                label="Position X"
                value={selectedLetter.x}
                min={0}
                max={100}
                step={1}
                suffix="%"
                onChange={(v) => updateLetter(selectedLetter.id, { x: v })}
              />

              <SliderControl
                label="Position Y"
                value={selectedLetter.y}
                min={0}
                max={100}
                step={1}
                suffix="%"
                onChange={(v) => updateLetter(selectedLetter.id, { y: v })}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Pigment ── */}
      <div className="border-t border-workspace-border pt-6">
        <StudioSectionLabel>Pigment</StudioSectionLabel>
        <p className="text-body-xs text-nahkya-text-muted mb-4">
          Select a target, then choose a colour from the panel.
        </p>

        {/* Currently editing */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-body-xs text-nahkya-text-muted">Currently editing</span>
          <span className="text-body-xs font-semibold text-nahkya-burgundy">
            {COLOR_TARGETS.find((t) => t.key === activeColorTarget)?.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {COLOR_TARGETS.map((target) => {
            const isActive = activeColorTarget === target.key;
            const swatchColor =
              target.key === 'letter'
                ? selectedLetter?.color ?? 'var(--nahkya-gold-soft)'
                : target.key === 'base'
                  ? baseColor
                  : target.key === 'border'
                    ? borderColor
                    : borderColor2;
            return (
              <button
                key={target.key}
                onClick={() => setActiveColorTarget(target.key)}
                className={cn('nk-color-target-card', isActive && 'is-active')}
              >
                <div
                  className="nk-color-target-card-swatch"
                  style={{ backgroundColor: swatchColor }}
                />
                <div className="nk-color-target-card-title">{target.label}</div>
                <div className="nk-color-target-card-desc">{target.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Pattern ── */}
      <div className="border-t border-workspace-border pt-6">
        <StudioSectionLabel>Pattern</StudioSectionLabel>
        <p className="text-body-xs text-nahkya-text-muted mb-4">
          Control how your monogram repeats across the scarf.
        </p>

        <div className="flex items-center justify-between px-4 py-3 bg-workspace-hover border border-workspace-border rounded-nahkya mb-3">
          <span className="text-body-sm text-nahkya-text">Snap to Grid</span>
          <Switch
            checked={snapEnabled}
            onCheckedChange={setSnapEnabled}
            className="data-[state=checked]:bg-nahkya-gold"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-workspace-hover border border-workspace-border rounded-nahkya mb-3">
          <span className="text-body-sm text-nahkya-text">Show Guides</span>
          <Switch
            checked={showSourceGuides}
            onCheckedChange={setShowSourceGuides}
            className="data-[state=checked]:bg-nahkya-gold"
          />
        </div>

        <SliderControl
          label="Grid Size"
          value={previewTiles}
          min={3}
          max={15}
          step={1}
          suffix=" ×"
          onChange={setPreviewTiles}
        />

        <SliderControl
          label="Gap Between Tiles"
          value={tileSpacingCm}
          min={0}
          max={20}
          step={0.5}
          suffix="cm"
          onChange={setTileSpacingCm}
        />
      </div>

      {/* ── Borders ── */}
      <div className="border-t border-workspace-border pt-6">
        <StudioSectionLabel>Borders</StudioSectionLabel>
        <p className="text-body-xs text-nahkya-text-muted mb-4">
          Frame your monogram with tailored borders.
        </p>

        <div className="flex items-center justify-between px-4 py-3 bg-workspace-hover border border-workspace-border rounded-nahkya mb-3">
          <span className="text-body-sm text-nahkya-text">Show Border</span>
          <Switch
            checked={showBorder}
            onCheckedChange={setShowBorder}
            className="data-[state=checked]:bg-nahkya-gold"
          />
        </div>

        {showBorder && (
          <SliderControl
            label="Border Thickness"
            value={borderThicknessCm}
            min={0}
            max={20}
            step={0.5}
            suffix="cm"
            onChange={setBorderThicknessCm}
          />
        )}

        <div className="flex items-center justify-between px-4 py-3 bg-workspace-hover border border-workspace-border rounded-nahkya mb-3">
          <span className="text-body-sm text-nahkya-text">Show Inset</span>
          <Switch
            checked={showBorder2}
            onCheckedChange={setShowBorder2}
            className="data-[state=checked]:bg-nahkya-gold"
          />
        </div>

        {showBorder2 && (
          <>
            <SliderControl
              label="Inset Thickness"
              value={borderThicknessCm2}
              min={0}
              max={15}
              step={0.5}
              suffix="cm"
              onChange={setBorderThicknessCm2}
            />

            <SliderControl
              label="Border Gap"
              value={borderGapCm}
              min={0}
              max={20}
              step={0.5}
              suffix="cm"
              onChange={setBorderGapCm}
            />
          </>
        )}
      </div>

      {/* ── Reset ── */}
      <button
        onClick={resetPrototype}
        className="w-full py-3 rounded-nahkya border border-workspace-border bg-workspace-hover text-body-sm text-nahkya-text-muted font-semibold hover:border-nahkya-ivory hover:text-nahkya-text transition-colors"
      >
        Reset Monogram
      </button>
    </div>
  );
}

// ── Slider Control ──

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}

function SliderControl({ label, value, min, max, step, suffix, onChange }: SliderControlProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-body-xs text-nahkya-text font-medium">{label}</span>
        <span className="font-mono text-mono-sm text-nahkya-text-muted bg-workspace-hover px-2 py-0.5 rounded-nahkya">
          {value}{suffix}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-workspace-hover">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-nahkya-ivory pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-nahkya-ivory bg-workspace-panel shadow-sm pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}
