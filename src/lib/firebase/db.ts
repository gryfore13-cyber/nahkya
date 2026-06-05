import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  where,
  orderBy,
  limit,
  startAfter,
  type QuerySnapshot,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './config';

const CONFIG_DOC = (id: string) => doc(db, 'config', id);

export async function getConfig<T>(id: string, fallback: T): Promise<T> {
  const snap = await getDoc(CONFIG_DOC(id));
  if (snap.exists()) {
    return { ...fallback, ...snap.data() } as T;
  }
  await setDoc(CONFIG_DOC(id), fallback as unknown as Record<string, unknown>);
  return fallback;
}

export function subscribeConfig<T>(
  id: string,
  fallback: T,
  callback: (data: T) => void
) {
  return onSnapshot(
    CONFIG_DOC(id),
    (snap) => {
      if (snap.exists()) {
        callback({ ...fallback, ...snap.data() } as T);
      } else {
        setDoc(CONFIG_DOC(id), fallback as unknown as Record<string, unknown>);
        callback(fallback);
      }
    },
    () => callback(fallback)
  );
}

export async function setConfig<T>(id: string, data: T): Promise<void> {
  await setDoc(CONFIG_DOC(id), data as unknown as Record<string, unknown>, { merge: true });
}

// ─── Collection Helpers ───

export function getCollectionRef(path: string) {
  return collection(db, path);
}

export async function getCollection<T = DocumentData>(path: string): Promise<T[]> {
  const snap = await getDocs(query(collection(db, path)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

/**
 * Fetch a collection with Firestore query constraints (where, orderBy, limit).
 * Requires composite indexes for orderBy + where combinations.
 */
export async function getCollectionQuery<T = DocumentData>(
  path: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const q = query(collection(db, path), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

/**
 * Paginated collection fetch using cursor-based pagination.
 */
export async function getPaginatedCollection<T = DocumentData>(
  path: string,
  limitCount: number,
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>,
  ...constraints: QueryConstraint[]
): Promise<{ docs: T[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const queryConstraints: QueryConstraint[] = [...constraints];
  if (startAfterDoc) {
    queryConstraints.push(startAfter(startAfterDoc));
  }
  queryConstraints.push(limit(limitCount));

  const q = query(collection(db, path), ...queryConstraints);
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  const lastDoc = snap.docs[snap.docs.length - 1] || null;
  return { docs, lastDoc };
}

export async function getDocById<T = DocumentData>(path: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, path, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function addDocToCollection<T extends Record<string, unknown>>(
  path: string,
  data: T
): Promise<string> {
  const ref = await addDoc(collection(db, path), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocInCollection(
  path: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  await updateDoc(doc(db, path, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function setDocInCollection(
  path: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  await setDoc(doc(db, path, id), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function deleteDocFromCollection(path: string, id: string): Promise<void> {
  await deleteDoc(doc(db, path, id));
}

export function subscribeCollection<T = DocumentData>(
  path: string,
  callback: (data: T[]) => void
) {
  return onSnapshot(
    collection(db, path),
    (snap: QuerySnapshot<DocumentData>) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
    },
    () => callback([])
  );
}

/**
 * Subscribe to a collection with Firestore query constraints.
 * Automatically falls back to an empty array on error.
 */
export function subscribeCollectionQuery<T = DocumentData>(
  path: string,
  callback: (data: T[]) => void,
  ...constraints: QueryConstraint[]
) {
  const q = query(collection(db, path), ...constraints);
  return onSnapshot(
    q,
    (snap: QuerySnapshot<DocumentData>) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T)));
    },
    () => callback([])
  );
}

export { where, orderBy, limit, startAfter };
export type { QueryConstraint, QueryDocumentSnapshot };
