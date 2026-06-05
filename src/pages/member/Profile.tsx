import { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { uploadFile } from '@/lib/firebase/storage';
import { createDisplayImage } from '@/lib/image';
import { toast } from 'sonner';

export default function Profile() {
  const { user, updateAvatar, updateProfile } = useAuthStore();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (displayName.trim() && displayName !== user.displayName) {
        await updateProfile(displayName.trim());
      }
      toast.success('Profile updated.');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    try {
      const resized = await createDisplayImage(file, 400);
      const path = `uploads/avatars/users/${user.uid}/${Date.now()}_${file.name}`;
      const url = await uploadFile(resized, path);
      await updateAvatar(url);
      toast.success('Photo updated.');
    } catch {
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const fields = [
    { label: 'FULL NAME', value: displayName, onChange: setDisplayName, editable: true },
    { label: 'EMAIL', value: user?.email || '', onChange: () => {}, editable: false },
    { label: 'PHONE', value: phone, onChange: setPhone, editable: true },
    { label: 'LOCATION', value: location, onChange: setLocation, editable: true },
  ];

  return (
    <div className="p-8 lg:p-12 min-h-screen max-w-content-lg">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-12">Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-12">
        <input
          type="file"
          accept="image/png,image/jpeg"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="relative w-20 h-20 rounded-full bg-workspace-hover border border-workspace-border flex items-center justify-center overflow-hidden hover:border-nahkya-gold transition-colors"
        >
          {uploadingAvatar ? (
            <Loader2 className="w-6 h-6 text-nahkya-text-muted animate-spin" strokeWidth={1.5} />
          ) : user?.avatar ? (
            <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-heading-sm text-nahkya-text">
              {user?.displayName?.split(' ').map(n => n[0]).join('') || 'NA'}
            </span>
          )}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-sm text-nahkya-gold font-body hover:text-nahkya-gold-soft transition-colors"
        >
          Change Photo
        </button>
      </div>

      {/* Form */}
      <div className="space-y-6 mb-12">
        <h2 className="text-xl font-body font-medium text-nahkya-text mb-6">Personal Information</h2>
        {fields.map(f => (
          <div key={f.label}>
            <label className="block font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-2">
              {f.label}
            </label>
            {f.editable ? (
              <input
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="w-full bg-workspace-hover border border-workspace-border text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-gold transition-colors"
              />
            ) : (
              <p className="text-body-md text-nahkya-text font-body">{f.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Membership */}
      <div className="space-y-4 mb-12">
        <h2 className="text-xl font-body font-medium text-nahkya-text mb-6">Membership</h2>
        <div className="flex items-center justify-between py-4 border-t border-workspace-border">
          <div>
            <p className="font-body text-body-md text-nahkya-text">Current Tier</p>
            <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">Member</p>
          </div>
          <span className="font-mono text-mono-sm text-nahkya-gold uppercase">Active</span>
        </div>
      </div>

      <LuxuryButton onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> : 'Save Changes'}
      </LuxuryButton>
    </div>
  );
}
