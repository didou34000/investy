"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AssetLogo from "@/components/ui/AssetLogo";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3B82F6","#10B981","#FBBF24","#EF4444"];

export default function Dashboard(){
  const [alloc,setAlloc]=useState<Record<string, number>>({});
  const [watch,setWatch]=useState<Array<{symbol: string; label: string}>>([]);
  const [history,setHistory]=useState<Array<{mois: string; valeur: number}>>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ load(); },[]);

  async function load(){
    const { data:{session} } = await supabase.auth.getSession();
    const uid = session?.user?.id || "demo-user";
    const { data:p } = await supabase.from("user_dashboard").select("*").eq("user_id",uid).maybeSingle();
    const { data:w } = await supabase.from("user_watchlist").select("*").eq("user_id",uid);
    setAlloc(p?.target_allocation||{actions:0.5,obligations:0.3,crypto:0.2});
    setWatch(w||[]);
    const hist: Array<{mois: string; valeur: number}> = [];
    let val = 1000;
    for(let i=0;i<24;i++){
      const growth = (p?.risk_score||50)/100*0.5;
      val *= 1+(growth/12);
      hist.push({mois:`M${i+1}`,valeur:val});
    }
    setHistory(hist);
    setLoading(false);
  }

  if(loading) return <div className="p-10 text-slate-500">Chargement...</div>;

  const allocData = Object.entries(alloc).map(([k,v])=>({name:k,value:v}));

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-1">Mon tableau de bord</h1>
        <p className="text-slate-600 mb-8">Suivez vos allocations, votre valorisation simulée et les mouvements récents.</p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white border rounded-2xl shadow-sm p-6 col-span-2">
            <h2 className="font-semibold text-lg mb-4">Valorisation simulée</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={history}>
                <XAxis dataKey="mois" hide />
                <YAxis hide />
                <Tooltip formatter={(v)=>Number(v).toFixed(0)+" €"} />
                <Line type="monotone" dataKey="valeur" stroke="#3B82F6" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
            <p className="text-slate-500 mt-2 text-sm">Simulation sur 2 ans avec réinvestissement automatique.</p>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Allocation cible</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={allocData} dataKey="value" nameKey="name" outerRadius={70}>
                  {allocData.map((entry, index)=>(<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="text-sm space-y-1">
              {allocData.map((a,i)=>(<li key={i}><span className="font-medium capitalize">{a.name}</span>: {(a.value*100).toFixed(0)}%</li>))}
            </ul>
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4">Mes actifs suivis</h2>
          {!watch.length && <p className="text-slate-500 text-sm">Aucun actif suivi. Ajoutez-en depuis la page Recommandations.</p>}
          <div className="grid md:grid-cols-3 gap-4">
            {watch.map((x)=> (
              <div key={x.symbol} className="border rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition-all">
                <AssetLogo label={x.label} size={32}/>
                <div>
                  <div className="font-medium">{x.label}</div>
                  <div className="text-xs text-slate-500">{x.symbol}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm font-semibold text-emerald-600">+2.3%</div>
                  <div className="text-xs text-slate-400">aujourd’hui</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <h3 className="font-semibold mb-2">💡 Conseil éducatif</h3>
          <p className="text-sm text-slate-700">Un portefeuille bien équilibré garde sa cohérence dans le temps. Pensez à “rééquilibrer” votre exposition selon vos objectifs et tolérance au risque.</p>
        </div>
      </div>
    </main>
  );
}