/**
 * Fiabilité des sources de nouvelles financières
 * Score de 0.0 à 1.0 basé sur la réputation et la qualité éditoriale
 */

export const SOURCE_RELIABILITY: Record<string, number> = {
  // Sources anglaises - haute réputation
  'ft': 1.0,           // Financial Times - référence mondiale
  'wsj': 0.95,         // Wall Street Journal - très fiable
  'cnbc': 0.95,        // CNBC - source TV/internet reconnue
  
  // Sources françaises - bonne réputation
  'lesechos': 0.9,     // Les Échos - référence française
  'lemonde': 0.9,      // Le Monde Éco - journal de référence
  
  // Sources spécialisées - fiables dans leur domaine
  'coindesk': 0.85,    // CoinDesk - crypto spécialisé
  'boursorama': 0.85,  // Boursorama - finance grand public
  'zonebourse': 0.85,  // ZoneBourse - analyses techniques
  
  // Sources généralistes - correctes mais moins spécialisées
  'bfmeco': 0.8,       // BFM Économie - TV généraliste
};

/**
 * Obtient le score de fiabilité d'une source
 * @param sourceId - Identifiant de la source
 * @returns Score de fiabilité entre 0.0 et 1.0 (défaut: 0.75)
 */
export function getReliability(sourceId: string): number {
  return SOURCE_RELIABILITY[sourceId] ?? 0.75;
}

/**
 * Vérifie si une source est considérée comme fiable
 * @param sourceId - Identifiant de la source
 * @param threshold - Seuil de fiabilité (défaut: 0.8)
 * @returns true si la source est fiable
 */
export function isReliableSource(sourceId: string, threshold: number = 0.8): boolean {
  return getReliability(sourceId) >= threshold;
}

/**
 * Obtient toutes les sources avec leur score de fiabilité
 * @returns Objet avec sourceId -> score
 */
export function getAllReliabilityScores(): Record<string, number> {
  return { ...SOURCE_RELIABILITY };
}

/**
 * Obtient les sources les plus fiables
 * @param threshold - Seuil minimum (défaut: 0.85)
 * @returns Liste des sources fiables
 */
export function getReliableSources(threshold: number = 0.85): string[] {
  return Object.entries(SOURCE_RELIABILITY)
    .filter(([_, score]) => score >= threshold)
    .map(([sourceId, _]) => sourceId);
}
