export const NEWS_SOURCES = [
  // FR
  { id: 'lesechos', name: 'Les Échos', lang: 'fr' as const, url: 'https://www.lesechos.fr/rss/finance-marches.xml', logo: '/sources/lesechos.png' },
  { id: 'boursorama', name: 'Boursorama', lang: 'fr' as const, url: 'https://www.boursorama.com/rss/flux/economie/', logo: '/sources/boursorama.png' },
  { id: 'zonebourse', name: 'ZoneBourse', lang: 'fr' as const, url: 'https://www.zonebourse.com/rss/flux_rss_analyses.xml', logo: '/sources/zonebourse.png' },
  { id: 'lemonde', name: 'Le Monde Éco', lang: 'fr' as const, url: 'https://www.lemonde.fr/economie/rss_full.xml', logo: '/sources/lemonde.png' },

  // EN
  { id: 'cnbc', name: 'CNBC', lang: 'en' as const, url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', logo: '/sources/cnbc.png' },
  { id: 'coindesk', name: 'CoinDesk', lang: 'en' as const, url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', logo: '/sources/coindesk.png' },
  { id: 'reuters', name: 'Reuters Finance', lang: 'en' as const, url: 'https://www.reuters.com/finance/rss', logo: '/sources/reuters.png' },
] as const;

