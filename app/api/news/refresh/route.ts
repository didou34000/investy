import { NextResponse } from 'next/server';
import { NEWS_SOURCES } from '@/lib/news/sources';
import { fetchAllRSS } from '@/lib/news/fetch';
import { saveArticleIfNew, countToday } from '@/lib/news/store';

export const revalidate = 0; // toujours frais (cron)

export async function GET() {
  const items = await fetchAllRSS(NEWS_SOURCES);
  let added = 0;

  for (const it of items) {
    const ok = await saveArticleIfNew(it);
    if (ok) added++;
  }

  const totalToday = await countToday();
  return NextResponse.json({
    added, totalToday, lastRefreshAt: new Date().toISOString()
  });
}
