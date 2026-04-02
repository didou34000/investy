// Redirected to Base44 — analyses are now stored in the Base44 database
// This file is kept for backward compatibility

export async function listAnalyses(params: any = {}) {
  try {
    const qs = new URLSearchParams();
    if (params.q) qs.set('q', params.q);
    if (params.tickers) qs.set('tickers', params.tickers);
    if (params.limit) qs.set('limit', String(params.limit));

    const res = await fetch(`/api/analyses?${qs.toString()}`);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('listAnalyses error:', e);
    return { items: [], total: 0 };
  }
}

export async function saveAnalysis(analysis: any) {
  console.warn('saveAnalysis: use Base44 API directly');
}

export async function loadAll() {
  return [];
}
