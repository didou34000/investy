"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { mixStats } from "@/lib/returnModel";
import AssetLogo from "@/components/ui/AssetLogo";
import { resolveLogo } from "@/lib/logo";

type Row = { bucket:"equity"|"bond"|"alts"|"cash"; label:string; symbol?:string|null; category:"etf"|"equity"|"bond"|"crypto"|"index"; weight:number; expected_return?:number|null; expected_vol?:number|null; logo?:string|null };

export default function PlanSharePage(){
  const params = useParams() as { id:string };
  const [title,setTitle] = useState<string>("Plan d'allocation");
  const [rows,setRows] = useState<Row[]|null>(null);
  const [meta,setMeta] = useState<{horizon:number; monthly:number; reinvest:boolean; shock:number; withdraw:number}>({horizon:10,monthly:200,reinvest:true,shock:0,withdraw:0});
  const [error,setError] = useState<string|null>(null);

  useEffect(()=>{
    (async ()=>{
      try{
        const { data: plan } = await supabase.from("plans").select("id,title,horizon_years,monthly_invest,reinvest,shock_pct,monthly_withdraw").eq("id", params.id).maybeSingle();
        if(!plan){ setError("Plan introuvable"); return; }
        setTitle(plan.title || title);
        setMeta({ horizon: plan.horizon_years, monthly: Number(plan.monthly_invest||0), reinvest: !!plan.reinvest, shock: Number(plan.shock_pct||0), withdraw: Number(plan.monthly_withdraw||0) });
        const { data: pos } = await supabase.from("plan_positions").select("bucket,label,symbol,category,weight,expected_return,expected_vol").eq("plan_id", params.id);
        const mapped = (pos||[]).map((p:any)=>({
          bucket: p.bucket, label: p.label, symbol: p.symbol, category: p.category, weight: Number(p.weight||0), expected_return:p.expected_return, expected_vol:p.expected_vol,
          logo: p.symbol ? resolveLogo({ symbol:p.symbol, category: p.category, coingeckoImage: null }) : null,
        }));
        setRows(mapped);
      }catch(e:any){ setError(e?.message||"Erreur de chargement"); }
    })();
  },[params.id]);

  const stats = useMemo(()=> rows? mixStats(rows) : { expPct:0, volPct:0, worstYear:0, maxDD:0 }, [rows]);

  if(error) return <section className="p-8 text-sm text-rose-700">{error}</section>;
  if(!rows) return <section className="p-8 text-sm text-slate-600">Chargement…</section>;

  const total = rows.reduce((s,r)=>s+r.weight,0);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-slate-600 mt-1 text-sm">Horizon {meta.horizon} ans · Apport mensuel {meta.monthly.toLocaleString('fr-FR')}€ · {meta.reinvest?"Réinvestissement ON":"Réinvestissement OFF"} · Choc {meta.shock}% · Retrait {meta.withdraw.toLocaleString('fr-FR')}€</p>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4"><div className="text-xs text-slate-500">Rendement indicatif</div><div className="text-2xl font-semibold">{stats.expPct.toFixed(1)}%/an</div></div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4"><div className="text-xs text-slate-500">Volatilité estimée</div><div className="text-2xl font-semibold">{stats.volPct.toFixed(1)}%/an</div></div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4"><div className="text-xs text-slate-500">Pire année (proxy)</div><div className="text-2xl font-semibold">{stats.worstYear.toFixed(0)}%</div></div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4"><div className="text-xs text-slate-500">Max drawdown (proxy)</div><div className="text-2xl font-semibold">{stats.maxDD.toFixed(0)}%</div></div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 mt-6">
          <div className="font-medium mb-2">Allocation ({total}%)</div>
          <div className="grid md:grid-cols-2 gap-3">
            {rows.map((r,i)=> (
              <div key={i} className="flex items-center justify-between border rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <AssetLogo src={r.logo||null} label={r.label} size={20}/>
                  <div className="font-medium">{r.label}</div>
                  <span className="text-[11px] text-slate-500 uppercase">{r.bucket}</span>
                </div>
                <div className="text-sm font-semibold">{r.weight}%</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-4">Contenu éducatif, non prescriptif. Aucune garantie de performance.</p>
      </div>
    </main>
  );
}


