import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'fPattern' };
}

export default function FPatternSection({ section }: Props) {
  const { content, settings } = section;

  return (
    <SectionWrapper settings={settings}>
      <div className="max-w-4xl">
        <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-6">
          {content.headline}
        </h2>
        <p className="font-body text-body-lg text-nahkya-text-muted mb-12 max-w-2xl">
          {content.intro}
        </p>

        <div className="space-y-10">
          {content.items.map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 items-start">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full md:w-48 h-32 object-cover rounded-nahkya flex-shrink-0"
                />
              )}
              <div>
                <h3 className="font-display text-heading-md font-medium mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-body-md text-nahkya-text-muted">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
