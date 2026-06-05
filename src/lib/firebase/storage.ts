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
