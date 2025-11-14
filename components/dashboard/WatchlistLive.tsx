"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sparkline from "./Sparkline";
import AssetLogo from "@/components/ui/AssetLogo";

type Row = { id:string; symbol:string; label:string; category:string; alert_threshold:number|null };

export default function WatchlistLive(){
  const [session,setSession]=useState<any>(null);
  const [rows,setRows]=useState<Row[]>([]);
  const [quotes,setQuotes]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ 
    supabase.auth.getSession().then(({data})=> setSession(data.session??null)); 
  },[]);
  
  async function loadWL(){
    try {
      const { data } = await supabase
        .from("user_watchlist")
        .select("id,symbol,label,category,alert_threshold")
        .order("created_at",{ascending:false});
      setRows(data||[]);
    } catch (error) {
      console.error("Erreur chargement watchlist:", error);
    }
  }
  
  async function loadQuotes(){
    if(!rows.length) return setQuotes([]);
    
    try {
      const r = await fetch("/api/quotes", { 
        method:"POST", 
        body: JSON.stringify({ 
          entries: rows.map(r=>({symbol:r.symbol, category:r.category})) 
        }) 
      });
      const j = await r.json(); 
      setQuotes(j.quotes||[]);
    } catch (error) {
      console.error("Erreur chargement quotes:", error);
    }
  }
  
  useEffect(()=>{ 
    if(session){ 
      loadWL(); 
    } 
  },[session]);
  
  useEffect(()=>{ 
    if(rows.length){ 
      loadQuotes().finally(()=>setLoading(false)); 
    } else { 
      setLoading(false); 
    } 
  },[rows]);

  // refresh léger toutes les 90s
  useEffect(()=>{
    const id = setInterval(()=> loadQuotes(), 90000);
    return ()=> clearInterval(id);
  },[rows]);

  async function setThreshold(id:string, v:number|null){
    try {
      const { error } = await supabase
        .from("user_watchlist")
        .update({ alert_threshold: v })
        .eq("id", id);
      
      if(error) {
        alert(error.message);
      } else {
        setRows(prev => prev.map(r=> r.id===id? {...r, alert_threshold: v} : r));
      }
    } catch (error) {
      console.error("Erreur seuil:", error);
      alert("Erreur lors de la mise à jour du seuil");
    }
  }
  
  async function remove(id:string){
    try {
      const { error } = await supabase
        .from("user_watchlist")
        .delete()
        .eq("id", id);
      
      if(error) {
        alert(error.message);
      } else {
        setRows(prev => prev.filter(r=>r.id!==id));
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression");
    }
  }

  const map = useMemo(()=> 
    Object.fromEntries(quotes.map((q:any)=>[q.symbol, q])), 
    [quotes]
  );

  if(!session) return <div className="text-sm text-slate-600">Connectez-vous pour voir votre suivi.</div>;
  if(loading) return <div className="text-sm text-slate-600">Chargement…</div>;

  return (
    <div className="border rounded-2xl p-4 bg-white">
      <div className="font-medium text-slate-900">Mes actifs (live)</div>
      {!rows.length && (
        <div className="text-sm text-slate-600 mt-2">Aucun actif suivi pour l'instant.</div>
      )}
      {rows.length>0 && (
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="text-left py-2">Actif</th>
                <th className="text-right">Cours</th>
                <th className="text-right">1 j</th>
                <th className="text-right">5 j</th>
                <th className="text-center">Trend</th>
                <th className="text-center">Seuil alerte (|%|)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r=>{
                const q = map[r.symbol];
                const p = q?.price ?? null;
                const d1 = q?.change1dPct ?? null;
                const d5 = q?.change5dPct ?? null;
                return (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">
                        <div className="flex items-center gap-2">
                          <AssetLogo src={q?.logo || null} label={r.label} size={20}/>
                          <div>
                            <div className="font-medium">{r.label}</div>
                            <div className="text-slate-400 text-xs">({r.symbol})</div>
                          </div>
                        </div>
                    </td>
                    <td className="text-right">
                      {p!=null ? p.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
                    </td>
                    <td className={"text-right " + (d1>0?"text-green-600":d1<0?"text-red-600":"")}>
                      {d1!=null ? (d1>=0?"+":"")+d1.toFixed(2)+"%" : "—"}
                    </td>
                    <td className={"text-right " + (d5>0?"text-green-600":d5<0?"text-red-600":"")}>
                      {d5!=null ? (d5>=0?"+":"")+d5.toFixed(2)+"%" : "—"}
                    </td>
                    <td className="text-center">
                      <Sparkline data={q?.history||[]}/>
                    </td>
                    <td className="text-center">
                      <input 
                        type="number" 
                        step="0.5" 
                        min="0"
                        value={r.alert_threshold ?? ""} 
                        onChange={e=>setThreshold(r.id, e.target.value===""? null : Number(e.target.value))}
                        className="w-20 text-right border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="—"
                      />
                    </td>
                    <td className="text-right">
                      <button 
                        onClick={()=>remove(r.id)} 
                        className="text-slate-500 hover:text-slate-800 text-sm"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-[11px] text-slate-500 mt-2">
            Le seuil s'applique à la variation absolue journalière. Vide = seuil par défaut de votre profil.
          </p>
        </div>
      )}
    </div>
  );
}
