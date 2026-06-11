import { InlineText } from '@/components/admin/InlineText';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'lookbook' };
}

export default function LookbookSection({ section }: Props) {
  const { content, id } = section;

  const gridCols = content.layout === 'masonry'
    ? 'columns-1 sm:columns-2 lg:columns-3 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';

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

      <div className={gridCols}>
        {content.items.map((item, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-nahkya-lg border border-nahkya-border bg-nahkya-surface ${content.layout === 'masonry' ? 'break-inside-avoid mb-4' : ''}`}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title || 'Lookbook image'}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="w-full aspect-3/4 bg-nahkya-bg flex items-center justify-center">
                <span className="font-mono text-mono-sm text-nahkya-text-secondary uppercase">Image</span>
              </div>
            )}

            {(item.title || item.caption) && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-nahkya-text/70 to-transparent">
                {item.title && (
                  <p className="font-display text-heading-sm text-nahkya-inverse">
                    {item.title}
                  </p>
                )}
                {item.caption && (
                  <p className="font-body text-body-sm text-nahkya-inverse/80">
                    {item.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
