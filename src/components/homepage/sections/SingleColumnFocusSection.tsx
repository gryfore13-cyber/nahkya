import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'singleColumnFocus' };
}

export default function SingleColumnFocusSection({ section }: Props) {
  const { content, settings } = section;

  return (
    <SectionWrapper settings={settings}>
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-6">
          {content.headline}
        </h2>
        <p className="font-body text-body-lg text-nahkya-text-muted mb-10">
          {content.subheadline}
        </p>
        {content.ctaText && (
          <a
            href={content.ctaLink}
            className="inline-flex items-center px-8 py-4 bg-nahkya-gold text-nahkya-text-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-gold-soft transition-colors rounded-nahkya mb-16"
          >
            {content.ctaText}
          </a>
        )}
      </div>

      {content.features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {content.features.map((feature, idx) => (
            <div key={idx} className="text-center">
              {feature.icon && (
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-nahkya-gold/10 flex items-center justify-center text-nahkya-gold">
                  <span className="text-lg">{feature.icon}</span>
                </div>
              )}
              <h3 className="font-display text-heading-md font-medium mb-2">
                {feature.title}
              </h3>
              <p className="font-body text-body-md text-nahkya-text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
