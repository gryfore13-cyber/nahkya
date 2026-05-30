import { create } from 'zustand';
import type { SavedDesign } from '@/types';
import {
  getCollection,
  addDocToCollection,
  updateDocInCollection,
  deleteDocFromCollection,
  subscribeCollection,
} from '@/lib/firebase/db';

const COLLECTION = 'savedDesigns';

interface SavedDesignState {
  designs: SavedDesign[];
  isLoading: boolean;
  error: string | null;
  fetchDesigns: () => Promise<void>;
  addDesign: (design: Omit<SavedDesign, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateDesign: (id: string, data: Partial<SavedDesign>) => Promise<void>;
  deleteDesign: (id: string) => Promise<void>;
  subscribe: () => (() => void);
  getByUser: (userId: string) => SavedDesign[];
}

function docToDesign(doc: Record<string, unknown> & { id: string }): SavedDesign {
  return {
    id: doc.id,
    name: String(doc.name || ''),
    tool: (doc.tool as 'atelier' | 'monogram' | 'petak') || 'atelier',
    thumbnail: String(doc.thumbnail || ''),
    userId: doc.userId ? String(doc.userId) : undefined,
    snapshot: doc.snapshot ? (doc.snapshot as Record<string, unknown>) : undefined,
    createdAt: doc.createdAt ? String(doc.createdAt) : new Date().toISOString(),
    updatedAt: doc.updatedAt ? String(doc.updatedAt) : new Date().toISOString(),
  };
}

export const useSavedDesignStore = create<SavedDesignState>((set, get) => ({
  designs: [],
  isLoading: false,
  error: null,

  fetchDesigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const docs = await getCollection<Record<string, unknown> & { id: string }>(COLLECTION);
      set({ designs: docs.map(docToDesign), isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch designs', isLoading: false });
    }
  },

  addDesign: async (design) => {
    const id = await addDocToCollection(COLLECTION, design as Record<string, unknown>);
    await get().fetchDesigns();
    return id;
  },

  updateDesign: async (id, data) => {
    await updateDocInCollection(COLLECTION, id, data as Record<string, unknown>);
    await get().fetchDesigns();
  },

  deleteDesign: async (id) => {
    await deleteDocFromCollection(COLLECTION, id);
    await get().fetchDesigns();
  },

  subscribe: () => {
    set({ isLoading: true });
    return subscribeCollection<Record<string, unknown> & { id: string }>(
      COLLECTION,
      (docs) => {
        set({ designs: docs.map(docToDesign), isLoading: false, error: null });
      }
    );
  },

  getByUser: (userId) => get().designs.filter((d) => (d as unknown as Record<string, string>).userId === userId),
}));
