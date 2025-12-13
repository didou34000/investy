export type AssetType = "etf" | "action" | "crypto";
export type RiskBucket =
  | "ultra_prudent"
  | "prudent"
  | "modere"
  | "equilibre"
  | "dynamique"
  | "agressif"
  | "speculatif";

export type AssetItem = {
  id: string;
  type: AssetType;
  ticker: string;
  name: string;
  category: string; // coeur, obligataire, satellite, growth, etc.
  riskBucket: RiskBucket;
  peaEligible: boolean;
  ctoEligible: boolean;
  logoUrl: string;
  shortDescription: string;
};

// Alias pratique pour les imports existants
export type Asset = AssetItem;

// Logos dédiés (placeholders stylés)
const L = {
  world: "/logos/etf-world.svg",
  sp500: "/logos/etf-sp500.svg",
  nasdaq100: "/logos/etf-nasdaq.svg",
  europe: "/logos/etf-europe.svg",
  em: "/logos/etf-em.svg",
  bonds: "/logos/etf-bonds.svg",
  cash: "/logos/etf-cash.svg",
  tips: "/logos/etf-tips.svg",
  gold: "/logos/etf-gold.svg",
  clean: "/logos/etf-clean.svg",
  small: "/logos/etf-small-eu.svg",
  lvmh: "/logos/lvmh.svg",
  msft: "/logos/msft.svg",
  aapl: "/logos/aapl.svg",
  nvda: "/logos/nvda.svg",
  airbus: "/logos/airbus.svg",
  btc: "/logos/btc.svg",
  eth: "/logos/eth.svg",
  ada: "/logos/ada.svg",
  fallback: "/logos/default-asset.svg",
};

export const assetsCatalog: AssetItem[] = [
  // ETF cœur / défensifs (tickers Yahoo réels)
  { id: "etf-msci-world", type: "etf", ticker: "URTH", name: "ETF MSCI World", category: "coeur", riskBucket: "equilibre", peaEligible: false, ctoEligible: true, logoUrl: L.world, shortDescription: "Exposition large aux actions développées." },
  { id: "etf-sp500", type: "etf", ticker: "SPY", name: "ETF S&P 500", category: "coeur", riskBucket: "equilibre", peaEligible: false, ctoEligible: true, logoUrl: L.sp500, shortDescription: "Grandes capitalisations US, dominante tech." },
  { id: "etf-nasdaq", type: "etf", ticker: "QQQ", name: "ETF Nasdaq 100", category: "growth", riskBucket: "agressif", peaEligible: false, ctoEligible: true, logoUrl: L.nasdaq100, shortDescription: "Tech US concentrée, volatilité notable." },
  { id: "etf-europe", type: "etf", ticker: "VGK", name: "ETF Europe", category: "coeur", riskBucket: "prudent", peaEligible: false, ctoEligible: true, logoUrl: L.europe, shortDescription: "Actions Europe diversifiées, profil défensif." },
  { id: "etf-emerging", type: "etf", ticker: "EEM", name: "ETF Marchés émergents", category: "satellite", riskBucket: "dynamique", peaEligible: false, ctoEligible: true, logoUrl: L.em, shortDescription: "Diversification vers les marchés émergents." },
  { id: "etf-oblig-ig", type: "etf", ticker: "LQD", name: "ETF Obligataire IG", category: "obligataire", riskBucket: "ultra_prudent", peaEligible: false, ctoEligible: true, logoUrl: L.bonds, shortDescription: "Obligations investment grade pour stabiliser." },
  { id: "etf-tips", type: "etf", ticker: "TIP", name: "ETF Oblig. indexées inflation", category: "obligataire", riskBucket: "prudent", peaEligible: false, ctoEligible: true, logoUrl: L.tips, shortDescription: "Obligations indexées inflation, rôle défensif." },
  { id: "etf-gold", type: "etf", ticker: "GLD", name: "ETF Or (physique)", category: "defensif", riskBucket: "prudent", peaEligible: false, ctoEligible: true, logoUrl: L.gold, shortDescription: "Couverture partielle contre certains chocs." },
  { id: "etf-money-market", type: "etf", ticker: "BIL", name: "ETF Monétaire USD", category: "monetaire", riskBucket: "ultra_prudent", peaEligible: false, ctoEligible: true, logoUrl: L.cash, shortDescription: "Réserve de liquidité court terme." },
  { id: "etf-clean-energy", type: "etf", ticker: "ICLN", name: "ETF Énergies propres", category: "satellite", riskBucket: "dynamique", peaEligible: false, ctoEligible: true, logoUrl: L.clean, shortDescription: "Exposition renouvelables, plus volatile." },
  { id: "etf-small-cap-europe", type: "etf", ticker: "SMEZ", name: "ETF Small Caps Europe", category: "satellite", riskBucket: "dynamique", peaEligible: false, ctoEligible: true, logoUrl: L.small, shortDescription: "Petites capi Europe, potentiel et risque plus élevés." },

  // Actions grandes capi (tickers Yahoo réels)
  { id: "action-lvmh", type: "action", ticker: "MC.PA", name: "LVMH", category: "coeur", riskBucket: "equilibre", peaEligible: true, ctoEligible: true, logoUrl: L.lvmh, shortDescription: "Luxe mondial, cash-flow solide." },
  { id: "action-msft", type: "action", ticker: "MSFT", name: "Microsoft", category: "coeur", riskBucket: "dynamique", peaEligible: false, ctoEligible: true, logoUrl: L.msft, shortDescription: "Tech US large cap, croissance rentable." },
  { id: "action-aapl", type: "action", ticker: "AAPL", name: "Apple", category: "coeur", riskBucket: "dynamique", peaEligible: false, ctoEligible: true, logoUrl: L.aapl, shortDescription: "Tech/consommation, marque forte." },
  { id: "action-nvda", type: "action", ticker: "NVDA", name: "NVIDIA", category: "growth", riskBucket: "agressif", peaEligible: false, ctoEligible: true, logoUrl: L.nvda, shortDescription: "Semi-conducteurs & IA, volatilité élevée." },
  { id: "action-airbus", type: "action", ticker: "AIR.PA", name: "Airbus", category: "industriel", riskBucket: "equilibre", peaEligible: true, ctoEligible: true, logoUrl: L.airbus, shortDescription: "Aéronautique européenne, cyclique." },

  // Cryptos (tickers Yahoo réels)
  { id: "crypto-btc", type: "crypto", ticker: "BTC-USD", name: "Bitcoin", category: "crypto", riskBucket: "speculatif", peaEligible: false, ctoEligible: true, logoUrl: L.btc, shortDescription: "Actif très volatil, à faible part." },
  { id: "crypto-eth", type: "crypto", ticker: "ETH-USD", name: "Ethereum", category: "crypto", riskBucket: "agressif", peaEligible: false, ctoEligible: true, logoUrl: L.eth, shortDescription: "Smart contracts, volatilité notable." },
  { id: "crypto-ada", type: "crypto", ticker: "ADA-USD", name: "Cardano", category: "crypto", riskBucket: "speculatif", peaEligible: false, ctoEligible: true, logoUrl: L.ada, shortDescription: "Layer 1, risque important." },
];

