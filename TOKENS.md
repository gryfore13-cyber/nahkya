# Haus of Nahkya — Complete Design Token Reference

> Single source of truth for all CSS custom properties, Tailwind tokens, and global utility classes.  
> When adding new styles, check this file first. If a token doesn't exist, add it here before using it in code.

---

## 1. Colour Tokens (CSS Custom Properties)

### Nahkya Brand Palette (Light Theme)

| Token | Variable | Hex | Tailwind Class |
|-------|----------|-----|----------------|
| Ivory | `--nahkya-ivory` | `#F5EDE3` | `bg-nahkya-ivory`, `text-nahkya-ivory` |
| Cream | `--nahkya-cream` | `#EDE5DA` | `bg-nahkya-cream`, `text-nahkya-cream` |
| Stone | `--nahkya-stone` | `#DCC6A1` | `bg-nahkya-stone`, `text-nahkya-stone` |
| Taupe | `--nahkya-taupe` | `#9A8A7A` | `bg-nahkya-taupe`, `text-nahkya-taupe` |
| Sand | `--nahkya-sand` | `#B89A7A` | `bg-nahkya-sand`, `text-nahkya-sand` |
| Charcoal | `--nahkya-charcoal` | `#2C2420` | `bg-nahkya-charcoal`, `text-nahkya-charcoal` |
| Soft Black | `--nahkya-soft-black` | `#1A1A1E` | `bg-nahkya-soft-black`, `text-nahkya-soft-black` |
| Gold | `--nahkya-gold` | `#B88B4A` | `bg-nahkya-gold`, `text-nahkya-gold` |
| Gold Light | `--nahkya-gold-light` | `#D4B896` | `bg-nahkya-gold-light`, `text-nahkya-gold-light` |
| Gold Muted | `--nahkya-gold-muted` | `#9A7B52` | `bg-nahkya-gold-muted`, `text-nahkya-gold-muted` |
| Text Secondary | `--nahkya-text-secondary` | `#8A7A6E` | `text-nahkya-text-secondary` |
| Error | `--nahkya-error` | `#DC2626` | `bg-nahkya-error`, `text-nahkya-error` |
| Error Light | `--nahkya-error-light` | `#F5E0DC` | `bg-nahkya-error-light` |
| Success | `--nahkya-success` | `#16A34A` | `bg-nahkya-success`, `text-nahkya-success` |
| Success Light | `--nahkya-success-light` | `#E0F0E5` | `bg-nahkya-success-light` |
| Rose | `--nahkya-rose` | `#A65D6B` | `bg-nahkya-rose`, `text-nahkya-rose` |
| Teal | `--nahkya-teal` | `#5A8A8A` | `bg-nahkya-teal`, `text-nahkya-teal` |
| Fuchsia | `--nahkya-fuchsia` | `#8A5A8A` | `bg-nahkya-fuchsia`, `text-nahkya-fuchsia` |

### Workspace Palette (Dark Theme — Studio/Member)

| Token | Variable | Hex | Tailwind Class |
|-------|----------|-----|----------------|
| Workspace BG | `--workspace-bg` | `#0C0C10` | `bg-workspace-bg` |
| Workspace Sidebar | `--workspace-sidebar` | `#13131A` | `bg-workspace-sidebar` |
| Workspace Panel | `--workspace-panel` | `#1A1A22` | `bg-workspace-panel` |
| Workspace Border | `--workspace-border` | `#2A2A35` | `border-workspace-border` |
| Workspace Hover | `--workspace-hover` | `#252530` | `bg-workspace-hover` |

### shadcn/ui Base Tokens

| Token | HSL Value | Purpose |
|-------|-----------|---------|
| `--background` | `0 0% 100%` | Page background |
| `--foreground` | `240 10% 8%` | Primary text |
| `--primary` | `42 62% 56%` | Primary accent (matches nahkya-gold) |
| `--secondary` | `30 9% 89%` | Secondary surface |
| `--muted` | `30 9% 89%` | Muted surface |
| `--accent` | `30 9% 89%` | Accent surface |
| `--destructive` | `7 47% 53%` | Error/destructive |
| `--border` | `30 9% 89%` | Default borders |
| `--input` | `30 9% 89%` | Form input borders |
| `--ring` | `42 62% 56%` | Focus ring (matches nahkya-gold) |
| `--radius` | `2px` | Default border radius |

---

## 2. Typography Tokens (CSS Custom Properties)

### Font Families

| Token | Font Stack | Tailwind Class |
|-------|-----------|----------------|
| Display | `"Playfair Display", serif` | `font-display` |
| Body | `Lora, serif` | `font-body` |
| Mono | `"IBM Plex Mono", monospace` | `font-mono` |

### Font Sizes (Dynamic CSS Variables)

| Token | Variable | Default Value | Tailwind Class |
|-------|----------|---------------|----------------|
| Display XXL | `--font-display-xxl` | `4.5rem` | `text-dynamic-display-xxl` |
| Display XL | `--font-display-xl` | `3.75rem` | `text-dynamic-display-xl` |
| Display LG | `--font-display-lg` | `3rem` | `text-dynamic-display-lg` |
| Display MD | `--font-display-md` | `2.25rem` | `text-dynamic-display-md` |
| Display SM | `--font-display-sm` | `1.875rem` | `text-dynamic-display-sm` |
| Heading LG | `--font-heading-lg` | `1.5rem` | `text-dynamic-heading-lg` |
| Heading MD | `--font-heading-md` | `1.25rem` | `text-dynamic-heading-md` |
| Mono LG | `--font-mono-lg` | `1.125rem` | `text-dynamic-mono-lg` |
| Mono MD | `--font-mono-md` | `1rem` | `text-dynamic-mono-md` |
| Mono SM | `--font-mono-sm` | `0.875rem` | `text-dynamic-mono-sm` |

### Static Font Size Tokens (Tailwind)

| Token | Size / Line Height | Purpose |
|-------|-------------------|---------|
| `text-display-mega` | `200px` / 0.85 | Massive hero |
| `text-display-xxxl` | `120px` / 0.9 | Extra large hero |
| `text-display-xxl` | `96px` / 0.95 | Hero headline |
| `text-display-xl` | `72px` / 0.98 | Page title |
| `text-display-lg` | `56px` / 1.05 | Large quote |
| `text-display-md` | `40px` / 1.1 | Section headline |
| `text-display-sm` | `32px` / 1.15 | Sub-headline |
| `text-display-xs` | `52px` / 1.0 | Medium display |
| `text-heading-lg` | `24px` / 1.3 | Card title |
| `text-heading-md` | `20px` / 1.35 | Small heading |
| `text-heading-sm` | `28px` / 1.2 | Section subhead |
| `text-body-lg` | `17px` / 1.5 | Large body |
| `text-body-md` | `15px` / 1.5 | Standard body |
| `text-body-sm` | `13px` / 1.5 | Small UI text |
| `text-body-xs` | `12px` / 1.5 | Caption |
| `text-body-2xs` | `11px` / 1.5 | Fine print |
| `text-body-3xs` | `10px` / 1.4 | Label/meta |
| `text-mono-lg` | `13px` / 1.4 | Large mono |
| `text-mono-md` | `12px` / 1.4 | Standard mono |
| `text-mono-sm` | `10px` / 1.4 | Small mono |

---

## 3. Spacing Tokens

### Layout

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| Sidebar (admin) | `260px` | `w-sidebar-admin` |
| Sidebar (member) | `240px` | `w-sidebar-member` |
| Panel (studio) | `280px` | `w-panel-studio` |
| Panel (inspector) | `330px` | `w-panel-inspector` |
| Panel (preview) | `380px` | `w-panel-preview` |
| Nav height | `72px` | `h-nav` |
| Toolbar height | `74px` | `h-toolbar` |

### Buttons

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| Button small | `36px` | `h-button-sm` |
| Button standard | `44px` | `h-button` |
| Button large | `52px` | `h-button-lg` |

### Max Width

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| Container | `1520px` | `max-w-container` |
| Content | `600px` | `max-w-content` |
| Content LG | `640px` | `max-w-content-lg` |
| Prose | `560px` | `max-w-prose` |
| Tablet | `760px` | `max-w-tablet` |
| Editor | `1120px` | `max-w-editor` |
| Canvas | `500px` | `max-w-canvas` |
| Stage source | `400px` | `max-w-stage-source` |
| Stage preview | `520px` | `max-w-stage-preview` |

---

## 4. Border Radius

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| Nahkya (default) | `2px` | `rounded-nahkya` |
| XS | calc(2px - 6px) ≈ `0px` | `rounded-xs` |
| SM | calc(2px - 4px) ≈ `0px` | `rounded-sm` |
| MD | calc(2px - 2px) ≈ `0px` | `rounded-md` |
| LG | `2px` | `rounded-lg` |
| XL | calc(2px + 4px) = `6px` | `rounded-xl` |
| 2XL | `1rem` (16px) | `rounded-2xl` |
| 3XL | `1.5rem` (24px) | `rounded-3xl` |
| 4XL | `2rem` (32px) | `rounded-4xl` |

---

## 5. Shadow Tokens

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| Gold focus | `0 0 0 3px rgba(184,139,74,0.25)` | `shadow-gold-focus` |
| Gold glow | `0 0 12px rgba(184,139,74,0.65)` | `shadow-gold-glow` |
| Gold glow soft | `0 0 12px rgba(184,139,74,0.45)` | `shadow-gold-glow-soft` |
| Gold shadow (CSS var) | `0 4px 20px rgba(184,139,74,0.15)` | `--shadow-gold` |

---

## 6. Z-Index Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| Behind | `-10` | `z-behind` |
| Content | `10` | `z-content` |
| Dropdown | `20` | `z-dropdown` |
| Toolbar | `30` | `z-toolbar` |
| Nav | `50` | `z-nav` |
| Modal | `60` | `z-modal` |
| Toast | `80` | `z-toast` |
| Loading | `100` | `z-loading` |

---

## 7. Global Utility Classes (`index.css`)

### `@layer base`

```css
body {
  background-color: var(--nahkya-ivory);
  color: var(--nahkya-charcoal);
}

::selection {
  background-color: rgba(184, 139, 74, 0.3);
  color: var(--nahkya-charcoal);
}
```

### `@layer components`

| Class | Definition | Purpose |
|-------|-----------|---------|
| `.section-padding` | `px-5 sm:px-8 lg:px-12 xl:px-20` | Standard section horizontal padding |
| `.container-nahkya` | `max-w-container mx-auto section-padding` | Max-width container |
| `.workspace-scroll` | Custom thin scrollbar | Dark theme scrollbars |

### `@layer utilities`

| Class | Definition | Purpose |
|-------|-----------|---------|
| `.text-balance` | `text-wrap: balance` | Balanced text wrapping |
| `.text-shadow-hero-label` | `0 1px 12px rgba(0,0,0,0.4)` | Hero label shadow |
| `.text-shadow-hero-title` | `0 4px 40px rgba(0,0,0,0.5)` | Hero title shadow |
| `.text-shadow-hero-subtitle` | `0 2px 16px rgba(0,0,0,0.4)` | Hero subtitle shadow |
| `.scrollbar-hide` | Hide scrollbar | Hidden scrollbars |
| `.drop-shadow-canvas` | `drop-shadow(0 8px 32px rgba(0,0,0,0.3))` | Canvas shadow |
| `.rotate-card` | `transform: rotate(5deg)` | Card rotation |
| `.text-dynamic-display-xxl` → `text-dynamic-mono-sm` | `font-size: var(--font-*)` | Dynamic typography |

---

## 8. Animation Keyframes

| Name | Behaviour | Tailwind Class |
|------|-----------|----------------|
| `accordion-down` | Height 0 → content height | `animate-accordion-down` |
| `accordion-up` | Content height → 0 | `animate-accordion-up` |
| `shimmer` | Background position slide | `animate-shimmer` |
| `scroll-bounce` | `translateY` oscillation | `animate-scroll-bounce` |
| `pulse-soft` | Opacity 0.4 → 1 | `animate-pulse-soft` |
| `spin-slow` | 360° rotation over 2s | `animate-spin-slow` |

---

## 9. Semantic Class Names (in use)

Used for QA, testing, and component identification. These classes carry **no CSS rules** — they are purely semantic markers.

| Class | Where Used | Meaning |
|-------|-----------|---------|
| `PageShell` | `PageAtelier`, admin pages | Root page wrapper |
| `PanelTitle` | Admin panels | Sidebar/inspector heading |
| `PanelSubtitle` | Admin panels | Panel description text |
| `CanvasSurface` | `PageAtelier` | Preview canvas area |
| `ComponentLibrary` | `PageAtelier` | Left sidebar (sections list) |
| `InspectorPanel` | `PageAtelier` | Right sidebar (edit form) |
| `ComponentCard` | Component library | Add-component button |
| `PreviewFrame` | `PageAtelier` | Device preview container |
| `BlockSurface` | Block previews | Individual block wrapper |
| `data-semantic` | Section renderer | HTML5 data attribute for hierarchy |

---

## 10. Section Palette Map (`SectionWrapper`)

| Palette Name | Primary | Background |
|-------------|---------|-----------|
| `burgundy` | `#2C2420` | `#EDE5DA` |
| `gold` | `#B88B4A` | `#F5EDE3` |
| `taupe` | `#9A8A7A` | `#EDE5DA` |
| `champagne` | `#9A7B52` | `#F5EDE3` |
| `rose` | `#A65D6B` | `#EDE5DA` |
| `teal` | `#5A8A8A` | `#F5EDE3` |
| `stone` | `#DCC6A1` | `#F5EDE3` |
| `fuchsia` | `#8A5A8A` | `#EDE5DA` |
| `neutral` | `#2C2420` | `#DCC6A1` |

---

## 11. Rule: When to Add a New Token

1. **Check this file first.** If a token exists, use it.
2. **Never use raw hex** in class strings (`#F5EDE3` → `bg-nahkya-ivory`).
3. **Never use arbitrary Tailwind values** (`w-[247px]`, `text-[13px]`). Add a token to `tailwind.config.js` instead.
4. **Never use inline styles** except for runtime canvas positioning (zoom, drag, dynamic geometry).
5. **Always use `cn()`** for conditional class merging.

---

*Generated: 2026-05-28*  
*If you modify tokens in `tailwind.config.js` or `index.css`, update this file.*
