"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AssetLogo from "@/components/ui/AssetLogo";

type Item = { source:"yahoo"|"coingecko"; symbol:string; label:string; category:string; image?:string|null };

export default function WatchlistManager(){
  const [q,setQ]=useState("");
  const [res,setRes]=useState<Item[]>([]);
  const [session,setSession]=useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ 
    supabase.auth.getSession().then(({data})=> setSession(data.session??null)); 
  },[]);

  async function search(){
    if(!q.trim()) return;
    
    setLoading(true);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { cache:"no-store" });
      const j = await r.json(); 
      setRes(j.items||[]);
    } catch (error) {
      console.error("Erreur recherche:", error);
      setRes([]);
    } finally {
      setLoading(false);
    }
  }

  async function add(it:Item){
    if(!session){ 
      alert("Connectez-vous pour enregistrer votre watchlist."); 
      return; 
    }
    
    try {
      const { error } = await supabase.from("user_watchlist").upsert({
        user_id: session.user.id, 
        symbol: it.symbol, 
        label: it.label, 
        category: it.category
      });
      
      if(error) {
        alert(error.message);
      } else { 
        setQ(""); 
        setRes([]); 
        alert("Ajouté ✔"); 
      }
    } catch (error) {
      console.error("Erreur ajout:", error);
      alert("Erreur lors de l'ajout");
    }
  }

  return (
    <div className="border rounded-2xl p-4 bg-white">
      <div className="font-medium text-slate-900">Ajouter un actif à suivre</div>
      <div className="flex gap-2 mt-2">
        <input 
          value={q} 
          onChange={e=>setQ(e.target.value)} 
          placeholder="Ex: AAPL, S&P500, bitcoin…" 
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && search()}
        />
        <button 
          onClick={search} 
          disabled={loading || !q.trim()}
          className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Rechercher"}
        </button>
      </div>
      
      {res.length>0 && (
        <div className="mt-3 grid md:grid-cols-2 gap-2">
          {res.map((it,i)=>(
            <button 
              key={i} 
              onClick={()=>add(it)} 
              className="text-left border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
                  <AssetLogo src={it.image||null} label={it.label} size={18}/>
              <div>
                <div className="font-medium text-slate-900">{it.label}</div>
                <div className="text-xs text-slate-500 uppercase">{it.category} · {it.source}</div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      <p className="text-xs text-slate-500 mt-2">
        Recherche dans Yahoo Finance (actions/ETF/indices) et CoinGecko (crypto).
      </p>
    </div>
  );
}
