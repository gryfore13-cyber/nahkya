/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHomeContentStore } from '@/stores/homeContentStore';
import { TEMPLATE_LABELS } from '@/types';
import type { HomepageSection, SectionSettings } from '@/types';

interface Props {
  section: HomepageSection | null;
  open: boolean;
  onClose: () => void;
}

const BG_COLOR_OPTIONS = [
  'nahkya-ivory', 'nahkya-cream', 'nahkya-surface', 'nahkya-surface-soft',
  'nahkya-surface-warm', 'nahkya-bg', 'nahkya-charcoal', 'nahkya-soft-black',
  'nahkya-burgundy', 'nahkya-burgundy-dark', 'workspace-bg', 'workspace-panel',
];

const TEXT_COLOR_OPTIONS = [
  'nahkya-text', 'nahkya-text-strong', 'nahkya-text-muted', 'nahkya-text-soft',
  'nahkya-text-inverse', 'nahkya-gold', 'nahkya-gold-soft', 'nahkya-ivory', 'nahkya-cream',
];

const PADDING_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

export function SectionEditorSheet({ section, open, onClose }: Props) {
  const updateSectionContent = useHomeContentStore((s) => s.updateSectionContent);
  const updateSectionSettings = useHomeContentStore((s) => s.updateSectionSettings);

  if (!section) return null;

  const settings = section.settings ?? {
    backgroundColor: 'nahkya-ivory',
    textColor: 'nahkya-text',
    padding: 'lg',
    fullWidth: false,
    isVisible: true,
  };

  const handleSettingChange = (key: keyof SectionSettings, value: unknown) => {
    updateSectionSettings(section.id, { [key]: value });
  };

  const handleContentChange = (updates: Partial<HomepageSection['content']>) => {
    updateSectionContent(section.id, updates);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-96 bg-nahkya-surface border-l border-nahkya-border p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-nahkya-border">
          <SheetTitle className="font-display text-heading-md font-medium">
            {TEMPLATE_LABELS[section.templateType]}
          </SheetTitle>
          <p className="font-mono text-mono-xs text-nahkya-text-muted uppercase tracking-wider">
            Section #{section.order + 1}
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Content Fields */}
            <ContentForm section={section} onChange={handleContentChange} />

            <Separator className="bg-nahkya-border" />

            {/* Settings */}
            <div className="space-y-4">
              <h4 className="font-display text-heading-sm font-medium">Settings</h4>

              <div className="space-y-2">
                <Label className="font-body text-body-sm">Background Color</Label>
                <select
                  value={settings.backgroundColor}
                  onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                  className="w-full h-10 px-3 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-nahkya-gold/50"
                >
                  {BG_COLOR_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="font-body text-body-sm">Text Color</Label>
                <select
                  value={settings.textColor}
                  onChange={(e) => handleSettingChange('textColor', e.target.value)}
                  className="w-full h-10 px-3 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-nahkya-gold/50"
                >
                  {TEXT_COLOR_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="font-body text-body-sm">Padding</Label>
                <select
                  value={settings.padding}
                  onChange={(e) => handleSettingChange('padding', e.target.value)}
                  className="w-full h-10 px-3 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-nahkya-gold/50"
                >
                  {PADDING_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="font-body text-body-sm">Full Width</Label>
                <Switch
                  checked={settings.fullWidth}
                  onCheckedChange={(v) => handleSettingChange('fullWidth', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="font-body text-body-sm">Visible</Label>
                <Switch
                  checked={settings.isVisible}
                  onCheckedChange={(v) => handleSettingChange('isVisible', v)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ── Shared Field Helpers ──

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="font-body text-body-sm">{label}</Label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 bg-nahkya-bg border-nahkya-border focus:ring-nahkya-gold/50"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="bg-nahkya-bg border-nahkya-border focus:ring-nahkya-gold/50 resize-y"
    />
  );
}

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <TextInput value={value} onChange={onChange} placeholder="Image URL" />
      {value && (
        <img src={value} alt="Preview" className="w-full h-24 object-cover rounded-nahkya border border-nahkya-border" />
      )}
    </div>
  );
}

// ── Content Form (switches on templateType) ──

function ContentForm({ section, onChange }: { section: HomepageSection; onChange: (updates: Partial<HomepageSection['content']>) => void }) {
  switch (section.templateType) {
    case 'splitScreenHero':
      return <SplitScreenHeroForm content={section.content} onChange={onChange} />;
    case 'singleColumnFocus':
      return <SingleColumnFocusForm content={section.content} onChange={onChange} />;
    case 'zPattern':
      return <ZPatternForm content={section.content} onChange={onChange} />;
    case 'fPattern':
      return <FPatternForm content={section.content} onChange={onChange} />;
    case 'invertedPyramid':
      return <InvertedPyramidForm content={section.content} onChange={onChange} />;
    case 'cardGrid':
      return <CardGridForm content={section.content} onChange={onChange} />;
    case 'alternating':
      return <AlternatingForm content={section.content} onChange={onChange} />;
    case 'longFormSales':
      return <LongFormSalesForm content={section.content} onChange={onChange} />;
    case 'storytellingScroll':
      return <StorytellingScrollForm content={section.content} onChange={onChange} />;
    case 'asymmetricalEditorial':
      return <AsymmetricalEditorialForm content={section.content} onChange={onChange} />;
    case 'productShowcase':
      return <ProductShowcaseForm content={section.content} onChange={onChange} />;
    case 'leadCapture':
      return <LeadCaptureForm content={section.content} onChange={onChange} />;
  }
}

// ── Template-Specific Forms ──

function SplitScreenHeroForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <Field label="Subheadline"><TextArea value={content.subheadline} onChange={(v) => onChange({ subheadline: v })} /></Field>
      <Field label="CTA Text"><TextInput value={content.ctaText} onChange={(v) => onChange({ ctaText: v })} /></Field>
      <Field label="CTA Link"><TextInput value={content.ctaLink} onChange={(v) => onChange({ ctaLink: v })} /></Field>
      <Field label="Image URL"><ImageInput value={content.imageUrl} onChange={(v) => onChange({ imageUrl: v })} /></Field>
      <Field label="Image Position">
        <select
          value={content.imagePosition}
          onChange={(e) => onChange({ imagePosition: e.target.value })}
          className="w-full h-10 px-3 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-nahkya-gold/50"
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </Field>
    </div>
  );
}

function SingleColumnFocusForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  const updateFeature = (idx: number, field: string, value: string) => {
    const features = [...content.features];
    features[idx] = { ...features[idx], [field]: value };
    onChange({ features });
  };
  const addFeature = () => onChange({ features: [...content.features, { title: 'New Feature', description: '' }] });
  const removeFeature = (idx: number) => onChange({ features: content.features.filter((_:any, i:number) => i !== idx) });

  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <Field label="Subheadline"><TextArea value={content.subheadline} onChange={(v) => onChange({ subheadline: v })} /></Field>
      <Field label="CTA Text"><TextInput value={content.ctaText} onChange={(v) => onChange({ ctaText: v })} /></Field>
      <Field label="CTA Link"><TextInput value={content.ctaLink} onChange={(v) => onChange({ ctaLink: v })} /></Field>
      <ArrayEditor label="Features" items={content.features} onAdd={addFeature} onRemove={removeFeature}>
        {(f: any, idx: number) => (
          <>
            <TextInput value={f.icon ?? ''} onChange={(v) => updateFeature(idx, 'icon', v)} placeholder="Icon emoji" />
            <TextInput value={f.title} onChange={(v) => updateFeature(idx, 'title', v)} placeholder="Title" />
            <TextArea value={f.description} onChange={(v) => updateFeature(idx, 'description', v)} placeholder="Description" />
          </>
        )}
      </ArrayEditor>
    </div>
  );
}

function ZPatternForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  const updateItem = (idx: number, field: string, value: string) => {
    const items = [...content.items];
    items[idx] = { ...items[idx], [field]: value };
    onChange({ items });
  };
  const addItem = () => onChange({ items: [...content.items, { imageUrl: '', headline: '', description: '', ctaText: '', ctaLink: '' }] });
  const removeItem = (idx: number) => onChange({ items: content.items.filter((_:any, i:number) => i !== idx) });

  return (
    <ArrayEditor label="Items" items={content.items} onAdd={addItem} onRemove={removeItem}>
      {(item: any, idx: number) => (
        <>
          <ImageInput value={item.imageUrl} onChange={(v) => updateItem(idx, 'imageUrl', v)} />
          <TextInput value={item.headline} onChange={(v) => updateItem(idx, 'headline', v)} placeholder="Headline" />
          <TextArea value={item.description} onChange={(v) => updateItem(idx, 'description', v)} placeholder="Description" />
          <TextInput value={item.ctaText ?? ''} onChange={(v) => updateItem(idx, 'ctaText', v)} placeholder="CTA Text (optional)" />
          <TextInput value={item.ctaLink ?? ''} onChange={(v) => updateItem(idx, 'ctaLink', v)} placeholder="CTA Link (optional)" />
        </>
      )}
    </ArrayEditor>
  );
}

function FPatternForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  const updateItem = (idx: number, field: string, value: string) => {
    const items = [...content.items];
    items[idx] = { ...items[idx], [field]: value };
    onChange({ items });
  };
  const addItem = () => onChange({ items: [...content.items, { title: '', description: '' }] });
  const removeItem = (idx: number) => onChange({ items: content.items.filter((_:any, i:number) => i !== idx) });

  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <Field label="Intro"><TextArea value={content.intro} onChange={(v) => onChange({ intro: v })} /></Field>
      <ArrayEditor label="Items" items={content.items} onAdd={addItem} onRemove={removeItem}>
        {(item: any, idx: number) => (
          <>
            <ImageInput value={item.imageUrl ?? ''} onChange={(v) => updateItem(idx, 'imageUrl', v)} />
            <TextInput value={item.title} onChange={(v) => updateItem(idx, 'title', v)} placeholder="Title" />
            <TextArea value={item.description} onChange={(v) => updateItem(idx, 'description', v)} placeholder="Description" />
          </>
        )}
      </ArrayEditor>
    </div>
  );
}

function InvertedPyramidForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <Field label="Subheadline"><TextInput value={content.subheadline} onChange={(v) => onChange({ subheadline: v })} /></Field>
      <Field label="Description"><TextArea value={content.description} onChange={(v) => onChange({ description: v })} /></Field>
      <Field label="CTA Text"><TextInput value={content.ctaText} onChange={(v) => onChange({ ctaText: v })} /></Field>
      <Field label="CTA Link"><TextInput value={content.ctaLink} onChange={(v) => onChange({ ctaLink: v })} /></Field>
    </div>
  );
}

function CardGridForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  const updateItem = (idx: number, field: string, value: string) => {
    const items = [...content.items];
    items[idx] = { ...items[idx], [field]: value };
    onChange({ items });
  };
  const addItem = () => onChange({ items: [...content.items, { title: '', description: '' }] });
  const removeItem = (idx: number) => onChange({ items: content.items.filter((_:any, i:number) => i !== idx) });

  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <Field label="Subheadline"><TextArea value={content.subheadline} onChange={(v) => onChange({ subheadline: v })} /></Field>
      <ArrayEditor label="Cards" items={content.items} onAdd={addItem} onRemove={removeItem}>
        {(item: any, idx: number) => (
          <>
            <ImageInput value={item.imageUrl ?? ''} onChange={(v) => updateItem(idx, 'imageUrl', v)} />
            <TextInput value={item.title} onChange={(v) => updateItem(idx, 'title', v)} placeholder="Title" />
            <TextArea value={item.description} onChange={(v) => updateItem(idx, 'description', v)} placeholder="Description" />
            <TextInput value={item.link ?? ''} onChange={(v) => updateItem(idx, 'link', v)} placeholder="Link (optional)" />
          </>
        )}
      </ArrayEditor>
    </div>
  );
}

function AlternatingForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  const updateRow = (idx: number, field: string, value: string) => {
    const rows = [...content.rows];
    rows[idx] = { ...rows[idx], [field]: value };
    onChange({ rows });
  };
  const addRow = () => onChange({ rows: [...content.rows, { imageUrl: '', title: '', description: '', imagePosition: 'left' }] });
  const removeRow = (idx: number) => onChange({ rows: content.rows.filter((_:any, i:number) => i !== idx) });

  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <ArrayEditor label="Rows" items={content.rows} onAdd={addRow} onRemove={removeRow}>
        {(row: any, idx: number) => (
          <>
            <ImageInput value={row.imageUrl} onChange={(v) => updateRow(idx, 'imageUrl', v)} />
            <TextInput value={row.title} onChange={(v) => updateRow(idx, 'title', v)} placeholder="Title" />
            <TextArea value={row.description} onChange={(v) => updateRow(idx, 'description', v)} placeholder="Description" />
            <select
              value={row.imagePosition}
              onChange={(e) => updateRow(idx, 'imagePosition', e.target.value)}
              className="w-full h-10 px-3 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-nahkya-gold/50"
            >
              <option value="left">Image Left</option>
              <option value="right">Image Right</option>
            </select>
          </>
        )}
      </ArrayEditor>
    </div>
  );
}

function LongFormSalesForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  const updateFeature = (idx: number, field: string, value: string) => {
    const features = [...content.features];
    features[idx] = { ...features[idx], [field]: value };
    onChange({ features });
  };
  const addFeature = () => onChange({ features: [...content.features, { title: '', description: '' }] });
  const removeFeature = (idx: number) => onChange({ features: content.features.filter((_:any, i:number) => i !== idx) });

  const updateTestimonial = (idx: number, field: string, value: string) => {
    const testimonials = [...content.testimonials];
    testimonials[idx] = { ...testimonials[idx], [field]: value };
    onChange({ testimonials });
  };
  const addTestimonial = () => onChange({ testimonials: [...content.testimonials, { quote: '', author: '' }] });
  const removeTestimonial = (idx: number) => onChange({ testimonials: content.testimonials.filter((_:any, i:number) => i !== idx) });

  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <Field label="Intro"><TextArea value={content.intro} onChange={(v) => onChange({ intro: v })} /></Field>
      <Field label="CTA Text"><TextInput value={content.ctaText} onChange={(v) => onChange({ ctaText: v })} /></Field>
      <Field label="CTA Link"><TextInput value={content.ctaLink} onChange={(v) => onChange({ ctaLink: v })} /></Field>
      <ArrayEditor label="Features" items={content.features} onAdd={addFeature} onRemove={removeFeature}>
        {(f: any, idx: number) => (
          <>
            <TextInput value={f.icon ?? ''} onChange={(v) => updateFeature(idx, 'icon', v)} placeholder="Icon" />
            <TextInput value={f.title} onChange={(v) => updateFeature(idx, 'title', v)} placeholder="Title" />
            <TextArea value={f.description} onChange={(v) => updateFeature(idx, 'description', v)} placeholder="Description" />
          </>
        )}
      </ArrayEditor>
      <ArrayEditor label="Testimonials" items={content.testimonials} onAdd={addTestimonial} onRemove={removeTestimonial}>
        {(t: any, idx: number) => (
          <>
            <TextArea value={t.quote} onChange={(v) => updateTestimonial(idx, 'quote', v)} placeholder="Quote" />
            <TextInput value={t.author} onChange={(v) => updateTestimonial(idx, 'author', v)} placeholder="Author" />
            <TextInput value={t.role ?? ''} onChange={(v) => updateTestimonial(idx, 'role', v)} placeholder="Role (optional)" />
          </>
        )}
      </ArrayEditor>
    </div>
  );
}

function StorytellingScrollForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  const updateStep = (idx: number, field: string, value: string) => {
    const steps = [...content.steps];
    steps[idx] = { ...steps[idx], [field]: field === 'number' ? parseInt(value) || 0 : value };
    onChange({ steps });
  };
  const addStep = () => onChange({ steps: [...content.steps, { number: content.steps.length + 1, title: '', description: '' }] });
  const removeStep = (idx: number) => onChange({ steps: content.steps.filter((_:any, i:number) => i !== idx) });

  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <ArrayEditor label="Steps" items={content.steps} onAdd={addStep} onRemove={removeStep}>
        {(step: any, idx: number) => (
          <>
            <TextInput value={String(step.number)} onChange={(v) => updateStep(idx, 'number', v)} placeholder="Number" />
            <TextInput value={step.title} onChange={(v) => updateStep(idx, 'title', v)} placeholder="Title" />
            <TextArea value={step.description} onChange={(v) => updateStep(idx, 'description', v)} placeholder="Description" />
            <ImageInput value={step.imageUrl ?? ''} onChange={(v) => updateStep(idx, 'imageUrl', v)} />
          </>
        )}
      </ArrayEditor>
    </div>
  );
}

function AsymmetricalEditorialForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <Field label="Subheadline"><TextInput value={content.subheadline} onChange={(v) => onChange({ subheadline: v })} /></Field>
      <Field label="Body"><TextArea value={content.body} onChange={(v) => onChange({ body: v })} rows={6} /></Field>
      <Field label="Featured Image"><ImageInput value={content.featuredImageUrl} onChange={(v) => onChange({ featuredImageUrl: v })} /></Field>
      <Field label="Secondary Image"><ImageInput value={content.secondaryImageUrl ?? ''} onChange={(v) => onChange({ secondaryImageUrl: v })} /></Field>
      <Field label="CTA Text"><TextInput value={content.ctaText ?? ''} onChange={(v) => onChange({ ctaText: v })} /></Field>
      <Field label="CTA Link"><TextInput value={content.ctaLink ?? ''} onChange={(v) => onChange({ ctaLink: v })} /></Field>
    </div>
  );
}

function ProductShowcaseForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  const updateFeature = (idx: number, field: string, value: string) => {
    const features = [...content.features];
    features[idx] = { ...features[idx], [field]: value };
    onChange({ features });
  };
  const addFeature = () => onChange({ features: [...content.features, { title: '', description: '' }] });
  const removeFeature = (idx: number) => onChange({ features: content.features.filter((_:any, i:number) => i !== idx) });

  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <Field label="Subheadline"><TextArea value={content.subheadline} onChange={(v) => onChange({ subheadline: v })} /></Field>
      <Field label="Showcase Image"><ImageInput value={content.showcaseImageUrl} onChange={(v) => onChange({ showcaseImageUrl: v })} /></Field>
      <Field label="CTA Text"><TextInput value={content.ctaText} onChange={(v) => onChange({ ctaText: v })} /></Field>
      <Field label="CTA Link"><TextInput value={content.ctaLink} onChange={(v) => onChange({ ctaLink: v })} /></Field>
      <ArrayEditor label="Features" items={content.features} onAdd={addFeature} onRemove={removeFeature}>
        {(f: any, idx: number) => (
          <>
            <TextInput value={f.icon ?? ''} onChange={(v) => updateFeature(idx, 'icon', v)} placeholder="Icon" />
            <TextInput value={f.title} onChange={(v) => updateFeature(idx, 'title', v)} placeholder="Title" />
            <TextArea value={f.description} onChange={(v) => updateFeature(idx, 'description', v)} placeholder="Description" />
          </>
        )}
      </ArrayEditor>
    </div>
  );
}

function LeadCaptureForm({ content, onChange }: { content: any; onChange: (u: any) => void }) {
  const updateBenefit = (idx: number, field: string, value: string) => {
    const benefits = [...content.benefits];
    benefits[idx] = { ...benefits[idx], [field]: value };
    onChange({ benefits });
  };
  const addBenefit = () => onChange({ benefits: [...content.benefits, { title: '' }] });
  const removeBenefit = (idx: number) => onChange({ benefits: content.benefits.filter((_:any, i:number) => i !== idx) });

  return (
    <div className="space-y-4">
      <Field label="Headline"><TextInput value={content.headline} onChange={(v) => onChange({ headline: v })} /></Field>
      <Field label="Subheadline"><TextArea value={content.subheadline} onChange={(v) => onChange({ subheadline: v })} /></Field>
      <Field label="Input Placeholder"><TextInput value={content.inputPlaceholder} onChange={(v) => onChange({ inputPlaceholder: v })} /></Field>
      <Field label="Button Text"><TextInput value={content.buttonText} onChange={(v) => onChange({ buttonText: v })} /></Field>
      <Field label="Success Message"><TextArea value={content.successMessage} onChange={(v) => onChange({ successMessage: v })} /></Field>
      <ArrayEditor label="Benefits" items={content.benefits} onAdd={addBenefit} onRemove={removeBenefit}>
        {(b: any, idx: number) => (
          <div className="flex items-center gap-2">
            <TextInput value={b.icon ?? ''} onChange={(v) => updateBenefit(idx, 'icon', v)} placeholder="Icon" />
            <TextInput value={b.title} onChange={(v) => updateBenefit(idx, 'title', v)} placeholder="Title" />
          </div>
        )}
      </ArrayEditor>
    </div>
  );
}

// ── Array Editor Helper ──

function ArrayEditor({ label, items, onAdd, onRemove, children }: {
  label: string;
  items: any[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  children: (item: any, idx: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-body text-body-sm font-medium">{label}</Label>
        <button
          onClick={onAdd}
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded-nahkya text-nahkya-gold hover:bg-nahkya-gold-veil"
        >
          +
        </button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="p-3 bg-nahkya-bg rounded-nahkya border border-nahkya-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-mono-xs text-nahkya-text-muted uppercase">{label} {idx + 1}</span>
            <button
              onClick={() => onRemove(idx)}
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-nahkya text-nahkya-text-muted hover:text-nahkya-error hover:bg-nahkya-error-soft"
            >
              <X size={13} />
            </button>
          </div>
          {children(item, idx)}
        </div>
      ))}
    </div>
  );
}
