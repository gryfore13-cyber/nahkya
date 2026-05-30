import { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { SectionRenderer } from '@/components/homepage/SectionRenderer';
import { SectionEditPanel } from '@/components/admin/SectionEditPanel';
import { SectionListSidebar } from '@/components/admin/SectionListSidebar';
import { useHomepageStore } from '@/stores/homepageStore';
import { cn } from '@/lib/utils';

/* ────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────── */

type DeviceKey = 'phone' | 'tablet' | 'laptop' | 'desktop';

interface DeviceDef {
  label: string;
  icon: React.ElementType;
  width: number;
}

/* ────────────────────────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────────────────────────── */

const devices: Record<DeviceKey, DeviceDef> = {
  phone: { label: 'Phone', icon: Smartphone, width: 390 },
  tablet: { label: 'Tablet', icon: Tablet, width: 768 },
  laptop: { label: 'Laptop', icon: Laptop, width: 1120 },
  desktop: { label: 'Desktop', icon: Monitor, width: 1440 },
};

/* ────────────────────────────────────────────────────────────────
   Main export
   ──────────────────────────────────────────────────────────────── */

export function PageAtelier() {
  const [device, setDevice] = useState<DeviceKey>('desktop');
  const [zoom, setZoom] = useState<number>(100);

  const sections = useHomepageStore((s) => s.sections);
  const selectedSectionId = useHomepageStore((s) => s.selectedSectionId);
  const pageConfig = useHomepageStore((s) => s.pageConfig);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const currentDevice = devices[device];

  /* ── Device switcher (top bar middle slot) ── */
  const deviceSwitcher = (
    <div className="hidden items-center gap-1 rounded-full border border-nahkya-gold-soft bg-nahkya-ivory p-1 shadow-sm md:flex">
      {Object.entries(devices).map(([key, item]) => {
        const Icon = item.icon;
        const isSelected = device === key;

        return (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={() => setDevice(key as DeviceKey)}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-body-sm transition',
              isSelected
                ? 'bg-nahkya-charcoal text-nahkya-ivory hover:bg-nahkya-charcoal'
                : 'text-nahkya-text-muted hover:bg-nahkya-surface'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            <span className="text-body-3xs opacity-60">{item.width}px</span>
          </Button>
        );
      })}
    </div>
  );

  /* ── Top bar actions ── */
  const topActions = (
    <div className="flex items-center gap-3">
      <LuxuryButton variant="secondary" size="sm">
        <Eye className="mr-2 h-4 w-4" />
        Preview
      </LuxuryButton>
      <span className="text-body-3xs text-nahkya-text-muted">
        Auto-saved
      </span>
    </div>
  );

  return (
    <div className="PageShell flex min-h-screen flex-col bg-nahkya-ivory">
      <AdminTopBar
        icon={<Monitor size={17} strokeWidth={1.5} />}
        label="Page Atelier"
        hint={pageConfig.title}
        middle={deviceSwitcher}
        actions={topActions}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Section Library */}
        <SectionListSidebar />

        {/* Canvas Preview */}
        <section className="CanvasSurface flex flex-1 flex-col overflow-auto bg-nahkya-stone">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
            <div>
              <h2 className="PanelTitle font-body text-heading-md font-semibold text-nahkya-text">
                Canvas
              </h2>
              <p className="text-body-sm text-nahkya-text-muted">
                Current preview: {currentDevice.label} / {currentDevice.width}px
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-nahkya-ivory px-4 py-2 shadow-sm">
              <span className="text-body-xs text-nahkya-text-muted">Zoom</span>
              <input
                type="range"
                min={45}
                max={100}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-28"
              />
              <span className="text-body-xs font-medium text-nahkya-text">{zoom}%</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-6 pb-6">
            <div
              className="PreviewFrame mx-auto bg-nahkya-ivory shadow-2xl transition-all"
              style={{
                width: currentDevice.width,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
            >
              <SectionRenderer editable />
            </div>
          </div>
        </section>

        {/* Inspector Panel */}
        <aside className="InspectorPanel flex w-panel-inspector flex-col border-l border-nahkya-gold-soft bg-nahkya-surface">
          {selectedSection ? (
            <SectionEditPanel section={selectedSection} />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <p className="text-body-sm text-nahkya-text-muted">
                Select a section on the canvas to edit its content
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
