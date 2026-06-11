import { useState, useCallback } from 'react';
import { LinkIcon } from 'lucide-react';
import { useBuilderEdit } from './BuilderEditContext';

interface InlineLinkURLProps {
  href?: string;
  sectionId: string;
  path: string;
  className?: string;
  children: React.ReactNode;
}

export function InlineLinkURL({ href, sectionId, path, className, children }: InlineLinkURLProps) {
  const { isEditing, updateSectionContent } = useBuilderEdit();
  const [isHovering, setIsHovering] = useState(false);
  const [tempUrl, setTempUrl] = useState(href || '');

  const handleSave = useCallback(() => {
    updateSectionContent(sectionId, { [path]: tempUrl });
  }, [updateSectionContent, sectionId, path, tempUrl]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
      (e.target as HTMLInputElement).blur();
    }
  }, [handleSave]);

  if (!isEditing) {
    return (
      <a href={href || '#'} className={className}>
        {children}
      </a>
    );
  }

  return (
    <span
      className="relative inline-block group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setTempUrl(href || ''); }}
    >
      <a href={href || '#'} className={className}>
        {children}
      </a>
      {isHovering && (
        <div
          className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1 p-2 bg-nahkya-surface-raised border border-nahkya-border rounded-nahkya shadow-lg min-w-[240px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5 text-nahkya-highlight flex-shrink-0" />
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              placeholder="Link URL"
              className="flex-1 h-7 px-2 text-xs bg-nahkya-bg border border-nahkya-border rounded font-body focus:outline-none focus:ring-1 focus:ring-nahkya-highlight"
            />
          </div>
        </div>
      )}
    </span>
  );
}
