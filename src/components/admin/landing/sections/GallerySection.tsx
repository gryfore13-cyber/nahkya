import { cn } from '@/lib/utils';
import { InlineEditable } from '@/components/admin/landing/InlineEditable';
import { useEditableText } from '@/components/admin/landing/useEditableText';
import type { LandingGallerySection, LandingTextField } from '@/types/landingPage';
import {
  containerClasses,
  eyebrowClasses,
  sectionWrapperClasses,
} from '@/components/admin/landing/sections/sectionStyles';

interface GallerySectionProps {
  section: LandingGallerySection;
  editable?: boolean;
}

export function GallerySection({ section, editable }: GallerySectionProps) {
  const { variant, eyebrow, headline, items } = section;
  const text = useEditableText(section.id, editable);

  const slotClasses = cn(
    'relative aspect-[4/5] rounded-landing border border-dashed border-nahkya-landing-placeholder-border',
    'bg-gradient-to-br from-nahkya-landing-placeholder-from to-nahkya-landing-placeholder-to',
    'grid place-items-center text-center p-4 overflow-hidden text-nahkya-text',
  );

  return (
    <section id={section.id} className={sectionWrapperClasses(section.settings)}>
      <div className={containerClasses}>
        {eyebrow && (
          <InlineEditable value={eyebrow} tag="div" className={eyebrowClasses()} {...text('eyebrow')} />
        )}
        <InlineEditable
          value={headline}
          tag="h2"
          className="font-display text-landing-section mb-7"
          {...text('headline')}
        />
        <div
          className={cn(
            'grid gap-3.5 mt-landing-grid-mt',
            variant === 'product'
              ? 'grid-cols-2 @landing-md:grid-cols-4'
              : variant === 'editorial'
                ? 'grid-cols-1 @landing-md:grid-cols-[1.25fr_1fr_1fr]'
                : 'grid-cols-1 @landing-md:grid-cols-3',
          )}
        >
          {items.map((item, index) => (
            <div
              key={`${getTextKey(item.label)}-${index}`}
              className={cn(slotClasses, variant === 'product' && 'aspect-square', index === 0 && variant === 'editorial' && '@landing-md:row-span-2')}
            >
              <div className="pointer-events-auto">
                <InlineEditable
                  value={item.label}
                  tag="b"
                  className="block text-nahkya-text mb-1.5 font-body text-body-md"
                  {...text(`items.${index}.label`)}
                />
                <InlineEditable
                  value={item.note}
                  tag="span"
                  className="text-body-xs text-nahkya-text-secondary leading-normal whitespace-pre-line"
                  {...text(`items.${index}.note`)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getTextKey(field: LandingTextField): string {
  return typeof field === 'string' ? field : field.text ?? '';
}
