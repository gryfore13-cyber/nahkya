import { useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PALETTE_MAP: Record<string, { primary: string; bg: string }> = {
  burgundy: { primary: '#2C2420', bg: '#EDE5DA' },
  gold: { primary: '#B88B4A', bg: '#F5EDE3' },
  taupe: { primary: '#9A8A7A', bg: '#EDE5DA' },
  champagne: { primary: '#9A7B52', bg: '#F5EDE3' },
  rose: { primary: '#A65D6B', bg: '#EDE5DA' },
  teal: { primary: '#5A8A8A', bg: '#F5EDE3' },
  stone: { primary: '#DCC6A1', bg: '#F5EDE3' },
  fuchsia: { primary: '#8A5A8A', bg: '#EDE5DA' },
  neutral: { primary: '#2C2420', bg: '#DCC6A1' },
};

interface SectionWrapperProps {
  children: ReactNode;
  accentPalette: string;
  className?: string;
  animate?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export function SectionWrapper({
  children,
  accentPalette,
  className,
  animate = true,
  selected,
  onClick,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const palette = PALETTE_MAP[accentPalette] ?? PALETTE_MAP.gold;

  useEffect(() => {
    if (!animate || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.animate-in'), {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, el);
    return () => ctx.revert();
  }, [animate]);

  return (
    <section
      ref={ref}
      onClick={onClick}
      className={cn(
        'relative transition-all',
        selected && 'ring-2 ring-nahkya-gold ring-offset-4 ring-offset-nahkya-ivory',
        className
      )}
      style={{
        '--section-primary': palette.primary,
        '--section-bg': palette.bg,
      } as React.CSSProperties}
    >
      {children}
    </section>
  );
}
