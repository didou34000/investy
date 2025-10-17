"use client";
import { useEffect, useMemo, useState } from "react";
import { allocationFromRisk } from "@/lib/riskModelPro";
import { assumptionsPro, projectionPro } from "@/lib/riskModelPro";
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, LineChart, Line } from "recharts";
import AuthEmailCard from "@/components/AuthEmailCard";
import SaveProfileCard from "@/components/SaveProfileCard";

const COLORS = ["#1E3A8A","#0EA5E9","#22C55E","#94A3B8"];

export default function ResultPro(){
  const [risk, setRisk] = useState<number>(50);
  const [monthly, setMonthly] = useState<number>(200);
  const [horizon, setHorizon] = useState<number>(10);
  const [drawdownTolerance, setDrawdownTolerance] = useState<number>(20); // % max accepté
  const [reinvest, setReinvest] = useState<boolean>(true);

  useEffect(()=>{
    const cache = sessionStorage.getItem("investy_result");
    if(cache){
      try{
        const parsed = JSON.parse(cache);
        if(typeof parsed?.riskIndex === "number") setRisk(Math.round(parsed.riskIndex));
      }catch{}
    }
  },[]);

  const alloc = useMemo(()=> allocationFromRisk(risk), [risk]);
  const hyp = useMemo(()=> assumptionsPro({ riskIndex: risk, drawdownTolerancePct: drawdownTolerance }), [risk, drawdownTolerance]);
  const proj = useMemo(()=> projectionPro(monthly, horizon, { expReturn: hyp.expReturn, expVol: hyp.expVol }, reinvest), [monthly, horizon, hyp, reinvest]);

  // Série pédagogique pour visualiser la bande sur horizon (mid/low/high pour AVEC et SANS réinvest)
  const areaData = useMemo(()=>{
    const years = Array.from({length: horizon+1}, (_,i)=>i);
    function interp(p10:number, p50:number, p90:number, t:number){
      // interpolation simple par ratio de temps (purement visuelle)
      const k = t / Math.max(1, horizon);
      return {
        low:  Math.round(p10 * k),
        mid:  Math.round(p50 * k),
        high: Math.round(p90 * k)
      };
    }
    return years.map(y=>({
      t: y,
      ...interp(proj.withReinvest.p10, proj.withReinvest.p50, proj.withReinvest.p90, y),
      no_low:  Math.round(interp(proj.withoutReinvest.p10, proj.withoutReinvest.p50, proj.withoutReinvest.p90, y).low),
      no_mid:  Math.round(interp(proj.withoutReinvest.p10, proj.withoutReinvest.p50, proj.withoutReinvest.p90, y).mid),
      no_high: Math.round(interp(proj.withoutReinvest.p10, proj.withoutReinvest.p50, proj.withoutReinvest.p90, y).high),
    }));
  },[proj, horizon]);

  // Donut data
  const donut = useMemo(()=> Object.entries(alloc).map(([k,v])=>({ name:k, value:v })), [alloc]);

  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Titre / intro */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Votre profil investisseur</h1>
          <p className="text-slate-600 max-w-3xl">
            Résultat personnalisé, calibré sur votre appétence au risque, votre tolérance à la perte maximale et votre horizon.
            Hypothèses et projections à visée éducative.
          </p>
        </div>

        {/* Contrôles clés */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium">Niveau de risque</div>
              <div className="text-sm text-slate-500">{risk}/100</div>
            </div>
            <input type="range" min={0} max={100} value={risk} onChange={(e)=>setRisk(Number(e.target.value))}
              className="w-full mt-3 accent-blue-700"/>
            <div className="text-xs text-slate-500 mt-2">Ajuste l'exposition globale au risque.</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium">Perte max supportable</div>
              <div className="text-sm text-slate-500">{drawdownTolerance}%</div>
            </div>
            <input type="range" min={5} max={60} step={1} value={drawdownTolerance}
              onChange={(e)=>setDrawdownTolerance(Number(e.target.value))}
              className="w-full mt-3 accent-blue-700"/>
            <div className="text-xs text-slate-500 mt-2">La projection ajuste la volatilité pour respecter cette tolérance.</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="font-medium">Épargne mensuelle (€)</div>
            <input type="number" className="border border-slate-300 rounded-lg px-3 py-2 w-full mt-3"
              value={monthly} onChange={(e)=>setMonthly(Math.max(0, Number(e.target.value)||0))} />
            <div className="text-xs text-slate-500 mt-2">Modifie le flux pour voir l'impact long terme.</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="font-medium">Horizon (années)</div>
            <input type="number" className="border border-slate-300 rounded-lg px-3 py-2 w-full mt-3"
              value={horizon} onChange={(e)=>setHorizon(Math.max(1, Number(e.target.value)||1))} />
            <div className="text-xs text-slate-500 mt-2">Plus l'horizon est long, plus la dispersion s'élargit.</div>
          </div>
        </div>

        {/* Allocation + Plan risque/rendement */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-2">Répartition proposée</h3>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={donut} dataKey="value" innerRadius={60} outerRadius={90}>
                    {donut.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {donut.map(d=>(
                <li key={d.name} className="flex justify-between"><span>{d.name}</span><span className="font-semibold">{d.value}%</span></li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-2">Risque / Rendement attendu</h3>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={[{x: hyp.expVol*100, y: hyp.expReturn*100}]}>
                  <XAxis type="number" dataKey="x" domain={[5,45]} tickFormatter={(v)=>v.toFixed(0)+'%'} />
                  <YAxis type="number" dataKey="y" domain={[2,18]} tickFormatter={(v)=>v.toFixed(0)+'%'} />
                  <Line type="monotone" dataKey="y" dot={{ r:5 }} stroke="#1E3A8A" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-slate-600">
              Rendement attendu ≈ <b>{(hyp.expReturn*100).toFixed(1)}%</b> · Volatilité ≈ <b>{(hyp.expVol*100).toFixed(1)}%</b> · DD indicatif ≈ <b>{(hyp.expDD*100).toFixed(0)}%</b>.
            </div>
          </div>
        </div>

        {/* Bande de projection : avec / sans réinvestissement */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Projection {horizon} ans — bande d'incertitude</h3>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={reinvest} onChange={(e)=>setReinvest(e.target.checked)} />
              Réinvestissement des gains
            </label>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="gHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gHighNo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tickFormatter={(v)=>v+'a'} />
                <YAxis hide />
                {/* Avec réinvestissement */}
                <Area dataKey="high" stroke="#0EA5E9" fill="url(#gHigh)" />
                <Area dataKey="mid"  stroke="#1E3A8A" />
                <Area dataKey="low"  stroke="#94A3B8" fill="url(#gLow)" />
                {/* Sans réinvestissement (couleur ambre) */}
                {!reinvest && (
                  <>
                    <Area dataKey="no_high" stroke="#D97706" fill="url(#gHighNo)"/>
                    <Area dataKey="no_mid"  stroke="#D97706"/>
                    <Area dataKey="no_low"  stroke="#D97706"/>
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-3 text-center mt-3">
            <div>
              <div className="text-xs text-slate-500">P10 (défavorable)</div>
              <div className="text-lg font-semibold text-slate-800">{(reinvest?proj.withReinvest.p10:proj.withoutReinvest.p10).toLocaleString("fr-FR")} €</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">P50 (médian)</div>
              <div className="text-lg font-semibold text-slate-800">{(reinvest?proj.withReinvest.p50:proj.withoutReinvest.p50).toLocaleString("fr-FR")} €</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">P90 (favorable)</div>
              <div className="text-lg font-semibold text-slate-800">{(reinvest?proj.withReinvest.p90:proj.withoutReinvest.p90).toLocaleString("fr-FR")} €</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 mt-2">
            Estimations pédagogiques basées sur des plages historiques plausibles. Aucune garantie de performance. Contenu éducatif, non-AMF.
          </div>
        </div>

        {/* Synthèse en langage simple */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-2">Synthèse</h3>
          <p className="text-slate-700 text-sm">
            Avec une tolérance à la perte de <b>{drawdownTolerance}%</b>, votre portefeuille cible ajuste sa volatilité.
            Un niveau de risque de <b>{risk}/100</b> correspond à un rendement attendu d'environ <b>{(hyp.expReturn*100).toFixed(1)}%</b> par an
            avec une volatilité proche de <b>{(hyp.expVol*100).toFixed(1)}%</b>. 
            {reinvest ? " En réinvestissant les gains, l'effet de capitalisation augmente sensiblement le scénario médian à long terme." 
                      : " Sans réinvestir les gains, la croissance reste plus linéaire et la médiane est plus faible."}
            Utilisez les curseurs pour aligner l'allocation et la trajectoire avec votre confort de risque et votre horizon.
          </p>
        </div>

        {/* Authentification et sauvegarde */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <AuthEmailCard />
          <SaveProfileCard
            risk={risk}
            drawdownTolerance={drawdownTolerance}
            reinvest={reinvest}
            monthly={monthly}
            horizon={horizon}
          />
        </div>
      </div>
    </section>
  );
}