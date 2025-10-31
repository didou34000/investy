"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type MarketItem = {
  key: string;
  label: string;
  price: number;
  changePct: number;
};

export default function MarketBrief(){
  const [data,setData]=useState<MarketItem[]>([]);

  useEffect(()=>{ (async()=>{
    const r = await fetch("/api/market",{cache:"no-store"}).then(r=>r.json()).catch(()=>({data:[]}));
    setData(r.data||[]);
  })(); },[]);

  return (
    <main className="min-h-screen bg-white py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-2">Daily Market Brief</h1>
        <p className="text-slate-600 mb-8">L’essentiel des marchés, chaque jour, en un clin d’œil 👇</p>

        <div className="grid md:grid-cols-2 gap-6">
          {data.slice(0,4).map((x)=>(
            <div key={x.key} className="bg-slate-50 border rounded-xl p-4 hover:shadow-sm transition-all">
              <div className="font-semibold mb-1">{x.label}</div>
              <div className={`text-sm ${x.changePct>=0?"text-emerald-600":"text-rose-600"}`}>
                {x.price} € ({x.changePct>0?"+":""}{Number(x.changePct||0).toFixed(2)}%)
              </div>
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={[{t:1,v:x.price*0.95},{t:2,v:x.price},{t:3,v:x.price*(1+(Number(x.changePct||0)/100))}]}> 
                  <Line type="monotone" dataKey="v" stroke={x.changePct>=0?"#10B981":"#EF4444"} strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">🌍 Tendances du jour</h2>
          <ul className="text-slate-700 space-y-1 text-sm">
            <li>📈 Les indices américains poursuivent leur hausse, portés par la tech.</li>
            <li>💶 L’euro se stabilise face au dollar autour de 1.08.</li>
            <li>🪙 Le bitcoin reste volatil après des prises de profit massives.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}


