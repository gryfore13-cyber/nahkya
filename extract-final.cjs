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
  // Cream background is roughly rgb(254,253,250)
  const dr = r - 254;
  const dg = g - 253;
  const db = b - 250;
  return Math.sqrt(dr * dr + dg * dg + db * db) < 8;
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

  // MAIN column is at x≈560
  const xMain = 560;
  const allColors = [];

  for (let y = 130; y < height - 30; y += 2) {
    const [r, g, b] = getPixel(xMain, y);
    const hsl = hslFromRgb(r, g, b);
    // Accept low saturation but exclude cream background
    // Charcoal has s≈0.01, l≈0.33; Black has s≈0.02, l≈0.09
    if (!isBackground(r, g, b) && hsl.l < 0.98 && hsl.l > 0.02) {
      allColors.push({ y, r, g, b, hex: rgbToHex(r, g, b), sat: hsl.s, lum: hsl.l });
    }
  }

  // Build histogram (bucket size = 6)
  const bucketSize = 6;
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
      peaks.push({ bucket: b, count, pixels: hist[b] });
    }
  }

  // Merge close peaks (within 3 buckets = 18px)
  const merged = [];
  for (const peak of peaks) {
    const y = peak.bucket * bucketSize;
    if (merged.length === 0) {
      merged.push({ y, pixels: [...peak.pixels] });
    } else {
      const last = merged[merged.length - 1];
      if (y - last.y <= 20) {
        last.pixels.push(...peak.pixels);
      } else {
        merged.push({ y, pixels: [...peak.pixels] });
      }
    }
  }

  // Average each merged peak
  const results = [];
  for (const m of merged) {
    let tr = 0, tg = 0, tb = 0;
    for (const p of m.pixels) { tr += p.r; tg += p.g; tb += p.b; }
    results.push({
      y: m.y,
      hex: rgbToHex(Math.round(tr / m.pixels.length), Math.round(tg / m.pixels.length), Math.round(tb / m.pixels.length)),
      count: m.pixels.length,
    });
  }

  console.log(`Found ${results.length} sub-colour rows at x=${xMain}:`);
  results.forEach((r, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. y=${r.y.toString().padStart(4)} | n=${r.count.toString().padStart(2)} | hex=${r.hex}`);
  });

  // Group into families using adaptive gap threshold
  // Within-family gaps are ~24-32px, between-family gaps are ~40-72px
  // Use threshold of 38px
  const GAP_THRESHOLD = 38;
  const families = [];
  let fam = [];
  for (let i = 0; i < results.length; i++) {
    if (i > 0) {
      const gap = results[i].y - results[i - 1].y;
      if (gap > GAP_THRESHOLD) {
        families.push(fam);
        fam = [];
      }
    }
    fam.push(results[i]);
  }
  families.push(fam);

  console.log(`\n=== ${families.length} Families ===`);
  families.forEach((fam, fi) => {
    console.log(`\nFamily ${fi + 1} (${fam.length} sub-colours):`);
    fam.forEach((s, si) => console.log(`  ${si + 1}. hex=${s.hex}`));
  });

  fs.writeFileSync(
    'D:/NAHKYA/extracted-final.json',
    JSON.stringify({ families: families.map(f => f.map(s => s.hex)) }, null, 2)
  );
}

main().catch(console.error);
