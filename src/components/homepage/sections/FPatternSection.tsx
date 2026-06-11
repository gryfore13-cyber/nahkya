import { InlineText } from '@/components/admin/InlineText';
import { InlineImage } from '@/components/admin/InlineImage';
import { InlineArrayAdd } from '@/components/admin/InlineArrayAdd';
import { InlineArrayRemove } from '@/components/admin/InlineArrayRemove';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'fPattern' };
}

export default function FPatternSection({ section }: Props) {
  const { content, id } = section;

  return (
    <>
      <div className="max-w-4xl">
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
          value={content.intro}
          path="intro"
          sectionId={id}
          className="font-body text-body-lg text-nahkya-text-secondary mb-12 max-w-2xl"
          placeholder="Introduction"
        />

        <div className="space-y-10">
          {content.items.map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-48 flex-shrink-0">
                <InlineImage
                  src={item.imageUrl}
                  alt={item.title}
                  aspectClass="w-full h-32"
                  sectionId={id}
                  path={`items.${idx}.imageUrl`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <InlineText
                    tag="h3"
                    value={item.title}
                    path={`items.${idx}.title`}
                    sectionId={id}
                    className="font-display text-heading-md font-medium"
                    placeholder="Item Title"
                  />
                  <InlineArrayRemove sectionId={id} path="items" index={idx} minCount={1} />
                </div>
                <InlineText
                  tag="p"
                  value={item.description}
                  path={`items.${idx}.description`}
                  sectionId={id}
                  className="font-body text-body-md text-nahkya-text-secondary"
                  placeholder="Item Description"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <InlineArrayAdd
            sectionId={id}
            path="items"
            defaultItem={{ title: 'New Item', description: 'Description for the new item.' }}
            label="Add Item"
          />
        </div>
      </div>
    </>
  );
}
