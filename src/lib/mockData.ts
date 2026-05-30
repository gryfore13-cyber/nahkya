import type { EditorialArticle, SavedDesign, Order, DashboardStats } from '@/types';

export const MOCK_ARTICLES: EditorialArticle[] = [
  {
    id: 'a1',
    title: 'The Quiet Power of Covered Beauty',
    excerpt: 'In a world that demands exposure, choosing coverage is an act of quiet revolution. The headscarf is not hiding — it is curating what the world sees.',
    category: 'BY NAHKYA',
    column: 'by-nahkya',
    author: 'Aisha Rahman',
    date: '12 MARCH 2025',
    image: 'https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?w=800&q=80',
  },
  {
    id: 'a2',
    title: 'Why Silk Charmeuse Drapes Differently',
    excerpt: 'Not all silk is created equal. Understanding weave, weight, and finish is the difference between a scarf that floats and one that fights.',
    category: 'THE SILK REPORT',
    column: 'silk-report',
    author: 'NAHKYA Editorial',
    date: '28 FEBRUARY 2025',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
  },
  {
    id: 'a3',
    title: 'The Golden Threads of Brunei',
    excerpt: 'Before oil, Brunei\'s wealth was measured in textiles. The story of songket weaving is the story of a nation threading its identity into cloth.',
    category: 'HERSTORY',
    column: 'herstory',
    author: 'NAHKYA Editorial',
    date: '15 FEBRUARY 2025',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
  },
  {
    id: 'a4',
    title: 'The Colour Curator\'s Dilemma',
    excerpt: 'Choosing colours for a scarf collection is part science, part intuition, and part cultural memory. Here is how we think about pigment.',
    category: 'CRAFT',
    column: 'by-nahkya',
    author: 'NAHKYA Editorial',
    date: '10 MARCH 2025',
    image: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&q=80',
  },
  {
    id: 'a5',
    title: 'From Sketch to Silk',
    excerpt: 'The journey of a NAHKYA scarf design — from first pencil stroke on paper to final digital artwork ready for the atelier.',
    category: 'DESIGN',
    column: 'by-nahkya',
    author: 'NAHKYA Editorial',
    date: '3 MARCH 2025',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
  },
  {
    id: 'a6',
    title: 'Dressing for the Self, Not the Algorithm',
    excerpt: 'Fashion algorithms tell us what to want. But true style comes from a place the algorithm cannot reach.',
    category: 'OPINION',
    column: 'by-nahkya',
    author: 'Aisha Rahman',
    date: '25 FEBRUARY 2025',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c7e?w=800&q=80',
  },
];

export const MOCK_DESIGNS: SavedDesign[] = [
  { id: 'd1', name: 'Garden in Dusk', tool: 'atelier', thumbnail: 'bg-gradient-to-br from-emerald-900 via-purple-900 to-amber-400', createdAt: '15 MAR 2025', updatedAt: '15 MAR 2025' },
  { id: 'd2', name: 'Monogram AR', tool: 'monogram', thumbnail: 'bg-gradient-to-br from-stone-100 via-orange-200 to-amber-400', createdAt: '12 MAR 2025', updatedAt: '12 MAR 2025' },
  { id: 'd3', name: 'Petak Sand', tool: 'petak', thumbnail: 'bg-gradient-to-br from-orange-300 via-orange-400 to-yellow-800', createdAt: '10 MAR 2025', updatedAt: '10 MAR 2025' },
  { id: 'd4', name: 'Midnight Bloom', tool: 'atelier', thumbnail: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-pink-800', createdAt: '8 MAR 2025', updatedAt: '8 MAR 2025' },
  { id: 'd5', name: 'Initials S&K', tool: 'monogram', thumbnail: 'bg-gradient-to-br from-stone-50 via-stone-200 to-yellow-700', createdAt: '5 MAR 2025', updatedAt: '5 MAR 2025' },
  { id: 'd6', name: 'Geometric Dawn', tool: 'petak', thumbnail: 'bg-gradient-to-br from-orange-200 via-stone-300 to-green-800', createdAt: '3 MAR 2025', updatedAt: '3 MAR 2025' },
  { id: 'd7', name: 'Floral Heritage', tool: 'atelier', thumbnail: 'bg-gradient-to-br from-stone-100 via-lime-300 to-green-700', createdAt: '28 FEB 2025', updatedAt: '28 FEB 2025' },
  { id: 'd8', name: 'Signature Gold', tool: 'monogram', thumbnail: 'bg-gradient-to-br from-gray-950 via-gray-800 to-amber-400', createdAt: '25 FEB 2025', updatedAt: '25 FEB 2025' },
  { id: 'd9', name: 'Tile Mosaic', tool: 'petak', thumbnail: 'bg-gradient-to-br from-stone-200 via-orange-400 to-green-800', createdAt: '22 FEB 2025', updatedAt: '22 FEB 2025' },
  { id: 'd10', name: 'Crimson Tide', tool: 'atelier', thumbnail: 'bg-gradient-to-br from-rose-900 via-pink-800 to-rose-300', createdAt: '20 FEB 2025', updatedAt: '20 FEB 2025' },
  { id: 'd11', name: 'Monogram NA', tool: 'monogram', thumbnail: 'bg-gradient-to-br from-stone-50 via-amber-200 to-amber-400', createdAt: '18 FEB 2025', updatedAt: '18 FEB 2025' },
  { id: 'd12', name: 'Grid Pattern 3', tool: 'petak', thumbnail: 'bg-gradient-to-br from-stone-300 via-stone-400 to-gray-600', createdAt: '15 FEB 2025', updatedAt: '15 FEB 2025' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'NK-2025-0048', userId: 'u1', userName: 'Aisha R.', designId: 'd1', designName: 'Garden in Dusk', tool: 'atelier', size: '90 x 90 CM', amount: 180, currency: 'BND', status: 'submitted', notes: '', adminNotes: '', createdAt: '20 MAR 2025', updatedAt: '20 MAR 2025' },
  { id: 'NK-2025-0045', userId: 'u1', userName: 'Aisha R.', designId: 'd2', designName: 'Monogram AR', tool: 'monogram', size: '90 x 90 CM', amount: 180, currency: 'BND', status: 'changes_requested', notes: '', adminNotes: 'Please adjust the gold tone to be more muted', createdAt: '18 MAR 2025', updatedAt: '19 MAR 2025' },
  { id: 'NK-2025-0042', userId: 'u1', userName: 'Aisha R.', designId: 'd3', designName: 'Petak Sand', tool: 'petak', size: '90 x 90 CM', amount: 180, currency: 'BND', status: 'in_production', notes: '', adminNotes: '', createdAt: '15 MAR 2025', updatedAt: '17 MAR 2025' },
  { id: 'NK-2025-0038', userId: 'u1', userName: 'Aisha R.', designId: 'd4', designName: 'Floral Heritage', tool: 'atelier', size: '70 x 70 CM', amount: 150, currency: 'BND', status: 'ready_for_collection', notes: '', adminNotes: '', createdAt: '10 MAR 2025', updatedAt: '18 MAR 2025' },
  { id: 'NK-2025-0031', userId: 'u1', userName: 'Aisha R.', designId: 'd5', designName: 'Midnight Bloom', tool: 'atelier', size: '110 x 110 CM', amount: 250, currency: 'BND', status: 'completed', notes: '', adminNotes: '', createdAt: '28 FEB 2025', updatedAt: '15 MAR 2025' },
  { id: 'NK-2025-0028', userId: 'u1', userName: 'Aisha R.', designId: 'd6', designName: 'Geometric Dawn', tool: 'petak', size: '90 x 90 CM', amount: 180, currency: 'BND', status: 'completed', notes: '', adminNotes: '', createdAt: '20 FEB 2025', updatedAt: '10 MAR 2025' },
];

export const ADMIN_MOCK_ORDERS: Order[] = [
  ...MOCK_ORDERS,
  { id: 'NK-2025-0047', userId: 'u3', userName: 'Sarah K.', designId: 'd8', designName: 'Monogram SK', tool: 'monogram', size: '100 x 100 CM', amount: 220, currency: 'BND', status: 'paid_pending_production', notes: '', adminNotes: '', createdAt: '19 MAR 2025', updatedAt: '19 MAR 2025' },
  { id: 'NK-2025-0044', userId: 'u4', userName: 'Maria L.', designId: 'd9', designName: 'Petak Bloom', tool: 'petak', size: '90 x 90 CM', amount: 180, currency: 'BND', status: 'in_production', notes: '', adminNotes: '', createdAt: '17 MAR 2025', updatedAt: '18 MAR 2025' },
];

export const DASHBOARD_STATS: DashboardStats = {
  totalMembers: 1247,
  membersTrend: '+12 this week',
  activeOrders: 34,
  pendingApproval: 8,
  designsThisMonth: 892,
  designsTrend: '+23% vs last month',
  revenue: '$12,450',
};

export const ACTIVITY_FEED = [
  { type: 'join', user: 'Aisha R.', action: 'joined as Atelier Collector', time: '2h ago', icon: 'UserPlus' },
  { type: 'upload', user: 'System', action: 'New artwork \'Floral Heritage\' added', time: '4h ago', icon: 'Upload' },
  { type: 'design', user: 'Sarah K.', action: 'saved a Monogram design', time: '5h ago', icon: 'Paintbrush' },
  { type: 'order', user: 'Aisha R.', action: 'submitted order NK-2025-0048', time: '6h ago', icon: 'ShoppingBag' },
  { type: 'status', user: 'Admin', action: 'Order NK-2025-0038 marked ready', time: '8h ago', icon: 'CheckCircle' },
];

export const ADMIN_MEMBERS = [
  { id: 'u1', name: 'Aisha Rahman', email: 'aisha@email.com', role: 'member' as const, tier: 'Atelier Collector', designs: 12, orders: 5, lastActive: '2h ago', status: 'Active', joined: '15 JAN 2025' },
  { id: 'u3', name: 'Sarah Khaled', email: 'sarah@email.com', role: 'member' as const, tier: 'Member', designs: 8, orders: 2, lastActive: '1d ago', status: 'Active', joined: '3 FEB 2025' },
  { id: 'u4', name: 'Maria Lim', email: 'maria@email.com', role: 'member' as const, tier: 'Atelier Collector', designs: 5, orders: 3, lastActive: '5h ago', status: 'Active', joined: '20 FEB 2025' },
  { id: 'u5', name: 'Leila Hassan', email: 'leila@email.com', role: 'member' as const, tier: 'Member', designs: 3, orders: 1, lastActive: '3d ago', status: 'Inactive', joined: '1 MAR 2025' },
  { id: 'u2', name: 'Admin User', email: 'admin@nahkya.com', role: 'super_admin' as const, tier: '-', designs: 0, orders: 0, lastActive: 'Now', status: 'Active', joined: '1 JAN 2025' },
];

export const ADMIN_ARTWORKS = [
  { id: 'art1', name: 'Floral Heritage', category: 'Floral', available: true },
  { id: 'art2', name: 'Garden in Dusk', category: 'Floral', available: true },
  { id: 'art3', name: 'Midnight Bloom', category: 'Floral', available: true },
  { id: 'art4', name: 'Geometric Dawn', category: 'Geometric', available: true },
  { id: 'art5', name: 'Songket Pattern A', category: 'Heritage', available: true },
  { id: 'art6', name: 'Minimal Lines', category: 'Minimal', available: false },
];
