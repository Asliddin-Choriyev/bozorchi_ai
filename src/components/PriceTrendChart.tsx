import React, { useState } from 'react';
import { TrendPoint } from '../types';
import { formatUZS } from '../utils/format';

interface Props {
  points: TrendPoint[];
  fairMin?: number;
  fairMax?: number;
  unit: string;
}

export const PriceTrendChart: React.FC<Props> = ({
  points,
  fairMin = 11400,
  fairMax = 12800,
  unit
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(points.length - 1);

  if (!points || points.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-ink-muted bg-cream-card rounded-card border border-[#E8DFC9]">
        Grafik ma'lumotlari yuklanmoqda...
      </div>
    );
  }

  // Dimensions
  const width = 340;
  const height = 150;
  const padLeft = 42;
  const padRight = 15;
  const padTop = 15;
  const padBottom = 25;

  const minVal = 11200;
  const maxVal = 13000;

  const getX = (index: number) => {
    return padLeft + (index / (points.length - 1)) * (width - padLeft - padRight);
  };

  const getY = (price: number) => {
    return padTop + ((maxVal - price) / (maxVal - minVal)) * (height - padTop - padBottom);
  };

  // Build SVG path
  const pathD = points.reduce((acc, pt, idx) => {
    const x = getX(idx);
    const y = getY(pt.price);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Fair corridor rect
  const fairYTop = getY(fairMax);
  const fairYBottom = getY(fairMin);
  const fairHeight = Math.max(2, fairYBottom - fairYTop);

  const activePoint = activeIdx !== null ? points[activeIdx] : points[points.length - 1];

  return (
    <div className="w-full bg-[#FDFBF7] rounded-[14px] p-3 border border-[#E7DFC8] shadow-card">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[11px] text-ink-muted uppercase font-bold tracking-wider">
            {activePoint.date} holatiga narx
          </span>
          <div className="text-lg font-bold font-serif text-teal-action">
            {formatUZS(activePoint.price)} <span className="text-xs font-normal text-ink-muted">/{unit}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B8A5A] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#1B8A5A]/20">
            ▼ -7.8% (30 kunda)
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Fair price corridor background */}
          <rect
            x={padLeft}
            y={fairYTop}
            width={width - padLeft - padRight}
            height={fairHeight}
            fill="#E3B341"
            fillOpacity="0.12"
            stroke="#E3B341"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />

          {/* Fair corridor horizontal guide lines */}
          <line
            x1={padLeft}
            y1={fairYTop}
            x2={width - padRight}
            y2={fairYTop}
            stroke="#C99824"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <line
            x1={padLeft}
            y1={fairYBottom}
            x2={width - padRight}
            y2={fairYBottom}
            stroke="#0B6B62"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />

          {/* Y Axis Labels */}
          <text x={padLeft - 6} y={getY(12800) + 4} textAnchor="end" fontSize="9" fill="#8A7D69" fontWeight="600">
            12.8k
          </text>
          <text x={padLeft - 6} y={getY(12100) + 4} textAnchor="end" fontSize="9" fill="#8A7D69" fontWeight="600">
            12.1k
          </text>
          <text x={padLeft - 6} y={getY(11400) + 4} textAnchor="end" fontSize="9" fill="#0B6B62" fontWeight="700">
            11.4k
          </text>

          {/* Price line path */}
          <path
            d={pathD}
            fill="none"
            stroke="#0B6B62"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Touch / Click hit areas for all 30 points */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const y = getY(pt.price);
            const isActive = activeIdx === idx;
            return (
              <g key={idx}>
                {isActive && (
                  <>
                    <line
                      x1={x}
                      y1={padTop}
                      x2={x}
                      y2={height - padBottom}
                      stroke="#0B6B62"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />
                    <circle cx={x} cy={y} r="5" fill="#E3B341" stroke="#0B6B62" strokeWidth="2.5" />
                  </>
                )}
                {/* Transparent hit area */}
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => setActiveIdx(idx)}
                />
              </g>
            );
          })}

          {/* X Axis Date labels */}
          <text x={padLeft} y={height - 8} fontSize="9" fill="#8A7D69">
            {points[0].date}
          </text>
          <text x={(padLeft + width - padRight) / 2} y={height - 8} fontSize="9" fill="#8A7D69" textAnchor="middle">
            {points[Math.floor(points.length / 2)].date}
          </text>
          <text x={width - padRight} y={height - 8} fontSize="9" fill="#8A7D69" textAnchor="end">
            Bugun
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-ink-muted pt-2 border-t border-[#EDE5D2] mt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded bg-[#E3B341]/20 border border-[#E3B341]"></span>
          <span>Adolatli oraliq (11.4k - 12.8k)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-teal-action rounded-full"></span>
          <span>Haqiqiy narx</span>
        </div>
      </div>
    </div>
  );
};
