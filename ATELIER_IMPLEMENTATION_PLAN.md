# Atelier Design System — Implementation Priority

> Ordered by dependency and impact. Build from the outside in: layout → core UI → data display → specialized tools.

---

## PHASE 1: Layout Foundation ✅ COMPLETE
These are the structural shells. Every page depends on them.

| # | Component | Status | Files |
|---|-----------|--------|-------|
| 1 | **Enhanced Sidebar** | ✅ Built & integrated | `AtelierSidebar.tsx`, `AdminSidebar.tsx`, `MemberSidebar.tsx`, `DesignerSidebar.tsx` |
| 2 | **Top Bar / Navbar** | ✅ Built | `AtelierTopBar.tsx` |
| 3 | **Breadcrumbs** | ✅ Built | `Breadcrumbs.tsx` |
| 4 | **Ribbon Toolbar** | ✅ Built | `RibbonToolbar.tsx` |
| 5 | **Theme Toggle** | ✅ Built & wired | `ThemeToggle.tsx`, `themeStore.ts` |

### What was done
- **AtelierSidebar**: Replaces `IconRailSidebar` across all 3 portals (admin, member, designer). Supports expanded (280px) / collapsed (64px) states with animated width transition. Sections with titles, items with icons/labels, nested submenus with chevron expand/collapse, badge counts, active state with left accent border, user profile footer with logout. CSS in `nahkya-v10.css` §44.
- **AtelierTopBar**: Sticky header with `backdrop-blur-md`, title + subtitle slots, left/right action slots, optional ribbon toolbar row beneath main bar. Theme toggle built into right actions.
- **Breadcrumbs**: Home icon + chevron-separated trail with active page highlight. Reuses existing page labels.
- **RibbonToolbar**: Container with labeled groups separated by vertical dividers. Includes `RibbonButton` (icon + label, vertical stack) and `RibbonAction` (icon + label, horizontal pill) helpers.
- **ThemeToggle**: Sun/Moon icon button. Uses `themeStore.ts` (Zustand) with `localStorage` persistence and `matchMedia` fallback. Sets `data-theme` attribute on `document.documentElement`. All portals and studio tools now respect this attribute.
- **Layout migration**: `AdminLayout`, `MemberLayout`, `DesignerLayout` all updated to use new sidebar with collapse state and dynamic margin (`ml-sidebar-expanded` / `ml-sidebar-collapsed`). Mobile Sheet drawer preserved.
- **CSS tokens added**: `--space-*` scale (`xs` through `3xl`) in `index.css`. `sidebar-expanded` (280px) and `sidebar-collapsed` (64px) in `tailwind.config.js`.

---

## PHASE 2: Core UI Components ✅ COMPLETE
These are the most frequently used across all pages. Build once, use everywhere.

| # | Component | Status | Files |
|---|-----------|--------|-------|
| 6 | **Cards** | ✅ Built | `AtelierCard.tsx` — default, elevated (hover lift + shadow), feature (left accent border), image (aspect-ratio image with hover zoom) |
| 7 | **Empty States** | ✅ Built | `AtelierEmptyState.tsx` — icon circle, title, description, action slot |
| 8 | **Alerts** | ✅ Built | `AtelierAlert.tsx` — left-border color-coded: default, success, error, warning, info |
| 9 | **Tabs** | ✅ Built | `AtelierTabs.tsx` — underline style with animated `::after` indicator, plus standard variant |
| 10 | **Buttons** | ✅ Built | `AtelierButton.tsx` — primary, secondary, outline, ghost, destructive, accent, dark-primary, dark-ghost. Sizes: lg, md, sm, icon-only. Loading + icon support. |
| 11 | **Dashboard Widgets** | ✅ Built | `AtelierDashboardWidget.tsx` — stat card with left accent border, icon, change indicator (up/down arrow + percentage) |
| 12 | **Toast Notifications** | ✅ Updated | `sonner.tsx` — now reads theme from `themeStore`, uses Nahkya CSS vars for bg/text/border |

### Notes
- **Form elements**: shadcn/ui `Input`, `Select`, `Textarea`, `Checkbox`, `Switch`, `RadioGroup` already exist and inherit Nahkya tokens via CSS variables. No wrapper needed unless custom styling is required later.
- **Modals/Dialogs**: shadcn/ui `Dialog`, `AlertDialog`, `Sheet` already exist and use Nahkya tokens. Custom confirmation wrappers can be built per-page as needed.
- **LuxuryButton** is kept in place (15 imports across codebase). `AtelierButton` is the forward-looking replacement for new code.

---

## PHASE 3: Data Display & Status ✅ COMPLETE
These fill the admin dashboard, tables, and lists.

| # | Component | Status | Files |
|---|-----------|--------|-------|
| 14 | **Tables** | ✅ Built | `AtelierTable.tsx` — `Table`, `Header`, `Body`, `Row`, `Head`, `Cell` sub-components. Clean hover (`hover:bg-nahkya-bg`), minimal borders, rounded container. |
| 15 | **Badges** | ✅ Built | `AtelierBadge.tsx` — 12 variants: default, pending, approved, rejected, featured, active, inactive, success, error, warning, info, outline. Optional dot indicator. |
| 16 | **Dashboard Widgets** | ✅ Built in Phase 2 | `AtelierDashboardWidget.tsx` |
| 17 | **Empty States** | ✅ Built in Phase 2 | `AtelierEmptyState.tsx` |
| 18 | **Skeletons** | ✅ Fixed via token remap | shadcn `Skeleton` now inherits `--accent` = `#EDE8E0` (warm surface) |
| 19 | **Alerts** | ✅ Built in Phase 2 | `AtelierAlert.tsx` |

---

## PHASE 4: Specialized / Studio Tools ✅ COMPLETE
These are tool-specific and only appear in niche contexts.

| # | Component | Status | Files |
|---|-----------|--------|-------|
| 20 | **Editor Canvas** | ⏭️ Skipped | Studio tools already have canvas areas in `StudioShell.tsx` |
| 21 | **Upload Zone** | ✅ Built | `AtelierUploadZone.tsx` — drag-over highlight, dashed border, file list with remove, type/size filtering |
| 22 | **Range Slider** | ✅ Verified | shadcn `Slider` already uses Nahkya tokens (`bg-primary` = accent, `bg-muted` = surface) |
| 23 | **Tooltip System** | ✅ Verified | shadcn `Tooltip` uses `bg-foreground text-background` → dark tooltip on light, light on dark. Works. |
| 24 | **Step Navigation** | ✅ Built | `AtelierStepNav.tsx` — numbered circles, connector lines, completed checkmark, current accent ring |
| 25 | **Search Bar** | ✅ Built | `AtelierSearchBar.tsx` — pill-shaped input with search icon, clear button, focus ring |
| 26 | **Code Blocks** | ⏭️ Skipped | Very niche — no current need |

---

## Suggested Order of Attack

### Week 1: Layout Shell
1. Sidebar variants (icon-only + collapsible)
2. Navbar (blur backdrop + scroll shadow)
3. Breadcrumbs
4. Theme toggle

### Week 2: Core Components
5. Cards (all 3 variants)
6. Modals (all 4 variants)
7. Toasts
8. Tabs
9. Buttons (complete set)
10. Form elements (input, select, toggle, checkbox, radio)

### Week 3: Admin & Data
11. Tables
12. Badges
13. Dashboard widgets
14. Empty states + skeletons
15. Alerts

### Week 4: Studio Polish
16. Editor canvas
17. Upload zone
18. Range slider
19. Tooltips
20. Step nav

---

## What Can Be Skipped Entirely?

| Component | Reason |
|-----------|--------|
| **Token reference tables** | Internal docs — no user-facing value |
| **Spacing scale demo** | Same — visual reference only |
| **Shadow grid demo** | Reference only |
| **Type specimen tabs** | Reference only |

These are all **documentation chrome** in the guide, not production components.
