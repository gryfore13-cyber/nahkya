import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trash2, ExternalLink } from 'lucide-react';
import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { useAuthStore } from '@/stores/authStore';


const TOOL_LABELS: Record<string, string> = {
  atelier: 'Atelier',
  monogram: 'Monogram',
  petak: 'Petak',
};

function getDesignRoute(design: { tool: string; snapshot?: Record<string, unknown>; id: string }): string {
  const designId = design.id;
  const snapshot = design.snapshot;

  if (design.tool === 'monogram') {
    return `/member/monogram?designId=${designId}`;
  }

  if (design.tool === 'petak') {
    return `/member/petak?designId=${designId}`;
  }

  if (design.tool === 'atelier' && snapshot) {
    const artworkId = snapshot.artworkId as string | undefined;
    if (!artworkId) return '/member/atelier';

    if ('layerColours' in snapshot) {
      return `/member/atelier/${artworkId}?designId=${designId}`;
    }
    if ('baseColor' in snapshot) {
      return `/member/atelier/image/${artworkId}?designId=${designId}`;
    }
  }

  return '/member/atelier';
}

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
    <div className="p-5 sm:p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Saved Designs</h1>
      <p className="text-body-md text-nahkya-text-secondary font-body mb-8">Your atelier creations.</p>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-content">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-secondary" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search designs..."
            className="pl-10 pr-4 py-2 bg-nahkya-surface border border-nahkya-border text-nahkya-text text-body-sm rounded-nahkya focus:outline-none focus:border-nahkya-highlight w-full font-body placeholder:text-nahkya-text-secondary/40"
          />
        </div>
        <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase hidden sm:block">{filtered.length} designs</p>
      </div>

      {/* Responsive grid: 2 cols mobile, 3 tablet, 4 desktop, 5 large */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="group bg-nahkya-surface border border-nahkya-border rounded-nahkya hover:border-nahkya-highlight/30 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-t-nahkya bg-nahkya-bg">
              {d.thumbnail ? (
                <img src={d.thumbnail} alt={d.name} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full ${d.thumbnail}`} />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(getDesignRoute(d)); }}
                  className="w-10 h-10 rounded-full bg-nahkya-surface/90 backdrop-blur-sm flex items-center justify-center text-nahkya-text hover:text-nahkya-highlight transition-colors"
                  title="Open in editor"
                >
                  <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteDesign(d.id); }}
                  className="w-10 h-10 rounded-full bg-nahkya-surface/90 backdrop-blur-sm flex items-center justify-center text-nahkya-text hover:text-nahkya-error transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-body-sm text-nahkya-text font-body truncate">{d.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-body-3xs text-nahkya-text-secondary uppercase tracking-label">{TOOL_LABELS[d.tool] || d.tool}</span>
                <span className="font-mono text-body-3xs text-nahkya-text-secondary">{d.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-nahkya-text-secondary font-body mb-4">No designs found.</p>
          <p className="text-body-sm text-nahkya-text-secondary font-body">Create your first design in the Atelier.</p>
        </div>
      )}
    </div>
  );
}
