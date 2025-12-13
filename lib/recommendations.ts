import { assetsCatalog, type Asset, type RiskBucket } from "./assetsCatalog";
import type { InvestyProfileResult } from "./profileMapper";

const codeToBuckets: Record<string, RiskBucket[]> = {
  P0: ["ultra_prudent", "prudent"],
  P1: ["ultra_prudent", "prudent"],
  P2: ["prudent", "modere"],
  P3: ["modere", "equilibre", "dynamique"],
  P4: ["modere", "equilibre", "dynamique"],
  P5: ["dynamique", "agressif"],
  P6: ["dynamique", "agressif"],
  P7: ["agressif", "speculatif"],
};

const bucketRank: Record<RiskBucket, number> = {
  ultra_prudent: 0,
  prudent: 1,
  modere: 2,
  equilibre: 3,
  dynamique: 4,
  agressif: 5,
  speculatif: 6,
};

function allowBucket(bucket: RiskBucket, allowed: RiskBucket[]) {
  return allowed.some((b) => bucketRank[bucket] <= bucketRank[b]);
}

function filterSupport(asset: Asset, support?: string | null) {
  if (!support) return true;
  const s = support.toLowerCase();
  if (s.includes("pea")) return asset.peaEligible;
  if (s.includes("cto")) return asset.ctoEligible;
  return true;
}

export function getAssetRecommendations(profile: InvestyProfileResult | string, supportHint: string | null) {
  const code =
    typeof profile === "string"
      ? profile.toUpperCase()
      : typeof profile.code === "string"
        ? profile.code.toUpperCase()
        : "P3";
  const allowedBuckets = codeToBuckets[code] ?? codeToBuckets["P3"];

  const filtered = assetsCatalog.filter((a) => allowBucket(a.riskBucket, allowedBuckets) && filterSupport(a, supportHint));

  const typesOrder: Asset["type"][] = ["etf", "action", "crypto"];
  const sorted = filtered.sort((a, b) => {
    const typeRank = typesOrder.indexOf(a.type) - typesOrder.indexOf(b.type);
    if (typeRank !== 0) return typeRank;
    return bucketRank[a.riskBucket] - bucketRank[b.riskBucket];
  });

  return sorted.slice(0, 8);
}

// STEP 2 OK - getAssetRecommendations operational

