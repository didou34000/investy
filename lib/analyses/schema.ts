import { z } from 'zod';

// Types pour l'entrée LLM
export const ArticleForLLMSchema = z.object({
  title: z.string(),
  snippet: z.string(),
  publishedAt: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string(),
  detectedTickers: z.array(z.string()),
  categoryHints: z.array(z.string()),
});

export type ArticleForLLM = z.infer<typeof ArticleForLLMSchema>;

// Types pour les actifs affectés
export const AffectedAssetSchema = z.object({
  symbol: z.string(),
  assetType: z.enum(['equity', 'crypto', 'etf', 'index', 'bond', 'fx']),
  direction: z.enum(['up', 'down', 'unclear']),
  impact: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  horizon: z.enum(['intraday', 'swing', 'long']),
  confidence: z.number().min(0).max(1),
});

export type AffectedAsset = z.infer<typeof AffectedAssetSchema>;

// Type pour la réponse LLM
export const AnalyseLLMSchema = z.object({
  relevant: z.boolean(),
  reason: z.string(),
  primaryTopic: z.string(),
  affectedAssets: z.array(AffectedAssetSchema),
  macroTags: z.array(z.string()),
  notes: z.string(),
  sources: z.array(z.string()),
});

export type AnalyseLLM = z.infer<typeof AnalyseLLMSchema>;

// Type final pour l'analyse stockée
export const AnalysisSchema = z.object({
  id: z.string(),
  articleId: z.string(),
  publishedAt: z.string(),
  sourceId: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string(),
  title: z.string(),
  tickers: z.array(z.string()),
  categories: z.array(z.string()),
  summary: z.string(),
  affectedAssets: z.array(AffectedAssetSchema),
  importance: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  confidence: z.number().min(0).max(1),
  primaryTopic: z.string(),
  macroTags: z.array(z.string()),
  topicKey: z.string(),
  sources: z.array(z.string()),
  createdAt: z.string(),
});

export type Analysis = z.infer<typeof AnalysisSchema>;

// Types pour les requêtes API
export const AnalysisQuerySchema = z.object({
  period: z.enum(['today', 'week', 'month', 'all']).optional(),
  minImportance: z.number().min(1).max(5).optional(),
  categories: z.string().optional(),
  tickers: z.string().optional(),
  q: z.string().optional(),
  cursor: z.string().optional(),
});

export type AnalysisQuery = z.infer<typeof AnalysisQuerySchema>;

// Types pour les réponses API
export const AnalysisResponseSchema = z.object({
  items: z.array(AnalysisSchema),
  nextCursor: z.string().optional(),
  total: z.number().optional(),
});

export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

export const AnalyzeArticleRequestSchema = z.object({
  article: z.object({
    id: z.string(),
    url: z.string(),
    title: z.string(),
    snippet: z.string(),
    publishedAt: z.string(),
    sourceId: z.string(),
    sourceName: z.string(),
    langOriginal: z.enum(['fr', 'en']),
    image: z.string().nullable().optional(),
    createdAt: z.string(),
  }),
});

export type AnalyzeArticleRequest = z.infer<typeof AnalyzeArticleRequestSchema>;

export const AnalyzeQueueResponseSchema = z.object({
  queued: z.number(),
  analyzed: z.number(),
  discarded: z.number(),
});

export type AnalyzeQueueResponse = z.infer<typeof AnalyzeQueueResponseSchema>;
