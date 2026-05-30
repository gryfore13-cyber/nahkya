// src/pages/member/Monogram.tsx — NAHKYA Monogram Atelier

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { StudioShell } from '@/components/studio/StudioShell';
import { useColourStore } from '@/stores/colourStore';
import { useAuthStore } from '@/stores/authStore';
import { useSavedDesignStore } from '@/stores/savedDesignStore';
import { useOrderStore } from '@/stores/orderStore';
import { usePlatformStore } from '@/stores/platformStore';
import { useMonogramState } from '@/hooks/useMonogramState';
import { generateMonogramThumbnail } from '@/lib/monogramExport';
import MonogramControls from '@/components/monogram/MonogramControls';
import MonogramCanvas from '@/components/monogram/MonogramCanvas';

export default function Monogram() {
  const state = useMonogramState();
  const { selectedColour } = useColourStore();
  const { user } = useAuthStore();
  const { addDesign } = useSavedDesignStore();
  const { addOrder } = useOrderStore();
  const { pricing } = usePlatformStore();

  const [activeColorTarget, setActiveColorTarget] = useState<'letter' | 'base' | 'border' | 'border2'>('letter');


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
      await addDesign({
        name,
        tool: 'monogram',
        thumbnail,
        userId: user.uid,
        snapshot: snapshot as unknown as Record<string, unknown>,
      });
      toast.success(`"${name}" saved to your collection.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save design.');
    }
  }, [user, state, addDesign, getDesignName]);

  const handleSubmit = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in to submit orders.');
      return;
    }
    try {
      const snapshot = state.getSnapshot();
      const thumbnail = generateMonogramThumbnail(snapshot, 512);
      const name = getDesignName();
      const designId = await addDesign({
        name,
        tool: 'monogram',
        thumbnail,
        userId: user.uid,
        snapshot: snapshot as unknown as Record<string, unknown>,
      });
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
  }, [user, state, addDesign, addOrder, getDesignName, getDefaultPrice]);

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
      onSave={handleSave}
      onSubmit={handleSubmit}
      zoom={state.effectiveZoom / 100}
      onZoomIn={() => state.setZoom((z) => Math.min(state.viewMode === 'both' ? 100 : 200, z + 10))}
      onZoomOut={() => state.setZoom((z) => Math.max(50, z - 10))}
      onZoomReset={() => state.setZoom(100)}
    />
  );
}
