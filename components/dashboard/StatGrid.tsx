import React from "react";
import { DashCard } from "./DashCard";

type Stat = { label: string; value: string; hint?: string };

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <DashCard>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-100 bg-white/80 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
            {stat.hint && <p className="text-xs text-slate-500 mt-1">{stat.hint}</p>}
          </div>
        ))}
      </div>
    </DashCard>
  );
}

