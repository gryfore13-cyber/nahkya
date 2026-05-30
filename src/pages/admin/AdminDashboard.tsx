import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, ShoppingBag, Palette, DollarSign, Upload, Paintbrush, CheckCircle } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { useUserStore } from '@/stores/userStore';
import { useArtworkStore } from '@/stores/artworkStore';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function AdminDashboard() {
  const { orders, fetchOrders } = useOrderStore();
  const { users, fetchUsers } = useUserStore();
  const { artworks, fetchArtworks } = useArtworkStore();

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchArtworks();
  }, [fetchOrders, fetchUsers, fetchArtworks]);

  const memberCount = users.filter((u) => u.role === 'member').length;
  const activeOrders = orders.filter((o) =>
    o.status === 'submitted' || o.status === 'changes_requested' || o.status === 'approved_awaiting_payment'
  ).length;
  const pendingApproval = orders.filter((o) => o.status === 'submitted').length;
  const approvedArtworks = artworks.filter((a) => a.status === 'approved').length;
  const pendingArtworks = artworks.filter((a) => a.status === 'pending_review').length;
  const revenue = orders
    .filter((o) => ['paid_pending_production', 'in_production', 'ready_for_collection', 'completed'].includes(o.status))
    .reduce((sum, o) => sum + o.amount, 0);

  // Build activity feed from real data
  const recentOrders = [...orders].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Dashboard</h1>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">Overview of your atelier.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Members', value: memberCount.toLocaleString(), trend: 'registered users', icon: TrendingUp, color: 'text-nahkya-success' },
          { label: 'Orders in Pipeline', value: String(activeOrders), trend: `${pendingApproval} pending approval`, icon: ShoppingBag, color: 'text-nahkya-gold' },
          { label: 'Artworks', value: String(approvedArtworks), trend: `${pendingArtworks} pending review`, icon: Palette, color: 'text-nahkya-success' },
          { label: 'Revenue', value: `BND ${revenue.toLocaleString()}`, trend: 'from paid orders', icon: DollarSign, color: 'text-nahkya-text' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya p-6">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-4 h-4 ${s.color}`} strokeWidth={1.5} />
              </div>
              <p className="font-display text-heading-sm text-nahkya-text font-medium">{s.value}</p>
              <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label mt-1">{s.trend}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya overflow-hidden">
          <div className="px-5 py-4 border-b border-nahkya-gold-soft">
            <h2 className="font-display text-lg text-nahkya-text font-medium">Recent Orders</h2>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-5 py-8 text-center text-nahkya-text-muted font-body">No orders yet.</div>
          ) : (
            recentOrders.map((o, i) => (
              <div key={o.id} className={cn('flex items-center justify-between px-5 py-3.5 ', i < recentOrders.length - 1 ? 'border-b border-nahkya-gold-soft' : '')}>
                <div>
                  <p className="text-sm text-nahkya-text font-body">{o.designName}</p>
                  <p className="font-mono text-mono-sm text-nahkya-text-muted">{o.userName} · {o.createdAt}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))
          )}
        </div>

        {/* Activity */}
        <div className="bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya overflow-hidden">
          <div className="px-5 py-4 border-b border-nahkya-gold-soft">
            <h2 className="font-display text-lg text-nahkya-text font-medium">Activity</h2>
          </div>
          {recentOrders.length === 0 && pendingArtworks === 0 ? (
            <div className="px-5 py-8 text-center text-nahkya-text-muted font-body">No recent activity.</div>
          ) : (
            <div className="px-5 py-4 space-y-4">
              {pendingArtworks > 0 && (
                <div className="flex items-start gap-3 pb-4 border-b border-nahkya-gold-soft">
                  <Upload className="w-4 h-4 text-nahkya-gold mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-nahkya-text font-body">{pendingArtworks} artwork{pendingArtworks > 1 ? 's' : ''} pending review</p>
                    <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">Designer submissions</p>
                  </div>
                </div>
              )}
              {recentOrders.slice(0, 3).map((o) => (
                <div key={o.id} className="flex items-start gap-3">
                  {o.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-nahkya-success mt-0.5" strokeWidth={1.5} />
                  ) : o.status === 'submitted' ? (
                    <Paintbrush className="w-4 h-4 text-nahkya-gold mt-0.5" strokeWidth={1.5} />
                  ) : (
                    <ShoppingBag className="w-4 h-4 text-nahkya-text-muted mt-0.5" strokeWidth={1.5} />
                  )}
                  <div>
                    <p className="text-sm text-nahkya-text font-body">
                      Order <span className="font-mono text-mono-sm">{o.id}</span> — {o.status.replace(/_/g, ' ')}
                    </p>
                    <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase">{o.userName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
