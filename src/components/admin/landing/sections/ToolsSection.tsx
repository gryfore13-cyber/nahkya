import { cn } from '@/lib/utils';
import { InlineEditable } from '@/components/admin/landing/InlineEditable';
import type { LandingToolsSection } from '@/types/landingPage';
import {
  containerClasses,
  eyebrowClasses,
  landingCardClasses,
  sectionWrapperClasses,
} from '@/components/admin/landing/sections/sectionStyles';
import { useLandingPageStore } from '@/stores/landingPageStore';

interface ToolsSectionProps {
  section: LandingToolsSection;
  editable?: boolean;
}

export function ToolsSection({ section, editable }: ToolsSectionProps) {
  const { variant, eyebrow, headline, items } = section;
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

  if (variant === 'process') {
    return (
      <section id={section.id} className={sectionWrapperClasses(section.settings)}>
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
          <InlineEditable
            value={headline}
            tag="h2"
            className="font-display text-landing-section mb-7"
            editable={editable}
            onChange={handleTextChange('headline')}
            onSelect={handleSelect('headline')}
          />
          <div className="grid grid-cols-1 @landing-md:grid-cols-4 gap-4 mt-7">
            {items.map((item, index) => (
              <article
                key={`${getItemKey(item, index)}`}
                className={cn(
                  'bg-nahkya-surface-raised/60 border border-nahkya-border rounded-landing p-5 text-center text-nahkya-text',
                )}
              >
                <div className="w-8 h-8 mx-auto mb-3.5 rounded-full bg-nahkya-accent text-nahkya-inverse grid place-items-center text-sm font-bold">
                  {index + 1}
                </div>
                <InlineEditable
                  value={item.title}
                  tag="h3"
                  className="font-display text-lg mb-2"
                  editable={editable}
                  onChange={handleTextChange(`items.${index}.title`)}
                  onSelect={handleSelect(`items.${index}.title`)}
                />
                <InlineEditable
                  value={item.description}
                  tag="p"
                  className="text-body-xs text-nahkya-text-secondary leading-normal"
                  editable={editable}
                  onChange={handleTextChange(`items.${index}.description`)}
                  onSelect={handleSelect(`items.${index}.description`)}
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'grid') {
    return (
      <section id={section.id} className={sectionWrapperClasses(section.settings)}>
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
          <InlineEditable
            value={headline}
            tag="h2"
            className="font-display text-landing-section mb-7"
            editable={editable}
            onChange={handleTextChange('headline')}
            onSelect={handleSelect('headline')}
          />
          <div className="grid grid-cols-1 @landing-md:grid-cols-2 gap-4 mt-7">
            {items.map((item, index) => (
              <article key={`${getItemKey(item, index)}`} className={cn(landingCardClasses())}>
                <InlineEditable
                  value={item.title}
                  tag="h3"
                  className="font-display text-landing-card-title mb-2"
                  editable={editable}
                  onChange={handleTextChange(`items.${index}.title`)}
                  onSelect={handleSelect(`items.${index}.title`)}
                />
                <InlineEditable
                  value={item.description}
                  tag="p"
                  className="text-landing-card-body text-nahkya-text-secondary"
                  editable={editable}
                  onChange={handleTextChange(`items.${index}.description`)}
                  onSelect={handleSelect(`items.${index}.description`)}
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.id} className={sectionWrapperClasses(section.settings)}>
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
        <InlineEditable
          value={headline}
          tag="h2"
          className="font-display text-landing-section mb-7"
          editable={editable}
          onChange={handleTextChange('headline')}
          onSelect={handleSelect('headline')}
        />
        <div className="grid grid-cols-1 @landing-md:grid-cols-3 gap-4 mt-7">
          {items.map((item, index) => (
            <article key={`${getItemKey(item, index)}`} className={cn(landingCardClasses())}>
              <InlineEditable
                value={item.title}
                tag="h3"
                className="font-display text-landing-card-title mb-2"
                editable={editable}
                onChange={handleTextChange(`items.${index}.title`)}
                onSelect={handleSelect(`items.${index}.title`)}
              />
              <InlineEditable
                value={item.description}
                tag="p"
                className="text-landing-card-body text-nahkya-text-secondary"
                editable={editable}
                onChange={handleTextChange(`items.${index}.description`)}
                onSelect={handleSelect(`items.${index}.description`)}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function getItemKey(item: { title: unknown; description: unknown }, index: number): string {
  const title = typeof item.title === 'string' ? item.title : (item.title as { text?: string })?.text ?? '';
  return `${title}-${index}`;
}
