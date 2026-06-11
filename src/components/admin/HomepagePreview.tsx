import { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { HomepageSection } from '@/types/homepage';
import { TEMPLATE_LABELS } from '@/types/homepage';
import { TemplateRenderer } from '@/components/homepage/TemplateRenderer';
import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import { BuilderEditContext } from './BuilderEditContext';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';



const DEVICE_CLASSES: Record<DeviceType, string> = {
  desktop: 'w-full max-w-[1280px]',
  tablet: 'w-full max-w-[768px]',
  mobile: 'w-full max-w-[375px]',
};

interface HomepagePreviewProps {
  sections: HomepageSection[];
  selectedId: string | null;
  device: DeviceType;
  isPreview: boolean;
  onSelectSection: (id: string) => void;
  builderEditValue: React.ContextType<typeof BuilderEditContext>;
}

export function HomepagePreview({
  sections,
  selectedId,
  device,
  isPreview,
  onSelectSection,
  builderEditValue,
}: HomepagePreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  // Scroll selected section into view
  useEffect(() => {
    if (!selectedId || !scrollRef.current) return;
    const el = selectedRef.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedId]);

  const handleSectionClick = useCallback((id: string) => {
    if (!isPreview) {
      onSelectSection(id);
    }
  }, [isPreview, onSelectSection]);

  return (
    <BuilderEditContext.Provider value={builderEditValue}>
      <div className="flex-1 min-h-0 bg-nahkya-bg overflow-auto p-6 lg:p-10" ref={scrollRef}>
        <div className="flex justify-center min-h-full">
          <div
            className={cn(
              'bg-nahkya-bg shadow-2xl border border-nahkya-border transition-all duration-300',
              DEVICE_CLASSES[device]
            )}
          >
            {sections.length === 0 ? (
              <EmptyPreview />
            ) : (
              <div className="divide-y divide-nahkya-border/20">
                {sections.map((section) => (
                  <PreviewSection
                    key={section.id}
                    section={section}
                    isSelected={selectedId === section.id}
                    isPreview={isPreview}
                    onClick={() => handleSectionClick(section.id)}
                    ref={selectedId === section.id ? selectedRef : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </BuilderEditContext.Provider>
  );
}

interface PreviewSectionProps {
  section: HomepageSection;
  isSelected: boolean;
  isPreview: boolean;
  onClick: () => void;
}

const PreviewSection = ({ section, isSelected, isPreview, onClick, ref }: PreviewSectionProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const isHidden = section.status === 'hidden';

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'relative transition-all duration-200',
        !isPreview && 'cursor-pointer',
        !isPreview && isSelected && 'ring-2 ring-inset ring-nahkya-highlight',
        isHidden && 'opacity-40'
      )}
    >
      {/* Section label overlay (edit mode only) */}
      {!isPreview && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-1.5 bg-nahkya-highlight/90 text-nahkya-text opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <span className="font-mono text-mono-sm">
            {section.name ?? TEMPLATE_LABELS[section.templateType]}
          </span>
          <span className="font-mono text-mono-sm uppercase">
            {section.status ?? 'published'}
          </span>
        </div>
      )}

      <SectionWrapper settings={section.settings} animation={section.animation}>
        <TemplateRenderer section={section} />
      </SectionWrapper>
    </div>
  );
};

function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-6">
      <div className="w-16 h-16 rounded-nahkya bg-nahkya-highlight/10 flex items-center justify-center text-nahkya-highlight mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <h3 className="font-display text-heading-md font-medium text-nahkya-text mb-2">
        Start Building Your Homepage
      </h3>
      <p className="font-body text-body-md text-nahkya-text-secondary max-w-md">
        Add sections from the sidebar to create a stunning homepage.
      </p>
    </div>
  );
}
