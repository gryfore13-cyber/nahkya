import {
  LayoutDashboard, FileText, Image, ShoppingBag, Users,
  Palette, Droplets, Settings, ClipboardList, Globe, ArrowRight, UserCog, Coins, Monitor,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { AtelierSidebar } from './AtelierSidebar';
import type { SidebarSection, SidebarItem } from './AtelierSidebar';

const SECTIONS: SidebarSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Site',
    items: [
      { label: 'Homepage', href: '/admin/homepage', icon: Monitor },
      { label: 'Content', href: '/admin/content', icon: FileText },
      { label: 'Media Library', href: '/admin/media', icon: Image },
      { label: 'Global Site', href: '/admin/global', icon: Globe },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Members', href: '/admin/members', icon: Users },
      { label: 'Designers', href: '/admin/designers', icon: UserCog },
      { label: 'Commissions', href: '/admin/commissions', icon: Coins },
    ],
  },
  {
    title: 'Design',
    items: [
      { label: 'Artworks', href: '/admin/artworks', icon: Palette },
      { label: 'Colour System', href: '/admin/colours', icon: Droplets },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Log', href: '/admin/log', icon: ClipboardList },
    ],
  },
];

function getPortalLinks(role?: string): SidebarItem[] {
  if (role !== 'super_admin') return [];
  return [
    { label: 'Member Portal', href: '/member/home', icon: ArrowRight },
    { label: 'Designer Portal', href: '/designer/dashboard', icon: ArrowRight },
  ];
}

interface AdminSidebarProps {
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export function AdminSidebar({ collapsed, onCollapseToggle }: AdminSidebarProps) {
  const { user } = useAuthStore();
  return (
    <AtelierSidebar
      sections={SECTIONS}
      rootHref="/admin"
      footerItems={getPortalLinks(user?.role)}
      collapsed={collapsed}
      onCollapseToggle={onCollapseToggle}
    />
  );
}
