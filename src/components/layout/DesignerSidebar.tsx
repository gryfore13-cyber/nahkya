import { LayoutDashboard, Palette, DollarSign, User, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { AtelierSidebar } from './AtelierSidebar';
import type { SidebarSection, SidebarItem } from './AtelierSidebar';

const CORE_SECTIONS: SidebarSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/designer/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Work',
    items: [
      { label: 'My Artworks', href: '/designer/artworks', icon: Palette },
      { label: 'My Earnings', href: '/designer/earnings', icon: DollarSign },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', href: '/designer/profile', icon: User },
    ],
  },
];

function getPortalLinks(role?: string): SidebarItem[] {
  if (role !== 'super_admin') return [];
  return [
    { label: 'Admin Dashboard', href: '/admin', icon: ArrowRight },
  ];
}

interface DesignerSidebarProps {
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export function DesignerSidebar({ collapsed, onCollapseToggle }: DesignerSidebarProps) {
  const { user } = useAuthStore();
  const sections = useMemo(() => {
    const portals = getPortalLinks(user?.role);
    if (portals.length === 0) return CORE_SECTIONS;
    return [...CORE_SECTIONS, { title: 'Access', items: portals }];
  }, [user?.role]);

  return (
    <AtelierSidebar
      sections={sections}
      rootHref="/designer/dashboard"
      collapsed={collapsed}
      onCollapseToggle={onCollapseToggle}
    />
  );
}
