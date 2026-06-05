import { useState, useCallback, useMemo } from 'react';
import { Plus, Save, Eye, EyeOff, ChevronUp, ChevronDown, Trash2, Copy, Pencil, Layout } from 'lucide-react';
import { useHomeContentStore } from '@/stores/homeContentStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionEditorSheet } from './SectionEditorSheet';
import { TemplateRenderer } from '@/components/homepage/TemplateRenderer';
import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import { cn } from '@/lib/utils';
import {
  TEMPLATE_LABELS,
  type HomepageSection,
  type TemplateType,
} from '@/types';

const TEMPLATE_TYPES: TemplateType[] = [
  'splitScreenHero',
  'singleColumnFocus',
  'zPattern',
  'fPattern',
  'invertedPyramid',
  'cardGrid',
  'alternating',
  'longFormSales',
  'storytellingScroll',
  'asymmetricalEditorial',
  'productShowcase',
  'leadCapture',
];

export function AdminHomepageBuilder() {
  const config = useHomeContentStore((s) => s.config);
  const isSaving = useHomeContentStore((s) => s.isSaving);
  const isLoaded = useHomeContentStore((s) => s.isLoaded);
  const addSection = useHomeContentStore((s) => s.addSection);
  const removeSection = useHomeContentStore((s) => s.removeSection);
  const moveSection = useHomeContentStore((s) => s.moveSection);
  const duplicateSection = useHomeContentStore((s) => s.duplicateSection);
  const toggleVisibility = useHomeContentStore((s) => s.toggleVisibility);
  const saveConfig = useHomeContentStore((s) => s.saveConfig);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const sections = useMemo(() => {
    return (config?.sections ?? []).filter((s) => s != null);
  }, [config]);

  const selectedSection = useMemo(() => {
    return sections.find((s) => s.id === selectedId) ?? null;
  }, [sections, selectedId]);

  const handleAddSection = useCallback((templateType: TemplateType) => {
    addSection(templateType);
  }, [addSection]);

  const handleSelectSection = useCallback((id: string) => {
    setSelectedId(id);
    setSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSheetOpen(false);
    setSelectedId(null);
  }, []);

  const handleSave = useCallback(async () => {
    await saveConfig();
  }, [saveConfig]);

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="font-body text-nahkya-text-muted">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-nahkya-bg">
      {/* ── Top Toolbar ── */}
      <div className="h-toolbar border-b border-nahkya-border bg-nahkya-surface flex items-center justify-between px-5 shrink-0 z-20">
        {/* Left: Section count */}
        <span className="font-mono text-mono-xs text-nahkya-text-muted uppercase tracking-wider">
          {sections.length} section{sections.length !== 1 ? 's' : ''}
        </span>

        {/* Middle: Status */}
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="font-mono text-mono-xs text-nahkya-gold animate-pulse">Saving…</span>
          )}
          {!isSaving && (
            <span className="font-mono text-mono-xs text-nahkya-success">Saved</span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview((v) => !v)}
            className={cn(
              'font-body text-body-sm',
              isPreview ? 'text-nahkya-gold bg-nahkya-gold-veil' : 'text-nahkya-text-muted'
            )}
          >
            {isPreview ? <Eye size={15} className="mr-1.5" /> : <EyeOff size={15} className="mr-1.5" />}
            {isPreview ? 'Preview' : 'Edit'}
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-button bg-nahkya-gold hover:bg-nahkya-gold-deep text-nahkya-soft-black font-body text-body-sm disabled:opacity-50"
          >
            <Save size={15} className="mr-1.5" />
            Save
          </Button>
        </div>
      </div>

      {/* ── Workspace ── */}
      <ScrollArea className="flex-1 bg-nahkya-bg">
        <div className="max-w-5xl mx-auto py-8 px-4">
          {sections.length === 0 ? (
            <EmptyWorkspace onAdd={handleAddSection} />
          ) : (
            <div className="space-y-2">
              {sections.map((section, idx) => (
                <div key={section.id}>
                  {/* Insertion divider before first section (idx === 0) and between sections */}
                  <InsertionDivider
                    visible={!isPreview}
                    onAdd={handleAddSection}
                  />
                  <SectionCard
                    section={section}
                    index={idx}
                    total={sections.length}
                    isSelected={section.id === selectedId}
                    isPreview={isPreview}
                    onSelect={() => handleSelectSection(section.id)}
                    onMoveUp={() => moveSection(section.id, 'up')}
                    onMoveDown={() => moveSection(section.id, 'down')}
                    onDuplicate={() => duplicateSection(section.id)}
                    onRemove={() => removeSection(section.id)}
                    onToggleVisibility={() => toggleVisibility(section.id)}
                  />
                </div>
              ))}
              {/* Bottom insertion zone */}
              {!isPreview && (
                <WorkspaceAddZone onAdd={handleAddSection} />
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ── Section Editor Sheet ── */}
      <SectionEditorSheet
        section={selectedSection}
        open={sheetOpen}
        onClose={handleCloseSheet}
      />
    </div>
  );
}

// ── Empty State ──

function EmptyWorkspace({ onAdd }: { onAdd: (t: TemplateType) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Layout size={48} className="text-nahkya-border mb-4" />
      <h3 className="font-display text-heading-md font-medium text-nahkya-text mb-2">
        Start Building Your Homepage
      </h3>
      <p className="font-body text-body-md text-nahkya-text-muted max-w-md mb-6">
        Add sections to create a stunning homepage. Choose from 12 professional templates.
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-button bg-nahkya-gold hover:bg-nahkya-gold-deep text-nahkya-soft-black font-body text-body-sm">
            <Plus size={15} className="mr-1.5" />
            Add First Section
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56 bg-nahkya-surface border-nahkya-border">
          {TEMPLATE_TYPES.map((t) => (
            <DropdownMenuItem
              key={t}
              onClick={() => onAdd(t)}
              className="font-body text-body-sm cursor-pointer focus:bg-nahkya-cream focus:text-nahkya-text"
            >
              {TEMPLATE_LABELS[t]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ── Section Card ──

function SectionCard({
  section,
  index,
  total,
  isSelected,
  isPreview,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
  onToggleVisibility,
}: {
  section: HomepageSection;
  index: number;
  total: number;
  isSelected: boolean;
  isPreview: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onToggleVisibility: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const showControls = !isPreview && (isHovered || isSelected);

  return (
    <div
      className={cn(
        'relative rounded-sm transition-all duration-200',
        showControls && 'ring-1 ring-nahkya-gold/40',
        !section.settings?.isVisible && 'opacity-50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover toolbar */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 h-9 bg-nahkya-surface border-b border-nahkya-gold/20 rounded-t-sm">
          <div className="flex items-center gap-2">
            <span className="font-mono text-mono-xs text-nahkya-text-muted uppercase">
              {index + 1}. {TEMPLATE_LABELS[section.templateType]}
            </span>
            {!section.settings?.isVisible && (
              <span className="font-mono text-mono-xs text-nahkya-text-muted bg-nahkya-stone px-1.5 rounded">Hidden</span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <SectionCardButton onClick={onMoveUp} disabled={index === 0} tooltip="Move Up">
              <ChevronUp size={14} />
            </SectionCardButton>
            <SectionCardButton onClick={onMoveDown} disabled={index === total - 1} tooltip="Move Down">
              <ChevronDown size={14} />
            </SectionCardButton>
            <SectionCardButton onClick={onDuplicate} tooltip="Duplicate">
              <Copy size={14} />
            </SectionCardButton>
            <SectionCardButton onClick={onToggleVisibility} tooltip={section.settings?.isVisible ? 'Hide' : 'Show'}>
              {section.settings?.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </SectionCardButton>
            <SectionCardButton onClick={onSelect} tooltip="Edit">
              <Pencil size={14} />
            </SectionCardButton>
            <SectionCardButton onClick={onRemove} tooltip="Delete" danger>
              <Trash2 size={14} />
            </SectionCardButton>
          </div>
        </div>
      )}

      {/* Preview / content */}
      <div
        className={cn(showControls && 'pt-9')}
        onClick={() => {
          if (!isPreview) onSelect();
        }}
      >
        <SectionWrapper settings={section.settings}>
          <TemplateRenderer section={section} />
        </SectionWrapper>
      </div>
    </div>
  );
}

function SectionCardButton({
  onClick,
  disabled,
  tooltip,
  danger,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      title={tooltip}
      type="button"
      className={cn(
        'w-7 h-7 flex items-center justify-center rounded-sm transition-colors',
        'hover:bg-nahkya-cream',
        disabled && 'opacity-30 cursor-not-allowed',
        danger ? 'text-nahkya-text-muted hover:text-nahkya-error' : 'text-nahkya-text-muted hover:text-nahkya-text'
      )}
    >
      {children}
    </button>
  );
}

// ── Insertion Divider (between sections) ──

function InsertionDivider({
  visible,
  onAdd,
}: {
  visible: boolean;
  onAdd: (t: TemplateType) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  if (!visible) return null;

  return (
    <div
      className="relative h-6 -my-1 z-10 flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="absolute inset-x-0 flex items-center justify-center">
          <div className="w-full h-px bg-nahkya-gold/40" />
          <div className="absolute">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-nahkya-gold text-nahkya-soft-black shadow-sm hover:bg-nahkya-gold-deep transition-colors"
                >
                  <Plus size={12} strokeWidth={2.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-nahkya-surface border-nahkya-border">
                {TEMPLATE_TYPES.map((t) => (
                  <DropdownMenuItem
                    key={t}
                    onClick={() => onAdd(t)}
                    className="font-body text-body-sm cursor-pointer focus:bg-nahkya-cream focus:text-nahkya-text"
                  >
                    {TEMPLATE_LABELS[t]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Bottom Workspace Add Zone ──

function WorkspaceAddZone({ onAdd }: { onAdd: (t: TemplateType) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="py-6 flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex items-center gap-2 px-5 h-button border-2 border-dashed rounded-nahkya transition-all duration-200',
              isHovered
                ? 'border-nahkya-gold bg-nahkya-gold-veil text-nahkya-gold'
                : 'border-nahkya-border text-nahkya-text-muted'
            )}
          >
            <Plus size={15} />
            <span className="font-body text-body-sm">Add Section</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56 bg-nahkya-surface border-nahkya-border">
          {TEMPLATE_TYPES.map((t) => (
            <DropdownMenuItem
              key={t}
              onClick={() => onAdd(t)}
              className="font-body text-body-sm cursor-pointer focus:bg-nahkya-cream focus:text-nahkya-text"
            >
              {TEMPLATE_LABELS[t]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
