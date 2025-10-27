"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { mixStats, simulate } from "@/lib/returnModel";
import AssetLogo from "@/components/ui/AssetLogo";
import { resolveLogo } from "@/lib/logo";

type Row = { bucket:"equity"|"bond"|"alts"|"cash"; label:string; symbol?:string; category:"etf"|"equity"|"bond"|"crypto"|"index"; weight:number; expected_return?:number; expected_vol?:number; logo?:string|null };

const START: Row[] = [
  { bucket:"equity", label:"ETF Monde", symbol:"MSCI-World", category:"etf", weight:60 },
  { bucket:"bond",   label:"Obligations Europe", symbol:"Euro-Gov", category:"bond", weight:25 },
  { bucket:"alts",   label:"Crypto Majors", symbol:"bitcoin", category:"crypto", weight:10 },
  { bucket:"cash",   label:"Liquidités", symbol:"", category:"index", weight:5 },
];

export default function PlanPage(){
  const [rows,setRows]=useState<Row[]>(START.map(r=>({
    ...r,
    logo: r.symbol ? resolveLogo({ symbol: r.symbol, category: r.category as any, coingeckoImage: null }) : null
  })));
  const [horizon,setHorizon]=useState(10);
  const [monthly,setMonthly]=useState(200);
  const [reinvest,setReinvest]=useState(true);
  const [shock,setShock]=useState(0);
  const [withdraw,setWithdraw]=useState(0);
  const total = rows.reduce((s,r)=>s+r.weight,0);

  const stats = useMemo(()=> mixStats(rows), [rows]);
  const sim = useMemo(()=> simulate({
    years:horizon, monthly, reinvest, shockPct:shock, annualReturnPct: stats.expPct, monthlyWithdraw: withdraw
  }), [horizon, monthly, reinvest, shock, withdraw, stats]);

  function update(i:number, weight:number){ 
    const copy=[...rows]; copy[i]={...copy[i], weight:Math.max(0,Math.min(100,weight))}; setRows(copy);
  }

  async function save(){
    const { data:{session} } = await supabase.auth.getSession();
    const user_id = session?.user?.id || null;
    const title = "Mon plan d’allocation";
    const { data: plan, error } = await supabase.from("plans").insert({
      user_id, title, profile_type:null, horizon_years:horizon, monthly_invest:monthly, reinvest,
      shock_pct:shock, monthly_withdraw:withdraw, expected_return:stats.expPct, expected_vol:stats.volPct
    }).select("id").single();
    if(error){ alert(error.message); return; }
    const payload = rows.map(r=>({
      plan_id: plan.id, bucket:r.bucket, label:r.label, symbol:r.symbol||null, category:r.category, weight:r.weight,
      expected_return:r.expected_return||null, expected_vol:r.expected_vol||null
    }));
    const { error: e2 } = await supabase.from("plan_positions").insert(payload);
    if(e2){ alert(e2.message); return; }
    window.location.href = `/p/${plan.id}`;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Construire mon plan</h1>
        <p className="text-slate-600 mt-1">Ajustez votre allocation, simulez vos apports et exportez un rapport PDF. Contenu éducatif, non prescriptif.</p>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-xs text-slate-500">Rendement indicatif</div>
            <div className="text-2xl font-semibold">{stats.expPct.toFixed(1)}%/an</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-xs text-slate-500">Volatilité estimée</div>
            <div className="text-2xl font-semibold">{stats.volPct.toFixed(1)}%/an</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-xs text-slate-500">Pire année (proxy)</div>
            <div className="text-2xl font-semibold">{stats.worstYear.toFixed(0)}%</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-xs text-slate-500">Max drawdown (proxy)</div>
            <div className="text-2xl font-semibold">{stats.maxDD.toFixed(0)}%</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {rows.map((r,i)=>(
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AssetLogo src={r.logo||null} label={r.label} size={22}/>
                  <div className="font-medium">{r.label}</div>
                </div>
                <div className="text-sm text-slate-600">{r.weight}%</div>
              </div>
              <input type="range" min={0} max={100} step={1} value={r.weight} onChange={e=>update(i, Number(e.target.value))} className="w-full mt-3"/>
              <div className="text-xs text-slate-500 mt-1 uppercase">{r.bucket}</div>
            </div>
          ))}
        </div>
        <div className={`mt-2 text-sm ${total===100?"text-emerald-700":"text-rose-700"}`}>Total: {total}% (objectif: 100%)</div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="font-medium mb-2">Hypothèses</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <label className="flex flex-col">Horizon (ans)
                <input type="number" min={1} max={30} className="mt-1 input" value={horizon} onChange={e=>setHorizon(Number(e.target.value)||1)}/>
              </label>
              <label className="flex flex-col">Apport mensuel (€)
                <input type="number" min={0} className="mt-1 input" value={monthly} onChange={e=>setMonthly(Number(e.target.value)||0)}/>
              </label>
              <label className="flex items-center gap-2 col-span-2">
                <input type="checkbox" checked={reinvest} onChange={e=>setReinvest(e.target.checked)}/> Réinvestissement des gains
              </label>
              <label className="flex flex-col">Choc initial (%)
                <select className="mt-1 input" value={shock} onChange={e=>setShock(Number(e.target.value))}>
                  <option value="0">Aucun</option><option value="-5">-5%</option><option value="-10">-10%</option><option value="-20">-20%</option><option value="-40">-40%</option>
                </select>
              </label>
              <label className="flex flex-col">Retrait mensuel (€)
                <input type="number" min={0} className="mt-1 input" value={withdraw} onChange={e=>setWithdraw(Number(e.target.value)||0)}/>
              </label>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="font-medium mb-2">Projection (valeur vs apports)</div>
            <div className="w-full h-48 bg-slate-50 rounded-lg relative overflow-hidden">
              <svg className="w-full h-full"/>
              <div className="absolute bottom-2 left-2 text-[11px] text-slate-500">Hypothèses pédagogiques, non contractuelles.</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button disabled={total!==100} onClick={save} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">Sauvegarder mon plan</button>
          <a href="/plan/export" className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 hover:bg-white">Exporter en PDF</a>
        </div>

        <p className="text-[11px] text-slate-500 mt-4">Contenu éducatif, non prescriptif. Aucune garantie de performance.</p>
      </div>
    </main>
  );
}


