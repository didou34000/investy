"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { compoundSeries, profileLabel, profileBlurb } from "@/lib/resultHelpers";
import { getSuggestions } from "@/lib/suggestions";
import SuggestionCard from "@/components/SuggestionCard";
import OnboardingPanel from "@/components/result/OnboardingPanel";

interface ResultData {
  riskIndex: number;
  monthly: number;
  answers: Record<string, any>;
}

// Fonction simple pour calculer l'allocation
function calculateAllocation(riskIndex: number): Record<string, number> {
  const actions = Math.min(90, 10 + 0.8 * riskIndex);
  const obligations = Math.max(5, 70 - 0.6 * riskIndex);
  const alternatifs = Math.max(0, (riskIndex - 60) * 0.5);
  const liquidites = Math.max(0, 15 - riskIndex * 0.1);
  
  const total = actions + obligations + alternatifs + liquidites;
  const k = 100 / total;
  
  return {
    "Actions Monde": Math.round(actions * k),
    "Obligations": Math.round(obligations * k),
    "Alternatifs": Math.round(alternatifs * k),
    "Liquidités": Math.round(liquidites * k),
  };
}

// Fonction simple pour calculer le rendement attendu
function calculateExpectedReturn(riskIndex: number): number {
  return 0.03 + (riskIndex / 100) * 0.07; // 3% → 10%
}

// Fonction simple pour calculer la volatilité
function calculateVolatility(riskIndex: number): number {
  return 0.05 + (riskIndex / 100) * 0.20; // 5% → 25%
}

const COLORS = ["#3B82F6", "#22C55E", "#F87171", "#8B5CF6", "#F59E0B"];

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [reinvest, setReinvest] = useState(true);

  useEffect(() => {
    // Load result from session storage
    const stored = sessionStorage.getItem('investy_result');
    if (stored) {
      const data = JSON.parse(stored);
      setResult(data);
    } else {
      router.push('/quiz');
    }
  }, [router]);

  // Tous les hooks doivent être appelés avant tout return conditionnel
  const riskIndex = result?.riskIndex || 50;
  const expectedReturn = calculateExpectedReturn(riskIndex);
  const expectedVol = calculateVolatility(riskIndex);
  const monthly = result?.monthly || 200;
  const initial = 0; // Pas d'épargne initiale pour simplifier
  const horizon = 10; // 10 ans par défaut
  
  const allocation = calculateAllocation(riskIndex);
  
  // Simulation avec compoundSeries
  const simulationData = useMemo(() => compoundSeries({
    initial, monthly, years: horizon, expectedReturn, reinvest
  }), [initial, monthly, horizon, expectedReturn, reinvest]);
  
  const allocationData = Object.entries(allocation).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  }));

  if (!result) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Chargement...</h2>
          <p className="text-slate-600">Préparation de vos résultats</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* En-tête profil */}
        <h1 className="text-3xl font-semibold text-slate-900 text-center">Votre Profil Investisseur</h1>
        <div className="text-center mt-1 text-sm text-slate-600">
          <span className={ riskIndex<80 ? "text-blue-700" : "text-red-700" }>
            {profileLabel(riskIndex)} (Score {riskIndex}/100)
          </span>
          <div className="mt-1">{profileBlurb(riskIndex)}</div>
        </div>

        {/* Tuiles KPI */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-sm text-slate-500">Rendement Attendu</div>
            <div className="text-2xl font-semibold">{(expectedReturn*100).toFixed(1)}%</div>
            <div className="text-xs text-slate-500 mt-1">Indicatif, non garanti</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-sm text-slate-500">Volatilité estimée</div>
            <div className="text-2xl font-semibold">{(expectedVol*100).toFixed(1)}%</div>
            <div className="text-xs text-slate-500 mt-1">Écart-type annualisé (pédagogique)</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="text-sm text-slate-500">Épargne Mensuelle</div>
            <div className="text-2xl font-semibold">{monthly.toLocaleString('fr-FR')}€</div>
          </div>
          <div className="w-full bg-white rounded-2xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Score de risque</div>
            <div className="mt-1 text-xl font-semibold">{riskIndex}/100</div>
            <div className="mt-3 h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div 
                className="h-3 rounded-full transition-all" 
                style={{ 
                  width: `${riskIndex}%`, 
                  background: riskIndex<60 ? "#22C55E" : riskIndex<80 ? "#F59E0B" : "#EF4444" 
                }} 
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {riskIndex<60 ? "Stabilité prioritaire" : riskIndex<80 ? "Compromis risque/rendement" : "Volatilité acceptée"}
            </div>
          </div>
        </div>

        {/* Allocation Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mt-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">Allocation Proposée</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-slate-900">{item.name}</span>
                  </div>
                  <span className="text-slate-900 font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Allocation proposée (non contractuelle)
          </p>
        </div>

        {/* Simulation épargne */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-5">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-800">Simulation d'Épargne</div>
            <label className="text-sm text-slate-600 flex items-center gap-2">
              <input type="checkbox" checked={reinvest} onChange={e=>setReinvest(e.target.checked)} />
              Réinvestissement des gains
            </label>
          </div>
          <div className="h-[260px] mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulationData}>
                <XAxis dataKey="x" tickFormatter={(v)=>"Année "+v} />
                <YAxis tickFormatter={(v)=>v.toLocaleString('fr-FR')+"€"} />
                <Tooltip formatter={(v:number)=>[v.toLocaleString('fr-FR')+"€","Valeur"]} labelFormatter={(l)=>"Année "+l}/>
                <Line type="monotone" dataKey="y" stroke="#3B82F6" strokeWidth={3} dot={false} animationDuration={900}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Simulation éducative basée sur vos hypothèses. Non contractuelle.</div>
        </div>

            {/* Suggestions pédagogiques enrichies */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-5">
              <div className="text-lg font-semibold mb-2">Suggestions éducatives selon votre profil</div>
              <p className="text-sm text-slate-600 mb-4">
                Actifs adaptés à votre profil <strong>{profileLabel(riskIndex)}</strong> (Score {riskIndex}/100)
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSuggestions(profileLabel(riskIndex)).map((suggestion, index) => (
                  <SuggestionCard key={index} asset={suggestion} />
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 text-lg">💡</div>
                  <div>
                    <div className="font-medium text-blue-900 mb-1">Comment utiliser ces suggestions</div>
                    <p className="text-sm text-blue-700">
                      Ces actifs sont proposés à but éducatif uniquement. Ils vous aident à comprendre 
                      les différents types d'investissements adaptés à votre profil de risque. 
                      Consultez toujours un conseiller financier avant d'investir.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-3">
                Contenu éducatif, non prescriptif. Aucune garantie de performance. 
                Investir comporte des risques de perte en capital.
              </p>
            </div>

            {/* Panneau d'onboarding */}
            <OnboardingPanel result={{
              profileLabel: profileLabel(riskIndex),
              riskIndex,
              expectedReturn,
              expectedVol,
              allocation,
              answers: result.answers,
              emailPref: ""
            }} />

        {/* Résumé des réponses */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mt-5">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Vos Réponses</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(result.answers).map(([key, value]) => (
              <div key={key} className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-1">{key.replace(/_/g, ' ')}</div>
                <div className="font-medium text-slate-900">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/interets"
            className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 text-center font-medium"
          >
            Centre d'intérêts
          </a>
          <button 
            onClick={() => router.push('/quiz')}
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-800 hover:bg-white"
          >
            Refaire le quiz
          </button>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Voir mon dashboard
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-500 text-center mt-6">Contenu éducatif, non prescriptif. Aucune garantie de performance.</p>
      </div>
    </main>
  );
}