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
  DEFAULT_HOMEPAGE_CONFIG,
  getDefaultContent,
} from '@/types/homepage';

interface HomeContentState {
  config: HomepageConfig;
  isLoaded: boolean;
  isSaving: boolean;

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
  toggleVisibility: (id: string) => void;
  reorderSections: (newOrder: string[]) => void;
  setConfigState: (config: HomepageConfig) => void;
  saveConfig: () => Promise<void>;
  resetConfig: () => void;
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function sortSections(sections: HomepageSection[]): HomepageSection[] {
  return [...sections].sort((a, b) => a.order - b.order);
}

export const useHomeContentStore = create<HomeContentState>()((set, get) => ({
  config: { ...DEFAULT_HOMEPAGE_CONFIG },
  isLoaded: false,
  isSaving: false,

  addSection: (templateType) => {
    const sections = [...(get().config.sections ?? [])];
    const maxOrder = sections.reduce((max, s) => Math.max(max, s.order), -1);
    const newSection: HomepageSection = {
      id: generateId(),
      order: maxOrder + 1,
      templateType,
      settings: {
        backgroundColor: 'nahkya-ivory',
        textColor: 'nahkya-text',
        padding: 'lg',
        fullWidth: false,
        isVisible: true,
      },
      content: getDefaultContent(templateType),
    } as HomepageSection;

    set({
      config: {
        ...get().config,
        sections: sortSections([...sections, newSection]),
      },
    });
  },

  removeSection: (id) => {
    const sections = (get().config.sections ?? []).filter((s) => s.id !== id);
    // Re-order remaining
    const reordered = sections.map((s, idx) => ({ ...s, order: idx }));
    set({ config: { ...get().config, sections: reordered } });
  },

  moveSection: (id, direction) => {
    const sections = sortSections([...(get().config.sections ?? [])]);
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    // Swap orders
    const temp = sections[idx].order;
    sections[idx].order = sections[targetIdx].order;
    sections[targetIdx].order = temp;

    set({ config: { ...get().config, sections: sortSections(sections) } });
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
      settings: original.settings ? { ...original.settings } : {
        backgroundColor: 'nahkya-ivory',
        textColor: 'nahkya-text',
        padding: 'lg',
        fullWidth: false,
        isVisible: true,
      },
      content: JSON.parse(JSON.stringify(original.content)),
    } as HomepageSection;

    set({
      config: {
        ...get().config,
        sections: sortSections([...sections, copy]),
      },
    });
  },

  updateSectionContent: (id, updates) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return { ...s, content: { ...s.content, ...updates } } as HomepageSection;
    });
    set({ config: { ...get().config, sections } });
  },

  updateSectionSettings: (id, updates) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return { ...s, settings: { ...s.settings, ...updates } } as HomepageSection;
    });
    set({ config: { ...get().config, sections } });
  },

  toggleVisibility: (id) => {
    const sections = (get().config.sections ?? []).map((s) => {
      if (s.id !== id) return s;
      return { ...s, settings: { ...s.settings, isVisible: !(s.settings?.isVisible ?? true) } } as HomepageSection;
    });
    set({ config: { ...get().config, sections } });
  },

  reorderSections: (newOrder) => {
    const sections = (get().config.sections ?? []).map((s) => {
      const newIndex = newOrder.indexOf(s.id);
      return { ...s, order: newIndex >= 0 ? newIndex : s.order };
    });
    set({ config: { ...get().config, sections: sortSections(sections) } });
  },

  setConfigState: (config) => {
    set({ config });
  },

  saveConfig: async () => {
    set({ isSaving: true });
    try {
      // Only pass plain data — never spread the entire store state
      const { config } = get();
      await setConfig('homepage', config);
    } finally {
      set({ isSaving: false });
    }
  },

  resetConfig: () => {
    set({ config: { ...DEFAULT_HOMEPAGE_CONFIG } });
  },
}));

// Firestore subscription for homepage config
subscribeConfig<HomepageConfig>(
  'homepage',
  { ...DEFAULT_HOMEPAGE_CONFIG },
  (data) => {
    useHomeContentStore.setState({
      config: {
        ...data,
        sections: Array.isArray(data.sections) ? data.sections : DEFAULT_HOMEPAGE_CONFIG.sections,
      },
      isLoaded: true,
    });
  }
);
