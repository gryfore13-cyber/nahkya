import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ------------------------------------------------------------------
// Element Inspector Wrapper
// ------------------------------------------------------------------

interface InspectorInfo {
  label: string;
  tokens: { name: string; type: 'color' | 'text' | 'font' | 'spacing' | 'shadow' }[];
}

interface ElementInspectorProps {
  info: InspectorInfo;
  children: ReactNode;
  selected?: boolean;
  onSelect?: (info: InspectorInfo) => void;
}

function ElementInspector({ info, children, selected, onSelect }: ElementInspectorProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(info);
      }}
    >
      {children}
      {(hovered || selected) && (
        <div
          className={cn(
            'absolute inset-0 pointer-events-none border-2 rounded-nahkya z-10 transition-colors',
            selected ? 'border-nahkya-gold bg-nahkya-gold/5' : 'border-nahkya-gold/40'
          )}
        />
      )}
      {hovered && (
        <div className="absolute -top-6 left-0 px-2 py-0.5 bg-nahkya-gold text-nahkya-text font-mono text-mono-sm rounded-nahkya z-20 whitespace-nowrap pointer-events-none">
          {info.label}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Mock Page Sections
// ------------------------------------------------------------------

function HeroMock({ onSelect }: { onSelect: (info: InspectorInfo) => void }) {
  return (
    <ElementInspector info={{ label: 'Hero Background — bg-nahkya-charcoal', tokens: [{ name: 'nahkya-charcoal', type: 'color' }] }} onSelect={onSelect}>
      <div className="relative bg-nahkya-charcoal rounded-nahkya p-12 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-nahkya-charcoal/60 via-transparent to-nahkya-charcoal/80" />
      <div className="relative z-content space-y-6">
        <ElementInspector info={{ label: 'Eyebrow — font-mono + text-nahkya-gold', tokens: [{ name: 'font-mono', type: 'font' }, { name: 'nahkya-gold', type: 'color' }] }} onSelect={onSelect}>
          <p className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-label">WRAPPED WITH INTENTION</p>
        </ElementInspector>
        <ElementInspector info={{ label: 'Hero Headline — font-display + text-display-md', tokens: [{ name: 'font-display', type: 'font' }, { name: 'font-display-md', type: 'text' }, { name: 'nahkya-ivory', type: 'color' }] }} onSelect={onSelect}>
          <h1 className="font-display text-display-md text-nahkya-ivory font-medium">Where Silk Meets Soul</h1>
        </ElementInspector>
        <ElementInspector info={{ label: 'Hero Subtitle — font-body + text-body-lg', tokens: [{ name: 'font-body', type: 'font' }, { name: 'font-body-lg', type: 'text' }, { name: 'nahkya-taupe', type: 'color' }] }} onSelect={onSelect}>
          <p className="text-body-lg text-nahkya-text-muted font-body max-w-xl mx-auto">Design your own luxury headscarf in the Atelier.</p>
        </ElementInspector>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ElementInspector info={{ label: 'Primary Button — bg-nahkya-gold', tokens: [{ name: 'nahkya-gold', type: 'color' }, { name: 'nahkya-gold-light', type: 'color' }, { name: 'nahkya-charcoal', type: 'color' }] }} onSelect={onSelect}>
            <span className="px-8 py-4 bg-nahkya-gold text-nahkya-text font-body font-medium uppercase text-body-sm rounded-nahkya">Enter the Atelier</span>
          </ElementInspector>
          <ElementInspector info={{ label: 'Secondary Button — border + text-nahkya-ivory', tokens: [{ name: 'nahkya-ivory', type: 'color' }, { name: 'nahkya-gold', type: 'color' }] }} onSelect={onSelect}>
            <span className="px-8 py-4 border border-nahkya-ivory/20 text-nahkya-ivory font-body font-medium uppercase tracking-wide text-body-sm rounded-nahkya">Learn More</span>
          </ElementInspector>
        </div>
      </div>
      </div>
    </ElementInspector>
  );
}

function CardMock({ onSelect }: { onSelect: (info: InspectorInfo) => void }) {
  return (
    <ElementInspector info={{ label: 'Card Background — bg-nahkya-surface', tokens: [{ name: 'nahkya-cream', type: 'color' }] }} onSelect={onSelect}>
      <div className="bg-nahkya-surface rounded-nahkya p-8">
        <div className="max-w-sm">
        <ElementInspector info={{ label: 'Card Container — bg-nahkya-surface + rounded-nahkya', tokens: [{ name: 'nahkya-cream', type: 'color' }, { name: 'radius-nahkya', type: 'spacing' }] }} onSelect={onSelect}>
          <Card>
            <CardHeader>
              <ElementInspector info={{ label: 'Card Title — font-display + text-heading-sm', tokens: [{ name: 'font-display', type: 'font' }, { name: 'font-heading-sm', type: 'text' }, { name: 'nahkya-charcoal', type: 'color' }] }} onSelect={onSelect}>
                <CardTitle className="font-display text-heading-sm text-nahkya-text">Card Title</CardTitle>
              </ElementInspector>
            </CardHeader>
            <CardContent className="space-y-4">
              <ElementInspector info={{ label: 'Card Body — font-body + text-body-md', tokens: [{ name: 'font-body', type: 'font' }, { name: 'font-body-md', type: 'text' }, { name: 'nahkya-text-secondary', type: 'color' }] }} onSelect={onSelect}>
                <p className="text-body-md text-nahkya-text-muted font-body">This is card body text using the standard body size and colour.</p>
              </ElementInspector>
              <ElementInspector info={{ label: 'Badge — bg-nahkya-gold/15 + text-nahkya-gold-muted', tokens: [{ name: 'nahkya-gold', type: 'color' }, { name: 'nahkya-gold-muted', type: 'color' }] }} onSelect={onSelect}>
                <Badge variant="outline" className="text-nahkya-gold-muted border-nahkya-gold/20">Featured</Badge>
              </ElementInspector>
            </CardContent>
          </Card>
        </ElementInspector>
      </div>
      </div>
    </ElementInspector>
  );
}

function FormMock({ onSelect }: { onSelect: (info: InspectorInfo) => void }) {
  return (
    <ElementInspector info={{ label: 'Form Background — bg-nahkya-ivory', tokens: [{ name: 'nahkya-ivory', type: 'color' }] }} onSelect={onSelect}>
      <div className="bg-nahkya-ivory rounded-nahkya p-8 space-y-6">
      <ElementInspector info={{ label: 'Label — font-mono + text-mono-sm', tokens: [{ name: 'font-mono', type: 'font' }, { name: 'font-mono-sm', type: 'text' }, { name: 'nahkya-text-secondary', type: 'color' }] }} onSelect={onSelect}>
        <label className="block font-mono text-mono-sm uppercase text-nahkya-text-muted mb-2">Email Address</label>
      </ElementInspector>
      <ElementInspector info={{ label: 'Input Field — bg-nahkya-ivory + border-nahkya-gold-soft', tokens: [{ name: 'nahkya-ivory', type: 'color' }, { name: 'nahkya-stone', type: 'color' }, { name: 'nahkya-charcoal', type: 'color' }] }} onSelect={onSelect}>
        <Input placeholder="you@example.com" className="bg-nahkya-ivory border-nahkya-gold-soft text-nahkya-text" />
      </ElementInspector>
      <ElementInspector info={{ label: 'Error Text — text-nahkya-error', tokens: [{ name: 'nahkya-error', type: 'color' }] }} onSelect={onSelect}>
        <p className="text-body-sm text-nahkya-error font-body">This field is required.</p>
      </ElementInspector>
      </div>
    </ElementInspector>
  );
}

function TypographyScale({ onSelect }: { onSelect: (info: InspectorInfo) => void }) {
  const sizes = [
    { label: 'Display XXL', className: 'text-display-xxl', token: 'font-display-xxl' },
    { label: 'Display XL', className: 'text-display-xl', token: 'font-display-xl' },
    { label: 'Display LG', className: 'text-display-lg', token: 'font-display-lg' },
    { label: 'Display MD', className: 'text-display-md', token: 'font-display-md' },
    { label: 'Display SM', className: 'text-display-sm', token: 'font-display-sm' },
    { label: 'Heading LG', className: 'text-heading-lg', token: 'font-heading-lg' },
    { label: 'Heading MD', className: 'text-heading-md', token: 'font-heading-md' },
    { label: 'Body LG', className: 'text-body-lg', token: 'font-body-lg' },
    { label: 'Body MD', className: 'text-body-md', token: 'font-body-md' },
    { label: 'Mono LG', className: 'text-mono-lg', token: 'font-mono-lg' },
    { label: 'Mono MD', className: 'text-mono-md', token: 'font-mono-md' },
    { label: 'Mono SM', className: 'text-mono-sm', token: 'font-mono-sm' },
  ];

  return (
    <ElementInspector info={{ label: 'Typography Background — bg-nahkya-ivory', tokens: [{ name: 'nahkya-ivory', type: 'color' }] }} onSelect={onSelect}>
      <div className="bg-nahkya-ivory rounded-nahkya p-8 space-y-4">
      <h3 className="font-display text-heading-sm text-nahkya-text mb-6">Typography Scale</h3>
      {sizes.map((s) => (
        <ElementInspector
          key={s.token}
          info={{ label: `${s.label} — ${s.token}`, tokens: [{ name: s.token, type: 'text' }, { name: 'nahkya-charcoal', type: 'color' }] }}
          onSelect={onSelect}
        >
          <p className={cn(s.className, 'text-nahkya-text border-b border-nahkya-gold-soft pb-2')}>
            {s.label} — The quick brown fox
          </p>
        </ElementInspector>
      ))}
      </div>
    </ElementInspector>
  );
}

function ColourScale({ onSelect }: { onSelect: (info: InspectorInfo) => void }) {
  const colours = [
    { label: 'Ivory', className: 'bg-nahkya-ivory', text: 'text-nahkya-text', token: 'nahkya-ivory' },
    { label: 'Cream', className: 'bg-nahkya-surface', text: 'text-nahkya-text', token: 'nahkya-cream' },
    { label: 'Stone', className: 'bg-nahkya-stone', text: 'text-nahkya-text', token: 'nahkya-stone' },
    { label: 'Taupe', className: 'bg-nahkya-taupe', text: 'text-nahkya-text', token: 'nahkya-taupe' },
    { label: 'Sand', className: 'bg-nahkya-sand', text: 'text-nahkya-text', token: 'nahkya-sand' },
    { label: 'Charcoal', className: 'bg-nahkya-charcoal', text: 'text-nahkya-ivory', token: 'nahkya-charcoal' },
    { label: 'Soft Black', className: 'bg-nahkya-soft-black', text: 'text-nahkya-ivory', token: 'nahkya-soft-black' },
    { label: 'Gold', className: 'bg-nahkya-gold', text: 'text-nahkya-text', token: 'nahkya-gold' },
    { label: 'Gold Light', className: 'bg-nahkya-gold-soft', text: 'text-nahkya-text', token: 'nahkya-gold-light' },
    { label: 'Gold Muted', className: 'bg-nahkya-gold-muted', text: 'text-nahkya-text', token: 'nahkya-gold-muted' },
    { label: 'Rose', className: 'bg-nahkya-rose', text: 'text-nahkya-ivory', token: 'nahkya-rose' },
    { label: 'Teal', className: 'bg-nahkya-teal', text: 'text-nahkya-ivory', token: 'nahkya-teal' },
    { label: 'Fuchsia', className: 'bg-nahkya-fuchsia', text: 'text-nahkya-ivory', token: 'nahkya-fuchsia' },
  ];

  return (
    <ElementInspector info={{ label: 'Colour Scale Background — bg-nahkya-ivory', tokens: [{ name: 'nahkya-ivory', type: 'color' }] }} onSelect={onSelect}>
      <div className="bg-nahkya-ivory rounded-nahkya p-8">
        <h3 className="font-display text-heading-sm text-nahkya-text mb-6">Colour Scale</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {colours.map((c) => (
          <ElementInspector
            key={c.token}
            info={{ label: `${c.label} — ${c.token}`, tokens: [{ name: c.token, type: 'color' }] }}
            onSelect={onSelect}
          >
            <div className={cn('rounded-nahkya p-4 h-24 flex flex-col justify-end', c.className)}>
              <span className={cn('font-mono text-mono-sm', c.text)}>{c.label}</span>
              <span className={cn('font-mono text-mono-sm opacity-60', c.text)}>{c.token}</span>
            </div>
          </ElementInspector>
        ))}
        </div>
      </div>
    </ElementInspector>
  );
}

// ------------------------------------------------------------------
// Main Tab Component
// ------------------------------------------------------------------

export interface SelectedElement {
  label: string;
  tokens: { name: string; type: 'color' | 'text' | 'font' | 'spacing' | 'shadow' }[];
}

interface VisualCustomizerTabProps {
  selectedElement: SelectedElement | null;
  onSelectElement: (el: SelectedElement | null) => void;
}

export function VisualCustomizerTab({ onSelectElement }: VisualCustomizerTabProps) {
  return (
    <div className="space-y-10" onClick={() => onSelectElement(null)}>
      <div>
        <SectionHeading>Hero Section</SectionHeading>
        <SectionDesc>Click any element to inspect and edit its tokens.</SectionDesc>
        <HeroMock onSelect={onSelectElement} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <SectionHeading>Card</SectionHeading>
          <CardMock onSelect={onSelectElement} />
        </div>
        <div>
          <SectionHeading>Form</SectionHeading>
          <FormMock onSelect={onSelectElement} />
        </div>
      </div>

      <div>
        <SectionHeading>Typography Scale</SectionHeading>
        <TypographyScale onSelect={onSelectElement} />
      </div>

      <div>
        <SectionHeading>Colour Scale</SectionHeading>
        <ColourScale onSelect={onSelectElement} />
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return <h3 className="font-display text-heading-lg text-nahkya-ivory mb-2">{children}</h3>;
}

function SectionDesc({ children }: { children: ReactNode }) {
  return <p className="text-body-md text-nahkya-text-muted font-body mb-6">{children}</p>;
}
