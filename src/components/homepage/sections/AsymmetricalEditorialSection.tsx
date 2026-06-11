import { InlineText } from '@/components/admin/InlineText';
import { InlineImage } from '@/components/admin/InlineImage';
import { InlineLinkURL } from '@/components/admin/InlineLinkURL';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'asymmetricalEditorial' };
}

export default function AsymmetricalEditorialSection({ section }: Props) {
  const { content, id } = section;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5">
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
            className="font-display text-display-sm text-nahkya-highlight font-medium mb-8"
            placeholder="Subheadline"
          />
          {content.ctaText && (
            <InlineLinkURL
              href={content.ctaLink || '/'}
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

        <div className="lg:col-span-7">
          <div className="relative">
            <InlineImage
              src={content.featuredImageUrl}
              alt={content.headline}
              aspectClass="w-full aspect-16/10"
              sectionId={id}
              path="featuredImageUrl"
            />
            {content.secondaryImageUrl && (
              <img
                src={content.secondaryImageUrl}
                alt=""
                className="absolute -bottom-8 -left-8 w-32 h-40 lg:w-40 lg:h-52 object-cover rounded-nahkya border-4 border-nahkya-bg shadow-lg hidden lg:block"
              />
            )}
            {!content.secondaryImageUrl && (
              <div className="absolute -bottom-8 -left-8 w-32 h-40 lg:w-40 lg:h-52 hidden lg:block">
                <InlineImage
                  src=""
                  alt=""
                  aspectClass="w-full h-full"
                  sectionId={id}
                  path="secondaryImageUrl"
                  imgClassName="border-4 border-nahkya-bg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 lg:mt-16 max-w-3xl">
        <InlineText
          tag="p"
          value={content.body}
          path="body"
          sectionId={id}
          className="font-body text-body-lg text-nahkya-text-secondary leading-relaxed whitespace-pre-line"
          placeholder="Body text..."
        />
      </div>
    </>
  );
}
