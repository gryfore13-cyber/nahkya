import { useState, useEffect, useRef } from 'react';
import { User, Save, Loader2 } from 'lucide-react';
import { useDesignerStore } from '@/stores/designerStore';
import { useAuthStore } from '@/stores/authStore';
import { uploadFile } from '@/lib/firebase/storage';
import { createDisplayImage } from '@/lib/image';

export default function DesignerProfile() {
  const { user } = useAuthStore();
  const { designers, fetchDesigners, updateDesigner } = useDesignerStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const designerId = designer?.id || user?.uid || 'unknown';
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

  const designer = designers.find((d) => d.email === user?.email);

  const [form, setForm] = useState({
    name: designer?.name || user?.displayName || '',
    email: designer?.email || user?.email || '',
    bio: designer?.bio || '',
    avatar: designer?.avatar || '',
  });

  useEffect(() => {
    fetchDesigners();
  }, [fetchDesigners]);

  useEffect(() => {
    if (designer) {
      setForm({
        name: designer.name,
        email: designer.email,
        bio: designer.bio,
        avatar: designer.avatar,
      });
    }
  }, [designer]);

  const handleSave = async () => {
    if (!designer) return;
    setSaving(true);
    await updateDesigner(designer.id, form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 lg:p-12 max-w-content-lg">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Profile</h1>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">
        Manage your designer profile information.
      </p>

      <div className="bg-workspace-panel border border-workspace-border rounded-nahkya p-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          {form.avatar ? (
            <img src={form.avatar} alt={form.name} className="w-16 h-16 rounded-full object-cover border border-workspace-border" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-workspace-hover border border-workspace-border flex items-center justify-center">
              <User className="w-6 h-6 text-nahkya-text-muted" strokeWidth={1.5} />
            </div>
          )}
          <div>
            <p className="font-display text-lg text-nahkya-text font-medium">{form.name || 'Designer'}</p>
            <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">{form.email}</p>
          </div>
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
            <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Email</label>
            <input
              value={form.email}
              disabled
              className="w-full bg-workspace-bg border border-workspace-border text-nahkya-text-muted font-body text-body-md px-4 py-3 rounded-nahkya cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="w-full bg-workspace-bg border border-workspace-border text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold resize-none placeholder:text-nahkya-text-muted/40"
            />
          </div>
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
              className={`flex items-center gap-4 rounded-nahkya border border-workspace-border bg-workspace-bg p-3 hover:border-nahkya-gold transition-colors ${uploadingAvatar ? 'opacity-50' : ''}`}
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
        </div>

        <div className="pt-6 border-t border-workspace-border mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-nahkya-gold text-nahkya-text text-sm font-body font-medium rounded-nahkya hover:bg-nahkya-gold-soft transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" strokeWidth={1.5} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          {saved && (
            <span className="text-sm text-nahkya-success font-body">Profile saved successfully.</span>
          )}
        </div>
      </div>
    </div>
  );
}
