import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD-UM7-i6LZpB3kWB-nTja3YqBTQw_sH1o',
  authDomain: 'hausofnahkya.firebaseapp.com',
  projectId: 'hausofnahkya',
  storageBucket: 'hausofnahkya.firebasestorage.app',
  messagingSenderId: '456344201673',
  appId: '1:456344201673:web:fdf305868edbf908b32018',
  measurementId: 'G-3KDSWWVSLJ',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
