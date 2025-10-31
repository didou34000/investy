import { NextRequest, NextResponse } from 'next/server';
import { AnalysisQuerySchema } from '@/lib/analyses/schema';
import { listAnalyses } from '@/lib/analyses/store';

export const revalidate = 0;

/**
 * Récupère les analyses avec filtres et pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Validation des paramètres de requête
    const query = AnalysisQuerySchema.parse({
      period: searchParams.get('period') || 'today',
      minImportance: searchParams.get('minImportance') ? parseInt(searchParams.get('minImportance')!) : undefined,
      categories: searchParams.get('categories') || undefined,
      tickers: searchParams.get('tickers') || undefined,
      q: searchParams.get('q') || undefined,
      cursor: searchParams.get('cursor') || undefined,
    });
    
    // Limite par défaut
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Récupération des analyses
    const result = await listAnalyses({
      ...query,
      limit,
    });
    
    return NextResponse.json({
      items: result.items,
      nextCursor: result.nextCursor,
      total: result.total,
      query: {
        period: query.period,
        minImportance: query.minImportance,
        categories: query.categories,
        tickers: query.tickers,
        q: query.q,
        limit,
      },
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Erreur récupération analyses:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des analyses',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
