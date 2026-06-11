import { InlineText } from '@/components/admin/InlineText';
import type { HomepageSection } from '@/types';
import { Star, Quote } from 'lucide-react';

interface Props {
  section: HomepageSection & { templateType: 'testimonials' };
}

export default function TestimonialsSection({ section }: Props) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {content.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col p-6 lg:p-8 bg-nahkya-surface border border-nahkya-border rounded-nahkya-lg"
          >
            <Quote size={24} className="text-nahkya-highlight mb-4" strokeWidth={1.5} />

            {typeof item.rating === 'number' && item.rating > 0 && (
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < item.rating! ? 'text-nahkya-highlight fill-nahkya-highlight' : 'text-nahkya-border'}
                  />
                ))}
              </div>
            )}

            <p className="font-body text-body-md text-nahkya-text leading-relaxed flex-1 mb-6">
              "{item.quote}"
            </p>

            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-nahkya-border">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.author}
                  className="w-10 h-10 rounded-full object-cover border border-nahkya-border"
                />
              )}
              <div>
                <p className="font-body text-body-sm font-medium text-nahkya-text">
                  {item.author}
                </p>
                {item.role && (
                  <p className="font-mono text-mono-sm text-nahkya-text-secondary">
                    {item.role}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
