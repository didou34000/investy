"use client";
import { useState, useMemo } from "react";
import { allocationForScore, getProfileLabel, yearlyReturn, volatility, simulateGrowth } from "@/lib/profileEngine";
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

export default function ProfileResult({ initialScore = 55, initialMonthly = 200 }: { initialScore?: number; initialMonthly?: number }) {
  const [risk, setRisk] = useState(initialScore);
  const [monthly, setMonthly] = useState(initialMonthly);

  const label = useMemo(() => getProfileLabel(risk), [risk]);
  const allocation = useMemo(() => allocationForScore(risk), [risk]);
  const perf = useMemo(() => simulateGrowth(monthly, risk, 10), [monthly, risk]);
  const ret = yearlyReturn(risk);
  const vol = volatility(risk);

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];
  const radarData = [
    { subject: "Tolérance", A: risk },
    { subject: "Stabilité", A: 100 - risk },
    { subject: "Rendement", A: ret * 1000 },
    { subject: "Volatilité", A: vol * 400 },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{label}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Voici ton profil investisseur détaillé : allocation, projections et indicateurs personnalisés.
          </p>
        </div>

        {/* SLIDERS */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <label className="font-medium">Ton niveau de risque : <span className="text-blue-600 font-semibold">{risk}</span>/100</label>
            <input
              type="range" min={0} max={100} value={risk}
              onChange={(e) => setRisk(Number(e.target.value))}
              className="w-full mt-3 accent-blue-600"
            />
            <p className="text-sm text-slate-500 mt-2">Fais glisser pour ajuster ton profil.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <label className="font-medium">Épargne mensuelle (€)</label>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="border border-slate-300 rounded-lg px-3 py-2 w-full mt-3"
            />
            <p className="text-sm text-slate-500 mt-2">Modifie ton épargne pour recalculer la projection.</p>
          </div>
        </div>

        {/* GRAPHIQUES */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Allocation */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Répartition de ton portefeuille</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={Object.entries(allocation).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" label>
                  {Object.keys(allocation).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="grid grid-cols-2 text-sm mt-3">
              {Object.entries(allocation).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span>{k}</span> <span className="font-semibold">{v}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Radar */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Profil de risque global</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PROJECTIONS */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Projection à 10 ans 📈</h3>
          <p className="text-slate-600 mb-4">
            Avec {monthly} €/mois et ton profil actuel ({label.toLowerCase()}), voici les trois scénarios possibles :
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-slate-500">Scénario pessimiste</p>
              <p className="text-xl font-semibold text-red-600">{perf.p10.toLocaleString("fr-FR")} €</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Scénario médian</p>
              <p className="text-xl font-semibold text-blue-600">{perf.p50.toLocaleString("fr-FR")} €</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Scénario optimiste</p>
              <p className="text-xl font-semibold text-green-600">{perf.p90.toLocaleString("fr-FR")} €</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Estimation éducative, non contractuelle. Rendement annuel attendu : {(ret * 100).toFixed(1)}% ± {(vol * 100).toFixed(1)}%.
          </p>
        </div>

        {/* INFO EDUCATIVES */}
        <div className="mt-12 grid md:grid-cols-4 gap-6 text-sm">
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <h4 className="font-semibold mb-2 text-blue-700">💼 Actions Monde</h4>
            <p>Représentent la partie la plus dynamique du portefeuille. Potentiel élevé mais volatilité forte.</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <h4 className="font-semibold mb-2 text-green-700">🏦 Obligations</h4>
            <p>Apportent stabilité et revenus réguliers. Performances plus modérées mais plus sûres.</p>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
            <h4 className="font-semibold mb-2 text-yellow-700">🌍 Alternatifs</h4>
            <p>Incluent immobilier, or ou secteurs thématiques. Bon levier de diversification.</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <h4 className="font-semibold mb-2 text-slate-700">💧 Liquidités</h4>
            <p>Permettent de saisir des opportunités et amortir les baisses. Faible rendement, sécurité maximale.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
