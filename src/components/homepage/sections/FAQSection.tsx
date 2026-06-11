import { useState } from 'react';
import { InlineText } from '@/components/admin/InlineText';
import type { HomepageSection } from '@/types';
import { Plus, Minus } from 'lucide-react';

interface Props {
  section: HomepageSection & { templateType: 'faq' };
}

export default function FAQSection({ section }: Props) {
  const { content, id } = section;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="container-nahkya max-w-3xl">
      <div className="text-center mb-12 lg:mb-16">
        <InlineText
          tag="h2"
          value={content.headline}
          path="headline"
          sectionId={id}
          className="font-display text-heading-lg font-medium mb-4"
          placeholder="Headline"
        />
        <InlineText
          tag="p"
          value={content.subheadline}
          path="subheadline"
          sectionId={id}
          className="font-body text-body-lg text-nahkya-text-secondary max-w-2xl mx-auto"
          placeholder="Subheadline"
        />
      </div>

      <div className="space-y-3">
        {content.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-nahkya-border rounded-nahkya bg-nahkya-surface overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-nahkya-bg transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-body text-body-md font-medium text-nahkya-text">
                  {item.question}
                </span>
                <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-nahkya-border text-nahkya-accent">
                  {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 pt-0 font-body text-body-md text-nahkya-text-secondary leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
