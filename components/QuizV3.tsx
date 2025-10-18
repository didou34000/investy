"use client";
import { useMemo, useState } from "react";
import { computeRiskIndex, allocationFromRisk, marketAssumptions, projectionBands } from "@/lib/riskModel";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

type QA = { id: string; label: string; type: "radio" | "slider" | "number"; min?: number; max?: number; step?: number; options?: { label: string; value: number }[]; branch?: (v: number) => boolean };

const QUESTIONS: QA[] = [
  { id: "tol_risk", label: "Tolérance au risque", type: "slider", min: 1, max: 5, step: 1 },
  { id: "tol_drawdown", label: "Perte temporaire acceptable", type: "slider", min: 1, max: 5, step: 1 },
  { id: "tol_past", label: "Expérience passée d'investir", type: "slider", min: 1, max: 5, step: 1 },
  { id: "tol_reaction", label: "Réaction si -20% en 1 mois", type: "radio", options: [
    { label: "Je vends", value: 1 }, { label: "J'attends", value: 3 }, { label: "J'achète", value: 5 }
  ] },
  { id: "cap_horizon", label: "Horizon d'investissement (années)", type: "slider", min: 1, max: 30, step: 1 },
  { id: "cap_income_stability", label: "Stabilité de vos revenus", type: "slider", min: 1, max: 5, step: 1 },
  { id: "cap_reserves", label: "Épargne de précaution (mois de dépenses)", type: "slider", min: 0, max: 24, step: 1 },
  { id: "cap_share", label: "% de votre épargne investissable", type: "slider", min: 1, max: 100, step: 1 },
  { id: "need_target", label: "Objectif de rendement annuel visé", type: "slider", min: 1, max: 5, step: 1 },
  { id: "need_growth_pref", label: "Préférence croissance vs stabilité", type: "slider", min: 1, max: 5, step: 1 },
  { id: "need_knowledge", label: "Connaissance ETF/fonds indiciels", type: "slider", min: 1, max: 5, step: 1 },
  { id: "need_contrib_variation", label: "Capacité à varier les versements", type: "slider", min: 1, max: 5, step: 1 },
];

export default function QuizV3() {
  const [vals, setVals] = useState<Record<string, number>>({});
  const [monthly, setMonthly] = useState<number>(200);
  const [horizon, setHorizon] = useState<number>(10);
  const [done, setDone] = useState(false);

  const answered = QUESTIONS.filter(q => vals[q.id] != null).length;
  const progress = Math.round((answered / QUESTIONS.length) * 100);

  const { riskIndex, sub } = useMemo(() => {
    const answers = QUESTIONS.map(q => ({ id: q.id, value: vals[q.id] ?? 3 }));
    return computeRiskIndex({ answers, monthly, horizon, reserves: vals.cap_reserves, shareOfSavings: vals.cap_share });
  }, [vals, monthly, horizon]);

  const alloc = useMemo(() => allocationFromRisk(riskIndex), [riskIndex]);

  const assump = useMemo(() => marketAssumptions(riskIndex), [riskIndex]);
  const bands = useMemo(() => projectionBands({ monthly, horizon, rAnnual: assump.rAnnual, volAnnual: assump.volAnnual }), [assump, monthly, horizon]);

  return (
    <section className="py-12">
      {!done && (
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-semibold mb-2 text-center">Découvre ton profil investisseur</h1>
          <p className="text-slate-600 text-center mb-6">Un questionnaire précis pour un résultat fin et personnalisé (2–3 min).</p>

          <div className="w-full bg-slate-200 h-2 rounded-full mb-6">
            <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
          </div>

          <div className="space-y-5">
            {QUESTIONS.map(q => (
              <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium">{q.label}</label>
                  <div className="text-xs text-slate-500">{vals[q.id] ?? "—"}</div>
                </div>
                {q.type === "slider" && (
                  <input type="range" min={q.min} max={q.max} step={q.step} value={vals[q.id] ?? Math.ceil(((q.min ?? 1) + (q.max ?? 5)) / 2)}
                    onChange={(e) => setVals(s => ({ ...s, [q.id]: Number(e.target.value) }))}
                    className="w-full mt-3" />
                )}
                {q.type === "radio" && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {q.options?.map(opt => (
                      <button key={opt.value}
                        onClick={() => setVals(s => ({ ...s, [q.id]: opt.value }))}
                        className={`px-3 py-1.5 rounded-full border ${vals[q.id] === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 hover:bg-slate-50'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="text-xs text-slate-500 mb-1">Versement mensuel (€)</div>
              <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="text-xs text-slate-500 mb-1">Horizon (années)</div>
              <input type="number" value={horizon} onChange={(e) => setHorizon(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="text-xs text-slate-500 mb-1">Index de risque (0–100)</div>
              <div className="text-2xl font-semibold text-blue-700">{Math.round(riskIndex)}</div>
              <div className="text-[11px] text-slate-500">Tolérance {Math.round(sub.tolerance)} · Capacité {Math.round(sub.capacity)} · Besoin {Math.round(sub.need)}</div>
            </div>
          </div>

          <button onClick={() => setDone(true)} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium">
            Voir mon profil personnalisé
          </button>
        </div>
      )}

      {done && (
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-2">Votre profil personnalisé</h2>
          <p className="text-slate-600 mb-4">Allocation adaptée à votre index de risque. Illustration éducative, non-AMF.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <h3 className="font-semibold mb-2">Allocation type</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                {Object.entries(alloc).map(([k, v]) => <li key={k}>{k}: <b>{v}%</b></li>)}
              </ul>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <h3 className="font-semibold mb-2">Projection (P10 / P50 / P90)</h3>
              <div className="text-sm text-slate-700">Après {horizon} ans avec {monthly} €/mois :</div>
              <div className="text-lg font-semibold mt-1">
                ~ {bands.p10.toLocaleString('fr-FR')} € / {bands.p50.toLocaleString('fr-FR')} € / {bands.p90.toLocaleString('fr-FR')} €
              </div>
              <div className="text-[11px] text-slate-500 mt-2">Hypothèses dérivées de votre index de risque.</div>
            </div>
          </div>

          <div className="mt-6">
            <a href="/quiz" className="text-blue-600 underline">Recommencer</a>
          </div>
        </div>
      )}
    </section>
  );
}
