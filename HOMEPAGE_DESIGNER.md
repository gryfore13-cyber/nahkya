# Homepage Section Designer — Documentation

> A dynamic, modular homepage management system for Haus of Nahkya. Built on top of the existing 18 section templates, Firestore-backed config sync, and Framer Motion animations.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Model / Schema](#data-model--schema)
3. [Public Homepage Renderer](#public-homepage-renderer)
4. [Admin Editor Structure](#admin-editor-structure)
5. [Section Templates](#section-templates)
6. [Animation System](#animation-system)
7. [Publishing Workflow](#publishing-workflow)
8. [Responsive Behavior](#responsive-behavior)
9. [Adding New Section Templates](#adding-new-section-templates)
10. [Example Seed Data](#example-seed-data)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FIRESTORE (config/homepage)              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  HomepageConfig { sections[], metaTitle, metaDesc } │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    ┌───────────────────┐           ┌───────────────────┐
    │  homeContentStore │           │  Public Home Page │
    │  (Zustand)        │           │  (Framer Motion)  │
    └───────────────────┘           └───────────────────┘
              │                               │
              ▼                               ▼
    ┌───────────────────┐           ┌───────────────────┐
    │  Admin Builder    │           │  SectionWrapper   │
    │  (3-panel editor) │           │  + TemplateRenderer│
    └───────────────────┘           └───────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `src/types/homepage.ts` | All types, defaults, and the `getDefaultContent()` factory |
| `src/stores/homeContentStore.ts` | Zustand store with CRUD + publishing actions |
| `src/pages/public/Home.tsx` | Public homepage — filters `published`, renders with animations |
| `src/components/homepage/SectionWrapper.tsx` | Theming, padding, layout tokens, animation props |
| `src/components/homepage/TemplateRenderer.tsx` | Lazy-loads the correct section component by `templateType` |
| `src/components/admin/AdminHomepageBuilder.tsx` | Main 3-panel orchestrator |
| `src/components/admin/SectionListSidebar.tsx` | Left sidebar with @dnd-kit drag-and-drop |
| `src/components/admin/SectionSettingsPanel.tsx` | Right panel with tabs: Content, Layout, Style, Animation, Responsive |
| `src/components/admin/HomepagePreview.tsx` | Center scrollable preview with device frames |

---

## Data Model / Schema

### HomepageSection (extended from original)

```typescript
interface HomepageSectionBase {
  id: string;
  order: number;
  name?: string;
  settings: SectionSettings;
  status: 'draft' | 'published' | 'hidden';
  animation: SectionAnimation;
  media?: SectionMediaSettings;
  responsive?: SectionResponsiveSettings;
  createdAt?: string;
  updatedAt?: string;
}
```

### SectionSettings (extended)

```typescript
interface SectionSettings {
  backgroundColor: string;
  textColor: string;
  padding: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth: boolean;
  isVisible: boolean;
  // NEW — layout & style controls
  containerWidth?: 'narrow' | 'default' | 'wide' | 'full';
  contentAlignment?: 'top' | 'center' | 'bottom';
  textAlign?: 'left' | 'center' | 'right';
  borderStyle?: 'none' | 'subtle' | 'accent';
  shadow?: 'none' | 'soft' | 'card' | 'gold';
  divider?: 'none' | 'subtle' | 'accent';
  imageShape?: 'rectangle' | 'rounded' | 'circle' | 'arch';
  mediaPosition?: 'left' | 'right' | 'background' | 'top' | 'bottom';
  overlayOpacity?: number;
  mobileLayout?: 'stacked' | 'twoColumn';
  mobileTextAlign?: 'left' | 'center' | 'right';
}
```

### SectionAnimation

```typescript
interface SectionAnimation {
  type: 'none' | 'fadeIn' | 'slideUp' | 'softReveal' | 'staggeredCards'
       | 'imageParallax' | 'gentleScale' | 'sectionOverlap' | 'softDivider';
  duration: 'fast' | 'normal' | 'slow';
  delay: number; // milliseconds
}
```

### SectionResponsiveSettings

```typescript
interface ResponsiveBreakpointSettings {
  layout?: 'stacked' | 'twoColumn' | 'overlay' | 'grid' | 'carousel';
  textAlign?: 'left' | 'center' | 'right';
  imageAspectRatio?: 'auto' | '1:1' | '4:3' | '3:4' | '4:5' | '16:9';
  hideImage?: boolean;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

interface SectionResponsiveSettings {
  mobile?: ResponsiveBreakpointSettings;
  tablet?: ResponsiveBreakpointSettings;
  desktop?: ResponsiveBreakpointSettings;
  largeDesktop?: ResponsiveBreakpointSettings;
}
```

### Backward Compatibility

- Old sections without `status` default to `'published'` if `isVisible === true`, else `'hidden'`.
- Old sections without `animation` default to `{ type: 'fadeIn', duration: 'normal', delay: 0 }`.
- All existing `content` field names are preserved — no breaking changes to section components.

---

## Public Homepage Renderer

**File:** `src/pages/public/Home.tsx`

### Behavior

1. Loads config from `homeContentStore` (synced from Firestore `config/homepage`).
2. Filters sections: only `status === 'published'` are rendered.
3. Sorts by `order` ascending.
4. Wraps each section in `motion.div` with `whileInView` trigger.
5. Respects `prefers-reduced-motion` via `useReducedMotion()`.
6. Falls back to `DEFAULT_HOMEPAGE_CONFIG` if no Firestore data exists.

### Animation Mapping

| Animation Type | Framer Motion Variant |
|----------------|----------------------|
| `none` | No animation |
| `fadeIn` | `opacity: 0 → 1` |
| `slideUp` | `opacity + y: 40 → 0` |
| `softReveal` | `opacity + y: 24 + blur(4px) → clear` |
| `staggeredCards` | Parent with `staggerChildren: 0.1` |
| `gentleScale` | `opacity + scale: 0.97 → 1` |
| `imageParallax` | Simple fade (parallax requires GSAP, placeholder) |
| `sectionOverlap` | `opacity + y: 20 → 0` |
| `softDivider` | Simple fade |

---

## Admin Editor Structure

### 3-Panel Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Top Toolbar                                                         │
│  [Stats] [Device: Desktop/Tablet/Mobile] [Status] [Edit/Preview]    │
│  [Reset] [Save Draft] [Publish All]                                  │
├──────────┬─────────────────────────────────────────┬─────────────────┤
│          │                                         │                 │
│  Sidebar │     Center: Scrollable Preview          │  Settings Panel │
│  (280px) │     (All sections, clickable)           │  (320px)        │
│          │                                         │                 │
│  ┌────┐  │     ┌─────────────────────────┐         │  ┌───────────┐  │
│  │ 1  │  │     │  Section 1 (selected)   │         │  │ Content   │  │
│  │ 2  │  │     ├─────────────────────────┤         │  │ Layout    │  │
│  │ 3  │  │     │  Section 2              │         │  │ Style     │  │
│  │ +  │  │     ├─────────────────────────┤         │  │ Animation │  │
│  └────┘  │     │  Section 3              │         │  │ Responsive│  │
│          │     └─────────────────────────┘         │  └───────────┘  │
│  Drag    │                                         │                 │
│  to      │                                         │                 │
│  reorder │                                         │                 │
└──────────┴─────────────────────────────────────────┴─────────────────┘
```

### Sidebar Features

- **Filter tabs**: All / Published / Draft / Hidden
- **Drag-and-drop reorder**: Uses `@dnd-kit/core` + `@dnd-kit/sortable`
- **Quick actions** on hover: Show/Hide, Duplicate, Delete
- **Add Section** button with template picker dropdown

### Settings Panel Tabs

| Tab | Controls |
|-----|----------|
| **Content** | Inline editing guidance, media position, image shape |
| **Layout** | Container width, content alignment, text alignment, full-width toggle, mobile layout |
| **Style** | Background color, text color, padding, border style, shadow, divider |
| **Animation** | Animation type, duration, delay (ms) |
| **Responsive** | Per-breakpoint: layout, text align, image aspect ratio, hide image |

### Top Toolbar

- **Section stats**: Total, published, draft, hidden counts
- **Device preview**: Desktop (1280px), Tablet (768px), Mobile (375px)
- **Save status**: Unsaved changes / Saved / Saving / Error
- **Edit/Preview toggle**: Switches between editable and preview mode
- **Save Draft**: Persists current state to Firestore
- **Publish All**: Sets all sections to `published` and saves
- **Reset**: Reverts to `DEFAULT_HOMEPAGE_CONFIG`

---

## Section Templates

All 18 existing templates are preserved and functional:

### First-Build Priority Templates (as requested)

| Template | Description |
|----------|-------------|
| `splitScreenHero` | 50/50 image + text hero with optional eyebrow, badge, secondary CTA |
| `asymmetricalEditorial` | Editorial long-form with featured image, caption, CTA |
| `productShowcase` | Product detail with feature list and showcase image |
| `collectionPreview` | Product grid with prices, badges, descriptions |
| `howItWorks` | Numbered step process with optional images |
| `lookbook` | Gallery grid / masonry / carousel layout |
| `benefits` | Icon + title + description cards |
| `testimonials` | Quote cards with author, role, rating |
| `faq` | Accordion-style Q&A |
| `invertedPyramid` | Centered CTA with headline → subheadline → description |

### Additional Templates (already built)

`singleColumnFocus`, `zPattern`, `fPattern`, `cardGrid`, `alternating`, `longFormSales`, `storytellingScroll`, `leadCapture`

### New Optional Content Fields (backward compatible)

- `eyebrow` — small pre-heading label
- `body` — additional paragraph text
- `secondaryButtonText` / `secondaryButtonLink` — secondary CTA
- `badgeText` — small badge/tag
- `caption` — image caption
- `privacyText` — e.g. for lead capture
- `description` — e.g. for collection items

---

## Animation System

### How It Works

1. Each section defines `animation: { type, duration, delay }` in its data.
2. `Home.tsx` maps the `type` to a Framer Motion variant.
3. Sections animate once when they enter the viewport (`whileInView`, `viewport.once: true`).
4. `useReducedMotion()` disables animations for users who prefer reduced motion.

### Duration Mapping

| Store Value | Framer Motion Duration |
|-------------|----------------------|
| `fast` | 0.4s |
| `normal` | 0.6s |
| `slow` | 1.0s |

### Admin Preview

In the admin editor, animations are simplified (the preview renders sections without the full `whileInView` trigger for performance). The public site has the full experience.

---

## Publishing Workflow

### States

| Status | Behavior |
|--------|----------|
| **Published** | Visible on public homepage. Synced with `isVisible: true`. |
| **Draft** | Visible only in admin editor. Not shown publicly. |
| **Hidden** | In admin but not public. Synced with `isVisible: false`. |

### Actions

| Action | Effect |
|--------|--------|
| **Save Draft** | Persists current config to Firestore. All statuses preserved. |
| **Publish All** | Sets every section to `published`, saves to Firestore. |
| **Publish Individual** | Set a single section's status to `published` via the settings panel. |
| **Hide** | Set status to `hidden`. Section stays in admin, disappears from public. |
| **Duplicate** | Creates a copy with `status: 'draft'` and `name: "... (Copy)"`. |

### Draft Tracking

- `hasDraftChanges` flag in `homeContentStore` tracks unsaved edits.
- Shown in the top toolbar as "Unsaved changes" indicator.

---

## Responsive Behavior

### Mobile-First Defaults

- All sections start with a stacked/mobile layout.
- Settings panel allows per-breakpoint overrides.

### Breakpoint Map

| Breakpoint | Tailwind Prefix | Width |
|------------|-----------------|-------|
| Mobile | (default) | < 640px |
| Tablet | `sm:` / `md:` | 640–1024px |
| Desktop | `lg:` / `xl:` | 1024–1280px |
| Large Desktop | `2xl:` | > 1280px |

### Responsive Controls per Section

- **Layout**: stacked, twoColumn, overlay, grid, carousel
- **Text Align**: left, center, right
- **Image Aspect Ratio**: auto, 1:1, 4:3, 3:4, 4:5, 16:9
- **Hide Image**: boolean toggle per breakpoint

> NOTE: The responsive settings are stored in the data model. Full CSS implementation of every responsive permutation requires enhancement in individual section components. The settings panel captures the intent; section components should read `section.responsive?.mobile?.layout` etc. to apply breakpoint-specific classes.

---

## Adding New Section Templates

### Step 1: Add the Template Type

```typescript
// src/types/homepage.ts
export type TemplateType = 'splitScreenHero' | 'myNewTemplate' | ...;

export const TEMPLATE_LABELS: Record<TemplateType, string> = {
  // ...
  myNewTemplate: 'My New Template',
};
```

### Step 2: Define the Content Interface

```typescript
export interface MyNewTemplateContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}
```

### Step 3: Add to the Discriminated Union

```typescript
export type HomepageSection = HomepageSectionBase &
  (
    | { templateType: 'myNewTemplate'; content: MyNewTemplateContent }
    // ...
  );
```

### Step 4: Add Default Content Factory

```typescript
export function getDefaultContent(templateType: TemplateType): HomepageSection['content'] {
  switch (templateType) {
    // ...
    case 'myNewTemplate':
      return {
        headline: 'New Section',
        subheadline: 'Add your subheadline here.',
        ctaText: 'Learn More',
        ctaLink: '/',
        imageUrl: '',
      };
  }
}
```

### Step 5: Create the Section Component

```tsx
// src/components/homepage/sections/MyNewTemplateSection.tsx
import { InlineText } from '@/components/admin/InlineText';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'myNewTemplate' };
}

export default function MyNewTemplateSection({ section }: Props) {
  const { content, id } = section;
  return (
    <div>
      <InlineText tag="h2" value={content.headline} path="headline" sectionId={id} />
      {/* ... */}
    </div>
  );
}
```

### Step 6: Register in TemplateRenderer

```typescript
// src/components/homepage/TemplateRenderer.tsx
myNewTemplate: lazy(() => import('@/components/homepage/sections/MyNewTemplateSection')) as unknown as ...,
```

---

## Example Seed Data

The default config (`DEFAULT_HOMEPAGE_CONFIG`) includes 10 sections:

1. **Main Hero** (`splitScreenHero`) — "Haus of Nahkya" with Atelier CTA
2. **Editorial Intro** (`asymmetricalEditorial`) — Brand story with featured image
3. **Product Showcase** (`productShowcase`) — Signature silks with features
4. **Collection Preview** (`collectionPreview`) — 4-product seasonal grid
5. **How It Works** (`howItWorks`) — 4-step process
6. **Lookbook Gallery** (`lookbook`) — Masonry lifestyle images
7. **Benefits** (`benefits`) — 4 icon cards
8. **Testimonials** (`testimonials`) — 3 community quotes
9. **FAQ** (`faq`) — 4 accordion questions
10. **Call to Action** (`invertedPyramid`) — Membership signup

All sections have `status: 'published'` and `animation` presets. The CTA uses a burgundy background (`nahkya-accent`) with inverse text for visual contrast.

---

## Firestore Document Structure

```
collection: config
  document: homepage
    {
      "sections": [ /* HomepageSection[] */ ],
      "metaTitle": "Haus of Nahkya — Luxury Digital Scarf Atelier",
      "metaDescription": "Design custom silk scarves..."
    }
```

No migration needed — old documents without `status` or `animation` are normalized at load time by `normalizeSection()`.

---

## Accessibility Notes

- All animations respect `prefers-reduced-motion`.
- Focus indicators use `shadow-gold-focus`.
- Drag-and-drop is keyboard-accessible via `@dnd-kit/keyboard` sensor.
- Section labels and status indicators are announced via semantic markup.
- The admin editor uses `aria-label` on all icon-only buttons.
