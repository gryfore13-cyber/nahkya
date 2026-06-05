import { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { StudioShell } from '@/components/studio/StudioShell';
import { StudioSectionLabel } from '@/components/studio/StudioSectionLabel';
import { useColourStore } from '@/stores/colourStore';
import { getArtworkById } from '@/lib/artworks';
import type { ArtworkLayer } from '@/lib/artworks';

export default function Atelier() {
  const { artworkId } = useParams<{ artworkId: string }>();
  const artwork = useMemo(() => getArtworkById(artworkId || ''), [artworkId]);
  const [activeLayerId, setActiveLayerId] = useState('');
  const [layerColours, setLayerColours] = useState<Record<string, string>>({});
  const [opacity, setOpacity] = useState(100);

  const { selectedColour, addToRecent } = useColourStore();

  // Set initial active layer
  useEffect(() => {
    if (artwork && artwork.layers.length > 0 && !activeLayerId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveLayerId(artwork.layers[0].id);
    }
  }, [artwork, activeLayerId]);

  const handleLayerClick = useCallback((layerId: string) => {
    setActiveLayerId(layerId);
    setLayerColours((prev) => ({ ...prev, [layerId]: selectedColour.hex }));
    addToRecent(selectedColour);
  }, [selectedColour, addToRecent]);

  const getLayerColour = (layer: ArtworkLayer) => layerColours[layer.id] ?? layer.defaultColor;

  if (!artwork) {
    return (
      <div className="h-screen flex flex-col bg-workspace-bg items-center justify-center">
        <p className="font-display text-2xl text-nahkya-text mb-4">Artwork not found</p>
        <Link to="/member/atelier" className="text-nahkya-gold hover:underline font-body text-sm">Return to Gallery</Link>
      </div>
    );
  }

  const leftPanel = (
    <>
      {/* Artwork Info */}
      <div>
        <StudioSectionLabel>Artwork</StudioSectionLabel>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-body-3xs text-nahkya-gold tracking-label uppercase">{artwork.category}</span>
          <span className="text-workspace-border">&middot;</span>
          <span className="font-mono text-body-3xs text-nahkya-text-muted">{artwork.artist}</span>
        </div>
        <h3 className="font-display text-base text-nahkya-text font-medium">{artwork.title}</h3>
        <Link to="/member/atelier" className="inline-flex items-center gap-1.5 mt-3 text-body-xs text-nahkya-text-muted hover:text-nahkya-gold transition-colors font-body">
          <ArrowLeft className="w-3 h-3" strokeWidth={1.5} /> Back to Gallery
        </Link>
      </div>

      {/* Layer Controls */}
      <div>
        <StudioSectionLabel>Layers</StudioSectionLabel>
        <div className="space-y-1">
          {artwork.layers.map((layer: ArtworkLayer) => {
            const isActive = activeLayerId === layer.id;
            const currentColour = getLayerColour(layer);
            return (
              <button key={layer.id} onClick={() => handleLayerClick(layer.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-nahkya transition-all duration-150 ${
                  isActive ? 'bg-workspace-hover text-nahkya-gold border border-nahkya-gold/30' : 'text-nahkya-text-muted hover:bg-workspace-hover hover:text-nahkya-text border border-transparent'
                }`}>
                <div className="w-4 h-4 rounded-nahkya border border-workspace-border flex-shrink-0" style={{ backgroundColor: currentColour }} />
                <div className="text-left flex-1 min-w-0">
                  <p className="text-body-sm font-body truncate">{layer.name}</p>
                  <p className="text-body-3xs text-nahkya-text-muted capitalize">{layer.type}</p>
                </div>
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0 ', isActive ? 'bg-nahkya-gold' : 'bg-workspace-border')} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div>
        <StudioSectionLabel>Settings</StudioSectionLabel>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-body-xs text-nahkya-text-muted font-body">Preview Opacity</span>
            <span className="font-mono text-mono-sm text-nahkya-text-muted">{opacity}%</span>
          </div>
          <input type="range" min={10} max={100} value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-1 bg-workspace-border rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-nahkya-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer" />
        </div>
      </div>

      <div className="pt-4 border-t border-workspace-border">
        <p className="text-body-2xs text-nahkya-text-muted font-body leading-relaxed">Select a layer, then choose a colour. Click on the artwork to apply.</p>
      </div>
    </>
  );

  const canvas = (
    <>
      <svg viewBox="0 0 500 500" className="w-full h-full max-w-canvas max-h-canvas drop-shadow-canvas">
        {artwork.layers.map((layer: ArtworkLayer) => {
          const colour = getLayerColour(layer);
          const layerOp = layer.id === activeLayerId ? (opacity / 100).toFixed(2) : '1';
          const isActive = activeLayerId === layer.id;
          return (
            <g key={layer.id} opacity={layerOp} className={isActive ? 'cursor-pointer transition-opacity duration-150' : 'pointer-events-none transition-opacity duration-150'}
              onClick={() => handleLayerClick(layer.id)}>
              {layer.paths.map((d: string, i: number) => (
                <path key={`${layer.id}-${i}`} d={d} fill={colour}
                  stroke={isActive ? 'var(--nahkya-gold)' : 'none'} strokeWidth={isActive ? '0.5' : '0'} strokeOpacity={isActive ? '0.25' : '0'}
                  className="transition-colors duration-200" />
              ))}
            </g>
          );
        })}
        <rect x="0" y="0" width="500" height="500" fill="url(#silkGrain)" opacity="0.04" pointerEvents="none" />
        <defs><pattern id="silkGrain" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.5" fill="var(--nahkya-charcoal)" opacity="0.08" /></pattern></defs>
      </svg>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-workspace-panel/80 backdrop-blur-sm border border-workspace-border rounded-nahkya px-3 py-1.5">
        <Layers className="w-3.5 h-3.5 text-nahkya-gold" strokeWidth={1.5} />
        <span className="font-mono text-mono-sm text-nahkya-text-muted">{artwork.layers.find((l: ArtworkLayer) => l.id === activeLayerId)?.name || 'Select a layer'}</span>
      </div>
    </>
  );

  return (
    <StudioShell toolName="Atelier" leftPanel={leftPanel} canvas={canvas}
      onSave={() => console.log('Save:', artwork.id)} onSubmit={() => console.log('Submit:', artwork.id)} />
  );
}
