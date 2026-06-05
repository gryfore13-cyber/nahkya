// src/lib/monogramConstants.ts — NAHKYA Monogram Engine Constants

export const TILE_SIZE = 500;
export const PREVIEW_VIEWPORT_SIZE = 520;
export const SOURCE_VIEWPORT_SIZE = 640;
export const MAX_LETTERS = 4;
export const SOURCE_OFFSETS = [-1, 0, 1];

export interface FontOption {
  id: string;
  name: string;
  stack: string;
  fontStyle: 'normal' | 'italic';
  fontWeight: number;
}

export type TileFrameStyle =
  | 'none'
  | 'simple'
  | 'double'
  | 'corner-dots'
  | 'corner-diamonds'
  | 'miter'
  | 'scalloped';

export const TILE_FRAME_STYLES: { key: TileFrameStyle; label: string }[] = [
  { key: 'none', label: 'None' },
  { key: 'simple', label: 'Simple' },
  { key: 'double', label: 'Double' },
  { key: 'corner-dots', label: 'Corner Dots' },
  { key: 'corner-diamonds', label: 'Corner Diamonds' },
  { key: 'miter', label: 'Miter' },
  { key: 'scalloped', label: 'Scalloped' },
];

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'classic-serif',
    name: 'Playfair Black',
    stack: 'var(--font-display)',
    fontStyle: 'normal',
    fontWeight: 900,
  },
  {
    id: 'modern-sans',
    name: 'Lora Text',
    stack: 'var(--font-body)',
    fontStyle: 'normal',
    fontWeight: 500,
  },
  {
    id: 'fashion-serif',
    name: 'Playfair Italic',
    stack: 'var(--font-display)',
    fontStyle: 'italic',
    fontWeight: 400,
  },
];
