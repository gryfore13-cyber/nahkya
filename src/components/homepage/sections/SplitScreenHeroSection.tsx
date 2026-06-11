import { cn } from '@/lib/utils';
import { InlineText } from '@/components/admin/InlineText';
import { InlineImage } from '@/components/admin/InlineImage';
import { InlineLinkURL } from '@/components/admin/InlineLinkURL';
import { InlineImagePosition } from '@/components/admin/InlineImagePosition';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'splitScreenHero' };
}

export default function SplitScreenHeroSection({ section }: Props) {
  const { content, id } = section;
  const imageFirst = content.imagePosition === 'left';

  return (
    <div className="min-h-hero-section flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
        {imageFirst && (
          <div className="order-1 lg:order-1">
            <InlineImage
              src={content.imageUrl}
              alt={content.headline}
              aspectClass="w-full aspect-4/3"
              sectionId={id}
              path="imageUrl"
            />
          </div>
        )}

        <div className={cn('order-2', imageFirst ? 'lg:order-2' : 'lg:order-1')}>
          <InlineText
            tag="h2"
            value={content.headline}
            path="headline"
            sectionId={id}
            className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-6"
            placeholder="Headline"
          />
          <InlineText
            tag="p"
            value={content.subheadline}
            path="subheadline"
            sectionId={id}
            className="font-body text-body-lg text-nahkya-text-secondary max-w-lg mb-8"
            placeholder="Subheadline"
          />
          <InlineImagePosition value={content.imagePosition} sectionId={id} path="imagePosition" />
          {content.ctaText && (
            <InlineLinkURL
              href={content.ctaLink}
              sectionId={id}
              path="ctaLink"
              className="inline-flex items-center px-8 py-4 bg-nahkya-highlight text-nahkya-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-border transition-colors rounded-nahkya"
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

        {!imageFirst && (
          <div className="order-1 lg:order-2">
            <InlineImage
              src={content.imageUrl}
              alt={content.headline}
              aspectClass="w-full aspect-4/3"
              sectionId={id}
              path="imageUrl"
            />
          </div>
        )}
      </div>
    </div>
  );
}
