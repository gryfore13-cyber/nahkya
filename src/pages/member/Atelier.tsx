import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { StudioShell } from '@/components/studio/StudioShell';
import { StudioSectionLabel } from '@/components/studio/StudioSectionLabel';
import { useColourStore } from '@/stores/colourStore';
import { useAuthStore } from '@/stores/authStore';
import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { useOrderStore } from '@/stores/orderStore';
import { usePlatformStore } from '@/stores/platformStore';
import { getArtworkById } from '@/lib/artworks';
import { generateSvgThumbnail } from '@/lib/atelierExport';
import { saveDesignWithThumbnail } from '@/lib/designs';
import { toast } from 'sonner';
import type { ArtworkLayer } from '@/lib/artworks';

export default function Atelier() {
  const { artworkId } = useParams<{ artworkId: string }>();
  const artwork = useMemo(() => getArtworkById(artworkId || ''), [artworkId]);
  const [activeLayerId, setActiveLayerId] = useState('');
  const [layerColours, setLayerColours] = useState<Record<string, string>>({});
  const [opacity, setOpacity] = useState(100);
  const [isRestoring, setIsRestoring] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const [searchParams] = useSearchParams();
  const { selectedColour, addToRecent } = useColourStore();
  const { user } = useAuthStore();
  const { fetchDesignById } = useSavedDesignStore();
  const { addOrder } = useOrderStore();
  const { pricing } = usePlatformStore();

  // Restore saved design from ?designId=
  useEffect(() => {
    const designId = searchParams.get('designId');
    if (!designId) {
      setIsRestoring(false);
      return;
    }

    let cancelled = false;
    fetchDesignById(designId).then((design) => {
      if (cancelled) return;
      const s = design?.snapshot;
      if (s) {
        if (s.layerColours && typeof s.layerColours === 'object') {
          setLayerColours(s.layerColours as Record<string, string>);
        }
        if (typeof s.opacity === 'number') {
          setOpacity(s.opacity);
        }
      }
      setIsRestoring(false);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('designId')]);

  // Set initial active layer
  useEffect(() => {
    if (artwork && artwork.layers.length > 0 && !activeLayerId) {
      setActiveLayerId(artwork.layers[0].id);
    }
  }, [artwork, activeLayerId]);

  const handleLayerClick = useCallback((layerId: string) => {
    setActiveLayerId(layerId);
    setLayerColours((prev) => ({ ...prev, [layerId]: selectedColour.hex }));
    addToRecent(selectedColour);
  }, [selectedColour, addToRecent]);

  const getLayerColour = (layer: ArtworkLayer) => layerColours[layer.id] ?? layer.defaultColor;

  const getDefaultPrice = useCallback(() => {
    const row = pricing.find((p) => p.size === '90 x 90');
    return row?.member ?? 180;
  }, [pricing]);

  const handleSave = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in to save designs.');
      return;
    }
    if (!artwork || !svgRef.current) return;
    try {
      const thumbnail = generateSvgThumbnail(svgRef.current, 512);
      const name = artwork.title;
      await saveDesignWithThumbnail({
        name,
        tool: 'atelier',
        userId: user.uid,
        snapshot: { artworkId: artwork.id, layerColours, opacity },
      }, thumbnail);
      toast.success(`"${name}" saved to your collection.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save design.');
    }
  }, [user, artwork, svgRef, layerColours, opacity]);

  const handleSubmit = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in to submit orders.');
      return;
    }
    if (!artwork || !svgRef.current) return;
    try {
      const thumbnail = generateSvgThumbnail(svgRef.current, 512);
      const name = artwork.title;
      const designId = await saveDesignWithThumbnail({
        name,
        tool: 'atelier',
        userId: user.uid,
        snapshot: { artworkId: artwork.id, layerColours, opacity },
      }, thumbnail);
      const amount = getDefaultPrice();
      await addOrder({
        userId: user.uid,
        userName: user.displayName || user.email || 'Member',
        designId,
        designName: name,
        tool: 'atelier',
        size: '90 x 90 CM',
        amount,
        currency: 'BND',
        status: 'submitted',
        notes: '',
        adminNotes: '',
      });
      toast.success('Design submitted for production. Track it in Orders.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit order.');
    }
  }, [user, artwork, svgRef, addOrder, layerColours, opacity, getDefaultPrice]);

  if (isRestoring) {
    return (
      <div className="h-screen flex items-center justify-center bg-nahkya-bg">
        <p className="font-mono text-mono-md text-nahkya-text-secondary uppercase tracking-label">Restoring design…</p>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="h-screen flex flex-col bg-nahkya-bg items-center justify-center">
        <p className="font-display text-2xl text-nahkya-text mb-4">Artwork not found</p>
        <Link to="/member/atelier" className="text-nahkya-highlight hover:underline font-body text-sm">Return to Gallery</Link>
      </div>
    );
  }

  const leftPanel = (
    <>
      {/* Artwork Info */}
      <div>
        <StudioSectionLabel>Artwork</StudioSectionLabel>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/member/atelier" className="text-nahkya-text-secondary hover:text-nahkya-highlight transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <span className="font-body text-body-sm text-nahkya-text">{artwork.title}</span>
        </div>
      </div>

      {/* Layers */}
      <div>
        <StudioSectionLabel>Layers</StudioSectionLabel>
        <div className="space-y-1.5">
          {artwork.layers.map((layer) => {
            const colour = getLayerColour(layer);
            const isActive = activeLayerId === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => handleLayerClick(layer.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-nahkya border transition-all',
                  isActive
                    ? 'border-nahkya-highlight bg-nahkya-highlight/5'
                    : 'border-nahkya-border bg-nahkya-surface-raised hover:border-nahkya-highlight/30'
                )}
              >
                <span
                  className="w-5 h-5 rounded-nahkya border border-nahkya-border flex-shrink-0 bg-[var(--swatch)]"
                  ref={(el) => { if (el) el.style.setProperty('--swatch', colour); }}
                />
                <span className="font-body text-body-sm text-nahkya-text flex-1 text-left">{layer.name}</span>
                {isActive && <Layers className="w-3.5 h-3.5 text-nahkya-highlight" strokeWidth={1.5} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opacity */}
      <div>
        <StudioSectionLabel>Opacity</StudioSectionLabel>
        <div className="flex justify-between mb-1">
          <span className="text-body-xs text-nahkya-text-secondary">Active layer</span>
          <span className="font-mono text-mono-sm text-nahkya-text-secondary">{opacity}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full h-1 bg-nahkya-surface-raised rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-nahkya-highlight [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* Hint */}
      <div>
        <StudioSectionLabel>How to use</StudioSectionLabel>
        <p className="text-body-2xs text-nahkya-text-secondary font-body leading-relaxed">Select a layer, then choose a colour. Click on the artwork to apply.</p>
      </div>
    </>
  );

  const canvas = (
    <>
      <svg ref={svgRef} viewBox="0 0 500 500" className="w-full h-full max-w-canvas max-h-canvas drop-shadow-canvas">
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
        <defs><pattern id="silkGrain" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.5" fill="var(--nahkya-text)" opacity="0.08" /></pattern></defs>
      </svg>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-nahkya-surface/80 backdrop-blur-sm border border-nahkya-border rounded-nahkya px-3 py-1.5">
        <Layers className="w-3.5 h-3.5 text-nahkya-highlight" strokeWidth={1.5} />
        <span className="font-mono text-mono-sm text-nahkya-text-secondary">{artwork.layers.find((l: ArtworkLayer) => l.id === activeLayerId)?.name || 'Select a layer'}</span>
      </div>
    </>
  );

  return (
    <StudioShell
      toolName="Atelier"
      leftPanel={leftPanel}
      canvas={canvas}
      onSave={handleSave}
      onSubmit={handleSubmit}
    />
  );
}
