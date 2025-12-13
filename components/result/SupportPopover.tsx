import React, { useState } from "react";
import { Landmark, Wallet, Zap } from "lucide-react";

type Support = "PEA" | "CTO" | "PEA+CTO" | null;

export function SupportPopover({ support }: { support: Support }) {
  const [hover, setHover] = useState<"PEA" | "CTO" | null>(null);
  if (!support) return null;

  const showPEA = support === "PEA" || support === "PEA+CTO";
  const showCTO = support === "CTO" || support === "PEA+CTO";

  return (
    <div className="flex flex-wrap gap-3">
      {showPEA && (
        <div className="relative group" onMouseEnter={() => setHover("PEA")} onMouseLeave={() => setHover(null)}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-semibold cursor-default">
            <Landmark className="w-4 h-4" />
            PEA
          </div>
          {hover === "PEA" && (
            <div className="absolute z-20 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-slate-200 p-4 text-sm text-slate-700">
              <p className="font-semibold">PEA — Plan d’Épargne en Actions</p>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 mt-1">
                <li>Long terme, fiscalité avantageuse après 5 ans.</li>
                <li>Principalement Europe (actions/ETF éligibles).</li>
                <li>Passer par banques en ligne ou courtiers régulés.</li>
              </ul>
              <p className="text-[11px] text-slate-500 mt-2">
                Exemples informatifs (Boursorama, Bourse Direct, Trade Republic...). Fais tes propres recherches.
              </p>
            </div>
          )}
        </div>
      )}

      {showCTO && (
        <div className="relative group" onMouseEnter={() => setHover("CTO")} onMouseLeave={() => setHover(null)}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-semibold cursor-default">
            <Wallet className="w-4 h-4" />
            CTO
          </div>
          {hover === "CTO" && (
            <div className="absolute z-20 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-slate-200 p-4 text-sm text-slate-700">
              <p className="font-semibold">CTO — Compte Titres Ordinaire</p>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 mt-1">
                <li>Accès global (US, émergents, ETF monde).</li>
                <li>Flexible, fiscalité classique.</li>
                <li>Complémentaire au PEA.</li>
              </ul>
              <p className="text-[11px] text-slate-500 mt-2">
                Choisis un courtier régulé. Exemples informatifs uniquement. Fais tes propres recherches.
              </p>
            </div>
          )}
        </div>
      )}

      {support === "PEA+CTO" && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-700">
          <Zap className="w-3 h-3 text-pink-500" />
          Combinaison PEA + CTO possible
        </div>
      )}
    </div>
  );
}


