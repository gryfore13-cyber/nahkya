// src/hooks/useMonogramState.ts — NAHKYA Monogram State Management

import { useState, useRef, useCallback, useMemo } from 'react';
import type { MonogramLetter, MonogramDragState, MonogramSnapGuides, MonogramSnapshot } from '@/types';
import {
  TILE_SIZE,
  PREVIEW_VIEWPORT_SIZE,
  SOURCE_VIEWPORT_SIZE,
  MAX_LETTERS,
} from '@/lib/monogramConstants';
import {
  generateLetterId,
  createDefaultLetter,
  snapRotation,
  clamp,
} from '@/lib/monogram';

export interface MonogramState {
  // Letters
  letters: MonogramLetter[];
  selectedLetterId: string;
  setSelectedLetterId: (id: string) => void;
  addLetter: () => void;
  deleteLetter: (id: string) => void;
  updateTextBoxCharacter: (id: string, char: string) => void;
  updateLetter: (id: string, updates: Partial<MonogramLetter>) => void;
  updateTextSize: (id: string, size: number) => void;
  linkTextSize: boolean;
  toggleLinkTextSize: (enabled: boolean) => void;

  // UI
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;

  // Pattern
  previewTiles: number;
  setPreviewTiles: (n: number) => void;
  tileSpacingCm: number;
  setTileSpacingCm: (n: number) => void;

  // Borders
  showBorder: boolean;
  setShowBorder: (v: boolean) => void;
  borderThicknessCm: number;
  setBorderThicknessCm: (n: number) => void;
  showBorder2: boolean;
  setShowBorder2: (v: boolean) => void;
  borderThicknessCm2: number;
  setBorderThicknessCm2: (n: number) => void;
  borderGapCm: number;
  setBorderGapCm: (n: number) => void;

  // Colors
  baseColor: string;
  setBaseColor: (c: string) => void;
  borderColor: string;
  setBorderColor: (c: string) => void;
  borderColor2: string;
  setBorderColor2: (c: string) => void;

  // Workspace
  snapEnabled: boolean;
  setSnapEnabled: (v: boolean) => void;
  showSourceGuides: boolean;
  setShowSourceGuides: (v: boolean) => void;
  moveAsGroup: boolean;
  setMoveAsGroup: (v: boolean) => void;

  // Zoom & View
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  effectiveZoom: number;
  viewMode: 'both' | 'workspace' | 'preview';
  setViewMode: (m: 'both' | 'workspace' | 'preview') => void;

  // Drag
  dragState: MonogramDragState | null;
  setDragState: React.Dispatch<React.SetStateAction<MonogramDragState | null>>;
  activeSnapGuides: MonogramSnapGuides;
  setActiveSnapGuides: React.Dispatch<React.SetStateAction<MonogramSnapGuides>>;

  startDraggingLetter: (event: React.PointerEvent, letter: MonogramLetter) => void;
  startResize: (event: React.PointerEvent, letter: MonogramLetter, corner: 'nw' | 'ne' | 'sw' | 'se') => void;
  startRotate: (event: React.PointerEvent, letter: MonogramLetter) => void;
  updateDrag: (event: React.PointerEvent) => void;
  stopDragging: () => void;
  getSnapFeedback: () => string;
  guidePercentToPx: (percent: number) => number;

  // Refs
  sourceStageRef: React.RefObject<HTMLDivElement | null>;
  previewStageRef: React.RefObject<HTMLDivElement | null>;
  tileInputRefs: React.RefObject<Record<string, HTMLInputElement | null>>;

  // Computed
  selectedLetter: MonogramLetter | undefined;
  previewOffsets: number[];
  previewOriginTile: number;
  previewUnitSize: number;
  previewTileSize: number;
  previewScale: number;
  sourceTileOrigin: number;
  sourceTileSize: number;
  sourceScale: number;
  repeatStep: number;
  previewViewportSize: number;

  // Snapshot
  getSnapshot: () => MonogramSnapshot;
  loadSnapshot: (snapshot: MonogramSnapshot) => void;

  // Reset
  resetPrototype: () => void;
}

const SNAP_POINTS = [0, 25, 50, 75, 100];
const SNAP_THRESHOLD = 5; // percentage

export function useMonogramState(): MonogramState {
  // ── Core State ──
  const [letters, setLetters] = useState<MonogramLetter[]>(() => [
    createDefaultLetter(0),
    createDefaultLetter(1),
  ]);
  const [selectedLetterId, setSelectedLetterId] = useState<string>(
    () => letters[0]?.id ?? ''
  );

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [linkTextSize, setLinkTextSize] = useState(false);

  const [previewTiles, setPreviewTiles] = useState(5);
  const [tileSpacingCm, setTileSpacingCm] = useState(2);

  const [showBorder, setShowBorder] = useState(true);
  const [borderThicknessCm, setBorderThicknessCm] = useState(3);
  const [showBorder2, setShowBorder2] = useState(false);
  const [borderThicknessCm2, setBorderThicknessCm2] = useState(1);
  const [borderGapCm, setBorderGapCm] = useState(1);

  const [baseColor, setBaseColor] = useState('#F5F0E8');
  const [borderColor, setBorderColor] = useState('#D4AF37');
  const [borderColor2, setBorderColor2] = useState('#8A8278');

  const [snapEnabled, setSnapEnabled] = useState(true);
  const [showSourceGuides, setShowSourceGuides] = useState(true);
  const [moveAsGroup, setMoveAsGroup] = useState(false);

  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<'both' | 'workspace' | 'preview'>('both');

  const [dragState, setDragState] = useState<MonogramDragState | null>(null);
  const [activeSnapGuides, setActiveSnapGuides] = useState<MonogramSnapGuides>({ x: null, y: null });

  const sourceStageRef = useRef<HTMLDivElement>(null);
  const previewStageRef = useRef<HTMLDivElement>(null);
  const tileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ── Computed ──
  const selectedLetter = useMemo(
    () => letters.find((l) => l.id === selectedLetterId),
    [letters, selectedLetterId]
  );

  const effectiveZoom = useMemo(() => {
    if (viewMode === 'both') return Math.min(zoom, 100);
    return zoom;
  }, [zoom, viewMode]);

  // Source tile geometry
  const sourceTileSize = SOURCE_VIEWPORT_SIZE * 0.65;
  const sourceTileOrigin = (SOURCE_VIEWPORT_SIZE - sourceTileSize) / 2;
  const sourceScale = sourceTileSize / TILE_SIZE;
  const repeatStep = sourceTileSize;

  // Preview geometry
  const previewViewportSize = PREVIEW_VIEWPORT_SIZE;
  const previewOriginTile = Math.floor(previewTiles / 2);
  const previewUnitSize = previewViewportSize / previewTiles;
  const previewTileSize = previewUnitSize * 0.65;
  const previewScale = previewTileSize / TILE_SIZE;

  const previewOffsets = useMemo(() => {
    const offsets: number[] = [];
    for (let i = 0; i < previewTiles; i++) {
      offsets.push(i - previewOriginTile);
    }
    return offsets;
  }, [previewTiles, previewOriginTile]);

  // ── Actions ──
  const addLetter = useCallback(() => {
    if (letters.length >= MAX_LETTERS) return;
    const last = letters[letters.length - 1];
    const newLetter: MonogramLetter = {
      id: generateLetterId(),
      char: '',
      fontId: last?.fontId ?? 'classic-serif',
      fontSize: last?.fontSize ?? 120,
      rotation: 0,
      x: 50,
      y: 50,
      color: last?.color ?? '#2A2A2A',
      blendMode: 'normal',
    };
    setLetters((prev) => [...prev, newLetter]);
    setSelectedLetterId(newLetter.id);
  }, [letters]);

  const deleteLetter = useCallback(
    (id: string) => {
      setLetters((prev) => {
        if (prev.length <= 1) return prev;
        const idx = prev.findIndex((l) => l.id === id);
        if (idx === -1) return prev;
        const next = [...prev];
        next.splice(idx, 1);
        const nextId = prev[idx - 1]?.id ?? prev[idx + 1]?.id ?? '';
        if (selectedLetterId === id) {
          setSelectedLetterId(nextId);
        }
        return next;
      });
    },
    [selectedLetterId]
  );

  const updateTextBoxCharacter = useCallback((id: string, char: string) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, char: char.slice(0, 1).toUpperCase() } : l))
    );
  }, []);

  const updateLetter = useCallback((id: string, updates: Partial<MonogramLetter>) => {
    setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }, []);

  const updateTextSize = useCallback(
    (id: string, size: number) => {
      setLetters((prev) =>
        prev.map((l) => {
          if (l.id === id) return { ...l, fontSize: size };
          if (linkTextSize) return { ...l, fontSize: size };
          return l;
        })
      );
    },
    [linkTextSize]
  );

  const toggleLinkTextSize = useCallback((enabled: boolean) => {
    setLinkTextSize(enabled);
    if (enabled && selectedLetter) {
      setLetters((prev) =>
        prev.map((l) => ({ ...l, fontSize: selectedLetter.fontSize }))
      );
    }
  }, [selectedLetter]);

  // ── Drag System ──
  const startDraggingLetter = useCallback(
    (event: React.PointerEvent, letter: MonogramLetter) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectedLetterId(letter.id);
      setDragState({
        letterId: letter.id,
        mode: 'move',
        startX: event.clientX,
        startY: event.clientY,
        origX: letter.x,
        origY: letter.y,
        origFontSize: letter.fontSize,
        origRotation: letter.rotation,
      });
    },
    []
  );

  const startResize = useCallback(
    (event: React.PointerEvent, letter: MonogramLetter, corner: 'nw' | 'ne' | 'sw' | 'se') => {
      event.preventDefault();
      event.stopPropagation();
      setDragState({
        letterId: letter.id,
        mode: 'resize',
        startX: event.clientX,
        startY: event.clientY,
        origX: letter.x,
        origY: letter.y,
        origFontSize: letter.fontSize,
        origRotation: letter.rotation,
        resizeCorner: corner,
      });
    },
    []
  );

  const startRotate = useCallback(
    (event: React.PointerEvent, letter: MonogramLetter) => {
      event.preventDefault();
      event.stopPropagation();
      setDragState({
        letterId: letter.id,
        mode: 'rotate',
        startX: event.clientX,
        startY: event.clientY,
        origX: letter.x,
        origY: letter.y,
        origFontSize: letter.fontSize,
        origRotation: letter.rotation,
      });
    },
    []
  );

  const updateDrag = useCallback(
    (event: React.PointerEvent) => {
      if (!dragState) return;
      const letter = letters.find((l) => l.id === dragState.letterId);
      if (!letter) return;

      const scale = effectiveZoom / 100;
      const dx = (event.clientX - dragState.startX) / scale;
      const dy = (event.clientY - dragState.startY) / scale;

      if (dragState.mode === 'move') {
        const newX = dragState.origX + (dx / sourceTileSize) * 100;
        const newY = dragState.origY + (dy / sourceTileSize) * 100;

        let snappedX = clamp(newX, 0, 100);
        let snappedY = clamp(newY, 0, 100);
        let guideX: number | null = null;
        let guideY: number | null = null;

        if (snapEnabled) {
          for (const sp of SNAP_POINTS) {
            if (Math.abs(snappedX - sp) < SNAP_THRESHOLD) {
              snappedX = sp;
              guideX = sp;
              break;
            }
          }
          for (const sp of SNAP_POINTS) {
            if (Math.abs(snappedY - sp) < SNAP_THRESHOLD) {
              snappedY = sp;
              guideY = sp;
              break;
            }
          }
        }

        setActiveSnapGuides({ x: guideX, y: guideY });

        if (moveAsGroup) {
          setLetters((prev) =>
            prev.map((l) => ({
              ...l,
              x: clamp(l.x + snappedX - letter.x, 0, 100),
              y: clamp(l.y + snappedY - letter.y, 0, 100),
            }))
          );
        } else {
          setLetters((prev) =>
            prev.map((l) => (l.id === letter.id ? { ...l, x: snappedX, y: snappedY } : l))
          );
        }
      } else if (dragState.mode === 'resize') {
        const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
        const newSize = clamp(Math.round((dragState.origFontSize + delta * 0.5) / 10) * 10, 20, 250);
        setLetters((prev) =>
          prev.map((l) => {
            if (l.id === letter.id) return { ...l, fontSize: newSize };
            if (linkTextSize) return { ...l, fontSize: newSize };
            return l;
          })
        );
      } else if (dragState.mode === 'rotate') {
        const newRot = snapRotation(dragState.origRotation + dx * 0.5);
        setLetters((prev) =>
          prev.map((l) => (l.id === letter.id ? { ...l, rotation: newRot } : l))
        );
      }
    },
    [dragState, letters, sourceTileSize, snapEnabled, moveAsGroup, linkTextSize, effectiveZoom]
  );

  const stopDragging = useCallback(() => {
    setDragState(null);
    setActiveSnapGuides({ x: null, y: null });
  }, []);

  const getSnapFeedback = useCallback(() => {
    const parts: string[] = [];
    if (activeSnapGuides.x !== null) parts.push(`X:${activeSnapGuides.x}%`);
    if (activeSnapGuides.y !== null) parts.push(`Y:${activeSnapGuides.y}%`);
    return parts.join('  ') || 'Snapped';
  }, [activeSnapGuides]);

  const guidePercentToPx = useCallback(
    (percent: number) => sourceTileOrigin + (percent / 100) * sourceTileSize,
    [sourceTileOrigin, sourceTileSize]
  );

  // ── Snapshot ──
  const getSnapshot = useCallback((): MonogramSnapshot => {
    return {
      letters: letters.map((l) => ({ ...l })),
      config: {
        baseColor,
        borderColor,
        border2Color: borderColor2,
        previewTiles,
        tileSpacingCm,
        showBorder,
        borderThicknessCm,
        showBorder2,
        borderThicknessCm2,
        borderGapCm,
        snapEnabled,
        showSourceGuides,
        moveAsGroup,
        zoom,
        viewMode,
      },
      selectedLetterId,
    };
  }, [
    letters, baseColor, borderColor, borderColor2, previewTiles, tileSpacingCm,
    showBorder, borderThicknessCm, showBorder2, borderThicknessCm2, borderGapCm,
    snapEnabled, showSourceGuides, moveAsGroup, zoom, viewMode, selectedLetterId,
  ]);

  const loadSnapshot = useCallback((snapshot: MonogramSnapshot) => {
    setLetters(snapshot.letters.map((l) => ({ ...l })));
    setSelectedLetterId(snapshot.selectedLetterId);
    setBaseColor(snapshot.config.baseColor);
    setBorderColor(snapshot.config.borderColor);
    setBorderColor2(snapshot.config.border2Color);
    setPreviewTiles(snapshot.config.previewTiles);
    setTileSpacingCm(snapshot.config.tileSpacingCm);
    setShowBorder(snapshot.config.showBorder);
    setBorderThicknessCm(snapshot.config.borderThicknessCm);
    setShowBorder2(snapshot.config.showBorder2);
    setBorderThicknessCm2(snapshot.config.borderThicknessCm2);
    setBorderGapCm(snapshot.config.borderGapCm);
    setSnapEnabled(snapshot.config.snapEnabled);
    setShowSourceGuides(snapshot.config.showSourceGuides);
    setMoveAsGroup(snapshot.config.moveAsGroup);
    setZoom(snapshot.config.zoom);
    setViewMode(snapshot.config.viewMode);
  }, []);

  // ── Reset ──
  const resetPrototype = useCallback(() => {
    setLetters([createDefaultLetter(0), createDefaultLetter(1)]);
    setSelectedLetterId('');
    setShowAdvanced(false);
    setLinkTextSize(false);
    setPreviewTiles(5);
    setTileSpacingCm(2);
    setShowBorder(true);
    setBorderThicknessCm(3);
    setShowBorder2(false);
    setBorderThicknessCm2(1);
    setBorderGapCm(1);
    setBaseColor('#F5F0E8');
    setBorderColor('#D4AF37');
    setBorderColor2('#8A8278');
    setSnapEnabled(true);
    setShowSourceGuides(true);
    setMoveAsGroup(false);
    setZoom(100);
    setViewMode('both');
    setDragState(null);
    setActiveSnapGuides({ x: null, y: null });
  }, []);

  return {
    letters,
    selectedLetterId,
    setSelectedLetterId,
    addLetter,
    deleteLetter,
    updateTextBoxCharacter,
    updateLetter,
    updateTextSize,
    linkTextSize,
    toggleLinkTextSize,
    showAdvanced,
    setShowAdvanced,
    previewTiles,
    setPreviewTiles,
    tileSpacingCm,
    setTileSpacingCm,
    showBorder,
    setShowBorder,
    borderThicknessCm,
    setBorderThicknessCm,
    showBorder2,
    setShowBorder2,
    borderThicknessCm2,
    setBorderThicknessCm2,
    borderGapCm,
    setBorderGapCm,
    baseColor,
    setBaseColor,
    borderColor,
    setBorderColor,
    borderColor2,
    setBorderColor2,
    snapEnabled,
    setSnapEnabled,
    showSourceGuides,
    setShowSourceGuides,
    moveAsGroup,
    setMoveAsGroup,
    zoom,
    setZoom,
    effectiveZoom,
    viewMode,
    setViewMode,
    dragState,
    setDragState,
    activeSnapGuides,
    setActiveSnapGuides,
    startDraggingLetter,
    startResize,
    startRotate,
    updateDrag,
    stopDragging,
    getSnapFeedback,
    guidePercentToPx,
    sourceStageRef,
    previewStageRef,
    tileInputRefs,
    selectedLetter,
    previewOffsets,
    previewOriginTile,
    previewUnitSize,
    previewTileSize,
    previewScale,
    sourceTileOrigin,
    sourceTileSize,
    sourceScale,
    repeatStep,
    previewViewportSize,
    getSnapshot,
    loadSnapshot,
    resetPrototype,
  };
}
