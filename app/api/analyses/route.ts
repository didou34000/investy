import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 0;

const BASE44_APP_ID = "69cea6fecb8cd04fd0b6ab59";
const BASE44_API = `https://app.base44.com/api/apps/${BASE44_APP_ID}`;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const tickers = searchParams.get('tickers') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    const res = await fetch(`${BASE44_API}/entities/Analysis`, {
      headers: { "api_key": process.env.BASE44_API_KEY || "" },
    });

    if (!res.ok) throw new Error(`Base44 error: ${res.status}`);

    let items = await res.json();
    if (!Array.isArray(items)) items = [];

    // Filtres
    items = items.filter((a: any) => a.is_published);
    if (tickers) items = items.filter((a: any) => a.asset_ticker === tickers);
    if (q) {
      const ql = q.toLowerCase();
      items = items.filter((a: any) =>
        a.title?.toLowerCase().includes(ql) ||
        a.asset?.toLowerCase().includes(ql) ||
        a.asset_ticker?.toLowerCase().includes(ql)
      );
    }

    return NextResponse.json({
      items: items.slice(0, limit),
      total: items.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Erreur récupération analyses:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des analyses', details: error.message },
      { status: 500 }
    );
  }
}
