import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionWrapper } from '../SectionWrapper';
import gsap from 'gsap';

interface HeroSectionProps {
  content: Record<string, unknown>;
  accentPalette: string;
  selected?: boolean;
  onClick?: () => void;
}

export function HeroSection({ content, accentPalette, selected, onClick }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrow = String(content.eyebrow ?? '');
  const headline = String(content.headline ?? '');
  const subtitle = String(content.subtitle ?? '');
  const primaryCta = content.primaryCta as { label: string; href: string } | undefined;
  const secondaryCta = content.secondaryCta as { label: string; href: string } | undefined;
  const backgroundImage = String(content.backgroundImage ?? '');

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
        .from('.hero-headline-word', { y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.3')
        .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
        .from('.hero-scroll', { y: 10, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');
    }, containerRef.current);
    return () => ctx.revert();
  }, []);

  const words = headline.split(' ');

  return (
    <SectionWrapper
      accentPalette={accentPalette}
      selected={selected}
      onClick={onClick}
      className="min-h-screen flex items-center justify-center overflow-hidden bg-nahkya-charcoal"
      animate={false}
    >
      <div className="absolute inset-0">
        {backgroundImage && (
          <img src={backgroundImage} alt="" className="w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-nahkya-charcoal/60 via-transparent to-nahkya-charcoal/80" />
      </div>
      <div ref={containerRef} className="relative z-content text-center px-5 max-w-4xl mx-auto py-20">
        <p className="hero-eyebrow font-mono text-mono-sm text-nahkya-gold uppercase mb-6 tracking-label">
          {eyebrow}
        </p>
        <h1 className="font-display text-display-xxl text-nahkya-ivory font-medium leading-none mb-6">
          {words.map((word, i) => (
            <span key={i} className="hero-headline-word inline-block mr-1.5">
              {word}
            </span>
          ))}
        </h1>
        <p className="hero-subtitle text-body-lg text-nahkya-text-muted font-body mb-10 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryCta && (
            <Link
              to={primaryCta.href}
              className={cn(
                'hero-cta px-8 py-4 font-body font-medium uppercase text-body-sm rounded-nahkya transition-colors',
                'bg-nahkya-gold text-nahkya-text hover:bg-nahkya-gold-soft'
              )}
            >
              {primaryCta.label} <ArrowRight className="w-4 h-4 inline ml-2" strokeWidth={1.5} />
            </Link>
          )}
          {secondaryCta && (
            <Link
              to={secondaryCta.href}
              className={cn(
                'hero-cta px-8 py-4 border font-body font-medium uppercase tracking-wide text-body-sm rounded-nahkya transition-colors',
                'border-nahkya-ivory/20 text-nahkya-ivory hover:border-nahkya-gold hover:text-nahkya-gold'
              )}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
        <div className="hero-scroll mt-16">
          <ChevronDown className="w-6 h-6 text-nahkya-gold mx-auto animate-bounce" strokeWidth={1.5} />
        </div>
      </div>
    </SectionWrapper>
  );
}
