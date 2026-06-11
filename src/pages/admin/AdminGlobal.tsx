import { useState } from 'react';
import {
  Globe, Copy, Check, Type, Ruler, Box, FlipHorizontal,
  ArrowUpDown, Component, Palette, Smartphone,
  Sun, Moon, CheckCircle2, Image, LayoutDashboard,
  Star, Clock, DollarSign,
} from 'lucide-react';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import { AtelierButton } from '@/components/shared/AtelierButton';
import { AtelierCard } from '@/components/shared/AtelierCard';
import { AtelierBadge } from '@/components/shared/AtelierBadge';
import { AtelierAlert } from '@/components/shared/AtelierAlert';
import { AtelierTable } from '@/components/shared/AtelierTable';
import { AtelierEmptyState } from '@/components/shared/AtelierEmptyState';
import { AtelierDashboardWidget } from '@/components/shared/AtelierDashboardWidget';
import { AtelierTabs, AtelierTabsList, AtelierTabsTrigger, AtelierTabsContent } from '@/components/shared/AtelierTabs';
import { AtelierUploadZone } from '@/components/shared/AtelierUploadZone';
import { AtelierStepNav } from '@/components/shared/AtelierStepNav';
import { AtelierSearchBar } from '@/components/shared/AtelierSearchBar';

/* ── Token Data ── */

interface ColorToken {
  name: string;
  class: string;
  textClass: string;
  usage: string[];
  preview: 'page' | 'card' | 'text' | 'border' | 'status' | 'button';
}

const COLOR_TOKENS: { category: string; tokens: ColorToken[] }[] = [
  {
    category: 'Surfaces',
    tokens: [
      { name: 'nahkya-bg', class: 'bg-nahkya-bg', textClass: 'text-nahkya-text', usage: ['Page backgrounds'], preview: 'page' },
      { name: 'nahkya-surface', class: 'bg-nahkya-surface', textClass: 'text-nahkya-text', usage: ['Cards', 'Panels', 'Inputs'], preview: 'card' },
      { name: 'nahkya-surface-raised', class: 'bg-nahkya-surface-raised', textClass: 'text-nahkya-text', usage: ['Modals', 'Dropdowns', 'Elevated cards'], preview: 'card' },
    ],
  },
  {
    category: 'Text',
    tokens: [
      { name: 'nahkya-text', class: 'bg-nahkya-text', textClass: 'text-nahkya-inverse', usage: ['Primary body text', 'Headlines'], preview: 'text' },
      { name: 'nahkya-text-secondary', class: 'bg-nahkya-text-secondary', textClass: 'text-nahkya-inverse', usage: ['Secondary text', 'Hints', 'Placeholders'], preview: 'text' },
      { name: 'nahkya-inverse', class: 'bg-nahkya-inverse', textClass: 'text-nahkya-text', usage: ['Text on dark surfaces'], preview: 'text' },
      { name: 'nahkya-muted', class: 'bg-nahkya-muted', textClass: 'text-nahkya-inverse', usage: ['Disabled labels', 'Tertiary text'], preview: 'text' },
    ],
  },
  {
    category: 'Brand',
    tokens: [
      { name: 'nahkya-accent', class: 'bg-nahkya-accent', textClass: 'text-nahkya-inverse', usage: ['Primary actions', 'Active states', 'CTAs'], preview: 'button' },
      { name: 'nahkya-accent-hover', class: 'bg-nahkya-accent-hover', textClass: 'text-nahkya-inverse', usage: ['Accent hover state'], preview: 'button' },
      { name: 'nahkya-accent-active', class: 'bg-nahkya-accent-active', textClass: 'text-nahkya-inverse', usage: ['Accent active state'], preview: 'button' },
      { name: 'nahkya-accent-subtle', class: 'bg-nahkya-accent-subtle', textClass: 'text-nahkya-text', usage: ['Hover backgrounds', 'Soft highlights'], preview: 'card' },
    ],
  },
  {
    category: 'Highlight',
    tokens: [
      { name: 'nahkya-highlight', class: 'bg-nahkya-highlight', textClass: 'text-nahkya-text', usage: ['Secondary buttons', 'Focus rings', 'Decorative accents'], preview: 'button' },
      { name: 'nahkya-highlight-hover', class: 'bg-nahkya-highlight-hover', textClass: 'text-nahkya-text', usage: ['Highlight hover state'], preview: 'button' },
      { name: 'nahkya-highlight-subtle', class: 'bg-nahkya-highlight-subtle', textClass: 'text-nahkya-text', usage: ['Subtle gold backgrounds'], preview: 'card' },
    ],
  },
  {
    category: 'Semantic',
    tokens: [
      { name: 'nahkya-success', class: 'bg-nahkya-success', textClass: 'text-nahkya-inverse', usage: ['Success states', 'Approved badges'], preview: 'status' },
      { name: 'nahkya-success-subtle', class: 'bg-nahkya-success-subtle', textClass: 'text-nahkya-text', usage: ['Success backgrounds'], preview: 'card' },
      { name: 'nahkya-error', class: 'bg-nahkya-error', textClass: 'text-nahkya-inverse', usage: ['Errors', 'Destructive actions'], preview: 'status' },
      { name: 'nahkya-error-subtle', class: 'bg-nahkya-error-subtle', textClass: 'text-nahkya-text', usage: ['Error backgrounds'], preview: 'card' },
      { name: 'nahkya-warning', class: 'bg-nahkya-warning', textClass: 'text-nahkya-text', usage: ['Warnings', 'Pending states'], preview: 'status' },
      { name: 'nahkya-warning-subtle', class: 'bg-nahkya-warning-subtle', textClass: 'text-nahkya-text', usage: ['Warning backgrounds'], preview: 'card' },
      { name: 'nahkya-info', class: 'bg-nahkya-info', textClass: 'text-nahkya-inverse', usage: ['Info states', 'Tips'], preview: 'status' },
      { name: 'nahkya-info-subtle', class: 'bg-nahkya-info-subtle', textClass: 'text-nahkya-text', usage: ['Info backgrounds'], preview: 'card' },
    ],
  },
  {
    category: 'Border & Disabled',
    tokens: [
      { name: 'nahkya-border', class: 'bg-nahkya-border', textClass: 'text-nahkya-text', usage: ['Borders', 'Dividers'], preview: 'border' },
      { name: 'nahkya-disabled', class: 'bg-nahkya-disabled', textClass: 'text-nahkya-text', usage: ['Disabled elements'], preview: 'card' },
      { name: 'nahkya-disabled-text', class: 'bg-nahkya-disabled-text', textClass: 'text-nahkya-inverse', usage: ['Disabled text'], preview: 'text' },
    ],
  },
];

const TYPOGRAPHY_TOKENS = [
  { category: 'Display', tokens: [
    { name: 'text-display-xl', sample: 'Silk Heritage', size: 'clamp(2.25rem, 1.5rem + 4vw, 6rem)' },
    { name: 'text-display-lg', sample: 'The Atelier', size: 'clamp(2rem, 1.4rem + 3vw, 4.5rem)' },
    { name: 'text-display-md', sample: 'By Nahkya', size: 'clamp(1.75rem, 1.3rem + 2.25vw, 3.5rem)' },
    { name: 'text-display-sm', sample: 'Saved Designs', size: 'clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem)' },
  ]},
  { category: 'Heading', tokens: [
    { name: 'text-heading-lg', sample: 'Design Overview', size: 'clamp(1.375rem, 1.1rem + 1.38vw, 2.5rem)' },
    { name: 'text-heading-md', sample: 'Layer Controls', size: 'clamp(1.125rem, 1rem + 0.5vw, 1.5rem)' },
    { name: 'text-heading-sm', sample: 'Form Labels', size: 'clamp(1rem, 0.95rem + 0.25vw, 1.25rem)' },
  ]},
  { category: 'Body', tokens: [
    { name: 'text-body-lg', sample: 'The quick brown fox jumps over the lazy dog.', size: 'clamp(1.0625rem, 0.95rem + 0.5vw, 1.25rem)' },
    { name: 'text-body-md', sample: 'Your atelier creations.', size: '1rem (16px)' },
    { name: 'text-body-sm', sample: 'Select a layer, then choose a colour.', size: '0.875rem (14px)' },
    { name: 'text-body-xs', sample: '70 × 70 cm', size: '0.75rem (12px)' },
  ]},
  { category: 'Mono', tokens: [
    { name: 'text-mono-lg', sample: 'ATELIER', size: '0.8125rem (13px)' },
    { name: 'text-mono-md', sample: 'BND 180.00', size: '0.75rem (12px)' },
    { name: 'text-mono-sm', sample: 'PENDING', size: '0.625rem (10px)' },
  ]},
];

const SPACING_TOKENS = [
  { name: 'space-xs', value: '4px', usage: ['Tight gaps', 'Icon padding'] },
  { name: 'space-sm', value: '8px', usage: ['Component gaps', 'Small buttons'] },
  { name: 'space-md', value: '12px', usage: ['Button icon gaps'] },
  { name: 'space-lg', value: '16px', usage: ['Card padding', 'Form gaps'] },
  { name: 'space-xl', value: '24px', usage: ['Section padding'] },
  { name: 'space-2xl', value: '32px', usage: ['Major separations'] },
  { name: 'space-3xl', value: '48px', usage: ['Desktop sections'] },
  { name: 'sidebar-expanded', value: '280px', usage: ['Expanded sidebar width'] },
  { name: 'sidebar-collapsed', value: '64px', usage: ['Collapsed sidebar width'] },
  { name: 'h-toolbar', value: '74px', usage: ['Toolbar / top bar height'] },
  { name: 'h-nav', value: '72px', usage: ['Navigation height'] },
];

const SHADOW_TOKENS = [
  { name: 'shadow-sm', usage: ['Subtle elevation', 'Inset panels'] },
  { name: 'shadow-md', usage: ['Cards', 'Dropdowns'] },
  { name: 'shadow-lg', usage: ['Modals', 'Floating panels'] },
  { name: 'shadow-xl', usage: ['Full-screen overlays'] },
  { name: 'shadow-focus', usage: ['Focus rings'] },
  { name: 'shadow-card', usage: ['Elevated cards'] },
];

const RADIUS_TOKENS = [
  { name: 'rounded-nahkya', value: '2px', usage: ['Cards', 'Buttons', 'Inputs'] },
  { name: 'rounded-nahkya-sm', value: '4px', usage: ['Small elements', 'Tags'] },
  { name: 'rounded-nahkya-md', value: '8px', usage: ['Medium panels'] },
  { name: 'rounded-nahkya-lg', value: '12px', usage: ['Large cards', 'Dialogs'] },
  { name: 'rounded-nahkya-xl', value: '16px', usage: ['Hero images'] },
  { name: 'rounded-pill', value: '9999px', usage: ['Pill buttons', 'Badges'] },
];

const ZINDEX_TOKENS = [
  { name: 'z-behind', value: '-10' },
  { name: 'z-content', value: '10' },
  { name: 'z-dropdown', value: '20' },
  { name: 'z-toolbar', value: '30' },
  { name: 'z-nav', value: '50' },
  { name: 'z-modal', value: '60' },
  { name: 'z-toast', value: '80' },
  { name: 'z-loading', value: '100' },
];

const BREAKPOINT_TOKENS = [
  { name: 'xs', value: '320px' },
  { name: 'phone', value: '480px' },
  { name: 'md', value: '768px' },
  { name: 'lg', value: '1024px' },
  { name: 'xl', value: '1280px' },
  { name: '2xl', value: '1440px' },
  { name: 'wide', value: '1536px' },
];

/* ── Copy Helper ── */

function CopyToken({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} type="button" className="flex items-center gap-1.5 text-nahkya-text-secondary hover:text-nahkya-highlight transition-colors group/copy">
      {copied ? <Check size={12} /> : <Copy size={12} className="group-hover/copy:text-nahkya-highlight" />}
      <span className="font-mono text-mono-sm">{token}</span>
    </button>
  );
}

/* ── Preview Helpers ── */

function ColorPreview({ type, colorClass }: { type: ColorToken['preview']; colorClass: string }) {
  switch (type) {
    case 'page':
      return <div className={cn('w-full h-16 rounded-nahkya border border-nahkya-border overflow-hidden relative', colorClass)}><div className="absolute top-2 left-2 right-2 h-2 bg-current opacity-10 rounded-nahkya" /></div>;
    case 'card':
      return <div className={cn('w-full h-16 rounded-nahkya border border-nahkya-border p-2', colorClass)}><div className="w-full h-1.5 bg-current opacity-10 rounded-nahkya mb-1" /><div className="w-2/3 h-1.5 bg-current opacity-10 rounded-nahkya" /></div>;
    case 'button':
      return <div className="w-full h-16 rounded-nahkya border border-nahkya-border bg-nahkya-bg flex items-center justify-center p-2"><div className={cn('px-4 py-1.5 rounded-nahkya text-xs font-mono', colorClass, 'text-nahkya-inverse')}>Button</div></div>;
    case 'text':
      return <div className="w-full h-16 rounded-nahkya border border-nahkya-border bg-nahkya-bg flex items-center justify-center p-2"><span className={cn('text-sm font-body', colorClass)}>Aa</span></div>;
    case 'border':
      return <div className="w-full h-16 rounded-nahkya border border-nahkya-border bg-nahkya-bg flex items-center justify-center p-2"><div className={cn('w-full h-px', colorClass)} /></div>;
    case 'status':
      return <div className="w-full h-16 rounded-nahkya border border-nahkya-border bg-nahkya-bg flex items-center justify-center p-2"><span className={cn('px-2 py-0.5 rounded-nahkya text-xs font-mono', colorClass, 'text-nahkya-inverse')}>Status</span></div>;
    default:
      return <div className={cn('w-full h-16 rounded-nahkya', colorClass)} />;
  }
}

/* ── Section Wrapper ── */

function TokenSection({ title, icon, id, children }: { title: string; icon?: React.ReactNode; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-5">
      <h2 className="font-display text-heading-sm font-medium text-nahkya-text border-b border-nahkya-border pb-3 flex items-center gap-2">
        {icon && <span className="text-nahkya-highlight">{icon}</span>}
        {title}
      </h2>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

/* ── Main Page ── */

export default function AdminGlobal() {
  const { theme, toggle } = useThemeStore();
  const [search, setSearch] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [demoStep, setDemoStep] = useState(2);

  return (
    <div className="flex flex-col h-full bg-nahkya-bg">
      <AdminTopBar
        icon={<Globe size={17} strokeWidth={1.5} />}
        label="Atelier Design System"
        hint="Absolute truth for CSS tokens & components"
        actions={
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-[var(--radius-md)] border border-nahkya-border flex items-center justify-center text-nahkya-text-secondary hover:text-nahkya-accent hover:bg-nahkya-accent-subtle transition-colors"
            title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
          >
            {theme === 'light' ? <Moon size={16} strokeWidth={1.5} /> : <Sun size={16} strokeWidth={1.5} />}
          </button>
        }
      />

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto p-8 space-y-16">

          {/* ── Hero ── */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-nahkya-surface-raised border border-nahkya-border rounded-pill text-body-xs text-nahkya-text-secondary mb-4">
              <span className="w-2 h-2 rounded-full bg-nahkya-success" />
              All tokens verified — build passes
            </div>
            <h1 className="font-display text-display-sm text-nahkya-text font-medium">Atelier Design System</h1>
            <p className="text-body-md text-nahkya-text-secondary mt-2 max-w-lg mx-auto">
              The single source of truth for colours, typography, spacing, shadows, and every UI component. Toggle dark mode above to verify both themes.
            </p>
          </div>

          {/* ── Colours ── */}
          <TokenSection title="Colours" icon={<Palette size={16} strokeWidth={1.5} />} id="colours">
            {COLOR_TOKENS.map((group) => (
              <div key={group.category} className="space-y-4">
                <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">{group.category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.tokens.map((t) => (
                    <div key={t.name} className="rounded-nahkya border border-nahkya-border overflow-hidden group hover:ring-1 hover:ring-nahkya-highlight/40 transition-all bg-nahkya-surface">
                      <ColorPreview type={t.preview} colorClass={t.class} />
                      <div className="p-3 space-y-2">
                        <CopyToken token={t.name} />
                        <div className="flex flex-wrap gap-1">
                          {t.usage.map((u) => (
                            <span key={u} className="font-body text-body-3xs text-nahkya-text-secondary bg-nahkya-bg px-1.5 py-0.5 rounded-nahkya border border-nahkya-border">{u}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TokenSection>

          {/* ── Typography ── */}
          <TokenSection title="Typography" icon={<Type size={16} strokeWidth={1.5} />} id="typography">
            {TYPOGRAPHY_TOKENS.map((group) => (
              <div key={group.category} className="space-y-3">
                <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">{group.category}</h3>
                <div className="space-y-3">
                  {group.tokens.map((t) => (
                    <div key={t.name} className="flex items-start gap-4 p-4 bg-nahkya-surface rounded-nahkya border border-nahkya-border group hover:border-nahkya-highlight/30 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className={cn(t.name, 'truncate mb-2')}>{t.sample}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <CopyToken token={t.name} />
                        <span className="font-mono text-mono-sm text-nahkya-text-secondary">{t.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-4 bg-nahkya-surface rounded-nahkya border border-nahkya-border space-y-3">
              <h4 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase">Font Families</h4>
              <div className="space-y-3">
                {[
                  { label: 'font-display', sample: 'Playfair Display', cls: 'font-display text-display-sm' },
                  { label: 'font-body', sample: 'Inter', cls: 'font-body text-body-lg' },
                  { label: 'font-mono', sample: 'Fira Code', cls: 'font-mono text-mono-lg' },
                ].map((f) => (
                  <div key={f.label} className="flex items-start justify-between gap-4">
                    <span className={f.cls}>{f.sample}</span>
                    <CopyToken token={f.label} />
                  </div>
                ))}
              </div>
            </div>
          </TokenSection>

          {/* ── Spacing ── */}
          <TokenSection title="Spacing" icon={<Ruler size={16} strokeWidth={1.5} />} id="spacing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPACING_TOKENS.map((t) => (
                <div key={t.name} className="flex items-center justify-between p-4 bg-nahkya-surface rounded-nahkya border border-nahkya-border group hover:border-nahkya-highlight/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <CopyToken token={t.name} />
                    <div className="flex flex-wrap gap-1">
                      {t.usage.map((u) => (
                        <span key={u} className="font-body text-body-3xs text-nahkya-text-secondary bg-nahkya-bg px-1.5 py-0.5 rounded-nahkya border border-nahkya-border">{u}</span>
                      ))}
                    </div>
                  </div>
                  <span className="font-mono text-mono-lg text-nahkya-highlight">{t.value}</span>
                </div>
              ))}
            </div>
          </TokenSection>

          {/* ── Shadows ── */}
          <TokenSection title="Shadows" icon={<Box size={16} strokeWidth={1.5} />} id="shadows">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {SHADOW_TOKENS.map((t) => (
                <div key={t.name} className="flex flex-col items-center gap-3 p-5 bg-nahkya-surface rounded-nahkya border border-nahkya-border group hover:border-nahkya-highlight/30 transition-colors">
                  <div className={cn('w-14 h-14 bg-nahkya-highlight rounded-nahkya', t.name)} />
                  <CopyToken token={t.name} />
                  <div className="flex flex-wrap gap-1 justify-center">
                    {t.usage.map((u) => (
                      <span key={u} className="font-body text-body-3xs text-nahkya-text-secondary bg-nahkya-bg px-1.5 py-0.5 rounded-nahkya border border-nahkya-border">{u}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TokenSection>

          {/* ── Radius ── */}
          <TokenSection title="Border Radius" icon={<FlipHorizontal size={16} strokeWidth={1.5} />} id="radius">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {RADIUS_TOKENS.map((t) => (
                <div key={t.name} className="flex flex-col items-center gap-3 p-4 bg-nahkya-surface rounded-nahkya border border-nahkya-border group hover:border-nahkya-highlight/30 transition-colors">
                  <div className={cn('w-14 h-14 bg-nahkya-highlight', t.name)} />
                  <CopyToken token={t.name} />
                  <span className="font-mono text-mono-sm text-nahkya-text-secondary">{t.value}</span>
                </div>
              ))}
            </div>
          </TokenSection>

          {/* ── Z-Index ── */}
          <TokenSection title="Z-Index" icon={<ArrowUpDown size={16} strokeWidth={1.5} />} id="zindex">
            <div className="space-y-2">
              {ZINDEX_TOKENS.map((t) => (
                <div key={t.name} className="flex items-center justify-between p-3 bg-nahkya-surface rounded-nahkya border border-nahkya-border group hover:border-nahkya-highlight/30 transition-colors">
                  <CopyToken token={t.name} />
                  <span className="font-mono text-mono-lg text-nahkya-highlight">{t.value}</span>
                </div>
              ))}
            </div>
          </TokenSection>

          {/* ── Breakpoints ── */}
          <TokenSection title="Breakpoints" icon={<Smartphone size={16} strokeWidth={1.5} />} id="breakpoints">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {BREAKPOINT_TOKENS.map((t) => (
                <div key={t.name} className="flex flex-col items-center gap-2 p-4 bg-nahkya-surface rounded-nahkya border border-nahkya-border group hover:border-nahkya-highlight/30 transition-colors">
                  <span className="font-mono text-mono-lg text-nahkya-highlight">{t.value}</span>
                  <CopyToken token={t.name} />
                </div>
              ))}
            </div>
          </TokenSection>

          {/* ════════════════════════════════════════ */}
          {/* ══ LIVE COMPONENT PREVIEWS ══ */}
          {/* ════════════════════════════════════════ */}

          <TokenSection title="Live Components" icon={<Component size={16} strokeWidth={1.5} />} id="components">

            {/* Buttons */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierButton</h3>
              <div className="p-6 bg-nahkya-surface rounded-nahkya border border-nahkya-border space-y-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <AtelierButton variant="primary">Primary</AtelierButton>
                  <AtelierButton variant="secondary">Secondary</AtelierButton>
                  <AtelierButton variant="outline">Outline</AtelierButton>
                  <AtelierButton variant="ghost">Ghost</AtelierButton>
                  <AtelierButton variant="destructive">Destructive</AtelierButton>
                  <AtelierButton variant="accent">Accent</AtelierButton>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <AtelierButton size="sm">Small</AtelierButton>
                  <AtelierButton size="md">Medium</AtelierButton>
                  <AtelierButton size="lg">Large</AtelierButton>
                  <AtelierButton size="icon" icon={Star} />
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <AtelierButton loading>Loading</AtelierButton>
                  <AtelierButton disabled>Disabled</AtelierButton>
                  <AtelierButton icon={Check} iconPosition="left">With Icon</AtelierButton>
                </div>
                <CopyToken token="import { AtelierButton } from '@/components/shared/AtelierButton'" />
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierCard</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AtelierCard variant="default">
                  <AtelierCard.Content>
                    <AtelierCard.Title>Default</AtelierCard.Title>
                    <AtelierCard.Description>Standard card with subtle border hover.</AtelierCard.Description>
                  </AtelierCard.Content>
                </AtelierCard>
                <AtelierCard variant="elevated">
                  <AtelierCard.Content>
                    <AtelierCard.Title>Elevated</AtelierCard.Title>
                    <AtelierCard.Description>Hover lift with shadow increase.</AtelierCard.Description>
                  </AtelierCard.Content>
                </AtelierCard>
                <AtelierCard variant="feature">
                  <AtelierCard.Content>
                    <AtelierCard.Title>Feature</AtelierCard.Title>
                    <AtelierCard.Description>Left accent border indicator.</AtelierCard.Description>
                  </AtelierCard.Content>
                </AtelierCard>
                <AtelierCard variant="image" href="#">
                  <AtelierCard.Image src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop" alt="Textile" aspectRatio="16/10" />
                  <AtelierCard.Content>
                    <AtelierCard.Title>Image Card</AtelierCard.Title>
                    <AtelierCard.Description>Hover zoom on image.</AtelierCard.Description>
                  </AtelierCard.Content>
                </AtelierCard>
              </div>
              <CopyToken token="import { AtelierCard } from '@/components/shared/AtelierCard'" />
            </div>

            {/* Badges */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierBadge</h3>
              <div className="p-6 bg-nahkya-surface rounded-nahkya border border-nahkya-border flex flex-wrap gap-3 items-center">
                <AtelierBadge variant="default" dot>Default</AtelierBadge>
                <AtelierBadge variant="pending" dot>Pending</AtelierBadge>
                <AtelierBadge variant="approved" dot>Approved</AtelierBadge>
                <AtelierBadge variant="rejected" dot>Rejected</AtelierBadge>
                <AtelierBadge variant="featured" dot>Featured</AtelierBadge>
                <AtelierBadge variant="active" dot>Active</AtelierBadge>
                <AtelierBadge variant="inactive" dot>Inactive</AtelierBadge>
                <AtelierBadge variant="success" dot>Success</AtelierBadge>
                <AtelierBadge variant="error" dot>Error</AtelierBadge>
                <AtelierBadge variant="warning" dot>Warning</AtelierBadge>
                <AtelierBadge variant="info" dot>Info</AtelierBadge>
                <AtelierBadge variant="outline">Outline</AtelierBadge>
              </div>
              <CopyToken token="import { AtelierBadge } from '@/components/shared/AtelierBadge'" />
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierAlert</h3>
              <div className="space-y-3">
                <AtelierAlert variant="success" title="Design Saved">Your textile pattern has been saved to the gallery.</AtelierAlert>
                <AtelierAlert variant="error" title="Upload Failed">Something went wrong. Please check your file and try again.</AtelierAlert>
                <AtelierAlert variant="warning" title="Unsaved Changes">You have unsaved changes that will be lost if you leave.</AtelierAlert>
                <AtelierAlert variant="info" title="Pro Tip">Use the color swatch selector to match thread colors precisely.</AtelierAlert>
              </div>
              <CopyToken token="import { AtelierAlert } from '@/components/shared/AtelierAlert'" />
            </div>

            {/* Table */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierTable</h3>
              <AtelierTable>
                <AtelierTable.Header>
                  <AtelierTable.Row>
                    <AtelierTable.Head>Design</AtelierTable.Head>
                    <AtelierTable.Head>Designer</AtelierTable.Head>
                    <AtelierTable.Head>Status</AtelierTable.Head>
                    <AtelierTable.Head>Actions</AtelierTable.Head>
                  </AtelierTable.Row>
                </AtelierTable.Header>
                <AtelierTable.Body>
                  <AtelierTable.Row>
                    <AtelierTable.Cell><strong>Songket Modern</strong></AtelierTable.Cell>
                    <AtelierTable.Cell>Aisyah Rahman</AtelierTable.Cell>
                    <AtelierTable.Cell><AtelierBadge variant="approved" dot>Approved</AtelierBadge></AtelierTable.Cell>
                    <AtelierTable.Cell><AtelierButton variant="ghost" size="sm">View</AtelierButton></AtelierTable.Cell>
                  </AtelierTable.Row>
                  <AtelierTable.Row>
                    <AtelierTable.Cell><strong>Batik Flora</strong></AtelierTable.Cell>
                    <AtelierTable.Cell>Nurul Huda</AtelierTable.Cell>
                    <AtelierTable.Cell><AtelierBadge variant="pending" dot>Pending</AtelierBadge></AtelierTable.Cell>
                    <AtelierTable.Cell><AtelierButton variant="ghost" size="sm">Review</AtelierButton></AtelierTable.Cell>
                  </AtelierTable.Row>
                  <AtelierTable.Row>
                    <AtelierTable.Cell><strong>Minimalist Silk</strong></AtelierTable.Cell>
                    <AtelierTable.Cell>Fatimah Lee</AtelierTable.Cell>
                    <AtelierTable.Cell><AtelierBadge variant="rejected" dot>Revision</AtelierBadge></AtelierTable.Cell>
                    <AtelierTable.Cell><AtelierButton variant="ghost" size="sm">Edit</AtelierButton></AtelierTable.Cell>
                  </AtelierTable.Row>
                </AtelierTable.Body>
              </AtelierTable>
              <CopyToken token="import { AtelierTable } from '@/components/shared/AtelierTable'" />
            </div>

            {/* Empty State */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierEmptyState</h3>
              <div className="bg-nahkya-surface rounded-nahkya border border-nahkya-border">
                <AtelierEmptyState
                  icon={Image}
                  title="No designs yet"
                  description="Start creating your first textile design to see it here."
                  action={<AtelierButton>Create Design</AtelierButton>}
                />
              </div>
              <CopyToken token="import { AtelierEmptyState } from '@/components/shared/AtelierEmptyState'" />
            </div>

            {/* Dashboard Widget */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierDashboardWidget</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AtelierDashboardWidget label="Total Designs" value="1,284" change={12} changeLabel="from last month" icon={LayoutDashboard} />
                <AtelierDashboardWidget label="Revenue" value="RM48K" change={8} changeLabel="from last month" accent="warning" icon={DollarSign} />
                <AtelierDashboardWidget label="Approval Rate" value="96%" change={3} changeLabel="from last month" accent="success" icon={CheckCircle2} />
                <AtelierDashboardWidget label="Pending Review" value="14" change={-2} changeLabel="since yesterday" accent="error" icon={Clock} />
              </div>
              <CopyToken token="import { AtelierDashboardWidget } from '@/components/shared/AtelierDashboardWidget'" />
            </div>

            {/* Tabs */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierTabs</h3>
              <div className="bg-nahkya-surface rounded-nahkya border border-nahkya-border p-6">
                <AtelierTabs defaultValue="buttons">
                  <AtelierTabsList>
                    <AtelierTabsTrigger value="buttons">Buttons</AtelierTabsTrigger>
                    <AtelierTabsTrigger value="cards">Cards</AtelierTabsTrigger>
                    <AtelierTabsTrigger value="tables">Tables</AtelierTabsTrigger>
                  </AtelierTabsList>
                  <AtelierTabsContent value="buttons">
                    <p className="text-body-sm text-nahkya-text-secondary py-4">Button components and variants.</p>
                  </AtelierTabsContent>
                  <AtelierTabsContent value="cards">
                    <p className="text-body-sm text-nahkya-text-secondary py-4">Card components and layouts.</p>
                  </AtelierTabsContent>
                  <AtelierTabsContent value="tables">
                    <p className="text-body-sm text-nahkya-text-secondary py-4">Table components and data display.</p>
                  </AtelierTabsContent>
                </AtelierTabs>
              </div>
              <CopyToken token="import { AtelierTabs, AtelierTabsList, AtelierTabsTrigger, AtelierTabsContent } from '@/components/shared/AtelierTabs'" />
            </div>

            {/* Upload Zone */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierUploadZone</h3>
              <div className="bg-nahkya-surface rounded-nahkya border border-nahkya-border p-6">
                <AtelierUploadZone
                  accept="image/*"
                  files={uploadedFiles}
                  onDrop={(files) => setUploadedFiles((prev) => [...prev, ...files])}
                  onRemove={(i) => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  label="Drop design files here"
                  description="PNG, JPG up to 10MB"
                />
              </div>
              <CopyToken token="import { AtelierUploadZone } from '@/components/shared/AtelierUploadZone'" />
            </div>

            {/* Step Navigation */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierStepNav</h3>
              <div className="bg-nahkya-surface rounded-nahkya border border-nahkya-border p-6">
                <AtelierStepNav
                  steps={[
                    { label: 'Upload', description: 'Add files' },
                    { label: 'Review', description: 'Check details' },
                    { label: 'Submit', description: 'Send for review' },
                    { label: 'Approve', description: 'Final sign-off' },
                  ]}
                  current={demoStep}
                />
                <div className="flex gap-2 mt-4 justify-center">
                  <AtelierButton size="sm" variant="outline" onClick={() => setDemoStep((s) => Math.max(0, s - 1))}>Previous</AtelierButton>
                  <AtelierButton size="sm" onClick={() => setDemoStep((s) => Math.min(3, s + 1))}>Next</AtelierButton>
                </div>
              </div>
              <CopyToken token="import { AtelierStepNav } from '@/components/shared/AtelierStepNav'" />
            </div>

            {/* Search Bar */}
            <div className="space-y-3">
              <h3 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">AtelierSearchBar</h3>
              <div className="bg-nahkya-surface rounded-nahkya border border-nahkya-border p-6">
                <AtelierSearchBar value={search} onChange={setSearch} placeholder="Search designs, fabrics, patterns..." className="max-w-md" />
              </div>
              <CopyToken token="import { AtelierSearchBar } from '@/components/shared/AtelierSearchBar'" />
            </div>

          </TokenSection>

          {/* Footer */}
          <div className="text-center py-8 border-t border-nahkya-border">
            <div className="font-display text-heading-sm text-nahkya-accent mb-2">Atelier</div>
            <div className="text-body-xs text-nahkya-text-secondary">Premium Fashion & Textile Customization Platform</div>
            <div className="text-body-3xs text-nahkya-muted mt-2">Version 1.0 • June 2026 • Internal Reference</div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
