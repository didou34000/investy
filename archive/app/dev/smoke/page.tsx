"use client";
import { useEffect, useState } from "react";

export default function Smoke(){
  const [res,setRes]=useState<any>(null);
  const [err,setErr]=useState<string|null>(null);

  useEffect(()=>{ (async ()=>{
    try{
      const h = await fetch("/api/health").then(r=>r.json());
      const s = await fetch("/api/search?q=apple").then(r=>r.json()).catch(()=>({items:[]}));
      setRes({ health:h, searchCount: s.items?.length||0 });
    }catch(e:any){ setErr(e?.message||"error"); }
  })(); },[]);

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Smoke test</h1>
      <p className="text-slate-600">Vérifie rapidement health + search.</p>
      {err && <div className="mt-3 text-rose-700">Erreur: {err}</div>}
      {res && (
        <div className="mt-4 space-y-2">
          <div className="border rounded-lg p-3 bg-white">
            <div className="text-sm">/api/health → <b>{String(res.health?.ok)}</b> (env: {res.health?.env})</div>
            <div className="text-xs text-slate-500">{res.health?.time}</div>
          </div>
          <div className="border rounded-lg p-3 bg-white">
            <div className="text-sm">/api/search?q=apple → items: <b>{res.searchCount}</b></div>
          </div>
        </div>
      )}
    </main>
  );
}


