"use client";
import { useState, useMemo } from "react";
import { computeRiskIndex } from "@/lib/riskModelPro";
import { useRouter } from "next/navigation";

type Q = { id:string; label:string; help?:string; type:"likert"|"number"; min?:number; max?:number; step?:number; branch?: (vals:Record<string,number>)=>boolean };

const QS: Q[] = [
  // Tolérance
  { id:"tol_risk", label:"Votre tolérance au risque de marché ?", type:"likert" },
  { id:"tol_drawdown", label:"Perte maximale supportable sur 1 an (non réalisée) ?", type:"likert" },
  { id:"tol_reaction", label:"En cas de baisse rapide, votre comportement probable ?", type:"likert" },
  { id:"tol_consistency", label:"Capacité à maintenir le plan d'investissement dans le temps ?", type:"likert" },

  // Capacité
  { id:"cap_horizon", label:"Horizon d'investissement (années)", type:"number", min:1, max:40, step:1 },
  { id:"cap_income_stability", label:"Stabilité de vos revenus ?", type:"likert" },
  { id:"cap_reserves", label:"Réserves de sécurité (mois de dépenses)", type:"number", min:0, max:36, step:1 },
  { id:"cap_wealth_share", label:"Part de votre patrimoine que vous investissez (%)", type:"number", min:1, max:100, step:1 },

  // Besoin
  { id:"bes_target", label:"Rendement annuel visé (perception)", type:"likert" },
  { id:"bes_real", label:"Besoin de croissance réelle (au-delà de l'inflation) ?", type:"likert" },
  { id:"bes_knowledge", label:"Connaissance produits (ETF/obligations) ?", type:"likert" },
  { id:"bes_flex", label:"Flexibilité de vos versements ?", type:"likert" },

  // Scénarios
  { id:"sc_10_drop", label:"Acceptation d'une baisse de -10% en 1 mois ?", type:"likert" },
  { id:"sc_20_drop", label:"Acceptation d'une baisse de -20% en 6 mois ?", type:"likert" },
  { id:"sc_recovery_view", label:"Vision de la reprise après choc ?", type:"likert" },
  { id:"sc_liquidity_need", label:"Probabilité d'un besoin de liquidité imprévu ?", type:"likert" },
];

function Likert({value,onChange}:{value?:number; onChange:(v:number)=>void}){
  // 1..5 : Très faible, Faible, Modérée, Élevée, Très élevée
  const labels = ["Très faible","Faible","Modérée","Élevée","Très élevée"];
  return (
    <div className="grid grid-cols-5 gap-2 mt-3">
      {labels.map((l,i)=>(
        <button key={i} onClick={()=>onChange(i+1)}
          className={`px-3 py-2 border rounded-lg text-sm ${value===i+1 ? "border-blue-600 text-blue-700 bg-blue-50" : "border-slate-300 hover:bg-slate-50"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export default function QuizPro(){
  const [vals,setVals] = useState<Record<string,number>>({});
  const [page, setPage] = useState(0);
  const router = useRouter();

  const pageSize = 4;
  const pages = Math.ceil(QS.length / pageSize);
  const slice = QS.slice(page*pageSize, (page+1)*pageSize);

  const progress = Math.round( (Object.keys(vals).length / QS.length) * 100 );

  function setVal(id:string, v:number){
    // Normaliser les champs numériques 1..5 (quantiles) sans biaiser (ici simple bucketing)
    const q = QS.find(q=>q.id===id);
    if(q?.type==="number"){
      const min=q.min ?? 0, max=q.max ?? 100, x = Math.max(min, Math.min(max, v));
      // bucketing 5 classes:
      const bucket = Math.min(5, Math.max(1, Math.ceil( ( (x - min) / (max - min||1) ) * 5 )));
      setVals(s=>({...s, [id]: bucket}));
    } else {
      setVals(s=>({...s, [id]: v}));
    }
  }

  function submit(){
    const { riskIndex, axes } = computeRiskIndex(vals);
    const payload = { riskIndex, axes, raw: vals };
    sessionStorage.setItem("investy_result", JSON.stringify(payload));
    router.push("/result");
  }

  return (
    <section className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Évaluez votre profil investisseur</h1>
          <p className="text-slate-600">16 questions structurées. Ton analytique, sans jargon inutile. Temps: ~3 min.</p>
        </div>

        <div className="w-full bg-slate-200 h-2 rounded-full mb-6">
          <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid gap-6">
          {slice.map(q=>(
            <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{q.label}</div>
                  {q.help && <div className="text-xs text-slate-500">{q.help}</div>}
                </div>
              </div>

              {q.type==="likert" && <Likert value={vals[q.id]} onChange={(v)=>setVal(q.id,v)} />}
              {q.type==="number" && (
                <div className="flex items-center gap-3 mt-3">
                  <input type="number" min={q.min} max={q.max} step={q.step ?? 1}
                    className="border border-slate-300 rounded-lg px-3 py-2 w-40"
                    onChange={(e)=>setVal(q.id, Number(e.target.value)||0)} />
                  <div className="text-xs text-slate-500">Saise numérique convertie en échelle 1..5 pour le scoring.</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button disabled={page===0}
            onClick={()=>setPage(p=>Math.max(0,p-1))}
            className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50">Précédent</button>
          {page < pages-1 ? (
            <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white">Suivant</button>
          ) : (
            <button onClick={submit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white">Voir le résultat</button>
          )}
        </div>
      </div>
    </section>
  );
}
