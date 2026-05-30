import { useHomepageStore } from '@/stores/homepageStore';
import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { SplitSection } from './sections/SplitSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { ShowcaseSection } from './sections/ShowcaseSection';
import { TextMediaSection } from './sections/TextMediaSection';
import { GallerySection } from './sections/GallerySection';
import { PricingSection } from './sections/PricingSection';
import { FooterCTASection } from './sections/FooterCTASection';

const SECTION_MAP = {
  hero: HeroSection,
  features: FeaturesSection,
  split: SplitSection,
  testimonials: TestimonialsSection,
  showcase: ShowcaseSection,
  textMedia: TextMediaSection,
  gallery: GallerySection,
  pricing: PricingSection,
  footerCTA: FooterCTASection,
};

interface SectionRendererProps {
  sectionId?: string;
  editable?: boolean;
}

export function SectionRenderer({ sectionId, editable = false }: SectionRendererProps) {
  const sections = useHomepageStore((s) => s.sections);
  const selectedSectionId = useHomepageStore((s) => s.selectedSectionId);
  const setSelectedSection = useHomepageStore((s) => s.setSelectedSection);

  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const targetSections = sectionId
    ? visibleSections.filter((s) => s.id === sectionId)
    : visibleSections;

  return (
    <>
      {targetSections.map((section) => {
        const Component = SECTION_MAP[section.type];
        if (!Component) return null;
        return (
          <Component
            key={section.id}
            content={section.content}
            accentPalette={section.accentPalette}
            selected={editable && selectedSectionId === section.id}
            onClick={editable ? () => setSelectedSection(section.id) : undefined}
          />
        );
      })}
    </>
  );
}
