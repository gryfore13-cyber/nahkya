import { useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useBuilderEdit } from './BuilderEditContext';
import { useHomeContentStore } from '@/stores/homeContentStore';

interface InlineArrayAddProps {
  sectionId: string;
  path: string; // e.g. "features", "items", "steps"
  defaultItem: Record<string, unknown>;
  label?: string;
}

export function InlineArrayAdd({ sectionId, path, defaultItem, label = 'Add Item' }: InlineArrayAddProps) {
  const { isEditing } = useBuilderEdit();
  const config = useHomeContentStore((s) => s.config);
  const updateSectionContent = useHomeContentStore((s) => s.updateSectionContent);

  const handleAdd = useCallback(() => {
    const section = config.sections.find((s) => s.id === sectionId);
    if (!section) return;
    const raw = (section.content as unknown as Record<string, unknown>)[path];
    const currentArray = Array.isArray(raw) ? raw : [];
    const newArray = [...currentArray, { ...defaultItem }];
    updateSectionContent(sectionId, { [path]: newArray });
  }, [config.sections, sectionId, path, defaultItem, updateSectionContent]);

  if (!isEditing) return null;

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-nahkya-surface border border-dashed border-nahkya-border rounded-nahkya hover:border-nahkya-highlight text-nahkya-text-secondary hover:text-nahkya-text transition-colors"
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
