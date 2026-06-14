import { cn } from '@/lib/utils';
import { InlineEditable } from '@/components/admin/landing/InlineEditable';
import { useEditableText } from '@/components/admin/landing/useEditableText';
import type { LandingTrustSection, LandingTextField } from '@/types/landingPage';
import {
  containerClasses,
  eyebrowClasses,
  sectionWrapperClasses,
} from '@/components/admin/landing/sections/sectionStyles';

interface TrustSectionProps {
  section: LandingTrustSection;
  editable?: boolean;
}

export function TrustSection({ section, editable }: TrustSectionProps) {
  const { variant, eyebrow, headline, testimonials, press } = section;
  const text = useEditableText(section.id, editable);

  if (variant === 'press') {
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
          <div className="flex flex-wrap justify-center items-center gap-7 mt-7">
            {(press ?? []).map((name, index) => (
              <div
                key={`${getTextKey(name)}-${index}`}
                className={cn(
                  'h-9 px-5 rounded-nahkya-pill border border-nahkya-border',
                  'bg-nahkya-surface-raised text-nav-link font-semibold text-nahkya-text-secondary',
                  'grid place-items-center',
                )}
              >
                <InlineEditable value={name} tag="span" {...text(`press.${index}`)} />
              </div>
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
          <InlineEditable value={eyebrow} tag="div" className={eyebrowClasses()} {...text('eyebrow')} />
        )}
        <InlineEditable
          value={headline}
          tag="h2"
          className="font-display text-landing-section mb-7"
          {...text('headline')}
        />
        <div className="grid grid-cols-1 @landing-md:grid-cols-3 gap-4 mt-7">
          {(testimonials ?? []).map((item, index) => (
            <article
              key={`${getTextKey(item.author)}-${index}`}
              className={cn(
                'bg-nahkya-surface-raised/74 border border-nahkya-border rounded-landing-card p-6 text-left text-nahkya-text',
              )}
            >
              <InlineEditable
                value={item.quote}
                tag="q"
                className="block font-display text-lg mb-4 leading-snug"
                {...text(`testimonials.${index}.quote`)}
              />
              <cite className="not-italic text-body-xs font-semibold text-nahkya-text-secondary">
                —{' '}
                <InlineEditable value={item.author} tag="span" {...text(`testimonials.${index}.author`)} />
              </cite>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function getTextKey(field: LandingTextField): string {
  return typeof field === 'string' ? field : field.text ?? '';
}
