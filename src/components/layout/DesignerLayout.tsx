import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { DesignerSidebar } from './DesignerSidebar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function DesignerLayout() {
  const { isAuthenticated, isDesigner, isAdmin, approvalStatus } = useAuthStore();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated || (!isDesigner && !isAdmin)) {
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
          {/* Mobile top bar with hamburger */}
          <div className="fixed top-0 left-0 right-0 h-14 bg-nahkya-surface border-b border-nahkya-border z-nav flex items-center px-4">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-nahkya text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-highlight-subtle transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-sidebar-expanded bg-nahkya-surface border-r border-nahkya-border p-0 flex flex-col">
                <SheetTitle className="sr-only">Designer navigation menu</SheetTitle>
                <DesignerSidebar />
              </SheetContent>
            </Sheet>
          </div>
          <div className="pt-14 min-h-screen">
            <Outlet />
          </div>
        </>
      ) : (
        <>
          <DesignerSidebar
            collapsed={sidebarCollapsed}
            onCollapseToggle={() => setSidebarCollapsed((p) => !p)}
          />
          <div
            className={cn(
              'min-h-screen transition-[margin] duration-300',
              sidebarCollapsed ? 'ml-sidebar-nav-collapsed' : 'ml-sidebar-expanded'
            )}
          >
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}
