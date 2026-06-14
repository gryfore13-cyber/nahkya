import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function readLandingDoc() {
  const snap = await getDoc(doc(db, 'config', 'landingPage'));
  return snap.exists() ? snap.data() : null;
}
