import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { StudioShell } from '@/components/studio/StudioShell';
import { StudioSectionLabel } from '@/components/studio/StudioSectionLabel';
import { useColourStore } from '@/stores/colourStore';
import { useAuthStore } from '@/stores/authStore';
import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { useOrderStore } from '@/stores/orderStore';
import { usePlatformStore } from '@/stores/platformStore';
import { useResponsive } from '@/hooks/use-responsive';
import { SCARF_SIZES } from '@/lib/constants';
import { generatePetakThumbnail } from '@/lib/petakExport';
import { saveDesignWithThumbnail } from '@/lib/designs';
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
  const [isRestoring, setIsRestoring] = useState(true);

  const [searchParams] = useSearchParams();
  const { selectedColour, addToRecent } = useColourStore();
  const { user } = useAuthStore();
  const { fetchDesignById } = useSavedDesignStore();
  const { addOrder } = useOrderStore();
  const { pricing } = usePlatformStore();
  const { isMobile, isTouch } = useResponsive();

  // Restore saved design from ?designId=
  useEffect(() => {
    const designId = searchParams.get('designId');
    if (!designId) {
      setIsRestoring(false);
      return;
    }

    let cancelled = false;
    fetchDesignById(designId).then((design) => {
      if (cancelled) return;
      const s = design?.snapshot;
      if (s) {
        if (typeof s.rows === 'number') setRows(s.rows);
        if (typeof s.cols === 'number') setCols(s.cols);
        if (s.cells && typeof s.cells === 'object') setCells(s.cells as Record<string, string | null>);
        if (s.scarfSize) setScarfSize(s.scarfSize as ScarfSize);
        if (typeof s.tileScale === 'number') setTileScale(s.tileScale);
        if (typeof s.borderWidth === 'number') setBorderWidth(s.borderWidth);
        if (s.symmetry && typeof s.symmetry === 'object') {
          setSymmetry(s.symmetry as { h: boolean; v: boolean; d: boolean });
        }
      }
      setIsRestoring(false);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('designId')]);

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

  // Touch-friendly button sizes
  const stepBtnSize = isTouch ? 'w-10 h-10' : 'w-7 h-7';
  const stepIconSize = isTouch ? 'w-4 h-4' : 'w-3 h-3';

  // ─── Left Panel (tool-specific) ───
  const leftPanel = (
    <>
      {/* Grid Size */}
      <div>
        <StudioSectionLabel>Grid Size</StudioSectionLabel>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-body-xs text-nahkya-text-secondary w-12">Rows</span>
          <button onClick={() => setRows(Math.max(2, rows - 1))} className={cn(stepBtnSize, 'bg-nahkya-surface-raised border border-nahkya-border rounded-nahkya flex items-center justify-center text-nahkya-text-secondary hover:text-nahkya-text')}><Minus className={stepIconSize} /></button>
          <span className="w-8 text-center font-mono text-mono-md text-nahkya-text">{rows}</span>
          <button onClick={() => setRows(Math.min(20, rows + 1))} className={cn(stepBtnSize, 'bg-nahkya-surface-raised border border-nahkya-border rounded-nahkya flex items-center justify-center text-nahkya-text-secondary hover:text-nahkya-text')}><Plus className={stepIconSize} /></button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-body-xs text-nahkya-text-secondary w-12">Cols</span>
          <button onClick={() => setCols(Math.max(2, cols - 1))} className={cn(stepBtnSize, 'bg-nahkya-surface-raised border border-nahkya-border rounded-nahkya flex items-center justify-center text-nahkya-text-secondary hover:text-nahkya-text')}><Minus className={stepIconSize} /></button>
          <span className="w-8 text-center font-mono text-mono-md text-nahkya-text">{cols}</span>
          <button onClick={() => setCols(Math.min(20, cols + 1))} className={cn(stepBtnSize, 'bg-nahkya-surface-raised border border-nahkya-border rounded-nahkya flex items-center justify-center text-nahkya-text-secondary hover:text-nahkya-text')}><Plus className={stepIconSize} /></button>
        </div>
      </div>

      {/* Paint Mode */}
      <div>
        <StudioSectionLabel>Paint Mode</StudioSectionLabel>
        <div className="flex rounded-nahkya overflow-hidden border border-nahkya-border">
          <button onClick={() => setMode('fill')} className={cn('flex-1 py-2 font-mono text-mono-sm uppercase tracking-label transition-colors ', mode === 'fill' ? 'bg-nahkya-highlight text-nahkya-text' : 'bg-nahkya-surface-raised text-nahkya-text-secondary')}>Fill</button>
          <button onClick={() => setMode('erase')} className={cn('flex-1 py-2 font-mono text-mono-sm uppercase tracking-label transition-colors ', mode === 'erase' ? 'bg-nahkya-highlight text-nahkya-text' : 'bg-nahkya-surface-raised text-nahkya-text-secondary')}>Erase</button>
        </div>
      </div>

      {/* Tile Scale */}
      <div>
        <StudioSectionLabel>Tile Scale</StudioSectionLabel>
        <div className="flex justify-between mb-1"><span className="text-body-xs text-nahkya-text-secondary">Scale</span><span className="font-mono text-mono-sm text-nahkya-text-secondary">{tileScale}%</span></div>
        <input type="range" min={10} max={100} value={tileScale} onChange={(e) => setTileScale(Number(e.target.value))}
          className="w-full h-1 bg-nahkya-surface-raised rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-nahkya-highlight [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer" />
      </div>

      {/* Scarf Size */}
      <div>
        <StudioSectionLabel>Scarf Size</StudioSectionLabel>
        <div className="space-y-1">
          {SCARF_SIZES.map(s => (
            <button key={s.value} onClick={() => setScarfSize(s.value)}
              className={`w-full text-left px-3 py-2 font-mono text-mono-sm uppercase tracking-label rounded-nahkya transition-colors ${
                scarfSize === s.value ? 'bg-nahkya-highlight text-nahkya-text' : 'bg-nahkya-surface-raised text-nahkya-text-secondary hover:text-nahkya-text'
              }`}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Border */}
      <div>
        <StudioSectionLabel>Border</StudioSectionLabel>
        <div className="flex justify-between mb-1"><span className="text-body-xs text-nahkya-text-secondary">Width</span><span className="font-mono text-mono-sm text-nahkya-text-secondary">{borderWidth}px</span></div>
        <input type="range" min={0} max={40} value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))}
          className="w-full h-1 bg-nahkya-surface-raised rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-nahkya-highlight [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer" />
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
              className="w-full flex items-center justify-between py-1.5 min-h-[44px]">
              <span className="text-body-sm text-nahkya-text font-body">{s.label}</span>
              <div className={cn('w-8 h-4 rounded-full transition-colors ', symmetry[s.key] ? 'bg-nahkya-highlight' : 'bg-nahkya-surface-raised')}>
                <div className={cn('w-3 h-3 rounded-full bg-nahkya-inverse mt-0.5 transition-transform ', symmetry[s.key] ? 'translate-x-5' : 'translate-x-0.5')} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Canvas */}
      <div>
        <StudioSectionLabel>Actions</StudioSectionLabel>
        <button
          onClick={clearAll}
          className="w-full flex items-center justify-center gap-2 py-2 border border-nahkya-border text-nahkya-text-secondary hover:text-nahkya-text hover:border-nahkya-highlight/50 rounded-nahkya transition-colors font-mono text-mono-sm uppercase tracking-label"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Clear Canvas
        </button>
      </div>
    </>
  );

  // ─── Canvas (tool-specific dual view) ───
  // On mobile: stack vertically; on desktop: side by side
  const canvas = (
    <div className="w-full h-full flex flex-col lg:flex-row overflow-auto">
      {/* Tile Editor */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[50%]">
        <div className="relative">
          <div className="grid gap-px bg-nahkya-border rounded-nahkya overflow-hidden"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: `${Math.min(isMobile ? 280 : 400, cols * (isMobile ? 48 : 60))}px` }}
            onMouseLeave={() => setIsDragging(false)}
            onTouchEnd={() => setIsDragging(false)}>
            {Array.from({ length: rows * cols }, (_, i) => {
              const r = Math.floor(i / cols);
              const c = i % cols;
              const colour = cells[`${r},${c}`];
              return (
                <div key={i}
                  className={cn(
                    'aspect-square cursor-pointer transition-all duration-75 hover:ring-1 hover:ring-nahkya-highlight/30 border border-nahkya-border bg-nahkya-surface-raised bg-[var(--swatch)]',
                    isTouch && 'min-w-[44px] min-h-[44px]'
                  )}
                  ref={(el) => { if (el && colour) el.style.setProperty('--swatch', colour); }}
                  onMouseDown={() => { setIsDragging(true); handleCellInteraction(r, c); }}
                  onMouseEnter={() => { if (isDragging) handleCellInteraction(r, c); }}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchStart={() => { setIsDragging(true); handleCellInteraction(r, c); }}
                  onTouchMove={(e) => {
                    // Simple touch drag support
                    const touch = e.touches[0];
                    const el = document.elementFromPoint(touch.clientX, touch.clientY);
                    if (el && el.getAttribute('data-cell')) {
                      const [cr, cc] = (el.getAttribute('data-cell') || '').split(',').map(Number);
                      if (!Number.isNaN(cr) && !Number.isNaN(cc)) handleCellInteraction(cr, cc);
                    }
                  }}
                  data-cell={`${r},${c}`}
                />
              );
            })}
          </div>
          <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-label mt-3 text-center">TILE EDITOR — {rows} &times; {cols}</p>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[50%] lg:border-l lg:border-nahkya-border">
        <div className="relative">
          <div className="rounded-nahkya overflow-hidden bg-nahkya-surface"
            style={{ width: `${Math.min(tileScale * 3, isMobile ? 280 : 400)}px`, height: `${Math.min(tileScale * 3, isMobile ? 280 : 400)}px` }}>
            <div className="grid gap-0 w-full h-full" style={{ gridTemplateColumns: `repeat(${previewCols}, 1fr)`, gridTemplateRows: `repeat(${previewRows}, 1fr)` }}>
              {Array.from({ length: previewRows * previewCols }, (_, i) => (
                <div key={i} className="grid gap-0" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
                  {Array.from({ length: rows * cols }, (_, j) => {
                    const tr = Math.floor(j / cols);
                    const tc = j % cols;
                    return (
                      <div key={j} className="w-full h-full bg-nahkya-surface bg-[var(--swatch)]" ref={(el) => { const c = cells[`${tr},${tc}`]; if (el && c) el.style.setProperty('--swatch', c); }} />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-label mt-3 text-center">
            {SCARF_SIZES.find(s => s.value === scarfSize)?.label} PREVIEW
          </p>
        </div>
      </div>
    </div>
  );

  if (isRestoring) {
    return (
      <div className="h-screen flex items-center justify-center bg-nahkya-bg">
        <p className="font-mono text-mono-md text-nahkya-text-secondary uppercase tracking-label">Restoring design…</p>
      </div>
    );
  }

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
          await saveDesignWithThumbnail({
            name,
            tool: 'petak',
            userId: user.uid,
            snapshot: { cells, rows, cols, scarfSize, tileScale, borderWidth, symmetry },
          }, thumbnail);
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
          const designId = await saveDesignWithThumbnail({
            name,
            tool: 'petak',
            userId: user.uid,
            snapshot: { cells, rows, cols, scarfSize, tileScale, borderWidth, symmetry },
          }, thumbnail);
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
