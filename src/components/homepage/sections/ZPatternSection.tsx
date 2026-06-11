import { InlineText } from '@/components/admin/InlineText';
import { InlineImage } from '@/components/admin/InlineImage';
import { InlineLinkURL } from '@/components/admin/InlineLinkURL';
import { InlineArrayAdd } from '@/components/admin/InlineArrayAdd';
import { InlineArrayRemove } from '@/components/admin/InlineArrayRemove';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'zPattern' };
}

export default function ZPatternSection({ section }: Props) {
  const { content, id } = section;

  return (
    <>
      <div className="space-y-16 md:space-y-24">
        {content.items.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div className={isEven ? 'md:order-1' : 'md:order-2'}>
                <InlineImage
                  src={item.imageUrl}
                  alt={item.headline}
                  aspectClass="w-full aspect-4/3"
                  sectionId={id}
                  path={`items.${idx}.imageUrl`}
                />
              </div>
              <div className={isEven ? 'md:order-2' : 'md:order-1'}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <InlineText
                    tag="h3"
                    value={item.headline}
                    path={`items.${idx}.headline`}
                    sectionId={id}
                    className="font-display text-display-md font-medium leading-tight mb-4"
                    placeholder="Headline"
                  />
                  <InlineArrayRemove sectionId={id} path="items" index={idx} minCount={1} />
                </div>
                <InlineText
                  tag="p"
                  value={item.description}
                  path={`items.${idx}.description`}
                  sectionId={id}
                  className="font-body text-body-md text-nahkya-text-secondary mb-6"
                  placeholder="Description"
                />
                {item.ctaText && (
                  <InlineLinkURL
                    href={item.ctaLink || '/'}
                    sectionId={id}
                    path={`items.${idx}.ctaLink`}
                    className="inline-flex items-center font-body text-body-sm font-medium uppercase tracking-wide text-nahkya-highlight hover:text-nahkya-border transition-colors"
                  >
                    <InlineText
                      tag="span"
                      value={item.ctaText}
                      path={`items.${idx}.ctaText`}
                      sectionId={id}
                      placeholder="CTA Text"
                    />
                  </InlineLinkURL>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <InlineArrayAdd
          sectionId={id}
          path="items"
          defaultItem={{ imageUrl: '', headline: 'New Point', description: 'Describe your point.', ctaText: 'Read More', ctaLink: '/' }}
          label="Add Item"
        />
      </div>
    </>
  );
}
