import {
  LayoutDashboard, Paintbrush, FileText, Image, ShoppingBag, Users,
  Palette, Droplets, Settings, ClipboardList, Globe, ArrowRight, UserCog, Coins, Monitor,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { IconRailSidebar, IconRailSidebarContent } from './IconRailSidebar';
import type { NavSection, NavItem } from './IconRailSidebar';

const SECTIONS: NavSection[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', shortLabel: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Site',
    items: [
      { label: 'Homepage', shortLabel: 'Homepage', href: '/admin/homepage', icon: Monitor },
      { label: 'Theme', shortLabel: 'Theme', href: '/admin/appearance', icon: Paintbrush },
      { label: 'Content', shortLabel: 'Content', href: '/admin/content', icon: FileText },
      { label: 'Media Library', shortLabel: 'Media', href: '/admin/media', icon: Image },
      { label: 'Global Site', shortLabel: 'Global', href: '/admin/global', icon: Globe },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { label: 'Orders', shortLabel: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Members', shortLabel: 'Members', href: '/admin/members', icon: Users },
      { label: 'Designers', shortLabel: 'Designers', href: '/admin/designers', icon: UserCog },
      { label: 'Commissions', shortLabel: 'Commissions', href: '/admin/commissions', icon: Coins },
    ],
  },
  {
    title: 'Design',
    items: [
      { label: 'Artworks', shortLabel: 'Artworks', href: '/admin/artworks', icon: Palette },
      { label: 'Colour System', shortLabel: 'Colours', href: '/admin/colours', icon: Droplets },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', shortLabel: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Log', shortLabel: 'Log', href: '/admin/log', icon: ClipboardList },
    ],
  },
];

function getPortalLinks(role?: string): NavItem[] {
  if (role !== 'super_admin') return [];
  return [
    { label: 'Member Portal', shortLabel: 'Member', href: '/member/home', icon: ArrowRight },
    { label: 'Designer Portal', shortLabel: 'Designer', href: '/designer/dashboard', icon: ArrowRight },
  ];
}

export function AdminSidebarContent() {
  const { user } = useAuthStore();
  return (
    <IconRailSidebarContent
      sections={SECTIONS}
      portalLinks={getPortalLinks(user?.role)}
      rootHref="/admin"
    />
  );
}

export function AdminSidebar() {
  const { user } = useAuthStore();
  return (
    <IconRailSidebar
      sections={SECTIONS}
      portalLinks={getPortalLinks(user?.role)}
      rootHref="/admin"
    />
  );
}
