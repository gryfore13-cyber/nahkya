import { InlineText } from '@/components/admin/InlineText';
import { InlineImage } from '@/components/admin/InlineImage';
import { InlineLinkURL } from '@/components/admin/InlineLinkURL';
import { InlineArrayAdd } from '@/components/admin/InlineArrayAdd';
import { InlineArrayRemove } from '@/components/admin/InlineArrayRemove';
import { useBuilderEdit } from '@/components/admin/BuilderEditContext';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'cardGrid' };
}

export default function CardGridSection({ section }: Props) {
  const { content, id } = section;
  const { isEditing } = useBuilderEdit();

  return (
    <>
      <div className="text-center mb-12">
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
          className="font-body text-body-lg text-nahkya-text-secondary max-w-2xl mx-auto"
          placeholder="Subheadline"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {content.items.map((item, idx) => {
          const cardContent = (
            <>
              <InlineImage
                src={item.imageUrl}
                alt={item.title}
                aspectClass="w-full h-48"
                sectionId={id}
                path={`items.${idx}.imageUrl`}
                imgClassName="rounded-t-nahkya"
              />
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <InlineText
                    tag="h3"
                    value={item.title}
                    path={`items.${idx}.title`}
                    sectionId={id}
                    className="font-display text-heading-md font-medium group-hover:text-nahkya-highlight transition-colors"
                    placeholder="Card Title"
                  />
                  <InlineArrayRemove sectionId={id} path="items" index={idx} minCount={1} />
                </div>
                <InlineText
                  tag="p"
                  value={item.description}
                  path={`items.${idx}.description`}
                  sectionId={id}
                  className="font-body text-body-md text-nahkya-text-secondary"
                  placeholder="Card Description"
                />
                {isEditing && (
                  <div className="mt-3">
                    <InlineLinkURL
                      href={item.link || '#'}
                      sectionId={id}
                      path={`items.${idx}.link`}
                      className="text-xs font-mono text-nahkya-highlight underline"
                    >
                      Link
                    </InlineLinkURL>
                  </div>
                )}
              </div>
            </>
          );

          return isEditing ? (
            <div
              key={idx}
              className="group block bg-nahkya-surface rounded-nahkya overflow-hidden border border-nahkya-border hover:border-nahkya-highlight/50 transition-colors"
            >
              {cardContent}
            </div>
          ) : (
            <a
              key={idx}
              href={item.link || '#'}
              className="group block bg-nahkya-surface rounded-nahkya overflow-hidden border border-nahkya-border hover:border-nahkya-highlight/50 transition-colors"
            >
              {cardContent}
            </a>
          );
        })}
      </div>

      <div className="mt-8">
        <InlineArrayAdd
          sectionId={id}
          path="items"
          defaultItem={{ title: 'New Card', description: 'Card description here.' }}
          label="Add Card"
        />
      </div>
    </>
  );
}
