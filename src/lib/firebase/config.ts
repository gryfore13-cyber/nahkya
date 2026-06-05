import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const REQUIRED_ENV_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

function getEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value || value === 'your-' + key.toLowerCase().replace('vite_firebase_', '')) {
    // Warn once in development so the developer knows to set up .env
    if (import.meta.env.DEV) {
      console.warn(
        `[Firebase Config] Missing or placeholder value for ${key}.\n` +
          `Copy app/.env.example to app/.env and fill in your Firebase project values.`
      );
    }
  }
  return value ?? '';
}

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID') || undefined,
};

// Validate that critical fields are present
const ENV_TO_CONFIG_KEY: Record<string, keyof typeof firebaseConfig> = {
  VITE_FIREBASE_API_KEY: 'apiKey',
  VITE_FIREBASE_AUTH_DOMAIN: 'authDomain',
  VITE_FIREBASE_PROJECT_ID: 'projectId',
  VITE_FIREBASE_STORAGE_BUCKET: 'storageBucket',
  VITE_FIREBASE_MESSAGING_SENDER_ID: 'messagingSenderId',
  VITE_FIREBASE_APP_ID: 'appId',
};
const missing = REQUIRED_ENV_VARS.filter((k) => !firebaseConfig[ENV_TO_CONFIG_KEY[k]]);
if (missing.length > 0 && import.meta.env.DEV) {
  console.error(
    `[Firebase Config] CRITICAL: The following required environment variables are missing:\n` +
      missing.map((k) => `  - ${k}`).join('\n') +
      `\n\nPlease create app/.env from app/.env.example and add your Firebase project credentials.`
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
