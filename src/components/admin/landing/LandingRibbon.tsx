import { useCallback, useState } from 'react';
import { Home, Plus, Layout, Image, Play, Smartphone, Type } from 'lucide-react';
import { Ribbon, RibbonTabs, RibbonTab, RibbonBody, RibbonPanel } from '@/components/shared/Ribbon';
import { HomePanel } from '@/components/admin/landing/panels/HomePanel';
import { InsertPanel } from '@/components/admin/landing/panels/InsertPanel';
import { LayoutPanel } from '@/components/admin/landing/panels/LayoutPanel';
import { PicturePanel } from '@/components/admin/landing/panels/PicturePanel';
import { FontPanel } from '@/components/admin/landing/panels/FontPanel';
import { MotionPanel } from '@/components/admin/landing/panels/MotionPanel';
import { ResponsivePanel } from '@/components/admin/landing/panels/ResponsivePanel';
import { useLandingPageStore } from '@/stores/landingPageStore';
import type { LandingNavSection, LandingPageConfig, LandingSection, LandingTextField, LandingTextStyle } from '@/types/landingPage';
import { getStyle, getText } from '@/lib/landingText';

export interface LandingStudioState {
  id: string;
  type: string;
  name: string;
  bg: 'solid' | 'gradient' | 'image';
  solidColor: string;
  gradient: string;
  isVisible: boolean;
  locked: boolean;
  activeSlotId: string | null;
  activeSlotHasImage: boolean;
  isNav: boolean;
  isFooter: boolean;
  navStyle: string;
  logoMode: string;
  sticky: boolean;
  stickyBehavior: string;
  overlay: string;
  opacity: number;
  backgroundPosition: string;
  motion: string;
  previewMode: 'mobile' | 'tablet' | 'desktop';
  spacing: 'compact' | 'standard' | 'luxury';
  align: 'left' | 'center' | 'right';
  selectedTextPath: { sectionId: string; path: string } | null;
  selectedTextStyle: LandingTextStyle;
}

export interface SectionListItem {
  id: string;
  name: string;
  type: string;
  bg: string;
  index: number;
  isNav: boolean;
  isFooter: boolean;
}

export interface LandingApi {
  getState: () => LandingStudioState;
  getSectionList: () => SectionListItem[];
  selectSection: (id: string) => void;
  selectSectionById: (id: string) => void;
  selectNavLink: (index: number) => void;
  duplicateSectionById: (id: string) => void;
  deleteSectionById: (id: string) => void;
  moveSectionById: (id: string, dir: 'up' | 'down') => void;
  duplicateSelected: () => void;
  deleteSelected: () => void;
  moveSection: (dir: 'up' | 'down') => void;
  toggleVisibility: () => void;
  toggleLock: () => void;
  applySolid: (color: string) => void;
  applyGradient: (value: string) => void;
  applyPicture: (src: string) => void;
  applyOverlay: (mode: string, opacity: number) => void;
  setBackgroundPosition: (value: string) => void;
  setSpacing: (value: 'compact' | 'standard' | 'luxury') => void;
  setAlign: (value: 'left' | 'center' | 'right') => void;
  setMotion: (value: 'none' | 'fade' | 'reveal' | 'zoom') => void;
  previewMotion: () => void;
  setPreviewMode: (mode: 'mobile' | 'tablet' | 'desktop') => void;
  applyTextStyle: (patch: Partial<LandingTextStyle>) => void;
  clearTextStyle: () => void;
  createSection: (type: string) => void;
  replaceMedia: (dataUrl: string) => void;
  removeMedia: () => void;
  undo: () => void;
  redo: () => void;
  applyNavStyle: (style: string) => void;
  applyLogoMode: (mode: string) => void;
  setLogoImage: (dataUrl: string) => void;
  removeLogoImage: () => void;
  setLogoSize: (size: number) => void;
  updateNavContent: (logoText: string, ctaText: string) => void;
  updateNavContact: (contactText: string, contactTarget: string) => void;
  addNavLink: (label: string, target: string) => void;
  updateNavLink: (index: number, label: string, target: string) => void;
  removeNavLink: (index: number) => void;
  moveNavLink: (dir: 'left' | 'right') => void;
  autoLinkSections: () => void;
  setSticky: (value: boolean) => void;
  setStickyBehavior: (value: string) => void;
  getNavLinks: () => { index: number; label: string; target: string }[];
}

export function LandingRibbon() {
  const store = useLandingPageStore();
  const state = deriveStudioState(store);
  const [activeTab, setActiveTab] = useState('home');

  const callApi = useCallback(
    <K extends keyof LandingApi>(
      method: K,
      ...args: Parameters<LandingApi[K]>
    ): ReturnType<LandingApi[K]> | undefined => {
      const handler = apiHandlers(store)[method];
      if (typeof handler !== 'function') return undefined;
      return (handler as (...a: unknown[]) => ReturnType<LandingApi[K]>)(...args);
    },
    [store],
  );

  const hasSelection = !!state?.id;
  const canMove = hasSelection && !state?.isNav && !state?.isFooter && !state?.locked;

  return (
    <div className="bg-nahkya-surface-raised border-b border-nahkya-border shadow-md z-10">
      <Ribbon activeTab={activeTab} onTabChange={setActiveTab}>
        <RibbonTabs>
          <RibbonTab id="home" label="Home" icon={<Home className="w-3.5 h-3.5" />} />
          <RibbonTab id="insert" label="Insert" icon={<Plus className="w-3.5 h-3.5" />} />
          <RibbonTab id="layout" label="Layout" icon={<Layout className="w-3.5 h-3.5" />} />
          <RibbonTab id="picture" label="Picture" icon={<Image className="w-3.5 h-3.5" />} />
          <RibbonTab id="font" label="Text" icon={<Type className="w-3.5 h-3.5" />} />
          <RibbonTab id="motion" label="Motion" icon={<Play className="w-3.5 h-3.5" />} />
          <RibbonTab id="responsive" label="Responsive" icon={<Smartphone className="w-3.5 h-3.5" />} />
        </RibbonTabs>

        <RibbonBody>
          <RibbonPanel tabId="home">
            <HomePanel state={state} callApi={callApi} canMove={canMove} />
          </RibbonPanel>
          <RibbonPanel tabId="insert">
            <InsertPanel callApi={callApi} />
          </RibbonPanel>
          <RibbonPanel tabId="layout">
            <LayoutPanel state={state} callApi={callApi} />
          </RibbonPanel>
          <RibbonPanel tabId="picture">
            <PicturePanel state={state} callApi={callApi} />
          </RibbonPanel>
          <RibbonPanel tabId="font">
            <FontPanel state={state} callApi={callApi} />
          </RibbonPanel>
          <RibbonPanel tabId="motion">
            <MotionPanel state={state} callApi={callApi} />
          </RibbonPanel>
          <RibbonPanel tabId="responsive">
            <ResponsivePanel state={state} callApi={callApi} />
          </RibbonPanel>
        </RibbonBody>
      </Ribbon>
    </div>
  );
}

type LandingContentSection = Exclude<LandingSection, LandingNavSection>;

function apiHandlers(store: ReturnType<typeof useLandingPageStore.getState>): LandingApi {
  const selectedSection = (): LandingContentSection | null => {
    const { selectedId, config } = store;
    if (!selectedId || selectedId === config.nav.id) return null;
    return (
      config.sections.find((s): s is LandingContentSection => s.id === selectedId && s.type !== 'nav') ?? null
    );
  };

  const updateSelectedSettings = (patch: Partial<LandingContentSection['settings']>) => {
    const section = selectedSection();
    if (!section) return;
    store.updateSectionSettings(section.id, patch);
  };

  return {
    getState: () => deriveStudioState(store) as LandingStudioState,

    getSectionList: () => buildSectionList(store.config),

    selectSection: (id) => store.selectSection(id),
    selectSectionById: (id) => store.selectSection(id),
    selectNavLink: (index) => store.selectNavLinkIndex(index),

    duplicateSectionById: (id) => store.duplicateSection(id),
    deleteSectionById: (id) => store.deleteSection(id),
    moveSectionById: (id, dir) => store.moveSection(id, dir),

    duplicateSelected: () => {
      const id = store.selectedId;
      if (id && id !== store.config.nav.id) store.duplicateSection(id);
    },
    deleteSelected: () => {
      const id = store.selectedId;
      if (id && id !== store.config.nav.id) store.deleteSection(id);
    },
    moveSection: (dir) => {
      const id = store.selectedId;
      if (id && id !== store.config.nav.id) store.moveSection(id, dir);
    },

    toggleVisibility: () => {
      const id = store.selectedId;
      if (id && id !== store.config.nav.id) store.toggleVisibility(id);
    },
    toggleLock: () => {
      const id = store.selectedId;
      if (id) store.toggleLock(id);
    },

    applySolid: (color) => updateSelectedSettings({ backgroundColor: color }),
    applyGradient: (value) => updateSelectedSettings({ backgroundColor: `gradient-${value}` }),
    applyPicture: (src) => {
      const section = selectedSection();
      if (!section) return;
      const url = parseImageUrl(src);
      store.updateSectionSettings(section.id, { backgroundColor: 'image' });
      if (url && (section.type === 'hero' || section.type === 'story')) {
        store.updateSection(section.id, (s) => ({ ...s, imageUrl: url }) as never);
      }
    },
    applyOverlay: (mode, opacity) => store.setOverlay(mode, opacity),
    setBackgroundPosition: (value) => {
      const id = store.selectedId;
      if (!id || id === store.config.nav.id) return;
      store.updateSectionSettings(id, { backgroundPosition: value });
    },
    setSpacing: (value) => updateSelectedSettings({ padding: value }),
    setAlign: (value) => updateSelectedSettings({ align: value }),
    setMotion: (value) => store.setMotion(value),
    previewMotion: () => store.previewMotion(),
    setPreviewMode: (mode) => store.setPreviewMode(mode),

    applyTextStyle: (patch) => {
      const { selectedTextPath } = store;
      if (!selectedTextPath) return;
      store.updateSectionTextStyle(selectedTextPath.sectionId, selectedTextPath.path, patch);
    },
    clearTextStyle: () => {
      const { selectedTextPath } = store;
      if (!selectedTextPath) return;
      store.updateSection(selectedTextPath.sectionId, (section) =>
        setFieldAtPath(section as never, selectedTextPath.path, (field) => {
          const text = typeof field === 'string' ? field : (field as { text?: string })?.text ?? '';
          return text;
        }) as never,
      );
    },

    createSection: (type) => store.createSection(type),

    replaceMedia: (dataUrl) => {
      const { selectedId, config } = store;
      if (!selectedId) return;
      if (selectedId === config.nav.id) {
        store.updateNav((nav) => ({ ...nav, logoImageUrl: dataUrl }));
        return;
      }
      store.updateSection(selectedId, (section) => {
        if (section.type === 'hero' || section.type === 'story') {
          return { ...section, imageUrl: dataUrl } as never;
        }
        if (section.type === 'gallery') {
          const items = section.items.map((item, idx) =>
            idx === 0 || !item.imageUrl ? { ...item, imageUrl: dataUrl } : item,
          );
          return { ...section, items } as never;
        }
        return section as never;
      });
    },

    removeMedia: () => {
      const { selectedId, config } = store;
      if (!selectedId) return;
      if (selectedId === config.nav.id) {
        store.updateNav((nav) => ({ ...nav, logoImageUrl: undefined }));
        return;
      }
      store.updateSection(selectedId, (section) => {
        if (section.type === 'hero' || section.type === 'story') {
          return {
            ...section,
            imageUrl: undefined,
            settings: { ...section.settings, backgroundColor: '#F8F1E7' },
          } as never;
        }
        if (section.type === 'gallery') {
          const items = section.items.map((item) => {
            const next = { ...item };
            delete next.imageUrl;
            return next;
          });
          return { ...section, items } as never;
        }
        return section as never;
      });
    },

    undo: () => {},
    redo: () => {},

    applyNavStyle: (style) =>
      store.updateNav((nav) => ({ ...nav, style: style as LandingPageConfig['nav']['style'] })),
    applyLogoMode: (mode) =>
      store.updateNav((nav) => ({ ...nav, logoImageUrl: mode === 'text' ? undefined : nav.logoImageUrl })),
    setLogoImage: (dataUrl) => store.updateNav((nav) => ({ ...nav, logoImageUrl: dataUrl })),
    removeLogoImage: () => store.updateNav((nav) => ({ ...nav, logoImageUrl: undefined })),
    setLogoSize: () => {},
    updateNavContent: (logoText, ctaText) =>
      store.updateNav((nav) => ({ ...nav, logoText, ctaText })),
    updateNavContact: (contactText, contactTarget) =>
      store.updateNav((nav) => ({ ...nav, contactText, contactTarget })),
    addNavLink: (label, target) =>
      store.updateNav((nav) => ({ ...nav, links: [...nav.links, { label, target }] })),
    updateNavLink: (index, label, target) =>
      store.updateNav((nav) => ({
        ...nav,
        links: nav.links.map((l, i) => (i === index ? { label, target } : l)),
      })),
    removeNavLink: (index) =>
      store.updateNav((nav) => ({ ...nav, links: nav.links.filter((_, i) => i !== index) })),
    moveNavLink: (dir) => {
      const { selectedNavLinkIndex } = store;
      store.updateNav((nav) => {
        const links = [...nav.links];
        const idx = selectedNavLinkIndex;
        const newIdx = dir === 'left' ? Math.max(0, idx - 1) : Math.min(links.length - 1, idx + 1);
        if (newIdx === idx) return nav;
        const [moved] = links.splice(idx, 1);
        links.splice(newIdx, 0, moved);
        return { ...nav, links };
      });
      store.selectNavLinkIndex(dir === 'left' ? Math.max(0, selectedNavLinkIndex - 1) : selectedNavLinkIndex + 1);
    },
    autoLinkSections: () =>
      store.updateNav((nav) => ({
        ...nav,
        links: store.config.sections
          .filter((s) => s.type !== 'footer')
          .map((s) => ({ label: sectionLabel(s), target: `#${s.id}` })),
      })),
    setSticky: (value) => store.updateNav((nav) => ({ ...nav, sticky: value })),
    setStickyBehavior: (value) => store.setStickyBehavior(value),
    getNavLinks: () => store.config.nav.links.map((l, index) => ({ index, ...l })),
  };
}

function deriveStudioState(store: ReturnType<typeof useLandingPageStore.getState>): LandingStudioState | null {
  const { config, selectedId, lockedIds, overlay, opacity, motion, stickyBehavior, previewMode, selectedTextPath } = store;
  if (!selectedId) return null;

  const isNav = selectedId === config.nav.id;
  const section = isNav
    ? null
    : config.sections.find((s): s is LandingContentSection => s.id === selectedId && s.type !== 'nav') ?? null;
  const settings = section?.settings;

  const bgValue = isNav ? config.nav.style : settings?.backgroundColor ?? '#F8F1E7';
  const bg: LandingStudioState['bg'] =
    bgValue === 'image' ? 'image' : String(bgValue).startsWith('gradient') ? 'gradient' : 'solid';

  const solidColor = bg === 'solid' ? String(bgValue) : '#F8F1E7';
  const gradient = bg === 'gradient' ? gradientName(String(bgValue)) : 'warm';

  const activeSlotId =
    isNav || !section
      ? null
      : section.type === 'hero' || section.type === 'story' || section.type === 'gallery'
        ? section.id
        : null;
  const activeSlotHasImage = section
    ? section.type === 'hero' || section.type === 'story'
      ? !!section.imageUrl
      : section.type === 'gallery'
        ? section.items.some((i) => !!i.imageUrl)
        : false
    : false;

  return {
    id: selectedId,
    type: isNav ? 'nav' : section?.type ?? 'unknown',
    name: isNav ? 'Nav' : sectionName(section!),
    bg,
    solidColor,
    gradient,
    isVisible: isNav ? true : settings?.isVisible ?? true,
    locked: lockedIds.includes(selectedId),
    activeSlotId,
    activeSlotHasImage,
    isNav,
    isFooter: section?.type === 'footer',
    navStyle: config.nav.style,
    logoMode: config.nav.logoImageUrl ? 'image' : 'text',
    sticky: config.nav.sticky,
    stickyBehavior,
    overlay,
    opacity,
    backgroundPosition: settings?.backgroundPosition ?? 'center',
    motion,
    previewMode,
    spacing: (isNav ? 'standard' : settings?.padding) ?? 'standard',
    align: (isNav ? 'left' : settings?.align) ?? 'center',
    selectedTextPath,
    selectedTextStyle: selectedTextPath
      ? getStyle(getTextFieldAtPath(config, selectedTextPath.sectionId, selectedTextPath.path) as LandingTextField | undefined) ?? {}
      : {},
  };
}

function getTextFieldAtPath(
  config: LandingPageConfig,
  sectionId: string,
  path: string,
): unknown {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  return getValueAtPath(section, path.split('.'));
}

function getValueAtPath(target: unknown, keys: string[]): unknown {
  if (keys.length === 0) return target;
  if (Array.isArray(target)) {
    const idx = Number(keys[0]);
    return getValueAtPath(target[idx], keys.slice(1));
  }
  if (target && typeof target === 'object') {
    return getValueAtPath((target as Record<string, unknown>)[keys[0]], keys.slice(1));
  }
  return undefined;
}

function setFieldAtPath(target: unknown, path: string, updater: (field: unknown) => unknown): unknown {
  const keys = path.split('.');
  if (keys.length === 0) return target;
  if (keys.length === 1) {
    if (Array.isArray(target)) {
      const idx = Number(keys[0]);
      const copy = [...target];
      copy[idx] = updater(copy[idx]);
      return copy;
    }
    if (target && typeof target === 'object') {
      return { ...(target as Record<string, unknown>), [keys[0]]: updater((target as Record<string, unknown>)[keys[0]]) };
    }
    return target;
  }
  const [key, ...rest] = keys;
  if (Array.isArray(target)) {
    const idx = Number(key);
    const copy = [...target];
    copy[idx] = setFieldAtPath(copy[idx], rest.join('.'), updater);
    return copy;
  }
  if (target && typeof target === 'object') {
    return {
      ...(target as Record<string, unknown>),
      [key]: setFieldAtPath((target as Record<string, unknown>)[key], rest.join('.'), updater),
    };
  }
  return target;
}

function buildSectionList(config: LandingPageConfig): SectionListItem[] {
  return [
    {
      id: config.nav.id,
      name: 'Nav',
      type: 'nav',
      bg: config.nav.style,
      index: 0,
      isNav: true,
      isFooter: false,
    },
    ...(config.sections as LandingContentSection[]).map((s, index) => ({
      id: s.id,
      name: sectionName(s),
      type: s.type,
      bg: String(s.settings.backgroundColor),
      index: index + 1,
      isNav: false,
      isFooter: s.type === 'footer',
    })),
  ];
}

function sectionName(section: LandingSection): string {
  switch (section.type) {
    case 'hero':
      return getText(section.headline) || 'Hero';
    case 'story':
      return getText(section.headline) || getText(section.eyebrow) || 'Story';
    case 'tools':
      return getText(section.headline) || getText(section.eyebrow) || 'Tools';
    case 'gallery':
      return getText(section.headline) || getText(section.eyebrow) || 'Gallery';
    case 'trust':
      return getText(section.headline) || getText(section.eyebrow) || 'Trust';
    case 'commerce':
      return getText(section.headline) || getText(section.eyebrow) || 'Commerce';
    case 'footer':
      return getText(section.brandText) || 'Footer';
    default:
      return 'Section';
  }
}

function sectionLabel(section: LandingSection): string {
  switch (section.type) {
    case 'hero':
      return getText(section.eyebrow) || 'Hero';
    case 'story':
      return getText(section.eyebrow) || 'Story';
    case 'tools':
      return getText(section.eyebrow) || 'Tools';
    case 'gallery':
      return getText(section.eyebrow) || 'Gallery';
    case 'trust':
      return getText(section.eyebrow) || 'Trust';
    case 'commerce':
      return getText(section.eyebrow) || 'Commerce';
    case 'footer':
      return 'Footer';
    default:
      return 'Section';
  }
}

function gradientName(value: string): string {
  if (value === 'gradient-warm') return 'warm';
  if (value === 'gradient-dark') return 'editorial';
  if (value.startsWith('gradient-')) return value.slice(9);
  return 'warm';
}

function parseImageUrl(src: string): string {
  const match = src.match(/url\(['"]?([^'"]+)['"]?\)/);
  return match ? match[1] : src;
}
