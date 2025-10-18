export type ProfileKey = "prudent" | "equilibre" | "dynamique";

export type ProfileOutput = {
  profile: ProfileKey;
  score: number;
  allocation: Record<string, number>;
  rationale: string;
};

export type Profile = {
  key: ProfileKey;
  title: string;
  desc: string;
  alloc: { stocks: number; bonds: number; cash: number; alternatives?: number };
  expReturn: number;
  expVol: number;
  color: string;
};

export function getAllProfiles(): Profile[] {
  return [
    { key: "prudent", title: "Prudent", desc: "Stabilité d'abord, ouverture mesurée", alloc: { stocks: 25, bonds: 55, cash: 15, alternatives: 5 }, expReturn: 3.5, expVol: 5, color: "bg-blue-600" },
    { key: "equilibre", title: "Équilibré", desc: "Compromis risque/rendement", alloc: { stocks: 50, bonds: 35, cash: 10, alternatives: 5 }, expReturn: 5.5, expVol: 10, color: "bg-green-600" },
    { key: "dynamique", title: "Dynamique", desc: "Recherche de performance long terme", alloc: { stocks: 80, bonds: 15, cash: 0, alternatives: 5 }, expReturn: 7.5, expVol: 16, color: "bg-yellow-600" },
  ];
}

export function scoreQuiz(input: { answers: Array<{ q: string; value: number }> }): ProfileOutput {
  const total = input.answers.reduce((acc, cur) => acc + cur.value, 0);
  const avg = total / input.answers.length;

  let profile: ProfileKey = "equilibre";
  if (avg < 2) profile = "prudent";
  if (avg > 3.5) profile = "dynamique";

  const rationaleMap: Record<ProfileKey, string> = {
    prudent: "Vous privilégiez la stabilité et la sécurité du capital. Objectif : préserver la valeur dans le temps.",
    equilibre: "Vous cherchez un équilibre entre rendement et risque, avec une approche diversifiée et mesurée.",
    dynamique: "Vous acceptez la volatilité pour viser un rendement plus élevé sur le long terme."
  };

  const allocations: Record<ProfileKey, Record<string, number>> = {
    prudent: {
      "Obligations": 60,
      "Actions": 25,
      "ETF Monde": 10,
      "Liquidités": 5
    },
    equilibre: {
      "Actions": 45,
      "ETF Monde": 35,
      "Obligations": 15,
      "Liquidités": 5
    },
    dynamique: {
      "Actions": 65,
      "ETF Monde": 25,
      "Obligations": 5,
      "Crypto/Alternatifs": 5
    }
  };

  return {
    profile,
    score: Math.round(avg * 20),
    allocation: allocations[profile],
    rationale: rationaleMap[profile]
  };
}