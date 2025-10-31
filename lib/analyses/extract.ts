/**
 * Extraction déterministe de tickers et catégories depuis le texte
 */

// Patterns pour les tickers
const EQUITY_PATTERN = /\b[A-Z]{2,5}\b/g; // AAPL, NVDA, TSLA, etc.
const INDEX_PATTERN = /\^[A-Z]{2,5}\b/g; // ^GSPC, ^NDX, ^DJI
const CRYPTO_PATTERN = /\b(BTC|ETH|SOL|ADA|DOT|MATIC|AVAX|LINK|UNI|AAVE|CRV|COMP|MKR|SNX|YFI|SUSHI|1INCH|BAL|LRC|ZRX|BAT|ENJ|MANA|SAND|AXS|CHZ|FTT|LUNA|ATOM|NEAR|FTM|ALGO|VET|TRX|XRP|LTC|BCH|ETC|XLM|DASH|ZEC|DOGE|SHIB)\b/gi;

// ETF patterns (noms courants)
const ETF_PATTERNS = [
  /\b(SPY|QQQ|IWM|VTI|VEA|VWO|AGG|TLT|GLD|SLV|USO|UNG|XLF|XLK|XLE|XLV|XLI|XLY|XLP|XLU|XLB|XLRE|XLC|XLK|XLY|XLP|XLU|XLB|XLRE|XLC)\b/gi,
  /\b(Vanguard|iShares|SPDR|Invesco|ARK|Cathie Wood)\b/gi,
];

// Patterns pour les catégories
const CATEGORY_PATTERNS = {
  'actions': [/\b(actions?|stocks?|equities?|shares?|bourse|marché|trading|investissement)\b/gi],
  'etf': [/\b(ETF|fonds indiciels?|trackers?|index funds?)\b/gi],
  'crypto': [/\b(crypto|bitcoin|ethereum|blockchain|DeFi|NFT|altcoins?)\b/gi],
  'obligations': [/\b(obligations?|bonds?|dette|taux|yield|spread)\b/gi],
  'macro': [/\b(macro|économie|inflation|PIB|chômage|banque centrale|Fed|BCE|politique monétaire)\b/gi],
  'résultats': [/\b(résultats?|earnings?|bénéfices?|revenus?|guidance|forecast)\b/gi],
  'ia': [/\b(IA|intelligence artificielle|AI|machine learning|ChatGPT|OpenAI|NVIDIA|semiconductors?)\b/gi],
  'énergie': [/\b(énergie|pétrole|gaz|électricité|énergies? renouvelables?|solaire|éolien)\b/gi],
  'banques': [/\b(banques?|finance|crédit|prêts?|dépôts?|liquidité|capital)\b/gi],
};

/**
 * Extrait les tickers depuis un texte
 * @param text - Texte à analyser
 * @returns Liste des tickers détectés (en majuscules)
 */
export function extractTickers(text: string): string[] {
  if (!text) return [];
  
  const tickers = new Set<string>();
  
  // Actions (2-5 lettres majuscules)
  const equityMatches = text.match(EQUITY_PATTERN);
  if (equityMatches) {
    equityMatches.forEach(ticker => {
      if (ticker.length >= 2 && ticker.length <= 5) {
        tickers.add(ticker.toUpperCase());
      }
    });
  }
  
  // Indices (^GSPC, ^NDX, etc.)
  const indexMatches = text.match(INDEX_PATTERN);
  if (indexMatches) {
    indexMatches.forEach(ticker => {
      tickers.add(ticker.toUpperCase());
    });
  }
  
  // Crypto
  const cryptoMatches = text.match(CRYPTO_PATTERN);
  if (cryptoMatches) {
    cryptoMatches.forEach(ticker => {
      tickers.add(ticker.toUpperCase());
    });
  }
  
  // ETF
  ETF_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(ticker => {
        tickers.add(ticker.toUpperCase());
      });
    }
  });
  
  return Array.from(tickers);
}

/**
 * Infère les catégories depuis un texte
 * @param text - Texte à analyser
 * @returns Liste des catégories détectées
 */
export function inferCategories(text: string): string[] {
  if (!text) return [];
  
  const categories = new Set<string>();
  
  Object.entries(CATEGORY_PATTERNS).forEach(([category, patterns]) => {
    patterns.forEach(pattern => {
      if (pattern.test(text)) {
        categories.add(category);
      }
    });
  });
  
  return Array.from(categories);
}

/**
 * Nettoie et normalise un texte pour l'analyse
 * @param text - Texte à nettoyer
 * @returns Texte nettoyé
 */
export function cleanTextForAnalysis(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/<[^>]+>/g, ' ') // Supprime HTML
    .replace(/\s+/g, ' ') // Normalise espaces
    .replace(/[^\w\s.,!?%$€£¥-]/g, ' ') // Garde caractères utiles
    .trim();
}

/**
 * Extrait les métadonnées d'un article pour l'analyse LLM
 * @param article - Article brut
 * @returns Données structurées pour l'analyse
 */
export function extractArticleMetadata(article: {
  title: string;
  snippet: string;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
}): {
  detectedTickers: string[];
  categoryHints: string[];
  cleanedTitle: string;
  cleanedSnippet: string;
} {
  const fullText = `${article.title} ${article.snippet}`;
  
  return {
    detectedTickers: extractTickers(fullText),
    categoryHints: inferCategories(fullText),
    cleanedTitle: cleanTextForAnalysis(article.title),
    cleanedSnippet: cleanTextForAnalysis(article.snippet),
  };
}
