import { create } from 'zustand';
import { buildSwatchColourCategories } from '@/lib/seedPalette';
import { subscribeConfig, setConfig } from '@/lib/firebase/db';
import type { Colour, ColourCategory } from '@/types';

function seedCategories(): ColourCategory[] {
  return buildSwatchColourCategories();
}

const DEFAULT_COLOUR: Colour = { id: 'gold', name: 'NAHKYA Gold', hex: '#B88B4A' };

const FALLBACK = {
  categories: seedCategories(),
  selectedColour: DEFAULT_COLOUR,
  recentColours: [] as Colour[],
};

interface ColourState {
  categories: ColourCategory[];
  selectedColour: Colour;
  recentColours: Colour[];
  isLoaded: boolean;
  persist: () => void;
  setSelectedColour: (c: Colour) => void;
  addToRecent: (c: Colour) => void;
  addCategory: (c: ColourCategory) => void;
  removeCategory: (id: string) => void;
  addColourToCategory: (catId: string, colour: Colour) => void;
  removeColourFromCategory: (catId: string, colourId: string) => void;
  renameCategory: (id: string, name: string) => void;
  renameColour: (catId: string, colourId: string, name: string) => void;
  removeColour: (catId: string, colourId: string) => void;
  updateColourHex: (catId: string, colourId: string, hex: string) => void;
  createCategory: (name: string) => void;
  replaceSystemCategories: (cats: ColourCategory[]) => void;
  clearSystemCategories: () => void;
}

export const useColourStore = create<ColourState>((set, get) => ({
  ...FALLBACK,
  isLoaded: false,

  persist: () => {
    const { categories, selectedColour, recentColours } = get();
    setConfig('colours', { categories, selectedColour, recentColours });
  },

  setSelectedColour: (c) => {
    set({ selectedColour: c });
    get().persist();
  },

  addToRecent: (c) => {
    const filtered = get().recentColours.filter((r) => r.hex !== c.hex);
    const next = { recentColours: [c, ...filtered].slice(0, 12) };
    set(next);
    get().persist();
  },

  addCategory: (c) => {
    const next = { categories: [...get().categories, c] };
    set(next);
    get().persist();
  },

  removeCategory: (id) => {
    const next = { categories: get().categories.filter((c) => c.id !== id) };
    set(next);
    get().persist();
  },

  addColourToCategory: (catId, colour) => {
    const next = {
      categories: get().categories.map((c) =>
        c.id === catId ? { ...c, colours: [...c.colours, colour] } : c
      ),
    };
    set(next);
    get().persist();
  },

  removeColourFromCategory: (catId, colourId) => {
    const next = {
      categories: get().categories.map((c) =>
        c.id === catId ? { ...c, colours: c.colours.filter((col) => col.id !== colourId) } : c
      ),
    };
    set(next);
    get().persist();
  },

  renameCategory: (id, name) => {
    const next = {
      categories: get().categories.map((c) => (c.id === id ? { ...c, name } : c)),
    };
    set(next);
    get().persist();
  },

  renameColour: (catId, colourId, name) => {
    const next = {
      categories: get().categories.map((c) =>
        c.id === catId
          ? { ...c, colours: c.colours.map((col) => (col.id === colourId ? { ...col, name } : col)) }
          : c
      ),
    };
    set(next);
    get().persist();
  },

  removeColour: (catId, colourId) => {
    const next = {
      categories: get().categories.map((c) =>
        c.id === catId ? { ...c, colours: c.colours.filter((col) => col.id !== colourId) } : c
      ),
    };
    set(next);
    get().persist();
  },

  updateColourHex: (catId, colourId, hex) => {
    const next = {
      categories: get().categories.map((c) =>
        c.id === catId
          ? { ...c, colours: c.colours.map((col) => (col.id === colourId ? { ...col, hex } : col)) }
          : c
      ),
      selectedColour:
        get().selectedColour.id === colourId ? { ...get().selectedColour, hex } : get().selectedColour,
    };
    set(next);
    get().persist();
  },

  createCategory: (name) => {
    const next = {
      categories: [
        ...get().categories,
        { id: `custom-${Date.now()}`, name, colours: [], columns: 5 },
      ],
    };
    set(next);
    get().persist();
  },

  replaceSystemCategories: (cats) => {
    const next = {
      categories: [...get().categories.filter((c) => !c.isSystem), ...cats],
    };
    set(next);
    get().persist();
  },

  clearSystemCategories: () => {
    const next = {
      categories: get().categories.filter((c) => !c.isSystem),
    };
    set(next);
    get().persist();
  },
}));

function isOldFlatStructure(categories: ColourCategory[]): boolean {
  // Oldest structure used IDs like "f0-s0" without a tone index.
  return categories.some(
    (cat) => cat.isSystem && cat.colours.some((c) => /^f\d+-s\d+$/.test(c.id))
  );
}

function isOldFamilyStructure(categories: ColourCategory[]): boolean {
  // Previous 200-colour system used category IDs like "family-0", "family-1"...
  // New 360-swatch system uses IDs like "reds-burgundy", "rose-blush"...
  return categories.some(
    (cat) => cat.isSystem && /^family-\d+$/.test(cat.id)
  );
}

function ensureSystemCategories(categories: ColourCategory[]): ColourCategory[] {
  const hasSystem = categories.some((c) => c.isSystem);
  if (!hasSystem) return [...seedCategories(), ...categories];

  // Always replace old generated-tone families with the new flat swatch system
  if (isOldFlatStructure(categories) || isOldFamilyStructure(categories)) {
    const customCats = categories.filter((c) => !c.isSystem);
    return [...seedCategories(), ...customCats];
  }

  // If saved system categories don't match current seed IDs,
  // replace them (handles swatch system updates)
  const seedIds = new Set(seedCategories().map((c) => c.id));
  const savedSystemIds = categories.filter((c) => c.isSystem).map((c) => c.id);
  const hasAllCurrent = savedSystemIds.every((id) => seedIds.has(id));
  if (!hasAllCurrent) {
    const customCats = categories.filter((c) => !c.isSystem);
    return [...seedCategories(), ...customCats];
  }

  return categories;
}

subscribeConfig('colours', FALLBACK, (data) => {
  const categories = ensureSystemCategories(data.categories ?? FALLBACK.categories);
  useColourStore.setState({ ...data, categories, isLoaded: true });
});
