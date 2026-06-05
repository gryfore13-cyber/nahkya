import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { StudioShell } from '@/components/studio/StudioShell';
import { StudioSectionLabel } from '@/components/studio/StudioSectionLabel';
import { useColourStore } from '@/stores/colourStore';
import { useAuthStore } from '@/stores/authStore';
import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { useOrderStore } from '@/stores/orderStore';
import { usePlatformStore } from '@/stores/platformStore';
import { SCARF_SIZES } from '@/lib/constants';
import { generatePetakThumbnail } from '@/lib/petakExport';
import { toast } from 'sonner';
import type { ScarfSize } from '@/types';

export default function Petak() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [cells, setCells] = useState<Record<string, string | null>>({});
  const [scarfSize, setScarfSize] = useState<ScarfSize>('90');
  const [tileScale, setTileScale] = useState(50);
  const [borderWidth, setBorderWidth] = useState(0);
  const [symmetry, setSymmetry] = useState({ h: false, v: false, d: false });
  const [mode, setMode] = useState<'fill' | 'erase'>('fill');
  const [isDragging, setIsDragging] = useState(false);

  const { selectedColour, addToRecent } = useColourStore();
  const { user } = useAuthStore();
  const { addDesign } = useSavedDesignStore();
  const { addOrder } = useOrderStore();
  const { pricing } = usePlatformStore();

  const getDefaultPrice = useCallback(() => {
    const row = pricing.find((p) => p.size === '90 x 90');
    return row?.member ?? 180;
  }, [pricing]);

  const paintCell = useCallback((r: number, c: number) => {
    const key = `${r},${c}`;
    setCells(prev => {
      const next = { ...prev, [key]: mode === 'fill' ? selectedColour.hex : null };
      if (symmetry.h) next[`${rows - 1 - r},${c}`] = mode === 'fill' ? selectedColour.hex : null;
      if (symmetry.v) next[`${r},${cols - 1 - c}`] = mode === 'fill' ? selectedColour.hex : null;
      if (symmetry.d && r === c) next[`${cols - 1 - c},${rows - 1 - r}`] = mode === 'fill' ? selectedColour.hex : null;
      return next;
    });
    if (mode === 'fill') addToRecent(selectedColour);
  }, [mode, selectedColour, symmetry, rows, cols, addToRecent]);

  const handleCellInteraction = (r: number, c: number) => {
    paintCell(r, c);
  };

  const clearAll = () => setCells({});

  // Generate repeated tile preview
  const previewCols = 6;
  const previewRows = 5;

  // ─── Left Panel (tool-specific) ───
  const leftPanel = (
    <>
      {/* Grid Size */}
      <div>
        <StudioSectionLabel>Grid Size</StudioSectionLabel>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-body-xs text-nahkya-text-muted w-12">Rows</span>
          <button onClick={() => setRows(Math.max(2, rows - 1))} className="w-7 h-7 bg-workspace-hover border border-workspace-border rounded-nahkya flex items-center justify-center text-nahkya-text-muted hover:text-nahkya-text"><Minus className="w-3 h-3" /></button>
          <span className="w-8 text-center font-mono text-mono-md text-nahkya-text">{rows}</span>
          <button onClick={() => setRows(Math.min(20, rows + 1))} className="w-7 h-7 bg-workspace-hover border border-workspace-border rounded-nahkya flex items-center justify-center text-nahkya-text-muted hover:text-nahkya-text"><Plus className="w-3 h-3" /></button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-body-xs text-nahkya-text-muted w-12">Cols</span>
          <button onClick={() => setCols(Math.max(2, cols - 1))} className="w-7 h-7 bg-workspace-hover border border-workspace-border rounded-nahkya flex items-center justify-center text-nahkya-text-muted hover:text-nahkya-text"><Minus className="w-3 h-3" /></button>
          <span className="w-8 text-center font-mono text-mono-md text-nahkya-text">{cols}</span>
          <button onClick={() => setCols(Math.min(20, cols + 1))} className="w-7 h-7 bg-workspace-hover border border-workspace-border rounded-nahkya flex items-center justify-center text-nahkya-text-muted hover:text-nahkya-text"><Plus className="w-3 h-3" /></button>
        </div>
      </div>

      {/* Paint Mode */}
      <div>
        <StudioSectionLabel>Paint Mode</StudioSectionLabel>
        <div className="flex rounded-nahkya overflow-hidden border border-workspace-border">
          <button onClick={() => setMode('fill')} className={cn('flex-1 py-2 font-mono text-mono-sm uppercase tracking-label transition-colors ', mode === 'fill' ? 'bg-nahkya-gold text-nahkya-text' : 'bg-workspace-hover text-nahkya-text-muted')}>Fill</button>
          <button onClick={() => setMode('erase')} className={cn('flex-1 py-2 font-mono text-mono-sm uppercase tracking-label transition-colors ', mode === 'erase' ? 'bg-nahkya-gold text-nahkya-text' : 'bg-workspace-hover text-nahkya-text-muted')}>Erase</button>
        </div>
      </div>

      {/* Tile Scale */}
      <div>
        <StudioSectionLabel>Tile Scale</StudioSectionLabel>
        <div className="flex justify-between mb-1"><span className="text-body-xs text-nahkya-text-muted">Scale</span><span className="font-mono text-mono-sm text-nahkya-text-muted">{tileScale}%</span></div>
        <input type="range" min={10} max={100} value={tileScale} onChange={(e) => setTileScale(Number(e.target.value))}
          className="w-full h-1 bg-workspace-hover rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-nahkya-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer" />
      </div>

      {/* Scarf Size */}
      <div>
        <StudioSectionLabel>Scarf Size</StudioSectionLabel>
        <div className="space-y-1">
          {SCARF_SIZES.map(s => (
            <button key={s.value} onClick={() => setScarfSize(s.value)}
              className={`w-full text-left px-3 py-2 font-mono text-mono-sm uppercase tracking-label rounded-nahkya transition-colors ${
                scarfSize === s.value ? 'bg-nahkya-gold text-nahkya-text' : 'bg-workspace-hover text-nahkya-text-muted hover:text-nahkya-text'
              }`}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Border */}
      <div>
        <StudioSectionLabel>Border</StudioSectionLabel>
        <div className="flex justify-between mb-1"><span className="text-body-xs text-nahkya-text-muted">Width</span><span className="font-mono text-mono-sm text-nahkya-text-muted">{borderWidth}px</span></div>
        <input type="range" min={0} max={40} value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))}
          className="w-full h-1 bg-workspace-hover rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-nahkya-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer" />
      </div>

      {/* Symmetry */}
      <div>
        <StudioSectionLabel>Symmetry</StudioSectionLabel>
        <div className="space-y-2">
          {[
            { key: 'h' as const, label: 'Mirror horizontal' },
            { key: 'v' as const, label: 'Mirror vertical' },
            { key: 'd' as const, label: 'Mirror diagonal' },
          ].map(s => (
            <button key={s.key} onClick={() => setSymmetry(prev => ({ ...prev, [s.key]: !prev[s.key] }))}
              className="w-full flex items-center justify-between py-1.5">
              <span className="text-body-sm text-nahkya-text font-body">{s.label}</span>
              <div className={cn('w-8 h-4 rounded-full transition-colors ', symmetry[s.key] ? 'bg-nahkya-gold' : 'bg-workspace-hover')}>
                <div className={cn('w-3 h-3 rounded-full bg-white mt-0.5 transition-transform ', symmetry[s.key] ? 'translate-x-5' : 'translate-x-0.5')} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Canvas — moved from old top bar */}
      <div>
        <StudioSectionLabel>Actions</StudioSectionLabel>
        <button
          onClick={clearAll}
          className="w-full flex items-center justify-center gap-2 py-2 border border-workspace-border text-nahkya-text-muted hover:text-nahkya-text hover:border-nahkya-gold/50 rounded-nahkya transition-colors font-mono text-mono-sm uppercase tracking-label"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Clear Canvas
        </button>
      </div>
    </>
  );

  // ─── Canvas (tool-specific dual view) ───
  const canvas = (
    <div className="w-full h-full flex">
      {/* Tile Editor */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative">
          <div className="grid gap-px bg-workspace-border rounded-nahkya overflow-hidden"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: `${Math.min(400, cols * 60)}px` }}
            onMouseLeave={() => setIsDragging(false)}>
            {Array.from({ length: rows * cols }, (_, i) => {
              const r = Math.floor(i / cols);
              const c = i % cols;
              const colour = cells[`${r},${c}`];
              return (
                <div key={i}
                  className="aspect-square cursor-pointer transition-all duration-75 hover:ring-1 hover:ring-nahkya-gold/30 border border-workspace-border bg-workspace-hover"
                  style={{ backgroundColor: colour || undefined }}
                  onMouseDown={() => { setIsDragging(true); handleCellInteraction(r, c); }}
                  onMouseEnter={() => { if (isDragging) handleCellInteraction(r, c); }}
                  onMouseUp={() => setIsDragging(false)} />
              );
            })}
          </div>
          <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label mt-3 text-center">TILE EDITOR — {rows} &times; {cols}</p>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center p-8 border-l border-workspace-border">
        <div className="relative">
          <div className="rounded-nahkya overflow-hidden bg-workspace-panel"
            style={{ width: `${tileScale * 3}px`, height: `${tileScale * 3}px` }}>
            <div className="grid gap-0 w-full h-full" style={{ gridTemplateColumns: `repeat(${previewCols}, 1fr)`, gridTemplateRows: `repeat(${previewRows}, 1fr)` }}>
              {Array.from({ length: previewRows * previewCols }, (_, i) => (
                <div key={i} className="grid gap-0" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
                  {Array.from({ length: rows * cols }, (_, j) => {
                    const tr = Math.floor(j / cols);
                    const tc = j % cols;
                    return (
                      <div key={j} className="w-full h-full bg-workspace-panel" style={cells[`${tr},${tc}`] ? { backgroundColor: cells[`${tr},${tc}`] as string } : undefined} />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label mt-3 text-center">
            {SCARF_SIZES.find(s => s.value === scarfSize)?.label} PREVIEW
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <StudioShell
      toolName="Petak Studio"
      leftPanel={leftPanel}
      canvas={canvas}
      onSave={async () => {
        if (!user) { toast.error('Please sign in to save designs.'); return; }
        try {
          const thumbnail = generatePetakThumbnail(cells, rows, cols);
          const name = `Petak ${rows}×${cols}`;
          await addDesign({
            name,
            tool: 'petak',
            thumbnail,
            userId: user.uid,
            snapshot: { cells, rows, cols, scarfSize, tileScale, borderWidth, symmetry },
          });
          toast.success(`"${name}" saved to your collection.`);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'Failed to save design.');
        }
      }}
      onSubmit={async () => {
        if (!user) { toast.error('Please sign in to submit orders.'); return; }
        try {
          const thumbnail = generatePetakThumbnail(cells, rows, cols);
          const name = `Petak ${rows}×${cols}`;
          const designId = await addDesign({
            name,
            tool: 'petak',
            thumbnail,
            userId: user.uid,
            snapshot: { cells, rows, cols, scarfSize, tileScale, borderWidth, symmetry },
          });
          const amount = getDefaultPrice();
          const sizeLabel = SCARF_SIZES.find((s) => s.value === scarfSize)?.label ?? '90 × 90 cm';
          await addOrder({
            userId: user.uid,
            userName: user.displayName || user.email || 'Member',
            designId,
            designName: name,
            tool: 'petak',
            size: sizeLabel,
            amount,
            currency: 'BND',
            status: 'submitted',
            notes: '',
            adminNotes: '',
          });
          toast.success('Design submitted for production. Track it in Orders.');
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'Failed to submit order.');
        }
      }}
    />
  );
}
