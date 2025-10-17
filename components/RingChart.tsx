type RingChartProps = { percent: number; label: string };

export function RingChart({ percent, label }: RingChartProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const radius = 56;
  const thickness = 12;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={140} height={140} viewBox="0 0 140 140" aria-label={`${label} ${clamped}%`}>
        <g transform="translate(70,70)">
          <circle r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth={thickness} />
          <circle
            r={radius}
            fill="transparent"
            stroke="#0f172a"
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={circumference * -0.25}
            transform="rotate(-90)"
            strokeLinecap="round"
          />
          <text x="0" y="6" textAnchor="middle" fontSize="18" fill="#0f172a" fontWeight={600}>
            {clamped}%
          </text>
        </g>
      </svg>
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}


