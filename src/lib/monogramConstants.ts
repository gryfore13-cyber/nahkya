// src/lib/monogramConstants.ts — NAHKYA Monogram Engine Constants

export const TILE_SIZE = 500;
export const PREVIEW_VIEWPORT_SIZE = 520;
export const SOURCE_VIEWPORT_SIZE = 400;
export const MAX_LETTERS = 4;
export const SOURCE_OFFSETS = [-1, 0, 1];

export interface FontOption {
  id: string;
  name: string;
  stack: string;
  fontStyle: 'normal' | 'italic';
  fontWeight: number;
}

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
