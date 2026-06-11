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
  | 'leadCapture'
  | 'benefits'
  | 'testimonials'
  | 'faq'
  | 'howItWorks'
  | 'lookbook'
  | 'collectionPreview';

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
  benefits: 'Benefits Section',
  testimonials: 'Testimonials Section',
  faq: 'FAQ Section',
  howItWorks: 'How It Works Section',
  lookbook: 'Lookbook Section',
  collectionPreview: 'Collection Preview Section',
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
  benefits: 'Translates product features into customer outcomes with icon cards.',
  testimonials: 'Social proof with customer quotes, photos, and ratings.',
  faq: 'Accordion-style questions that proactively address objections.',
  howItWorks: 'Step-by-step walkthrough of the service or purchase process.',
  lookbook: 'Editorial lifestyle photography that sells the dream, not just the product.',
  collectionPreview: 'Curated product grid that teases breadth without overwhelming.',
};

// ── Publishing & Animation ──

export type SectionStatus = 'draft' | 'published' | 'hidden';

export interface SectionAnimation {
  type: 'none' | 'fadeIn' | 'slideUp' | 'softReveal' | 'staggeredCards' | 'imageParallax' | 'gentleScale' | 'sectionOverlap' | 'softDivider';
  duration: 'fast' | 'normal' | 'slow';
  delay: number;
}

export const DEFAULT_SECTION_ANIMATION: SectionAnimation = {
  type: 'fadeIn',
  duration: 'normal',
  delay: 0,
};

// ── Media Settings ──

export interface SectionMediaSettings {
  image?: string;
  mobileImage?: string;
  video?: string;
  gallery?: string[];
  altText?: string;
  focalPoint?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  aspectRatio?: 'auto' | '1:1' | '4:3' | '3:4' | '4:5' | '16:9' | '21:9';
  overlayOpacity?: number;
}

// ── Responsive Settings ──

export interface ResponsiveBreakpointSettings {
  layout?: 'stacked' | 'twoColumn' | 'overlay' | 'grid' | 'carousel';
  textAlign?: 'left' | 'center' | 'right';
  imageAspectRatio?: 'auto' | '1:1' | '4:3' | '3:4' | '4:5' | '16:9';
  hideImage?: boolean;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface SectionResponsiveSettings {
  mobile?: ResponsiveBreakpointSettings;
  tablet?: ResponsiveBreakpointSettings;
  desktop?: ResponsiveBreakpointSettings;
  largeDesktop?: ResponsiveBreakpointSettings;
}

// ── Shared Section Settings ──

export interface SectionSettings {
  backgroundColor: string;
  textColor: string;
  padding: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth: boolean;
  isVisible: boolean;
  // Extended layout & style controls
  containerWidth?: 'narrow' | 'default' | 'wide' | 'full';
  contentAlignment?: 'top' | 'center' | 'bottom';
  textAlign?: 'left' | 'center' | 'right';
  borderStyle?: 'none' | 'subtle' | 'accent';
  shadow?: 'none' | 'soft' | 'card' | 'gold';
  divider?: 'none' | 'subtle' | 'accent';
  imageShape?: 'rectangle' | 'rounded' | 'circle' | 'arch';
  mediaPosition?: 'left' | 'right' | 'background' | 'top' | 'bottom';
  overlayOpacity?: number;
  mobileLayout?: 'stacked' | 'twoColumn';
  mobileTextAlign?: 'left' | 'center' | 'right';
}

export const DEFAULT_SECTION_SETTINGS: SectionSettings = {
  backgroundColor: 'nahkya-ivory',
  textColor: 'nahkya-text',
  padding: 'lg',
  fullWidth: false,
  isVisible: true,
  containerWidth: 'default',
  contentAlignment: 'center',
  textAlign: 'left',
  borderStyle: 'none',
  shadow: 'none',
  divider: 'none',
  imageShape: 'rectangle',
  mediaPosition: 'right',
  overlayOpacity: 0,
  mobileLayout: 'stacked',
  mobileTextAlign: 'center',
};

// ── Content Types per Template ──
// NOTE: Field names are preserved for backward compatibility with existing section components.
// New optional fields are added (eyebrow, body, badgeText, etc.) without renaming existing ones.

export interface SplitScreenHeroContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  ctaText: string;
  ctaLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
  badgeText?: string;
}

export interface SingleColumnFocusContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  imageUrl?: string;
}

export interface ZPatternItem {
  imageUrl: string;
  headline: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ZPatternContent {
  eyebrow?: string;
  headline?: string;
  items: ZPatternItem[];
}

export interface FPatternItem {
  imageUrl?: string;
  title: string;
  description: string;
}

export interface FPatternContent {
  eyebrow?: string;
  headline: string;
  intro: string;
  items: FPatternItem[];
}

export interface InvertedPyramidContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageUrl?: string;
}

export interface CardGridItem {
  imageUrl?: string;
  title: string;
  description: string;
  link?: string;
  badge?: string;
}

export interface CardGridContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  items: CardGridItem[];
}

export interface AlternatingRow {
  imageUrl: string;
  title: string;
  description: string;
  imagePosition: 'left' | 'right';
  caption?: string;
}

export interface AlternatingContent {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  rows: AlternatingRow[];
}

export interface LongFormSalesContent {
  eyebrow?: string;
  headline: string;
  intro: string;
  body?: string;
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    role?: string;
    imageUrl?: string;
  }>;
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
}

export interface StorytellingStep {
  number: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface StorytellingScrollContent {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  steps: StorytellingStep[];
}

export interface AsymmetricalEditorialContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body: string;
  featuredImageUrl: string;
  secondaryImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  caption?: string;
}

export interface ProductShowcaseContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  showcaseImageUrl: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export interface LeadCaptureContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  benefits: Array<{
    icon?: string;
    title: string;
  }>;
  inputPlaceholder: string;
  buttonText: string;
  successMessage: string;
  imageUrl?: string;
  privacyText?: string;
}

export interface BenefitsItem {
  icon?: string;
  title: string;
  description: string;
}

export interface BenefitsContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  items: BenefitsItem[];
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  imageUrl?: string;
  rating?: number;
}

export interface TestimonialsContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  items: TestimonialItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  items: FAQItem[];
}

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface HowItWorksContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  steps: HowItWorksStep[];
}

export interface LookbookItem {
  imageUrl: string;
  title?: string;
  caption?: string;
  link?: string;
}

export interface LookbookContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  items: LookbookItem[];
  layout: 'grid' | 'masonry' | 'carousel';
}

export interface CollectionPreviewItem {
  imageUrl: string;
  title: string;
  price?: string;
  link?: string;
  badge?: string;
  description?: string;
}

export interface CollectionPreviewContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  body?: string;
  items: CollectionPreviewItem[];
  ctaText: string;
  ctaLink: string;
}

// ── Discriminated Union ──

export interface HomepageSectionBase {
  id: string;
  order: number;
  name?: string;
  settings: SectionSettings;
  status: SectionStatus;
  animation: SectionAnimation;
  media?: SectionMediaSettings;
  responsive?: SectionResponsiveSettings;
  createdAt?: string;
  updatedAt?: string;
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
    | { templateType: 'benefits'; content: BenefitsContent }
    | { templateType: 'testimonials'; content: TestimonialsContent }
    | { templateType: 'faq'; content: FAQContent }
    | { templateType: 'howItWorks'; content: HowItWorksContent }
    | { templateType: 'lookbook'; content: LookbookContent }
    | { templateType: 'collectionPreview'; content: CollectionPreviewContent }
  );

// ── Helper: normalize section with defaults (backward compatibility) ──

export function normalizeSection(section: Partial<HomepageSection> & { id: string; templateType: TemplateType }): HomepageSection {
  const base: HomepageSectionBase = {
    id: section.id,
    order: section.order ?? 0,
    name: section.name,
    settings: {
      ...DEFAULT_SECTION_SETTINGS,
      ...section.settings,
    },
    status: section.status ?? (section.settings?.isVisible === false ? 'hidden' : 'published'),
    animation: {
      ...DEFAULT_SECTION_ANIMATION,
      ...section.animation,
    },
    media: section.media,
    responsive: section.responsive,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };

  return {
    ...base,
    templateType: section.templateType,
    content: (section.content ?? getDefaultContent(section.templateType)) as HomepageSection['content'],
  } as HomepageSection;
}

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
      name: 'Main Hero',
      templateType: 'splitScreenHero',
      status: 'published',
      animation: { ...DEFAULT_SECTION_ANIMATION },
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: {
        eyebrow: 'Luxury Digital Scarf Atelier',
        headline: 'Haus of Nahkya',
        subheadline: 'A luxury digital scarf atelier born in Brunei. Design your own silk story.',
        body: 'From heritage motifs to your personal vision, craft a scarf that is uniquely yours.',
        ctaText: 'Enter the Atelier',
        ctaLink: '/member/atelier',
        secondaryButtonText: 'Explore Collection',
        secondaryButtonLink: '/bynahkya',
        imageUrl: '',
        imagePosition: 'right',
        badgeText: 'New Season',
      },
    },
    {
      id: 'story-001',
      order: 1,
      name: 'Editorial Intro',
      templateType: 'asymmetricalEditorial',
      status: 'published',
      animation: { ...DEFAULT_SECTION_ANIMATION, type: 'slideUp' },
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: {
        eyebrow: 'Our Story',
        headline: 'Born in Brunei, Crafted for the World',
        subheadline: 'We fuse centuries of Southeast Asian textile heritage with cutting-edge digital design tools. Every scarf tells a story — yours.',
        body: 'From the rainforests of Temburong to the studios of Bandar Seri Begawan, we draw on motifs that have adorned royal ceremonies for generations. Our Atelier tools let you reimagine these patterns through your own lens — choosing colours, compositions, and finishes that speak to your personal narrative. The result is not just a scarf, but a wearable archive of culture and creativity.',
        featuredImageUrl: '',
        ctaText: 'Read Our Story',
        ctaLink: '/herstory',
        caption: 'Heritage meets innovation',
      },
    },
    {
      id: 'showcase-001',
      order: 2,
      name: 'Product Showcase',
      templateType: 'productShowcase',
      status: 'published',
      animation: { ...DEFAULT_SECTION_ANIMATION, type: 'softReveal' },
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: {
        eyebrow: 'The Collection',
        headline: 'Signature Silks',
        subheadline: 'Hand-finished 100% mulberry silk, printed at 1,200 DPI for colour depth no screen can match.',
        body: 'Each piece is a collaboration between tradition and technology.',
        features: [
          { icon: '✦', title: 'Heritage Motifs', description: 'Patterns drawn from Bruneian architecture, nature, and royal regalia.' },
          { icon: '✦', title: 'Digital Precision', description: '1,200 DPI pigment printing captures every brushstroke and gradient.' },
          { icon: '✦', title: 'Hand-Finished Edges', description: 'Each piece is signed and hand-rolled by our atelier team in Brunei.' },
        ],
        showcaseImageUrl: '',
        ctaText: 'Explore the Collection',
        ctaLink: '/bynahkya',
      },
    },
    {
      id: 'collection-001',
      order: 3,
      name: 'Collection Preview',
      templateType: 'collectionPreview',
      status: 'published',
      animation: { ...DEFAULT_SECTION_ANIMATION, type: 'staggeredCards' },
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: {
        eyebrow: 'Season Edit',
        headline: 'The Season Edit',
        subheadline: 'Curated drops from our latest collection, updated monthly.',
        body: 'Discover pieces that blend tradition with contemporary style.',
        items: [
          { imageUrl: '', title: 'Kampong Bloom', price: 'BND 280', description: 'Floral heritage pattern' },
          { imageUrl: '', title: 'Seria Gold', price: 'BND 320', description: 'Coastal sunset tones' },
          { imageUrl: '', title: 'Ulu Temburong', price: 'BND 290', description: 'Rainforest greens' },
          { imageUrl: '', title: 'Tasek Merimbun', price: 'BND 310', description: 'Lake reflection blues' },
        ],
        ctaText: 'View Full Collection',
        ctaLink: '/bynahkya',
      },
    },
    {
      id: 'how-001',
      order: 4,
      name: 'How It Works',
      templateType: 'howItWorks',
      status: 'published',
      animation: { ...DEFAULT_SECTION_ANIMATION, type: 'staggeredCards' },
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: {
        eyebrow: 'Process',
        headline: 'How It Works',
        subheadline: 'From digital sketch to silk in hand — four simple steps.',
        body: 'Our streamlined process makes creating your custom scarf effortless.',
        steps: [
          { number: 1, title: 'Choose a Base', description: 'Start with one of our heritage motifs or upload your own artwork.' },
          { number: 2, title: 'Design Your Palette', description: 'Use Atelier, Monogram, or Petak to colour, pattern, and compose.' },
          { number: 3, title: 'Review & Refine', description: 'See a photorealistic preview and tweak every detail.' },
          { number: 4, title: 'Receive Your Scarf', description: 'Hand-finished, signed, and shipped to your door in 14 days.' },
        ],
      },
    },
    {
      id: 'lookbook-001',
      order: 5,
      name: 'Lookbook Gallery',
      templateType: 'lookbook',
      status: 'published',
      animation: { ...DEFAULT_SECTION_ANIMATION, type: 'gentleScale' },
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: {
        eyebrow: 'Gallery',
        headline: 'The Lookbook',
        subheadline: 'Silk as lifestyle — styled by our community around the world.',
        body: 'See how Nahkya scarves transform every occasion.',
        items: [
          { imageUrl: '', title: 'Morning Light', caption: 'Kuala Belait' },
          { imageUrl: '', title: 'Evening Drape', caption: 'Bandar Seri Begawan' },
          { imageUrl: '', title: 'Desert Winds', caption: 'Dubai' },
          { imageUrl: '', title: 'Autumn Silk', caption: 'London' },
        ],
        layout: 'masonry',
      },
    },
    {
      id: 'benefits-001',
      order: 6,
      name: 'Benefits',
      templateType: 'benefits',
      status: 'published',
      animation: { ...DEFAULT_SECTION_ANIMATION, type: 'staggeredCards' },
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: {
        eyebrow: 'Why Us',
        headline: 'Why Nahkya?',
        subheadline: 'The details that set our digital atelier apart.',
        body: 'We believe luxury should be personal, sustainable, and accessible.',
        items: [
          { icon: '✦', title: 'Heritage Craft', description: 'Techniques refined over generations, digitised without losing soul.' },
          { icon: '✦', title: 'Unlimited Designs', description: 'Create as many variations as you like — save, share, and order.' },
          { icon: '✦', title: 'Sustainable Silk', description: 'Small-batch production, zero water waste, carbon-neutral shipping.' },
          { icon: '✦', title: 'Member Perks', description: 'Early access to drops, exclusive colourways, and commission earnings.' },
        ],
      },
    },
    {
      id: 'testimonials-001',
      order: 7,
      name: 'Testimonials',
      templateType: 'testimonials',
      status: 'published',
      animation: { ...DEFAULT_SECTION_ANIMATION, type: 'slideUp' },
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: {
        eyebrow: 'Community',
        headline: 'From Our Community',
        subheadline: 'What members and collectors say about their Nahkya experience.',
        body: 'Real stories from real people who have made Nahkya part of their lives.',
        items: [
          { quote: "I designed a scarf for my mother's birthday and she wept when she opened it. The quality is extraordinary.", author: 'Aisyah R.', role: 'Member since 2024', rating: 5 },
          { quote: "As a designer, the commission system is the most artist-friendly I've ever seen. Transparent, fast, and fair.", author: 'Khalid M.', role: 'Approved Designer', rating: 5 },
          { quote: 'The Monogram tool let me create a pattern from my initials that feels both personal and timeless.', author: 'Sarah L.', role: 'Member since 2023', rating: 5 },
        ],
      },
    },
    {
      id: 'faq-001',
      order: 8,
      name: 'FAQ',
      templateType: 'faq',
      status: 'published',
      animation: { ...DEFAULT_SECTION_ANIMATION, type: 'softReveal' },
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: {
        eyebrow: 'Support',
        headline: 'Questions & Answers',
        subheadline: 'Everything you need to know before designing your first scarf.',
        body: 'Have a question? We have answers.',
        items: [
          { question: 'What size are the scarves?', answer: 'Our standard square is 90 × 90 cm, with a 70 × 200 cm oblong available on select designs.' },
          { question: 'How long does delivery take?', answer: 'Digital proofs are ready in 24 hours. Physical scarves ship within 14 days worldwide.' },
          { question: 'Can I sell my own designs?', answer: 'Yes — apply to become an approved designer and earn a 15% commission on every sale.' },
          { question: 'What is your return policy?', answer: 'Because each piece is made to order, we accept returns only for manufacturing defects.' },
        ],
      },
    },
    {
      id: 'cta-001',
      order: 9,
      name: 'Call to Action',
      templateType: 'invertedPyramid',
      status: 'published',
      animation: { ...DEFAULT_SECTION_ANIMATION, type: 'fadeIn' },
      settings: { ...DEFAULT_SECTION_SETTINGS, backgroundColor: 'nahkya-accent', textColor: 'nahkya-inverse' },
      content: {
        eyebrow: 'Join Us',
        headline: 'Begin Your Silk Story',
        subheadline: 'Join the atelier today and receive a complimentary colour consultation with your first order.',
        description: 'Membership is free. Unlock the full Atelier, save unlimited designs, and connect with a community of textile enthusiasts and designers.',
        ctaText: 'Create an Account',
        ctaLink: '/signup',
        secondaryButtonText: 'Learn More',
        secondaryButtonLink: '/membership',
        imageUrl: '',
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
        eyebrow: '',
        headline: 'New Section',
        subheadline: 'Add your subheadline here.',
        body: '',
        ctaText: 'Learn More',
        ctaLink: '/',
        secondaryButtonText: '',
        secondaryButtonLink: '',
        imageUrl: '',
        imagePosition: 'right',
        badgeText: '',
      };
    case 'singleColumnFocus':
      return {
        eyebrow: '',
        headline: 'New Section',
        subheadline: 'Add your subheadline here.',
        body: '',
        ctaText: 'Get Started',
        ctaLink: '/',
        secondaryCtaText: '',
        secondaryCtaLink: '',
        features: [
          { title: 'Feature One', description: 'Describe your first feature.' },
          { title: 'Feature Two', description: 'Describe your second feature.' },
          { title: 'Feature Three', description: 'Describe your third feature.' },
        ],
        imageUrl: '',
      };
    case 'zPattern':
      return {
        eyebrow: '',
        headline: '',
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
        eyebrow: '',
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
        eyebrow: '',
        headline: 'Headline Here',
        subheadline: 'A compelling subheadline that narrows focus.',
        description: 'Add supporting details that lead to your primary call to action.',
        ctaText: 'Take Action',
        ctaLink: '/',
        secondaryButtonText: '',
        secondaryButtonLink: '',
        imageUrl: '',
      };
    case 'cardGrid':
      return {
        eyebrow: '',
        headline: 'Explore',
        subheadline: 'Discover what we offer.',
        body: '',
        items: [
          { title: 'Card One', description: 'Description for card one.' },
          { title: 'Card Two', description: 'Description for card two.' },
          { title: 'Card Three', description: 'Description for card three.' },
        ],
      };
    case 'alternating':
      return {
        eyebrow: '',
        headline: 'Our Story',
        subheadline: '',
        rows: [
          {
            imageUrl: '',
            title: 'Chapter One',
            description: 'Tell your first story.',
            imagePosition: 'left',
            caption: '',
          },
          {
            imageUrl: '',
            title: 'Chapter Two',
            description: 'Tell your second story.',
            imagePosition: 'right',
            caption: '',
          },
        ],
      };
    case 'longFormSales':
      return {
        eyebrow: '',
        headline: 'Why Choose Us',
        intro: 'A persuasive introduction to your offer.',
        body: '',
        features: [
          { title: 'Benefit One', description: 'Explain the first benefit.' },
          { title: 'Benefit Two', description: 'Explain the second benefit.' },
        ],
        testimonials: [
          { quote: 'An unforgettable experience.', author: 'A. Member', role: 'Collector' },
        ],
        ctaText: 'Join Now',
        ctaLink: '/membership',
        imageUrl: '',
      };
    case 'storytellingScroll':
      return {
        eyebrow: '',
        headline: 'The Journey',
        subheadline: '',
        steps: [
          { number: 1, title: 'Inspiration', description: 'Where ideas are born.' },
          { number: 2, title: 'Creation', description: 'Where designs take shape.' },
          { number: 3, title: 'Completion', description: 'Where silk meets soul.' },
        ],
      };
    case 'asymmetricalEditorial':
      return {
        eyebrow: '',
        headline: 'Editorial Feature',
        subheadline: 'A bold statement piece.',
        body: 'Write your editorial content here. Long-form text works beautifully in this layout.',
        featuredImageUrl: '',
        ctaText: 'Read More',
        ctaLink: '/',
        caption: '',
      };
    case 'productShowcase':
      return {
        eyebrow: '',
        headline: 'The Product',
        subheadline: 'See it in detail.',
        body: '',
        features: [
          { title: 'Detail One', description: 'Explain the first detail.' },
          { title: 'Detail Two', description: 'Explain the second detail.' },
        ],
        showcaseImageUrl: '',
        ctaText: 'Explore',
        ctaLink: '/',
        secondaryCtaText: '',
        secondaryCtaLink: '',
      };
    case 'leadCapture':
      return {
        eyebrow: '',
        headline: 'Join the List',
        subheadline: 'Be the first to know.',
        body: '',
        benefits: [
          { title: 'Early Access' },
          { title: 'Exclusive Drops' },
          { title: 'Member Perks' },
        ],
        inputPlaceholder: 'Enter your email',
        buttonText: 'Subscribe',
        successMessage: 'Thank you for subscribing.',
        imageUrl: '',
        privacyText: 'We respect your privacy. Unsubscribe anytime.',
      };
    case 'benefits':
      return {
        eyebrow: '',
        headline: 'The Nahkya Experience',
        subheadline: 'Why our scarves are unlike anything else.',
        body: '',
        items: [
          { title: 'Premium Silk', description: 'Grade-A mulberry silk with a luminous finish.' },
          { title: 'Fully Customisable', description: 'Design every detail, from motif to border.' },
          { title: 'Eco-Friendly', description: 'Sustainable production and plastic-free packaging.' },
          { title: 'Perfect Gift', description: 'Arrives in a handcrafted presentation box.' },
        ],
      };
    case 'testimonials':
      return {
        eyebrow: '',
        headline: 'What Our Clients Say',
        subheadline: 'Stories from the Nahkya community.',
        body: '',
        items: [
          { quote: 'The softness is unreal. I receive compliments every time I wear it.', author: 'Sarah L.', role: 'Member', rating: 5 },
          { quote: 'Designing my own scarf felt like commissioning a piece of art.', author: 'Amina R.', role: 'Designer', rating: 5 },
        ],
      };
    case 'faq':
      return {
        eyebrow: '',
        headline: 'Questions Answered',
        subheadline: 'Everything you need to know before ordering.',
        body: '',
        items: [
          { question: 'What are the dimensions?', answer: 'Each scarf measures 70 × 70 cm — the perfect square for versatility.' },
          { question: 'How long does production take?', answer: 'Production and delivery take 2–3 weeks from order confirmation.' },
          { question: 'Can I upload my own artwork?', answer: 'Yes. Use our Atelier tool to upload and position your own designs.' },
        ],
      };
    case 'howItWorks':
      return {
        eyebrow: '',
        headline: 'How It Works',
        subheadline: 'From inspiration to doorstep in four simple steps.',
        body: '',
        steps: [
          { number: 1, title: 'Design Your Scarf', description: 'Use our Atelier, Monogram, or Petak tools to create your masterpiece.' },
          { number: 2, title: 'Preview & Refine', description: 'See your design on a live silk mockup before confirming.' },
          { number: 3, title: 'We Craft It', description: 'Our artisans print and hand-finish every scarf in Brunei.' },
          { number: 4, title: 'Delivered to You', description: 'Your scarf arrives in a luxury presentation box, ready to wear.' },
        ],
      };
    case 'lookbook':
      return {
        eyebrow: '',
        headline: 'The Lookbook',
        subheadline: 'See how Nahkya scarves transform every occasion.',
        body: '',
        items: [
          { imageUrl: '', title: 'Evening Elegance', caption: 'Draped over a silk gown' },
          { imageUrl: '', title: 'Daylight Casual', caption: 'Styled with denim and gold' },
          { imageUrl: '', title: 'Wedding Guest', caption: 'A statement piece for celebrations' },
        ],
        layout: 'grid',
      };
    case 'collectionPreview':
      return {
        eyebrow: '',
        headline: 'The Collection',
        subheadline: 'Curated designs from our community of artists.',
        body: '',
        items: [
          { imageUrl: '', title: 'Midnight Bloom', price: 'BND 180', description: 'Deep navy with blooming florals' },
          { imageUrl: '', title: 'Desert Mirage', price: 'BND 180', description: 'Warm desert tones' },
          { imageUrl: '', title: 'Royal Peony', price: 'BND 180', description: 'Regal pink and gold' },
          { imageUrl: '', title: 'Ocean Drift', price: 'BND 180', description: 'Coastal blues and greens' },
        ],
        ctaText: 'View All Designs',
        ctaLink: '/member/atelier-gallery',
      };
  }
}
