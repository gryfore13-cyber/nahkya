# Haus of Nahkya — Technical Documentation

> Comprehensive technical reference for the Nahkya web application. Covers architecture, data flow, state management, build system, and development conventions.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Routing & Navigation](#routing--navigation)
5. [State Management](#state-management)
6. [Authentication & Authorization](#authentication--authorization)
7. [Firebase Backend](#firebase-backend)
8. [Design System & Styling](#design-system--styling)
9. [Studio Tools Architecture](#studio-tools-architecture)
10. [Data Models](#data-models)
11. [Build & Development](#build--development)
12. [Environment & Configuration](#environment--configuration)
13. [Code Conventions](#code-conventions)

---

## Architecture Overview

Haus of Nahkya is a **single-page application (SPA)** built with React 19 and distributed as a static site via Firebase Hosting. The app serves three distinct user portals behind a unified brand experience:

| Portal | Route Prefix | Purpose |
|--------|-------------|---------|
| **Public** | `/` | Marketing, editorial content, brand story |
| **Member** | `/member/*` | Design tools (Atelier, Monogram, Petak), saved designs, orders |
| **Admin** | `/admin/*` | Content management, orders, members, site appearance |
| **Designer** | `/designer/*` | Artist dashboard, artworks, earnings |

**Key architectural decisions:**
- **HashRouter** (`/#/...`) — enables static hosting without server-side rewrite rules
- **Lazy loading** — all non-public pages are code-split via `React.lazy()`
- **Zustand** — lightweight global state; no Context providers for state
- **Firestore real-time** — live subscriptions for admin theme changes, config updates
- **Canvas-based studio tools** — Atelier/Monogram/Petak use DOM-positioned canvas overlays, not HTML5 Canvas API

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.0 (StrictMode) |
| Language | TypeScript | 5.9.3 (strict) |
| Build Tool | Vite | 7.2.4 |
| Router | React Router DOM | 7.15.1 (HashRouter) |
| Styling | Tailwind CSS | 3.4.19 |
| PostCSS | Autoprefixer | 10.4.23 |
| UI Components | shadcn/ui | Radix UI primitives + 40+ components |
| Animations | GSAP + ScrollTrigger | 3.15.0 |
| Animations | Framer Motion | 12.40.0 |
| State | Zustand | 5.0.13 |
| Backend | Firebase | 12.13.0 (Auth + Firestore + Storage) |
| Forms | React Hook Form + Zod | 7.70.0 / 4.4.3 |
| Charts | Recharts | 2.15.4 |
| Icons | Lucide React | 0.562.0 |
| Fonts | Google Fonts | Playfair Display, Inter, IBM Plex Mono |

**Dev tooling:**
- ESLint 9 (flat config) + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`
- `typescript-eslint` 8.46
- `kimi-plugin-inspect-react` (Vite dev-only)

---

## Project Structure

```
app/
├── index.html                  # SPA entry point
├── vite.config.ts              # Vite config (port 3000, base: './', @/ alias)
├── tailwind.config.js          # Custom theme, colours, fonts, animations
├── postcss.config.js           # Tailwind + Autoprefixer
├── eslint.config.js            # Flat ESLint config
├── tsconfig.app.json           # App TS config (strict, ES2022, bundler mode)
├── tsconfig.node.json          # Node/Vite TS config
├── components.json             # shadcn/ui configuration
├── public/assets/              # Static images (logo, hero, tool previews)
│
└── src/
    ├── main.tsx                # Entry: registers GSAP, hydrates theme, mounts App
    ├── App.tsx                 # Root: HashRouter, routes, lazy loading, auth init
    ├── index.css               # Global styles, Tailwind directives, scrollbar, utilities
    │
    ├── components/
    │   ├── ui/                 # shadcn/ui primitives (40+ components)
    │   ├── layout/             # PublicLayout, MemberLayout, AdminLayout, DesignerLayout
    │   │                       # + sidebars (IconRailSidebar, AdminSidebar, etc.)
    │   ├── shared/             # Logo, LuxuryButton, StatusBadge, AuthBackground, PageLoader
    │   ├── studio/             # StudioShell, StudioTopBar, StudioColourPanel,
    │   │                       # StudioZoomPill, StudioViewPill, StudioBrandHeader
    │   ├── admin/              # AdminTopBar, AppearanceBuilder, HomepageBuilder, etc.
    │   ├── homepage/           # SectionRenderer, SectionWrapper + section components
    │   ├── monogram/           # MonogramCanvas, MonogramControls
    │   └── ...                 # Other tool-specific components
    │
    ├── pages/
    │   ├── public/             # Home, ByNahkya, SilkReport, Herstory, SilkWire,
    │   │                       # Membership, Contact, Login, Signup
    │   ├── member/             # MemberHome, Atelier, AtelierGallery, ImageAtelier,
    │   │                       # Monogram, Petak, SavedDesigns, Orders, Profile, ColourSystem
    │   ├── admin/              # AdminDashboard, AdminContent, AdminMedia, AdminOrders,
    │   │                       # AdminMembers, AdminArtworks, AdminColour, AdminAppearance,
    │   │                       # AdminHomepage, AdminSettings, AdminGlobal, AdminLog,
    │   │                       # AdminDesigners, AdminCommissions
    │   └── designer/           # DesignerDashboard, DesignerArtworks,
    │                           # DesignerEarnings, DesignerProfile
    │
    ├── stores/
    │   ├── authStore.ts        # Authentication state (Firebase Auth)
    │   ├── appearanceStore.ts  # Homepage sections, colour overrides, CSS theme tokens
    │   ├── colourStore.ts      # Colour palette categories, selected colour, recent colours
    │   ├── homeContentStore.ts # Editable homepage copy/content
    │   ├── homepageStore.ts    # Homepage section data
    │   ├── savedDesignStore.ts # Saved designs CRUD
    │   ├── orderStore.ts       # Orders CRUD
    │   ├── platformStore.ts    # Pricing, global config
    │   ├── artworkStore.ts     # Artworks catalogue
    │   ├── articleStore.ts     # Editorial articles
    │   ├── userStore.ts        # User management (admin)
    │   ├── designerStore.ts    # Designer profiles & commissions
    │   ├── commissionStore.ts  # Commission tracking
    │   └── logStore.ts         # Admin activity logs
    │
    ├── hooks/
    │   ├── use-mobile.ts       # useIsMobile() — 768px breakpoint
    │   ├── useMonogramState.ts # Monogram tool state + drag/resize/rotate logic
    │   └── useColoringEngine.ts# Atelier colouring engine
    │
    ├── lib/
    │   ├── utils.ts            # cn() — clsx + tailwind-merge
    │   ├── constants.ts        # Nahkya colours, pigment palettes, nav configs, order statuses
    │   ├── mockData.ts         # Static mock data for dev/testing
    │   ├── validation.ts       # Shared Zod schemas
    │   ├── artworks.ts         # Artwork layer definitions (SVG paths) for Atelier
    │   ├── seedPalette.ts      # 200-colour seed palette (10 families × 4 sub-colours × 5 tones)
    │   ├── themeService.ts     # Firestore theme sync (real-time CSS token updates)
    │   ├── monogram.ts         # Monogram utilities (letter creation, snap, clamp)
    │   ├── monogramConstants.ts# Monogram constants (tile size, viewport, max letters)
    │   ├── monogramExport.ts   # Canvas thumbnail renderer + snapshot serializer
    │   ├── image.ts            # Image processing helpers
    │   ├── firebase/           # Firebase config, auth helpers, Firestore utils
    │   │   ├── config.ts       # Firebase app initialization
    │   │   ├── auth.ts         # Auth helpers (login, logout, signup, Google, avatar)
    │   │   ├── db.ts           # Firestore CRUD utilities, config sync helpers
    │   │   └── storage.ts      # Firebase Storage helpers
    │   └── canvas/
    │       └── coloringEngine.ts # Atelier colouring engine implementation
    │
    ├── types/
    │   └── index.ts            # Shared TypeScript types (User, Order, Colour,
    │                           # SavedDesign, MonogramLetter, MonogramConfig, etc.)
    │
    ├── styles/
    │   ├── nahkya-v10.css      # v10 design system: .nk-* component classes,
    │   │                       # tokens, animations, approved bespoke exceptions
    │   └── tokens.css          # CSS custom properties for runtime theme switching
    │
    └── assets/                 # Vite-processed assets (SVG icons, small images)
```

---

## Routing & Navigation

React Router v7 with `HashRouter`. The `App.tsx` component defines all routes and wraps them in layout components.

### Route Structure

```
/                           → Home (eager-loaded)
/by-nahkya                  → Editorial: By Nahkya (lazy)
/silk-report                → Editorial: Silk Report (lazy)
/herstory                   → Editorial: Herstory (lazy)
/silk-wire                  → Editorial: Silk Wire (lazy)
/membership                 → Membership info (lazy)
/contact                    → Contact page (lazy)
/login                      → Login (no layout)
/signup                     → Signup (no layout)
/pending-approval           → Pending approval notice (no layout)
/rejected                   → Rejection notice (no layout)

/member/home                → Member dashboard (MemberLayout)
/member/atelier             → Atelier gallery (MemberLayout)
/member/atelier/:artworkId  → Atelier tool (MemberLayout)
/member/atelier/image/:id   → Image Atelier (MemberLayout)
/member/monogram            → Monogram Studio (MemberLayout)
/member/petak               → Petak Studio (MemberLayout)
/member/saved               → Saved designs (MemberLayout)
/member/orders              → Order history (MemberLayout)
/member/profile             → Profile (MemberLayout)

/admin                      → Admin dashboard (AdminLayout)
/admin/content              → Content management (AdminLayout)
/admin/media                → Media library (AdminLayout)
/admin/orders               → Order management (AdminLayout)
/admin/members              → Member management (AdminLayout)
/admin/artworks             → Artwork catalogue (AdminLayout)
/admin/colours              → Colour system editor (AdminLayout)
/admin/appearance           → Site appearance / theme (AdminLayout)
/admin/homepage             → Homepage builder (AdminLayout)
/admin/settings             → Site settings (AdminLayout)
/admin/global               → Component QA gallery (AdminLayout)
/admin/log                  → Activity log (AdminLayout)
/admin/designers            → Designer management (AdminLayout)
/admin/commissions          → Commission tracking (AdminLayout)

/designer/dashboard         → Designer dashboard (DesignerLayout)
/designer/artworks          → My artworks (DesignerLayout)
/designer/earnings          → Earnings & commissions (DesignerLayout)
/designer/profile           → Designer profile (DesignerLayout)
```

### Lazy Loading Strategy

Only `Home` (public homepage) is eager-loaded. All other pages are `React.lazy()` imports wrapped in `<Suspense fallback={<PageLoader />}>`.

---

## State Management

### Zustand Stores

All global state lives in `src/stores/`. Each store is a single Zustand slice with actions and computed booleans.

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `authStore` | Firebase Auth user, role flags, login/logout | No |
| `appearanceStore` | Theme tokens, section visibility, colour overrides | `localStorage` (sections only) + Firestore |
| `colourStore` | Palette categories, selected colour, recent colours | `localStorage` |
| `homeContentStore` | Editable homepage copy | Firestore |
| `homepageStore` | Homepage section data | Firestore |
| `savedDesignStore` | Member's saved designs | Firestore |
| `orderStore` | Member/admin orders | Firestore |
| `platformStore` | Pricing table, global config | Firestore |
| `artworkStore` | Artwork catalogue | Firestore |
| `articleStore` | Editorial articles | Firestore |
| `userStore` | Admin user list | Firestore |
| `designerStore` | Designer profiles | Firestore |
| `commissionStore` | Commission records | Firestore |
| `logStore` | Admin activity logs | Firestore |

### Auth Store Pattern

```typescript
// Derived booleans computed on user change
setUser: (user) => {
  const isApproved = user?.approvalStatus === 'approved';
  set({
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'super_admin',
    isMember: user?.role === 'member' || user?.role === 'super_admin',
    isDesigner: user?.role === 'designer',
    isApproved,
    role: user?.role || null,
    approvalStatus: user?.approvalStatus || null,
    isLoading: false,
  });
}
```

### Firestore Sync Pattern

`subscribeConfig()` in `lib/firebase/db.ts` provides bidirectional sync:
- **Subscribe**: Firestore → Zustand (real-time via `onSnapshot`)
- **Update**: Zustand → Firestore (via `setConfig()`)

Used by `appearanceStore` for theme/colour changes that propagate to all open sessions.

---

## Authentication & Authorization

### Role Hierarchy

```
super_admin  → Full access (admin + member + designer)
operations   → Admin panel access
writer       → Content editing
member       → Studio tools, saved designs, orders
designer     → Artist dashboard, artworks, earnings
```

### Approval Flow

1. User signs up → `approvalStatus: 'pending'`
2. Admin approves → `approvalStatus: 'approved'`
3. User can access member routes

### Route Guards

- **PublicLayout** — no auth required
- **MemberLayout** — redirects to `/login` if unauthenticated; redirects to `/pending-approval` or `/rejected` if not approved
- **AdminLayout** — checks `isAdmin` flag
- **DesignerLayout** — checks `isDesigner` flag

### AuthInitializer Component

Rendered inside `<HashRouter>` in `App.tsx`. Calls `authStore.init()` on mount, which subscribes to Firebase Auth state changes via `onAuthChange()`. Displays a loading screen until auth state is resolved.

---

## Firebase Backend

### Project: `hausofnahkya`

| Service | Use |
|---------|-----|
| **Authentication** | Email/password, Google OAuth |
| **Firestore** | All application data (users, orders, designs, articles, config) |
| **Storage** | Design thumbnails, user avatars, media uploads |
| **Hosting** | Static SPA deployment |

### Firestore Collections

| Collection | Documents |
|-----------|-----------|
| `config/appearance` | Section visibility, legacy colour overrides |
| `config/theme` | CSS custom property tokens |
| `config/platform` | Pricing, global settings |
| `users/{uid}` | User profile, role, approval status |
| `orders/{id}` | Order data, status, notes |
| `savedDesigns/{id}` | Design snapshot, thumbnail, tool type |
| `articles/{id}` | Editorial articles |
| `artworks/{id}` | Artwork metadata, layers, SVG paths |
| `designers/{id}` | Designer profile, commission rate |
| `commissions/{id}` | Commission records |
| `logs/{id}` | Admin activity logs |

### Config Helpers (`lib/firebase/db.ts`)

```typescript
getConfig<T>(id, fallback)      // One-time fetch
subscribeConfig<T>(id, fallback, callback)  // Real-time subscription
setConfig<T>(id, data)          // Write with merge
getCollection<T>(path)          // Fetch all docs
addDocToCollection(path, data)  // Create with server timestamps
updateDocInCollection(path, id, data)  // Update with server timestamps
subscribeCollection<T>(path, callback)  // Real-time collection sub
```

---

## Design System & Styling

### Tailwind CSS Tokens

All styling is centralized in `tailwind.config.js`. No arbitrary bracket values, no inline styles, no component-scoped CSS.

#### Typography

| Token | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|----------------|-------|
| `text-display-xxl` | 96px | 0.95 | -0.03em | Hero headlines |
| `text-display-xl` | 72px | 0.98 | -0.02em | Page titles |
| `text-display-lg` | 56px | 1.05 | -0.02em | Large quotes |
| `text-display-md` | 40px | 1.1 | -0.01em | Section titles |
| `text-display-sm` | 32px | 1.15 | -0.01em | Editorial headlines |
| `text-heading-lg` | 24px | 1.3 | — | Card titles |
| `text-heading-md` | 20px | 1.35 | — | Subheads |
| `text-body-lg` | 17px | 1.5 | — | Body paragraphs |
| `text-body-md` | 15px | 1.5 | — | UI labels |
| `text-mono-lg` | 13px | 1.4 | 0.08em | Badges, metadata |
| `text-mono-sm` | 10px | 1.4 | 0.12em | Eyebrow labels |

#### Nahkya Colour Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `nahkya-bg` | `#F8F1E8` | Page background |
| `nahkya-surface` | `#FFF9F2` | Cards, panels |
| `nahkya-text` | `#2D211D` | Primary text |
| `nahkya-text-muted` | `#7B6A60` | Secondary text |
| `nahkya-burgundy` | `#7B1E2B` | Brand accent, active states |
| `nahkya-gold` | `#B88B4A` | Brand highlight, borders |
| `nahkya-gold-veil` | `#EFE2C7` | Hover backgrounds |
| `nahkya-border` | `#E5D5C7` | Default borders |

#### Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `sidebar-member` | 240px | Member sidebar (expanded) |
| `sidebar-member-collapsed` | 80px | Member icon rail |
| `sidebar-admin` | 260px | Admin sidebar |
| `panel-studio` | 280px | Studio tool left panel |
| `panel-inspector` | 330px | Admin inspector panel |
| `nav` | 72px | Navigation height |
| `toolbar` | 74px | Toolbar height |

### CSS Architecture

| File | Purpose |
|------|---------|
| `index.css` | Tailwind directives, scrollbar styles, utility classes |
| `styles/tokens.css` | CSS custom properties for runtime theme switching |
| `styles/nahkya-v10.css` | Bespoke `.nk-*` component classes (buttons, inputs, cards, tables) |

### Theme System

Admin colour changes propagate in real-time via Firestore:

1. Admin edits colour in `/admin/appearance`
2. `updateTheme()` writes to `config/theme` in Firestore
3. `subscribeToTheme()` receives update in all open sessions
4. `useAppearanceStore.getState().applyAllTokens()` updates CSS custom properties on `:root`

---

## Studio Tools Architecture

All three design tools (Atelier, Monogram, Petak) share a unified layout shell.

### StudioShell Layout Contract

```
┌─ StudioTopBar ─────────────────────────────────┐
│  HAUS OF NAHKYA / TOOL NAME    Save  Submit    │
├─ Left Panel ──────┬─ Canvas ───┬─ Right Panel ─┤
│  Tool controls    │  Workspace │  Colour Panel │
│                   │            │               │
├─ StudioZoomPill ──┴────────────┴───────────────┤
│            −  100%  +  ⟳                       │
└─────────────────────────────────────────────────┘
```

### Shared Components

| Component | Path | Responsibility |
|-----------|------|----------------|
| `StudioShell` | `studio/StudioShell.tsx` | Layout wrapper: top bar, left panel, canvas, right panel |
| `StudioTopBar` | `studio/StudioTopBar.tsx` | Branding wordmark + Save/Submit buttons |
| `StudioColourPanel` | `studio/StudioColourPanel.tsx` | Colour picker with categories, recent colours |
| `StudioZoomPill` | `studio/StudioZoomPill.tsx` | Zoom controls (− / + / reset) + undo/redo |
| `StudioViewPill` | `studio/StudioViewPill.tsx` | View mode toggle (Design / Preview / Both) |

### Monogram Tool Deep Dive

**State:** `useMonogramState()` hook manages:
- Letter array (char, font, size, position, rotation, colour)
- Base colour, border colours
- Pattern config (preview tiles, spacing)
- Border config (thickness, gap, dual border)
- Workspace config (zoom, view mode, snap, guides)
- Drag/resize/rotate interaction state
- Snapshot serialization (`getSnapshot()` / `loadSnapshot()`)

**Persistence:**
1. `generateMonogramThumbnail()` renders to offscreen canvas → Base64 PNG
2. `addDesign()` saves thumbnail + snapshot JSON to Firestore
3. `addOrder()` creates order referencing the saved design

**Canvas Rendering:**
- Source stage: 260×260px tile with letter overlays (absolute positioned DOM)
- Preview stage: 5×5 tile grid with gap spacing, borders, and scaled letters
- Drag interaction: pointer events on letter elements with snap guides

---

## Data Models

### Core Types (`src/types/index.ts`)

```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'member' | 'writer' | 'operations' | 'super_admin' | 'designer';
  membershipTier: 'free' | 'collector';
  avatar?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

interface Order {
  id: string;
  userId: string;
  designId: string;
  designName: string;
  tool: 'atelier' | 'monogram' | 'petak';
  size: string;
  amount: number;
  currency: string;
  status: OrderStatus;  // 10-state workflow
  notes: string;
  adminNotes: string;
  createdAt: string;
}

interface SavedDesign {
  id: string;
  name: string;
  tool: 'atelier' | 'monogram' | 'petak';
  thumbnail: string;    // Base64 PNG
  snapshot?: Record<string, unknown>;
  userId?: string;
  createdAt: string;
}

interface MonogramLetter {
  id: string;
  char: string;
  fontId: string;
  fontSize: number;
  rotation: number;
  x: number;    // 0–100 percentage within tile
  y: number;
  color: string;
}
```

### Order Status Workflow

```
submitted
    ├── changes_requested ──→ submitted
    ├── approved_awaiting_payment ──→ paid_pending_production / cancelled / payment_expired
    └── rejected

paid_pending_production ──→ in_production ──→ ready_for_collection ──→ completed
```

---

## Build & Development

### Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Type-check and build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

### Vite Configuration

```typescript
export default defineConfig({
  base: './',           // Relative paths for static hosting
  server: { port: 3000 },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
});
```

### TypeScript Strictness

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "erasableSyntaxOnly": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedSideEffectImports": true,
  "verbatimModuleSyntax": true
}
```

---

## Environment & Configuration

### `.env.example`

```
# Firebase config (public — keys are domain-restricted)
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

> Firebase API keys are public by design. Security is enforced via Firebase Auth rules and Firestore security rules, not key secrecy.

### Git Ignore

```
node_modules
dist
dist-ssr
*.local
.env
```

---

## Code Conventions

### Import Rules

```typescript
// ✅ Type-only import
import type { User, Order } from '@/types';

// ✅ Value import
import { useAuthStore } from '@/stores/authStore';

// ❌ Never use deep relative paths
import { Button } from '../../../components/ui/button';
```

### Class Naming with `cn()`

```typescript
import { cn } from '@/lib/utils';

className={cn(
  'bg-nahkya-cream border-nahkya-stone rounded-nahkya p-6',
  isActive && 'border-nahkya-gold',
  isDisabled && 'opacity-50 cursor-not-allowed',
  variant === 'compact' ? 'p-4' : 'p-6'
)}
```

### File Naming

| Category | Pattern | Example |
|----------|---------|---------|
| Pages | `src/pages/{scope}/PascalCase.tsx` | `pages/member/Monogram.tsx` |
| Components | `src/components/{category}/PascalCase.tsx` | `components/studio/StudioShell.tsx` |
| Stores | `src/stores/{name}Store.ts` | `stores/authStore.ts` |
| Hooks | `src/hooks/use-{kebab}.ts` | `hooks/use-mobile.ts` |

### Accessibility Requirements

- WCAG 2.2 Level AA compliance
- Minimum 4.5:1 contrast for body text
- Minimum 3:1 for UI components and large text
- All interactive elements keyboard accessible
- Focus indicators visible (`shadow-gold-focus`)
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`)
- One `<h1>` per page, no heading skips

---

## Known Issues & Notes

- **Vite HMR staleness**: Browser hard-refresh (`Ctrl+F5`) sometimes required after CSS/component changes
- **Chunk size**: `index.js` ~904 KB (existing, non-blocking)
- **Font loading**: Playfair Display, Inter, IBM Plex Mono loaded from Google Fonts

---

*Document version: 1.0 | Last updated: 2026-05-30*
