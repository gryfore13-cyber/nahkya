import { Minus, Plus, RotateCcw, Undo2, Redo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudioZoomPillProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function StudioZoomPill({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: StudioZoomPillProps) {
  const pct = Math.round(zoom * 100);

  return (
    <div
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2',
        'flex items-center gap-1',
        'bg-nahkya-surface/90 backdrop-blur-sm',
        'border border-nahkya-border',
        'rounded-full px-2 py-1.5',
        'shadow-lg shadow-black/10',
        'z-modal'
      )}
    >
      {onUndo && (
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            'w-7 h-7 flex items-center justify-center rounded-full',
            'text-nahkya-text-muted hover:text-nahkya-burgundy',
            'hover:bg-nahkya-gold-veil',
            'transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          aria-label="Undo"
          title="Undo"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
      )}

      {onRedo && (
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            'w-7 h-7 flex items-center justify-center rounded-full',
            'text-nahkya-text-muted hover:text-nahkya-burgundy',
            'hover:bg-nahkya-gold-veil',
            'transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          aria-label="Redo"
          title="Redo"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      )}

      {(onUndo || onRedo) && (
        <div className="w-px h-4 bg-nahkya-border mx-1" />
      )}

      <button
        onClick={onZoomOut}
        disabled={zoom <= 0.5}
        className={cn(
          'w-7 h-7 flex items-center justify-center rounded-full',
          'text-nahkya-text-muted hover:text-nahkya-burgundy',
          'hover:bg-nahkya-gold-veil',
          'transition-colors',
          'disabled:opacity-30 disabled:cursor-not-allowed'
        )}
        aria-label="Zoom out"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="font-mono text-mono-sm text-nahkya-text w-10 text-center select-none">
        {pct}%
      </span>

      <button
        onClick={onZoomIn}
        disabled={zoom >= 3}
        className={cn(
          'w-7 h-7 flex items-center justify-center rounded-full',
          'text-nahkya-text-muted hover:text-nahkya-burgundy',
          'hover:bg-nahkya-gold-veil',
          'transition-colors',
          'disabled:opacity-30 disabled:cursor-not-allowed'
        )}
        aria-label="Zoom in"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-nahkya-border mx-1" />

      <button
        onClick={onReset}
        className={cn(
          'w-7 h-7 flex items-center justify-center rounded-full',
          'text-nahkya-text-muted hover:text-nahkya-burgundy',
          'hover:bg-nahkya-gold-veil',
          'transition-colors'
        )}
        aria-label="Reset zoom"
        title="Reset zoom"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
}
