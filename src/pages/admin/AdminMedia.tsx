import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { useArticleStore } from '@/stores/articleStore';
import { uploadImage } from '@/lib/firebase/storage';

export default function AdminMedia() {
  const { articles, fetchArticles } = useArticleStore();
  const [uploads, setUploads] = useState<{ id: string; src: string; name: string; type: 'image' }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const mediaItems = [
    ...articles.flatMap((a) => [
      { id: `${a.id}-hero`, src: a.image, name: `${a.title} — Hero`, type: 'image' as const },
    ]),
    ...uploads,
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const timestamp = Date.now();
      const path = `uploads/media/${timestamp}_${file.name}`;
      const url = await uploadImage(file, path);
      setUploads((prev) => [
        ...prev,
        { id: `upload-${timestamp}`, src: url, name: file.name, type: 'image' },
      ]);
    } catch {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Media Library</h1>
      <p className="text-body-md text-nahkya-text-secondary font-body mb-8">Manage images used across the site.</p>

      <input
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaItems.map((item) => (
          <div key={item.id} className="group bg-nahkya-surface border border-nahkya-border rounded-nahkya overflow-hidden hover:border-nahkya-highlight/30 transition-all">
            <div className="aspect-square bg-nahkya-border overflow-hidden">
              <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-mono-md text-nahkya-text font-body truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-mono-sm text-nahkya-text-secondary uppercase">{item.type}</span>
                <button className="p-1 text-nahkya-text-secondary hover:text-nahkya-error opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={cn('border-2 border-dashed border-nahkya-border rounded-nahkya flex flex-col items-center justify-center aspect-square cursor-pointer hover:border-nahkya-highlight/40 transition-colors ', uploading ? 'opacity-50 cursor-not-allowed' : '')}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-nahkya-text-secondary mb-3 animate-spin" strokeWidth={1.5} />
          ) : (
            <ImageIcon className="w-8 h-8 text-nahkya-text-secondary mb-3" strokeWidth={1.5} />
          )}
          <p className="text-sm text-nahkya-text-secondary font-body">
            {uploading ? 'Uploading...' : 'Upload'}
          </p>
        </div>
      </div>
    </div>
  );
}
