'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IArticle } from '@/types/interfaces/article.interface';
import ArticlePage from '@/components/Blog/ArticlePage';

export default function BlogArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/articles/${id}`);
        if (!response.ok) throw new Error('Failed to fetch article');
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError('Erreur lors du chargement de l\'article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [params]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fefff3',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '18px',
        color: '#06104a'
      }}>
        Chargement de l'article...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fefff3',
        fontFamily: 'Montserrat, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ 
          color: '#06104a', 
          fontSize: '2rem', 
          marginBottom: '16px' 
        }}>
          {error || 'Article non trouvé'}
        </h1>
        <Link 
          href="/blog" 
          style={{
            color: '#3ec28f',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          ← Retour aux articles
        </Link>
      </div>
    );
  }

  return <ArticlePage article={article} />;
}
