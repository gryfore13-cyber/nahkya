// src/components/monogram/MonogramTileFrame.tsx — Decorative tile frame overlays

import type { TileFrameStyle } from '@/lib/monogramConstants';

interface MonogramTileFrameProps {
  style: TileFrameStyle;
  size: number;
  color: string;
  color2?: string;
}

const VB = 100;
const INSET = 4;

export function MonogramTileFrame({ style, size, color, color2 }: MonogramTileFrameProps) {
  if (style === 'none' || !style) return null;

  const c2 = color2 || color;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VB} ${VB}`}
      className="absolute pointer-events-none"
      style={{ left: 0, top: 0 }}
    >
      {style === 'simple' && (
        <rect
          x={INSET}
          y={INSET}
          width={VB - INSET * 2}
          height={VB - INSET * 2}
          fill="none"
          stroke={color}
          strokeWidth={2}
        />
      )}

      {style === 'double' && (
        <>
          <rect
            x={INSET}
            y={INSET}
            width={VB - INSET * 2}
            height={VB - INSET * 2}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
          />
          <rect
            x={INSET + 5}
            y={INSET + 5}
            width={VB - (INSET + 5) * 2}
            height={VB - (INSET + 5) * 2}
            fill="none"
            stroke={c2}
            strokeWidth={1.5}
          />
        </>
      )}

      {style === 'corner-dots' && (
        <>
          <circle cx={INSET + 2} cy={INSET + 2} r={2.5} fill={color} />
          <circle cx={VB - INSET - 2} cy={INSET + 2} r={2.5} fill={color} />
          <circle cx={INSET + 2} cy={VB - INSET - 2} r={2.5} fill={color} />
          <circle cx={VB - INSET - 2} cy={VB - INSET - 2} r={2.5} fill={color} />
          <line x1={INSET + 6} y1={INSET} x2={VB - INSET - 6} y2={INSET} stroke={color} strokeWidth={1.5} />
          <line x1={INSET + 6} y1={VB - INSET} x2={VB - INSET - 6} y2={VB - INSET} stroke={color} strokeWidth={1.5} />
          <line x1={INSET} y1={INSET + 6} x2={INSET} y2={VB - INSET - 6} stroke={color} strokeWidth={1.5} />
          <line x1={VB - INSET} y1={INSET + 6} x2={VB - INSET} y2={VB - INSET - 6} stroke={color} strokeWidth={1.5} />
        </>
      )}

      {style === 'corner-diamonds' && (
        <>
          {/* Edge segments */}
          <line x1={INSET + 8} y1={INSET} x2={VB / 2 - 4} y2={INSET} stroke={color} strokeWidth={1.5} />
          <line x1={VB / 2 + 4} y1={INSET} x2={VB - INSET - 8} y2={INSET} stroke={color} strokeWidth={1.5} />
          <line x1={INSET + 8} y1={VB - INSET} x2={VB / 2 - 4} y2={VB - INSET} stroke={color} strokeWidth={1.5} />
          <line x1={VB / 2 + 4} y1={VB - INSET} x2={VB - INSET - 8} y2={VB - INSET} stroke={color} strokeWidth={1.5} />
          <line x1={INSET} y1={INSET + 8} x2={INSET} y2={VB / 2 - 4} stroke={color} strokeWidth={1.5} />
          <line x1={INSET} y1={VB / 2 + 4} x2={INSET} y2={VB - INSET - 8} stroke={color} strokeWidth={1.5} />
          <line x1={VB - INSET} y1={INSET + 8} x2={VB - INSET} y2={VB / 2 - 4} stroke={color} strokeWidth={1.5} />
          <line x1={VB - INSET} y1={VB / 2 + 4} x2={VB - INSET} y2={VB - INSET - 8} stroke={color} strokeWidth={1.5} />
          {/* Corner diamonds */}
          <polygon points={`${INSET},${INSET - 4} ${INSET + 4},${INSET} ${INSET},${INSET + 4} ${INSET - 4},${INSET}`} fill={color} />
          <polygon points={`${VB - INSET},${INSET - 4} ${VB - INSET + 4},${INSET} ${VB - INSET},${INSET + 4} ${VB - INSET - 4},${INSET}`} fill={color} />
          <polygon points={`${INSET},${VB - INSET - 4} ${INSET + 4},${VB - INSET} ${INSET},${VB - INSET + 4} ${INSET - 4},${VB - INSET}`} fill={color} />
          <polygon points={`${VB - INSET},${VB - INSET - 4} ${VB - INSET + 4},${VB - INSET} ${VB - INSET},${VB - INSET + 4} ${VB - INSET - 4},${VB - INSET}`} fill={color} />
          {/* Mid-edge diamonds */}
          <polygon points={`${VB / 2},${INSET - 3} ${VB / 2 + 3},${INSET} ${VB / 2},${INSET + 3} ${VB / 2 - 3},${INSET}`} fill={c2} />
          <polygon points={`${VB / 2},${VB - INSET - 3} ${VB / 2 + 3},${VB - INSET} ${VB / 2},${VB - INSET + 3} ${VB / 2 - 3},${VB - INSET}`} fill={c2} />
          <polygon points={`${INSET - 3},${VB / 2} ${INSET},${VB / 2 + 3} ${INSET + 3},${VB / 2} ${INSET},${VB / 2 - 3}`} fill={c2} />
          <polygon points={`${VB - INSET - 3},${VB / 2} ${VB - INSET},${VB / 2 + 3} ${VB - INSET + 3},${VB / 2} ${VB - INSET},${VB / 2 - 3}`} fill={c2} />
        </>
      )}

      {style === 'miter' && (
        <>
          <path d={`M ${INSET} ${INSET + 10} L ${INSET} ${INSET} L ${INSET + 10} ${INSET}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="square" />
          <path d={`M ${VB - INSET - 10} ${INSET} L ${VB - INSET} ${INSET} L ${VB - INSET} ${INSET + 10}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="square" />
          <path d={`M ${VB - INSET} ${VB - INSET - 10} L ${VB - INSET} ${VB - INSET} L ${VB - INSET - 10} ${VB - INSET}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="square" />
          <path d={`M ${INSET + 10} ${VB - INSET} L ${INSET} ${VB - INSET} L ${INSET} ${VB - INSET - 10}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="square" />
        </>
      )}

      {style === 'scalloped' && (
        <>
          {/* Top */}
          <path
            d={`M ${INSET} ${INSET + 6} Q ${INSET + 10} ${INSET} ${INSET + 20} ${INSET + 6} Q ${INSET + 30} ${INSET + 12} ${INSET + 40} ${INSET + 6} Q ${INSET + 50} ${INSET} ${INSET + 60} ${INSET + 6} Q ${INSET + 70} ${INSET + 12} ${INSET + 80} ${INSET + 6} Q ${INSET + 90} ${INSET} ${VB - INSET} ${INSET + 6}`}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
          {/* Bottom */}
          <path
            d={`M ${INSET} ${VB - INSET - 6} Q ${INSET + 10} ${VB - INSET} ${INSET + 20} ${VB - INSET - 6} Q ${INSET + 30} ${VB - INSET - 12} ${INSET + 40} ${VB - INSET - 6} Q ${INSET + 50} ${VB - INSET} ${INSET + 60} ${VB - INSET - 6} Q ${INSET + 70} ${VB - INSET - 12} ${INSET + 80} ${VB - INSET - 6} Q ${INSET + 90} ${VB - INSET} ${VB - INSET} ${VB - INSET - 6}`}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
          {/* Left */}
          <path
            d={`M ${INSET + 6} ${INSET} Q ${INSET} ${INSET + 10} ${INSET + 6} ${INSET + 20} Q ${INSET + 12} ${INSET + 30} ${INSET + 6} ${INSET + 40} Q ${INSET} ${INSET + 50} ${INSET + 6} ${INSET + 60} Q ${INSET + 12} ${INSET + 70} ${INSET + 6} ${INSET + 80} Q ${INSET} ${INSET + 90} ${INSET + 6} ${VB - INSET}`}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
          {/* Right */}
          <path
            d={`M ${VB - INSET - 6} ${INSET} Q ${VB - INSET} ${INSET + 10} ${VB - INSET - 6} ${INSET + 20} Q ${VB - INSET - 12} ${INSET + 30} ${VB - INSET - 6} ${INSET + 40} Q ${VB - INSET} ${INSET + 50} ${VB - INSET - 6} ${INSET + 60} Q ${VB - INSET - 12} ${INSET + 70} ${VB - INSET - 6} ${INSET + 80} Q ${VB - INSET} ${INSET + 90} ${VB - INSET - 6} ${VB - INSET}`}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
        </>
      )}
    </svg>
  );
}
