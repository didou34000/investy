import React from "react";

type Stat = {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "indigo" | "emerald" | "amber" | "slate";
};

const toneMap: Record<NonNullable<Stat["tone"]>, string> = {
  indigo: "bg-indigo-100 text-indigo-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  slate: "bg-slate-100 text-slate-700",
};

export function DashboardOverview({ stats }: { stats: Stat[] }) {
  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Vue d’ensemble</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Synthèse financière</h2>
          <p className="text-sm text-slate-600">
            Score, rendement, volatilité et projections concentrées sur une grille premium.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const tone = toneMap[stat.tone || "indigo"];
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-slate-50/80 shadow-sm hover:shadow-md transition-all p-4 flex items-start gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold ${tone}`}>
                {Icon ? <Icon className="w-5 h-5" /> : stat.value}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                {stat.hint && <p className="text-xs text-slate-500">{stat.hint}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
