import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'invertedPyramid' };
}

export default function InvertedPyramidSection({ section }: Props) {
  const { content, settings } = section;

  return (
    <SectionWrapper settings={settings}>
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-4">
          {content.headline}
        </h2>
        <p className="font-display text-display-sm text-nahkya-gold font-medium mb-6">
          {content.subheadline}
        </p>
        <p className="font-body text-body-lg text-nahkya-text-muted mb-10 max-w-xl mx-auto">
          {content.description}
        </p>
        {content.ctaText && (
          <a
            href={content.ctaLink}
            className="inline-flex items-center px-10 py-4 bg-nahkya-gold text-nahkya-text-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-gold-soft transition-colors rounded-nahkya"
          >
            {content.ctaText}
          </a>
        )}
      </div>
    </SectionWrapper>
  );
}
