import { Outlet, useLocation } from 'react-router-dom';
import { PublicNav } from './PublicNav';
import { PublicFooter } from './PublicFooter';

export function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // The landing page renders its own nav and footer, so hide global chrome on home.
  const hidePublicChrome = isHome;

  return (
    <div className="min-h-screen">
      {!hidePublicChrome && <PublicNav />}
      <main>
        <Outlet />
      </main>
      {!hidePublicChrome && <PublicFooter />}
    </div>
  );
}
