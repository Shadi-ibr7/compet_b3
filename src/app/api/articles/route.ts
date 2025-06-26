import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles, createArticle } from '@/lib/articles';
import { IArticle } from '@/types/interfaces/article.interface';
import { securityMiddleware } from '@/lib/middleware/security';

export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return securityMiddleware(
    request,
    async (req: NextRequest, sanitizedBody?: Record<string, unknown>) => {
      try {
        // Validate required fields
        if (!sanitizedBody?.title || !sanitizedBody?.auteur || !sanitizedBody?.date || !sanitizedBody?.meta) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }

        const article = await createArticle(sanitizedBody as Omit<IArticle, 'id'>);
        return NextResponse.json(article, { status: 201 });
      } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json(
          { error: 'Failed to create article' },
          { status: 500 }
        );
      }
    },
    {
      requireAuth: true,
      allowedRoles: ['admin'],
      variant: 'full' // Articles peuvent avoir plus de formatage
    }
  );
}
