import { SectionWrapper } from '../SectionWrapper';

interface ShowcaseItem {
  title: string;
  category: string;
  image: string;
}

interface ShowcaseSectionProps {
  content: Record<string, unknown>;
  accentPalette: string;
  selected?: boolean;
  onClick?: () => void;
}

export function ShowcaseSection({ content, accentPalette, selected, onClick }: ShowcaseSectionProps) {
  const eyebrow = String(content.eyebrow ?? '');
  const headline = String(content.headline ?? '');
  const items = (content.items as ShowcaseItem[]) ?? [];
  const featured = items[0];
  const rest = items.slice(1, 5);

  return (
    <SectionWrapper
      accentPalette={accentPalette}
      selected={selected}
      onClick={onClick}
      className="py-24 px-5 bg-nahkya-surface"
    >
      <div className="max-w-6xl mx-auto">
        <div className="animate-in mb-12">
          <p className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-label mb-4">{eyebrow}</p>
          <h2 className="font-display text-display-md text-nahkya-text font-medium">{headline}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured && (
            <div className="animate-in relative aspect-4/5 rounded-nahkya overflow-hidden group md:row-span-2">
              {featured.image && (
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-nahkya-charcoal/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-label mb-2">{featured.category}</p>
                <h3 className="font-display text-heading-sm text-nahkya-ivory font-medium">{featured.title}</h3>
              </div>
            </div>
          )}
          {rest.map((item, i) => (
            <div key={i} className="animate-in relative aspect-16/10 rounded-nahkya overflow-hidden group">
              {item.image && (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-nahkya-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-label mb-1">{item.category}</p>
                <h3 className="font-display text-body-lg text-nahkya-ivory font-medium">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
