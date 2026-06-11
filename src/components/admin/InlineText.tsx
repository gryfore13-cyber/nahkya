import { useRef, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';
import { useBuilderEdit } from './BuilderEditContext';

type InlineTextTag = 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'a' | 'li';

interface InlineTextProps {
  tag?: InlineTextTag;
  value: string;
  path: string;
  sectionId: string;
  className?: string;
  placeholder?: string;
}

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'b',
    'strong',
    'i',
    'em',
    'u',
    's',
    'strike',
    'a',
    'br',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'ul',
    'ol',
    'li',
    'span',
    'div',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class'],
};

export function InlineText({
  tag: Tag = 'span',
  value,
  path,
  sectionId,
  className,
  placeholder,
}: InlineTextProps) {
  const { isEditing, setActiveField, updateField } = useBuilderEdit();
  const ref = useRef<HTMLElement>(null);
  const isFocusedRef = useRef(false);

  // Sync external value when not focused
  useEffect(() => {
    const el = ref.current;
    if (!el || isFocusedRef.current) return;
    el.innerHTML = DOMPurify.sanitize(value || '', PURIFY_CONFIG);
  }, [value]);

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    setActiveField({ sectionId, path });
  }, [sectionId, path, setActiveField]);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    const el = ref.current;
    if (el) {
      const clean = DOMPurify.sanitize(el.innerHTML, PURIFY_CONFIG);
      updateField(sectionId, path, clean);
    }
    setActiveField(null);
  }, [sectionId, path, updateField, setActiveField]);

  // Keyboard shortcut: blur on Escape
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      (e.target as HTMLElement).blur();
    }
  }, []);

  if (!isEditing) {
    const ElPreview = Tag;
    return (
      <ElPreview
        className={className}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(value || '', PURIFY_CONFIG),
        }}
      />
    );
  }

  const ElEdit = Tag;
  return (
    <ElEdit
      ref={ref as React.Ref<never>}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={placeholder || 'Editable text'}
      aria-multiline="true"
      className={cn(
        'outline-none rounded-nahkya px-1 -mx-1 transition-shadow',
        'hover:ring-1 hover:ring-nahkya-highlight/30 hover:bg-nahkya-highlight/5',
        'focus:ring-2 focus:ring-nahkya-highlight/50 focus:bg-nahkya-highlight/5',
        !value && placeholder && 'empty:before:content-[attr(data-placeholder)] empty:before:text-nahkya-text-secondary/40',
        className
      )}
      data-placeholder={placeholder}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(value || '', PURIFY_CONFIG),
      }}
    />
  );
}
