// src/lib/monogram.ts — NAHKYA Monogram Utilities

import { FONT_OPTIONS } from '@/lib/monogramConstants';
import type { MonogramLetter } from '@/types';

/**
 * Resolve a font stack CSS value from a font ID.
 */
export function getFontStack(fontId: string): string {
  const font = FONT_OPTIONS.find((f) => f.id === fontId);
  return font?.stack ?? 'var(--font-display)';
}

/**
 * Resolve font-style for a given font ID.
 */
export function getFontStyle(fontId: string): React.CSSProperties['fontStyle'] {
  const font = FONT_OPTIONS.find((f) => f.id === fontId);
  return (font?.fontStyle as React.CSSProperties['fontStyle']) ?? 'normal';
}

/**
 * Resolve font-weight for a given font ID.
 */
export function getFontWeight(fontId: string): number {
  const font = FONT_OPTIONS.find((f) => f.id === fontId);
  return font?.fontWeight ?? 900;
}

/**
 * Sanitize a color string. Returns the fallback if empty/invalid.
 */
export function safeColor(color: string | undefined, fallback = '#2A2A2A'): string {
  if (!color || color.trim() === '') return fallback;
  const hex = color.trim();
  if (/^#[0-9A-Fa-f]{3,8}$/.test(hex)) return hex;
  if (/^rgb\(|^rgba\(|^hsl\(/.test(hex)) return hex;
  return fallback;
}

/**
 * Snap a rotation value to the nearest step (default 15°).
 */
export function snapRotation(deg: number, step = 15): number {
  return Math.round(deg / step) * step;
}

/**
 * Convert a percentage (0–100) to pixels within a given container size.
 */
export function percentToPx(percent: number, containerPx: number): number {
  return (percent / 100) * containerPx;
}

/**
 * Convert centimeters to pixels based on artwork dimensions.
 * @param cm — value in centimeters
 * @param viewportPx — current viewport size in pixels
 * @param artworkCm — artwork size in centimeters (default 110)
 */
export function cmToPx(cm: number, viewportPx: number, artworkCm = 110): number {
  return (cm / artworkCm) * viewportPx;
}

/**
 * Calculate px-per-cm ratio for a given viewport.
 */
export function getPxPerCm(viewportPx: number, artworkCm = 110): number {
  return viewportPx / artworkCm;
}

/**
 * Deep clone a monogram letter.
 */
export function cloneLetter(letter: MonogramLetter): MonogramLetter {
  return { ...letter };
}

/**
 * Generate a unique letter ID.
 */
export function generateLetterId(): string {
  return `letter_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Default initial letter for a fresh monogram.
 */
export function createDefaultLetter(index = 0): MonogramLetter {
  const chars = ['N', 'A', 'H', 'K'];
  return {
    id: generateLetterId(),
    char: chars[index] ?? '?',
    fontId: 'classic-serif',
    fontSize: 250,
    rotation: 0,
    x: 50,
    y: 50,
    color: '#2A2A2A',
    blendMode: 'normal',
  };
}

/**
 * Check if two colors are the same (case-insensitive).
 */
export function colorsEqual(a: string, b: string): boolean {
  return a.toUpperCase() === b.toUpperCase();
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get Tailwind font classes for a font ID.
 */
export function getFontClasses(fontId: string): string {
  const map: Record<string, string> = {
    'classic-serif': 'font-display font-black',
    'modern-sans': 'font-body font-medium',
    'fashion-serif': 'font-display font-normal italic',
  };
  return map[fontId] ?? 'font-display font-black';
}
