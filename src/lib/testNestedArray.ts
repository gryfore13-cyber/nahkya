import { useLandingPageStore } from '@/stores/landingPageStore';

export async function testNestedArraySave() {
  const store = useLandingPageStore.getState();
  const tools = store.config.sections.find((s) => s.type === 'tools');
  if (tools && tools.type === 'tools') {
    store.updateSection(tools.id, (section) => ({
      ...section,
      items: [
        { title: [{ text: 'nested' } as unknown as never], description: 'desc' },
        ...section.items.slice(1),
      ],
    }));
  }
  const afterUpdate = useLandingPageStore.getState();
  const item = afterUpdate.config.sections.find((s) => s.type === 'tools')?.items?.[0];
  await afterUpdate.saveConfig();
  const afterSave = useLandingPageStore.getState();
  return {
    itemTitle: JSON.stringify(item?.title),
    saveError: afterSave.saveError,
  };
}
