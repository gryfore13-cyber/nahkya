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

  const xPositions = [560, 640];
  const allColors = [];

  for (let y = 130; y < height - 30; y += 2) {
    for (const x of xPositions) {
      const [r, g, b] = getPixel(x, y);
      const hsl = hslFromRgb(r, g, b);
      if (hsl.s > 0.18 && hsl.l < 0.94 && hsl.l > 0.06) {
        allColors.push({ x, y, r, g, b, hex: rgbToHex(r, g, b), sat: hsl.s });
      }
    }
  }

  // Build a histogram of y values (bucket size = 6)
  const bucketSize = 6;
  const hist = {};
  for (const p of allColors) {
    const b = Math.floor(p.y / bucketSize);
    if (!hist[b]) hist[b] = [];
    hist[b].push(p);
  }

  // Find peaks: buckets with at least 3 samples and higher than neighbors
  const peaks = [];
  const buckets = Object.keys(hist).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < buckets.length; i++) {
    const b = buckets[i];
    const count = hist[b].length;
    const prev = i > 0 ? hist[buckets[i - 1]]?.length || 0 : 0;
    const next = i < buckets.length - 1 ? hist[buckets[i + 1]]?.length || 0 : 0;
    if (count >= 3 && count >= prev && count >= next) {
      peaks.push({ bucket: b, count, pixels: hist[b] });
    }
  }

  // Merge peaks that are within 3 buckets (~18px)
  const merged = [];
  for (const peak of peaks) {
    const y = peak.bucket * bucketSize;
    if (merged.length === 0) {
      merged.push({ y, pixels: [...peak.pixels] });
    } else {
      const last = merged[merged.length - 1];
      if (y - last.y <= 18) {
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

  // Group into families (gap > 50)
  const families = [];
  let fam = [];
  for (let i = 0; i < results.length; i++) {
    if (i > 0) {
      const gap = results[i].y - results[i - 1].y;
      if (gap > 50) {
        families.push(fam);
        fam = [];
      }
    }
    fam.push(results[i]);
  }
  families.push(fam);

  console.log(`Found ${results.length} sub-colour rows in ${families.length} families`);
  families.forEach((fam, fi) => {
    console.log(`\nFamily ${fi + 1} (${fam.length} sub-colours):`);
    fam.forEach((s, si) => console.log(`  ${si + 1}. y=${s.y} hex=${s.hex}`));
  });

  // Create a debug image with circles and labels
  const svgOverlays = [];
  families.forEach((fam, fi) => {
    fam.forEach((s, si) => {
      const label = `F${fi + 1}-${si + 1}`;
      svgOverlays.push(`<text x="720" y="${s.y + 4}" font-family="monospace" font-size="12" fill="#000">${label} ${s.hex}</text>`);
      svgOverlays.push(`<circle cx="600" cy="${s.y}" r="3" fill="red"/>`);
    });
  });

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <image href="data:image/png;base64,${(await sharp(INPUT).png().toBuffer()).toString('base64')}" width="${width}" height="${height}"/>
      ${svgOverlays.join('\n')}
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile('D:/NAHKYA/color-debug.png');

  console.log('\nDebug image saved to D:/NAHKYA/color-debug.png');
}

main().catch(console.error);
