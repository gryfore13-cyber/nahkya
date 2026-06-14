import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Lock,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLandingPageStore } from '@/stores/landingPageStore';
import { sectionBackground } from '@/components/admin/landing/sections/sectionStyles';
import { getText } from '@/lib/landingText';
import type {
  LandingCommerceSection,
  LandingFooterSection,
  LandingGallerySection,
  LandingHeroSection,
  LandingNavSection,
  LandingSection,
  LandingStorySection,
  LandingToolsSection,
  LandingTrustSection,
} from '@/types/landingPage';

type LandingContentSection = Exclude<LandingSection, LandingNavSection>;

export function LandingBlueprint() {
  const store = useLandingPageStore();
  const {
    config,
    selectedId,
    lockedIds,
    selectSection,
    duplicateSection,
    deleteSection,
    moveSection,
    createSection,
  } = store;

  const sections: SectionItem[] = [
    { section: config.nav, index: 0 },
    ...(config.sections as LandingContentSection[]).map((section, index) => ({
      section,
      index: index + 1,
    })),
  ];

  const contentSections = sections.filter(
    (s) => s.section.type !== 'nav' && s.section.type !== 'footer',
  );
  const canDeleteAny = contentSections.length > 1;

  const handleSelect = (id: string) => selectSection(id);
  const handleDuplicate = (id: string) => duplicateSection(id);
  const handleDelete = (id: string) => deleteSection(id);
  const handleMove = (id: string, dir: 'up' | 'down') => moveSection(id, dir);

  return (
    <aside className="w-sidebar-admin h-full bg-nahkya-surface border-r border-nahkya-border overflow-y-auto flex flex-col shrink-0">
      <div className="px-4 py-3 border-b border-nahkya-border">
        <h2 className="font-mono text-mono-sm uppercase text-nahkya-text-secondary">
          Landing Blueprint
        </h2>
      </div>

      <div className="flex-1 p-3 space-y-3">
        {sections.map(({ section, index }) => {
          const isSelected = selectedId === section.id;
          const isLocked = lockedIds.includes(section.id);
          const isHidden = 'settings' in section && !section.settings.isVisible;
          const isNav = section.type === 'nav';
          const isFooter = section.type === 'footer';
          const canMove = !isNav && !isFooter;

          return (
            <article
              key={section.id}
              onClick={() => handleSelect(section.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(section.id);
                }
              }}
              tabIndex={0}
              className={cn(
                'group flex flex-col h-40 rounded-nahkya border overflow-hidden cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-nahkya-highlight',
                isSelected
                  ? 'bg-nahkya-highlight-subtle border-nahkya-accent'
                  : 'bg-nahkya-surface-raised border-nahkya-border hover:border-nahkya-highlight hover:bg-nahkya-bg',
                isHidden && 'opacity-60',
              )}
            >
              <div className="h-20 w-full border-b border-nahkya-border relative shrink-0">
                <SectionThumbnail section={section} />
                {(isHidden || isLocked) && (
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                    {isHidden && (
                      <span className="flex items-center gap-1 bg-nahkya-surface-raised text-nahkya-text-secondary text-mono-xs px-1.5 py-0.5 rounded-nahkya border border-nahkya-border">
                        <EyeOff className="w-3 h-3" />
                        Hidden
                      </span>
                    )}
                    {isLocked && (
                      <span className="flex items-center gap-1 bg-nahkya-surface-raised text-nahkya-text-secondary text-mono-xs px-1.5 py-0.5 rounded-nahkya border border-nahkya-border">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-0 p-2.5 flex flex-col justify-between">
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-mono-xs uppercase text-nahkya-text-secondary">
                      {sectionLabel(section)}
                    </span>
                    {isSelected && (
                      <span className="font-mono text-mono-xs uppercase bg-nahkya-accent text-nahkya-inverse px-1.5 py-0.5 rounded-nahkya">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="font-body text-body-sm font-medium text-nahkya-text truncate">
                    {sectionTitle(section)}
                  </div>
                  <div className="font-body text-body-xs text-nahkya-text-secondary truncate">
                    {sectionSubtitle(section)} · {backgroundLabel(section)}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-0.5 pt-1">
                  {canMove && (
                    <>
                      <IconButton
                        label="Move up"
                        disabled={index <= 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(section.id, 'up');
                        }}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </IconButton>
                      <IconButton
                        label="Move down"
                        disabled={index >= sections.length - 2}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(section.id, 'down');
                        }}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </IconButton>
                    </>
                  )}

                  {!isNav && (
                    <>
                      <IconButton
                        label="Duplicate"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(section.id);
                        }}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </IconButton>
                      <IconButton
                        label="Delete"
                        disabled={!canDeleteAny}
                        destructive
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(section.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </IconButton>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="p-3 border-t border-nahkya-border space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full h-button border-nahkya-border text-nahkya-text bg-nahkya-surface-raised hover:bg-nahkya-bg"
          onClick={() => createSection('story-brand')}
        >
          + Add Story
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full h-button border-nahkya-border text-nahkya-text bg-nahkya-surface-raised hover:bg-nahkya-bg"
          onClick={() => createSection('gallery-lookbook')}
        >
          + Add Gallery
        </Button>
      </div>
    </aside>
  );
}

interface SectionItem {
  section: LandingSection | LandingNavSection;
  index: number;
}

function IconButton({
  label,
  disabled,
  destructive,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  destructive?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'h-7 w-7 text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-bg',
        destructive && 'hover:text-nahkya-error hover:bg-nahkya-error-subtle',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

function sectionLabel(section: LandingSection | LandingNavSection): string {
  if (section.type === 'nav') return 'Nav';
  if (section.type === 'commerce') {
    switch (section.variant) {
      case 'pricing':
        return 'Pricing';
      case 'waitlist':
        return 'Waitlist';
      case 'booking':
        return 'Booking';
      case 'final':
        return 'CTA';
      default:
        return 'Commerce';
    }
  }
  return capitalize(section.type);
}

function sectionTitle(section: LandingSection | LandingNavSection): string {
  if (section.type === 'nav') return section.logoText || 'Nav';
  if (section.type === 'footer') return getText((section as LandingFooterSection).brandText) || 'Footer';
  if ('headline' in section && section.headline) return getText(section.headline);
  if ('eyebrow' in section && section.eyebrow) return getText(section.eyebrow);
  if ('body' in section && section.body) return getText(section.body);
  return sectionLabel(section);
}

function sectionSubtitle(section: LandingSection | LandingNavSection): string {
  if (section.type === 'nav') {
    return section.ctaText || `${section.links.length} link${section.links.length === 1 ? '' : 's'}`;
  }
  if (section.type === 'footer') {
    const footer = section as LandingFooterSection;
    return getText(footer.copyright) || 'Footer';
  }
  if ('eyebrow' in section && section.eyebrow) return getText(section.eyebrow);
  if ('body' in section && section.body) return getText(section.body);
  return backgroundLabel(section);
}

function backgroundLabel(section: LandingSection | LandingNavSection): string {
  if (section.type === 'nav') return capitalize(section.style);
  const color = section.settings.backgroundColor;
  switch (color) {
    case 'image':
      return 'Image';
    case 'gradient-warm':
    case 'gradient-dark':
      return 'Gradient';
    case 'surface':
      return 'Surface';
    case 'transparent':
      return 'Transparent';
    case '#F8F1E7':
    case 'cream':
      return 'Cream';
    case '#FFFDF8':
    case 'ivory':
      return 'Ivory';
    case '#2C2C2C':
    case 'ink':
      return 'Dark';
    case '#3B0D1A':
    case 'burgundy':
      return 'Burgundy';
    default:
      return color.startsWith('#') ? 'Solid' : capitalize(color);
  }
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function SectionThumbnail({ section }: { section: LandingSection | LandingNavSection }) {
  switch (section.type) {
    case 'nav':
      return <NavThumbnail section={section} />;
    case 'hero':
      return <HeroThumbnail section={section} />;
    case 'story':
      return <StoryThumbnail section={section} />;
    case 'tools':
      return <ToolsThumbnail section={section} />;
    case 'gallery':
      return <GalleryThumbnail section={section} />;
    case 'trust':
      return <TrustThumbnail section={section} />;
    case 'commerce':
      return <CommerceThumbnail section={section} />;
    case 'footer':
      return <FooterThumbnail section={section} />;
    default:
      return <PlaceholderThumbnail section={section} />;
  }
}

function NavThumbnail({ section }: { section: LandingNavSection }) {
  return (
    <div className="w-full h-full bg-nahkya-surface-raised flex items-center gap-2 px-2 py-1.5">
      <div className="w-6 h-6 rounded-nahkya bg-nahkya-bg border border-nahkya-border grid place-items-center shrink-0">
        <span className="font-display text-xs text-nahkya-accent font-semibold">
          {(section.logoText.charAt(0) || 'N').toUpperCase()}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0">
        <div className="h-1.5 w-6 bg-nahkya-border rounded-full" />
        <div className="h-1.5 w-6 bg-nahkya-border rounded-full" />
        <div className="h-1.5 w-6 bg-nahkya-border rounded-full hidden @landing-md:block" />
      </div>
      <div className="h-5 px-2 rounded-nahkya-pill bg-nahkya-highlight shrink-0" />
    </div>
  );
}

function HeroThumbnail({ section }: { section: LandingHeroSection }) {
  const bgClass = sectionBackground(section.settings.backgroundColor);
  return (
    <div className={cn('relative w-full h-full', bgClass)}>
      {section.imageUrl && (
        <img
          src={section.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-nahkya-text/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-2 space-y-1">
        <div className="h-2 w-3/4 bg-nahkya-inverse/40 rounded-full" />
        <div className="h-1.5 w-1/2 bg-nahkya-inverse/30 rounded-full" />
      </div>
    </div>
  );
}

function StoryThumbnail({ section }: { section: LandingStorySection }) {
  const bgClass = sectionBackground(section.settings.backgroundColor);
  return (
    <div className={cn('w-full h-full flex items-center justify-center p-3', bgClass)}>
      <div className="w-full max-w-20 space-y-1.5">
        <div className="h-1.5 w-3/4 bg-current/20 rounded-full" />
        <div className="h-1.5 w-1/2 bg-current/10 rounded-full" />
        <div className="h-1.5 w-2/3 bg-current/10 rounded-full" />
      </div>
    </div>
  );
}

function ToolsThumbnail({ section }: { section: LandingToolsSection }) {
  const bgClass = sectionBackground(section.settings.backgroundColor);
  return (
    <div className={cn('w-full h-full grid grid-cols-3 gap-1.5 p-2 content-center', bgClass)}>
      {section.items.slice(0, 3).map((_, index) => (
        <div
          key={index}
          className="aspect-square rounded-nahkya bg-nahkya-surface-raised/80 border border-nahkya-border flex flex-col items-center justify-center gap-1 p-1"
        >
          <div className="w-4 h-4 rounded-full bg-nahkya-highlight/50" />
          <div className="h-1 w-full bg-nahkya-border rounded-full" />
        </div>
      ))}
    </div>
  );
}

function GalleryThumbnail({ section }: { section: LandingGallerySection }) {
  const bgClass = sectionBackground(section.settings.backgroundColor);
  const cells = section.items.slice(0, 4).map((item, index) => (
    <div
      key={index}
      className="relative rounded-nahkya bg-nahkya-surface-raised border border-nahkya-border overflow-hidden"
    >
      {item.imageUrl ? (
        <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-nahkya-bg" />
      )}
    </div>
  ));

  if (section.variant === 'product') {
    return <div className={cn('w-full h-full grid grid-cols-4 gap-1 p-2', bgClass)}>{cells}</div>;
  }

  if (section.variant === 'editorial') {
    return (
      <div className={cn('w-full h-full grid grid-cols-2 grid-rows-2 gap-1 p-2', bgClass)}>
        <div className="row-span-2">{cells[0]}</div>
        {cells.slice(1, 3)}
      </div>
    );
  }

  return <div className={cn('w-full h-full grid grid-cols-3 gap-1 p-2', bgClass)}>{cells}</div>;
}

function TrustThumbnail({ section }: { section: LandingTrustSection }) {
  const bgClass = sectionBackground(section.settings.backgroundColor);

  if (section.variant === 'press') {
    return (
      <div className={cn('w-full h-full flex items-center justify-center gap-2 p-2', bgClass)}>
        {(section.press ?? ['Vogue', 'Bazaar', 'Elle']).slice(0, 3).map((_, index) => (
          <div
            key={index}
            className="h-6 flex-1 rounded-nahkya bg-nahkya-surface-raised border border-nahkya-border"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('w-full h-full flex items-center justify-center p-2', bgClass)}>
      <div className="w-full rounded-nahkya bg-nahkya-surface-raised border border-nahkya-border p-2 space-y-1.5">
        <div className="h-1.5 w-full bg-nahkya-border rounded-full" />
        <div className="h-1.5 w-5/6 bg-nahkya-border rounded-full" />
        <div className="h-1.5 w-2/3 bg-nahkya-border rounded-full" />
        <div className="h-1 w-1/3 bg-nahkya-highlight rounded-full" />
      </div>
    </div>
  );
}

function CommerceThumbnail({ section }: { section: LandingCommerceSection }) {
  const bgClass = sectionBackground(section.settings.backgroundColor);

  if (section.variant === 'waitlist') {
    return (
      <div className={cn('w-full h-full flex items-center justify-center p-2', bgClass)}>
        <div className="w-full flex items-center gap-1.5">
          <div className="flex-1 h-5 rounded-nahkya-pill bg-nahkya-surface-raised border border-nahkya-border" />
          <div className="h-5 w-10 rounded-nahkya-pill bg-nahkya-highlight shrink-0" />
        </div>
      </div>
    );
  }

  if (section.variant === 'final') {
    return (
      <div className={cn('w-full h-full flex flex-col items-center justify-center p-2 gap-1.5', bgClass)}>
        <div className="h-1.5 w-2/3 bg-current/20 rounded-full" />
        <div className="h-5 px-6 rounded-nahkya-pill bg-nahkya-highlight" />
      </div>
    );
  }

  const count = section.variant === 'booking' ? 3 : 3;
  return (
    <div className={cn('w-full h-full grid grid-cols-3 gap-1 p-2 content-center', bgClass)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-nahkya bg-nahkya-surface-raised border border-nahkya-border p-1.5 space-y-1"
        >
          <div className="h-1.5 w-full bg-nahkya-border rounded-full" />
          <div className="h-2 w-1/2 bg-nahkya-highlight rounded-full" />
          <div className="h-1 w-2/3 bg-nahkya-border rounded-full" />
        </div>
      ))}
    </div>
  );
}

function FooterThumbnail({ section }: { section: LandingFooterSection }) {
  const bgClass = sectionBackground(section.settings.backgroundColor);
  return (
    <div className={cn('w-full h-full flex flex-col justify-center px-3 py-2 gap-1.5', bgClass)}>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-nahkya bg-nahkya-inverse/20" />
        <div className="h-2 w-16 bg-nahkya-inverse/30 rounded-full" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-1.5 w-8 bg-nahkya-inverse/20 rounded-full" />
        <div className="h-1.5 w-8 bg-nahkya-inverse/20 rounded-full" />
        <div className="h-1.5 w-8 bg-nahkya-inverse/20 rounded-full" />
      </div>
    </div>
  );
}

function PlaceholderThumbnail({ section }: { section: LandingSection | LandingNavSection }) {
  const bgClass = 'settings' in section ? sectionBackground(section.settings.backgroundColor) : 'bg-nahkya-bg';
  return (
    <div className={cn('w-full h-full flex items-center justify-center p-2', bgClass)}>
      <div className="h-1.5 w-2/3 bg-nahkya-border rounded-full" />
    </div>
  );
}
