import { NextResponse } from "next/server";
import { resolveLogo } from "@/lib/logo";

const SAMPLES = [
  { symbol:"AAPL", category:"equity" },
  { symbol:"MSFT", category:"equity" },
  { symbol:"SPGI", category:"equity" },
  { symbol:"S&P-500", category:"index" },
  { symbol:"MSCI-World", category:"etf" },
  { symbol:"BTC", category:"crypto" },
  { symbol:"ETH", category:"crypto" },
  { symbol:"SOL", category:"crypto" },
] as const;

async function headOk(url:string){
  try{
    const c = new AbortController();
    const t = setTimeout(()=>c.abort(), 4000);
    const r = await fetch(url, { method:"HEAD", signal:c.signal });
    clearTimeout(t);
    return r.ok;
  }catch{ return false; }
}

export async function GET(){
  const results = await Promise.all(SAMPLES.map(async s=>{
    const url = resolveLogo({ symbol:s.symbol, category: s.category as any });
    const ok = url.startsWith("http") ? await headOk(url) : true; // placeholders locaux => true
    return { ...s, url, ok };
  }));
  return NextResponse.json({ ok:true, results });
}
