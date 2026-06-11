import { useState, useCallback, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useBuilderEdit } from './BuilderEditContext';
import { uploadImage } from '@/lib/firebase/storage';

interface InlineImageProps {
  src?: string;
  alt?: string;
  aspectClass: string;
  sectionId: string;
  path: string;
  className?: string;
  imgClassName?: string;
}

export function InlineImage({ src, alt, aspectClass, sectionId, path, className, imgClassName }: InlineImageProps) {
  const { isEditing, updateSectionContent } = useBuilderEdit();
  const [isHovering, setIsHovering] = useState(false);
  const [tempUrl, setTempUrl] = useState(src || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = useCallback(() => {
    updateSectionContent(sectionId, { [path]: tempUrl });
  }, [updateSectionContent, sectionId, path, tempUrl]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
      (e.target as HTMLInputElement).blur();
    }
  }, [handleSave]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `uploads/homepage/${sectionId}/${path}/${Date.now()}_${safeName}`;
      const url = await uploadImage(file, storagePath);
      updateSectionContent(sectionId, { [path]: url });
      setTempUrl(url);
    } catch {
      // Upload error surfaced by isUploading resetting
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [sectionId, path, updateSectionContent]);

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!isEditing) {
    if (src) {
      return (
        <div className={className}>
          <img src={src} alt={alt || ''} className={`${aspectClass} object-cover rounded-nahkya ${imgClassName || ''}`} />
        </div>
      );
    }
    return (
      <div className={`${aspectClass} bg-nahkya-border/20 rounded-nahkya flex items-center justify-center ${className || ''}`}>
        <span className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-widest">
          Image
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative group ${className || ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setTempUrl(src || ''); }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {src ? (
        <img
          src={src}
          alt={alt || ''}
          className={`${aspectClass} object-cover rounded-nahkya ${imgClassName || ''}`}
        />
      ) : (
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className={`${aspectClass} w-full bg-nahkya-border/20 rounded-nahkya flex items-center justify-center border-2 border-dashed border-nahkya-border hover:border-nahkya-highlight hover:bg-nahkya-highlight/5 transition-colors disabled:opacity-50`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-nahkya-highlight">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-mono text-mono-sm uppercase tracking-widest">Uploading…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-nahkya-text-secondary group-hover:text-nahkya-highlight transition-colors">
              <Upload className="w-6 h-6" />
              <span className="font-mono text-mono-sm uppercase tracking-widest">Click to Upload</span>
            </div>
          )}
        </button>
      )}

      {/* Hover overlay for existing images: upload + URL input */}
      {isHovering && src && !isUploading && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-nahkya-bg/80 backdrop-blur-sm rounded-nahkya"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={triggerFileSelect}
            className="inline-flex items-center gap-2 px-4 py-2 bg-nahkya-highlight text-nahkya-inverse font-body text-body-sm font-medium rounded-nahkya hover:bg-nahkya-highlight transition-colors"
          >
            <Upload className="w-4 h-4" />
            Replace Image
          </button>
          <div className="flex items-center gap-2 w-full max-w-xs px-4">
            <span className="font-mono text-mono-sm text-nahkya-text-secondary whitespace-nowrap">or URL</span>
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              placeholder="Image URL"
              className="flex-1 h-8 px-2 text-xs bg-nahkya-surface border border-nahkya-border rounded font-body focus:outline-none focus:ring-1 focus:ring-nahkya-highlight"
            />
          </div>
        </div>
      )}

      {/* Uploading overlay for existing images */}
      {isUploading && src && (
        <div className="absolute inset-0 flex items-center justify-center bg-nahkya-bg/60 backdrop-blur-sm rounded-nahkya">
          <Loader2 className="w-8 h-8 text-nahkya-highlight animate-spin" />
        </div>
      )}
    </div>
  );
}
