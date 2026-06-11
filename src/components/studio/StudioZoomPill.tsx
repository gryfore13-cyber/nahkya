import { Minus, Plus, RotateCcw, Undo2, Redo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';

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
  const { isTouch } = useResponsive();
  const pct = Math.round(zoom * 100);

  // Touch targets: 44px on touch devices, 28px on desktop
  const btnSize = isTouch ? 'w-11 h-11' : 'w-7 h-7';
  const iconSize = isTouch ? 'w-5 h-5' : 'w-3.5 h-3.5';
  const smallIconSize = isTouch ? 'w-4 h-4' : 'w-3 h-3';
  const containerPadding = isTouch ? 'px-3 py-2' : 'px-2 py-1.5';

  return (
    <div
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2',
        'flex items-center gap-1',
        'bg-nahkya-surface/90 backdrop-blur-sm',
        'border border-nahkya-border',
        'rounded-full',
        containerPadding,
        'shadow-lg shadow-black/10',
        'z-toolbar'
      )}
    >
      {onUndo && (
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            'flex items-center justify-center rounded-full',
            'text-nahkya-text-secondary hover:text-nahkya-accent',
            'hover:bg-nahkya-highlight-subtle',
            'transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            btnSize
          )}
          aria-label="Undo"
          title="Undo"
        >
          <Undo2 className={iconSize} />
        </button>
      )}

      {onRedo && (
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            'flex items-center justify-center rounded-full',
            'text-nahkya-text-secondary hover:text-nahkya-accent',
            'hover:bg-nahkya-highlight-subtle',
            'transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            btnSize
          )}
          aria-label="Redo"
          title="Redo"
        >
          <Redo2 className={iconSize} />
        </button>
      )}

      {(onUndo || onRedo) && (
        <div className={cn('bg-nahkya-border mx-1', isTouch ? 'w-px h-5' : 'w-px h-4')} />
      )}

      <button
        onClick={onZoomOut}
        disabled={zoom <= 0.5}
        className={cn(
          'flex items-center justify-center rounded-full',
          'text-nahkya-text-secondary hover:text-nahkya-accent',
          'hover:bg-nahkya-highlight-subtle',
          'transition-colors',
          'disabled:opacity-30 disabled:cursor-not-allowed',
          btnSize
        )}
        aria-label="Zoom out"
      >
        <Minus className={iconSize} />
      </button>

      <span className={cn(
        'font-mono text-nahkya-text text-center select-none',
        isTouch ? 'text-body-sm w-12' : 'text-mono-sm w-10'
      )}>
        {pct}%
      </span>

      <button
        onClick={onZoomIn}
        disabled={zoom >= 3}
        className={cn(
          'flex items-center justify-center rounded-full',
          'text-nahkya-text-secondary hover:text-nahkya-accent',
          'hover:bg-nahkya-highlight-subtle',
          'transition-colors',
          'disabled:opacity-30 disabled:cursor-not-allowed',
          btnSize
        )}
        aria-label="Zoom in"
      >
        <Plus className={iconSize} />
      </button>

      <div className={cn('bg-nahkya-border mx-1', isTouch ? 'w-px h-5' : 'w-px h-4')} />

      <button
        onClick={onReset}
        className={cn(
          'flex items-center justify-center rounded-full',
          'text-nahkya-text-secondary hover:text-nahkya-accent',
          'hover:bg-nahkya-highlight-subtle',
          'transition-colors',
          btnSize
        )}
        aria-label="Reset zoom"
        title="Reset zoom"
      >
        <RotateCcw className={smallIconSize} />
      </button>
    </div>
  );
}
