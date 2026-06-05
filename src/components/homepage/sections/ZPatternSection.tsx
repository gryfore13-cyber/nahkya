import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'zPattern' };
}

export default function ZPatternSection({ section }: Props) {
  const { content, settings } = section;

  return (
    <SectionWrapper settings={settings}>
      <div className="space-y-16 md:space-y-24">
        {content.items.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div className={isEven ? 'md:order-1' : 'md:order-2'}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.headline}
                    className="w-full h-[300px] md:h-[400px] object-cover rounded-nahkya"
                  />
                ) : (
                  <div className="w-full h-[300px] md:h-[400px] bg-nahkya-stone/20 rounded-nahkya flex items-center justify-center">
                    <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-widest">
                      Image
                    </span>
                  </div>
                )}
              </div>
              <div className={isEven ? 'md:order-2' : 'md:order-1'}>
                <h3 className="font-display text-display-md font-medium leading-tight mb-4">
                  {item.headline}
                </h3>
                <p className="font-body text-body-md text-nahkya-text-muted mb-6">
                  {item.description}
                </p>
                {item.ctaText && (
                  <a
                    href={item.ctaLink || '/'}
                    className="inline-flex items-center font-body text-body-sm font-medium uppercase tracking-wide text-nahkya-gold hover:text-nahkya-gold-soft transition-colors"
                  >
                    {item.ctaText}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
