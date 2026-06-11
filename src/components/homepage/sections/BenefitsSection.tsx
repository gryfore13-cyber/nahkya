import { InlineText } from '@/components/admin/InlineText';
import type { HomepageSection } from '@/types';
import { Gem, Palette, Leaf, Gift } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Gem: <Gem size={28} strokeWidth={1.5} />,
  Palette: <Palette size={28} strokeWidth={1.5} />,
  Leaf: <Leaf size={28} strokeWidth={1.5} />,
  Gift: <Gift size={28} strokeWidth={1.5} />,
};

interface Props {
  section: HomepageSection & { templateType: 'benefits' };
}

export default function BenefitsSection({ section }: Props) {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {content.items.map((item, index) => (
          <div
            key={index}
            className="group p-6 lg:p-8 bg-nahkya-surface border border-nahkya-border rounded-nahkya-lg hover:shadow-card transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-nahkya bg-nahkya-highlight-subtle text-nahkya-accent flex items-center justify-center mb-5">
              {ICON_MAP[item.icon || ''] || <Gem size={28} strokeWidth={1.5} />}
            </div>
            <h3 className="font-display text-heading-md font-medium mb-2">
              {item.title}
            </h3>
            <p className="font-body text-body-sm text-nahkya-text-secondary leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
