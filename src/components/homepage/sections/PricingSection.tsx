import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionWrapper } from '../SectionWrapper';

interface PricingCard {
  plan: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  featured: boolean;
}

interface PricingSectionProps {
  content: Record<string, unknown>;
  accentPalette: string;
  selected?: boolean;
  onClick?: () => void;
}

export function PricingSection({ content, accentPalette, selected, onClick }: PricingSectionProps) {
  const sectionTitle = String(content.sectionTitle ?? '');
  const cards = (content.cards as PricingCard[]) ?? [];

  return (
    <SectionWrapper
      accentPalette={accentPalette}
      selected={selected}
      onClick={onClick}
      className="py-24 px-5 bg-nahkya-surface"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="animate-in font-display text-display-md text-nahkya-text font-medium text-center mb-12">
          {sectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className={cn(
                'animate-in relative p-8 rounded-nahkya border transition-all',
                card.featured
                  ? 'border-nahkya-gold bg-nahkya-ivory shadow-gold-glow-soft'
                  : 'border-nahkya-gold-soft bg-nahkya-ivory'
              )}
            >
              {card.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-nahkya-gold text-nahkya-text font-mono text-mono-sm uppercase tracking-label rounded-nahkya">
                  Popular
                </span>
              )}
              <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label mb-4">{card.plan}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-display-lg text-nahkya-text font-medium">{card.price}</span>
                <span className="text-body-md text-nahkya-text-muted font-body">{card.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {card.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-body-md text-nahkya-text-muted font-body">
                    <Check className="w-4 h-4 text-nahkya-gold mt-0.5 shrink-0" strokeWidth={1.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={cn(
                  'block text-center w-full py-3 rounded-nahkya font-body font-medium uppercase text-body-sm transition-colors',
                  card.featured
                    ? 'bg-nahkya-gold text-nahkya-text hover:bg-nahkya-gold-soft'
                    : 'border border-nahkya-gold-soft text-nahkya-text hover:border-nahkya-gold hover:text-nahkya-gold'
                )}
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
