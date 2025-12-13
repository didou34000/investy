import React from "react";
import { Wallet } from "lucide-react";

type Row = {
  name: string;
  pct: number;
  logo: string;
  support: string;
};

type Props = {
  allocation?: { actions?: number; bonds?: number; cash?: number; crypto?: number };
  support?: string | null;
};

export function ModelPortfolioCard({ allocation, support }: Props) {
  const rows: Row[] = [
    { name: "MSCI World", pct: Math.max(30, Math.min(70, Math.round(allocation?.actions ?? 55))), logo: "/logos/etf-world.svg", support: support?.includes("PEA") ? "PEA" : "CTO" },
    { name: "Obligations Euro", pct: Math.max(10, Math.round((allocation?.bonds ?? 25) * 0.8)), logo: "/logos/etf-bonds.svg", support: "PEA" },
    { name: "Nasdaq 100", pct: Math.min(20, Math.round((allocation?.actions ?? 55) * 0.2)), logo: "/logos/etf-nasdaq.svg", support: "CTO" },
    { name: "Bitcoin", pct: Math.min(10, Math.round(allocation?.crypto ?? 5)), logo: "/logos/btc.svg", support: "CTO" },
  ];

  return (
    <section className="rounded-2xl border border-white/80 bg-white/90 shadow-lg p-6 sm:p-7 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Portefeuille</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Exemple pédagogique</h2>
          <p className="text-sm text-slate-600">Allocation modèle basée sur ton profil, à titre indicatif.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-700">
          <Wallet className="w-4 h-4" />
          Support : {support || "PEA / CTO"}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/60">
        <div className="grid grid-cols-4 bg-white text-xs font-semibold text-slate-600 px-4 py-3">
          <span>Actif</span>
          <span>%</span>
          <span>Logo</span>
          <span>Support</span>
        </div>
        {rows.map((row, idx) => (
          <div key={row.name} className="grid grid-cols-4 items-center px-4 py-3 text-sm text-slate-800 border-t border-slate-100 bg-white/70">
            <span className="font-semibold">{row.name}</span>
            <span>{row.pct}%</span>
            <span className="flex items-center gap-2">
              <img src={row.logo} alt={row.name} className="w-8 h-8 object-contain rounded-xl border border-slate-100 bg-white" />
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
              {row.support}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Exemple pédagogique basé sur ton profil. Pas un conseil en investissement. Ajuste via le quiz ou consulte un conseiller.
      </p>
    </section>
  );
}
