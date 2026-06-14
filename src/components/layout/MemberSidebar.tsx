import { Home, Paintbrush, Type, Grid3X3, FolderOpen, Package, User, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { AtelierSidebar } from './AtelierSidebar';
import type { SidebarSection, SidebarItem } from './AtelierSidebar';

const CORE_SECTIONS: SidebarSection[] = [
  {
    title: 'Studio',
    items: [
      { label: 'Home', href: '/member/home', icon: Home },
      { label: 'Atelier', href: '/member/atelier', icon: Paintbrush },
      { label: 'Monogram', href: '/member/monogram', icon: Type },
      { label: 'Petak', href: '/member/petak', icon: Grid3X3 },
      { label: 'Saved Designs', href: '/member/saved', icon: FolderOpen },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'My Orders', href: '/member/orders', icon: Package },
      { label: 'Profile', href: '/member/profile', icon: User },
    ],
  },
];

function getPortalLinks(role?: string): SidebarItem[] {
  if (role !== 'super_admin') return [];
  return [
    { label: 'Admin Dashboard', href: '/admin', icon: ArrowRight },
    { label: 'Designer Portal', href: '/designer/dashboard', icon: ArrowRight },
  ];
}

interface MemberSidebarProps {
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export function MemberSidebar({ collapsed, onCollapseToggle }: MemberSidebarProps) {
  const { user } = useAuthStore();
  const sections = useMemo(() => {
    const portals = getPortalLinks(user?.role);
    if (portals.length === 0) return CORE_SECTIONS;
    return [...CORE_SECTIONS, { title: 'Access', items: portals }];
  }, [user?.role]);

  return (
    <AtelierSidebar
      sections={sections}
      rootHref="/member/home"
      collapsed={collapsed}
      onCollapseToggle={onCollapseToggle}
    />
  );
}
