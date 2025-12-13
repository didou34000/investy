export function futureValueAnnuity(
  monthly: number,
  years: number,
  annualRatePct: number
): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  const fv = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r);
  return fv;
}

// --- Simulation simple avec réinvestissement optionnel ---
export type SimulationParams = {
  montantInitial: number;    // ex: 1000
  mensualite: number;        // ex: 200
  horizonYears: number;      // 1–30
  tauxAnnuel: number;        // ex: 0.06 pour 6%
  reinvest: boolean;
};

export type SimulationResult = {
  valeurFinale: number;
};

export function simulateInvestment(params: SimulationParams): SimulationResult {
  const { montantInitial, mensualite, horizonYears, tauxAnnuel, reinvest } = params;
  const n = Math.max(0, Math.floor(horizonYears));

  // Cas trivial
  if (n === 0 || tauxAnnuel === 0) {
    const totalSansInterets = montantInitial + mensualite * 12 * n;
    return { valeurFinale: totalSansInterets };
  }

  const r = tauxAnnuel;

  const valeurInitiale = montantInitial * Math.pow(1 + r, n);

  let valeurMensualites: number;
  if (reinvest) {
    const mois = n * 12;
    const rm = Math.pow(1 + r, 1 / 12) - 1;
    valeurMensualites = mensualite * ((Math.pow(1 + rm, mois) - 1) / rm);
  } else {
    valeurMensualites = mensualite * 12 * n;
  }

  return { valeurFinale: valeurInitiale + valeurMensualites };
}



