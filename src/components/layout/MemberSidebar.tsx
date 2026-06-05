import { Home, Paintbrush, Type, Grid3X3, FolderOpen, Package, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { IconRailSidebar, IconRailSidebarContent } from './IconRailSidebar';
import type { NavSection, NavItem } from './IconRailSidebar';

const SECTIONS: NavSection[] = [
  {
    title: 'Studio',
    items: [
      { label: 'Home', shortLabel: 'Home', href: '/member/home', icon: Home },
      { label: 'Atelier', shortLabel: 'Atelier', href: '/member/atelier', icon: Paintbrush },
      { label: 'Monogram', shortLabel: 'Monogram', href: '/member/monogram', icon: Type },
      { label: 'Petak', shortLabel: 'Petak', href: '/member/petak', icon: Grid3X3 },
      { label: 'Saved Designs', shortLabel: 'Saved', href: '/member/saved', icon: FolderOpen },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'My Orders', shortLabel: 'Orders', href: '/member/orders', icon: Package },
      { label: 'Profile', shortLabel: 'Profile', href: '/member/profile', icon: User },
    ],
  },
];

function getPortalLinks(role?: string): NavItem[] {
  if (role !== 'super_admin') return [];
  return [
    { label: 'Admin Dashboard', shortLabel: 'Admin', href: '/admin', icon: ArrowRight },
    { label: 'Designer Portal', shortLabel: 'Designer', href: '/designer/dashboard', icon: ArrowRight },
  ];
}

export function MemberSidebarContent() {
  const { user } = useAuthStore();

  return (
    <IconRailSidebarContent
      sections={SECTIONS}
      portalLinks={getPortalLinks(user?.role)}
      rootHref="/member/home"
    />
  );
}

export function MemberSidebar() {
  const { user } = useAuthStore();

  return (
    <IconRailSidebar
      sections={SECTIONS}
      portalLinks={getPortalLinks(user?.role)}
      rootHref="/member/home"
    />
  );
}
