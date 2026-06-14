import { cn } from '@/lib/utils';
import { InlineEditable } from '@/components/admin/landing/InlineEditable';
import type { LandingHeroSection } from '@/types/landingPage';
import {
  containerClasses,
  eyebrowClasses,
  sectionWrapperClasses,
} from '@/components/admin/landing/sections/sectionStyles';
import { useLandingPageStore } from '@/stores/landingPageStore';

interface HeroSectionProps {
  section: LandingHeroSection;
  editable?: boolean;
}

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1600&auto=format&fit=crop';

export function HeroSection({ section, editable }: HeroSectionProps) {
  const { variant, eyebrow, headline, body, ctaText, ctaTarget, imageUrl } = section;
  const updateText = useLandingPageStore((s) => s.updateSectionText);
  const setSelectedTextPath = useLandingPageStore((s) => s.setSelectedTextPath);
  const selectSection = useLandingPageStore((s) => s.selectSection);

  const handleTextChange = (path: string) => (text: string) => {
    updateText(section.id, path, text);
  };

  const handleSelect = (path: string) => () => {
    selectSection(section.id);
    setSelectedTextPath({ sectionId: section.id, path });
  };

  const ctaButton = editable ? (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'py-3 px-7 rounded-nahkya-pill',
        'bg-nahkya-highlight text-nahkya-text text-body-sm font-bold',
      )}
      aria-disabled="true"
    >
      <InlineEditable
        value={ctaText}
        tag="span"
        editable={editable}
        onChange={handleTextChange('ctaText')}
        onSelect={handleSelect('ctaText')}
      />
    </span>
  ) : (
    <a
      href={ctaTarget}
      className={cn(
        'inline-flex items-center justify-center',
        'py-3 px-7 rounded-nahkya-pill',
        'bg-nahkya-highlight text-nahkya-text text-body-sm font-bold',
        'hover:bg-nahkya-highlight-hover transition-colors',
      )}
    >
      <InlineEditable
        value={ctaText}
        tag="span"
        editable={editable}
        onChange={handleTextChange('ctaText')}
        onSelect={handleSelect('ctaText')}
      />
    </a>
  );

  if (variant === 'editorial') {
    return (
      <section
        id={section.id}
        className={cn(
          sectionWrapperClasses(section.settings),
          'min-h-landing-hero-editorial flex items-end',
        )}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(32,18,14,0.88), rgba(32,18,14,0.45)), url('${imageUrl || DEFAULT_HERO_IMAGE}')`,
          backgroundSize: 'cover',
          backgroundPosition: section.settings.backgroundPosition ?? 'center',
        }}
      >
        <div className={cn(containerClasses, 'pb-1')}>
          <div className="max-w-content-lg">
            {eyebrow && (
              <InlineEditable
                value={eyebrow}
                tag="div"
                className={eyebrowClasses()}
                editable={editable}
                onChange={handleTextChange('eyebrow')}
                onSelect={handleSelect('eyebrow')}
              />
            )}
            <InlineEditable
              value={headline}
              tag="h1"
              className="font-display text-landing-hero-editorial mb-4"
              editable={editable}
              onChange={handleTextChange('headline')}
              onSelect={handleSelect('headline')}
            />
            <InlineEditable
              value={body}
              tag="p"
              className="text-body-lg text-nahkya-inverse-80 max-w-prose mb-6 leading-relaxed"
              editable={editable}
              onChange={handleTextChange('body')}
              onSelect={handleSelect('body')}
            />
            {ctaButton}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section
        id={section.id}
        className={cn(
          sectionWrapperClasses(section.settings),
          'min-h-landing-hero-split',
        )}
      >
        <div
          className={cn(
            containerClasses,
            'grid grid-cols-1 @landing-md:grid-cols-2 gap-8 @landing-md:gap-10 items-center',
          )}
        >
          <div
            className="aspect-[4/5] w-full rounded-landing bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(135deg, #E3D8C8, rgba(200,166,106,0.2)), url('${imageUrl || DEFAULT_HERO_IMAGE}')`,
            }}
            aria-hidden="true"
          />
          <div className="text-left">
            {eyebrow && (
              <InlineEditable
                value={eyebrow}
                tag="div"
                className={eyebrowClasses()}
                editable={editable}
                onChange={handleTextChange('eyebrow')}
                onSelect={handleSelect('eyebrow')}
              />
            )}
            <InlineEditable
              value={headline}
              tag="h1"
              className="font-display text-landing-hero-split mb-4"
              editable={editable}
              onChange={handleTextChange('headline')}
              onSelect={handleSelect('headline')}
            />
            <InlineEditable
              value={body}
              tag="p"
              className="text-body-lg text-nahkya-text-secondary mb-6 leading-relaxed"
              editable={editable}
              onChange={handleTextChange('body')}
              onSelect={handleSelect('body')}
            />
            {ctaButton}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'product') {
    return (
      <section
        id={section.id}
        className={cn(
          sectionWrapperClasses(section.settings),
          'min-h-landing-hero-product flex flex-col items-center justify-center',
        )}
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(59,13,26,0.55), rgba(32,18,14,0.9)), url('${imageUrl || DEFAULT_HERO_IMAGE}')`,
          backgroundSize: 'cover',
          backgroundPosition: section.settings.backgroundPosition ?? 'center',
        }}
      >
        <div className={containerClasses}>
          {eyebrow && (
            <InlineEditable
              value={eyebrow}
              tag="div"
              className={eyebrowClasses()}
              editable={editable}
              onChange={handleTextChange('eyebrow')}
              onSelect={handleSelect('eyebrow')}
            />
          )}
          <div
            className="w-44 h-44 @landing-md:w-56 @landing-md:h-56 mx-auto mb-6 rounded-full border-2 border-nahkya-inverse/20 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(200,166,106,0.27), rgba(59,13,26,0.4)), url('${imageUrl || DEFAULT_HERO_IMAGE}')`,
            }}
            aria-hidden="true"
          />
          <InlineEditable
            value={headline}
            tag="h1"
            className="font-display text-landing-hero-product mb-4"
            editable={editable}
            onChange={handleTextChange('headline')}
            onSelect={handleSelect('headline')}
          />
          <InlineEditable
            value={body}
            tag="p"
            className="text-body-lg text-nahkya-inverse-80 max-w-prose mx-auto mb-6 leading-relaxed"
            editable={editable}
            onChange={handleTextChange('body')}
            onSelect={handleSelect('body')}
          />
          {ctaButton}
        </div>
      </section>
    );
  }

  return (
    <section
      id={section.id}
      className={cn(
        sectionWrapperClasses(section.settings),
        'min-h-landing-hero flex items-end justify-center',
        'bg-nahkya-text text-nahkya-inverse',
      )}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(32,18,14,0.82), rgba(59,13,26,0.35), rgba(0,0,0,0.05)), url('${imageUrl || DEFAULT_HERO_IMAGE}')`,
        backgroundSize: 'cover',
        backgroundPosition: section.settings.backgroundPosition ?? 'center',
      }}
    >
      <div className={cn(containerClasses, 'pb-1')}>
        {eyebrow && (
          <InlineEditable
            value={eyebrow}
            tag="div"
            className={eyebrowClasses()}
            editable={editable}
            onChange={handleTextChange('eyebrow')}
            onSelect={handleSelect('eyebrow')}
          />
        )}
        <InlineEditable
          value={headline}
          tag="h1"
          className="font-display text-landing-hero-md @landing-md:text-landing-hero-lg mb-4"
          editable={editable}
          onChange={handleTextChange('headline')}
          onSelect={handleSelect('headline')}
        />
        <InlineEditable
          value={body}
          tag="p"
          className="text-body-lg text-nahkya-inverse-80 max-w-prose mx-auto mb-6 leading-relaxed"
          editable={editable}
          onChange={handleTextChange('body')}
          onSelect={handleSelect('body')}
        />
        {ctaButton}
      </div>
    </section>
  );
}
