import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, Package, Clock, CheckCircle } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/authStore';

const FILTERS = [
  { key: 'all' as const, label: 'All' },
  { key: 'submitted' as const, label: 'Submitted' },
  { key: 'in_production' as const, label: 'In Production' },
  { key: 'ready_for_collection' as const, label: 'Ready' },
  { key: 'completed' as const, label: 'Completed' },
];

export default function Orders() {
  const { user } = useAuthStore();
  const { orders, fetchOrdersByUser } = useOrderStore();
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      fetchOrdersByUser(user.uid);
    }
  }, [fetchOrdersByUser, user?.uid]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const order = orders.find((o) => o.id === selected);

  const counts = {
    all: orders.length,
    submitted: orders.filter((o) => o.status === 'submitted').length,
    in_production: orders.filter((o) => o.status === 'in_production').length,
    ready_for_collection: orders.filter((o) => o.status === 'ready_for_collection').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div className="p-5 sm:p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">My Orders</h1>
      <p className="text-body-md text-nahkya-text-secondary font-body mb-8">Track your scarf orders.</p>

      {/* Filter chips — horizontal scroll on mobile */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={cn(
              'px-4 py-2 bg-nahkya-surface border rounded-nahkya font-mono text-mono-sm font-medium uppercase tracking-label transition-colors min-h-[44px]',
              filter === f.key ? 'border-nahkya-highlight bg-nahkya-highlight/15 text-nahkya-highlight' : 'border-nahkya-border text-nahkya-text-secondary hover:border-nahkya-highlight/40'
            )}>
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden lg:block bg-nahkya-surface border border-nahkya-border rounded-nahkya overflow-hidden">
        <div className="grid gap-3 px-5 py-3 border-b border-nahkya-border" style={{ gridTemplateColumns: '120px 1fr 80px 100px 100px 100px' }}>
          {['Order ID', 'Design', 'Tool', 'Size', 'Submitted', 'Status'].map((h) => (
            <span key={h} className="font-mono text-mono-sm font-medium uppercase text-nahkya-text-secondary">{h}</span>
          ))}
        </div>
        {filtered.map((o, i) => (
          <div key={o.id}
            className={cn('grid gap-3 px-5 py-3.5 items-center cursor-pointer ', i < filtered.length - 1 ? 'border-b border-nahkya-border' : '', ' hover:bg-nahkya-surface-raised transition-colors')}
            style={{ gridTemplateColumns: '120px 1fr 80px 100px 100px 100px' }}
            onClick={() => setSelected(o.id)}>
            <span className="font-mono text-mono-sm text-nahkya-text-secondary">{o.id}</span>
            <span className="text-sm text-nahkya-text font-body truncate">{o.designName}</span>
            <span className="font-mono text-mono-sm text-nahkya-highlight uppercase tracking-label">{o.tool}</span>
            <span className="font-mono text-mono-sm text-nahkya-text-secondary">{o.size}</span>
            <span className="font-mono text-mono-sm text-nahkya-text-secondary">{o.createdAt}</span>
            <StatusBadge status={o.status} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-nahkya-text-secondary font-body">No orders found.</div>
        )}
      </div>

      {/* Mobile/Tablet: card layout */}
      <div className="lg:hidden space-y-3">
        {filtered.map((o) => (
          <button
            key={o.id}
            className="w-full text-left bg-nahkya-surface border border-nahkya-border rounded-nahkya p-4 hover:bg-nahkya-surface-raised transition-colors"
            onClick={() => setSelected(o.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-mono-sm text-nahkya-text-secondary">{o.id}</span>
              <StatusBadge status={o.status} />
            </div>
            <p className="text-sm text-nahkya-text font-body mb-1">{o.designName}</p>
            <div className="flex items-center gap-3 text-body-xs text-nahkya-text-secondary font-mono uppercase tracking-label">
              <span>{o.tool}</span>
              <span className="w-px h-3 bg-nahkya-border" />
              <span>{o.size}</span>
            </div>
            <p className="text-body-2xs text-nahkya-text-secondary mt-2">{o.createdAt}</p>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="bg-nahkya-surface border border-nahkya-border rounded-nahkya p-12 text-center text-nahkya-text-secondary font-body">No orders found.</div>
        )}
      </div>

      {/* Order detail modal */}
      {order && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-nahkya-surface border border-nahkya-border rounded-nahkya w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-nahkya-border">
              <h2 className="font-display text-lg text-nahkya-text font-medium">Order Details</h2>
              <button onClick={() => setSelected(null)} className="w-9 h-9 flex items-center justify-center rounded-nahkya text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-highlight-subtle transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-nahkya-highlight" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-nahkya-text-secondary font-body">Design</p>
                  <p className="text-body-md text-nahkya-text font-body">{order.designName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-nahkya-highlight" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-nahkya-text-secondary font-body">Submitted</p>
                  <p className="text-body-md text-nahkya-text font-body">{order.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-nahkya-highlight" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-nahkya-text-secondary font-body">Status</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div className="pt-4 border-t border-nahkya-border">
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-nahkya-text-secondary font-body">Total</span>
                  <span className="font-display text-heading-md text-nahkya-text">BND {order.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
