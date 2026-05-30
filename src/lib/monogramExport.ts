// src/lib/monogramExport.ts — NAHKYA Monogram Export Engine

import type { MonogramSnapshot, MonogramLetter } from '@/types';

const CANVAS_SIZE = 1024;
const ARTWORK_CM = 110;

function getCanvasFont(letter: MonogramLetter, scale: number): string {
  const weight = letter.fontId === 'modern-sans' ? '500' : letter.fontId === 'fashion-serif' ? '400' : '900';
  const style = letter.fontId === 'fashion-serif' ? 'italic' : 'normal';
  const family = letter.fontId === 'modern-sans' ? 'Inter, Arial, sans-serif' : 'Georgia, "Times New Roman", serif';
  const size = Math.round(letter.fontSize * scale);
  return `${style} normal ${weight} ${size}px ${family}`;
}

/**
 * Render a monogram snapshot to an offscreen canvas.
 *
 * @param snapshot — the monogram state to render
 * @param size — output canvas size in pixels (default 1024)
 * @returns HTMLCanvasElement
 */
export function renderMonogramToCanvas(
  snapshot: MonogramSnapshot,
  size: number = CANVAS_SIZE
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  const { letters, config } = snapshot;
  const pxPerCm = size / ARTWORK_CM;

  // ── Background ──
  ctx.fillStyle = config.baseColor;
  ctx.fillRect(0, 0, size, size);

  // ── Tiled Letters ──
  const tiles = config.previewTiles;
  const gapPx = pxPerCm * config.tileSpacingCm;
  const totalGap = gapPx * (tiles - 1);
  const tileSize = (size - totalGap) / tiles;
  const centerOffset = (size - tileSize) / 2;
  const originTile = Math.floor(tiles / 2);

  for (let i = 0; i < tiles; i++) {
    for (let j = 0; j < tiles; j++) {
      const ox = i - originTile;
      const oy = j - originTile;
      const tileLeft = centerOffset + ox * (tileSize + gapPx);
      const tileTop = centerOffset + oy * (tileSize + gapPx);

      for (const letter of letters) {
        const char = letter.char || '?';
        const left = tileLeft + (letter.x / 100) * tileSize;
        const top = tileTop + (letter.y / 100) * tileSize;
        const scale = tileSize / 260;

        ctx.save();
        ctx.translate(left, top);
        ctx.rotate((letter.rotation * Math.PI) / 180);
        ctx.font = getCanvasFont(letter, scale);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = letter.color;
        ctx.fillText(char, 0, 0);
        ctx.restore();
      }
    }
  }

  // ── Borders ──
  if (config.showBorder) {
    const outerPx = Math.max(1, pxPerCm * config.borderThicknessCm);
    ctx.strokeStyle = config.borderColor;
    ctx.lineWidth = outerPx;
    ctx.strokeRect(outerPx / 2, outerPx / 2, size - outerPx, size - outerPx);

    if (config.showBorder2) {
      const inset = outerPx + pxPerCm * config.borderGapCm;
      const innerPx = Math.max(1, pxPerCm * config.borderThicknessCm2);
      ctx.strokeStyle = config.border2Color;
      ctx.lineWidth = innerPx;
      ctx.strokeRect(inset + innerPx / 2, inset + innerPx / 2, size - inset * 2 - innerPx, size - inset * 2 - innerPx);
    }
  }

  return canvas;
}

/**
 * Generate a PNG data URL thumbnail from a monogram snapshot.
 *
 * @param snapshot — the monogram state
 * @param size — thumbnail size in pixels (default 512)
 * @returns PNG data URL
 */
export function generateMonogramThumbnail(
  snapshot: MonogramSnapshot,
  size: number = 512
): string {
  const canvas = renderMonogramToCanvas(snapshot, size);
  return canvas.toDataURL('image/png');
}

/**
 * Generate a high-resolution PNG data URL for production export.
 *
 * @param snapshot — the monogram state
 * @returns PNG data URL at 2048×2048
 */
export function generateMonogramExport(snapshot: MonogramSnapshot): string {
  return renderMonogramToCanvas(snapshot, 2048).toDataURL('image/png');
}
