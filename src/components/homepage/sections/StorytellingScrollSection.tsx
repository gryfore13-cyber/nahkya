import { InlineText } from '@/components/admin/InlineText';
import { InlineImage } from '@/components/admin/InlineImage';
import { InlineArrayAdd } from '@/components/admin/InlineArrayAdd';
import { InlineArrayRemove } from '@/components/admin/InlineArrayRemove';
import type { HomepageSection } from '@/types';

interface Props {
  section: HomepageSection & { templateType: 'storytellingScroll' };
}

export default function StorytellingScrollSection({ section }: Props) {
  const { content, id } = section;

  return (
    <>
      <InlineText
        tag="h2"
        value={content.headline}
        path="headline"
        sectionId={id}
        className="font-display text-display-lg lg:text-display-xl font-medium leading-tight mb-12 md:mb-16 text-center"
        placeholder="Headline"
      />

      <div className="space-y-12 md:space-y-16">
        {content.steps.map((step, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center"
          >
            <div className="md:col-span-1 flex md:justify-center">
              <span className="font-display text-display-xl text-nahkya-highlight/30 font-medium">
                {String(step.number).padStart(2, '0')}
              </span>
            </div>
            <div className="md:col-span-5">
              <InlineImage
                src={step.imageUrl}
                alt={step.title}
                aspectClass="w-full aspect-4/3"
                sectionId={id}
                path={`steps.${idx}.imageUrl`}
              />
            </div>
            <div className="md:col-span-6 relative">
              <div className="absolute top-0 right-0">
                <InlineArrayRemove sectionId={id} path="steps" index={idx} minCount={1} />
              </div>
              <InlineText
                tag="h3"
                value={step.title}
                path={`steps.${idx}.title`}
                sectionId={id}
                className="font-display text-display-sm font-medium mb-3"
                placeholder="Step Title"
              />
              <InlineText
                tag="p"
                value={step.description}
                path={`steps.${idx}.description`}
                sectionId={id}
                className="font-body text-body-lg text-nahkya-text-secondary leading-relaxed"
                placeholder="Step Description"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <InlineArrayAdd
          sectionId={id}
          path="steps"
          defaultItem={{ number: content.steps.length + 1, title: 'New Step', description: 'Describe this step.' }}
          label="Add Step"
        />
      </div>
    </>
  );
}
