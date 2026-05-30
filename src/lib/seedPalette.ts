// NAHKYA Colour Palette — 200-colour seed palette
// 10 Families × 4–5 Sub-Colours × 5 Tones = 205 colours
//
// Tone scale for each sub-colour:
//   0 = Lightest  (50 % toward white)
//   1 = Light     (25 % toward white)
//   2 = Base      (original pigment)
//   3 = Dark      (30 % toward near-black)
//   4 = Deepest   (55 % toward near-black)

export interface SubColour {
  name: string;
  baseHex: string;
  tones: [string, string, string, string, string];
}

export interface ColourFamily {
  name: string;
  subColours: SubColour[];
}

/* ── Helpers ── */

function hexToRgb(hex: string): [number, number, number] {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0'))
      .join('')
  );
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function blendHex(hex: string, target: string, factor: number): string {
  const [r1, g1, b1] = hexToRgb(hex);
  const [r2, g2, b2] = hexToRgb(target);
  return rgbToHex(
    lerp(r1, r2, factor),
    lerp(g1, g2, factor),
    lerp(b1, b2, factor)
  );
}

function generateTones(baseHex: string): [string, string, string, string, string] {
  return [
    blendHex(baseHex, '#FFFFFF', 0.5), // Lightest
    blendHex(baseHex, '#FFFFFF', 0.25), // Light
    baseHex, // Base
    blendHex(baseHex, '#1A1A1A', 0.3), // Dark
    blendHex(baseHex, '#1A1A1A', 0.55), // Deepest
  ];
}

const TONE_LABELS = ['Lightest', 'Light', 'Base', 'Dark', 'Deepest'] as const;

/* ── Raw pigment definitions (base hex only) ── */

const RAW_FAMILIES: { name: string; pigments: { name: string; hex: string }[] }[] = [
  {
    name: 'Red & Burgundy',
    pigments: [
      { name: 'Scarlet', hex: '#e93e49' },
      { name: 'Ruby', hex: '#eb3240' },
      { name: 'Crimson', hex: '#ea2a3b' },
      { name: 'Burgundy', hex: '#e62132' },
    ],
  },
  {
    name: 'Pink & Rose',
    pigments: [
      { name: 'Blush', hex: '#fe8599' },
      { name: 'Rose', hex: '#fc5a7e' },
      { name: 'Fuchsia', hex: '#ef3d6d' },
      { name: 'Dusty Rose', hex: '#e43d6b' },
    ],
  },
  {
    name: 'Coral & Orange',
    pigments: [
      { name: 'Peach', hex: '#fdae7f' },
      { name: 'Coral', hex: '#fb8346' },
      { name: 'Terracotta', hex: '#e86328' },
      { name: 'Burnt Orange', hex: '#b04816' },
    ],
  },
  {
    name: 'Yellow & Gold',
    pigments: [
      { name: 'Cream', hex: '#fedf9c' },
      { name: 'Sunshine', hex: '#fdbb33' },
      { name: 'Mustard', hex: '#e89c0b' },
      { name: 'Antique Gold', hex: '#c78713' },
    ],
  },
  {
    name: 'Green',
    pigments: [
      { name: 'Mint', hex: '#b3d9b0' },
      { name: 'Sage', hex: '#91ae7e' },
      { name: 'Emerald', hex: '#148753' },
      { name: 'Forest', hex: '#0f4b31' },
    ],
  },
  {
    name: 'Blue',
    pigments: [
      { name: 'Sky', hex: '#84ccf0' },
      { name: 'Teal', hex: '#2793ba' },
      { name: 'Cobalt', hex: '#2563a7' },
      { name: 'Navy', hex: '#133a75' },
    ],
  },
  {
    name: 'Purple',
    pigments: [
      { name: 'Lavender', hex: '#c9a0dd' },
      { name: 'Violet', hex: '#a068b8' },
      { name: 'Amethyst', hex: '#652e80' },
      { name: 'Plum', hex: '#461860' },
    ],
  },
  {
    name: 'Brown & Earth',
    pigments: [
      { name: 'Sand', hex: '#e2bc92' },
      { name: 'Caramel', hex: '#c88445' },
      { name: 'Chestnut', hex: '#955426' },
      { name: 'Espresso', hex: '#512c15' },
    ],
  },
  {
    name: 'Neutral',
    pigments: [
      { name: 'Ivory', hex: '#f1dfc3' },
      { name: 'Taupe', hex: '#d2b79a' },
      { name: 'Grey', hex: '#9a8b7d' },
      { name: 'Charcoal', hex: '#5c5c5c' },
      { name: 'Black', hex: '#1a1a1a' },
    ],
  },
  {
    name: 'Metallic & Luxury',
    pigments: [
      { name: 'Champagne', hex: '#d9ccb8' },
      { name: 'Antique Gold', hex: '#ecb14a' },
      { name: 'Bronze', hex: '#9c4615' },
      { name: 'Silver', hex: '#a0a0a0' },
    ],
  },
];

/* ── Compiled palette with tones ── */

export const NAHKYA_SEED_PALETTE: ColourFamily[] = RAW_FAMILIES.map((family) => ({
  name: family.name,
  subColours: family.pigments.map((p) => ({
    name: p.name,
    baseHex: p.hex,
    tones: generateTones(p.hex),
  })),
}));

export { TONE_LABELS };
