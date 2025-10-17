export type SimInput = {
  initial: number;
  monthly: number;
  years: number;
  expectedReturn: number; // ex 0.087 (8.7%)
  reinvest: boolean;
};

export function compoundSeries({ initial, monthly, years, expectedReturn, reinvest }: SimInput){
  // mensualisation du rendement annualisé
  const r = Math.pow(1 + expectedReturn, 1/12) - 1;
  const points: { x: number; y: number }[] = [];
  let value = initial;
  for (let m = 0; m <= years*12; m++){
    if (m > 0){
      if (reinvest) value = value * (1 + r) + monthly;
      else { value = value + monthly; } // pas d'intérêts sur la part nouvelle si OFF (pédagogique)
    }
    if (m % 12 === 0) points.push({ x: m/12, y: value });
  }
  return points;
}

export type Suggestion = {
  symbol: string;
  label: string;
  category: "etf"|"equity"|"crypto";
  suitability: "high"|"medium"|"low";
  note: string;
};

export function suggestionsByProfile(riskIndex: number, allocation: Record<string,number>) : Suggestion[] {
  const eq = allocation["Actions Monde"] ?? allocation["Actions"] ?? 0;
  const fi = allocation["Obligations"] ?? 0;
  const cry = allocation["Crypto"] ?? 0;

  const S: Suggestion[] = [];
  // ETFs cœur
  S.push({ symbol:"MSCI-World", label:"ETF Monde large (MSCI World)", category:"etf",
    suitability: eq>=40? "high":"medium", note:"Diversification globale, frais faibles." });
  S.push({ symbol:"S&P-500", label:"ETF S&P 500", category:"etf",
    suitability: eq>=45? "high":"medium", note:"Exposition aux grandes entreprises US." });
  S.push({ symbol:"Euro-Gov", label:"ETF Obligations d'État zone euro", category:"etf",
    suitability: fi>=30? "high":"medium", note:"Pilier défensif, sensibilité aux taux." });
  S.push({ symbol:"Corporate-EU", label:"ETF Obligations Corporate Europe", category:"etf",
    suitability: fi>=25? "medium":"low", note:"Crédit d'entreprise, rendement vs risque." });

  // Actions large-cap (éducation, pas prescriptif)
  S.push({ symbol:"AAPL", label:"Apple (large-cap tech)", category:"equity",
    suitability: riskIndex>=60? "medium":"low", note:"Croissance stable, sensible aux taux." });
  S.push({ symbol:"MSFT", label:"Microsoft (large-cap tech)", category:"equity",
    suitability: riskIndex>=55? "medium":"low", note:"Flux récurrents, cloud/IA." });

  // Crypto majeures si exposition prévue
  if (cry>0){
    S.push({ symbol:"BTC", label:"Bitcoin", category:"crypto",
      suitability: riskIndex>=70? "medium":"low", note:"Très volatil. Thèse long terme possible." });
    S.push({ symbol:"ETH", label:"Ethereum", category:"crypto",
      suitability: riskIndex>=72? "medium":"low", note:"Écosystème smart contracts." });
    if (riskIndex>=80) {
      S.push({ symbol:"SOL", label:"Solana", category:"crypto",
        suitability: "low", note:"Performance technique, volatilité très élevée." });
    }
  }
  return S.sort((a,b)=> (a.suitability===b.suitability?0: a.suitability==="high"?-1: b.suitability==="high"?1: a.suitability==="medium"?-1:1));
}

export function profileLabel(score:number){
  if(score<45) return "Prudent";
  if(score<60) return "Modéré défensif";
  if(score<70) return "Équilibré";
  if(score<80) return "Modéré offensif";
  if(score<90) return "Dynamique";
  return "Agressif";
}

export function profileBlurb(score:number){
  if(score<45) return "Vous privilégiez la stabilité et lissez la volatilité.";
  if(score<60) return "Vous acceptez un risque limité pour un rendement régulier.";
  if(score<70) return "Bon compromis entre croissance et stabilité.";
  if(score<80) return "Orientation croissance avec volatilité modérée.";
  if(score<90) return "Forte appétence au risque pour viser la performance long terme.";
  return "Appétence élevée au risque et aux phases de marché marquées.";
}
