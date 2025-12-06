import { NextResponse } from "next/server";
import { parseRss, stripHtml } from "@/lib/rss";
import { NEWS_SOURCES } from "@/lib/news/sources";
import { normalizeItem } from "@/lib/news/normalize";
import { translateToFrench } from "@/lib/translator";
import type { NewsItem } from "@/types/news";

export const dynamic = "force-dynamic";
export const revalidate = 900; // 15 minutes

export async function GET(request: Request) {
  const url = new URL(request.url);
  const period = (url.searchParams.get("period") || "all") as string;
  const search = url.searchParams.get("q") || "";
  const sources = url.searchParams.get("sources")?.split(",") || [];
  const tags = url.searchParams.get("tags")?.split(",") || [];

  const allItems: NewsItem[] = [];
  const seenUrls = new Set<string>();

  for (const source of NEWS_SOURCES) {
    // Filtre par source si demandé
    if (sources.length > 0 && !sources.includes(source.id)) continue;

    try {
      const response = await fetch(source.url, {
        headers: {
          "User-Agent": "InvstyBot/0.1",
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) continue;

      const xmlText = await response.text();
      const items = parseRss(xmlText);

      for (const item of items) {
        let title = item.title;
        let description = item.description;

        // Traduction automatique EN -> FR
        if (source.lang === 'en') {
          title = await translateToFrench(title);
          if (description) {
            try { description = await translateToFrench(description); } catch {}
          }
        }

        const normalized = normalizeItem(
          {
            title,
            link: item.link,
            pubDate: item.pubDate,
            contentSnippet: description,
            ogImage: item.image,
          },
          source.id,
          source.name,
          source.lang,
          source.logo
        );

        // Déduplication
        if (seenUrls.has(normalized.url)) continue;
        seenUrls.add(normalized.url);

        // Filtre par tags
        if (tags.length > 0 && !tags.some(t => normalized.tags.includes(t as any))) continue;

        // Filtre par recherche
        if (search) {
          const searchLower = search.toLowerCase();
          if (!normalized.title.toLowerCase().includes(searchLower) &&
              !normalized.contentSnippet?.toLowerCase().includes(searchLower)) {
            continue;
          }
        }

        allItems.push(normalized);
      }
    } catch (error) {
      console.error(`Feed ${source.name} failed:`, error);
      continue;
    }
  }

  // Filtre par période
  const now = new Date();
  const filteredItems = allItems.filter(item => {
    const itemDate = new Date(item.publishedAt);
    switch (period) {
      case "today":
        return itemDate.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return itemDate >= monthAgo;
      default:
        return true;
    }
  });

  // Trier par date (plus récent en premier)
  filteredItems.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Limiter à 50 items
  const limitedItems = filteredItems.slice(0, 50);

  return NextResponse.json({
    items: limitedItems,
    fetchedAt: new Date().toISOString(),
    total: filteredItems.length,
  }, {
    headers: {
      "Cache-Control": "s-maxage=900, stale-while-revalidate=1200",
    },
  });
}

