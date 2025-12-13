import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get("tickers");
  if (!tickers) {
    return NextResponse.json({}, { status: 200 });
  }
  const symbols = tickers.split(",").map((t) => t.trim()).filter(Boolean).join(",");
  if (!symbols) {
    return NextResponse.json({}, { status: 200 });
  }

  try {
    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;
    const res = await fetch(yahooUrl, { next: { revalidate: 60 } });
    if (!res.ok) {
      return NextResponse.json({}, { status: 200 });
    }
    const json = await res.json();
    const quotes: Record<string, { price: number | null; change: number | null; changePercent: number | null; currency: string | null }> = {};
    const results = json?.quoteResponse?.result || [];
    for (const r of results) {
      const ticker = r.symbol;
      quotes[ticker] = {
        price: r.regularMarketPrice ?? null,
        change: r.regularMarketChange ?? null,
        changePercent: r.regularMarketChangePercent ?? null,
        currency: r.currency ?? null,
      };
    }
    return NextResponse.json(quotes, { status: 200 });
  } catch (error) {
    console.error("Yahoo quotes error", error);
    return NextResponse.json({}, { status: 200 });
  }
}
