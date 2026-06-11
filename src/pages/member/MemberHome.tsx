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
  const { designs, fetchDesignsByUser } = useSavedDesignStore();
  const { orders, fetchOrdersByUser } = useOrderStore();
  useEffect(() => {
    if (user?.uid) {
      fetchDesignsByUser(user.uid);
      fetchOrdersByUser(user.uid);
    }
  }, [fetchDesignsByUser, fetchOrdersByUser, user?.uid]);

  const myDesigns = designs;
  const myOrders = orders;

  const inProduction = myOrders.filter((o) => o.status === 'in_production').length;
  const ready = myOrders.filter((o) => o.status === 'ready_for_collection').length;

  return (
    <div className="p-5 sm:p-8 lg:p-12 min-h-screen">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Welcome back, {user?.displayName?.split(' ')[0] || 'Member'}</h1>
      <p className="text-body-md text-nahkya-text-secondary font-body mb-8 lg:mb-12">Here is what is happening in your atelier.</p>

      {/* Stats — responsive grid: 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { label: 'Saved Designs', value: String(myDesigns.length), icon: FolderOpen, color: 'text-nahkya-text-secondary' },
          { label: 'In Production', value: String(inProduction), icon: Package, color: 'text-nahkya-highlight' },
          { label: 'Ready', value: String(ready), icon: CheckCircle, color: 'text-nahkya-success' },
          { label: 'Orders', value: String(myOrders.length), icon: Clock, color: 'text-nahkya-text-secondary' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-nahkya-surface border border-nahkya-border rounded-nahkya p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <Icon className={cn('w-4 h-4', s.color)} strokeWidth={1.5} />
              </div>
              <p className="font-display text-heading-sm text-nahkya-text font-medium">{s.value}</p>
              <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-label mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions — responsive: full-width stacked mobile, auto-width horizontal desktop */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-12">
        {[
          { icon: Paintbrush, title: 'Open Atelier', desc: 'Continue colouring your latest artwork', href: '/member/atelier' },
          { icon: Type, title: 'Create Monogram', desc: 'Design a new signature pattern', href: '/member/monogram' },
          { icon: Grid3X3, title: 'Start Petak', desc: 'Paint a geometric composition', href: '/member/petak' },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.title} to={a.href}
              className="bg-nahkya-surface border border-nahkya-border rounded-nahkya p-6 sm:p-8 flex-1 min-w-0 sm:max-w-sidebar-member hover:border-nahkya-highlight/30 hover:-translate-y-0.5 transition-all duration-200">
              <Icon className="w-6 h-6 text-nahkya-highlight mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-body font-medium text-nahkya-text mb-2">{a.title}</h3>
              <p className="text-body-sm text-nahkya-text-secondary font-body line-clamp-2">{a.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Designs — responsive grid */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl font-body font-medium text-nahkya-text">Recent Designs</h2>
          <Link to="/member/saved" className="text-body-sm text-nahkya-highlight font-body hover:text-nahkya-border transition-colors">View All &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {myDesigns.slice(0, 4).map((d) => (
            <div key={d.id} className="bg-nahkya-surface border border-nahkya-border rounded-nahkya hover:border-nahkya-highlight/30 hover:scale-[1.02] transition-all duration-200">
              <div className={`w-full aspect-square ${d.thumbnail}`} />
              <div className="p-3">
                <p className="text-body-sm text-nahkya-text font-body truncate">{d.name}</p>
                <p className="font-mono text-body-3xs text-nahkya-text-secondary uppercase tracking-label">{d.createdAt}</p>
              </div>
            </div>
          ))}
          <Link to="/member/saved" className="bg-nahkya-surface border border-nahkya-border border-dashed border-nahkya-text-secondary/30 rounded-nahkya aspect-square flex flex-col items-center justify-center text-nahkya-text-secondary hover:text-nahkya-highlight hover:border-nahkya-highlight/30 transition-all">
            <span className="text-2xl mb-2">+</span>
            <span className="text-body-xs font-body">View All</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders — card-based on mobile, table on desktop */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl font-body font-medium text-nahkya-text">Recent Orders</h2>
          <Link to="/member/orders" className="text-body-sm text-nahkya-highlight font-body hover:text-nahkya-border transition-colors">View All &rarr;</Link>
        </div>

        {/* Desktop: table row layout */}
        <div className="hidden sm:block bg-nahkya-surface border border-nahkya-border rounded-nahkya overflow-hidden">
          {myOrders.slice(0, 3).map((o, i) => (
            <div key={o.id} className={cn('flex items-center justify-between px-6 py-4', i < 2 ? 'border-b border-nahkya-border' : '')}>
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-mono-sm text-nahkya-text-secondary flex-shrink-0">{o.id}</span>
                <span className="text-sm text-nahkya-text font-body truncate">{o.designName}</span>
              </div>
              <StatusBadge status={o.status} />
            </div>
          ))}
          {myOrders.length === 0 && (
            <div className="px-6 py-8 text-center text-nahkya-text-secondary font-body">No orders yet.</div>
          )}
        </div>

        {/* Mobile: card layout */}
        <div className="sm:hidden space-y-3">
          {myOrders.slice(0, 3).map((o) => (
            <div key={o.id} className="bg-nahkya-surface border border-nahkya-border rounded-nahkya p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-mono-sm text-nahkya-text-secondary">{o.id}</span>
                <StatusBadge status={o.status} />
              </div>
              <p className="text-sm text-nahkya-text font-body">{o.designName}</p>
            </div>
          ))}
          {myOrders.length === 0 && (
            <div className="bg-nahkya-surface border border-nahkya-border rounded-nahkya p-8 text-center text-nahkya-text-secondary font-body">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
