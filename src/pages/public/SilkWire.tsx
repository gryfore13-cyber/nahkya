import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NEWS = [
  { cat: 'TRENDS', title: 'The Colours of 2025: What Our Members Are Designing', excerpt: 'An analysis of 10,000 designs created in the NAHKYA atelier this quarter reveals surprising colour trends.', date: '18 MARCH 2025', img: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80' },
  { cat: 'INNOVATION', title: 'Digital Printing on Silk: A New Era', excerpt: 'New digital printing technologies are allowing for unprecedented detail and colour accuracy on silk.', date: '15 MARCH 2025', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80' },
  { cat: 'CULTURE', title: 'Campus Style: How University Students Are Redefining the Tudong', excerpt: 'Across Brunei\'s universities, young women are combining tradition with streetwear.', date: '12 MARCH 2025', img: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c7e?w=800&q=80' },
  { cat: 'BUSINESS', title: 'The Economics of Small-Batch Scarf Production', excerpt: 'Why NAHKYA produces in limited runs, and how small-batch manufacturing delivers better quality.', date: '8 MARCH 2025', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' },
  { cat: 'TRENDS', title: 'Texture Mixing: The New Scarf Aesthetic', excerpt: 'This season\'s most exciting trend is not a colour or pattern — it is texture.', date: '5 MARCH 2025', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80' },
  { cat: 'INNOVATION', title: 'Brunei\'s Silk Revival Project', excerpt: 'A new government initiative is supporting sericulture in Brunei.', date: '1 MARCH 2025', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' },
];

export default function SilkWire() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.news-card', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-nahkya-charcoal min-h-screen pt-[160px] pb-32">
      <div className="max-w-container mx-auto">
        <p className="font-mono text-mono-md font-medium uppercase  text-nahkya-gold mb-4">FASHION NEWS</p>
        <h1 className="font-display text-5xl lg:text-display-xl text-nahkya-ivory font-medium tracking-tight mb-6">Silk Wire</h1>
        <p className="text-base lg:text-lg text-nahkya-text-muted font-body leading-relaxed max-w-content mb-16">
          The latest from the world of modest fashion, textile innovation, and cultural style. Curated weekly for the NAHKYA community.
        </p>

        {/* Featured */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-16 bg-workspace-panel border border-workspace-border">
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80" alt="Modest fashion week"
              className="w-full h-full object-cover aspect-video lg:aspect-auto" />
          </div>
          <div className="p-10 lg:p-12 flex flex-col justify-center">
            <p className="font-mono text-mono-sm font-medium uppercase  text-nahkya-gold mb-4">BREAKING — MODEST FASHION WEEK</p>
            <h2 className="font-display text-heading-sm text-nahkya-ivory font-medium leading-tight mb-4">London Modest Fashion Week: The Highlights</h2>
            <p className="text-body-md text-nahkya-text-muted font-body leading-relaxed mb-4">
              From emerging Brunei-based designers to established London houses, this year's modest fashion week proved that covered dress is not a niche — it is the future.
            </p>
            <p className="font-mono text-mono-sm text-nahkya-text-muted mb-6">20 MARCH 2025 — 8 MIN READ</p>
            <span className="inline-flex items-center gap-2 text-body-md font-body font-medium text-nahkya-ivory hover:text-nahkya-gold transition-colors cursor-pointer">
              Read Full Story &rarr;
            </span>
          </div>
        </div>

        {/* News Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEWS.map((n, i) => (
            <div key={i} className="news-card group bg-workspace-panel border border-workspace-border hover:border-nahkya-gold/30 transition-all duration-200">
              <div className="overflow-hidden">
                <img src={n.img} alt={n.title} className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-6">
                <p className="font-mono text-mono-sm font-medium uppercase  text-nahkya-gold mb-3">{n.cat}</p>
                <h3 className="font-display text-xl text-nahkya-ivory font-medium leading-snug mb-3">{n.title}</h3>
                <p className="text-sm text-nahkya-text-muted font-body leading-relaxed mb-4">{n.excerpt}</p>
                <p className="font-mono text-mono-sm font-medium uppercase  text-nahkya-text-muted">{n.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
