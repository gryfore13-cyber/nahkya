import { useState } from 'react';
import { InlineText } from '@/components/admin/InlineText';
import { InlineArrayAdd } from '@/components/admin/InlineArrayAdd';
import { InlineArrayRemove } from '@/components/admin/InlineArrayRemove';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'leadCapture' };
}

export default function LeadCaptureSection({ section }: Props) {
  const { content, id } = section;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <div className="text-center max-w-2xl mx-auto">
        <InlineText
          tag="h2"
          value={content.headline}
          path="headline"
          sectionId={id}
          className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-4"
          placeholder="Headline"
        />
        <InlineText
          tag="p"
          value={content.subheadline}
          path="subheadline"
          sectionId={id}
          className="font-body text-body-lg text-nahkya-text-secondary mb-10"
          placeholder="Subheadline"
        />

        {content.benefits.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {content.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {benefit.icon && <span className="text-nahkya-highlight">{benefit.icon}</span>}
                <InlineText
                  tag="span"
                  value={benefit.title}
                  path={`benefits.${idx}.title`}
                  sectionId={id}
                  className="font-body text-body-sm font-medium"
                  placeholder="Benefit"
                />
                <InlineArrayRemove sectionId={id} path="benefits" index={idx} minCount={1} />
              </div>
            ))}
          </div>
        )}

        <div className="mb-4">
          <InlineArrayAdd
            sectionId={id}
            path="benefits"
            defaultItem={{ title: 'New Benefit' }}
            label="Add Benefit"
          />
        </div>

        {submitted ? (
          <InlineText
            tag="p"
            value={content.successMessage}
            path="successMessage"
            sectionId={id}
            className="font-body text-body-lg text-nahkya-success"
            placeholder="Success Message"
          />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.inputPlaceholder}
              aria-label={content.inputPlaceholder}
              required
              className="flex-1 h-11 px-4 bg-nahkya-surface border border-nahkya-border rounded-nahkya font-body text-body-md placeholder:text-nahkya-text-secondary focus:outline-none focus:ring-2 focus:ring-nahkya-highlight/50"
            />
            <button
              type="submit"
              className="h-11 px-6 bg-nahkya-highlight text-nahkya-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-border transition-colors rounded-nahkya"
            >
              <InlineText
                tag="span"
                value={content.buttonText}
                path="buttonText"
                sectionId={id}
                placeholder="Button Text"
              />
            </button>
          </form>
        )}
      </div>
    </>
  );
}
