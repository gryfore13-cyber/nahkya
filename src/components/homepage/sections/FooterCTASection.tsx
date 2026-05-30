import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionWrapper } from '../SectionWrapper';

interface FooterCTASectionProps {
  content: Record<string, unknown>;
  accentPalette: string;
  selected?: boolean;
  onClick?: () => void;
}

export function FooterCTASection({ content, accentPalette, selected, onClick }: FooterCTASectionProps) {
  const headline = String(content.headline ?? '');
  const subline = String(content.subline ?? '');
  const ctaText = String(content.ctaText ?? '');
  const ctaHref = String(content.ctaHref ?? '/signup');
  const [email, setEmail] = useState('');

  return (
    <SectionWrapper
      accentPalette={accentPalette}
      selected={selected}
      onClick={onClick}
      className="py-24 px-5 bg-nahkya-charcoal"
    >
      <div className="max-w-2xl mx-auto text-center">
        <Star className="animate-in w-6 h-6 text-nahkya-gold mx-auto mb-6" strokeWidth={1.5} />
        <h2 className="animate-in font-display text-display-md text-nahkya-ivory font-medium mb-4">
          {headline}
        </h2>
        <p className="animate-in text-body-lg text-nahkya-text-muted font-body mb-8">
          {subline}
        </p>
        <form
          className="animate-in flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className={cn(
              'flex-1 px-4 py-3 bg-nahkya-ivory/10 border text-nahkya-ivory font-body text-body-md rounded-nahkya',
              'border-nahkya-ivory/20 focus:outline-none focus:border-nahkya-gold placeholder:text-nahkya-text-muted/60'
            )}
          />
          <Link
            to={ctaHref}
            className={cn(
              'px-6 py-3 bg-nahkya-gold text-nahkya-text font-body font-medium uppercase text-sm rounded-nahkya',
              'hover:bg-nahkya-gold-soft transition-colors text-center'
            )}
          >
            {ctaText}
          </Link>
        </form>
      </div>
    </SectionWrapper>
  );
}
