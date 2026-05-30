// NAHKYA Colour Palette
export const NAHKYA_COLORS = {
  ivory: '#F5EDE3',
  cream: '#EDE5DA',
  stone: '#DCC6A1',
  taupe: '#9A8A7A',
  sand: '#B89A7A',
  charcoal: '#2C2420',
  softBlack: '#1A1A1E',
  gold: '#B88B4A',
  goldLight: '#D4B896',
  goldMuted: '#9A7B52',
  textSecondary: '#8A7A6E',
  error: '#C45B4A',
  errorLight: '#F5E0DC',
  success: '#5A8A6E',
  successLight: '#E0F0E5',
} as const;

// Curated Pigment Palettes
export const PIGMENT_PALETTES = [
  {
    name: 'Dusk',
    colours: [
      { id: 'd1', name: 'Midnight', hex: '#1A1A3E' },
      { id: 'd2', name: 'Indigo', hex: '#2E2A5A' },
      { id: 'd3', name: 'Plum', hex: '#4A2C4A' },
      { id: 'd4', name: 'Wine', hex: '#5A1A2A' },
      { id: 'd5', name: 'Dusk Rose', hex: '#8A4A6A' },
      { id: 'd6', name: 'Lavender', hex: '#6A5A8A' },
    ],
  },
  {
    name: 'Moss Garden',
    colours: [
      { id: 'm1', name: 'Forest', hex: '#2A4A2A' },
      { id: 'm2', name: 'Pine', hex: '#3A5A3A' },
      { id: 'm3', name: 'Sage', hex: '#7A9A6A' },
      { id: 'm4', name: 'Olive', hex: '#5A6A3A' },
      { id: 'm5', name: 'Moss', hex: '#4A6B4A' },
      { id: 'm6', name: 'Pale Sage', hex: '#B8C4A0' },
    ],
  },
  {
    name: 'Desert Bloom',
    colours: [
      { id: 'db1', name: 'Terracotta', hex: '#C4856A' },
      { id: 'db2', name: 'Sienna', hex: '#A07050' },
      { id: 'db3', name: 'Dusty Rose', hex: '#C4908A' },
      { id: 'db4', name: 'Warm Sand', hex: '#D4A574' },
      { id: 'db5', name: 'Cream Sand', hex: '#E8D5C4' },
      { id: 'db6', name: 'Clay', hex: '#B87050' },
    ],
  },
  {
    name: 'Silk',
    colours: [
      { id: 's1', name: 'Ivory', hex: '#F4F2EE' },
      { id: 's2', name: 'Cream', hex: '#FAF9F7' },
      { id: 's3', name: 'Champagne', hex: '#E8E0D0' },
      { id: 's4', name: 'Pearl', hex: '#E0D8D0' },
      { id: 's5', name: 'Stone', hex: '#E8E5E0' },
      { id: 's6', name: 'Sand', hex: '#D4CFC5' },
    ],
  },
  {
    name: 'Ink',
    colours: [
      { id: 'i1', name: 'Charcoal', hex: '#111114' },
      { id: 'i2', name: 'Graphite', hex: '#2A2A2E' },
      { id: 'i3', name: 'Slate', hex: '#4A4A4E' },
      { id: 'i4', name: 'Pewter', hex: '#6A6A6E' },
      { id: 'i5', name: 'Ash', hex: '#8A8A8E' },
      { id: 'i6', name: 'Silver', hex: '#B0B0B4' },
    ],
  },
  {
    name: 'Gold',
    colours: [
      { id: 'g1', name: 'Antique Gold', hex: '#D8A34A' },
      { id: 'g2', name: 'Amber', hex: '#C89030' },
      { id: 'g3', name: 'Bronze', hex: '#A07830' },
      { id: 'g4', name: 'Champagne Gold', hex: '#E8C97A' },
      { id: 'g5', name: 'Deep Gold', hex: '#B8942E' },
      { id: 'g6', name: 'Pale Gold', hex: '#E8D8A0' },
    ],
  },
];

// Monogram Fonts
export const MONOGRAM_FONTS = [
  { name: 'Bodoni Moda', value: 'Bodoni Moda' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond' },
  { name: 'Cinzel', value: 'Cinzel' },
  { name: 'Great Vibes', value: 'Great Vibes' },
  { name: 'Allura', value: 'Allura' },
];

// Scarf Sizes
export const SCARF_SIZES = [
  { label: '70 \u00D7 70 cm', value: '70' as const },
  { label: '90 \u00D7 90 cm', value: '90' as const },
  { label: '100 \u00D7 100 cm', value: '100' as const },
  { label: '110 \u00D7 110 cm', value: '110' as const },
];

// Order Status Config
export const ORDER_STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  submitted: { label: 'Submitted', bg: 'bg-nahkya-gold-soft', text: 'text-nahkya-text' },
  changes_requested: { label: 'Changes Requested', bg: 'bg-nahkya-error-soft', text: 'text-nahkya-error' },
  approved_awaiting_payment: { label: 'Approved', bg: 'bg-nahkya-gold/15', text: 'text-nahkya-gold-muted' },
  paid_pending_production: { label: 'Paid', bg: 'bg-nahkya-success-soft', text: 'text-nahkya-success' },
  in_production: { label: 'In Production', bg: 'bg-nahkya-success-soft', text: 'text-nahkya-success' },
  ready_for_collection: { label: 'Ready', bg: 'bg-nahkya-success-soft', text: 'text-nahkya-success' },
  completed: { label: 'Completed', bg: 'bg-nahkya-success/15', text: 'text-nahkya-success' },
  rejected: { label: 'Rejected', bg: 'bg-nahkya-error-soft', text: 'text-nahkya-error' },
  cancelled: { label: 'Cancelled', bg: 'bg-nahkya-gold-soft', text: 'text-nahkya-text-muted' },
  payment_expired: { label: 'Payment Expired', bg: 'bg-nahkya-gold-soft', text: 'text-nahkya-text-muted' },
};

// Status Transitions
export const STATUS_TRANSITIONS: Record<string, string[]> = {
  submitted: ['changes_requested', 'approved_awaiting_payment', 'rejected'],
  changes_requested: ['submitted'],
  approved_awaiting_payment: ['paid_pending_production', 'cancelled', 'payment_expired'],
  paid_pending_production: ['in_production'],
  in_production: ['ready_for_collection'],
  ready_for_collection: ['completed'],
  completed: [],
  rejected: [],
  cancelled: [],
  payment_expired: [],
};

// Navigation
export const PUBLIC_NAV = [
  { label: 'The House', href: '/#brand' },
  { label: 'By Nahkya', href: '/by-nahkya' },
  { label: 'The Silk Report', href: '/silk-report' },
  { label: 'Herstory', href: '/herstory' },
  { label: 'Silk Wire', href: '/silk-wire' },
  { label: 'Membership', href: '/membership' },
];

export const MEMBER_NAV = [
  { label: 'Home', href: '/member/home', icon: 'Home' },
  { label: 'Atelier', href: '/member/atelier', icon: 'Paintbrush' },
  { label: 'Monogram', href: '/member/monogram', icon: 'Type' },
  { label: 'Petak', href: '/member/petak', icon: 'Grid3x3' },
  { label: 'Saved Designs', href: '/member/saved', icon: 'FolderOpen' },
  { label: 'My Orders', href: '/member/orders', icon: 'Package' },
  { label: 'Profile', href: '/member/profile', icon: 'User' },
];

export const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Content', href: '/admin/content', icon: 'FileText' },
  { label: 'Media Library', href: '/admin/media', icon: 'Image' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingBag' },
  { label: 'Members', href: '/admin/members', icon: 'Users' },
  { label: 'Artworks', href: '/admin/artworks', icon: 'Palette' },
  { label: 'Colour System', href: '/admin/colours', icon: 'Droplets' },
  { label: 'Site Appearance', href: '/admin/appearance', icon: 'Paintbrush' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
];
