import { useEffect } from 'react';
import { useAppearanceStore } from '@/stores/appearanceStore';
import { AppearanceBuilder } from '@/components/admin/AppearanceBuilder';

export default function AdminAppearance() {
  const isLoading = useAppearanceStore((s) => s.isLoading);
  const isHydrated = useAppearanceStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      useAppearanceStore.getState().initTheme();
    }
  }, [isHydrated]);

  if (isLoading && !isHydrated) {
    return (
      <div className="min-h-screen bg-nahkya-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-nahkya-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-mono-sm uppercase tracking-widest-alt text-nahkya-text-muted">
            Loading theme...
          </p>
        </div>
      </div>
    );
  }

  return <AppearanceBuilder />;
}
