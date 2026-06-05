import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'storytellingScroll' };
}

export default function StorytellingScrollSection({ section }: Props) {
  const { content, settings } = section;

  return (
    <SectionWrapper settings={settings}>
      <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-12 md:mb-16 text-center">
        {content.headline}
      </h2>

      <div className="space-y-12 md:space-y-16">
        {content.steps.map((step, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center"
          >
            <div className="md:col-span-1 flex md:justify-center">
              <span className="font-display text-display-xl text-nahkya-gold/30 font-medium">
                {String(step.number).padStart(2, '0')}
              </span>
            </div>
            <div className="md:col-span-5">
              {step.imageUrl ? (
                <img
                  src={step.imageUrl}
                  alt={step.title}
                  className="w-full h-[250px] md:h-[300px] object-cover rounded-nahkya"
                />
              ) : (
                <div className="w-full h-[250px] md:h-[300px] bg-nahkya-stone/20 rounded-nahkya flex items-center justify-center">
                  <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-widest">
                    Image
                  </span>
                </div>
              )}
            </div>
            <div className="md:col-span-6">
              <h3 className="font-display text-display-sm font-medium mb-3">
                {step.title}
              </h3>
              <p className="font-body text-body-lg text-nahkya-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
