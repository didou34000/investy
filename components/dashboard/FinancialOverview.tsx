import React, { useMemo, useState } from "react";
import { Gauge, Sparkles, TrendingUp, Wallet, Calendar, Activity, Repeat } from "lucide-react";
import { simulateInvestment } from "@/lib/simulateInvestment";

type Props = {
  expectedReturn?: number | null;
  expectedVol?: number | null;
  defaultMonthly?: number | null;
};

function fmtEUR(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function FinancialOverview({ expectedReturn = 5, expectedVol = 10, defaultMonthly = 300 }: Props) {
  const [initial, setInitial] = useState(2000);
  const [monthly, setMonthly] = useState(defaultMonthly || 300);
  const [horizon, setHorizon] = useState(10);
  const [reinvest, setReinvest] = useState(true);

  const projection = useMemo(() => {
    const r = Math.max(0, expectedReturn ?? 0);
    const invested = initial + monthly * 12 * horizon;
    let value = invested;
    if (reinvest && r > 0) {
      value = simulateInvestment({
        initial,
        monthly,
        years: horizon,
        annualReturn: r,
      });
    } else {
      // Pas de réinvestissement : intérêts simples sur le capital initial uniquement
      value = initial * (1 + (r / 100) * horizon) + monthly * 12 * horizon;
    }
    const gain = value - invested;
    return { value: Math.round(value), invested: Math.round(invested), gain: Math.round(gain) };
  }, [initial, monthly, horizon, expectedReturn, reinvest]);

  const stats = [
    { label: "Rendement attendu", value: expectedReturn ? `${expectedReturn.toFixed(1)}% / an` : "—", icon: TrendingUp },
    { label: "Volatilité attendue", value: expectedVol ? `${expectedVol.toFixed(1)}%` : "—", icon: Activity },
    { label: reinvest ? "Projection (composé)" : "Projection (simple)", value: fmtEUR(projection.value), icon: Sparkles },
    { label: "Investi sur la période", value: fmtEUR(projection.invested), icon: Wallet },
    { label: "Gains estimés", value: fmtEUR(projection.gain), icon: Gauge },
    { label: "Horizon", value: `${horizon} ans`, icon: Calendar },
  ];

  return (
    <section id="financier" className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Financier</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Projection interactive</h2>
          <p className="text-sm text-slate-600">Ajuste les paramètres pour recalculer immédiatement les projections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <label className="text-xs text-slate-600">Montant initial (€)</label>
          <input
            type="number"
            value={initial}
            onChange={(e) => setInitial(Math.max(0, Number(e.target.value)))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <label className="text-xs text-slate-600">Mensualité (€)</label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(Math.max(0, Number(e.target.value)))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <label className="text-xs text-slate-600">Horizon (années)</label>
          <input
            type="range"
            min={1}
            max={30}
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="w-full accent-indigo-600 mt-2"
          />
          <div className="text-sm font-semibold text-slate-900 mt-1">{horizon} ans</div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <label className="text-xs text-slate-600 inline-flex items-center gap-2">
            <Repeat className="w-4 h-4 text-indigo-500" />
            Réinvestir les gains
          </label>
          <div className="mt-2">
            <button
              onClick={() => setReinvest((v) => !v)}
              className={`px-3 py-2 rounded-xl border text-sm font-semibold transition ${
                reinvest ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              {reinvest ? "Activé (intérêts composés)" : "Désactivé"}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Active pour simuler des intérêts composés. Désactive pour une vision sans capitalisation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
