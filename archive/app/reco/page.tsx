"use client";
import { useEffect, useState } from "react";
import AssetLogo from "@/components/ui/AssetLogo";
import { supabase } from "@/lib/supabaseClient";
import { resolveLogo } from "@/lib/logo";

type Reco = {
  ok:boolean;
  profile:{ id:string; title:string; score:number; description:string };
  allocation:{ equity:number; bond:number; alts:number; cash:number; crypto?:number };
  suggestions:{ symbol:string; label:string; category:string; suitability:1|2|3; rationale:string; tilt:string[]; region?:string }[];
  disclaimer:string;
};

function SuitBadge({s}:{s:1|2|3}){
  return (
    <span className={
      "text-[10px] px-2 py-0.5 rounded border " +
      (s===3 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
       s===2 ? "bg-sky-50 text-sky-700 border-sky-200" :
               "bg-slate-50 text-slate-600 border-slate-200")
    }>
      {s===3 ? "Très adapté" : s===2 ? "Adapté" : "À considérer"}
    </span>
  );
}

export default function RecoPage(){
  const [data,setData]=useState<Reco|null>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ (async ()=>{
    const params = new URLSearchParams(window.location.search);
    const score = Number(params.get("score")||"45");
    const mods = {
      horizonYears: Number(params.get("horizon")||"10"),
      maxDrawdownTolerance: Number(params.get("dd")||"25"),
      cryptoInterest: (params.get("crypto")||"mid") as any,
      needIncome: params.get("income")==="1",
      needLiquidity: params.get("liq")==="1",
      greenTilt: params.get("green")==="1"
    };
    const r = await fetch("/api/reco", { method:"POST", body: JSON.stringify({ score, mods }) });
    const j = await r.json(); setData(j); setLoading(false);
  })(); },[]);

  async function addToWatchlist(symbol:string, label:string, category:string){
    const { data:{session} } = await supabase.auth.getSession();
    if(!session){ alert("Connectez-vous pour enregistrer votre suivi."); return; }
    const { error } = await supabase.from("user_watchlist").upsert({
      user_id: session.user.id, symbol, label, category
    });
    if(error) alert(error.message); else alert("Ajouté à votre suivi ✔");
  }

  if(loading) return <main className="p-8">Chargement…</main>;
  if(!data?.ok) return <main className="p-8">Impossible de générer des suggestions.</main>;

  const A = data.allocation;
  const allocList = [
    {k:"Actions", v:A.equity},
    {k:"Obligations", v:A.bond},
    {k:"Alternatifs", v:A.alts},
    {k:"Liquidités", v:A.cash},
    ...(A.crypto!=null ? [{k:"Crypto", v:A.crypto}] : [])
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Profil: {data.profile.title} <span className="text-slate-400 text-base">score {data.profile.score}/100</span></h1>
        <p className="text-slate-600 mt-1">{data.profile.description}</p>

        <div className="grid md:grid-cols-5 gap-3 mt-5">
          {allocList.map((it,i)=>(
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="text-xs text-slate-500">{it.k}</div>
              <div className="text-xl font-semibold">{it.v}%</div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4">
          <div className="font-semibold mb-2">Actifs illustratifs (éducatif)</div>
          <div className="grid md:grid-cols-2 gap-3">
            {data.suggestions.map((s,i)=>{
              const logo = resolveLogo({ symbol: s.symbol, category: s.category as any, coingeckoImage: null });
              return (
                <div key={i} className="border rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <AssetLogo src={logo} label={s.label} size={22}/>
                    <div className="font-medium">{s.label}</div>
                    <SuitBadge s={s.suitability}/>
                    <span className="text-[10px] rounded border px-1.5 py-0.5 ml-auto">{s.category.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{s.rationale}</p>
                  {s.tilt?.length ? <div className="mt-1 flex flex-wrap gap-1">{s.tilt.map(t=>(<span key={t} className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">{t}</span>))}</div> : null}
                  <div className="mt-2 flex gap-2">
                    <button onClick={()=>addToWatchlist(s.symbol, s.label, s.category)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Suivre</button>
                    <a className="text-xs px-3 py-1.5 rounded-lg border hover:bg-white" href={`/fiches/${encodeURIComponent(s.symbol.toLowerCase())}`} title="Fiche pédagogique">Fiche</a>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-3">{data.disclaimer}</p>
        </div>
      </div>
    </main>
  );
}


