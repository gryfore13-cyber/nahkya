import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const THEME_DOC = doc(db, 'config', 'theme');

export interface ThemeDoc {
  tokens: Record<string, string>;
  updatedAt?: ReturnType<typeof serverTimestamp>;
}

export function subscribeToTheme(callback: (tokens: Record<string, string>) => void) {
  return onSnapshot(
    THEME_DOC,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as ThemeDoc;
        callback(data.tokens ?? {});
      } else {
        callback({});
      }
    },
    () => callback({})
  );
}

export async function updateTheme(tokens: Record<string, string>): Promise<void> {
  await setDoc(
    THEME_DOC,
    { tokens, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function getTheme(): Promise<Record<string, string> | null> {
  const snap = await getDoc(THEME_DOC);
  if (!snap.exists()) return null;
  const data = snap.data() as ThemeDoc;
  return data.tokens ?? null;
}
