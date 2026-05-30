import { create } from 'zustand';
import { subscribeConfig, setConfig } from '@/lib/firebase/db';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type SectionType =
  | 'hero'
  | 'features'
  | 'split'
  | 'testimonials'
  | 'showcase'
  | 'textMedia'
  | 'gallery'
  | 'pricing'
  | 'footerCTA';

export interface HomepageSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  sortOrder: number;
  accentPalette: string;
  content: Record<string, unknown>;
}

export interface HomepageConfig {
  pageConfig: {
    title: string;
    description: string;
    status: 'draft' | 'published';
  };
  sections: HomepageSection[];
}

interface HomepageState extends HomepageConfig {
  isLoaded: boolean;
  selectedSectionId: string | null;
  editMode: boolean;
  setSelectedSection: (id: string | null) => void;
  setEditMode: (v: boolean) => void;
  updateSection: (id: string, patch: Partial<HomepageSection>) => void;
  updateSectionContent: (id: string, content: Record<string, unknown>) => void;
  reorderSections: (orderedIds: string[]) => void;
  toggleVisibility: (id: string) => void;
  addSection: (type: SectionType) => void;
  deleteSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  updatePageConfig: (patch: Partial<HomepageConfig['pageConfig']>) => void;
  reset: () => void;
}

// ------------------------------------------------------------------
// Defaults
// ------------------------------------------------------------------

const DEFAULT_PAGE_CONFIG: HomepageConfig['pageConfig'] = {
  title: 'Haus of Nahkya',
  description: 'A digital scarf atelier where colour, pattern, and personal identity are wrapped with intention.',
  status: 'published',
};

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_SECTIONS: HomepageSection[] = [
  {
    id: uid(),
    type: 'hero',
    title: 'Hero',
    visible: true,
    sortOrder: 0,
    accentPalette: 'burgundy',
    content: {
      eyebrow: 'WRAPPED WITH INTENTION',
      headline: 'Create your identity — not from shelf, but from yourself.',
      subtitle: 'A digital scarf atelier where colour, pattern, and personal identity are wrapped with intention.',
      primaryCta: { label: 'Enter the Boutique', href: '/member/atelier' },
      secondaryCta: { label: 'Explore the Atelier', href: '/membership' },
      backgroundImage: '/assets/hero-editorial-scarf.jpg',
    },
  },
  {
    id: uid(),
    type: 'features',
    title: 'Features',
    visible: true,
    sortOrder: 1,
    accentPalette: 'gold',
    content: {
      sectionTitle: 'Designed by You, Woven for You',
      sectionSubtitle: 'The Experience',
      features: [
        { icon: 'Palette', title: 'Design Your Scarf', description: 'Choose from curated artworks and colour them with our pigment palettes.' },
        { icon: 'Ruler', title: 'Monogram & Petak', description: 'Add your initials or create geometric compositions with precision tools.' },
        { icon: 'Clock', title: 'Made to Order', description: 'Each scarf is printed and finished by hand in Brunei upon your order.' },
      ],
    },
  },
  {
    id: uid(),
    type: 'split',
    title: 'Brand Story',
    visible: true,
    sortOrder: 2,
    accentPalette: 'taupe',
    content: {
      eyebrow: 'THE HOUSE',
      headline: 'Where Malay heritage meets the digital atelier',
      body: 'NAHKYA is a Brunei-born digital fashion house dedicated to the art of the headscarf. We believe that what covers the head should uncover the self — every scarf is a canvas for personal identity, cultural expression, and quiet luxury.',
      cta: { label: 'Discover Our Story', href: '/herstory' },
      image: '/assets/brand-atelier-workspace.jpg',
      imagePosition: 'right',
    },
  },
  {
    id: uid(),
    type: 'showcase',
    title: 'Collection',
    visible: true,
    sortOrder: 3,
    accentPalette: 'rose',
    content: {
      eyebrow: 'BY NAHKYA',
      headline: 'Curated Silks',
      items: [
        { title: 'The Heritage Collection', category: 'Editorial', image: '/assets/hero-silk-flow.jpg' },
        { title: 'Monogram Series', category: 'Personal', image: '/assets/tool-preview-monogram.jpg' },
        { title: 'Petak Geometrics', category: 'Pattern', image: '/assets/tool-preview-petak.jpg' },
        { title: 'Atelier Classics', category: 'Collection', image: '/assets/tool-preview-atelier.jpg' },
        { title: 'Silk Report Vol. I', category: 'Journal', image: '/assets/hero-editorial-scarf.jpg' },
      ],
    },
  },
  {
    id: uid(),
    type: 'footerCTA',
    title: 'Footer CTA',
    visible: true,
    sortOrder: 4,
    accentPalette: 'neutral',
    content: {
      headline: 'Join the Atelier',
      subline: 'Become a member and unlock exclusive designs, priority production, and member-only colour palettes.',
      ctaText: 'Get Started',
      ctaHref: '/signup',
    },
  },
];

const FALLBACK: HomepageConfig = {
  pageConfig: DEFAULT_PAGE_CONFIG,
  sections: DEFAULT_SECTIONS,
};

// ------------------------------------------------------------------
// Store
// ------------------------------------------------------------------

export const useHomepageStore = create<HomepageState>((set, get) => ({
  ...FALLBACK,
  isLoaded: false,
  selectedSectionId: null,
  editMode: true,

  setSelectedSection: (id) => set({ selectedSectionId: id }),
  setEditMode: (v) => set({ editMode: v }),

  updateSection: (id, patch) => {
    const sections = get().sections.map((s) => (s.id === id ? { ...s, ...patch } : s));
    set({ sections });
    setConfig('homepage', { sections });
  },

  updateSectionContent: (id, content) => {
    const sections = get().sections.map((s) => (s.id === id ? { ...s, content: { ...s.content, ...content } } : s));
    set({ sections });
    setConfig('homepage', { sections });
  },

  reorderSections: (orderedIds) => {
    const sections = orderedIds
      .map((id) => get().sections.find((s) => s.id === id))
      .filter(Boolean)
      .map((s, i) => ({ ...s!, sortOrder: i }));
    set({ sections });
    setConfig('homepage', { sections });
  },

  toggleVisibility: (id) => {
    const sections = get().sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s));
    set({ sections });
    setConfig('homepage', { sections });
  },

  addSection: (type) => {
    const nextOrder = get().sections.length;
    const newSection: HomepageSection = {
      id: uid(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      visible: true,
      sortOrder: nextOrder,
      accentPalette: 'gold',
      content: getDefaultContentForType(type),
    };
    const sections = [...get().sections, newSection];
    set({ sections, selectedSectionId: newSection.id });
    setConfig('homepage', { sections });
  },

  deleteSection: (id) => {
    const sections = get().sections.filter((s) => s.id !== id);
    set({ sections, selectedSectionId: null });
    setConfig('homepage', { sections });
  },

  duplicateSection: (id) => {
    const source = get().sections.find((s) => s.id === id);
    if (!source) return;
    const copy: HomepageSection = {
      ...source,
      id: uid(),
      title: `${source.title} Copy`,
      sortOrder: get().sections.length,
    };
    const sections = [...get().sections, copy];
    set({ sections, selectedSectionId: copy.id });
    setConfig('homepage', { sections });
  },

  updatePageConfig: (patch) => {
    const pageConfig = { ...get().pageConfig, ...patch };
    set({ pageConfig });
    setConfig('homepage', { pageConfig });
  },

  reset: () => {
    set(FALLBACK);
    setConfig('homepage', FALLBACK);
  },
}));

subscribeConfig<HomepageConfig>('homepage', FALLBACK, (data) => {
  useHomepageStore.setState({ ...data, isLoaded: true });
});

// ------------------------------------------------------------------
// Default content factories
// ------------------------------------------------------------------

function getDefaultContentForType(type: SectionType): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return {
        eyebrow: 'NEW SECTION',
        headline: 'Your headline here',
        subtitle: 'Add a compelling subtitle.',
        primaryCta: { label: 'Primary CTA', href: '#' },
        secondaryCta: { label: 'Secondary CTA', href: '#' },
        backgroundImage: '',
      };
    case 'features':
      return {
        sectionTitle: 'Section Title',
        sectionSubtitle: 'Eyebrow Label',
        features: [
          { icon: 'Star', title: 'Feature One', description: 'Description text.' },
          { icon: 'Star', title: 'Feature Two', description: 'Description text.' },
          { icon: 'Star', title: 'Feature Three', description: 'Description text.' },
        ],
      };
    case 'split':
      return {
        eyebrow: 'EYEBROW',
        headline: 'Headline here',
        body: 'Body paragraph text goes here.',
        cta: { label: 'Learn More', href: '#' },
        image: '',
        imagePosition: 'right',
      };
    case 'testimonials':
      return {
        sectionTitle: 'What Members Say',
        testimonials: [
          { quote: 'Amazing experience.', author: 'Jane Doe', role: 'Member', rating: 5, avatar: '' },
          { quote: 'Truly unique.', author: 'John Smith', role: 'Member', rating: 5, avatar: '' },
          { quote: 'Beautiful quality.', author: 'Sara Lee', role: 'Member', rating: 5, avatar: '' },
        ],
      };
    case 'showcase':
      return {
        eyebrow: 'COLLECTION',
        headline: 'Showcase Headline',
        items: [
          { title: 'Item One', category: 'Category', image: '' },
          { title: 'Item Two', category: 'Category', image: '' },
          { title: 'Item Three', category: 'Category', image: '' },
          { title: 'Item Four', category: 'Category', image: '' },
          { title: 'Item Five', category: 'Category', image: '' },
        ],
      };
    case 'textMedia':
      return {
        headline: 'Headline',
        body: 'Body text here.',
        media: '',
        mediaType: 'image',
      };
    case 'gallery':
      return {
        sectionTitle: 'Gallery',
        sectionSubtitle: 'Explore',
        items: [
          { image: '', caption: 'Caption 1' },
          { image: '', caption: 'Caption 2' },
          { image: '', caption: 'Caption 3' },
          { image: '', caption: 'Caption 4' },
          { image: '', caption: 'Caption 5' },
          { image: '', caption: 'Caption 6' },
        ],
      };
    case 'pricing':
      return {
        sectionTitle: 'Membership',
        cards: [
          { plan: 'Guest', price: 'Free', period: '', features: ['Browse artworks', 'Read editorial'], cta: 'Explore', featured: false },
          { plan: 'Member', price: '$12', period: '/month', features: ['All design tools', 'Save designs', 'Submit for production'], cta: 'Join', featured: true },
          { plan: 'Atelier+', price: '$29', period: '/month', features: ['Everything in Member', 'Priority production', 'Exclusive palettes', '1-on-1 consultations'], cta: 'Apply', featured: false },
        ],
      };
    case 'footerCTA':
      return {
        headline: 'Ready to begin?',
        subline: 'Join the atelier and start creating.',
        ctaText: 'Get Started',
        ctaHref: '/signup',
      };
    default:
      return {};
  }
}
