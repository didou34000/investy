import React, { useMemo } from "react";
import { DashCard } from "./DashCard";
import { TrendingUp } from "lucide-react";

type Props = {
  expectedReturn?: number | null;
};

function buildSeries(expectedReturn?: number | null) {
  const base = 10000;
  const rate = expectedReturn ? expectedReturn / 100 : 0.05;
  const years = 10;
  const points: number[] = [];
  let value = base;
  for (let i = 0; i <= years; i++) {
    points.push(Math.round(value));
    value *= 1 + rate;
  }
  return points;
}

export function ProjectionSparkline({ expectedReturn }: Props) {
  const points = useMemo(() => buildSeries(expectedReturn), [expectedReturn]);
  const max = Math.max(...points);
  const min = Math.min(...points);
  const width = 240;
  const height = 80;

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const growth = expectedReturn ? `~ +${(expectedReturn * 10).toFixed(0)}% sur 10 ans` : "Proj. standardisée";

  return (
    <DashCard>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Projection 10 ans (indicative)
        </div>
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 text-blue-500">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              points={path}
              className="drop-shadow-sm"
            />
            <defs>
              <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.02)" />
              </linearGradient>
            </defs>
            <polygon
              fill="url(#sparkFill)"
              points={`0,${height} ${path} ${width},${height}`}
            />
          </svg>
          <p className="text-xs text-slate-500 mt-2">{growth}</p>
        </div>
      </div>
    </DashCard>
  );
}

