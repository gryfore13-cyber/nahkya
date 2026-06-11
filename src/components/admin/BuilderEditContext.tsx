import { createContext, useContext, useCallback } from 'react';
import { useHomeContentStore } from '@/stores/homeContentStore';
import type { HomepageSection, SectionSettings } from '@/types';

interface ActiveField {
  sectionId: string;
  path: string;
}

interface BuilderEditContextValue {
  isEditing: boolean;
  activeField: ActiveField | null;
  setActiveField: (field: ActiveField | null) => void;
  updateField: (sectionId: string, path: string, html: string) => void;
  updateSectionContent: (sectionId: string, updates: Partial<HomepageSection['content']>) => void;
  updateSectionSettings: (sectionId: string, updates: Partial<SectionSettings>) => void;
}

const SAFE_DEFAULT: BuilderEditContextValue = {
  isEditing: false,
  activeField: null,
  setActiveField: () => {},
  updateField: () => {},
  updateSectionContent: () => {},
  updateSectionSettings: () => {},
};

export const BuilderEditContext = createContext<BuilderEditContextValue>(SAFE_DEFAULT);

export function useBuilderEdit(): BuilderEditContextValue {
  return useContext(BuilderEditContext);
}

function setContentPath(
  content: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split('.');

  if (keys.length === 1) {
    return { ...content, [path]: value };
  }

  const newContent =
    typeof structuredClone === 'function'
      ? structuredClone(content)
      : (JSON.parse(JSON.stringify(content)) as Record<string, unknown>);

  let current: unknown = newContent;
  for (let i = 0; i < keys.length - 1; i++) {
    const next = (current as Record<string, unknown>)[keys[i]];
    if (next === null || next === undefined || typeof next !== 'object') {
      // Path doesn't exist — create empty objects along the way
      (current as Record<string, unknown>)[keys[i]] = {};
    }
    current = (current as Record<string, unknown>)[keys[i]];
  }
  (current as Record<string, unknown>)[keys[keys.length - 1]] = value;

  return newContent;
}

export function useBuilderEditProvider(isEditing: boolean) {
  const updateSectionContentFn = useHomeContentStore((s) => s.updateSectionContent);
  const updateSectionSettingsFn = useHomeContentStore((s) => s.updateSectionSettings);
  const config = useHomeContentStore((s) => s.config);

  const updateField = useCallback(
    (sectionId: string, path: string, html: string) => {
      const section = config.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const newContent = setContentPath(
        section.content as unknown as Record<string, unknown>,
        path,
        html
      );
      updateSectionContentFn(sectionId, newContent as Partial<HomepageSection['content']>);
    },
    [config.sections, updateSectionContentFn]
  );

  return { isEditing, updateField, updateSectionContent: updateSectionContentFn, updateSectionSettings: updateSectionSettingsFn };
}
