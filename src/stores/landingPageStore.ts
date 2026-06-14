import { create } from 'zustand';
import { subscribeConfig, setConfig } from '@/lib/firebase/db';
import type {
  LandingCommerceVariant,
  LandingFooterVariant,
  LandingGalleryVariant,
  LandingHeroVariant,
  LandingNavSection,
  LandingPageConfig,
  LandingSection,
  LandingSectionSettings,
  LandingStoryVariant,
  LandingTextField,
  LandingTextStyle,
  LandingToolsVariant,
  LandingTrustVariant,
} from '@/types/landingPage';
import { getDefaultLandingPageConfig } from '@/lib/landingDefaults';
import { textField, updateStyle, updateText } from '@/lib/landingText';

type LandingContentSection = Exclude<LandingSection, LandingNavSection>;

export interface LandingPageState {
  config: LandingPageConfig;
  isLoaded: boolean;
  isSaving: boolean;
  saveError: string | null;
  hasDraftChanges: boolean;
  lastSavedAt: string | null;
  lastPublishedAt: string | null;

  selectedId: string | null;
  previewMode: 'mobile' | 'tablet' | 'desktop';
  lockedIds: string[];
  selectedNavLinkIndex: number;
  selectedTextPath: { sectionId: string; path: string } | null;
  overlay: string;
  opacity: number;
  motion: string;
  motionKey: number;
  stickyBehavior: string;

  replaceConfig: (config: LandingPageConfig) => void;
  reset: () => void;
  selectSection: (id: string | null) => void;
  selectNavLinkIndex: (index: number) => void;
  setSelectedTextPath: (path: { sectionId: string; path: string } | null) => void;
  setPreviewMode: (mode: 'mobile' | 'tablet' | 'desktop') => void;

  updateNav: (updater: (nav: LandingNavSection) => LandingNavSection) => void;
  updateSection: <T extends LandingSection>(id: string, updater: (section: T) => T) => void;
  updateSectionSettings: (id: string, patch: Partial<LandingSectionSettings>) => void;
  updateSectionText: (sectionId: string, path: string, text: string) => void;
  updateSectionTextStyle: (sectionId: string, path: string, patch: Partial<LandingTextStyle>) => void;

  addSection: (section: LandingSection, afterId?: string | null) => void;
  createSection: (template: string, afterId?: string | null) => void;
  duplicateSection: (id: string) => void;
  deleteSection: (id: string) => void;
  moveSection: (id: string, dir: 'up' | 'down') => void;
  moveSectionByIndex: (from: number, to: number) => void;

  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;

  setOverlay: (overlay: string, opacity: number) => void;
  setMotion: (motion: string) => void;
  previewMotion: () => void;
  setStickyBehavior: (value: string) => void;

  saveConfig: () => Promise<void>;
  publishConfig: () => Promise<void>;
  clearSaveError: () => void;
}

function initialState() {
  const cfg = getDefaultLandingPageConfig();
  return {
    config: cfg,
    isLoaded: false,
    isSaving: false,
    saveError: null,
    hasDraftChanges: false,
    lastSavedAt: null,
    lastPublishedAt: null,
    selectedId: cfg.sections[0]?.id ?? null,
    previewMode: 'desktop' as const,
    lockedIds: [] as string[],
    selectedNavLinkIndex: 0,
    selectedTextPath: null,
    overlay: 'none',
    opacity: 35,
    motion: 'none',
    motionKey: 0,
    stickyBehavior: 'always',
  };
}

export const useLandingPageStore = create<LandingPageState>((set, get) => ({
  ...initialState(),

  replaceConfig: (config) =>
    set({ config: normalizeLandingPageConfig(config), isLoaded: true, selectedTextPath: null }),
  reset: () => set({ ...initialState(), hasDraftChanges: true }),
  selectSection: (id) =>
    set((state) => ({
      selectedId: id,
      selectedTextPath: state.selectedTextPath?.sectionId === id ? state.selectedTextPath : null,
    })),
  selectNavLinkIndex: (index) => set({ selectedNavLinkIndex: index }),
  setSelectedTextPath: (selectedTextPath) => set({ selectedTextPath }),
  setPreviewMode: (previewMode) => set({ previewMode }),

  updateNav: (updater) => {
    set((state) => ({ config: { ...state.config, nav: updater(state.config.nav) }, hasDraftChanges: true }));
  },

  updateSection: (id, updater) => {
    set((state) => ({
      config: {
        ...state.config,
        sections: state.config.sections.map((s) =>
          s.id === id ? (updater(s as never) as LandingSection) : s,
        ),
      },
      hasDraftChanges: true,
    }));
  },

  updateSectionSettings: (id, patch) => {
    get().updateSection(id, (section) => ({
      ...section,
      settings: { ...(section as LandingContentSection).settings, ...patch },
    }) as never);
  },

  updateSectionText: (sectionId, path, text) => {
    get().updateSection(sectionId, (section) =>
      setFieldAtPath(section as LandingContentSection, path, (field) => updateText(field as LandingTextField | undefined, text)),
    );
  },

  updateSectionTextStyle: (sectionId, path, patch) => {
    get().updateSection(sectionId, (section) =>
      setFieldAtPath(section as LandingContentSection, path, (field) => updateStyle(field as LandingTextField | undefined, patch)),
    );
  },

  addSection: (section, afterId) => {
    set((state) => {
      const sections = [...state.config.sections];
      const idx = afterId ? sections.findIndex((s) => s.id === afterId) : -1;
      const insertAt = idx >= 0 ? idx + 1 : sections.length;
      sections.splice(insertAt, 0, section);
      return { config: { ...state.config, sections }, selectedId: section.id, hasDraftChanges: true };
    });
  },

  createSection: (template, afterId) => {
    const section = createSectionFromTemplate(template);
    get().addSection(section, afterId ?? get().selectedId);
  },

  duplicateSection: (id) => {
    const original = get().config.sections.find((s) => s.id === id);
    if (!original) return;
    const clone = structuredClone(original);
    clone.id = `${clone.type}-${generateIdSuffix()}`;
    get().addSection(clone, id);
  },

  deleteSection: (id) => {
    set((state) => {
      const sections = state.config.sections.filter((s) => s.id !== id);
      return {
        config: { ...state.config, sections },
        selectedId: state.selectedId === id ? sections[0]?.id ?? state.config.nav.id : state.selectedId,
        selectedTextPath: state.selectedTextPath?.sectionId === id ? null : state.selectedTextPath,
        hasDraftChanges: true,
      };
    });
  },

  moveSection: (id, dir) => {
    set((state) => {
      const sections = [...state.config.sections];
      const idx = sections.findIndex((s) => s.id === id);
      if (idx < 0) return state;
      const newIdx = dir === 'up' ? Math.max(0, idx - 1) : Math.min(sections.length - 1, idx + 1);
      if (newIdx === idx) return state;
      const [moved] = sections.splice(idx, 1);
      sections.splice(newIdx, 0, moved);
      return { config: { ...state.config, sections }, hasDraftChanges: true };
    });
  },

  moveSectionByIndex: (from, to) => {
    set((state) => {
      const sections = [...state.config.sections];
      const [moved] = sections.splice(from, 1);
      sections.splice(to, 0, moved);
      return { config: { ...state.config, sections }, hasDraftChanges: true };
    });
  },

  toggleVisibility: (id) => {
    const section = get().config.sections.find(
      (s): s is LandingContentSection => s.id === id && s.type !== 'nav',
    );
    get().updateSectionSettings(id, { isVisible: !section?.settings.isVisible });
  },

  toggleLock: (id) => {
    set((state) => {
      const locked = state.lockedIds.includes(id);
      return {
        lockedIds: locked ? state.lockedIds.filter((x) => x !== id) : [...state.lockedIds, id],
      };
    });
  },

  setOverlay: (overlay, opacity) => set({ overlay, opacity }),
  setMotion: (motion) => set({ motion }),
  previewMotion: () => set((state) => ({ motionKey: state.motionKey + 1 })),
  setStickyBehavior: (stickyBehavior) => set({ stickyBehavior }),

  saveConfig: async () => {
    set({ isSaving: true, saveError: null });
    try {
      const { config } = get();
      await setConfig('landingPage', sanitizeForFirestore(config));
      set({ hasDraftChanges: false, lastSavedAt: new Date().toISOString() });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save landing page. Check your connection and permissions.';
      set({ saveError: message });
    } finally {
      set({ isSaving: false });
    }
  },

  publishConfig: async () => {
    set({ lastPublishedAt: new Date().toISOString() });
    await get().saveConfig();
  },

  clearSaveError: () => set({ saveError: null }),
}));

subscribeConfig<LandingPageConfig>(
  'landingPage',
  sanitizeForFirestore(getDefaultLandingPageConfig()),
  (data) => {
    useLandingPageStore.setState({
      config: normalizeLandingPageConfig(data),
      isLoaded: true,
    });
  },
);

function generateIdSuffix(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1600&auto=format&fit=crop';

function defaultSettings(): LandingSectionSettings {
  return {
    backgroundColor: '#F8F1E7',
    backgroundPosition: 'center',
    textColor: 'text',
    padding: 'standard',
    align: 'center',
    isVisible: true,
  };
}

export function createSectionFromTemplate(template: string): LandingSection {
  const id = `${template}-${generateIdSuffix()}`;

  if (template.startsWith('hero-')) {
    const variant = template.slice(5) as LandingHeroVariant;
    return {
      type: 'hero',
      variant,
      id,
      headline: textField('A headline that feels unmistakably yours.'),
      body: textField('Curated colors, elegant motifs, and a calmer design experience.'),
      ctaText: textField('Start designing'),
      ctaTarget: '#final',
      imageUrl: DEFAULT_IMAGE,
      settings: {
        ...defaultSettings(),
        backgroundColor: 'image',
        textColor: 'inverse',
      },
    };
  }

  if (template.startsWith('story-')) {
    const variant = template.slice(6) as LandingStoryVariant;
    return {
      type: 'story',
      variant,
      id,
      eyebrow: textField('Wrapped with intention'),
      headline: textField('Not from the shelf. From yourself.'),
      body: textField('Nahkya gives customers a guided atelier experience — personal, refined, and controlled enough for fabric-safe production.'),
      settings: {
        ...defaultSettings(),
        backgroundColor: '#F8F1E7',
      },
    };
  }

  if (template.startsWith('tools-')) {
    const variant = template.slice(6) as LandingToolsVariant;
    return {
      type: 'tools',
      variant,
      id,
      eyebrow: textField('The studio tools'),
      headline: textField('Design with structure, not chaos.'),
      items: [
        { title: textField('Colour Atelier'), description: textField('Fabric-safe curated swatches only.') },
        { title: textField('Monogram Studio'), description: textField('Personal identity with controlled repeat rules.') },
        { title: textField('Petak Builder'), description: textField('Pattern grids, motifs, and tileable previews.') },
      ],
      settings: {
        ...defaultSettings(),
        backgroundColor: 'gradient-warm',
      },
    };
  }

  if (template.startsWith('gallery-')) {
    const variant = template.slice(8) as LandingGalleryVariant;
    return {
      type: 'gallery',
      variant,
      id,
      eyebrow: textField('Visual slots'),
      headline: textField('Premium placeholders before images arrive.'),
      items: [
        { label: textField('Editorial Portrait'), note: textField('Ratio 4:5\nRecommended 1600 × 2000px\nKeep scarf and face in safe zone') },
        { label: textField('Scarf Preview'), note: textField('Ratio 1:1\nRecommended 1800 × 1800px\nUse clean product crop') },
        { label: textField('Campaign Image'), note: textField('Ratio 4:5\nRecommended 1600 × 2000px\nFocal point: center') },
      ],
      settings: {
        ...defaultSettings(),
        backgroundColor: '#FFFDF8',
      },
    };
  }

  if (template.startsWith('trust-')) {
    const variant = template.slice(6) as LandingTrustVariant;
    return {
      type: 'trust',
      variant,
      id,
      eyebrow: textField('Trusted'),
      headline: textField('What clients say'),
      testimonials: [
        { quote: textField('The process felt like a real atelier.'), author: textField('A. Rahman') },
        { quote: textField('Finally, a scarf that looks like me.'), author: textField('S. Yusof') },
      ],
      press: [textField('Vogue Arabia'), textField('Harper’s Bazaar'), textField('Elle Decor')],
      settings: {
        ...defaultSettings(),
        backgroundColor: '#FFFDF8',
      },
    };
  }

  if (template.startsWith('commerce-')) {
    const variant = template.slice(9) as LandingCommerceVariant;
    return {
      type: 'commerce',
      variant,
      id,
      eyebrow: textField('Begin your piece'),
      headline: textField('Your scarf, composed like a signature.'),
      body: textField('Start with guided templates, textile-safe colors, and a calmer path from idea to production.'),
      ctaText: textField('Create your scarf'),
      items: [
        { title: textField('Essential'), price: textField('$120'), note: textField('Digital file + production notes'), ctaText: textField('Choose') },
        { title: textField('Bespoke'), price: textField('$280'), note: textField('Two revisions, source layers'), ctaText: textField('Choose') },
        { title: textField('Atelier'), price: textField('$520'), note: textField('Full concierge, print-ready'), ctaText: textField('Choose') },
      ],
      settings: {
        ...defaultSettings(),
        backgroundColor: 'gradient-dark',
        textColor: 'inverse',
      },
    };
  }

  if (template === 'final') {
    return {
      type: 'commerce',
      variant: 'final',
      id: `final-${generateIdSuffix()}`,
      eyebrow: textField('Begin your piece'),
      headline: textField('Your scarf, composed like a signature.'),
      body: textField('Start with guided templates, textile-safe colors, and a calmer path from idea to production.'),
      ctaText: textField('Create your scarf'),
      settings: {
        ...defaultSettings(),
        backgroundColor: 'gradient-dark',
        textColor: 'inverse',
      },
    };
  }

  if (template.startsWith('footer-')) {
    const variant = template.slice(7) as LandingFooterVariant;
    return {
      type: 'footer',
      variant,
      id,
      brandText: textField('Haus of Nahkya'),
      links: [textField('Privacy'), textField('Terms'), textField('Contact')],
      copyright: textField('© Haus of Nahkya. All rights reserved.'),
      settings: {
        ...defaultSettings(),
        backgroundColor: '#2C2C2C',
        textColor: 'inverse',
        padding: 'compact',
        align: 'left',
      },
    };
  }

  return {
    type: 'story',
    variant: 'default',
    id,
    headline: textField('New section'),
    body: textField('Edit this section from the ribbon.'),
    settings: defaultSettings(),
  };
}

function normalizeLandingPageConfig(data: Partial<LandingPageConfig>): LandingPageConfig {
  const fallback = getDefaultLandingPageConfig();

  const nav: LandingNavSection = {
    ...fallback.nav,
    ...data.nav,
    logoText: data.nav?.logoText ?? fallback.nav.logoText,
    links: Array.isArray(data.nav?.links) ? data.nav.links : fallback.nav.links,
    contactText: data.nav?.contactText ?? fallback.nav.contactText,
    contactTarget: data.nav?.contactTarget ?? fallback.nav.contactTarget,
    ctaText: data.nav?.ctaText ?? fallback.nav.ctaText,
    ctaTarget: data.nav?.ctaTarget ?? fallback.nav.ctaTarget,
    style: isNavStyle(data.nav?.style) ? data.nav.style : fallback.nav.style,
    sticky: typeof data.nav?.sticky === 'boolean' ? data.nav.sticky : fallback.nav.sticky,
  };

  const sections: LandingSection[] = Array.isArray(data.sections)
    ? data.sections.map((s) => normalizeSection(s)).filter((s): s is LandingSection => s !== null)
    : fallback.sections;

  return {
    enabled: typeof data.enabled === 'boolean' ? data.enabled : fallback.enabled,
    metaTitle: data.metaTitle ?? fallback.metaTitle,
    metaDescription: data.metaDescription ?? fallback.metaDescription,
    nav,
    sections,
  };
}

function normalizeSection(raw: unknown): LandingSection | null {
  if (!raw || typeof raw !== 'object') return null;
  const partial = raw as Partial<LandingSection> & { id?: string; type?: string };
  if (!partial.type) return null;

  const defaultSection = createDefaultSection(partial.type, (partial as { variant?: string }).variant, partial.id);
  if (!defaultSection) return null;

  const merged = { ...defaultSection, ...partial } as LandingContentSection;
  merged.settings = { ...defaultSection.settings, ...(partial as { settings?: Partial<LandingSectionSettings> }).settings };
  return merged as LandingSection;
}

function createDefaultSection(type: string, variant: string | undefined, id?: string): LandingContentSection | null {
  const template = buildTemplateKey(type, variant);
  if (!template) return null;
  const section = createSectionFromTemplate(template);
  if (id) section.id = id;
  return section as LandingContentSection;
}

function buildTemplateKey(type: string, variant?: string): string | null {
  switch (type) {
    case 'hero':
      return `hero-${isHeroVariant(variant) ? variant : 'default'}`;
    case 'story':
      return `story-${isStoryVariant(variant) ? variant : 'default'}`;
    case 'tools':
      return `tools-${isToolsVariant(variant) ? variant : 'default'}`;
    case 'gallery':
      return `gallery-${isGalleryVariant(variant) ? variant : 'lookbook'}`;
    case 'trust':
      return `trust-${isTrustVariant(variant) ? variant : 'testimonials'}`;
    case 'commerce':
      return variant === 'final' ? 'final' : `commerce-${isCommerceVariant(variant) ? variant : 'pricing'}`;
    case 'footer':
      return `footer-${isFooterVariant(variant) ? variant : 'default'}`;
    default:
      return null;
  }
}

function isNavStyle(value?: string): value is LandingNavSection['style'] {
  return value === 'solid' || value === 'transparent' || value === 'floating';
}

function isHeroVariant(value?: string): value is LandingHeroVariant {
  return value === 'default' || value === 'editorial' || value === 'split' || value === 'product';
}

function isStoryVariant(value?: string): value is LandingStoryVariant {
  return value === 'default' || value === 'founder' || value === 'campaign';
}

function isToolsVariant(value?: string): value is LandingToolsVariant {
  return value === 'default' || value === 'process' || value === 'grid';
}

function isGalleryVariant(value?: string): value is LandingGalleryVariant {
  return value === 'lookbook' || value === 'product' || value === 'editorial';
}

function isTrustVariant(value?: string): value is LandingTrustVariant {
  return value === 'testimonials' || value === 'press';
}

function isCommerceVariant(value?: string): value is LandingCommerceVariant {
  return value === 'pricing' || value === 'waitlist' || value === 'booking' || value === 'final';
}

function isFooterVariant(value?: string): value is LandingFooterVariant {
  return value === 'default' || value === 'simple' || value === 'full';
}

function setFieldAtPath(
  section: LandingContentSection,
  path: string,
  updater: (field: unknown) => unknown,
): LandingContentSection {
  return setFieldAtPathRecursive(section, path.split('.'), updater) as LandingContentSection;
}

function setFieldAtPathRecursive(
  target: unknown,
  keys: string[],
  updater: (field: unknown) => unknown,
): unknown {
  if (keys.length === 0) return target;
  if (keys.length === 1) {
    if (Array.isArray(target)) {
      const idx = Number(keys[0]);
      const copy = [...target];
      copy[idx] = updater(copy[idx]);
      return copy;
    }
    if (target && typeof target === 'object') {
      return { ...(target as Record<string, unknown>), [keys[0]]: updater((target as Record<string, unknown>)[keys[0]]) };
    }
    return target;
  }

  const [key, ...rest] = keys;
  if (Array.isArray(target)) {
    const idx = Number(key);
    const copy = [...target];
    copy[idx] = setFieldAtPathRecursive(copy[idx], rest, updater);
    return copy;
  }
  if (target && typeof target === 'object') {
    return {
      ...(target as Record<string, unknown>),
      [key]: setFieldAtPathRecursive((target as Record<string, unknown>)[key], rest, updater),
    };
  }
  return target;
}

function sanitizeForFirestore<T>(value: T): T {
  if (value === undefined) return null as T;
  if (Array.isArray(value)) return value.map(sanitizeForFirestore) as T;
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value).map(([key, val]) => [key, sanitizeForFirestore(val)]);
    return Object.fromEntries(entries) as T;
  }
  return value;
}
