import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';
import { StudioTopBar } from './StudioTopBar';
import { StudioColourPanel } from './StudioColourPanel';
import { StudioZoomPill } from './StudioZoomPill';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Palette, PanelLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface StudioShellProps {
  toolName: string;
  leftPanel: React.ReactNode;
  canvas: React.ReactNode;
  onSave?: () => void;
  onSubmit?: () => void;
  topBarMiddle?: React.ReactNode;
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
  topBarMiddle,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: StudioShellProps) {
  const { isMobile, isTablet } = useResponsive();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);

  // Mobile: full-screen canvas with floating bottom toolbar and bottom sheets for panels
  if (isMobile) {
    return (
      <div className="h-[100dvh] flex flex-col bg-nahkya-bg" data-theme="dark">
        {/* Minimal top bar on mobile */}
        <StudioTopBar
          toolName={toolName}
          onSave={onSave}
          onSubmit={onSubmit}
          middle={topBarMiddle}
          variant="mobile"
        />

        {/* Canvas fills remaining space */}
        <div className="flex-1 relative overflow-hidden">
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

        {/* Floating bottom toolbar with tool toggles */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-nahkya-surface/95 backdrop-blur-md border border-nahkya-border rounded-full px-3 py-2 shadow-lg z-toolbar">
          <Drawer open={leftOpen} onOpenChange={setLeftOpen}>
            <DrawerTrigger asChild>
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full text-nahkya-text-secondary hover:text-nahkya-accent hover:bg-nahkya-highlight-subtle transition-colors"
                aria-label="Open tools"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-nahkya-surface border-t border-nahkya-border max-h-[80vh]">
              <div className="p-6 space-y-6 overflow-y-auto dark-scroll">
                {leftPanel}
              </div>
            </DrawerContent>
          </Drawer>

          <Drawer open={rightOpen} onOpenChange={setRightOpen}>
            <DrawerTrigger asChild>
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full text-nahkya-text-secondary hover:text-nahkya-accent hover:bg-nahkya-highlight-subtle transition-colors"
                aria-label="Open colours"
              >
                <Palette className="w-5 h-5" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-nahkya-surface border-t border-nahkya-border max-h-[80vh]">
              <div className="p-6 space-y-6 overflow-y-auto dark-scroll">
                <StudioColourPanel />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    );
  }

  // Tablet: collapsible icon rails that expand to drawers
  if (isTablet) {
    return (
      <div className="h-[100dvh] flex flex-col bg-nahkya-bg" data-theme="dark">
        <StudioTopBar
          toolName={toolName}
          onSave={onSave}
          onSubmit={onSubmit}
          middle={topBarMiddle}
          variant="compact"
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Left icon rail */}
          <div className="w-16 bg-nahkya-surface border-r border-nahkya-border flex-shrink-0 flex flex-col items-center py-4 gap-2">
            <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
              <SheetTrigger asChild>
                <button
                  className="w-11 h-11 flex items-center justify-center rounded-nahkya text-nahkya-text-secondary hover:text-nahkya-accent hover:bg-nahkya-highlight-subtle transition-colors"
                  aria-label="Open tools"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-panel-studio bg-nahkya-surface border-r border-nahkya-border p-0 flex flex-col">
                <div className="p-6 space-y-6 overflow-y-auto dark-scroll flex-1">
                  {leftPanel}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Canvas */}
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

          {/* Right icon rail */}
          <div className="w-16 bg-nahkya-surface border-l border-nahkya-border flex-shrink-0 flex flex-col items-center py-4 gap-2">
            <Sheet open={rightOpen} onOpenChange={setRightOpen}>
              <SheetTrigger asChild>
                <button
                  className="w-11 h-11 flex items-center justify-center rounded-nahkya text-nahkya-text-secondary hover:text-nahkya-accent hover:bg-nahkya-highlight-subtle transition-colors"
                  aria-label="Open colours"
                >
                  <Palette className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-panel-studio bg-nahkya-surface border-l border-nahkya-border p-0 flex flex-col">
                <div className="p-6 space-y-6 overflow-y-auto dark-scroll flex-1">
                  <StudioColourPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    );
  }

  // Desktop / Widescreen: full three-panel layout with optional collapse
  return (
    <div className="h-[100dvh] flex flex-col bg-nahkya-bg" data-theme="dark">
      <StudioTopBar
        toolName={toolName}
        onSave={onSave}
        onSubmit={onSubmit}
        middle={topBarMiddle}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — collapsible on desktop */}
        <div
          className={cn(
            'bg-nahkya-surface border-r border-nahkya-border flex-shrink-0 overflow-hidden transition-all duration-300 flex flex-col',
            leftCollapsed ? 'w-sidebar-collapsed' : 'w-panel-studio'
          )}
        >
          <button
            onClick={() => setLeftCollapsed((p) => !p)}
            className="w-full h-8 flex items-center justify-center border-b border-nahkya-border text-nahkya-text-secondary hover:text-nahkya-accent hover:bg-nahkya-highlight-subtle transition-colors"
            aria-label={leftCollapsed ? 'Expand tools' : 'Collapse tools'}
          >
            {leftCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <div className={cn('flex-1 overflow-y-auto dark-scroll', leftCollapsed ? 'p-2' : 'p-6 space-y-6')}>
            {leftCollapsed ? (
              <div className="flex flex-col items-center gap-2">
                <PanelLeft className="w-5 h-5 text-nahkya-text-secondary" />
                <span className="font-mono text-body-3xs text-nahkya-text-secondary uppercase tracking-label [writing-mode:vertical-rl]">
                  Tools
                </span>
              </div>
            ) : (
              leftPanel
            )}
          </div>
        </div>

        {/* Canvas */}
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

        {/* Right Panel — colour panel */}
        <StudioColourPanel />
      </div>
    </div>
  );
}
