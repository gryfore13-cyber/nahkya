import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'cardGrid' };
}

export default function CardGridSection({ section }: Props) {
  const { content, settings } = section;

  return (
    <SectionWrapper settings={settings}>
      <div className="text-center mb-12">
        <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-4">
          {content.headline}
        </h2>
        <p className="font-body text-body-lg text-nahkya-text-muted max-w-2xl mx-auto">
          {content.subheadline}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {content.items.map((item, idx) => (
          <a
            key={idx}
            href={item.link || '#'}
            className="group block bg-nahkya-surface rounded-nahkya overflow-hidden border border-nahkya-border hover:border-nahkya-gold/50 transition-colors"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-nahkya-stone/20 flex items-center justify-center">
                <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-widest">
                  Image
                </span>
              </div>
            )}
            <div className="p-6">
              <h3 className="font-display text-heading-md font-medium mb-2 group-hover:text-nahkya-gold transition-colors">
                {item.title}
              </h3>
              <p className="font-body text-body-md text-nahkya-text-muted">
                {item.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}
