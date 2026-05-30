import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { uploadFile } from '@/lib/firebase/storage';
import { createDisplayImage } from '@/lib/image';

export default function Profile() {
  const { user, updateAvatar } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
    } catch {
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

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
        {[
          { label: 'FULL NAME', value: user?.displayName || 'Aisha Rahman', editable: true },
          { label: 'EMAIL', value: user?.email || 'aisha@email.com', editable: false },
          { label: 'PHONE', value: '+673 888 1234', editable: true },
          { label: 'LOCATION', value: 'Bandar Seri Begawan, Brunei', editable: true },
        ].map(f => (
          <div key={f.label}>
            <label className="block font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted mb-2">{f.label}</label>
            <input defaultValue={f.value} readOnly={!f.editable}
              className={cn('w-full bg-workspace-panel border border-workspace-border text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none ', f.editable ? 'focus:border-nahkya-gold' : 'text-nahkya-text-muted')} />
          </div>
        ))}
      </div>

      {/* Membership */}
      <div className="bg-workspace-panel border border-workspace-border rounded-nahkya p-6 mb-12">
        <h2 className="text-xl font-body font-medium text-nahkya-text mb-6">Membership</h2>
        <p className="font-display text-xl text-nahkya-gold font-medium mb-2">Atelier Collector</p>
        <p className="text-sm text-nahkya-text-muted font-body mb-1">Member since 15 January 2025</p>
        <p className="text-sm text-nahkya-text-muted font-body mb-6">Renews on 15 January 2026</p>
        <div className="border-t border-workspace-border pt-4 flex gap-6">
          <button className="text-sm text-nahkya-gold font-body hover:text-nahkya-gold-soft transition-colors">Manage Subscription</button>
          <button className="text-sm text-nahkya-error font-body hover:text-nahkya-error-light transition-colors">Cancel Membership</button>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-12">
        <h2 className="text-xl font-body font-medium text-nahkya-text mb-6">Preferences</h2>
        <div className="space-y-4">
          {[
            { label: 'Email notifications for order updates', on: true },
            { label: 'Email newsletter (The Silk Letter)', on: true },
            { label: 'Show recent colours across sessions', on: true },
            { label: 'Auto-save designs', on: true },
          ].map(p => (
            <div key={p.label} className="flex items-center justify-between">
              <span className="text-sm text-nahkya-text font-body">{p.label}</span>
              <Toggle defaultOn={p.on} />
            </div>
          ))}
        </div>
      </div>

      <LuxuryButton variant="primary" size="md" onClick={handleSave}>
        {saved ? 'Saved ✓' : 'Save Changes'}
      </LuxuryButton>
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} className={cn('w-10 h-5 rounded-full transition-colors ', on ? 'bg-nahkya-gold' : 'bg-workspace-border')}>
      <div className={cn('w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ', on ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );
}
