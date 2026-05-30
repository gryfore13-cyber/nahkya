import { create } from 'zustand';
import type { Designer } from '@/types';
import {
  getCollection,
  addDocToCollection,
  updateDocInCollection,
  deleteDocFromCollection,
  subscribeCollection,
} from '@/lib/firebase/db';

const COLLECTION = 'designers';

interface DesignerState {
  designers: Designer[];
  isLoading: boolean;
  error: string | null;
  fetchDesigners: () => Promise<void>;
  addDesigner: (designer: Omit<Designer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateDesigner: (id: string, data: Partial<Designer>) => Promise<void>;
  deleteDesigner: (id: string) => Promise<void>;
  subscribe: () => (() => void);
  getActiveDesigners: () => Designer[];
  getDesignerById: (id: string) => Designer | undefined;
}

function docToDesigner(doc: Record<string, unknown> & { id: string }): Designer {
  return {
    id: doc.id,
    name: String(doc.name || ''),
    email: String(doc.email || ''),
    commissionRate: Number(doc.commissionRate || 0),
    bio: String(doc.bio || ''),
    avatar: String(doc.avatar || ''),
    isActive: Boolean(doc.isActive ?? true),
    createdAt: doc.createdAt ? String(doc.createdAt) : new Date().toISOString(),
    updatedAt: doc.updatedAt ? String(doc.updatedAt) : new Date().toISOString(),
  };
}

export const useDesignerStore = create<DesignerState>((set, get) => ({
  designers: [],
  isLoading: false,
  error: null,

  fetchDesigners: async () => {
    set({ isLoading: true, error: null });
    try {
      const docs = await getCollection<Record<string, unknown> & { id: string }>(COLLECTION);
      set({ designers: docs.map(docToDesigner), isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch designers', isLoading: false });
    }
  },

  addDesigner: async (designer) => {
    const id = await addDocToCollection(COLLECTION, designer);
    await get().fetchDesigners();
    return id;
  },

  updateDesigner: async (id, data) => {
    await updateDocInCollection(COLLECTION, id, data as Record<string, unknown>);
    await get().fetchDesigners();
  },

  deleteDesigner: async (id) => {
    await deleteDocFromCollection(COLLECTION, id);
    await get().fetchDesigners();
  },

  subscribe: () => {
    set({ isLoading: true });
    return subscribeCollection<Record<string, unknown> & { id: string }>(
      COLLECTION,
      (docs) => {
        set({ designers: docs.map(docToDesigner), isLoading: false, error: null });
      }
    );
  },

  getActiveDesigners: () => get().designers.filter((d) => d.isActive),

  getDesignerById: (id) => get().designers.find((d) => d.id === id),
}));
