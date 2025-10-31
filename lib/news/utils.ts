export type Lang = 'fr' | 'en';

export interface SourceCfg {
  id: string;        // 'lesechos'
  name: string;      // 'Les Échos'
  lang: Lang;        // 'fr' ou 'en'
  url: string;       // RSS URL
  logo?: string;     // /sources/lesechos.png (optionnel)
}

export interface RawArticle {
  id: string;             // sha1(url canonique)
  url: string;            // URL canonique
  title: string;
  snippet: string;
  publishedAt: string;    // ISO
  sourceId: string;
  sourceName: string;
  langOriginal: Lang;
  image?: string | null;  // enclosure RSS (si dispo)
  createdAt: string;      // ISO (moment d'ingestion)
}
