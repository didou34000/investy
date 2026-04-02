import { NextResponse } from "next/server";
import { parseRss, stripHtml } from "@/lib/rss";
import { NEWS_SOURCES } from "@/lib/news/sources";
import { normalizeItem } from "@/lib/news/normalize";
import { translateToFrench } from "@/lib/translator";
import type { NewsItem } from "@/types/news";

export const dynamic = "force-dynamic";
export const revalidate = 900;

// Base44 config
const BASE44_APP_ID = "69cea6fecb8cd04fd0b6ab59";
const BASE44_API = `https://api.base44.com/api/apps/${BASE44_APP_ID}`;

async function getBase44Headers() {
  return {
    "Content-Type": "application/json",
    "x-api-key": process.env.BASE44_API_KEY || "",
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const period = (url.searchParams.get("period") || "all") as string;
  const search = url.searchParams.get("q") || "";
  const sources = url.searchParams.get("sources")?.split(",") || [];
  const tags = url.searchParams.get("tags")?.split(",") || [];

  // Essayer de récupérer depuis Base44
  try {
    const headers = await getBase44Headers();
    const res = await fetch(`${BASE44_API}/entities/Article/list`, {
      method: "POST",
      headers,
      body: JSON.stringify({ filter: { is_published: true }, limit: 50 }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const items: NewsItem[] = data.items.map((a: any) => ({
          id: a.id,
          title: a.title,
          contentSnippet: a.summary,
          url: a.source_url,
          publishedAt: a.published_at || a.created_date,
          source: a.source,
          imageUrl: a.image_url,
          tags: a.tags || [],
          lang: "fr",
        }));
        return NextResponse.json({ items, fetchedAt: new Date().toISOString(), total: items.length });
      }
    }
  } catch (e) {
    console.error("Base44 fetch failed, falling back to RSS", e);
  }

  // Fallback RSS
  const allItems: NewsItem[] = [];
  const seenUrls = new Set<string>();

  for (const source of NEWS_SOURCES) {
    if (sources.length > 0 && !sources.includes(source.id)) continue;
    try {
      const response = await fetch(source.url, {
        headers: { "User-Agent": "InvstyBot/0.1" },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) continue;
      const xmlText = await response.text();
      const items = parseRss(xmlText);
      for (const item of items) {
        let title = item.title;
        let description = item.description;
        if (source.lang === "en") {
          title = await translateToFrench(title);
          if (description) {
            try { description = await translateToFrench(description); } catch {}
          }
        }
        const normalized = normalizeItem(
          { title, link: item.link, pubDate: item.pubDate, contentSnippet: description, ogImage: item.image },
          source.id, source.name, source.lang, source.logo
        );
        if (seenUrls.has(normalized.url)) continue;
        seenUrls.add(normalized.url);
        if (tags.length > 0 && !tags.some(t => normalized.tags.includes(t as any))) continue;
        if (search) {
          const s = search.toLowerCase();
          if (!normalized.title.toLowerCase().includes(s) && !normalized.contentSnippet?.toLowerCase().includes(s)) continue;
        }
        allItems.push(normalized);
      }
    } catch (error) {
      console.error(`Feed ${source.name} failed:`, error);
    }
  }

  const now = new Date();
  const filteredItems = allItems.filter(item => {
    const itemDate = new Date(item.publishedAt);
    switch (period) {
      case "today": return itemDate.toDateString() === now.toDateString();
      case "week": return itemDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "month": return itemDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default: return true;
    }
  });

  filteredItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return NextResponse.json({
    items: filteredItems.slice(0, 50),
    fetchedAt: new Date().toISOString(),
    total: filteredItems.length,
  }, { headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=1200" } });
}
