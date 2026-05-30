import { create } from 'zustand';
import type { User } from '@/types';
import { getCollection, subscribeCollection, updateDocInCollection } from '@/lib/firebase/db';

const COLLECTION = 'users';

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  subscribe: () => (() => void);
  updateUser: (uid: string, data: Partial<User>) => Promise<void>;
  getMembers: () => User[];
  getMemberCount: () => number;
}

function docToUser(doc: Record<string, unknown> & { id: string }): User {
  return {
    uid: doc.id,
    email: String(doc.email || ''),
    displayName: String(doc.displayName || ''),
    role: (doc.role as 'member' | 'writer' | 'operations' | 'super_admin' | 'designer') || 'member',
    membershipTier: (doc.membershipTier as 'free' | 'collector') || 'free',
    avatar: doc.avatar ? String(doc.avatar) : undefined,
    approvalStatus: (doc.approvalStatus as User['approvalStatus']) || 'approved',
    registeredAt: doc.registeredAt ? String(doc.registeredAt) : undefined,
    approvedAt: doc.approvedAt ? String(doc.approvedAt) : undefined,
    approvedBy: doc.approvedBy ? String(doc.approvedBy) : undefined,
    rejectionReason: doc.rejectionReason ? String(doc.rejectionReason) : undefined,
  };
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const docs = await getCollection<Record<string, unknown> & { id: string }>(COLLECTION);
      set({ users: docs.map(docToUser), isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch users', isLoading: false });
    }
  },

  subscribe: () => {
    set({ isLoading: true });
    return subscribeCollection<Record<string, unknown> & { id: string }>(
      COLLECTION,
      (docs) => {
        set({ users: docs.map(docToUser), isLoading: false, error: null });
      }
    );
  },

  updateUser: async (uid, data) => {
    await updateDocInCollection(COLLECTION, uid, data as Record<string, unknown>);
    await get().fetchUsers();
  },

  getMembers: () => get().users.filter((u) => u.role === 'member' || u.role === 'super_admin'),

  getMemberCount: () => get().users.filter((u) => u.role === 'member').length,
}));
