import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { cn } from '@/lib/utils';
import { usePlatformStore } from '@/stores/platformStore';

function Toggle({ label, on, onChange }: { label: string; on?: boolean; onChange?: () => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-nahkya-text font-body">{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={cn(
          'w-10 h-5 rounded-full transition-colors',
          on ? 'bg-nahkya-success' : 'bg-nahkya-border'
        )}
      >
        <div
          className={cn(
            'w-4 h-4 rounded-full bg-nahkya-inverse mt-0.5 transition-transform',
            on ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const store = usePlatformStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!store.isLoaded) {
    return (
      <div className="p-8 lg:p-12">
        <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Settings</h1>
        <p className="text-body-md text-nahkya-text-secondary font-body">Loading platform settings...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Settings</h1>
      <p className="text-body-md text-nahkya-text-secondary font-body mb-8">Platform configuration and system preferences.</p>

      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="bg-nahkya-surface border border-nahkya-border rounded-nahkya mb-6 p-1 gap-1">
          <TabsTrigger value="pricing" className="font-body text-sm data-[state=active]:bg-nahkya-accent data-[state=active]:text-nahkya-inverse rounded-nahkya">Pricing</TabsTrigger>
          <TabsTrigger value="roles" className="font-body text-sm data-[state=active]:bg-nahkya-accent data-[state=active]:text-nahkya-inverse rounded-nahkya">Roles</TabsTrigger>
          <TabsTrigger value="email" className="font-body text-sm data-[state=active]:bg-nahkya-accent data-[state=active]:text-nahkya-inverse rounded-nahkya">Email</TabsTrigger>
          <TabsTrigger value="system" className="font-body text-sm data-[state=active]:bg-nahkya-accent data-[state=active]:text-nahkya-inverse rounded-nahkya">System</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <div className="bg-nahkya-surface border border-nahkya-border rounded-nahkya overflow-hidden">
            <div className="grid gap-3 px-5 py-3 border-b-2 border-nahkya-text" style={{ gridTemplateColumns: '1fr 100px 100px 80px 100px 100px' }}>
              {['Size', 'Base Price', 'Prod. Cost', 'Margin', 'Member Price', 'Collector Price'].map((h) => (
                <span key={h} className="font-mono text-mono-sm font-medium uppercase text-nahkya-text-secondary">{h}</span>
              ))}
            </div>
            {store.pricing.map((row, i) => (
              <div key={row.size} className={cn('grid gap-3 px-5 py-3 items-center', i < store.pricing.length - 1 && 'border-b border-nahkya-border')} style={{ gridTemplateColumns: '1fr 100px 100px 80px 100px 100px' }}>
                <span className="text-sm text-nahkya-text font-body">{row.size} cm</span>
                {(['base', 'cost', 'margin', 'member', 'collector'] as const).map((f) => (
                  <input
                    key={f}
                    type="number"
                    value={row[f]}
                    onChange={(e) => store.updatePricingRow(i, { ...row, [f]: Number(e.target.value) })}
                    className="bg-nahkya-bg border border-nahkya-border text-nahkya-text font-mono text-mono-md px-2 py-1.5 rounded-nahkya focus:outline-none focus:border-nahkya-highlight w-full"
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-6">
            {store.addOns.map((addon, i) => (
              <div key={addon.label} className="flex items-center gap-3">
                <span className="text-sm text-nahkya-text font-body">{addon.label}</span>
                <input
                  type="number"
                  value={addon.value}
                  onChange={(e) => store.updateAddOn(i, { ...addon, value: Number(e.target.value) })}
                  className="w-16 bg-nahkya-surface border border-nahkya-border text-nahkya-text font-mono text-mono-md px-2 py-1.5 rounded-nahkya focus:outline-none focus:border-nahkya-highlight"
                />
                <Toggle
                  label=""
                  on={addon.enabled}
                  onChange={() => store.updateAddOn(i, { ...addon, enabled: !addon.enabled })}
                />
              </div>
            ))}
          </div>
          <LuxuryButton variant="primary" size="md" className="mt-6" onClick={handleSave}>
            {saved ? 'Saved!' : 'Save Pricing'}
          </LuxuryButton>
        </TabsContent>

        <TabsContent value="roles">
          <div className="bg-nahkya-surface border border-nahkya-border rounded-nahkya overflow-hidden">
            <div className="grid grid-cols-3 gap-3 px-5 py-3 border-b-2 border-nahkya-text">
              {['Role', 'Description', 'Permissions'].map((h) => (
                <span key={h} className="font-mono text-mono-sm font-medium uppercase text-nahkya-text-secondary">{h}</span>
              ))}
            </div>
            {[
              { role: 'Member', desc: 'Standard member access', perms: 'Design tools, gallery, orders' },
              { role: 'Writer', desc: 'Editorial contributor', perms: 'Content creation, own articles' },
              { role: 'Operations', desc: 'Order management', perms: 'Orders, members, view-only content' },
              { role: 'Super Admin', desc: 'Full access', perms: 'Everything' },
            ].map((r, i) => (
              <div key={r.role} className={cn('grid grid-cols-3 gap-3 px-5 py-4 items-center', i < 3 && 'border-b border-nahkya-border')}>
                <span className="font-mono text-mono-md text-nahkya-text uppercase font-medium">{r.role}</span>
                <span className="text-sm text-nahkya-text-secondary font-body">{r.desc}</span>
                <span className="text-sm text-nahkya-text-secondary font-body">{r.perms}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="email">
          <div className="bg-nahkya-surface border border-nahkya-border rounded-nahkya p-6 space-y-6">
            <h3 className="text-lg font-body font-medium text-nahkya-text mb-4">Email Templates</h3>
            <div className="space-y-3">
              {['Welcome Email', 'Order Submitted', 'Order Status Update', 'Payment Request', 'Design Approved', 'Newsletter'].map((t) => (
                <div key={t} className="flex items-center justify-between py-3 px-4 bg-nahkya-bg border border-nahkya-border rounded-nahkya">
                  <span className="text-sm text-nahkya-text font-body">{t}</span>
                  <button className="text-sm text-nahkya-highlight font-body hover:text-nahkya-border transition-colors">Edit</button>
                </div>
              ))}
            </div>
            <div className="border-t border-nahkya-border pt-6 space-y-4">
              {([
                { label: 'From Name', key: 'emailFromName' as const },
                { label: 'From Address', key: 'emailFromAddress' as const },
              ]).map((f) => (
                <div key={f.key}>
                  <label className="block font-mono text-mono-sm text-nahkya-text-secondary uppercase mb-2">{f.label}</label>
                  <input
                    value={store[f.key]}
                    onChange={(e) => store.updateSettings({ [f.key]: e.target.value })}
                    className="w-full bg-nahkya-bg border border-nahkya-border text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-highlight"
                  />
                </div>
              ))}
            </div>
            <LuxuryButton variant="secondary" size="sm" onClick={handleSave}>
              {saved ? 'Saved!' : 'Save Email Settings'}
            </LuxuryButton>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="bg-nahkya-surface border border-nahkya-border rounded-nahkya p-6 space-y-4 max-w-content">
            <h3 className="text-lg font-body font-medium text-nahkya-text mb-4">General</h3>
            <Toggle
              label="Maintenance Mode"
              on={store.maintenanceMode}
              onChange={() => store.updateSettings({ maintenanceMode: !store.maintenanceMode })}
            />
            {([
              { label: 'Platform Name', key: 'platformName' as const },
              { label: 'Default Language', key: 'defaultLanguage' as const },
              { label: 'Timezone', key: 'timezone' as const },
            ] as const).map((f) => (
              <div key={f.key} className="flex items-center justify-between py-2">
                <span className="text-sm text-nahkya-text font-body">{f.label}</span>
                <input
                  value={store[f.key]}
                  onChange={(e) => store.updateSettings({ [f.key]: e.target.value })}
                  className="w-40 bg-nahkya-bg border border-nahkya-border text-nahkya-text font-body text-sm px-3 py-2 rounded-nahkya focus:outline-none focus:border-nahkya-highlight"
                />
              </div>
            ))}
            <div className="border-t border-nahkya-border pt-4 mt-4">
              <h3 className="text-lg font-body font-medium text-nahkya-text mb-4">Member Settings</h3>
              {([
                { label: 'Free Tier Max Saves', key: 'freeTierMaxSaves' as const },
                { label: 'Auto-save Interval (seconds)', key: 'autoSaveInterval' as const },
                { label: 'Max Upload Size (MB)', key: 'maxUploadSizeMb' as const },
              ] as const).map((f) => (
                <div key={f.key} className="flex items-center justify-between py-2">
                  <span className="text-sm text-nahkya-text font-body">{f.label}</span>
                  <input
                    type="number"
                    value={store[f.key]}
                    onChange={(e) => store.updateSettings({ [f.key]: Number(e.target.value) })}
                    className="w-20 bg-nahkya-bg border border-nahkya-border text-nahkya-text font-mono text-mono-md px-3 py-2 rounded-nahkya focus:outline-none focus:border-nahkya-highlight text-center"
                  />
                </div>
              ))}
            </div>
            <div className="border-t border-nahkya-border pt-4 mt-4">
              <h3 className="text-lg font-body font-medium text-nahkya-text mb-4">Security</h3>
              <Toggle
                label="Two-Factor Authentication (Admin)"
                on={store.twoFactorAuth}
                onChange={() => store.updateSettings({ twoFactorAuth: !store.twoFactorAuth })}
              />
              {([
                { label: 'Session Timeout (minutes)', key: 'sessionTimeoutMinutes' as const },
                { label: 'Max Login Attempts', key: 'maxLoginAttempts' as const },
              ] as const).map((f) => (
                <div key={f.key} className="flex items-center justify-between py-2">
                  <span className="text-sm text-nahkya-text font-body">{f.label}</span>
                  <input
                    type="number"
                    value={store[f.key]}
                    onChange={(e) => store.updateSettings({ [f.key]: Number(e.target.value) })}
                    className="w-20 bg-nahkya-bg border border-nahkya-border text-nahkya-text font-mono text-mono-md px-3 py-2 rounded-nahkya focus:outline-none focus:border-nahkya-highlight text-center"
                  />
                </div>
              ))}
            </div>
            <LuxuryButton variant="primary" size="md" className="mt-4" onClick={handleSave}>
              {saved ? 'Saved!' : 'Save Settings'}
            </LuxuryButton>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
