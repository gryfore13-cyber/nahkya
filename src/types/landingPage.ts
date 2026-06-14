export type LandingSectionType =
  | 'nav'
  | 'hero'
  | 'story'
  | 'tools'
  | 'gallery'
  | 'trust'
  | 'commerce'
  | 'footer';

export type LandingHeroVariant = 'default' | 'editorial' | 'split' | 'product';
export type LandingStoryVariant = 'default' | 'founder' | 'campaign';
export type LandingToolsVariant = 'default' | 'process' | 'grid';
export type LandingGalleryVariant = 'lookbook' | 'product' | 'editorial';
export type LandingTrustVariant = 'testimonials' | 'press';
export type LandingCommerceVariant = 'pricing' | 'waitlist' | 'booking' | 'final';
export type LandingFooterVariant = 'default' | 'simple' | 'full';

export interface LandingTextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  color?: string;
}

export type LandingTextField = string | { text: string; style?: LandingTextStyle };

export interface LandingNavLink {
  label: string;
  target: string;
}

export interface LandingNavSection {
  type: 'nav';
  id: string;
  logoText: string;
  logoImageUrl?: string;
  links: LandingNavLink[];
  contactText?: string;
  contactTarget?: string;
  ctaText: string;
  ctaTarget: string;
  style: 'solid' | 'transparent' | 'floating';
  sticky: boolean;
}

export interface LandingHeroSection {
  type: 'hero';
  variant: LandingHeroVariant;
  id: string;
  eyebrow?: LandingTextField;
  headline: LandingTextField;
  body: LandingTextField;
  ctaText: LandingTextField;
  ctaTarget: string;
  imageUrl?: string;
  settings: LandingSectionSettings;
}

export interface LandingStorySection {
  type: 'story';
  variant: LandingStoryVariant;
  id: string;
  eyebrow?: LandingTextField;
  headline?: LandingTextField;
  quote?: LandingTextField;
  body: LandingTextField;
  imageUrl?: string;
  settings: LandingSectionSettings;
}

export interface LandingToolItem {
  title: LandingTextField;
  description: LandingTextField;
}

export interface LandingToolsSection {
  type: 'tools';
  variant: LandingToolsVariant;
  id: string;
  eyebrow?: LandingTextField;
  headline: LandingTextField;
  items: LandingToolItem[];
  settings: LandingSectionSettings;
}

export interface LandingGalleryItem {
  label: LandingTextField;
  note: LandingTextField;
  imageUrl?: string;
}

export interface LandingGallerySection {
  type: 'gallery';
  variant: LandingGalleryVariant;
  id: string;
  eyebrow?: LandingTextField;
  headline: LandingTextField;
  items: LandingGalleryItem[];
  settings: LandingSectionSettings;
}

export interface LandingTestimonial {
  quote: LandingTextField;
  author: LandingTextField;
}

export interface LandingTrustSection {
  type: 'trust';
  variant: LandingTrustVariant;
  id: string;
  eyebrow?: LandingTextField;
  headline: LandingTextField;
  testimonials?: LandingTestimonial[];
  press?: LandingTextField[];
  settings: LandingSectionSettings;
}

export interface LandingPricingItem {
  title: LandingTextField;
  price: LandingTextField;
  note: LandingTextField;
  ctaText: LandingTextField;
}

export interface LandingBookingItem {
  title: LandingTextField;
  description: LandingTextField;
}

export interface LandingCommerceSection {
  type: 'commerce';
  variant: LandingCommerceVariant;
  id: string;
  eyebrow?: LandingTextField;
  headline: LandingTextField;
  body?: LandingTextField;
  items?: LandingPricingItem[] | LandingBookingItem[];
  ctaText?: LandingTextField;
  settings: LandingSectionSettings;
}

export interface LandingFooterColumn {
  title: LandingTextField;
  links: LandingTextField[];
}

export interface LandingFooterSection {
  type: 'footer';
  variant: LandingFooterVariant;
  id: string;
  brandText: LandingTextField;
  columns?: LandingFooterColumn[];
  links?: LandingTextField[];
  copyright: LandingTextField;
  settings: LandingSectionSettings;
}

export interface LandingSectionSettings {
  backgroundColor: string;
  backgroundPosition?: string;
  textColor: string;
  padding: 'compact' | 'standard' | 'luxury';
  align: 'left' | 'center' | 'right';
  isVisible: boolean;
}

export type LandingSection =
  | LandingNavSection
  | LandingHeroSection
  | LandingStorySection
  | LandingToolsSection
  | LandingGallerySection
  | LandingTrustSection
  | LandingCommerceSection
  | LandingFooterSection;

export interface LandingPageConfig {
  enabled: boolean;
  metaTitle: string;
  metaDescription: string;
  nav: LandingNavSection;
  sections: LandingSection[];
}
