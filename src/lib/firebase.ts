import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Replace with your Firebase config before deployment
const firebaseConfig = {
  apiKey: 'AIzaSyD-UM7-i6LZpB3kWB-nTja3YqBTQw_sH1o',
  authDomain: 'hausofnahkya.firebaseapp.com',
  projectId: 'hausofnahkya',
  storageBucket: 'hausofnahkya.firebasestorage.app',
  messagingSenderId: '456344201673',
  appId: '1:456344201673:web:fdf305868edbf908b32018',
  measurementId: 'G-3KDSWWVSLJ',
};

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
