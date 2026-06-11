import { ArrowLeftRight } from 'lucide-react';
import { useBuilderEdit } from './BuilderEditContext';

interface InlineImagePositionProps {
  value?: 'left' | 'right';
  sectionId: string;
  path: string;
}

export function InlineImagePosition({ value, sectionId, path }: InlineImagePositionProps) {
  const { isEditing, updateSectionContent } = useBuilderEdit();

  if (!isEditing) return null;

  const current = value || 'left';
  const toggle = () => {
    updateSectionContent(sectionId, { [path]: current === 'left' ? 'right' : 'left' });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider bg-nahkya-surface border border-nahkya-border rounded-nahkya hover:border-nahkya-highlight text-nahkya-text-secondary hover:text-nahkya-text transition-colors mb-4"
      title={`Image position: ${current}`}
    >
      <ArrowLeftRight className="w-3 h-3" />
      {current}
    </button>
  );
}
