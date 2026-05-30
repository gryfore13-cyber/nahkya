import { useEffect } from 'react';
import { Monitor, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHomepageStore } from '@/stores/homepageStore';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { SectionListSidebar } from './SectionListSidebar';
import { SectionEditPanel } from './SectionEditPanel';
import { SectionRenderer } from '@/components/homepage/SectionRenderer';

export function HomepageBuilder() {
  const isLoaded = useHomepageStore((s) => s.isLoaded);
  const selectedSectionId = useHomepageStore((s) => s.selectedSectionId);
  const editMode = useHomepageStore((s) => s.editMode);
  const setEditMode = useHomepageStore((s) => s.setEditMode);
  const sections = useHomepageStore((s) => s.sections);
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  useEffect(() => {
    if (!isLoaded) {
      // Store auto-subscribes on import; just wait for hydration
    }
  }, [isLoaded]);

  return (
    <div className="min-h-screen flex flex-col bg-nahkya-ivory">
      <AdminTopBar
        icon={<Monitor size={17} strokeWidth={1.5} />}
        label="Homepage Builder"
        middle={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-nahkya text-body-sm font-body transition-colors',
                editMode
                  ? 'bg-nahkya-gold text-nahkya-text'
                  : 'bg-nahkya-stone text-nahkya-text'
              )}
            >
              {editMode ? <Eye className="w-4 h-4" strokeWidth={1.5} /> : <EyeOff className="w-4 h-4" strokeWidth={1.5} />}
              {editMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
          </div>
        }
      />
      <div className="flex-1 flex overflow-hidden">
        <SectionListSidebar />
        <div className="flex-1 overflow-auto bg-nahkya-ivory">
          <SectionRenderer editable={editMode} />
        </div>
        {selectedSection && editMode && <SectionEditPanel section={selectedSection} />}
      </div>
    </div>
  );
}
