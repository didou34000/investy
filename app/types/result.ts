export type Badge = { label: string; tone: "neutral" | "positive" | "warning" };

export type Allocation = {
  cash: number;
  bonds: number;
  equities_core: number;
  equities_tilts: number;
  crypto: number;
};

export type Profile = {
  code: string;
  label: string;
  subtitle: string;
  badges: Badge[];
  warnings: string[];
  riskIndex: number;
  expectedReturn: number;
  expectedVol: number;
  allocation: Allocation;
};

export type Result = Profile;


