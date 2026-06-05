import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'asymmetricalEditorial' };
}

export default function AsymmetricalEditorialSection({ section }: Props) {
  const { content, settings } = section;

  return (
    <SectionWrapper settings={settings}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5">
          <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-4">
            {content.headline}
          </h2>
          <p className="font-display text-display-sm text-nahkya-gold font-medium mb-8">
            {content.subheadline}
          </p>
          {content.ctaText && (
            <a
              href={content.ctaLink || '/'}
              className="inline-flex items-center px-8 py-4 bg-nahkya-gold text-nahkya-text-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-gold-soft transition-colors rounded-nahkya"
            >
              {content.ctaText}
            </a>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="relative">
            {content.featuredImageUrl ? (
              <img
                src={content.featuredImageUrl}
                alt={content.headline}
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-nahkya"
              />
            ) : (
              <div className="w-full h-[400px] lg:h-[500px] bg-nahkya-stone/20 rounded-nahkya flex items-center justify-center">
                <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-widest">
                  Image
                </span>
              </div>
            )}
            {content.secondaryImageUrl && (
              <img
                src={content.secondaryImageUrl}
                alt=""
                className="absolute -bottom-8 -left-8 w-32 h-40 lg:w-40 lg:h-52 object-cover rounded-nahkya border-4 border-nahkya-ivory shadow-lg hidden lg:block"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 lg:mt-16 max-w-3xl">
        <p className="font-body text-body-lg text-nahkya-text-muted leading-relaxed whitespace-pre-line">
          {content.body}
        </p>
      </div>
    </SectionWrapper>
  );
}
