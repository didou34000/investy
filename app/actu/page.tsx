"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { formatRelativeFR } from "@/lib/date";
import type { NewsItem, Period } from "@/types/news";
import ArticleModal from "@/components/ArticleModal";
import MarketStrip from "@/components/MarketStrip";

export default function ActuPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("all");
  const [search, setSearch] = useState("");
  const [displayCount, setDisplayCount] = useState(20);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date"|"source">("date");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("period", period);
        if (search) params.set("q", search);

        const res = await fetch(`/api/actu?${params}`);
        if (!res.ok) throw new Error("Erreur de récupération");
        const data = await res.json();
        setItems(data.items || []);
        setFetchedAt(data.fetchedAt || null);
      } catch (e) {
        setError("Impossible de charger les actualités");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [period, search]);

  const filtered = useMemo(() => {
    let x = [...items];
    if (tagFilter) x = x.filter(i => i.tags.includes(tagFilter as any));
    if (sourceFilter) x = x.filter(i => i.sourceId === sourceFilter);
    if (sortBy === "source") x.sort((a,b) => a.sourceName.localeCompare(b.sourceName));
    return x;
  }, [items, tagFilter, sourceFilter, sortBy]);

  const displayedItems = filtered.slice(0, displayCount);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200">
        <div className="container mx-auto max-w-7xl px-4 py-2">
          <MarketStrip />
        </div>
      </div>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Actualités du marché</h1>
          <p className="text-slate-600">Flux multi-sources • traduction automatique • sans récap global</p>
          {fetchedAt && (
            <div className="text-xs text-slate-500 mt-1">Mis à jour : {new Date(fetchedAt).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}</div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Period selector */}
          <div className="flex gap-2 bg-white p-1 rounded-full shadow-sm border border-slate-200">
            {(["today", "week", "month", "all"] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  setDisplayCount(20);
                }}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  period === p
                    ? "bg-black text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {p === "today" && "Aujourd'hui"}
                {p === "week" && "Semaine"}
                {p === "month" && "Mois"}
                {p === "all" && "Tout"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setDisplayCount(20);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="flex flex-wrap gap-2">
              {[{k:'actions',l:'Actions'},{k:'crypto',l:'Crypto'},{k:'etf',l:'ETF'},{k:'obligations',l:'Obligations'},{k:'macro',l:'Macro'},{k:'resultats',l:'Résultats'}].map(t => (
                <button key={t.k} onClick={() => { setTagFilter(tagFilter===t.k?null:t.k); setDisplayCount(20); }} className={`px-3 py-1.5 rounded-full text-sm border ${tagFilter===t.k? 'bg-blue-600 text-white border-blue-600':'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}>{t.l}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <select className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm" value={sourceFilter||""} onChange={e=>{ setSourceFilter(e.target.value||null); setDisplayCount(20); }}>
                <option value="">Toutes sources</option>
                {Array.from(new Set(items.map(i=>JSON.stringify({id:i.sourceId,name:i.sourceName})))).map(s=>JSON.parse(s)).map(s=> (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <select className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm" value={sortBy} onChange={e=> setSortBy(e.target.value as any)}>
                <option value="date">Trier: plus récent</option>
                <option value="source">Trier: source</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-slate-600">
          {filtered.length} article{filtered.length > 1 ? "s" : ""}
        </div>

        {/* Loading */}
        {loading && (
          <div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow p-4 mb-4 h-32 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* News list - Masonry */}
        {!loading && !error && displayedItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-slate-600">Aucun résultat trouvé</p>
          </div>
        )}

        {!loading && !error && displayedItems.length > 0 && (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance] before:box-inherit after:box-inherit">
              {displayedItems.map(item => (
                <article
                  key={item.id}
                  className="mb-4 break-inside-avoid bg-white rounded-2xl shadow hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedArticle(item)}
                >
                  {item.image && (
                    <div className="rounded-t-2xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-auto object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {item.sourceLogo && (
                        <img src={item.sourceLogo} alt={item.sourceName} className="w-5 h-5 rounded-sm" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none';}}/>
                      )}
                      <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                        {item.sourceName}
                      </span>
                      <span className="text-slate-400">•</span>
                      <time className="text-xs text-slate-600">{formatRelativeFR(item.publishedAt)}</time>
                    </div>
                    <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                      {item.title}
                    </h2>
                    {item.contentSnippet && (
                      <p className="text-slate-600 text-sm line-clamp-3">{item.contentSnippet}</p>
                    )}
                    {item.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-3">
                        {item.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Load more */}
            {displayedItems.length < filtered.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setDisplayCount(prev => prev + 20)}
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
                >
                  Charger {Math.min(20, filtered.length - displayedItems.length)} de plus
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={selectedArticle !== null}
        onClose={() => setSelectedArticle(null)}
      />
    </main>
  );
}
