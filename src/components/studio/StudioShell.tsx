import { StudioTopBar } from './StudioTopBar';
import { StudioColourPanel } from './StudioColourPanel';
import { StudioZoomPill } from './StudioZoomPill';

interface StudioShellProps {
  toolName: string;
  leftPanel: React.ReactNode;
  canvas: React.ReactNode;
  onSave?: () => void;
  onSubmit?: () => void;
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function StudioShell({
  toolName,
  leftPanel,
  canvas,
  onSave,
  onSubmit,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: StudioShellProps) {
  return (
    <div className="h-screen flex flex-col bg-nahkya-bg">
      {/* Top Bar — shared across all tools */}
      <StudioTopBar toolName={toolName} onSave={onSave} onSubmit={onSubmit} />

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — tool-specific */}
        <div className="w-panel-studio bg-nahkya-surface border-r border-nahkya-border flex-shrink-0 overflow-y-auto workspace-scroll">
          <div className="p-6 space-y-6">
            {leftPanel}
          </div>
        </div>

        {/* Canvas — tool-specific */}
        <div className="flex-1 flex items-center justify-center relative bg-nahkya-bg min-w-0 min-h-0">
          {canvas}
          {zoom !== undefined && onZoomIn && onZoomOut && onZoomReset && (
            <StudioZoomPill
              zoom={zoom}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onReset={onZoomReset}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={onUndo}
              onRedo={onRedo}
            />
          )}
        </div>

        {/* Right Panel — shared colour panel */}
        <StudioColourPanel />
      </div>
    </div>
  );
}
