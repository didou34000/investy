import yahooFinance from "yahoo-finance2";

export type Quote = { 
  symbol:string; 
  price:number|null; 
  change1dPct:number|null; 
  change5dPct:number|null; 
  history?: { t:string; p:number }[]; 
  source:"yahoo"|"coingecko"; 
  image?: string|null;
};

async function chartPct(sym:string){
  try {
    const ch:any = await yahooFinance.chart(sym, { range:"5d", interval:"1d" });
    const q = ch?.quotes ?? [];
    if(q.length<2) return { d1:null, d5:null, hist:[] as {t:string;p:number}[] };
    
    const last = q[q.length-1]?.close;
    const prev = q[q.length-2]?.close;
    const first = q[0]?.close;
    
    const d1 = (last!=null && prev!=null) ? ((last-prev)/prev)*100 : null;
    const d5 = (last!=null && first!=null) ? ((last-first)/first)*100 : null;
    const hist = q.map((row:any)=>({ 
      t: new Date(row.date).toISOString().slice(0,10), 
      p: row.close 
    }));
    
    return { d1, d5, hist };
  } catch (error) {
    console.error(`Erreur chartPct pour ${sym}:`, error);
    return { d1:null, d5:null, hist:[] as {t:string;p:number}[] };
  }
}

export async function fetchYahooBatch(symbols:string[]): Promise<Quote[]>{
  if(!symbols.length) return [];
  
  try {
    const quotes:any[] = await yahooFinance.quote(symbols);
    const out: Quote[] = [];
    
    for(const s of symbols){
      const meta = quotes.find((x:any)=>x.symbol===s) ?? {};
      const { d1, d5, hist } = await chartPct(s);
      
      out.push({
        symbol: s,
        price: meta.regularMarketPrice ?? null,
        change1dPct: d1,
        change5dPct: d5,
        history: hist,
        source: "yahoo",
        image: null
      });
    }
    
    return out;
  } catch (error) {
    console.error("Erreur fetchYahooBatch:", error);
    return symbols.map(s => ({
      symbol: s,
      price: null,
      change1dPct: null,
      change5dPct: null,
      history: [],
      source: "yahoo" as const,
      image: null
    }));
  }
}

// CoinGecko: ids ex "bitcoin","ethereum","solana"
export async function fetchCoingecko(ids:string[]): Promise<Quote[]>{
  if(!ids.length) return [];
  
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(",")}&price_change_percentage=24h,7d`;
    const r = await fetch(url, { next:{ revalidate: 60 }});
    
    if(!r.ok) throw new Error(`CoinGecko API error: ${r.status}`);
    
    const j:any[] = await r.json();
    return j.map((it:any)=>({
      symbol: it.id,
      price: it.current_price ?? null,
      change1dPct: it.price_change_percentage_24h ?? null,
      change5dPct: it.price_change_percentage_7d_in_currency ?? null,
      history: [], // (optionnel: autre endpoint pour sparkline 7d)
      source: "coingecko" as const,
      image: it.image || null
    }));
  } catch (error) {
    console.error("Erreur fetchCoingecko:", error);
    return ids.map(id => ({
      symbol: id,
      price: null,
      change1dPct: null,
      change5dPct: null,
      history: [],
      source: "coingecko" as const,
      image: null
    }));
  }
}
