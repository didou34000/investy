import { AffectedAsset } from './schema';
import { getReliability } from './sourcesReliability';

/**
 * Calcul du score d'importance d'une analyse
 * Formule: ceil(clamp(5 * (0.40*llmImpactMax + 0.20*reliability + 0.15*novelty + 0.15*breadth + 0.10*recency), 0, 1))
 */

/**
 * Calcule le score d'impact maximum du LLM
 * @param affectedAssets - Liste des actifs affectés
 * @returns Score entre 0 et 1
 */
function calculateLLMImpactMax(affectedAssets: AffectedAsset[]): number {
  if (!affectedAssets.length) return 0;
  
  const maxImpact = Math.max(...affectedAssets.map(asset => asset.impact));
  return maxImpact / 5; // Normalise de 1-5 vers 0-1
}

/**
 * Calcule le score de nouveauté basé sur la similarité avec les analyses récentes
 * @param topicKey - Clé du topic actuel
 * @param recentTopics - Liste des topics récents (dernières 200 analyses)
 * @returns Score entre 0 et 1 (1 = très nouveau)
 */
function calculateNovelty(topicKey: string, recentTopics: string[]): number {
  if (!recentTopics.length) return 1; // Premier article = nouveauté maximale
  
  // Pour MVP, on utilise une approche simple basée sur la similarité de chaînes
  const similarity = recentTopics.some(topic => {
    const similarity = calculateStringSimilarity(topicKey, topic);
    return similarity > 0.8; // Seuil de similarité élevée
  });
  
  return similarity ? 0.2 : 0.8; // Score binaire pour MVP
}

/**
 * Calcule la similarité entre deux chaînes (algorithme simple)
 * @param str1 - Première chaîne
 * @param str2 - Deuxième chaîne
 * @returns Score de similarité entre 0 et 1
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Calcule la distance de Levenshtein entre deux chaînes
 * @param str1 - Première chaîne
 * @param str2 - Deuxième chaîne
 * @returns Distance de Levenshtein
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Calcule le score de largeur basé sur le nombre d'actifs uniques
 * @param affectedAssets - Liste des actifs affectés
 * @returns Score entre 0 et 1
 */
function calculateBreadth(affectedAssets: AffectedAsset[]): number {
  const uniqueAssetsCount = new Set(affectedAssets.map(asset => asset.symbol)).size;
  return Math.min(1, uniqueAssetsCount / 4); // Normalise avec max 4 actifs
}

/**
 * Calcule le score de récence basé sur l'âge de l'article
 * @param publishedAt - Date de publication ISO
 * @returns Score entre 0 et 1 (1 = très récent)
 */
function calculateRecency(publishedAt: string): number {
  const now = new Date().getTime();
  const published = new Date(publishedAt).getTime();
  const deltaHours = (now - published) / (1000 * 60 * 60);
  
  // Décroissance exponentielle avec demi-vie de 48h
  return Math.exp(-deltaHours / 48);
}

/**
 * Calcule le score d'importance global d'une analyse
 * @param params - Paramètres pour le calcul
 * @returns Score d'importance entre 1 et 5
 */
export function calculateImportance(params: {
  affectedAssets: AffectedAsset[];
  sourceId: string;
  topicKey: string;
  recentTopics: string[];
  publishedAt: string;
}): number {
  const { affectedAssets, sourceId, topicKey, recentTopics, publishedAt } = params;
  
  // Calcul des composants
  const llmImpactMax = calculateLLMImpactMax(affectedAssets);
  const reliability = getReliability(sourceId);
  const novelty = calculateNovelty(topicKey, recentTopics);
  const breadth = calculateBreadth(affectedAssets);
  const recency = calculateRecency(publishedAt);
  
  // Formule pondérée
  const weightedScore = (
    0.40 * llmImpactMax +
    0.20 * reliability +
    0.15 * novelty +
    0.15 * breadth +
    0.10 * recency
  );
  
  // Clamp entre 0 et 1, puis scale vers 1-5
  const clampedScore = Math.max(0, Math.min(1, weightedScore));
  const importance = Math.ceil(5 * clampedScore);
  
  return Math.max(1, Math.min(5, importance));
}

/**
 * Génère une clé de topic basée sur le ticker principal et un hash du contenu
 * @param primaryTicker - Ticker principal
 * @param title - Titre de l'article
 * @param snippet - Extrait de l'article
 * @returns Clé de topic unique
 */
export function generateTopicKey(primaryTicker: string, title: string, snippet: string): string {
  const content = `${title} ${snippet}`.toLowerCase();
  
  // Hash simple basé sur les caractères
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertit en 32-bit integer
  }
  
  // Prend les 8 bits de poids faible
  const hash8bit = Math.abs(hash) & 0xFF;
  
  return `${primaryTicker}_${hash8bit}`;
}

/**
 * Calcule la confiance globale d'une analyse
 * @param affectedAssets - Liste des actifs affectés
 * @param sourceId - ID de la source
 * @returns Score de confiance entre 0 et 1
 */
export function calculateConfidence(affectedAssets: AffectedAsset[], sourceId: string): number {
  if (!affectedAssets.length) return 0.3; // Faible confiance sans actifs
  
  // Moyenne des confidences des actifs pondérée par la fiabilité de la source
  const avgAssetConfidence = affectedAssets.reduce((sum, asset) => sum + asset.confidence, 0) / affectedAssets.length;
  const sourceReliability = getReliability(sourceId);
  
  // Moyenne pondérée
  return (avgAssetConfidence * 0.7 + sourceReliability * 0.3);
}
