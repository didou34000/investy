export type ProfileData = {
  riskScore: number;   // 0–100
  monthly: number;     // €
};

export function getProfileLabel(score: number) {
  if (score < 10) return "Hyper prudent 🧊";
  if (score < 25) return "Prudent 🌿";
  if (score < 40) return "Modéré ⚖️";
  if (score < 55) return "Équilibré 🌤️";
  if (score < 70) return "Dynamique 🚀";
  if (score < 85) return "Audacieux 🔥";
  if (score <= 100) return "Ultra offensif ⚡";
  return "Indéfini";
}

export function allocationForScore(score: number) {
  const actions = Math.min(90, 10 + 0.8 * score);
  const obligations = Math.max(5, 70 - 0.6 * score);
  const alternatifs = Math.max(0, (score - 60) * 0.5);
  const liquidites = Math.max(0, 15 - score * 0.1);
  const total = actions + obligations + alternatifs + liquidites;
  const k = 100 / total;
  return {
    "Actions Monde": Math.round(actions * k),
    "Obligations": Math.round(obligations * k),
    "Alternatifs": Math.round(alternatifs * k),
    "Liquidités": Math.round(liquidites * k),
  };
}

export function yearlyReturn(score: number) {
  return 0.03 + (score / 100) * 0.07; // 3% → 10%
}

export function volatility(score: number) {
  return 0.05 + (score / 100) * 0.20; // 5% → 25%
}

export function simulateGrowth(monthly: number, score: number, years = 10) {
  const r = yearlyReturn(score);
  const n = years * 12;
  let total = 0;
  for (let i = 0; i < n; i++) total = total * (1 + r / 12) + monthly;
  const p10 = total * 0.7;   // scénario défavorable
  const p50 = total;         // médian
  const p90 = total * 1.3;   // favorable
  return { p10: Math.round(p10), p50: Math.round(p50), p90: Math.round(p90) };
}
