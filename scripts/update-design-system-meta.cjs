/**
 * update-design-system-meta.cjs
 *
 * Keeps DESIGN_SYSTEM_UPDATED_AT and DESIGN_SYSTEM_VERSION in sync with the
 * design system source files. Runs automatically before dev/build.
 *
 * Rules:
 * - DESIGN_SYSTEM_UPDATED_AT is set to the most recent mtime of tracked files.
 * - If the mtime is newer than the stored timestamp, the patch version is bumped.
 * - Major/minor version segments are only changed manually.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONSTANTS_PATH = path.join(ROOT, 'src', 'lib', 'constants.ts');
const TRACKED_FILES = [
  'src/styles/system-dna.css',
  'src/pages/admin/AdminSystemDNA.tsx',
];
// Note: src/lib/constants.ts is intentionally excluded because the script
// writes to it; tracking it would cause repeated patch bumps.

function pad(n) {
  return String(n).padStart(2, '0');
}

function toISOWithOffset(date) {
  const tzOffset = -date.getTimezoneOffset();
  const sign = tzOffset >= 0 ? '+' : '-';
  const absOffset = Math.abs(tzOffset);
  const hours = pad(Math.floor(absOffset / 60));
  const minutes = pad(absOffset % 60);
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    sign +
    hours +
    ':' +
    minutes
  );
}

function getLatestMtime() {
  let latest = 0;
  for (const rel of TRACKED_FILES) {
    const full = path.join(ROOT, rel);
    try {
      const stat = fs.statSync(full);
      if (stat.mtimeMs > latest) latest = stat.mtimeMs;
    } catch {
      // ignore missing files
    }
  }
  return new Date(latest);
}

function readConstants() {
  return fs.readFileSync(CONSTANTS_PATH, 'utf8');
}

function writeConstants(content) {
  fs.writeFileSync(CONSTANTS_PATH, content, 'utf8');
}

function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
}

function bumpPatch(version) {
  const { major, minor, patch } = parseVersion(version);
  return `${major}.${minor}.${patch + 1}`;
}

function main() {
  let constants = readConstants();

  const versionMatch = constants.match(/DESIGN_SYSTEM_VERSION\s*=\s*'([^']+)'/);
  const updatedMatch = constants.match(/DESIGN_SYSTEM_UPDATED_AT\s*=\s*'([^']+)'/);

  if (!versionMatch || !updatedMatch) {
    console.error('[design-system-meta] Could not find DESIGN_SYSTEM_VERSION or DESIGN_SYSTEM_UPDATED_AT in constants.ts');
    process.exit(1);
  }

  const currentVersion = versionMatch[1];
  const currentUpdatedAt = updatedMatch[1];
  const latestMtime = getLatestMtime();
  const latestISO = toISOWithOffset(latestMtime);

  const currentDate = new Date(currentUpdatedAt);
  // Compare at second precision to avoid millisecond jitter from writing constants.ts.
  const latestSeconds = Math.floor(latestMtime.getTime() / 1000);
  const currentSeconds = Math.floor(currentDate.getTime() / 1000);
  const shouldUpdate = isNaN(currentDate.getTime()) || latestSeconds > currentSeconds;

  if (!shouldUpdate) {
    console.log('[design-system-meta] Up to date. Version:', currentVersion, '| Updated at:', currentUpdatedAt);
    return;
  }

  const newVersion = bumpPatch(currentVersion);

  constants = constants.replace(
    /DESIGN_SYSTEM_VERSION\s*=\s*'[^']+'/,
    `DESIGN_SYSTEM_VERSION = '${newVersion}'`
  );
  constants = constants.replace(
    /DESIGN_SYSTEM_UPDATED_AT\s*=\s*'[^']+'/,
    `DESIGN_SYSTEM_UPDATED_AT = '${latestISO}'`
  );

  writeConstants(constants);
  console.log('[design-system-meta] Updated. Version:', newVersion, '| Updated at:', latestISO);
}

main();
