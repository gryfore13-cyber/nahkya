import { Play } from 'lucide-react';
import { SectionWrapper } from '../SectionWrapper';

interface TextMediaSectionProps {
  content: Record<string, unknown>;
  accentPalette: string;
  selected?: boolean;
  onClick?: () => void;
}

export function TextMediaSection({ content, accentPalette, selected, onClick }: TextMediaSectionProps) {
  const headline = String(content.headline ?? '');
  const body = String(content.body ?? '');
  const media = String(content.media ?? '');
  const mediaType = String(content.mediaType ?? 'image');

  return (
    <SectionWrapper
      accentPalette={accentPalette}
      selected={selected}
      onClick={onClick}
      className="py-24 px-5 bg-nahkya-ivory"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="animate-in font-display text-display-md text-nahkya-text font-medium mb-6">
          {headline}
        </h2>
        <p className="animate-in text-body-lg text-nahkya-text-muted font-body mb-12 max-w-2xl mx-auto leading-relaxed">
          {body}
        </p>
        <div className="animate-in relative aspect-video bg-nahkya-stone rounded-nahkya overflow-hidden">
          {media ? (
            mediaType === 'video' ? (
              <video src={media} className="w-full h-full object-cover" controls />
            ) : (
              <img src={media} alt={headline} className="w-full h-full object-cover" />
            )
          ) : null}
          {media && mediaType === 'image' && (
            <button className="absolute inset-0 flex items-center justify-center bg-nahkya-charcoal/30 hover:bg-nahkya-charcoal/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-nahkya-ivory/90 flex items-center justify-center">
                <Play className="w-6 h-6 text-nahkya-text ml-1" strokeWidth={1.5} />
              </div>
            </button>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
