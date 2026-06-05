import { useState, useEffect, useRef } from 'react';
import { ImageIcon, Pencil, Plus, X, Loader2 } from 'lucide-react';
import { useArtworkStore } from '@/stores/artworkStore';
import { useDesignerStore } from '@/stores/designerStore';
import { useAuthStore } from '@/stores/authStore';
import { uploadFile, uploadImage } from '@/lib/firebase/storage';
import { createThumbnail } from '@/lib/image';

const CATEGORIES = ['Floral', 'Geometric', 'Abstract', 'Heritage', 'Minimal'];

export default function DesignerArtworks() {
  const { user } = useAuthStore();
  const { designers, fetchDesigners } = useDesignerStore();
  const { artworks, fetchArtworksByDesigner, addArtwork } = useArtworkStore();
  const [uploadModal, setUploadModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Floral',
    description: '',
    image: '',
    thumbnail: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const designer = designers.find((d) => d.email === user?.email);
  const designerId = designer?.id || user?.uid || '';
  const myArtworks = artworks;

  useEffect(() => {
    fetchDesigners();
  }, [fetchDesigners]);

  useEffect(() => {
    if (designerId) {
      fetchArtworksByDesigner(designerId);
    }
  }, [designerId, fetchArtworksByDesigner]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setSubmitError(null);
    try {
      const designerId = designer?.id || user?.uid || 'unknown';
      const timestamp = Date.now();
      const origPath = `uploads/artworks/${designerId}/${timestamp}_${file.name}`;
      const imageUrl = await uploadImage(file, origPath);

      let thumbnailUrl = imageUrl;
      if (!file.name.toLowerCase().endsWith('.svg')) {
        const thumbBlob = await createThumbnail(file, 400);
        const thumbPath = `uploads/artworks/${designerId}/thumb_${timestamp}_${file.name}`;
        thumbnailUrl = await uploadFile(thumbBlob, thumbPath);
      }

      setForm((prev) => ({ ...prev, image: imageUrl, thumbnail: thumbnailUrl }));
    } catch {
      setSubmitError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !user) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await addArtwork({
        name: form.name,
        category: form.category,
        image: form.image,
        thumbnail: form.thumbnail,
        description: form.description,
        designerId: designer?.id || user.uid,
        designerName: designer?.name || user.displayName || 'Designer',
        status: 'pending_review',
        reviewNotes: '',
        available: false,
      });
      setUploadModal(false);
      setForm({ name: '', category: 'Floral', description: '', image: '', thumbnail: '' });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit artwork. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'pending_review': return { text: 'Pending Review', color: 'text-nahkya-gold' };
      case 'approved': return { text: 'Approved', color: 'text-nahkya-success' };
      case 'rejected': return { text: 'Rejected', color: 'text-nahkya-error' };
      default: return { text: status, color: 'text-nahkya-text-muted' };
    }
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-display-sm text-nahkya-text font-medium">My Artworks</h1>
        <button
          onClick={() => setUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-nahkya-gold text-nahkya-text text-sm font-body font-medium rounded-nahkya hover:bg-nahkya-gold-soft transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Upload Design
        </button>
      </div>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">
        Your artwork submissions. New uploads require admin approval before they appear in the Atelier.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myArtworks.map((art) => {
          const st = statusLabel(art.status);
          return (
            <div key={art.id} className="group bg-workspace-panel border border-workspace-border rounded-nahkya overflow-hidden hover:border-nahkya-gold/30 transition-all">
              <div className="aspect-square bg-workspace-bg flex items-center justify-center border-b border-workspace-border">
                {art.image ? (
                  <img src={art.thumbnail || art.image} alt={art.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-3/4 h-3/4 border border-workspace-border rounded-nahkya flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-nahkya-text-muted" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-base font-body font-medium text-nahkya-text">{art.name}</h3>
                  <span className={`font-mono text-mono-sm uppercase ${st.color}`}>{st.text}</span>
                </div>
                <p className="font-mono text-mono-sm text-nahkya-gold uppercase mb-2">{art.category}</p>
                <p className="text-sm text-nahkya-text-muted font-body mb-3 line-clamp-2">{art.description}</p>
                {art.reviewNotes && (
                  <div className="bg-workspace-bg border border-workspace-border rounded-nahkya p-3 mb-3">
                    <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase mb-1">Admin Note</p>
                    <p className="text-sm text-nahkya-text font-body">{art.reviewNotes}</p>
                  </div>
                )}
                <div className="flex items-center justify-end">
                  <button className="p-1 text-nahkya-text-muted hover:text-nahkya-gold transition-colors opacity-0 group-hover:opacity-100">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div
          onClick={() => setUploadModal(true)}
          className="border-2 border-dashed border-workspace-border rounded-nahkya flex flex-col items-center justify-center aspect-square cursor-pointer hover:border-nahkya-gold/40 transition-colors"
        >
          <Plus className="w-8 h-8 text-nahkya-text-muted mb-3" strokeWidth={1.5} />
          <p className="text-sm text-nahkya-text-muted font-body">Upload Design</p>
        </div>
      </div>

      {myArtworks.length === 0 && (
        <div className="text-center py-20">
          <ImageIcon className="w-10 h-10 text-nahkya-text-muted mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-nahkya-text-muted font-body mb-2">No artworks yet.</p>
          <p className="text-sm text-nahkya-text-muted font-body">Upload your first design to get started.</p>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center">
          <div className="absolute inset-0 bg-nahkya-charcoal/50" onClick={() => setUploadModal(false)} />
          <div className="relative bg-workspace-panel border border-workspace-border rounded-nahkya max-w-prose w-full max-h-[90vh] overflow-y-auto p-8">
            <button onClick={() => setUploadModal(false)} className="absolute top-4 right-4 text-nahkya-text-muted hover:text-nahkya-text">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-xl text-nahkya-text font-medium mb-6">Upload Design</h2>
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-workspace-bg border border-workspace-border rounded-nahkya p-6 mb-6 flex flex-col items-center justify-center aspect-video cursor-pointer hover:border-nahkya-gold/40 transition-colors"
            >
              {form.image ? (
                <img src={form.image} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <>
                  {uploadingImage ? (
                    <Loader2 className="w-10 h-10 text-nahkya-text-muted mb-3 animate-spin" strokeWidth={1.5} />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-nahkya-text-muted mb-3" strokeWidth={1.5} />
                  )}
                  <p className="text-sm text-nahkya-text-muted font-body">
                    {uploadingImage ? 'Uploading...' : 'Click to upload SVG / PNG'}
                  </p>
                </>
              )}
            </div>
            <div className="space-y-5">
              <div>
                <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-workspace-bg border border-workspace-border text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold placeholder:text-nahkya-text-muted/40"
                />
              </div>
              <div>
                <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-workspace-bg border border-workspace-border text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-workspace-bg border border-workspace-border text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold resize-none placeholder:text-nahkya-text-muted/40"
                />
              </div>
            </div>
            {submitError && (
              <div className="mb-4 bg-nahkya-error/10 border border-nahkya-error/30 rounded-nahkya p-3">
                <p className="text-sm text-nahkya-error font-body">{submitError}</p>
              </div>
            )}
            <div className="pt-6 border-t border-workspace-border mt-6 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 bg-nahkya-gold text-nahkya-text text-sm font-body font-medium rounded-nahkya hover:bg-nahkya-gold-soft transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </button>
              <button
                onClick={() => setUploadModal(false)}
                disabled={submitting}
                className="px-6 py-2.5 border border-workspace-border text-sm font-body text-nahkya-text rounded-nahkya hover:border-nahkya-gold/40 transition-colors disabled:opacity-50"
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
