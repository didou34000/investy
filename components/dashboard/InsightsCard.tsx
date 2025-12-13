import React, { useMemo } from "react";
import { AlertTriangle, Brain, ChartBar, Compass, Sparkles, Target } from "lucide-react";

type Insight = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  tone: "info" | "warn" | "positive";
};

type Props = {
  risk?: number | null;
  expectedReturn?: number | null;
  expectedVol?: number | null;
  allocation?: { actions?: number; bonds?: number; cash?: number; crypto?: number };
  horizon?: string | null;
  support?: string | null;
};

const toneClass: Record<Insight["tone"], string> = {
  info: "bg-indigo-50 border-indigo-100 text-indigo-800",
  warn: "bg-amber-50 border-amber-100 text-amber-800",
  positive: "bg-emerald-50 border-emerald-100 text-emerald-800",
};

export function InsightsCard({ risk, expectedReturn, expectedVol, allocation, horizon, support }: Props) {
  const insights = useMemo<Insight[]>(() => {
    const items: Insight[] = [];
    const actions = allocation?.actions ?? 0;
    const bonds = allocation?.bonds ?? 0;
    const cash = allocation?.cash ?? 0;
    const crypto = allocation?.crypto ?? 0;

    if (actions > 0) {
      items.push({
        icon: Target,
        title: "Allocation actions",
        text: `Ta poche actions (${actions}%) est alignée avec un horizon ${horizon || "moyen terme"}.`,
        tone: "positive",
      });
    }
    if (crypto > 0) {
      items.push({
        icon: Brain,
        title: "Part crypto",
        text: `Crypto ${crypto}% : à calibrer selon ta tolérance. Un profil ${risk != null && risk < 55 ? "modéré" : "dynamique"} peut rester en dessous de 10%.`,
        tone: crypto > 10 ? "warn" : "info",
      });
    }
    if (expectedReturn != null) {
      const yearsToDouble = expectedReturn > 0 ? Math.max(1, Math.round(72 / expectedReturn)) : null;
      items.push({
        icon: ChartBar,
        title: "Projection simplifiée",
        text: yearsToDouble
          ? `Avec ${expectedReturn.toFixed(1)}%/an, tu pourrais doubler en ~${yearsToDouble} ans.`
          : "Complète le quiz pour projeter ton capital.",
        tone: "info",
      });
    }
    if (expectedVol != null) {
      items.push({
        icon: AlertTriangle,
        title: "Volatilité attendue",
        text: `Volatilité estimée ${expectedVol.toFixed(1)}% : garde un coussin de cash (${cash}% annoncé).`,
        tone: expectedVol > 18 ? "warn" : "info",
      });
    }
    if (support) {
      items.push({
        icon: Compass,
        title: "Support recommandé",
        text: `${support} : privilégie l'allocation cœur en ${support.toLowerCase().includes("pea") ? "ETF éligibles" : "ETF monde/US + thématiques"}.`,
        tone: "positive",
      });
    }
    if (items.length < 3) {
      items.push({
        icon: Sparkles,
        title: "Personnalisation",
        text: "Refais le quiz ou ajuste tes préférences pour affiner tes recommandations.",
        tone: "info",
      });
    }
    return items.slice(0, 5);
  }, [allocation?.actions, allocation?.bonds, allocation?.cash, allocation?.crypto, expectedReturn, expectedVol, horizon, risk, support]);

  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Insights</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Assistant financier</h2>
          <p className="text-sm text-slate-600">Synthèse pédagogique générée depuis ton profil.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div key={idx} className={`rounded-2xl border ${toneClass[insight.tone]} p-4 flex gap-3`}>
              <div className="w-10 h-10 rounded-xl bg-white/70 border border-white/80 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                <p className="text-xs text-slate-600 leading-snug">{insight.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
