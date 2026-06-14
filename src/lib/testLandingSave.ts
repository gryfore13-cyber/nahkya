import { useLandingPageStore } from '@/stores/landingPageStore';

export async function testSaveWithStyledArrayItem() {
  const store = useLandingPageStore.getState();
  // Style the first footer link if footer exists; otherwise style a tools item title.
  const footer = store.config.sections.find((s) => s.type === 'footer');
  if (footer && footer.type === 'footer') {
    store.updateSectionTextStyle(footer.id, 'links.0', { bold: true, color: '#B88B4A' });
  } else {
    const tools = store.config.sections.find((s) => s.type === 'tools');
    if (tools && tools.type === 'tools') {
      store.updateSectionTextStyle(tools.id, 'items.0.title', { bold: true, color: '#B88B4A' });
    }
  }
  await store.saveConfig();
  const after = useLandingPageStore.getState();
  return after.saveError ?? 'no saveError';
}
