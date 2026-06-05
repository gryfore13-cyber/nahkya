import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useCommissionStore } from '@/stores/commissionStore';
import { useDesignerStore } from '@/stores/designerStore';
import { useAuthStore } from '@/stores/authStore';

export default function DesignerEarnings() {
  const { user } = useAuthStore();
  const { designers } = useDesignerStore();
  const { commissions, fetchCommissionsByDesigner } = useCommissionStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');

  const designer = designers.find((d) => d.email === user?.email) || designers[0];

  useEffect(() => {
    const id = designer?.id || user?.uid || '';
    if (id) {
      fetchCommissionsByDesigner(id);
    }
  }, [designer?.id, user?.uid, fetchCommissionsByDesigner]);

  const myCommissions = commissions;

  const filtered = myCommissions.filter((c) => {
    const matchesSearch =
      c.artworkName.toLowerCase().includes(search.toLowerCase()) ||
      c.orderId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalEarned = myCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const pending = myCommissions.filter((c) => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0);
  const paid = myCommissions.filter((c) => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0);

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">My Earnings</h1>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">
        Commission history for {designer?.name || user?.displayName || 'your account'}.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Earned', value: `BND ${totalEarned.toFixed(2)}`, icon: DollarSign, color: 'text-nahkya-gold' },
          { label: 'Pending', value: `BND ${pending.toFixed(2)}`, icon: Clock, color: 'text-nahkya-error' },
          { label: 'Paid Out', value: `BND ${paid.toFixed(2)}`, icon: CheckCircle, color: 'text-nahkya-success' },
        ].map((card) => (
          <div key={card.label} className="bg-workspace-panel border border-workspace-border rounded-nahkya p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label">{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.color}`} strokeWidth={1.5} />
            </div>
            <p className="font-display text-2xl text-nahkya-text font-medium">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-content">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-muted" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search earnings..."
            className="pl-10 pr-4 py-2 bg-workspace-panel border border-workspace-border text-nahkya-text text-body-sm rounded-nahkya focus:outline-none focus:border-nahkya-gold w-full font-body placeholder:text-nahkya-text-muted/40"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'paid'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 bg-workspace-panel border rounded-nahkya font-mono text-mono-sm font-medium uppercase tracking-label transition-colors ${
                filter === f ? 'border-nahkya-gold bg-nahkya-gold/15 text-nahkya-gold' : 'border-workspace-border text-nahkya-text-muted hover:border-nahkya-gold/40'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-workspace-panel border border-workspace-border rounded-nahkya overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_1fr_80px_100px_100px_100px] gap-3 px-5 py-3 border-b border-workspace-border">
          {['Artwork', 'Order', 'Amount', 'Commission', 'Status', 'Date'].map((h) => (
            <span key={h} className="font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted">{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-nahkya-text-muted font-body">
            {myCommissions.length === 0
              ? 'No commissions yet. When a member orders a scarf using your artwork, you will see it here.'
              : 'No commissions match your search.'}
          </div>
        ) : (
          filtered.map((c, i) => (
            <div
              key={c.id}
              className={`grid grid-cols-1 lg:grid-cols-[1fr_1fr_80px_100px_100px_100px] gap-3 px-5 py-3.5 items-center ${
                i < filtered.length - 1 ? 'border-b border-workspace-border' : ''
              } hover:bg-workspace-hover transition-colors`}
            >
              <span className="text-sm text-nahkya-text font-body">{c.artworkName}</span>
              <span className="font-mono text-mono-sm text-nahkya-text-muted">{c.orderId}</span>
              <span className="font-mono text-mono-sm text-nahkya-text">BND {c.orderAmount}</span>
              <span className="font-mono text-mono-sm text-nahkya-gold uppercase">BND {c.commissionAmount}</span>
              <span className={cn('font-mono text-mono-sm uppercase ', c.status === 'paid' ? 'text-nahkya-success' : 'text-nahkya-error')}>
                {c.status}
              </span>
              <span className="font-mono text-mono-sm text-nahkya-text-muted">
                {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
