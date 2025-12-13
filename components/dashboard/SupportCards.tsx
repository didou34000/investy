import React from "react";
import { CheckCircle2, Info, Landmark, Wallet } from "lucide-react";

type Support = "PEA" | "CTO" | "PEA + CTO" | string;

type Props = {
  active: Support;
};

const supports = [
  {
    key: "PEA",
    title: "Plan d’Épargne en Actions",
    desc: "Fiscalité attractive après 5 ans, idéal pour ETF/actions éligibles.",
    bullets: [
      "Univers : actions/ETF Europe éligibles",
      "Fiscalité allégée (hors prélèvements sociaux)",
      "Horizon conseillé : long terme",
    ],
    icon: Landmark,
    tone: "from-emerald-50 via-white to-indigo-50",
  },
  {
    key: "CTO",
    title: "Compte-Titres Ordinaire",
    desc: "Accès global (US, émergents, thématiques, crypto via ETN/ETF).",
    bullets: [
      "Univers : monde entier, thématiques",
      "Fiscalité flat tax / barème",
      "Flexibilité : versements/retraits libres",
    ],
    icon: Wallet,
    tone: "from-sky-50 via-white to-slate-50",
  },
];

export function SupportCards({ active }: Props) {
  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Supports</p>
          <h2 className="text-xl font-semibold text-slate-900">PEA / CTO</h2>
          <p className="text-sm text-slate-600">Cartes pédagogiques avec popover au survol.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
          <Info className="w-4 h-4" />
          Recommandé : {active || "À préciser"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {supports.map((support) => {
          const isActive = active?.toLowerCase().includes(support.key.toLowerCase());
          const Icon = support.icon;
          return (
            <div
              key={support.key}
              className={`group relative rounded-2xl border shadow-md p-5 transition-all bg-gradient-to-br ${support.tone} ${
                isActive ? "border-indigo-200 shadow-indigo-100/80" : "border-slate-100"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border text-xs font-semibold text-slate-700">
                  <Icon className="w-4 h-4 text-indigo-500" />
                  {support.key}
                </div>
                {isActive && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
              </div>
              <div className="space-y-2 mt-3">
                <p className="text-sm font-semibold text-slate-900">{support.title}</p>
                <p className="text-sm text-slate-600">{support.desc}</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {support.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </div>
              <div className="absolute inset-x-3 -bottom-12 opacity-0 pointer-events-none group-hover:opacity-100 transition">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-3 text-xs text-slate-600">
                  {support.key === "PEA"
                    ? "Idéal pour un plan long terme défiscalisé sur actions/ETF éligibles."
                    : "Parfait pour diversifier sans contrainte géographique ni d’univers d’investissement."}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
