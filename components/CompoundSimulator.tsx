"use client";
import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CompoundSimulator() {
  const [capital, setCapital] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(5);
  const [total, setTotal] = useState(0);
  const data = useMemo(() => {
    // calc: intérêts composés avec versements mensuels
    const r = rate / 100 / 12;
    const n = years * 12;
    let balance = capital;
    const arr: { year: number; value: number }[] = [];
    for (let i = 1; i <= n; i++) {
      balance = balance * (1 + r) + monthly;
      if (i % 12 === 0) arr.push({ year: i / 12, value: balance });
    }
    setTotal(balance);
    return arr;
  }, [capital, monthly, years, rate]);

  // formatage FR
  const fmt = (x: number) => Math.round(x).toLocaleString("fr-FR");

  return (
    <section aria-labelledby="simu-title" className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 id="simu-title" className="text-3xl md:text-4xl font-semibold mb-4">Simulateur d'intérêts composés</h2>
          <p className="text-gray-600 mb-6">
            Ajustez les paramètres et visualisez l'impact du temps et de la régularité de l'épargne.
          </p>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-600">Capital initial (€)</span>
              <input type="number" inputMode="numeric" className="w-full border border-gray-300 rounded-lg px-3 py-2"
                     value={capital} onChange={(e)=>setCapital(+e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Versement mensuel (€)</span>
              <input type="number" inputMode="numeric" className="w-full border border-gray-300 rounded-lg px-3 py-2"
                     value={monthly} onChange={(e)=>setMonthly(+e.target.value)} />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-600">Durée (années)</span>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2"
                       value={years} onChange={(e)=>setYears(+e.target.value)} />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Rendement annuel (%)</span>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2"
                       value={rate} onChange={(e)=>setRate(+e.target.value)} />
              </label>
            </div>
            <p className="text-gray-700 text-sm">
              Après <b>{years}</b> ans, votre capital estimé serait d'environ <b>{fmt(total)} €</b>.
            </p>
            <p className="text-xs text-gray-500">Hypothèse simplifiée et purement éducative (non-AMF).</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 h-72">
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="year" tickLine={false} axisLine={false}/>
              <YAxis hide domain={["auto","auto"]}/>
              <Tooltip formatter={(v)=>fmt(Number(v))} labelFormatter={(l)=>`${l} an(s)`}/>
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
