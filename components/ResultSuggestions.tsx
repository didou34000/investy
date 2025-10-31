"use client";
import { useEffect, useState } from "react";
import { suggestionsByProfile, Suggestion } from "@/lib/resultHelpers";
import { supabase } from "@/lib/supabaseClient";

export default function ResultSuggestions({ riskIndex, allocation }:{
  riskIndex:number;
  allocation: Record<string, number>;
}){
  const [session, setSession] = useState<any>(null);
  const [items, setItems] = useState<Suggestion[]>([]);

  useEffect(()=>{ 
    supabase.auth.getSession().then(({data})=> setSession(data.session ?? null));
  },[]);
  useEffect(()=>{ setItems(suggestionsByProfile(riskIndex, allocation)); }, [riskIndex, allocation]);

  async function follow(s:Suggestion){
    if(!session){ alert("Connectez-vous via le lien email pour suivre un actif."); return; }
    const { error } = await supabase.from("user_watchlist").upsert({
      user_id: session.user.id,
      symbol: s.symbol,
      label: s.label,
      category: s.category
    });
    if(error) alert(error.message); else alert(`Ajouté à votre suivi: ${s.label}`);
  }

  const chip = (s:"high"|"medium"|"low") =>
    s==="high" ? <span className="text-green-700 bg-green-50 border border-green-200 text-xs px-2 py-1 rounded">Très adapté</span> :
    s==="medium" ? <span className="text-blue-700 bg-blue-50 border border-blue-200 text-xs px-2 py-1 rounded">Adapté</span> :
    <span className="text-amber-700 bg-amber-50 border border-amber-200 text-xs px-2 py-1 rounded">À considérer</span>;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="text-lg font-semibold mb-2">Suggestions pédagogiques</div>
      <p className="text-sm text-slate-600 mb-4">Exemples d'expositions indicatives selon votre profil. Contenu éducatif, non prescriptif.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((s,i)=>(
          <div key={i} className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{s.label}</div>
              {chip(s.suitability)}
            </div>
            <div className="text-xs text-slate-500 mt-1 uppercase">{s.category}</div>
            <p className="text-sm text-slate-600 mt-2">{s.note}</p>
            <button onClick={()=>follow(s)} className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">Suivre</button>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-500 mt-3">Nous n'émettons pas d'ordres ni de recommandations personnalisées.</p>
    </div>
  );
}
