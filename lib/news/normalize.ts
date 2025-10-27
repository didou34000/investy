import { NewsItem, Lang } from "@/types/news";
import { tagContent } from "./tagger";

export interface RawItem {
  title: string;
  link: string;
  isoDate?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  enclosure?: { url?: string };
  ogImage?: string;
}

export function normalizeItem(
  raw: RawItem,
  sourceId: string,
  sourceName: string,
  lang: Lang
): NewsItem {
  const publishedAt = raw.isoDate || raw.pubDate || new Date().toISOString();
  const content = raw.contentSnippet || raw.content || "";
  const tags = tagContent(raw.title + " " + content);

  return {
    id: hashUrl(raw.link),
    sourceId,
    sourceName,
    url: cleanUrl(raw.link),
    title: raw.title,
    summary: "", // Sera enrichi par l'API
    bullets: [],
    contentSnippet: content.substring(0, 300),
    publishedAt,
    langOriginal: lang,
    image: raw.ogImage || raw.enclosure?.url,
    tags,
  };
}

function hashUrl(url: string): string {
  return Buffer.from(url).toString('base64').substring(0, 16);
}

function cleanUrl(url: string): string {
  try {
    const u = new URL(url);
    const params = new URLSearchParams(u.search);
    for (const key of params.keys()) {
      if (key.toLowerCase().includes("utm")) {
        params.delete(key);
      }
    }
    u.search = params.toString();
    return u.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

