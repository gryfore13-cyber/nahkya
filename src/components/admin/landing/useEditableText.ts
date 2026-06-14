import { useLandingPageStore } from '@/stores/landingPageStore';

export function useEditableText(sectionId: string, editable?: boolean) {
  const updateText = useLandingPageStore((s) => s.updateSectionText);
  const setSelectedTextPath = useLandingPageStore((s) => s.setSelectedTextPath);
  const selectSection = useLandingPageStore((s) => s.selectSection);

  return (path: string) => ({
    editable,
    onChange: (text: string) => updateText(sectionId, path, text),
    onSelect: () => {
      selectSection(sectionId);
      setSelectedTextPath({ sectionId, path });
    },
  });
}
