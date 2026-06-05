import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

export type UserRole = 'member' | 'super_admin' | 'designer';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatar?: string;
  approvalStatus: import('@/types').ApprovalStatus;
  registeredAt?: string;
}

const USERS_COL = 'users';

export async function getUserData(uid: string): Promise<{ role: UserRole; avatar?: string; approvalStatus?: import('@/types').ApprovalStatus; registeredAt?: string }> {
  const snap = await getDoc(doc(db, USERS_COL, uid));
  if (snap.exists()) {
    const data = snap.data();
    return {
      role: (data.role as UserRole) || 'member',
      avatar: data.avatar as string | undefined,
      approvalStatus: data.approvalStatus as import('@/types').ApprovalStatus | undefined,
      registeredAt: data.registeredAt ? String(data.registeredAt) : undefined,
    };
  }
  return { role: 'member' };
}

export async function createUserDoc(
  firebaseUser: FirebaseUser,
  role: UserRole = 'member',
  displayName?: string,
  avatar?: string,
  approvalStatus?: import('@/types').ApprovalStatus
): Promise<AuthUser> {
  const user: AuthUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    role,
    avatar: avatar || firebaseUser.photoURL || undefined,
    approvalStatus: approvalStatus || 'pending',
    registeredAt: new Date().toISOString(),
  };
  await setDoc(
    doc(db, USERS_COL, firebaseUser.uid),
    { ...user, createdAt: serverTimestamp() },
    { merge: true }
  );
  return user;
}

export async function signUp(email: string, password: string, displayName: string): Promise<AuthUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return createUserDoc(cred.user, 'member', displayName, undefined, 'pending');
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const data = await getUserData(cred.user.uid);
  // Preserve existing approval status; default legacy users to approved
  const approvalStatus = data.approvalStatus || 'approved';
  return {
    uid: cred.user.uid,
    email: cred.user.email || '',
    displayName: cred.user.displayName || cred.user.email?.split('@')[0] || 'User',
    role: data.role,
    avatar: data.avatar || cred.user.photoURL || undefined,
    approvalStatus,
    registeredAt: data.registeredAt,
  };
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: AuthUser | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    const data = await getUserData(firebaseUser.uid);
    callback({
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      role: data.role,
      avatar: data.avatar || firebaseUser.photoURL || undefined,
      approvalStatus: data.approvalStatus || 'approved',
      registeredAt: data.registeredAt,
    });
  });
}

async function processGoogleCredential(firebaseUser: FirebaseUser): Promise<AuthUser> {
  const data = await getUserData(firebaseUser.uid);
  // If user exists, preserve approval status; if new, default to pending
  const isNewUser = !data.approvalStatus;
  const approvalStatus = data.approvalStatus || (isNewUser ? 'pending' : 'approved');

  if (isNewUser) {
    return createUserDoc(
      firebaseUser,
      data.role || 'member',
      firebaseUser.displayName || undefined,
      data.avatar || firebaseUser.photoURL || undefined,
      approvalStatus
    );
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    role: data.role,
    avatar: data.avatar || firebaseUser.photoURL || undefined,
    approvalStatus,
    registeredAt: data.registeredAt,
  };
}

export async function signInWithGoogle(): Promise<AuthUser | null> {
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth, provider);
    return processGoogleCredential(cred.user);
  } catch (error: unknown) {
    // Popup blocked, closed by user, or COOP-related failure — fall back to redirect
    const authError = error as { code?: string };
    if (
      authError.code === 'auth/popup-blocked' ||
      authError.code === 'auth/popup-closed-by-user' ||
      authError.code === 'auth/cancelled-popup-request' ||
      authError.code === 'auth/network-request-failed'
    ) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw error;
  }
}

export async function getGoogleRedirectResult(): Promise<AuthUser | null> {
  const result = await getRedirectResult(auth);
  if (!result) return null;
  return processGoogleCredential(result.user);
}

export async function updateUserAvatar(uid: string, avatar: string): Promise<void> {
  await setDoc(doc(db, USERS_COL, uid), { avatar }, { merge: true });
}

export async function updateUserProfile(uid: string, displayName: string): Promise<void> {
  await setDoc(doc(db, USERS_COL, uid), { displayName }, { merge: true });
}
