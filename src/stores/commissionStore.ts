import { create } from 'zustand';
import type { Commission } from '@/types';
import {
  getCollection,
  addDocToCollection,
  updateDocInCollection,
  subscribeCollection,
} from '@/lib/firebase/db';

const COLLECTION = 'commissions';

interface CommissionState {
  commissions: Commission[];
  isLoading: boolean;
  error: string | null;
  fetchCommissions: () => Promise<void>;
  createCommission: (commission: Omit<Commission, 'id' | 'createdAt'>) => Promise<string>;
  markAsPaid: (id: string) => Promise<void>;
  subscribe: () => (() => void);
  getByDesigner: (designerId: string) => Commission[];
  getPending: () => Commission[];
  getPaid: () => Commission[];
  getDesignerEarnings: (designerId: string) => { total: number; pending: number; paid: number };
}

function docToCommission(doc: Record<string, unknown> & { id: string }): Commission {
  return {
    id: doc.id,
    orderId: String(doc.orderId || ''),
    designerId: String(doc.designerId || ''),
    designerName: String(doc.designerName || ''),
    artworkId: String(doc.artworkId || ''),
    artworkName: String(doc.artworkName || ''),
    orderAmount: Number(doc.orderAmount || 0),
    commissionAmount: Number(doc.commissionAmount || 0),
    status: (doc.status as 'pending' | 'paid') || 'pending',
    createdAt: doc.createdAt ? String(doc.createdAt) : new Date().toISOString(),
    paidAt: doc.paidAt ? String(doc.paidAt) : null,
  };
}

export const useCommissionStore = create<CommissionState>((set, get) => ({
  commissions: [],
  isLoading: false,
  error: null,

  fetchCommissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const docs = await getCollection<Record<string, unknown> & { id: string }>(COLLECTION);
      set({ commissions: docs.map(docToCommission), isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch commissions', isLoading: false });
    }
  },

  createCommission: async (commission) => {
    const id = await addDocToCollection(COLLECTION, commission as Record<string, unknown>);
    await get().fetchCommissions();
    return id;
  },

  markAsPaid: async (id) => {
    await updateDocInCollection(COLLECTION, id, {
      status: 'paid',
      paidAt: new Date().toISOString(),
    });
    await get().fetchCommissions();
  },

  subscribe: () => {
    set({ isLoading: true });
    return subscribeCollection<Record<string, unknown> & { id: string }>(
      COLLECTION,
      (docs) => {
        set({ commissions: docs.map(docToCommission), isLoading: false, error: null });
      }
    );
  },

  getByDesigner: (designerId) => get().commissions.filter((c) => c.designerId === designerId),

  getPending: () => get().commissions.filter((c) => c.status === 'pending'),

  getPaid: () => get().commissions.filter((c) => c.status === 'paid'),

  getDesignerEarnings: (designerId) => {
    const list = get().commissions.filter((c) => c.designerId === designerId);
    return {
      total: list.reduce((sum, c) => sum + c.commissionAmount, 0),
      pending: list.filter((c) => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0),
      paid: list.filter((c) => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0),
    };
  },
}));
