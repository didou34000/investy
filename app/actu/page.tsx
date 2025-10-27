"use client";

import { useState, useEffect } from "react";
import { Search, ExternalLink } from "lucide-react";
import { formatRelativeFR } from "@/lib/date";
import type { NewsItem, Period } from "@/types/news";

export default function ActuPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("all");
  const [search, setSearch] = useState("");
  const [displayCount, setDisplayCount] = useState(20);

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
      } catch (e) {
        setError("Impossible de charger les actualités");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [period, search]);

  const displayedItems = items.slice(0, displayCount);

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Actu marché</h1>
          <p className="text-slate-600">Flux agrégés • MAJ toutes les 15 min</p>
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
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-slate-600">
          {items.length} article{items.length > 1 ? "s" : ""}
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

        {/* News list */}
        {!loading && !error && displayedItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-slate-600">Aucun résultat trouvé</p>
          </div>
        )}

        {!loading && !error && displayedItems.length > 0 && (
          <>
            <div className="space-y-4">
              {displayedItems.map(item => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl shadow p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-slate-900 mb-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors"
                        >
                          {item.title}
                        </a>
                      </h2>

                      <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-slate-600">
                        <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                          {item.sourceName}
                        </span>
                        <span>•</span>
                        <time>{formatRelativeFR(item.publishedAt)}</time>
                        {item.langOriginal === 'en' && (
                          <>
                            <span>•</span>
                            <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-xs">EN</span>
                          </>
                        )}
                        {item.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1 flex-wrap">
                              {item.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {item.contentSnippet && (
                        <p className="text-slate-600 line-clamp-2">{item.contentSnippet}</p>
                      )}
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      aria-label="Ouvrir l'article"
                    >
                      <ExternalLink className="w-5 h-5 text-slate-400" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Load more */}
            {displayedItems.length < items.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setDisplayCount(prev => prev + 20)}
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
                >
                  Charger {Math.min(20, items.length - displayedItems.length)} de plus
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
