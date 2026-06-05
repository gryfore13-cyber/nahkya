import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'longFormSales' };
}

export default function LongFormSalesSection({ section }: Props) {
  const { content, settings } = section;

  return (
    <SectionWrapper settings={settings}>
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-6 text-center">
          {content.headline}
        </h2>
        <p className="font-body text-body-lg text-nahkya-text-muted mb-16 text-center max-w-2xl mx-auto">
          {content.intro}
        </p>

        {content.features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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

        {content.testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {content.testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-nahkya-surface-soft p-6 rounded-nahkya border border-nahkya-border"
              >
                <p className="font-body text-body-md italic text-nahkya-text mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-body text-body-sm font-medium text-nahkya-text">
                    {t.author}
                  </p>
                  {t.role && (
                    <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-wider">
                      {t.role}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <a
            href={content.ctaLink}
            className="inline-flex items-center px-10 py-4 bg-nahkya-gold text-nahkya-text-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-gold-soft transition-colors rounded-nahkya"
          >
            {content.ctaText}
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
