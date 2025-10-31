"use client";
import { useEffect, useState } from "react";

export default function RiskGauge({ score }:{ score:number }){
  const [val, setVal] = useState(0);
  useEffect(()=> {
    const t = setTimeout(()=> setVal(Math.max(0, Math.min(100, score))), 50);
    return ()=> clearTimeout(t);
  }, [score]);

  const color = val<60 ? "#22C55E" : val<80 ? "#F59E0B" : "#EF4444";

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4">
      <div className="text-sm text-slate-500">Score de risque</div>
      <div className="mt-1 text-xl font-semibold">{val}/100</div>
      <div className="mt-3 h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className="h-3 rounded-full transition-all" style={{ width: `${val}%`, background: color }} />
      </div>
      <div className="mt-2 text-xs text-slate-500">
        {val<60 ? "Stabilité prioritaire" : val<80 ? "Compromis risque/rendement" : "Volatilité acceptée"}
      </div>
    </div>
  );
}
