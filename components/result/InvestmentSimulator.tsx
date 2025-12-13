import React, { useMemo, useState } from "react";
import type { InvestyProfileResult } from "@/lib/profileMapper";
import { simulateInvestment } from "@/lib/simulate";

type Props = { profile: InvestyProfileResult };

export function InvestmentSimulator({ profile }: Props) {
  const [montantInitial, setMontantInitial] = useState(1000);
  const [mensualite, setMensualite] = useState(200);
  const [horizonYears, setHorizonYears] = useState(10);
  const [reinvest, setReinvest] = useState(true);

  // expectedReturn / expectedVol sont en % dans le profil
  const expReturnPct = profile.expectedReturn ?? 5;
  const expVolPct = profile.expectedVol ?? 10;

  const tauxCentral = expReturnPct / 100;
  const tauxBas = Math.max(0, tauxCentral - (expVolPct / 100) / 2);
  const tauxHaut = tauxCentral + (expVolPct / 100) / 2;

  const resCentral = useMemo(
    () =>
      simulateInvestment({
        montantInitial,
        mensualite,
        horizonYears,
        tauxAnnuel: tauxCentral,
        reinvest,
      }),
    [montantInitial, mensualite, horizonYears, tauxCentral, reinvest]
  );

  const resBas = useMemo(
    () =>
      simulateInvestment({
        montantInitial,
        mensualite,
        horizonYears,
        tauxAnnuel: tauxBas,
        reinvest,
      }),
    [montantInitial, mensualite, horizonYears, tauxBas, reinvest]
  );

  const resHaut = useMemo(
    () =>
      simulateInvestment({
        montantInitial,
        mensualite,
        horizonYears,
        tauxAnnuel: tauxHaut,
        reinvest,
      }),
    [montantInitial, mensualite, horizonYears, tauxHaut, reinvest]
  );

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 backdrop-blur shadow-[0_14px_40px_rgba(0,0,0,0.06)] p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Simule ton plan d’investissement</h3>
          <p className="text-sm text-slate-600">
            Basé sur ton profil : rendement central {expReturnPct.toFixed(1)}%, vol {expVolPct.toFixed(0)}%.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={reinvest}
            onChange={(e) => setReinvest(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Réinvestir les gains
        </label>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-500 mb-1">Montant initial</p>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100000}
              step={500}
              value={montantInitial}
              onChange={(e) => setMontantInitial(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              value={montantInitial}
              onChange={(e) => setMontantInitial(Number(e.target.value))}
              className="w-24 border border-slate-200 rounded-lg px-2 py-1"
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Mensualité</p>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={mensualite}
              onChange={(e) => setMensualite(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              value={mensualite}
              onChange={(e) => setMensualite(Number(e.target.value))}
              className="w-24 border border-slate-200 rounded-lg px-2 py-1"
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Horizon (années)</p>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={horizonYears}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              value={horizonYears}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
              className="w-16 border border-slate-200 rounded-lg px-2 py-1"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Scénario prudent</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{fmt(resBas.valeurFinale)}</p>
          <p className="text-[11px] text-slate-500">Taux : {(tauxBas * 100).toFixed(1)}% / an</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Scénario central</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{fmt(resCentral.valeurFinale)}</p>
          <p className="text-[11px] text-slate-500">Taux : {(tauxCentral * 100).toFixed(1)}% / an</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Scénario optimiste</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{fmt(resHaut.valeurFinale)}</p>
          <p className="text-[11px] text-slate-500">Taux : {(tauxHaut * 100).toFixed(1)}% / an</p>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Simulation basée sur ton profil et des hypothèses de rendement annualisé. Ce n’est pas une garantie. Ajuste les curseurs pour voir l’impact.
      </p>
    </div>
  );
}


