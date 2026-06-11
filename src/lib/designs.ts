import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { uploadThumbnail } from '@/lib/firebase/storage';
import type { SavedDesign } from '@/types';

/**
 * Save a design and upload its thumbnail to Firebase Storage.
 * Creates the Firestore doc first (without thumbnail), uploads the
 * base64 image to Storage, then updates the doc with the public URL.
 */
export async function saveDesignWithThumbnail(
  design: Omit<SavedDesign, 'id' | 'createdAt' | 'updatedAt' | 'thumbnail'>,
  thumbnailDataURL: string
): Promise<string> {
  // 1. Create design without thumbnail
  const designId = await useSavedDesignStore.getState().addDesign({
    ...design,
    thumbnail: '',
  });

  // 2. Upload thumbnail to Storage
  if (design.userId && thumbnailDataURL) {
    try {
      const url = await uploadThumbnail(thumbnailDataURL, design.userId, designId);
      // 3. Update design with Storage URL
      await useSavedDesignStore.getState().updateDesign(designId, { thumbnail: url });
      return designId;
    } catch {
      // Upload failed — design still exists, just without thumbnail
      return designId;
    }
  }

  return designId;
}
