import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArtworkStore } from '@/stores/artworkStore';
import { useColourStore } from '@/stores/colourStore';
import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { StudioShell } from '@/components/studio/StudioShell';
import { StudioSectionLabel } from '@/components/studio/StudioSectionLabel';
import { useColoringEngine } from '@/hooks/useColoringEngine';
import { cn } from '@/lib/utils';

const BLEND_MODES = ['paint', 'picker'] as const;
const LAYERS = [
  { key: 'base' as const, label: 'Base' },
  { key: 'paint' as const, label: 'Paint' },
  { key: 'lineart' as const, label: 'Lineart' },
] as const;

export default function ImageAtelier() {
  const { artworkId } = useParams<{ artworkId: string }>();
  const { artworks, fetchArtworks } = useArtworkStore();
  const { selectedColour } = useColourStore();
  const { addDesign } = useSavedDesignStore();

  const engine = useColoringEngine({ canvasSize: 720, bucketTolerance: 80, lineThreshold: 220 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  const artwork = artworks.find((a) => a.id === artworkId);

  // Load image when artwork data is available
  useEffect(() => {
    if (artwork?.image && !engine.hasImage) {
      engine.loadImage(artwork.image).catch(() => {});
    }
  }, [artwork?.image, engine.hasImage]);

  // Apply selected colour to the active layer whenever the user picks a new colour
  useEffect(() => {
    engine.applyColorToActiveLayer(selectedColour.hex);
  }, [selectedColour.hex]);

  // Center scroll position whenever zoom changes or image loads
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    });
  }, [engine.zoom, engine.hasImage]);

  const handleSave = () => {
    if (!artwork) return;
    addDesign({
      name: `${artwork.name} — ${selectedColour.name}`,
      tool: 'atelier',
      thumbnail: artwork.thumbnail || artwork.image || '',
    });
  };

  if (!artwork) {
    return (
      <div className="h-screen flex flex-col bg-workspace-bg items-center justify-center">
        <p className="font-display text-2xl text-nahkya-text mb-4">Artwork not found</p>
        <Link to="/member/atelier" className="text-nahkya-gold hover:text-nahkya-gold-soft font-body">
          Back to Gallery
        </Link>
      </div>
    );
  }

  const leftPanel = (
    <>
      {/* Layer Selector */}
      <div>
        <StudioSectionLabel>Active Layer</StudioSectionLabel>
        <div className="space-y-1.5">
          {LAYERS.map((layer) => (
            <button
              key={layer.key}
              onClick={() => engine.setActiveLayer(layer.key)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm font-body rounded-nahkya transition-colors',
                engine.activeLayer === layer.key
                  ? 'bg-nahkya-gold text-nahkya-text'
                  : 'bg-workspace-hover text-nahkya-text-muted hover:text-nahkya-text'
              )}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Mode */}
      <div className="pt-4 border-t border-workspace-border">
        <StudioSectionLabel>Tool</StudioSectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {BLEND_MODES.map((m) => (
            <button
              key={m}
              onClick={() => engine.setMode(m)}
              className={cn(
                'px-3 py-2 text-sm font-body rounded-nahkya transition-colors capitalize',
                engine.mode === m
                  ? 'bg-nahkya-gold text-nahkya-text'
                  : 'bg-workspace-hover text-nahkya-text-muted hover:text-nahkya-text'
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-workspace-border space-y-2">
        <button
          onClick={engine.clearPaint}
          className="w-full px-3 py-2 text-sm font-body text-nahkya-text-muted hover:text-nahkya-text bg-workspace-hover rounded-nahkya transition-colors"
        >
          Clear Paint
        </button>
        <button
          onClick={engine.resetAll}
          className="w-full px-3 py-2 text-sm font-body text-nahkya-text-muted hover:text-nahkya-text bg-workspace-hover rounded-nahkya transition-colors"
        >
          Reset All
        </button>
      </div>

      {engine.error && (
        <p className="text-sm text-nahkya-error font-body">{engine.error}</p>
      )}
    </>
  );

  const zoomedSize = engine.canvasSize * engine.zoom;

  const canvas = (
    <div ref={scrollRef} className="w-full h-full overflow-auto scrollbar-hide flex items-center justify-center">
      <div
        style={{
          width: zoomedSize,
          height: zoomedSize,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            transform: `scale(${engine.zoom})`,
            transformOrigin: 'top left',
            width: engine.canvasSize,
            height: engine.canvasSize,
          }}
        >
          <canvas
            ref={engine.canvasRef}
            width={engine.canvasSize}
            height={engine.canvasSize}
            onClick={engine.handleCanvasClick}
            className="cursor-crosshair"
          />
        </div>
      </div>
    </div>
  );

  return (
    <StudioShell
      toolName="Atelier"
      leftPanel={leftPanel}
      canvas={canvas}
      onSave={handleSave}
      onSubmit={() => {}}
      zoom={engine.zoom}
      onZoomIn={engine.zoomIn}
      onZoomOut={engine.zoomOut}
      onZoomReset={engine.resetZoom}
      canUndo={engine.canUndo}
      canRedo={engine.canRedo}
      onUndo={engine.undo}
      onRedo={engine.redo}
    />
  );
}
