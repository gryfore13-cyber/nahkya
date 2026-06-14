import { InlineEditable } from '@/components/admin/landing/InlineEditable';
import type { LandingStorySection } from '@/types/landingPage';
import {
  containerClasses,
  eyebrowClasses,
  sectionWrapperClasses,
} from '@/components/admin/landing/sections/sectionStyles';
import { useLandingPageStore } from '@/stores/landingPageStore';

interface StorySectionProps {
  section: LandingStorySection;
  editable?: boolean;
}

export function StorySection({ section, editable }: StorySectionProps) {
  const { variant, eyebrow, headline, quote, body } = section;
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

  if (variant === 'founder') {
    return (
      <section id={section.id} className={sectionWrapperClasses(section.settings)}>
        <div className={containerClasses}>
          <div className="max-w-landing-story mx-auto text-left">
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
            {quote && (
              <InlineEditable
                value={quote}
                tag="blockquote"
                className="font-display text-landing-quote mb-5 leading-snug"
                editable={editable}
                onChange={handleTextChange('quote')}
                onSelect={handleSelect('quote')}
              />
            )}
            <InlineEditable
              value={body}
              tag="p"
              className="text-body-lg text-nahkya-text-secondary leading-relaxed"
              editable={editable}
              onChange={handleTextChange('body')}
              onSelect={handleSelect('body')}
            />
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'campaign') {
    return (
      <section id={section.id} className={sectionWrapperClasses(section.settings)}>
        <div className={containerClasses}>
          <div className="max-w-landing-campaign mx-auto">
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
            {quote && (
              <InlineEditable
                value={quote}
                tag="p"
                className="font-display text-landing-campaign-quote mb-5 leading-snug"
                editable={editable}
                onChange={handleTextChange('quote')}
                onSelect={handleSelect('quote')}
              />
            )}
            {headline && (
              <InlineEditable
                value={headline}
                tag="h2"
                className="font-display text-landing-section mb-4"
                editable={editable}
                onChange={handleTextChange('headline')}
                onSelect={handleSelect('headline')}
              />
            )}
            <InlineEditable
              value={body}
              tag="p"
              className="text-body-lg text-nahkya-text-secondary leading-relaxed"
              editable={editable}
              onChange={handleTextChange('body')}
              onSelect={handleSelect('body')}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.id} className={sectionWrapperClasses(section.settings)}>
      <div className={containerClasses}>
        <div className="max-w-landing-story mx-auto">
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
          {headline && (
            <InlineEditable
              value={headline}
              tag="h2"
              className="font-display text-landing-section mb-5"
              editable={editable}
              onChange={handleTextChange('headline')}
              onSelect={handleSelect('headline')}
            />
          )}
          <InlineEditable
            value={body}
            tag="p"
            className="text-body-lg text-nahkya-text-secondary leading-relaxed"
            editable={editable}
            onChange={handleTextChange('body')}
            onSelect={handleSelect('body')}
          />
        </div>
      </div>
    </section>
  );
}
