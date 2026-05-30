import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, FolderHeart, Package, Check } from 'lucide-react';
import { LuxuryButton } from '@/components/shared/LuxuryButton';

gsap.registerPlugin(ScrollTrigger);

export default function Membership() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.benefit-card', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.15,
        scrollTrigger: { trigger: '.benefits-section', start: 'top 80%' },
      });
      gsap.fromTo('.tier-card', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.15,
        scrollTrigger: { trigger: '.tiers-section', start: 'top 80%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const benefits = [
    { icon: Palette, title: 'Three Design Tools', desc: 'Access the Atelier for colouring artworks, the Monogram Studio for pattern creation, and the Petak Composer for geometric design.' },
    { icon: FolderHeart, title: 'Personal Gallery', desc: 'Save unlimited designs to your personal gallery. Return anytime to refine colours, adjust patterns, or create variations.' },
    { icon: Package, title: 'Artisan Production', desc: 'Submit your completed designs for production. Our artisans in Brunei craft each scarf in pure silk, ready for collection.' },
  ];

  const freeFeatures = ['Access to all three design tools', 'Save up to 10 designs', 'Submit designs for production', 'Order tracking', 'Member newsletter'];
  const collectorFeatures = ['Everything in Atelier Member', 'Unlimited design saves', 'Priority production queue', 'Exclusive artwork collections', 'Early access to new tools', 'Member-only events'];

  return (
    <div ref={ref} className="bg-nahkya-ivory min-h-screen pt-[160px] pb-32">
      <div className="max-w-container mx-auto">
        <p className="font-mono text-mono-md font-medium uppercase  text-nahkya-gold mb-4">JOIN THE ATELIER</p>
        <h1 className="font-display text-5xl lg:text-display-xl text-nahkya-text font-medium tracking-tight mb-6">Membership</h1>
        <p className="text-base lg:text-lg text-nahkya-text-muted font-body leading-relaxed max-w-content-lg mb-20">
          NAHKYA members do not shop for scarves — they create them. Join our digital atelier and transform colour, pattern, and intention into silk.
        </p>

        {/* Benefits */}
        <div className="benefits-section grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="benefit-card bg-nahkya-ivory border border-nahkya-gold-soft p-10 hover:border-nahkya-gold/30 hover:-translate-y-1 transition-all duration-300">
                <Icon className="w-8 h-8 text-nahkya-gold mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-body font-medium text-nahkya-text mb-4">{b.title}</h3>
                <p className="text-body-md text-nahkya-text-muted font-body leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Tool Showcase */}
        <div className="space-y-24 mb-24">
          {[
            { num: '01', label: 'ATELIER', title: 'Colour Existing Artworks', desc: 'Choose from our library of scarf artworks designed by NAHKYA artists. Each artwork has three layers — silk tone, motif fills, and ink lines — that you control independently.', img: '/assets/tool-preview-atelier.jpg', feats: ['Three independent layers: Silk, Motif, Ink', 'Curated pigment palettes', 'Recent colours automatically saved', 'Real-time scarf preview'] },
            { num: '02', label: 'MONOGRAM', title: 'Create Signature Patterns', desc: 'Enter your initials and watch them transform into a repeating luxury pattern. Choose from refined serif and script fonts, adjust size and rotation.', img: '/assets/tool-preview-monogram.jpg', feats: ['Custom initials (up to 2 letters)', 'Multiple font families', 'Size, rotation, and position controls', 'Border and inner border options'] },
            { num: '03', label: 'PETAK', title: 'Paint Geometric Compositions', desc: 'Inspired by traditional Malay songket grid patterns, Petak lets you paint individual cells in a tile grid that automatically repeats into a complete scarf.', img: '/assets/tool-preview-petak.jpg', feats: ['Adjustable tile grid', 'Cell-by-cell painting', 'Real-time repeat preview', 'Scarf size selection'] },
          ].map((tool, i) => (
            <div key={tool.num} className={cn('grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ', i % 2 === 1 ? 'lg:direction-rtl' : '')}>
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <p className="font-mono text-mono-md font-medium uppercase  text-nahkya-gold mb-4">{tool.num} — {tool.label}</p>
                <h3 className="font-display text-heading-sm lg:text-display-md text-nahkya-text font-medium mb-6">{tool.title}</h3>
                <p className="text-base text-nahkya-text-muted font-body leading-relaxed mb-6">{tool.desc}</p>
                <ul className="space-y-2">
                  {tool.feats.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-nahkya-text-muted font-body">
                      <span className="text-nahkya-gold text-body-3xs">&diams;</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={cn('overflow-hidden ', i % 2 === 1 ? 'lg:order-1' : '')}>
                <img src={tool.img} alt={tool.title} className="w-full aspect-4/3 object-cover" />
              </div>
            </div>
          ))}
        </div>

        {/* Tiers */}
        <div className="tiers-section grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          <div className="tier-card bg-nahkya-ivory border border-nahkya-gold-soft p-10">
            <p className="font-mono text-mono-md font-medium uppercase  text-nahkya-gold text-center mb-4">ATELIER MEMBER</p>
            <p className="font-display text-display-sm text-nahkya-text font-medium text-center mb-1">Free</p>
            <p className="font-mono text-mono-sm text-nahkya-text-muted text-center mb-8">Forever</p>
            <div className="border-t border-nahkya-gold-soft pt-8 space-y-3">
              {freeFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-nahkya-gold flex-shrink-0" strokeWidth={2} />
                  <span className="text-sm text-nahkya-text-muted font-body">{f}</span>
                </div>
              ))}
            </div>
            <Link to="/login">
              <LuxuryButton variant="secondary" size="md" className="w-full mt-8">Join Free</LuxuryButton>
            </Link>
          </div>
          <div className="tier-card bg-nahkya-charcoal border border-nahkya-gold/30 p-10 relative">
            <div className="absolute top-4 right-4 bg-nahkya-gold text-nahkya-text font-mono text-mono-sm font-medium uppercase tracking-label px-3 py-1">Most Popular</div>
            <p className="font-mono text-mono-md font-medium uppercase  text-nahkya-gold text-center mb-4">ATELIER COLLECTOR</p>
            <p className="font-display text-display-sm text-nahkya-ivory font-medium text-center mb-1">$48</p>
            <p className="font-mono text-mono-sm text-nahkya-text-muted text-center mb-8">per year</p>
            <div className="border-t border-workspace-border pt-8 space-y-3">
              {collectorFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-nahkya-gold flex-shrink-0" strokeWidth={2} />
                  <span className="text-sm text-nahkya-text-muted font-body">{f}</span>
                </div>
              ))}
            </div>
            <Link to="/login">
              <LuxuryButton variant="dark-primary" size="md" className="w-full mt-8">Become a Collector</LuxuryButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-nahkya-charcoal py-20">
        <div className="max-w-content mx-auto px-5 text-center">
          <h2 className="font-display text-display-sm lg:text-display-md text-nahkya-ivory font-medium mb-5">Your scarf is waiting to be designed</h2>
          <p className="text-base text-nahkya-text-muted font-body leading-relaxed mb-10">Join today and begin creating. No credit card required for the free tier.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login"><LuxuryButton variant="primary" size="lg">Join Free</LuxuryButton></Link>
            <Link to="/contact"><LuxuryButton variant="dark-ghost" size="lg">Contact Us</LuxuryButton></Link>
          </div>
        </div>
      </div>
    </div>
  );
}


