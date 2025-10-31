import { resolveLogo } from "./logo";

export type Pack = {
  id: string;
  title: string;
  blurb: string;
  items: {
    symbol: string;
    label: string;
    category: "index" | "etf" | "equity" | "crypto" | "bond";
    logo?: string;
  }[];
  profileHint: ("Prudent" | "Équilibré" | "Dynamique" | "Agressif")[];
};

export const PACKS: Pack[] = [
  {
    id: "etf-world-core",
    title: "ETF Monde (cœur de portefeuille)",
    blurb: "Diversification globale, frais faibles, base long terme.",
    profileHint: ["Prudent", "Équilibré", "Dynamique", "Agressif"],
    items: [
      { 
        symbol: "MSCI-World", 
        label: "ETF MSCI World (monde développé)", 
        category: "etf"
      },
      { 
        symbol: "S&P-500", 
        label: "ETF S&P 500 (USA large-cap)", 
        category: "etf"
      },
    ]
  },
  {
    id: "tech-us",
    title: "Tech US (croissance)",
    blurb: "Exposition aux mégacaps tech et au Nasdaq.",
    profileHint: ["Équilibré", "Dynamique", "Agressif"],
    items: [
      { 
        symbol: "NASDAQ-100", 
        label: "ETF Nasdaq-100", 
        category: "etf"
      },
      { 
        symbol: "MSFT", 
        label: "Microsoft (action)", 
        category: "equity"
      },
      { 
        symbol: "AAPL", 
        label: "Apple (action)", 
        category: "equity"
      },
      { 
        symbol: "TSLA", 
        label: "Tesla (action)", 
        category: "equity"
      },
    ]
  },
  {
    id: "bonds-eu",
    title: "Obligations Europe (défensif)",
    blurb: "Pilier défensif, sensibilité aux taux.",
    profileHint: ["Prudent", "Équilibré"],
    items: [
      { 
        symbol: "Euro-Gov", 
        label: "ETF Obligations d'État zone euro", 
        category: "bond"
      },
      { 
        symbol: "Corporate-EU", 
        label: "ETF Obligations Corporate Europe", 
        category: "bond"
      },
    ]
  },
  {
    id: "crypto-majors",
    title: "Crypto Majors (volatil)",
    blurb: "Exposition spéculative aux cryptos majeures.",
    profileHint: ["Dynamique", "Agressif"],
    items: [
      { 
        symbol: "bitcoin", 
        label: "Bitcoin", 
        category: "crypto"
      },
      { 
        symbol: "ethereum", 
        label: "Ethereum", 
        category: "crypto"
      },
      { 
        symbol: "solana", 
        label: "Solana", 
        category: "crypto"
      },
    ]
  },
  {
    id: "emerging-markets",
    title: "Marchés émergents",
    blurb: "Exposition aux pays en développement pour diversification géographique.",
    profileHint: ["Équilibré", "Dynamique", "Agressif"],
    items: [
      { 
        symbol: "MSCI-EM", 
        label: "ETF MSCI Emerging Markets", 
        category: "etf"
      },
      { 
        symbol: "ASIA", 
        label: "ETF Asie-Pacifique", 
        category: "etf"
      },
    ]
  },
  {
    id: "renewable-energy",
    title: "Énergies renouvelables",
    blurb: "Secteur de la transition énergétique et des technologies vertes.",
    profileHint: ["Équilibré", "Dynamique", "Agressif"],
    items: [
      { 
        symbol: "ICLN", 
        label: "ETF Clean Energy", 
        category: "etf"
      },
      { 
        symbol: "ENPH", 
        label: "Enphase Energy (solaire)", 
        category: "equity"
      },
    ]
  }
];

export function packsForProfile(profile: string) {
  return PACKS.filter(p => p.profileHint.includes((profile as any) ?? "Équilibré"));
}

export function getPackById(id: string): Pack | undefined {
  return PACKS.find(p => p.id === id);
}

export function getAssetLogo(symbol: string, category: string = "equity"): string {
  return resolveLogo({ 
    symbol, 
    category: category as any, 
    coingeckoImage: null 
  });
}
