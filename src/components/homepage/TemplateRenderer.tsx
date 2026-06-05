import { lazy, Suspense } from 'react';
import type { HomepageSection } from '@/types';

// Each section component is typed for its specific template variant,
// but we need a unified renderer signature. We cast through `unknown`
// to satisfy the discriminated-union → generic mapping.
const sectionComponents: Record<
  HomepageSection['templateType'],
  React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>
> = {
  splitScreenHero: lazy(() => import('@/components/homepage/sections/SplitScreenHeroSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  singleColumnFocus: lazy(() => import('@/components/homepage/sections/SingleColumnFocusSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  zPattern: lazy(() => import('@/components/homepage/sections/ZPatternSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  fPattern: lazy(() => import('@/components/homepage/sections/FPatternSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  invertedPyramid: lazy(() => import('@/components/homepage/sections/InvertedPyramidSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  cardGrid: lazy(() => import('@/components/homepage/sections/CardGridSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  alternating: lazy(() => import('@/components/homepage/sections/AlternatingSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  longFormSales: lazy(() => import('@/components/homepage/sections/LongFormSalesSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  storytellingScroll: lazy(() => import('@/components/homepage/sections/StorytellingScrollSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  asymmetricalEditorial: lazy(() => import('@/components/homepage/sections/AsymmetricalEditorialSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  productShowcase: lazy(() => import('@/components/homepage/sections/ProductShowcaseSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
  leadCapture: lazy(() => import('@/components/homepage/sections/LeadCaptureSection')) as unknown as React.LazyExoticComponent<React.ComponentType<{ section: HomepageSection }>>,
};

interface TemplateRendererProps {
  section: HomepageSection;
}

export function TemplateRenderer({ section }: TemplateRendererProps) {
  const Component = sectionComponents[section.templateType];

  if (!Component) {
    return (
      <div className="py-12 text-center font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-widest">
        Unknown template: {section.templateType}
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="py-20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-nahkya-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Component section={section} />
    </Suspense>
  );
}
