import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'productShowcase' };
}

export default function ProductShowcaseSection({ section }: Props) {
  const { content, settings } = section;

  return (
    <SectionWrapper settings={settings}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-4">
            {content.headline}
          </h2>
          <p className="font-body text-body-lg text-nahkya-text-muted mb-10">
            {content.subheadline}
          </p>

          {content.features.length > 0 && (
            <div className="space-y-6 mb-10">
              {content.features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  {feature.icon && (
                    <div className="w-10 h-10 rounded-full bg-nahkya-gold/10 flex items-center justify-center text-nahkya-gold flex-shrink-0">
                      <span className="text-sm">{feature.icon}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-display text-heading-md font-medium mb-1">
                      {feature.title}
                    </h3>
                    <p className="font-body text-body-md text-nahkya-text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <a
            href={content.ctaLink}
            className="inline-flex items-center px-8 py-4 bg-nahkya-gold text-nahkya-text-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-gold-soft transition-colors rounded-nahkya"
          >
            {content.ctaText}
          </a>
        </div>

        <div>
          {content.showcaseImageUrl ? (
            <img
              src={content.showcaseImageUrl}
              alt={content.headline}
              className="w-full h-[400px] lg:h-[550px] object-cover rounded-nahkya"
            />
          ) : (
            <div className="w-full h-[400px] lg:h-[550px] bg-nahkya-stone/20 rounded-nahkya flex items-center justify-center">
              <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-widest">
                Showcase Image
              </span>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
