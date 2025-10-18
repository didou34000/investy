import { resolveLogo } from "./logo";

export type Asset = {
  symbol: string;
  name: string;
  type: "Action" | "ETF" | "Crypto" | "Obligation" | "Immobilier";
  region: "Monde" | "US" | "Europe" | "Émergents";
  rendementMoyen: number; // en %
  volatilite: number; // en %
  risque: "faible" | "modéré" | "élevé" | "extrême";
  description: string;
  adaptation: "Très adapté" | "Adapté" | "À considérer" | "Non adapté";
  raison: string;
  lien: string;
  logo?: string | null;
};

export function getSuggestions(profil: string): Asset[] {
  const S: Asset[] = [];

  switch (profil) {
    case "Prudent":
      S.push({
        symbol: "EUNA",
        name: "ETF Obligations d'État Europe",
        type: "ETF",
        region: "Europe",
        rendementMoyen: 2.8,
        volatilite: 5,
        risque: "faible",
        adaptation: "Très adapté",
        description: "Investit dans les dettes souveraines de la zone euro. Idéal pour une approche défensive.",
        raison: "Protège le capital et lisse la volatilité.",
        lien: "https://www.justetf.com/fr/find-etf.html"
      });
      S.push({
        symbol: "BNPP-MSCI-WORLD",
        name: "ETF Monde large (MSCI World)",
        type: "ETF",
        region: "Monde",
        rendementMoyen: 6.2,
        volatilite: 14,
        risque: "modéré",
        adaptation: "Adapté",
        description: "Diversification mondiale. Inclut les plus grandes entreprises globales.",
        raison: "Convient à une exposition prudente à la croissance mondiale.",
        lien: "https://www.justetf.com/fr/find-etf.html"
      });
      S.push({
        symbol: "OR",
        name: "Or (ETF)",
        type: "ETF",
        region: "Monde",
        rendementMoyen: 4.5,
        volatilite: 12,
        risque: "modéré",
        adaptation: "Adapté",
        description: "Hedge contre l'inflation et diversification du portefeuille.",
        raison: "Actif refuge en période d'incertitude économique.",
        lien: "https://www.justetf.com/fr/find-etf.html"
      });
      break;

    case "Modéré défensif":
      S.push({
        symbol: "S&P500",
        name: "ETF S&P 500",
        type: "ETF",
        region: "US",
        rendementMoyen: 8.5,
        volatilite: 18,
        risque: "modéré",
        adaptation: "Très adapté",
        description: "Réplique les 500 plus grandes entreprises américaines.",
        raison: "Bon équilibre entre risque et rendement sur le long terme.",
        lien: "https://www.justetf.com/fr/find-etf.html"
      });
      S.push({
        symbol: "EUNA",
        name: "ETF Obligations d'État Europe",
        type: "ETF",
        region: "Europe",
        rendementMoyen: 2.8,
        volatilite: 5,
        risque: "faible",
        adaptation: "Très adapté",
        description: "Stabilité et revenus réguliers pour équilibrer le portefeuille.",
        raison: "Réduit la volatilité globale du portefeuille.",
        lien: "https://www.justetf.com/fr/find-etf.html"
      });
      S.push({
        symbol: "AAPL",
        name: "Apple Inc.",
        type: "Action",
        region: "US",
        rendementMoyen: 12,
        volatilite: 25,
        risque: "modéré",
        adaptation: "Adapté",
        description: "Leader technologique avec des flux de trésorerie stables.",
        raison: "Croissance régulière et dividendes croissants.",
        lien: "https://finance.yahoo.com/quote/AAPL"
      });
      break;

    case "Équilibré":
      S.push({
        symbol: "S&P500",
        name: "ETF S&P 500",
        type: "ETF",
        region: "US",
        rendementMoyen: 8.5,
        volatilite: 18,
        risque: "modéré",
        adaptation: "Très adapté",
        description: "Réplique les 500 plus grandes entreprises américaines.",
        raison: "Bon équilibre entre risque et rendement sur le long terme.",
        lien: "https://www.justetf.com/fr/find-etf.html"
      });
      S.push({
        symbol: "BTC",
        name: "Bitcoin",
        type: "Crypto",
        region: "Monde",
        rendementMoyen: 35,
        volatilite: 70,
        risque: "extrême",
        adaptation: "À considérer",
        description: "Actif numérique spéculatif. Réservé aux profils tolérant de fortes pertes temporaires.",
        raison: "Permet de diversifier une petite portion du portefeuille (<5%).",
        lien: "https://coinmarketcap.com/fr/"
      });
      S.push({
        symbol: "MSFT",
        name: "Microsoft Corporation",
        type: "Action",
        region: "US",
        rendementMoyen: 15,
        volatilite: 22,
        risque: "modéré",
        adaptation: "Très adapté",
        description: "Leader du cloud et de l'IA avec des revenus récurrents.",
        raison: "Croissance stable dans les technologies du futur.",
        lien: "https://finance.yahoo.com/quote/MSFT"
      });
      break;

    case "Modéré offensif":
      S.push({
        symbol: "TSLA",
        name: "Tesla Inc.",
        type: "Action",
        region: "US",
        rendementMoyen: 20,
        volatilite: 40,
        risque: "élevé",
        adaptation: "Très adapté",
        description: "Valeur de croissance emblématique. Forte volatilité, mais potentiel long terme élevé.",
        raison: "Convient à un investisseur acceptant de grandes fluctuations.",
        lien: "https://finance.yahoo.com/quote/TSLA"
      });
      S.push({
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        type: "Action",
        region: "US",
        rendementMoyen: 25,
        volatilite: 35,
        risque: "élevé",
        adaptation: "Très adapté",
        description: "Leader des puces IA et du gaming. Croissance explosive.",
        raison: "Exposition directe à la révolution de l'intelligence artificielle.",
        lien: "https://finance.yahoo.com/quote/NVDA"
      });
      S.push({
        symbol: "ETH",
        name: "Ethereum",
        type: "Crypto",
        region: "Monde",
        rendementMoyen: 40,
        volatilite: 75,
        risque: "extrême",
        adaptation: "Adapté",
        description: "Plateforme blockchain pour applications décentralisées.",
        raison: "Potentiel de croissance dans l'écosystème DeFi et Web3.",
        lien: "https://coinmarketcap.com/fr/currencies/ethereum/"
      });
      break;

    case "Dynamique":
    case "Agressif":
      S.push({
        symbol: "TSLA",
        name: "Tesla Inc.",
        type: "Action",
        region: "US",
        rendementMoyen: 20,
        volatilite: 40,
        risque: "élevé",
        adaptation: "Très adapté",
        description: "Valeur de croissance emblématique. Forte volatilité, mais potentiel long terme élevé.",
        raison: "Convient à un investisseur acceptant de grandes fluctuations.",
        lien: "https://finance.yahoo.com/quote/TSLA"
      });
      S.push({
        symbol: "SOL",
        name: "Solana",
        type: "Crypto",
        region: "Monde",
        rendementMoyen: 45,
        volatilite: 80,
        risque: "extrême",
        adaptation: "Adapté",
        description: "Crypto à haut potentiel technologique, très sensible au marché.",
        raison: "Peut booster la performance sur une faible allocation.",
        lien: "https://coinmarketcap.com/fr/currencies/solana/"
      });
      S.push({
        symbol: "SPGI",
        name: "S&P Global Inc.",
        type: "Action",
        region: "US",
        rendementMoyen: 11,
        volatilite: 22,
        risque: "modéré",
        adaptation: "Très adapté",
        description: "Leader de l'analyse financière mondiale.",
        raison: "Croissance stable dans la finance et la data.",
        lien: "https://finance.yahoo.com/quote/SPGI"
      });
      S.push({
        symbol: "ARKK",
        name: "ARK Innovation ETF",
        type: "ETF",
        region: "US",
        rendementMoyen: 18,
        volatilite: 30,
        risque: "élevé",
        adaptation: "Très adapté",
        description: "ETF concentré sur les technologies disruptives.",
        raison: "Exposition diversifiée aux innovations de rupture.",
        lien: "https://www.justetf.com/fr/find-etf.html"
      });
      break;

    default:
      // Profil par défaut - Équilibré
      S.push({
        symbol: "S&P500",
        name: "ETF S&P 500",
        type: "ETF",
        region: "US",
        rendementMoyen: 8.5,
        volatilite: 18,
        risque: "modéré",
        adaptation: "Très adapté",
        description: "Réplique les 500 plus grandes entreprises américaines.",
        raison: "Bon équilibre entre risque et rendement sur le long terme.",
        lien: "https://www.justetf.com/fr/find-etf.html"
      });
      S.push({
        symbol: "EUNA",
        name: "ETF Obligations d'État Europe",
        type: "ETF",
        region: "Europe",
        rendementMoyen: 2.8,
        volatilite: 5,
        risque: "faible",
        adaptation: "Très adapté",
        description: "Stabilité et revenus réguliers pour équilibrer le portefeuille.",
        raison: "Réduit la volatilité globale du portefeuille.",
        lien: "https://www.justetf.com/fr/find-etf.html"
      });
      break;
  }
  
  // Ajouter les logos à chaque suggestion
  return S.map(asset => ({
    ...asset,
    logo: resolveLogo({
      symbol: asset.symbol,
      category: asset.type === "Crypto" ? "crypto" : 
                asset.type === "ETF" ? "etf" : 
                asset.type === "Action" ? "equity" : "bond",
      coingeckoImage: null
    })
  }));
}
