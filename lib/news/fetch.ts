import Parser from 'rss-parser';
import crypto from 'node:crypto';
import { NEWS_SOURCES } from './sources';
import { RawArticle, SourceCfg } from './utils';
import { canonicalUrl, cleanText, iso } from './normalize';

const parser = new Parser({ timeout: 5000 });

export async function fetchAllRSS(sources: SourceCfg[]): Promise<RawArticle[]> {
  const out: RawArticle[] = [];
  // Petite limite de concurrence : 4 flux en parallèle max
  const chunks = chunkArray(sources, 4);

  for (const group of chunks) {
    const results = await Promise.allSettled(group.map(async (src) => {
      const feed = await parser.parseURL(src.url);
      for (const item of feed.items || []) {
        const rawUrl = (item.link || '').trim();
        const url = canonicalUrl(rawUrl);
        if (!url) continue;
        const id = crypto.createHash('sha1').update(url).digest('hex');
        const title = (item.title || '').trim();
        if (!title) continue;
        const snippet = cleanText(item.contentSnippet || item.content || '');
        const publishedAt = iso(item.isoDate || item.pubDate || Date.now());
        const image = (item as any).enclosure?.url || null;

        out.push({
          id, url, title, snippet, publishedAt,
          sourceId: src.id, sourceName: src.name,
          langOriginal: src.lang, image, createdAt: iso(Date.now()),
        });
      }
    }));

    // Optionnel: log des erreurs par source
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.warn('RSS error on', group[i].name, r.reason?.message || r.reason);
      }
    });
  }
  return out;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i=0; i<arr.length; i+=size) res.push(arr.slice(i, i+size));
  return res;
}
