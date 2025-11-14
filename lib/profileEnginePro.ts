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
function lerp(a:number,b:number,t:number){ return a + (b - a) * t; }

// Nouveau barème "généreux crédible"
// expectedReturn ~ 3.0% → 16.5%, expectedVol ~ 6% → 32%
export function assumptions(riskIndex: number, drawdownMaxKey?: string) {
  const r = Math.max(0, Math.min(100, riskIndex));

  let er: number;
  if (r <= 20)      er = lerp(3.0, 5.5,  r/20);
  else if (r <= 40) er = lerp(5.5, 7.5, (r-20)/20);
  else if (r <= 60) er = lerp(7.5,10.0,(r-40)/20);
  else if (r <= 80) er = lerp(10.0,13.5,(r-60)/20);
  else              er = lerp(13.5,16.5,(r-80)/20);

  let ev: number;
  if (r <= 20)      ev = lerp(6, 9,   r/20);
  else if (r <= 40) ev = lerp(9, 12, (r-20)/20);
  else if (r <= 60) ev = lerp(12,18, (r-40)/20);
  else if (r <= 80) ev = lerp(18,26, (r-60)/20);
  else              ev = lerp(26,32, (r-80)/20);

  if (drawdownMaxKey === "5%")  { er = Math.min(er, 6.2); ev = Math.min(ev, 12); }
  if (drawdownMaxKey === "10%") { er = Math.min(er, 7.5); ev = Math.min(ev, 15); }

  return { expectedReturn: er, expectedVol: ev };
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
  // Normalisation des réponses inconnues (UNK)
  const n = normalizeUnknowns(a);
  const tol = (
    // Perte max annuelle acceptée (5/10/20/40 → 0..1)
    (Number(String(n.drawdown_max || "10%").replace("%", "")) / 40) * 0.5 +
    likert01(Number(n.reaction_drop || 3)) * 0.5
  ) * 100;

  const cap = (
    Math.min(30, Number(n.horizon_years) || 10) / 30 * 0.6 +
    (Math.min(100, Number(n.wealth_share) || 10) / 100) * 0.4
  ) * 100;

  const bes = (
    likert01(Number(n.pref_return || 3)) * 0.6 +
    likert01(Number(n.follow_intensity || 3)) * 0.4
  ) * 100;

  let risk = 0.4 * tol + 0.4 * cap + 0.2 * bes;
  risk = clamp(Math.round(risk));

  const prefCrypto = (n.asset_interest === "Crypto" ? 1 : n.asset_interest === "ETF Monde" ? 0.05 : 0.2 * likert01(Number(n.pref_return || 3)));
  const base = assumptions(risk, String(n.drawdown_max || "10%"));
  const alloc = allocation(risk, prefCrypto);

  // Bonus crypto optionnel
  const wantsCrypto = n.asset_interest === "Crypto";
  const longHorizon = n.horizon_years === "7-15" || n.horizon_years === "15+";
  const steadyHands = n.reaction_drop === "3" || n.reaction_drop === "4";
  let expectedReturn = base.expectedReturn;
  let expectedVol = base.expectedVol;
  if (wantsCrypto && longHorizon && steadyHands) {
    const bonus = risk >= 70 ? 1.5 : risk >= 55 ? 1.0 : 0.5;
    expectedReturn = Math.min(base.expectedReturn + bonus, 18.0);
    expectedVol = Math.min(base.expectedVol + 2.0, 34.0);
  }

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

// Mappe toutes les valeurs "UNK" vers un neutre
export function normalizeUnknowns(a: Answers): Answers {
  const b: Answers = { ...a };
  if (b.drawdown_max === "UNK") b.drawdown_max = "20%";
  if (b.horizon_years === "UNK") b.horizon_years = "7-15";
  if (b.wealth_share === "UNK") b.wealth_share = "50%";
  if (b.pref_return === "UNK") b.pref_return = "8%";
  if (b.asset_interest === "UNK") b.asset_interest = "ETF Monde";
  if (b.monthly_investment === "UNK") b.monthly_investment = "500";
  if (b.reaction_drop === "UNK") b.reaction_drop = "3";
  if (b.follow_intensity === "UNK") b.follow_intensity = "3";
  if (b.reinvest === "UNK") b.reinvest = "true";
  return b;
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
