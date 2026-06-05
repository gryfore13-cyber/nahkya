import { useRef, useState, useCallback, useEffect } from 'react';
import {
  extractLineartFromImage,
  drawComposite,
  bucketFill,
  isValidHex,
  type MaskLayer,
} from '@/lib/canvas/coloringEngine';

type ToolMode = 'paint' | 'picker' | 'replace';
type Layer = 'base' | 'paint' | 'lineart';

interface ColoringEngineOptions {
  canvasSize?: number;
  bucketTolerance?: number;
  lineThreshold?: number;
}

interface ColoringEngineState {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasSize: number;
  hasImage: boolean;
  error: string;
  mode: ToolMode;
  setMode: (mode: ToolMode) => void;
  activeLayer: Layer;
  setActiveLayer: (layer: Layer) => void;
  baseColor: string;
  paintColor: string;
  lineColor: string;
  activeLayerColor: string;
  activeLayerLabel: string;
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  loadImage: (url: string) => Promise<void>;
  handleCanvasClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  applyColorToActiveLayer: (value: string) => void;
  clearPaint: () => void;
  resetAll: () => void;
}

export function useColoringEngine(options: ColoringEngineOptions = {}): ColoringEngineState {
  const { canvasSize = 720, bucketTolerance = 80, lineThreshold = 220 } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasImage, setHasImage] = useState(false);
  const [error, setError] = useState('');

  const [baseColor, setBaseColor] = useState('#f8f5ef');
  const [paintColor, setPaintColor] = useState('#b84a62');
  const [lineColor, setLineColor] = useState('#111111');

  const [mode, setMode] = useState<ToolMode>('paint');
  const [activeLayer, setActiveLayer] = useState<Layer>('paint');
  const [zoom, setZoom] = useState(1);

  const paintLayerRef = useRef<ImageData | null>(null);
  const maskLayerRef = useRef<MaskLayer | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const getCanvas = useCallback(() => canvasRef.current, []);

  const getActiveLayerColor = useCallback(() => {
    if (activeLayer === 'base') return baseColor;
    if (activeLayer === 'lineart') return lineColor;
    return paintColor;
  }, [activeLayer, baseColor, lineColor, paintColor]);

  const getActiveLayerLabel = useCallback(() => {
    if (activeLayer === 'base') return 'Base Colour';
    if (activeLayer === 'lineart') return 'Lineart Colour';
    return 'Artwork Colour';
  }, [activeLayer]);

  const loadImage = useCallback(
    async (url: string) => {
      setError('');
      try {
        const canvas = getCanvas();
        if (!canvas) return;

        const { mask, paintLayer } = await extractLineartFromImage(
          canvas,
          url,
          canvasSize,
          lineThreshold
        );

        maskLayerRef.current = mask;
        paintLayerRef.current = paintLayer;
        historyRef.current = [];
        historyIndexRef.current = -1;
        setCanUndo(false);
        setCanRedo(false);
        setHasImage(true);
        drawComposite(canvas, paintLayer, mask, baseColor, lineColor);
      } catch {
        setError('Failed to load image. Please try again.');
        setHasImage(false);
      }
    },
    [canvasSize, lineThreshold, getCanvas, baseColor, lineColor]
  );

  const applyColorToActiveLayer = useCallback(
    (value: string) => {
      if (!isValidHex(value)) return;

      if (activeLayer === 'base') {
        setBaseColor(value);
        return;
      }
      if (activeLayer === 'lineart') {
        setLineColor(value);
        return;
      }
      setPaintColor(value);
    },
    [activeLayer]
  );

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!hasImage || !maskLayerRef.current || !paintLayerRef.current) return;

      const canvas = getCanvas();
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });
      if (!canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width);
      const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height);

      if (mode === 'picker') {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const picked = `#${[pixel[0], pixel[1], pixel[2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
        applyColorToActiveLayer(picked);
        return;
      }

      if (mode === 'paint') {
        setActiveLayer('paint');
        // Snapshot current paint layer for undo
        if (paintLayerRef.current) {
          historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
          historyRef.current.push(
            new ImageData(
              new Uint8ClampedArray(paintLayerRef.current.data),
              paintLayerRef.current.width,
              paintLayerRef.current.height
            )
          );
          historyIndexRef.current++;
          setCanUndo(historyIndexRef.current >= 0);
          setCanRedo(false);
        }
        const currentComposite = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const nextPaintLayer = bucketFill(
          x,
          y,
          paintColor,
          currentComposite,
          paintLayerRef.current,
          maskLayerRef.current,
          bucketTolerance
        );
        paintLayerRef.current = nextPaintLayer;
        drawComposite(canvas, nextPaintLayer, maskLayerRef.current, baseColor, lineColor);
      }
    },
    [hasImage, mode, paintColor, baseColor, lineColor, bucketTolerance, getCanvas, applyColorToActiveLayer]
  );

  // Redraw canvas when base or lineart colour changes
  useEffect(() => {
    const canvas = getCanvas();
    if (!canvas || !maskLayerRef.current) return;
    drawComposite(canvas, paintLayerRef.current, maskLayerRef.current, baseColor, lineColor);
  }, [baseColor, lineColor, getCanvas]);

  const clearPaint = useCallback(() => {
    const canvas = getCanvas();
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx || !maskLayerRef.current) return;

    // Snapshot current paint layer for undo
    if (paintLayerRef.current) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(
        new ImageData(
          new Uint8ClampedArray(paintLayerRef.current.data),
          paintLayerRef.current.width,
          paintLayerRef.current.height
        )
      );
      historyIndexRef.current++;
    }

    const freshPaintLayer = ctx.createImageData(canvas.width, canvas.height);
    paintLayerRef.current = freshPaintLayer;
    drawComposite(canvas, freshPaintLayer, maskLayerRef.current, baseColor, lineColor);
    setCanUndo(historyIndexRef.current >= 0);
    setCanRedo(false);
  }, [getCanvas, baseColor, lineColor]);

  const resetAll = useCallback(() => {
    setHasImage(false);
    setError('');
    setBaseColor('#f8f5ef');
    setPaintColor('#b84a62');
    setLineColor('#111111');
    setMode('paint');
    setActiveLayer('paint');
    paintLayerRef.current = null;
    maskLayerRef.current = null;
    historyRef.current = [];
    historyIndexRef.current = -1;
    setCanUndo(false);
    setCanRedo(false);
    setZoom(1);

    const canvas = getCanvas();
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) ctx.clearRect(0, 0, canvasSize, canvasSize);
  }, [getCanvas, canvasSize]);

  const zoomIn = useCallback(() => {
    setZoom((current) => Math.min(3, Number((current + 0.25).toFixed(2))));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((current) => Math.max(0.5, Number((current - 0.25).toFixed(2))));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current < 0) return;
    const canvas = getCanvas();
    if (!canvas || !maskLayerRef.current) return;
    const layer = historyRef.current[historyIndexRef.current];
    paintLayerRef.current = new ImageData(
      new Uint8ClampedArray(layer.data),
      layer.width,
      layer.height
    );
    historyIndexRef.current--;
    drawComposite(canvas, paintLayerRef.current, maskLayerRef.current, baseColor, lineColor);
    setCanUndo(historyIndexRef.current >= 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, [getCanvas, baseColor, lineColor]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    const canvas = getCanvas();
    if (!canvas || !maskLayerRef.current) return;
    const layer = historyRef.current[historyIndexRef.current];
    paintLayerRef.current = new ImageData(
      new Uint8ClampedArray(layer.data),
      layer.width,
      layer.height
    );
    drawComposite(canvas, paintLayerRef.current, maskLayerRef.current, baseColor, lineColor);
    setCanUndo(historyIndexRef.current >= 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, [getCanvas, baseColor, lineColor]);

  return {
    canvasRef,
    canvasSize,
    hasImage,
    error,
    mode,
    setMode,
    activeLayer,
    setActiveLayer,
    baseColor,
    paintColor,
    lineColor,
    activeLayerColor: getActiveLayerColor(),
    activeLayerLabel: getActiveLayerLabel(),
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    canUndo,
    canRedo,
    undo,
    redo,
    loadImage,
    handleCanvasClick,
    applyColorToActiveLayer,
    clearPaint,
    resetAll,
  };
}
