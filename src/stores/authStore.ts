import { create } from 'zustand';
import type { AuthUser, UserRole } from '@/lib/firebase/auth';
import { signIn, signUp, signOut, onAuthChange, signInWithGoogle, getGoogleRedirectResult, updateUserAvatar, updateUserProfile } from '@/lib/firebase/auth';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isDesigner: boolean;
  isApproved: boolean;
  role: UserRole | null;
  approvalStatus: import('@/types').ApprovalStatus | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  init: () => (() => void);
  updateAvatar: (avatar: string) => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isMember: false,
  isDesigner: false,
  isApproved: false,
  role: null,
  approvalStatus: null,

  login: async (email, password) => {
    const user = await signIn(email, password);
    get().setUser(user);
  },

  register: async (email, password, displayName) => {
    const user = await signUp(email, password, displayName);
    get().setUser(user);
  },

  logout: async () => {
    await signOut();
    get().setUser(null);
  },

  setUser: (user) => {
    const isApproved = user?.approvalStatus === 'approved';
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'super_admin',
      isMember: user?.role === 'member' || user?.role === 'super_admin',
      isDesigner: user?.role === 'designer',
      isApproved,
      role: user?.role || null,
      approvalStatus: user?.approvalStatus || null,
      isLoading: false,
    });
  },

  googleLogin: async () => {
    const user = await signInWithGoogle();
    if (user) get().setUser(user);
  },

  handleGoogleRedirect: async () => {
    const user = await getGoogleRedirectResult();
    if (user) get().setUser(user);
  },

  init: () => {
    set({ isLoading: true });
    const unsubscribe = onAuthChange((user) => {
      get().setUser(user);
    });
    return unsubscribe;
  },

  updateAvatar: async (avatar) => {
    const { user } = get();
    if (!user) return;
    await updateUserAvatar(user.uid, avatar);
    set({ user: { ...user, avatar } });
  },

  updateProfile: async (displayName) => {
    const { user } = get();
    if (!user) return;
    await updateUserProfile(user.uid, displayName);
    set({ user: { ...user, displayName } });
  },
}));
