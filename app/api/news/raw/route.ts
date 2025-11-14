import { NextRequest, NextResponse } from 'next/server';
import { listRecentArticles } from '@/lib/news/store';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') || '50');
  const items = await listRecentArticles(limit);
  return NextResponse.json({ items, count: items.length, generatedAt: new Date().toISOString() });
}
