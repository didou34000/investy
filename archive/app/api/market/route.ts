import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { resolveLogo } from "@/lib/logo";

type Quote = {
  symbol: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: number;
};

const MAP: Record<string, { label: string; symbol: string; dp?: number; convertToEur?: boolean; url?: string }> = {
  // Indices
  CAC40:   { label: "CAC 40",  symbol: "^FCHI",    dp: 0, url: "https://finance.yahoo.com/quote/%5EFCHI" },
  SP500:   { label: "S&P 500", symbol: "^GSPC",    dp: 0, convertToEur: true, url: "https://finance.yahoo.com/quote/%5EGSPC" },
  NASDAQ:  { label: "NASDAQ",  symbol: "^IXIC",    dp: 0, convertToEur: true, url: "https://finance.yahoo.com/quote/%5EIXIC" },
  
  // Devises
  EURUSD:  { label: "EUR/USD", symbol: "EURUSD=X", dp: 4, url: "https://finance.yahoo.com/quote/EURUSD%3DX" },
  
  // Crypto
  BTCUSD:  { label: "BTC",     symbol: "BTC-USD",  dp: 0, convertToEur: true, url: "https://finance.yahoo.com/quote/BTC-USD" },
  SOLUSD:  { label: "SOL",     symbol: "SOL-USD",  dp: 0, convertToEur: true, url: "https://finance.yahoo.com/quote/SOL-USD" },
  ETHUSD:  { label: "ETH",     symbol: "ETH-USD",  dp: 0, convertToEur: true, url: "https://finance.yahoo.com/quote/ETH-USD" },
  
  // Actions françaises
  LVMH:    { label: "LVMH",    symbol: "MC.PA",    dp: 2, url: "https://finance.yahoo.com/quote/MC.PA" },
  ASML:    { label: "ASML",    symbol: "ASML.AS",  dp: 2, convertToEur: true, url: "https://finance.yahoo.com/quote/ASML.AS" },
  LOREAL:  { label: "L'Oréal", symbol: "OR.PA",    dp: 2, url: "https://finance.yahoo.com/quote/OR.PA" },
  
  // Actions américaines
  AAPL:    { label: "Apple",   symbol: "AAPL",     dp: 2, convertToEur: true, url: "https://finance.yahoo.com/quote/AAPL" },
  MSFT:    { label: "Microsoft", symbol: "MSFT",   dp: 2, convertToEur: true, url: "https://finance.yahoo.com/quote/MSFT" },
  GOOGL:   { label: "Google",  symbol: "GOOGL",    dp: 2, convertToEur: true, url: "https://finance.yahoo.com/quote/GOOGL" },
  TSLA:    { label: "Tesla",   symbol: "TSLA",     dp: 2, convertToEur: true, url: "https://finance.yahoo.com/quote/TSLA" },
  
  // ETF populaires
  VWCE:    { label: "VWCE",    symbol: "VWCE.DE",  dp: 2, url: "https://finance.yahoo.com/quote/VWCE.DE" },
  SPY:     { label: "SPY",     symbol: "SPY",       dp: 2, convertToEur: true, url: "https://finance.yahoo.com/quote/SPY" },
  QQQ:     { label: "QQQ",     symbol: "QQQ",       dp: 2, convertToEur: true, url: "https://finance.yahoo.com/quote/QQQ" },
};

export const revalidate = 0; // Pas de cache pour debug

export async function GET() {
  try {
    const symbols = Object.values(MAP).map(m => m.symbol);
    const quotes = (await yahooFinance.quote(symbols)) as Quote[]; // renvoie tableau

    const bySymbol = new Map(quotes.map(q => [q.symbol, q]));
    
    // Récupérer le taux EUR/USD pour les conversions
    const eurUsdQuote = bySymbol.get("EURUSD=X");
    const eurUsdRate = eurUsdQuote?.regularMarketPrice ?? 1.0;
    
    const payload = Object.entries(MAP).map(([key, meta]) => {
      const q = bySymbol.get(meta.symbol) || {};
      let price = q.regularMarketPrice ?? null;
      
      // Convertir en euros si nécessaire
      if (price && meta.convertToEur && key !== "EURUSD") {
        price = price / eurUsdRate;
      }
      
      const changePct = q.regularMarketChangePercent ?? null;
      const ts = q.regularMarketTime ? new Date(q.regularMarketTime * 1000).toISOString() : null;

      // Déterminer la catégorie pour le logo
      const category = key.includes("BTC") || key.includes("SOL") || key.includes("ETH") ? "crypto" :
                     key.includes("SPY") || key.includes("QQQ") || key.includes("VWCE") ? "etf" :
                     key.includes("CAC") || key.includes("SP500") || key.includes("NASDAQ") ? "index" :
                     key.includes("EURUSD") ? "fx" : "equity";

      // Mapper les symboles Yahoo vers les symboles CoinGecko pour les cryptos
      let logoSymbol = meta.symbol;
      if (category === "crypto") {
        if (meta.symbol === "BTC-USD") logoSymbol = "bitcoin";
        else if (meta.symbol === "ETH-USD") logoSymbol = "ethereum";
        else if (meta.symbol === "SOL-USD") logoSymbol = "solana";
      }

      return {
        key,
        label: meta.label,
        symbol: meta.symbol,
        dp: meta.dp ?? 0,
        price,
        changePct,
        updatedAt: ts,
        isEur: meta.convertToEur || key === "CAC40",
        url: meta.url,
        logo: resolveLogo({ 
          symbol: logoSymbol, 
          category: category as any, 
          coingeckoImage: null 
        }),
      };
    });

    return NextResponse.json({ ok: true, data: payload }, { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "fetch_error" }, { status: 500 });
  }
}
