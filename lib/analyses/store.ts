import { Analysis, AnalysisQuery } from './schema';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const DATA_FILE = path.join(process.cwd(), '.data', 'analyses.json');

let memory: Analysis[] | null = null;
let lock = Promise.resolve(); // mutex simple

/**
 * S'assure que le fichier de données existe
 */
async function ensureFile() {
  try { 
    await fs.access(DATA_FILE); 
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

/**
 * Charge toutes les analyses depuis le fichier
 */
export async function loadAll(): Promise<Analysis[]> {
  if (memory) return memory;
  await ensureFile();
  const txt = await fs.readFile(DATA_FILE, 'utf8');
  memory = JSON.parse(txt) as Analysis[];
  return memory!;
}

/**
 * Sauvegarde les analyses en mémoire vers le fichier
 */
async function persist(): Promise<void> {
  if (!memory) return;
  await fs.writeFile(DATA_FILE, JSON.stringify(memory, null, 2), 'utf8');
}

/**
 * Sauvegarde une analyse (merge si même topicKey)
 */
export async function saveAnalysis(analysis: Analysis): Promise<void> {
  await (lock = lock.then(async () => {
    const all = await loadAll();
    
    // Cherche une analyse existante avec le même topicKey
    const existingIndex = all.findIndex(a => a.topicKey === analysis.topicKey);
    
    if (existingIndex >= 0) {
      // Merge: garde l'importance max et agrège les sources
      const existing = all[existingIndex];
      const merged: Analysis = {
        ...analysis,
        importance: Math.max(existing.importance, analysis.importance),
        sources: [...new Set([...existing.sources, ...analysis.sources])],
        createdAt: existing.createdAt, // Garde la date de création originale
      };
      all[existingIndex] = merged;
    } else {
      // Nouvelle analyse
      all.push(analysis);
    }
    
    memory = all;
    await persist();
  }));
}

/**
 * Récupère une analyse par ID d'article
 */
export async function getAnalysisByArticleId(articleId: string): Promise<Analysis | null> {
  const all = await loadAll();
  return all.find(a => a.articleId === articleId) || null;
}

/**
 * Liste les analyses avec filtres et pagination
 */
export async function listAnalyses(params: AnalysisQuery & {
  limit?: number;
  cursor?: string;
}): Promise<{ items: Analysis[]; nextCursor?: string; total: number }> {
  const all = await loadAll();
  let filtered = [...all];
  
  // Filtre par période
  if (params.period && params.period !== 'all') {
    const now = new Date();
    const cutoff = new Date();
    
    switch (params.period) {
      case 'today':
        cutoff.setUTCHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoff.setDate(cutoff.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(cutoff.getMonth() - 1);
        break;
    }
    
    filtered = filtered.filter(a => new Date(a.publishedAt) >= cutoff);
  }
  
  // Filtre par importance minimum
  if (params.minImportance) {
    filtered = filtered.filter(a => a.importance >= params.minImportance);
  }
  
  // Filtre par catégories
  if (params.categories) {
    const categories = params.categories.split(',').map(c => c.trim());
    filtered = filtered.filter(a => 
      categories.some(cat => a.categories.includes(cat))
    );
  }
  
  // Filtre par tickers
  if (params.tickers) {
    const tickers = params.tickers.split(',').map(t => t.trim().toUpperCase());
    filtered = filtered.filter(a => 
      tickers.some(ticker => a.tickers.includes(ticker))
    );
  }
  
  // Filtre par recherche textuelle
  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(query) ||
      a.summary.toLowerCase().includes(query) ||
      a.primaryTopic.toLowerCase().includes(query)
    );
  }
  
  // Tri par importance décroissante puis par date
  filtered.sort((a, b) => {
    if (a.importance !== b.importance) {
      return b.importance - a.importance;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  
  // Pagination avec cursor
  const limit = params.limit || 20;
  let startIndex = 0;
  
  if (params.cursor) {
    const cursorIndex = filtered.findIndex(a => a.id === params.cursor);
    if (cursorIndex >= 0) {
      startIndex = cursorIndex + 1;
    }
  }
  
  const items = filtered.slice(startIndex, startIndex + limit);
  const nextCursor = filtered.length > startIndex + limit ? items[items.length - 1]?.id : undefined;
  
  return {
    items,
    nextCursor,
    total: filtered.length,
  };
}

/**
 * Met à jour ou insère un topic
 */
export async function upsertTopic(topicKey: string, data: Partial<Analysis>): Promise<void> {
  await (lock = lock.then(async () => {
    const all = await loadAll();
    const existingIndex = all.findIndex(a => a.topicKey === topicKey);
    
    if (existingIndex >= 0) {
      // Mise à jour
      all[existingIndex] = { ...all[existingIndex], ...data };
    } else {
      // Création (nécessite un ID)
      const newAnalysis: Analysis = {
        id: crypto.randomUUID(),
        articleId: data.articleId || '',
        publishedAt: data.publishedAt || new Date().toISOString(),
        sourceId: data.sourceId || '',
        sourceName: data.sourceName || '',
        sourceUrl: data.sourceUrl || '',
        title: data.title || '',
        tickers: data.tickers || [],
        categories: data.categories || [],
        summary: data.summary || '',
        affectedAssets: data.affectedAssets || [],
        importance: data.importance || 1,
        confidence: data.confidence || 0.5,
        primaryTopic: data.primaryTopic || '',
        macroTags: data.macroTags || [],
        topicKey,
        sources: data.sources || [],
        createdAt: new Date().toISOString(),
        ...data,
      };
      all.push(newAnalysis);
    }
    
    memory = all;
    await persist();
  }));
}

/**
 * Compte les analyses d'aujourd'hui
 */
export async function countToday(): Promise<number> {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const all = await loadAll();
  return all.filter(a => new Date(a.publishedAt) >= start).length;
}

/**
 * Obtient les topics récents pour le calcul de nouveauté
 */
export async function getRecentTopics(limit: number = 200): Promise<string[]> {
  const all = await loadAll();
  return all
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
    .map(a => a.topicKey);
}
