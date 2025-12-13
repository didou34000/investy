import React, { useMemo } from "react";
import { Activity, ArrowDown, ShieldCheck } from "lucide-react";

type Props = {
  portfolioValue?: number | null;
  expectedReturn?: number | null;
  profileLabel?: string;
};

type Scenario = {
  label: string;
  drawdownPct: number;
};

const scenarios: Scenario[] = [
  { label: "Stress -10%", drawdownPct: -10 },
  { label: "Stress -20%", drawdownPct: -20 },
  { label: "Stress -40%", drawdownPct: -40 },
];

export function StressTestCard({ portfolioValue = 10000, expectedReturn = 5, profileLabel }: Props) {
  const data = useMemo(() => {
    return scenarios.map((s) => {
      const loss = Math.round((portfolioValue * Math.abs(s.drawdownPct)) / 100);
      const recoveryYears =
        expectedReturn > 0 ? Math.round(Math.max(1, Math.abs(s.drawdownPct) / expectedReturn)) : null;
      return { ...s, loss, recoveryYears };
    });
  }, [portfolioValue, expectedReturn]);

  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Robustesse</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Stress tests</h2>
          <p className="text-sm text-slate-600">Impact de drawdowns et temps de récupération estimé.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-700">
          <Activity className="w-4 h-4" />
          {profileLabel || "Profil"} 
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {data.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                <ArrowDown className="w-4 h-4 text-amber-600" />
                {item.label}
              </div>
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-lg font-semibold text-slate-900">-{Math.abs(item.drawdownPct)}% · -{item.loss.toLocaleString("fr-FR")} €</p>
            <p className="text-xs text-slate-600">
              Récupération estimée : {item.recoveryYears ? `${item.recoveryYears} ans` : "selon rendement"} avec {expectedReturn?.toFixed(1) ?? "?"}%/an.
            </p>
            <p className="text-[11px] text-slate-500">
              Un profil {profileLabel || "investisseur"} peut encaisser si l’horizon reste long terme.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
