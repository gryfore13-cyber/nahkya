import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBuilderEdit } from './BuilderEditContext';

interface InlineArrayAddProps {
  onAdd: () => void;
  label?: string;
}

export function InlineArrayAdd({ onAdd, label = 'Add' }: InlineArrayAddProps) {
  const { isEditing } = useBuilderEdit();
  if (!isEditing) return null;

  return (
    <button
      type="button"
      onClick={onAdd}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2 rounded-nahkya border border-dashed border-nahkya-border',
        'text-nahkya-text-secondary hover:text-nahkya-highlight hover:border-nahkya-highlight/50',
        'transition-colors font-body text-body-sm'
      )}
    >
      <Plus size={14} />
      {label}
    </button>
  );
}

interface InlineArrayRemoveProps {
  onRemove: () => void;
}

export function InlineArrayRemove({ onRemove }: InlineArrayRemoveProps) {
  const { isEditing } = useBuilderEdit();
  if (!isEditing) return null;

  return (
    <button
      type="button"
      onClick={onRemove}
      className="w-6 h-6 flex items-center justify-center rounded-nahkya text-nahkya-text-secondary hover:text-nahkya-error hover:bg-nahkya-error-subtle transition-colors"
      title="Remove"
    >
      <X size={12} />
    </button>
  );
}
