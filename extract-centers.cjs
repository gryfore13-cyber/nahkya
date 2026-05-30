const sharp = require('sharp');
const fs = require('fs');

const INPUT = 'D:/NAHKYA/Color System.png';

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function hslFromRgb(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    default: h = ((r - g) / d + 4) / 6; break;
  }
  return { h, s, l };
}

function isBackground(r, g, b) {
  const dr = r - 254;
  const dg = g - 253;
  const db = b - 250;
  return Math.sqrt(dr * dr + dg * dg + db * db) < 6;
}

async function main() {
  const { data, info } = await sharp(INPUT)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const getPixel = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return [255, 255, 255];
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  // First pass: detect all sub-colour rows using x=560
  const xMain = 560;
  const allColors = [];
  for (let y = 130; y < height - 30; y += 2) {
    const [r, g, b] = getPixel(xMain, y);
    const hsl = hslFromRgb(r, g, b);
    if (!isBackground(r, g, b) && hsl.l < 0.97 && hsl.l > 0.03) {
      allColors.push({ y, r, g, b, sat: hsl.s });
    }
  }

  // Build histogram (bucket size = 8)
  const bucketSize = 8;
  const hist = {};
  for (const p of allColors) {
    const b = Math.floor(p.y / bucketSize);
    if (!hist[b]) hist[b] = [];
    hist[b].push(p);
  }

  // Find peaks
  const peaks = [];
  const buckets = Object.keys(hist).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < buckets.length; i++) {
    const b = buckets[i];
    const count = hist[b].length;
    const prev = i > 0 ? hist[buckets[i - 1]]?.length || 0 : 0;
    const next = i < buckets.length - 1 ? hist[buckets[i + 1]]?.length || 0 : 0;
    if (count >= 2 && count >= prev && count >= next) {
      peaks.push({ bucket: b, pixels: hist[b] });
    }
  }

  // Merge close peaks
  const merged = [];
  for (const peak of peaks) {
    const y = peak.bucket * bucketSize;
    if (merged.length === 0) {
      merged.push({ y, pixels: [...peak.pixels] });
    } else {
      const last = merged[merged.length - 1];
      if (y - last.y <= 24) {
        last.pixels.push(...peak.pixels);
      } else {
        merged.push({ y, pixels: [...peak.pixels] });
      }
    }
  }

  // Get average y for each merged peak
  const yCenters = merged.map(m => Math.round(m.pixels.reduce((sum, p) => sum + p.y, 0) / m.pixels.length));

  // Remove false positive at top (y < 150)
  const filteredY = yCenters.filter(y => y > 150);

  console.log(`Detected ${filteredY.length} row centers:`, filteredY.join(', '));

  // For each row center, find the best x position (circle center) by scanning horizontally
  // The circle center has the highest saturation or is most different from background
  const results = [];
  for (const y of filteredY) {
    let bestX = 560;
    let bestSat = 0;
    let bestHex = '';
    let bestDiff = 0;

    // Scan x from 480 to 700 to find the MAIN column circle
    for (let x = 480; x <= 700; x += 2) {
      const [r, g, b] = getPixel(x, y);
      const hsl = hslFromRgb(r, g, b);
      const bgDist = Math.sqrt((r - 254) ** 2 + (g - 253) ** 2 + (b - 250) ** 2);

      // Skip background
      if (bgDist < 8) continue;

      // For very dark colors (Black, Charcoal), saturation is low, so use background distance
      const score = hsl.s + (bgDist / 255) * 0.3;

      if (score > bestSat) {
        bestSat = score;
        bestX = x;
        bestHex = rgbToHex(r, g, b);
      }
    }

    // Now refine by looking at a small window around bestX to find the center of the circle
    // The center should have the highest saturation / most extreme color
    let refinedX = bestX;
    let refinedScore = bestSat;
    for (let x = bestX - 8; x <= bestX + 8; x++) {
      const [r, g, b] = getPixel(x, y);
      const hsl = hslFromRgb(r, g, b);
      const bgDist = Math.sqrt((r - 254) ** 2 + (g - 253) ** 2 + (b - 250) ** 2);
      const score = hsl.s + (bgDist / 255) * 0.3;
      if (score > refinedScore) {
        refinedScore = score;
        refinedX = x;
      }
    }

    const [r, g, b] = getPixel(refinedX, y);
    results.push({
      y,
      x: refinedX,
      hex: rgbToHex(r, g, b),
    });
  }

  console.log(`\nFound ${results.length} sub-colour rows:`);
  results.forEach((r, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. y=${r.y.toString().padStart(4)} x=${r.x} | hex=${r.hex}`);
  });

  // Group into families using adaptive gap threshold
  const gaps = [];
  for (let i = 1; i < results.length; i++) {
    gaps.push({ idx: i, gap: results[i].y - results[i - 1].y });
  }
  gaps.sort((a, b) => b.gap - a.gap);

  // We expect 10 families, so split at the 9 largest gaps
  const splitIndices = new Set(gaps.slice(0, 9).map(g => g.idx));

  const families = [];
  let fam = [results[0]];
  for (let i = 1; i < results.length; i++) {
    if (splitIndices.has(i)) {
      families.push(fam);
      fam = [];
    }
    fam.push(results[i]);
  }
  families.push(fam);

  console.log(`\n=== ${families.length} Families ===`);
  families.forEach((fam, fi) => {
    console.log(`\nFamily ${fi + 1} (${fam.length} sub-colours):`);
    fam.forEach((s, si) => console.log(`  ${si + 1}. y=${s.y} x=${s.x} hex=${s.hex}`));
  });

  fs.writeFileSync(
    'D:/NAHKYA/extracted-centers.json',
    JSON.stringify({ families: families.map(f => f.map(s => s.hex)) }, null, 2)
  );
}

main().catch(console.error);
