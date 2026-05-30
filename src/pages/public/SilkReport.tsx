import { useState, useEffect } from 'react';
import { useArticleStore } from '@/stores/articleStore';

const CATEGORIES = ['All', 'The Silk Report', 'CRAFT', 'DESIGN', 'OPINION'];

export default function SilkReport() {
  const { articles, fetchArticles } = useArticleStore();
  const [active, setActive] = useState('All');

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filtered = active === 'All'
    ? articles.filter((a) => a.column === 'silk-report')
    : articles.filter((a) => a.column === 'silk-report' && a.category === active);

  return (
    <div className="min-h-screen bg-nahkya-ivory">
      <div className="bg-nahkya-charcoal py-24 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-mono-sm text-nahkya-gold tracking-hero-wide uppercase mb-6">Editorial</p>
          <h1 className="font-display text-display-lg text-nahkya-ivory font-medium mb-4">The Silk Report</h1>
          <p className="text-body-lg text-nahkya-text-muted font-body max-w-xl mx-auto">
            Deep dives into silk, craft, and the science of beautiful fabric.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setActive(c)}
              className={`px-4 py-2 font-mono text-mono-sm font-medium uppercase tracking-label rounded-nahkya transition-colors ${
                active === c ? 'bg-nahkya-burgundy text-nahkya-text-inverse' : 'bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text-muted hover:border-nahkya-burgundy'
              }`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((a) => (
            <div key={a.id} className="group">
              <div className="aspect-4/3 bg-nahkya-stone rounded-nahkya overflow-hidden mb-4">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-widest mb-2">{a.category}</p>
              <h3 className="font-display text-heading-sm text-nahkya-text font-medium mb-2">{a.title}</h3>
              <p className="text-body-md text-nahkya-text-muted font-body line-clamp-2">{a.excerpt}</p>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-nahkya-text-muted font-body">No articles yet.</div>
        )}
      </div>
    </div>
  );
}
