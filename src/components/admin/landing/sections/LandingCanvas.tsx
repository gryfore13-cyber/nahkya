import { cn } from '@/lib/utils';
import type { LandingPageConfig, LandingSection } from '@/types/landingPage';
import { NavSection } from '@/components/admin/landing/sections/NavSection';
import { HeroSection } from '@/components/admin/landing/sections/HeroSection';
import { StorySection } from '@/components/admin/landing/sections/StorySection';
import { ToolsSection } from '@/components/admin/landing/sections/ToolsSection';
import { GallerySection } from '@/components/admin/landing/sections/GallerySection';
import { TrustSection } from '@/components/admin/landing/sections/TrustSection';
import { CommerceSection } from '@/components/admin/landing/sections/CommerceSection';
import { FooterSection } from '@/components/admin/landing/sections/FooterSection';

interface LandingCanvasProps {
  config: LandingPageConfig;
  className?: string;
  presentation?: 'card' | 'page';
  previewMode?: 'mobile' | 'tablet' | 'desktop';
  selectedId?: string | null;
  onSelectSection?: (id: string) => void;
  motion?: string;
  motionKey?: number;
}

const PREVIEW_WIDTH = {
  mobile: 'max-w-landing-mobile',
  tablet: 'max-w-landing-tablet',
  desktop: 'max-w-landing-desktop',
} as const;

export function LandingCanvas({
  config,
  className,
  presentation = 'page',
  previewMode = 'desktop',
  selectedId,
  onSelectSection,
  motion = 'none',
  motionKey = 0,
}: LandingCanvasProps) {
  const isCard = presentation === 'card';
  const editable = !!onSelectSection;

  return (
    <div
      className={cn(
        'w-full h-full overflow-y-auto flex justify-center items-start',
        isCard && 'bg-nahkya-bg py-6 px-4',
        className,
      )}
    >
      <div
        className={cn(
          '@container mx-auto w-full',
          isCard
            ? cn(PREVIEW_WIDTH[previewMode], 'min-h-full rounded-landing-page border border-nahkya-border shadow-card overflow-hidden bg-nahkya-surface-raised')
            : 'bg-nahkya-surface-raised',
        )}
      >
        <Selectable id={config.nav.id} selectedId={selectedId} onSelect={onSelectSection} editable={editable}>
          <NavSection section={config.nav} editable={editable} />
        </Selectable>

        {config.sections.map((section) => {
          const isSelected = selectedId === section.id;
          return (
            <Selectable
              key={section.id}
              id={section.id}
              selectedId={selectedId}
              onSelect={onSelectSection}
              editable={editable}
            >
              <MotionWrapper motion={motion} motionKey={motionKey} isSelected={isSelected}>
                <SectionRenderer section={section} editable={editable} />
              </MotionWrapper>
            </Selectable>
          );
        })}
      </div>
    </div>
  );
}

function Selectable({
  id,
  selectedId,
  onSelect,
  editable,
  children,
}: {
  id: string;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  editable: boolean;
  children: React.ReactNode;
}) {
  const isSelected = editable && selectedId === id;

  return (
    <div
      onClick={(e) => {
        if (!editable) return;
        if ((e.target as HTMLElement).closest('[data-landing-text]')) return;
        e.preventDefault();
        e.stopPropagation();
        onSelect?.(id);
      }}
      className={cn(
        'relative transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nahkya-highlight',
        editable && 'cursor-pointer',
        isSelected && 'z-10'
      )}
      role={editable ? 'button' : undefined}
      tabIndex={editable ? 0 : undefined}
      onKeyDown={
        editable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(id);
              }
            }
          : undefined
      }
    >
      {children}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none ring-2 ring-inset ring-nahkya-highlight" aria-hidden="true" />
      )}
    </div>
  );
}

function SectionRenderer({ section, editable }: { section: LandingSection; editable: boolean }) {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} editable={editable} />;
    case 'story':
      return <StorySection section={section} editable={editable} />;
    case 'tools':
      return <ToolsSection section={section} editable={editable} />;
    case 'gallery':
      return <GallerySection section={section} editable={editable} />;
    case 'trust':
      return <TrustSection section={section} editable={editable} />;
    case 'commerce':
      return <CommerceSection section={section} editable={editable} />;
    case 'footer':
      return <FooterSection section={section} editable={editable} />;
    default:
      return null;
  }
}

const MOTION_CLASS: Record<string, string> = {
  fade: 'animate-landing-fade',
  reveal: 'animate-landing-reveal',
  zoom: 'animate-landing-zoom',
};

function MotionWrapper({
  motion,
  motionKey,
  isSelected,
  children,
}: {
  motion: string;
  motionKey: number;
  isSelected: boolean;
  children: React.ReactNode;
}) {
  const motionClass = isSelected ? MOTION_CLASS[motion] : undefined;
  return (
    <div key={motionClass ? `${motion}-${motionKey}` : undefined} className={cn(motionClass)}>
      {children}
    </div>
  );
}
