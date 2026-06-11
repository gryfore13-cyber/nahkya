import { useState, useCallback } from 'react';
import { Upload, X, FileImage, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AtelierUploadZoneProps {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onDrop: (files: File[]) => void;
  onRemove?: (index: number) => void;
  files?: File[];
  className?: string;
  label?: string;
  description?: string;
}

export function AtelierUploadZone({
  accept,
  maxSize,
  maxFiles,
  onDrop,
  onRemove,
  files = [],
  className,
  label = 'Drop files here',
  description = 'or click to browse',
}: AtelierUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = Array.from(e.dataTransfer.files);
      const valid = filterFiles(dropped, accept, maxSize, maxFiles);
      if (valid.length > 0) onDrop(valid);
    },
    [accept, maxSize, maxFiles, onDrop]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files || []);
      const valid = filterFiles(selected, accept, maxSize, maxFiles);
      if (valid.length > 0) onDrop(valid);
      e.target.value = '';
    },
    [accept, maxSize, maxFiles, onDrop]
  );

  return (
    <div className={cn('space-y-3', className)}>
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-3',
          'px-6 py-10 rounded-[var(--radius-md)] border-2 border-dashed',
          'transition-colors duration-200 cursor-pointer',
          'bg-nahkya-surface',
          isDragOver
            ? 'border-nahkya-accent bg-nahkya-accent-subtle'
            : 'border-nahkya-border hover:border-nahkya-text-secondary',
          className
        )}
      >
        <div
          className={cn(
            'w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center transition-colors',
            isDragOver
              ? 'bg-nahkya-accent text-white'
              : 'bg-nahkya-surface-raised text-nahkya-text-secondary'
          )}
        >
          <Upload className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-nahkya-text">{label}</p>
          <p className="text-xs text-nahkya-text-secondary mt-0.5">{description}</p>
        </div>
        <input
          type="file"
          accept={accept}
          multiple={maxFiles !== 1}
          onChange={handleInputChange}
          className="hidden"
        />
      </label>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] bg-nahkya-surface border border-nahkya-border"
            >
              {file.type.startsWith('image/') ? (
                <FileImage className="w-4 h-4 text-nahkya-text-secondary shrink-0" strokeWidth={1.5} />
              ) : (
                <FileText className="w-4 h-4 text-nahkya-text-secondary shrink-0" strokeWidth={1.5} />
              )}
              <span className="text-sm text-nahkya-text truncate flex-1 min-w-0">
                {file.name}
              </span>
              <span className="text-xs text-nahkya-muted shrink-0">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              {onRemove && (
                <button
                  onClick={() => onRemove(i)}
                  className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] text-nahkya-text-secondary hover:text-nahkya-error hover:bg-nahkya-error-subtle transition-colors shrink-0"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Helpers ── */

function filterFiles(
  files: File[],
  accept?: string,
  maxSize?: number,
  maxFiles?: number
): File[] {
  let result = files;

  if (accept) {
    const types = accept.split(',').map((t) => t.trim());
    result = result.filter((f) =>
      types.some((t) => {
        if (t.endsWith('/*')) return f.type.startsWith(t.slice(0, -1));
        return f.type === t || f.name.endsWith(t);
      })
    );
  }

  if (maxSize) {
    result = result.filter((f) => f.size <= maxSize);
  }

  if (maxFiles) {
    result = result.slice(0, maxFiles);
  }

  return result;
}
