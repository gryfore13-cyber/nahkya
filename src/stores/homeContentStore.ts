import { create } from 'zustand';
import { subscribeConfig, setConfig } from '@/lib/firebase/db';

const DEFAULT_HERO = {
  label: 'WRAPPED WITH INTENTION',
  headline: 'Create your identity \u2014 not from shelf, but from yourself.',
  subline: 'A digital scarf atelier where colour, pattern, and personal identity are wrapped with intention.',
  ctaPrimary: 'Enter the Boutique', ctaSecondary: 'Explore the Atelier',
  backgroundImage: '/assets/hero-editorial-scarf.jpg',
};

const DEFAULT_BRAND = {
  label: 'THE HOUSE', headline: 'Where Malay heritage meets the digital atelier',
  paragraph1: 'NAHKYA is a Brunei-born digital fashion house dedicated to the art of the headscarf. We believe that what covers the head should uncover the self \u2014 every scarf is a canvas for personal identity, cultural expression, and quiet luxury.',
  paragraph2: 'Our atelier brings together centuries of Malay textile tradition with contemporary digital design tools. Members do not choose from a rack \u2014 they create. Colour by colour. Pattern by pattern. Intention by intention.',
  linkText: 'Discover Our Story', image: '/assets/brand-atelier-workspace.jpg',
};

const DEFAULT_PHILOSOPHY = {
  quote: '\u201cA scarf is not an accessory. It is the first thing the world sees of your inner landscape.\u201d',
  attribution: '\u2014 NAHKYA Design Philosophy',
};

const DEFAULT_TOOLS = [
  { num: '01', label: 'ATELIER', title: 'The Colouring Atelier', description: 'Colour existing scarf artworks layer by layer. Silk tone, motif fills, and ink lines \u2014 each controlled separately with curated pigment palettes.', image: '/assets/tool-preview-atelier.jpg' },
  { num: '02', label: 'MONOGRAM', title: 'The Monogram Studio', description: 'Transform your initials into a repeating scarf pattern. Choose fonts, rotate, scale, and arrange \u2014 then wrap yourself in your own signature.', image: '/assets/tool-preview-monogram.jpg' },
  { num: '03', label: 'PETAK', title: 'The Petak Composer', description: 'Paint geometric tiles that repeat into a complete scarf composition. Inspired by traditional grid-based textile design, made for modern expression.', image: '/assets/tool-preview-petak.jpg' },
];

const DEFAULT_STEPS = [
  { num: '01', title: 'Choose Your Canvas', description: 'Select from our curated artworks or start a pattern from scratch. Each piece is designed by NAHKYA artists with intentional negative space for your personal expression.' },
  { num: '02', title: 'Design With Colour', description: 'Use our curated pigment palettes or your own custom colours. Every tool is built for the specific craft of scarf design \u2014 not a generic image editor.' },
  { num: '03', title: 'Save & Refine', description: 'Your designs are saved to your personal gallery. Return anytime to refine colours, adjust patterns, or explore new variations.' },
  { num: '04', title: 'Submit for Production', description: 'When your design is complete, submit it for production. Our artisans in Brunei will craft your scarf in pure silk, ready for collection.' },
];

const DEFAULT_MEMBERSHIP = {
  label: 'MEMBERSHIP', headline: 'Join the atelier',
  benefits: ['Access to all three design tools', 'Save unlimited designs to your personal gallery', 'Submit designs for artisan production', 'Track your orders from loom to doorstep', 'Exclusive access to new artworks and collections', 'Member-only editorial content'],
  ctaText: 'Become a Member',
};

const DEFAULT_CONTACT = { headline: 'Begin a conversation', subline: 'Whether you seek membership, collaboration, or simply wish to learn more about the atelier \u2014 we are here.', ctaText: 'Get in Touch' };

interface HomeContentState {
  hero: typeof DEFAULT_HERO;
  brandIntro: typeof DEFAULT_BRAND;
  philosophy: typeof DEFAULT_PHILOSOPHY;
  toolPreviews: typeof DEFAULT_TOOLS;
  howItWorks: { label: string; headline: string; steps: typeof DEFAULT_STEPS };
  membership: typeof DEFAULT_MEMBERSHIP;
  contact: typeof DEFAULT_CONTACT;
  isLoaded: boolean;
  updateHero: (d: Partial<typeof DEFAULT_HERO>) => void;
  updateBrandIntro: (d: Partial<typeof DEFAULT_BRAND>) => void;
  updatePhilosophy: (d: Partial<typeof DEFAULT_PHILOSOPHY>) => void;
  updateMembership: (d: Partial<typeof DEFAULT_MEMBERSHIP>) => void;
  updateContact: (d: Partial<typeof DEFAULT_CONTACT>) => void;
  reset: () => void;
}

const FALLBACK = {
  hero: DEFAULT_HERO, brandIntro: DEFAULT_BRAND, philosophy: DEFAULT_PHILOSOPHY,
  toolPreviews: DEFAULT_TOOLS,
  howItWorks: { label: 'THE JOURNEY', headline: 'From imagination to adornment', steps: DEFAULT_STEPS },
  membership: DEFAULT_MEMBERSHIP, contact: DEFAULT_CONTACT,
};

export const useHomeContentStore = create<HomeContentState>((set, get) => ({
  ...FALLBACK,
  isLoaded: false,

  updateHero: (d) => {
    const next = { hero: { ...get().hero, ...d } };
    set(next);
    setConfig('homeContent', { ...get(), ...next });
  },

  updateBrandIntro: (d) => {
    const next = { brandIntro: { ...get().brandIntro, ...d } };
    set(next);
    setConfig('homeContent', { ...get(), ...next });
  },

  updatePhilosophy: (d) => {
    const next = { philosophy: { ...get().philosophy, ...d } };
    set(next);
    setConfig('homeContent', { ...get(), ...next });
  },

  updateMembership: (d) => {
    const next = { membership: { ...get().membership, ...d } };
    set(next);
    setConfig('homeContent', { ...get(), ...next });
  },

  updateContact: (d) => {
    const next = { contact: { ...get().contact, ...d } };
    set(next);
    setConfig('homeContent', { ...get(), ...next });
  },

  reset: () => {
    set(FALLBACK);
    setConfig('homeContent', FALLBACK);
  },
}));

subscribeConfig('homeContent', FALLBACK, (data) => {
  useHomeContentStore.setState({ ...data, isLoaded: true });
});
