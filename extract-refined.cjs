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

function bgDist(r, g, b) {
  return Math.sqrt((r - 254) ** 2 + (g - 253) ** 2 + (b - 250) ** 2);
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

  // Known y centers from previous extraction (with false positive removed)
  const yCenters = [179, 215, 247, 279, 351, 379, 415, 443, 507, 543, 571, 607, 675, 710, 739, 771, 838, 871, 903, 923, 983, 1015, 1046, 1071, 1131, 1166, 1199, 1219, 1275, 1310, 1343, 1363, 1415, 1446, 1479, 1515, 1583, 1614, 1639, 1671];

  const results = [];
  for (const y of yCenters) {
    // Search a grid around the expected circle position
    // The MAIN column should be somewhere between x=500 and x=620
    let bestPixel = { x: 560, r: 255, g: 255, b: 255, score: -1 };

    for (let dx = -30; dx <= 30; dx++) {
      for (let dy = -10; dy <= 10; dy++) {
        const x = 560 + dx;
        const py = y + dy;
        const [r, g, b] = getPixel(x, py);
        const dist = bgDist(r, g, b);
        const hsl = hslFromRgb(r, g, b);

        // Score: how different from background, with slight preference for higher saturation
        // For dark colors (Black, Charcoal), dist will be high even if sat is low
        const score = dist + hsl.s * 30;

        if (score > bestPixel.score) {
          bestPixel = { x, y: py, r, g, b, score };
        }
      }
    }

    results.push({
      y,
      bestY: bestPixel.y,
      bestX: bestPixel.x,
      hex: rgbToHex(bestPixel.r, bestPixel.g, bestPixel.b),
      dist: Math.round(bestPixel.score),
    });
  }

  console.log(`Found ${results.length} sub-colour rows:`);
  results.forEach((r, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. y=${r.y} | sample=(${r.bestX},${r.bestY}) | hex=${r.hex} | dist=${r.dist}`);
  });

  // Group into families using top-9 gap splitting
  const gaps = [];
  for (let i = 1; i < results.length; i++) {
    gaps.push({ idx: i, gap: results[i].y - results[i - 1].y });
  }
  gaps.sort((a, b) => b.gap - a.gap);

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
    fam.forEach((s, si) => console.log(`  ${si + 1}. hex=${s.hex}`));
  });

  fs.writeFileSync(
    'D:/NAHKYA/extracted-refined.json',
    JSON.stringify({ families: families.map(f => f.map(s => s.hex)) }, null, 2)
  );
}

main().catch(console.error);
