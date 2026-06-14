import { useEffect } from 'react';
import { useArticleStore } from '@/stores/articleStore';
import { PublicPageHero } from '@/components/shared/PublicPageHero';

export default function Herstory() {
  const { articles, fetchArticles } = useArticleStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const herstoryArticles = articles.filter((a) => a.column === 'herstory');

  return (
    <div className="min-h-screen bg-nahkya-bg">
      <PublicPageHero
        eyebrow="Editorial"
        title="Herstory"
        description="Stories of women, textiles, and the threads that connect generations."
        variant="dark"
      />

      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {herstoryArticles.map((a) => (
            <div key={a.id} className="group">
              <div className="aspect-16/10 bg-nahkya-border rounded-nahkya overflow-hidden mb-5">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="font-mono text-mono-sm text-nahkya-highlight uppercase tracking-widest mb-2">
                {a.category}
              </p>
              <h2 className="font-display text-heading-md text-nahkya-text font-medium mb-3">
                {a.title}
              </h2>
              <p className="text-body-md text-nahkya-text-secondary font-body mb-4">
                {a.excerpt}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-nahkya-text font-body">{a.author}</span>
                <span className="font-mono text-mono-sm text-nahkya-text-secondary">{a.date}</span>
              </div>
            </div>
          ))}
        </div>
        {herstoryArticles.length === 0 && (
          <div className="text-center py-16 text-nahkya-text-secondary font-body">No articles yet.</div>
        )}
      </div>
    </div>
  );
}
