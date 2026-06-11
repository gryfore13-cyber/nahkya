import { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useHomeContentStore } from '@/stores/homeContentStore';
import { DEFAULT_HOMEPAGE_CONFIG } from '@/types';
import { TemplateRenderer } from '@/components/homepage/TemplateRenderer';
import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { SectionAnimation } from '@/types/homepage';

const ANIMATION_VARIANTS = {
  none: { hidden: {}, visible: {} },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
  },
  softReveal: {
    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
  },
  staggeredCards: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  },
  gentleScale: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
  },
  imageParallax: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  },
  sectionOverlap: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  },
  softDivider: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  },
};

function getDurationValue(duration: SectionAnimation['duration']): number {
  switch (duration) {
    case 'fast': return 0.4;
    case 'slow': return 1.0;
    default: return 0.6;
  }
}

function getAnimationVariant(animation: SectionAnimation) {
  const base = ANIMATION_VARIANTS[animation.type] ?? ANIMATION_VARIANTS.fadeIn;
  const duration = getDurationValue(animation.duration);
  const delay = (animation.delay ?? 0) / 1000;

  return {
    hidden: base.hidden,
    visible: {
      ...(base.visible as Record<string, unknown>),
      transition: {
        ...((base.visible as Record<string, unknown>).transition as Record<string, unknown> | undefined),
        duration,
        delay,
      },
    },
  };
}

export default function Home() {
  const config = useHomeContentStore((s) => s.config);
  const isLoaded = useHomeContentStore((s) => s.isLoaded);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const sections = Array.isArray(config.sections) && config.sections.length > 0
    ? config.sections
    : DEFAULT_HOMEPAGE_CONFIG.sections;

  // Public homepage only shows published sections
  const publishedSections = sections
    .filter((s) => (s?.status ?? 'published') === 'published')
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

  /* Scroll-reveal via IntersectionObserver for fallback / reduced motion */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const nodes = containerRef.current?.querySelectorAll('.reveal-slide-up');
    nodes?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [publishedSections.map((s) => s.id).join(',')]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-nahkya-bg flex items-center justify-center">
        <p className="font-mono text-mono-md text-nahkya-text-secondary uppercase tracking-label">Loading…</p>
      </div>
    );
  }

  if (publishedSections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nahkya-bg">
        <div className="text-center">
          <h1 className="font-display text-display-lg text-nahkya-text font-medium mb-4">
            Haus of Nahkya
          </h1>
          <p className="font-body text-body-md text-nahkya-text-secondary max-w-md mx-auto">
            A luxury digital scarf atelier. Our homepage is being reimagined.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-nahkya-bg">
      {publishedSections.map((section, index) => {
        const animation = section.animation ?? { type: 'fadeIn', duration: 'normal', delay: 0 };
        const variant = getAnimationVariant(animation);
        const isFirst = index === 0;

        return (
          <motion.div
            key={section.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08, margin: '-40px 0px' }}
            variants={shouldReduceMotion ? ANIMATION_VARIANTS.none : variant}
          >
            <SectionWrapper
              settings={section.settings}
              className={isFirst ? '' : 'reveal-slide-up'}
              animation={animation}
            >
              <TemplateRenderer section={section} />
            </SectionWrapper>
          </motion.div>
        );
      })}
    </div>
  );
}
