import { NextResponse } from "next/server";
import { fetchYahooBatch, fetchCoingecko } from "@/lib/marketLive";
import { resolveLogo } from "@/lib/logo";

export const revalidate = 30;

export async function POST(req:Request){
  try{
    const body = await req.json(); // { entries: [{symbol, category}] }
    const entries = Array.isArray(body?.entries) ? body.entries : [];
    const ySyms = entries.filter((e:any)=> e.category!=="crypto").map((e:any)=> e.symbol);
    const cIds  = entries.filter((e:any)=> e.category==="crypto").map((e:any)=> e.symbol);
    
    const [y, c] = await Promise.all([
      fetchYahooBatch(ySyms), 
      fetchCoingecko(cIds)
    ]);

    // Map pour ajouter `logo`
    const yQuotes = y.map(q => {
      const cat = (entries.find((e:any)=> e.symbol===q.symbol)?.category) || "equity";
      return { ...q, logo: resolveLogo({ symbol:q.symbol, category: cat as any, coingeckoImage: null }) };
    });

    const cQuotes = c.map(q => {
      // Ajout coingecko image si disponible
      return { ...q, logo: q.image || resolveLogo({ symbol:q.symbol, category: "crypto", coingeckoImage: q.image || null }) };
    });
    
    return NextResponse.json({ ok:true, quotes: [...yQuotes, ...cQuotes] });
  } catch(e:any){
    console.error("Erreur quotes batch:", e);
    return NextResponse.json({ ok:false, error: e?.message||"quotes_error" }, { status:500 });
  }
}
