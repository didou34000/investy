// Moteur métier pour le scoring avancé des profils investisseurs
export type Answers = Record<string, any>;
export type Axes = { tolerance: number; capacite: number; besoin: number };
export type Output = {
  riskIndex: number;
  expectedReturn: number; // annualisé (0.02..0.16)
  expectedVol: number;    // 0.05..0.40
  allocation: Record<string, number>; // % par classe
  axes: Axes;
};

function clamp(x: number, a = 0, b = 100) { 
  return Math.max(a, Math.min(b, x)); 
}

function likert01(v: number) { 
  const x = Math.min(5, Math.max(1, v || 3)); 
  return (x - 1) / 4; 
} // 0..1

// Hypothèses calibrées par risk et tolérance aux pertes
export function assumptions(risk: number, drawdownTolPct: number) {
  let ret = 0.025 + (risk / 100) * 0.135; // 2.5%→16%
  let vol = 0.06 + (risk / 100) * 0.34;   // 6%→40%
  
  // Brider la vol par tolérance (DD ~ 2×vol ~ ordre de grandeur)
  const maxVol = Math.max(0.06, (drawdownTolPct / 2) / 100);
  if (vol > maxVol) { 
    vol = maxVol; 
    ret = Math.min(ret, 0.02 + vol * 1.4); 
  }
  
  return { expectedReturn: ret, expectedVol: vol };
}

// Allocation continue (inclut crypto si risk élevé ou préférence forte)
export function allocation(risk: number, prefCrypto: number) {
  const eq = clamp(20 + 0.7 * risk, 20, 90);
  const fi = clamp(70 - 0.5 * risk, 5, 75);
  const alt = clamp((risk > 60 ? (risk - 60) * 0.4 : 0), 0, 20);
  let cry = Math.max(0, prefCrypto * 15 + (risk > 70 ? (risk - 70) * 0.2 : 0)); // 0..~20
  cry = Math.min(20, cry);
  const cash = clamp(Math.max(0, 10 - risk * 0.06), 0, 10);

  // Renormalise pour total 100
  let total = eq + fi + alt + cash + cry;
  const k = 100 / total;
  
  return {
    "Actions Monde": Math.round(eq * k),
    "Obligations": Math.round(fi * k),
    "Alternatifs": Math.round(alt * k),
    "Crypto": Math.round(cry * k),
    "Liquidités": Math.round(cash * k),
  };
}

// Scoring principal
export function scoreFromAnswers(a: Answers): Output {
  const tol = (
    // Perte max annuelle acceptée (5/10/20/40 → 0..1)
    (Number(String(a.drawdown_max || "10%").replace("%", "")) / 40) * 0.5 +
    likert01(Number(a.reaction_drop || 3)) * 0.5
  ) * 100;

  const cap = (
    Math.min(30, Number(a.horizon_years) || 10) / 30 * 0.6 +
    (Math.min(100, Number(a.wealth_share) || 10) / 100) * 0.4
  ) * 100;

  const bes = (
    likert01(Number(a.pref_return || 3)) * 0.6 +
    likert01(Number(a.follow_intensity || 3)) * 0.4
  ) * 100;

  let risk = 0.4 * tol + 0.4 * cap + 0.2 * bes;
  risk = clamp(Math.round(risk));

  const prefCrypto = (a.asset_interest === "Crypto" ? 1 : a.asset_interest === "ETF Monde" ? 0.05 : 0.2 * likert01(Number(a.pref_return || 3)));
  const { expectedReturn, expectedVol } = assumptions(risk, Number(String(a.drawdown_max || "10%").replace("%", "")) || 10);
  const alloc = allocation(risk, prefCrypto);

  return { 
    riskIndex: risk, 
    expectedReturn, 
    expectedVol, 
    allocation: alloc, 
    axes: { 
      tolerance: Math.round(tol), 
      capacite: Math.round(cap), 
      besoin: Math.round(bes) 
    } 
  };
}

// Suggestions pédagogiques (exemples génériques, non prescriptifs)
export type Suggestion = { 
  symbol: string; 
  label: string; 
  category: "etf" | "equity" | "crypto"; 
  suitability: "high" | "medium" | "low"; 
  note: string 
};

export function suggestions(out: Output, preference: string): Suggestion[] {
  const list: Suggestion[] = [];
  const r = out.riskIndex;

  // ETFs cœur (éducatif)
  list.push({ 
    symbol: "MSCI-World", 
    label: "ETF Actions Monde large", 
    category: "etf",
    suitability: r >= 45 ? "high" : "medium",
    note: "Diversification globale, frais faibles, cœur de portefeuille." 
  });

  list.push({ 
    symbol: "S&P-500", 
    label: "ETF S&P 500", 
    category: "etf",
    suitability: r >= 50 ? "high" : "medium",
    note: "Exposition aux grandes entreprises US, volatilité modérée à élevée." 
  });

  list.push({ 
    symbol: "AGG-Core", 
    label: "ETF Obligations investment grade", 
    category: "etf",
    suitability: r <= 60 ? "high" : "medium",
    note: "Stabilité relative, sensibilité aux taux. Pilier défensif." 
  });

  list.push({ 
    symbol: "EM-Equity", 
    label: "ETF Actions émergentes", 
    category: "etf",
    suitability: r >= 65 ? "medium" : "low",
    note: "Potentiel supérieur, volatilité et risques pays plus élevés." 
  });

  // Actions large-cap (exemples, éducatif)
  list.push({ 
    symbol: "AAPL", 
    label: "Apple (large-cap tech)", 
    category: "equity",
    suitability: r >= 60 ? "medium" : "low",
    note: "Croissance stable, sensible aux taux / valorisations." 
  });
  
  list.push({ 
    symbol: "MSFT", 
    label: "Microsoft (large-cap tech)", 
    category: "equity",
    suitability: r >= 55 ? "medium" : "low",
    note: "Flux récurrents, cloud/IA, risque de marché global." 
  });

  // Crypto majeures (informative)
  if (out.allocation["Crypto"] > 0) {
    list.push({ 
      symbol: "BTC", 
      label: "Bitcoin (crypto)", 
      category: "crypto",
      suitability: r >= 70 ? "medium" : "low",
      note: "Très volatil. Potentiel long terme vs risques élevés." 
    });
    
    list.push({ 
      symbol: "ETH", 
      label: "Ethereum (crypto)", 
      category: "crypto",
      suitability: r >= 70 ? "medium" : "low",
      note: "Écosystème smart contracts; volatilité importante." 
    });
    
    list.push({ 
      symbol: "SOL", 
      label: "Solana (crypto)", 
      category: "crypto",
      suitability: r >= 80 ? "medium" : "low",
      note: "Technologie performante, volatilité très élevée, risques techniques/réglementaires." 
    });
  }

  // Ranking en fonction de la catégorie d'intérêt
  return list
    .map(s => {
      let adj = s.suitability;
      if (preference === "Obligations" && s.category === "etf" && s.symbol === "AGG-Core") adj = "high";
      if (preference === "ETF Monde" && s.symbol === "MSCI-World") adj = "high";
      if (preference === "Actions" && s.category === "equity") adj = (r >= 65 ? "medium" : "low");
      if (preference === "Crypto" && s.category === "crypto") adj = (r >= 75 ? "medium" : "low");
      return { ...s, suitability: adj };
    })
    .sort((a, b) => (a.suitability === b.suitability ? 0 : a.suitability === "high" ? -1 : b.suitability === "high" ? 1 : a.suitability === "medium" ? -1 : 1));
}

// Simulation d'épargne composée
export function simulateProjection(
  initial: number,
  monthly: number,
  years: number,
  annualReturn: number,
  reinvest: boolean
) {
  const months = years * 12;
  const monthlyReturn = annualReturn / 12;
  const data = [];
  let balance = initial;

  for (let i = 0; i <= months; i++) {
    data.push({
      month: i,
      year: Math.floor(i / 12),
      balance: Math.round(balance),
      contribution: i === 0 ? initial : monthly
    });

    if (i < months) {
      if (reinvest) {
        balance = balance * (1 + monthlyReturn) + monthly;
      } else {
        balance = balance + monthly;
      }
    }
  }

  return data;
}
