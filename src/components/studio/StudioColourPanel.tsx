import { useColourStore } from '@/stores/colourStore';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';
import { StudioSectionLabel } from './StudioSectionLabel';

export function StudioColourPanel() {
  const { categories, selectedColour, setSelectedColour, recentColours, addToRecent } = useColourStore();
  const { isMobile, isTablet, isTouch } = useResponsive();
  const systemCategories = categories.filter((c) => c.isSystem);
  const customCategories = categories.filter((c) => !c.isSystem);

  const handleSwatchClick = (colour: { id: string; name: string; hex: string }) => {
    setSelectedColour(colour);
    addToRecent(colour);
  };

  // Responsive swatch grid columns per spec
  const swatchGridCols = isMobile ? 'grid-cols-5' : isTablet ? 'grid-cols-6' : 'grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
  const gapSize = 'gap-2';

  return (
    <div className="w-panel-studio bg-nahkya-surface border-l border-nahkya-border flex-shrink-0 overflow-y-auto dark-scroll p-6 space-y-6">
      {/* Selected Colour */}
      <div>
        <StudioSectionLabel>Selected Colour</StudioSectionLabel>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'rounded-nahkya border-2 border-nahkya-highlight bg-[var(--swatch)] flex-shrink-0',
              isTouch ? 'w-12 h-12' : 'w-12 h-12'
            )}
            ref={(el) => { if (el) el.style.setProperty('--swatch', selectedColour.hex); }}
          />
          <div className="min-w-0">
            <p className="font-mono text-body-2xs text-nahkya-text truncate">
              {selectedColour.hex}
            </p>
            <p className="text-body-xs text-nahkya-text-secondary font-body truncate">
              {selectedColour.name}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Colours */}
      {recentColours.length > 0 && (
        <div>
          <p className="font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-secondary mb-3">
            Recent
          </p>
          <div className={cn('flex flex-wrap', gapSize)}>
            {recentColours.map((colour, index) => (
              <button
                key={index}
                onClick={() => setSelectedColour(colour)}
                className={cn(
                  'rounded-nahkya border border-nahkya-border hover:border-nahkya-highlight transition-all duration-150 hover:scale-110 bg-[var(--swatch)] flex-shrink-0',
                  isTouch ? 'w-11 h-11' : 'w-8 h-8'
                )}
                ref={(el) => { if (el) el.style.setProperty('--swatch', colour.hex); }}
                title={colour.name}
                aria-label={`Select ${colour.name}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* System Palettes */}
      {systemCategories.map((palette) => (
        <div key={palette.id}>
          <p className="font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-secondary mb-3">
            {palette.name}
          </p>
          <div className={cn('grid', swatchGridCols, gapSize)}>
            {palette.colours.map((colour) => (
              <button
                key={colour.id}
                onClick={() => handleSwatchClick(colour)}
                className={cn(
                  'aspect-square rounded-nahkya border transition-all duration-150 hover:scale-110 hover:border-nahkya-highlight bg-[var(--swatch)]',
                  selectedColour.hex === colour.hex
                    ? 'border-nahkya-highlight ring-1 ring-nahkya-highlight/30'
                    : 'border-nahkya-border'
                )}
                ref={(el) => { if (el) el.style.setProperty('--swatch', colour.hex); }}
                title={`${colour.name} — ${colour.hex}`}
                aria-label={`Select ${colour.name}`}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Custom Palettes */}
      {customCategories.map((palette) => (
        <div key={palette.id}>
          <p className="font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-highlight mb-3">
            {palette.name}
          </p>
          <div className={cn('grid', swatchGridCols, gapSize)}>
            {palette.colours.map((colour) => (
              <button
                key={colour.id}
                onClick={() => handleSwatchClick(colour)}
                className={cn(
                  'aspect-square rounded-nahkya border transition-all duration-150 hover:scale-110 hover:border-nahkya-highlight bg-[var(--swatch)]',
                  selectedColour.hex === colour.hex
                    ? 'border-nahkya-highlight ring-1 ring-nahkya-highlight/30'
                    : 'border-nahkya-border'
                )}
                ref={(el) => { if (el) el.style.setProperty('--swatch', colour.hex); }}
                title={`${colour.name} — ${colour.hex}`}
                aria-label={`Select ${colour.name}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
