// src/components/monogram/MonogramCanvas.tsx

import { cn } from '@/lib/utils';
import { getFontStack, getFontStyle, getFontWeight } from '@/lib/monogram';
import { SOURCE_OFFSETS } from '@/lib/monogramConstants';
import { StudioViewPill } from '@/components/studio/StudioViewPill';
import type { MonogramState } from '@/hooks/useMonogramState';
import type { MonogramLetter } from '@/types';


interface MonogramCanvasProps {
  state: MonogramState;
}

export default function MonogramCanvas({ state }: MonogramCanvasProps) {
  const {
    letters,
    selectedLetterId,
    baseColor,
    borderColor,
    borderColor2,
    showBorder,
    borderThicknessCm,
    showBorder2,
    borderThicknessCm2,
    borderGapCm,
    showSourceGuides,
    snapEnabled,
    activeSnapGuides,
    getSnapFeedback,
    previewTiles,
    tileSpacingCm,
    viewMode,
    setViewMode,
    effectiveZoom,
    startDraggingLetter,
    startResize,
    startRotate,
    updateDrag,
    stopDragging,
    sourceStageRef,
    previewStageRef,
    sourceTileOrigin,
    sourceTileSize,
    previewViewportSize,
    previewOffsets,
    moveAsGroup,
  } = state;

  const showSource = viewMode === 'both' || viewMode === 'workspace';
  const showPreview = viewMode === 'both' || viewMode === 'preview';

  return (
    <div className="flex-1 flex items-center justify-center relative bg-workspace-bg min-w-0 min-h-0 p-6 gap-6 overflow-auto">
      <StudioViewPill value={viewMode} onChange={setViewMode} />
      {/* Source Stage */}
      {showSource && (
        <div className="flex flex-col gap-3 pt-10">
          <div className="flex items-center justify-between">
            <span className="text-mono-sm font-semibold uppercase tracking-widest text-nahkya-text">Design Canvas</span>
          </div>
          <div
            ref={sourceStageRef}
            className="relative aspect-square w-full max-w-stage-source overflow-hidden rounded-nahkya bg-workspace-panel border border-workspace-border shadow-xl"
            onPointerMove={updateDrag}
            onPointerUp={stopDragging}
            onPointerLeave={stopDragging}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${effectiveZoom / 100})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Tile Background */}
              <div
                className="absolute"
                style={{
                  left: sourceTileOrigin,
                  top: sourceTileOrigin,
                  width: sourceTileSize,
                  height: sourceTileSize,
                  backgroundColor: baseColor,
                }}
              />

              {/* Guides */}
              {showSourceGuides && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: sourceTileOrigin,
                    top: sourceTileOrigin,
                    width: sourceTileSize,
                    height: sourceTileSize,
                    border: '1px solid var(--nahkya-gold)',
                  }}
                >
                  {/* Corner markers */}
                  <div
                    className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-nahkya-gold"
                  />
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-nahkya-gold"
                  />
                </div>
              )}

              {/* Snap Guides */}
              {snapEnabled && activeSnapGuides.x !== null && (
                <div
                  className="absolute bg-nahkya-gold opacity-90 pointer-events-none z-40 shadow-gold-glow"
                  style={{
                    left: sourceTileOrigin + (activeSnapGuides.x / 100) * sourceTileSize,
                    top: sourceTileOrigin,
                    width: 1,
                    height: sourceTileSize,
                  }}
                />
              )}
              {snapEnabled && activeSnapGuides.y !== null && (
                <div
                  className="absolute bg-nahkya-gold opacity-90 pointer-events-none z-40 shadow-gold-glow"
                  style={{
                    left: sourceTileOrigin,
                    top: sourceTileOrigin + (activeSnapGuides.y / 100) * sourceTileSize,
                    width: sourceTileSize,
                    height: 1,
                  }}
                />
              )}

              {/* Snap Badge */}
              {(activeSnapGuides.x !== null || activeSnapGuides.y !== null) && (
                <div className="absolute top-3 left-3 bg-nahkya-gold text-nahkya-text text-mono-sm font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-50 pointer-events-none shadow-gold-glow-soft">
                  {getSnapFeedback()}
                </div>
              )}

              {/* Group Move Badge */}
              {moveAsGroup && (
                <div className="absolute top-3 right-3 bg-nahkya-charcoal text-white text-mono-sm font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-50 pointer-events-none">
                  Group
                </div>
              )}

              {/* Letters */}
              {letters.map((letter) =>
                SOURCE_OFFSETS.map((ox) =>
                  SOURCE_OFFSETS.map((oy) => {
                    const isMain = ox === 0 && oy === 0;
                    const isSelected = isMain && letter.id === selectedLetterId;
                    const left = sourceTileOrigin + (letter.x / 100) * sourceTileSize + ox * sourceTileSize;
                    const top = sourceTileOrigin + (letter.y / 100) * sourceTileSize + oy * sourceTileSize;

                    return (
                      <LetterElement
                        key={`${letter.id}-${ox}-${oy}`}
                        letter={letter}
                        left={left}
                        top={top}
                        isMain={isMain}
                        isSelected={isSelected}
                        scale={1}
                        onPointerDown={(e) => {
                          if (isMain) startDraggingLetter(e, letter);
                        }}
                        onResize={(e, corner) => {
                          if (isMain) startResize(e, letter, corner);
                        }}
                        onRotate={(e) => {
                          if (isMain) startRotate(e, letter);
                        }}
                      />
                    );
                  })
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Stage */}
      {showPreview && (
        <div className="flex flex-col gap-3 pt-10">
          <div className="flex items-center justify-between">
            <span className="text-mono-sm font-semibold uppercase tracking-widest text-nahkya-text">Repeat Preview</span>
            <span className="text-mono-sm font-semibold uppercase tracking-widest text-nahkya-text-muted bg-workspace-hover px-2.5 py-1 rounded-nahkya">
              {previewTiles} × {previewTiles}
            </span>
          </div>

          <div
            ref={previewStageRef}
            className="relative aspect-square w-full max-w-stage-preview overflow-hidden rounded-nahkya bg-workspace-panel border border-workspace-border shadow-2xl"
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${effectiveZoom / 100})`,
                transformOrigin: 'center center',
                backgroundColor: baseColor,
              }}
            >
              {/* Tiled Letters */}
              {(() => {
                const gapRatio = tileSpacingCm / 110;
                const gapPx = previewViewportSize * gapRatio;
                const totalGap = gapPx * (previewTiles - 1);
                const tileSize = (previewViewportSize - totalGap) / previewTiles;
                const centerOffset = (previewViewportSize - tileSize) / 2;

                return letters.map((letter) =>
                  previewOffsets.map((ox) =>
                    previewOffsets.map((oy) => {
                      const left = centerOffset + (letter.x / 100) * tileSize + ox * (tileSize + gapPx);
                      const top = centerOffset + (letter.y / 100) * tileSize + oy * (tileSize + gapPx);

                      return (
                        <LetterElement
                          key={`prev-${letter.id}-${ox}-${oy}`}
                          letter={letter}
                          left={left}
                          top={top}
                          isMain={false}
                          isSelected={false}
                          scale={tileSize / 260}
                        />
                      );
                    })
                  )
                );
              })()}

              {/* Borders */}
              {showBorder && (
                <PreviewBorders
                  size={previewViewportSize}
                  borderThicknessCm={borderThicknessCm}
                  borderColor={borderColor}
                  showBorder2={showBorder2}
                  borderThicknessCm2={borderThicknessCm2}
                  borderColor2={borderColor2}
                  borderGapCm={borderGapCm}
                />
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

// ── Letter Element ──

interface LetterElementProps {
  letter: MonogramLetter;
  left: number;
  top: number;
  isMain: boolean;
  isSelected: boolean;
  scale: number;
  onPointerDown?: (e: React.PointerEvent) => void;
  onResize?: (e: React.PointerEvent, corner: 'nw' | 'ne' | 'sw' | 'se') => void;
  onRotate?: (e: React.PointerEvent) => void;
}

function LetterElement({
  letter,
  left,
  top,
  isMain,
  isSelected,
  scale,
  onPointerDown,
  onResize,
  onRotate,
}: LetterElementProps) {
  return (
    <div
      className={cn(
        'absolute leading-none select-none',
        isMain ? 'cursor-grab active:cursor-grabbing z-10' : 'opacity-20 pointer-events-none z-0',
        isSelected && 'z-30'
      )}
      style={{
        left,
        top,
        fontSize: letter.fontSize * scale,
        fontFamily: getFontStack(letter.fontId),
        fontWeight: getFontWeight(letter.fontId),
        fontStyle: getFontStyle(letter.fontId),
        color: letter.color,
        transform: `translate(-50%, -50%) rotate(${letter.rotation}deg)`,
        filter: isSelected ? 'drop-shadow(0 0 8px rgba(212,175,55,0.5))' : undefined,
      }}
      onPointerDown={onPointerDown}
    >
      {letter.char || '?'}

      {/* Selection Handles */}
      {isSelected && (
        <>
          {/* Handle Box */}
          <span
            className="absolute pointer-events-none border border-nahkya-gold"
            style={{ inset: -12 }}
          />

          {/* Resize Handles */}
          {(['nw', 'ne', 'sw', 'se'] as const).map((corner) => (
            <span
              key={corner}
              className={cn(
                'absolute w-2.5 h-2.5 bg-white border border-nahkya-gold shadow-sm',
                corner === 'nw' && '-top-1.5 -left-1.5 cursor-nw-resize',
                corner === 'ne' && '-top-1.5 -right-1.5 cursor-ne-resize',
                corner === 'sw' && '-bottom-1.5 -left-1.5 cursor-sw-resize',
                corner === 'se' && '-bottom-1.5 -right-1.5 cursor-se-resize'
              )}
              onPointerDown={(e) => onResize?.(e, corner)}
            />
          ))}

          {/* Rotate Handle */}
          <span
            className="absolute left-1/2 -translate-x-1/2 w-px h-3 bg-nahkya-gold"
            style={{ top: -16 }}
          />
          <span
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border border-nahkya-gold cursor-grab shadow-sm"
            style={{ top: -28 }}
            onPointerDown={onRotate}
          />
        </>
      )}
    </div>
  );
}

// ── Preview Borders ──

interface PreviewBordersProps {
  size: number;
  borderThicknessCm: number;
  borderColor: string;
  showBorder2: boolean;
  borderThicknessCm2: number;
  borderColor2: string;
  borderGapCm: number;
}

function PreviewBorders({
  size,
  borderThicknessCm,
  borderColor,
  showBorder2,
  borderThicknessCm2,
  borderColor2,
  borderGapCm,
}: PreviewBordersProps) {
  const pxPerCm = size / 110;
  const outerPx = Math.max(1, pxPerCm * borderThicknessCm);

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          border: `${outerPx}px solid ${borderColor}`,
        }}
      />
      {showBorder2 && (
        <div
          className="absolute pointer-events-none z-21"
          style={{
            top: outerPx + pxPerCm * borderGapCm,
            left: outerPx + pxPerCm * borderGapCm,
            right: outerPx + pxPerCm * borderGapCm,
            bottom: outerPx + pxPerCm * borderGapCm,
            border: `${Math.max(1, pxPerCm * borderThicknessCm2)}px solid ${borderColor2}`,
          }}
        />
      )}
    </>
  );
}
