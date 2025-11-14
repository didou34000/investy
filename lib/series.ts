export type Point = { t: number; v: number };

export function simulateGBM(
  months = 120,
  start = 100,
  annualMu = 0.06,
  annualSigma = 0.15,
  seed?: number
): Point[] {
  let s = seed ?? Math.floor(Math.random() * 1e9);
  const randn = () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    const u1 = ((s >>> 0) / 4294967296) || 1e-9;
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    const u2 = ((s >>> 0) / 4294967296) || 1e-9;
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  const muM = annualMu / 12;
  const sigmaM = annualSigma / Math.sqrt(12);
  const out: Point[] = [{ t: 0, v: start }];
  let p = start;
  for (let i = 1; i <= months; i++) {
    const z = randn();
    const ret = (muM - 0.5 * sigmaM * sigmaM) + sigmaM * z;
    p = Math.max(1, p * Math.exp(ret));
    out.push({ t: i, v: p });
  }
  return out;
}

export function computeCAGR(series: Point[], years = 10): number {
  if (series.length < 2) return 0;
  const start = series[0].v;
  const end = series[series.length - 1].v;
  return Math.pow(end / start, 1 / years) - 1;
}

export function computeMaxDrawdown(series: Point[]): number {
  let peak = series[0].v;
  let mdd = 0;
  for (const p of series) {
    peak = Math.max(peak, p.v);
    const dd = (p.v - peak) / peak;
    mdd = Math.min(mdd, dd);
  }
  return mdd;
}
