// ── Homepage Section Templates ──

export type TemplateType =
  | 'splitScreenHero'
  | 'singleColumnFocus'
  | 'zPattern'
  | 'fPattern'
  | 'invertedPyramid'
  | 'cardGrid'
  | 'alternating'
  | 'longFormSales'
  | 'storytellingScroll'
  | 'asymmetricalEditorial'
  | 'productShowcase'
  | 'leadCapture';

export const TEMPLATE_LABELS: Record<TemplateType, string> = {
  splitScreenHero: 'Split-Screen Hero',
  singleColumnFocus: 'Single-Column Focus',
  zPattern: 'Z-Pattern Layout',
  fPattern: 'F-Pattern Layout',
  invertedPyramid: 'Inverted Pyramid',
  cardGrid: 'Card Grid Layout',
  alternating: 'Alternating Section Layout',
  longFormSales: 'Long-Form Sales Page',
  storytellingScroll: 'Storytelling Scroll Layout',
  asymmetricalEditorial: 'Asymmetrical Editorial Layout',
  productShowcase: 'Product Showcase Layout',
  leadCapture: 'Lead Capture / Waitlist Layout',
};

export const TEMPLATE_DESCRIPTIONS: Record<TemplateType, string> = {
  splitScreenHero: 'Balances product visuals and clear messaging with a 50/50 split.',
  singleColumnFocus: 'Simple offers and strong call-to-action pages.',
  zPattern: 'Fast-scanning pages with visual flow.',
  fPattern: 'Content-heavy pages where users read top-down.',
  invertedPyramid: 'Leads users from headline to one key action.',
  cardGrid: 'Showcases features, services, or categories.',
  alternating: 'Storytelling with images and text side by side.',
  longFormSales: 'Persuasive pages that need explanation and trust-building.',
  storytellingScroll: 'Guided narrative experiences and brand journeys.',
  asymmetricalEditorial: 'Premium, fashion-forward, or creative brands.',
  productShowcase: 'Apps, SaaS, or products with demo previews.',
  leadCapture: 'Collecting signups quickly with minimal distraction.',
};

// ── Shared Section Settings ──

export interface SectionSettings {
  backgroundColor: string;
  textColor: string;
  padding: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth: boolean;
  isVisible: boolean;
}

export const DEFAULT_SECTION_SETTINGS: SectionSettings = {
  backgroundColor: 'nahkya-ivory',
  textColor: 'nahkya-text',
  padding: 'lg',
  fullWidth: false,
  isVisible: true,
};

// ── Content Types per Template ──

export interface SplitScreenHeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
}

export interface SingleColumnFocusContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export interface ZPatternItem {
  imageUrl: string;
  headline: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ZPatternContent {
  items: ZPatternItem[];
}

export interface FPatternItem {
  imageUrl?: string;
  title: string;
  description: string;
}

export interface FPatternContent {
  headline: string;
  intro: string;
  items: FPatternItem[];
}

export interface InvertedPyramidContent {
  headline: string;
  subheadline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export interface CardGridItem {
  imageUrl?: string;
  title: string;
  description: string;
  link?: string;
}

export interface CardGridContent {
  headline: string;
  subheadline: string;
  items: CardGridItem[];
}

export interface AlternatingRow {
  imageUrl: string;
  title: string;
  description: string;
  imagePosition: 'left' | 'right';
}

export interface AlternatingContent {
  headline: string;
  rows: AlternatingRow[];
}

export interface LongFormSalesContent {
  headline: string;
  intro: string;
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    role?: string;
  }>;
  ctaText: string;
  ctaLink: string;
}

export interface StorytellingStep {
  number: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface StorytellingScrollContent {
  headline: string;
  steps: StorytellingStep[];
}

export interface AsymmetricalEditorialContent {
  headline: string;
  subheadline: string;
  body: string;
  featuredImageUrl: string;
  secondaryImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ProductShowcaseContent {
  headline: string;
  subheadline: string;
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  showcaseImageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export interface LeadCaptureContent {
  headline: string;
  subheadline: string;
  benefits: Array<{
    icon?: string;
    title: string;
  }>;
  inputPlaceholder: string;
  buttonText: string;
  successMessage: string;
}

// ── Discriminated Union ──

export interface HomepageSectionBase {
  id: string;
  order: number;
  settings: SectionSettings;
}

export type HomepageSection = HomepageSectionBase &
  (
    | { templateType: 'splitScreenHero'; content: SplitScreenHeroContent }
    | { templateType: 'singleColumnFocus'; content: SingleColumnFocusContent }
    | { templateType: 'zPattern'; content: ZPatternContent }
    | { templateType: 'fPattern'; content: FPatternContent }
    | { templateType: 'invertedPyramid'; content: InvertedPyramidContent }
    | { templateType: 'cardGrid'; content: CardGridContent }
    | { templateType: 'alternating'; content: AlternatingContent }
    | { templateType: 'longFormSales'; content: LongFormSalesContent }
    | { templateType: 'storytellingScroll'; content: StorytellingScrollContent }
    | { templateType: 'asymmetricalEditorial'; content: AsymmetricalEditorialContent }
    | { templateType: 'productShowcase'; content: ProductShowcaseContent }
    | { templateType: 'leadCapture'; content: LeadCaptureContent }
  );

// ── Homepage Config ──

export interface HomepageConfig {
  sections: HomepageSection[];
  metaTitle: string;
  metaDescription: string;
}

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  sections: [
    {
      id: 'hero-001',
      order: 0,
      templateType: 'splitScreenHero',
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: {
        headline: 'Haus of Nahkya',
        subheadline: 'A luxury digital scarf atelier born in Brunei. Design your own silk story.',
        ctaText: 'Enter the Atelier',
        ctaLink: '/member/atelier',
        imageUrl: '',
        imagePosition: 'right',
      },
    },
  ],
  metaTitle: 'Haus of Nahkya — Luxury Digital Scarf Atelier',
  metaDescription: 'Design custom silk scarves through our digital atelier. Born in Brunei, crafted for the world.',
};

// ── Helper: default content factory ──

export function getDefaultContent(templateType: TemplateType): HomepageSection['content'] {
  switch (templateType) {
    case 'splitScreenHero':
      return {
        headline: 'New Section',
        subheadline: 'Add your subheadline here.',
        ctaText: 'Learn More',
        ctaLink: '/',
        imageUrl: '',
        imagePosition: 'right',
      };
    case 'singleColumnFocus':
      return {
        headline: 'New Section',
        subheadline: 'Add your subheadline here.',
        ctaText: 'Get Started',
        ctaLink: '/',
        features: [
          { title: 'Feature One', description: 'Describe your first feature.' },
          { title: 'Feature Two', description: 'Describe your second feature.' },
          { title: 'Feature Three', description: 'Describe your third feature.' },
        ],
      };
    case 'zPattern':
      return {
        items: [
          {
            imageUrl: '',
            headline: 'First Point',
            description: 'Describe your first point.',
            ctaText: 'Read More',
            ctaLink: '/',
          },
          {
            imageUrl: '',
            headline: 'Second Point',
            description: 'Describe your second point.',
            ctaText: 'Read More',
            ctaLink: '/',
          },
        ],
      };
    case 'fPattern':
      return {
        headline: 'New Section',
        intro: 'Add an introductory paragraph here.',
        items: [
          { title: 'Item One', description: 'Description for item one.' },
          { title: 'Item Two', description: 'Description for item two.' },
          { title: 'Item Three', description: 'Description for item three.' },
        ],
      };
    case 'invertedPyramid':
      return {
        headline: 'Headline Here',
        subheadline: 'A compelling subheadline that narrows focus.',
        description: 'Add supporting details that lead to your primary call to action.',
        ctaText: 'Take Action',
        ctaLink: '/',
      };
    case 'cardGrid':
      return {
        headline: 'Explore',
        subheadline: 'Discover what we offer.',
        items: [
          { title: 'Card One', description: 'Description for card one.' },
          { title: 'Card Two', description: 'Description for card two.' },
          { title: 'Card Three', description: 'Description for card three.' },
        ],
      };
    case 'alternating':
      return {
        headline: 'Our Story',
        rows: [
          {
            imageUrl: '',
            title: 'Chapter One',
            description: 'Tell your first story.',
            imagePosition: 'left',
          },
          {
            imageUrl: '',
            title: 'Chapter Two',
            description: 'Tell your second story.',
            imagePosition: 'right',
          },
        ],
      };
    case 'longFormSales':
      return {
        headline: 'Why Choose Us',
        intro: 'A persuasive introduction to your offer.',
        features: [
          { title: 'Benefit One', description: 'Explain the first benefit.' },
          { title: 'Benefit Two', description: 'Explain the second benefit.' },
        ],
        testimonials: [
          { quote: 'An unforgettable experience.', author: 'A. Member', role: 'Collector' },
        ],
        ctaText: 'Join Now',
        ctaLink: '/membership',
      };
    case 'storytellingScroll':
      return {
        headline: 'The Journey',
        steps: [
          { number: 1, title: 'Inspiration', description: 'Where ideas are born.' },
          { number: 2, title: 'Creation', description: 'Where designs take shape.' },
          { number: 3, title: 'Completion', description: 'Where silk meets soul.' },
        ],
      };
    case 'asymmetricalEditorial':
      return {
        headline: 'Editorial Feature',
        subheadline: 'A bold statement piece.',
        body: 'Write your editorial content here. Long-form text works beautifully in this layout.',
        featuredImageUrl: '',
        ctaText: 'Read More',
        ctaLink: '/',
      };
    case 'productShowcase':
      return {
        headline: 'The Product',
        subheadline: 'See it in detail.',
        features: [
          { title: 'Detail One', description: 'Explain the first detail.' },
          { title: 'Detail Two', description: 'Explain the second detail.' },
        ],
        showcaseImageUrl: '',
        ctaText: 'Explore',
        ctaLink: '/',
      };
    case 'leadCapture':
      return {
        headline: 'Join the List',
        subheadline: 'Be the first to know.',
        benefits: [
          { title: 'Early Access' },
          { title: 'Exclusive Drops' },
          { title: 'Member Perks' },
        ],
        inputPlaceholder: 'Enter your email',
        buttonText: 'Subscribe',
        successMessage: 'Thank you for subscribing.',
      };
  }
}
