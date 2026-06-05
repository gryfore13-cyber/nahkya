/**
 * Pre-dev environment check.
 * Warns if required Firebase env vars are missing.
 * Exits with code 1 only in CI; in local dev it warns and continues.
 */
const fs = require('fs');
const path = require('path');

const appDir = path.resolve(__dirname, '..');
const envPath = path.join(appDir, '.env');
const envDevPath = path.join(appDir, '.env.development');

const REQUIRED = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    vars[key] = value;
  }
  return vars;
}

const envVars = loadEnvFile(envPath);
const devVars = loadEnvFile(envDevPath);
const merged = { ...devVars, ...envVars };

const missing = REQUIRED.filter((key) => !merged[key] || merged[key].startsWith('your-'));

if (missing.length > 0) {
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  const message =
    '\n⚠️  [check-env] Missing or placeholder Firebase environment variables:\n' +
    missing.map((k) => `   • ${k}`).join('\n') +
    '\n\n   To fix:' +
    '\n   1. Copy app/.env.example → app/.env' +
    '\n   2. Fill in your Firebase project credentials.' +
    '\n   (Or ensure app/.env.development has valid dev values.)\n';

  if (isCI) {
    console.error(message);
    process.exit(1);
  } else {
    console.warn(message);
  }
} else {
  console.log('✅ [check-env] Firebase environment variables look good.\n');
}
