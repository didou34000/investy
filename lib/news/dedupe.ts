import { distance as levenshtein } from 'fastest-levenshtein';
import { RawArticle } from './utils';

export function simTitle(a: string, b: string): number {
  if (!a || !b) return 0;
  const maxLen = Math.max(a.length, b.length);
  if (!maxLen) return 0;
  const dist = levenshtein(a.toLowerCase(), b.toLowerCase());
  return 1 - (dist / maxLen); // 1 = identique
}

export function sameHost(aUrl: string, bUrl: string): boolean {
  try {
    return new URL(aUrl).host === new URL(bUrl).host;
  } catch { return false; }
}

export function isDuplicate(candidate: RawArticle, existing: RawArticle): boolean {
  if (!sameHost(candidate.url, existing.url)) return false;
  // Fenêtre 48h
  const dtA = new Date(candidate.publishedAt).getTime();
  const dtB = new Date(existing.publishedAt).getTime();
  const within48h = Math.abs(dtA - dtB) <= 48 * 3600 * 1000;
  if (!within48h) return false;

  const s = simTitle(candidate.title, existing.title);
  return s >= 0.9; // seuil simple
}
