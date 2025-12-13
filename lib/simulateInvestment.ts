export type SimInput = {
  initial: number;
  monthly: number;
  years: number;
  annualReturn: number; // in %
};

export function simulateInvestment({ initial, monthly, years, annualReturn }: SimInput) {
  const r = annualReturn / 100;
  let balance = initial;
  const monthlyRate = r / 12;
  const months = Math.max(1, Math.round(years * 12));

  for (let i = 0; i < months; i++) {
    balance = balance * (1 + monthlyRate) + monthly;
  }

  return Math.round(balance);
}

