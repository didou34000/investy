export type QAnswer = { id: string; value: number }; // 1..5, ou nombre pour champs libres
export type QuizV3Input = {
  answers: QAnswer[];
  monthly?: number;   // €
  horizon?: number;   // années
  reserves?: number;  // mois de dépenses en épargne de précaution
  shareOfSavings?: number; // % de l'épargne investissable
};

function clamp(n: number, a = 0, b = 100) { return Math.max(a, Math.min(b, n)); }

export function computeRiskIndex(input: QuizV3Input): { riskIndex: number; sub: {
  tolerance: number; capacity: number; need: number;
}} {
  // Mapping des questions → axes
  const W = {
    // Tolérance (psychologie)
    tol_risk: 2, tol_drawdown: 2, tol_past: 1, tol_reaction: 2,
    // Capacité (finance perso)
    cap_horizon: 2, cap_income_stability: 1, cap_reserves: 2, cap_share: 1,
    // Besoin (objectif rendement)
    need_target: 2, need_growth_pref: 1, need_knowledge: 1, need_contrib_variation: 1,
  };
  const get = (id: string) => input.answers.find(a => a.id === id)?.value ?? 3;

  // Normalisation 1..5 → 0..100
  const n = (v: number) => ((v - 1) / 4) * 100;

  // Axes
  const tolerance = clamp(
    (n(get("tol_risk")) * W.tol_risk +
     n(get("tol_drawdown")) * W.tol_drawdown +
     n(get("tol_past")) * W.tol_past +
     n(get("tol_reaction")) * W.tol_reaction) / (W.tol_risk + W.tol_drawdown + W.tol_past + W.tol_reaction)
  );

  const capacityBase = clamp(
    (n(get("cap_horizon")) * W.cap_horizon +
     n(get("cap_income_stability")) * W.cap_income_stability +
     n(get("cap_reserves")) * W.cap_reserves +
     n(get("cap_share")) * W.cap_share) / (W.cap_horizon + W.cap_income_stability + W.cap_reserves + W.cap_share)
  );

  const need = clamp(
    (n(get("need_target")) * W.need_target +
     n(get("need_growth_pref")) * W.need_growth_pref +
     n(get("need_knowledge")) * W.need_knowledge +
     n(get("need_contrib_variation")) * W.need_contrib_variation) / (W.need_target + W.need_growth_pref + W.need_knowledge + W.need_contrib_variation)
  );

  // Ajustements conditionnels
  const horizon = input.horizon ?? Math.round((get("cap_horizon"))); // fallback
  let capacity = capacityBase;
  if (horizon <= 3) capacity = Math.min(capacity, 35); // horizon court bride la capacité
  if ((input.reserves ?? 0) < 3) capacity = Math.min(capacity, 30); // peu de matelas → prudence
  if ((input.shareOfSavings ?? 0) < 20) capacity = Math.min(capacity, 40);

  // Agrégation (pondère un peu plus la capacité)
  const riskIndex = clamp((tolerance * 0.4 + capacity * 0.4 + need * 0.2));

  return { riskIndex, sub: { tolerance, capacity, need } };
}

// Allocation lissée en fonction du RiskIndex
export function allocationFromRisk(r: number) {
  const actionsMonde = clamp(20 + 0.7 * r);         // 20% → 90%
  const obligations = clamp(70 - 0.6 * r);         // 70% → 10%
  const satellites = clamp(Math.max(0, r - 70));// 0% → 30% quand r>70
  const liquidites = clamp(Math.max(0, 10 - r * 0.1)); // 10% → 0%
  // re-normalisation à 100
  const sum = actionsMonde + obligations + satellites + liquidites;
  const k = 100 / sum;
  return {
    "Actions Monde": Math.round(actionsMonde * k),
    "Obligations": Math.round(obligations * k),
    "Satellites": Math.round(satellites * k),
    "Liquidités": Math.round(liquidites * k),
  };
}

// Projection éducative simple avec bande P10/P50/P90 (GBM)
export function projectionBands({ monthly = 200, horizon = 10, rAnnual = 0.05, volAnnual = 0.12 }: {
  monthly?: number; horizon?: number; rAnnual?: number; volAnnual?: number;
}) {
  const n = horizon * 12, mu = rAnnual / 12, sigma = volAnnual / Math.sqrt(12);
  function simulate() {
    let bal = 0;
    for (let i = 0; i < n; i++) {
      bal = bal * (1 + mu + sigma * randn()) + monthly;
    }
    return bal;
  }
  function randn() { // Box-Muller
    const u = Math.random(), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  const runs = 300;
  const arr = Array.from({ length: runs }, simulate).sort((a, b) => a - b);
  const pick = (p: number) => arr[Math.floor(p * (runs - 1))];
  return { p10: Math.round(pick(0.10)), p50: Math.round(pick(0.50)), p90: Math.round(pick(0.90)) };
}

// Map RiskIndex → hypothèses (plus risqué = plus d'espérance et de vol)
export function marketAssumptions(r: number) {
  const rAnnual = 0.03 + (r / 100) * 0.07;   // 3% → 10%
  const volAnnual = 0.06 + (r / 100) * 0.20; // 6% → 26%
  return { rAnnual, volAnnual };
}
