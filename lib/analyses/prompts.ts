import { ArticleForLLM } from './schema';

/**
 * Prompts pour l'analyse LLM des articles financiers
 */

/**
 * Construit le prompt pour classifier la pertinence d'un article
 * @param input - Données de l'article pour l'analyse
 * @returns Prompt formaté pour OpenAI
 */
export function buildClassifierPrompt(input: ArticleForLLM): string {
  return `Tu es un analyste financier expert. Analyse cet article et détermine s'il est pertinent pour les investisseurs.

ARTICLE À ANALYSER:
Titre: ${input.title}
Source: ${input.sourceName}
Date: ${input.publishedAt}
Extrait: ${input.snippet}
Tickers détectés: ${input.detectedTickers.join(', ') || 'Aucun'}
Catégories suggérées: ${input.categoryHints.join(', ') || 'Aucune'}

CRITÈRES DE PERTINENCE:
- Contient des informations factuelles sur les marchés financiers
- Mentionne des entreprises, indices, crypto-monnaies ou instruments financiers
- Apporte des données quantitatives (prix, volumes, ratios, etc.)
- Traite de développements économiques ou réglementaires importants
- Évite les articles purement spéculatifs ou d'opinion

RÉPONDS EXCLUSIVEMENT EN JSON:
{
  "relevant": boolean,
  "reason": "explication courte de ta décision"
}

Si l'information est insuffisante ou l'article n'est pas pertinent financièrement, mets "relevant": false.`;
}

/**
 * Construit le prompt pour analyser l'impact marché d'un article
 * @param input - Données de l'article pour l'analyse
 * @returns Prompt formaté pour OpenAI
 */
export function buildAnalyzePrompt(input: ArticleForLLM): string {
  return `Tu es un analyste financier expert. Analyse cet article et évalue son impact potentiel sur les marchés.

ARTICLE À ANALYSER:
Titre: ${input.title}
Source: ${input.sourceName}
Date: ${input.publishedAt}
Extrait: ${input.snippet}
Tickers détectés: ${input.detectedTickers.join(', ') || 'Aucun'}
Catégories suggérées: ${input.categoryHints.join(', ') || 'Aucune'}

INSTRUCTIONS:
1. Identifie les actifs financiers mentionnés (actions, crypto, ETF, indices, obligations, devises)
2. Évalue l'impact potentiel sur chaque actif (1=faible, 5=très fort)
3. Détermine la direction probable (up/down/unclear)
4. Estime l'horizon temporel (intraday/swing/long)
5. Évalue ta confiance dans cette analyse (0-1)
6. Identifie le sujet principal et les tags macro-économiques

RÉPONDS EXCLUSIVEMENT EN JSON CONFORME À CE SCHÉMA:
{
  "relevant": boolean,
  "reason": "explication courte",
  "primaryTopic": "sujet principal en quelques mots",
  "affectedAssets": [
    {
      "symbol": "SYMBOL",
      "assetType": "equity|crypto|etf|index|bond|fx",
      "direction": "up|down|unclear",
      "impact": 1-5,
      "horizon": "intraday|swing|long",
      "confidence": 0.0-1.0
    }
  ],
  "macroTags": ["tag1", "tag2"],
  "notes": "résumé de l'analyse en 2-3 phrases",
  "sources": ["source1", "source2"]
}

RÈGLES IMPORTANTES:
- Base-toi UNIQUEMENT sur le texte fourni
- Pas de spéculation ou d'informations inventées
- Si l'information est insuffisante → "relevant": false
- Sois précis et factuel
- Évite les conseils d'investissement`;
}

/**
 * Configuration OpenAI pour les appels API
 */
export const OPENAI_CONFIG = {
  model: 'gpt-4o-mini', // Modèle économique
  temperature: 0.1, // Faible créativité pour plus de précision
  max_tokens: 1000,
  timeout: 10000, // 10 secondes
  retries: 1,
};

/**
 * Options pour les appels de classification
 */
export const CLASSIFIER_OPTIONS = {
  ...OPENAI_CONFIG,
  response_format: { type: 'json_object' },
};

/**
 * Options pour les appels d'analyse
 */
export const ANALYZER_OPTIONS = {
  ...OPENAI_CONFIG,
  response_format: { type: 'json_object' },
};

/**
 * Valide si une réponse LLM est valide
 * @param response - Réponse du LLM
 * @param expectedFields - Champs attendus
 * @returns true si la réponse est valide
 */
export function validateLLMResponse(response: any, expectedFields: string[]): boolean {
  if (!response || typeof response !== 'object') return false;
  
  return expectedFields.every(field => field in response);
}

/**
 * Nettoie une réponse LLM en supprimant les caractères indésirables
 * @param response - Réponse brute du LLM
 * @returns Réponse nettoyée
 */
export function cleanLLMResponse(response: string): string {
  if (!response) return '';
  
  return response
    .replace(/```json\n?/g, '') // Supprime les blocs de code
    .replace(/```\n?/g, '')
    .replace(/^\s*[\r\n]/gm, '') // Supprime les lignes vides
    .trim();
}
