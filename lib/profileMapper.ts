import type { Output } from "@/lib/profileEnginePro";

export type Badge = { label: string; tone: "neutral" | "positive" | "warning" };
export type Allocation = {
  cash: number;
  bonds: number;
  equities_core: number;
  equities_tilts: number;
  crypto: number;
};

export type Profile = {
  code: string; // P0..P7
  label: string;
  subtitle: string;
  badges: Badge[];
  warnings: string[];
  riskIndex: number;
  expectedReturn: number;
  expectedVol: number;
  allocation: Allocation;
  monthly?: number;
};

function clamp(x: number, a = 0, b = 100) { return Math.max(a, Math.min(b, x)); }

function toAllocation(raw: Record<string, number>): Allocation {
  return {
    cash: clamp(raw["Liquidités"] ?? 0),
    bonds: clamp(raw["Obligations"] ?? 0),
    equities_core: clamp(raw["Actions Monde"] ?? 0),
    equities_tilts: clamp(raw["Alternatifs"] ?? 0),
    crypto: clamp(raw["Crypto"] ?? 0),
  };
}

function codeFromRisk(risk: number): string {
  if (risk <= 15) return "P0";
  if (risk <= 25) return "P1";
  if (risk <= 35) return "P2";
  if (risk <= 50) return "P3";
  if (risk <= 65) return "P4";
  if (risk <= 75) return "P5";
  if (risk <= 85) return "P6";
  return "P7";
}

function labelFor(code: string) {
  switch (code) {
    case "P0": return { label: "Ultra prudent", subtitle: "Capital avant tout" };
    case "P1": return { label: "Prudent", subtitle: "Stabilité prioritaire" };
    case "P2": return { label: "Modéré", subtitle: "Progression sereine" };
    case "P3": return { label: "Équilibré", subtitle: "Risque mesuré" };
    case "P4": return { label: "Dynamique", subtitle: "Croissance long terme" };
    case "P5": return { label: "Agressif", subtitle: "Tolérance élevée" };
    case "P6": return { label: "Très offensif", subtitle: "Volatilité acceptée" };
    default: return { label: "Spéculatif", subtitle: "Très variable" };
  }
}

export function mapToProfile(answers: Record<string, any>, out: Output): Profile {
  const risk = clamp(out.riskIndex);
  const code = codeFromRisk(risk);
  const names = labelFor(code);

  const badges: Badge[] = [];
  const warnings: string[] = [];

  // Badges simples
  if (answers.reinvest === "true") badges.push({ label: "Réinvestissement activé", tone: "positive" });
  if (answers.follow_intensity === "1") badges.push({ label: "Suivi passif", tone: "neutral" });
  if (answers.asset_interest === "ETF Monde") badges.push({ label: "Diversification cœur", tone: "positive" });

  // Warnings basiques
  if (String(answers.horizon_years || "").startsWith("1-3")) warnings.push("Horizon court: limitez la part actions.");
  if (answers.reaction_drop === "1") warnings.push("Réaction défensive: privilégiez la stabilité.");

  // Conflit objectif/risque
  const wantsHighReturn = (answers.pref_return === "12%" || answers.pref_return === "8%");
  if (wantsHighReturn && risk < 35) warnings.push("Objectif élevé mais profil prudent: ajustez progressivement.");

  return {
    code,
    label: names.label,
    subtitle: names.subtitle,
    badges,
    warnings,
    riskIndex: risk,
    expectedReturn: out.expectedReturn,
    expectedVol: out.expectedVol,
    allocation: toAllocation(out.allocation),
    monthly: Number(answers.monthly_investment || 0) || undefined,
  };
}


