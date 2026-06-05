import imageCompression from 'browser-image-compression';

interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

/**
 * Compress an image file client-side before uploading.
 * Skips compression for SVGs and non-image files.
 *
 * @param file - The image file to compress
 * @param options - Override default compression settings
 * @returns A compressed File, or the original if compression is skipped or fails
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  // Skip non-images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Skip SVGs — they are vector and should not be rasterised
  if (file.type === 'image/svg+xml') {
    return file;
  }

  // Skip if already small
  if (file.size <= 512 * 1024) {
    return file;
  }

  try {
    const compressed = await imageCompression(file, {
      ...DEFAULT_OPTIONS,
      ...options,
    });
    return compressed;
  } catch {
    // Fall back to original file if compression fails
    return file;
  }
}
