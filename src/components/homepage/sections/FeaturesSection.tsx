import { Palette, Ruler, Clock, Star, Heart, Gem, type LucideIcon } from 'lucide-react';
import { SectionWrapper } from '../SectionWrapper';

const ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  Ruler,
  Clock,
  Star,
  Heart,
  Gem,
};

interface FeaturesSectionProps {
  content: Record<string, unknown>;
  accentPalette: string;
  selected?: boolean;
  onClick?: () => void;
}

export function FeaturesSection({ content, accentPalette, selected, onClick }: FeaturesSectionProps) {
  const sectionTitle = String(content.sectionTitle ?? '');
  const sectionSubtitle = String(content.sectionSubtitle ?? '');
  const features = (content.features as Array<{ icon: string; title: string; description: string }>) ?? [];

  return (
    <SectionWrapper
      accentPalette={accentPalette}
      selected={selected}
      onClick={onClick}
      className="py-24 px-5 bg-nahkya-ivory"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-in">
          <p className="font-mono text-mono-sm text-nahkya-gold uppercase mb-4 tracking-label">
            {sectionSubtitle}
          </p>
          <h2 className="font-display text-display-md text-nahkya-text font-medium">
            {sectionTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = ICON_MAP[f.icon] ?? Star;
            return (
              <div key={i} className="animate-in text-center p-8">
                <Icon className="w-8 h-8 text-nahkya-gold mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-heading-sm text-nahkya-text font-medium mb-3">
                  {f.title}
                </h3>
                <p className="text-body-md text-nahkya-text-muted font-body">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
