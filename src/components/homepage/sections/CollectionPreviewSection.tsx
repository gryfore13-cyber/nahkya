import { InlineText } from '@/components/admin/InlineText';
import { InlineLinkURL } from '@/components/admin/InlineLinkURL';
import type { HomepageSection } from '@/types';
import { ArrowRight } from 'lucide-react';

interface Props {
  section: HomepageSection & { templateType: 'collectionPreview' };
}

export default function CollectionPreviewSection({ section }: Props) {
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
        {content.items.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer"
          >
            <div className="relative aspect-3/4 overflow-hidden rounded-nahkya-lg border border-nahkya-border bg-nahkya-surface mb-3">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-nahkya-bg flex items-center justify-center">
                  <span className="font-mono text-mono-sm text-nahkya-text-secondary uppercase">Image</span>
                </div>
              )}
              {item.badge && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-nahkya-accent text-nahkya-inverse font-mono text-mono-sm rounded-nahkya">
                  {item.badge}
                </span>
              )}
            </div>
            <h3 className="font-body text-body-md font-medium text-nahkya-text group-hover:text-nahkya-accent transition-colors">
              {item.title}
            </h3>
            {item.price && (
              <p className="font-mono text-mono-sm text-nahkya-text-secondary mt-0.5">
                {item.price}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <InlineLinkURL
          href={content.ctaLink}
          sectionId={id}
          path="ctaLink"
          className="inline-flex items-center gap-2 px-8 py-4 bg-nahkya-highlight text-nahkya-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-border transition-colors rounded-nahkya"
        >
          <InlineText
            tag="span"
            value={content.ctaText}
            path="ctaText"
            sectionId={id}
            placeholder="CTA Text"
          />
          <ArrowRight size={16} />
        </InlineLinkURL>
      </div>
    </div>
  );
}
