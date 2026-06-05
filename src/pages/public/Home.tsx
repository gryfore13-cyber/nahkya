import { useEffect } from 'react';
import { useHomeContentStore } from '@/stores/homeContentStore';
import { DEFAULT_HOMEPAGE_CONFIG } from '@/types';
import { useAppearanceStore } from '@/stores/appearanceStore';
import { TemplateRenderer } from '@/components/homepage/TemplateRenderer';

export default function Home() {
  const config = useHomeContentStore((s) => s.config);
  const isLoaded = useHomeContentStore((s) => s.isLoaded);
  const applyAllTokens = useAppearanceStore((s) => s.applyAllTokens);

  useEffect(() => {
    applyAllTokens();
  }, [applyAllTokens]);

  const sections = Array.isArray(config.sections) && config.sections.length > 0
    ? config.sections
    : DEFAULT_HOMEPAGE_CONFIG.sections;
  const visibleSections = sections
    .filter((s) => s?.settings?.isVisible ?? false)
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-nahkya-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-nahkya-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-mono-sm uppercase tracking-widest-alt text-nahkya-text-muted">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (visibleSections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nahkya-ivory">
        <div className="text-center">
          <h1 className="font-display text-display-lg text-nahkya-text font-medium mb-4">
            Haus of Nahkya
          </h1>
          <p className="font-body text-body-md text-nahkya-text-muted max-w-md mx-auto">
            A luxury digital scarf atelier. Our homepage is being reimagined.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-nahkya-ivory">
      {visibleSections.map((section) => (
        <TemplateRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
