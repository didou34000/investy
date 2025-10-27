import { NextResponse } from "next/server";
import { resolveLogo } from "@/lib/logo";

export const revalidate = 300;

export async function GET(req: Request){
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q")||"").trim();
    if(!q) return NextResponse.json({ items: [] });

    const y = fetch(`https://autoc.finance.yahoo.com/autoc?query=${encodeURIComponent(q)}&region=EU&lang=fr`)
      .then(r=>r.json()).catch(()=>({ ResultSet:{ Result:[] } }));
    const c = fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`)
      .then(r=>r.json()).catch(()=>({ coins:[] }));

    const [yJ, cJ] = await Promise.all([y,c]);

    const yItems = (yJ?.ResultSet?.Result||[]).slice(0,6).map((it:any)=>{
      const category = it.typeDisp?.toLowerCase().includes("index") ? "index" : it.typeDisp?.toLowerCase().includes("etf") ? "etf" : "equity";
      const logo = resolveLogo({ symbol: it.symbol, category: category as any, coingeckoImage: null });
      return {
        source:"yahoo",
        symbol: it.symbol,
        label: `${it.name} (${it.symbol})`,
        category,
        image: logo
      };
    });

    const cItems = (cJ?.coins||[]).slice(0,6).map((it:any)=>({
      source:"coingecko",
      symbol: it.id,
      label: `${it.name} (${it.symbol.toUpperCase()})`,
      category: "crypto",
      image: it.thumb || null
    }));

    return NextResponse.json({ items: [...yItems, ...cItems].slice(0,10) });
  } catch (error) {
    console.error("Erreur recherche:", error);
    return NextResponse.json({ items: [] });
  }
}
