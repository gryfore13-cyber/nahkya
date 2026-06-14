import type { LandingPageConfig } from '@/types/landingPage';
import { textField } from '@/lib/landingText';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1600&auto=format&fit=crop';

export function getDefaultLandingPageConfig(): LandingPageConfig {
  return {
    enabled: true,
    metaTitle: 'Haus of Nahkya — Luxury Digital Scarf Atelier',
    metaDescription:
      'Design a silk scarf that feels unmistakably yours. Curated colours, elegant motifs, and a calmer design experience.',
    nav: {
      type: 'nav',
      id: 'landingNav',
      logoText: 'NAHKYA',
      links: [
        { label: 'The House', target: '/#brand' },
        { label: 'By Nahkya', target: '/by-nahkya' },
        { label: 'The Silk Report', target: '/silk-report' },
        { label: 'Herstory', target: '/herstory' },
        { label: 'Silk Wire', target: '/silk-wire' },
        { label: 'Membership', target: '/membership' },
      ],
      contactText: 'Contact',
      contactTarget: '/contact',
      ctaText: 'Enter Atelier',
      ctaTarget: '/login',
      style: 'solid',
      sticky: true,
    },
    sections: [
      {
        type: 'hero',
        variant: 'default',
        id: 'hero',
        headline: textField('Design a scarf that feels unmistakably yours.'),
        body: textField(
          'Curated colors, elegant motifs, guided layouts, and a calmer design experience for premium modest fashion.',
        ),
        ctaText: textField('Start designing'),
        ctaTarget: '#final',
        imageUrl: DEFAULT_IMAGE,
        settings: {
          backgroundColor: 'image',
          backgroundPosition: 'center',
          textColor: 'inverse',
          padding: 'standard',
          align: 'center',
          isVisible: true,
        },
      },
      {
        type: 'story',
        variant: 'default',
        id: 'story',
        eyebrow: textField('Wrapped with intention'),
        headline: textField('Not from the shelf. From yourself.'),
        body: textField(
          'Nahkya gives customers a guided atelier experience — personal, refined, and controlled enough for fabric-safe production.',
        ),
        settings: {
          backgroundColor: '#F8F1E7',
          textColor: 'text',
          padding: 'standard',
          align: 'center',
          isVisible: true,
        },
      },
      {
        type: 'tools',
        variant: 'default',
        id: 'tools',
        eyebrow: textField('The studio tools'),
        headline: textField('Design with structure, not chaos.'),
        items: [
          {
            title: textField('Colour Atelier'),
            description: textField('Fabric-safe curated swatches only.'),
          },
          {
            title: textField('Monogram Studio'),
            description: textField('Personal identity with controlled repeat rules.'),
          },
          {
            title: textField('Petak Builder'),
            description: textField('Pattern grids, motifs, and tileable previews.'),
          },
        ],
        settings: {
          backgroundColor: 'gradient-warm',
          textColor: 'text',
          padding: 'standard',
          align: 'center',
          isVisible: true,
        },
      },
      {
        type: 'gallery',
        variant: 'lookbook',
        id: 'gallery',
        eyebrow: textField('Visual slots'),
        headline: textField('Premium placeholders before images arrive.'),
        items: [
          {
            label: textField('Editorial Portrait'),
            note: textField('Ratio 4:5\nRecommended 1600 × 2000px\nKeep scarf and face in safe zone'),
          },
          {
            label: textField('Scarf Preview'),
            note: textField('Ratio 1:1\nRecommended 1800 × 1800px\nUse clean product crop'),
          },
          {
            label: textField('Campaign Image'),
            note: textField('Ratio 4:5\nRecommended 1600 × 2000px\nFocal point: center'),
          },
        ],
        settings: {
          backgroundColor: '#FFFDF8',
          textColor: 'text',
          padding: 'standard',
          align: 'center',
          isVisible: true,
        },
      },
      {
        type: 'commerce',
        variant: 'final',
        id: 'final',
        eyebrow: textField('Begin your piece'),
        headline: textField('Your scarf, composed like a signature.'),
        body: textField(
          'Start with guided templates, textile-safe colors, and a calmer path from idea to production.',
        ),
        ctaText: textField('Create your scarf'),
        settings: {
          backgroundColor: 'gradient-dark',
          textColor: 'inverse',
          padding: 'standard',
          align: 'center',
          isVisible: true,
        },
      },
      {
        type: 'footer',
        variant: 'default',
        id: 'footer',
        brandText: textField('Haus of Nahkya'),
        links: [textField('Privacy'), textField('Terms'), textField('Contact')],
        copyright: textField('© Haus of Nahkya. All rights reserved.'),
        settings: {
          backgroundColor: '#2C2C2C',
          textColor: 'inverse',
          padding: 'compact',
          align: 'left',
          isVisible: true,
        },
      },
    ],
  };
}
