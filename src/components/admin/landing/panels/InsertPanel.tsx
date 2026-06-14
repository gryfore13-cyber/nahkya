import { LayoutGrid } from 'lucide-react';
import { RibbonGroup, RibbonButton } from '@/components/shared/Ribbon';
import type { LandingApi } from '@/components/admin/landing/LandingRibbon';

interface InsertPanelProps {
  callApi: <K extends keyof LandingApi>(
    method: K,
    ...args: Parameters<LandingApi[K]>
  ) => ReturnType<LandingApi[K]> | undefined;
}

const TEMPLATES = [
  {
    title: 'Hero',
    items: [
      { type: 'hero-editorial', label: 'Editorial' },
      { type: 'hero-split', label: 'Split' },
      { type: 'hero-product', label: 'Product' },
    ],
  },
  {
    title: 'Story',
    items: [
      { type: 'story-brand', label: 'Brand Story' },
      { type: 'story-founder', label: 'Founder' },
      { type: 'story-campaign', label: 'Campaign' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { type: 'tools-showcase', label: 'Showcase' },
      { type: 'tools-process', label: 'Process' },
      { type: 'tools-grid', label: 'Grid' },
    ],
  },
  {
    title: 'Gallery',
    items: [
      { type: 'gallery-lookbook', label: 'Lookbook' },
      { type: 'gallery-product', label: 'Product' },
      { type: 'gallery-editorial', label: 'Editorial' },
    ],
  },
  {
    title: 'Trust',
    items: [
      { type: 'trust-testimonials', label: 'Testimonials' },
      { type: 'trust-press', label: 'Press' },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { type: 'commerce-pricing', label: 'Pricing' },
      { type: 'commerce-waitlist', label: 'Waitlist' },
      { type: 'commerce-booking', label: 'Booking' },
      { type: 'final', label: 'Classic CTA' },
    ],
  },
  {
    title: 'Footer',
    items: [
      { type: 'footer-simple', label: 'Simple' },
      { type: 'footer-full', label: 'Full' },
    ],
  },
];

export function InsertPanel({ callApi }: InsertPanelProps) {
  return (
    <>
      {TEMPLATES.map((group) => (
        <RibbonGroup key={group.title} title={group.title}>
          {group.items.map((item) => (
            <RibbonButton
              key={item.type}
              icon={<LayoutGrid className="w-4 h-4" />}
              label={item.label}
              onClick={() => callApi('createSection', item.type)}
            />
          ))}
        </RibbonGroup>
      ))}
      <RibbonGroup title="Rule">
        <span className="text-body-xs text-nahkya-text-secondary font-body whitespace-nowrap">
          Approved templates only. No random Frankenstein sections.
        </span>
      </RibbonGroup>
    </>
  );
}
