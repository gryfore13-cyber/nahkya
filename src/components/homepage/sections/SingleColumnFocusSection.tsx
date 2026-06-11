import { InlineText } from '@/components/admin/InlineText';
import { InlineLinkURL } from '@/components/admin/InlineLinkURL';
import { InlineArrayAdd } from '@/components/admin/InlineArrayAdd';
import { InlineArrayRemove } from '@/components/admin/InlineArrayRemove';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'singleColumnFocus' };
}

export default function SingleColumnFocusSection({ section }: Props) {
  const { content, id } = section;

  return (
    <>
      <div className="text-center max-w-3xl mx-auto">
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
          className="font-body text-body-lg text-nahkya-text-secondary mb-10"
          placeholder="Subheadline"
        />
        {content.ctaText && (
          <InlineLinkURL
            href={content.ctaLink}
            sectionId={id}
            path="ctaLink"
            className="inline-flex items-center px-8 py-4 bg-nahkya-highlight text-nahkya-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-border transition-colors rounded-nahkya mb-16"
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

      {content.features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {content.features.map((feature, idx) => (
            <div key={idx} className="text-center relative">
              <div className="absolute top-0 right-0">
                <InlineArrayRemove sectionId={id} path="features" index={idx} minCount={1} />
              </div>
              {feature.icon && (
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-nahkya-highlight/10 flex items-center justify-center text-nahkya-highlight">
                  <span className="text-lg">{feature.icon}</span>
                </div>
              )}
              <InlineText
                tag="h3"
                value={feature.title}
                path={`features.${idx}.title`}
                sectionId={id}
                className="font-display text-heading-md font-medium mb-2"
                placeholder="Feature Title"
              />
              <InlineText
                tag="p"
                value={feature.description}
                path={`features.${idx}.description`}
                sectionId={id}
                className="font-body text-body-md text-nahkya-text-secondary"
                placeholder="Feature Description"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <InlineArrayAdd
          sectionId={id}
          path="features"
          defaultItem={{ title: 'New Feature', description: 'Describe your feature.' }}
          label="Add Feature"
        />
      </div>
    </>
  );
}
