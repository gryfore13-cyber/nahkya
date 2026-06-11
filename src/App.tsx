import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DesignerLayout } from '@/components/layout/DesignerLayout';
import { useAuthStore } from '@/stores/authStore';
import { getGoogleRedirectResult } from '@/lib/firebase/auth';

/* Eager-loaded: public homepage */
import Home from '@/pages/public/Home';

/* Lazy-loaded: everything else */
const ByNahkya = lazy(() => import('@/pages/public/ByNahkya'));
const SilkReport = lazy(() => import('@/pages/public/SilkReport'));
const Herstory = lazy(() => import('@/pages/public/Herstory'));
const SilkWire = lazy(() => import('@/pages/public/SilkWire'));
const Membership = lazy(() => import('@/pages/public/Membership'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const Login = lazy(() => import('@/pages/public/Login'));
const Signup = lazy(() => import('@/pages/public/Signup'));

const MemberHome = lazy(() => import('@/pages/member/MemberHome'));
const PendingApproval = lazy(() => import('@/pages/member/PendingApproval'));
const Rejected = lazy(() => import('@/pages/member/Rejected'));
const Atelier = lazy(() => import('@/pages/member/Atelier'));
const Monogram = lazy(() => import('@/pages/member/Monogram'));
const Petak = lazy(() => import('@/pages/member/Petak'));
const SavedDesigns = lazy(() => import('@/pages/member/SavedDesigns'));
const Orders = lazy(() => import('@/pages/member/Orders'));
const Profile = lazy(() => import('@/pages/member/Profile'));
const AtelierGallery = lazy(() => import('@/pages/member/AtelierGallery'));
const ImageAtelier = lazy(() => import('@/pages/member/ImageAtelier'));

const DesignerDashboard = lazy(() => import('@/pages/designer/DesignerDashboard'));
const DesignerArtworks = lazy(() => import('@/pages/designer/DesignerArtworks'));
const DesignerEarnings = lazy(() => import('@/pages/designer/DesignerEarnings'));
const DesignerProfile = lazy(() => import('@/pages/designer/DesignerProfile'));

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminContent = lazy(() => import('@/pages/admin/AdminContent'));
const AdminMedia = lazy(() => import('@/pages/admin/AdminMedia'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminMembers = lazy(() => import('@/pages/admin/AdminMembers'));
const AdminArtworks = lazy(() => import('@/pages/admin/AdminArtworks'));
const AdminColour = lazy(() => import('@/pages/admin/AdminColour'));
const AdminHomePage = lazy(() => import('@/pages/admin/AdminHomePage'));


const AdminGlobal = lazy(() => import('@/pages/admin/AdminGlobal'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

const AdminLog = lazy(() => import('@/pages/admin/AdminLog'));
const AdminDesigners = lazy(() => import('@/pages/admin/AdminDesigners'));
const AdminCommissions = lazy(() => import('@/pages/admin/AdminCommissions'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-nahkya-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-nahkya-highlight border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-mono-sm uppercase tracking-widest-alt text-nahkya-text-secondary">
          Loading
        </p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-nahkya-bg flex flex-col items-center justify-center px-5">
      <p className="font-display text-display-xl text-nahkya-text/10 font-medium leading-none select-none">404</p>
      <h1 className="font-display text-display-sm lg:text-display-md text-nahkya-text font-medium -mt-8 mb-4">This page does not exist.</h1>
      <p className="text-body-md text-nahkya-text-secondary font-body mb-8">The path you followed may have changed.</p>
      <a href="/" className="px-6 py-3 bg-nahkya-highlight text-nahkya-text text-body-sm font-body font-medium uppercase tracking-wide hover:bg-nahkya-border transition-colors">
        Return Home
      </a>
    </div>
  );
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);
  const setUser = useAuthStore((s) => s.setUser);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function bootstrap() {
      try {
        const user = await getGoogleRedirectResult();
        if (user) setUser(user);
      } catch {
        // Redirect result error (e.g. user denied OAuth) — ignore
      }
      unsubscribe = init();
    }

    bootstrap();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [init, setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nahkya-bg flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-2xl text-nahkya-text mb-3 text-center">NAHKYA</div>
          <div className="text-mono-sm text-nahkya-text-secondary uppercase">Loading Atelier...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <AuthInitializer>
        <Toaster position="top-right" richColors />
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/by-nahkya" element={<ByNahkya />} />
            <Route path="/silk-report" element={<SilkReport />} />
            <Route path="/herstory" element={<Herstory />} />
            <Route path="/silk-wire" element={<SilkWire />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/rejected" element={<Rejected />} />

          {/* Member Routes */}
          <Route element={<MemberLayout />}>
            <Route path="/member/home" element={<MemberHome />} />
            <Route path="/member/atelier" element={<AtelierGallery />} />
            <Route path="/member/atelier/:artworkId" element={<Atelier />} />
            <Route path="/member/atelier/image/:artworkId" element={<ImageAtelier />} />
            <Route path="/member/monogram" element={<Monogram />} />
            <Route path="/member/petak" element={<Petak />} />
            <Route path="/member/saved" element={<SavedDesigns />} />
            <Route path="/member/orders" element={<Orders />} />
            <Route path="/member/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/media" element={<AdminMedia />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            <Route path="/admin/artworks" element={<AdminArtworks />} />
            <Route path="/admin/colours" element={<AdminColour />} />
            <Route path="/admin/homepage" element={<AdminHomePage />} />


            <Route path="/admin/global" element={<AdminGlobal />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            <Route path="/admin/log" element={<AdminLog />} />
            <Route path="/admin/designers" element={<AdminDesigners />} />
            <Route path="/admin/commissions" element={<AdminCommissions />} />
          </Route>

          {/* Designer Routes */}
          <Route element={<DesignerLayout />}>
            <Route path="/designer/dashboard" element={<DesignerDashboard />} />
            <Route path="/designer/artworks" element={<DesignerArtworks />} />
            <Route path="/designer/earnings" element={<DesignerEarnings />} />
            <Route path="/designer/profile" element={<DesignerProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </AuthInitializer>
    </HashRouter>
  );
}
