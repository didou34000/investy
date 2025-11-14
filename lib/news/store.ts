import { RawArticle } from './utils';
import { isDuplicate } from './dedupe';
import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_FILE = path.join(process.cwd(), '.data', 'articles_raw.json');

let memory: RawArticle[] | null = null;
let lock = Promise.resolve(); // mutex simple

async function ensureFile() {
  try { await fs.access(DATA_FILE); }
  catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

export async function loadAll(): Promise<RawArticle[]> {
  if (memory) return memory;
  await ensureFile();
  const txt = await fs.readFile(DATA_FILE, 'utf8');
  memory = JSON.parse(txt) as RawArticle[];
  return memory!;
}

async function persist(): Promise<void> {
  if (!memory) return;
  await fs.writeFile(DATA_FILE, JSON.stringify(memory, null, 2), 'utf8');
}

export async function saveArticleIfNew(article: RawArticle): Promise<boolean> {
  await (lock = lock.then(async () => {
    const all = await loadAll();
    // déjà présent par id ?
    if (all.some(a => a.id === article.id)) return false;

    // check doublon par titre vs derniers 1000 du même host
    const recent = all.slice(-1000).reverse();
    for (const ex of recent) {
      if (isDuplicate(article, ex)) {
        return false;
      }
    }
    all.push(article);
    memory = all;
    await persist();
    return true;
  }));
  // @ts-expect-error retourner la valeur du block interne nativement est compliqué, on re-lit
  // (simple pour MVP)
  const allNow = await loadAll();
  return !!allNow.find(a => a.id === article.id);
}

export async function listRecentArticles(limit = 50): Promise<RawArticle[]> {
  const all = await loadAll();
  return all.sort((a,b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, limit);
}

export async function countToday(): Promise<number> {
  const start = new Date(); start.setUTCHours(0,0,0,0);
  const all = await loadAll();
  return all.filter(a => new Date(a.publishedAt) >= start).length;
}
