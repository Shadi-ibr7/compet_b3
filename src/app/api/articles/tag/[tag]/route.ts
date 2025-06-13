import { NextRequest, NextResponse } from 'next/server';
import { getArticlesByTag } from '@/lib/articles';

export async function GET(
  request: NextRequest,
  { params }: { params: { tag: string } }
) {
  try {
    const articles = await getArticlesByTag(params.tag);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles by tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles by tag' },
      { status: 500 }
    );
  }
}
