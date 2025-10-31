import { SourceCfg } from './utils';

export const NEWS_SOURCES: SourceCfg[] = [
  // FR
  { id:'lesechos',   name:'Les Échos',        lang:'fr', url:'https://www.lesechos.fr/rss/finance-marches.xml' },
  { id:'boursorama', name:'Boursorama',       lang:'fr', url:'https://www.boursorama.com/rss/flux/economie/' },
  { id:'zonebourse', name:'ZoneBourse',       lang:'fr', url:'https://www.zonebourse.com/rss/flux_rss_analyses.xml' },
  { id:'lemonde',    name:'Le Monde Éco',     lang:'fr', url:'https://www.lemonde.fr/economie/rss_full.xml' },
  { id:'bfmeco',     name:'BFM Économie',     lang:'fr', url:'https://rmc.bfmtv.com/rss/economie/' },
  // EN
  { id:'cnbc',       name:'CNBC',             lang:'en', url:'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
  { id:'coindesk',   name:'CoinDesk',         lang:'en', url:'https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { id:'ft',         name:'Financial Times',  lang:'en', url:'https://www.ft.com/companies?format=rss' },
  { id:'wsj',        name:'WSJ Markets',      lang:'en', url:'https://feeds.a.dj.com/rss/RSSMarketsMain.xml' },
];