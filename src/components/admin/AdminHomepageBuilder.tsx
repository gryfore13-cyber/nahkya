import { useState, useCallback, useMemo } from 'react';
import { Monitor, Tablet, Smartphone, Save, Eye, EyeOff, RotateCcw, Globe, FileCheck } from 'lucide-react';
import { useHomeContentStore } from '@/stores/homeContentStore';
import { cn } from '@/lib/utils';
import type { HomepageSection, TemplateType } from '@/types/homepage';
import { FormatToolbar } from './FormatToolbar';
import { SectionListSidebar } from './SectionListSidebar';
import { SectionSettingsPanel } from './SectionSettingsPanel';
import { HomepagePreview, type DeviceType } from './HomepagePreview';

const DEVICE_OPTIONS: { key: DeviceType; icon: React.ReactNode; label: string }[] = [
  { key: 'desktop', icon: <Monitor size={15} />, label: 'Desktop' },
  { key: 'tablet', icon: <Tablet size={15} />, label: 'Tablet' },
  { key: 'mobile', icon: <Smartphone size={15} />, label: 'Mobile' },
];

export function AdminHomepageBuilder() {
  const config = useHomeContentStore((s) => s.config);
  const isSaving = useHomeContentStore((s) => s.isSaving);
  const saveError = useHomeContentStore((s) => s.saveError);
  const isLoaded = useHomeContentStore((s) => s.isLoaded);
  const hasDraftChanges = useHomeContentStore((s) => s.hasDraftChanges);

  const addSection = useHomeContentStore((s) => s.addSection);
  const removeSection = useHomeContentStore((s) => s.removeSection);
  const duplicateSection = useHomeContentStore((s) => s.duplicateSection);
  const reorderSections = useHomeContentStore((s) => s.reorderSections);
  const updateSectionContent = useHomeContentStore((s) => s.updateSectionContent);
  const updateSectionSettings = useHomeContentStore((s) => s.updateSectionSettings);
  const updateSectionAnimation = useHomeContentStore((s) => s.updateSectionAnimation);
  const updateSectionResponsive = useHomeContentStore((s) => s.updateSectionResponsive);
  const updateSectionStatus = useHomeContentStore((s) => s.updateSectionStatus);
  const updateSectionName = useHomeContentStore((s) => s.updateSectionName);
  const toggleVisibility = useHomeContentStore((s) => s.toggleVisibility);
  const saveConfig = useHomeContentStore((s) => s.saveConfig);
  const publishAll = useHomeContentStore((s) => s.publishAll);
  const resetConfig = useHomeContentStore((s) => s.resetConfig);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [activeField, setActiveField] = useState<{ sectionId: string; path: string } | null>(null);

  const sections = useMemo(() => {
    return (config?.sections ?? []).filter((s) => s != null).sort((a, b) => a.order - b.order);
  }, [config]);

  const selectedSection = useMemo(() => {
    return sections.find((s) => s.id === selectedId) ?? null;
  }, [sections, selectedId]);

  const handleAddSection = useCallback((templateType: TemplateType) => {
    addSection(templateType);
    // Select the newly added section (it will be the last one)
    setTimeout(() => {
      const current = useHomeContentStore.getState().config.sections;
      const last = [...current].sort((a, b) => a.order - b.order).at(-1);
      if (last) setSelectedId(last.id);
    }, 50);
  }, [addSection]);

  const handleSave = useCallback(async () => {
    await saveConfig();
  }, [saveConfig]);

  const handlePublishAll = useCallback(async () => {
    await publishAll();
  }, [publishAll]);

  const handleReset = useCallback(async () => {
    if (!confirm('Reset homepage to factory defaults? All current sections will be replaced.')) return;
    resetConfig();
    await saveConfig();
    setSelectedId(null);
  }, [resetConfig, saveConfig]);

  const updateField = useCallback((sectionId: string, path: string, html: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const keys = path.split('.');
    if (keys.length === 1) {
      updateSectionContent(sectionId, { [path]: html } as Partial<HomepageSection['content']>);
      return;
    }
    const newContent = typeof structuredClone === 'function'
      ? structuredClone(section.content)
      : JSON.parse(JSON.stringify(section.content));
    let current: unknown = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      const next = (current as Record<string, unknown>)[keys[i]];
      if (next === null || next === undefined || typeof next !== 'object') {
        (current as Record<string, unknown>)[keys[i]] = {};
      }
      current = (current as Record<string, unknown>)[keys[i]];
    }
    (current as Record<string, unknown>)[keys[keys.length - 1]] = html;
    updateSectionContent(sectionId, newContent as Partial<HomepageSection['content']>);
  }, [sections, updateSectionContent]);

  const isEditing = !isPreview;

  const builderEditValue = useMemo(() => ({
    isEditing,
    activeField,
    setActiveField,
    updateField,
    updateSectionContent,
    updateSectionSettings,
  }), [isEditing, activeField, setActiveField, updateField, updateSectionContent, updateSectionSettings]);

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center bg-nahkya-bg">
        <div className="font-body text-nahkya-text-secondary">Loading…</div>
      </div>
    );
  }

  const publishedCount = sections.filter((s) => (s.status ?? 'published') === 'published').length;
  const draftCount = sections.filter((s) => (s.status ?? 'published') === 'draft').length;
  const hiddenCount = sections.filter((s) => (s.status ?? 'published') === 'hidden').length;

  return (
    <div className="fixed top-14 bottom-0 left-0 right-0 lg:top-0 lg:left-[80px] lg:right-0 flex flex-col bg-nahkya-bg overflow-hidden z-10">
      {/* Top Toolbar */}
      <div className="shrink-0 h-toolbar border-b border-nahkya-border bg-nahkya-surface flex items-center justify-between px-5 z-20">
        {/* Left: Stats */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">
            {sections.length} section{sections.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            {publishedCount > 0 && (
              <span className="flex items-center gap-1 font-mono text-mono-sm text-nahkya-success">
                <Globe size={12} />
                {publishedCount}
              </span>
            )}
            {draftCount > 0 && (
              <span className="flex items-center gap-1 font-mono text-mono-sm text-nahkya-highlight">
                <FileCheck size={12} />
                {draftCount}
              </span>
            )}
            {hiddenCount > 0 && (
              <span className="flex items-center gap-1 font-mono text-mono-sm text-nahkya-text-secondary">
                <EyeOff size={12} />
                {hiddenCount}
              </span>
            )}
          </div>
        </div>

        {/* Center: Device Toggle + Save Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-nahkya-bg rounded-nahkya border border-nahkya-border p-0.5">
            {DEVICE_OPTIONS.map(({ key, icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setDevice(key)}
                title={label}
                aria-label={label}
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-sm transition-colors',
                  device === key
                    ? 'bg-nahkya-surface-raised text-nahkya-text shadow-sm'
                    : 'text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-surface'
                )}
              >
                {icon}
              </button>
            ))}
          </div>

          {isSaving && (
            <span className="font-mono text-mono-sm text-nahkya-highlight animate-pulse">Saving…</span>
          )}
          {!isSaving && !saveError && hasDraftChanges && (
            <span className="font-mono text-mono-sm text-nahkya-highlight">Unsaved changes</span>
          )}
          {!isSaving && !saveError && !hasDraftChanges && (
            <span className="font-mono text-mono-sm text-nahkya-success">Saved</span>
          )}
          {saveError && (
            <span className="font-mono text-mono-sm text-nahkya-error">Save failed</span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreview((v) => !v)}
            className={cn(
              'h-button px-3 flex items-center gap-1.5 rounded-nahkya font-body text-body-sm transition-colors',
              isPreview
                ? 'bg-nahkya-highlight/10 text-nahkya-highlight'
                : 'text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-bg'
            )}
          >
            {isPreview ? <Eye size={15} /> : <EyeOff size={15} />}
            {isPreview ? 'Preview' : 'Edit'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="h-button px-3 flex items-center gap-1.5 rounded-nahkya font-body text-body-sm text-nahkya-text-secondary hover:text-nahkya-error transition-colors disabled:opacity-50"
            title="Reset to factory defaults"
          >
            <RotateCcw size={15} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-button px-4 flex items-center gap-1.5 rounded-nahkya bg-nahkya-highlight hover:bg-nahkya-highlight text-nahkya-text font-body text-body-sm transition-colors disabled:opacity-50"
          >
            <Save size={15} />
            Save Draft
          </button>

          <button
            type="button"
            onClick={handlePublishAll}
            disabled={isSaving}
            className="h-button px-4 flex items-center gap-1.5 rounded-nahkya bg-nahkya-accent hover:bg-nahkya-accent-hover text-nahkya-inverse font-body text-body-sm transition-colors disabled:opacity-50"
          >
            <Globe size={15} />
            Publish All
          </button>
        </div>
      </div>

      {/* Format Toolbar (edit mode only) */}
      {isEditing && <FormatToolbar />}

      {/* 3-Panel Workspace */}
      <div className="flex-1 min-h-0 flex">
        {/* Left Sidebar */}
        <div className="shrink-0 w-[280px] hidden lg:block">
          <SectionListSidebar
            sections={sections}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onReorder={reorderSections}
            onAdd={handleAddSection}
            onDuplicate={duplicateSection}
            onRemove={removeSection}
            onToggleVisibility={toggleVisibility}
          />
        </div>

        {/* Center Preview */}
        <div className="flex-1 min-w-0">
          <HomepagePreview
            sections={sections}
            selectedId={selectedId}
            device={device}
            isPreview={isPreview}
            onSelectSection={setSelectedId}
            builderEditValue={builderEditValue}
          />
        </div>

        {/* Right Settings Panel */}
        <div className="shrink-0 w-[320px] hidden xl:block">
          <SectionSettingsPanel
            section={selectedSection}
            onUpdateSettings={updateSectionSettings}
            onUpdateAnimation={updateSectionAnimation}
            onUpdateResponsive={updateSectionResponsive}
            onUpdateStatus={updateSectionStatus}
            onUpdateName={updateSectionName}
          />
        </div>
      </div>
    </div>
  );
}
