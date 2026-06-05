import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'splitScreenHero' };
}

export default function SplitScreenHeroSection({ section }: Props) {
  const { content, settings } = section;
  const imageFirst = content.imagePosition === 'left';

  return (
    <SectionWrapper settings={settings} className="min-h-[80vh] flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
        {imageFirst && (
          <div className="order-1 lg:order-1">
            {content.imageUrl ? (
              <img
                src={content.imageUrl}
                alt={content.headline}
                className="w-full h-[400px] lg:h-[600px] object-cover rounded-nahkya"
              />
            ) : (
              <div className="w-full h-[400px] lg:h-[600px] bg-nahkya-stone/20 rounded-nahkya flex items-center justify-center">
                <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-widest">
                  Image
                </span>
              </div>
            )}
          </div>
        )}

        <div className={cn('order-2', imageFirst ? 'lg:order-2' : 'lg:order-1')}>
          <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-6">
            {content.headline}
          </h2>
          <p className="font-body text-body-lg text-nahkya-text-muted max-w-lg mb-8">
            {content.subheadline}
          </p>
          {content.ctaText && (
            <a
              href={content.ctaLink}
              className="inline-flex items-center px-8 py-4 bg-nahkya-gold text-nahkya-text-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-gold-soft transition-colors rounded-nahkya"
            >
              {content.ctaText}
            </a>
          )}
        </div>

        {!imageFirst && (
          <div className="order-1 lg:order-2">
            {content.imageUrl ? (
              <img
                src={content.imageUrl}
                alt={content.headline}
                className="w-full h-[400px] lg:h-[600px] object-cover rounded-nahkya"
              />
            ) : (
              <div className="w-full h-[400px] lg:h-[600px] bg-nahkya-stone/20 rounded-nahkya flex items-center justify-center">
                <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-widest">
                  Image
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

import { cn } from '@/lib/utils';
