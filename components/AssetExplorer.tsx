"use client";
import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Landmark, LineChart as LineIcon, Building2, Bitcoin, Droplet } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from "recharts";
import { simulateGBM, computeCAGR, computeMaxDrawdown } from "@/lib/series";

type AssetKey = "actions"|"obligations"|"etf"|"immobilier"|"crypto"|"liquidites";

type Asset = {
  key: AssetKey;
  label: string;
  color: string; // hex
  icon: any;
  summary: string;
  definition: string;
  pros: string[];
  cons: string[];
  access: string[];
  range: string; // plage indicative
  mu: number; // rendement annuel moyen
  sigma: number; // volatilité annuelle
};

const ASSETS: Asset[] = [
  {
    key:"actions",
    label:"Actions",
    color:"#3B82F6",
    icon:TrendingUp,
    summary:"Parts d'entreprises cotées. Moteur principal de performance long terme.",
    definition:"Acheter une action, c'est devenir copropriétaire d'une entreprise et participer à ses bénéfices (dividendes) et à sa valorisation.",
    pros:["Potentiel élevé sur le long terme","Protection contre l'inflation (bénéfices)","Très large choix sectoriel et géographique"],
    cons:["Volatilité parfois forte","Risque spécifique à l'entreprise","Nécessite discipline & horizon long"],
    access:["ETF Monde (ex: MSCI ACWI)", "PEA / CTO via courtiers en ligne", "Plans d'épargne actions"],
    range:"Typiquement 40–80% (selon profil)",
    mu: 0.07,
    sigma: 0.18
  },
  {
    key:"obligations",
    label:"Obligations",
    color:"#10B981",
    icon:Landmark,
    summary:"Prêts à des États/entreprises avec intérêts. Pilier de stabilité du portefeuille.",
    definition:"Une obligation verse des coupons (intérêts) et rembourse le capital à l'échéance. Moins volatile que les actions.",
    pros:["Rendement prévisible (coupons)","Stabilise le portefeuille","Diversification vs actions"],
    cons:["Sensibles aux taux d'intérêt","Risque de défaut émetteur","Rendement réel peut être modeste"],
    access:["ETF obligataires (agg, gov, corp)", "Fonds euros (spécificités)", "Obligations d'État via courtiers"],
    range:"Typiquement 20–60% (selon profil)",
    mu: 0.03,
    sigma: 0.07
  },
  {
    key:"etf",
    label:"ETF",
    color:"#6366F1",
    icon:LineIcon,
    summary:"Fonds indiciels à faibles frais. Diversification simple et efficace.",
    definition:"Un ETF réplique un indice (ex: S&P 500). En un seul achat, on détient des dizaines/centaines de titres.",
    pros:["Frais réduits","Diversification immédiate","Transparence et liquidité"],
    cons:["Suit le marché (pas d'alpha)","Peut intégrer des secteurs non voulus","Tracking error possible"],
    access:["ETF Monde, S&P 500, Europe, Obligataire","PEA/CTO chez courtiers en ligne","Plan d'investissement programmé (DCA)"],
    range:"Souvent le cœur du portefeuille",
    mu: 0.06,
    sigma: 0.15
  },
  {
    key:"immobilier",
    label:"Immobilier",
    color:"#8B5CF6",
    icon:Building2,
    summary:"Patrimoine tangible : loyers + valorisation à long terme.",
    definition:"Investir dans des biens (direct) ou via des véhicules (SCPI/REIT). Rendement locatif + potentiel d'appréciation.",
    pros:["Revenus potentiels réguliers","Diversification réelle","Effet de levier possible"],
    cons:["Moins liquide","Frais/gestion/impôts","Concentration géographique"],
    access:["SCPI/REIT via CTO/assurance-vie","ETF immobiliers (real estate)","Investissement locatif direct"],
    range:"0–20% selon objectifs",
    mu: 0.05,
    sigma: 0.12
  },
  {
    key:"crypto",
    label:"Crypto",
    color:"#F59E0B",
    icon:Bitcoin,
    summary:"Actifs numériques très volatils. À considérer comme satellite spéculatif.",
    definition:"Réseaux décentralisés (ex: Bitcoin, Ethereum). Forte volatilité et incertitude réglementaire.",
    pros:["Forte convexité potentielle","Innovation financière","Marché 24/7"],
    cons:["Volatilité extrême","Risque technologique et réglementaire","Risque de garde/sécurité"],
    access:["ETF spot (selon pays)","Plateformes régulées (sécurité)","Exposition via ETP/produits dérivés (avancé)"],
    range:"0–5% (profil averti)",
    mu: 0.20,
    sigma: 0.80
  },
  {
    key:"liquidites",
    label:"Liquidités",
    color:"#0EA5E9",
    icon:Droplet,
    summary:"Sécurité et disponibilité. Coussins pour imprévus et opportunités.",
    definition:"Épargne disponible (comptes à vue, livrets, fonds monétaires). Faible risque, rendement limité.",
    pros:["Capital préservé","Disponibilité rapide","Réduit la volatilité globale"],
    cons:["Rendement faible","Érosion par l'inflation","Tentant de 'timer' le marché"],
    access:["Livrets réglementés","Fonds monétaires","Caisse de courtage (cash management)"],
    range:"1–10% (matelas de sécurité)",
    mu: 0.01,
    sigma: 0.02
  },
];

export default function AssetExplorer(){
  const [active, setActive] = useState<AssetKey>("actions");
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random()*1e9));
  const current = useMemo(()=> ASSETS.find(a=>a.key===active)!, [active]);

  function formatPct(x:number) {
    return (x*100).toFixed(1).replace(".", ",") + " %";
  }

  const series = useMemo(()=>{
    return simulateGBM(
      120,
      100,
      current.mu ?? 0.06,
      current.sigma ?? 0.15,
      seed + current.key.length
    );
  }, [current, seed]);

  const cagr = useMemo(()=> computeCAGR(series, 10), [series]);
  const mdd  = useMemo(()=> computeMaxDrawdown(series), [series]);

  useEffect(()=>{ /* focus visuel optionnel au changement */ }, [active]);

  return (
    <section aria-labelledby="assets-title" className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 id="assets-title" className="text-3xl md:text-4xl font-semibold text-center mb-10">Grandes familles d'actifs</h2>

        <div className="grid md:grid-cols-[280px,1fr] gap-6">
          {/* Liste (tabs/volet) */}
          <div role="tablist" aria-label="Types d'actifs" className="bg-white border border-slate-200 rounded-2xl shadow-sm p-2">
            {ASSETS.map(a=>{
              const Icon = a.icon;
              const selected = a.key===active;
              return (
                <button
                  key={a.key}
                  role="tab"
                  aria-selected={selected}
                  onClick={()=>setActive(a.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition
                    ${selected ? "bg-slate-100 border border-slate-200" : "hover:bg-slate-50"}`}
                >
                  <Icon className="w-5 h-5" style={{color:a.color}} />
                  <div>
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-xs text-slate-600">{a.summary}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Panneau de contenu */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <current.icon className="w-6 h-6" style={{color:current.color}} />
              <h3 className="text-xl font-semibold">{current.label}</h3>
              <span className="ml-auto text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-lg border border-slate-200">
                Plage indicative : {current.range}
              </span>
            </div>

            <p className="text-slate-700 mb-4">{current.definition}</p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="text-sm font-semibold mb-2">Atouts</div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                      {current.pros.map((p,i)=><li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="text-sm font-semibold mb-2">Risques</div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                      {current.cons.map((c,i)=><li key={i}>{c}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4">
                  <div className="text-sm font-semibold mb-2">Comment y accéder ?</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                    {current.access.map((x,i)=><li key={i}>{x}</li>)}
                  </ul>
                </div>
              </div>

              {/* Simulation éducative */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-slate-800">10 ans (simulation éducative)</div>
                  <button
                    onClick={() => setSeed(Math.floor(Math.random()*1e9))}
                    className="text-xs px-2 py-1 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Resimuler
                  </button>
                </div>

                <div className="h-40">
                  <ResponsiveContainer>
                    <AreaChart data={series}>
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={current.color} stopOpacity={0.25}/>
                          <stop offset="95%" stopColor={current.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="t" hide />
                      <YAxis hide domain={["auto","auto"]} />
                      <Tooltip
                        formatter={(v)=>Math.round(Number(v)).toLocaleString("fr-FR")}
                        labelFormatter={(l)=>`${Math.floor(Number(l)/12)} an(s)`}
                      />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={current.color}
                        strokeWidth={2}
                        fill="url(#grad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-lg">
                    CAGR ~ {formatPct(cagr)}
                  </span>
                  <span className="text-[11px] bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-lg">
                    Max DD ~ {formatPct(mdd)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mt-2">
                  Illustration synthétique (GBM), non représentative de performances réelles.
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 mt-6">
              Contenu éducatif uniquement — aucune recommandation. Les plages indicatives varient selon le profil investisseur.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
