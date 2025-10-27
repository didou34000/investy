import { NextResponse } from "next/server";
import { parseRss, stripHtml, cleanUrl, hash256 } from "@/lib/rss";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 minutes

const FEEDS = [
  { url: "https://www.reuters.com/finance/rss", source: "Reuters" },
  { url: "https://www.cnbc.com/id/100003114/device/rss/rss.html", source: "CNBC" },
  { url: "https://www.lesechos.fr/rss/rss_finance-marches.xml", source: "Les Échos" },
  { url: "https://www.coindesk.com/arc/outboundfeeds/rss/", source: "CoinDesk" },
  { url: "https://www.federalreserve.gov/feeds/press_all.xml", source: "Fed" },
  { url: "https://www.ecb.europa.eu/press/pressconf/htm/index.en.html?format=rss", source: "BCE" },
];

type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  hash: string;
};

export async function GET() {
  const allItems: NewsItem[] = [];

  for (const feed of FEEDS) {
    try {
      const response = await fetch(feed.url, {
        headers: {
          "User-Agent": "InvestyBot/0.1",
        },
      });

      if (!response.ok) continue;

      const xmlText = await response.text();
      const items = parseRss(xmlText);

      for (const item of items) {
        const url = cleanUrl(item.link);
        const hash = await hash256(url + item.title);

        // Déduplication
        if (allItems.find(i => i.hash === hash)) continue;

        allItems.push({
          id: hash.substring(0, 16),
          title: stripHtml(item.title),
          url,
          source: feed.source,
          summary: stripHtml(item.description).substring(0, 200),
          publishedAt: item.pubDate,
          hash,
        });
      }
    } catch (error) {
      console.error(`Feed ${feed.source} failed:`, error);
      // Continue avec les autres feeds
      continue;
    }
  }

  // Trier par date (plus récent en premier)
  allItems.sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return isNaN(dateB) ? -1 : (isNaN(dateA) ? 1 : dateB - dateA);
  });

  // Limiter à 50 items
  const limitedItems = allItems.slice(0, 50);

  return NextResponse.json({
    items: limitedItems,
    fetchedAt: new Date().toISOString(),
  }, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}

