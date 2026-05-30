import { cn } from '@/lib/utils';
import { SectionWrapper } from '../SectionWrapper';

interface GalleryItem {
  image: string;
  caption: string;
}

interface GallerySectionProps {
  content: Record<string, unknown>;
  accentPalette: string;
  selected?: boolean;
  onClick?: () => void;
}

export function GallerySection({ content, accentPalette, selected, onClick }: GallerySectionProps) {
  const sectionTitle = String(content.sectionTitle ?? '');
  const sectionSubtitle = String(content.sectionSubtitle ?? '');
  const items = (content.items as GalleryItem[]) ?? [];

  const heights = ['aspect-3/4', 'aspect-square', 'aspect-4/5', 'aspect-3/4', 'aspect-square', 'aspect-4/5'];

  return (
    <SectionWrapper
      accentPalette={accentPalette}
      selected={selected}
      onClick={onClick}
      className="py-24 px-5 bg-nahkya-ivory"
    >
      <div className="max-w-6xl mx-auto">
        <div className="animate-in text-center mb-12">
          <p className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-label mb-4">{sectionSubtitle}</p>
          <h2 className="font-display text-display-md text-nahkya-text font-medium">{sectionTitle}</h2>
        </div>
        <div className="columns-1 md:columns-3 gap-6 space-y-6">
          {items.map((item, i) => (
            <div key={i} className={cn('animate-in relative rounded-nahkya overflow-hidden group break-inside-avoid', heights[i % heights.length])}>
              {item.image && (
                <img src={item.image} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-nahkya-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-body text-body-md text-nahkya-ivory">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
