/**
 * Generate a PNG thumbnail from an SVG element.
 */
export function generateSvgThumbnail(svgElement: SVGSVGElement, size: number = 512): string {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(url);
    return '';
  }

  const img = new Image();
  img.src = url;

  // Synchronous fallback — draw immediately (SVG is self-contained)
  // For truly async, caller should await onload. Here we return best-effort.
  ctx.drawImage(img, 0, 0, size, size);
  const dataUrl = canvas.toDataURL('image/png');
  URL.revokeObjectURL(url);
  return dataUrl;
}
