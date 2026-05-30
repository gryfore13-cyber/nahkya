import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useArticleStore } from '@/stores/articleStore';

const COLUMNS = ['by-nahkya', 'silk-report', 'herstory', 'silk-wire'] as const;

export default function AdminContent() {
  const { articles, fetchArticles, addArticle, deleteArticle } = useArticleStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    category: 'BY NAHKYA',
    column: 'by-nahkya' as typeof COLUMNS[number],
    author: '',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
    image: '',
    readTime: '5 min read',
    featured: false,
  });

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.author.trim()) return;
    await addArticle(form);
    setModalOpen(false);
    setForm({
      title: '',
      excerpt: '',
      category: 'BY NAHKYA',
      column: 'by-nahkya',
      author: '',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
      image: '',
      readTime: '5 min read',
      featured: false,
    });
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-display-sm text-nahkya-text font-medium">Content</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-nahkya-gold text-nahkya-text text-body-sm font-body font-medium rounded-nahkya hover:bg-nahkya-gold-soft transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          New Article
        </button>
      </div>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">Manage editorial articles and journal entries.</p>

      <div className="flex items-center gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="px-4 py-2 bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text text-body-sm rounded-nahkya focus:outline-none focus:border-nahkya-gold w-sidebar-admin font-body"
        />
        <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">{filtered.length} articles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((a) => (
          <div key={a.id} className="group bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya overflow-hidden hover:border-nahkya-gold/30 transition-all">
            <div className="aspect-4/3 bg-nahkya-stone overflow-hidden">
              <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-label">{a.category}</p>
                {a.featured && <span className="font-mono text-mono-sm text-nahkya-success uppercase">Featured</span>}
              </div>
              <h3 className="text-base font-body font-medium text-nahkya-text mb-1">{a.title}</h3>
              <p className="text-sm text-nahkya-text-muted font-body line-clamp-2 mb-3">{a.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-mono-sm text-nahkya-text-muted">{a.author} · {a.date}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-nahkya-text-muted hover:text-nahkya-gold"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteArticle(a.id)} className="p-1.5 text-nahkya-text-muted hover:text-nahkya-error"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div
          onClick={() => setModalOpen(true)}
          className="border-2 border-dashed border-nahkya-gold-soft rounded-nahkya flex flex-col items-center justify-center aspect-4/3 cursor-pointer hover:border-nahkya-gold/40 transition-colors"
        >
          <Plus className="w-8 h-8 text-nahkya-text-muted mb-3" strokeWidth={1.5} />
          <p className="text-sm text-nahkya-text-muted font-body">New Article</p>
        </div>
      </div>

      {/* New Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center">
          <div className="absolute inset-0 bg-nahkya-charcoal/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-nahkya-ivory border border-nahkya-gold-soft rounded-nahkya max-w-content max-h-90vh overflow-y-auto p-8">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-nahkya-text-muted hover:text-nahkya-text">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-xl text-nahkya-text font-medium mb-6">New Article</h2>
            <div className="space-y-5">
              <div>
                <label className="block font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-2">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold"
                />
              </div>
              <div>
                <label className="block font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-2">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={3}
                  className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-2">Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold"
                  />
                </div>
                <div>
                  <label className="block font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-2">Column</label>
                  <select
                    value={form.column}
                    onChange={(e) => setForm({ ...form, column: e.target.value as typeof COLUMNS[number] })}
                    className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-2">Author</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold"
                  />
                </div>
                <div>
                  <label className="block font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-2">Date</label>
                  <input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-2">Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold"
                />
              </div>
              <div>
                <label className="block font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-2">Read Time</label>
                <input
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold"
                />
              </div>
              <div>
                <label className="block font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-2">Featured</label>
                <div className="flex items-center gap-3">
                  <div
                    className={cn('w-10 h-5 rounded-full cursor-pointer transition-colors ', form.featured ? 'bg-nahkya-success' : 'bg-nahkya-stone')}
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                  >
                    <div className={cn('w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ', form.featured ? 'translate-x-6' : 'translate-x-0.5')} />
                  </div>
                  <span className="text-sm text-nahkya-text font-body">{form.featured ? 'Featured' : 'Standard'}</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-nahkya-gold-soft mt-6 flex gap-3">
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-nahkya-gold text-nahkya-text text-body-sm font-body font-medium rounded-nahkya hover:bg-nahkya-gold-soft transition-colors"
              >
                Publish Article
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2.5 border border-nahkya-gold-soft text-body-sm font-body text-nahkya-text rounded-nahkya hover:border-nahkya-charcoal transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
