import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SectionWrapper } from '../SectionWrapper';

interface SplitSectionProps {
  content: Record<string, unknown>;
  accentPalette: string;
  selected?: boolean;
  onClick?: () => void;
}

export function SplitSection({ content, accentPalette, selected, onClick }: SplitSectionProps) {
  const eyebrow = String(content.eyebrow ?? '');
  const headline = String(content.headline ?? '');
  const body = String(content.body ?? '');
  const cta = content.cta as { label: string; href: string } | undefined;
  const image = String(content.image ?? '');
  const imagePosition = String(content.imagePosition ?? 'right');

  const contentBlock = (
    <div className="animate-in space-y-6">
      <p className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-label">{eyebrow}</p>
      <h2 className="font-display text-display-sm md:text-display-md text-nahkya-text font-medium leading-tight">
        {headline}
      </h2>
      <p className="text-body-md text-nahkya-text-muted leading-relaxed">{body}</p>
      {cta && (
        <Link
          to={cta.href}
          className={cn(
            'inline-block text-body-sm text-nahkya-gold font-medium uppercase tracking-wide',
            'border-b border-nahkya-gold pb-1 hover:text-nahkya-gold-soft transition-colors'
          )}
        >
          {cta.label}
        </Link>
      )}
    </div>
  );

  const imageBlock = (
    <div className="animate-in aspect-video bg-nahkya-stone rounded-nahkya overflow-hidden">
      {image ? (
        <img src={image} alt={headline} className="w-full h-full object-cover" />
      ) : null}
    </div>
  );

  return (
    <SectionWrapper
      accentPalette={accentPalette}
      selected={selected}
      onClick={onClick}
      className="py-24 px-5 bg-nahkya-surface"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {imagePosition === 'left' ? (
          <>{imageBlock}{contentBlock}</>
        ) : (
          <>{contentBlock}{imageBlock}</>
        )}
      </div>
    </SectionWrapper>
  );
}
