import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Pencil, Copy, Trash2, ImageIcon, X, CheckCircle, XCircle } from 'lucide-react';
import { useArtworkStore } from '@/stores/artworkStore';
import { useDesignerStore } from '@/stores/designerStore';
// Artwork types come from the store

const CATEGORIES = ['All', 'Floral', 'Geometric', 'Abstract', 'Heritage', 'Minimal'];
const STATUS_TABS = ['All', 'Pending Review', 'Approved', 'Rejected'] as const;

export default function AdminArtworks() {
  const { artworks, fetchArtworks, deleteArtwork, approveArtwork, rejectArtwork } = useArtworkStore();
  const { designers, fetchDesigners } = useDesignerStore();
  const [activeCat, setActiveCat] = useState('All');
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [editing, setEditing] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

  useEffect(() => {
    fetchDesigners();
    fetchArtworks();
  }, [fetchDesigners, fetchArtworks]);

  const filtered = artworks.filter((a) => {
    const matchesCat = activeCat === 'All' || a.category === activeCat;
    const matchesStatus = activeStatus === 'All' ||
      (activeStatus === 'Pending Review' && a.status === 'pending_review') ||
      (activeStatus === 'Approved' && a.status === 'approved') ||
      (activeStatus === 'Rejected' && a.status === 'rejected');
    return matchesCat && matchesStatus;
  });

  const editArt = artworks.find((a) => a.id === editing);

  const handleApprove = async (id: string) => {
    await approveArtwork(id);
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    await rejectArtwork(rejectModal, rejectNotes);
    setRejectModal(null);
    setRejectNotes('');
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <span className="font-mono text-mono-sm text-nahkya-gold uppercase">Pending Review</span>;
      case 'approved':
        return <span className="font-mono text-mono-sm text-nahkya-success uppercase">Approved</span>;
      case 'rejected':
        return <span className="font-mono text-mono-sm text-nahkya-error uppercase">Rejected</span>;
      default:
        return <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase">{status}</span>;
    }
  };

  if (editing && editArt) {
    return (
      <div className="p-8 lg:p-12">
        <button onClick={() => setEditing(null)} className="text-sm text-nahkya-text font-body mb-8 hover:text-nahkya-gold transition-colors">&larr; Back to List</button>
        <h2 className="font-display text-display-sm text-nahkya-text font-medium mb-8">{editArt.name}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10">
          <div className="bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya p-8 flex items-center justify-center aspect-square">
            {editArt.image ? (
              <img src={editArt.image} alt={editArt.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full border-2 border-dashed border-nahkya-gold-soft rounded-nahkya flex flex-col items-center justify-center">
                <ImageIcon className="w-8 h-8 text-nahkya-text-muted mb-3" strokeWidth={1.5} />
                <p className="text-sm text-nahkya-text-muted font-body">SVG Preview</p>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Name</label>
              <input defaultValue={editArt.name} className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold" />
            </div>
            <div>
              <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Category</label>
              <select defaultValue={editArt.category} className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold">
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Designer</label>
              <select defaultValue={editArt.designerId} className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold">
                <option value="">Select a designer</option>
                {designers.filter((d) => d.isActive).map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Status</label>
              <div className="flex items-center gap-2">
                {statusBadge(editArt.status)}
              </div>
            </div>
            {editArt.reviewNotes && (
              <div className="bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya p-4">
                <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase mb-1">Review Notes</p>
                <p className="text-sm text-nahkya-text font-body">{editArt.reviewNotes}</p>
              </div>
            )}
            <div className="pt-6 border-t border-nahkya-gold-soft flex gap-3">
              <button onClick={() => setEditing(null)} className="px-6 py-2.5 bg-nahkya-gold text-nahkya-text text-sm font-body font-medium rounded-nahkya hover:bg-nahkya-gold-soft transition-colors">Save Artwork</button>
              <button onClick={() => setEditing(null)} className="px-6 py-2.5 border border-nahkya-gold-soft text-sm font-body text-nahkya-text rounded-nahkya hover:border-nahkya-burgundy transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-display-sm text-nahkya-text font-medium">Artworks</h1>
      </div>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">Manage scarf artwork templates and designer submissions.</p>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_TABS.map((s) => (
          <button key={s} onClick={() => setActiveStatus(s)}
            className={`px-4 py-2 font-mono text-mono-sm font-medium uppercase rounded-nahkya transition-colors ${
              activeStatus === s ? 'bg-nahkya-burgundy text-nahkya-text-inverse' : 'bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text-muted hover:border-nahkya-burgundy'
            }`}>{s}</button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setActiveCat(c)}
            className={`px-4 py-2 font-mono text-mono-sm font-medium uppercase rounded-nahkya transition-colors ${
              activeCat === c ? 'bg-nahkya-burgundy text-nahkya-text-inverse' : 'bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text-muted hover:border-nahkya-burgundy'
            }`}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((art) => (
          <div key={art.id} className="group bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya overflow-hidden hover:border-nahkya-gold/30 transition-all">
            <div className="aspect-square bg-nahkya-ivory flex items-center justify-center border-b border-nahkya-gold-soft">
              {art.image ? (
                <img src={art.thumbnail || art.image} alt={art.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-3/4 h-3/4 border border-nahkya-gold-soft/50 rounded-nahkya flex items-center justify-center">
                  <span className="font-display text-5xl text-nahkya-stone/30">{art.name[0]}</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-body font-medium text-nahkya-text">{art.name}</h3>
                {statusBadge(art.status)}
              </div>
              <p className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-label mb-1">{art.category}</p>
              {art.designerName && (
                <p className="font-mono text-mono-sm text-nahkya-text-muted mb-2">by {art.designerName}</p>
              )}

              {/* Approval Actions for Pending */}
              {art.status === 'pending_review' && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => handleApprove(art.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-nahkya-success/15 text-nahkya-success text-xs font-body font-medium rounded-nahkya hover:bg-nahkya-success/25 transition-colors"
                  >
                    <CheckCircle className="w-3 h-3" strokeWidth={1.5} />
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectModal(art.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-nahkya-error/15 text-nahkya-error text-xs font-body font-medium rounded-nahkya hover:bg-nahkya-error/25 transition-colors"
                  >
                    <XCircle className="w-3 h-3" strokeWidth={1.5} />
                    Reject
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className={cn('w-8 h-4 rounded-full ', art.available ? 'bg-nahkya-success' : 'bg-nahkya-stone')}>
                  <div className={cn('w-3 h-3 rounded-full bg-white mt-0.5 transition-transform ', art.available ? 'translate-x-4' : 'translate-x-0.5')} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditing(art.id)} className="p-1.5 text-nahkya-text-muted hover:text-nahkya-gold"><Pencil className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 text-nahkya-text-muted hover:text-nahkya-text"><Copy className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteArtwork(art.id)} className="p-1.5 text-nahkya-text-muted hover:text-nahkya-error"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-nahkya-text-muted font-body">
            No artworks match the selected filters.
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center">
          <div className="absolute inset-0 bg-nahkya-charcoal/50" onClick={() => setRejectModal(null)} />
          <div className="relative bg-nahkya-ivory border border-nahkya-gold-soft rounded-nahkya max-w-canvas w-full p-8">
            <button onClick={() => setRejectModal(null)} className="absolute top-4 right-4 text-nahkya-text-muted hover:text-nahkya-text">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-lg text-nahkya-text font-medium mb-2">Reject Artwork?</h3>
            <p className="text-sm text-nahkya-text-muted font-body mb-6">
              Add a note explaining why this artwork was rejected. The designer will see this feedback.
            </p>
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Colour palette is too limited, composition needs refinement..."
              className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold resize-none mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="px-5 py-2 bg-nahkya-error text-white text-sm font-body font-medium rounded-nahkya hover:opacity-90 transition-opacity"
              >
                Reject
              </button>
              <button
                onClick={() => setRejectModal(null)}
                className="px-5 py-2 border border-nahkya-gold-soft text-sm font-body text-nahkya-text rounded-nahkya hover:border-nahkya-burgundy transition-colors"
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
