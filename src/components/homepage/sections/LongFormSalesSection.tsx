import { InlineText } from '@/components/admin/InlineText';
import { InlineLinkURL } from '@/components/admin/InlineLinkURL';
import { InlineArrayAdd } from '@/components/admin/InlineArrayAdd';
import { InlineArrayRemove } from '@/components/admin/InlineArrayRemove';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'longFormSales' };
}

export default function LongFormSalesSection({ section }: Props) {
  const { content, id } = section;

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <InlineText
          tag="h2"
          value={content.headline}
          path="headline"
          sectionId={id}
          className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-6 text-center"
          placeholder="Headline"
        />
        <InlineText
          tag="p"
          value={content.intro}
          path="intro"
          sectionId={id}
          className="font-body text-body-lg text-nahkya-text-secondary mb-16 text-center max-w-2xl mx-auto"
          placeholder="Introduction"
        />

        {content.features.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
              {content.features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  {feature.icon && (
                    <div className="w-10 h-10 rounded-full bg-nahkya-highlight/10 flex items-center justify-center text-nahkya-highlight flex-shrink-0">
                      <span className="text-sm">{feature.icon}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <InlineText
                        tag="h3"
                        value={feature.title}
                        path={`features.${idx}.title`}
                        sectionId={id}
                        className="font-display text-heading-md font-medium mb-1"
                        placeholder="Feature Title"
                      />
                      <InlineArrayRemove sectionId={id} path="features" index={idx} minCount={1} />
                    </div>
                    <InlineText
                      tag="p"
                      value={feature.description}
                      path={`features.${idx}.description`}
                      sectionId={id}
                      className="font-body text-body-md text-nahkya-text-secondary"
                      placeholder="Feature Description"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-16">
              <InlineArrayAdd
                sectionId={id}
                path="features"
                defaultItem={{ title: 'New Benefit', description: 'Explain the benefit.' }}
                label="Add Feature"
              />
            </div>
          </>
        )}

        {content.testimonials.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              {content.testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-nahkya-surface p-6 rounded-nahkya border border-nahkya-border relative"
                >
                  <div className="absolute top-2 right-2">
                    <InlineArrayRemove sectionId={id} path="testimonials" index={idx} minCount={1} />
                  </div>
                  <InlineText
                    tag="p"
                    value={t.quote}
                    path={`testimonials.${idx}.quote`}
                    sectionId={id}
                    className="font-body text-body-md italic text-nahkya-text mb-4"
                    placeholder="Quote"
                  />
                  <div>
                    <InlineText
                      tag="p"
                      value={t.author}
                      path={`testimonials.${idx}.author`}
                      sectionId={id}
                      className="font-body text-body-sm font-medium text-nahkya-text"
                      placeholder="Author"
                    />
                    {t.role && (
                      <InlineText
                        tag="p"
                        value={t.role}
                        path={`testimonials.${idx}.role`}
                        sectionId={id}
                        className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider"
                        placeholder="Role"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-16">
              <InlineArrayAdd
                sectionId={id}
                path="testimonials"
                defaultItem={{ quote: 'An unforgettable experience.', author: 'A. Member', role: 'Collector' }}
                label="Add Testimonial"
              />
            </div>
          </>
        )}

        <div className="text-center">
          <InlineLinkURL
            href={content.ctaLink}
            sectionId={id}
            path="ctaLink"
            className="inline-flex items-center px-10 py-4 bg-nahkya-highlight text-nahkya-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-border transition-colors rounded-nahkya"
          >
            <InlineText
              tag="span"
              value={content.ctaText}
              path="ctaText"
              sectionId={id}
              placeholder="CTA Text"
            />
          </InlineLinkURL>
        </div>
      </div>
    </>
  );
}
