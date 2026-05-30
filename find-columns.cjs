const sharp = require('sharp');

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

  // Scan at known y positions (detected peaks) across x range
  const yPositions = [168, 198, 222, 246, 270, 336, 366, 402, 432];

  for (const y of yPositions) {
    console.log(`\n--- y=${y} ---`);
    for (let x = 300; x < 900; x += 5) {
      const [r, g, b] = getPixel(x, y);
      const hsl = hslFromRgb(r, g, b);
      if (hsl.s > 0.15 && hsl.l < 0.95 && hsl.l > 0.05) {
        console.log(`  x=${x}: ${rgbToHex(r, g, b)} | s=${hsl.s.toFixed(2)} l=${hsl.l.toFixed(2)}`);
      }
    }
  }
}

main().catch(console.error);
