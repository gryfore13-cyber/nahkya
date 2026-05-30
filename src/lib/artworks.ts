export interface ArtworkLayer {
  id: string;
  name: string;
  type: 'silk' | 'motif' | 'ink' | 'accent';
  defaultColor: string;
  paths: string[];
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  category: 'Floral' | 'Geometric' | 'Abstract' | 'Heritage';
  thumbnail: string;
  layers: ArtworkLayer[];
}

// ─── Floral Heritage ───
const floralLayers: ArtworkLayer[] = [
  {
    id: 'silk-base',
    name: 'Silk Base',
    type: 'silk',
    defaultColor: '#1A1A1E',
    paths: [
      'M0 0h500v500H0z',
    ],
  },
  {
    id: 'floral-1',
    name: 'Main Blooms',
    type: 'motif',
    defaultColor: '#D8A34A',
    paths: [
      'M250 180c-15-25-45-25-60 0s10 55 30 65c20-10 45-40 30-65z',
      'M120 280c-20-15-50-5-50 25s35 40 55 30c10-20 15-40-5-55z',
      'M380 260c15-20 45-15 50 10s-25 45-45 40c-15-15-20-30-5-50z',
      'M200 120c-10-18-35-15-40 5s20 38 35 32c12-12 15-20 5-37z',
      'M320 350c-12-22-40-18-48 5s22 42 40 35c14-14 20-18 8-40z',
    ],
  },
  {
    id: 'floral-2',
    name: 'Leaves & Vines',
    type: 'motif',
    defaultColor: '#7A8B6F',
    paths: [
      'M250 245c-30-10-50 10-40 35s40 25 55 10c5-20 15-35-15-45z',
      'M180 200c-25-5-35 20-20 40s35 15 40-5c-5-20-5-30-20-35z',
      'M330 220c20-10 40 5 35 30s-30 20-40 5c5-18 15-25 5-35z',
      'M280 300c-20 15-40 30-30 55s35 20 45-5c-5-25-15-45-15-50z',
      'M150 320c-15 10-25 30-15 50s30 15 35-10c-10-20-20-40-20-40z',
    ],
  },
  {
    id: 'ink-lines',
    name: 'Ink Lines',
    type: 'ink',
    defaultColor: '#F4F2EE',
    paths: [
      'M250 100v400M100 250h300',
      'M150 150l200 200M350 150L150 350',
      'M200 80c0 50-20 100-50 150M300 80c0 50 20 100 50 150',
      'M80 200c50 0 100 20 150 50M420 200c-50 0-100 20-150 50',
    ],
  },
  {
    id: 'accent-dots',
    name: 'Accents',
    type: 'accent',
    defaultColor: '#C9A96E',
    paths: [
      'M250 250c0-8-6-14-14-14s-14 6-14 14 6 14 14 14 14-6 14-14z',
      'M180 180c0-5-4-9-9-9s-9 4-9 9 4 9 9 9 9-4 9-9z',
      'M320 180c0-5-4-9-9-9s-9 4-9 9 4 9 9 9 9-4 9-9z',
      'M180 320c0-5-4-9-9-9s-9 4-9 9 4 9 9 9 9-4 9-9z',
      'M320 320c0-5-4-9-9-9s-9 4-9 9 4 9 9 9 9-4 9-9z',
    ],
  },
];

// ─── Islamic Geometry ───
const geometricLayers: ArtworkLayer[] = [
  {
    id: 'silk-base',
    name: 'Silk Base',
    type: 'silk',
    defaultColor: '#F4F2EE',
    paths: ['M0 0h500v500H0z'],
  },
  {
    id: 'geo-stars',
    name: 'Star Motifs',
    type: 'motif',
    defaultColor: '#2B4C3F',
    paths: [
      'M250 100l30 80 80 30-80 30-30 80-30-80-80-30 80-30z',
      'M100 200l20 50 50 20-50 20-20 50-20-50-50-20 50-20z',
      'M400 180l15 40 40 15-40 15-15 40-15-40-40-15 40-15z',
      'M150 380l18 45 45 18-45 18-18 45-18-45-45-18 45-18z',
      'M380 380l12 30 30 12-30 12-12 30-12-30-30-12 30-12z',
    ],
  },
  {
    id: 'geo-border',
    name: 'Border Pattern',
    type: 'motif',
    defaultColor: '#D8A34A',
    paths: [
      'M0 0h500v20H0zM0 480h500v20H0zM0 0h20v500H0zM480 0h20v500H480z',
      'M20 20h30v30H20zM450 20h30v30H450zM20 450h30v30H20zM450 450h30v30H450z',
      'M250 0v20M0 250h20M480 250h20M250 480v20',
    ],
  },
  {
    id: 'ink-lines',
    name: 'Grid Lines',
    type: 'ink',
    defaultColor: '#9E9A93',
    paths: [
      'M125 0v500M250 0v500M375 0v500',
      'M0 125h500M0 250h500M0 375h500',
    ],
  },
  {
    id: 'accent-fills',
    name: 'Fill Accents',
    type: 'accent',
    defaultColor: '#B8925E',
    paths: [
      'M187 187h63v63h-63zM313 187h63v63h-63zM187 313h63v63h-63zM313 313h63v63h-63z',
    ],
  },
];

// ─── Abstract Waves ───
const abstractLayers: ArtworkLayer[] = [
  {
    id: 'silk-base',
    name: 'Silk Base',
    type: 'silk',
    defaultColor: '#111114',
    paths: ['M0 0h500v500H0z'],
  },
  {
    id: 'wave-1',
    name: 'Primary Waves',
    type: 'motif',
    defaultColor: '#D8A34A',
    paths: [
      'M0 150c100-50 200 50 300 0s200-30 200 20v-50H0z',
      'M0 250c80-40 180 40 280 0s220-20 220 30v-60H0z',
      'M0 350c120-30 200 30 320 0s180-40 180 10v-50H0z',
    ],
  },
  {
    id: 'wave-2',
    name: 'Secondary Waves',
    type: 'motif',
    defaultColor: '#8B7355',
    paths: [
      'M0 180c90-30 210 30 310 0s190-20 190 20v-40H0z',
      'M0 300c110-20 190 20 290 0s210-30 210 20v-50H0z',
    ],
  },
  {
    id: 'ink-lines',
    name: 'Contour Lines',
    type: 'ink',
    defaultColor: '#F4F2EE',
    paths: [
      'M50 100c80-20 150 20 230 0s170-30 170 10',
      'M50 400c60 10 140-10 220 0s180 20 180-10',
      'M0 200c100 10 200-10 300 0s200 20 200-10',
    ],
  },
  {
    id: 'accent-spray',
    name: 'Speckles',
    type: 'accent',
    defaultColor: '#C9A96E',
    paths: [
      'M100 100c0-3-2-5-5-5s-5 2-5 5 2 5 5 5 5-2 5-5z',
      'M400 150c0-3-2-5-5-5s-5 2-5 5 2 5 5 5 5-2 5-5z',
      'M200 400c0-3-2-5-5-5s-5 2-5 5 2 5 5 5 5-2 5-5z',
      'M350 350c0-3-2-5-5-5s-5 2-5 5 2 5 5 5 5-2 5-5z',
      'M150 200c0-2-1-3-3-3s-3 1-3 3 1 3 3 3 3-1 3-3z',
      'M300 280c0-2-1-3-3-3s-3 1-3 3 1 3 3 3 3-1 3-3z',
    ],
  },
];

// ─── Borneo Heritage ───
const heritageLayers: ArtworkLayer[] = [
  {
    id: 'silk-base',
    name: 'Silk Base',
    type: 'silk',
    defaultColor: '#2B1810',
    paths: ['M0 0h500v500H0z'],
  },
  {
    id: 'heritage-motif',
    name: 'Traditional Motif',
    type: 'motif',
    defaultColor: '#D4A574',
    paths: [
      'M250 80l20 40 40 10-30 30 10 40-40-20-40 20 10-40-30-30 40-10z',
      'M100 200l15 30 30 8-22 22 8 30-30-15-30 15 8-30-22-22 30-8z',
      'M400 180l12 25 25 6-18 18 6 25-25-12-25 12 6-25-18-18 25-6z',
      'M200 380l18 35 35 10-26 26 10 35-35-18-35 18 10-35-26-26 35-10z',
      'M350 350l10 20 20 5-15 15 5 20-20-10-20 10 5-20-15-15 20-5z',
    ],
  },
  {
    id: 'heritage-border',
    name: 'Ornamental Border',
    type: 'motif',
    defaultColor: '#8B6914',
    paths: [
      'M0 0h500v12H0zM0 488h500v12H0z',
      'M0 12h12v476H0zM488 12h12v476H488z',
      'M12 12h20v20H12zM468 12h20v20H468zM12 468h20v20H12zM468 468h20v20H468z',
      'M60 0h8v20h-8zM120 0h8v20h-8zM180 0h8v20h-8zM240 0h8v20h-8zM300 0h8v20h-8zM360 0h8v20h-8zM420 0h8v20h-8z',
    ],
  },
  {
    id: 'ink-lines',
    name: 'Detail Lines',
    type: 'ink',
    defaultColor: '#E8DCC8',
    paths: [
      'M250 250c-50-30-80 20-60 60s70 40 90 10c10-40-30-70-30-70z',
      'M150 150c-30-20-50 10-40 40s50 30 60 0c5-30-20-40-20-40z',
      'M350 150c30-20 50 10 40 40s-50 30-60 0c-5-30 20-40 20-40z',
    ],
  },
  {
    id: 'accent-dots',
    name: 'Accent Marks',
    type: 'accent',
    defaultColor: '#A08050',
    paths: [
      'M245 245h10v10h-10z',
      'M180 180h6v6h-6zM320 180h6v6h-6z',
      'M180 320h6v6h-6zM320 320h6v6h-6z',
    ],
  },
];

export const ARTWORK_TEMPLATES: Artwork[] = [
  {
    id: 'floral-heritage',
    title: 'Floral Heritage',
    artist: 'Amina S.',
    description: 'A lush botanical composition inspired by traditional Malay floral motifs. Layered blooms intertwine with delicate vines across a dark silk canvas.',
    category: 'Floral',
    thumbnail: '/assets/tool-preview-atelier.jpg',
    layers: floralLayers,
  },
  {
    id: 'islamic-geometry',
    title: 'Islamic Geometry',
    artist: 'Rashid K.',
    description: 'Precision-drawn geometric star patterns arranged in a tessellating grid. Inspired by classical Islamic art adapted for contemporary scarf design.',
    category: 'Geometric',
    thumbnail: '/assets/tool-preview-petak.jpg',
    layers: geometricLayers,
  },
  {
    id: 'abstract-waves',
    title: 'Abstract Waves',
    artist: 'Liyana M.',
    description: 'Flowing wave forms in gold and earth tones against deep charcoal. A modern abstract interpretation of Brunei\'s coastal landscape.',
    category: 'Abstract',
    thumbnail: '/assets/tool-preview-monogram.jpg',
    layers: abstractLayers,
  },
  {
    id: 'borneo-heritage',
    title: 'Borneo Heritage',
    artist: 'Dayang A.',
    description: 'Traditional Borneo motif patterns reimagined with contemporary colour sensibility. Rich earth tones and ornamental borders honour indigenous craft.',
    category: 'Heritage',
    thumbnail: '/assets/brand-atelier-workspace.jpg',
    layers: heritageLayers,
  },
];

export function getArtworkById(id: string): Artwork | undefined {
  return ARTWORK_TEMPLATES.find((a) => a.id === id);
}
