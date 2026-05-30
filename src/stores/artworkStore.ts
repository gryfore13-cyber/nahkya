import { create } from 'zustand';
import type { ArtworkDoc, ArtworkStatus } from '@/types';
import {
  getCollection,
  addDocToCollection,
  updateDocInCollection,
  deleteDocFromCollection,
  subscribeCollection,
} from '@/lib/firebase/db';

const COLLECTION = 'artworks';

interface ArtworkState {
  artworks: ArtworkDoc[];
  isLoading: boolean;
  error: string | null;
  fetchArtworks: () => Promise<void>;
  addArtwork: (artwork: Omit<ArtworkDoc, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateArtwork: (id: string, data: Partial<ArtworkDoc>) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;
  approveArtwork: (id: string) => Promise<void>;
  rejectArtwork: (id: string, notes: string) => Promise<void>;
  subscribe: () => (() => void);
  getByDesigner: (designerId: string) => ArtworkDoc[];
  getByStatus: (status: ArtworkStatus) => ArtworkDoc[];
}

function docToArtwork(doc: Record<string, unknown> & { id: string }): ArtworkDoc {
  return {
    id: doc.id,
    name: String(doc.name || ''),
    category: String(doc.category || ''),
    image: doc.image ? String(doc.image) : undefined,
    thumbnail: doc.thumbnail ? String(doc.thumbnail) : undefined,
    description: String(doc.description || ''),
    designerId: String(doc.designerId || ''),
    designerName: String(doc.designerName || ''),
    status: (doc.status as ArtworkStatus) || 'pending_review',
    reviewNotes: String(doc.reviewNotes || ''),
    available: Boolean(doc.available ?? true),
    createdAt: doc.createdAt ? String(doc.createdAt) : new Date().toISOString(),
    updatedAt: doc.updatedAt ? String(doc.updatedAt) : new Date().toISOString(),
  };
}

export const useArtworkStore = create<ArtworkState>((set, get) => ({
  artworks: [],
  isLoading: false,
  error: null,

  fetchArtworks: async () => {
    set({ isLoading: true, error: null });
    try {
      const docs = await getCollection<Record<string, unknown> & { id: string }>(COLLECTION);
      set({ artworks: docs.map(docToArtwork), isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch artworks', isLoading: false });
    }
  },

  addArtwork: async (artwork) => {
    const id = await addDocToCollection(COLLECTION, artwork as Record<string, unknown>);
    await get().fetchArtworks();
    return id;
  },

  updateArtwork: async (id, data) => {
    await updateDocInCollection(COLLECTION, id, data as Record<string, unknown>);
    await get().fetchArtworks();
  },

  deleteArtwork: async (id) => {
    await deleteDocFromCollection(COLLECTION, id);
    await get().fetchArtworks();
  },

  approveArtwork: async (id) => {
    await updateDocInCollection(COLLECTION, id, {
      status: 'approved',
      available: true,
      reviewNotes: '',
    });
    await get().fetchArtworks();
  },

  rejectArtwork: async (id, notes) => {
    await updateDocInCollection(COLLECTION, id, {
      status: 'rejected',
      available: false,
      reviewNotes: notes,
    });
    await get().fetchArtworks();
  },

  subscribe: () => {
    set({ isLoading: true });
    return subscribeCollection<Record<string, unknown> & { id: string }>(
      COLLECTION,
      (docs) => {
        set({ artworks: docs.map(docToArtwork), isLoading: false, error: null });
      }
    );
  },

  getByDesigner: (designerId) => get().artworks.filter((a) => a.designerId === designerId),

  getByStatus: (status) => get().artworks.filter((a) => a.status === status),
}));
