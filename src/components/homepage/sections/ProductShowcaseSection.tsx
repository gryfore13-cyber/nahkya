import { InlineText } from '@/components/admin/InlineText';
import { InlineImage } from '@/components/admin/InlineImage';
import { InlineLinkURL } from '@/components/admin/InlineLinkURL';
import { InlineArrayAdd } from '@/components/admin/InlineArrayAdd';
import { InlineArrayRemove } from '@/components/admin/InlineArrayRemove';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'productShowcase' };
}

export default function ProductShowcaseSection({ section }: Props) {
  const { content, id } = section;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
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
            className="font-body text-body-lg text-nahkya-text-secondary mb-10"
            placeholder="Subheadline"
          />

          {content.features.length > 0 && (
            <div className="space-y-6 mb-10">
              {content.features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  {feature.icon && (
                    <div className="w-10 h-10 rounded-full bg-nahkya-highlight/10 flex items-center justify-center text-nahkya-highlight flex-shrink-0">
                      <span className="text-sm">{feature.icon}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <InlineText
                        tag="h3"
                        value={feature.title}
                        path={`features.${idx}.title`}
                        sectionId={id}
                        className="font-display text-heading-md font-medium mb-1"
                        placeholder="Feature Title"
                      />
                      <InlineArrayRemove sectionId={id} path="features" index={idx} minCount={1} />
                    </div>
                    <InlineText
                      tag="p"
                      value={feature.description}
                      path={`features.${idx}.description`}
                      sectionId={id}
                      className="font-body text-body-md text-nahkya-text-secondary"
                      placeholder="Feature Description"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mb-4">
            <InlineArrayAdd
              sectionId={id}
              path="features"
              defaultItem={{ title: 'New Detail', description: 'Explain the detail.' }}
              label="Add Feature"
            />
          </div>

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
        </div>

        <div>
          <InlineImage
            src={content.showcaseImageUrl}
            alt={content.headline}
            aspectClass="w-full aspect-4/3"
            sectionId={id}
            path="showcaseImageUrl"
          />
        </div>
      </div>
    </>
  );
}
