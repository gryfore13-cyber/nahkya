import { useEffect, useState } from 'react';
import { LayoutTemplate, Save, Globe, Monitor, Code2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LandingBlueprint } from '@/components/admin/landing/LandingBlueprint';
import { LandingRibbon } from '@/components/admin/landing/LandingRibbon';
import { LandingCanvas } from '@/components/admin/landing/sections/LandingCanvas';
import { useLandingPageStore } from '@/stores/landingPageStore';

type StudioMode = 'editor' | 'preview';

const AUTOSAVE_DELAY_MS = 1500;

export function LandingStudio() {
  const [mode, setMode] = useState<StudioMode>('editor');
  const {
    config,
    selectedId,
    selectSection,
    previewMode,
    motion,
    motionKey,
    isLoaded,
    isSaving,
    saveError,
    hasDraftChanges,
    saveConfig,
    publishConfig,
    clearSaveError,
  } = useLandingPageStore();
  const isPreview = mode === 'preview';

  useEffect(() => {
    if (!hasDraftChanges || isSaving) return;
    const timer = setTimeout(() => {
      saveConfig().catch(() => {});
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [hasDraftChanges, isSaving, saveConfig]);

  useEffect(() => {
    if (!saveError) return;
    toast.error(saveError);
    clearSaveError();
  }, [saveError, clearSaveError]);

  const handleSave = async () => {
    await saveConfig();
    if (!useLandingPageStore.getState().saveError) {
      toast.success('Landing page saved');
    }
  };

  const handlePublish = async () => {
    await publishConfig();
    if (!useLandingPageStore.getState().saveError) {
      toast.success('Landing page published');
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col h-screen bg-nahkya-bg items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-nahkya-highlight mx-auto mb-4" />
          <p className="font-mono text-mono-sm uppercase tracking-widest-alt text-nahkya-text-secondary">
            Loading front page…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-nahkya-bg overflow-hidden">
      <AdminTopBar
        icon={<LayoutTemplate className="w-5 h-5" />}
        label="Front Page"
        hint="Landing page studio"
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex items-center bg-nahkya-bg border border-nahkya-border rounded-nahkya-pill p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setMode('editor')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-nahkya-pill text-body-xs font-medium transition-colors',
                  mode === 'editor'
                    ? 'bg-nahkya-surface-raised text-nahkya-text shadow-sm'
                    : 'text-nahkya-text-secondary hover:text-nahkya-text',
                )}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('preview')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-nahkya-pill text-body-xs font-medium transition-colors',
                  mode === 'preview'
                    ? 'bg-nahkya-surface-raised text-nahkya-text shadow-sm'
                    : 'text-nahkya-text-secondary hover:text-nahkya-text',
                )}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving}
              className="h-button border-nahkya-border text-nahkya-text bg-nahkya-surface hover:bg-nahkya-bg shrink-0"
              onClick={handleSave}
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isSaving}
              className="h-button bg-nahkya-accent hover:bg-nahkya-accent-hover text-nahkya-inverse shrink-0"
              onClick={handlePublish}
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Globe className="w-4 h-4 mr-1.5" />}
              <span className="hidden sm:inline">Publish</span>
            </Button>
          </div>
        }
      />

      {!isPreview && <LandingRibbon />}

      <div className="flex flex-1 min-h-0">
        {!isPreview && <LandingBlueprint />}
        <div className="flex-1 min-h-0 relative overflow-hidden">
          <LandingCanvas
            config={config}
            presentation="card"
            previewMode={previewMode}
            selectedId={isPreview ? null : selectedId}
            onSelectSection={isPreview ? undefined : selectSection}
            motion={motion}
            motionKey={motionKey}
          />
        </div>
      </div>
    </div>
  );
}
