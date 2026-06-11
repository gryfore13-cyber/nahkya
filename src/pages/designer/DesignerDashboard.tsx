import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DollarSign, Palette, TrendingUp, Package } from 'lucide-react';
import { useCommissionStore } from '@/stores/commissionStore';
import { useDesignerStore } from '@/stores/designerStore';
import { useAuthStore } from '@/stores/authStore';
import { Link } from 'react-router-dom';

export default function DesignerDashboard() {
  const { user } = useAuthStore();
  const { designers } = useDesignerStore();
  const { commissions, fetchCommissions } = useCommissionStore();

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const designer = designers.find((d) => d.email === user?.email) || designers[0];
  const myCommissions = commissions.filter((c) => c.designerId === designer?.id);
  const totalEarned = myCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const pending = myCommissions.filter((c) => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0);
  const paid = myCommissions.filter((c) => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0);
  const thisMonth = myCommissions.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, c) => sum + c.commissionAmount, 0);

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-1">
          Welcome back, {designer?.name || user?.displayName || 'Designer'}
        </h1>
        <p className="text-body-md text-nahkya-text-secondary font-body">
          Here is how your work is performing this month.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Earned', value: `BND ${totalEarned.toFixed(2)}`, icon: DollarSign, color: 'text-nahkya-highlight' },
          { label: 'Pending', value: `BND ${pending.toFixed(2)}`, icon: Package, color: 'text-nahkya-error' },
          { label: 'Paid Out', value: `BND ${paid.toFixed(2)}`, icon: TrendingUp, color: 'text-nahkya-success' },
          { label: 'This Month', value: `BND ${thisMonth.toFixed(2)}`, icon: Palette, color: 'text-nahkya-text' },
        ].map((card) => (
          <div key={card.label} className="bg-nahkya-surface border border-nahkya-border rounded-nahkya p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-label">{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.color}`} strokeWidth={1.5} />
            </div>
            <p className="font-display text-2xl text-nahkya-text font-medium">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Commissions */}
      <div className="bg-nahkya-surface border border-nahkya-border rounded-nahkya overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-nahkya-border">
          <h2 className="font-display text-lg text-nahkya-text font-medium">Recent Commissions</h2>
          <Link to="/designer/earnings" className="text-sm text-nahkya-highlight font-body hover:text-nahkya-border transition-colors">
            View All &rarr;
          </Link>
        </div>
        {myCommissions.length === 0 ? (
          <div className="px-5 py-12 text-center text-nahkya-text-secondary font-body">
            No commissions yet. When a member orders a scarf using your artwork, you will see it here.
          </div>
        ) : (
          <div>
            <div className="hidden lg:grid gap-3 px-5 py-3 border-b border-nahkya-border" style={{ gridTemplateColumns: '1fr 1fr 80px 100px 100px' }}>
              {['Artwork', 'Order', 'Amount', 'Commission', 'Status'].map((h) => (
                <span key={h} className="font-mono text-mono-sm font-medium uppercase text-nahkya-text-secondary">{h}</span>
              ))}
            </div>
            {myCommissions.slice(0, 5).map((c, i) => (
              <div
                key={c.id}
                className={`grid gap-3 px-5 py-3.5 items-center ${
                  i < Math.min(myCommissions.length, 5) - 1 ? 'border-b border-nahkya-border' : ''
                }`}
                style={{ gridTemplateColumns: '1fr 1fr 80px 100px 100px' }}
              >
                <span className="text-sm text-nahkya-text font-body">{c.artworkName}</span>
                <span className="font-mono text-mono-sm text-nahkya-text-secondary">{c.orderId}</span>
                <span className="font-mono text-mono-sm text-nahkya-text">BND {c.orderAmount}</span>
                <span className="font-mono text-mono-sm text-nahkya-highlight uppercase">BND {c.commissionAmount}</span>
                <span className={cn('font-mono text-mono-sm uppercase ', c.status === 'paid' ? 'text-nahkya-success' : 'text-nahkya-error')}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
