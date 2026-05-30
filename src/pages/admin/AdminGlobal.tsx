import { useState } from 'react';
import {
  Type, Palette, Ruler, Layers, Box, Check, Copy, Globe, RotateCcw, Save, Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppearanceStore } from '@/stores/appearanceStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { VisualCustomizerTab, type SelectedElement } from '@/components/admin/VisualCustomizerTab';

// ------------------------------------------------------------------
// Token Data
// ------------------------------------------------------------------

const FONT_FAMILIES = [
  { token: 'font-display', name: 'Display', family: 'Playfair Display', purpose: 'Hero headlines, section titles, quotes, display text' },
  { token: 'font-body', name: 'Body', family: 'Lora', purpose: 'Body paragraphs, UI labels, descriptions, form text' },
  { token: 'font-mono', name: 'Mono', family: 'IBM Plex Mono', purpose: 'Eyebrow labels, badges, metadata, data, timestamps' },
];

const FONT_SIZES = [
  { token: 'text-display-xxl', size: '96px', lineHeight: '0.95', tracking: '-0.03em', sample: 'Display XXL', usage: 'Hero headline (desktop)' },
  { token: 'text-display-xl', size: '72px', lineHeight: '0.98', tracking: '-0.02em', sample: 'Display XL', usage: 'Hero headline (tablet)' },
  { token: 'text-display-lg', size: '56px', lineHeight: '1.05', tracking: '-0.02em', sample: 'Display LG', usage: 'Large section headlines' },
  { token: 'text-display-md', size: '40px', lineHeight: '1.1', tracking: '-0.01em', sample: 'Display MD', usage: 'Medium section headlines' },
  { token: 'text-display-sm', size: '32px', lineHeight: '1.15', tracking: '-0.01em', sample: 'Display SM', usage: 'Small headlines, page titles' },
  { token: 'text-display-xs', size: '52px', lineHeight: '1.0', tracking: '-0.02em', sample: 'Display XS', usage: 'Responsive hero (mobile)' },
  { token: 'text-heading-lg', size: '24px', lineHeight: '1.3', tracking: '-', sample: 'Heading LG', usage: 'Card titles, section subheads' },
  { token: 'text-heading-md', size: '20px', lineHeight: '1.35', tracking: '-', sample: 'Heading MD', usage: 'Subsection titles' },
  { token: 'text-heading-sm', size: '28px', lineHeight: '1.2', tracking: '-0.01em', sample: 'Heading SM', usage: 'Editorial headlines' },
  { token: 'text-body-lg', size: '17px', lineHeight: '1.5', tracking: '-', sample: 'Body LG', usage: 'Large body text' },
  { token: 'text-body-md', size: '15px', lineHeight: '1.5', tracking: '-', sample: 'Body MD', usage: 'Standard body text' },
  { token: 'text-mono-lg', size: '13px', lineHeight: '1.4', tracking: '0.08em', sample: 'MONO LG', usage: 'Large labels, timestamps' },
  { token: 'text-mono-md', size: '12px', lineHeight: '1.4', tracking: '0.1em', sample: 'MONO MD', usage: 'Standard labels' },
  { token: 'text-mono-sm', size: '10px', lineHeight: '1.4', tracking: '0.12em', sample: 'MONO SM', usage: 'Small badges, metadata' },
];

const NAHKYA_COLOURS = [
  { token: 'nahkya-ivory', hex: '#F5EDE3', usage: 'Light page background' },
  { token: 'nahkya-cream', hex: '#EDE5DA', usage: 'Admin surface / card' },
  { token: 'nahkya-stone', hex: '#DCC6A1', usage: 'Neutral / disabled surface' },
  { token: 'nahkya-taupe', hex: '#9A8A7A', usage: 'Muted text, borders' },
  { token: 'nahkya-sand', hex: '#B89A7A', usage: 'Borders, dividers' },
  { token: 'nahkya-charcoal', hex: '#2C2420', usage: 'Dark surface / active state' },
  { token: 'nahkya-soft-black', hex: '#1A1A1E', usage: 'Deepest dark background' },
  { token: 'nahkya-gold', hex: '#B88B4A', usage: 'Primary accent, CTAs' },
  { token: 'nahkya-gold-light', hex: '#D4B896', usage: 'Gold hover state' },
  { token: 'nahkya-gold-muted', hex: '#9A7B52', usage: 'Gold subdued' },
  { token: 'nahkya-text-secondary', hex: '#8A7A6E', usage: 'Secondary text' },
  { token: 'nahkya-error', hex: '#DC2626', usage: 'Error states' },
  { token: 'nahkya-success', hex: '#16A34A', usage: 'Success states' },
];

const WORKSPACE_COLOURS = [
  { token: 'workspace-bg', hex: '#0C0C10', usage: 'Dark workspace background' },
  { token: 'workspace-sidebar', hex: '#13131A', usage: 'Dark workspace sidebar' },
  { token: 'workspace-panel', hex: '#1A1A22', usage: 'Dark workspace card' },
  { token: 'workspace-border', hex: '#2A2A35', usage: 'Dark workspace border' },
  { token: 'workspace-hover', hex: '#252530', usage: 'Dark workspace hover' },
];

const SPACING_TOKENS = [
  { token: 'sidebar-member', value: '240px', usage: 'Member sidebar width' },
  { token: 'sidebar-admin', value: '260px', usage: 'Admin sidebar width' },
  { token: 'panel-studio', value: '280px', usage: 'Studio tool panel' },
  { token: 'panel-inspector', value: '330px', usage: 'Inspector panel' },
  { token: 'button-sm', value: '36px', usage: 'Small button height' },
  { token: 'button', value: '44px', usage: 'Standard button height' },
  { token: 'button-lg', value: '52px', usage: 'Large button height' },
  { token: 'nav', value: '72px', usage: 'Public nav height' },
  { token: 'toolbar', value: '74px', usage: 'WYSIWYG toolbar height' },
];

const SURFACE_TOKENS = [
  { token: 'bg-nahkya-ivory', name: 'Ivory', role: 'Light page background', where: 'Public pages, admin layout root' },
  { token: 'bg-nahkya-surface', name: 'Cream', role: 'Admin surface / card', where: 'Admin cards, inputs, tables, panels' },
  { token: 'bg-nahkya-charcoal', name: 'Charcoal', role: 'Dark surface / active', where: 'Dark sections, active states, badges' },
  { token: 'bg-nahkya-stone', name: 'Stone', role: 'Neutral / disabled', where: 'Hover states, toggles off, placeholders' },
  { token: 'bg-workspace-bg', name: 'Workspace BG', role: 'Dark workspace background', where: 'Member area root, studio shell' },
  { token: 'bg-workspace-panel', name: 'Workspace Panel', role: 'Dark workspace card', where: 'Member cards, panels, inputs' },
  { token: 'bg-workspace-hover', name: 'Workspace Hover', role: 'Dark workspace hover', where: 'Sidebar nav hover, small controls' },
];

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-heading-lg text-nahkya-text mb-2">{children}</h3>;
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-body-md text-nahkya-text-muted font-body mb-6">{children}</p>;
}

function TokenCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-workspace-panel border border-workspace-border rounded-nahkya p-5', className)}>
      {children}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="text-nahkya-text-muted hover:text-nahkya-gold transition-colors">
      {copied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
    </button>
  );
}

// ------------------------------------------------------------------
// Typography Tab
// ------------------------------------------------------------------

function TypographyTab() {
  return (
    <div className="space-y-10">
      <div>
        <SectionHeading>Font Families</SectionHeading>
        <SectionDesc>Three typefaces serve distinct roles across the entire experience.</SectionDesc>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FONT_FAMILIES.map((f) => (
            <TokenCard key={f.token}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-mono-sm text-nahkya-text-muted uppercase">{f.token}</span>
                <CopyButton text={f.token} />
              </div>
              <p className={cn('text-display-sm text-nahkya-text mb-2', f.token)}>{f.family}</p>
              <p className="text-body-md text-nahkya-text-muted font-body mb-3">{f.purpose}</p>
              <div className="text-mono-sm text-nahkya-gold uppercase">{f.name}</div>
            </TokenCard>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading>Type Scale</SectionHeading>
        <SectionDesc>Every size is intentional. Display for impact, heading for structure, body for reading, mono for metadata.</SectionDesc>
        <div className="space-y-3">
          {FONT_SIZES.map((fs) => (
            <TokenCard key={fs.token} className="flex items-center gap-6">
              <div className="w-44 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-mono-sm text-nahkya-text-muted">{fs.token}</span>
                  <CopyButton text={fs.token} />
                </div>
                <div className="text-mono-sm text-nahkya-gold">{fs.size} / {fs.lineHeight} / {fs.tracking}</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-nahkya-text', fs.token)}>{fs.sample}</p>
              </div>
              <div className="w-sidebar-member shrink-0 text-right">
                <p className="text-body-md text-nahkya-text-muted font-body">{fs.usage}</p>
              </div>
            </TokenCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Colours Tab
// ------------------------------------------------------------------

function Swatch({ token, hex, usage, isActive, onClick }: {
  token: string; hex: string; usage: string; isActive: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="text-left w-full group">
      <div className={cn(
        'border rounded-nahkya p-3 transition-all',
        isActive ? 'border-nahkya-gold bg-workspace-panel' : 'border-workspace-border bg-workspace-panel hover:border-nahkya-taupe'
      )}>
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-nahkya border border-workspace-border shrink-0"
            style={{ backgroundColor: hex }}
          />
          <div className="min-w-0">
            <p className="text-body-md text-nahkya-text font-body truncate">{token}</p>
            <p className="text-mono-sm text-nahkya-text-muted uppercase">{hex}</p>
          </div>
        </div>
        <p className="text-body-md text-nahkya-text-muted font-body">{usage}</p>
      </div>
    </button>
  );
}

function ColoursTab({ selectedToken, onSelectToken }: {
  selectedToken: string | null;
  onSelectToken: (token: string) => void;
}) {
  const store = useAppearanceStore();

  const editableMap: Record<string, string | undefined> = {
    'nahkya-gold': store.colors.gold,
    'nahkya-gold-light': store.colors.goldLight,
    'nahkya-gold-muted': store.colors.goldMuted,
    'nahkya-charcoal': store.colors.charcoal,
    'nahkya-text-secondary': store.colors.textSecondary,
    'nahkya-ivory': store.colors.ivory,
  };
  return (
    <div className="space-y-10">
      <div>
        <SectionHeading>Brand Palette</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {NAHKYA_COLOURS.map((c) => (
            <Swatch
              key={c.token}
              token={c.token}
              hex={editableMap[c.token] || c.hex}
              usage={c.usage}
              isActive={selectedToken === c.token}
              onClick={() => onSelectToken(c.token)}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionHeading>Workspace Palette</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {WORKSPACE_COLOURS.map((c) => (
            <Swatch
              key={c.token}
              token={c.token}
              hex={c.hex}
              usage={c.usage}
              isActive={selectedToken === c.token}
              onClick={() => onSelectToken(c.token)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


// ------------------------------------------------------------------
// Spacing Tab
// ------------------------------------------------------------------

function SpacingBar({ token, value, usage }: { token: string; value: string; usage: string }) {
  const numeric = parseInt(value);
  const max = 330;
  const pct = Math.min((numeric / max) * 100, 100);

  return (
    <TokenCard className="flex items-center gap-4">
      <div className="w-44 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-mono-sm text-nahkya-text-muted">{token}</span>
          <CopyButton text={token} />
        </div>
        <span className="text-mono-sm text-nahkya-gold">{value}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-6 bg-workspace-hover rounded-nahkya overflow-hidden">
          <div className="h-full bg-nahkya-gold rounded-nahkya transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="w-52 shrink-0 text-right">
        <p className="text-body-md text-nahkya-text-muted font-body">{usage}</p>
      </div>
    </TokenCard>
  );
}

function SpacingTab() {
  return (
    <div className="space-y-10">
      <div>
        <SectionHeading>Design Spacing Tokens</SectionHeading>
        <SectionDesc>Named spacing values used across the application for consistent layout rhythm.</SectionDesc>
        <div className="space-y-3">
          {SPACING_TOKENS.map((s) => (
            <SpacingBar key={s.token} token={s.token} value={s.value} usage={s.usage} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeading>Standard Tailwind Spacing</SectionHeading>
        <SectionDesc>Rem-based spacing for padding, margin, and gap utilities.</SectionDesc>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32].map((n) => (
            <div key={n} className="bg-workspace-panel border border-workspace-border rounded-nahkya p-3 text-center">
              <span className="text-mono-sm text-nahkya-text-muted block">{n}</span>
              <span className="text-body-md text-nahkya-text font-body">{n * 0.25}rem</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Surfaces Tab
// ------------------------------------------------------------------

function SurfacesTab() {
  const store = useAppearanceStore();
  const [previewDark, setPreviewDark] = useState(false);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <SectionHeading>Surface Tokens</SectionHeading>
          <SectionDesc>Background hierarchy from light page surfaces to dark workspace environments.</SectionDesc>
        </div>
        <LuxuryButton variant="ghost" onClick={() => setPreviewDark(!previewDark)}>
          {previewDark ? 'Light Preview' : 'Dark Preview'}
        </LuxuryButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {SURFACE_TOKENS.map((s) => (
          <TokenCard key={s.token} className="overflow-hidden">
            <div className={cn('h-24 rounded-nahkya mb-4 border border-workspace-border', s.token)} />
            <div className="flex items-center justify-between mb-1">
              <span className="text-mono-sm text-nahkya-text-muted">{s.token}</span>
              <CopyButton text={s.token} />
            </div>
            <p className="text-body-md text-nahkya-text font-body mb-1">{s.name}</p>
            <p className="text-body-md text-nahkya-text-muted font-body mb-2">{s.role}</p>
            <p className="text-mono-sm text-nahkya-gold">{s.where}</p>
          </TokenCard>
        ))}
      </div>

      <div>
        <SectionHeading>Surface Hierarchy</SectionHeading>
        <SectionDesc>How backgrounds nest within each other across the application.</SectionDesc>
        <div className={cn('rounded-nahkya border border-workspace-border p-6 transition-colors', previewDark ? 'bg-workspace-bg' : 'bg-nahkya-ivory')}>
          <div className={cn('rounded-nahkya border p-6 mb-4', previewDark ? 'bg-workspace-panel border-workspace-border' : 'bg-nahkya-surface border-nahkya-gold-soft')}>
            <p className={cn('font-display text-heading-md mb-2', previewDark ? 'text-nahkya-text-inverse' : 'text-nahkya-text')}>
              Card Surface
            </p>
            <p className={cn('text-body-md font-body mb-4', previewDark ? 'text-nahkya-text-muted' : 'text-nahkya-text-muted')}>
              Content lives on a card surface, which sits on the page background.
            </p>
            <div className={cn('rounded-nahkya border p-3 text-mono-sm', previewDark ? 'bg-workspace-hover border-workspace-border text-nahkya-text-muted' : 'bg-nahkya-stone border-nahkya-gold-soft text-nahkya-text-muted')}>
              Hover / Active Surface
            </div>
          </div>
          <p className={cn('text-mono-sm', previewDark ? 'text-nahkya-text-muted' : 'text-nahkya-text-muted')}>
            Page Background
          </p>
        </div>
      </div>

      <div>
        <SectionHeading>Dynamic Store Values</SectionHeading>
        <SectionDesc>Live values from the appearance store that can be edited in the inspector panel.</SectionDesc>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { label: 'Gold', value: store.colors.gold },
            { label: 'Gold Light', value: store.colors.goldLight },
            { label: 'Gold Muted', value: store.colors.goldMuted },
            { label: 'Charcoal', value: store.colors.charcoal },
            { label: 'Text Secondary', value: store.colors.textSecondary },
            { label: 'Ivory', value: store.colors.ivory },
          ].map((item) => (
            <div key={item.label} className="bg-workspace-panel border border-workspace-border rounded-nahkya p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-nahkya border border-workspace-border" style={{ backgroundColor: item.value }} />
                <span className="text-mono-sm text-nahkya-text-muted">{item.label}</span>
              </div>
              <p className="text-body-md text-nahkya-text font-body uppercase">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Components Tab
// ------------------------------------------------------------------

function ComponentsTab() {
  const [btnVariant, setBtnVariant] = useState<string>('primary');
  const variants = ['primary', 'secondary', 'ghost', 'dark-primary', 'dark-ghost'] as const;

  return (
    <div className="space-y-10">
      <div>
        <SectionHeading>Buttons</SectionHeading>
        <SectionDesc>LuxuryButton variants for every context — light surfaces, dark surfaces, and inline actions.</SectionDesc>
        <div className="flex flex-wrap gap-3 mb-6">
          {variants.map((v) => (
            <button
              key={v}
              onClick={() => setBtnVariant(v)}
              className={cn(
                'px-4 py-2 text-mono-sm uppercase rounded-nahkya border transition-all',
                btnVariant === v
                  ? 'border-nahkya-gold bg-workspace-panel text-nahkya-gold'
                  : 'border-workspace-border text-nahkya-text-muted hover:border-nahkya-taupe'
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TokenCard className="flex flex-col items-center justify-center gap-4 min-h-40">
            <LuxuryButton variant={btnVariant as never}>
              Primary Action
            </LuxuryButton>
            <span className="text-mono-sm text-nahkya-text-muted">Standard</span>
          </TokenCard>

          <TokenCard className="flex flex-col items-center justify-center gap-4 min-h-40">
            <LuxuryButton variant={btnVariant as never} disabled>
              Disabled
            </LuxuryButton>
            <span className="text-mono-sm text-nahkya-text-muted">Disabled State</span>
          </TokenCard>
        </div>

        <div className="mt-4 p-4 bg-workspace-bg border border-workspace-border rounded-nahkya flex flex-col items-center justify-center gap-4 min-h-40">
          <LuxuryButton variant={btnVariant as never}>
            Dark Surface
          </LuxuryButton>
          <span className="text-mono-sm text-nahkya-text-muted">On dark background</span>
        </div>
      </div>

      <div>
        <SectionHeading>Inputs</SectionHeading>
        <SectionDesc>Form controls on both light and dark surfaces.</SectionDesc>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TokenCard className="space-y-4">
            <p className="text-mono-sm text-nahkya-text-muted uppercase mb-3">Light Surface</p>
            <input
              type="text"
              placeholder="Placeholder text"
              className="w-full h-11 px-4 bg-workspace-bg border border-workspace-border rounded-nahkya text-body-md text-nahkya-text font-body focus:outline-none focus:border-nahkya-gold transition-colors"
            />
            <input
              type="text"
              value="Filled value"
              readOnly
              className="w-full h-11 px-4 bg-workspace-bg border border-workspace-border rounded-nahkya text-body-md text-nahkya-text font-body"
            />
            <input
              type="text"
              disabled
              placeholder="Disabled input"
              className="w-full h-11 px-4 bg-workspace-hover border border-workspace-border rounded-nahkya text-body-md text-nahkya-text-muted font-body cursor-not-allowed"
            />
          </TokenCard>

          <div className="bg-workspace-panel border border-workspace-border rounded-nahkya p-5 space-y-4">
            <p className="text-mono-sm text-nahkya-text-muted uppercase mb-3">Dark Surface</p>
            <input
              type="text"
              placeholder="Placeholder text"
              className="w-full h-11 px-4 bg-workspace-bg border border-workspace-border rounded-nahkya text-body-md text-nahkya-text font-body focus:outline-none focus:border-nahkya-gold transition-colors"
            />
            <input
              type="text"
              value="Filled value"
              readOnly
              className="w-full h-11 px-4 bg-workspace-bg border border-workspace-border rounded-nahkya text-body-md text-nahkya-text font-body"
            />
            <input
              type="text"
              disabled
              placeholder="Disabled input"
              className="w-full h-11 px-4 bg-workspace-hover border border-workspace-border rounded-nahkya text-body-md text-nahkya-text-muted font-body cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div>
        <SectionHeading>Cards &amp; Panels</SectionHeading>
        <SectionDesc>Surface containers for grouping content.</SectionDesc>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TokenCard>
            <p className="text-mono-sm text-nahkya-text-muted uppercase mb-2">Standard Card</p>
            <p className="font-display text-heading-md text-nahkya-text mb-2">Title</p>
            <p className="text-body-md text-nahkya-text-muted font-body">Description text on a dark surface.</p>
          </TokenCard>

          <TokenCard className="bg-workspace-bg border-workspace-border">
            <p className="text-mono-sm text-nahkya-text-muted uppercase mb-2">Deep Card</p>
            <p className="font-display text-heading-md text-nahkya-text mb-2">Title</p>
            <p className="text-body-md text-nahkya-text-muted font-body">Description on the deepest dark surface.</p>
          </TokenCard>

          <TokenCard>
            <div className="h-2 bg-nahkya-gold rounded-full mb-3" />
            <p className="text-mono-sm text-nahkya-text-muted uppercase mb-2">Accent Card</p>
            <p className="font-display text-heading-md text-nahkya-text mb-2">Highlighted</p>
            <p className="text-body-md text-nahkya-text-muted font-body">Card with a gold accent strip.</p>
          </TokenCard>
        </div>
      </div>

      <div>
        <SectionHeading>Badges &amp; Labels</SectionHeading>
        <SectionDesc>Small status and category indicators.</SectionDesc>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-nahkya-gold/10 border border-nahkya-gold/30 rounded-nahkya text-mono-sm text-nahkya-gold uppercase">
            Active
          </span>
          <span className="inline-flex items-center px-3 py-1 bg-workspace-hover border border-workspace-border rounded-nahkya text-mono-sm text-nahkya-text-muted uppercase">
            Inactive
          </span>
          <span className="inline-flex items-center px-3 py-1 bg-nahkya-error/10 border border-nahkya-error/30 rounded-nahkya text-mono-sm text-nahkya-error uppercase">
            Error
          </span>
          <span className="inline-flex items-center px-3 py-1 bg-nahkya-success/10 border border-nahkya-success/30 rounded-nahkya text-mono-sm text-nahkya-success uppercase">
            Success
          </span>
          <span className="inline-flex items-center px-3 py-1 bg-workspace-panel border border-workspace-border rounded-nahkya text-mono-sm text-nahkya-text-muted uppercase">
            Dark
          </span>
        </div>
      </div>

      <div>
        <SectionHeading>Typography in Context</SectionHeading>
        <SectionDesc>Real-world usage patterns combining font families and sizes.</SectionDesc>
        <div className="space-y-6">
          <div className="bg-workspace-panel border border-workspace-border rounded-nahkya p-6">
            <span className="text-mono-md text-nahkya-gold uppercase block mb-3">Collection</span>
            <h1 className="font-display text-display-md text-nahkya-text mb-4">The Silk Collection</h1>
            <p className="text-body-lg text-nahkya-text-muted font-body max-w-prose">
              Hand-woven silk scarves crafted in limited editions. Each piece tells a story of heritage and modern elegance.
            </p>
          </div>

          <div className="bg-workspace-bg border border-workspace-border rounded-nahkya p-6">
            <span className="text-mono-md text-nahkya-gold uppercase block mb-3">Dashboard</span>
            <h1 className="font-display text-display-sm text-nahkya-text mb-4">Design System</h1>
            <p className="text-body-md text-nahkya-text-muted font-body max-w-prose">
              Monitor and edit the global design tokens that power every surface across the application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ------------------------------------------------------------------
// Inspector Panel
// ------------------------------------------------------------------

function Inspector({ selectedToken, selectedElement }: { selectedToken: string | null; selectedElement: SelectedElement | null }) {
  const store = useAppearanceStore();
  const editableKeys = ['gold', 'goldLight', 'goldMuted', 'charcoal', 'textSecondary', 'ivory'];
  const [hexInput, setHexInput] = useState('');

  const tokenKey = selectedToken?.replace('nahkya-', '');
  const isEditable = tokenKey ? editableKeys.includes(tokenKey) : false;
  const currentValue = tokenKey ? store.colors[tokenKey as keyof typeof store.colors] : undefined;

  const handleSave = () => {
    if (tokenKey && isEditable) {
      store.updateColor(tokenKey, hexInput);
    }
  };

  const getTokenValue = (name: string) => {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue(`--${name}`).trim();
  };

  const setTokenValue = (name: string, value: string) => {
    store.setToken(name, value);
  };

  return (
    <aside className="w-panel-inspector shrink-0 h-full bg-workspace-panel border-l border-workspace-border overflow-auto workspace-scroll">
      {/* Header */}
      <div className="p-6 border-b border-workspace-border">
        <div className="text-mono-sm text-nahkya-text-muted uppercase">Context Panel</div>
        <h2 className="font-display text-heading-lg mt-2 text-nahkya-text">Inspector</h2>
        <p className="text-sm text-nahkya-text-muted mt-2 font-body">
          {selectedElement ? 'Edit the tokens for the selected element.' : 'Edit brand colours and view selected token details.'}
        </p>
      </div>

      {/* Selected Element from Visual Tab */}
      {selectedElement && (
        <div className="p-6 border-b border-workspace-border space-y-6">
          <div className="text-mono-sm text-nahkya-text-muted uppercase">Selected Element</div>
          <div className="bg-workspace-bg border border-workspace-border rounded-nahkya p-4">
            <p className="text-body-md text-nahkya-text font-body">{selectedElement.label}</p>
          </div>

          {selectedElement.tokens.map((t) => {
            const current = getTokenValue(t.name);
            if (t.type === 'color') {
              return (
                <div key={t.name} className="space-y-2">
                  <label className="text-mono-sm text-nahkya-text-muted uppercase block">{t.name}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={current || '#000000'}
                      onChange={(e) => setTokenValue(t.name, e.target.value)}
                      className="w-10 h-10 rounded-nahkya border border-workspace-border cursor-pointer bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={current}
                      onChange={(e) => setTokenValue(t.name, e.target.value)}
                      className="flex-1 h-10 px-3 bg-workspace-bg border border-workspace-border rounded-nahkya text-body-md text-nahkya-text font-body focus:outline-none focus:border-nahkya-gold transition-colors uppercase"
                    />
                  </div>
                </div>
              );
            }
            if (t.type === 'text') {
              const sizes = ['font-display-xxl', 'font-display-xl', 'font-display-lg', 'font-display-md', 'font-display-sm', 'font-heading-lg', 'font-heading-md', 'font-heading-sm', 'font-body-lg', 'font-body-md', 'font-body-sm', 'font-mono-lg', 'font-mono-md', 'font-mono-sm'];
              return (
                <div key={t.name} className="space-y-2">
                  <label className="text-mono-sm text-nahkya-text-muted uppercase block">{t.name}</label>
                  <select
                    value={current}
                    onChange={(e) => setTokenValue(t.name, e.target.value)}
                    className="w-full h-10 px-3 bg-workspace-bg border border-workspace-border rounded-nahkya text-body-md text-nahkya-text font-body focus:outline-none focus:border-nahkya-gold"
                  >
                    {sizes.map((s) => (
                      <option key={s} value={getTokenValue(s) || '1rem'}>{s}</option>
                    ))}
                  </select>
                </div>
              );
            }
            if (t.type === 'font') {
              const families = [
                { name: 'font-display', value: '"Playfair Display", serif' },
                { name: 'font-body', value: 'Lora, serif' },
                { name: 'font-mono', value: '"IBM Plex Mono", monospace' },
              ];
              return (
                <div key={t.name} className="space-y-2">
                  <label className="text-mono-sm text-nahkya-text-muted uppercase block">{t.name}</label>
                  <select
                    value={current}
                    onChange={(e) => setTokenValue(t.name, e.target.value)}
                    className="w-full h-10 px-3 bg-workspace-bg border border-workspace-border rounded-nahkya text-body-md text-nahkya-text font-body focus:outline-none focus:border-nahkya-gold"
                  >
                    {families.map((f) => (
                      <option key={f.name} value={f.value}>{f.name}</option>
                    ))}
                  </select>
                </div>
              );
            }
            return (
              <div key={t.name} className="space-y-2">
                <label className="text-mono-sm text-nahkya-text-muted uppercase block">{t.name}</label>
                <input
                  type="text"
                  value={current}
                  onChange={(e) => setTokenValue(t.name, e.target.value)}
                  className="w-full h-10 px-3 bg-workspace-bg border border-workspace-border rounded-nahkya text-body-md text-nahkya-text font-body focus:outline-none focus:border-nahkya-gold transition-colors"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Token from Colour Tab */}
      {selectedToken && isEditable && (
        <div className="p-6 border-b border-workspace-border space-y-4">
          <div className="text-mono-sm text-nahkya-text-muted uppercase">Selected Token</div>
          <div className="bg-workspace-bg border border-workspace-border rounded-nahkya p-4">
            <p className="text-body-md text-nahkya-text font-body mb-1">{selectedToken}</p>
            <p className="text-mono-sm text-nahkya-gold uppercase">{currentValue}</p>
          </div>
          <div>
            <label className="text-mono-sm text-nahkya-text-muted uppercase block mb-2">New Hex Value</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hexInput || (currentValue as string) || '#000000'}
                onChange={(e) => setHexInput(e.target.value)}
                className="w-10 h-10 rounded-nahkya border border-workspace-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={hexInput || (currentValue as string) || ''}
                onChange={(e) => setHexInput(e.target.value)}
                className="flex-1 h-10 px-3 bg-workspace-bg border border-workspace-border rounded-nahkya text-body-md text-nahkya-text font-body focus:outline-none focus:border-nahkya-gold transition-colors uppercase"
              />
            </div>
          </div>
          <LuxuryButton variant="primary" className="w-full" onClick={handleSave}>
            Save Change
          </LuxuryButton>
        </div>
      )}

      {selectedToken && !isEditable && (
        <div className="p-6 border-b border-workspace-border">
          <div className="text-mono-sm text-nahkya-text-muted uppercase mb-2">Selected Token</div>
          <p className="text-body-md text-nahkya-text font-body">{selectedToken}</p>
          <p className="text-sm text-nahkya-text-muted font-body mt-2">This token is not editable via the store.</p>
        </div>
      )}

      {/* Brand Colours */}
      <div className="p-6 space-y-4">
        <div className="text-mono-sm text-nahkya-text-muted uppercase">Brand Colours</div>
        {Object.entries(store.colors).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-nahkya-text font-body">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={value}
                onChange={(e) => store.updateColor(key, e.target.value)}
                className="w-8 h-8 rounded-nahkya border border-workspace-border cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => store.updateColor(key, e.target.value)}
                className="w-20 bg-workspace-bg border border-workspace-border text-nahkya-text font-mono text-mono-sm px-2 py-1 rounded-nahkya focus:outline-none focus:border-nahkya-gold"
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ------------------------------------------------------------------
// Main Page
// ------------------------------------------------------------------

export default function AdminGlobal() {
  const store = useAppearanceStore();
  const [activeTab, setActiveTab] = useState('typography');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    store.reset();
    setSelectedToken(null);
  };

  const handleSelectToken = (token: string) => {
    setSelectedToken(token);
    setSelectedElement(null);
    const key = token.replace('nahkya-', '');
    const value = store.colors[key as keyof typeof store.colors];
    if (value) {
      // hexInput is managed inside Inspector, so we just trigger re-selection
    }
  };

  const handleSelectElement = (el: SelectedElement | null) => {
    setSelectedElement(el);
    setSelectedToken(null);
  };

  return (
    <div className="min-h-screen bg-workspace-bg text-nahkya-text flex flex-col">
      <AdminTopBar
        icon={<Globe size={17} strokeWidth={1.5} />}
        label="Global Site"

        actions={
          <>
            <LuxuryButton variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw size={15} strokeWidth={1.5} className="mr-1.5" /> Reset
            </LuxuryButton>
            <LuxuryButton variant="primary" size="sm" onClick={handleSave}>
              <Save size={15} strokeWidth={1.5} className="mr-1.5" /> {saved ? 'Saved!' : 'Save'}
            </LuxuryButton>
          </>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-workspace-panel border border-workspace-border rounded-nahkya p-1 mb-8 h-auto flex-wrap gap-1">
              <TabsTrigger
                value="typography"
                className="font-body text-sm data-[state=active]:bg-nahkya-burgundy data-[state=active]:text-nahkya-text-inverse text-nahkya-text-muted rounded-nahkya px-4 py-2 flex items-center gap-2"
              >
                <Type size={14} strokeWidth={1.5} />
                Typography
              </TabsTrigger>
              <TabsTrigger
                value="colours"
                className="font-body text-sm data-[state=active]:bg-nahkya-burgundy data-[state=active]:text-nahkya-text-inverse text-nahkya-text-muted rounded-nahkya px-4 py-2 flex items-center gap-2"
              >
                <Palette size={14} strokeWidth={1.5} />
                Colours
              </TabsTrigger>
              <TabsTrigger
                value="spacing"
                className="font-body text-sm data-[state=active]:bg-nahkya-burgundy data-[state=active]:text-nahkya-text-inverse text-nahkya-text-muted rounded-nahkya px-4 py-2 flex items-center gap-2"
              >
                <Ruler size={14} strokeWidth={1.5} />
                Spacing
              </TabsTrigger>
              <TabsTrigger
                value="surfaces"
                className="font-body text-sm data-[state=active]:bg-nahkya-burgundy data-[state=active]:text-nahkya-text-inverse text-nahkya-text-muted rounded-nahkya px-4 py-2 flex items-center gap-2"
              >
                <Layers size={14} strokeWidth={1.5} />
                Surfaces
              </TabsTrigger>
              <TabsTrigger
                value="components"
                className="font-body text-sm data-[state=active]:bg-nahkya-burgundy data-[state=active]:text-nahkya-text-inverse text-nahkya-text-muted rounded-nahkya px-4 py-2 flex items-center gap-2"
              >
                <Box size={14} strokeWidth={1.5} />
                Components
              </TabsTrigger>
              <TabsTrigger
                value="visual"
                className="font-body text-sm data-[state=active]:bg-nahkya-burgundy data-[state=active]:text-nahkya-text-inverse text-nahkya-text-muted rounded-nahkya px-4 py-2 flex items-center gap-2"
              >
                <Eye size={14} strokeWidth={1.5} />
                Visual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="typography">
              <TypographyTab />
            </TabsContent>

            <TabsContent value="colours">
              <ColoursTab selectedToken={selectedToken} onSelectToken={handleSelectToken} />
            </TabsContent>

            <TabsContent value="spacing">
              <SpacingTab />
            </TabsContent>

            <TabsContent value="surfaces">
              <SurfacesTab />
            </TabsContent>

            <TabsContent value="components">
              <ComponentsTab />
            </TabsContent>

            <TabsContent value="visual">
              <VisualCustomizerTab selectedElement={selectedElement} onSelectElement={handleSelectElement} />
            </TabsContent>
          </Tabs>
        </main>

        <Inspector selectedToken={selectedToken} selectedElement={selectedElement} />
      </div>
    </div>
  );
}
