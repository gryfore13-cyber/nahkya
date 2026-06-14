import { cn } from '@/lib/utils';
import { InlineEditable } from '@/components/admin/landing/InlineEditable';
import { useEditableText } from '@/components/admin/landing/useEditableText';
import type { LandingFooterSection, LandingTextField } from '@/types/landingPage';
import { sectionWrapperClasses } from '@/components/admin/landing/sections/sectionStyles';

interface FooterSectionProps {
  section: LandingFooterSection;
  editable?: boolean;
}

export function FooterSection({ section, editable }: FooterSectionProps) {
  const { variant, brandText, columns, links, copyright } = section;
  const text = useEditableText(section.id, editable);

  if (variant === 'simple') {
    return (
      <footer
        id={section.id}
        className={cn(
          sectionWrapperClasses(section.settings),
          'min-h-footer-simple bg-nahkya-text text-nahkya-inverse-80 flex justify-center items-center py-footer-simple-y px-10',
        )}
      >
        <InlineEditable value={brandText} tag="p" className="text-body-sm" {...text('brandText')} />
      </footer>
    );
  }

  if (variant === 'full') {
    return (
      <footer
        id={section.id}
        className={cn(
          sectionWrapperClasses(section.settings),
          'bg-nahkya-text text-nahkya-inverse-80 py-footer-full-y px-10',
        )}
      >
        <div className="mx-auto w-full max-w-landing-desktop">
          <div className="grid grid-cols-1 @landing-md:grid-cols-4 gap-8">
            <div>
              <InlineEditable
                value={brandText}
                tag="h4"
                className="font-display text-heading-sm text-nahkya-inverse mb-4"
                {...text('brandText')}
              />
              <p className="text-body-sm text-nahkya-inverse-80 leading-normal">A luxury digital scarf atelier.</p>
            </div>
            {(columns ?? []).map((column, index) => (
              <div key={`${getTextKey(column.title)}-${index}`}>
                <InlineEditable
                  value={column.title}
                  tag="h4"
                  className="font-display text-heading-sm text-nahkya-inverse mb-4"
                  {...text(`columns.${index}.title`)}
                />
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={`${getTextKey(link)}-${linkIndex}`} className="text-body-xs text-nahkya-inverse-80">
                      <InlineEditable value={link} tag="span" {...text(`columns.${index}.links.${linkIndex}`)} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-5 border-t border-nahkya-inverse/10 flex flex-col @landing-md:flex-row justify-between items-center gap-2 text-body-xs text-nahkya-inverse-80">
            <InlineEditable value={copyright} tag="span" {...text('copyright')} />
            <span>Brunei · Worldwide</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      id={section.id}
      className={cn(
        sectionWrapperClasses(section.settings),
        'min-h-footer bg-nahkya-text text-nahkya-inverse/70',
        'flex flex-wrap justify-between items-center gap-4',
        'py-7 px-10',
      )}
    >
      <InlineEditable
        value={brandText}
        tag="span"
        className="text-body-sm font-display"
        {...text('brandText')}
      />
      <span className="text-body-xs text-nahkya-inverse/70">
        {(links ?? []).map((link, index) => (
          <InlineEditable
            key={`${getTextKey(link)}-${index}`}
            value={link}
            tag="span"
            {...text(`links.${index}`)}
          />
        ))}
      </span>
      <InlineEditable value={copyright} tag="span" className="text-body-xs text-nahkya-inverse/70" {...text('copyright')} />
    </footer>
  );
}

function getTextKey(field: LandingTextField): string {
  return typeof field === 'string' ? field : field.text ?? '';
}
