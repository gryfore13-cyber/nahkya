import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Unlink,
  Eraser,
  Undo,
  Redo,
  Type,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBuilderEdit } from './BuilderEditContext';

const TEXT_COLOURS = [
  { label: 'Text', value: 'var(--nahkya-text)' },
  { label: 'Secondary', value: 'var(--nahkya-text-secondary)' },
  { label: 'Highlight', value: 'var(--nahkya-highlight)' },
  { label: 'Accent', value: 'var(--nahkya-accent)' },
  { label: 'Inverse', value: 'var(--nahkya-inverse)' },
  { label: 'Error', value: 'var(--nahkya-error)' },
  { label: 'Success', value: 'var(--nahkya-success)' },
];

const BLOCK_OPTIONS = [
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Paragraph', value: 'p' },
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'h-8 w-8 flex items-center justify-center rounded-nahkya transition-colors',
        active
          ? 'bg-nahkya-highlight text-nahkya-inverse'
          : 'text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-bg',
        disabled && 'opacity-30 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-nahkya-border mx-1" />;
}

export function FormatToolbar() {
  const { activeField } = useBuilderEdit();
  const isActive = activeField !== null;
  const [states, setStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
  });
  const [showColourPicker, setShowColourPicker] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Update toolbar button states when selection changes
  useEffect(() => {
    const updateStates = () => {
      setStates({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        justifyFull: document.queryCommandState('justifyFull'),
      });
    };
    document.addEventListener('selectionchange', updateStates);
    return () => document.removeEventListener('selectionchange', updateStates);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowColourPicker(false);
        setShowBlockMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const exec = useCallback((command: string, value: string | undefined = undefined) => {
    if (!isActive) return;
    document.execCommand(command, false, value);
  }, [isActive]);

  const handleLink = useCallback(() => {
    if (!isActive) return;
    const url = window.prompt('Enter URL:', 'https://');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  }, [isActive]);

  return (
    <div
      ref={toolbarRef}
      className={cn(
        'shrink-0 h-11 border-b border-nahkya-border bg-nahkya-surface flex items-center px-3 gap-0.5 transition-opacity',
        isActive ? 'opacity-100' : 'opacity-50'
      )}
    >
      {/* History */}
      <ToolbarButton onClick={() => exec('undo')} disabled={!isActive} title="Undo">
        <Undo size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => exec('redo')} disabled={!isActive} title="Redo">
        <Redo size={14} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Style */}
      <ToolbarButton
        onClick={() => exec('bold')}
        active={states.bold}
        disabled={!isActive}
        title="Bold"
      >
        <Bold size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec('italic')}
        active={states.italic}
        disabled={!isActive}
        title="Italic"
      >
        <Italic size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec('underline')}
        active={states.underline}
        disabled={!isActive}
        title="Underline"
      >
        <Underline size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec('strikeThrough')}
        active={states.strikeThrough}
        disabled={!isActive}
        title="Strikethrough"
      >
        <Strikethrough size={14} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Block type */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowBlockMenu((v) => !v)}
          disabled={!isActive}
          className={cn(
            'h-8 px-2 flex items-center gap-1 rounded-nahkya transition-colors font-body text-body-sm',
            'text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-bg',
            !isActive && 'opacity-30 cursor-not-allowed'
          )}
        >
          <Type size={14} />
          <ChevronDown size={12} />
        </button>
        {showBlockMenu && isActive && (
          <div className="absolute top-full left-0 mt-1 w-40 bg-nahkya-surface-raised border border-nahkya-border rounded-nahkya shadow-card py-1 z-50">
            {BLOCK_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  exec('formatBlock', opt.value);
                  setShowBlockMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 font-body text-body-sm text-nahkya-text hover:bg-nahkya-bg transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => exec('justifyLeft')}
        active={states.justifyLeft}
        disabled={!isActive}
        title="Align Left"
      >
        <AlignLeft size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec('justifyCenter')}
        active={states.justifyCenter}
        disabled={!isActive}
        title="Align Center"
      >
        <AlignCenter size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec('justifyRight')}
        active={states.justifyRight}
        disabled={!isActive}
        title="Align Right"
      >
        <AlignRight size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec('justifyFull')}
        active={states.justifyFull}
        disabled={!isActive}
        title="Justify"
      >
        <AlignJustify size={14} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton onClick={() => exec('insertUnorderedList')} disabled={!isActive} title="Bullet List">
        <List size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => exec('insertOrderedList')} disabled={!isActive} title="Numbered List">
        <ListOrdered size={14} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Colour */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowColourPicker((v) => !v)}
          disabled={!isActive}
          className={cn(
            'h-8 w-8 flex items-center justify-center rounded-nahkya transition-colors',
            'text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-bg',
            !isActive && 'opacity-30 cursor-not-allowed'
          )}
          title="Text Colour"
        >
          <span
            className="w-4 h-4 rounded-full border border-nahkya-border"
            style={{ background: 'var(--nahkya-text)' }}
          />
        </button>
        {showColourPicker && isActive && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-nahkya-surface-raised border border-nahkya-border rounded-nahkya shadow-card z-50 flex gap-1.5">
            {TEXT_COLOURS.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  exec('foreColor', c.value);
                  setShowColourPicker(false);
                }}
                title={c.label}
                className="w-6 h-6 rounded-full border border-nahkya-border hover:scale-110 transition-transform"
                style={{ background: c.value }}
              />
            ))}
          </div>
        )}
      </div>

      <ToolbarDivider />

      {/* Link */}
      <ToolbarButton onClick={handleLink} disabled={!isActive} title="Add Link">
        <Link size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => exec('unlink')} disabled={!isActive} title="Remove Link">
        <Unlink size={14} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Clear */}
      <ToolbarButton onClick={() => exec('removeFormat')} disabled={!isActive} title="Clear Formatting">
        <Eraser size={14} />
      </ToolbarButton>
    </div>
  );
}
