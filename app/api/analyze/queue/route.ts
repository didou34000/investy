import { NextResponse } from 'next/server';
import { getAnalysisByArticleId } from '@/lib/analyses/store';

export const revalidate = 0;

/**
 * Traite une queue d'articles pour analyse
 */
export async function POST() {
  try {
    const batchSize = parseInt(process.env.ANALYSIS_BATCH || '25');
    
    // Récupérer les articles récents
    const newsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'}/api/news/raw?limit=${batchSize * 3}`);
    if (!newsResponse.ok) {
      throw new Error('Erreur récupération articles');
    }
    
    const newsData = await newsResponse.json();
    const articles = newsData.items || [];
    
    // Filtrer les articles déjà analysés
    const unanalyzedArticles = [];
    for (const article of articles) {
      const existing = await getAnalysisByArticleId(article.id);
      if (!existing) {
        unanalyzedArticles.push(article);
      }
    }
    
    // Prendre les plus récents jusqu'à la limite du batch
    const articlesToAnalyze = unanalyzedArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, batchSize);
    
    if (articlesToAnalyze.length === 0) {
      return NextResponse.json({
        queued: 0,
        analyzed: 0,
        discarded: 0,
        message: 'Aucun nouvel article à analyser',
      });
    }
    
    // Analyser en parallèle avec limite de concurrence
    const { default: pLimit } = await import('p-limit');
    const limit = pLimit(3); // Max 3 analyses simultanées
    
    const analysisPromises = articlesToAnalyze.map(article => 
      limit(async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'}/api/analyze/article`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ article }),
          });
          
          const result = await response.json();
          
          if (result.skipped) {
            return { status: 'skipped' };
          } else if (result.discarded) {
            return { status: 'discarded', reason: result.reason };
          } else if (result.ok) {
            return { 
              status: 'analyzed', 
              analysisId: result.analysisId,
              importance: result.importance,
              confidence: result.confidence,
            };
          } else {
            return { status: 'error', error: result.error };
          }
        } catch (error) {
          console.error('Erreur analyse article:', article.id, error);
          return { status: 'error', error: error.message };
        }
      })
    );
    
    const results = await Promise.all(analysisPromises);
    
    // Compter les résultats
    const stats = results.reduce((acc, result) => {
      if (result.status === 'analyzed') {
        acc.analyzed++;
      } else if (result.status === 'discarded') {
        acc.discarded++;
      } else if (result.status === 'skipped') {
        acc.skipped++;
      } else {
        acc.errors++;
      }
      return acc;
    }, {
      queued: articlesToAnalyze.length,
      analyzed: 0,
      discarded: 0,
      skipped: 0,
      errors: 0,
    });
    
    // Log des statistiques
    console.log(`Queue analysis completed:`, {
      queued: stats.queued,
      analyzed: stats.analyzed,
      discarded: stats.discarded,
      skipped: stats.skipped,
      errors: stats.errors,
    });
    
    return NextResponse.json({
      queued: stats.queued,
      analyzed: stats.analyzed,
      discarded: stats.discarded,
      skipped: stats.skipped,
      errors: stats.errors,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Erreur queue analysis:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors du traitement de la queue',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
