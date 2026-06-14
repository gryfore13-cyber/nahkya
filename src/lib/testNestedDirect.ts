import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function testNestedDirect() {
  try {
    await setDoc(doc(db, 'config', 'landingPageTest'), {
      arr: [[1, 2]],
    });
    return 'setDoc succeeded';
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}
