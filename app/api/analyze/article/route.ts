import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { 
  AnalyzeArticleRequestSchema, 
  AnalyseLLMSchema,
  AnalysisSchema 
} from '@/lib/analyses/schema';
import { extractArticleMetadata } from '@/lib/analyses/extract';
import { buildClassifierPrompt, buildAnalyzePrompt, cleanLLMResponse, CLASSIFIER_OPTIONS, ANALYZER_OPTIONS } from '@/lib/analyses/prompts';
import { calculateImportance, generateTopicKey, calculateConfidence } from '@/lib/analyses/scoring';
import { getAnalysisByArticleId, saveAnalysis, getRecentTopics } from '@/lib/analyses/store';
import crypto from 'node:crypto';

export const revalidate = 0;

// Initialisation OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyse un article individuel
 */
export async function POST(req: NextRequest) {
  try {
    // Validation de la requête
    const body = await req.json();
    const { article } = AnalyzeArticleRequestSchema.parse(body);
    
    // Vérifier si déjà analysé
    const existing = await getAnalysisByArticleId(article.id);
    if (existing) {
      return NextResponse.json({ skipped: true, analysisId: existing.id });
    }
    
    // Extraction des métadonnées
    const metadata = extractArticleMetadata({
      title: article.title,
      snippet: article.snippet,
      publishedAt: article.publishedAt,
      sourceName: article.sourceName,
      sourceUrl: article.url,
    });
    
    // Préparation des données pour le LLM
    const articleForLLM = {
      title: metadata.cleanedTitle,
      snippet: metadata.cleanedSnippet,
      publishedAt: article.publishedAt,
      sourceName: article.sourceName,
      sourceUrl: article.url,
      detectedTickers: metadata.detectedTickers,
      categoryHints: metadata.categoryHints,
    };
    
    let isRelevant = false;
    let llmAnalysis: any = null;
    
    // Classification de pertinence
    if (process.env.USE_LLM_CLASSIFY === 'true') {
      try {
        const classifierPrompt = buildClassifierPrompt(articleForLLM);
        const classifierResponse = await openai.chat.completions.create({
          ...CLASSIFIER_OPTIONS,
          messages: [{ role: 'user', content: classifierPrompt }],
        });
        
        const classifierResult = JSON.parse(
          cleanLLMResponse(classifierResponse.choices[0]?.message?.content || '{}')
        );
        
        isRelevant = classifierResult.relevant === true;
      } catch (error) {
        console.warn('Erreur classification LLM:', error);
        // Fallback heuristique
        isRelevant = metadata.cleanedSnippet.length >= 180 && 
                    (/\d+%|\$|\€|prix|volume|bénéfice|chiffre/i.test(metadata.cleanedSnippet));
      }
    } else {
      // Heuristique simple
      isRelevant = metadata.cleanedSnippet.length >= 180 && 
                  (/\d+%|\$|\€|prix|volume|bénéfice|chiffre/i.test(metadata.cleanedSnippet));
    }
    
    if (!isRelevant) {
      return NextResponse.json({ discarded: true, reason: 'Article non pertinent' });
    }
    
    // Analyse LLM
    if (process.env.USE_LLM_ANALYZE === 'true') {
      try {
        const analyzePrompt = buildAnalyzePrompt(articleForLLM);
        const analyzeResponse = await openai.chat.completions.create({
          ...ANALYZER_OPTIONS,
          messages: [{ role: 'user', content: analyzePrompt }],
        });
        
        const rawAnalysis = cleanLLMResponse(analyzeResponse.choices[0]?.message?.content || '{}');
        llmAnalysis = AnalyseLLMSchema.parse(JSON.parse(rawAnalysis));
        
        if (!llmAnalysis.relevant) {
          return NextResponse.json({ discarded: true, reason: llmAnalysis.reason });
        }
      } catch (error) {
        console.warn('Erreur analyse LLM:', error);
        // Fallback stub
        llmAnalysis = {
          relevant: true,
          reason: 'Analyse automatique',
          primaryTopic: metadata.categoryHints[0] || 'Marchés financiers',
          affectedAssets: [],
          macroTags: metadata.categoryHints,
          notes: metadata.cleanedSnippet.slice(0, 200) + '...',
          sources: [article.sourceName],
        };
      }
    } else {
      // Stub minimal
      llmAnalysis = {
        relevant: true,
        reason: 'Analyse automatique',
        primaryTopic: metadata.categoryHints[0] || 'Marchés financiers',
        affectedAssets: [],
        macroTags: metadata.categoryHints,
        notes: metadata.cleanedSnippet.slice(0, 200) + '...',
        sources: [article.sourceName],
      };
    }
    
    // Génération de la clé de topic
    const primaryTicker = metadata.detectedTickers[0] || 'GENERAL';
    const topicKey = generateTopicKey(primaryTicker, article.title, article.snippet);
    
    // Calcul de l'importance
    const recentTopics = await getRecentTopics(200);
    const importance = calculateImportance({
      affectedAssets: llmAnalysis.affectedAssets,
      sourceId: article.sourceId,
      topicKey,
      recentTopics,
      publishedAt: article.publishedAt,
    });
    
    // Calcul de la confiance
    const confidence = calculateConfidence(llmAnalysis.affectedAssets, article.sourceId);
    
    // Création de l'analyse finale
    const analysis = AnalysisSchema.parse({
      id: crypto.randomUUID(),
      articleId: article.id,
      publishedAt: article.publishedAt,
      sourceId: article.sourceId,
      sourceName: article.sourceName,
      sourceUrl: article.url,
      title: article.title,
      tickers: metadata.detectedTickers,
      categories: metadata.categoryHints,
      summary: llmAnalysis.notes,
      affectedAssets: llmAnalysis.affectedAssets,
      importance,
      confidence,
      primaryTopic: llmAnalysis.primaryTopic,
      macroTags: llmAnalysis.macroTags,
      topicKey,
      sources: llmAnalysis.sources,
      createdAt: new Date().toISOString(),
    });
    
    // Sauvegarde
    await saveAnalysis(analysis);
    
    return NextResponse.json({ 
      ok: true, 
      analysisId: analysis.id,
      importance,
      confidence,
      topicKey,
    });
    
  } catch (error) {
    console.error('Erreur analyse article:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse' },
      { status: 500 }
    );
  }
}
