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



