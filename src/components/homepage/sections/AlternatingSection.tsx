import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'alternating' };
}

export default function AlternatingSection({ section }: Props) {
  const { content, settings } = section;

  return (
    <SectionWrapper settings={settings}>
      <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-12 md:mb-16 text-center">
        {content.headline}
      </h2>

      <div className="space-y-16 md:space-y-24">
        {content.rows.map((row, idx) => {
          const imageLeft = row.imagePosition === 'left';
          return (
            <div
              key={idx}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              <div className={imageLeft ? 'lg:order-1' : 'lg:order-2'}>
                {row.imageUrl ? (
                  <img
                    src={row.imageUrl}
                    alt={row.title}
                    className="w-full h-[350px] lg:h-[450px] object-cover rounded-nahkya"
                  />
                ) : (
                  <div className="w-full h-[350px] lg:h-[450px] bg-nahkya-stone/20 rounded-nahkya flex items-center justify-center">
                    <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-widest">
                      Image
                    </span>
                  </div>
                )}
              </div>
              <div className={imageLeft ? 'lg:order-2' : 'lg:order-1'}>
                <h3 className="font-display text-display-md font-medium leading-tight mb-4">
                  {row.title}
                </h3>
                <p className="font-body text-body-lg text-nahkya-text-muted leading-relaxed">
                  {row.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
