import { Outlet } from 'react-router-dom';
import { PublicNav } from './PublicNav';
import { PublicFooter } from './PublicFooter';

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
