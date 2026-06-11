import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Plus,
  FileText,
  CheckCircle2,
  CircleDashed,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HomepageSection, TemplateType, SectionStatus } from '@/types/homepage';
import { TEMPLATE_LABELS } from '@/types/homepage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TEMPLATE_TYPES: TemplateType[] = [
  'splitScreenHero', 'singleColumnFocus', 'zPattern', 'fPattern',
  'invertedPyramid', 'cardGrid', 'alternating', 'longFormSales',
  'storytellingScroll', 'asymmetricalEditorial', 'productShowcase',
  'leadCapture', 'benefits', 'testimonials', 'faq', 'howItWorks',
  'lookbook', 'collectionPreview',
];

const STATUS_CONFIG: Record<SectionStatus, { label: string; icon: React.ReactNode; color: string }> = {
  published: { label: 'Published', icon: <CheckCircle2 size={12} />, color: 'text-nahkya-success' },
  draft: { label: 'Draft', icon: <CircleDashed size={12} />, color: 'text-nahkya-highlight' },
  hidden: { label: 'Hidden', icon: <CircleDot size={12} />, color: 'text-nahkya-text-secondary' },
};

interface SectionListSidebarProps {
  sections: HomepageSection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (newOrder: string[]) => void;
  onAdd: (type: TemplateType) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

function SortableSectionItem({
  section,
  index,
  isSelected,
  onSelect,
  onDuplicate,
  onRemove,
  onToggleVisibility,
}: {
  section: HomepageSection;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onToggleVisibility: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const status = section.status ?? 'published';
  const statusConfig = STATUS_CONFIG[status];
  const isHidden = status === 'hidden';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex items-center gap-2 px-3 py-2.5 rounded-nahkya border cursor-pointer transition-all',
        isSelected
          ? 'bg-nahkya-highlight/5 border-nahkya-highlight shadow-gold-focus'
          : 'bg-nahkya-surface border-nahkya-border hover:border-nahkya-highlight/40',
        isDragging && 'shadow-card opacity-90',
        isHidden && 'opacity-50'
      )}
      onClick={onSelect}
    >
      <button
        type="button"
        className="shrink-0 text-nahkya-text-secondary hover:text-nahkya-text cursor-grab active:cursor-grabbing p-0.5"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={14} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-mono-sm text-nahkya-text-secondary">{index + 1}</span>
          <span className={cn('font-body text-body-sm truncate', isSelected ? 'text-nahkya-text font-medium' : 'text-nahkya-text')}>{section.name ?? TEMPLATE_LABELS[section.templateType]}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn('flex items-center gap-1 font-mono text-mono-sm', statusConfig.color)}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>
          <span className="font-mono text-mono-sm text-nahkya-text-secondary/60">
            {TEMPLATE_LABELS[section.templateType]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
          className={cn(
            'w-7 h-7 flex items-center justify-center rounded-sm transition-colors',
            isHidden ? 'text-nahkya-text-secondary hover:text-nahkya-text' : 'text-nahkya-success hover:text-nahkya-success'
          )}
          title={isHidden ? 'Show' : 'Hide'}
        >
          {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="w-7 h-7 flex items-center justify-center rounded-sm text-nahkya-text-secondary hover:text-nahkya-text transition-colors"
          title="Duplicate"
        >
          <Copy size={13} />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-7 h-7 flex items-center justify-center rounded-sm text-nahkya-text-secondary hover:text-nahkya-error transition-colors"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export function SectionListSidebar({
  sections,
  selectedId,
  onSelect,
  onReorder,
  onAdd,
  onDuplicate,
  onRemove,
  onToggleVisibility,
}: SectionListSidebarProps) {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'hidden'>('all');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredSections = sections.filter((s) => {
    if (filter === 'all') return true;
    return (s.status ?? 'published') === filter;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(sections, oldIndex, newIndex);
    onReorder(reordered.map((s) => s.id));
  };

  return (
    <div className="flex flex-col h-full bg-nahkya-surface border-r border-nahkya-border">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-nahkya-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-heading-sm font-medium text-nahkya-text">Sections</h2>
          <span className="font-mono text-mono-sm text-nahkya-text-secondary">{sections.length}</span>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1">
          {(['all', 'published', 'draft', 'hidden'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'px-2 py-1 rounded-sm font-mono text-mono-sm capitalize transition-colors',
                filter === f
                  ? 'bg-nahkya-highlight/10 text-nahkya-highlight'
                  : 'text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-bg'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Section list */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1.5">
              {filteredSections.map((section, index) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  index={index}
                  isSelected={selectedId === section.id}
                  onSelect={() => onSelect(section.id)}
                  onDuplicate={() => onDuplicate(section.id)}
                  onRemove={() => {
                    if (confirm(`Delete "${section.name ?? TEMPLATE_LABELS[section.templateType]}"? This cannot be undone.`)) {
                      onRemove(section.id);
                    }
                  }}
                  onToggleVisibility={() => onToggleVisibility(section.id)}
  
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {filteredSections.length === 0 && (
          <div className="text-center py-8">
            <FileText size={20} className="mx-auto text-nahkya-text-secondary/40 mb-2" />
            <p className="font-body text-body-sm text-nahkya-text-secondary">No {filter !== 'all' ? filter : ''} sections</p>
          </div>
        )}
      </div>

      {/* Add section */}
      <div className="shrink-0 p-3 border-t border-nahkya-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full h-button flex items-center justify-center gap-2 bg-nahkya-highlight hover:bg-nahkya-highlight text-nahkya-text font-body text-body-sm rounded-nahkya transition-colors"
            >
              <Plus size={15} />
              Add Section
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-nahkya-surface-raised border-nahkya-border max-h-72 overflow-y-auto">
            {TEMPLATE_TYPES.map((t) => (
              <DropdownMenuItem
                key={t}
                onClick={() => onAdd(t)}
                className="font-body text-body-sm cursor-pointer focus:bg-nahkya-surface focus:text-nahkya-text py-2"
              >
                {TEMPLATE_LABELS[t]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
