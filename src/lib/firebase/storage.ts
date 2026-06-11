import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';
import { compressImage } from '@/lib/imageCompression';

export async function uploadFile(file: Blob | File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

/**
 * Compress an image client-side before uploading.
 * Skips compression for SVGs, non-images, and already-small files.
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  const compressed = await compressImage(file);
  return uploadFile(compressed, path);
}

/**
 * Convert a base64 data URL to a Blob for upload.
 */
function dataURLToBlob(dataURL: string): Blob {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

/**
 * Upload a base64 thumbnail to Firebase Storage and return the download URL.
 */
export async function uploadThumbnail(dataURL: string, userId: string, designId: string): Promise<string> {
  const blob = dataURLToBlob(dataURL);
  const path = `saved-designs/${userId}/${designId}.png`;
  return uploadFile(blob, path);
}

/**
 * Delete a thumbnail from Firebase Storage.
 */
export async function deleteThumbnail(userId: string, designId: string): Promise<void> {
  const path = `saved-designs/${userId}/${designId}.png`;
  await deleteFile(path);
}
