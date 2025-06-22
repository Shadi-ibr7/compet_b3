"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import ArticleForm from '@/components/articles/ArticleForm';
import type { IArticle } from '@/types/interfaces/article.interface';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [article, setArticle] = useState<IArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
      return;
    }

    if (session?.user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${id}`,);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError('Erreur lors du chargement de l\'article');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, session, status, router]);

  const handleSubmit = async (articleData: Partial<IArticle>) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour de l\'article');
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Erreur lors de la mise à jour:', err);
      throw new Error('Erreur lors de la mise à jour de l\'article');
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-[#FEFFF3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-[#06104A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#06104A]">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Article non trouvé
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFFF3]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center text-[#06104A] hover:text-[#23306a] transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au dashboard
          </button>
          <h1 className="text-3xl font-bold text-[#06104A]">
            Modifier l'article
          </h1>
          <p className="text-gray-600 mt-2">
            {article.title}
          </p>
        </div>

        {/* Form */}
        <ArticleForm 
          initialData={article} 
          onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
}
