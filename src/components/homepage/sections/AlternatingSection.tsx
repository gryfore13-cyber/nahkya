import { InlineText } from '@/components/admin/InlineText';
import { InlineImage } from '@/components/admin/InlineImage';
import { InlineImagePosition } from '@/components/admin/InlineImagePosition';
import { InlineArrayAdd } from '@/components/admin/InlineArrayAdd';
import { InlineArrayRemove } from '@/components/admin/InlineArrayRemove';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'alternating' };
}

export default function AlternatingSection({ section }: Props) {
  const { content, id } = section;

  return (
    <>
      <InlineText
        tag="h2"
        value={content.headline}
        path="headline"
        sectionId={id}
        className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-12 md:mb-16 text-center"
        placeholder="Headline"
      />

      <div className="space-y-16 md:space-y-24">
        {content.rows.map((row, idx) => {
          const imageLeft = row.imagePosition === 'left';
          return (
            <div
              key={idx}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              <div className={imageLeft ? 'lg:order-1' : 'lg:order-2'}>
                <InlineImage
                  src={row.imageUrl}
                  alt={row.title}
                  aspectClass="w-full aspect-4/3"
                  sectionId={id}
                  path={`rows.${idx}.imageUrl`}
                />
              </div>
              <div className={imageLeft ? 'lg:order-2' : 'lg:order-1'}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <InlineImagePosition
                    value={row.imagePosition}
                    sectionId={id}
                    path={`rows.${idx}.imagePosition`}
                  />
                  <InlineArrayRemove sectionId={id} path="rows" index={idx} minCount={1} />
                </div>
                <InlineText
                  tag="h3"
                  value={row.title}
                  path={`rows.${idx}.title`}
                  sectionId={id}
                  className="font-display text-display-md font-medium leading-tight mb-4"
                  placeholder="Row Title"
                />
                <InlineText
                  tag="p"
                  value={row.description}
                  path={`rows.${idx}.description`}
                  sectionId={id}
                  className="font-body text-body-lg text-nahkya-text-secondary leading-relaxed"
                  placeholder="Row Description"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <InlineArrayAdd
          sectionId={id}
          path="rows"
          defaultItem={{ imageUrl: '', title: 'New Chapter', description: 'Tell your story.', imagePosition: 'left' }}
          label="Add Row"
        />
      </div>
    </>
  );
}
