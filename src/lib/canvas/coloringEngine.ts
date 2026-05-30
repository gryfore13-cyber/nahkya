export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface PixelColor extends RgbColor {
  a: number;
}

export interface MaskLayer {
  width: number;
  height: number;
  data: Uint8Array;
}

export function hexToRgb(hex: string): RgbColor {
  const clean = hex.replace('#', '');
  const value = parseInt(clean, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function getPixel(imageData: ImageData, x: number, y: number): PixelColor {
  const index = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3],
  };
}

export function withinTolerance(colorA: PixelColor, colorB: PixelColor, tolerance: number): boolean {
  return (
    Math.abs(colorA.r - colorB.r) <= tolerance &&
    Math.abs(colorA.g - colorB.g) <= tolerance &&
    Math.abs(colorA.b - colorB.b) <= tolerance
  );
}

export function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

export function normalizeToLineart(imageData: ImageData, threshold: number): ImageData {
  const output = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );

  for (let i = 0; i < output.data.length; i += 4) {
    const red = output.data[i];
    const green = output.data[i + 1];
    const blue = output.data[i + 2];
    const gray = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);
    const value = gray < threshold ? 0 : 255;

    output.data[i] = value;
    output.data[i + 1] = value;
    output.data[i + 2] = value;
    output.data[i + 3] = 255;
  }

  return output;
}

export function buildMaskLayer(lineartImageData: ImageData, threshold: number): MaskLayer {
  const mask: MaskLayer = {
    width: lineartImageData.width,
    height: lineartImageData.height,
    data: new Uint8Array(lineartImageData.width * lineartImageData.height),
  };

  for (let i = 0; i < lineartImageData.data.length; i += 4) {
    const pixelIndex = i / 4;
    mask.data[pixelIndex] = lineartImageData.data[i] < threshold ? 1 : 0;
  }

  return mask;
}

export function bucketFill(
  startX: number,
  startY: number,
  paintColorHex: string,
  currentComposite: ImageData,
  paintLayer: ImageData,
  maskLayer: MaskLayer,
  tolerance: number
): ImageData {
  const width = currentComposite.width;
  const height = currentComposite.height;
  const startIndex = startY * width + startX;

  if (maskLayer.data[startIndex] === 1) return paintLayer;

  const targetColor = getPixel(currentComposite, startX, startY);
  const fillColor = hexToRgb(paintColorHex);

  const nextPaintLayer = new ImageData(
    new Uint8ClampedArray(paintLayer.data),
    width,
    height
  );
  const visited = new Uint8Array(width * height);
  const stack: [number, number][] = [[startX, startY]];

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;

    if (x < 0 || y < 0 || x >= width || y >= height) continue;

    const pixelIndex = y * width + x;
    if (visited[pixelIndex]) continue;
    if (maskLayer.data[pixelIndex] === 1) continue;

    visited[pixelIndex] = 1;

    const currentColor = getPixel(currentComposite, x, y);
    if (!withinTolerance(currentColor, targetColor, tolerance)) continue;

    const dataIndex = pixelIndex * 4;
    nextPaintLayer.data[dataIndex] = fillColor.r;
    nextPaintLayer.data[dataIndex + 1] = fillColor.g;
    nextPaintLayer.data[dataIndex + 2] = fillColor.b;
    nextPaintLayer.data[dataIndex + 3] = 255;

    stack.push([x + 1, y]);
    stack.push([x - 1, y]);
    stack.push([x, y + 1]);
    stack.push([x, y - 1]);
  }

  return nextPaintLayer;
}

export function drawComposite(
  canvas: HTMLCanvasElement,
  paintLayer: ImageData | null,
  maskLayer: MaskLayer | null,
  baseColorHex: string,
  lineColorHex: string
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || !maskLayer) return;

  const width = canvas.width;
  const height = canvas.height;
  const output = ctx.createImageData(width, height);

  const base = hexToRgb(baseColorHex);
  const line = hexToRgb(lineColorHex);

  for (let i = 0; i < output.data.length; i += 4) {
    const pixelIndex = i / 4;
    const isLineartPixel = maskLayer.data[pixelIndex] === 1;
    const isPaintedPixel = paintLayer ? paintLayer.data[i + 3] > 0 : false;

    if (isLineartPixel) {
      output.data[i] = line.r;
      output.data[i + 1] = line.g;
      output.data[i + 2] = line.b;
      output.data[i + 3] = 255;
    } else if (isPaintedPixel) {
      output.data[i] = paintLayer!.data[i];
      output.data[i + 1] = paintLayer!.data[i + 1];
      output.data[i + 2] = paintLayer!.data[i + 2];
      output.data[i + 3] = 255;
    } else {
      output.data[i] = base.r;
      output.data[i + 1] = base.g;
      output.data[i + 2] = base.b;
      output.data[i + 3] = 255;
    }
  }

  ctx.putImageData(output, 0, 0);
}

export function extractLineartFromImage(
  canvas: HTMLCanvasElement,
  imageSrc: string,
  canvasSize: number,
  lineThreshold: number
): Promise<{ mask: MaskLayer; paintLayer: ImageData }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = canvasSize;
      canvas.height = canvasSize;

      ctx.clearRect(0, 0, canvasSize, canvasSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      const scale = Math.min(canvasSize / image.width, canvasSize / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const x = (canvasSize - drawWidth) / 2;
      const y = (canvasSize - drawHeight) / 2;

      ctx.drawImage(image, x, y, drawWidth, drawHeight);

      const source = ctx.getImageData(0, 0, canvasSize, canvasSize);
      const lineart = normalizeToLineart(source, lineThreshold);
      const mask = buildMaskLayer(lineart, lineThreshold);
      const paintLayer = ctx.createImageData(canvasSize, canvasSize);

      resolve({ mask, paintLayer });
    };

    image.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    image.src = imageSrc;
  });
}
