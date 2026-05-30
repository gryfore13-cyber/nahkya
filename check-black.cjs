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

  const xMain = 560;

  // Check around Black area (y=1504 to 1568)
  for (let y = 1500; y <= 1570; y += 2) {
    const [r, g, b] = getPixel(xMain, y);
    const hsl = hslFromRgb(r, g, b);
    const bg = isBackground(r, g, b);
    console.log(`y=${y}: ${rgbToHex(r, g, b)} | s=${hsl.s.toFixed(3)} l=${hsl.l.toFixed(3)} | bg=${bg}`);
  }
}

main().catch(console.error);
