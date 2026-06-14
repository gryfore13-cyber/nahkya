import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { InlineEditable } from '@/components/admin/landing/InlineEditable';
import { useEditableText } from '@/components/admin/landing/useEditableText';
import type {
  LandingBookingItem,
  LandingCommerceSection,
  LandingPricingItem,
  LandingTextField,
} from '@/types/landingPage';
import {
  containerClasses,
  eyebrowClasses,
  sectionWrapperClasses,
} from '@/components/admin/landing/sections/sectionStyles';

interface CommerceSectionProps {
  section: LandingCommerceSection;
  editable?: boolean;
}

export function CommerceSection({ section, editable }: CommerceSectionProps) {
  const { variant, eyebrow, headline, body, ctaText, items } = section;
  const text = useEditableText(section.id, editable);
  const isInverse = section.settings.textColor === 'inverse';
  const bodyColor = isInverse ? 'text-nahkya-inverse-80' : 'text-nahkya-text-secondary';

  const ctaButton = (
    <CtaLink
      href="#"
      editable={editable}
      className={cn(
        'inline-flex items-center justify-center',
        'py-3 px-7 rounded-nahkya-pill',
        'bg-nahkya-highlight text-nahkya-text text-body-sm font-bold',
        'hover:bg-nahkya-highlight-hover transition-colors',
      )}
    >
      <InlineEditable value={ctaText} tag="span" {...text('ctaText')} />
    </CtaLink>
  );

  if (variant === 'final') {
    return (
      <section id={section.id} className={sectionWrapperClasses(section.settings)}>
        <div className={containerClasses}>
          {eyebrow && (
            <InlineEditable value={eyebrow} tag="div" className={eyebrowClasses()} {...text('eyebrow')} />
          )}
          <InlineEditable
            value={headline}
            tag="h2"
            className="font-display text-landing-section mb-4"
            {...text('headline')}
          />
          {body && (
            <InlineEditable
              value={body}
              tag="p"
              className={cn('text-body-lg max-w-prose mx-auto mb-6 leading-relaxed', bodyColor)}
              {...text('body')}
            />
          )}
          {ctaText && (
            <CtaLink
              href="#"
              editable={editable}
              className={cn(
                'inline-flex items-center justify-center',
                'py-3 px-7 rounded-nahkya-pill',
                'bg-nahkya-highlight text-nahkya-text text-body-sm font-bold',
                'hover:bg-nahkya-surface transition-colors',
              )}
            >
              <InlineEditable value={ctaText} tag="span" {...text('ctaText')} />
            </CtaLink>
          )}
        </div>
      </section>
    );
  }

  if (variant === 'waitlist') {
    return (
      <section id={section.id} className={sectionWrapperClasses(section.settings)}>
        <div className={containerClasses}>
          {eyebrow && (
            <InlineEditable value={eyebrow} tag="div" className={eyebrowClasses()} {...text('eyebrow')} />
          )}
          <InlineEditable
            value={headline}
            tag="h2"
            className="font-display text-landing-section mb-4"
            {...text('headline')}
          />
          {body && (
            <InlineEditable
              value={body}
              tag="p"
              className={cn('text-body-lg max-w-prose mx-auto mb-6 leading-relaxed', bodyColor)}
              {...text('body')}
            />
          )}
          <div className="max-w-md mx-auto flex gap-2 mt-7">
            <input
              type="email"
              placeholder="Email address"
              readOnly
              className={cn(
                'flex-1 h-12 px-5 rounded-nahkya-pill border border-nahkya-border',
                'bg-nahkya-surface-raised text-nahkya-text text-body-sm',
                'focus:outline-none focus:ring-2 focus:ring-nahkya-highlight',
              )}
            />
            {ctaButton}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'booking') {
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
            {(items as LandingBookingItem[] | undefined)?.map((item, index) => (
              <article
                key={`${getTextKey(item.title)}-${index}`}
                className={cn(
                  'bg-nahkya-surface-raised border border-nahkya-border rounded-landing-card p-booking-card text-center text-nahkya-text',
                )}
              >
                <InlineEditable
                  value={item.title}
                  tag="h3"
                  className="font-display text-landing-booking-title mb-1.5"
                  {...text(`items.${index}.title`)}
                />
                <InlineEditable
                  value={item.description}
                  tag="p"
                  className="text-body-xs text-nahkya-text-secondary leading-normal"
                  {...text(`items.${index}.description`)}
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
          <InlineEditable value={eyebrow} tag="div" className={eyebrowClasses()} {...text('eyebrow')} />
        )}
        <InlineEditable
          value={headline}
          tag="h2"
          className="font-display text-landing-section mb-4"
          {...text('headline')}
        />
        {body && (
          <InlineEditable
            value={body}
            tag="p"
            className={cn('text-body-lg max-w-prose mx-auto mb-6 leading-relaxed', bodyColor)}
            {...text('body')}
          />
        )}
        <div className="grid grid-cols-1 @landing-md:grid-cols-3 gap-4 mt-7">
          {(items as LandingPricingItem[] | undefined)?.map((item, index) => (
            <article
              key={`${getTextKey(item.title)}-${index}`}
              className={cn(
                'bg-nahkya-surface-raised border border-nahkya-border rounded-landing-card p-commerce-card text-center text-nahkya-text',
              )}
            >
              <InlineEditable
                value={item.title}
                tag="h3"
                className="font-display text-landing-commerce-title mb-2"
                {...text(`items.${index}.title`)}
              />
              <div className="text-landing-price font-bold text-nahkya-accent mb-1.5">
                <InlineEditable value={item.price} tag="span" {...text(`items.${index}.price`)} />
                <small className="text-nav-link text-nahkya-text-secondary font-medium ml-1">/scarf</small>
              </div>
              <InlineEditable
                value={item.note}
                tag="p"
                className="text-body-xs text-nahkya-text-secondary leading-normal mb-4"
                {...text(`items.${index}.note`)}
              />
              <CtaLink
                href="#"
                editable={editable}
                className={cn(
                  'inline-flex items-center justify-center',
                  'py-2.5 px-6 rounded-nahkya-pill',
                  'bg-nahkya-accent text-nahkya-inverse text-xs font-bold',
                  'hover:bg-nahkya-accent-hover transition-colors',
                )}
              >
                <InlineEditable value={item.ctaText} tag="span" {...text(`items.${index}.ctaText`)} />
              </CtaLink>
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

function CtaLink({
  href,
  editable,
  className,
  children,
}: {
  href: string;
  editable?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (editable) {
    return (
      <span className={className} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
