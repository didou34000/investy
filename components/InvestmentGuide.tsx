"use client";
import { TrendingUp, Landmark, LineChart as LineIcon, Building2, Bitcoin } from "lucide-react";

const assets = [
  { icon: TrendingUp, title: "Actions", desc: "Parts d'entreprises cotées. Potentiel long terme élevé, volatilité supérieure." },
  { icon: Landmark,   title: "Obligations", desc: "Prêts aux États/entreprises. Revenu plus stable, risque plus modéré." },
  { icon: LineIcon,   title: "ETF", desc: "Fonds indiciels (ex: S&P 500). Diversification simple à frais réduits." },
  { icon: Building2,  title: "Immobilier", desc: "Patrimoine tangible (direct/REIT). Rendement locatif + valorisation." },
  { icon: Bitcoin,    title: "Crypto", desc: "Actifs numériques très volatils. Position minoritaire et prudente." },
];

export default function InvestmentGuide() {
  return (
    <section aria-labelledby="guide-title" className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 id="guide-title" className="text-3xl md:text-4xl font-semibold text-center mb-10">
          Guide de l'investissement
        </h2>
        <p className="text-center text-slate-600 max-w-3xl mx-auto mb-10">
          Comprenez les grandes familles d'actifs pour construire une stratégie claire et durable.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assets.map((A, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition p-6">
              <div className="flex items-center gap-3 mb-3">
                <A.icon className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">{A.title}</h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{A.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
