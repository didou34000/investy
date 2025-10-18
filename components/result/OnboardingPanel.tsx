"use client";
import { useEffect, useMemo, useState } from "react";
import AuthEmailCard from "@/components/AuthEmailCard";
import { saveWatchlist, saveAlertPrefs, upsertUserProfile, saveQuizResult } from "@/lib/onboarding";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  result: {
    profileLabel: string;
    riskIndex: number;
    expectedReturn: number;
    expectedVol: number;
    allocation: Record<string,number>;
    answers: any;              // pour sauvegarder quiz_results
    emailPref?: string;        // si fourni plus tôt
  }
};

const PRESETS: Record<string, { symbol:string, label:string, category:string }[]> = {
  "Prudent": [
    { symbol:"Euro-Gov",  label:"ETF Obligations d'État zone euro", category:"etf" },
    { symbol:"MSCI-World",label:"ETF Monde large", category:"etf" },
  ],
  "Modéré défensif": [
    { symbol:"S&P-500", label:"ETF S&P 500", category:"etf" },
    { symbol:"Euro-Gov", label:"ETF Obligations d'État zone euro", category:"etf" },
    { symbol:"AAPL", label:"Apple (action)", category:"equity" },
  ],
  "Équilibré": [
    { symbol:"S&P-500", label:"ETF S&P 500", category:"etf" },
    { symbol:"MSCI-World", label:"ETF Monde large", category:"etf" },
    { symbol:"AAPL", label:"Apple (action)", category:"equity" },
  ],
  "Modéré offensif": [
    { symbol:"S&P-500", label:"ETF S&P 500", category:"etf" },
    { symbol:"MSFT", label:"Microsoft (action)", category:"equity" },
    { symbol:"BTC", label:"Bitcoin (crypto)", category:"crypto" },
  ],
  "Dynamique": [
    { symbol:"S&P-500", label:"ETF S&P 500", category:"etf" },
    { symbol:"MSFT", label:"Microsoft (action)", category:"equity" },
    { symbol:"BTC", label:"Bitcoin (crypto)", category:"crypto" },
  ],
  "Agressif": [
    { symbol:"NASDAQ-100", label:"ETF Nasdaq-100", category:"etf" },
    { symbol:"TSLA", label:"Tesla (action)", category:"equity" },
    { symbol:"ETH", label:"Ethereum (crypto)", category:"crypto" },
    { symbol:"SOL", label:"Solana (crypto)", category:"crypto" },
  ]
};

export default function OnboardingPanel({ result }:Props){
  const [session,setSession]=useState<any>(null);
  const [email,setEmail]=useState(result.emailPref||"");
  const [watch, setWatch] = useState<{symbol:string,label:string,category:string}[]>([]);
  const [freq, setFreq] = useState<"daily"|"weekly">("weekly");
  const [topics, setTopics] = useState<string[]>(["macro","equities","etf","crypto"]);
  const [loading, setLoading] = useState(false);
  
  const preset = useMemo(()=> PRESETS[result.profileLabel] || PRESETS["Équilibré"], [result.profileLabel]);

  useEffect(()=>{ 
    supabase.auth.getSession().then(({data})=> setSession(data.session)); 
  },[]);
  
  useEffect(()=>{ 
    if(!watch.length) setWatch(preset); 
  }, [preset]);

  async function persistAll(){
    try{
      setLoading(true);
      
      if(!session){
        if(!email){ 
          alert("Entrez votre email pour créer votre espace."); 
          return; 
        }
      }
      
      // 1) upsert profile (nécessite session si RLS stricte)
      if(session){
        await upsertUserProfile({
          email: session.user.email || email,
          profileType: result.profileLabel,
          riskIndex: result.riskIndex,
          expectedReturn: result.expectedReturn,
          expectedVol: result.expectedVol,
          allocation: result.allocation,
          name: session.user.user_metadata?.name || null
        });
        
        await saveQuizResult(result.answers, {
          riskIndex: result.riskIndex,
          expectedReturn: result.expectedReturn,
          expectedVol: result.expectedVol,
          allocation: result.allocation
        });
        
        // 2) watchlist
        await saveWatchlist(watch);
        
        // 3) alert prefs
        await saveAlertPrefs(freq, topics);
        
        window.location.href = "/dashboard?welcome=1";
      } else {
        alert("Connectez-vous via le lien email ci-dessus, puis revenez sauvegarder vos préférences.");
      }
    } catch(e:any){ 
      alert(e.message||"Erreur lors de la sauvegarde"); 
    } finally {
      setLoading(false);
    }
  }

  const toggleTopic = (t:string)=> setTopics(p => p.includes(t) ? p.filter(x=>x!==t) : [...p, t]);
  const removeSym = (s:string)=> setWatch(p => p.filter(x=>x.symbol!==s));

  return (
    <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-slate-900">Créer mon espace & activer le suivi</h3>
      <p className="text-sm text-slate-600 mt-1">
        Sauvegardez votre profil, suivez des actifs et recevez un résumé {freq==="daily" ? "quotidien" : "hebdomadaire"} adapté à votre profil.
      </p>

      {!session && (
        <div className="mt-4">
          <AuthEmailCard onSuccess={()=>{ /* rien */ }} />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Watchlist */}
        <div>
          <div className="font-medium text-slate-900">Sélection initiale (modifiable)</div>
          <p className="text-sm text-slate-600 mb-2">
            Proposée selon votre profil : <strong>{result.profileLabel}</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            {watch.map(w => (
              <span key={w.symbol} className="inline-flex items-center gap-2 text-sm bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
                {w.label}
                <button 
                  onClick={()=>removeSym(w.symbol)} 
                  className="text-slate-500 hover:text-slate-700 text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Vous pourrez en ajouter davantage depuis le dashboard.
          </p>
        </div>

        {/* Alertes */}
        <div>
          <div className="font-medium text-slate-900">Préférences d'alertes</div>
          <div className="mt-2 flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input 
                type="radio" 
                name="freq" 
                checked={freq==="weekly"} 
                onChange={()=>setFreq("weekly")} 
              /> 
              Hebdomadaire
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input 
                type="radio" 
                name="freq" 
                checked={freq==="daily"} 
                onChange={()=>setFreq("daily")} 
              /> 
              Quotidienne
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {["macro","equities","etf","crypto"].map(t=>(
              <button 
                key={t} 
                onClick={()=>toggleTopic(t)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  topics.includes(t) 
                    ? "bg-blue-50 text-blue-700 border-blue-200" 
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <button 
          onClick={persistAll} 
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Enregistrement..." : "Enregistrer & aller au dashboard"}
        </button>
        <button 
          onClick={()=>window.print()} 
          className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 hover:bg-white"
        >
          Exporter mon plan (PDF)
        </button>
      </div>

      <p className="text-[11px] text-slate-500 mt-3">
        Contenu éducatif, non prescriptif. Aucune garantie de performance.
      </p>
    </section>
  );
}
