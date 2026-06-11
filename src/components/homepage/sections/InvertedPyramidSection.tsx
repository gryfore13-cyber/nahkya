import { InlineText } from '@/components/admin/InlineText';
import { InlineLinkURL } from '@/components/admin/InlineLinkURL';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'invertedPyramid' };
}

export default function InvertedPyramidSection({ section }: Props) {
  const { content, id } = section;

  return (
    <>
      <div className="text-center max-w-3xl mx-auto">
        <InlineText
          tag="h2"
          value={content.headline}
          path="headline"
          sectionId={id}
          className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-4"
          placeholder="Headline"
        />
        <InlineText
          tag="p"
          value={content.subheadline}
          path="subheadline"
          sectionId={id}
          className="font-display text-display-sm text-nahkya-highlight font-medium mb-6"
          placeholder="Subheadline"
        />
        <InlineText
          tag="p"
          value={content.description}
          path="description"
          sectionId={id}
          className="font-body text-body-lg text-nahkya-text-secondary mb-10 max-w-xl mx-auto"
          placeholder="Description"
        />
        {content.ctaText && (
          <InlineLinkURL
            href={content.ctaLink}
            sectionId={id}
            path="ctaLink"
            className="inline-flex items-center px-10 py-4 bg-nahkya-highlight text-nahkya-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-border transition-colors rounded-nahkya"
          >
            <InlineText
              tag="span"
              value={content.ctaText}
              path="ctaText"
              sectionId={id}
              placeholder="CTA Text"
            />
          </InlineLinkURL>
        )}
      </div>
    </>
  );
}
