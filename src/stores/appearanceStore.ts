import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeConfig, setConfig } from '@/lib/firebase/db';
import { getTheme, updateTheme } from '@/lib/themeService';

export interface SectionVisibility {
  hero: boolean;
  brandIntro: boolean;
  philosophy: boolean;
  toolPreviews: boolean;
  howItWorks: boolean;
  membershipCTA: boolean;
  editorialPreview: boolean;
  contactCTA: boolean;
}

interface AppearanceState {
  // ── Existing appearance config (Firestore-backed) ──
  colors: Record<string, string>;
  sections: SectionVisibility;
  isLoaded: boolean;

  // ── New CSS theme tokens ──
  tokens: Record<string, string>;
  isLoading: boolean;
  isHydrated: boolean;

  // ── Existing actions ──
  updateColor: (key: string, value: string) => void;
  updateSection: (key: keyof SectionVisibility, value: boolean) => void;
  reset: () => void;

  // ── New theme actions ──
  initTheme: () => Promise<void>;
  setToken: (key: string, value: string) => void;
  applyAllTokens: () => void;
  resetTokens: () => void;
  exportCSS: () => string;
  exportJSON: () => string;
}

const DEFAULT_COLORS = {
  ivory: '#F8F1E8', cream: '#FFF9F2', charcoal: '#2D211D',
  gold: '#B88B4A', goldLight: '#D8BE96', goldMuted: '#9A7B52',
  taupe: '#7B6A60', stone: '#D8BE96', textSecondary: '#7B6A60',
};

const DEFAULT_SECTIONS: SectionVisibility = {
  hero: true, brandIntro: true, philosophy: true, toolPreviews: true,
  howItWorks: true, membershipCTA: true, editorialPreview: true, contactCTA: true,
};

// ── v10 Soft Burgundy + Gold Tokens ──
export const DEFAULT_TOKENS: Record<string, string> = {
  // Soft Nahkya Base
  'nahkya-bg': '#F8F1E8',
  'nahkya-surface': '#FFF9F2',
  'nahkya-surface-soft': '#F1E4DA',
  'nahkya-surface-warm': '#F6EADF',

  // Text
  'nahkya-text': '#2D211D',
  'nahkya-text-strong': '#1F1714',
  'nahkya-text-muted': '#7B6A60',
  'nahkya-text-soft': '#9A877A',
  'nahkya-text-inverse': '#FFF9F2',

  // Burgundy
  'nahkya-burgundy': '#7B1E2B',
  'nahkya-burgundy-dark': '#4B161D',
  'nahkya-burgundy-soft': '#EAD5D8',

  // Antique Gold
  'nahkya-gold': '#B88B4A',
  'nahkya-gold-soft': '#D8BE96',
  'nahkya-gold-muted': '#9A7B52',
  'nahkya-gold-veil': '#EFE2C7',

  // Borders
  'nahkya-border': '#E5D5C7',
  'nahkya-border-strong': '#D8BE96',

  // Status
  'nahkya-error': '#B42318',
  'nahkya-error-soft': '#F5E0DC',
  'nahkya-success': '#2F7D4F',
  'nahkya-success-soft': '#E0F0E5',

  // Legacy mappings (for backward compatibility with components using old names)
  'nahkya-ivory': '#F8F1E8',
  'nahkya-cream': '#FFF9F2',
  'nahkya-stone': '#D8BE96',
  'nahkya-taupe': '#7B6A60',
  'nahkya-sand': '#B88B4A',
  'nahkya-charcoal': '#2D211D',
  'nahkya-soft-black': '#1F1714',
  'nahkya-gold-light': '#D8BE96',
  'nahkya-text-secondary': '#7B6A60',
  'nahkya-rose': '#7B1E2B',

  // Typography
  'font-display-xxl': '4.5rem',
  'font-display-xl': '3.75rem',
  'font-display-lg': '3rem',
  'font-display-md': '2.25rem',
  'font-display-sm': '1.875rem',
  'font-heading-lg': '1.5rem',
  'font-heading-md': '1.25rem',
  'font-mono-lg': '1.125rem',
  'font-mono-md': '1rem',
  'font-mono-sm': '0.875rem',

  // Spacing & Effects
  'radius-nahkya': '2px',
  'shadow-gold': '0 4px 20px rgba(184,139,74,0.15)',

  // Workspace (Light v10)
  'workspace-bg': '#F8F1E8',
  'workspace-sidebar': '#FFF9F2',
  'workspace-panel': '#FCF7F1',
  'workspace-border': '#D8BE96',
  'workspace-hover': '#EFE2C7',
};

const FALLBACK = { colors: DEFAULT_COLORS, sections: DEFAULT_SECTIONS };

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set, get) => ({
      colors: DEFAULT_COLORS,
      sections: DEFAULT_SECTIONS,
      isLoaded: false,
      tokens: { ...DEFAULT_TOKENS },
      isLoading: false,
      isHydrated: false,

      updateColor: (key, value) => {
        const nextColors = { ...get().colors, [key]: value };
        set({ colors: nextColors });
        setConfig('appearance', { colors: nextColors, sections: get().sections });
      },

      updateSection: (key, value) => {
        const nextSections = { ...get().sections, [key]: value };
        set({ sections: nextSections });
        setConfig('appearance', { colors: get().colors, sections: nextSections });
      },

      reset: () => {
        set(FALLBACK);
        setConfig('appearance', FALLBACK);
      },

      initTheme: async () => {
        set({ isLoading: true });
        const remote = await getTheme();
        if (remote) {
          const merged = { ...DEFAULT_TOKENS, ...remote };
          set({ tokens: merged });
          get().applyAllTokens();
        }
        set({ isLoading: false, isHydrated: true });
      },

      setToken: (key, value) => {
        document.documentElement.style.setProperty('--' + key, value);
        const nextTokens = { ...get().tokens, [key]: value };
        set({ tokens: nextTokens });
        updateTheme(nextTokens);
      },

      applyAllTokens: () => {
        Object.entries(get().tokens).forEach(([key, value]) => {
          document.documentElement.style.setProperty('--' + key, value);
        });
      },

      resetTokens: () => {
        const defaults = { ...DEFAULT_TOKENS };
        set({ tokens: defaults });
        get().applyAllTokens();
        updateTheme(defaults);
      },

      exportCSS: () => {
        const lines = Object.entries(get().tokens)
          .map(([key, value]) => `  --${key}: ${value};`)
          .join('\n');
        return `:root {\n${lines}\n}`;
      },

      exportJSON: () => JSON.stringify(get().tokens, null, 2),
    }),
    {
      name: 'nahkya-appearance',
      partialize: (state) => ({ sections: state.sections }),
    }
  )
);

// Existing Firestore subscription for appearance colors / sections
subscribeConfig('appearance', FALLBACK, (data) => {
  useAppearanceStore.setState({ ...data, isLoaded: true });
});
