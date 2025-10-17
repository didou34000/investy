export type Category = "equity"|"etf"|"index"|"bond"|"crypto";
export type Asset = {
  symbol: string;
  label: string;
  category: Category;
  rationale: string;
  tilt?: string[];
  region?: string;
  baseSuitability: 1|2|3;
};

export type Allocation = {
  equity: number; bond: number; alts: number; cash: number; crypto?: number;
};

export type Archetype = {
  id: string;
  title: string;
  range: [number, number];
  allocation: Allocation;
  description: string;
  defaults: Asset[];
};

const ETF_WORLD: Asset = { symbol:"MSCI-World", label:"ETF MSCI World (monde développé)", category:"etf", rationale:"Diversification géographique simple, frais faibles.", tilt:["core","quality"], region:"World", baseSuitability:3 };
const SP500:    Asset = { symbol:"S&P-500", label:"ETF S&P 500 (USA)", category:"etf", rationale:"Large caps US, leadership sectoriel, profondeur de marché.", tilt:["growth","quality"], region:"US", baseSuitability:3 };
const EURO_GOV: Asset = { symbol:"Euro-Gov", label:"ETF Obligations d’État zone euro", category:"bond", rationale:"Pilier défensif, baisse de volatilité du portefeuille.", tilt:["defensive"], region:"EU", baseSuitability:3 };
const CORP_EU:  Asset = { symbol:"Corporate-EU", label:"ETF Obligations Corporate Europe", category:"bond", rationale:"Revenu via coupons, diversification crédit.", tilt:["income"], region:"EU", baseSuitability:2 };
const QQQ:      Asset = { symbol:"NASDAQ-100", label:"ETF Nasdaq-100", category:"etf", rationale:"Exposition tech US, plus volatil que S&P 500.", tilt:["growth"], region:"US", baseSuitability:2 };
const EM:       Asset = { symbol:"EM-Equity", label:"ETF Marchés émergents", category:"etf", rationale:"Diversification EM, devises et cycles distincts.", tilt:["diversification"], region:"EM", baseSuitability:2 };
const GREEN:    Asset = { symbol:"Clean-Energy", label:"ETF Clean Energy", category:"etf", rationale:"Orientation énergie propre/ESG — plus cyclique.", tilt:["green"], region:"World", baseSuitability:1 };
const DIV_WORLD:Asset = { symbol:"World-Dividend", label:"ETF Monde dividendes", category:"etf", rationale:"Orientation rendement/qualité, moins de croissance.", tilt:["income","quality"], region:"World", baseSuitability:2 };
const GOLD:     Asset = { symbol:"Gold", label:"Or (ETF)", category:"index", rationale:"Valeur refuge, corrélation faible, pas de rendement.", tilt:["hedge"], region:"World", baseSuitability:1 };
const BTC:      Asset = { symbol:"bitcoin", label:"Bitcoin", category:"crypto", rationale:"Actif spéculatif, volatilité extrême; thèse monétaire numérique.", tilt:["speculative"], region:"World", baseSuitability:1 };
const ETH:      Asset = { symbol:"ethereum", label:"Ethereum", category:"crypto", rationale:"Smart-contracts, écosystème DeFi/NFT; volatilité élevée.", tilt:["speculative"], region:"World", baseSuitability:1 };
const SOL:      Asset = { symbol:"solana", label:"Solana", category:"crypto", rationale:"Infra haut débit; volatilité très élevée.", tilt:["speculative"], region:"World", baseSuitability:1 };
const AAPL:     Asset = { symbol:"AAPL", label:"Apple (action)", category:"equity", rationale:"Mégacap qualité, cash-flow, écosystème iOS.", tilt:["quality"], region:"US", baseSuitability:2 };
const MSFT:     Asset = { symbol:"MSFT", label:"Microsoft (action)", category:"equity", rationale:"Cloud + software récurrent, rentabilité élevée.", tilt:["quality","growth"], region:"US", baseSuitability:3 };
const SPGI:     Asset = { symbol:"SPGI", label:"S&P Global (action)", category:"equity", rationale:"Indices/ratings, moat fort, sensible au cycle crédit.", tilt:["quality"], region:"US", baseSuitability:2 };

export const ARCHETYPES: Archetype[] = [
  { id:"ultra-prudent", title:"Ultra-prudent", range:[0,10],
    allocation:{ equity:20, bond:60, alts:10, cash:10 },
    description:"Stabilité maximale, horizon court, priorité à la préservation du capital.",
    defaults:[ETF_WORLD, EURO_GOV, CORP_EU, GOLD, DIV_WORLD]
  },
  { id:"prudent", title:"Prudent", range:[11,20],
    allocation:{ equity:35, bond:45, alts:10, cash:10 },
    description:"Rendement modéré, volatilité contenue, horizon 3–5 ans.",
    defaults:[ETF_WORLD, EURO_GOV, DIV_WORLD, GOLD, CORP_EU]
  },
  { id:"modere", title:"Modéré", range:[21,30],
    allocation:{ equity:50, bond:35, alts:10, cash:5 },
    description:"Équilibre rendement/risque, cœur ETF Monde + obligations zone euro.",
    defaults:[ETF_WORLD, SP500, EURO_GOV, DIV_WORLD, GOLD]
  },
  { id:"equilibre", title:"Équilibré", range:[31,45],
    allocation:{ equity:60, bond:25, alts:10, cash:5 },
    description:"Cœur actions globales, pilier obligataire réduit, volatilité raisonnable.",
    defaults:[ETF_WORLD, SP500, EURO_GOV, EM, DIV_WORLD]
  },
  { id:"croissance", title:"Croissance", range:[46,55],
    allocation:{ equity:70, bond:15, alts:10, cash:5 },
    description:"Accent croissance (USA/Tech) tout en gardant un coussin obligataire.",
    defaults:[SP500, QQQ, ETF_WORLD, EURO_GOV, EM, MSFT]
  },
  { id:"dynamique", title:"Dynamique", range:[56,65],
    allocation:{ equity:80, bond:10, alts:5, cash:5, crypto:0 },
    description:"Dominante actions, tolérance à des drawdowns significatifs.",
    defaults:[SP500, QQQ, ETF_WORLD, EM, MSFT, SPGI]
  },
  { id:"tres-dynamique", title:"Très dynamique", range:[66,72],
    allocation:{ equity:85, bond:5, alts:5, cash:5, crypto:0 },
    description:"Forte exposition actions/tech; variations plus marquées.",
    defaults:[QQQ, SP500, ETF_WORLD, EM, MSFT, AAPL]
  },
  { id:"agressif", title:"Agressif", range:[73,82],
    allocation:{ equity:90, bond:0, alts:5, cash:5, crypto:0 },
    description:"Performance visée élevée, volatilité assumée, horizon long.",
    defaults:[QQQ, SP500, MSFT, AAPL, EM, SPGI]
  },
  { id:"crypto-curieux", title:"Crypto-curieux", range:[60,80],
    allocation:{ equity:75, bond:10, alts:5, cash:5, crypto:5 },
    description:"Petite poche crypto (5%) pour la découverte, reste en core actions.",
    defaults:[ETF_WORLD, SP500, QQQ, EURO_GOV, BTC, ETH]
  },
  { id:"crypto-convaincu", title:"Crypto-convaincu", range:[80,100],
    allocation:{ equity:70, bond:5, alts:5, cash:5, crypto:15 },
    description:"Exposition crypto significative (15%) pour profil très tolérant au risque.",
    defaults:[QQQ, SP500, BTC, ETH, SOL, EM]
  },
  { id:"income", title:"Revenu / Dividendes", range:[20,55],
    allocation:{ equity:50, bond:35, alts:10, cash:5 },
    description:"Rendement via dividendes/coupons avec volatilité contenue.",
    defaults:[DIV_WORLD, EURO_GOV, CORP_EU, ETF_WORLD, SPGI]
  },
  { id:"green-tilt", title:"Orientation durable (ESG/Green)", range:[30,70],
    allocation:{ equity:65, bond:20, alts:10, cash:5 },
    description:"Biais durable/énergies propres, volatilité potentiellement plus élevée.",
    defaults:[ETF_WORLD, GREEN, SP500, EURO_GOV, EM]
  },
];

export function matchArchetype(score:number): Archetype {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const found = ARCHETYPES.find(a => s>=a.range[0] && s<=a.range[1]);
  return found || ARCHETYPES[3];
}

export type Modulators = {
  horizonYears?: number;
  maxDrawdownTolerance?: number;
  cryptoInterest?: "none"|"low"|"mid"|"high";
  needIncome?: boolean;
  needLiquidity?: boolean;
  greenTilt?: boolean;
};

export function personalize(archetype: Archetype, mods: Modulators){
  let alloc = { ...archetype.allocation } as Allocation;

  if (mods.horizonYears && mods.horizonYears <= 3) {
    alloc.bond = Math.min(70, alloc.bond + 10);
    alloc.cash = Math.min(20, (alloc.cash||0) + 5);
    alloc.equity = Math.max(0, alloc.equity - 10);
    if (alloc.crypto!=null) alloc.crypto = Math.max(0, (alloc.crypto||0) - 5);
  }

  if (mods.maxDrawdownTolerance && mods.maxDrawdownTolerance <= 15) {
    alloc.bond = Math.min(70, alloc.bond + 10);
    if (alloc.crypto!=null) alloc.crypto = Math.max(0, (alloc.crypto||0) - 5);
  }

  if (mods.cryptoInterest === "high") {
    alloc.crypto = Math.min(25, (alloc.crypto||0) + 5);
  } else if (mods.cryptoInterest === "none") {
    alloc.crypto = 0;
  }

  if (mods.needIncome) {
    alloc.bond = Math.min(80, alloc.bond + 5);
  }

  if (mods.needLiquidity) {
    alloc.cash = Math.min(30, (alloc.cash||0) + 5);
  }

  const total = alloc.equity + alloc.bond + alloc.alts + (alloc.cash||0) + (alloc.crypto||0);
  if (total !== 100) {
    const ratio = 100/total;
    alloc = {
      equity: Math.round(alloc.equity*ratio),
      bond:   Math.round(alloc.bond*ratio),
      alts:   Math.round(alloc.alts*ratio),
      cash:   Math.round((alloc.cash||0)*ratio),
      crypto: Math.round((alloc.crypto||0)*ratio),
    } as Allocation;
  }

  const reweigh = (a:Asset): 1|2|3 => {
    let sc = a.baseSuitability;
    if (mods.needIncome && a.tilt?.includes("income")) sc = Math.min(3, (sc+1) as 3);
    if (mods.greenTilt && a.tilt?.includes("green"))   sc = Math.min(3, (sc+1) as 3);
    if ((mods.cryptoInterest==="none") && a.category==="crypto") sc = 1;
    if (mods.maxDrawdownTolerance && mods.maxDrawdownTolerance<15 && a.category==="crypto") sc = 1;
    return sc;
  };

  const suggestions = archetype.defaults.map(a => ({ ...a, suitability: reweigh(a) }));
  return { allocation: alloc, suggestions };
}


