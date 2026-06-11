import { LayoutDashboard, Palette, DollarSign, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { AtelierSidebar } from './AtelierSidebar';
import type { SidebarSection, SidebarItem } from './AtelierSidebar';

const SECTIONS: SidebarSection[] = [
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
  return (
    <AtelierSidebar
      sections={SECTIONS}
      rootHref="/designer/dashboard"
      footerItems={getPortalLinks(user?.role)}
      collapsed={collapsed}
      onCollapseToggle={onCollapseToggle}
    />
  );
}
