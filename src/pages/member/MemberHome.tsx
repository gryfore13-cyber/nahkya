import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Paintbrush, Type, Grid3X3, FolderOpen, Package, CheckCircle, Clock } from 'lucide-react';
import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/authStore';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useEffect } from 'react';

export default function MemberHome() {
  const { user } = useAuthStore();
  const { designs, fetchDesigns } = useSavedDesignStore();
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchDesigns();
    fetchOrders();
  }, [fetchDesigns, fetchOrders]);

  const myDesigns = designs.filter((d) => (d as unknown as Record<string, string>).userId === user?.uid);
  const myOrders = orders.filter((o) => o.userId === user?.uid);

  const inProduction = myOrders.filter((o) => o.status === 'in_production').length;
  const ready = myOrders.filter((o) => o.status === 'ready_for_collection').length;

  return (
    <div className="p-8 lg:p-12 min-h-screen">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Welcome back, {user?.displayName?.split(' ')[0] || 'Member'}</h1>
      <p className="text-body-md text-nahkya-text-muted font-body mb-12">Here is what is happening in your atelier.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Saved Designs', value: String(myDesigns.length), icon: FolderOpen, color: 'text-nahkya-text-muted' },
          { label: 'In Production', value: String(inProduction), icon: Package, color: 'text-nahkya-gold' },
          { label: 'Ready', value: String(ready), icon: CheckCircle, color: 'text-nahkya-success' },
          { label: 'Orders', value: String(myOrders.length), icon: Clock, color: 'text-nahkya-text-muted' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-workspace-panel border border-workspace-border rounded-nahkya p-6">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-4 h-4 ${s.color}`} strokeWidth={1.5} />
              </div>
              <p className="font-display text-heading-sm text-nahkya-text font-medium">{s.value}</p>
              <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-12">
        {[
          { icon: Paintbrush, title: 'Open Atelier', desc: 'Continue colouring your latest artwork', href: '/member/atelier' },
          { icon: Type, title: 'Create Monogram', desc: 'Design a new signature pattern', href: '/member/monogram' },
          { icon: Grid3X3, title: 'Start Petak', desc: 'Paint a geometric composition', href: '/member/petak' },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.title} to={a.href}
              className="bg-workspace-panel border border-workspace-border rounded-nahkya p-8 w-sidebar-member hover:border-nahkya-gold/30 hover:-translate-y-0.5 transition-all duration-200">
              <Icon className="w-6 h-6 text-nahkya-gold mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-body font-medium text-nahkya-text mb-2">{a.title}</h3>
              <p className="text-body-sm text-nahkya-text-muted font-body line-clamp-2">{a.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Designs */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-body font-medium text-nahkya-text">Recent Designs</h2>
          <Link to="/member/saved" className="text-body-sm text-nahkya-gold font-body hover:text-nahkya-gold-soft transition-colors">View All &rarr;</Link>
        </div>
        <div className="flex flex-wrap gap-4">
          {myDesigns.slice(0, 4).map((d) => (
            <div key={d.id} className="bg-workspace-panel border border-workspace-border rounded-nahkya w-40 hover:border-nahkya-gold/30 hover:scale-[1.02] transition-all duration-200">
              <div className={`w-full aspect-square ${d.thumbnail}`} />
              <div className="p-3">
                <p className="text-body-sm text-nahkya-text font-body truncate">{d.name}</p>
                <p className="font-mono text-body-3xs text-nahkya-text-muted uppercase tracking-label">{d.createdAt}</p>
              </div>
            </div>
          ))}
          <Link to="/member/saved" className="bg-workspace-panel border border-workspace-border border-dashed border-nahkya-taupe/30 rounded-nahkya w-40 aspect-square flex flex-col items-center justify-center text-nahkya-text-muted hover:text-nahkya-gold hover:border-nahkya-gold/30 transition-all">
            <span className="text-2xl mb-2">+</span>
            <span className="text-body-xs font-body">View All</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-body font-medium text-nahkya-text">Recent Orders</h2>
          <Link to="/member/orders" className="text-body-sm text-nahkya-gold font-body hover:text-nahkya-gold-soft transition-colors">View All &rarr;</Link>
        </div>
        <div className="bg-workspace-panel border border-workspace-border rounded-nahkya overflow-hidden">
          {myOrders.slice(0, 3).map((o, i) => (
            <div key={o.id} className={cn('flex items-center justify-between px-6 py-4 ', i < 2 ? 'border-b border-workspace-border' : '')}>
              <div className="flex items-center gap-4">
                <span className="font-mono text-mono-sm text-nahkya-text-muted">{o.id}</span>
                <span className="text-sm text-nahkya-text font-body">{o.designName}</span>
              </div>
              <StatusBadge status={o.status} />
            </div>
          ))}
          {myOrders.length === 0 && (
            <div className="px-6 py-8 text-center text-nahkya-text-muted font-body">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
