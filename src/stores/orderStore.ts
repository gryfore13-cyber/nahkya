import { create } from 'zustand';
import type { Order, OrderStatus } from '@/types';
import {
  getCollection,
  getCollectionQuery,
  addDocToCollection,
  updateDocInCollection,
  deleteDocFromCollection,
  subscribeCollection,
  where,
} from '@/lib/firebase/db';

const COLLECTION = 'orders';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrdersByUser: (userId: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  subscribe: () => (() => void);
  getByUser: (userId: string) => Order[];
  getByStatus: (status: OrderStatus) => Order[];
  getStats: () => { total: number; pending: number; inProduction: number; completed: number; revenue: number };
}

function docToOrder(doc: Record<string, unknown> & { id: string }): Order {
  return {
    id: doc.id,
    userId: String(doc.userId || ''),
    userName: String(doc.userName || ''),
    designId: String(doc.designId || ''),
    designName: String(doc.designName || ''),
    artworkId: doc.artworkId ? String(doc.artworkId) : undefined,
    artworkName: doc.artworkName ? String(doc.artworkName) : undefined,
    designerId: doc.designerId ? String(doc.designerId) : undefined,
    designerName: doc.designerName ? String(doc.designerName) : undefined,
    tool: (doc.tool as 'atelier' | 'monogram' | 'petak') || 'atelier',
    size: String(doc.size || ''),
    amount: Number(doc.amount || 0),
    currency: String(doc.currency || 'BND'),
    status: (doc.status as OrderStatus) || 'submitted',
    notes: String(doc.notes || ''),
    adminNotes: String(doc.adminNotes || ''),
    createdAt: doc.createdAt ? String(doc.createdAt) : new Date().toISOString(),
    updatedAt: doc.updatedAt ? String(doc.updatedAt) : new Date().toISOString(),
  };
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const docs = await getCollection<Record<string, unknown> & { id: string }>(COLLECTION);
      set({ orders: docs.map(docToOrder), isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch orders', isLoading: false });
    }
  },

  fetchOrdersByUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const docs = await getCollectionQuery<Record<string, unknown> & { id: string }>(
        COLLECTION,
        where('userId', '==', userId)
      );
      set({ orders: docs.map(docToOrder), isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch orders', isLoading: false });
    }
  },

  addOrder: async (order) => {
    const id = await addDocToCollection(COLLECTION, order as Record<string, unknown>);
    await get().fetchOrdersByUser(order.userId);
    return id;
  },

  updateOrder: async (id, data) => {
    await updateDocInCollection(COLLECTION, id, data as Record<string, unknown>);
    const userId = get().orders.find((o) => o.id === id)?.userId;
    if (userId) {
      await get().fetchOrdersByUser(userId);
    } else {
      await get().fetchOrders();
    }
  },

  deleteOrder: async (id) => {
    await deleteDocFromCollection(COLLECTION, id);
    const userId = get().orders.find((o) => o.id === id)?.userId;
    if (userId) {
      await get().fetchOrdersByUser(userId);
    } else {
      await get().fetchOrders();
    }
  },

  updateStatus: async (id, status) => {
    await updateDocInCollection(COLLECTION, id, { status, updatedAt: new Date().toISOString() });
    const userId = get().orders.find((o) => o.id === id)?.userId;
    if (userId) {
      await get().fetchOrdersByUser(userId);
    } else {
      await get().fetchOrders();
    }
  },

  subscribe: () => {
    set({ isLoading: true });
    return subscribeCollection<Record<string, unknown> & { id: string }>(
      COLLECTION,
      (docs) => {
        set({ orders: docs.map(docToOrder), isLoading: false, error: null });
      }
    );
  },

  getByUser: (userId) => get().orders.filter((o) => o.userId === userId),

  getByStatus: (status) => get().orders.filter((o) => o.status === status),

  getStats: () => {
    const list = get().orders;
    return {
      total: list.length,
      pending: list.filter((o) => o.status === 'submitted' || o.status === 'changes_requested').length,
      inProduction: list.filter((o) => o.status === 'in_production' || o.status === 'paid_pending_production').length,
      completed: list.filter((o) => o.status === 'completed').length,
      revenue: list.filter((o) => o.status === 'paid_pending_production' || o.status === 'in_production' || o.status === 'ready_for_collection' || o.status === 'completed').reduce((sum, o) => sum + o.amount, 0),
    };
  },
}));
