import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionWrapper } from '../SectionWrapper';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  avatar: string;
}

interface TestimonialsSectionProps {
  content: Record<string, unknown>;
  accentPalette: string;
  selected?: boolean;
  onClick?: () => void;
}

export function TestimonialsSection({ content, accentPalette, selected, onClick }: TestimonialsSectionProps) {
  const sectionTitle = String(content.sectionTitle ?? '');
  const testimonials = (content.testimonials as Testimonial[]) ?? [];
  const [active, setActive] = useState(0);

  if (testimonials.length === 0) return null;

  const next = () => setActive((a) => (a + 1) % testimonials.length);
  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[active];

  return (
    <SectionWrapper
      accentPalette={accentPalette}
      selected={selected}
      onClick={onClick}
      className="py-24 px-5 bg-nahkya-ivory"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="animate-in font-display text-display-md text-nahkya-text font-medium mb-12">
          {sectionTitle}
        </h2>
        <div className="animate-in">
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < t.rating ? 'text-nahkya-gold fill-nahkya-gold' : 'text-nahkya-stone'
                )}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <blockquote className="font-display text-heading-sm text-nahkya-text font-medium leading-snug mb-8">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            {t.avatar ? (
              <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-nahkya-stone flex items-center justify-center font-display text-nahkya-text">
                {t.author.charAt(0)}
              </div>
            )}
            <div className="text-left">
              <p className="font-body text-body-md text-nahkya-text font-medium">{t.author}</p>
              <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">{t.role}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="p-2 border border-nahkya-gold-soft rounded-nahkya hover:border-nahkya-gold hover:text-nahkya-gold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  i === active ? 'bg-nahkya-gold' : 'bg-nahkya-stone'
                )}
              />
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="p-2 border border-nahkya-gold-soft rounded-nahkya hover:border-nahkya-gold hover:text-nahkya-gold transition-colors"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
