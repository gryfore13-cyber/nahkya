import { LayoutDashboard, Palette, DollarSign, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { IconRailSidebar, IconRailSidebarContent } from './IconRailSidebar';
import type { NavSection, NavItem } from './IconRailSidebar';

const SECTIONS: NavSection[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', shortLabel: 'Dashboard', href: '/designer/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Work',
    items: [
      { label: 'My Artworks', shortLabel: 'Artworks', href: '/designer/artworks', icon: Palette },
      { label: 'My Earnings', shortLabel: 'Earnings', href: '/designer/earnings', icon: DollarSign },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', shortLabel: 'Profile', href: '/designer/profile', icon: User },
    ],
  },
];

function getPortalLinks(role?: string): NavItem[] {
  if (role !== 'super_admin') return [];
  return [
    { label: 'Admin Dashboard', shortLabel: 'Admin', href: '/admin', icon: ArrowRight },
  ];
}

export function DesignerSidebarContent() {
  const { user } = useAuthStore();
  return (
    <IconRailSidebarContent
      sections={SECTIONS}
      portalLinks={getPortalLinks(user?.role)}
      rootHref="/designer/dashboard"
    />
  );
}

export function DesignerSidebar() {
  const { user } = useAuthStore();
  return (
    <IconRailSidebar
      sections={SECTIONS}
      portalLinks={getPortalLinks(user?.role)}
      rootHref="/designer/dashboard"
    />
  );
}
