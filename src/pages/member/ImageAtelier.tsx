import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDocById } from '@/lib/firebase/db';
import { useColourStore } from '@/stores/colourStore';
import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { StudioShell } from '@/components/studio/StudioShell';
import { StudioSectionLabel } from '@/components/studio/StudioSectionLabel';
import { useColoringEngine } from '@/hooks/useColoringEngine';
import { cn } from '@/lib/utils';
import type { ArtworkDoc } from '@/types';

const BLEND_MODES = ['paint', 'picker', 'replace'] as const;
const LAYERS = [
  { key: 'base' as const, label: 'Base' },
  { key: 'paint' as const, label: 'Paint' },
  { key: 'lineart' as const, label: 'Lineart' },
] as const;

export default function ImageAtelier() {
  const { artworkId } = useParams<{ artworkId: string }>();
  const [artwork, setArtwork] = useState<ArtworkDoc | null>(null);
  const { selectedColour } = useColourStore();
  const { addDesign } = useSavedDesignStore();

  const {
    canvasRef,
    canvasSize,
    hasImage,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    canUndo,
    canRedo,
    undo,
    redo,
    loadImage,
    handleCanvasClick,
    applyColorToActiveLayer,
    setActiveLayer,
    activeLayer,
    setMode,
    mode,
    clearPaint,
    resetAll,
    error,
  } = useColoringEngine({ canvasSize: 720, bucketTolerance: 80, lineThreshold: 220 });

  const scrollRef = useRef<HTMLDivElement>(null);
  const isSpacePressedRef = useRef(false);
  const panStartRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const pendingScrollRef = useRef<{ left: number; top: number } | null>(null);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    if (artworkId) {
      getDocById<ArtworkDoc>('artworks', artworkId).then((doc) => {
        if (doc) setArtwork(doc);
      });
    }
  }, [artworkId]);

  // Load image when artwork data is available
  useEffect(() => {
    if (artwork?.image && !hasImage) {
      loadImage(artwork.image).catch(() => {});
    }
  }, [artwork?.image, hasImage, loadImage]);

  // Apply selected colour to the active layer whenever the user picks a new colour
  useEffect(() => {
    applyColorToActiveLayer(selectedColour.hex);
  }, [selectedColour.hex, applyColorToActiveLayer]);

  // Center scroll position on initial image load only
  useEffect(() => {
    if (!hasImage) return;
    const container = scrollRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    });
  }, [hasImage]);

  // Apply pending scroll position after zoom-driven render
  useLayoutEffect(() => {
    if (!pendingScrollRef.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft = pendingScrollRef.current.left;
    scrollRef.current.scrollTop = pendingScrollRef.current.top;
    pendingScrollRef.current = null;
  });

  // Keyboard shortcuts and Space pan modifier
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressedRef.current = true;
        const container = scrollRef.current;
        if (container) container.style.cursor = 'grab';
        return;
      }

      if (!e.ctrlKey && !e.metaKey) return;

      const container = scrollRef.current;

      switch (e.key) {
        case '0': {
          e.preventDefault();
          if (!container) {
            resetZoom();
            return;
          }
          const fitZoom = Math.min(
            container.clientWidth / canvasSize,
            container.clientHeight / canvasSize,
            3
          );
          const clamped = Math.max(0.5, Number(fitZoom.toFixed(2)));
          const newSize = canvasSize * clamped;
          pendingScrollRef.current = {
            left: (newSize - container.clientWidth) / 2,
            top: (newSize - container.clientHeight) / 2,
          };
          setZoom(clamped);
          break;
        }
        case '1': {
          e.preventDefault();
          setZoom(1);
          break;
        }
        case '+':
        case '=': {
          e.preventDefault();
          zoomIn();
          break;
        }
        case '-': {
          e.preventDefault();
          zoomOut();
          break;
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressedRef.current = false;
        const container = scrollRef.current;
        if (container && !isPanning) container.style.cursor = '';
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isPanning, resetZoom, canvasSize, setZoom, zoomIn, zoomOut]);

  // Global mouse move/up while panning
  useEffect(() => {
    if (!isPanning) return;
    const onMouseMove = (e: MouseEvent) => {
      if (!panStartRef.current || !scrollRef.current) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      scrollRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
      scrollRef.current.scrollTop = panStartRef.current.scrollTop - dy;
    };
    const onMouseUp = () => {
      setIsPanning(false);
      panStartRef.current = null;
      const container = scrollRef.current;
      if (container) {
        container.style.cursor = isSpacePressedRef.current ? 'grab' : '';
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isPanning]);

  // Ctrl/Cmd + Scroll to zoom with cursor anchoring
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      const currentZoom = zoomRef.current;
      const step = 0.25;
      const newZoom = e.deltaY < 0
        ? Math.min(3, Number((currentZoom + step).toFixed(2)))
        : Math.max(0.5, Number((currentZoom - step).toFixed(2)));

      if (newZoom === currentZoom) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      pendingScrollRef.current = {
        left: (container.scrollLeft + mouseX) * (newZoom / currentZoom) - mouseX,
        top: (container.scrollTop + mouseY) * (newZoom / currentZoom) - mouseY,
      };

      setZoom(newZoom);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [setZoom]);

  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    // Pan with middle-click (button 1) or Space + left-click
    if (e.button === 1 || (isSpacePressedRef.current && e.button === 0)) {
      e.preventDefault();
      const container = scrollRef.current;
      if (!container) return;
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop,
      };
      container.style.cursor = 'grabbing';
    }
  }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Let normal left-clicks paint (stop bubbling so container doesn't pan).
    // Allow middle-click and Space+left-click to bubble for panning.
    if (e.button === 0 && !isSpacePressedRef.current) {
      e.stopPropagation();
    }
  }, []);

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
              onClick={() => setActiveLayer(layer.key)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm font-body rounded-nahkya transition-colors',
                activeLayer === layer.key
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
        <div className="grid grid-cols-3 gap-2">
          {BLEND_MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'px-3 py-2 text-sm font-body rounded-nahkya transition-colors capitalize',
                mode === m
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
          onClick={clearPaint}
          className="w-full px-3 py-2 text-sm font-body text-nahkya-text-muted hover:text-nahkya-text bg-workspace-hover rounded-nahkya transition-colors"
        >
          Clear Paint
        </button>
        <button
          onClick={resetAll}
          className="w-full px-3 py-2 text-sm font-body text-nahkya-text-muted hover:text-nahkya-text bg-workspace-hover rounded-nahkya transition-colors"
        >
          Reset All
        </button>
      </div>

      {error && (
        <p className="text-sm text-nahkya-error font-body">{error}</p>
      )}
    </>
  );

  const zoomedSize = canvasSize * zoom;

  const canvas = (
    <div
      ref={scrollRef}
      className="w-full h-full overflow-auto scrollbar-hide select-none"
      onMouseDown={handleContainerMouseDown}
    >
      <div className="flex items-center justify-center min-w-full min-h-full">
        <div
          style={{
            width: zoomedSize,
            height: zoomedSize,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: canvasSize,
              height: canvasSize,
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              onClick={handleCanvasClick}
              onMouseDown={handleCanvasMouseDown}
              className="cursor-crosshair"
            />
          </div>
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
      zoom={zoom}
      onZoomIn={zoomIn}
      onZoomOut={zoomOut}
      onZoomReset={resetZoom}
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={undo}
      onRedo={redo}
    />
  );
}
