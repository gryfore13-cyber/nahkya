import { create } from 'zustand';
import {
  subscribeConfig,
  setConfig,
} from '@/lib/firebase/db';
import {
  type HomepageConfig,
  type HomepageSection,
  type TemplateType,
  type SectionSettings,
  type SectionStatus,
  type SectionAnimation,
  type SectionMediaSettings,
  type SectionResponsiveSettings,
  DEFAULT_HOMEPAGE_CONFIG,
  getDefaultContent,
  normalizeSection,
  DEFAULT_SECTION_SETTINGS,
  DEFAULT_SECTION_ANIMATION,
} from '@/types/homepage';

interface HomeContentState {
  config: HomepageConfig;
  isLoaded: boolean;
  isSaving: boolean;
  saveError: string | null;
  // Publishing workflow
  hasDraftChanges: boolean;
  lastPublishedAt: string | null;

  // Actions
  addSection: (templateType: TemplateType) => void;
  removeSection: (id: string) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  duplicateSection: (id: string) => void;
  updateSectionContent: (
    id: string,
    updates: Partial<HomepageSection['content']>
  ) => void;
  updateSectionSettings: (id: string, updates: Partial<SectionSettings>) => void;
  updateSectionStatus: (id: string, status: SectionStatus) => void;
  updateSectionAnimation: (id: string, animation: Partial<SectionAnimation>) => void;
  updateSectionMedia: (id: string, media: Partial<SectionMediaSettings>) => void;
  updateSectionResponsive: (id: string, responsive: Partial<SectionResponsiveSettings>) => void;
  updateSectionName: (id: string, name: string) => void;
  toggleVisibility: (id: string) => void;
  reorderSections: (newOrder: string[]) => void;
  setConfigState: (config: HomepageConfig) => void;
  saveConfig: () => Promise<void>;
  publishSection: (id: string) => Promise<void>;
  publishAll: () => Promise<void>;
  resetConfig: () => void;
  clearSaveError: () => void;
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function sortSections(sections: HomepageSection[]): HomepageSection[] {
  return [...sections].sort((a, b) => a.order - b.order);
}

function normalizeConfig(config: Partial<HomepageConfig>): HomepageConfig {
  const sections = Array.isArray(config.sections)
    ? config.sections.map((s) => {
        if (!s || !s.id || !s.templateType) return null;
        return normalizeSection(s as Partial<HomepageSection> & { id: string; templateType: TemplateType });
      }).filter((s): s is HomepageSection => s !== null)
    : [];

  return {
    sections: sortSections(sections),
    metaTitle: config.metaTitle ?? DEFAULT_HOMEPAGE_CONFIG.metaTitle,
    metaDescription: config.metaDescription ?? DEFAULT_HOMEPAGE_CONFIG.metaDescription,
  };
}

export const useHomeContentStore = create<HomeContentState>()((set, get) => ({
  config: { ...DEFAULT_HOMEPAGE_CONFIG },
  isLoaded: false,
  isSaving: false,
  saveError: null,
  hasDraftChanges: false,
  lastPublishedAt: null,

  addSection: (templateType) => {
    const sections = [...(get().config.sections ?? [])];
    const maxOrder = sections.reduce((max, s) => Math.max(max, s.order), -1);
    const newSection: HomepageSection = {
      id: generateId(),
      order: maxOrder + 1,
      name: TEMPLATE_LABELS[templateType] ?? 'New Section',
      templateType,
      status: 'draft',
      animation: { ...DEFAULT_SECTION_ANIMATION },
      settings: { ...DEFAULT_SECTION_SETTINGS },
      content: getDefaultContent(templateType),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as HomepageSection;

    set({
      config: {
        ...get().config,
        sections: sortSections([...sections, newSection]),
      },
      hasDraftChanges: true,
    });
  },

  removeSection: (id) => {
    const sections = (get().config.sections ?? []).filter((s) => s.id !== id);
    const reordered = sections.map((s, idx) => ({ ...s, order: idx }));
    set({
      config: { ...get().config, sections: reordered },
      hasDraftChanges: true,
    });
  },

  moveSection: (id, direction) => {
    const sections = sortSections([...(get().config.sections ?? [])]);
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const nextSections = sections.map((s, i) => {
      if (i === idx) return { ...s, order: sections[targetIdx].order };
      if (i === targetIdx) return { ...s, order: sections[idx].order };
      return s;
    });

    set({
      config: { ...get().config, sections: sortSections(nextSections) },
      hasDraftChanges: true,
    });
  },

  duplicateSection: (id) => {
    const original = (get().config.sections ?? []).find((s) => s.id === id);
    if (!original) return;

    const sections = [...(get().config.sections ?? [])];
    const maxOrder = sections.reduce((max, s) => Math.max(max, s.order), -1);
    const copy: HomepageSection = {
      ...original,
      id: generateId(),
      order: maxOrder + 1,
      name: `${original.name ?? TEMPLATE_LABELS[original.templateType]} (Copy)`,
      status: 'draft',
      settings: original.settings ? { ...original.settings } : { ...DEFAULT_SECTION_SETTINGS },
      content: JSON.parse(JSON.stringify(original.content)),
      animation: original.animation ? { ...original.animation } : { ...DEFAULT_SECTION_ANIMATION },
      media: original.media ? { ...original.media } : undefined,
      responsive: original.responsive ? { ...original.responsive } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as HomepageSection;

    set({
      config: {
        ...get().config,
        sections: sortSections([...sections, copy]),
      },
      hasDraftChanges: true,
    });
  },

  updateSectionContent: (id, updates) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        content: { ...s.content, ...updates },
        updatedAt: new Date().toISOString(),
      } as HomepageSection;
    });
    set({
      config: { ...get().config, sections },
      hasDraftChanges: true,
    });
  },

  updateSectionSettings: (id, updates) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        settings: { ...s.settings, ...updates },
        updatedAt: new Date().toISOString(),
      } as HomepageSection;
    });
    set({
      config: { ...get().config, sections },
      hasDraftChanges: true,
    });
  },

  updateSectionStatus: (id, status) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        status,
        settings: { ...s.settings, isVisible: status !== 'hidden' },
        updatedAt: new Date().toISOString(),
      } as HomepageSection;
    });
    set({
      config: { ...get().config, sections },
      hasDraftChanges: true,
    });
  },

  updateSectionAnimation: (id, animation) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        animation: { ...s.animation, ...animation },
        updatedAt: new Date().toISOString(),
      } as HomepageSection;
    });
    set({
      config: { ...get().config, sections },
      hasDraftChanges: true,
    });
  },

  updateSectionMedia: (id, media) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        media: { ...s.media, ...media },
        updatedAt: new Date().toISOString(),
      } as HomepageSection;
    });
    set({
      config: { ...get().config, sections },
      hasDraftChanges: true,
    });
  },

  updateSectionResponsive: (id, responsive) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        responsive: { ...s.responsive, ...responsive },
        updatedAt: new Date().toISOString(),
      } as HomepageSection;
    });
    set({
      config: { ...get().config, sections },
      hasDraftChanges: true,
    });
  },

  updateSectionName: (id, name) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return { ...s, name, updatedAt: new Date().toISOString() } as HomepageSection;
    });
    set({
      config: { ...get().config, sections },
      hasDraftChanges: true,
    });
  },

  toggleVisibility: (id) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      const isVisible = !(s.settings?.isVisible ?? true);
      return {
        ...s,
        status: isVisible ? 'published' : 'hidden',
        settings: { ...s.settings, isVisible },
        updatedAt: new Date().toISOString(),
      } as HomepageSection;
    });
    set({
      config: { ...get().config, sections },
      hasDraftChanges: true,
    });
  },

  reorderSections: (newOrder) => {
    const sections = (get().config.sections ?? []).map((s) => {
      const newIndex = newOrder.indexOf(s.id);
      return { ...s, order: newIndex >= 0 ? newIndex : s.order };
    });
    set({
      config: { ...get().config, sections: sortSections(sections) },
      hasDraftChanges: true,
    });
  },

  setConfigState: (config) => {
    set({ config });
  },

  saveConfig: async () => {
    set({ isSaving: true, saveError: null });
    try {
      const { config } = get();
      await setConfig('homepage', config);
      set({ hasDraftChanges: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save. Check your connection and permissions.';
      set({ saveError: message });
    } finally {
      set({ isSaving: false });
    }
  },

  publishSection: async (id) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        status: 'published' as SectionStatus,
        settings: { ...s.settings, isVisible: true },
        updatedAt: new Date().toISOString(),
      } as HomepageSection;
    });
    set({
      config: { ...get().config, sections },
      hasDraftChanges: true,
    });
    await get().saveConfig();
    set({ lastPublishedAt: new Date().toISOString() });
  },

  publishAll: async () => {
    const sections = (get().config.sections ?? []).map((s) => ({
      ...s,
      status: 'published' as SectionStatus,
      settings: { ...s.settings, isVisible: true },
      updatedAt: new Date().toISOString(),
    }));
    set({
      config: { ...get().config, sections },
      hasDraftChanges: true,
    });
    await get().saveConfig();
    set({ lastPublishedAt: new Date().toISOString(), hasDraftChanges: false });
  },

  resetConfig: () => {
    set({ config: { ...DEFAULT_HOMEPAGE_CONFIG }, hasDraftChanges: true });
  },

  clearSaveError: () => {
    set({ saveError: null });
  },
}));

// Firestore subscription for homepage config
subscribeConfig<HomepageConfig>(
  'homepage',
  { ...DEFAULT_HOMEPAGE_CONFIG },
  (data) => {
    useHomeContentStore.setState({
      config: normalizeConfig(data),
      isLoaded: true,
    });
  }
);

// Helper for template labels (local since we can't import from types in store cycle)
const TEMPLATE_LABELS: Record<TemplateType, string> = {
  splitScreenHero: 'Split-Screen Hero',
  singleColumnFocus: 'Single-Column Focus',
  zPattern: 'Z-Pattern Layout',
  fPattern: 'F-Pattern Layout',
  invertedPyramid: 'Inverted Pyramid',
  cardGrid: 'Card Grid Layout',
  alternating: 'Alternating Section Layout',
  longFormSales: 'Long-Form Sales Page',
  storytellingScroll: 'Storytelling Scroll Layout',
  asymmetricalEditorial: 'Asymmetrical Editorial Layout',
  productShowcase: 'Product Showcase Layout',
  leadCapture: 'Lead Capture / Waitlist Layout',
  benefits: 'Benefits Section',
  testimonials: 'Testimonials Section',
  faq: 'FAQ Section',
  howItWorks: 'How It Works Section',
  lookbook: 'Lookbook Section',
  collectionPreview: 'Collection Preview Section',
};
