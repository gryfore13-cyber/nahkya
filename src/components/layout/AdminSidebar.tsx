import {
  LayoutDashboard, FileText, Image, ShoppingBag, Users,
  Palette, Droplets, Settings, ClipboardList, ArrowRight, UserCog, Coins,
  Dna, LayoutTemplate,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { AtelierSidebar } from './AtelierSidebar';
import type { SidebarSection, SidebarItem } from './AtelierSidebar';
import { useMemo } from 'react';

const CORE_SECTIONS: SidebarSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Site',
    items: [
      { label: 'Front Page', href: '/admin/front-page', icon: LayoutTemplate },
      { label: 'Content', href: '/admin/content', icon: FileText },
      { label: 'Media Library', href: '/admin/media', icon: Image },
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
      { label: 'System DNA', href: '/admin/system-dna', icon: Dna },
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
  const sections = useMemo(() => {
    const portals = getPortalLinks(user?.role);
    if (portals.length === 0) return CORE_SECTIONS;
    return [...CORE_SECTIONS, { title: 'Access', items: portals }];
  }, [user?.role]);

  return (
    <AtelierSidebar
      sections={sections}
      rootHref="/admin"
      collapsed={collapsed}
      onCollapseToggle={onCollapseToggle}
    />
  );
}
