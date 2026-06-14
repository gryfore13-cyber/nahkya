import type { LandingTextField, LandingTextStyle } from '@/types/landingPage';

export function getText(field: LandingTextField | undefined): string {
  if (field === undefined || field === null) return '';
  if (typeof field === 'string') return field;
  return field.text ?? '';
}

export function getStyle(field: LandingTextField | undefined): LandingTextStyle | undefined {
  if (field === undefined || field === null) return undefined;
  if (typeof field === 'string') return undefined;
  return field.style;
}

export function textField(text: string, style?: LandingTextStyle): LandingTextField {
  if (!style || Object.keys(style).length === 0) return text;
  return { text, style };
}

export function updateText(field: LandingTextField | undefined, text: string): LandingTextField {
  if (field === undefined || field === null) return text;
  if (typeof field === 'string') return text;
  return { ...field, text };
}

export function updateStyle(
  field: LandingTextField | undefined,
  patch: Partial<LandingTextStyle>,
): LandingTextField {
  const text = getText(field);
  const current = getStyle(field) ?? {};
  const next = Object.fromEntries(
    Object.entries({ ...current, ...patch }).filter(([, value]) => value !== undefined),
  ) as LandingTextStyle;
  return textField(text, next);
}
