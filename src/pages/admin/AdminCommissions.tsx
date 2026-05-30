import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, Download, CheckCircle, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { useCommissionStore } from '@/stores/commissionStore';
import { useDesignerStore } from '@/stores/designerStore';

const STATUS_FILTERS = ['All', 'Pending', 'Paid'] as const;

export default function AdminCommissions() {
  const { commissions, isLoading, fetchCommissions, markAsPaid } = useCommissionStore();
  const { designers, fetchDesigners } = useDesignerStore();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedDesigner, setSelectedDesigner] = useState<string>('all');

  useEffect(() => {
    fetchDesigners();
    fetchCommissions();
  }, [fetchDesigners, fetchCommissions]);

  const filtered = commissions.filter((c) => {
    const matchesStatus = filter === 'All' || c.status === filter.toLowerCase();
    const matchesSearch =
      c.designerName.toLowerCase().includes(search.toLowerCase()) ||
      c.orderId.toLowerCase().includes(search.toLowerCase()) ||
      c.artworkName.toLowerCase().includes(search.toLowerCase());
    const matchesDesigner = selectedDesigner === 'all' || c.designerId === selectedDesigner;
    return matchesStatus && matchesSearch && matchesDesigner;
  });

  const totalPending = commissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalPaid = commissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const thisMonth = commissions.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, c) => sum + c.commissionAmount, 0);

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Commissions</h1>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">
        Track and manage designer commissions across all orders.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Commissions', value: `BND ${(totalPending + totalPaid).toFixed(2)}`, icon: DollarSign, color: 'text-nahkya-gold' },
          { label: 'Pending Payouts', value: `BND ${totalPending.toFixed(2)}`, icon: Clock, color: 'text-nahkya-error' },
          { label: 'Paid Out', value: `BND ${totalPaid.toFixed(2)}`, icon: CheckCircle, color: 'text-nahkya-success' },
          { label: 'This Month', value: `BND ${thisMonth.toFixed(2)}`, icon: TrendingUp, color: 'text-nahkya-text' },
        ].map((card) => (
          <div key={card.label} className="bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya p-5">
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
            placeholder="Search commissions..."
            className="pl-10 pr-4 py-2 bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text text-body-sm rounded-nahkya focus:outline-none focus:border-nahkya-gold w-full font-body"
          />
        </div>
        <select
          value={selectedDesigner}
          onChange={(e) => setSelectedDesigner(e.target.value)}
          className="px-4 py-2 bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text text-body-sm rounded-nahkya focus:outline-none focus:border-nahkya-gold font-body"
        >
          <option value="all">All Designers</option>
          {designers.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 bg-nahkya-surface border rounded-nahkya font-mono text-mono-sm font-medium uppercase tracking-label transition-colors ${
                filter === f ? 'border-nahkya-charcoal bg-nahkya-burgundy text-nahkya-text-inverse' : 'border-nahkya-gold-soft text-nahkya-text-muted hover:border-nahkya-burgundy'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-nahkya-gold-soft text-body-sm font-body text-nahkya-text rounded-nahkya hover:border-nahkya-burgundy transition-colors ml-auto">
          <Download className="w-4 h-4" strokeWidth={1.5} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya overflow-hidden">
        <div className="hidden lg:grid grid-cols-[120px_1fr_1fr_80px_100px_100px_100px_80px] gap-3 px-5 py-3 border-b-2 border-nahkya-charcoal">
          {['Order ID', 'Designer', 'Artwork', 'Amount', 'Commission', 'Status', 'Date', ''].map((h) => (
            <span key={h} className="font-mono text-mono-sm font-medium uppercase text-nahkya-text-muted">{h}</span>
          ))}
        </div>
        {isLoading && (
          <div className="px-5 py-12 text-center text-nahkya-text-muted font-body">Loading commissions...</div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-nahkya-text-muted font-body">No commissions found.</div>
        )}
        {filtered.map((c, i) => (
          <div
            key={c.id}
            className={`grid grid-cols-1 lg:grid-cols-[120px_1fr_1fr_80px_100px_100px_100px_80px] gap-3 px-5 py-3.5 items-center ${
              i < filtered.length - 1 ? 'border-b border-nahkya-gold-soft' : ''
            } hover:bg-nahkya-ivory transition-colors`}
          >
            <span className="font-mono text-mono-sm text-nahkya-text-muted">{c.orderId}</span>
            <span className="text-sm text-nahkya-text font-body">{c.designerName}</span>
            <span className="text-sm text-nahkya-text font-body">{c.artworkName}</span>
            <span className="font-mono text-mono-sm text-nahkya-text">BND {c.orderAmount}</span>
            <span className="font-mono text-mono-sm text-nahkya-gold uppercase">BND {c.commissionAmount}</span>
            <span className={cn('font-mono text-mono-sm uppercase ', c.status === 'paid' ? 'text-nahkya-success' : 'text-nahkya-error')}>
              {c.status}
            </span>
            <span className="font-mono text-mono-sm text-nahkya-text-muted">
              {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <div className="flex justify-end">
              {c.status === 'pending' && (
                <button
                  onClick={() => markAsPaid(c.id)}
                  className="px-3 py-1.5 bg-nahkya-success/15 text-nahkya-success text-body-2xs font-body font-medium rounded-nahkya hover:bg-nahkya-success/25 transition-colors"
                >
                  Mark Paid
                </button>
              )}
              {c.status === 'paid' && (
                <span className="px-3 py-1.5 text-body-2xs font-body text-nahkya-text-muted">
                  {c.paidAt ? new Date(c.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Paid'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
