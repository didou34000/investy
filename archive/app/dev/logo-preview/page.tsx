"use client";
import { useEffect, useState } from "react";
import AssetLogo from "@/components/ui/AssetLogo";

export default function LogoPreview(){
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dev/logo-test")
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const rows = data?.results || [];
  
  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold mb-3">Logo Preview</h1>
      <p className="text-slate-600 mb-4">Validation visuelle et réseau des sources Clearbit/CoinGecko + placeholders locaux.</p>
      
      {loading && <div className="text-slate-600">Chargement...</div>}
      
      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((r:any, i:number)=>(
            <div key={i} className="border rounded-xl p-3 bg-white">
              <div className="flex items-center gap-2">
                <AssetLogo src={r.url} label={r.symbol} size={28}/>
                <div className="font-medium">{r.symbol}</div>
                <span className="text-xs rounded px-2 py-0.5 border ml-auto">{r.category}</span>
              </div>
              <div className={`mt-2 text-xs ${r.ok? "text-emerald-700":"text-rose-700"}`}>
                {r.ok ? "Accessible" : "Non accessible"} — {r.url}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
