import { useState } from 'react';
import { SectionWrapper } from '@/components/homepage/SectionWrapper';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'leadCapture' };
}

export default function LeadCaptureSection({ section }: Props) {
  const { content, settings } = section;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <SectionWrapper settings={settings}>
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-4">
          {content.headline}
        </h2>
        <p className="font-body text-body-lg text-nahkya-text-muted mb-10">
          {content.subheadline}
        </p>

        {content.benefits.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {content.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {benefit.icon && <span className="text-nahkya-gold">{benefit.icon}</span>}
                <span className="font-body text-body-sm font-medium">{benefit.title}</span>
              </div>
            ))}
          </div>
        )}

        {submitted ? (
          <p className="font-body text-body-lg text-nahkya-success">{content.successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.inputPlaceholder}
              required
              className="flex-1 h-11 px-4 bg-nahkya-surface border border-nahkya-border rounded-nahkya font-body text-body-md placeholder:text-nahkya-text-soft focus:outline-none focus:ring-2 focus:ring-nahkya-gold/50"
            />
            <button
              type="submit"
              className="h-11 px-6 bg-nahkya-gold text-nahkya-text-inverse font-body text-body-sm font-medium uppercase tracking-wide hover:bg-nahkya-gold-soft transition-colors rounded-nahkya"
            >
              {content.buttonText}
            </button>
          </form>
        )}
      </div>
    </SectionWrapper>
  );
}
