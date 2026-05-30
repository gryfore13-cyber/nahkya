import { useState, useRef } from 'react';
import { Eye, EyeOff, GripVertical, Trash2, Copy, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHomepageStore, type SectionType } from '@/stores/homepageStore';

const SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: 'hero', label: 'Hero' },
  { type: 'features', label: 'Features Grid' },
  { type: 'split', label: 'Split Layout' },
  { type: 'testimonials', label: 'Testimonials' },
  { type: 'showcase', label: 'Showcase' },
  { type: 'textMedia', label: 'Text & Media' },
  { type: 'gallery', label: 'Gallery' },
  { type: 'pricing', label: 'Pricing' },
  { type: 'footerCTA', label: 'Footer CTA' },
];

export function SectionListSidebar() {
  const sections = useHomepageStore((s) => s.sections);
  const selectedSectionId = useHomepageStore((s) => s.selectedSectionId);
  const setSelectedSection = useHomepageStore((s) => s.setSelectedSection);
  const toggleVisibility = useHomepageStore((s) => s.toggleVisibility);
  const reorderSections = useHomepageStore((s) => s.reorderSections);
  const deleteSection = useHomepageStore((s) => s.deleteSection);
  const duplicateSection = useHomepageStore((s) => s.duplicateSection);
  const addSection = useHomepageStore((s) => s.addSection);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const sorted = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleDragStart = (id: string) => {
    setDragId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== dragId) setDragOverId(id);
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const fromIndex = sorted.findIndex((s) => s.id === dragId);
    const toIndex = sorted.findIndex((s) => s.id === targetId);
    const reordered = [...sorted];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    reorderSections(reordered.map((s) => s.id));
    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="w-sidebar-admin border-r border-nahkya-gold-soft bg-nahkya-surface flex flex-col h-full">
      <div className="h-toolbar border-b border-nahkya-gold-soft flex items-center justify-between px-6">
        <h2 className="font-body text-heading-sm text-nahkya-text font-medium">Sections</h2>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowAddMenu((v) => !v)}
            className="p-2 bg-nahkya-gold text-nahkya-text rounded-nahkya hover:bg-nahkya-gold-soft transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </button>
          {showAddMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-nahkya-ivory border border-nahkya-gold-soft rounded-nahkya shadow-lg z-dropdown py-2">
              {SECTION_TYPES.map((t) => (
                <button
                  key={t.type}
                  onClick={() => {
                    addSection(t.type);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-body-md text-nahkya-text font-body hover:bg-nahkya-surface transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        {sorted.map((section) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(section.id)}
            onDragOver={(e) => handleDragOver(e, section.id)}
            onDrop={() => handleDrop(section.id)}
            onDragEnd={() => { setDragId(null); setDragOverId(null); }}
            onClick={() => setSelectedSection(section.id)}
            className={cn(
              'group flex items-center gap-3 p-3 rounded-nahkya border cursor-pointer transition-all',
              selectedSectionId === section.id
                ? 'border-nahkya-gold bg-nahkya-gold/5'
                : 'border-nahkya-gold-soft bg-nahkya-ivory hover:border-nahkya-taupe',
              dragOverId === section.id && 'border-nahkya-gold border-dashed',
              !section.visible && 'opacity-50'
            )}
          >
            <GripVertical className="w-4 h-4 text-nahkya-text-muted cursor-grab shrink-0" strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-body-md text-nahkya-text font-medium truncate">{section.title}</p>
              <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">{section.type}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id); }}
                className="p-1.5 text-nahkya-text-muted hover:text-nahkya-text transition-colors"
              >
                {section.visible ? <Eye className="w-3.5 h-3.5" strokeWidth={1.5} /> : <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}
                className="p-1.5 text-nahkya-text-muted hover:text-nahkya-text transition-colors"
              >
                <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                className="p-1.5 text-nahkya-text-muted hover:text-nahkya-error transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
