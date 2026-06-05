/**
 * Generate a PNG thumbnail from a Petak cell grid.
 */
export function generatePetakThumbnail(
  cells: Record<string, string | null>,
  rows: number,
  cols: number,
  size: number = 256
): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cellW = size / cols;
  const cellH = size / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const colour = cells[`${r},${c}`];
      if (colour) {
        ctx.fillStyle = colour;
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
      }
    }
  }

  return canvas.toDataURL('image/png');
}
