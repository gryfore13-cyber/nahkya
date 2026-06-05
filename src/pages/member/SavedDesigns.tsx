import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trash2, ExternalLink } from 'lucide-react';
import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const TOOL_LABELS: Record<string, string> = {
  atelier: 'Atelier',
  monogram: 'Monogram',
  petak: 'Petak',
};

const TOOL_ROUTES: Record<string, string> = {
  atelier: '/member/atelier',
  monogram: '/member/monogram',
  petak: '/member/petak',
};

export default function SavedDesigns() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { designs, fetchDesignsByUser, deleteDesign } = useSavedDesignStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user?.uid) {
      fetchDesignsByUser(user.uid);
    }
  }, [fetchDesignsByUser, user?.uid]);

  const filtered = designs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Saved Designs</h1>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">Your atelier creations.</p>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-content">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-muted" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search designs..."
            className="pl-10 pr-4 py-2 bg-workspace-panel border border-workspace-border text-nahkya-text text-body-sm rounded-nahkya focus:outline-none focus:border-nahkya-gold w-full font-body placeholder:text-nahkya-text-muted/40"
          />
        </div>
        <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">{filtered.length} designs</p>
      </div>

      <div className="flex flex-wrap gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="group bg-workspace-panel border border-workspace-border rounded-nahkya w-44 hover:border-nahkya-gold/30 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-t-nahkya bg-workspace-bg">
              {d.thumbnail ? (
                <img
                  src={d.thumbnail}
                  alt={d.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-workspace-hover" />
              )}
              <div className="absolute top-2 left-2">
                <span className={cn(
                  'font-mono text-mono-sm uppercase tracking-widest px-2 py-0.5 rounded-nahkya',
                  d.tool === 'monogram' && 'bg-nahkya-burgundy/80 text-white',
                  d.tool === 'atelier' && 'bg-nahkya-gold/80 text-nahkya-text',
                  d.tool === 'petak' && 'bg-nahkya-charcoal/80 text-white'
                )}>
                  {TOOL_LABELS[d.tool] ?? d.tool}
                </span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-body-sm text-nahkya-text font-body truncate">{d.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="font-mono text-body-3xs text-nahkya-text-muted uppercase tracking-label">{d.createdAt}</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`${TOOL_ROUTES[d.tool] ?? '/member/saved'}?designId=${d.id}`)}
                    className="p-1 text-nahkya-text-muted hover:text-nahkya-gold opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Open design"
                  >
                    <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => deleteDesign(d.id)}
                    className="p-1 text-nahkya-text-muted hover:text-nahkya-error opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete design"
                  >
                    <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="w-full text-center py-12 text-nahkya-text-muted font-body">
            No saved designs yet. Start creating in the Atelier, Monogram, or Petak studio.
          </div>
        )}
      </div>
    </div>
  );
}
