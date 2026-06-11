import { useEffect } from 'react';
import { useArticleStore } from '@/stores/articleStore';

export default function ByNahkya() {
  const { articles, fetchArticles } = useArticleStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const featured = articles.find((a) => a.featured && a.column === 'by-nahkya') || articles.find((a) => a.column === 'by-nahkya');
  const columnArticles = articles.filter((a) => a.column === 'by-nahkya');

  return (
    <div className="min-h-screen bg-nahkya-bg">
      {/* Hero */}
      <div className="bg-nahkya-text py-24 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-mono-sm text-nahkya-highlight tracking-hero-wide uppercase mb-6">Editorial</p>
          <h1 className="font-display text-display-lg text-nahkya-bg font-medium mb-4">By Nahkya</h1>
          <p className="text-body-lg text-nahkya-bg font-body max-w-xl mx-auto">
            Thoughts on design, culture, and the quiet power of covered beauty.
          </p>
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <div className="max-w-6xl mx-auto px-5 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="aspect-4/3 bg-nahkya-border rounded-nahkya overflow-hidden">
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-mono text-mono-sm text-nahkya-highlight uppercase tracking-widest-alt mb-3">{featured.category}</p>
              <h2 className="font-display text-display-sm text-nahkya-text font-medium mb-4">{featured.title}</h2>
              <p className="text-body-md text-nahkya-text-secondary font-body mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-nahkya-text font-body">{featured.author}</span>
                <span className="font-mono text-mono-sm text-nahkya-text-secondary uppercase">{featured.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Grid */}
      <div className="max-w-6xl mx-auto px-5 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {columnArticles.map((a) => (
            <div key={a.id} className="group">
              <div className="aspect-4/3 bg-nahkya-border rounded-nahkya overflow-hidden mb-4">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="font-mono text-mono-sm text-nahkya-highlight uppercase tracking-widest mb-2">{a.category}</p>
              <h3 className="font-display text-heading-sm text-nahkya-text font-medium mb-2">{a.title}</h3>
              <p className="text-body-md text-nahkya-text-secondary font-body line-clamp-2 mb-3">{a.excerpt}</p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-nahkya-text font-body">{a.author}</span>
                <span className="font-mono text-mono-sm text-nahkya-text-secondary">{a.date}</span>
              </div>
            </div>
          ))}
        </div>
        {columnArticles.length === 0 && (
          <div className="text-center py-16 text-nahkya-text-secondary font-body">No articles yet.</div>
        )}
      </div>
    </div>
  );
}
