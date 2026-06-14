import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Ribbon,
  RibbonTabs,
  RibbonTab,
  RibbonBody,
  RibbonPanel,
  RibbonGroup,
  RibbonButton,
  RibbonToggleGroup,
  RibbonToggle,
  RibbonColorPicker,
} from '@/components/shared/Ribbon';
import { DESIGN_SYSTEM_VERSION, DESIGN_SYSTEM_UPDATED_AT } from '@/lib/constants';
import '@/styles/system-dna.css';
import {
  Check,
  Monitor,
  Smartphone,
  Upload,
  Search,
  Trash2,
  X,
  Palette,
  ImageOff,
  Dna,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Paintbrush,
  Scissors,
  Copy,
  Layers,
  Type,
  Undo2,
  Redo2,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   AdminSystemDNA — Interactive Design System Reference
   Loads system-dna.css: the canonical Atelier component stylesheet.
   ═══════════════════════════════════════════════════════════════ */

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function AdminSystemDNA() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const [checkboxes, setCheckboxes] = useState([true, false]);
  const [radioVal, setRadioVal] = useState('designer');
  const [copied, setCopied] = useState<string | null>(null);
  const [ribbonTab, setRibbonTab] = useState('home');
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(true);
  const [underline, setUnderline] = useState(false);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const toastIdRef = useRef(0);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const copyToClipboard = useCallback(
    (hex: string) => {
      navigator.clipboard.writeText(hex).then(() => {
        setCopied(hex);
        showToast(`Copied ${hex} to clipboard`, 'success');
        setTimeout(() => setCopied(null), 1500);
      });
    },
    [showToast]
  );

  const openModal = useCallback((id: string) => setActiveModal(id), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  // Close modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeModal]);

  const brandColors = [
    { name: 'Deep Burgundy', hex: '#7A2E3C', usage: 'Primary buttons, active nav, CTAs' },
    { name: 'Antique Gold', hex: '#C8A464', usage: 'Highlights, badges, decorative accents' },
    { name: 'Warm Ivory', hex: '#F8F5F0', usage: 'Page backgrounds, surrounds' },
    { name: 'Charcoal', hex: '#2C2C2C', usage: 'Headings, body content' },
  ];

  const neutralColors = [
    { name: 'Soft Beige', hex: '#EDE8E0', usage: 'Cards, panels, input backgrounds' },
    { name: 'Muted Olive', hex: '#8B8B6E', usage: 'Secondary labels, metadata, tags' },
    { name: 'Border Light', hex: '#E0DCD5', usage: 'Borders, dividers, input outlines' },
    { name: 'Pure White', hex: '#FFFFFF', usage: 'Card backgrounds on dark surfaces' },
  ];

  const semanticColors = [
    { name: 'Success', hex: '#5A8F6E', usage: 'Completed steps, valid states' },
    { name: 'Warning', hex: '#C4943F', usage: 'Unsaved changes, caution alerts' },
    { name: 'Error', hex: '#B54A4A', usage: 'Invalid states, destructive actions' },
    { name: 'Info', hex: '#5A7A9A', usage: 'Tips, neutral alerts' },
  ];

  const spacingScale = [
    { token: '--space-xs', val: '4px', usage: 'Tight gaps, icon padding', size: 4 },
    { token: '--space-sm', val: '8px', usage: 'Component gaps, small buttons', size: 8 },
    { token: '--space-md-sm', val: '12px', usage: 'Button icon gaps', size: 12 },
    { token: '--space-md', val: '16px', usage: 'Card padding, form gaps', size: 16 },
    { token: '--space-lg', val: '24px', usage: 'Section padding (mobile), card gaps', size: 24 },
    { token: '--space-xl', val: '32px', usage: 'Section padding (tablet)', size: 32 },
    { token: '--space-2xl', val: '48px', usage: 'Section padding (desktop)', size: 48 },
    { token: '--space-3xl', val: '64px', usage: 'Section padding (large desktop)', size: 64 },
    { token: '--space-4xl', val: '96px', usage: 'Major section breaks', size: 64 },
  ];

  const shadowLevels = [
    { token: '--shadow-sm', val: '0 1px 4px rgba(44,44,44,0.04)', usage: 'Subtle card hover, inset panels' },
    { token: '--shadow-md', val: '0 4px 12px rgba(44,44,44,0.06)', usage: 'Cards, dropdowns, elevated buttons' },
    { token: '--shadow-lg', val: '0 8px 24px rgba(44,44,44,0.08)', usage: 'Modals, floating panels, popovers' },
    { token: '--shadow-xl', val: '0 16px 48px rgba(44,44,44,0.10)', usage: 'Full-screen overlays, important modals' },
  ];

  const tableData = [
    { design: 'Songket Modern', designer: 'Aisyah Rahman', date: 'Jun 8, 2026', status: 'approved' },
    { design: 'Batik Flora', designer: 'Nurul Huda', date: 'Jun 7, 2026', status: 'pending' },
    { design: 'Minimalist Silk', designer: 'Fatimah Lee', date: 'Jun 6, 2026', status: 'rejected' },
    { design: 'Gold Thread Kaftan', designer: 'Siti Aminah', date: 'Jun 5, 2026', status: 'featured' },
  ];

  return (
    <div className="system-dna-scope p-8 lg:p-12">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn('toast', t.type === 'success' && 'border-l-4 border-l-nahkya-success', t.type === 'error' && 'border-l-4 border-l-nahkya-error')}
          >
            <span className="toast-icon">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '×' : 'ℹ'}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <Dna className="w-6 h-6 text-nahkya-accent" />
        <h1 className="font-display text-display-sm text-nahkya-text font-medium">System DNA</h1>
        <div className="flex items-center gap-2 ml-auto">
          <span className="badge badge-approved">
            <span className="badge-dot" />
            v{DESIGN_SYSTEM_VERSION}
          </span>
          <span className="text-caption text-nahkya-muted">
            Updated {new Date(DESIGN_SYSTEM_UPDATED_AT).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
      <p className="text-body-md text-nahkya-text-secondary font-body mb-8 max-w-2xl">
        Atelier Design System — visual language, tokens, and components. This reference documents the
        complete UI vocabulary used across the platform.
      </p>

      <div className="max-w-[1200px]">
        {/* ── Colors ── */}
        <section className="section" id="colors">
          <div className="section-header">
            <h2 className="section-title">Color System</h2>
            <p className="section-desc">
              The Atelier palette is built on warmth and restraint. Deep burgundy and antique gold evoke
              luxury textiles, while supporting neutrals draw from natural materials.
            </p>
          </div>

          <div className="section-label">Primary Brand Colors</div>
          <div className="color-grid">
            {brandColors.map((c) => (
              <div key={c.hex} className="color-swatch" onClick={() => copyToClipboard(c.hex)}>
                <div className="color-preview" style={{ background: c.hex }}>
                  <span>{copied === c.hex ? <Check className="w-3 h-3" /> : c.hex}</span>
                </div>
                <div className="color-info">
                  <div className="color-name">{c.name}</div>
                  <div className="color-usage">{c.usage}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-label mt-8">Supporting Neutrals</div>
          <div className="color-grid">
            {neutralColors.map((c) => (
              <div key={c.hex} className="color-swatch" onClick={() => copyToClipboard(c.hex)}>
                <div className="color-preview" style={{ background: c.hex, borderBottom: c.hex === '#FFFFFF' ? '1px solid var(--color-border)' : undefined }}>
                  <span>{copied === c.hex ? <Check className="w-3 h-3" /> : c.hex}</span>
                </div>
                <div className="color-info">
                  <div className="color-name">{c.name}</div>
                  <div className="color-usage">{c.usage}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-label mt-8">Semantic Colors</div>
          <div className="color-grid">
            {semanticColors.map((c) => (
              <div key={c.hex} className="color-swatch" onClick={() => copyToClipboard(c.hex)}>
                <div className="color-preview" style={{ background: c.hex }}>
                  <span>{copied === c.hex ? <Check className="w-3 h-3" /> : c.hex}</span>
                </div>
                <div className="color-info">
                  <div className="color-name">{c.name}</div>
                  <div className="color-usage">{c.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography ── */}
        <section className="section" id="typography">
          <div className="section-header">
            <h2 className="section-title">Typography System</h2>
            <p className="section-desc">
              Playfair Display carries personality in headings. Inter ensures clarity in body text and UI
              controls. Fira Code handles technical content.
            </p>
          </div>

          <div className="tabs">
            <button
              className={cn('tab', activeTab === 'desktop' && 'active')}
              onClick={() => setActiveTab('desktop')}
            >
              <Monitor className="w-4 h-4 inline mr-1" />
              Desktop (1280px+)
            </button>
            <button
              className={cn('tab', activeTab === 'mobile' && 'active')}
              onClick={() => setActiveTab('mobile')}
            >
              <Smartphone className="w-4 h-4 inline mr-1" />
              Mobile (320px+)
            </button>
          </div>

          {activeTab === 'desktop' && (
            <div className="tab-panel active">
              <div className="type-specimen">
                <div className="type-row">
                  <div className="type-sample type-hero">Hero Heading</div>
                  <div className="type-meta">Playfair 56px / 64px / 700</div>
                </div>
                <div className="type-row">
                  <div className="type-sample type-h1">Section Heading (H1)</div>
                  <div className="type-meta">Playfair 40px / 48px / 600</div>
                </div>
                <div className="type-row">
                  <div className="type-sample type-h2">Subsection (H2)</div>
                  <div className="type-meta">Playfair 32px / 40px / 600</div>
                </div>
                <div className="type-row">
                  <div className="type-sample type-h3">Card Heading (H3)</div>
                  <div className="type-meta">Playfair 24px / 32px / 600</div>
                </div>
                <div className="type-row">
                  <div className="type-sample type-h4">Small Heading (H4)</div>
                  <div className="type-meta">Inter 18px / 28px / 600</div>
                </div>
                <div className="type-row">
                  <div className="type-sample type-body">
                    Body text is set in Inter at 16px with a generous line height of 1.75 for comfortable
                    reading on screen.
                  </div>
                  <div className="type-meta">Inter 16px / 28px / 400</div>
                </div>
                <div className="type-row">
                  <div className="type-sample type-caption">Caption / Label</div>
                  <div className="type-meta">Inter 13px / 20px / 500</div>
                </div>
                <div className="type-row">
                  <div className="type-sample type-button">BUTTON LABEL</div>
                  <div className="type-meta">Inter 14px / 20px / 600</div>
                </div>
                <div className="type-row">
                  <div className="type-sample type-helper">
                    Helper text provides additional context and guidance.
                  </div>
                  <div className="type-meta">Inter 12px / 18px / 400</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="tab-panel active">
              <div className="type-specimen">
                <div className="type-row">
                  <div className="type-sample" style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, lineHeight: '40px' }}>
                    Hero Heading
                  </div>
                  <div className="type-meta">Playfair 32px / 40px / 700</div>
                </div>
                <div className="type-row">
                  <div className="type-sample" style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 600, lineHeight: '36px' }}>
                    Section Heading
                  </div>
                  <div className="type-meta">Playfair 28px / 36px / 600</div>
                </div>
                <div className="type-row">
                  <div className="type-sample" style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 600, lineHeight: '30px' }}>
                    Subsection
                  </div>
                  <div className="type-meta">Playfair 22px / 30px / 600</div>
                </div>
                <div className="type-row">
                  <div className="type-sample" style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 400, lineHeight: '26px' }}>
                    Body text on mobile remains highly readable at 15px with increased line height for
                    touch-friendly spacing.
                  </div>
                  <div className="type-meta">Inter 15px / 26px / 400</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Spacing ── */}
        <section className="section" id="spacing">
          <div className="section-header">
            <h2 className="section-title">Spacing System</h2>
            <p className="section-desc">
              An 8-point grid system with a 4px base unit. All spacing values derive from this base to
              ensure visual rhythm and consistency.
            </p>
          </div>

          <div className="demo-box">
            <div className="spacing-scale">
              {spacingScale.map((s) => (
                <div key={s.token} className="spacing-row">
                  <div
                    className="spacing-visual"
                    style={{ width: s.size, height: s.size }}
                  />
                  <div className="spacing-info">
                    <span className="spacing-name">{s.token}</span>
                    {s.val} — {s.usage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Shadows ── */}
        <section className="section" id="shadows">
          <div className="section-header">
            <h2 className="section-title">Shadows & Surfaces</h2>
            <p className="section-desc">
              Shadows are soft, diffuse, and warm-toned. They suggest gentle elevation rather than harsh
              separation.
            </p>
          </div>

          <div className="shadow-grid">
            {shadowLevels.map((s) => (
              <div key={s.token} className="shadow-demo" style={{ boxShadow: `var(${s.token})` }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-caption)', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {s.token}
                </div>
                <div className="shadow-label">{s.val}</div>
                <div className="shadow-label" style={{ marginTop: 4, color: 'var(--color-text-muted)' }}>
                  {s.usage}
                </div>
              </div>
            ))}
          </div>

          <div className="demo-box mt-8">
            <div className="section-label">Surface Elevation Levels</div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-md border"
                  style={{ background: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
                <div>
                  <div className="font-medium text-nahkya-text">Base</div>
                  <div className="text-caption text-nahkya-muted">#F8F5F0 — Page background</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-md border"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                />
                <div>
                  <div className="font-medium text-nahkya-text">Elevated 1</div>
                  <div className="text-caption text-nahkya-muted">#EDE8E0 — Cards, panels, sidebars</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-md border"
                  style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
                />
                <div>
                  <div className="font-medium text-nahkya-text">Elevated 2</div>
                  <div className="text-caption text-nahkya-muted">#FFFFFF — Dropdowns, popovers, menus</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Buttons ── */}
        <section className="section" id="buttons">
          <div className="section-header">
            <h2 className="section-title">Button System</h2>
            <p className="section-desc">
              Tactile and responsive buttons with generous padding, rounded corners, and clear visual
              hierarchy. Every button has distinct hover, active, focus, and disabled states.
            </p>
          </div>

          <div className="section-label">Button Variants</div>
          <div className="button-row">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-ghost">Ghost</button>
            <button className="btn btn-outline">Outline</button>
            <button className="btn btn-destructive">Destructive</button>
            <button className="btn btn-disabled" disabled>
              Disabled
            </button>
          </div>

          <div className="section-label">Button Sizes</div>
          <div className="button-row">
            <button className="btn btn-primary btn-sm">Small</button>
            <button className="btn btn-primary">Default</button>
            <button className="btn btn-primary btn-lg">Large</button>
          </div>

          <div className="section-label">Button States</div>
          <div className="button-row">
            <button
              className={cn('btn btn-primary', loadingBtn && 'btn-loading')}
              onClick={() => {
                setLoadingBtn(true);
                setTimeout(() => setLoadingBtn(false), 2000);
              }}
              disabled={loadingBtn}
            >
              {loadingBtn ? 'Loading…' : 'Click to Load'}
            </button>
            <button className="btn btn-icon" title="Edit">
              <Palette className="w-5 h-5" />
            </button>
            <button className="btn btn-icon" title="Delete">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* ── Forms ── */}
        <section className="section" id="forms">
          <div className="section-header">
            <h2 className="section-title">Form Elements</h2>
            <p className="section-desc">
              Lightweight and approachable inputs with soft beige backgrounds, visible labels, and clear
              error states.
            </p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input type="text" className="input" placeholder="Enter your name" />
              <span className="form-helper">As it appears on your ID</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input type="email" className="input input-success" defaultValue="designer@atelier.com" />
              <span className="form-helper" style={{ color: 'var(--color-success)' }}>
                ✓ Valid email address
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="input input-error" defaultValue="short" />
              <span className="form-error">Password must be at least 8 characters</span>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <div className="select-wrapper">
                <select className="input select">
                  <option>Malaysia</option>
                  <option>Indonesia</option>
                  <option>Singapore</option>
                  <option>Brunei</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Bio</label>
              <textarea className="input textarea" placeholder="Tell us about your design philosophy…" />
              <span className="form-helper">0 / 280 characters</span>
            </div>

            <div className="form-group">
              <label className="form-label">Preferences</label>
              <div className="flex flex-col gap-2 mt-2">
                {['Email notifications', 'Marketing updates'].map((label, i) => (
                  <div
                    key={label}
                    className="checkbox-group"
                    onClick={() =>
                      setCheckboxes((prev) => {
                        const next = [...prev];
                        next[i] = !next[i];
                        return next;
                      })
                    }
                  >
                    <div className={cn('checkbox', checkboxes[i] && 'checked')} />
                    <span className="checkbox-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div className="flex flex-col gap-2 mt-2">
                {[
                  { val: 'designer', label: 'Designer' },
                  { val: 'client', label: 'Client' },
                ].map((r) => (
                  <div
                    key={r.val}
                    className="radio-group"
                    onClick={() => setRadioVal(r.val)}
                  >
                    <div className={cn('radio', radioVal === r.val && 'checked')} />
                    <span className="radio-label">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Dark Mode</label>
              <div className={cn('toggle', toggleOn && 'on')} onClick={() => setToggleOn(!toggleOn)}>
                <div className="toggle-thumb" />
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Search</label>
              <div className="search-bar">
                <Search className="search-icon w-4 h-4" />
                <input type="text" className="input" placeholder="Search designs, fabrics, patterns…" />
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Opacity</label>
              <div className="range-slider">
                <div className="range-fill" />
                <div className="range-thumb" />
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Upload Design</label>
              <div
                className="upload-zone"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('dragover');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('dragover');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('dragover');
                  showToast('File uploaded successfully!', 'success');
                }}
              >
                <Upload className="w-12 h-12 text-nahkya-highlight" />
                <div className="upload-title">Drag & drop or click to upload</div>
                <div className="upload-subtitle">PNG, JPG up to 10MB</div>
                <button className="btn btn-secondary btn-sm">Browse Files</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Cards ── */}
        <section className="section" id="cards">
          <div className="section-header">
            <h2 className="section-title">Cards & Panels</h2>
            <p className="section-desc">
              Primary content containers that float above the warm ivory background on soft beige surfaces,
              creating subtle depth through color.
            </p>
          </div>

          <div className="card-grid">
            <div className="card">
              <div className="card-image">
                <img
                  src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop"
                  alt="Textile pattern"
                  loading="lazy"
                />
              </div>
              <div className="card-title">Songket Weave</div>
              <div className="card-subtitle">Traditional Malay textile</div>
              <div className="card-desc">
                A hand-woven fabric with gold or silver threads creating intricate patterns.
              </div>
              <div className="card-footer">
                <span className="badge badge-featured">
                  <span className="badge-dot" />
                  Featured
                </span>
                <button className="btn btn-ghost btn-sm">View</button>
              </div>
            </div>

            <div className="card card-elevated">
              <div className="card-image">
                <img
                  src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=300&fit=crop"
                  alt="Fabric texture"
                  loading="lazy"
                />
              </div>
              <div className="card-title">Raw Silk</div>
              <div className="card-subtitle">Premium natural fiber</div>
              <div className="card-desc">
                Luxurious silk with a subtle texture and natural sheen perfect for draping.
              </div>
              <div className="card-footer">
                <span className="badge badge-approved">
                  <span className="badge-dot" />
                  In Stock
                </span>
                <button className="btn btn-ghost btn-sm">Details</button>
              </div>
            </div>

            <div className="card card-feature">
              <div
                className="w-12 h-12 rounded-md flex items-center justify-center text-white text-2xl mb-4"
                style={{ background: 'var(--color-primary)' }}
              >
                ✦
              </div>
              <div className="card-title">Premium Plan</div>
              <div className="card-subtitle">For professional designers</div>
              <div className="card-desc">
                Unlimited uploads, priority review, and exclusive access to premium fabrics.
              </div>
              <div className="card-footer">
                <span className="font-display text-heading-sm text-nahkya-accent">
                  RM99
                  <span className="text-caption font-body text-nahkya-muted font-normal">/month</span>
                </span>
                <button className="btn btn-primary btn-sm">Upgrade</button>
              </div>
            </div>
          </div>

          <div className="demo-box mt-8">
            <div className="section-label">Empty State</div>
            <div className="empty-state">
              <div className="empty-icon">
                <ImageOff className="w-8 h-8" />
              </div>
              <div className="empty-title">No designs yet</div>
              <div className="empty-desc">Start creating your first textile design to see it here.</div>
              <button className="btn btn-primary">Create Design</button>
            </div>
          </div>
        </section>

        {/* ── Modals ── */}
        <section className="section" id="modals">
          <div className="section-header">
            <h2 className="section-title">Dialog Boxes & Modals</h2>
            <p className="section-desc">
              Sheets of fine paper floating above the interface — substantial but not heavy, with soft
              overlays and gentle animations.
            </p>
          </div>

          <div className="button-row">
            <button className="btn btn-primary" onClick={() => openModal('confirm')}>
              Confirmation
            </button>
            <button className="btn btn-secondary" onClick={() => openModal('warning')}>
              Warning
            </button>
            <button className="btn btn-destructive" onClick={() => openModal('destructive')}>
              Destructive
            </button>
            <button className="btn btn-outline" onClick={() => openModal('success')}>
              Success
            </button>
          </div>

          {/* Modals */}
          <div className={cn('modal-overlay', activeModal === 'confirm' && 'open')} onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Save Changes?</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="modal-body">
                Your design has unsaved changes. Would you like to save before leaving?
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={closeModal}>
                  Discard
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    closeModal();
                    showToast('Changes saved', 'success');
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className={cn('modal-overlay', activeModal === 'warning' && 'open')} onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Unsaved Changes</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="modal-body">
                You have modified 3 fields. If you navigate away now, your progress will be lost.
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={closeModal}>
                  Stay
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Leave Anyway
                </button>
              </div>
            </div>
          </div>

          <div className={cn('modal-overlay', activeModal === 'destructive' && 'open')} onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Delete Design?</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="modal-body">
                This action cannot be undone. The design "Songket Modern" and all associated files will be
                permanently removed.
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-destructive"
                  onClick={() => {
                    closeModal();
                    showToast('Design deleted', 'error');
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className={cn('modal-overlay', activeModal === 'success' && 'open')} onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Payment Successful</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="modal-body">
                Your order #2847 has been confirmed. You will receive a confirmation email shortly with
                tracking details.
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={closeModal}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Alerts ── */}
        <section className="section" id="alerts">
          <div className="section-header">
            <h2 className="section-title">Alerts, Toasts & Notifications</h2>
            <p className="section-desc">
              Color-coded left borders and subtle background tints convey severity while maintaining the
              warm, understated aesthetic.
            </p>
          </div>

          <div className="demo-box">
            <div className="alert alert-success">
              <div className="alert-icon">✓</div>
              <div className="alert-content">
                <div className="alert-title">Design Saved</div>
                <div className="alert-message">Your textile pattern has been saved to the gallery.</div>
              </div>
              <button className="alert-close" onClick={(e) => e.currentTarget.parentElement?.remove()}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="alert alert-error">
              <div className="alert-icon">×</div>
              <div className="alert-content">
                <div className="alert-title">Upload Failed</div>
                <div className="alert-message">
                  Something went wrong. Please check your file and try again.
                </div>
              </div>
              <button className="alert-close" onClick={(e) => e.currentTarget.parentElement?.remove()}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="alert alert-warning">
              <div className="alert-icon">!</div>
              <div className="alert-content">
                <div className="alert-title">Unsaved Changes</div>
                <div className="alert-message">
                  You have unsaved changes that will be lost if you leave.
                </div>
              </div>
              <button className="alert-close" onClick={(e) => e.currentTarget.parentElement?.remove()}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="alert alert-info">
              <div className="alert-icon">i</div>
              <div className="alert-content">
                <div className="alert-title">Pro Tip</div>
                <div className="alert-message">
                  Use the color swatch selector to match thread colors precisely.
                </div>
              </div>
              <button className="alert-close" onClick={(e) => e.currentTarget.parentElement?.remove()}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="button-row">
            <button className="btn btn-primary" onClick={() => showToast('Design saved successfully!', 'success')}>
              Show Success Toast
            </button>
            <button className="btn btn-secondary" onClick={() => showToast('New fabric available: Raw Silk', 'info')}>
              Show Info Toast
            </button>
            <button className="btn btn-destructive" onClick={() => showToast('Connection lost. Retrying…', 'error')}>
              Show Error Toast
            </button>
          </div>
        </section>

        {/* ── Tables ── */}
        <section className="section" id="tables">
          <div className="section-header">
            <h2 className="section-title">Table Styles</h2>
            <p className="section-desc">
              Clean, readable, and unobtrusive tables with minimal borders, generous cell padding, and
              clear typographic hierarchy.
            </p>
          </div>

          <div className="table-container">
            <table className="atelier-table">
              <thead>
                <tr>
                  <th>Design</th>
                  <th>Designer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.design}>
                    <td>
                      <strong>{row.design}</strong>
                    </td>
                    <td>{row.designer}</td>
                    <td>{row.date}</td>
                    <td>
                      <span className={cn('badge', `badge-${row.status}`)}>
                        <span className="badge-dot" />
                        {row.status === 'approved'
                          ? 'Approved'
                          : row.status === 'pending'
                            ? 'Pending'
                            : row.status === 'rejected'
                              ? 'Revision'
                              : 'Featured'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">
                        {row.status === 'approved'
                          ? 'View'
                          : row.status === 'pending'
                            ? 'Review'
                            : row.status === 'rejected'
                              ? 'Edit'
                              : 'Preview'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Badges ── */}
        <section className="section" id="badges">
          <div className="section-header">
            <h2 className="section-title">Admin Status Badges</h2>
            <p className="section-desc">
              Pill-shaped badges with color-coded backgrounds for design submissions, user accounts, and
              system states.
            </p>
          </div>

          <div className="button-row">
            <span className="badge badge-pending">
              <span className="badge-dot" />
              Pending
            </span>
            <span className="badge badge-approved">
              <span className="badge-dot" />
              Approved
            </span>
            <span className="badge badge-rejected">
              <span className="badge-dot" />
              Rejected
            </span>
            <span className="badge badge-featured">
              <span className="badge-dot" />
              Featured
            </span>
          </div>
        </section>

        {/* ── Skeletons ── */}
        <section className="section" id="skeletons">
          <div className="section-header">
            <h2 className="section-title">Loading Skeletons</h2>
            <p className="section-desc">
              Soft beige shapes on warm ivory with a gentle shimmer animation that suggests activity
              without visual noise.
            </p>
          </div>

          <div className="card-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div className="skeleton skeleton-line short" />
                <div className="skeleton skeleton-line medium" />
                <div className="skeleton skeleton-line long" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Widgets ── */}
        <section className="section" id="widgets">
          <div className="section-header">
            <h2 className="section-title">Dashboard Widgets</h2>
            <p className="section-desc">
              Self-contained cards that display key information and quick actions, scannable at a glance
              with deeper interaction on hover.
            </p>
          </div>

          <div className="widget-grid">
            <div className="widget widget-stat">
              <div className="widget-value">1,284</div>
              <div className="widget-label">Total Designs</div>
              <div className="widget-change positive">↑ 12% from last month</div>
            </div>
            <div className="widget widget-stat" style={{ borderLeftColor: 'var(--color-accent)' }}>
              <div className="widget-value" style={{ color: 'var(--color-accent)' }}>
                RM48K
              </div>
              <div className="widget-label">Revenue</div>
              <div className="widget-change positive">↑ 8% from last month</div>
            </div>
            <div className="widget widget-stat" style={{ borderLeftColor: 'var(--color-success)' }}>
              <div className="widget-value" style={{ color: 'var(--color-success)' }}>
                97%
              </div>
              <div className="widget-label">Approval Rate</div>
              <div className="widget-change positive">↑ 3% from last month</div>
            </div>
            <div className="widget widget-stat" style={{ borderLeftColor: 'var(--color-error)' }}>
              <div className="widget-value" style={{ color: 'var(--color-error)' }}>
                12
              </div>
              <div className="widget-label">Pending Review</div>
              <div className="widget-change negative">↑ 2 since yesterday</div>
            </div>
          </div>
        </section>

        {/* ── Ribbon / Toolbar ── */}
        <section className="section" id="ribbon">
          <div className="section-header">
            <h2 className="section-title">Ribbon & Toolbar</h2>
            <p className="section-desc">
              A Word-style contextual ribbon with tabbed command groups, split buttons, colour pickers,
              and toggle states — organised for power users.
            </p>
          </div>

          <Ribbon activeTab={ribbonTab} onTabChange={setRibbonTab}>
            <RibbonTabs>
              <RibbonTab id="home" label="Home" />
              <RibbonTab id="insert" label="Insert" />
              <RibbonTab id="design" label="Design" />
              <RibbonTab id="layout" label="Layout" />
              <RibbonTab id="review" label="Review" />
            </RibbonTabs>

            <RibbonBody>
              <RibbonPanel tabId="home">
                <RibbonGroup title="Clipboard">
                  <RibbonButton icon={<Scissors className="w-5 h-5" />} label="Cut" />
                  <RibbonButton icon={<Copy className="w-5 h-5" />} label="Copy" />
                  <RibbonButton icon={<Layers className="w-5 h-5" />} label="Paste" />
                </RibbonGroup>

                <RibbonGroup title="Font">
                  <RibbonToggleGroup>
                    <RibbonToggle active={bold} onClick={() => setBold((v) => !v)}>
                      <Bold className="w-4 h-4" />
                    </RibbonToggle>
                    <RibbonToggle active={italic} onClick={() => setItalic((v) => !v)}>
                      <Italic className="w-4 h-4" />
                    </RibbonToggle>
                    <RibbonToggle active={underline} onClick={() => setUnderline((v) => !v)}>
                      <Underline className="w-4 h-4" />
                    </RibbonToggle>
                  </RibbonToggleGroup>
                  <RibbonToggleGroup>
                    <RibbonToggle active={align === 'left'} onClick={() => setAlign('left')}>
                      <AlignLeft className="w-4 h-4" />
                    </RibbonToggle>
                    <RibbonToggle active={align === 'center'} onClick={() => setAlign('center')}>
                      <AlignCenter className="w-4 h-4" />
                    </RibbonToggle>
                    <RibbonToggle active={align === 'right'} onClick={() => setAlign('right')}>
                      <AlignRight className="w-4 h-4" />
                    </RibbonToggle>
                  </RibbonToggleGroup>
                  <RibbonColorPicker
                    colors={['#7A2E3C', '#C8A464', '#2C2C2C', '#8B8B6E', '#5A8F6E', '#B54A4A', '#5A7A9A', '#C4943F', '#E0DCD5', '#FFFFFF']}
                  />
                </RibbonGroup>

                <RibbonGroup title="Styles">
                  <RibbonButton icon={<Paintbrush className="w-5 h-5" />} label="Format" />
                  <RibbonButton icon={<Type className="w-5 h-5" />} label="Styles" dropdown />
                </RibbonGroup>

                <RibbonGroup title="Actions">
                  <RibbonButton icon={<Undo2 className="w-5 h-5" />} label="Undo" />
                  <RibbonButton icon={<Redo2 className="w-5 h-5" />} label="Redo" />
                </RibbonGroup>
              </RibbonPanel>

              <RibbonPanel tabId="insert">
                <RibbonGroup title="Insert">
                  <span className="text-body-xs text-nahkya-text-secondary font-body whitespace-nowrap">
                    Insert panel placeholder.
                  </span>
                </RibbonGroup>
              </RibbonPanel>

              <RibbonPanel tabId="design">
                <RibbonGroup title="Design">
                  <span className="text-body-xs text-nahkya-text-secondary font-body whitespace-nowrap">
                    Design panel placeholder.
                  </span>
                </RibbonGroup>
              </RibbonPanel>

              <RibbonPanel tabId="layout">
                <RibbonGroup title="Layout">
                  <span className="text-body-xs text-nahkya-text-secondary font-body whitespace-nowrap">
                    Layout panel placeholder.
                  </span>
                </RibbonGroup>
              </RibbonPanel>

              <RibbonPanel tabId="review">
                <RibbonGroup title="Review">
                  <span className="text-body-xs text-nahkya-text-secondary font-body whitespace-nowrap">
                    Review panel placeholder.
                  </span>
                </RibbonGroup>
              </RibbonPanel>
            </RibbonBody>
          </Ribbon>
        </section>
      </div>
    </div>
  );
}
