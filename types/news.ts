export type Lang = 'fr' | 'en';
export type Period = 'today' | 'week' | 'month' | 'all';
export type Tag = 'actions'|'etf'|'crypto'|'obligations'|'macro'|'resultats'|'ia'|'energie'|'banques';

export interface NewsItem {
  id: string;                 // hash URL
  sourceId: string;           // 'cnbc' etc.
  sourceName: string;
  sourceLogo?: string;        // optional logo path for UI
  url: string;
  title: string;
  summary: string;            // FR
  bullets: string[];          // FR
  contentSnippet?: string;    // brut nettoyé (FR)
  publishedAt: string;        // ISO
  langOriginal: Lang;
  image?: string;             // OG/couverture
  tags: Tag[];
}

