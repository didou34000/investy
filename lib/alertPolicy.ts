export type ProfileThresholds = { eq: number; crypto: number; fx: number };

export function thresholdsFor(profile: string): ProfileThresholds {
  if (profile === "Prudent") return { eq: 3, crypto: 6, fx: 0.6 };
  if (profile === "Équilibré") return { eq: 5, crypto: 8, fx: 0.8 };
  if (profile === "Dynamique") return { eq: 8, crypto: 10, fx: 1.0 };
  return { eq: 12, crypto: 12, fx: 1.2 }; // Agressif
}

/** 
 * Calcule si une variation déclenche une alerte, en tenant compte de l'override par actif 
 */
export function hit(
  change1dAbs: number | null, 
  cat: "equity" | "etf" | "index" | "crypto" | "fx", 
  profileTh: ProfileThresholds, 
  overridePct: number | null
): boolean {
  if (change1dAbs == null) return false;
  
  const base = (cat === "crypto") ? profileTh.crypto : (cat === "fx" ? profileTh.fx : profileTh.eq);
  const th = overridePct ?? base;
  
  return Math.abs(change1dAbs) >= th;
}

/**
 * Détermine la catégorie d'un actif basée sur son type
 */
export function getCategory(category: string): "equity" | "etf" | "index" | "crypto" | "fx" {
  if (category === "crypto") return "crypto";
  if (category === "fx" || category === "forex") return "fx";
  if (category === "etf") return "etf";
  if (category === "index") return "index";
  return "equity"; // par défaut
}

/**
 * Génère un message d'alerte basé sur la catégorie et la variation
 */
export function generateAlertMessage(
  symbol: string, 
  category: string, 
  change1d: number | null, 
  change5d: number | null
): string {
  const isPositive = change1d != null && change1d > 0;
  const direction = isPositive ? "hausse" : "baisse";
  const magnitude = change1d != null ? Math.abs(change1d).toFixed(1) : "0";
  
  if (category === "crypto") {
    return `Crypto ${direction} de ${magnitude}%`;
  } else if (category === "fx") {
    return `Devise ${direction} de ${magnitude}%`;
  } else if (category === "etf") {
    return `ETF ${direction} de ${magnitude}%`;
  } else if (category === "index") {
    return `Indice ${direction} de ${magnitude}%`;
  } else {
    return `Action ${direction} de ${magnitude}%`;
  }
}
