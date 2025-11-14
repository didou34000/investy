import { cache } from "react";

const DOMAIN_MAP: Record<string, string> = {
  // Tech / Mega caps
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  TSLA: "tesla.com",
  NVDA: "nvidia.com",
  AMZN: "amazon.com",
  META: "about.facebook.com",
  GOOG: "abc.xyz",
  GOOGL: "abc.xyz",
  SPGI: "spglobal.com",
  NFLX: "netflix.com",
  ADBE: "adobe.com",
  CRM: "salesforce.com",
  ORCL: "oracle.com",
  INTC: "intel.com",
  AMD: "amd.com",
  QCOM: "qualcomm.com",
  AVGO: "broadcom.com",
  CSCO: "cisco.com",
  IBM: "ibm.com",
  V: "visa.com",
  MA: "mastercard.com",
  PYPL: "paypal.com",
  UBER: "uber.com",
  ABNB: "airbnb.com",
  ZM: "zoom.us",
  DOCU: "docusign.com",
  SNOW: "snowflake.com",
  PLTR: "palantir.com",
  ROKU: "roku.com",
  SPOT: "spotify.com",
  SNAP: "snapchat.com",
  PINS: "pinterest.com",
  SHOP: "shopify.com",
  WMT: "walmart.com",
  HD: "homedepot.com",
  LOW: "lowes.com",
  TGT: "target.com",
  COST: "costco.com",
  SBUX: "starbucks.com",
  MCD: "mcdonalds.com",
  KO: "coca-cola.com",
  PEP: "pepsi.com",
  PG: "pg.com",
  JNJ: "jnj.com",
  PFE: "pfizer.com",
  MRK: "merck.com",
  ABBV: "abbvie.com",
  LLY: "lilly.com",
  UNH: "unitedhealthgroup.com",
  CVS: "cvshealth.com",
  WBA: "walgreens.com",
  JPM: "jpmorganchase.com",
  BAC: "bankofamerica.com",
  WFC: "wellsfargo.com",
  GS: "goldmansachs.com",
  MS: "morganstanley.com",
  C: "citigroup.com",
  AXP: "americanexpress.com",
  VZ: "verizon.com",
  T: "att.com",
  TMUS: "t-mobile.com",
  DIS: "thewaltdisneycompany.com",
  CMCSA: "comcast.com",
  CHTR: "charter.com",
  LVMH: "lvmh.com",
  ASML: "asml.com",
  LOREAL: "loreal.com",
  OR: "loreal.com",
  MC: "lvmh.com",
  "MC.PA": "lvmh.com",
  "ASML.AS": "asml.com",
  "OR.PA": "loreal.com",

  // ETF / Index émetteurs
  SPY: "ssga.com",        // SPDR
  VOO: "vanguard.com",
  VTI: "vanguard.com",
  VEA: "vanguard.com",
  VWO: "vanguard.com",
  BND: "vanguard.com",
  TLT: "ishares.com",
  GLD: "ssga.com",
  SLV: "ssga.com",
  IWDA: "ishares.com",
  EUNA: "ishares.com",
  "MSCI-World": "msci.com",
  "MSCI-EM": "msci.com",
  "NASDAQ-100": "nasdaq.com",
  "S&P-500": "spglobal.com",
  "^GSPC": "spglobal.com",
  "^FCHI": "euronext.com",
  "^IXIC": "nasdaq.com",
  "^DJI": "dowjones.com",
  "^VIX": "cboe.com",
  "Euro-Gov": "ishares.com",
  "Corporate-EU": "ishares.com",
  "ASIA": "ishares.com",
  "ICLN": "ishares.com",
  "ENPH": "enphase.com",
  "VWCE": "vanguard.com",
  "VWCE.DE": "vanguard.com",
  "QQQ": "invesco.com",
};

// Mapping ticker → id CoinGecko (principaux)
const CG_ID: Record<string, string> = {
  BTC: "bitcoin",
  XBT: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  ADA: "cardano",
  XRP: "ripple",
  AVAX: "avalanche-2",
  MATIC: "polygon",
};

    // URLs CoinGecko directes pour les principales cryptos
    const CG_URLS: Record<string, string> = {
      BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      bitcoin: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      ethereum: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      solana: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      ADA: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      cardano: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      XRP: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      ripple: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      AVAX: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
      avalanche: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
      MATIC: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
      polygon: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    };

const LOCAL = {
  default: "/assets/placeholders/default.svg",
  etf: "/assets/placeholders/etf.svg",
  bond: "/assets/placeholders/bond.svg",
  fx: "/assets/placeholders/fx.svg",
};

function clearbit(domain: string) {
  return `https://logo.clearbit.com/${domain}`;
}

/**
 * Retourne une URL de logo exploitable (ou un placeholder local) selon la catégorie.
 * - Crypto: privilégie l'URL complète coingeckoImage si fournie, sinon reconstruit via l'id connu.
 * - Equities/ETF/Index: Clearbit avec domain mapping; sinon placeholder cohérent.
 */
export const resolveLogo = cache((
  { symbol, category, coingeckoImage }:
  { symbol: string; category: "equity"|"etf"|"index"|"crypto"|"bond"|"fx"; coingeckoImage?: string|null }
): string => {
  if (category === "crypto") {
    if (coingeckoImage && coingeckoImage.startsWith("http")) return coingeckoImage;
    // Essayer d'abord avec le symbole tel quel
    const directUrl = CG_URLS[symbol];
    if (directUrl) return directUrl;
    // Puis avec le symbole en majuscules
    const directUrlUpper = CG_URLS[symbol?.toUpperCase()];
    if (directUrlUpper) return directUrlUpper;
    return LOCAL.default;
  }

  const dom = DOMAIN_MAP[symbol?.toUpperCase()];
  if (dom) return clearbit(dom);

  if (category === "etf") return LOCAL.etf;
  if (category === "index") return LOCAL.etf;
  if (category === "bond") return LOCAL.bond;
  if (category === "fx") return LOCAL.fx;

  return LOCAL.default;
});