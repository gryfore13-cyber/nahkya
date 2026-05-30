export type UserRole = 'member' | 'writer' | 'operations' | 'super_admin' | 'designer';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  membershipTier: 'free' | 'collector';
  avatar?: string;
  approvalStatus: ApprovalStatus;
  registeredAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export type OrderStatus =
  | 'submitted'
  | 'changes_requested'
  | 'approved_awaiting_payment'
  | 'paid_pending_production'
  | 'in_production'
  | 'ready_for_collection'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'payment_expired';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  designId: string;
  designName: string;
  artworkId?: string;
  artworkName?: string;
  designerId?: string;
  designerName?: string;
  tool: 'atelier' | 'monogram' | 'petak';
  size: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  notes: string;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Colour {
  id: string;
  name: string;
  hex: string;
}

export interface ColourCategory {
  id: string;
  name: string;
  colours: Colour[];
  columns: number;
  isSystem?: boolean;
}

export interface SavedDesign {
  id: string;
  name: string;
  tool: 'atelier' | 'monogram' | 'petak';
  thumbnail: string;
  userId?: string;
  snapshot?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface EditorialArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  column: 'by-nahkya' | 'silk-report' | 'herstory' | 'silk-wire';
  author: string;
  date: string;
  image: string;
  readTime?: string;
  featured?: boolean;
}

export type Layer = 'silk' | 'motif' | 'ink';

export type RepeatType = 'grid' | 'diagonal' | 'brick';

export type ScarfSize = '70' | '90' | '100' | '110';

export interface Designer {
  id: string;
  name: string;
  email: string;
  commissionRate: number;
  bio: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ArtworkStatus = 'pending_review' | 'approved' | 'rejected';

export interface ArtworkDoc {
  id: string;
  name: string;
  category: string;
  image?: string;
  thumbnail?: string;
  description: string;
  designerId: string;
  designerName: string;
  status: ArtworkStatus;
  reviewNotes: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  orderId: string;
  designerId: string;
  designerName: string;
  artworkId: string;
  artworkName: string;
  orderAmount: number;
  commissionAmount: number;
  status: 'pending' | 'paid';
  createdAt: string;
  paidAt: string | null;
}

export interface DashboardStats {
  totalMembers: number;
  membersTrend: string;
  activeOrders: number;
  pendingApproval: number;
  designsThisMonth: number;
  designsTrend: string;
  revenue: string;
}

// ── Monogram Engine Types ──

export interface MonogramLetter {
  id: string;
  char: string;
  fontId: 'classic-serif' | 'modern-sans' | 'fashion-serif';
  fontSize: number;
  rotation: number;
  x: number; // 0–100 percentage within tile
  y: number; // 0–100 percentage within tile
  color: string;
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
}

export interface MonogramConfig {
  baseColor: string;
  borderColor: string;
  border2Color: string;
  previewTiles: number;
  tileSpacingCm: number;
  showBorder: boolean;
  borderThicknessCm: number;
  showBorder2: boolean;
  borderThicknessCm2: number;
  borderGapCm: number;
  snapEnabled: boolean;
  showSourceGuides: boolean;
  moveAsGroup: boolean;
  zoom: number;
  viewMode: 'both' | 'workspace' | 'preview';
}

export interface MonogramSnapshot {
  letters: MonogramLetter[];
  config: MonogramConfig;
  selectedLetterId: string;
}

export interface MonogramDragState {
  letterId: string;
  mode: 'move' | 'resize' | 'rotate';
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origFontSize: number;
  origRotation: number;
  resizeCorner?: 'nw' | 'ne' | 'sw' | 'se';
}

export interface MonogramSnapGuides {
  x: number | null;
  y: number | null;
}
