import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, X, Search, User, Loader2 } from 'lucide-react';
import { useDesignerStore } from '@/stores/designerStore';
import { useCommissionStore } from '@/stores/commissionStore';
import { uploadFile } from '@/lib/firebase/storage';
import { createDisplayImage } from '@/lib/image';
import type { Designer } from '@/types';

const EMPTY_FORM = {
  name: '',
  email: '',
  commissionRate: 25,
  bio: '',
  avatar: '',
  isActive: true,
};

export default function AdminDesigners() {
  const { designers, isLoading, fetchDesigners, addDesigner, updateDesigner, deleteDesigner } = useDesignerStore();
  const { commissions } = useCommissionStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const designerId = editingId || 'new';
      const resized = await createDisplayImage(file, 400);
      const path = `uploads/avatars/designers/${designerId}/${Date.now()}_${file.name}`;
      const url = await uploadFile(resized, path);
      setForm((prev) => ({ ...prev, avatar: url }));
    } catch {
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    fetchDesigners();
  }, [fetchDesigners]);

  const filtered = designers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (designer: Designer) => {
    setEditingId(designer.id);
    setForm({
      name: designer.name,
      email: designer.email,
      commissionRate: designer.commissionRate,
      bio: designer.bio,
      avatar: designer.avatar,
      isActive: designer.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editingId) {
      await updateDesigner(editingId, form);
    } else {
      await addDesigner(form);
    }
    setModalOpen(false);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async (id: string) => {
    await deleteDesigner(id);
    setConfirmDelete(null);
  };

  const getDesignerStats = (designerId: string) => {
    const designerCommissions = commissions.filter((c) => c.designerId === designerId);
    const totalEarned = designerCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const artworkCount = new Set(designerCommissions.map((c) => c.artworkId)).size;
    return { totalEarned, artworkCount, commissionCount: designerCommissions.length };
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-display-sm text-nahkya-text font-medium">Designers</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-nahkya-gold text-nahkya-text text-sm font-body font-medium rounded-nahkya hover:bg-nahkya-gold-soft transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add Designer
        </button>
      </div>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">
        Manage designers and their commission rates.
      </p>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-muted" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search designers..."
            className="pl-10 pr-4 py-2 bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text text-sm rounded-nahkya focus:outline-none focus:border-nahkya-gold w-full font-body"
          />
        </div>
        <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">{filtered.length} designers</p>
      </div>

      {/* Table */}
      <div className="bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya overflow-hidden">
        <div className="hidden lg:grid grid-cols-[60px_1fr_1fr_100px_100px_100px_100px_80px] gap-3 px-5 py-3 border-b-2 border-nahkya-charcoal">
          {['', 'Name', 'Email', 'Rate', 'Earned', 'Commissions', 'Status', ''].map((h, i) => (
            <span key={`${h}-${i}`} className="font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted">
              {h}
            </span>
          ))}
        </div>
        {isLoading && (
          <div className="px-5 py-12 text-center text-nahkya-text-muted font-body">Loading designers...</div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-nahkya-text-muted font-body">No designers found.</div>
        )}
        {filtered.map((designer, i) => {
          const stats = getDesignerStats(designer.id);
          return (
            <div
              key={designer.id}
              className={`grid grid-cols-1 lg:grid-cols-[60px_1fr_1fr_100px_100px_100px_100px_80px] gap-3 px-5 py-3.5 items-center ${
                i < filtered.length - 1 ? 'border-b border-nahkya-gold-soft' : ''
              } hover:bg-nahkya-ivory transition-colors`}
            >
              <div className="flex items-center justify-center">
                {designer.avatar ? (
                  <img src={designer.avatar} alt={designer.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-workspace-hover border border-workspace-border flex items-center justify-center">
                    <User className="w-4 h-4 text-nahkya-text-muted" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-nahkya-text font-body font-medium">{designer.name}</p>
                <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">{designer.bio.slice(0, 60)}{designer.bio.length > 60 ? '...' : ''}</p>
              </div>
              <span className="text-sm text-nahkya-text font-body">{designer.email}</span>
              <span className="font-mono text-mono-sm text-nahkya-gold uppercase">BND {designer.commissionRate}</span>
              <span className="font-mono text-mono-sm text-nahkya-text">BND {stats.totalEarned}</span>
              <span className="font-mono text-mono-sm text-nahkya-text-muted">{stats.commissionCount}</span>
              <span className={cn('font-mono text-mono-sm uppercase ', designer.isActive ? 'text-nahkya-success' : 'text-nahkya-text-muted')}>
                {designer.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="flex items-center gap-2 justify-end">
                <button onClick={() => openEdit(designer)} className="p-1.5 text-nahkya-text-muted hover:text-nahkya-gold transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setConfirmDelete(designer.id)} className="p-1.5 text-nahkya-text-muted hover:text-nahkya-error transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center">
          <div className="absolute inset-0 bg-nahkya-charcoal/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-nahkya-ivory border border-nahkya-gold-soft rounded-nahkya max-w-prose w-full max-h-90vh overflow-y-auto p-8">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-nahkya-text-muted hover:text-nahkya-text">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-xl text-nahkya-text font-medium mb-6">
              {editingId ? 'Edit Designer' : 'Add Designer'}
            </h2>
            <div className="space-y-5">
              {[
                { label: 'Name', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Commission Rate (BND per scarf)', key: 'commissionRate', type: 'number' },
                { label: 'Bio', key: 'bio', type: 'textarea' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={form[field.key as keyof typeof form] as string}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      rows={3}
                      className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={form[field.key as keyof typeof form] as string | number}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                        })
                      }
                      className="w-full bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold"
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Avatar</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                  className={cn('flex items-center gap-4 rounded-nahkya border border-nahkya-gold-soft bg-nahkya-surface p-3 hover:border-nahkya-gold transition-colors ', uploadingAvatar ? 'opacity-50' : '')}
                >
                  {uploadingAvatar ? (
                    <div className="w-12 h-12 rounded-full bg-workspace-hover border border-workspace-border flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-nahkya-text-muted animate-spin" strokeWidth={1.5} />
                    </div>
                  ) : form.avatar ? (
                    <img src={form.avatar} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-workspace-hover border border-workspace-border flex items-center justify-center">
                      <User className="w-5 h-5 text-nahkya-text-muted" strokeWidth={1.5} />
                    </div>
                  )}
                  <span className="text-sm text-nahkya-text-muted font-body">
                    {uploadingAvatar ? 'Uploading...' : 'Click to upload avatar'}
                  </span>
                </button>
              </div>
              <div>
                <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Status</label>
                <div className="flex items-center gap-3">
                  <div
                    className={cn('w-10 h-5 rounded-full cursor-pointer transition-colors ', form.isActive ? 'bg-nahkya-success' : 'bg-nahkya-stone')}
                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  >
                    <div className={cn('w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ', form.isActive ? 'translate-x-5' : 'translate-x-0.5')} />
                  </div>
                  <span className="text-sm text-nahkya-text font-body">{form.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-nahkya-gold-soft mt-6 flex gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-nahkya-gold text-nahkya-text text-sm font-body font-medium rounded-nahkya hover:bg-nahkya-gold-soft transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Designer'}
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

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-modal flex items-center justify-center">
          <div className="absolute inset-0 bg-nahkya-charcoal/50" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-nahkya-ivory border border-nahkya-gold-soft rounded-nahkya max-w-auth w-full p-8">
            <h3 className="font-display text-lg text-nahkya-text font-medium mb-2">Delete Designer?</h3>
            <p className="text-sm text-nahkya-text-muted font-body mb-6">
              This will permanently remove the designer. If they have artworks assigned, reassign those first.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-5 py-2 bg-nahkya-error text-white text-body-sm font-body font-medium rounded-nahkya hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2 border border-nahkya-gold-soft text-body-sm font-body text-nahkya-text rounded-nahkya hover:border-nahkya-charcoal transition-colors"
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
