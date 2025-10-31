"use client";

import { useEffect, useMemo, useState } from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { simulateProjection } from "@/lib/profileEnginePro";
import Link from "next/link";

type Badge = { label: string; tone: "neutral" | "positive" | "warning" };
type Allocation = { cash:number; bonds:number; equities_core:number; equities_tilts:number; crypto:number };
type Result = {
  code: string;
  label: string;
  subtitle: string;
  badges: Badge[];
  warnings: string[];
  riskIndex: number;
  expectedReturn: number;
  expectedVol: number;
  allocation: Allocation;
  monthly?: number;
};

export default function ResultPage(){
  const [res, setRes] = useState<Result | null>(null);
  const [unkHint, setUnkHint] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("investy_result");
      if (raw) {
        const parsed = JSON.parse(raw) as Result & { _meta?: { unkCount?: number } };
        setRes(parsed);
        if ((parsed as any)._meta?.unkCount && (parsed as any)._meta.unkCount >= 2) setUnkHint(true);
      }
    } catch {}
  }, []);

  const data = useMemo(() => {
    if (!res) return [];
    return [
      { name: "Liquidités", value: res.allocation.cash, color: "#94a3b8" },
      { name: "Obligations", value: res.allocation.bonds, color: "#60a5fa" },
      { name: "Actions (coeur)", value: res.allocation.equities_core, color: "#2563eb" },
      { name: "Tilts/Alternatifs", value: res.allocation.equities_tilts, color: "#8b5cf6" },
      { name: "Crypto", value: res.allocation.crypto, color: "#06b6d4" },
    ].filter(d => d.value > 0);
  }, [res]);

  if(!res){
    return (
      <main className="container py-16">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-2">Aucun résultat</h1>
          <p className="text-slate-600 mb-6">Complétez le quiz pour voir votre profil.</p>
          <Link className="px-5 py-2.5 rounded-xl bg-blue-600 text-white" href="/quiz">Commencer le quiz</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{res.label}</h1>
          <p className="text-slate-600">{res.subtitle}</p>
          {unkHint && (
            <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 text-amber-800 px-3 py-2 text-sm">
              Plusieurs réponses sont « Je ne sais pas ». Vos résultats sont calibrés par défaut; vous pourrez affiner ensuite.
            </div>
          )}
          {res.warnings.length > 0 && (
            <div className="mt-4 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800 px-3 py-2 text-sm">
              <div className="font-medium mb-1">Points d’attention</div>
              <ul className="list-disc ml-5 space-y-1">
                {res.warnings.map((w, i) => (<li key={i}>{w}</li>))}
              </ul>
            </div>
          )}
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          {res.badges.map((b, i) => (
            <span key={i} className={`px-2.5 py-1 rounded-full text-xs border ${b.tone==='positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : b.tone==='warning' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>{b.label}</span>
          ))}
          {!res.badges.some(b=>b.label.includes('Réinvestissement')) && (
            <span className="px-2.5 py-1 rounded-full text-xs border bg-slate-50 text-slate-700 border-slate-200">Réinvestissement désactivé</span>
          )}
        </div>

        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={data} innerRadius={60} outerRadius={90} paddingAngle={2}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v:any, n:any)=>[`${v}%`, n as string]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              {data.map((d,i)=>(
                <div key={i} className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-sm" style={{background:d.color}} /> {d.name}: <span className="font-medium">{d.value}%</span></div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-slate-600 text-sm">Indice de risque</div>
              <div className="text-2xl font-semibold">{res.riskIndex}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-slate-600 text-sm">Rendement attendu (an)</div>
              <div className="text-2xl font-semibold">{Math.min(res.expectedReturn, 15).toFixed(1)}%</div>
              <div className="text-xs text-slate-500 mt-1">Affichage prudent; estimation indicative.</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-slate-600 text-sm">Volatilité attendue (an)</div>
              <div className="text-2xl font-semibold">{res.expectedVol.toFixed(0)}%</div>
            </div>
            <div className="pt-2">
              <Link href="/quiz" className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 inline-block">Ajuster mes réponses</Link>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl border p-4">
            <ProjectionCard monthly={res.monthly ?? 0} expectedReturnPct={res.expectedReturn} reinvest={res.badges?.some(b=>b.label.includes('Réinvestissement'))} />
          </div>

          <div className="rounded-2xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Actus pour vous</h2>
              <a href="/actu" className="px-3 py-2 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-900">Voir l’actu</a>
            </div>
            <div className="grid gap-3 md:grid-cols-1">
              {[
                { title:"Hausse des taux: impact modéré sur les obligations 5–7 ans", tag:"Obligations", href:"/actu?tag=obligations" },
                { title:"ACWI à un plus haut 12m — momentum actions monde", tag:"ETF Monde", href:"/actu?tag=etf" },
                { title:"BTC franchit un niveau clé — volatilité attendue", tag:"Crypto", href:"/actu?tag=crypto" },
              ].map((n,i)=>(
                <a key={i} className="rounded-xl border p-3 hover:bg-slate-50 dark:hover:bg-slate-900 block" href={n.href}>
                  <div className="text-sm text-slate-500">{n.tag}</div>
                  <div className="font-medium mt-1">{n.title}</div>
                  <div className="mt-2 text-xs text-slate-500">Ouvrir dans l’Actu</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 mt-8">
          <a href="/quiz" className="px-4 py-2 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-900">Ajuster mes réponses</a>
          <button className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">Voir le portefeuille type</button>
          <button className="px-4 py-2 rounded-xl border">Activer les alertes personnalisées</button>
        </div>

        <p className="text-xs text-slate-400 mt-4">Ces estimations ne constituent pas un conseil en investissement.</p>
      </div>
    </main>
  );
}

function formatCurrency(n:number){
  return n.toLocaleString('fr-FR', { style:'currency', currency:'EUR', maximumFractionDigits:0 });
}

function ProjectionCard({ monthly, expectedReturnPct, reinvest }:{ monthly:number; expectedReturnPct:number; reinvest:boolean }){
  const years = 10;
  const proj = simulateProjection(0, monthly, years, expectedReturnPct/100, reinvest);
  const last = proj[proj.length-1];
  const invested = monthly * years * 12;
  const balance = last?.balance ?? invested;
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Projection d’épargne (10 ans)</h2>
      <div className="text-sm text-slate-600 mb-3">Hypothèses: {formatCurrency(monthly)}/mois, rendement {expectedReturnPct.toFixed(1)}%, réinvestissement {reinvest? 'activé' : 'désactivé'}.</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border p-4">
          <div className="text-slate-600 text-sm">Total versé</div>
          <div className="text-xl font-semibold">{formatCurrency(invested)}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-slate-600 text-sm">Projection (10 ans)</div>
          <div className="text-xl font-semibold">{formatCurrency(balance)}</div>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2">Simulation illustrative, non garantie.</p>
    </div>
  );
}


