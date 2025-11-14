export type Answer = { id: string; value: number };

export function computeRiskScore(answers: Answer[]): number {
  const avg = answers.reduce((a, b) => a + b.value, 0) / answers.length;
  return Math.round((avg - 1) * 25); // 1→0, 5→100
}

export function profileFromScore(score: number) {
  if (score < 25) return { name: "Très Prudent 🕊️", color: "#22c55e", desc: "Tu privilégies la sécurité avant tout." };
  if (score < 50) return { name: "Prudent 🌿", color: "#84cc16", desc: "Tu veux faire croître ton argent sans prendre trop de risques." };
  if (score < 75) return { name: "Équilibré ⚖️", color: "#3b82f6", desc: "Tu cherches un juste équilibre entre rendement et stabilité." };
  if (score < 90) return { name: "Dynamique 🚀", color: "#a855f7", desc: "Tu es à l'aise avec la volatilité pour viser un rendement plus fort." };
  return { name: "Audacieux 🔥", color: "#ef4444", desc: "Tu assumes pleinement le risque pour viser la performance maximale." };
}

export function allocationForScore(score: number) {
  const equities = Math.min(90, 20 + 0.7 * score);
  const bonds = Math.max(5, 70 - 0.6 * score);
  const cash = Math.max(0, 10 - 0.1 * score);
  const alt = Math.max(0, (score - 70) * 0.4);
  const total = equities + bonds + cash + alt;
  const k = 100 / total;
  return {
    "Actions": Math.round(equities * k),
    "Obligations": Math.round(bonds * k),
    "Alternatifs": Math.round(alt * k),
    "Liquidités": Math.round(cash * k)
  };
}
