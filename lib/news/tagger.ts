import { Tag } from "@/types/news";

export function tagContent(text: string): Tag[] {
  const lower = text.toLowerCase();
  const tags: Set<Tag> = new Set();

  // Crypto
  if (/\b(bitcoin|btc|ethereum|eth|crypto|defi|stablecoin|solana|cardano|xrp|ada|sol|matic|polygon|avalanche|bnb)\b/i.test(lower)) {
    tags.add('crypto');
  }

  // Actions
  if (/\b(earnings|guidance|dividend|rally|plunge|share|stock|buyback|ipo|nvidia|apple|tesla|microsoft|google|amazon|meta|netflix|amd|intel|qualcomm)\b/i.test(lower)) {
    tags.add('actions');
  }

  // ETF
  if (/\b(etf|ucits|tracking error|indice|replication|spy|qqq|vanguard|spdr)\b/i.test(lower)) {
    tags.add('etf');
  }

  // Obligations
  if (/\b(bond|treasury|t-note|oat|bund|yield|coupon|spread|duration|sovereign)\b/i.test(lower)) {
    tags.add('obligations');
  }

  // Macro
  if (/\b(inflation|cpi|pce|jobs|fed|bce|ecb|central bank|ism|gdp|pmi|recession|expansion)\b/i.test(lower)) {
    tags.add('macro');
  }

  // Résultats
  if (/\b(earnings|q1|q2|q3|q4|eps|revenue|chiffre d'affaires|croissance)\b/i.test(lower)) {
    tags.add('resultats');
  }

  // IA
  if (/\b(ai|artificial intelligence|chip|semiconductor|npu|gpu|chatgpt|llm|machine learning)\b/i.test(lower)) {
    tags.add('ia');
  }

  // Énergie
  if (/\b(oil|opec|wti|brent|gas|petrole|gaz|crude|nuclear|nucléaire)\b/i.test(lower)) {
    tags.add('energie');
  }

  // Banques
  if (/\b(bank|bâle|capital ratio|cet1|banking|lender)\b/i.test(lower)) {
    tags.add('banques');
  }

  return Array.from(tags);
}

