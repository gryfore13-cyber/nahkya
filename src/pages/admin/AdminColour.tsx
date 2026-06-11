import { useState, useMemo, useCallback } from 'react';
import { Search, Lock, Filter, Palette, Check, AlertTriangle, Diamond, Crown } from 'lucide-react';
import { useColourStore } from '@/stores/colourStore';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { NAHKYA_SWATCH_CATEGORIES, type SwatchStatus } from '@/lib/nahkyaSwatches';
import { cn } from '@/lib/utils';

const STATUS_META: Record<SwatchStatus, { icon: typeof Check; label: string; bg: string; text: string; ring: string }> = {
  Caution:   { icon: AlertTriangle, label: 'Caution',   bg: 'bg-amber-500/10',  text: 'text-amber-600',  ring: 'ring-amber-500/30' },
  Approved:  { icon: Check,         label: 'Approved',  bg: 'bg-emerald-500/10', text: 'text-emerald-600', ring: 'ring-emerald-500/30' },
  Core:      { icon: Crown,         label: 'Core',      bg: 'bg-nahkya-highlight/15', text: 'text-nahkya-highlight', ring: 'ring-nahkya-highlight/40' },
  Premium:   { icon: Diamond,       label: 'Premium',   bg: 'bg-purple-500/10',  text: 'text-purple-600',  ring: 'ring-purple-500/30' },
};

export default function AdminColour() {
  const { selectedColour, setSelectedColour } = useColourStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SwatchStatus | 'All'>('All');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(
    () => new Set(NAHKYA_SWATCH_CATEGORIES.map((c) => c.id))
  );

  const toggleCat = useCallback((id: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedCats(new Set(NAHKYA_SWATCH_CATEGORIES.map((c) => c.id)));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedCats(new Set());
  }, []);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const all = NAHKYA_SWATCH_CATEGORIES.flatMap((c) => c.swatches);
    return {
      total: all.length,
      Caution: all.filter((s) => s.status === 'Caution').length,
      Approved: all.filter((s) => s.status === 'Approved').length,
      Core: all.filter((s) => s.status === 'Core').length,
      Premium: all.filter((s) => s.status === 'Premium').length,
    };
  }, []);

  /* ── Filtered categories ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return NAHKYA_SWATCH_CATEGORIES.map((cat) => {
      const swatches = cat.swatches.filter((s) => {
        const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.hex.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
      return { ...cat, swatches };
    }).filter((cat) => cat.swatches.length > 0);
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <AdminTopBar
        icon={<Palette size={17} strokeWidth={1.5} />}
        label="Colour System"
        middle={
          <div className="flex items-center gap-2 bg-nahkya-surface border border-nahkya-border rounded-nahkya px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-nahkya-text-secondary" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search swatch name or hex..."
              className="bg-transparent border-0 text-sm text-nahkya-text placeholder:text-nahkya-text-secondary/60 focus:outline-none w-48 lg:w-64"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-nahkya-text-secondary hover:text-nahkya-text">
                <span className="text-xs">Clear</span>
              </button>
            )}
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <button onClick={expandAll} className="text-body-xs text-nahkya-text-secondary hover:text-nahkya-text px-2 py-1">
              Expand
            </button>
            <button onClick={collapseAll} className="text-body-xs text-nahkya-text-secondary hover:text-nahkya-text px-2 py-1">
              Collapse
            </button>
          </div>
        }
      />

      <div className="p-6 lg:p-10 space-y-8">
        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['total', 'Caution', 'Approved', 'Core', 'Premium'] as const).map((key) => {
            const isTotal = key === 'total';
            const count = isTotal ? stats.total : stats[key];
            const meta = isTotal ? null : STATUS_META[key];
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(isTotal ? 'All' : key)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-nahkya border transition-all',
                  (isTotal ? statusFilter === 'All' : statusFilter === key)
                    ? 'border-nahkya-highlight bg-nahkya-highlight/10'
                    : 'border-nahkya-border bg-nahkya-surface hover:border-nahkya-highlight/40'
                )}
              >
                {meta && <meta.icon className={cn('w-4 h-4', meta.text)} strokeWidth={1.5} />}
                {isTotal && <Palette className="w-4 h-4 text-nahkya-text-secondary" strokeWidth={1.5} />}
                <div className="text-left">
                  <div className="text-lg font-display leading-none text-nahkya-text">{count}</div>
                  <div className="text-body-2xs text-nahkya-text-secondary mt-0.5">{isTotal ? 'Total' : key}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Status Filter Chips ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-nahkya-text-secondary" strokeWidth={1.5} />
          {(['All', 'Caution', 'Approved', 'Core', 'Premium'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1 rounded-nahkya text-body-xs font-body transition-all border',
                statusFilter === s
                  ? 'border-nahkya-highlight bg-nahkya-highlight/15 text-nahkya-highlight'
                  : 'border-nahkya-border bg-nahkya-surface text-nahkya-text-secondary hover:border-nahkya-highlight/40'
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ── Swatch Categories ── */}
        <div className="space-y-4">
          {filtered.map((cat) => {
            const isExpanded = expandedCats.has(cat.id);
            return (
              <div
                key={cat.id}
                className="bg-nahkya-surface border border-nahkya-border rounded-nahkya overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCat(cat.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-nahkya-bg/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Lock className="w-3.5 h-3.5 text-nahkya-highlight flex-shrink-0" strokeWidth={1.5} />
                    <div className="text-left">
                      <h3 className="text-base font-body font-medium text-nahkya-text">{cat.name}</h3>
                      <p className="text-body-2xs text-nahkya-text-secondary mt-0.5">{cat.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-label">
                      {cat.swatches.length} swatches
                    </span>
                    <div className="flex gap-1">
                      {cat.swatches.slice(0, 8).map((s) => (
                        <div
                          key={s.id}
                          className="w-4 h-4 rounded-sm border border-nahkya-border/50"
                          style={{ backgroundColor: s.hex }}
                          title={s.name}
                        />
                      ))}
                      {cat.swatches.length > 8 && (
                        <div className="w-4 h-4 rounded-sm border border-nahkya-border/50 bg-nahkya-bg flex items-center justify-center">
                          <span className="text-[8px] text-nahkya-text-secondary">+</span>
                        </div>
                      )}
                    </div>
                    <span className="text-nahkya-text-secondary text-sm w-4">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </div>
                </button>

                {/* Expanded Swatch Grid */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-nahkya-border">
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 mt-4">
                      {cat.swatches.map((swatch, idx) => {
                        const isSelected = selectedColour.id === swatch.id;
                        const meta = STATUS_META[swatch.status];
                        return (
                          <button
                            key={swatch.id}
                            onClick={() => setSelectedColour({ id: swatch.id, name: swatch.name, hex: swatch.hex, status: swatch.status })}
                            className={cn(
                              'group relative flex flex-col items-center gap-1.5 p-2 rounded-nahkya border transition-all duration-150',
                              isSelected
                                ? 'border-nahkya-highlight ring-2 ring-nahkya-highlight/30 bg-nahkya-highlight/5'
                                : 'border-nahkya-border/50 hover:border-nahkya-highlight/60 bg-transparent'
                            )}
                            title={`${swatch.name} — ${swatch.hex} — ${swatch.status}`}
                          >
                            {/* Index number */}
                            <span className="absolute top-1 left-1.5 text-[9px] font-mono text-nahkya-text-secondary/40 leading-none">
                              {String(idx + 1).padStart(2, '0')}
                            </span>

                            {/* Colour swatch */}
                            <div
                              className={cn(
                                'w-full aspect-square rounded-sm border border-black/5 transition-transform group-hover:scale-105',
                                isSelected && 'ring-2 ring-nahkya-highlight/50'
                              )}
                              style={{ backgroundColor: swatch.hex }}
                            />

                            {/* Name */}
                            <span className="text-[10px] font-body text-nahkya-text leading-tight text-center line-clamp-1 w-full">
                              {swatch.name}
                            </span>

                            {/* Hex */}
                            <span className="text-[9px] font-mono text-nahkya-text-secondary uppercase tracking-wider">
                              {swatch.hex}
                            </span>

                            {/* Status badge */}
                            <span
                              className={cn(
                                'text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm',
                                meta.bg,
                                meta.text
                              )}
                            >
                              {swatch.status}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Palette className="w-8 h-8 text-nahkya-text-secondary/30 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-body-sm text-nahkya-text-secondary">No swatches match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
