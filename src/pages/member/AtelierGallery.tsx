import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Palette, Sparkles, ImageIcon } from 'lucide-react';
import { ARTWORK_TEMPLATES } from '@/lib/artworks';
import { useArtworkStore } from '@/stores/artworkStore';

export default function AtelierGallery() {
  const { artworks, fetchArtworksByStatus } = useArtworkStore();

  useEffect(() => {
    fetchArtworksByStatus('approved');
  }, [fetchArtworksByStatus]);

  const approvedArtworks = artworks;
  const totalCount = ARTWORK_TEMPLATES.length + approvedArtworks.length;

  return (
    <div className="h-screen flex flex-col bg-workspace-bg">
      {/* Top Bar */}
      <div className="h-14 bg-workspace-panel border-b border-workspace-border flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/member/home" className="text-nahkya-text-muted hover:text-nahkya-text transition-colors"><ArrowLeft className="w-5 h-5" strokeWidth={1.5} /></Link>
          <h1 className="font-display text-xl text-nahkya-text font-medium">The Colouring Atelier</h1>
          <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase">Select an Artwork</span>
        </div>
        <div className="flex items-center gap-2 text-nahkya-text-muted">
          <Palette className="w-4 h-4" strokeWidth={1.5} />
          <span className="font-mono text-mono-sm uppercase">{totalCount} artworks</span>
        </div>
      </div>

      {/* Gallery */}
      <div className="flex-1 overflow-y-auto workspace-scroll p-8 lg:p-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-nahkya-gold" strokeWidth={1.5} />
            <p className="font-mono text-mono-sm text-nahkya-gold uppercase">Curated Collection</p>
            <Sparkles className="w-4 h-4 text-nahkya-gold" strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-display-sm lg:text-display-md text-nahkya-text font-medium leading-tight mb-4">Choose your canvas</h2>
          <p className="text-body-md text-nahkya-text-muted font-body leading-relaxed max-w-lg mx-auto">Each artwork is designed by NAHKYA artists with intentional layered negative space, ready for your personal colour expression.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* SVG Templates */}
          {ARTWORK_TEMPLATES.map((art) => (
            <Link key={art.id} to={`/member/atelier/${art.id}`}
              className="group relative bg-workspace-panel border border-workspace-border rounded-nahkya overflow-hidden hover:border-nahkya-gold/40 transition-all duration-300">
              <div className="aspect-4/3 overflow-hidden bg-workspace-bg">
                <img src={art.thumbnail} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-nahkya-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-5 py-2.5 bg-nahkya-gold text-nahkya-text font-mono text-mono-md uppercase rounded-nahkya">Start Colouring</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-mono-sm text-nahkya-gold uppercase">{art.category}</span>
                  <span className="text-workspace-border">&middot;</span>
                  <span className="font-mono text-mono-sm text-nahkya-text-muted">{art.layers.length} layers</span>
                </div>
                <h3 className="font-display text-xl text-nahkya-text font-medium mb-1 group-hover:text-nahkya-gold transition-colors">{art.title}</h3>
                <p className="text-mono-md text-nahkya-text-muted font-body mb-2">by {art.artist}</p>
                <p className="text-sm text-nahkya-text-muted font-body leading-relaxed line-clamp-2">{art.description}</p>
              </div>
            </Link>
          ))}

          {/* Approved Designer Artworks */}
          {approvedArtworks.map((art) => (
            <Link key={art.id} to={`/member/atelier/image/${art.id}`}
              className="group relative bg-workspace-panel border border-workspace-border rounded-nahkya overflow-hidden hover:border-nahkya-gold/40 transition-all duration-300">
              <div className="aspect-4/3 overflow-hidden bg-workspace-bg">
                {art.thumbnail || art.image ? (
                  <img src={art.thumbnail || art.image} alt={art.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-nahkya-text-muted" strokeWidth={1.5} />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-nahkya-gold/90 text-nahkya-text font-mono text-mono-sm uppercase rounded-nahkya">Designer</span>
                </div>
                <div className="absolute inset-0 bg-nahkya-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-5 py-2.5 bg-nahkya-gold text-nahkya-text font-mono text-mono-md uppercase rounded-nahkya">Start Colouring</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-mono-sm text-nahkya-gold uppercase">{art.category}</span>
                  <span className="text-workspace-border">&middot;</span>
                  <span className="font-mono text-mono-sm text-nahkya-text-muted">Image</span>
                </div>
                <h3 className="font-display text-xl text-nahkya-text font-medium mb-1 group-hover:text-nahkya-gold transition-colors">{art.name}</h3>
                <p className="text-mono-md text-nahkya-text-muted font-body mb-2">by {art.designerName}</p>
                <p className="text-sm text-nahkya-text-muted font-body leading-relaxed line-clamp-2">{art.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {approvedArtworks.length === 0 && (
          <div className="max-w-4xl mx-auto text-center mt-12 pb-8">
            <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">New artworks added seasonally. Save your designs to revisit them anytime.</p>
          </div>
        )}
      </div>
    </div>
  );
}
