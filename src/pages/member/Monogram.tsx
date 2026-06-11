// src/pages/member/Monogram.tsx — NAHKYA Monogram Atelier

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { StudioShell } from '@/components/studio/StudioShell';
import { useColourStore } from '@/stores/colourStore';
import { useAuthStore } from '@/stores/authStore';
import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { useOrderStore } from '@/stores/orderStore';
import { usePlatformStore } from '@/stores/platformStore';
import { useMonogramState } from '@/hooks/useMonogramState';
import { generateMonogramThumbnail } from '@/lib/monogramExport';
import { saveDesignWithThumbnail } from '@/lib/designs';
import MonogramControls from '@/components/monogram/MonogramControls';
import MonogramCanvas from '@/components/monogram/MonogramCanvas';
import { StudioViewPill } from '@/components/studio/StudioViewPill';
import type { MonogramSnapshot } from '@/types';

export default function Monogram() {
  const state = useMonogramState();
  const { selectedColour } = useColourStore();
  const { user } = useAuthStore();
  const { fetchDesignById } = useSavedDesignStore();
  const { addOrder } = useOrderStore();
  const { pricing } = usePlatformStore();

  const [searchParams] = useSearchParams();
  const [activeColorTarget, setActiveColorTarget] = useState<'letter' | 'base' | 'border' | 'border2'>('letter');
  const [isRestoring, setIsRestoring] = useState(true);

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
      if (design?.snapshot) {
        state.loadSnapshot(design.snapshot as unknown as MonogramSnapshot);
      }
      setIsRestoring(false);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('designId')]);


  // Auto-apply selected colour from the right panel to the active target
  useEffect(() => {
    if (activeColorTarget === 'letter') {
      if (state.selectedLetter) {
        state.updateLetter(state.selectedLetter.id, { color: selectedColour.hex });
      }
    } else if (activeColorTarget === 'base') {
      state.setBaseColor(selectedColour.hex);
    } else if (activeColorTarget === 'border') {
      state.setBorderColor(selectedColour.hex);
    } else if (activeColorTarget === 'border2') {
      state.setBorderColor2(selectedColour.hex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColour]);

  const getDesignName = useCallback(() => {
    const chars = state.letters.map((l) => l.char).join('') || 'Untitled';
    return `Monogram ${chars}`;
  }, [state.letters]);

  const getDefaultPrice = useCallback(() => {
    const row = pricing.find((p) => p.size === '90 x 90');
    return row?.member ?? 180;
  }, [pricing]);

  const handleSave = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in to save designs.');
      return;
    }
    try {
      const snapshot = state.getSnapshot();
      const thumbnail = generateMonogramThumbnail(snapshot, 512);
      const name = getDesignName();
      await saveDesignWithThumbnail({
        name,
        tool: 'monogram',
        userId: user.uid,
        snapshot: snapshot as unknown as Record<string, unknown>,
      }, thumbnail);
      toast.success(`"${name}" saved to your collection.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save design.');
    }
  }, [user, state, getDesignName]);

  const handleSubmit = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in to submit orders.');
      return;
    }
    try {
      const snapshot = state.getSnapshot();
      const thumbnail = generateMonogramThumbnail(snapshot, 512);
      const name = getDesignName();
      const designId = await saveDesignWithThumbnail({
        name,
        tool: 'monogram',
        userId: user.uid,
        snapshot: snapshot as unknown as Record<string, unknown>,
      }, thumbnail);
      const amount = getDefaultPrice();
      await addOrder({
        userId: user.uid,
        userName: user.displayName || user.email || 'Member',
        designId,
        designName: name,
        tool: 'monogram',
        size: '90 x 90 CM',
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
  }, [user, state, addOrder, getDesignName, getDefaultPrice]);

  if (isRestoring) {
    return (
      <div className="h-screen flex items-center justify-center bg-nahkya-bg">
        <p className="font-mono text-mono-md text-nahkya-text-secondary uppercase tracking-label">Restoring design…</p>
      </div>
    );
  }

  return (
    <StudioShell
      toolName="Monogram Studio"
      leftPanel={
        <MonogramControls
          state={state}
          activeColorTarget={activeColorTarget}
          setActiveColorTarget={setActiveColorTarget}
        />
      }
      canvas={<MonogramCanvas state={state} />}
      topBarMiddle={
        <StudioViewPill value={state.viewMode} onChange={state.setViewMode} />
      }
      onSave={handleSave}
      onSubmit={handleSubmit}
      zoom={state.effectiveZoom / 100}
      onZoomIn={() => state.setZoom((z) => Math.min(200, z + 10))}
      onZoomOut={() => state.setZoom((z) => Math.max(50, z - 10))}
      onZoomReset={() => state.setZoom(100)}
    />
  );
}
