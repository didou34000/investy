export const NEWS_SOURCES = [
  // FR
  { id: 'lesechos', name: 'Les Échos', lang: 'fr' as const, url: 'https://www.lesechos.fr/rss/finance-marches.xml', logo: '/sources/lesechos.png' },
  { id: 'boursorama', name: 'Boursorama', lang: 'fr' as const, url: 'https://www.boursorama.com/rss/flux/economie/', logo: '/sources/boursorama.png' },
  { id: 'zonebourse', name: 'ZoneBourse', lang: 'fr' as const, url: 'https://www.zonebourse.com/rss/flux_rss_analyses.xml', logo: '/sources/zonebourse.png' },
  { id: 'lemonde', name: 'Le Monde Éco', lang: 'fr' as const, url: 'https://www.lemonde.fr/economie/rss_full.xml', logo: '/sources/lemonde.png' },
  { id: 'bfmbusiness', name: 'BFM Business', lang: 'fr' as const, url: 'https://www.bfmtv.com/rss/economie/', logo: '/sources/bfm.png' },
  { id: 'investingfr', name: 'Investing.com FR', lang: 'fr' as const, url: 'https://fr.investing.com/rss/news_25.rss', logo: '/sources/investing.png' },

  // EN
  { id: 'cnbc', name: 'CNBC', lang: 'en' as const, url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', logo: '/sources/cnbc.png' },
  { id: 'coindesk', name: 'CoinDesk', lang: 'en' as const, url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', logo: '/sources/coindesk.png' },
  { id: 'reuters', name: 'Reuters Finance', lang: 'en' as const, url: 'https://www.reuters.com/finance/rss', logo: '/sources/reuters.png' },
  { id: 'bloomberg', name: 'Bloomberg Markets', lang: 'en' as const, url: 'https://feeds.bloomberg.com/markets/news.rss', logo: '/sources/bloomberg.png' },
  { id: 'wsj', name: 'WSJ Markets', lang: 'en' as const, url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', logo: '/sources/wsj.png' },
] as const;

