import React from "react";

type Props = { allocation: { actions: number; bonds: number; cash: number } };

export function AllocationBars({ allocation }: Props) {
  const items = [
    { label: "Actions / ETF", value: allocation.actions, color: "from-blue-500 to-indigo-500" },
    { label: "Obligations", value: allocation.bonds, color: "from-violet-500 to-purple-500" },
    { label: "Liquidités", value: allocation.cash, color: "from-slate-400 to-slate-500" },
  ];
  return (
    <div className="grid md:grid-cols-[1.4fr,1fr] gap-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>{item.label}</span>
              <span className="font-semibold text-slate-900">{item.value}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white/80 p-3 space-y-2 text-xs text-slate-600">
        <p className="text-sm font-semibold text-slate-800">Répartition cible</p>
        <p>Actions / ETF : croissance long terme.</p>
        <p>Obligations : stabilité et revenus.</p>
        <p>Liquidités : réserve pour opportunités.</p>
      </div>
    </div>
  );
}

