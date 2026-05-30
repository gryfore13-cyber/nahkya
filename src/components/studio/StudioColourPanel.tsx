import { useColourStore } from '@/stores/colourStore';
import { StudioSectionLabel } from './StudioSectionLabel';

export function StudioColourPanel() {
  const { categories, selectedColour, setSelectedColour, recentColours, addToRecent } = useColourStore();
  const systemCategories = categories.filter((c) => c.isSystem);
  const customCategories = categories.filter((c) => !c.isSystem);

  const handleSwatchClick = (colour: { id: string; name: string; hex: string }) => {
    setSelectedColour(colour);
    addToRecent(colour);
  };

  return (
    <div className="w-panel-studio bg-nahkya-surface border-l border-nahkya-border flex-shrink-0 overflow-y-auto workspace-scroll p-6 space-y-6">
      {/* Selected Colour */}
      <div>
        <StudioSectionLabel>Selected Colour</StudioSectionLabel>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-nahkya border-2 border-nahkya-gold"
            style={{ backgroundColor: selectedColour.hex }}
          />
          <div>
            <p className="font-mono text-body-2xs text-nahkya-text">
              {selectedColour.hex}
            </p>
            <p className="text-body-xs text-nahkya-text-muted font-body">
              {selectedColour.name}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Colours */}
      {recentColours.length > 0 && (
        <div>
          <p className="font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-3">
            Recent
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recentColours.map((colour, index) => (
              <button
                key={index}
                onClick={() => setSelectedColour(colour)}
                className="w-6 h-6 rounded-nahkya border border-nahkya-border hover:border-nahkya-gold transition-all duration-150 hover:scale-110"
                style={{ backgroundColor: colour.hex }}
                title={colour.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* System Palettes */}
      {systemCategories.map((palette) => (
        <div key={palette.id}>
          <p className="font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-3">
            {palette.name}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {palette.colours.map((colour) => (
              <button
                key={colour.id}
                onClick={() => handleSwatchClick(colour)}
                className={`w-full aspect-square rounded-nahkya border transition-all duration-150 hover:scale-110 hover:border-nahkya-gold ${
                  selectedColour.hex === colour.hex
                    ? 'border-nahkya-gold ring-1 ring-nahkya-gold/30'
                    : 'border-nahkya-border'
                }`}
                style={{ backgroundColor: colour.hex }}
                title={`${colour.name} — ${colour.hex}`}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Custom Palettes */}
      {customCategories.map((palette) => (
        <div key={palette.id}>
          <p className="font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-gold mb-3">
            {palette.name}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {palette.colours.map((colour) => (
              <button
                key={colour.id}
                onClick={() => handleSwatchClick(colour)}
                className={`w-full aspect-square rounded-nahkya border transition-all duration-150 hover:scale-110 hover:border-nahkya-gold ${
                  selectedColour.hex === colour.hex
                    ? 'border-nahkya-gold ring-1 ring-nahkya-gold/30'
                    : 'border-nahkya-border'
                }`}
                style={{ backgroundColor: colour.hex }}
                title={`${colour.name} — ${colour.hex}`}
              />
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}
