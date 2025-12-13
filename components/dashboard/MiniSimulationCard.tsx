import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, TrendingUp } from "lucide-react";
import { simulateInvestment } from "@/lib/simulateInvestment";

type Props = {
  initial: number;
  monthly: number;
  years: number;
  expectedReturn: number; // en %
  volatility: number; // en %
};

const fmt = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function MiniSimulationCard({ initial, monthly, years, expectedReturn, volatility }: Props) {
  const rates = useMemo(() => {
    const base = Math.max(0, expectedReturn);
    const spread = Math.max(1.5, volatility * 0.35);
    return {
      low: Math.max(0, base - spread),
      mid: base,
      high: base + spread,
    };
  }, [expectedReturn, volatility]);

  const low = simulateInvestment({ initial, monthly, years, annualReturn: rates.low });
  const mid = simulateInvestment({ initial, monthly, years, annualReturn: rates.mid });
  const high = simulateInvestment({ initial, monthly, years, annualReturn: rates.high });

  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Simulation</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Projection 10 ans</h2>
          <p className="text-sm text-slate-600">
            Mini-simulation basée sur ton profil. Ajuste dans la vue complète.
          </p>
        </div>
        <Link
          href="/result"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:-translate-y-0.5 transition shadow-lg"
        >
          Accéder à la simulation complète
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Scénario prudent
          </div>
          <p className="text-2xl font-semibold text-slate-900">{fmt(low)}</p>
          <p className="text-xs text-slate-500">Taux : {rates.low.toFixed(1)}% / an</p>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 space-y-2 shadow-inner">
          <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-white border border-indigo-100 text-indigo-700">
            <TrendingUp className="w-4 h-4" />
            Scénario central
          </div>
          <p className="text-2xl font-semibold text-slate-900">{fmt(mid)}</p>
          <p className="text-xs text-slate-500">Taux : {rates.mid.toFixed(1)}% / an</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-white border border-amber-100 text-amber-700">
            <BarChart3 className="w-4 h-4" />
            Scénario optimiste
          </div>
          <p className="text-2xl font-semibold text-slate-900">{fmt(high)}</p>
          <p className="text-xs text-slate-500">Taux : {rates.high.toFixed(1)}% / an</p>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Simulation indicative basée sur des hypothèses de rendement annualisé. Les performances passées ne préjugent pas des performances futures.
      </p>
    </section>
  );
}
