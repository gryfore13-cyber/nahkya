import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
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
  const { orders, fetchOrders } = useOrderStore();
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const myOrders = orders.filter((o) => o.userId === user?.uid);
  const filtered = filter === 'all' ? myOrders : myOrders.filter((o) => o.status === filter);
  const order = myOrders.find((o) => o.id === selected);

  const counts = {
    all: myOrders.length,
    submitted: myOrders.filter((o) => o.status === 'submitted').length,
    in_production: myOrders.filter((o) => o.status === 'in_production').length,
    ready_for_collection: myOrders.filter((o) => o.status === 'ready_for_collection').length,
    completed: myOrders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">My Orders</h1>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">Track your scarf orders.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 bg-workspace-panel border rounded-nahkya font-mono text-mono-sm font-medium uppercase tracking-label transition-colors ${
              filter === f.key ? 'border-nahkya-gold bg-nahkya-gold/15 text-nahkya-gold' : 'border-workspace-border text-nahkya-text-muted hover:border-nahkya-gold/40'
            }`}>
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      <div className="bg-workspace-panel border border-workspace-border rounded-nahkya overflow-hidden">
        <div className="hidden lg:grid grid-cols-[120px_1fr_80px_100px_100px_100px] gap-3 px-5 py-3 border-b border-workspace-border">
          {['Order ID', 'Design', 'Tool', 'Size', 'Submitted', 'Status'].map((h) => (
            <span key={h} className="font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted">{h}</span>
          ))}
        </div>
        {filtered.map((o, i) => (
          <div key={o.id}
            className={cn('grid grid-cols-1 lg:grid-cols-[120px_1fr_80px_100px_100px_100px] gap-3 px-5 py-3.5 items-center cursor-pointer ', i < filtered.length - 1 ? 'border-b border-workspace-border' : '', ' hover:bg-workspace-hover transition-colors')}
            onClick={() => setSelected(o.id)}>
            <span className="font-mono text-mono-sm text-nahkya-text-muted">{o.id}</span>
            <span className="text-sm text-nahkya-text font-body">{o.designName}</span>
            <span className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-label">{o.tool}</span>
            <span className="font-mono text-mono-sm text-nahkya-text-muted">{o.size}</span>
            <span className="font-mono text-mono-sm text-nahkya-text-muted">{o.createdAt}</span>
            <StatusBadge status={o.status} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-nahkya-text-muted font-body">No orders found.</div>
        )}
      </div>

      {order && (
        <div className="fixed inset-0 z-modal flex items-center justify-center" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-nahkya-charcoal/50" />
          <div className="relative bg-workspace-panel border border-workspace-border rounded-nahkya w-full max-w-content-lg max-h-[90vh] overflow-y-auto p-12" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-nahkya-text-muted hover:text-nahkya-text"><X className="w-5 h-5" /></button>
            <p className="font-mono text-mono-lg text-nahkya-gold uppercase mb-4">ORDER {order.id}</p>
            <h3 className="font-display text-2xl text-nahkya-text font-medium text-center mb-6">{order.designName}</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Tool', value: order.tool },
                { label: 'Size', value: order.size },
                { label: 'Submitted', value: order.createdAt },
                { label: 'Status', value: <StatusBadge status={order.status} /> },
              ].map((item) => (
                <div key={item.label} className="bg-workspace-bg p-4 rounded-nahkya">
                  <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label mb-1">{item.label}</p>
                  <div className="text-sm text-nahkya-text font-body">{item.value}</div>
                </div>
              ))}
            </div>
            {order.notes && (
              <div className="bg-workspace-bg border border-workspace-border p-4 rounded-nahkya">
                <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label mb-2">Notes</p>
                <p className="text-sm text-nahkya-text font-body">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
