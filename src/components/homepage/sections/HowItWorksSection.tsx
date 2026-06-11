import { InlineText } from '@/components/admin/InlineText';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'howItWorks' };
}

export default function HowItWorksSection({ section }: Props) {
  const { content, id } = section;

  return (
    <div className="container-nahkya">
      <div className="text-center mb-12 lg:mb-16">
        <InlineText
          tag="h2"
          value={content.headline}
          path="headline"
          sectionId={id}
          className="font-display text-heading-lg font-medium mb-4"
          placeholder="Headline"
        />
        <InlineText
          tag="p"
          value={content.subheadline}
          path="subheadline"
          sectionId={id}
          className="font-body text-body-lg text-nahkya-text-secondary max-w-2xl mx-auto"
          placeholder="Subheadline"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {content.steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center text-center">
            {index < content.steps.length - 1 && (
              <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-nahkya-border" />
            )}

            <div className="w-16 h-16 rounded-full bg-nahkya-accent text-nahkya-inverse flex items-center justify-center font-display text-heading-md mb-5 relative z-10">
              {step.number}
            </div>

            <h3 className="font-display text-heading-md font-medium mb-2">
              {step.title}
            </h3>
            <p className="font-body text-body-sm text-nahkya-text-secondary leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
