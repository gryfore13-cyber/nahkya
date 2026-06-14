import { lazy, Suspense } from 'react';
import { useLandingPageStore } from '@/stores/landingPageStore';

const LandingCanvas = lazy(() =>
  import('@/components/admin/landing/sections/LandingCanvas').then((m) => ({
    default: m.LandingCanvas,
  }))
);

export default function Home() {
  const landingConfig = useLandingPageStore((s) => s.config);
  const isLandingLoaded = useLandingPageStore((s) => s.isLoaded);

  if (!isLandingLoaded) {
    return (
      <div className="min-h-screen bg-nahkya-bg flex items-center justify-center">
        <p className="font-mono text-mono-md text-nahkya-text-secondary uppercase tracking-label">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="bg-nahkya-bg">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <p className="font-mono text-mono-md text-nahkya-text-secondary uppercase tracking-label">
              Loading…
            </p>
          </div>
        }
      >
        <LandingCanvas
          config={landingConfig}
          presentation="page"
          previewMode="desktop"
          motion="none"
          motionKey={0}
        />
      </Suspense>
    </div>
  );
}
