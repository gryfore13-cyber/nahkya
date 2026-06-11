# Design System Comparison: Nahkya vs. Atelier

> A structured audit of what each system does better, with actionable recommendations.

---

## 1. What Nahkya Does Better

### A. Production Architecture
| Aspect | Nahkya | Atelier |
|--------|--------|---------|
| Framework | React 19 + TypeScript + Vite | Static HTML + vanilla JS |
| Styling | Tailwind CSS + bespoke `.nk-*` CSS | Pure CSS custom properties |
| Component Library | shadcn/ui (40+ accessible primitives) | Hand-rolled HTML examples |
| State Management | Zustand stores synced to Firestore | None |
| Backend | Firebase Auth + Firestore + Storage | None |

**Verdict:** Nahkya is a deployable application. Atelier is a reference document. Nahkya's shadcn/ui foundation gives you Dialog, Sheet, DropdownMenu, Tabs, Accordion, Slider, etc. out of the box — battle-tested and accessible.

### B. Component Depth (`.nk-*` classes)
Nahkya's `nahkya-v10.css` has **~409 bespoke component classes** covering:
- `.nk-workspace`, `.nk-canvas-safe-area`, `.nk-canvas-grid` — studio tool canvas system
- `.nk-slider`, `.nk-slider-field`, `.nk-slider-ticks` — custom range sliders
- `.nk-toggle` — accessible toggle switches with ARIA support
- `.nk-select-control` — custom selects
- `.nk-table-wrap`, `.nk-table-card-list` — responsive tables (card fallback on mobile)
- `.nk-alert`, `.nk-status` — status badges with color variants
- `.nk-modal-overlay`, `.nk-modal` — modal system
- `.nk-empty-state`, `.nk-empty-icon` — zero-state patterns
- `.nk-tool-button`, `.nk-canvas-control` — studio tool controls
- `.nk-luxury-panel` — premium panel variant

**Verdict:** Nahkya has deeper component coverage for its actual use case (fashion design studio). Atelier covers UI basics but lacks studio-specific patterns.

### C. Fluid Typography
| System | Approach |
|--------|----------|
| Nahkya | `clamp()`-based fluid type scale (`text-display-xl` through `text-body-3xs`) |
| Atelier | Fixed pixel values (`--text-hero: 56px`, `--text-h1: 40px`) |

Nahkya's `clamp(2.25rem, 1.5rem + 4vw, 6rem)` scales smoothly from mobile to 4K without breakpoint jumps. Atelier uses breakpoint overrides (separate mobile tab in the type specimen).

### D. Dark Mode Integration
| System | Approach |
|--------|----------|
| Nahkya | `data-surface="dark"` attribute remaps **all** semantic tokens instantly |
| Atelier | `data-theme="dark"` remaps base colors only |

Nahkya's dark mode is surgical — every token (`--nahkya-accent-subtle`, `--nahkya-success-subtle`, `--nahkya-olive`) has a dark variant. Atelier's dark mode is lighter on coverage.

### E. Shadow & Elevation System
| System | Shadows |
|--------|---------|
| Nahkya | Warm gold-tinted shadows (`--shadow-soft: 0 24px 80px rgba(154, 110, 48, 0.16)`) |
| Atelier | Neutral gray shadows (`0 4px 12px rgba(44,44,44,0.06)`) |

Nahkya's shadows carry the brand's warmth. Atelier's shadows are generic.

### F. Real-World Templates
Nahkya has **18 production homepage section templates** (Hero, Editorial, Product Showcase, Collection Preview, How It Works, Lookbook, Benefits, Testimonials, FAQ, CTA, etc.) all wired to Firestore with inline editing.

Atelier has component demos but no page-level templates.

### G. Accessibility Infrastructure
| Feature | Nahkya | Atelier |
|---------|--------|---------|
| `prefers-reduced-motion` | Supported in stores + CSS | Mentioned in JS snippet only |
| `focus-visible` | Every interactive element | Partial |
| ARIA attributes | Full (tabs, toggles, modals) | Basic |
| Semantic HTML | Enforced (shadcn primitives) | Manual |

---

## 2. What Atelier Does Better

### A. Component Demonstrations (Interactive Guide)
Atelier is a **complete interactive style guide** in one file. Every component shows every state:
- Button variants × sizes × states (loading, disabled)
- Form inputs with error/success/validation states side-by-side
- Alert types (success, error, warning, info) with dismiss actions
- Modal types (confirmation, warning, destructive, success)
- Toast notifications with auto-dismiss
- Live copy-to-clipboard on color swatches

**Nahkya has no equivalent living style guide.** The components exist but aren't demonstrated in one browsable place.

### B. Word-Style Ribbon Toolbar
Atelier includes a sophisticated **Microsoft Word-style ribbon**:
- Tabbed interface (Home, Insert, Design, Layout, contextual Picture Tools)
- Command groups with labeled sections
- Split buttons (Paste + dropdown arrow)
- Toggle button groups (Bold/Italic/Underline/Strike)
- Font family + size dropdowns
- Color picker swatches
- Dropdown menus within buttons

**Nahkya has no ribbon pattern.** Its admin toolbar is a simple top bar.

### C. Sidebar Menu Variants
Atelier demonstrates **three sidebar variants**:
1. **Expanded** — sections, nested submenus with chevrons, notification badges, active indicators
2. **Icon-only** — 64px width, icons centered, labels hidden
3. **Collapsible** — toggle between expanded and icon-only with animated transition

Nahkya's sidebar (`nk-sidebar`, `nk-sidebar-link`) is functional but doesn't demonstrate collapsible or icon-only modes in the codebase.

### D. Navigation Components Nahkya Lacks
| Component | Atelier | Nahkya |
|-----------|---------|--------|
| Breadcrumbs | ✅ Full implementation | ❌ Missing |
| Step navigation | ✅ (numbered circles + connectors) | ❌ Missing |
| Tooltips | ✅ Hover-triggered with arrow | ❌ Missing |
| Search bar | ✅ With icon + pill shape | ❌ Missing |
| Upload zone | ✅ Drag-over state + icon | ❌ Missing |
| Range slider | ✅ Custom thumb + fill track | ✅ (`nk-slider` exists) |
| Code blocks | ✅ Syntax-highlighted | ❌ Missing |
| Token tables | ✅ Reference documentation | ❌ Missing |

### E. Color Swatch System
Atelier's color grid has **hover-to-reveal hex values** + **click-to-copy** with toast confirmation. It's a practical developer tool.

Nahkya's colors are buried in CSS variables with no visual reference.

### F. Token Organization
Atelier's tokens are **more granular and better categorized**:
```css
/* Atelier: explicit semantic mapping */
--color-success: #5A8F6E;
--color-success-bg: #E8F0EC;
--color-warning: #C4943F;
--color-warning-bg: #F5ECD8;

/* Nahkya: subtle variants only */
--nahkya-success: #2F7D4F;
--nahkya-success-subtle: #E0F0E5;
```

Atelier separates the **foreground** color from the **background tint** explicitly (`-bg` suffix). Nahkya uses `-subtle` which is less self-documenting.

### G. Editor Canvas Demo
Atelier includes a **design tool canvas** with:
- Dot grid background pattern
- Centered preview area
- Draggable element with resize handle
- Selection outline (dashed)
- Tool buttons with tooltips

Nahkya has a more sophisticated real canvas system (`nk-workspace`, `nk-canvas-grid`) but it's not demonstrated as a standalone reference.

---

## 3. Color Palette Comparison

| Role | Nahkya | Atelier | Assessment |
|------|--------|---------|------------|
| Primary | `#7B1E2B` (deeper burgundy) | `#7A2E3C` (slightly lighter) | Atelier is more accessible (higher luminance) |
| Accent/Gold | `#9A6E30` (bronze) | `#C8A464` (brighter gold) | Atelier reads more "luxury" |
| Background | `#F5EDE3` (warm peach) | `#F8F5F0` (cooler ivory) | Nahkya is warmer; Atelier is cleaner |
| Surface | `#FFF9F2` (cream) | `#EDE8E0` (beige) | Nahkya is lighter; Atelier has more contrast |
| Text | `#2A1F1A` (warm black) | `#2C2C2C` (neutral charcoal) | Nahkya is warmer |
| Border | `#D4C4B0` (tan) | `#E0DCD5` (gray-tan) | Nahkya is warmer |
| Error | `#B42318` (deep red) | `#B54A4A` (lighter red) | Comparable |
| Success | `#2F7D4F` (forest) | `#5A8F6E` (sage) | Atelier is softer |

**Overall:** Nahkya's palette is warmer and more cohesive (everything leans peach/gold). Atelier's palette is cleaner and more neutral, with better contrast for accessibility.

---

## 4. Specific Recommendations

### Adopt from Atelier into Nahkya:

1. **Build a living style guide page** (`/admin/global` or `/style-guide`) that renders every `.nk-*` class with all states — similar to Atelier's interactive demo.

2. **Add breadcrumb, step navigation, and tooltip components** — Nahkya doesn't have these.

3. **Consider Atelier's gold `#C8A464`** for highlights — it's brighter and more "luxury" than Nahkya's current `#9A6E30`.

4. **Add the `-bg` suffix convention** for semantic background tints (`--nahkya-error-bg` alongside `--nahkya-error-subtle`) for clearer intent.

5. **Create a ribbon toolbar variant** for the studio tools — the current top bar is too simple for a design application.

6. **Add collapsible sidebar support** with animated width transition (`w-[80px]` ↔ `w-[260px]`).

### Keep from Nahkya:

1. **Tailwind + shadcn architecture** — don't replace with pure CSS.
2. **Fluid typography** — keep `clamp()`, don't go back to fixed sizes.
3. **Firestoresync + Zustand** — the config-driven approach is powerful.
4. **Gold-tinted shadows** — they reinforce brand warmth.
5. **Studio-specific components** — canvas, color picker, zoom controls, etc.
6. **18 homepage templates** — these are production assets, not demos.

---

## 5. Summary

| Dimension | Winner | Reason |
|-----------|--------|--------|
| Production readiness | **Nahkya** | Full React app with auth, database, 18 templates |
| Component depth | **Nahkya** | 409 `.nk-*` classes vs. Atelier's demo set |
| Interactive documentation | **Atelier** | Living style guide with every state visible |
| Toolbar/sidebar patterns | **Atelier** | Ribbon, collapsible sidebar, breadcrumbs |
| Typography | **Nahkya** | Fluid `clamp()` vs. fixed pixels |
| Color warmth | **Nahkya** | Cohesive peach/gold throughout |
| Color accessibility | **Atelier** | Better contrast ratios, cleaner neutrals |
| Dark mode | **Nahkya** | More comprehensive token remapping |
| Studio tool UI | **Nahkya** | Canvas, sliders, color pickers, zoom controls |
| Navigation components | **Atelier** | Steps, breadcrumbs, tooltips, search |

**Bottom line:** Nahkya is the superior **production system**. Atelier is the superior **reference and exploration document**. The ideal path is to augment Nahkya with Atelier's missing navigation components and build a living style guide page that documents all `.nk-*` classes interactively.
