import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { MemberSidebar, MemberSidebarContent } from './MemberSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MemberLayout() {
  const { isAuthenticated, isMember, approvalStatus } = useAuthStore();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!isAuthenticated || !isMember) {
    return <Navigate to="/login" replace />;
  }

  if (approvalStatus === 'pending') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (approvalStatus === 'rejected') {
    return <Navigate to="/rejected" replace />;
  }

  return (
    <div className="min-h-screen">
      {isMobile ? (
        <>
          {/* Mobile top bar */}
          <div className="fixed top-0 left-0 right-0 h-14 bg-nahkya-surface border-b border-nahkya-border z-nav flex items-center px-4">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-nahkya text-nahkya-text-muted hover:text-nahkya-text hover:bg-nahkya-gold-veil transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-sidebar-member-collapsed bg-nahkya-surface border-r border-nahkya-border p-0 flex flex-col">
                <MemberSidebarContent />
              </SheetContent>
            </Sheet>
          </div>
          <div className="pt-14 min-h-screen">
            <Outlet />
          </div>
        </>
      ) : (
        <>
          <MemberSidebar />
          <div className="ml-sidebar-member-collapsed min-h-screen">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}
