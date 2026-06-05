import { useState } from 'react';
import { Globe, Copy, Check } from 'lucide-react';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// ── Token Data ──

const COLOR_TOKENS = [
  { category: 'Base', tokens: [
    { name: 'nahkya-bg', class: 'bg-nahkya-bg', textClass: 'text-nahkya-text' },
    { name: 'nahkya-surface', class: 'bg-nahkya-surface', textClass: 'text-nahkya-text' },
    { name: 'nahkya-surface-soft', class: 'bg-nahkya-surface-soft', textClass: 'text-nahkya-text' },
    { name: 'nahkya-surface-warm', class: 'bg-nahkya-surface-warm', textClass: 'text-nahkya-text' },
  ]},
  { category: 'Text', tokens: [
    { name: 'nahkya-text', class: 'bg-nahkya-text', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-text-strong', class: 'bg-nahkya-text-strong', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-text-muted', class: 'bg-nahkya-text-muted', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-text-soft', class: 'bg-nahkya-text-soft', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-text-inverse', class: 'bg-nahkya-text-inverse', textClass: 'text-nahkya-text' },
  ]},
  { category: 'Burgundy', tokens: [
    { name: 'nahkya-burgundy', class: 'bg-nahkya-burgundy', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-burgundy-dark', class: 'bg-nahkya-burgundy-dark', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-burgundy-soft', class: 'bg-nahkya-burgundy-soft', textClass: 'text-nahkya-text' },
  ]},
  { category: 'Gold', tokens: [
    { name: 'nahkya-gold', class: 'bg-nahkya-gold', textClass: 'text-nahkya-soft-black' },
    { name: 'nahkya-gold-soft', class: 'bg-nahkya-gold-soft', textClass: 'text-nahkya-text' },
    { name: 'nahkya-gold-muted', class: 'bg-nahkya-gold-muted', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-gold-veil', class: 'bg-nahkya-gold-veil', textClass: 'text-nahkya-text' },
  ]},
  { category: 'Border', tokens: [
    { name: 'nahkya-border', class: 'bg-nahkya-border', textClass: 'text-nahkya-text' },
    { name: 'nahkya-border-strong', class: 'bg-nahkya-border-strong', textClass: 'text-nahkya-text' },
  ]},
  { category: 'Status', tokens: [
    { name: 'nahkya-error', class: 'bg-nahkya-error', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-error-soft', class: 'bg-nahkya-error-soft', textClass: 'text-nahkya-text' },
    { name: 'nahkya-success', class: 'bg-nahkya-success', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-success-soft', class: 'bg-nahkya-success-soft', textClass: 'text-nahkya-text' },
  ]},
  { category: 'Legacy', tokens: [
    { name: 'nahkya-ivory', class: 'bg-nahkya-ivory', textClass: 'text-nahkya-text' },
    { name: 'nahkya-cream', class: 'bg-nahkya-cream', textClass: 'text-nahkya-text' },
    { name: 'nahkya-stone', class: 'bg-nahkya-stone', textClass: 'text-nahkya-text' },
    { name: 'nahkya-taupe', class: 'bg-nahkya-taupe', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-sand', class: 'bg-nahkya-sand', textClass: 'text-nahkya-text' },
    { name: 'nahkya-charcoal', class: 'bg-nahkya-charcoal', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-soft-black', class: 'bg-nahkya-soft-black', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-gold-light', class: 'bg-nahkya-gold-light', textClass: 'text-nahkya-text' },
    { name: 'nahkya-text-secondary', class: 'bg-nahkya-text-secondary', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-rose', class: 'bg-nahkya-rose', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-teal', class: 'bg-nahkya-teal', textClass: 'text-nahkya-text-inverse' },
    { name: 'nahkya-fuchsia', class: 'bg-nahkya-fuchsia', textClass: 'text-nahkya-text-inverse' },
  ]},
  { category: 'Workspace', tokens: [
    { name: 'workspace-bg', class: 'bg-workspace-bg', textClass: 'text-nahkya-text' },
    { name: 'workspace-sidebar', class: 'bg-workspace-sidebar', textClass: 'text-nahkya-text' },
    { name: 'workspace-panel', class: 'bg-workspace-panel', textClass: 'text-nahkya-text' },
    { name: 'workspace-border', class: 'bg-workspace-border', textClass: 'text-nahkya-text' },
    { name: 'workspace-hover', class: 'bg-workspace-hover', textClass: 'text-nahkya-text' },
  ]},
];

const TYPOGRAPHY_TOKENS = [
  { category: 'Display', tokens: [
    { name: 'text-display-mega', sample: 'Mega Display', size: '200px' },
    { name: 'text-display-xxxl', sample: 'Display XXXL', size: '120px' },
    { name: 'text-display-xxl', sample: 'Display XXL', size: '96px' },
    { name: 'text-display-xl', sample: 'Display XL', size: '72px' },
    { name: 'text-display-lg', sample: 'Display LG', size: '56px' },
    { name: 'text-display-md', sample: 'Display MD', size: '40px' },
    { name: 'text-display-sm', sample: 'Display SM', size: '32px' },
    { name: 'text-display-xs', sample: 'Display XS', size: '52px' },
  ]},
  { category: 'Heading', tokens: [
    { name: 'text-heading-lg', sample: 'Heading Large', size: '24px' },
    { name: 'text-heading-md', sample: 'Heading Medium', size: '20px' },
    { name: 'text-heading-sm', sample: 'Heading Small', size: '28px' },
  ]},
  { category: 'Body', tokens: [
    { name: 'text-body-lg', sample: 'Body Large — The quick brown fox jumps over the lazy dog.', size: '17px' },
    { name: 'text-body-md', sample: 'Body Medium — The quick brown fox jumps over the lazy dog.', size: '15px' },
    { name: 'text-body-sm', sample: 'Body Small — The quick brown fox jumps over the lazy dog.', size: '13px' },
    { name: 'text-body-xs', sample: 'Body XS — The quick brown fox jumps over the lazy dog.', size: '12px' },
    { name: 'text-body-2xs', sample: 'Body 2XS — The quick brown fox jumps over the lazy dog.', size: '11px' },
    { name: 'text-body-3xs', sample: 'Body 3XS — The quick brown fox jumps over the lazy dog.', size: '10px' },
  ]},
  { category: 'Mono', tokens: [
    { name: 'text-mono-lg', sample: 'MONO LARGE', size: '13px' },
    { name: 'text-mono-md', sample: 'MONO MEDIUM', size: '12px' },
    { name: 'text-mono-sm', sample: 'MONO SMALL', size: '10px' },
  ]},
];

const SPACING_TOKENS = [
  { name: 'sidebar-member', value: '240px', desc: 'Member sidebar width' },
  { name: 'sidebar-member-collapsed', value: '80px', desc: 'Collapsed sidebar' },
  { name: 'sidebar-admin', value: '260px', desc: 'Admin sidebar width' },
  { name: 'panel-studio', value: '280px', desc: 'Studio tool panel' },
  { name: 'panel-inspector', value: '330px', desc: 'Inspector panel' },
  { name: 'panel-preview', value: '380px', desc: 'Preview panel' },
  { name: 'button-sm', value: '36px', desc: 'Small button height' },
  { name: 'button', value: '44px', desc: 'Standard button height' },
  { name: 'button-lg', value: '52px', desc: 'Large button height' },
  { name: 'nav', value: '72px', desc: 'Nav bar height' },
  { name: 'toolbar', value: '74px', desc: 'Toolbar height' },
];

const SHADOW_TOKENS = [
  { name: 'shadow-gold-focus', sample: 'Gold Focus Ring' },
  { name: 'shadow-gold-glow', sample: 'Gold Glow' },
  { name: 'shadow-gold-glow-soft', sample: 'Gold Glow Soft' },
  { name: 'shadow-soft', sample: 'Soft' },
  { name: 'shadow-card', sample: 'Card' },
  { name: 'shadow-burgundy', sample: 'Burgundy' },
  { name: 'shadow-focus-ring', sample: 'Focus Ring' },
];

const RADIUS_TOKENS = [
  { name: 'rounded-nahkya', value: '2px' },
  { name: 'rounded-nahkya-sm', value: 'var(--radius-nahkya-sm)' },
  { name: 'rounded-nahkya-md', value: 'var(--radius-nahkya-md)' },
  { name: 'rounded-nahkya-lg', value: 'var(--radius-nahkya-lg)' },
  { name: 'rounded-nahkya-xl', value: 'var(--radius-nahkya-xl)' },
  { name: 'rounded-nahkya-pill', value: 'var(--radius-pill)' },
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

const COMPONENT_CLASSES = [
  { name: '.nk-btn', desc: 'Base button', example: <button className="nk-btn">Base Button</button> },
  { name: '.nk-btn-primary', desc: 'Primary CTA', example: <button className="nk-btn nk-btn-primary">Primary</button> },
  { name: '.nk-btn-secondary', desc: 'Secondary action', example: <button className="nk-btn nk-btn-secondary">Secondary</button> },
  { name: '.nk-btn-ghost', desc: 'Ghost / subtle', example: <button className="nk-btn nk-btn-ghost">Ghost</button> },
  { name: '.nk-card', desc: 'Content card', example: <div className="nk-card p-4">Card content</div> },
  { name: '.nk-card-subtle', desc: 'Subtle card', example: <div className="nk-card-subtle p-4">Subtle card</div> },
  { name: '.nk-input', desc: 'Text input', example: <input className="nk-input" placeholder="Placeholder" readOnly /> },
  { name: '.nk-badge', desc: 'Status badge', example: <span className="nk-badge">Badge</span> },
  { name: '.nk-alert', desc: 'Alert box', example: <div className="nk-alert"><span className="nk-alert-title">Alert</span> Message here</div> },
  { name: '.nk-alert-success', desc: 'Success alert', example: <div className="nk-alert nk-alert-success"><span className="nk-alert-title">Success</span> Saved</div> },
  { name: '.nk-alert-error', desc: 'Error alert', example: <div className="nk-alert nk-alert-error"><span className="nk-alert-title">Error</span> Failed</div> },
  { name: '.nk-status', desc: 'Status pill', example: <span className="nk-status">Pending</span> },
  { name: '.nk-empty-state', desc: 'Empty state container', example: <div className="nk-empty-state"><span className="nk-empty-title">Nothing here</span></div> },
  { name: '.nk-display', desc: 'Display heading', example: <span className="nk-display">Display</span> },
  { name: '.nk-section-title', desc: 'Section heading', example: <span className="nk-section-title">Section</span> },
  { name: '.nk-eyebrow', desc: 'Eyebrow label', example: <span className="nk-eyebrow">EYEBROW</span> },
];

// ── Copy Helper ──

function CopyToken({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="flex items-center gap-1 text-nahkya-text-muted hover:text-nahkya-gold transition-colors"
      title="Copy token"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      <span className="font-mono text-mono-xs">{token}</span>
    </button>
  );
}

// ── Page ──

export default function AdminGlobal() {
  return (
    <div className="flex flex-col h-full bg-nahkya-bg">
      <AdminTopBar
        icon={<Globe size={17} strokeWidth={1.5} />}
        label="Global Design Tokens"
        hint="Visual reference for all reusable tokens & components"
      />

      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto p-8 space-y-12">

          {/* ── Colours ── */}
          <TokenSection title="Colours" id="colours">
            {COLOR_TOKENS.map((group) => (
              <div key={group.category} className="space-y-3">
                <h3 className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-wider">
                  {group.category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {group.tokens.map((t) => (
                    <div
                      key={t.name}
                      className={cn(
                        'rounded-nahkya border border-nahkya-border overflow-hidden',
                        'group hover:ring-1 hover:ring-nahkya-gold/40 transition-all'
                      )}
                    >
                      <div className={cn('h-14 w-full', t.class)} />
                      <div className="p-2 bg-nahkya-surface space-y-1">
                        <CopyToken token={t.name} />
                        <p className={cn('font-body text-body-2xs truncate', t.textClass === 'text-nahkya-text-inverse' ? 'text-nahkya-text-muted' : '')}>
                          {t.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TokenSection>

          {/* ── Typography ── */}
          <TokenSection title="Typography" id="typography">
            {TYPOGRAPHY_TOKENS.map((group) => (
              <div key={group.category} className="space-y-3">
                <h3 className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-wider">
                  {group.category}
                </h3>
                <div className="space-y-3">
                  {group.tokens.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-baseline justify-between p-4 bg-nahkya-surface rounded-nahkya border border-nahkya-border"
                    >
                      <div className="min-w-0 flex-1">
                        <p className={cn(t.name, 'truncate')}>{t.sample}</p>
                      </div>
                      <div className="shrink-0 ml-4">
                        <CopyToken token={t.name} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-4 bg-nahkya-surface rounded-nahkya border border-nahkya-border space-y-2">
              <h4 className="font-mono text-mono-xs text-nahkya-text-muted uppercase">Font Families</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display text-display-sm">font-display — Playfair Display</span>
                  <CopyToken token="font-display" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-body-lg">font-body — Inter</span>
                  <CopyToken token="font-body" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-mono-lg">font-mono — IBM Plex Mono</span>
                  <CopyToken token="font-mono" />
                </div>
              </div>
            </div>
          </TokenSection>

          {/* ── Spacing ── */}
          <TokenSection title="Spacing" id="spacing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SPACING_TOKENS.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center gap-4 p-4 bg-nahkya-surface rounded-nahkya border border-nahkya-border"
                >
                  <div className="w-24 shrink-0">
                    <CopyToken token={t.name} />
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className="h-4 bg-nahkya-gold rounded-nahkya"
                      style={{ width: t.value }}
                    />
                    <span className="font-mono text-mono-xs text-nahkya-text-muted">{t.value}</span>
                  </div>
                  <span className="font-body text-body-2xs text-nahkya-text-muted shrink-0">{t.desc}</span>
                </div>
              ))}
            </div>
          </TokenSection>

          {/* ── Shadows ── */}
          <TokenSection title="Shadows" id="shadows">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {SHADOW_TOKENS.map((t) => (
                <div
                  key={t.name}
                  className={cn(
                    'p-6 bg-nahkya-surface rounded-nahkya border border-nahkya-border',
                    'flex flex-col items-center justify-center gap-3',
                    t.name
                  )}
                >
                  <div className={cn('w-12 h-12 bg-nahkya-gold rounded-nahkya', t.name)} />
                  <CopyToken token={t.name} />
                </div>
              ))}
            </div>
          </TokenSection>

          {/* ── Border Radius ── */}
          <TokenSection title="Border Radius" id="radius">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {RADIUS_TOKENS.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col items-center gap-3 p-4 bg-nahkya-surface rounded-nahkya border border-nahkya-border"
                >
                  <div className={cn('w-14 h-14 bg-nahkya-gold', t.name)} />
                  <CopyToken token={t.name} />
                  <span className="font-mono text-mono-xs text-nahkya-text-muted">{t.value}</span>
                </div>
              ))}
            </div>
          </TokenSection>

          {/* ── Z-Index ── */}
          <TokenSection title="Z-Index" id="zindex">
            <div className="space-y-2">
              {ZINDEX_TOKENS.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center justify-between p-3 bg-nahkya-surface rounded-nahkya border border-nahkya-border"
                >
                  <CopyToken token={t.name} />
                  <span className="font-mono text-mono-lg text-nahkya-gold">{t.value}</span>
                </div>
              ))}
            </div>
          </TokenSection>

          {/* ── Component Classes ── */}
          <TokenSection title="Component Classes (.nk-*)" id="components">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMPONENT_CLASSES.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col gap-3 p-4 bg-nahkya-surface rounded-nahkya border border-nahkya-border"
                >
                  <div className="flex items-center justify-between">
                    <CopyToken token={t.name} />
                    <span className="font-body text-body-2xs text-nahkya-text-muted">{t.desc}</span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-nahkya-bg rounded-nahkya">
                    {t.example}
                  </div>
                </div>
              ))}
            </div>
          </TokenSection>

        </div>
      </ScrollArea>
    </div>
  );
}

// ── Section Wrapper ──

function TokenSection({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4">
      <h2 className="font-display text-heading-sm font-medium text-nahkya-text border-b border-nahkya-border pb-2">
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}
