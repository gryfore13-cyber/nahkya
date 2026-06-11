import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { AdminFilterTabs } from '@/components/admin/AdminFilterTabs';
import { ORDER_STATUS_CONFIG, STATUS_TRANSITIONS } from '@/lib/constants';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useOrderStore } from '@/stores/orderStore';
import { useCommissionStore } from '@/stores/commissionStore';
import { useDesignerStore } from '@/stores/designerStore';
import type { OrderStatus } from '@/types';

const FILTER_TABS = [
  { key: 'All', label: 'All' },
  { key: 'Submitted', label: 'Submitted' },
  { key: 'Changes Requested', label: 'Changes Requested' },
  { key: 'Approved', label: 'Approved' },
  { key: 'In Production', label: 'In Production' },
  { key: 'Ready', label: 'Ready' },
  { key: 'Completed', label: 'Completed' },
];

export default function AdminOrders() {
  const { orders, fetchOrders, updateStatus } = useOrderStore();
  const { createCommission, fetchCommissions } = useCommissionStore();
  const { designers, fetchDesigners } = useDesignerStore();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchDesigners();
    fetchCommissions();
    fetchOrders();
  }, [fetchDesigners, fetchCommissions, fetchOrders]);

  const order = orders.find((o) => o.id === selected);
  const filtered = filter === 'All' ? orders : orders.filter((o) => {
    const label = ORDER_STATUS_CONFIG[o.status]?.label;
    return label === filter;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateStatus(orderId, newStatus);
    setStatusDropdown(null);

    // Auto-create commission when order becomes paid_pending_production
    if (newStatus === 'paid_pending_production') {
      const updatedOrder = orders.find((o) => o.id === orderId);
      if (updatedOrder?.designerId) {
        const designer = designers.find((d) => d.id === updatedOrder.designerId);
        if (designer) {
          await createCommission({
            orderId: updatedOrder.id,
            designerId: designer.id,
            designerName: designer.name,
            artworkId: updatedOrder.artworkId || '',
            artworkName: updatedOrder.artworkName || updatedOrder.designName || '',
            orderAmount: updatedOrder.amount,
            commissionAmount: designer.commissionRate,
            status: 'pending',
            paidAt: null,
          });
        }
      }
    }
  };

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Orders</h1>
      <p className="text-body-md text-nahkya-text-secondary font-body mb-8">Manage member submissions and production workflow.</p>

      <AdminFilterTabs tabs={FILTER_TABS} active={filter} onChange={setFilter} className="mb-6" />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase ">{filtered.length} orders</p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-secondary" strokeWidth={1.5} />
            <input placeholder="Search orders..." className="pl-10 pr-4 py-2 bg-nahkya-surface border border-nahkya-border text-nahkya-text text-body-sm rounded-nahkya focus:outline-none focus:border-nahkya-highlight w-52 font-body" />
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="bg-nahkya-surface border border-nahkya-border rounded-nahkya overflow-hidden">
        <div className="hidden lg:grid gap-3 px-5 py-3 border-b-2 border-nahkya-text nk-admin-orders-grid">
          {['Order ID', 'Member', 'Design', 'Tool', 'Size', 'Amount', 'Submitted', 'Status', ''].map((h) => (
            <span key={h} className="font-mono text-mono-sm font-medium uppercase  text-nahkya-text-secondary">{h}</span>
          ))}
        </div>
        {filtered.map((o, i) => (
          <div key={o.id}
            className={cn('nk-admin-orders-grid gap-3 px-5 py-3.5 items-center cursor-pointer', i < filtered.length - 1 ? 'border-b border-nahkya-border' : '', 'hover:bg-nahkya-bg transition-colors')}
            onClick={() => setSelected(o.id)}>
            <span className="font-mono text-mono-sm text-nahkya-text-secondary">{o.id}</span>
            <span className="text-sm text-nahkya-text font-body">{o.userName}</span>
            <span className="text-sm text-nahkya-text font-body">{o.designName}</span>
            <span className="font-mono text-mono-sm text-nahkya-highlight uppercase tracking-label">{o.tool}</span>
            <span className="font-mono text-mono-sm text-nahkya-text-secondary">{o.size}</span>
            <span className="font-mono text-mono-sm text-nahkya-text">${o.amount}</span>
            <span className="font-mono text-mono-sm text-nahkya-text-secondary">{o.createdAt}</span>
            <div className="relative" onClick={(e) => { e.stopPropagation(); setStatusDropdown(statusDropdown === o.id ? null : o.id); }}>
              <StatusBadge status={o.status} />
              {statusDropdown === o.id && (
                <div className="absolute z-nav top-full mt-1 left-0 bg-nahkya-bg border border-nahkya-border rounded-nahkya shadow-lg py-1 w-48">
                  {(STATUS_TRANSITIONS[o.status] || []).map((s) => (
                    <button key={s} onClick={() => handleStatusChange(o.id, s as OrderStatus)}
                      className="w-full text-left px-3 py-2 text-body-sm font-body text-nahkya-text hover:bg-nahkya-surface transition-colors capitalize">
                      {s.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="font-mono text-mono-sm text-nahkya-highlight cursor-pointer">View</span>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {order && (
        <div className="fixed inset-0 z-modal flex items-center justify-center" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-nahkya-text/50" />
          <div className="relative bg-nahkya-bg border border-nahkya-border rounded-nahkya w-full max-w-content-lg max-h-90vh overflow-y-auto p-12" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-nahkya-text-secondary hover:text-nahkya-text"><X className="w-5 h-5" /></button>
            <p className="font-mono text-mono-lg text-nahkya-highlight uppercase  mb-4">ORDER {order.id}</p>
            <div className="w-52 h-50 bg-nahkya-surface mx-auto mb-8 rounded-nahkya flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-nahkya-bg to-nahkya-highlight rounded-nahkya" />
            </div>
            <h3 className="font-display text-2xl text-nahkya-text font-medium text-center mb-6">{order.designName}</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Tool', value: order.tool },
                { label: 'Size', value: order.size },
                { label: 'Submitted', value: order.createdAt },
                { label: 'Status', value: <StatusBadge status={order.status} /> },
              ].map((item) => (
                <div key={item.label} className="bg-nahkya-surface p-4 rounded-nahkya">
                  <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-label mb-1">{item.label}</p>
                  <div className="text-sm text-nahkya-text font-body">{item.value}</div>
                </div>
              ))}
            </div>
            {order.designerName && (
              <div className="bg-nahkya-surface border border-nahkya-border p-4 rounded-nahkya mb-6">
                <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-label mb-2">Designer</p>
                <p className="text-sm text-nahkya-text font-body">{order.designerName}</p>
              </div>
            )}
            {order.adminNotes && (
              <div className="bg-nahkya-surface border border-nahkya-border p-4 rounded-nahkya mb-6">
                <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-label mb-2">Admin Notes</p>
                <p className="text-sm text-nahkya-text font-body">{order.adminNotes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
