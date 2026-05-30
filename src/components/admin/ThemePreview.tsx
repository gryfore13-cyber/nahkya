import { Check } from 'lucide-react';
import { useHomeContentStore } from '@/stores/homeContentStore';
import { cn } from '@/lib/utils';

export function ThemePreview() {
  const home = useHomeContentStore();

  return (
    <div className="min-h-screen bg-nahkya-ivory font-body">
      {/* ── Hero ── */}
      <section className="relative min-h-hero flex items-center justify-center overflow-hidden bg-nahkya-charcoal">
        <div className="relative z-content text-center px-5 max-w-4xl mx-auto py-20">
          <p className="font-mono text-dynamic-mono-sm text-nahkya-gold uppercase mb-6 tracking-label">
            {home.hero.label}
          </p>
          <h1 className="font-display text-dynamic-display-md md:text-dynamic-display-lg text-nahkya-ivory font-medium leading-tight mb-6">
            {home.hero.headline}
          </h1>
          <p className="text-body-lg text-nahkya-text-muted font-body mb-10 max-w-xl mx-auto leading-relaxed">
            {home.hero.subline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="px-8 py-4 bg-nahkya-gold text-nahkya-text font-body font-medium uppercase text-body-sm rounded-nahkya">
              {home.hero.ctaPrimary}
            </span>
            <span className="px-8 py-4 border border-nahkya-ivory/20 text-nahkya-ivory font-body font-medium uppercase tracking-wide text-body-sm rounded-nahkya">
              {home.hero.ctaSecondary}
            </span>
          </div>
        </div>
      </section>

      {/* ── Brand Introduction ── */}
      <section className="py-24 px-5 bg-nahkya-surface">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="font-mono text-dynamic-mono-sm text-nahkya-gold uppercase tracking-label">
              {home.brandIntro.label}
            </p>
            <h2 className="font-display text-dynamic-display-sm md:text-dynamic-display-md text-nahkya-text font-medium leading-tight">
              {home.brandIntro.headline}
            </h2>
            <p className="text-body-md text-nahkya-text-muted leading-relaxed">
              {home.brandIntro.paragraph1}
            </p>
            <p className="text-body-md text-nahkya-text-muted leading-relaxed">
              {home.brandIntro.paragraph2}
            </p>
            <span className="inline-block text-body-sm text-nahkya-gold font-medium uppercase tracking-wide border-b border-nahkya-gold pb-1">
              {home.brandIntro.linkText}
            </span>
          </div>
          <div className="aspect-video bg-nahkya-stone rounded-nahkya overflow-hidden">
            <img
              src={home.brandIntro.image}
              alt="Brand"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Philosophy Quote ── */}
      <section className="py-24 px-5 bg-nahkya-ivory">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-display text-dynamic-heading-lg md:text-dynamic-display-sm text-nahkya-text font-medium leading-snug mb-6">
            {home.philosophy.quote}
          </blockquote>
          <p className="font-mono text-dynamic-mono-sm text-nahkya-text-muted uppercase tracking-label">
            {home.philosophy.attribution}
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-5 bg-nahkya-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-dynamic-mono-sm text-nahkya-gold uppercase mb-4 tracking-label">
              {home.howItWorks.label}
            </p>
            <h2 className="font-display text-dynamic-display-sm md:text-dynamic-display-md text-nahkya-text font-medium">
              {home.howItWorks.headline}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {home.howItWorks.steps.map((step) => (
              <div key={step.num} className="text-center p-6">
                <span className="font-mono text-dynamic-mono-lg text-nahkya-gold block mb-4">
                  {step.num}
                </span>
                <h3 className="font-display text-dynamic-heading-md text-nahkya-text font-medium mb-3">
                  {step.title}
                </h3>
                <p className="text-body-md text-nahkya-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tool Previews ── */}
      <section className="py-24 px-5 bg-nahkya-charcoal">
        <div className="max-w-6xl mx-auto space-y-16">
          {home.toolPreviews.map((tool, i) => (
            <div
              key={tool.label}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <div className={cn('space-y-6', i % 2 === 1 && 'md:order-2')}>
                <p className="font-mono text-dynamic-mono-sm text-nahkya-gold uppercase tracking-label">
                  {tool.label}
                </p>
                <h3 className="font-display text-dynamic-display-sm md:text-dynamic-display-md text-nahkya-ivory font-medium leading-tight">
                  {tool.title}
                </h3>
                <p className="text-body-md text-nahkya-text-muted leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div
                className={cn(
                  'aspect-video bg-nahkya-soft-black rounded-nahkya overflow-hidden',
                  i % 2 === 1 && 'md:order-1'
                )}
              >
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Membership ── */}
      <section className="py-24 px-5 bg-nahkya-ivory">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-dynamic-mono-sm text-nahkya-gold uppercase mb-4 tracking-label">
            {home.membership.label}
          </p>
          <h2 className="font-display text-dynamic-display-sm md:text-dynamic-display-md text-nahkya-text font-medium mb-8">
            {home.membership.headline}
          </h2>
          <ul className="space-y-3 mb-10 text-left max-w-xl mx-auto">
            {home.membership.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 text-body-md text-nahkya-text-muted"
              >
                <Check
                  className="w-5 h-5 text-nahkya-gold shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                {benefit}
              </li>
            ))}
          </ul>
          <span className="inline-block px-8 py-4 bg-nahkya-gold text-nahkya-text font-body font-medium uppercase text-body-sm rounded-nahkya">
            {home.membership.ctaText}
          </span>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-24 px-5 bg-nahkya-charcoal">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-dynamic-display-sm md:text-dynamic-display-md text-nahkya-ivory font-medium mb-4">
            {home.contact.headline}
          </h2>
          <p className="text-body-lg text-nahkya-text-muted font-body mb-8 leading-relaxed">
            {home.contact.subline}
          </p>
          <span className="inline-block px-8 py-4 border border-nahkya-ivory/20 text-nahkya-ivory font-body font-medium uppercase tracking-wide text-body-sm rounded-nahkya">
            {home.contact.ctaText}
          </span>
        </div>
      </section>
    </div>
  );
}
