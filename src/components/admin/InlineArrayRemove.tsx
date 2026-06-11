import { useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import { useBuilderEdit } from './BuilderEditContext';
import { useHomeContentStore } from '@/stores/homeContentStore';

interface InlineArrayRemoveProps {
  sectionId: string;
  path: string; // e.g. "features", "items"
  index: number;
  minCount?: number;
}

export function InlineArrayRemove({ sectionId, path, index, minCount = 1 }: InlineArrayRemoveProps) {
  const { isEditing } = useBuilderEdit();
  const config = useHomeContentStore((s) => s.config);
  const updateSectionContent = useHomeContentStore((s) => s.updateSectionContent);

  const section = config.sections.find((s) => s.id === sectionId);
  const raw = section ? (section.content as unknown as Record<string, unknown>)[path] : undefined;
  const currentArray = useMemo(() => (Array.isArray(raw) ? raw : []), [raw]);

  const handleRemove = useCallback(() => {
    const newArray = currentArray.filter((_, i) => i !== index);
    updateSectionContent(sectionId, { [path]: newArray });
  }, [currentArray, index, sectionId, path, updateSectionContent]);

  if (!isEditing) return null;
  if (!section) return null;
  if (currentArray.length <= minCount) return null;

  return (
    <button
      type="button"
      onClick={handleRemove}
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-nahkya-error/10 text-nahkya-error hover:bg-nahkya-error/20 transition-colors"
      title="Remove item"
      aria-label="Remove item"
    >
      <X className="w-3 h-3" />
    </button>
  );
}
