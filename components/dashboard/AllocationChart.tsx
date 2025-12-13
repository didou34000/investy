import React, { useMemo } from "react";
import { PieChart, Target, Zap } from "lucide-react";

type Allocation = {
  actions: number;
  bonds: number;
  cash: number;
  crypto?: number;
};

const palette = {
  actions: "#4f46e5",
  bonds: "#0ea5e9",
  cash: "#94a3b8",
  crypto: "#f59e0b",
};

const labels: Record<keyof Allocation, string> = {
  actions: "Actions",
  bonds: "Obligations",
  cash: "Liquidités",
  crypto: "Crypto",
};

export function AllocationChart({ allocation, support }: { allocation: Allocation; support?: string }) {
  const segments = useMemo(() => {
    return (["actions", "bonds", "cash", "crypto"] as (keyof Allocation)[])
      .map((key) => {
        const value = Math.max(0, Math.round(allocation[key] || 0));
        return { key, value, color: palette[key] };
      })
      .filter((s) => s.value > 0);
  }, [allocation]);

  const total = segments.reduce((acc, s) => acc + s.value, 0) || 100;

  const gradient = segments
    .reduce<{ from: number; stops: string[] }>((acc, seg) => {
      const start = acc.from;
      const end = start + (seg.value / total) * 360;
      acc.stops.push(`${seg.color} ${start}deg ${end}deg`);
      return { from: end, stops: acc.stops };
    }, { from: 0, stops: [] })
    .stops.join(", ");

  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Allocation</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Répartition visuelle</h2>
          <p className="text-sm text-slate-600">Vue donut + barres pour tes classes d’actifs.</p>
        </div>
        {support && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
            <PieChart className="w-4 h-4" />
            {support}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
            <div
              className="w-full h-full rounded-full"
              style={{ background: `conic-gradient(${gradient || palette.actions} 0 360deg)` }}
            />
            <div className="absolute inset-[18%] rounded-full bg-white/95 border border-slate-100 flex flex-col items-center justify-center text-center">
              <Target className="w-6 h-6 text-indigo-500" />
              <p className="text-xs text-slate-500">Alloc cible</p>
              <p className="text-sm font-semibold text-slate-900">{total}%</p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {segments.map((seg) => (
              <div key={seg.key} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <p className="font-semibold text-slate-900">{labels[seg.key]}</p>
                  </div>
                  <p className="text-slate-700">{seg.value}%</p>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white overflow-hidden border border-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(seg.value / total) * 100}%`, backgroundColor: seg.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-4 sm:p-5 space-y-3 shadow-inner">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-700">
            <Zap className="w-4 h-4 text-amber-500" />
            Assistant allocation
          </div>
          <p className="text-sm text-slate-700">
            Cette répartition combine poche actions (cœur et tilts), obligations et liquidités. Ajuste via le quiz pour la
            personnaliser finement selon ton profil de risque et ton support PEA/CTO.
          </p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Donut pour visualiser l’équilibre global.</li>
            <li>• Barres pour comparer les poids relatifs.</li>
            <li>• Support recommandé : {support || "à déterminer"}.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
