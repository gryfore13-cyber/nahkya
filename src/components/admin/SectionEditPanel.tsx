import { useHomepageStore, type HomepageSection } from '@/stores/homepageStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const PALETTES = [
  'burgundy', 'gold', 'taupe', 'champagne', 'rose', 'teal', 'stone', 'fuchsia', 'neutral',
];

interface SectionEditPanelProps {
  section: HomepageSection;
}

export function SectionEditPanel({ section }: SectionEditPanelProps) {
  const updateSection = useHomepageStore((s) => s.updateSection);
  const updateSectionContent = useHomepageStore((s) => s.updateSectionContent);
  const setSelectedSection = useHomepageStore((s) => s.setSelectedSection);

  const setField = (key: string, value: unknown) => {
    updateSectionContent(section.id, { [key]: value });
  };

  const setNested = (path: string, value: unknown) => {
    const keys = path.split('.');
    const next = { ...section.content };
    let target: Record<string, unknown> = next;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]] as Record<string, unknown>;
    }
    target[keys[keys.length - 1]] = value;
    updateSectionContent(section.id, next);
  };

  return (
    <div className="w-panel-inspector border-l border-nahkya-gold-soft bg-nahkya-surface flex flex-col h-full">
      <div className="h-toolbar border-b border-nahkya-gold-soft flex items-center justify-between px-6">
        <h2 className="font-body text-heading-sm text-nahkya-text font-medium">Edit Section</h2>
        <button onClick={() => setSelectedSection(null)} className="p-2 text-nahkya-text-muted hover:text-nahkya-text transition-colors">
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Field label="Section Title">
          <Input
            value={section.title}
            onChange={(e) => updateSection(section.id, { title: e.target.value })}
            className="bg-nahkya-ivory border-nahkya-gold-soft"
          />
        </Field>

        <Field label="Accent Palette">
          <Select value={section.accentPalette} onValueChange={(v) => updateSection(section.id, { accentPalette: v })}>
            <SelectTrigger className="bg-nahkya-ivory border-nahkya-gold-soft">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PALETTES.map((p) => (
                <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {section.type === 'hero' && (
          <>
            <Field label="Eyebrow"><Input value={String(section.content.eyebrow ?? '')} onChange={(e) => setField('eyebrow', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Headline"><Textarea value={String(section.content.headline ?? '')} onChange={(e) => setField('headline', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Subtitle"><Textarea value={String(section.content.subtitle ?? '')} onChange={(e) => setField('subtitle', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Primary CTA Label"><Input value={String((section.content.primaryCta as Record<string, string>)?.label ?? '')} onChange={(e) => setNested('primaryCta.label', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Primary CTA Link"><Input value={String((section.content.primaryCta as Record<string, string>)?.href ?? '')} onChange={(e) => setNested('primaryCta.href', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Secondary CTA Label"><Input value={String((section.content.secondaryCta as Record<string, string>)?.label ?? '')} onChange={(e) => setNested('secondaryCta.label', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Secondary CTA Link"><Input value={String((section.content.secondaryCta as Record<string, string>)?.href ?? '')} onChange={(e) => setNested('secondaryCta.href', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Background Image URL"><Input value={String(section.content.backgroundImage ?? '')} onChange={(e) => setField('backgroundImage', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
          </>
        )}

        {section.type === 'features' && (
          <>
            <Field label="Section Subtitle"><Input value={String(section.content.sectionSubtitle ?? '')} onChange={(e) => setField('sectionSubtitle', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Section Title"><Input value={String(section.content.sectionTitle ?? '')} onChange={(e) => setField('sectionTitle', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            {(section.content.features as Array<Record<string, string>>)?.map((f, i) => (
              <div key={i} className="border border-nahkya-gold-soft rounded-nahkya p-4 space-y-3">
                <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">Feature {i + 1}</p>
                <Field label="Icon"><Input value={f.icon} onChange={(e) => { const next = [...(section.content.features as Array<Record<string, string>>)]; next[i] = { ...f, icon: e.target.value }; setField('features', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="Title"><Input value={f.title} onChange={(e) => { const next = [...(section.content.features as Array<Record<string, string>>)]; next[i] = { ...f, title: e.target.value }; setField('features', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="Description"><Textarea value={f.description} onChange={(e) => { const next = [...(section.content.features as Array<Record<string, string>>)]; next[i] = { ...f, description: e.target.value }; setField('features', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
              </div>
            ))}
          </>
        )}

        {section.type === 'split' && (
          <>
            <Field label="Eyebrow"><Input value={String(section.content.eyebrow ?? '')} onChange={(e) => setField('eyebrow', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Headline"><Textarea value={String(section.content.headline ?? '')} onChange={(e) => setField('headline', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Body"><Textarea value={String(section.content.body ?? '')} onChange={(e) => setField('body', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="CTA Label"><Input value={String((section.content.cta as Record<string, string>)?.label ?? '')} onChange={(e) => setNested('cta.label', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="CTA Link"><Input value={String((section.content.cta as Record<string, string>)?.href ?? '')} onChange={(e) => setNested('cta.href', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Image URL"><Input value={String(section.content.image ?? '')} onChange={(e) => setField('image', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Image Position">
              <Select value={String(section.content.imagePosition ?? 'right')} onValueChange={(v) => setField('imagePosition', v)}>
                <SelectTrigger className="bg-nahkya-ivory border-nahkya-gold-soft"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        )}

        {section.type === 'testimonials' && (
          <>
            <Field label="Section Title"><Input value={String(section.content.sectionTitle ?? '')} onChange={(e) => setField('sectionTitle', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            {(section.content.testimonials as Array<Record<string, unknown>>)?.map((t, i) => (
              <div key={i} className="border border-nahkya-gold-soft rounded-nahkya p-4 space-y-3">
                <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">Testimonial {i + 1}</p>
                <Field label="Quote"><Textarea value={String(t.quote ?? '')} onChange={(e) => { const next = [...(section.content.testimonials as Array<Record<string, unknown>>)]; next[i] = { ...t, quote: e.target.value }; setField('testimonials', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="Author"><Input value={String(t.author ?? '')} onChange={(e) => { const next = [...(section.content.testimonials as Array<Record<string, unknown>>)]; next[i] = { ...t, author: e.target.value }; setField('testimonials', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="Role"><Input value={String(t.role ?? '')} onChange={(e) => { const next = [...(section.content.testimonials as Array<Record<string, unknown>>)]; next[i] = { ...t, role: e.target.value }; setField('testimonials', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="Rating">
                  <Input type="number" min={1} max={5} value={String(t.rating ?? 5)} onChange={(e) => { const next = [...(section.content.testimonials as Array<Record<string, unknown>>)]; next[i] = { ...t, rating: parseInt(e.target.value) }; setField('testimonials', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" />
                </Field>
                <Field label="Avatar URL"><Input value={String(t.avatar ?? '')} onChange={(e) => { const next = [...(section.content.testimonials as Array<Record<string, unknown>>)]; next[i] = { ...t, avatar: e.target.value }; setField('testimonials', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
              </div>
            ))}
          </>
        )}

        {section.type === 'showcase' && (
          <>
            <Field label="Eyebrow"><Input value={String(section.content.eyebrow ?? '')} onChange={(e) => setField('eyebrow', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Headline"><Input value={String(section.content.headline ?? '')} onChange={(e) => setField('headline', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            {(section.content.items as Array<Record<string, string>>)?.map((item, i) => (
              <div key={i} className="border border-nahkya-gold-soft rounded-nahkya p-4 space-y-3">
                <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">Item {i + 1}</p>
                <Field label="Title"><Input value={item.title} onChange={(e) => { const next = [...(section.content.items as Array<Record<string, string>>)]; next[i] = { ...item, title: e.target.value }; setField('items', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="Category"><Input value={item.category} onChange={(e) => { const next = [...(section.content.items as Array<Record<string, string>>)]; next[i] = { ...item, category: e.target.value }; setField('items', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="Image URL"><Input value={item.image} onChange={(e) => { const next = [...(section.content.items as Array<Record<string, string>>)]; next[i] = { ...item, image: e.target.value }; setField('items', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
              </div>
            ))}
          </>
        )}

        {section.type === 'textMedia' && (
          <>
            <Field label="Headline"><Input value={String(section.content.headline ?? '')} onChange={(e) => setField('headline', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Body"><Textarea value={String(section.content.body ?? '')} onChange={(e) => setField('body', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Media URL"><Input value={String(section.content.media ?? '')} onChange={(e) => setField('media', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Media Type">
              <Select value={String(section.content.mediaType ?? 'image')} onValueChange={(v) => setField('mediaType', v)}>
                <SelectTrigger className="bg-nahkya-ivory border-nahkya-gold-soft"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        )}

        {section.type === 'gallery' && (
          <>
            <Field label="Section Title"><Input value={String(section.content.sectionTitle ?? '')} onChange={(e) => setField('sectionTitle', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Section Subtitle"><Input value={String(section.content.sectionSubtitle ?? '')} onChange={(e) => setField('sectionSubtitle', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            {(section.content.items as Array<Record<string, string>>)?.map((item, i) => (
              <div key={i} className="border border-nahkya-gold-soft rounded-nahkya p-4 space-y-3">
                <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">Image {i + 1}</p>
                <Field label="Image URL"><Input value={item.image} onChange={(e) => { const next = [...(section.content.items as Array<Record<string, string>>)]; next[i] = { ...item, image: e.target.value }; setField('items', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="Caption"><Input value={item.caption} onChange={(e) => { const next = [...(section.content.items as Array<Record<string, string>>)]; next[i] = { ...item, caption: e.target.value }; setField('items', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
              </div>
            ))}
          </>
        )}

        {section.type === 'pricing' && (
          <>
            <Field label="Section Title"><Input value={String(section.content.sectionTitle ?? '')} onChange={(e) => setField('sectionTitle', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            {(section.content.cards as Array<Record<string, unknown>>)?.map((card, i) => (
              <div key={i} className="border border-nahkya-gold-soft rounded-nahkya p-4 space-y-3">
                <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">Card {i + 1}</p>
                <Field label="Plan"><Input value={String(card.plan ?? '')} onChange={(e) => { const next = [...(section.content.cards as Array<Record<string, unknown>>)]; next[i] = { ...card, plan: e.target.value }; setField('cards', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="Price"><Input value={String(card.price ?? '')} onChange={(e) => { const next = [...(section.content.cards as Array<Record<string, unknown>>)]; next[i] = { ...card, price: e.target.value }; setField('cards', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="Period"><Input value={String(card.period ?? '')} onChange={(e) => { const next = [...(section.content.cards as Array<Record<string, unknown>>)]; next[i] = { ...card, period: e.target.value }; setField('cards', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
                <Field label="CTA Label"><Input value={String(card.cta ?? '')} onChange={(e) => { const next = [...(section.content.cards as Array<Record<string, unknown>>)]; next[i] = { ...card, cta: e.target.value }; setField('cards', next); }} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
              </div>
            ))}
          </>
        )}

        {section.type === 'footerCTA' && (
          <>
            <Field label="Headline"><Input value={String(section.content.headline ?? '')} onChange={(e) => setField('headline', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="Subline"><Textarea value={String(section.content.subline ?? '')} onChange={(e) => setField('subline', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="CTA Text"><Input value={String(section.content.ctaText ?? '')} onChange={(e) => setField('ctaText', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
            <Field label="CTA Link"><Input value={String(section.content.ctaHref ?? '')} onChange={(e) => setField('ctaHref', e.target.value)} className="bg-nahkya-ivory border-nahkya-gold-soft" /></Field>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label">{label}</Label>
      {children}
    </div>
  );
}
