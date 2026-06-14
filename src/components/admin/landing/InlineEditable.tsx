import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { getText, getStyle } from '@/lib/landingText';
import type { LandingTextField } from '@/types/landingPage';

type EditableTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div' | 'span' | 'b' | 'q' | 'blockquote' | 'a' | 'li';

const ALIGN_CLASSES: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const COLOR_CLASSES: Record<string, string> = {
  'nahkya-text': 'text-nahkya-text',
  'nahkya-text-secondary': 'text-nahkya-text-secondary',
  'nahkya-inverse': 'text-nahkya-inverse',
  'nahkya-accent': 'text-nahkya-accent',
  'nahkya-highlight': 'text-nahkya-highlight',
  'nahkya-success': 'text-nahkya-success',
  'nahkya-error': 'text-nahkya-error',
  'nahkya-warning': 'text-nahkya-warning',
  'nahkya-info': 'text-nahkya-info',
};

function colorClassAndStyle(color: string | undefined): { className?: string; style?: React.CSSProperties } {
  if (!color) return {};
  if (COLOR_CLASSES[color]) return { className: COLOR_CLASSES[color] };
  return { style: { color } };
}

interface InlineEditableProps {
  value: LandingTextField | undefined;
  tag?: EditableTag;
  className?: string;
  editable?: boolean;
  href?: string;
  onChange?: (text: string) => void;
  onSelect?: () => void;
}

export function InlineEditable({
  value,
  tag = 'span',
  className,
  editable,
  href,
  onChange,
  onSelect,
}: InlineEditableProps) {
  const text = getText(value);
  const style = getStyle(value);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== text) {
      ref.current.innerText = text;
    }
  }, [text]);

  const alignClass = style?.align ? ALIGN_CLASSES[style.align] : undefined;
  const colorOverride = colorClassAndStyle(style?.color);
  const styleClasses = cn(
    style?.bold && 'font-bold',
    style?.italic && 'italic',
    style?.underline && 'underline',
    alignClass,
    colorOverride.className,
  );

  const Component = tag as React.ElementType;

  if (!editable) {
    return (
      <Component className={cn(styleClasses, className)} style={colorOverride.style} href={href}>
        {text}
      </Component>
    );
  }

  return (
    <Component
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-landing-text
      className={cn(
        'outline-none focus:ring-2 focus:ring-nahkya-highlight ring-offset-1 rounded-sm',
        styleClasses,
        className,
      )}
      style={colorOverride.style}
      href={href}
      onFocus={onSelect}
      onBlur={(e: React.FocusEvent<HTMLElement>) => onChange?.(e.currentTarget.innerText)}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter' && tag !== 'p' && tag !== 'div' && tag !== 'blockquote' && tag !== 'li') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    >
      {text}
    </Component>
  );
}
